// 愛着スタイル（4タイプ）
export type AttachmentType = 'secure' | 'preoccupied' | 'dismissive' | 'fearful';

// 愛のスタイル（6タイプ）
export type LoveStyleType = 'eros' | 'ludus' | 'storge' | 'pragma' | 'mania' | 'agape';

// 質問カテゴリ
export type QuestionCategory = 'attachment' | 'loveStyle';

// 質問
export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  targetType: AttachmentType | LoveStyleType;
  isReversed?: boolean;
}

// 回答
export interface Answer {
  questionId: string;
  value: 1 | 2 | 3 | 4 | 5;
}

// スコア
export interface AttachmentScores {
  secure: number;
  preoccupied: number;
  dismissive: number;
  fearful: number;
}

export interface LoveStyleScores {
  eros: number;
  ludus: number;
  storge: number;
  pragma: number;
  mania: number;
  agape: number;
}

// AI分析結果
export interface AttachmentAnalysis {
  primaryType: AttachmentType;
  description: string;
  strengths: string[];
  challenges: string[];
  growthAdvice: string;
}

export interface LoveStyleAnalysis {
  primaryType: LoveStyleType;
  secondaryType?: LoveStyleType;
  description: string;
  relationshipPattern: string;
  compatibleStyles: string[];
}

export interface OverallProfile {
  summary: string;
  idealPartner: string;
  warningPatterns: string;
}

// 診断結果
export interface DiagnosisResult {
  scores: {
    attachment: AttachmentScores;
    loveStyle: LoveStyleScores;
  };
  analysis: {
    attachmentAnalysis: AttachmentAnalysis;
    loveStyleAnalysis: LoveStyleAnalysis;
    overallProfile: OverallProfile;
    recommendations: string[];
  };
}

// 相性情報
export interface CompatibilityInfo {
  score: number;
  label: string;
  description: string;
}

// 相性診断モード
export type CompatibilityMode = 'general' | 'specific';

// 相性診断結果
export interface CompatibilityResult {
  overallCompatibility: {
    score: number;
    summary: string;
  };
  attachmentCompatibility: {
    score: number;
    analysis: string;
    dynamics: string;
  };
  loveStyleCompatibility: {
    score: number;
    analysis: string;
    strengths: string[];
    challenges: string[];
  };
  communication: {
    tips: string[];
    avoidPatterns: string[];
  };
  longTermAdvice: string;
}

// 一般相性結果
export interface GeneralCompatibilityResult {
  bestMatches: {
    attachmentType: AttachmentType;
    loveStyleType: LoveStyleType;
    compatibilityScore: number;
    reason: string;
    tips: string[];
  }[];
  challengingMatches: {
    attachmentType: AttachmentType;
    loveStyleType: LoveStyleType;
    compatibilityScore: number;
    challenges: string;
    solutions: string[];
  }[];
  generalAdvice: string;
}
