'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api, ProgressStatus } from '@/lib/api';
import { AuthModal } from '@/components/auth/AuthModal';

interface ProgressSelectProps {
  questionId: string;
  initialStatus?: ProgressStatus;
}

export function ProgressSelect({
  questionId,
  initialStatus = 'NOT_STARTED',
}: ProgressSelectProps) {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<ProgressStatus>(initialStatus);
  const [updating, setUpdating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ProgressStatus;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const previousStatus = status;
    setStatus(newStatus);
    setUpdating(true);

    try {
      await api.updateQuestionProgress(questionId, newStatus);
    } catch (err: any) {
      // Revert status on failure
      setStatus(previousStatus);
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    NOT_STARTED: 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800',
    IN_PROGRESS: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20',
    COMPLETED: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20',
  };

  return (
    <>
      <div className="relative inline-flex items-center">
        <select
          value={status}
          disabled={updating}
          onChange={handleChange}
          className={`px-2.5 py-1 rounded-lg text-xs border focus:outline-none cursor-pointer transition-all ${statusColors[status]}`}
        >
          <option value="NOT_STARTED" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            ⭕ Not Started
          </option>
          <option value="IN_PROGRESS" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            ⏳ In Progress
          </option>
          <option value="COMPLETED" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            ✅ Completed
          </option>
        </select>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="📊 Theo Dõi Tiến Độ Học Tập"
        description="Bạn cần đăng nhập để lưu trạng thái đã làm (Not Started / In Progress / Completed) của câu hỏi phỏng vấn."
        icon="📊"
      />
    </>
  );
}
