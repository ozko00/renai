'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { DiagnosisResult } from '@/types/diagnosis';
import { koigokoroTypes } from '@/data/types/koigokoroTypes';

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
    <svg
      viewBox="0 0 14 14"
      fill="currentColor"
      className={className}
      aria-hidden
    >
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
    typeof obj.emoji === 'string'
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

export default function DiagnosisSharePage() {
  const router = useRouter();
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

  const mounted = typeof window !== 'undefined';

  useEffect(() => {
    if (!mounted) return;
    if (!result) router.replace('/diagnosis/start');
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
  const shareUrl =
    typeof window !== 'undefined' ? window.location.origin : '';
  const shareText = `わたしの恋ごころは「${type.name} ${type.emoji}」でした。\n${type.short}\n\n#koigokoro`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent(shareText)}`;

  return (
    <main className="min-h-screen bg-[#0E0B14] text-white">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4 sm:px-7">
        <Link
          href="/diagnosis/result"
          className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10"
          aria-label="結果に戻る"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        <span className="font-mono text-[11px] tracking-[0.22em] text-white/60">
          SHARE
        </span>
        <span className="w-9" aria-hidden />
      </header>

      <section className="mx-auto flex w-full max-w-md flex-col px-5 pb-12 pt-4 sm:px-7">
        {/* Share card preview */}
        <article
          className="relative overflow-hidden rounded-[28px] p-8"
          style={{
            background:
              'linear-gradient(160deg, #1A1426 0%, #2A1B36 60%, #3A2046 100%)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}
          aria-label="シェアカードプレビュー"
        >
          <div
            className="absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-50 blur-3xl"
            style={{ background: accent }}
            aria-hidden
          />
          <div
            className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full opacity-30 blur-3xl"
            style={{ background: '#7B5FB8' }}
            aria-hidden
          />

          <div className="relative">
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.3em] text-white/60">
              <SparkleIcon className="h-2.5 w-2.5" />
              KOIGOKORO
            </div>

            <div
              className="mt-8 flex h-24 w-24 items-center justify-center rounded-full text-[44px]"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              aria-hidden
            >
              {result.emoji}
            </div>

            <div className="mt-7 font-mono text-[10px] tracking-[0.28em] text-white/60">
              {result.code}
            </div>
            <h2
              className="font-serif-jp mt-2 text-[36px] font-medium leading-[1.15] tracking-[-0.01em]"
              style={{ color: accent }}
            >
              {type.name}
            </h2>
            <p className="mt-3 text-[13px] leading-[1.7] text-white/80">
              {type.short}
            </p>

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-[11px] text-white/60">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <HeartIcon className="h-3 w-3" />
                </span>
                <span className="font-serif-jp">koigokoro</span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/40">
                16 TYPES
              </span>
            </div>
          </div>
        </article>

        {/* Share buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center rounded-[24px] bg-white text-[14px] font-semibold text-[#0E0B14] transition-transform hover:-translate-y-0.5"
          >
            X (Twitter) でシェア
          </a>
          <a
            href={lineShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center rounded-[24px] bg-[#06C755] text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            LINE でシェア
          </a>
        </div>

        <p className="mt-6 text-center text-[11px] leading-[1.7] text-white/50">
          このカードはイメージです。
          <br />
          シェア先には URL とキャプションが投稿されます。
        </p>

        <Link
          href="/diagnosis/result"
          className="mt-8 flex h-12 w-full items-center justify-center rounded-[24px] border border-white/15 text-[13px] text-white/80 transition-colors hover:bg-white/5"
        >
          結果に戻る
        </Link>
      </section>
    </main>
  );
}
