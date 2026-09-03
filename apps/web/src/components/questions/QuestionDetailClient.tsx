'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Question } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton';
import { ProgressSelect } from '@/components/progress/ProgressSelect';
import { AuthModal } from '@/components/auth/AuthModal';

interface QuestionDetailClientProps {
  question: Question;
  relatedQuestions: Question[];
}

export function QuestionDetailClient({ question, relatedQuestions }: QuestionDetailClientProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const difficultyVariant =
    question.difficulty === 'EASY'
      ? 'easy'
      : question.difficulty === 'MEDIUM'
      ? 'medium'
      : 'hard';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/questions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Câu hỏi
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
          {question.title}
        </span>
      </nav>

      {/* Header Info Section */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={difficultyVariant}>{question.difficulty}</Badge>
            <Badge variant="category">{question.category.name}</Badge>
            <Badge variant="tech">{question.technology.name}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <ProgressSelect questionId={question.id} />
            <BookmarkButton questionId={question.id} size="md" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
          {question.title}
        </h1>

        <div className="text-xs text-slate-500 font-mono">
          Cập nhật gần nhất: {new Date(question.updatedAt).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Question Statement Section (Public for SEO) */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            📌 Nội Dung Câu Hỏi
          </h2>
          <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {question.content}
          </div>
        </div>

        {/* Answer Solution Section (GATED for Members Only) */}
        {question.answer ? (
          !isLoading && isAuthenticated ? (
            <div className="bg-white dark:bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span>✓</span> Đáp Án & Lời Giải Chi Tiết
                </h2>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Verified Solution
                </span>
              </div>

              {/* Answer Content */}
              <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {question.answer.content}
              </div>

              {/* Code Snippet Display */}
              {question.answer.codeSnippet && (
                <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                  <div className="bg-slate-950/80 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
                    <span>Mã Code Minh Họa</span>
                    <span className="text-[10px] text-slate-400 uppercase">{question.technology.name}</span>
                  </div>
                  <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                    <code>{question.answer.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Explanation Deep Dive */}
              {question.answer.explanation && (
                <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                    💡 Phân Tích Chuyên Sâu (Deep Dive)
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {question.answer.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Gated Blur Card for Unauthenticated Users */
            <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 overflow-hidden shadow-xl">
              {/* Blurred Dummy Content in Background */}
              <div className="filter blur-md opacity-30 select-none space-y-4 pointer-events-none text-left">
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full" />
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6" />
                <div className="h-24 bg-slate-800 rounded-xl w-full" />
              </div>

              {/* Foreground Lock Banner */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950/80 flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-3xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                  🔒
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Đáp Án Chi Tiết Đã Bị Khóa
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Bạn cần đăng nhập hoặc tạo tài khoản miễn phí để xem toàn bộ đáp án chuẩn, mã nguồn mẫu và phân tích chuyên sâu của câu hỏi này.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all text-center"
                  >
                    🔑 Đăng Nhập Để Mở Khóa
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-all text-center"
                  >
                    ✨ Tạo Tài Khoản Miễn Phí
                  </Link>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-6 rounded-2xl text-xs font-semibold text-center">
            ⚠️ Lời giải chuẩn cho câu hỏi này đang được đội ngũ cập nhật.
          </div>
        )}
      </div>

      {/* Related Questions Section */}
      {relatedQuestions.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Câu Hỏi {question.technology.name} Liên Quan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedQuestions.map((q) => (
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
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="📖 Xem Lời Giải & Đáp Án Chi Tiết"
        description="Bạn cần đăng nhập để xem toàn bộ đáp án chuẩn, mã nguồn mẫu và phân tích chuyên sâu của câu hỏi này."
        icon="🔒"
      />
    </div>
  );
}
