'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { DiagnosisResult, KoigokoroCode } from '@/types/diagnosis';
import { koigokoroTypeList } from '@/data/types/koigokoroTypes';
import { isKoigokoroCode } from '@/lib/utils/compatibility';

const RESULT_STORAGE_KEY = 'diagnosisResult';
const COMPATIBILITY_STORAGE_KEY = 'compatibilityRequest';

function ChevronLeftIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5l-5 5 5 5" />
    </svg>
  );
}

function HeartIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" className={className} aria-hidden>
      <path d="M7 12.5C7 12.5 1 9 1 5C1 3 2.5 1.5 4.5 1.5C5.7 1.5 6.6 2.2 7 3C7.4 2.2 8.3 1.5 9.5 1.5C11.5 1.5 13 3 13 5C13 9 7 12.5 7 12.5Z" />
    </svg>
  );
}

function parseStoredResult(raw: string | null): DiagnosisResult | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      (parsed as { version: unknown }).version === 2
    ) {
      return parsed as DiagnosisResult;
    }
    return null;
  } catch {
    return null;
  }
}

let cachedResultRaw: string | null = null;
let cachedResult: DiagnosisResult | null = null;

function getResultSnapshot(): DiagnosisResult | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(RESULT_STORAGE_KEY);
  if (raw === cachedResultRaw) return cachedResult;
  cachedResultRaw = raw;
  cachedResult = parseStoredResult(raw);
  return cachedResult;
}

function getServerResultSnapshot(): DiagnosisResult | null {
  return null;
}

function subscribeResult(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === null || e.key === RESULT_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('storage', handler);
  };
}

export default function CompatibilityPage() {
  const router = useRouter();
  const self = useSyncExternalStore(
    subscribeResult,
    getResultSnapshot,
    getServerResultSnapshot
  );
  const hydrated = typeof window !== 'undefined';
  const [otherCode, setOtherCode] = useState<KoigokoroCode | null>(null);

  const sortedTypes = useMemo(() => koigokoroTypeList, []);

  const canSubmit = !!self && !!otherCode;

  const handleSubmit = () => {
    if (!canSubmit) return;
    try {
      window.localStorage.setItem(
        COMPATIBILITY_STORAGE_KEY,
        JSON.stringify({ selfCode: self.code, otherCode })
      );
    } catch {
      // ignore
    }
    router.push('/compatibility/result');
  };

  return (
    <main className="min-h-screen bg-[var(--koi-bg)] text-[var(--koi-ink)]">
      <header className="sticky top-0 z-20 bg-[var(--koi-bg)]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4 sm:px-7">
          <Link
            href={self ? '/diagnosis/result' : '/'}
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
            aria-label="戻る"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <span className="font-mono text-[11px] tracking-[0.22em] text-[var(--koi-ink-soft)]">
            COMPATIBILITY
          </span>
          <span className="w-9" aria-hidden />
        </div>
      </header>

      <section className="mx-auto w-full max-w-2xl px-5 pb-16 sm:px-7">
        <div className="pt-2">
          <div className="font-mono text-[10px] tracking-[0.28em] text-[var(--koi-ink-muted)]">
            16 × 16
          </div>
          <h1 className="font-serif-jp mt-2 text-[26px] font-medium leading-[1.3] tracking-[-0.005em] sm:text-[32px]">
            ふたりの恋ごころ、
            <br />
            重ねてみませんか
          </h1>
          <p className="mt-3 max-w-md text-[13px] leading-[1.85] text-[var(--koi-ink-soft)]">
            自分のタイプと、気になる人のタイプを選ぶと、4 つの軸からふたりの相性をやさしく読み解きます。
          </p>
        </div>

        {/* Self */}
        <article className="mt-8 rounded-3xl bg-[var(--koi-bg-card)] p-6 shadow-[0_2px_8px_var(--koi-line)] sm:p-7">
          <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-primary-deep)]">
            01 · あなた
          </div>
          {!hydrated ? (
            <div className="mt-4 h-12 animate-pulse rounded-2xl bg-[var(--koi-bg-soft)]" />
          ) : self ? (
            <div className="mt-4 flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--koi-bg)] text-[26px]"
                aria-hidden
              >
                {self.emoji}
              </div>
              <div className="flex-1">
                <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
                  {self.code}
                </div>
                <div className="font-serif-jp mt-0.5 text-[18px] font-medium">
                  {self.name}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-[13px] leading-[1.8] text-[var(--koi-ink-soft)]">
                まず、あなた自身の診断を受けてください。
              </p>
              <Link
                href="/diagnosis/start"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-[22px] bg-[var(--koi-ink)] px-6 text-[13px] font-semibold text-white"
              >
                診断をはじめる
              </Link>
            </div>
          )}
        </article>

        {/* Other type picker */}
        {self && (
          <article className="mt-5 rounded-3xl bg-[var(--koi-bg-card)] p-6 shadow-[0_2px_8px_var(--koi-line)] sm:p-7">
            <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-primary-deep)]">
              02 · 気になる人
            </div>
            <h2 className="font-serif-jp mt-1.5 text-[16px] font-medium">
              相手のタイプを選んでください
            </h2>
            <p className="mt-1 text-[11px] text-[var(--koi-ink-soft)]">
              相手にも診断を受けてもらうのが一番ですが、予想で選んでも OK
            </p>

            <div
              role="radiogroup"
              aria-label="相手のタイプ"
              className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3"
            >
              {sortedTypes.map((type) => {
                const isSelected = otherCode === type.code;
                return (
                  <button
                    key={type.code}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      if (isKoigokoroCode(type.code)) {
                        setOtherCode(type.code);
                      }
                    }}
                    className="relative overflow-hidden rounded-2xl px-3 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--koi-primary-deep)]"
                    style={{
                      background: isSelected
                        ? 'var(--koi-primary-soft)'
                        : 'var(--koi-bg)',
                      border: isSelected
                        ? '1.5px solid var(--koi-primary-deep)'
                        : '1.5px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[20px]" aria-hidden>
                        {type.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[9px] tracking-[0.18em] text-[var(--koi-ink-muted)]">
                          {type.code}
                        </div>
                        <div className="font-serif-jp truncate text-[12px] font-medium">
                          {type.name}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        )}

        {/* Submit */}
        {self && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-[28px] bg-[var(--koi-ink)] text-[14px] font-semibold tracking-[0.04em] text-white shadow-[0_8px_20px_var(--koi-primary-soft)] transition-all disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HeartIcon className="h-3.5 w-3.5" />
            相性を診断する
          </button>
        )}
      </section>
    </main>
  );
}
