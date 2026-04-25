import {
  AxisAnswers,
  AxisScores,
  RenAIAxis,
  RenAICode,
  LikertValue,
} from '@/types/diagnosis';
import { axisQuestions } from '@/data/questions/axisQuestions';

// 軸ごとに「+方向 = 軸前者」の符号で 4文字コードを組み立てる
const POSITIVE_LETTER: Record<RenAIAxis, string> = {
  LF: 'L',
  PS: 'P',
  WA: 'W',
  IE: 'I',
};
const NEGATIVE_LETTER: Record<RenAIAxis, string> = {
  LF: 'F',
  PS: 'S',
  WA: 'A',
  IE: 'E',
};

const AXIS_ORDER: ReadonlyArray<RenAIAxis> = ['LF', 'PS', 'WA', 'IE'];

// Likert 1=とてもそう思う, 5=全く思わない を -2..+2 に変換
function likertToSigned(value: LikertValue, reverse: boolean): number {
  const signed = 3 - value; // 1 -> +2, 3 -> 0, 5 -> -2
  return reverse ? -signed : signed;
}

export function calculateAxisScores(answers: AxisAnswers): AxisScores {
  const sums: AxisScores = { LF: 0, PS: 0, WA: 0, IE: 0 };
  const counts: Record<RenAIAxis, number> = { LF: 0, PS: 0, WA: 0, IE: 0 };

  for (const q of axisQuestions) {
    const v = answers[q.id];
    if (v === undefined) continue;
    sums[q.axis] += likertToSigned(v, q.reverse ?? false);
    counts[q.axis] += 1;
  }

  const result: AxisScores = { LF: 0, PS: 0, WA: 0, IE: 0 };
  for (const axis of AXIS_ORDER) {
    const max = counts[axis] * 2; // 1問あたり最大±2
    result[axis] = max === 0 ? 0 : sums[axis] / max;
  }
  return result;
}

export function codeFromAxes(scores: AxisScores): RenAICode {
  const code = AXIS_ORDER.map((axis) =>
    scores[axis] >= 0 ? POSITIVE_LETTER[axis] : NEGATIVE_LETTER[axis]
  ).join('');
  return code as RenAICode;
}

// -1..+1 を 0..100 に変換 (中央 = 50)
export function axisToBarPercent(score: number): number {
  const clamped = Math.max(-1, Math.min(1, score));
  return Math.round(((clamped + 1) / 2) * 100);
}

// 軸ラベルの強さを表示するための「軸前者寄りパーセント」(0..100)
// 例: LF=0.8 → 主導 90% / 受け身 10%
export function axisStrengthPercent(score: number): { positive: number; negative: number } {
  const clamped = Math.max(-1, Math.min(1, score));
  const positive = Math.round(((clamped + 1) / 2) * 100);
  return { positive, negative: 100 - positive };
}
