import Link from 'next/link';
import SpinningGlobe from '@/components/diagnosis/SpinningGlobe';

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

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 7l3 3 5-6" />
    </svg>
  );
}

const TIPS: Array<{ title: string; sub: string }> = [
  { title: '全24問', sub: '約3分で終わります' },
  { title: 'いつでも中断OK', sub: '途中の答えは保存されます' },
  { title: '正解はない', sub: '直感で選んでください' },
];

export default function DiagnosisStartPage() {
  return (
    <main className="min-h-screen bg-[var(--koi-bg)] text-[var(--koi-ink)]">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 pt-6 pb-3 sm:px-7">
        <Link
          href="/"
          className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
          aria-label="トップへ戻る"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
        <span className="text-[11px] tracking-[0.2em] text-[var(--koi-ink-muted)]">
          はじめに
        </span>
        <span className="w-9" aria-hidden />
      </header>

      <section className="mx-auto flex w-full max-w-md flex-col px-7 pt-6 pb-10">
        {/* Spinning globe loading indicator */}
        <div
          className="koi-anim-rise mx-auto mb-8 flex h-[200px] w-[200px] items-center justify-center"
          style={{ ['--koi-rise-delay' as string]: '0.05s' }}
        >
          <SpinningGlobe />
        </div>

        <h1
          className="koi-anim-rise text-center font-serif-jp text-[22px] font-medium leading-[1.6]"
          style={{ ['--koi-rise-delay' as string]: '0.18s' }}
        >
          素直な気持ちで
          <br />
          答えてみてください
        </h1>

        <ul className="mt-8 flex flex-col gap-3">
          {TIPS.map(({ title, sub }) => (
            <li
              key={title}
              className="flex items-center gap-3 rounded-2xl bg-[var(--koi-bg-card)] px-4 py-3 shadow-[0_1px_0_var(--koi-line)]"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--koi-primary-soft)] text-[var(--koi-primary-deep)]">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <div>
                <div className="text-[13px] font-semibold leading-tight">
                  {title}
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--koi-ink-soft)]">
                  {sub}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/diagnosis"
          className="mt-10 flex h-14 w-full items-center justify-center rounded-[28px] bg-[var(--koi-ink)] text-[14px] font-semibold tracking-[0.04em] text-white shadow-[0_8px_20px_var(--koi-primary-soft)]"
        >
          はじめる
        </Link>
        <p className="mt-3 text-center text-[10px] text-[var(--koi-ink-muted)]">
          診断結果はあなたのブラウザにのみ保存されます
        </p>
      </section>
    </main>
  );
}
