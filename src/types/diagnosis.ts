// 4 軸 (LF=主導/受容, PS=情熱/安定, WA=言葉/行動, IE=自由/一途)
export type KoigokoroAxis = 'LF' | 'PS' | 'WA' | 'IE';

// 16 タイプコード (各軸の前者を選んだ場合のみ L/P/W/I、後者なら F/S/A/E)
export type KoigokoroCode =
  | 'LPWI' | 'LPWE' | 'LPAI' | 'LPAE'
  | 'LSWI' | 'LSWE' | 'LSAI' | 'LSAE'
  | 'FPWI' | 'FPWE' | 'FPAI' | 'FPAE'
  | 'FSWI' | 'FSWE' | 'FSAI' | 'FSAE';

// Likert 5 段階 (1=とてもそう思う ... 5=全く思わない)
export type LikertValue = 1 | 2 | 3 | 4 | 5;

// 質問
export interface AxisQuestion {
  id: number;
  axis: KoigokoroAxis;
  text: string;
  // reverse=true なら値を反転して集計 (現状は全問 reverse=false)
  reverse?: boolean;
}

// 回答 (1問1値)
export type AxisAnswers = Record<number, LikertValue>;

// 各軸のスコア (-1.0 .. +1.0、+方向 = 軸前者)
export type AxisScores = Record<KoigokoroAxis, number>;

// 16 タイプ情報
export interface KoigokoroType {
  code: KoigokoroCode;
  name: string;
  emoji: string;
  tone: string; // tone color hex
  desc: string;
  short: string;
}

// 診断結果 (新スキーマ v2)
export interface DiagnosisResult {
  version: 2;
  code: KoigokoroCode;
  name: string;
  emoji: string;
  axes: AxisScores;
  summary: string;
  advice: string[];
}

// 旧スキーマ (マイグレーション専用)
export type LegacyAttachmentType = 'secure' | 'preoccupied' | 'dismissive' | 'fearful';
export type LegacyLoveStyleType = 'eros' | 'ludus' | 'storge' | 'pragma' | 'mania' | 'agape';

export interface LegacyDiagnosisResult {
  scores?: {
    attachment?: Record<LegacyAttachmentType, number>;
    loveStyle?: Record<LegacyLoveStyleType, number>;
  };
  analysis?: {
    attachmentAnalysis?: { primaryType?: LegacyAttachmentType };
    loveStyleAnalysis?: { primaryType?: LegacyLoveStyleType };
  };
}

// 相性診断結果
export interface CompatibilityAxisAnalysis {
  axis: KoigokoroAxis;
  match: boolean;
  selfLabel: string;
  otherLabel: string;
  comment: string;
}

export interface CompatibilityResult {
  selfCode: KoigokoroCode;
  otherCode: KoigokoroCode;
  score: number; // 0..100
  tone: string;
  axes: CompatibilityAxisAnalysis[];
  summary: string;
}
