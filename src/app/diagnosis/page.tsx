import Link from 'next/link';
import QuestionForm from '@/components/diagnosis/QuestionForm';

function ChevronLeftIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5l-5 5 5 5" />
    </svg>
  );
}

function HeartIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M7 12.5C7 12.5 1 9 1 5C1 3 2.5 1.5 4.5 1.5C5.7 1.5 6.6 2.2 7 3C7.4 2.2 8.3 1.5 9.5 1.5C11.5 1.5 13 3 13 5C13 9 7 12.5 7 12.5Z" />
    </svg>
  );
}

export default function DiagnosisPage() {
  return (
    <main className="min-h-screen bg-[var(--koi-bg)] text-[var(--koi-ink)]">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 pt-6 pb-3 sm:px-7">
        <Link
          href="/"
          className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--koi-ink-soft)] transition-colors hover:bg-[var(--koi-bg-card)]"
          aria-label="トップへ戻る"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-2 text-[var(--koi-ink-soft)]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--koi-primary)] text-white">
            <HeartIcon className="h-3 w-3" />
          </span>
          <span className="font-serif-jp text-[13px] font-medium tracking-[0.08em]">
            renAI
          </span>
        </div>

        <span className="w-9" aria-hidden />
      </header>

      <QuestionForm />
    </main>
  );
}
