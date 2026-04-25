import Link from 'next/link';
import Image from 'next/image';

function PastelBlobs() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <radialGradient id="koi-blob-1" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--koi-primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--koi-primary)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="koi-blob-2" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--koi-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--koi-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20%" cy="12%" r="180" fill="url(#koi-blob-1)" />
      <circle cx="88%" cy="28%" r="140" fill="url(#koi-blob-2)" />
      <circle cx="10%" cy="70%" r="160" fill="url(#koi-blob-2)" />
      <circle cx="92%" cy="92%" r="120" fill="url(#koi-blob-1)" />
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

const TIPS: Array<[string, string]> = [
  ['全24問', '約3分で終わります'],
  ['いつでも中断OK', '直感で答えてOK'],
  ['正解はない', 'シェアは任意'],
];

const CHARACTER_SAMPLES: Array<{
  src: string;
  alt: string;
  code: string;
  name: string;
  caption: string;
  cardBg: string;
}> = [
  {
    src: '/characters/lion-hero.png',
    alt: 'タイプ LPWI「太陽の恋人」のライオンキャラクター',
    code: 'LPWI',
    name: '太陽の恋人',
    caption: '輝いて誘う人',
    cardBg: 'linear-gradient(180deg, #FFF6E5 0%, #FFE9D6 100%)',
  },
  {
    src: '/characters/duck-wink.png',
    alt: 'タイプ FSAE「湖の番人」のアヒルキャラクター',
    code: 'FSAE',
    name: '湖の番人',
    caption: '静かに守る人',
    cardBg: 'linear-gradient(180deg, #FFEAEA 0%, #F8DDDB 100%)',
  },
  {
    src: '/characters/duck-cozy.png',
    alt: 'タイプ FSAE「湖の番人」のアヒル — 穏やかな表情',
    code: 'FSAE',
    name: '湖の番人',
    caption: '穏やかに包む人',
    cardBg: 'linear-gradient(180deg, #FFF1E0 0%, #FCE2C8 100%)',
  },
];

const AXES: Array<{ tag: string; count: string; text: string }> = [
  {
    tag: '主導 / 受容',
    count: 'L · F',
    text: '関係を引っ張っていきたいのか、相手のペースに寄り添いたいのか。',
  },
  {
    tag: '情熱 / 安定',
    count: 'P · S',
    text: 'ドキドキする恋を求めるのか、穏やかな日常を大切にするのか。',
  },
  {
    tag: '言葉 / 行動',
    count: 'W · A',
    text: '気持ちを言葉で伝えたいのか、行動でそっと示したいのか。',
  },
  {
    tag: '自由 / 一途',
    count: 'I · E',
    text: '自分の世界を保ちたいのか、ひとりの相手に深く向き合いたいのか。',
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--koi-bg)] text-[var(--koi-ink)]">
      <PastelBlobs />

      {/* Header — logo */}
      <header className="relative mx-auto flex w-full max-w-2xl items-center gap-2 px-7 pt-8 pb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--koi-primary)] text-white">
          <HeartIcon className="h-3.5 w-3.5" />
        </span>
        <span className="font-serif-jp text-[15px] font-medium tracking-[0.08em]">
          renAI
        </span>
      </header>

      {/* Hero */}
      <section className="relative mx-auto w-full max-w-2xl px-7 pt-10 pb-12">
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--koi-bg-card)] px-3 py-1.5 text-[11px] text-[var(--koi-ink-soft)] shadow-[0_1px_2px_var(--koi-line)]">
          <SparkleIcon className="h-3 w-3 text-[var(--koi-primary-deep)]" />
          24問・約3分で診断
        </div>

        <h1 className="font-serif-jp text-[40px] font-medium leading-[1.25] tracking-[-0.01em] sm:text-[56px]">
          あなたの
          <br />
          恋のかたちは、
          <br />
          <span className="italic text-[var(--koi-primary-deep)]">
            16のうちのどれ?
          </span>
        </h1>

        <p className="mt-5 max-w-md text-[14px] leading-[1.8] text-[var(--koi-ink-soft)] sm:text-[15px]">
          24の問いに答えると、
          <br />
          あなただけの恋愛タイプが見つかります。
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:max-w-xs">
          <Link
            href="/diagnosis/start"
            className="flex h-14 w-full items-center justify-center rounded-[28px] bg-[var(--koi-ink)] text-[15px] font-semibold tracking-[0.04em] text-white shadow-[0_8px_20px_var(--koi-primary-soft)] transition-transform hover:-translate-y-0.5"
          >
            診断をはじめる
          </Link>
          <Link
            href="/types"
            className="flex h-11 w-full items-center justify-center rounded-[22px] text-[13px] text-[var(--koi-ink-soft)] transition-colors hover:text-[var(--koi-ink)]"
          >
            16タイプを見る →
          </Link>
        </div>
      </section>

      {/* Character gallery — sample of the AI-generated personas */}
      <section
        id="characters"
        className="relative mx-auto w-full max-w-2xl px-7 py-10"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
              CHARACTERS
            </div>
            <h2 className="font-serif-jp mt-1.5 text-[22px] font-medium leading-[1.4]">
              あなただけの
              <br />
              キャラクターが届きます
            </h2>
          </div>
          <SparkleIcon className="h-3 w-3 flex-shrink-0 text-[var(--koi-primary-deep)]" />
        </div>

        <p className="mt-3 max-w-md text-[13px] leading-[1.85] text-[var(--koi-ink-soft)]">
          診断結果に応じて、16 タイプそれぞれの動物キャラクターが
          AI で描き起こされます。あなたの軸の傾きに合わせて、
          表情やポーズも少しずつ変わります。
        </p>

        {/* Gallery grid */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {CHARACTER_SAMPLES.map((sample, i) => (
            <figure
              key={`${sample.code}-${i}`}
              className="relative aspect-[5/6] overflow-hidden rounded-2xl shadow-[0_4px_18px_var(--koi-line)] transition-transform hover:-translate-y-0.5"
              style={{ background: sample.cardBg }}
            >
              <Image
                src={sample.src}
                alt={sample.alt}
                fill
                sizes="(min-width: 640px) 200px, 45vw"
                className="object-contain"
                priority={i === 0}
              />
              {/* Bottom gradient + caption */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
                style={{
                  background:
                    'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 45%, transparent 100%)',
                }}
                aria-hidden
              />
              <figcaption className="absolute inset-x-0 bottom-0 px-3 pb-3 text-center">
                <div className="font-mono text-[8px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
                  {sample.code}
                </div>
                <div className="font-serif-jp mt-0.5 text-[13px] font-medium leading-tight text-[var(--koi-ink)]">
                  {sample.name}
                </div>
                <div className="mt-0.5 text-[10px] text-[var(--koi-ink-soft)]">
                  {sample.caption}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] text-[var(--koi-ink-muted)]">
          ※ 画像は生成例です。あなたの結果に合わせて毎回描き起こされます。
        </p>
      </section>

      {/* 4 axes */}
      <section
        id="axes"
        className="relative mx-auto w-full max-w-2xl px-7 py-10"
      >
        <h2 className="font-serif-jp text-[22px] font-medium leading-[1.4]">
          4つの軸から、
          <br />
          あなたの恋ごころを読み解く
        </h2>

        <div className="mt-7 flex flex-col gap-3">
          {AXES.map(({ tag, count, text }) => (
            <article
              key={tag}
              className="relative overflow-hidden rounded-2xl bg-[var(--koi-bg-card)] p-5 shadow-[0_1px_0_var(--koi-line)]"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--koi-primary-soft)] opacity-50" />
              <div className="relative">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-serif-jp text-[17px] font-medium">
                    {tag}
                  </h3>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--koi-ink-muted)]">
                    {count}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-[1.8] text-[var(--koi-ink-soft)]">
                  {text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative mx-auto w-full max-w-2xl px-7 py-10">
        <h2 className="font-serif-jp text-[22px] font-medium leading-[1.4]">
          診断の流れ
        </h2>

        <div className="mt-6 flex flex-col gap-3">
          {TIPS.map(([title, sub]) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-2xl bg-[var(--koi-bg-card)] px-4 py-3 shadow-[0_1px_0_var(--koi-line)]"
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--koi-primary-soft)] text-[var(--koi-primary-deep)]">
                <CheckIcon className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-[13px] font-semibold leading-tight">
                  {title}
                </div>
                <div className="text-[11px] text-[var(--koi-ink-soft)]">
                  {sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto w-full max-w-2xl px-7 py-14">
        <div className="relative overflow-hidden rounded-[28px] bg-[var(--koi-bg-card)] px-7 py-9 text-center shadow-[0_2px_8px_var(--koi-line)]">
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[var(--koi-primary-soft)] opacity-60" />
          <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[var(--koi-accent)] opacity-40" />
          <div className="relative">
            <h2 className="font-serif-jp text-[22px] font-medium leading-[1.5]">
              あなたの恋ごころを、
              <br />
              見つけにいきましょう。
            </h2>
            <p className="mt-3 text-[12px] text-[var(--koi-ink-soft)]">
              無料・登録不要・約3分
            </p>
            <Link
              href="/diagnosis/start"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-[24px] bg-[var(--koi-ink)] px-8 text-[14px] font-semibold tracking-[0.04em] text-white"
            >
              診断をはじめる
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mx-auto w-full max-w-2xl px-7 pb-10 text-center text-[11px] text-[var(--koi-ink-muted)]">
        <p>
          この診断はエンターテインメント目的のものです。
        </p>
      </footer>
    </main>
  );
}
