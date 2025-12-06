'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DiagnosisResult, AttachmentType, LoveStyleType } from '@/types/diagnosis';
import { attachmentTypeInfo } from '@/data/types/attachmentTypes';
import { loveStyleTypeInfo } from '@/data/types/loveStyleTypes';
import LoveStyleRadarChart from '@/components/result/LoveStyleRadarChart';
import AttachmentScoreBar from '@/components/result/AttachmentScoreBar';
import {
  Heart,
  Brain,
  Sparkles,
  Users,
  ChevronLeft,
  Share2,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BookOpen,
} from 'lucide-react';

export default function DiagnosisResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('diagnosisResult');
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        router.push('/diagnosis');
      }
    } else {
      router.push('/diagnosis');
    }
    setLoading(false);
  }, [router]);

  if (loading || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const { scores, analysis } = result;
  const attachmentType = analysis.attachmentAnalysis.primaryType as AttachmentType;
  const loveStyleType = analysis.loveStyleAnalysis.primaryType as LoveStyleType;
  const attachmentInfo = attachmentTypeInfo[attachmentType];
  const loveStyleInfo = loveStyleTypeInfo[loveStyleType];

  const handleShare = (platform: 'twitter' | 'line') => {
    const text = `私の恋愛タイプは「${attachmentInfo.name}」×「${loveStyleInfo.name}」でした！\n\n恋愛タイプ診断で自分の恋愛パターンを分析してみよう`;
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            トップへ
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
          <Sparkles className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">診断結果</h1>
          <p className="text-gray-600">あなたの恋愛タイプが明らかになりました</p>
        </div>

        {/* Main Types */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Attachment Type */}
          <Card className="border-2" style={{ borderColor: attachmentInfo.color }}>
            <CardHeader className="text-center pb-2">
              <Brain className="h-8 w-8 mx-auto mb-2" style={{ color: attachmentInfo.color }} />
              <p className="text-sm text-gray-500">愛着スタイル</p>
              <CardTitle className="text-2xl" style={{ color: attachmentInfo.color }}>
                {attachmentInfo.name}
              </CardTitle>
              <p className="text-sm text-gray-500">{attachmentInfo.nameEn}</p>
            </CardHeader>
          </Card>

          {/* Love Style Type */}
          <Card className="border-2" style={{ borderColor: loveStyleInfo.color }}>
            <CardHeader className="text-center pb-2">
              <Heart className="h-8 w-8 mx-auto mb-2" style={{ color: loveStyleInfo.color }} />
              <p className="text-sm text-gray-500">愛のスタイル</p>
              <CardTitle className="text-2xl" style={{ color: loveStyleInfo.color }}>
                {loveStyleInfo.name}
              </CardTitle>
              <p className="text-sm text-gray-500">{loveStyleInfo.nameEn}</p>
            </CardHeader>
          </Card>
        </div>

        {/* Attachment Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-rose-500" />
              愛着スタイル分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">{analysis.attachmentAnalysis.description}</p>

            <AttachmentScoreBar scores={scores.attachment} primaryType={attachmentType} />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  強み
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  {analysis.attachmentAnalysis.strengths.map((s, i) => (
                    <li key={i}>・{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  課題
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  {analysis.attachmentAnalysis.challenges.map((c, i) => (
                    <li key={i}>・{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4" />
                成長のアドバイス
              </h4>
              <p className="text-sm text-blue-700">{analysis.attachmentAnalysis.growthAdvice}</p>
            </div>
          </CardContent>
        </Card>

        {/* Love Style Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              愛のスタイル分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoveStyleRadarChart scores={scores.loveStyle} />

            <div className="text-center">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: `${loveStyleInfo.color}20`, color: loveStyleInfo.color }}>
                メイン: {loveStyleInfo.name}
                {analysis.loveStyleAnalysis.secondaryType && (
                  <span className="ml-2">
                    / サブ: {loveStyleTypeInfo[analysis.loveStyleAnalysis.secondaryType as LoveStyleType]?.name}
                  </span>
                )}
              </span>
            </div>

            <p className="text-gray-700">{analysis.loveStyleAnalysis.description}</p>

            <div className="bg-rose-50 p-4 rounded-lg">
              <h4 className="font-semibold text-rose-800 mb-2">恋愛パターンの傾向</h4>
              <p className="text-sm text-rose-700">{analysis.loveStyleAnalysis.relationshipPattern}</p>
            </div>
          </CardContent>
        </Card>

        {/* Overall Profile */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              総合分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{analysis.overallProfile.summary}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  理想のパートナー像
                </h4>
                <p className="text-sm text-purple-700">{analysis.overallProfile.idealPartner}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  注意パターン
                </h4>
                <p className="text-sm text-orange-700">{analysis.overallProfile.warningPatterns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-rose-500" />
              アドバイス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Compatibility CTA */}
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-700 mb-3">あなたと相性の良いタイプを調べよう</p>
          <Link href="/compatibility">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 shadow-lg">
              <Users className="mr-2 h-5 w-5" />
              相性を診断する
            </Button>
          </Link>
        </div>

        {/* About Attachment Styles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-rose-500" />
              愛着スタイルとは？
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 text-sm">
              愛着スタイルは、幼少期の親との関係から形成される、親密な関係における行動パターンです。
              心理学者のBowlbyとAinsworthの研究が基盤となっています。
            </p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: attachmentTypeInfo.secure.color }} />
                <div>
                  <p className="font-medium text-sm">安定型（Secure）</p>
                  <p className="text-xs text-gray-600">信頼関係を築きやすく、親密さと自立のバランスが取れている</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: attachmentTypeInfo.preoccupied.color }} />
                <div>
                  <p className="font-medium text-sm">不安型（Preoccupied）</p>
                  <p className="text-xs text-gray-600">愛情確認を求め、見捨てられる不安を抱えやすい</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: attachmentTypeInfo.dismissive.color }} />
                <div>
                  <p className="font-medium text-sm">回避型（Dismissive）</p>
                  <p className="text-xs text-gray-600">独立性を重視し、感情的な距離を保つ傾向</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: attachmentTypeInfo.fearful.color }} />
                <div>
                  <p className="font-medium text-sm">恐れ・回避型（Fearful）</p>
                  <p className="text-xs text-gray-600">親密さを求めながらも、傷つくことを恐れて距離を置く</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Love Styles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-rose-500" />
              愛のスタイルとは？
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 text-sm">
              愛のスタイルは、社会学者John Alan Leeが提唱した「愛の色彩理論」に基づく、
              恋愛における態度・アプローチの分類です。
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: loveStyleTypeInfo.eros.color }} />
                <div>
                  <p className="font-medium text-sm">情熱型（Eros）</p>
                  <p className="text-xs text-gray-600">強い身体的・感情的魅力に基づく情熱的な愛</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: loveStyleTypeInfo.ludus.color }} />
                <div>
                  <p className="font-medium text-sm">遊戯型（Ludus）</p>
                  <p className="text-xs text-gray-600">恋愛をゲームや楽しみとして捉える軽やかな恋愛</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: loveStyleTypeInfo.storge.color }} />
                <div>
                  <p className="font-medium text-sm">友愛型（Storge）</p>
                  <p className="text-xs text-gray-600">友情から発展する穏やかで安定した愛</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: loveStyleTypeInfo.pragma.color }} />
                <div>
                  <p className="font-medium text-sm">実用型（Pragma）</p>
                  <p className="text-xs text-gray-600">論理的・実用的な視点でパートナーを選ぶ</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: loveStyleTypeInfo.mania.color }} />
                <div>
                  <p className="font-medium text-sm">熱狂型（Mania）</p>
                  <p className="text-xs text-gray-600">強い執着と感情の波が特徴的、嫉妬や独占欲が強い</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 rounded-full mt-1.5" style={{ backgroundColor: loveStyleTypeInfo.agape.color }} />
                <div>
                  <p className="font-medium text-sm">博愛型（Agape）</p>
                  <p className="text-xs text-gray-600">無条件の献身的な愛、見返りを求めない</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/compatibility">
            <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600">
              <Users className="mr-2 h-5 w-5" />
              相性を診断する
            </Button>
          </Link>
          <Link href="/diagnosis">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-5 w-5" />
              もう一度診断する
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
