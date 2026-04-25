import OpenAI from 'openai';

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set. Please set it in .env.local');
  }

  if (!apiKey.startsWith('sk-')) {
    throw new Error(
      'OPENAI_API_KEY format is invalid. It must start with "sk-". Please check .env.local'
    );
  }

  return new OpenAI({ apiKey });
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const RETRY_BASE_DELAY_MS = 1000;
const RETRY_MAX_DELAY_MS = 30_000;

function readRetryAfterHeader(headers: unknown): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) {
    return headers.get('retry-after') ?? undefined;
  }
  const record = headers as Record<string, string | undefined>;
  return record['retry-after'];
}

function getRetryAfterMs(error: InstanceType<typeof OpenAI.RateLimitError>): number {
  const headerValue = readRetryAfterHeader(error.headers);
  const seconds = Number(headerValue);
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 0;
}

export async function withOpenAIRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      if (!(error instanceof OpenAI.RateLimitError)) {
        throw error;
      }

      if (attempt === maxRetries) {
        break;
      }

      const retryAfterMs = getRetryAfterMs(error);
      const backoff = Math.min(
        RETRY_BASE_DELAY_MS * 2 ** attempt,
        RETRY_MAX_DELAY_MS
      );
      const jitter = Math.random() * 500;
      const delay = Math.min(
        Math.max(retryAfterMs, backoff) + jitter,
        RETRY_MAX_DELAY_MS
      );

      console.error(
        `[openai-retry] attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms`,
        error.code
      );

      await sleep(delay);
    }
  }

  throw lastError;
}
