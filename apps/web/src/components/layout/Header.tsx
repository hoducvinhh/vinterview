'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setShowSuggestions(false);
  }, [pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search autocomplete debounce
  useEffect(() => {
    const term = search.trim();
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        const response = await api.getQuestions({ search: term, limit: 5 });
        setSuggestions(response.data);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const submitSearch = () => {
    const term = search.trim();
    if (term) {
      router.push(`/questions?search=${encodeURIComponent(term)}`);
      setShowSuggestions(false);
    }
  };

  const navItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Câu hỏi', href: '/questions' },
    { label: 'Phỏng vấn AI', href: '/interview' },
    ...(isAuthenticated
      ? [
          { label: 'Tổng quan', href: '/dashboard' },
          { label: 'Đã lưu', href: '/bookmarks' },
        ]
      : []),
    ...(isAdmin ? [{ label: 'Quản trị', href: '/admin/questions' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
        
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-5 lg:gap-7">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              V
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Vinterview
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Search, Donate, Theme Toggle & User Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Live Search */}
          <div ref={searchRef} className="relative hidden sm:block w-36 md:w-48 lg:w-56">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Suggestions Popover */}
            {showSuggestions && search.trim().length >= 2 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1.5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
                {suggestions.length > 0 ? (
                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      Gợi ý câu hỏi
                    </div>
                    {suggestions.map((question) => (
                      <Link
                        key={question.id}
                        href={`/questions/${question.slug}`}
                        onClick={() => setShowSuggestions(false)}
                        className="block px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-b last:border-0 border-slate-100 dark:border-slate-800 transition-colors"
                      >
                        <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {question.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {question.technology.name} · {question.category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-2.5 text-xs text-slate-500 text-center">
                    Không tìm thấy câu hỏi phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Donate Link */}
          <Link
            href="/donate"
            className={`hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              pathname === '/donate'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
            }`}
          >
            ☕️ Donate
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Auth / Profile */}
          {isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.email}
                    className="w-6 h-6 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline-block text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                  {user.name || user.email.split('@')[0]}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-1.5 z-50">
                  <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name || 'Người dùng'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isAdmin
                          ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300'
                          : 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300'
                      }`}>
                        {user.role}
                      </span>
                      {user.isPremium && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      📊 Tổng quan học tập
                    </Link>
                    <Link
                      href="/bookmarks"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      🔖 Câu hỏi đã lưu
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      👤 Trang cá nhân
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/questions"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-1.5 rounded-lg text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors"
                      >
                        🛡️ Trang quản trị
                      </Link>
                    )}
                  </div>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    type="button"
                    onClick={() => { setIsUserMenuOpen(false); logout(); }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-3">
          {/* Mobile Search */}
          <div className="relative w-full sm:hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/donate"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
            >
              ☕️ Donate ủng hộ dự án
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
