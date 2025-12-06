'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { allQuestions } from '@/data/questions';
import { Answer } from '@/types/diagnosis';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const QUESTIONS_PER_PAGE = 10;
const scaleLabels = [
  { value: 5, label: '非常に当てはまる' },
  { value: 4, label: 'やや当てはまる' },
  { value: 3, label: 'どちらとも言えない' },
  { value: 2, label: 'あまり当てはまらない' },
  { value: 1, label: '全く当てはまらない' },
];

export default function QuestionForm() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(allQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = allQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / allQuestions.length) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const canGoNext = currentQuestions.every((q) => answers[q.id] !== undefined);
  const isLastPage = currentPage === totalPages - 1;
  const allAnswered = answeredCount === allQuestions.length;

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleNext = () => {
    if (canGoNext && !isLastPage) {
      setCurrentPage((prev) => prev + 1);
      setTimeout(scrollToTop, 0);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      setTimeout(scrollToTop, 0);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formattedAnswers: Answer[] = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value: value as 1 | 2 | 3 | 4 | 5,
      }));

      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '診断に失敗しました');
      }

      localStorage.setItem('diagnosisResult', JSON.stringify(data.result));
      router.push('/diagnosis/result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '診断に失敗しました');
      setIsSubmitting(false);
    }
  };

  const getSectionLabel = (index: number) => {
    if (index < 20) return '愛着スタイル';
    return '愛のスタイル';
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="sticky top-0 bg-white/95 backdrop-blur py-4 z-10 border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              回答済み: {answeredCount} / {allQuestions.length}
            </span>
            <span>
              ページ {currentPage + 1} / {totalPages}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Section Label */}
      <div className="text-center">
        <span className="inline-block px-4 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
          {getSectionLabel(startIndex)}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentQuestions.map((question, idx) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 py-3">
              <CardTitle className="text-base font-medium">
                Q{startIndex + idx + 1}. {question.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
                className="space-y-2"
              >
                {scaleLabels.map((scale) => (
                  <div key={scale.value} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={scale.value.toString()}
                      id={`${question.id}-${scale.value}`}
                    />
                    <Label
                      htmlFor={`${question.id}-${scale.value}`}
                      className="text-sm cursor-pointer flex-1 py-2"
                    >
                      {scale.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          前へ
        </Button>

        {isLastPage ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="bg-rose-500 hover:bg-rose-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI分析中...
              </>
            ) : (
              '結果を見る'
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canGoNext}>
            次へ
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
