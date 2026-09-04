'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, Category, Technology, Question, CreateQuestionPayload } from '@/lib/api';

interface QuestionFormProps {
  mode: 'create' | 'edit';
  initialData?: Question;
}

export function QuestionForm({ mode, initialData }: QuestionFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(initialData?.difficulty || 'MEDIUM');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [technologyId, setTechnologyId] = useState(initialData?.technologyId || '');

  // Answer State
  const [answerContent, setAnswerContent] = useState(initialData?.answer?.content || '');
  const [codeSnippet, setCodeSnippet] = useState(initialData?.answer?.codeSnippet || '');
  const [explanation, setExplanation] = useState(initialData?.answer?.explanation || '');

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);
        const [catRes, techRes] = await Promise.all([
          api.getCategories(),
          api.getTechnologies(),
        ]);
        setCategories(catRes.data);
        setTechnologies(techRes.data);

        // Pre-select first category/tech if creating
        if (mode === 'create') {
          if (catRes.data.length > 0) setCategoryId(catRes.data[0].id);
          if (techRes.data.length > 0) setTechnologyId(techRes.data[0].id);
        }
      } catch (err: any) {
        setError('Failed to load Category and Technology options.');
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!title.trim() || !content.trim() || !categoryId || !technologyId) {
      setError('Please fill in all required fields (Title, Statement, Category, and Technology).');
      return;
    }

    if (!answerContent.trim()) {
      setError('Please provide a verified Solution Answer statement.');
      return;
    }

    try {
      setSubmitting(true);

      const payload: CreateQuestionPayload = {
        title,
        ...(slug && { slug }),
        content,
        difficulty,
        categoryId,
        technologyId,
        answer: {
          content: answerContent,
          ...(codeSnippet && { codeSnippet }),
          ...(explanation && { explanation }),
        },
      };

      if (mode === 'create') {
        await api.createQuestion(payload);
      } else if (mode === 'edit' && initialData) {
        await api.updateQuestion(initialData.id, payload);
      }

      router.push('/admin/questions');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the question.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 dark:text-slate-400 animate-pulse">
        Loading category and technology options...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Question Details Card */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-3">
          1. Question Statement & Metadata
        </h2>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Question Title <span className="text-rose-500 dark:text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. What is the Event Loop in JavaScript?"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Optional Custom Slug */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Custom URL Slug <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional - auto-generated if left empty)</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. what-is-event-loop-js"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Category, Technology, Difficulty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Technology <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <select
              value={technologyId}
              onChange={(e) => setTechnologyId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {technologies.map((t) => (
                <option key={t.id} value={t.id} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Difficulty Level <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="EASY" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200">EASY</option>
              <option value="MEDIUM" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200">MEDIUM</option>
              <option value="HARD" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200">HARD</option>
            </select>
          </div>
        </div>

        {/* Content Statement Markdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Question Statement (Markdown) <span className="text-rose-500 dark:text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Explain how the Call Stack and Event Loop interact with Promises..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Answer Details Card */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-3">
          2. Verified Solution & Code Example
        </h2>

        {/* Solution Content */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Solution Text <span className="text-rose-500 dark:text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="JavaScript is single-threaded and uses an event-driven loop to process non-blocking I/O..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Code Snippet */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Code Snippet <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={4}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="setTimeout(() => console.log('Done'), 0);"
            className="w-full bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-400 dark:text-cyan-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Deep-Dive Explanation <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Microtasks have higher priority than Macrotasks in V8 engine..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
        >
          {submitting ? 'Saving Question...' : mode === 'create' ? 'Create Question' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
