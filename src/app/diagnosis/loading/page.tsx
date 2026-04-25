'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  AxisAnswers,
  DiagnosisResult,
  LikertValue,
} from '@/types/diagnosis';

const ANSWERS_STORAGE_KEY = 'koigokoroAnswers';
const RESULT_STORAGE_KEY = 'diagnosisResult';

type ApiSuccess = { success: true; result: DiagnosisResult };
type ApiError = {
  success: false;
  error: string;
  retryAfter?: number;
};
type ApiResponse = ApiSuccess | ApiError;

type LoadingStatus =
  | { kind: 'loading' }
  | { kind: 'cooldown'; message: string; retryAfter: number }
  | { kind: 'error'; message: string };

function readAnswers(): AxisAnswers | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(ANSWERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const out: AxisAnswers = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const id = Number(k);
      if (!Number.isFinite(id)) return null;
      if (v === 1 || v === 2 || v === 3 || v === 4 || v === 5) {
        out[id] = v as LikertValue;
      } else {
        return null;
      }
    }
    return out;
  } catch {
    return null;
  }
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

export default function DiagnosisLoadingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<LoadingStatus>({ kind: 'loading' });
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const answers = readAnswers();
    if (!answers || Object.keys(answers).length === 0) {
      router.replace('/diagnosis');
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      try {
        const res = await fetch('/api/diagnosis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
          signal: controller.signal,
        });

        const json = (await res.json()) as ApiResponse;

        if (cancelled) return;

        if (!res.ok || !json.success) {
          if (res.status === 429) {
            const retryAfter =
              'retryAfter' in json && typeof json.retryAfter === 'number'
                ? json.retryAfter
                : 60;
            setStatus({
              kind: 'cooldown',
              message:
                'error' in json
                  ? json.error
                  : 'リクエストが多すぎます。しばらくお待ちください。',
              retryAfter,
            });
            return;
          }
          setStatus({
            kind: 'error',
            message:
              'error' in json
                ? json.error
                : '診断処理中にエラーが発生しました',
          });
          return;
        }

        try {
          window.localStorage.setItem(
            RESULT_STORAGE_KEY,
            JSON.stringify(json.result)
          );
          window.sessionStorage.removeItem(ANSWERS_STORAGE_KEY);
        } catch {
          // ストレージが使えなくても結果ページへ進む (URL state なしのため最小フォールバック)
        }

        router.replace('/diagnosis/result');
      } catch (error) {
        if (cancelled) return;
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return;
        }
        setStatus({
          kind: 'error',
          message:
            error instanceof Error
              ? error.message
              : '通信に失敗しました',
        });
      }
    };

    void run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [router]);

  const handleRetry = () => {
    fetchedRef.current = false;
    setStatus({ kind: 'loading' });
    // re-trigger by remounting effect via reload of state
    // 単純に router.refresh() ではなく、もう一度同じフローを通すため state を初期化
    setTimeout(() => {
      window.location.reload();
    }, 0);
  };

  const handleBack = () => {
    router.push('/diagnosis');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--koi-bg)] text-[var(--koi-ink)]">
      {/* 背景の柔らかなブロブ */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, var(--koi-primary-soft) 0%, transparent 70%)',
          }}
        />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-7 py-10 text-center">
        {status.kind === 'loading' && (
          <>
            <div className="relative h-32 w-32" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--koi-primary-soft)] opacity-60" />
              <span className="absolute inset-3 rounded-full bg-[var(--koi-primary-soft)] opacity-80" />
              <span className="absolute inset-7 rounded-full bg-[var(--koi-primary)] opacity-90" />
              <span className="absolute inset-0 flex items-center justify-center text-white">
                <HeartIcon className="h-8 w-8 koi-pulse" />
              </span>
            </div>

            <h1 className="font-serif-jp mt-10 text-[20px] font-medium leading-[1.6]">
              あなたの恋ごころを
              <br />
              読み解いています
            </h1>

            <p className="mt-4 text-[12px] text-[var(--koi-ink-soft)]">
              <span className="koi-dot">.</span>
              <span className="koi-dot koi-dot-2">.</span>
              <span className="koi-dot koi-dot-3">.</span>
            </p>

            <p
              className="mt-8 text-[11px] text-[var(--koi-ink-muted)]"
              aria-live="polite"
            >
              まもなく完了します
            </p>
          </>
        )}

        {status.kind === 'cooldown' && (
          <>
            <h1 className="font-serif-jp text-[22px] font-medium leading-[1.5]">
              すこしだけ
              <br />
              お時間をください
            </h1>
            <p className="mt-5 text-[13px] leading-[1.8] text-[var(--koi-ink-soft)]">
              {status.message}
            </p>
            <p className="mt-2 text-[12px] text-[var(--koi-ink-muted)]">
              約 {status.retryAfter} 秒後にもう一度お試しください
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-8 flex h-12 w-full items-center justify-center rounded-[24px] bg-[var(--koi-ink)] text-[14px] font-semibold text-white"
            >
              もう一度試す
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="mt-3 text-[12px] text-[var(--koi-ink-soft)] underline-offset-4 hover:underline"
            >
              質問に戻る
            </button>
          </>
        )}

        {status.kind === 'error' && (
          <>
            <h1 className="font-serif-jp text-[22px] font-medium leading-[1.5]">
              うまくいきませんでした
            </h1>
            <p className="mt-5 text-[13px] leading-[1.8] text-[var(--koi-ink-soft)]">
              {status.message}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-8 flex h-12 w-full items-center justify-center rounded-[24px] bg-[var(--koi-ink)] text-[14px] font-semibold text-white"
            >
              もう一度試す
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="mt-3 text-[12px] text-[var(--koi-ink-soft)] underline-offset-4 hover:underline"
            >
              質問に戻る
            </button>
          </>
        )}
      </section>

      <style jsx>{`
        :global(.koi-pulse) {
          animation: koi-pulse 1.6s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes koi-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.85;
          }
        }
        :global(.koi-dot) {
          display: inline-block;
          opacity: 0;
          animation: koi-dot 1.4s infinite;
          font-size: 18px;
          line-height: 1;
          margin: 0 1px;
        }
        :global(.koi-dot-2) {
          animation-delay: 0.2s;
        }
        :global(.koi-dot-3) {
          animation-delay: 0.4s;
        }
        @keyframes koi-dot {
          0%,
          80%,
          100% {
            opacity: 0;
            transform: translateY(2px);
          }
          40% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }
      `}</style>
    </main>
  );
}
