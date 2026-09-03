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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider">
          🎉 Báo Cáo Phân Tích Từ Gemini AI Tech Lead
        </div>

        <div className="space-y-1">
          <div className="text-6xl font-black tracking-tight text-slate-900 dark:text-white">{scorePercentage}%</div>
          <div className={`inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase border mt-2 ${gradeColor}`}>
            {translatedGrade}
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Điểm số được tính toán tự động bởi Gemini AI dựa trên{' '}
          <span className="text-slate-900 dark:text-white font-bold">{totalQuestions}</span> câu hỏi phỏng vấn kỹ thuật.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer"
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

      {/* Breakdown Questions Table with AI Feedback */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>✨</span> Chi Tiết Đánh Giá Từ AI Cho Từng Câu Hỏi
        </h2>

        <div className="space-y-6 divide-y divide-slate-200 dark:divide-slate-800">
          {questionsSummary.map((q, index) => (
            <div key={q.id || index} className="pt-6 first:pt-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{q.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="tech">{q.technology}</Badge>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    Điểm AI: {q.rating}/5 ({q.aiEvaluation?.scorePercent || q.rating * 20}%)
                  </span>
                </div>
              </div>

              {/* User answer preview */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-1">CÂU TRẢ LỜI CỦA BẠN:</span>
                <p className="whitespace-pre-line">{q.userAnswer || 'Chưa nhập câu trả lời.'}</p>
              </div>

              {/* AI Feedback Box */}
              {q.aiEvaluation && (
                <div className="bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/20 rounded-xl p-4 space-y-2">
                  <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <span>🤖 AI Feedback:</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
                    {q.aiEvaluation.aiFeedback}
                  </p>
                  
                  {q.aiEvaluation.strengths && q.aiEvaluation.strengths.length > 0 && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                      ✓ Điểm mạnh: {q.aiEvaluation.strengths.join(', ')}
                    </div>
                  )}

                  {q.aiEvaluation.improvements && q.aiEvaluation.improvements.length > 0 && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      💡 Cần bổ sung: {q.aiEvaluation.improvements.join(', ')}
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
