'use client';

import { useEffect, useState } from 'react';
import type { AxisScores, RenAICode } from '@/types/diagnosis';

interface CharacterImageProps {
  code: RenAICode;
  axes: AxisScores;
  emoji: string;
  className?: string;
}

type ImgState =
  | { kind: 'loading' }
  | { kind: 'ready'; src: string }
  | { kind: 'error' };

type ApiResponse =
  | { success: true; imageDataUrl: string; cacheHit: boolean }
  | { success: false; error: string };

function buildUrl(code: RenAICode, axes: AxisScores): string {
  const params = new URLSearchParams({
    code,
    lf: String(axes.LF),
    ps: String(axes.PS),
    wa: String(axes.WA),
    ie: String(axes.IE),
  });
  return `/api/character?${params.toString()}`;
}

export function CharacterImage({
  code,
  axes,
  emoji,
  className = '',
}: CharacterImageProps) {
  const [state, setState] = useState<ImgState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const url = buildUrl(code, axes);

    void (async () => {
      try {
        const res = await fetch(url);
        const json = (await res.json()) as ApiResponse;
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

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
    >
      {state.kind === 'loading' && (
        <>
          <span className="absolute inset-0 animate-pulse bg-[var(--koi-primary-soft)] opacity-50" />
          <span className="relative text-[clamp(48px,18vw,96px)] opacity-60">
            {emoji}
          </span>
        </>
      )}
      {state.kind === 'ready' && (
        <img
          src={state.src}
          alt=""
          className="h-full w-full object-cover transition-opacity duration-500"
        />
      )}
      {state.kind === 'error' && (
        <span className="text-[clamp(56px,20vw,112px)]">{emoji}</span>
      )}
    </div>
  );
}
