import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api, Question } from '@/lib/api';
import { QuestionForm } from '@/components/admin/QuestionForm';

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditQuestionPage({ params }: EditPageProps) {
  const { id } = await params;

  let question: Question | null = null;

  try {
    const res = await api.getQuestionBySlug(id);
    if (res?.data) {
      question = res.data;
    }
  } catch {
    notFound();
  }

  if (!question) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/admin/questions" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          Admin Questions
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-md">
          Edit: {question.title}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Edit Interview Question</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Update question details, metadata, difficulty, or verified solution content.
        </p>
      </div>

      {/* Form in Edit Mode */}
      <QuestionForm mode="edit" initialData={question} />
    </div>
  );
}
