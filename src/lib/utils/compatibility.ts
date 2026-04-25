import type {
  CompatibilityAxisAnalysis,
  CompatibilityResult,
  KoigokoroAxis,
  KoigokoroCode,
} from '@/types/diagnosis';
import { axisLabels, koigokoroTypes } from '@/data/types/koigokoroTypes';

const AXIS_INDEX: Record<KoigokoroAxis, number> = {
  LF: 0,
  PS: 1,
  WA: 2,
  IE: 3,
};

const AXIS_ORDER: ReadonlyArray<KoigokoroAxis> = ['LF', 'PS', 'WA', 'IE'];

const POSITIVE_LETTER: Record<KoigokoroAxis, string> = {
  LF: 'L',
  PS: 'P',
  WA: 'W',
  IE: 'I',
};

const VALID_CODES = new Set<string>(Object.keys(koigokoroTypes));

export function isKoigokoroCode(value: unknown): value is KoigokoroCode {
  return typeof value === 'string' && VALID_CODES.has(value);
}

function letterAt(code: KoigokoroCode, axis: KoigokoroAxis): string {
  return code[AXIS_INDEX[axis]];
}

function axisLabelFor(code: KoigokoroCode, axis: KoigokoroAxis): string {
  const positive = letterAt(code, axis) === POSITIVE_LETTER[axis];
  const labels = axisLabels[axis];
  return positive ? labels.positive : labels.negative;
}

const MATCH_COMMENT: Record<KoigokoroAxis, { match: string; mismatch: string }> = {
  LF: {
    match:
      'リードする / 寄り添う のバランス感覚が似ていて、関係の主導権で衝突しにくい組み合わせ。',
    mismatch:
      '一方がリードし、もう一方が寄り添うかたち。役割が自然と分かれる関係になりやすい。',
  },
  PS: {
    match: '恋の温度感が同じ。盛り上がる場面と落ち着く場面が一緒に来やすい。',
    mismatch:
      '熱と静けさのコントラスト。違いを楽しめれば長くもつ、火力差を翻訳する努力は必要。',
  },
  WA: {
    match: '愛の伝え方の言語が同じ。「ありがとう」が「ありがとう」のまま伝わる。',
    mismatch:
      '言葉派と行動派。すれちがいに見えて、実は両方から愛を受け取れる相性。',
  },
  IE: {
    match: '関係への向き合い方が似ている。距離の取り方で揉めにくい。',
    mismatch: '自由さと一途さの引っぱり合い。どちらも相手の余白を信じる練習が要る。',
  },
};

function buildAxes(
  self: KoigokoroCode,
  other: KoigokoroCode
): CompatibilityAxisAnalysis[] {
  return AXIS_ORDER.map((axis) => {
    const selfLetter = letterAt(self, axis);
    const otherLetter = letterAt(other, axis);
    const match = selfLetter === otherLetter;
    return {
      axis,
      match,
      selfLabel: axisLabelFor(self, axis),
      otherLabel: axisLabelFor(other, axis),
      comment: match ? MATCH_COMMENT[axis].match : MATCH_COMMENT[axis].mismatch,
    };
  });
}

function toneFromMatchCount(matchCount: number): string {
  switch (matchCount) {
    case 4:
      return 'ふたりは同じ方角を見ている、安らぎの相性。';
    case 3:
      return 'ベースが揃っていて、すれちがいも少ない安定の相性。';
    case 2:
      return '似ているところと違うところが半々。お互いを学び合える相性。';
    case 1:
      return 'ちがいの多い組み合わせ。刺激も誤解も生まれやすい、深く話す価値のある関係。';
    default:
      return 'ぜんぶ反対側の組み合わせ。だからこそ気づける景色がある、補完の相性。';
  }
}

function summarize(
  self: KoigokoroCode,
  other: KoigokoroCode,
  axes: CompatibilityAxisAnalysis[],
  matchCount: number
): string {
  const selfType = koigokoroTypes[self];
  const otherType = koigokoroTypes[other];
  const matchedAxes = axes.filter((a) => a.match);
  const mismatchAxes = axes.filter((a) => !a.match);

  const matchPart =
    matchedAxes.length > 0
      ? `「${matchedAxes
          .map((a) => axisLabels[a.axis].positive + ' / ' + axisLabels[a.axis].negative)
          .join('」「')}」の軸で同じ方向を向いていて、自然体でいられる場面が多そうです。`
      : 'すべての軸でちがう方向を向いていて、お互いの世界が交差する相性です。';

  const mismatchPart =
    mismatchAxes.length > 0
      ? `一方で「${mismatchAxes
          .map((a) => axisLabels[a.axis].positive + ' / ' + axisLabels[a.axis].negative)
          .join('」「')}」では役割が分かれる組み合わせ。違いを翻訳しあえると、関係はより深くなります。`
      : '';

  return `${selfType.name}（${selfType.emoji}）と ${otherType.name}（${otherType.emoji}）は、${matchPart}${mismatchPart} ${toneFromMatchCount(matchCount)}`;
}

export function calculateCompatibility(
  self: KoigokoroCode,
  other: KoigokoroCode
): CompatibilityResult {
  const axes = buildAxes(self, other);
  const matchCount = axes.filter((a) => a.match).length;
  // 100 を 4 軸でスムーズに割り振る (0軸=20、1軸=40、2軸=60、3軸=80、4軸=100)
  const score = 20 + matchCount * 20;
  const tone = toneFromMatchCount(matchCount);
  const summary = summarize(self, other, axes, matchCount);

  return {
    selfCode: self,
    otherCode: other,
    score,
    tone,
    axes,
    summary,
  };
}
