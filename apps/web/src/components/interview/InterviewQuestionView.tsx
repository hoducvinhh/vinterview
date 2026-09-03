'use client';

import { useState } from 'react';
import { Question, Answer } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

interface InterviewQuestionViewProps {
  question: Question;
  totalQuestions: number;
  currentIndex: number;
  onSubmit: (userAnswer: string, rating: number) => Promise<{ expectedAnswer: Answer; isComplete: boolean }>;
}

export function InterviewQuestionView({
  question,
  totalQuestions,
  currentIndex,
  onSubmit,
}: InterviewQuestionViewProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [rating, setRating] = useState<number>(3);
  const [submitting, setSubmitting] = useState(false);

  const handleRevealSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      alert('Vui lòng nhập câu trả lời hoặc phác thảo ý chính trước khi mở lời giải.');
      return;
    }

    setIsRevealed(true);
  };

  const handleConfirmNext = async () => {
    try {
      setSubmitting(true);
      await onSubmit(userAnswer, rating);

      // Reset state for next question
      setUserAnswer('');
      setIsRevealed(false);
      setRating(3);
    } catch (err: any) {
      alert(`Lỗi ghi nhận câu trả lời: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const difficultyVariant =
    question.difficulty === 'EASY'
      ? 'easy'
      : question.difficulty === 'MEDIUM'
      ? 'medium'
      : 'hard';

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Header & Progress */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
            Câu hỏi {currentIndex + 1} / {totalQuestions}
          </span>
          <div className="flex gap-2">
            <Badge variant={difficultyVariant}>{question.difficulty}</Badge>
            <Badge variant="tech">{question.technology.name}</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-800">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Statement Card */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
          {question.title}
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
          {question.content}
        </p>
      </div>

      {/* Phase 1: User Answer Input */}
      {!isRevealed ? (
        <form onSubmit={handleRevealSolution} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Nhập Câu Trả Lời Hoặc Ghi Chú Giải Pháp Của Bạn
          </label>
          <textarea
            required
            rows={5}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Nhập giải thích, pseudocode hoặc câu trả lời của bạn trước khi xem đáp án chuẩn..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            Gửi Đáp Án & Xem Lời Giải Chuẩn &rarr;
          </button>
        </form>
      ) : (
        /* Phase 2: Solution Revealed & Self-Assessment */
        <div className="bg-white dark:bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span>✓</span> Đáp Án Chuẩn & Giải Thích
            </h3>
            <span className="text-xs text-slate-500 font-mono">Đã mở lời giải</span>
          </div>

          {/* User Submitted Answer */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">CÂU TRẢ LỜI BẠN ĐÃ NHẬP:</span>
            <p className="text-xs text-slate-800 dark:text-slate-300 whitespace-pre-line">{userAnswer}</p>
          </div>

          {/* Expected Canonical Solution */}
          {question.answer && (
            <div className="space-y-4">
              <div className="bg-emerald-500/5 dark:bg-slate-950 p-4 rounded-xl border border-emerald-500/20 dark:border-slate-800">
                <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 uppercase">ĐÁP ÁN CHUẨN (CANONICAL SOLUTION):</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {question.answer.content}
                </p>
              </div>

              {question.answer.codeSnippet && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                  <div className="bg-slate-900 px-3 py-1.5 text-[11px] text-slate-400 font-mono border-b border-slate-800">
                    Code Minh Họa
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto">
                    <code>{question.answer.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Self-Rating Selector */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
              Đánh giá mức độ am hiểu của bạn đối với câu hỏi này (Tự đánh giá)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { val: 1, label: '1 - Chưa hiểu' },
                { val: 2, label: '2 - Sơ bộ' },
                { val: 3, label: '3 - Khá' },
                { val: 4, label: '4 - Vững' },
                { val: 5, label: '5 - Thành thạo' },
              ].map((r) => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setRating(r.val)}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    rating === r.val
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={handleConfirmNext}
            className="w-full py-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {submitting ? 'Đang lưu đánh giá...' : currentIndex + 1 >= totalQuestions ? 'Hoàn Thành Phỏng Vấn & Xem Kết Quả &rarr;' : 'Câu Hỏi Tiếp Theo &rarr;'}
          </button>
        </div>
      )}
    </div>
  );
}
