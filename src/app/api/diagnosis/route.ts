import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@google/genai';
import {
  GEMINI_MODEL,
  classifyGeminiError,
  getGeminiClient,
  withGeminiRetry,
} from '@/lib/gemini';
import { calculateAxisScores, codeFromAxes } from '@/lib/utils/scoring';
import { buildDiagnosisPrompt } from '@/lib/prompts/diagnosisPrompt';
import { koigokoroTypes } from '@/data/types/koigokoroTypes';
import { AxisAnswers, DiagnosisResult, LikertValue } from '@/types/diagnosis';

type RateLimitEntry = { count: number; resetAt: number };
const ipRateLimit = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

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
  const entry = ipRateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
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

function isLikertValue(v: unknown): v is LikertValue {
  return v === 1 || v === 2 || v === 3 || v === 4 || v === 5;
}

function parseAnswers(input: unknown): AxisAnswers | null {
  if (!input || typeof input !== 'object') return null;
  const out: AxisAnswers = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const id = Number(key);
    if (!Number.isFinite(id)) return null;
    if (!isLikertValue(value)) return null;
    out[id] = value;
  }
  return out;
}

const SYSTEM_INSTRUCTION =
  'あなたは恋愛心理学に詳しい優しいカウンセラーです。出力は必ず指定された JSON 形式のみで返します。';

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    advice: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['summary', 'advice'],
} as const;

export async function POST(request: NextRequest) {
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
    const body = (await request.json()) as { answers?: unknown };
    const answers = parseAnswers(body.answers);
    if (!answers) {
      return NextResponse.json(
        { success: false, error: '回答データが不正です' },
        { status: 400 }
      );
    }

    const axes = calculateAxisScores(answers);
    const code = codeFromAxes(axes);
    const type = koigokoroTypes[code];

    const prompt = buildDiagnosisPrompt(code, axes);

    const ai = getGeminiClient();
    const response = await withGeminiRetry(() =>
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.7,
        },
      })
    );

    const content = response.text;
    if (!content) {
      throw new Error('AI 分析結果が空です');
    }

    const parsed = JSON.parse(content) as { summary?: string; advice?: unknown };
    const summary =
      typeof parsed.summary === 'string' && parsed.summary.length > 0
        ? parsed.summary
        : type.desc;
    const advice = Array.isArray(parsed.advice)
      ? parsed.advice.filter((a): a is string => typeof a === 'string')
      : [];

    const result: DiagnosisResult = {
      version: 2,
      code,
      name: type.name,
      emoji: type.emoji,
      axes,
      summary,
      advice,
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Diagnosis API error:', error);
    const classified = classifyGeminiError(error);

    if (classified.isAuth) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini APIキーが無効です。管理者にお問い合わせください。',
          ...(process.env.NODE_ENV !== 'production'
            ? { detail: 'Invalid API key. Check .env.local and restart dev server.' }
            : {}),
        },
        { status: 401 }
      );
    }

    if (classified.isRateLimit) {
      console.error(
        '[diagnosis] Gemini RateLimit after retries:',
        classified.status
      );
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
        error: '診断処理中にエラーが発生しました',
        ...(process.env.NODE_ENV !== 'production'
          ? { detail: classified.message }
          : {}),
      },
      { status: 500 }
    );
  }
}
