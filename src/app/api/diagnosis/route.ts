import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { calculateScores } from '@/lib/utils/scoring';
import { buildDiagnosisPrompt } from '@/lib/prompts/diagnosisPrompt';
import { Answer } from '@/types/diagnosis';

export async function POST(request: NextRequest) {
  try {
    const { answers } = (await request.json()) as { answers: Answer[] };

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: '回答データが不正です' },
        { status: 400 }
      );
    }

    // スコア計算
    const { attachmentScores, loveStyleScores } = calculateScores(answers);

    // プロンプト生成
    const prompt = buildDiagnosisPrompt(attachmentScores, loveStyleScores);

    // OpenAI API呼び出し
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'あなたは恋愛心理学の専門家です。科学的根拠に基づいた分析を行い、必ず指定されたJSON形式のみで回答してください。',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    // レスポンス解析
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('AI分析結果が空です');
    }

    const analysis = JSON.parse(content);

    return NextResponse.json({
      success: true,
      result: {
        scores: {
          attachment: attachmentScores,
          loveStyle: loveStyleScores,
        },
        analysis,
      },
    });
  } catch (error) {
    console.error('Diagnosis API error:', error);
    return NextResponse.json(
      { success: false, error: '診断処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
