import { AttachmentType } from '@/types/diagnosis';

export interface AttachmentTypeInfo {
  id: AttachmentType;
  name: string;
  nameEn: string;
  description: string;
  characteristics: string[];
  strengths: string[];
  challenges: string[];
  inRelationship: string;
  color: string;
}

export const attachmentTypeInfo: Record<AttachmentType, AttachmentTypeInfo> = {
  secure: {
    id: 'secure',
    name: '安定型',
    nameEn: 'Secure',
    description:
      '恋愛において自然に親密さを築き、信頼関係を育むことができるタイプです。自己肯定感が高く、パートナーへの信頼も強いため、安定した関係を築きやすいです。',
    characteristics: [
      '自分の気持ちを素直に表現できる',
      'パートナーを信頼し、信頼される',
      '親密さと自立のバランスが取れている',
      '葛藤があっても建設的に解決できる',
    ],
    strengths: [
      'オープンなコミュニケーション',
      '感情の安定性',
      '健全な境界線の設定',
      '長期的な関係の維持',
    ],
    challenges: [
      '他のタイプの人を理解しにくいことがある',
      '問題を軽視してしまうことがある',
    ],
    inRelationship:
      '安定した愛情を与え、受け取ることができます。パートナーと適度な距離感を保ちながら、深い絆を築けます。',
    color: '#2E8B57',
  },
  preoccupied: {
    id: 'preoccupied',
    name: '不安型',
    nameEn: 'Preoccupied/Anxious',
    description:
      '恋愛において強い親密さを求め、愛情の確認を必要とするタイプです。パートナーへの愛情は深いですが、見捨てられる不安を抱えやすいです。',
    characteristics: [
      '愛情表現が豊かで情熱的',
      'パートナーの言動に敏感',
      '関係への不安を感じやすい',
      '確認や安心を求める傾向',
    ],
    strengths: [
      '深い感情的つながりを築ける',
      'パートナーへの献身的な愛情',
      '関係を大切にする姿勢',
      '感情表現が豊か',
    ],
    challenges: [
      '嫉妬心が強くなりやすい',
      '過度な確認行動',
      '自己価値を恋愛に依存しがち',
      '別れへの恐怖',
    ],
    inRelationship:
      '深い愛情を注ぐ一方で、パートナーからの愛情の確認を頻繁に求めることがあります。安心感を得られると最高のパートナーになれます。',
    color: '#D2BA4C',
  },
  dismissive: {
    id: 'dismissive',
    name: '回避型',
    nameEn: 'Dismissive/Avoidant',
    description:
      '独立性を重視し、感情的な距離を保つことを好むタイプです。自立心が強く、過度な親密さに不快感を覚えることがあります。',
    characteristics: [
      '自立心が強い',
      '感情的な距離を保つ',
      'プライベートな時間を大切にする',
      '依存されることを避ける',
    ],
    strengths: [
      '自己完結的で精神的に安定',
      '冷静な判断力',
      'パートナーに過度な期待をしない',
      '個人の時間を尊重できる',
    ],
    challenges: [
      '感情表現が苦手',
      '親密さから逃げがち',
      'パートナーを遠ざけてしまう',
      '深い感情的つながりの構築',
    ],
    inRelationship:
      '自分のペースと空間を重視します。感情的になることを避け、理性的なアプローチを好みます。',
    color: '#5D878F',
  },
  fearful: {
    id: 'fearful',
    name: '恐れ・回避型',
    nameEn: 'Fearful-Avoidant',
    description:
      '親密さを求めながらも、同時に傷つくことを恐れて距離を置くタイプです。愛情と恐怖の間で揺れ動くことがあります。',
    characteristics: [
      '親密さへの渇望と恐れの両方を持つ',
      '感情が不安定になりやすい',
      '過去のトラウマの影響を受けやすい',
      '近づいたり離れたりを繰り返す',
    ],
    strengths: [
      '深い共感力',
      '他者の痛みを理解できる',
      '自己成長への意欲',
      '感受性が豊か',
    ],
    challenges: [
      '信頼関係の構築に時間がかかる',
      '予測不可能な行動パターン',
      '自己評価の低さ',
      '関係の安定維持',
    ],
    inRelationship:
      '愛情を求めながらも、傷つくことへの恐れから距離を置いてしまうことがあります。安全な環境で徐々に信頼を築くことが大切です。',
    color: '#DB4545',
  },
};
