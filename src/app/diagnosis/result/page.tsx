'use client';

import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { DiagnosisResult } from '@/types/diagnosis';
import { koigokoroTypes } from '@/data/types/koigokoroTypes';
import AxisScoreBar from '@/components/result/AxisScoreBar';
import {
  isLegacyResult,
  migrateLegacyResult,
} from '@/lib/utils/legacyMigration';

const RESULT_STORAGE_KEY = 'diagnosisResult';

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

function SparkleIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden>
      <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5Z" />
    </svg>
  );
}

function isDiagnosisResult(value: unknown): value is DiagnosisResult {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    obj.version === 2 &&
    typeof obj.code === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.emoji === 'string' &&
    typeof obj.axes === 'object' &&
    obj.axes !== null
  );
}

function readStoredResultRaw(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(RESULT_STORAGE_KEY);
}

function subscribeToStorage(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

export default function DiagnosisResultPage() {
  const router = useRouter();
  const migratedRef = useRef(false);

  const stored = useSyncExternalStore(
    subscribeToStorage,
    readStoredResultRaw,
    () => null
  );

  const result = useMemo<DiagnosisResult | null>(() => {
    if (stored === null) return null;
    try {
      const parsed: unknown = JSON.parse(stored);
      if (isDiagnosisResult(parsed)) return parsed;
      return null;
    } catch {
      return null;
    }
  }, [stored]);

  // 旧スキーマの自動マイグレーション
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (migratedRef.current) return;
    if (result) return;
    const raw = window.localStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isLegacyResult(parsed)) return;
      const newResult = migrateLegacyResult(parsed);
      if (!newResult) return;
      window.localStorage.setItem(
        RESULT_STORAGE_KEY,
        JSON.stringify(newResult)
      );
      migratedRef.current = true;
      // useSyncExternalStore は localStorage の同タブ書き換えを検知しないため、
      // storage event を手動で発火させて再描画
      window.dispatchEvent(new StorageEvent('storage', { key: RESULT_STORAGE_KEY }));
    } catch {
      // 何もしない
    }
  }, [result]);

  const mounted = typeof window !== 'undefined';

  useEffect(() => {
    if (!mounted) return;
    if (result) return;
    if (migratedRef.current) return;
    // localStorage に何もない、もしくはマイグレ不可のとき
    const raw = window.localStorage.getItem(RESULT_STORAGE_KEY);
    if (raw && isLegacyResult(JSON.parse(raw) as unknown)) return;
    router.replace('/diagnosis/start');
  }, [mounted, result, router]);

  if (!mounted || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--koi-bg)]">
        <div className="text-center">
          <div
            className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[var(--koi-primary-soft)] border-t-[var(--koi-primary-deep)]"
            aria-hidden
          />
          <p className="font-serif-jp text-[14px] text-[var(--koi-ink-soft)]">
            読み込んでいます…
          </p>
        </div>
      </div>
    );
  }

  const type = koigokoroTypes[result.code];
  const accent = type.tone;

  return (
    <main className="min-h-screen bg-[var(--koi-bg-soft)] text-[var(--koi-ink)]">
      <header className="sticky top-0 z-20 bg-[var(--koi-bg-soft)]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4 sm:px-7">
          <Link
            href="/"
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
            aria-label="トップへ戻る"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <span className="font-mono text-[11px] tracking-[0.22em] text-[var(--koi-ink-soft)]">
            RESULT
          </span>
          <span className="w-9" aria-hidden />
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl px-5 pb-16 sm:px-7">
        {/* Type hero */}
        <article
          className="relative mt-4 overflow-hidden rounded-[28px] p-7 shadow-[0_4px_24px_var(--koi-line)] sm:p-9"
          style={{
            background:
              'linear-gradient(180deg, var(--koi-bg-card) 0%, var(--koi-bg-soft) 100%)',
          }}
        >
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-50 blur-2xl"
            style={{ background: accent }}
            aria-hidden
          />
          <div
            className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full opacity-40 blur-3xl"
            style={{ background: 'var(--koi-primary-soft)' }}
            aria-hidden
          />

          <div className="relative">
            <div className="font-mono text-[10px] tracking-[0.28em] text-[var(--koi-ink-soft)]">
              YOUR TYPE · {result.code}
            </div>

            <div
              className="mt-6 flex h-24 w-24 items-center justify-center rounded-full text-[42px] shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              style={{ background: 'var(--koi-bg-card)' }}
              aria-hidden
            >
              {result.emoji}
            </div>

            <h1
              className="font-serif-jp mt-6 text-[34px] font-medium leading-[1.2] tracking-[-0.01em] sm:text-[42px]"
              style={{ color: accent }}
            >
              {type.name}
            </h1>
            <p className="mt-2 text-[13px] tracking-[0.04em] text-[var(--koi-ink-soft)]">
              {type.short}
            </p>

            <p className="mt-6 text-[14px] leading-[1.95] text-[var(--koi-ink)]">
              {result.summary}
            </p>
          </div>
        </article>

        {/* Compatibility CTA — top */}
        <Link
          href="/compatibility"
          className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-[var(--koi-bg-card)] px-5 py-4 shadow-[0_2px_8px_var(--koi-line)] transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--koi-primary-soft)] text-[var(--koi-primary-deep)]">
              <HeartIcon className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[13px] font-semibold leading-tight">
                相性のいいタイプを見る
              </div>
              <div className="text-[11px] text-[var(--koi-ink-soft)]">
                16タイプどうしの相性を診断
              </div>
            </div>
          </div>
          <span className="text-[var(--koi-ink-muted)]" aria-hidden>
            →
          </span>
        </Link>

        {/* Axis scores */}
        <section className="mt-10">
          <div className="mb-5">
            <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
              01 · AXES
            </div>
            <h2 className="font-serif-jp mt-1.5 text-[20px] font-medium leading-[1.4]">
              4 つの軸で見るあなた
            </h2>
          </div>
          <div className="rounded-3xl bg-[var(--koi-bg-card)] p-6 shadow-[0_2px_8px_var(--koi-line)] sm:p-7">
            <AxisScoreBar axes={result.axes} />
          </div>
        </section>

        {/* Advice */}
        {result.advice.length > 0 && (
          <section className="mt-10">
            <div className="mb-5">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
                02 · ADVICE
              </div>
              <h2 className="font-serif-jp mt-1.5 text-[20px] font-medium leading-[1.4]">
                あなたへのことば
              </h2>
            </div>
            <div className="rounded-3xl bg-[var(--koi-bg-card)] p-6 shadow-[0_2px_8px_var(--koi-line)] sm:p-7">
              <ul className="space-y-4">
                {result.advice.map((line, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="font-serif-jp flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--koi-primary-soft)] text-[14px] font-medium text-[var(--koi-primary-deep)]">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[13px] leading-[1.9] text-[var(--koi-ink)]">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Compatibility CTA — bottom */}
        <section className="relative mt-12 overflow-hidden rounded-[28px] bg-[var(--koi-bg-card)] px-7 py-9 text-center shadow-[0_2px_8px_var(--koi-line)]">
          <div
            className="absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-50"
            style={{ background: 'var(--koi-primary-soft)' }}
            aria-hidden
          />
          <div
            className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full opacity-40"
            style={{ background: accent }}
            aria-hidden
          />
          <div className="relative">
            <SparkleIcon
              className="mx-auto h-3 w-3 text-[var(--koi-primary-deep)]"
              aria-hidden
            />
            <h2 className="font-serif-jp mt-3 text-[22px] font-medium leading-[1.5]">
              相性のいい人を
              <br />
              見つけにいきましょう
            </h2>
            <p className="mt-2 text-[12px] text-[var(--koi-ink-soft)]">
              気になる人のタイプを入れて診断
            </p>
            <Link
              href="/compatibility"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-[24px] bg-[var(--koi-ink)] px-8 text-[14px] font-semibold tracking-[0.04em] text-white"
            >
              相性を診断する
            </Link>
          </div>
        </section>

        {/* Bottom actions */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="/diagnosis/share"
            className="flex h-14 w-full items-center justify-center rounded-[28px] bg-[var(--koi-ink)] text-[14px] font-semibold tracking-[0.04em] text-white shadow-[0_8px_20px_var(--koi-primary-soft)] sm:max-w-xs"
          >
            シェアカードを作る
          </Link>
          <div className="flex items-center gap-5 text-[12px] text-[var(--koi-ink-soft)]">
            <Link href="/types" className="underline-offset-4 hover:underline">
              16タイプを見る
            </Link>
            <span aria-hidden className="text-[var(--koi-ink-muted)]">
              ·
            </span>
            <Link
              href="/diagnosis/start"
              className="underline-offset-4 hover:underline"
            >
              もう一度診断する
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
