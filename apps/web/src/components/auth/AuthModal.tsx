'use client';

import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  title = '🔒 Yêu Cầu Đăng Nhập',
  description = 'Bạn cần đăng nhập hoặc tạo tài khoản miễn phí để sử dụng tính năng này trên Vinterview.',
  icon = '🚀',
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
        >
          ✕
        </button>

        {/* Header Icon & Text */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
            {icon}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Benefits List */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Quyền lợi thành viên Vinterview:
          </span>
          <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Phỏng vấn giả lập thời gian thực với AI
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Phân tích CV PDF cá nhân hóa
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Biên dịch & chạy thử Code Sandbox trực tiếp
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Theo dõi tiến độ & Bookmark bộ câu hỏi
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/login"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center block shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all"
          >
            🔑 Đăng Nhập Ngay &rarr;
          </Link>
          <Link
            href="/register"
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold text-center block border border-slate-200 dark:border-slate-700 transition-all"
          >
            ✨ Tạo Tài Khoản Miễn Phí
          </Link>
        </div>
      </div>
    </div>
  );
}
