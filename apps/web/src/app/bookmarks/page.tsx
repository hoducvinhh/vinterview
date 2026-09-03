'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api, Question } from '@/lib/api';
import { QuestionCard } from '@/components/ui/QuestionCard';

export default function BookmarksPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookmarks() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.getUserBookmarks();
        setBookmarks(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách câu hỏi đã lưu.');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchBookmarks();
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-900 rounded w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-slate-200 dark:bg-slate-900/60 rounded-xl border border-slate-300 dark:border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Đăng Nhập Để Xem Danh Sách Đã Lưu</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Lưu các câu hỏi phỏng vấn quan trọng vào bộ sưu tập cá nhân để tiện ôn tập nhanh trước buổi phỏng vấn.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all inline-block"
        >
          Đăng Nhập;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          🔖 Bộ Sưu Tập Cá Nhân
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Câu Hỏi Đã Lưu
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Danh sách các câu hỏi phỏng vấn bạn đã đánh dấu bookmark.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Bookmarks Grid */}
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((q) => (
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
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            🔖
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Chưa có câu hỏi nào được lưu</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Nhấn vào biểu tượng Bookmark ở bất kỳ câu hỏi nào để lưu lại tại đây!
          </p>
          <Link
            href="/questions"
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg inline-block transition-colors"
          >
            Khám phá câu hỏi ngay &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
