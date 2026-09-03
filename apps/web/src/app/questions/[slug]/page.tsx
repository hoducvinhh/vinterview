import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, Question } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton';
import { ProgressSelect } from '@/components/progress/ProgressSelect';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.getQuestionBySlug(slug);
    const question = res.data;
    return {
      title: `${question.title} — Vinterview`,
      description: question.content.substring(0, 160),
    };
  } catch (err) {
    return {
      title: 'Chi Tiết Câu Hỏi — Vinterview',
      description: 'Nền tảng luyện phỏng vấn công nghệ chuyên sâu.',
    };
  }
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let question: Question;
  let relatedQuestions: Question[] = [];

  try {
    const res = await api.getQuestionBySlug(slug);
    question = res.data;

    // Fetch related questions by same technology
    const relatedRes = await api.getQuestions({
      technology: question.technology.slug,
      limit: 3,
    });
    relatedQuestions = relatedRes.data.filter((q) => q.id !== question.id);
  } catch (err) {
    notFound();
  }

  const difficultyVariant =
    question.difficulty === 'EASY'
      ? 'easy'
      : question.difficulty === 'MEDIUM'
      ? 'medium'
      : 'hard';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/questions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Câu hỏi
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
          {question.title}
        </span>
      </nav>

      {/* Header Info Section */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={difficultyVariant}>{question.difficulty}</Badge>
            <Badge variant="category">{question.category.name}</Badge>
            <Badge variant="tech">{question.technology.name}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <ProgressSelect questionId={question.id} />
            <BookmarkButton questionId={question.id} size="md" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
          {question.title}
        </h1>

        <div className="text-xs text-slate-500 font-mono">
          Cập nhật gần nhất: {new Date(question.updatedAt).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Question Statement Section */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            📌 Nội Dung Câu Hỏi
          </h2>
          <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {question.content}
          </div>
        </div>

        {/* Answer Solution Section */}
        {question.answer ? (
          <div className="bg-white dark:bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span>✓</span> Đáp Án & Lời Giải Chi Tiết
              </h2>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Verified Solution
              </span>
            </div>

            {/* Answer Content */}
            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {question.answer.content}
            </div>

            {/* Code Snippet Display */}
            {question.answer.codeSnippet && (
              <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                <div className="bg-slate-950/80 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>Mã Code Minh Họa</span>
                  <span className="text-[10px] text-slate-400 uppercase">{question.technology.name}</span>
                </div>
                <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>{question.answer.codeSnippet}</code>
                </pre>
              </div>
            )}


            {/* Explanation Deep Dive */}
            {question.answer.explanation && (
              <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  💡 Phân Tích Chuyên Sâu (Deep Dive)
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {question.answer.explanation}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-6 rounded-2xl text-xs font-semibold text-center">
            ⚠️ Lời giải chuẩn cho câu hỏi này đang được đội ngũ cập nhật.
          </div>
        )}
      </div>

      {/* Related Questions Section */}
      {relatedQuestions.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Câu Hỏi {question.technology.name} Liên Quan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedQuestions.map((q) => (
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
        </div>
      )}
    </div>
  );
}
