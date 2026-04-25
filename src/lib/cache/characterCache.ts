import { AxisScores, RenAICode } from '@/types/diagnosis';

const cache = new Map<string, string>();
const MAX_ENTRIES = 500;

type QuantizedLevel = 'n' | 'm' | 'p';

function quantize(score: number): QuantizedLevel {
  if (score < -0.2) return 'n';
  if (score > 0.2) return 'p';
  return 'm';
}

export function buildCacheKey(code: RenAICode, axes: AxisScores): string {
  const lf = quantize(axes.LF);
  const ps = quantize(axes.PS);
  const wa = quantize(axes.WA);
  const ie = quantize(axes.IE);
  return `${code}:${lf}${ps}${wa}${ie}`;
}

export function getCached(key: string): string | undefined {
  return cache.get(key);
}

export function setCached(key: string, dataUrl: string): void {
  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, dataUrl);
}
