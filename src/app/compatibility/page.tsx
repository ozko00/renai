'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AttachmentType, LoveStyleType, DiagnosisResult } from '@/types/diagnosis';
import { attachmentTypeInfo } from '@/data/types/attachmentTypes';
import { loveStyleTypeInfo } from '@/data/types/loveStyleTypes';
import { ChevronLeft, Users, Heart, Loader2, Sparkles } from 'lucide-react';

export default function CompatibilityPage() {
  const router = useRouter();
  const [userResult, setUserResult] = useState<DiagnosisResult | null>(null);
  const [mode, setMode] = useState<'general' | 'specific'>('general');
  const [partnerAttachment, setPartnerAttachment] = useState<AttachmentType | null>(null);
  const [partnerLoveStyle, setPartnerLoveStyle] = useState<LoveStyleType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('diagnosisResult');
    if (stored) {
      try {
        setUserResult(JSON.parse(stored));
      } catch {
        // 診断結果がない場合は診断ページへ
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!userResult) {
      setError('まず診断を受けてください');
      return;
    }

    if (mode === 'specific' && (!partnerAttachment || !partnerLoveStyle)) {
      setError('パートナーのタイプを選択してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const userAttachment = userResult.analysis.attachmentAnalysis.primaryType as AttachmentType;
      const userLoveStyle = userResult.analysis.loveStyleAnalysis.primaryType as LoveStyleType;

      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          userAttachment,
          userLoveStyle,
          partnerAttachment: mode === 'specific' ? partnerAttachment : undefined,
          partnerLoveStyle: mode === 'specific' ? partnerLoveStyle : undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '相性診断に失敗しました');
      }

      localStorage.setItem('compatibilityResult', JSON.stringify({
        mode,
        userAttachment,
        userLoveStyle,
        partnerAttachment,
        partnerLoveStyle,
        result: data.result,
      }));
      router.push('/compatibility/result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '相性診断に失敗しました');
      setIsSubmitting(false);
    }
  };

  const attachmentTypes: AttachmentType[] = ['secure', 'preoccupied', 'dismissive', 'fearful'];
  const loveStyleTypes: LoveStyleType[] = ['eros', 'ludus', 'storge', 'pragma', 'mania', 'agape'];

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={userResult ? '/diagnosis/result' : '/'}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            戻る
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <Users className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">相性診断</h1>
          <p className="text-gray-600">
            {userResult
              ? 'あなたのタイプに合うパートナーを分析します'
              : '先に診断を受けてください'}
          </p>
        </div>

        {!userResult ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600 mb-4">
                相性診断を行うには、まず恋愛タイプ診断を受ける必要があります。
              </p>
              <Link href="/diagnosis">
                <Button className="bg-rose-500 hover:bg-rose-600">
                  <Sparkles className="mr-2 h-5 w-5" />
                  診断を受ける
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* User Type Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">あなたのタイプ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1 text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">愛着スタイル</p>
                    <p className="font-semibold">
                      {attachmentTypeInfo[userResult.analysis.attachmentAnalysis.primaryType as AttachmentType]?.name}
                    </p>
                  </div>
                  <div className="flex-1 text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">愛のスタイル</p>
                    <p className="font-semibold">
                      {loveStyleTypeInfo[userResult.analysis.loveStyleAnalysis.primaryType as LoveStyleType]?.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mode Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">診断モード</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'general' | 'specific')}>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="general" id="general" className="mt-1" />
                    <Label htmlFor="general" className="cursor-pointer flex-1">
                      <p className="font-medium">一般的な相性</p>
                      <p className="text-sm text-gray-500">
                        あなたのタイプに合う一般的なパートナー像を分析
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="specific" id="specific" className="mt-1" />
                    <Label htmlFor="specific" className="cursor-pointer flex-1">
                      <p className="font-medium">特定の人との相性</p>
                      <p className="text-sm text-gray-500">
                        気になる人のタイプを選んで相性を診断
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Partner Type Selection (specific mode) */}
            {mode === 'specific' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">相手のタイプを選択</CardTitle>
                  <CardDescription>
                    相手に診断を受けてもらうか、予想で選んでください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Attachment Type */}
                  <div>
                    <p className="font-medium mb-3">愛着スタイル</p>
                    <div className="grid grid-cols-2 gap-2">
                      {attachmentTypes.map((type) => {
                        const info = attachmentTypeInfo[type];
                        return (
                          <button
                            key={type}
                            onClick={() => setPartnerAttachment(type)}
                            className={`p-3 rounded-lg border-2 text-left transition-colors ${
                              partnerAttachment === type
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className="font-medium text-sm">{info.name}</p>
                            <p className="text-xs text-gray-500">{info.nameEn}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Love Style Type */}
                  <div>
                    <p className="font-medium mb-3">愛のスタイル</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {loveStyleTypes.map((type) => {
                        const info = loveStyleTypeInfo[type];
                        return (
                          <button
                            key={type}
                            onClick={() => setPartnerLoveStyle(type)}
                            className={`p-3 rounded-lg border-2 text-left transition-colors ${
                              partnerLoveStyle === type
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className="font-medium text-sm">{info.name}</p>
                            <p className="text-xs text-gray-500">{info.nameEn}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (mode === 'specific' && (!partnerAttachment || !partnerLoveStyle))}
              className="w-full bg-rose-500 hover:bg-rose-600 py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AI分析中...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-5 w-5" />
                  相性を診断する
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
