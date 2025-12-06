import { Question } from '@/types/diagnosis';

export const attachmentQuestions: Question[] = [
  // Secure（安定型）- 5問
  {
    id: 'a1',
    text: '恋人に自分の気持ちを素直に伝えることができる',
    category: 'attachment',
    targetType: 'secure',
  },
  {
    id: 'a2',
    text: '恋人と離れていても、関係が安定していると感じる',
    category: 'attachment',
    targetType: 'secure',
  },
  {
    id: 'a3',
    text: '恋人を信頼し、相手も自分を信頼してくれていると思う',
    category: 'attachment',
    targetType: 'secure',
  },
  {
    id: 'a4',
    text: '恋人との関係で、親密さと自立のバランスが取れている',
    category: 'attachment',
    targetType: 'secure',
  },
  {
    id: 'a5',
    text: '恋愛において、相手に頼ることも頼られることも心地よい',
    category: 'attachment',
    targetType: 'secure',
  },

  // Preoccupied（不安型）- 5問
  {
    id: 'a6',
    text: '恋人からの返信が遅いと不安になる',
    category: 'attachment',
    targetType: 'preoccupied',
  },
  {
    id: 'a7',
    text: '恋人が自分を本当に愛しているか確認したくなる',
    category: 'attachment',
    targetType: 'preoccupied',
  },
  {
    id: 'a8',
    text: '恋人が他の人と親しくしていると嫉妬を感じる',
    category: 'attachment',
    targetType: 'preoccupied',
  },
  {
    id: 'a9',
    text: '恋人との関係がうまくいっているか常に気になる',
    category: 'attachment',
    targetType: 'preoccupied',
  },
  {
    id: 'a10',
    text: '恋人に見捨てられるのではないかと心配になることがある',
    category: 'attachment',
    targetType: 'preoccupied',
  },

  // Dismissive（回避型）- 5問
  {
    id: 'a11',
    text: '恋愛よりも自分の時間や活動を優先したい',
    category: 'attachment',
    targetType: 'dismissive',
  },
  {
    id: 'a12',
    text: '恋人に深く依存されると窮屈に感じる',
    category: 'attachment',
    targetType: 'dismissive',
  },
  {
    id: 'a13',
    text: '感情的な話し合いは苦手で、距離を置きたくなる',
    category: 'attachment',
    targetType: 'dismissive',
  },
  {
    id: 'a14',
    text: '恋愛関係において、自分の独立性を保つことが重要だ',
    category: 'attachment',
    targetType: 'dismissive',
  },
  {
    id: 'a15',
    text: '恋人と毎日連絡を取り合う必要はないと思う',
    category: 'attachment',
    targetType: 'dismissive',
  },

  // Fearful（恐れ・回避型）- 5問
  {
    id: 'a16',
    text: '親密になりたいが、傷つくのが怖い',
    category: 'attachment',
    targetType: 'fearful',
  },
  {
    id: 'a17',
    text: '恋人との距離感をどうすればいいかわからなくなる',
    category: 'attachment',
    targetType: 'fearful',
  },
  {
    id: 'a18',
    text: '恋愛において、自分は愛される価値がないと感じることがある',
    category: 'attachment',
    targetType: 'fearful',
  },
  {
    id: 'a19',
    text: '近づきたいと思う一方で、距離を置きたいとも思う',
    category: 'attachment',
    targetType: 'fearful',
  },
  {
    id: 'a20',
    text: '過去の恋愛でのトラウマが、今の関係に影響している',
    category: 'attachment',
    targetType: 'fearful',
  },
];
