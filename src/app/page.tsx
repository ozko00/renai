import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Sparkles, Brain } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <Heart className="mx-auto h-16 w-16 text-rose-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            恋愛タイプ診断
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            心理学の研究論文に基づき、
            <br />
            AIがあなたの愛着スタイルと恋愛パターンを分析。
            <br />
            相性の良いパートナータイプも診断できます。
          </p>
        </div>

        <Link href="/diagnosis">
          <Button size="lg" className="text-lg px-8 py-6 bg-rose-500 hover:bg-rose-600">
            <Sparkles className="mr-2 h-5 w-5" />
            診断を始める
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          この診断でわかること
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>愛着スタイル</CardTitle>
              <CardDescription>4つのタイプから分析</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>・安定型（Secure）</li>
                <li>・不安型（Preoccupied）</li>
                <li>・回避型（Dismissive）</li>
                <li>・恐れ・回避型（Fearful）</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>愛のスタイル</CardTitle>
              <CardDescription>6つのタイプから分析</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>・情熱型（Eros）</li>
                <li>・遊戯型（Ludus）</li>
                <li>・友愛型（Storge）</li>
                <li>・実用型（Pragma）</li>
                <li>・熱狂型（Mania）</li>
                <li>・博愛型（Agape）</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>相性診断</CardTitle>
              <CardDescription>理想のパートナー像</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                あなたのタイプに合う理想的なパートナー像を分析。特定の人との相性も診断できます。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 rounded-xl my-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          診断の流れ
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              1
            </div>
            <h3 className="font-semibold mb-1">質問に回答</h3>
            <p className="text-sm text-gray-600">44問の質問に答えます</p>
          </div>

          <div className="hidden md:block text-gray-300 text-3xl">→</div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              2
            </div>
            <h3 className="font-semibold mb-1">AIが分析</h3>
            <p className="text-sm text-gray-600">回答をAIが詳細に分析</p>
          </div>

          <div className="hidden md:block text-gray-300 text-3xl">→</div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              3
            </div>
            <h3 className="font-semibold mb-1">結果を確認</h3>
            <p className="text-sm text-gray-600">タイプと相性がわかる</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          あなたの恋愛タイプを知ろう
        </h2>
        <p className="text-gray-600 mb-8">
          約5分で完了。無料で診断できます。
        </p>
        <Link href="/diagnosis">
          <Button size="lg" className="text-lg px-8 py-6 bg-rose-500 hover:bg-rose-600">
            <Sparkles className="mr-2 h-5 w-5" />
            診断を始める
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-gray-500 border-t">
        <p>
          この診断は心理学研究に基づいていますが、エンターテインメント目的です。
        </p>
      </footer>
    </main>
  );
}
