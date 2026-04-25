'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import type { AxisScores, DiagnosisResult, RenAICode } from '@/types/diagnosis';
import { renAITypes } from '@/data/types/renAITypes';

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

function SparkleIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden>
      <path d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5Z" />
    </svg>
  );
}

function DownloadIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 2v9M5 8l4 4 4-4M3 14h12" />
    </svg>
  );
}

type DownloadStatus =
  | { kind: 'idle' }
  | { kind: 'rendering' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

type CharImgState =
  | { kind: 'loading' }
  | { kind: 'ready'; src: string }
  | { kind: 'error' };

type CharApiResponse =
  | { success: true; imageDataUrl: string; cacheHit: boolean }
  | { success: false; error: string };

function useCharacterImage(
  code: RenAICode | null,
  axes: AxisScores | null
): CharImgState {
  const [state, setState] = useState<CharImgState>({ kind: 'loading' });

  useEffect(() => {
    if (!code || !axes) return;
    let cancelled = false;
    const params = new URLSearchParams({
      code,
      lf: String(axes.LF),
      ps: String(axes.PS),
      wa: String(axes.WA),
      ie: String(axes.IE),
    });
    void (async () => {
      try {
        const res = await fetch(`/api/character?${params.toString()}`);
        const json = (await res.json()) as CharApiResponse;
        if (cancelled) return;
        if (res.ok && json.success) {
          setState({ kind: 'ready', src: json.imageDataUrl });
        } else {
          setState({ kind: 'error' });
        }
      } catch {
        if (cancelled) return;
        setState({ kind: 'error' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, axes]);

  return state;
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

function formatYearMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}.${m}`;
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

  // Hooks must be called unconditionally before any early return.
  const charImg = useCharacterImage(
    result?.code ?? null,
    result?.axes ?? null
  );

  const cardRef = useRef<HTMLElement | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    kind: 'idle',
  });

  const handleDownload = useCallback(async () => {
    const node = cardRef.current;
    if (!node) return;
    if (charImg.kind === 'loading') return;

    setDownloadStatus({ kind: 'rendering' });
    try {
      // 高解像度で書き出すため pixelRatio=2 を指定 (Retina/SNS 投稿でも綺麗)
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#C8D0E2',
      });

      // タイプコード入りのファイル名 (例: renAI_LPWE_2026-04.png)
      const fileName = `renAI_${result?.code ?? 'card'}_${formatYearMonth().replace('.', '-')}.png`;

      // Web Share API (files 対応) を優先 — iOS でカメラロール保存が一発で出来る
      if (typeof navigator !== 'undefined' && 'canShare' in navigator) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file] });
            setDownloadStatus({ kind: 'success' });
            return;
          }
        } catch {
          // share がキャンセル/未対応なら fallthrough して download anchor へ
        }
      }

      // Fallback: <a download> 経由でダウンロード
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadStatus({ kind: 'success' });
    } catch (error) {
      setDownloadStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : '画像の生成に失敗しました',
      });
    }
  }, [charImg.kind, result?.code]);

  // 成功・エラーは 2.5 秒後に idle に戻す
  useEffect(() => {
    if (downloadStatus.kind === 'success' || downloadStatus.kind === 'error') {
      const t = setTimeout(() => setDownloadStatus({ kind: 'idle' }), 2500);
      return () => clearTimeout(t);
    }
  }, [downloadStatus.kind]);

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

  const type = renAITypes[result.code];
  const yearMonth = formatYearMonth();
  const shareUrl =
    typeof window !== 'undefined' ? window.location.origin : '';
  const shareText = `わたしの恋ごころは「${type.name} ${type.emoji}」でした。\n${type.short}\n\n#renAI`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent(shareText)}`;

  return (
    <main className="min-h-screen bg-[var(--koi-bg)] text-[var(--koi-ink)]">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-4 sm:px-7">
        <Link
          href="/diagnosis/result"
          className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
          aria-label="結果に戻る"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        <span className="font-mono text-[11px] tracking-[0.22em] text-[var(--koi-ink-soft)]">
          SHARE
        </span>
        <span className="w-9" aria-hidden />
      </header>

      <section className="mx-auto flex w-full max-w-md flex-col px-5 pb-12 pt-4 sm:px-7">
        {/* Share card preview — character-first, full-bleed image + overlay */}
        <article
          ref={cardRef}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]"
          style={{
            background:
              'linear-gradient(180deg, #ECEFF5 0%, #DDE2EE 65%, #C8D0E2 100%)',
            boxShadow: '0 24px 60px rgba(60,70,100,0.18)',
          }}
          aria-label="シェアカードプレビュー"
        >
          {/* Image layer — fills the entire card */}
          {charImg.kind === 'ready' ? (
            <img
              src={charImg.src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[clamp(80px,22vw,140px)] drop-shadow-[0_8px_16px_rgba(60,70,100,0.18)]">
                {result.emoji}
              </span>
            </div>
          )}

          {/* Bottom gradient mask — fades the lower half into card background for text readability */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
            style={{
              background:
                'linear-gradient(to top, #C8D0E2 0%, #C8D0E2 28%, rgba(221,226,238,0.92) 50%, rgba(221,226,238,0.55) 72%, transparent 100%)',
            }}
            aria-hidden
          />

          {/* Top gradient mask — softens the top edge so the header chips read clearly */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(236,239,245,0.85) 0%, rgba(236,239,245,0.45) 60%, transparent 100%)',
            }}
            aria-hidden
          />

          {/* Header row: renAI logo + type code */}
          <div className="absolute left-6 top-5 z-10 flex items-center gap-2 text-[11px] text-[var(--koi-ink-soft)]">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: '#8FA3C9' }}
              aria-hidden
            />
            <span className="font-serif-jp">renAI</span>
          </div>
          <div className="absolute right-6 top-5 z-10 font-mono text-[11px] tracking-[0.22em] text-[var(--koi-ink-soft)]">
            {result.code}
          </div>

          {/* Decorative sparkles — kept at edges to avoid overlapping the character */}
          <SparkleIcon
            className="absolute left-5 top-[18%] z-10 h-2.5 w-2.5 text-white/60 drop-shadow-[0_1px_2px_rgba(60,70,100,0.3)]"
          />
          <SparkleIcon
            className="absolute right-6 top-[32%] z-10 h-2 w-2 text-white/50 drop-shadow-[0_1px_2px_rgba(60,70,100,0.3)]"
          />

          {/* Title block — overlays the gradient mask */}
          <div className="absolute bottom-12 left-0 right-0 z-10 px-7 text-center">
            <p className="text-[12px] tracking-[0.06em] text-[var(--koi-ink-soft)]">
              あなたの恋愛タイプは
            </p>
            <h2 className="font-serif-jp mt-2 text-[34px] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--koi-ink)]">
              {type.name}
            </h2>
            <p className="font-serif-jp mt-2 text-[13px] italic text-[var(--koi-ink-soft)]">
              —— {type.short}
            </p>
          </div>

          {/* Diagonal footer: date / domain */}
          <div className="absolute bottom-5 left-6 z-10 font-mono text-[10px] tracking-[0.18em] text-[var(--koi-ink-muted)]">
            {yearMonth}
          </div>
          <div className="absolute bottom-5 right-6 z-10 font-mono text-[10px] tracking-[0.18em] text-[var(--koi-ink-muted)]">
            renAI.app
          </div>
        </article>

        {/* Download / share buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={
              downloadStatus.kind === 'rendering' ||
              charImg.kind === 'loading'
            }
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[24px] border border-[var(--koi-line)] bg-[var(--koi-bg-card)] text-[14px] font-semibold text-[var(--koi-ink)] transition-all hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            aria-label="シェアカードを画像として保存"
          >
            {downloadStatus.kind === 'rendering' ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--koi-primary-soft)] border-t-[var(--koi-primary-deep)]"
                  aria-hidden
                />
                画像を生成中…
              </>
            ) : downloadStatus.kind === 'success' ? (
              <>
                <span aria-hidden>✓</span>
                保存しました
              </>
            ) : (
              <>
                <DownloadIcon className="h-4 w-4" />
                画像として保存
              </>
            )}
          </button>
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center rounded-[24px] bg-[var(--koi-ink)] text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5"
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

        {downloadStatus.kind === 'error' ? (
          <p
            className="mt-4 text-center text-[12px] leading-[1.7] text-[#B33A4A]"
            aria-live="polite"
          >
            {downloadStatus.message}
          </p>
        ) : (
          <p className="mt-6 text-center text-[11px] leading-[1.7] text-[var(--koi-ink-muted)]">
            画像はカメラロールやダウンロードフォルダに保存されます。
            <br />
            シェア先には URL とキャプションが投稿されます。
          </p>
        )}

        <Link
          href="/diagnosis/result"
          className="mt-8 flex h-12 w-full items-center justify-center rounded-[24px] border border-[var(--koi-line)] text-[13px] text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
        >
          結果に戻る
        </Link>
      </section>
    </main>
  );
}
