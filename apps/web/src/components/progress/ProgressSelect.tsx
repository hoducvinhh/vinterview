'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, ProgressStatus } from '@/lib/api';

interface ProgressSelectProps {
  questionId: string;
  initialStatus?: ProgressStatus;
}

export function ProgressSelect({
  questionId,
  initialStatus = 'NOT_STARTED',
}: ProgressSelectProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<ProgressStatus>(initialStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ProgressStatus;

    if (!isAuthenticated) {
      router.push('/login');
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
    NOT_STARTED: 'bg-slate-900 border-slate-800 text-slate-400',
    IN_PROGRESS: 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-semibold',
    COMPLETED: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold',
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        disabled={updating}
        onChange={handleChange}
        className={`px-2.5 py-1 rounded-lg text-xs border focus:outline-none cursor-pointer transition-all ${statusColors[status]}`}
      >
        <option value="NOT_STARTED">⭕ Not Started</option>
        <option value="IN_PROGRESS">⏳ In Progress</option>
        <option value="COMPLETED">✅ Completed</option>
      </select>
    </div>
  );
}
