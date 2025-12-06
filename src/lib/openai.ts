import OpenAI from 'openai';

// OpenAIクライアントを遅延初期化する関数
export function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set. Please set it in .env.local');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}
