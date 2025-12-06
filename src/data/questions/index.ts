import { attachmentQuestions } from './attachmentQuestions';
import { loveStyleQuestions } from './loveStyleQuestions';
import { Question } from '@/types/diagnosis';

export const allQuestions: Question[] = [...attachmentQuestions, ...loveStyleQuestions];

export { attachmentQuestions, loveStyleQuestions };
