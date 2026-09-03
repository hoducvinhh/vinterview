'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { api, Question } from '@/lib/api';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Question[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const submitSearch = () => {
    const term = search.trim();
    if (term) router.push(`/questions?search=${encodeURIComponent(term)}`);
  };

  const navItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Câu hỏi', href: '/questions' },
    { label: 'Luyện phỏng vấn', href: '/interview' },
    { label: '☕️ Donate', href: '/donate', isHighlight: true },
    ...(isAuthenticated
      ? [
          { label: 'Tổng quan', href: '/dashboard' },
          { label: 'Đã lưu', href: '/bookmarks' },
        ]
      : []),
    ...(isAdmin ? [{ label: 'Quản trị', href: '/admin/questions' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              V
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Vinterview
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              if (item.isHighlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Right Section: Search, Theme Toggle & Auth */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden sm:block w-36 md:w-52">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 cursor-pointer"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <kbd className="hidden md:inline-block px-1 py-0.5 text-[9px] font-mono text-slate-500 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded">
                ⌘K
              </kbd>
            </div>
            {showSuggestions && search.trim().length >= 2 && (
              <div className="absolute z-30 left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
                {suggestions.length > 0 ? suggestions.map((question) => (
                  <Link key={question.id} href={`/questions/${question.slug}`} className="block border-b border-slate-100 dark:border-slate-800 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="block text-[11px] font-semibold text-slate-900 dark:text-white line-clamp-2">{question.title}</span>
                    <span className="text-[9px] text-slate-500">{question.technology.name} · {question.category.name}</span>
                  </Link>
                )) : <div className="px-3 py-2 text-[11px] text-slate-500">Không có câu hỏi liên quan.</div>}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Authentication Actions */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user.name || user.email.split('@')[0]}
                </span>
                <span className={`text-[10px] font-bold uppercase font-mono ${isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {user.role}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 rounded-lg transition-all"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:shadow-blue-600/40"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
