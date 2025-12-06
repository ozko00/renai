import { AttachmentScores, LoveStyleScores } from '@/types/diagnosis';

export function buildDiagnosisPrompt(
  attachmentScores: AttachmentScores,
  loveStyleScores: LoveStyleScores
): string {
  return `あなたは恋愛心理学の専門家です。以下の診断結果を分析し、パーソナライズされたアドバイスを提供してください。

## 愛着スタイルスコア（各5問×5点満点=25点満点）
- 安定型 (Secure): ${attachmentScores.secure}/25
- 不安型 (Preoccupied): ${attachmentScores.preoccupied}/25
- 回避型 (Dismissive): ${attachmentScores.dismissive}/25
- 恐れ・回避型 (Fearful): ${attachmentScores.fearful}/25

## 愛のスタイルスコア（各4問×5点満点=20点満点）
- Eros（情熱型）: ${loveStyleScores.eros}/20
- Ludus（遊戯型）: ${loveStyleScores.ludus}/20
- Storge（友愛型）: ${loveStyleScores.storge}/20
- Pragma（実用型）: ${loveStyleScores.pragma}/20
- Mania（熱狂型）: ${loveStyleScores.mania}/20
- Agape（博愛型）: ${loveStyleScores.agape}/20

## タイプの説明
愛着スタイル:
- Secure（安定型）: 信頼関係を築きやすく、親密さと自立のバランスが取れている
- Preoccupied（不安型）: 愛情確認を求め、見捨てられる不安を抱えやすい
- Dismissive（回避型）: 独立性を重視し、感情的距離を保つ傾向
- Fearful（恐れ・回避型）: 親密さを求めつつ、傷つくことを恐れる

愛のスタイル:
- Eros: 情熱的・身体的魅力重視
- Ludus: 遊び心・軽やかな恋愛
- Storge: 友情ベース・安定志向
- Pragma: 論理的・条件重視
- Mania: 執着的・感情の波が激しい
- Agape: 無条件の献身的愛

## 出力形式（厳密にこのJSON形式で出力してください）
{
  "attachmentAnalysis": {
    "primaryType": "secure|preoccupied|dismissive|fearful のいずれか（最高スコアのタイプ）",
    "description": "あなたの愛着スタイルの特徴説明（200文字程度、日本語、「あなた」という二人称で書く）",
    "strengths": ["強み1", "強み2", "強み3"],
    "challenges": ["課題1", "課題2"],
    "growthAdvice": "成長のためのアドバイス（150文字程度、日本語、「あなた」という二人称で書く）"
  },
  "loveStyleAnalysis": {
    "primaryType": "eros|ludus|storge|pragma|mania|agape のいずれか（最高スコアのタイプ）",
    "secondaryType": "2番目に高いスタイル（任意、1位の70%以上のスコアがある場合）",
    "description": "あなたの愛のスタイルの特徴説明（200文字程度、日本語、「あなた」という二人称で書く）",
    "relationshipPattern": "恋愛パターンの傾向（100文字程度、「あなた」という二人称で書く）",
    "compatibleStyles": ["相性の良いスタイル1", "スタイル2"]
  },
  "overallProfile": {
    "summary": "愛着スタイルと愛のスタイルを統合した総合分析（300文字程度、日本語、「あなた」という二人称で書く）",
    "idealPartner": "理想的なパートナー像（150文字程度、日本語、「あなた」という二人称で書く）",
    "warningPatterns": "注意すべき恋愛パターン（100文字程度、日本語、「あなた」という二人称で書く）"
  },
  "recommendations": [
    "具体的なアドバイス1（50文字程度、「あなた」という二人称で書く）",
    "具体的なアドバイス2（50文字程度、「あなた」という二人称で書く）",
    "具体的なアドバイス3（50文字程度、「あなた」という二人称で書く）"
  ]
}

注意事項:
- 必ず上記のJSON形式のみを出力してください
- 日本語で回答してください
- 科学的根拠に基づいた分析を行ってください
- ポジティブかつ建設的なトーンで書いてください
- スコアを正確に分析し、最高スコアのタイプを primaryType として判定してください
- 「このユーザー」「ユーザー」という表現は絶対に使わず、必ず「あなた」という二人称で書いてください`;
}
