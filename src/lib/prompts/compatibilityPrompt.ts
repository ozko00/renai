import { AttachmentType, LoveStyleType } from '@/types/diagnosis';

export function buildGeneralCompatibilityPrompt(
  userAttachment: AttachmentType,
  userLoveStyle: LoveStyleType
): string {
  return `あなたは恋愛心理学の専門家です。以下のユーザーの恋愛タイプに基づいて、相性の良いタイプと注意が必要なタイプを分析してください。

## ユーザーのタイプ
愛着スタイル: ${userAttachment}
愛のスタイル: ${userLoveStyle}

## タイプの意味
愛着スタイル:
- secure（安定型）: 信頼関係を築きやすい
- preoccupied（不安型）: 愛情確認を求める
- dismissive（回避型）: 独立性を重視
- fearful（恐れ・回避型）: 親密さを求めつつ恐れる

愛のスタイル:
- eros: 情熱的
- ludus: 遊び心
- storge: 友情ベース
- pragma: 論理的
- mania: 執着的
- agape: 献身的

## 出力形式（厳密にこのJSON形式で出力してください）
{
  "bestMatches": [
    {
      "attachmentType": "secure|preoccupied|dismissive|fearful のいずれか",
      "loveStyleType": "eros|ludus|storge|pragma|mania|agape のいずれか",
      "compatibilityScore": 1〜100の数値,
      "reason": "相性が良い理由（150文字程度、日本語）",
      "tips": ["関係を良くするコツ1", "コツ2"]
    },
    {
      "attachmentType": "2番目に相性の良いタイプ",
      "loveStyleType": "対応する愛のスタイル",
      "compatibilityScore": 1〜100の数値,
      "reason": "相性が良い理由（150文字程度、日本語）",
      "tips": ["コツ1", "コツ2"]
    }
  ],
  "challengingMatches": [
    {
      "attachmentType": "注意が必要なタイプ",
      "loveStyleType": "対応する愛のスタイル",
      "compatibilityScore": 1〜100の数値,
      "challenges": "起こりうる課題（100文字程度、日本語）",
      "solutions": ["乗り越えるヒント1", "ヒント2"]
    }
  ],
  "generalAdvice": "恋愛における全般的なアドバイス（200文字程度、日本語）"
}

注意事項:
- 必ず上記のJSON形式のみを出力してください
- 日本語で回答してください
- 科学的根拠に基づいた分析を行ってください`;
}

export function buildSpecificCompatibilityPrompt(
  userAttachment: AttachmentType,
  userLoveStyle: LoveStyleType,
  partnerAttachment: AttachmentType,
  partnerLoveStyle: LoveStyleType
): string {
  return `あなたは恋愛心理学の専門家です。二人の恋愛タイプに基づいて詳細な相性分析を行ってください。

## あなたのタイプ
愛着スタイル: ${userAttachment}
愛のスタイル: ${userLoveStyle}

## パートナーのタイプ
愛着スタイル: ${partnerAttachment}
愛のスタイル: ${partnerLoveStyle}

## 出力形式（厳密にこのJSON形式で出力してください）
{
  "overallCompatibility": {
    "score": 1〜100の数値,
    "summary": "二人の相性の総合分析（250文字程度、日本語）"
  },
  "attachmentCompatibility": {
    "score": 1〜5の数値,
    "analysis": "愛着スタイルの相性分析（150文字程度、日本語）",
    "dynamics": "二人の間で起こりやすい力学（100文字程度、日本語）"
  },
  "loveStyleCompatibility": {
    "score": 1〜5の数値,
    "analysis": "愛のスタイルの相性分析（150文字程度、日本語）",
    "strengths": ["二人の強み1", "強み2"],
    "challenges": ["注意点1", "注意点2"]
  },
  "communication": {
    "tips": ["コミュニケーションのコツ1", "コツ2", "コツ3"],
    "avoidPatterns": ["避けるべきパターン1", "パターン2"]
  },
  "longTermAdvice": "長期的な関係を築くためのアドバイス（200文字程度、日本語）"
}

注意事項:
- 必ず上記のJSON形式のみを出力してください
- 日本語で回答してください
- 科学的根拠に基づいた分析を行ってください
- ポジティブかつ建設的なトーンで書いてください`;
}
