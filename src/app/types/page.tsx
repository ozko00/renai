import Link from 'next/link';
import { koigokoroTypeList } from '@/data/types/koigokoroTypes';

export const metadata = {
  title: '16タイプ一覧 — koigokoro',
  description:
    'koigokoro の 16 の恋ごころタイプ。あなたに似た人、ちがう人を見つけてみてください。',
};

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

const AXIS_LEGEND: Array<{ letter: string; label: string }> = [
  { letter: 'L · F', label: '主導 / 受容' },
  { letter: 'P · S', label: '情熱 / 安定' },
  { letter: 'W · A', label: '言葉 / 行動' },
  { letter: 'I · E', label: '自由 / 一途' },
];

export default function AllTypesPage() {
  return (
    <main className="min-h-screen bg-[var(--koi-bg)] text-[var(--koi-ink)]">
      <header className="sticky top-0 z-20 bg-[var(--koi-bg)]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4 sm:px-7">
          <Link
            href="/"
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
            aria-label="トップへ戻る"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <span className="font-mono text-[11px] tracking-[0.22em] text-[var(--koi-ink-soft)]">
            ALL TYPES
          </span>
          <span className="w-9" aria-hidden />
        </div>
      </header>

      <section className="mx-auto w-full max-w-3xl px-5 pb-16 sm:px-7">
        <div className="pt-2">
          <div className="font-mono text-[10px] tracking-[0.28em] text-[var(--koi-ink-muted)]">
            16 PROFILES
          </div>
          <h1 className="font-serif-jp mt-2 text-[28px] font-medium leading-[1.3] tracking-[-0.005em] sm:text-[34px]">
            16 の恋ごころ
          </h1>
          <p className="mt-3 max-w-md text-[13px] leading-[1.85] text-[var(--koi-ink-soft)]">
            4 つの軸の組み合わせで生まれる、16 通りの恋愛のかたち。
          </p>
        </div>

        {/* Axis legend */}
        <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {AXIS_LEGEND.map(({ letter, label }) => (
            <li
              key={letter}
              className="rounded-2xl bg-[var(--koi-bg-card)] px-3 py-2.5 text-center shadow-[0_1px_0_var(--koi-line)]"
            >
              <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--koi-primary-deep)]">
                {letter}
              </div>
              <div className="mt-1 text-[11px] text-[var(--koi-ink-soft)]">
                {label}
              </div>
            </li>
          ))}
        </ul>

        {/* Type grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {koigokoroTypeList.map((type) => (
            <article
              key={type.code}
              className="relative overflow-hidden rounded-2xl bg-[var(--koi-bg-card)] p-4 shadow-[0_1px_0_var(--koi-line)] transition-transform hover:-translate-y-0.5"
            >
              <div
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-40 blur-xl"
                style={{ background: type.tone }}
                aria-hidden
              />
              <div className="relative">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-[22px]"
                  style={{ background: 'var(--koi-bg)' }}
                  aria-hidden
                >
                  {type.emoji}
                </div>
                <div className="mt-3 font-mono text-[9px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
                  {type.code}
                </div>
                <h2
                  className="font-serif-jp mt-1 text-[15px] font-medium leading-[1.35]"
                  style={{ color: type.tone }}
                >
                  {type.name}
                </h2>
                <p className="mt-1.5 text-[11px] leading-[1.6] text-[var(--koi-ink-soft)]">
                  {type.short}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/diagnosis/start"
            className="flex h-14 w-full items-center justify-center rounded-[28px] bg-[var(--koi-ink)] text-[14px] font-semibold tracking-[0.04em] text-white shadow-[0_8px_20px_var(--koi-primary-soft)] sm:max-w-xs"
          >
            自分のタイプを診断する
          </Link>
        </div>
      </section>
    </main>
  );
}
