import Link from 'next/link';
import { QuestionForm } from '@/components/admin/QuestionForm';

export default function CreateQuestionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/admin/questions" className="hover:text-slate-200 transition-colors">
          Admin Questions
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-semibold">New Question</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Create Interview Question</h1>
        <p className="text-xs text-slate-400">
          Add a new interview question, select its difficulty and technology, and write a verified solution.
        </p>
      </div>

      {/* Form */}
      <QuestionForm mode="create" />
    </div>
  );
}
