import Link from 'next/link';

export default function QuestionNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-400">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold text-white mb-2">Question Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
        We couldn't find the interview question you're looking for. It may have been moved, renamed, or deleted.
      </p>

      <Link
        href="/questions"
        className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all"
      >
        &larr; Back to Questions Explorer
      </Link>
    </div>
  );
}
