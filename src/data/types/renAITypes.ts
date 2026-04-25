import { KoigokoroCode, KoigokoroType } from '@/types/diagnosis';

// 4軸 (LF/PS/WA/IE) の組み合わせで決まる 16タイプ
// 軸1: L=主導 / F=受容
// 軸2: P=情熱 / S=安定
// 軸3: W=言葉 / A=行動
// 軸4: I=自由 / E=一途
export const koigokoroTypes: Record<KoigokoroCode, KoigokoroType> = {
  LPWI: { code: 'LPWI', name: '太陽の恋人', emoji: '🌞', tone: '#F5C896', desc: '言葉で情熱を伝え、自由を愛するリーダー型', short: '輝いて誘う人' },
  LPWE: { code: 'LPWE', name: '薔薇の騎士', emoji: '🌹', tone: '#E89B96', desc: '熱烈な言葉で一途に愛を捧げる', short: '熱く誓う人' },
  LPAI: { code: 'LPAI', name: '流星の旅人', emoji: '☄️', tone: '#C9A3D4', desc: '行動派で情熱的、自由に駆け抜ける', short: '駆け抜ける人' },
  LPAE: { code: 'LPAE', name: '焔の守護者', emoji: '🔥', tone: '#D48E96', desc: '行動で情熱を示し、一途に守り抜く', short: '燃やし守る人' },
  LSWI: { code: 'LSWI', name: '樹の語り部', emoji: '🌳', tone: '#A8C896', desc: '穏やかな言葉で導き、相手の自由を尊重', short: '言葉で支える人' },
  LSWE: { code: 'LSWE', name: '月の詩人', emoji: '🌙', tone: '#A3B5D4', desc: '優しい言葉で深く長く愛を紡ぐ', short: '紡ぎ続ける人' },
  LSAI: { code: 'LSAI', name: '風の案内人', emoji: '🍃', tone: '#A3D4C2', desc: '行動でそっと支え、自由を愛する', short: 'そっと導く人' },
  LSAE: { code: 'LSAE', name: '岩の守り人', emoji: '🪨', tone: '#B5A896', desc: '行動と安定で一途に守る頼れる存在', short: '揺るがず守る人' },
  FPWI: { code: 'FPWI', name: '蝶の歌い手', emoji: '🦋', tone: '#E8B5D4', desc: '感性豊かに言葉で響き、自由に舞う', short: '響かせる人' },
  FPWE: { code: 'FPWE', name: '苺の夢追い', emoji: '🍓', tone: '#E89BB5', desc: '甘い言葉で一途に夢を分かち合う', short: '夢を分かつ人' },
  FPAI: { code: 'FPAI', name: '猫の冒険者', emoji: '🐱', tone: '#D4B596', desc: '気まぐれに行動で愛を示す自由人', short: 'きまぐれな人' },
  FPAE: { code: 'FPAE', name: '林檎の恋', emoji: '🍎', tone: '#D49696', desc: '可愛く尽くし、一途に寄り添う', short: '寄り添う人' },
  FSWI: { code: 'FSWI', name: '雲の読書家', emoji: '☁️', tone: '#C9D4E5', desc: '優しい言葉でゆっくり距離を縮める', short: 'ゆっくり育む人' },
  FSWE: { code: 'FSWE', name: '紫陽花の心', emoji: '💠', tone: '#A8B5D4', desc: '丁寧な言葉で深く長く愛を育てる', short: '深く育む人' },
  FSAI: { code: 'FSAI', name: '小鳥の散歩', emoji: '🐦', tone: '#C2D4A3', desc: '日々の行動でそっと愛を示す', short: 'そっと寄り添う人' },
  FSAE: { code: 'FSAE', name: '湖の番人', emoji: '🪷', tone: '#A3C2D4', desc: '静かな行動で一途に支え続ける', short: '静かに守る人' },
};

export const koigokoroTypeList: ReadonlyArray<KoigokoroType> = Object.values(koigokoroTypes);

// 軸ラベル（結果画面の左右ラベル用）
export const axisLabels = {
  // 左 = 軸後者 (F/S/A/E)、右 = 軸前者 (L/P/W/I)
  // ただし結果画面は「+方向 = 前者」を基準にしているため、両端に並べる
  LF: { positive: '主導', negative: '受け身' },
  PS: { positive: '情熱', negative: '安定' },
  WA: { positive: '言葉', negative: '行動' },
  IE: { positive: '自由', negative: '一途' },
} as const;
