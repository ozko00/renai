import type { AxisScores, RenAIAxis } from '@/types/diagnosis';
import { axisLabels } from '@/data/types/renAITypes';
import { axisStrengthPercent } from '@/lib/utils/scoring';

interface AxisScoreBarProps {
  axes: AxisScores;
}

const AXIS_ORDER: ReadonlyArray<RenAIAxis> = ['LF', 'PS', 'WA', 'IE'];

const AXIS_META: Record<
  RenAIAxis,
  { eyebrow: string; positiveLetter: string; negativeLetter: string }
> = {
  LF: { eyebrow: 'AXIS 01', positiveLetter: 'L', negativeLetter: 'F' },
  PS: { eyebrow: 'AXIS 02', positiveLetter: 'P', negativeLetter: 'S' },
  WA: { eyebrow: 'AXIS 03', positiveLetter: 'W', negativeLetter: 'A' },
  IE: { eyebrow: 'AXIS 04', positiveLetter: 'I', negativeLetter: 'E' },
};

export default function AxisScoreBar({ axes }: AxisScoreBarProps) {
  return (
    <div className="flex flex-col gap-5">
      {AXIS_ORDER.map((axis) => {
        const score = axes[axis];
        const { positive, negative } = axisStrengthPercent(score);
        const dominantPositive = score >= 0;
        const labels = axisLabels[axis];
        const meta = AXIS_META[axis];

        return (
          <div key={axis} className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em] text-[var(--koi-ink-muted)]">
              <span>{meta.eyebrow}</span>
              <span>
                {meta.positiveLetter} · {meta.negativeLetter}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span
                className={`font-serif-jp text-[14px] ${
                  dominantPositive
                    ? 'font-semibold text-[var(--koi-ink)]'
                    : 'text-[var(--koi-ink-muted)]'
                }`}
              >
                {labels.positive}
              </span>
              <span
                className={`font-serif-jp text-[14px] ${
                  !dominantPositive
                    ? 'font-semibold text-[var(--koi-ink)]'
                    : 'text-[var(--koi-ink-muted)]'
                }`}
              >
                {labels.negative}
              </span>
            </div>

            <div
              className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--koi-bg-soft)]"
              role="img"
              aria-label={`${labels.positive} ${positive}% / ${labels.negative} ${negative}%`}
            >
              <div
                className="absolute left-1/2 top-0 h-full w-px bg-[var(--koi-line)]"
                aria-hidden
              />
              {dominantPositive ? (
                <div
                  className="absolute right-1/2 top-0 h-full rounded-l-full"
                  style={{
                    width: `${(positive - 50)}%`,
                    background:
                      'linear-gradient(90deg, var(--koi-primary-soft), var(--koi-primary))',
                  }}
                />
              ) : (
                <div
                  className="absolute left-1/2 top-0 h-full rounded-r-full"
                  style={{
                    width: `${(negative - 50)}%`,
                    background:
                      'linear-gradient(90deg, var(--koi-accent), var(--koi-primary-deep))',
                  }}
                />
              )}
            </div>

            <div className="flex justify-between text-[10px] font-medium tabular-nums text-[var(--koi-ink-soft)]">
              <span>{positive}%</span>
              <span>{negative}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
