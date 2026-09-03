'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api, UserProgressData } from '@/lib/api';
import { QuestionCard } from '@/components/ui/QuestionCard';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgress() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.getUserProgressStats();
        setData(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể tải thống kê tiến độ học tập.');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadProgress();
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-900 rounded w-64 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-900/60 rounded-xl border border-slate-300 dark:border-slate-800" />
          ))}
        </div>
        <div className="h-20 bg-slate-200 dark:bg-slate-900/40 rounded-xl border border-slate-300 dark:border-slate-800" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Đăng Nhập Để Xem Dashboard Tổng Quan</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Theo dõi mức độ sẵn sàng phỏng vấn, số lượng câu hỏi đã hoàn thành và thống kê tiến độ học tập.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all inline-block"
        >
          Đăng Nhập Ngay &rarr;
        </Link>
      </div>
    );
  }

  const stats = data?.stats || {
    totalQuestions: 0,
    completedQuestions: 0,
    inProgressQuestions: 0,
    completionPercentage: 0,
  };

  const recentlyCompleted = data?.recentlyCompleted || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Greeting */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          📊 Tổng Quan Tiến Độ Học Tập
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
          Chào mừng trở lại, {user.name || user.email.split('@')[0]} 👋
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Theo dõi các chỉ số sẵn sàng phỏng vấn, chủ đề đã hoàn thành và hoạt động ôn tập gần nhất.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Questions */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Tổng Số Câu Hỏi</div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalQuestions}</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Câu hỏi trong hệ thống</p>
        </div>

        {/* Card 2: Completed Questions */}
        <div className="bg-white dark:bg-slate-900/80 border border-emerald-500/30 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Đã Hoàn Thành</div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.completedQuestions}</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Câu hỏi đã giải thành công</p>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white dark:bg-slate-900/80 border border-blue-500/30 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Đang Học Tập</div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{stats.inProgressQuestions}</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Đang trong tiến trình ôn tập</p>
        </div>

        {/* Card 4: Completion Percentage */}
        <div className="bg-white dark:bg-slate-900/80 border border-purple-500/30 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Tỷ Lệ Hoàn Thành</div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{stats.completionPercentage}%</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Mức độ sẵn sàng tổng thể</p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <span>Tiến Độ Sẵn Sàng Phỏng Vấn</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">{stats.completionPercentage}% Hoàn Thành</span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
          <span>0 Câu hỏi</span>
          <span>{stats.completedQuestions} / {stats.totalQuestions} Đã hoàn thành</span>
        </div>
      </div>

      {/* Recently Completed Questions Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Câu Hỏi Mới Hoàn Thành Gần Đây</h2>
        {recentlyCompleted.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-slate-500 text-xs">
            Chưa có câu hỏi nào được đánh dấu hoàn thành. Hãy đánh dấu trạng thái "Hoàn thành" trong khi học để xem ở đây!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentlyCompleted.map((q: any) => (
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
        )}
      </div>
    </div>
  );
}
