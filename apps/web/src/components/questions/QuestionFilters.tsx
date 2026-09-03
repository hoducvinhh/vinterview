'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { api, Category, Question, Technology } from '@/lib/api';

interface QuestionFiltersProps {
  categories: Category[];
  technologies: Technology[];
}

export function QuestionFilters({ categories, technologies }: QuestionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentTechnology = searchParams.get('technology') || '';
  const currentDifficulty = searchParams.get('difficulty') || '';
  const [search, setSearch] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState<Question[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => setSearch(currentSearch), [currentSearch]);

  useEffect(() => {
    const term = search.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        const response = await api.getQuestions({ search: term, limit: 6 });
        setSuggestions(response.data);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'ALL') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
      {/* Search Input */}
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            placeholder="Tìm kiếm câu hỏi theo tiêu đề hoặc từ khóa..."
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); updateFilters('search', e.target.value); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          {showSuggestions && search.trim().length >= 2 && (
            <div className="absolute z-20 left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
              {suggestions.length > 0 ? suggestions.map((question) => (
                <Link key={question.id} href={`/questions/${question.slug}`} className="block border-b border-slate-100 dark:border-slate-800 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <span className="block text-xs font-semibold text-slate-900 dark:text-white">{question.title}</span>
                  <span className="text-[10px] text-slate-500">{question.technology.name} · {question.category.name}</span>
                </Link>
              )) : <div className="px-3 py-3 text-xs text-slate-500">Không có câu hỏi liên quan.</div>}
            </div>
          )}
        </div>
      </div>

      {/* Select Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Technology Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Công nghệ
          </label>
          <select
            value={currentTechnology}
            onChange={(e) => updateFilters('technology', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Tất cả công nghệ</option>
            {technologies.map((tech) => (
              <option key={tech.id} value={tech.slug}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Danh mục
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateFilters('category', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Độ khó
          </label>
          <select
            value={currentDifficulty}
            onChange={(e) => updateFilters('difficulty', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">Tất cả độ khó</option>
            <option value="EASY">EASY (Dễ)</option>
            <option value="MEDIUM">MEDIUM (Trung bình)</option>
            <option value="HARD">HARD (Khó)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
