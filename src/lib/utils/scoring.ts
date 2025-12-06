import {
  Answer,
  AttachmentScores,
  LoveStyleScores,
  AttachmentType,
  LoveStyleType,
} from '@/types/diagnosis';
import { allQuestions } from '@/data/questions';

export function calculateScores(answers: Answer[]): {
  attachmentScores: AttachmentScores;
  loveStyleScores: LoveStyleScores;
} {
  // 初期化
  const attachmentScores: AttachmentScores = {
    secure: 0,
    preoccupied: 0,
    dismissive: 0,
    fearful: 0,
  };

  const loveStyleScores: LoveStyleScores = {
    eros: 0,
    ludus: 0,
    storge: 0,
    pragma: 0,
    mania: 0,
    agape: 0,
  };

  // 回答をマップに変換
  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  // 各質問のスコアを集計
  for (const question of allQuestions) {
    const value = answerMap.get(question.id);
    if (value === undefined) continue;

    // 逆転項目の処理
    const score = question.isReversed ? 6 - value : value;

    if (question.category === 'attachment') {
      const type = question.targetType as AttachmentType;
      attachmentScores[type] += score;
    } else {
      const type = question.targetType as LoveStyleType;
      loveStyleScores[type] += score;
    }
  }

  return { attachmentScores, loveStyleScores };
}

export function getPrimaryAttachmentType(scores: AttachmentScores): AttachmentType {
  const entries = Object.entries(scores) as [AttachmentType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function getPrimaryLoveStyleType(scores: LoveStyleScores): LoveStyleType {
  const entries = Object.entries(scores) as [LoveStyleType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function getSecondaryLoveStyleType(scores: LoveStyleScores): LoveStyleType | undefined {
  const entries = Object.entries(scores) as [LoveStyleType, number][];
  entries.sort((a, b) => b[1] - a[1]);

  // 2位が1位の70%以上のスコアなら表示
  if (entries[1][1] >= entries[0][1] * 0.7) {
    return entries[1][0];
  }
  return undefined;
}

// スコアをパーセンテージに変換（愛着スタイル: 最大25点）
export function attachmentScoreToPercent(score: number): number {
  return Math.round((score / 25) * 100);
}

// スコアをパーセンテージに変換（愛のスタイル: 最大20点）
export function loveStyleScoreToPercent(score: number): number {
  return Math.round((score / 20) * 100);
}
