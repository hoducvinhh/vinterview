'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Footer() {
  const { isAdmin } = useAuth();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 transition-colors mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-blue-600 flex items-center justify-center text-white font-black text-xs">
            V
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-300">Vinterview</span>
          <span>© {new Date().getFullYear()} — Nền tảng luyện phỏng vấn công nghệ chuyên sâu.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/questions" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            Ngân hàng câu hỏi
          </Link>
          <Link href="/interview" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
            Luyện phỏng vấn
          </Link>
          <Link href="/donate" className="text-rose-600 dark:text-rose-400 font-semibold hover:underline transition-colors flex items-center gap-1">
            ☕️ Donate
          </Link>

          {/* Render Swagger API Docs link strictly for Admin accounts */}
          {isAdmin && (
            <a
              href="http://localhost:4003/api/docs"
              target="_blank"
              rel="noreferrer"
              className="px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded hover:bg-purple-500/20 transition-all font-mono"
            >
              🔒 Swagger API
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

