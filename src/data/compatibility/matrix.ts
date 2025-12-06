import { AttachmentType, LoveStyleType, CompatibilityInfo } from '@/types/diagnosis';

// 愛着スタイル相性マトリックス（chart_script.pyより）
export const attachmentCompatibility: Record<
  AttachmentType,
  Record<AttachmentType, CompatibilityInfo>
> = {
  secure: {
    secure: {
      score: 5,
      label: '最高の相性',
      description: '相互信頼、オープンなコミュニケーション、バランスの取れた親密さと自立。最も安定した関係を築けます。',
    },
    preoccupied: {
      score: 4,
      label: '良好',
      description: '安定型が安心感を提供。不安型の感情的ニーズに応えることで、満足度の高い関係が可能。',
    },
    dismissive: {
      score: 4,
      label: '良好',
      description: '安定型が安全基地となる。回避型が徐々に心を開くための時間と空間を提供できる。',
    },
    fearful: {
      score: 3,
      label: '努力次第',
      description: '安定型がアンカーとなるが、恐れ型の予測不可能なニーズに対応する忍耐が必要。',
    },
  },
  preoccupied: {
    secure: {
      score: 4,
      label: '良好',
      description: '安定型がグラウンディングを提供。不安が軽減され、健全な関係パターンを学べる。',
    },
    preoccupied: {
      score: 2,
      label: '要注意',
      description: '相互の不安が増幅しやすい。依存サイクルに陥る可能性があり、嫉妬心も高まりがち。',
    },
    dismissive: {
      score: 1,
      label: '困難',
      description: '最も困難な組み合わせ。追求-撤退のサイクルが生じやすく、双方にフラストレーション。',
    },
    fearful: {
      score: 1,
      label: '不安定',
      description: '競合する愛着ニーズにより、予測不可能な葛藤が生じやすい。',
    },
  },
  dismissive: {
    secure: {
      score: 4,
      label: '良好',
      description: '安定型が安心感を提供。回避型が心を開くまでの時間を尊重できる関係。',
    },
    preoccupied: {
      score: 1,
      label: '困難',
      description: '不安型が追い、回避型が逃げる有害なパターン。コミュニケーション不全に陥りやすい。',
    },
    dismissive: {
      score: 2,
      label: '距離あり',
      description: '双方が距離を保つため表面的なつながりになりがち。安定はするが親密さに欠ける。',
    },
    fearful: {
      score: 1,
      label: '困難',
      description: '双方が親密さを恐れ、感情的なつながりが希薄。葛藤リスクが高い。',
    },
  },
  fearful: {
    secure: {
      score: 3,
      label: '努力次第',
      description: '安定型が安定を提供するが、恐れ型が自分の価値を信じられるようになるまで時間がかかる。',
    },
    preoccupied: {
      score: 1,
      label: '不安定',
      description: '互いの恐れが交錯し、親密さと距離の間で揺れ動く。感情的な混乱が生じやすい。',
    },
    dismissive: {
      score: 1,
      label: '困難',
      description: '双方が親密さを恐れ、分断と最小限の成長しか望めない。',
    },
    fearful: {
      score: 2,
      label: '混沌',
      description: '相互の恐れと回避により、激しい葛藤や関係解消のリスクが高い。',
    },
  },
};

// 愛のスタイル相性マトリックス
export const loveStyleCompatibility: Record<
  LoveStyleType,
  Record<LoveStyleType, CompatibilityInfo>
> = {
  eros: {
    eros: { score: 4, label: '情熱的', description: '強い情熱で結ばれるが、長期的な維持には工夫が必要' },
    ludus: { score: 2, label: '不一致', description: '真剣さと軽さの違いで摩擦が生じやすい' },
    storge: { score: 5, label: '理想的', description: '情熱と安定のバランスが取れた理想的な組み合わせ' },
    pragma: { score: 3, label: '補完的', description: '感情と理性のバランスを取れれば良い関係に' },
    mania: { score: 2, label: '激動', description: '情熱が強すぎて消耗しやすい' },
    agape: { score: 4, label: '献身的', description: 'Agapeの献身がErosの情熱を安定させる' },
  },
  ludus: {
    eros: { score: 2, label: '不一致', description: '恋愛への真剣さの違いで葛藤が生じる' },
    ludus: { score: 3, label: '楽しい', description: '互いに楽しめるが長続きしにくい' },
    storge: { score: 2, label: '価値観の違い', description: '安定を求めるStorgeとの相性は難しい' },
    pragma: { score: 2, label: '方向性の違い', description: '目標の違いが障壁になる' },
    mania: { score: 1, label: '危険', description: 'Maniaを深く傷つける可能性が高い' },
    agape: { score: 2, label: '一方通行', description: 'Agapeの献身がLudusに利用されるリスク' },
  },
  storge: {
    eros: { score: 5, label: '理想的', description: '友情ベースに情熱が加わる最高の組み合わせ' },
    ludus: { score: 2, label: '価値観の違い', description: '安定を求めるStorgeには合わない' },
    storge: { score: 5, label: '最高', description: '深い友情と理解に基づく安定した関係' },
    pragma: { score: 4, label: '堅実', description: '共通の価値観で長続きする関係' },
    mania: { score: 2, label: '圧倒される', description: 'Maniaの激しさについていけない' },
    agape: { score: 4, label: '相互尊重', description: '穏やかで献身的な関係が築ける' },
  },
  pragma: {
    eros: { score: 3, label: '補完的', description: '感情と理性のバランスが取れれば成功' },
    ludus: { score: 2, label: '方向性の違い', description: '将来の目標が合わない' },
    storge: { score: 4, label: '堅実', description: '共通の目標で安定した関係' },
    pragma: { score: 4, label: '合理的', description: '互いの条件が合えば長続き' },
    mania: { score: 1, label: '不適合', description: '感情的な激しさに対応困難' },
    agape: { score: 3, label: 'バランス', description: '実用性と献身のバランスが鍵' },
  },
  mania: {
    eros: { score: 2, label: '激動', description: '情熱が暴走しやすい' },
    ludus: { score: 1, label: '危険', description: 'Ludusの軽さに深く傷つく' },
    storge: { score: 2, label: '圧倒', description: 'Storgeが圧倒されてしまう' },
    pragma: { score: 1, label: '不適合', description: '感情と理性の衝突' },
    mania: { score: 1, label: '危険', description: '互いの不安定さが増幅される最悪の組み合わせ' },
    agape: { score: 3, label: '癒やし', description: 'Agapeの無条件の愛が癒やしになる可能性' },
  },
  agape: {
    eros: { score: 4, label: '献身的', description: '情熱を献身で支える良い関係' },
    ludus: { score: 2, label: '一方通行', description: '献身が利用されるリスク' },
    storge: { score: 4, label: '相互尊重', description: '穏やかで温かい関係' },
    pragma: { score: 3, label: 'バランス', description: '実用性と献身のバランス' },
    mania: { score: 3, label: '癒やし', description: '無条件の愛がManiaを安定させる可能性' },
    agape: { score: 4, label: '理想的', description: '互いに与え合う美しい関係' },
  },
};

// 相性スコアの説明
export const compatibilityScoreLabels: Record<number, string> = {
  1: '困難',
  2: '要努力',
  3: '普通',
  4: '良好',
  5: '最高',
};
