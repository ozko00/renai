import { GoogleGenAI, ApiError } from '@google/genai';

export const GEMINI_MODEL = 'gemini-2.5-flash-lite';

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please set it in .env.local');
  }

  return new GoogleGenAI({ apiKey });
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const RETRY_BASE_DELAY_MS = 1000;
const RETRY_MAX_DELAY_MS = 30_000;

export interface GeminiRetryError {
  isRateLimit: boolean;
  isAuth: boolean;
  retryAfterMs: number;
  status?: number;
  message: string;
}

export function classifyGeminiError(error: unknown): GeminiRetryError {
  if (error instanceof ApiError) {
    const status = error.status;
    const isRateLimit = status === 429;
    const isAuth = status === 401 || status === 403;
    const retryAfterMs = readRetryAfterFromApiError(error);
    return {
      isRateLimit,
      isAuth,
      retryAfterMs,
      status,
      message: error.message,
    };
  }
  const message = error instanceof Error ? error.message : 'unknown error';
  return {
    isRateLimit: false,
    isAuth: false,
    retryAfterMs: 0,
    message,
  };
}

function readRetryAfterFromApiError(error: ApiError): number {
  // Gemini ApiError は details に retryDelay (e.g. "30s") を入れる場合がある
  const detailsRecord = (error as unknown as {
    errorDetails?: ReadonlyArray<Record<string, unknown>>;
  }).errorDetails;
  if (Array.isArray(detailsRecord)) {
    for (const detail of detailsRecord) {
      const retryDelay = detail['retryDelay'];
      if (typeof retryDelay === 'string') {
        const match = retryDelay.match(/^(\d+(?:\.\d+)?)s$/);
        if (match) {
          return Math.ceil(Number(match[1]) * 1000);
        }
      }
    }
  }
  return 0;
}

export async function withGeminiRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      const classified = classifyGeminiError(error);

      if (!classified.isRateLimit) {
        throw error;
      }

      if (attempt === maxRetries) {
        break;
      }

      const backoff = Math.min(
        RETRY_BASE_DELAY_MS * 2 ** attempt,
        RETRY_MAX_DELAY_MS
      );
      const jitter = Math.random() * 500;
      const delay = Math.min(
        Math.max(classified.retryAfterMs, backoff) + jitter,
        RETRY_MAX_DELAY_MS
      );

      console.error(
        `[gemini-retry] attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms`,
        classified.status
      );

      await sleep(delay);
    }
  }

  throw lastError;
}
