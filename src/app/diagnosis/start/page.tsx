import Link from 'next/link';

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

/**
 * 200×200 monochrome spinning globe with whirl rings.
 * - <g class="koi-globe-rotate"> rotates the country mass
 * - clipPath crops continents to the circular globe shape
 * - 2 whirl rings rotate in opposite directions around the globe
 */
function SpinningGlobe() {
  return (
    <svg
      viewBox="0 0 200 200"
      width={200}
      height={200}
      className="block"
      aria-label="読み込み中"
      role="img"
    >
      <defs>
        <clipPath id="globe-clip">
          <circle cx="100" cy="100" r="60" />
        </clipPath>
      </defs>

      {/* Outer whirl ring (clockwise) */}
      <g className="koi-globe-whirl-cw">
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="var(--koi-ink)"
          strokeWidth="0.8"
          strokeOpacity="0.55"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />
      </g>

      {/* Inner whirl ring (counter-clockwise) */}
      <g className="koi-globe-whirl-ccw">
        <circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke="var(--koi-ink)"
          strokeWidth="0.6"
          strokeOpacity="0.35"
          strokeDasharray="40 14 6 14"
          strokeLinecap="round"
        />
      </g>

      {/* Globe outline */}
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="var(--koi-ink)"
        strokeWidth="1.4"
      />

      {/* Latitude lines (static, give 3D depth) */}
      <g
        fill="none"
        stroke="var(--koi-ink)"
        strokeOpacity="0.18"
        strokeWidth="0.7"
      >
        <ellipse cx="100" cy="100" rx="60" ry="20" />
        <ellipse cx="100" cy="100" rx="60" ry="40" />
        <line x1="40" y1="100" x2="160" y2="100" />
      </g>

      {/* Rotating country mass */}
      <g clipPath="url(#globe-clip)">
        <g
          className="koi-globe-rotate"
          style={{ transformOrigin: '100px 100px' }}
        >
          {/* Two-up tile: countries shown twice horizontally so rotation loops seamlessly */}
          <g fill="var(--koi-ink)" fillOpacity="0.78">
            {/* North America */}
            <path d="M50 78 L62 72 L74 70 L82 74 L88 82 L86 92 L80 100 L72 104 L66 102 L58 98 L52 90 Z" />
            {/* Greenland */}
            <path d="M88 64 L96 60 L102 64 L100 72 L94 74 L90 70 Z" />
            {/* South America */}
            <path d="M76 108 L84 110 L88 118 L86 130 L82 140 L78 138 L74 128 L72 118 Z" />
            {/* Europe */}
            <path d="M104 76 L112 72 L120 74 L122 80 L118 86 L110 84 L106 82 Z" />
            {/* Africa */}
            <path d="M112 92 L122 90 L128 96 L130 108 L126 122 L120 132 L114 130 L110 118 L108 104 Z" />
            {/* Middle East / West Asia */}
            <path d="M126 86 L134 84 L138 90 L136 96 L130 96 L126 92 Z" />
            {/* Asia (large landmass) */}
            <path d="M132 70 L150 66 L168 70 L176 78 L172 88 L162 92 L150 90 L142 86 L134 80 Z" />
            {/* Southeast Asia / India */}
            <path d="M138 96 L146 94 L150 102 L146 108 L140 106 Z" />
            {/* Australia */}
            <path d="M158 122 L172 120 L176 128 L172 136 L162 138 L156 132 Z" />
            {/* Indonesia / Pacific dots */}
            <circle cx="156" cy="114" r="1.6" />
            <circle cx="164" cy="116" r="1.4" />
            <circle cx="170" cy="112" r="1.2" />
            <circle cx="148" cy="118" r="1.1" />
            {/* Japan */}
            <path d="M180 84 L184 82 L184 88 L181 92 Z" />
            {/* New Zealand */}
            <circle cx="184" cy="142" r="1.8" />
            <circle cx="180" cy="146" r="1.4" />

            {/* ===== Duplicate set shifted by +120 (= globe diameter) for seamless loop ===== */}
            <path d="M170 78 L182 72 L194 70 L202 74 L208 82 L206 92 L200 100 L192 104 L186 102 L178 98 L172 90 Z" />
            <path d="M208 64 L216 60 L222 64 L220 72 L214 74 L210 70 Z" />
            <path d="M196 108 L204 110 L208 118 L206 130 L202 140 L198 138 L194 128 L192 118 Z" />
            <path d="M224 76 L232 72 L240 74 L242 80 L238 86 L230 84 L226 82 Z" />
            <path d="M232 92 L242 90 L248 96 L250 108 L246 122 L240 132 L234 130 L230 118 L228 104 Z" />
            <path d="M246 86 L254 84 L258 90 L256 96 L250 96 L246 92 Z" />
            <path d="M252 70 L270 66 L288 70 L296 78 L292 88 L282 92 L270 90 L262 86 L254 80 Z" />
            <path d="M258 96 L266 94 L270 102 L266 108 L260 106 Z" />
            <path d="M278 122 L292 120 L296 128 L292 136 L282 138 L276 132 Z" />
            <circle cx="276" cy="114" r="1.6" />
            <circle cx="284" cy="116" r="1.4" />
            <circle cx="290" cy="112" r="1.2" />
            <circle cx="268" cy="118" r="1.1" />
            <path d="M300 84 L304 82 L304 88 L301 92 Z" />
            <circle cx="304" cy="142" r="1.8" />
            <circle cx="300" cy="146" r="1.4" />
          </g>
        </g>
      </g>

      {/* Specular highlight (gives subtle sphere feeling) */}
      <ellipse
        cx="82"
        cy="80"
        rx="18"
        ry="10"
        fill="var(--koi-ink)"
        fillOpacity="0.04"
        transform="rotate(-30 82 80)"
      />
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
