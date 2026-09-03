'use client';

import Link from 'next/link';
import { QuestionSummary } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

interface InterviewResultViewProps {
  result: {
    sessionId: string;
    totalQuestions: number;
    totalScore: number;
    maxScore: number;
    scorePercentage: number;
    readinessGrade: string;
    questionsSummary: QuestionSummary[];
  };
  onRetry: () => void;
}

export function InterviewResultView({ result, onRetry }: InterviewResultViewProps) {
  const { totalQuestions, totalScore, maxScore, scorePercentage, readinessGrade, questionsSummary } = result;

  const translatedGrade =
    readinessGrade === 'Senior Ready'
      ? '🌟 Sẵn sàng Level Senior'
      : readinessGrade === 'Mid-Level Ready'
      ? '👍 Sẵn sàng Level Mid-Level'
      : '📚 Cần Ôn Tập Thêm';

  const gradeColor =
    scorePercentage >= 80
      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : scorePercentage >= 60
      ? 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'
      : 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Result Hero Header */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
          🎉 Hoàn Thành Buổi Phỏng Vấn Thử
        </div>

        <div className="space-y-1">
          <div className="text-6xl font-black tracking-tight text-slate-900 dark:text-white">{scorePercentage}%</div>
          <div className={`inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase border mt-2 ${gradeColor}`}>
            {translatedGrade}
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Bạn đã đạt <span className="text-slate-900 dark:text-white font-bold">{totalScore}</span> trên tổng số{' '}
          <span className="text-slate-900 dark:text-white font-bold">{maxScore}</span> điểm tự đánh giá qua{' '}
          <span className="text-slate-900 dark:text-white font-bold">{totalQuestions}</span> câu hỏi.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            Luyện Phỏng Vấn Lại &rarr;
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Xem Dashboard
          </Link>
        </div>
      </div>

      {/* Breakdown Questions Table */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Chi Tiết Điểm Số Các Câu Hỏi</h2>

        <div className="space-y-4 divide-y divide-slate-200 dark:divide-slate-800">
          {questionsSummary.map((q, index) => (
            <div key={q.id || index} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-slate-400 mr-2">#{index + 1}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{q.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="tech">{q.technology}</Badge>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Đánh giá: {q.rating}/5
                  </span>
                </div>
              </div>

              {q.userAnswer && (
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-300">Câu trả lời của bạn: </span>
                  <span>{q.userAnswer}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
