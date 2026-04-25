'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { axisQuestions } from '@/data/questions/axisQuestions';
import { LikertValue } from '@/types/diagnosis';
import { useHydrated } from '@/lib/hooks/useHydrated';

const ANSWERS_STORAGE_KEY = 'renAIAnswers';

const SCALE_OPTIONS: ReadonlyArray<{
  value: LikertValue;
  label: string;
  size: number;
}> = [
  { value: 1, label: 'とても\nそう思う', size: 44 },
  { value: 2, label: 'そう思う', size: 36 },
  { value: 3, label: 'どちらとも\nいえない', size: 28 },
  { value: 4, label: 'あまり\n思わない', size: 36 },
  { value: 5, label: '全く\n思わない', size: 44 },
];

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 7l3 3 5-6" />
    </svg>
  );
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

function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M4 4l10 10M14 4L4 14" />
    </svg>
  );
}

const TOTAL = axisQuestions.length;

type AnswerMap = Record<number, LikertValue>;

const EMPTY_ANSWERS: AnswerMap = Object.freeze({}) as AnswerMap;

function parseAnswersJson(raw: string | null): AnswerMap | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const result: AnswerMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const id = Number(k);
      if (!Number.isFinite(id)) continue;
      if (v === 1 || v === 2 || v === 3 || v === 4 || v === 5) {
        result[id] = v;
      }
    }
    return result;
  } catch {
    return null;
  }
}

let cachedSnapshotRaw: string | null = null;
let cachedSnapshot: AnswerMap = EMPTY_ANSWERS;

function getAnswersSnapshot(): AnswerMap {
  if (typeof window === 'undefined') return EMPTY_ANSWERS;
  const raw = window.sessionStorage.getItem(ANSWERS_STORAGE_KEY);
  if (raw === cachedSnapshotRaw) return cachedSnapshot;
  cachedSnapshotRaw = raw;
  cachedSnapshot = parseAnswersJson(raw) ?? EMPTY_ANSWERS;
  return cachedSnapshot;
}

function getServerAnswersSnapshot(): AnswerMap {
  return EMPTY_ANSWERS;
}

function subscribeAnswers(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === null || e.key === ANSWERS_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('storage', handler);
  };
}

function writeAnswers(next: AnswerMap): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(next);
    window.sessionStorage.setItem(ANSWERS_STORAGE_KEY, serialized);
    cachedSnapshotRaw = serialized;
    cachedSnapshot = next;
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: ANSWERS_STORAGE_KEY,
        newValue: serialized,
      })
    );
  } catch {
    // storage が使えない環境では何もしない
  }
}

function computeFirstUnansweredIndex(answers: AnswerMap): number {
  for (let i = 0; i < axisQuestions.length; i++) {
    if (answers[axisQuestions[i].id] === undefined) {
      return i;
    }
  }
  return axisQuestions.length - 1;
}

export default function QuestionForm() {
  const router = useRouter();
  const answers = useSyncExternalStore(
    subscribeAnswers,
    getAnswersSnapshot,
    getServerAnswersSnapshot
  );
  const mounted = useHydrated();

  // SSR と初回ハイドレートでは index=0 で固定し、マウント後の最初の再レンダーで
  // sessionStorage 由来の resume 位置に切り替える。
  const resumeIndex = mounted ? computeFirstUnansweredIndex(answers) : 0;
  const [userOffset, setUserOffset] = useState<number>(0);
  // 直前に選択した値を保持して、遷移までの間「✓ 選択しました」フィードバックを表示する
  const [justAnswered, setJustAnswered] = useState<LikertValue | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const index = Math.min(Math.max(resumeIndex + userOffset, 0), TOTAL - 1);
  const question = axisQuestions[index];
  const selected = question ? answers[question.id] : undefined;
  const answeredCount = Object.keys(answers).length;
  const progress = ((index + 1) / TOTAL) * 100;
  const isLast = index === TOTAL - 1;

  // 質問が切り替わったらフィードバック状態をリセット
  useEffect(() => {
    setJustAnswered(null);
  }, [index]);

  // アンマウント時にタイマーを掃除
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const handleAnswer = (value: LikertValue) => {
    if (!question) return;
    // 連打中は無視 (二重遷移防止)
    if (justAnswered !== null) return;

    const next = { ...answers, [question.id]: value };
    writeAnswers(next);
    setJustAnswered(value);

    if (isLast) {
      const allAnswered = axisQuestions.every(
        (q) => next[q.id] !== undefined
      );
      if (allAnswered) {
        // 最後の問題でも選択フィードバックを見せてからローディングへ
        advanceTimerRef.current = setTimeout(() => {
          router.push('/diagnosis/loading');
        }, 520);
        return;
      }
    }
    advanceTimerRef.current = setTimeout(() => {
      const newResume = computeFirstUnansweredIndex(next);
      const targetIndex = Math.min(index + 1, TOTAL - 1);
      setUserOffset(targetIndex - newResume);
    }, 520);
  };

  const handlePrev = () => {
    const newResume = computeFirstUnansweredIndex(answers);
    const targetIndex = Math.max(index - 1, 0);
    setUserOffset(targetIndex - newResume);
  };

  const handleClose = () => {
    if (
      answeredCount > 0 &&
      !window.confirm('診断を中断しますか? 回答は保存されます。')
    ) {
      return;
    }
    router.push('/');
  };

  if (!question) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-5 pb-10 sm:px-7">
      {/* Top bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={index === 0}
          className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-opacity disabled:opacity-30"
          aria-label="前の質問"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div
          className="text-[12px] font-medium tabular-nums text-[var(--koi-ink-soft)]"
          aria-live="polite"
        >
          <span className="font-semibold text-[var(--koi-primary-deep)]">
            {index + 1}
          </span>
          <span className="text-[var(--koi-ink-muted)]"> / {TOTAL}</span>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
          aria-label="診断を中断"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--koi-bg-soft)]">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background:
              'linear-gradient(90deg, var(--koi-primary), var(--koi-primary-deep))',
          }}
        />
      </div>

      {/* Question */}
      <section className="mt-12 min-h-[180px]">
        <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
          QUESTION {String(index + 1).padStart(2, '0')}
        </div>
        <h2 className="font-serif-jp mt-3 text-[22px] font-medium leading-[1.6] tracking-[-0.005em] text-[var(--koi-ink)] sm:text-[24px]">
          {question.text}
        </h2>
      </section>

      {/* Answer bubbles */}
      <div
        className="mt-12 flex items-center justify-between gap-1"
        role="radiogroup"
        aria-label={question.text}
      >
        {SCALE_OPTIONS.map(({ value, label, size }) => {
          const isSelected = selected === value;
          const isJustAnswered = justAnswered === value;
          const isCenter = value === 3;
          // 直前選択中は他のオプションを少し控えめに
          const isDimmed = justAnswered !== null && !isJustAnswered;
          return (
            <div
              key={value}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={label.replace('\n', '')}
                onClick={() => handleAnswer(value)}
                className="flex items-center justify-center rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--koi-primary-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--koi-bg)]"
                style={{
                  width: size,
                  height: size,
                  background: isSelected
                    ? 'var(--koi-primary)'
                    : 'var(--koi-bg-card)',
                  border: isSelected
                    ? 'none'
                    : `1.5px solid ${isCenter ? 'var(--koi-line)' : 'var(--koi-primary-soft)'}`,
                  boxShadow: isJustAnswered
                    ? '0 0 0 4px var(--koi-primary-soft), 0 10px 24px var(--koi-primary-soft)'
                    : isSelected
                      ? '0 6px 16px var(--koi-primary-soft)'
                      : 'none',
                  color: '#fff',
                  transform: isJustAnswered
                    ? 'scale(1.18)'
                    : isDimmed
                      ? 'scale(0.92)'
                      : 'scale(1)',
                  opacity: isDimmed ? 0.4 : 1,
                }}
              >
                {isSelected && <CheckIcon className="h-4 w-4" aria-hidden />}
              </button>
              <span
                className="whitespace-pre-line text-center text-[9px] leading-[1.3] transition-colors sm:text-[10px]"
                style={{
                  color: isJustAnswered
                    ? 'var(--koi-primary-deep)'
                    : 'var(--koi-ink-muted)',
                  fontWeight: isJustAnswered ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hint */}
      <p
        className="mt-12 text-center text-[11px] transition-colors"
        aria-live="polite"
        style={{
          color:
            justAnswered !== null
              ? 'var(--koi-primary-deep)'
              : 'var(--koi-ink-muted)',
          fontWeight: justAnswered !== null ? 500 : 400,
        }}
      >
        {justAnswered !== null ? '✓ 選択しました' : '直感で選んでください'}
      </p>
    </div>
  );
}
