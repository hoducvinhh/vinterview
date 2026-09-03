'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface BookmarkButtonProps {
  questionId: string;
  initialIsBookmarked?: boolean;
  size?: 'sm' | 'md';
}

export function BookmarkButton({
  questionId,
  initialIsBookmarked = false,
  size = 'md',
}: BookmarkButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (loading) return;

    // Optimistic UI Update
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);
    setLoading(true);

    try {
      if (previousState) {
        await api.unbookmarkQuestion(questionId);
      } else {
        await api.bookmarkQuestion(questionId);
      }
    } catch (err: any) {
      // Revert optimistic state safely on error
      setIsBookmarked(previousState);
    } finally {
      setLoading(false);
    }
  };

  const iconSizes = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonPadding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      type="button"
      onClick={handleToggleBookmark}
      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
      className={`${buttonPadding} rounded-lg transition-all ${
        isBookmarked
          ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30'
          : 'text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
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
  );
}
