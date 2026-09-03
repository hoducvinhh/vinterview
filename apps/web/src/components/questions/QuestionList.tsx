import { Question } from '@/lib/api';
import { QuestionCard } from '@/components/ui/QuestionCard';

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/40 rounded-xl border border-slate-800 p-8">
        <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">No Questions Found</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          We couldn't find any questions matching your current search or filter criteria. Try adjusting your search query or selecting a different category/technology.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          id={q.id}
          title={q.title}
          slug={q.slug}
          difficulty={q.difficulty}
          category={q.category.name}
          technology={q.technology.name}
          contentSnippet={q.content}
        />
      ))}
    </div>
  );
}
