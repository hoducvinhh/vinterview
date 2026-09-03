'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminHeader() {
  const pathname = usePathname();

  const tabs = [
    { label: '📊 Thống Kê Truy Cập', href: '/admin' },
    { label: '📝 Quản Lý Câu Hỏi', href: '/admin/questions' },
    { label: '📁 Quản Lý Danh Mục', href: '/admin/categories' },
    { label: '⚡ Quản Lý Công Nghệ', href: '/admin/technologies' },
    { label: '👥 Quản Lý Người Dùng', href: '/admin/users' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20 uppercase">
          ADMIN PORTAL
        </span>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white hidden sm:inline">
          Bảng Điều Khiển Quản Trị
        </h2>
      </div>

      <nav className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
            >
              {tab.label}
            </Link>
          );
        })}
        <a
          href="http://localhost:4003/api/docs"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
        >
          🔒 Swagger API Docs
        </a>
      </nav>
    </div>
  );
}

