import { AxisScores, RenAICode } from '@/types/diagnosis';
import { renAITypes } from '@/data/types/renAITypes';

const AXIS_DESCRIPTION: Record<string, string> = {
  LF: '主導(L) ↔ 受容(F)',
  PS: '情熱(P) ↔ 安定(S)',
  WA: '言葉(W) ↔ 行動(A)',
  IE: '自由(I) ↔ 一途(E)',
};

function formatAxis(score: number): string {
  const pct = Math.round(((score + 1) / 2) * 100);
  return `${score >= 0 ? '+' : ''}${score.toFixed(2)} (前者寄り ${pct}%)`;
}

export function buildDiagnosisPrompt(
  code: RenAICode,
  axes: AxisScores
): string {
  const type = renAITypes[code];
  return `あなたは恋愛心理学に詳しい優しいカウンセラーです。
ユーザーの恋愛タイプ診断結果から、温かく前向きなパーソナルメッセージを作成してください。

## 診断結果
- タイプコード: ${code}
- タイプ名: ${type.name} ${type.emoji}
- 一行表現: ${type.short}
- 性格傾向: ${type.desc}

## 4軸スコア (-1.0 ~ +1.0、+ 方向 = 軸前者)
- LF (${AXIS_DESCRIPTION.LF}): ${formatAxis(axes.LF)}
- PS (${AXIS_DESCRIPTION.PS}): ${formatAxis(axes.PS)}
- WA (${AXIS_DESCRIPTION.WA}): ${formatAxis(axes.WA)}
- IE (${AXIS_DESCRIPTION.IE}): ${formatAxis(axes.IE)}

## 出力形式 (厳密にこのJSONのみ)
{
  "summary": "${type.name}としてのあなたの恋愛観を、4軸スコアを踏まえて200文字程度で温かく描写。「あなた」二人称、日本語",
  "advice": [
    "短い具体アドバイス1 (40文字程度、二人称、行動可能な内容)",
    "短い具体アドバイス2 (40文字程度)",
    "短い具体アドバイス3 (40文字程度)"
  ]
}

注意:
- 必ず上記 JSON のみを返す。前置きや説明は不要。
- 「ユーザー」「あなた様」は使わず「あなた」で統一。
- ポジティブで詩的な、けれど押しつけがましくないトーン。
- **スコアの数値や軸記号 (LF / PS / WA / IE / -0.17 / +0.5 等) を summary や advice の文中に絶対に含めない。** 数値ではなく「情熱寄り」「受容的」「言葉を大切にする」のような自然な日本語表現に必ず変換する。
- 軸の傾向が極端に出ている場合は、その軸の特徴を自然な言葉で表現に織り込む (記号や数値ではなく)。
- summary は型ステレオタイプの繰り返しではなく、軸の傾向の個別性を自然言語で描写する。`;
}
