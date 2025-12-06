import { LoveStyleType } from '@/types/diagnosis';

export interface LoveStyleTypeInfo {
  id: LoveStyleType;
  name: string;
  nameEn: string;
  description: string;
  characteristics: string[];
  satisfaction: string;
  stability: string;
  optimalPartner: string;
  risks: string[];
  color: string;
}

export const loveStyleTypeInfo: Record<LoveStyleType, LoveStyleTypeInfo> = {
  eros: {
    id: 'eros',
    name: '情熱型',
    nameEn: 'Eros',
    description:
      '強い身体的・感情的な魅力に基づく情熱的な愛。一目惚れを信じ、ロマンチックな恋愛を求めます。',
    characteristics: [
      '強い身体的魅力を重視',
      '情熱的で感情表現が豊か',
      '一目惚れを経験しやすい',
      'ロマンチックな関係を求める',
    ],
    satisfaction: '初期は高いが、情熱が冷めると低下する傾向',
    stability: 'Storgeと組み合わさると安定',
    optimalPartner: '同じくErosタイプか、Storgeタイプで感情的にオープンな人',
    risks: [
      '情熱の冷めによる満足度低下',
      '理想化しすぎる傾向',
      '嫉妬心が強くなる可能性',
    ],
    color: '#DB4545',
  },
  ludus: {
    id: 'ludus',
    name: '遊戯型',
    nameEn: 'Ludus',
    description:
      '恋愛をゲームや楽しみとして捉えるスタイル。コミットメントを避け、軽やかな関係を好みます。',
    characteristics: [
      '恋愛を楽しみとして捉える',
      '複数の相手に興味を持つことも',
      'コミットメントを急がない',
      '駆け引きを楽しむ',
    ],
    satisfaction: '短期的には高いが、長期的には低い',
    stability: '非常に低く、関係の継続が難しい',
    optimalPartner: '同じくLudusタイプでカジュアルな関係を望む人',
    risks: [
      'パートナーを傷つける可能性',
      '深い感情的つながりの欠如',
      '長期的な関係の構築困難',
    ],
    color: '#1FB8CD',
  },
  storge: {
    id: 'storge',
    name: '友愛型',
    nameEn: 'Storge',
    description:
      '友情から発展する穏やかで安定した愛。共通の趣味や価値観を重視し、ゆっくりと関係を育みます。',
    characteristics: [
      '友情ベースの関係を好む',
      '共通の価値観を重視',
      '穏やかで安定した愛情',
      '急がず関係を育む',
    ],
    satisfaction: '長期的に高く安定',
    stability: '非常に高く、離婚率が最も低い',
    optimalPartner: '同じくStorgeかErosタイプで、共通の価値観を持つ人',
    risks: [
      '情熱の欠如と感じることも',
      '関係がマンネリ化する可能性',
      '刺激を求めると物足りなさを感じる',
    ],
    color: '#2E8B57',
  },
  pragma: {
    id: 'pragma',
    name: '実用型',
    nameEn: 'Pragma',
    description:
      '論理的・実用的な視点でパートナーを選ぶスタイル。相性、価値観、将来の計画などを重視します。',
    characteristics: [
      '論理的にパートナーを評価',
      '将来の計画を重視',
      '条件や相性を慎重に検討',
      '感情よりも理性を優先',
    ],
    satisfaction: '中〜高程度で実用的な満足感',
    stability: '高く、合理的な判断に基づく安定',
    optimalPartner: '人生の目標が一致し、価値観が合う人',
    risks: [
      '感情的な深さの欠如',
      '打算的と思われる可能性',
      '情熱的な愛情への欲求が満たされない',
    ],
    color: '#5D878F',
  },
  mania: {
    id: 'mania',
    name: '熱狂型',
    nameEn: 'Mania',
    description:
      '強い執着と感情の波が特徴的な愛。嫉妬や独占欲が強く、感情が不安定になりやすいです。',
    characteristics: [
      '強い執着と依存',
      '嫉妬心が強い',
      '感情の浮き沈みが激しい',
      '相手の注目を常に求める',
    ],
    satisfaction: '非常に低く、感情的な苦痛を伴うことが多い',
    stability: '非常に低く、関係が混乱しやすい',
    optimalPartner: '安定したSecure愛着で、忍耐強い人（ただし要注意）',
    risks: [
      '支配的な行動',
      '感情的な爆発',
      '自己価値を恋愛に依存',
      '不健全な関係パターン',
    ],
    color: '#B4413C',
  },
  agape: {
    id: 'agape',
    name: '博愛型',
    nameEn: 'Agape',
    description:
      '無条件の献身的な愛。見返りを求めず、パートナーの幸福を最優先に考えます。',
    characteristics: [
      '無条件の愛を与える',
      '自己犠牲を厭わない',
      '見返りを期待しない',
      'パートナーの幸福を最優先',
    ],
    satisfaction: '高く、与えることに喜びを感じる',
    stability: '高く、コミットメントが強い',
    optimalPartner: 'Eros、Storge、Pragmaタイプと相性が良い',
    risks: [
      '自己犠牲による燃え尽き',
      '利用される可能性',
      '自分のニーズを無視しがち',
    ],
    color: '#D2BA4C',
  },
};
