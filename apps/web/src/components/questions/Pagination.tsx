'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { QuestionsMeta } from '@/lib/api';

interface PaginationProps {
  meta: QuestionsMeta;
}

export function Pagination({ meta }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page, totalPages, total } = meta;

  if (totalPages <= 1) return null;

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/80">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Showing Page <span className="font-semibold text-slate-800 dark:text-slate-200">{page}</span> of{' '}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span> ({total} total questions)
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          &larr; Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => goToPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                p === page
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
