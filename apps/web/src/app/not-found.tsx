import Link from 'next/link';

export const metadata = {
  title: '404 - Trang Không Tồn Tại | Vinterview',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển trên hệ thống Vinterview.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-4xl">
        🔍
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        404 — Trang Không Tồn Tại
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        Đường dẫn bạn truy cập không tồn tại, đã đổi tên hoặc đã bị xóa. Vui lòng kiểm tra lại URL hoặc quay về ngân hàng câu hỏi.
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <Link
          href="/"
          className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
        >
          🏠 Trang Chủ Vinterview
        </Link>
        <Link
          href="/questions"
          className="px-6 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          📚 Ngân Hàng Câu Hỏi IT
        </Link>
      </div>
    </div>
  );
}
