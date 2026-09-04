'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Badge } from '@/components/ui/Badge';
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton';
import { ProgressSelect } from '@/components/progress/ProgressSelect';
import { ProgressStatus } from '@/lib/api';

interface QuestionCardProps {
  id: string;
  title: string;
  slug: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  technology: string;
  contentSnippet: string;
  userProgressStatus?: ProgressStatus;
}

export function QuestionCard({
  id,
  title,
  slug,
  difficulty,
  category,
  technology,
  contentSnippet,
  userProgressStatus = 'NOT_STARTED',
}: QuestionCardProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const difficultyVariant =
    difficulty === 'EASY'
      ? 'easy'
      : difficulty === 'MEDIUM'
        ? 'medium'
        : 'hard';

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between">
        <div>
          {/* Header Badges & Actions */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={difficultyVariant}>{difficulty}</Badge>
              <Badge variant="category">{category}</Badge>
              <Badge variant="tech">{technology}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <ProgressSelect questionId={id} initialStatus={userProgressStatus} />
              <BookmarkButton questionId={id} size="sm" />
            </div>
          </div>

          {/* Question Title Link */}
          <Link
            href={`/questions/${slug}`}
            onClick={handleCardClick}
            className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Content Snippet */}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {contentSnippet}
          </p>
        </div>

        {/* Footer Link */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Chi tiết & Đáp án</span>
          <Link
            href={`/questions/${slug}`}
            onClick={handleCardClick}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="📖 Xem Lời Giải & Đáp Án Chi Tiết"
        description="Bạn cần đăng nhập để xem toàn bộ đáp án chuẩn, mã nguồn mẫu và phân tích chuyên sâu của câu hỏi này."
        icon="🔒"
      />
    </>
  );
}
