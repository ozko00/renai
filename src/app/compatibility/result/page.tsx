'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type {
  CompatibilityResult,
  RenAICode,
} from '@/types/diagnosis';
import { renAITypes } from '@/data/types/renAITypes';
import {
  calculateCompatibility,
  isRenAICode,
} from '@/lib/utils/compatibility';
import { useHydrated } from '@/lib/hooks/useHydrated';

const COMPATIBILITY_STORAGE_KEY = 'compatibilityRequest';

interface StoredRequest {
  selfCode: RenAICode;
  otherCode: RenAICode;
}

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

function parseRequest(raw: string | null): StoredRequest | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const obj = parsed as Record<string, unknown>;
    if (!isRenAICode(obj.selfCode) || !isRenAICode(obj.otherCode)) {
      return null;
    }
    return { selfCode: obj.selfCode, otherCode: obj.otherCode };
  } catch {
    return null;
  }
}

let cachedRaw: string | null = null;
let cachedRequest: StoredRequest | null = null;

function getRequestSnapshot(): StoredRequest | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(COMPATIBILITY_STORAGE_KEY);
  if (raw === cachedRaw) return cachedRequest;
  cachedRaw = raw;
  cachedRequest = parseRequest(raw);
  return cachedRequest;
}

function getServerRequestSnapshot(): StoredRequest | null {
  return null;
}

function subscribeRequest(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === null || e.key === COMPATIBILITY_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('storage', handler);
  };
}

export default function CompatibilityResultPage() {
  const router = useRouter();
  const storedRequest = useSyncExternalStore(
    subscribeRequest,
    getRequestSnapshot,
    getServerRequestSnapshot
  );

  const hydrated = useHydrated();
  // SSR/初回ハイドレートはローディング表示で揃え、マウント後に実値を見せる
  const request = hydrated ? storedRequest : null;

  useEffect(() => {
    if (hydrated && !request) {
      router.replace('/compatibility');
    }
  }, [hydrated, request, router]);

  const result = useMemo<CompatibilityResult | null>(() => {
    if (!request) return null;
    return calculateCompatibility(request.selfCode, request.otherCode);
  }, [request]);

  if (!hydrated || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--koi-bg)]">
        <div className="text-center">
          <div
            className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[var(--koi-primary-soft)] border-t-[var(--koi-primary-deep)]"
            aria-hidden
          />
          <p className="font-serif-jp text-[14px] text-[var(--koi-ink-soft)]">
            読み解いています…
          </p>
        </div>
      </div>
    );
  }

  const selfType = renAITypes[result.selfCode];
  const otherType = renAITypes[result.otherCode];

  return (
    <main className="min-h-screen bg-[var(--koi-bg-soft)] text-[var(--koi-ink)]">
      <header className="sticky top-0 z-20 bg-[var(--koi-bg-soft)]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4 sm:px-7">
          <Link
            href="/compatibility"
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
            aria-label="戻る"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <span className="font-mono text-[11px] tracking-[0.22em] text-[var(--koi-ink-soft)]">
            COMPATIBILITY · RESULT
          </span>
          <span className="w-9" aria-hidden />
        </div>
      </header>

      <section className="mx-auto w-full max-w-2xl px-5 pb-16 sm:px-7">
        {/* Score hero */}
        <article
          className="relative mt-4 overflow-hidden rounded-[28px] p-7 shadow-[0_4px_24px_var(--koi-line)] sm:p-9"
          style={{
            background:
              'linear-gradient(180deg, var(--koi-bg-card) 0%, var(--koi-bg-soft) 100%)',
          }}
        >
          <div
            className="absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-40 blur-3xl"
            style={{ background: selfType.tone }}
            aria-hidden
          />
          <div
            className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full opacity-40 blur-3xl"
            style={{ background: otherType.tone }}
            aria-hidden
          />

          <div className="relative">
            <div className="font-mono text-[10px] tracking-[0.28em] text-[var(--koi-ink-soft)]">
              SCORE
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span
                className="font-serif-jp text-[64px] font-medium leading-none tracking-[-0.02em] sm:text-[80px]"
                style={{ color: 'var(--koi-primary-deep)' }}
              >
                {result.score}
              </span>
              <span className="font-mono text-[12px] tracking-[0.18em] text-[var(--koi-ink-muted)]">
                / 100
              </span>
            </div>

            <p className="mt-5 text-[14px] leading-[1.95] text-[var(--koi-ink)]">
              {result.tone}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-[var(--koi-bg)] p-3">
                <span className="text-[24px]" aria-hidden>
                  {selfType.emoji}
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-[9px] tracking-[0.18em] text-[var(--koi-ink-muted)]">
                    {selfType.code}
                  </div>
                  <div className="font-serif-jp truncate text-[13px] font-medium">
                    {selfType.name}
                  </div>
                </div>
              </div>
              <span className="text-[var(--koi-primary-deep)]" aria-hidden>
                <HeartIcon className="h-4 w-4" />
              </span>
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-[var(--koi-bg)] p-3">
                <span className="text-[24px]" aria-hidden>
                  {otherType.emoji}
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-[9px] tracking-[0.18em] text-[var(--koi-ink-muted)]">
                    {otherType.code}
                  </div>
                  <div className="font-serif-jp truncate text-[13px] font-medium">
                    {otherType.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Summary */}
        <section className="mt-10">
          <div className="mb-5">
            <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
              01 · OVERVIEW
            </div>
            <h2 className="font-serif-jp mt-1.5 text-[20px] font-medium leading-[1.4]">
              ふたりの傾き
            </h2>
          </div>
          <div className="rounded-3xl bg-[var(--koi-bg-card)] p-6 shadow-[0_2px_8px_var(--koi-line)] sm:p-7">
            <p className="text-[14px] leading-[1.95] text-[var(--koi-ink)]">
              {result.summary}
            </p>
          </div>
        </section>

        {/* Axis breakdown */}
        <section className="mt-10">
          <div className="mb-5">
            <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
              02 · AXES
            </div>
            <h2 className="font-serif-jp mt-1.5 text-[20px] font-medium leading-[1.4]">
              4 つの軸ごとの相性
            </h2>
          </div>
          <ul className="flex flex-col gap-3">
            {result.axes.map((axis) => (
              <li
                key={axis.axis}
                className="rounded-3xl bg-[var(--koi-bg-card)] p-5 shadow-[0_2px_8px_var(--koi-line)] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
                    {axis.axis}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.1em] ${
                      axis.match
                        ? 'bg-[var(--koi-primary-soft)] text-[var(--koi-primary-deep)]'
                        : 'bg-[var(--koi-bg-soft)] text-[var(--koi-ink-soft)]'
                    }`}
                  >
                    {axis.match ? 'MATCH' : 'CONTRAST'}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[13px]">
                  <span className="font-serif-jp font-medium">
                    {axis.selfLabel}
                  </span>
                  <span className="text-[var(--koi-ink-muted)]" aria-hidden>
                    ×
                  </span>
                  <span className="font-serif-jp font-medium">
                    {axis.otherLabel}
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-[1.85] text-[var(--koi-ink-soft)]">
                  {axis.comment}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom actions */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="/compatibility"
            className="flex h-12 items-center justify-center rounded-[24px] text-[13px] text-[var(--koi-ink-soft)] underline-offset-4 hover:underline"
          >
            別のタイプと診断する
          </Link>
          <Link
            href="/diagnosis/result"
            className="flex h-12 items-center justify-center rounded-[24px] text-[13px] text-[var(--koi-ink-soft)] underline-offset-4 hover:underline"
          >
            自分の結果に戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
