import Link from 'next/link';

export function Footer() {
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
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-mono"
          >
            Swagger API
          </a>
        </div>
      </div>
    </footer>
  );
}
