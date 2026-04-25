import { NextRequest, NextResponse } from 'next/server';
import {
  GEMINI_IMAGE_MODEL,
  Modality,
  classifyGeminiError,
  getGeminiClient,
  withGeminiRetry,
} from '@/lib/gemini';
import { buildCharacterPrompt } from '@/lib/prompts/characterPrompt';
import {
  buildCacheKey,
  getCached,
  setCached,
} from '@/lib/cache/characterCache';
import { AxisScores, RenAICode } from '@/types/diagnosis';

type RateLimitEntry = { count: number; resetAt: number };
const charRateLimit = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

const VALID_CODES: ReadonlySet<string> = new Set([
  'LPWI', 'LPWE', 'LPAI', 'LPAE',
  'LSWI', 'LSWE', 'LSAI', 'LSAE',
  'FPWI', 'FPWE', 'FPAI', 'FPAE',
  'FSWI', 'FSWE', 'FSAI', 'FSAE',
]);

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  return realIp || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = charRateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    charRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function parseAxis(raw: string | null): number | null {
  if (raw === null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  if (n < -1 || n > 1) return null;
  return n;
}

function parseQuery(
  searchParams: URLSearchParams
): { code: RenAICode; axes: AxisScores } | null {
  const code = searchParams.get('code');
  if (!code || !VALID_CODES.has(code)) return null;

  const lf = parseAxis(searchParams.get('lf'));
  const ps = parseAxis(searchParams.get('ps'));
  const wa = parseAxis(searchParams.get('wa'));
  const ie = parseAxis(searchParams.get('ie'));
  if (lf === null || ps === null || wa === null || ie === null) return null;

  return {
    code: code as RenAICode,
    axes: { LF: lf, PS: ps, WA: wa, IE: ie },
  };
}

function extractInlineImage(
  response: unknown
): { data: string; mimeType: string } | null {
  const candidates = (response as {
    candidates?: ReadonlyArray<{
      content?: { parts?: ReadonlyArray<Record<string, unknown>> };
    }>;
  }).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  const parts = candidates[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;

  for (const part of parts) {
    const inlineData = part['inlineData'] as
      | { data?: string; mimeType?: string }
      | undefined;
    if (
      inlineData &&
      typeof inlineData.data === 'string' &&
      typeof inlineData.mimeType === 'string'
    ) {
      return { data: inlineData.data, mimeType: inlineData.mimeType };
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const parsed = parseQuery(request.nextUrl.searchParams);
  if (!parsed) {
    return NextResponse.json(
      { success: false, error: 'パラメータが不正です' },
      { status: 400 }
    );
  }

  const { code, axes } = parsed;
  const cacheKey = buildCacheKey(code, axes);
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(
      { success: true, imageDataUrl: cached, cacheHit: true },
      {
        headers: {
          'Cache-Control':
            'public, max-age=86400, stale-while-revalidate=604800',
        },
      }
    );
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `リクエストが多すぎます。${limit.retryAfter}秒後に再度お試しください。`,
        retryAfter: limit.retryAfter,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfter) },
      }
    );
  }

  try {
    const prompt = buildCharacterPrompt(code, axes);
    const ai = getGeminiClient();
    const response = await withGeminiRetry(() =>
      ai.models.generateContent({
        model: GEMINI_IMAGE_MODEL,
        contents: prompt,
        config: {
          responseModalities: [Modality.IMAGE],
        },
      })
    );

    const image = extractInlineImage(response);
    if (!image) {
      throw new Error('画像データが取得できませんでした');
    }

    const imageDataUrl = `data:${image.mimeType};base64,${image.data}`;
    setCached(cacheKey, imageDataUrl);

    return NextResponse.json(
      { success: true, imageDataUrl, cacheHit: false },
      {
        headers: {
          'Cache-Control':
            'public, max-age=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (error) {
    console.error('Character API error:', error);
    const classified = classifyGeminiError(error);

    if (classified.isAuth) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini APIキーが無効です',
          ...(process.env.NODE_ENV !== 'production'
            ? { detail: classified.message }
            : {}),
        },
        { status: 401 }
      );
    }

    if (classified.isRateLimit) {
      const retryAfter =
        classified.retryAfterMs > 0
          ? Math.ceil(classified.retryAfterMs / 1000)
          : 60;
      return NextResponse.json(
        {
          success: false,
          error: `しばらく時間をおいて再度お試しください。(${retryAfter}秒後)`,
          retryAfter,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) },
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '画像生成中にエラーが発生しました',
        ...(process.env.NODE_ENV !== 'production'
          ? { detail: classified.message }
          : {}),
      },
      { status: 500 }
    );
  }
}
