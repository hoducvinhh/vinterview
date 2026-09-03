'use client';

import { useEffect, useState } from 'react';
import { api, AnalyticsStats } from '@/lib/api';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminAnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAnalyticsStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu thống kê truy cập.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const maxDailyViews = stats?.dailyStats
    ? Math.max(...stats.dailyStats.map((d) => d.views), 1)
    : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <AdminHeader />

      {/* Header title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Thống Kê Truy Cập & Phân Tích Website
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Theo dõi tổng lượt xem, người truy cập độc nhất (Unique Visitors) và xu hướng hoạt động của hệ thống.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span> Làm mới dữ liệu
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={fetchStats}
            className="underline font-bold hover:text-rose-700 dark:hover:text-rose-300 ml-4 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800/50 rounded-2xl"></div>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Page Views */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-5xl">
                👀
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tổng Lượt Xem Trang
              </p>
              <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
                {stats.totalViews.toLocaleString()}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Tất cả các lượt truy cập được ghi nhận
              </p>
            </div>

            {/* Unique Visitors */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-5xl">
                🌐
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Người Xem Độc Nhất (Unique)
              </p>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                {stats.uniqueVisitors.toLocaleString()}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Dựa trên Visitor ID & IP phân biệt
              </p>
            </div>

            {/* Views Today */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-5xl">
                ⚡
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Lượt Xem Hôm Nay
              </p>
              <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">
                {stats.viewsToday.toLocaleString()}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {stats.uniqueVisitorsToday.toLocaleString()} người dùng độc nhất hôm nay
              </p>
            </div>

            {/* Registered Users */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-5xl">
                👥
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Thành Viên Đăng Ký
              </p>
              <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
                {stats.totalUsers.toLocaleString()}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Tài khoản người dùng đã tạo
              </p>
            </div>
          </div>

          {/* Charts & Analytics Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Traffic Chart (7 days) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Biểu Đồ Lượt Truy Cập (7 Ngày Qua)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      So sánh tổng lượt xem và số người truy cập độc nhất theo ngày.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span> Lượt Xem
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Người Xem
                    </span>
                  </div>
                </div>

                {/* Bar Chart Visualization */}
                <div className="mt-8 h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {stats.dailyStats.map((item, idx) => {
                    const viewsHeight = Math.max(Math.round((item.views / maxDailyViews) * 100), 6);
                    const visitorsHeight = Math.max(Math.round((item.visitors / maxDailyViews) * 100), 4);

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[10px] rounded px-2 py-1 absolute -mt-12 shadow-lg pointer-events-none z-10 whitespace-nowrap">
                          {item.date}: {item.views} views ({item.visitors} visitors)
                        </div>

                        {/* Bars container */}
                        <div className="w-full flex items-end justify-center gap-1.5 h-44">
                          <div
                            style={{ height: `${viewsHeight}%` }}
                            className="w-1/2 max-w-[24px] bg-blue-600 dark:bg-blue-500 rounded-t-md transition-all group-hover:brightness-110"
                          ></div>
                          <div
                            style={{ height: `${visitorsHeight}%` }}
                            className="w-1/2 max-w-[24px] bg-emerald-500 dark:bg-emerald-400 rounded-t-md transition-all group-hover:brightness-110"
                          ></div>
                        </div>

                        {/* Date label */}
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          {item.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Visited Pages List */}
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Trang Được Xem Nhiều Nhất
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Xếp hạng các URL có lượt truy cập cao nhất.
              </p>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-1">
                {stats.topPages.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-8">
                    Chưa có dữ liệu lượt xem trang.
                  </p>
                ) : (
                  stats.topPages.map((page, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-800 dark:text-slate-200 truncate max-w-[180px]" title={page.path}>
                          <span className="text-slate-400 font-mono mr-1.5">#{idx + 1}</span>
                          {page.path}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">
                          {page.views} lượt ({page.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(page.percentage, 2)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
