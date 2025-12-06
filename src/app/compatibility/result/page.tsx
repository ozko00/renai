'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttachmentType, LoveStyleType, CompatibilityResult, GeneralCompatibilityResult } from '@/types/diagnosis';
import { attachmentTypeInfo } from '@/data/types/attachmentTypes';
import { loveStyleTypeInfo } from '@/data/types/loveStyleTypes';
import {
  ChevronLeft,
  Users,
  Heart,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  Sparkles,
  Star,
} from 'lucide-react';

interface StoredResult {
  mode: 'general' | 'specific';
  userAttachment: AttachmentType;
  userLoveStyle: LoveStyleType;
  partnerAttachment?: AttachmentType;
  partnerLoveStyle?: LoveStyleType;
  result: CompatibilityResult | GeneralCompatibilityResult;
}

export default function CompatibilityResultPage() {
  const router = useRouter();
  const [data, setData] = useState<StoredResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('compatibilityResult');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        router.push('/compatibility');
      }
    } else {
      router.push('/compatibility');
    }
    setLoading(false);
  }, [router]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const { mode, userAttachment, userLoveStyle, partnerAttachment, partnerLoveStyle, result } = data;
  const userAttachmentInfo = attachmentTypeInfo[userAttachment];
  const userLoveStyleInfo = loveStyleTypeInfo[userLoveStyle];

  const handleShare = (platform: 'twitter' | 'line') => {
    let text = '';
    if (mode === 'specific' && partnerAttachment && partnerLoveStyle) {
      const partnerAttachmentInfo = attachmentTypeInfo[partnerAttachment];
      const partnerLoveStyleInfo = loveStyleTypeInfo[partnerLoveStyle];
      const score = (result as CompatibilityResult).overallCompatibility?.score || 0;
      text = `私(${userAttachmentInfo.name}×${userLoveStyleInfo.name})と相手(${partnerAttachmentInfo.name}×${partnerLoveStyleInfo.name})の相性は${score}点でした！`;
    } else {
      text = `私の恋愛タイプ(${userAttachmentInfo.name}×${userLoveStyleInfo.name})に合う相性を診断しました！`;
    }
    text += '\n\n恋愛タイプ診断で相性をチェックしてみよう';
    const url = window.location.origin;

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank'
      );
    } else {
      window.open(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        '_blank'
      );
    }
  };

  const renderScoreStars = (score: number, max: number = 5) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/compatibility"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            戻る
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('line')}
            >
              LINE
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Title */}
        <div className="text-center mb-8">
          <Users className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">相性診断結果</h1>
        </div>

        {mode === 'specific' ? (
          // Specific compatibility result
          <SpecificResult
            data={data}
            result={result as CompatibilityResult}
            renderScoreStars={renderScoreStars}
          />
        ) : (
          // General compatibility result
          <GeneralResult
            data={data}
            result={result as GeneralCompatibilityResult}
            renderScoreStars={renderScoreStars}
          />
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/compatibility">
            <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600">
              <Users className="mr-2 h-5 w-5" />
              別の相性を診断
            </Button>
          </Link>
          <Link href="/diagnosis/result">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              診断結果に戻る
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

function SpecificResult({
  data,
  result,
  renderScoreStars,
}: {
  data: StoredResult;
  result: CompatibilityResult;
  renderScoreStars: (score: number, max?: number) => React.ReactNode;
}) {
  const { userAttachment, userLoveStyle, partnerAttachment, partnerLoveStyle } = data;
  const userAttachmentInfo = attachmentTypeInfo[userAttachment];
  const userLoveStyleInfo = loveStyleTypeInfo[userLoveStyle];
  const partnerAttachmentInfo = partnerAttachment ? attachmentTypeInfo[partnerAttachment] : null;
  const partnerLoveStyleInfo = partnerLoveStyle ? loveStyleTypeInfo[partnerLoveStyle] : null;

  return (
    <div className="space-y-6">
      {/* Type Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="text-center pb-2">
            <p className="text-sm text-gray-500">あなた</p>
            <CardTitle className="text-lg">
              {userAttachmentInfo.name} × {userLoveStyleInfo.name}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center pb-2">
            <p className="text-sm text-gray-500">相手</p>
            <CardTitle className="text-lg">
              {partnerAttachmentInfo?.name} × {partnerLoveStyleInfo?.name}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-rose-500 to-pink-500 text-white">
        <CardContent className="py-8 text-center">
          <p className="text-rose-100 mb-2">総合相性スコア</p>
          <p className="text-6xl font-bold mb-4">{result.overallCompatibility?.score || 0}</p>
          <p className="text-rose-100">/100点</p>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="py-6">
          <p className="text-gray-700">{result.overallCompatibility?.summary}</p>
        </CardContent>
      </Card>

      {/* Attachment Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            愛着スタイルの相性
            {renderScoreStars(result.attachmentCompatibility?.score || 0)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{result.attachmentCompatibility?.analysis}</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-1">二人の力学</p>
            <p className="text-gray-700">{result.attachmentCompatibility?.dynamics}</p>
          </div>
        </CardContent>
      </Card>

      {/* Love Style Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            愛のスタイルの相性
            {renderScoreStars(result.loveStyleCompatibility?.score || 0)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{result.loveStyleCompatibility?.analysis}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4" />
                二人の強み
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                {result.loveStyleCompatibility?.strengths?.map((s, i) => (
                  <li key={i}>・{s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4" />
                注意点
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {result.loveStyleCompatibility?.challenges?.map((c, i) => (
                  <li key={i}>・{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-rose-500" />
            コミュニケーション
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">コツ</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {result.communication?.tips?.map((t, i) => (
                <li key={i}>・{t}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">避けるべきパターン</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {result.communication?.avoidPatterns?.map((p, i) => (
                <li key={i}>・{p}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Long Term Advice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-rose-500" />
            長期的な関係のために
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{result.longTermAdvice}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function GeneralResult({
  data,
  result,
  renderScoreStars,
}: {
  data: StoredResult;
  result: GeneralCompatibilityResult;
  renderScoreStars: (score: number, max?: number) => React.ReactNode;
}) {
  const { userAttachment, userLoveStyle } = data;
  const userAttachmentInfo = attachmentTypeInfo[userAttachment];
  const userLoveStyleInfo = loveStyleTypeInfo[userLoveStyle];

  return (
    <div className="space-y-6">
      {/* User Type */}
      <Card>
        <CardHeader className="text-center pb-2">
          <p className="text-sm text-gray-500">あなたのタイプ</p>
          <CardTitle className="text-xl">
            {userAttachmentInfo.name} × {userLoveStyleInfo.name}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Best Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-rose-500" />
            相性の良いタイプ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.bestMatches?.map((match, i) => {
            const attachmentInfo = attachmentTypeInfo[match.attachmentType as AttachmentType];
            const loveStyleInfo = loveStyleTypeInfo[match.loveStyleType as LoveStyleType];
            return (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">
                      {attachmentInfo?.name} × {loveStyleInfo?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      相性スコア: {match.compatibilityScore}点
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-rose-500">
                    #{i + 1}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{match.reason}</p>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs font-medium text-green-800 mb-1">うまくいくコツ</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    {match.tips?.map((tip, j) => (
                      <li key={j}>・{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Challenging Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            注意が必要なタイプ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.challengingMatches?.map((match, i) => {
            const attachmentInfo = attachmentTypeInfo[match.attachmentType as AttachmentType];
            const loveStyleInfo = loveStyleTypeInfo[match.loveStyleType as LoveStyleType];
            return (
              <div key={i} className="border border-amber-200 bg-amber-50/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold">
                    {attachmentInfo?.name} × {loveStyleInfo?.name}
                  </p>
                  <p className="text-sm text-amber-600">
                    相性スコア: {match.compatibilityScore}点
                  </p>
                </div>
                <p className="text-gray-700 text-sm mb-3">{match.challenges}</p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs font-medium text-blue-800 mb-1">乗り越えるヒント</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {match.solutions?.map((sol, j) => (
                      <li key={j}>・{sol}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* General Advice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-rose-500" />
            恋愛アドバイス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{result.generalAdvice}</p>
        </CardContent>
      </Card>
    </div>
  );
}
