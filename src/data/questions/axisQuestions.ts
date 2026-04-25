import { AxisQuestion } from '@/types/diagnosis';

// 24問。軸ごとに6問ずつ。
// スコア計算: 値1〜5 を中央3を基準に -2..+2 に変換、reverse=true なら符号反転。
// 全問 +方向(高スコア=「とてもそう思う」)が軸前者(L/P/W/I)に寄る設計のため、
// 現状すべて reverse は不要。
export const axisQuestions: ReadonlyArray<AxisQuestion> = [
  // 軸1: L=主導 / F=受容
  { id: 1, axis: 'LF', text: 'デートの計画は自分から提案したい' },
  { id: 2, axis: 'LF', text: '気になる人には自分から話しかけにいく' },
  { id: 3, axis: 'LF', text: '関係をリードしていく方が落ち着く' },
  { id: 4, axis: 'LF', text: '相手のペースに合わせるより、自分のペースで進めたい' },
  { id: 5, axis: 'LF', text: '初対面でも先に自己紹介するタイプだ' },
  { id: 6, axis: 'LF', text: '迷っている相手の背中を押したくなる' },

  // 軸2: P=情熱 / S=安定
  { id: 7, axis: 'PS', text: '恋はドキドキするものであってほしい' },
  { id: 8, axis: 'PS', text: '一目惚れは、ある' },
  { id: 9, axis: 'PS', text: '穏やかな日常より、刺激的な瞬間を求めてしまう' },
  { id: 10, axis: 'PS', text: '感情の波があるくらいがちょうどいい' },
  { id: 11, axis: 'PS', text: 'サプライズや非日常が好きだ' },
  { id: 12, axis: 'PS', text: '熱しやすい方だと思う' },

  // 軸3: W=言葉 / A=行動
  { id: 13, axis: 'WA', text: '「好き」はちゃんと言葉で伝えたい' },
  { id: 14, axis: 'WA', text: '長文のメッセージを送ることがある' },
  { id: 15, axis: 'WA', text: '気持ちは話し合って解決したい' },
  { id: 16, axis: 'WA', text: '手紙やメモを残すのが好きだ' },
  { id: 17, axis: 'WA', text: '言われないとわからないことが多いと思う' },
  { id: 18, axis: 'WA', text: '気持ちを伝えるなら、贈り物より言葉だ' },

  // 軸4: I=自由 / E=一途
  { id: 19, axis: 'IE', text: '恋人がいても自分の時間は大切にしたい' },
  { id: 20, axis: 'IE', text: '束縛されるのは少し苦手だ' },
  { id: 21, axis: 'IE', text: '友達との約束を恋人より優先することがある' },
  { id: 22, axis: 'IE', text: '一人の趣味を深める時間が好きだ' },
  { id: 23, axis: 'IE', text: '関係に「適度な距離」が欲しい方だ' },
  { id: 24, axis: 'IE', text: '相手にもいろんな世界を持っていてほしい' },
];

export const TOTAL_QUESTIONS = axisQuestions.length;
