'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { AuthModal } from '@/components/auth/AuthModal';

interface BookmarkButtonProps {
  questionId: string;
  initialIsBookmarked?: boolean;
  size?: 'sm' | 'md';
  onRemoveBookmark?: (questionId: string) => void;
  onToggleBookmark?: (isBookmarked: boolean, questionId: string) => void;
}

export function BookmarkButton({
  questionId,
  initialIsBookmarked = false,
  size = 'md',
  onRemoveBookmark,
  onToggleBookmark,
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setIsBookmarked(initialIsBookmarked);
  }, [initialIsBookmarked]);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (loading) return;

    const previousState = isBookmarked;
    const newState = !previousState;
    setIsBookmarked(newState);
    setLoading(true);

    try {
      if (previousState) {
        await api.unbookmarkQuestion(questionId);
        onRemoveBookmark?.(questionId);
        onToggleBookmark?.(false, questionId);
      } else {
        await api.bookmarkQuestion(questionId);
        onToggleBookmark?.(true, questionId);
      }
    } catch (err: any) {
      setIsBookmarked(previousState);
    } finally {
      setLoading(false);
    }
  };

  const iconSizes = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonPadding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <>
      <button
        type="button"
        onClick={handleToggleBookmark}
        disabled={loading}
        title={isBookmarked ? 'Bỏ lưu câu hỏi này' : 'Lưu câu hỏi này'}
        className={`${buttonPadding} rounded-lg transition-all cursor-pointer ${
          isBookmarked
            ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30'
            : 'text-slate-400 hover:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
        }`}
      >
        <svg
          className={`${iconSizes} ${isBookmarked ? 'fill-amber-400' : 'fill-none'}`}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="🔖 Đánh Dấu Câu Hỏi Yêu Thích"
        description="Bạn cần đăng nhập để lưu trữ bộ sưu tập các câu hỏi phỏng vấn quan trọng vào tài khoản cá nhân."
        icon="🔖"
      />
    </>
  );
}

