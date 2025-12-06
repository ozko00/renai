import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import {
  buildGeneralCompatibilityPrompt,
  buildSpecificCompatibilityPrompt,
} from '@/lib/prompts/compatibilityPrompt';
import { AttachmentType, LoveStyleType, CompatibilityMode } from '@/types/diagnosis';

interface CompatibilityRequest {
  mode: CompatibilityMode;
  userAttachment: AttachmentType;
  userLoveStyle: LoveStyleType;
  partnerAttachment?: AttachmentType;
  partnerLoveStyle?: LoveStyleType;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CompatibilityRequest;
    const { mode, userAttachment, userLoveStyle, partnerAttachment, partnerLoveStyle } = body;

    if (!userAttachment || !userLoveStyle) {
      return NextResponse.json(
        { success: false, error: 'ユーザータイプが指定されていません' },
        { status: 400 }
      );
    }

    let prompt: string;

    if (mode === 'specific' && partnerAttachment && partnerLoveStyle) {
      prompt = buildSpecificCompatibilityPrompt(
        userAttachment,
        userLoveStyle,
        partnerAttachment,
        partnerLoveStyle
      );
    } else {
      prompt = buildGeneralCompatibilityPrompt(userAttachment, userLoveStyle);
    }

    // OpenAI API呼び出し
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'あなたは恋愛心理学の専門家です。科学的根拠に基づいた相性分析を行い、必ず指定されたJSON形式のみで回答してください。',
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
      mode,
      result: analysis,
    });
  } catch (error) {
    console.error('Compatibility API error:', error);
    return NextResponse.json(
      { success: false, error: '相性診断処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
