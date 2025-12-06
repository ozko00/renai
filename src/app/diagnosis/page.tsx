import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import QuestionForm from '@/components/diagnosis/QuestionForm';

export default function DiagnosisPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            戻る
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            恋愛タイプ診断
          </h1>
          <p className="text-gray-600">
            以下の質問に直感的にお答えください
          </p>
        </div>

        <QuestionForm />
      </div>
    </main>
  );
}
