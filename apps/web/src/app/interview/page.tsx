'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api, Question, StartInterviewPayload, InterviewResultResponse } from '@/lib/api';
import { InterviewSetup } from '@/components/interview/InterviewSetup';
import { InterviewQuestionView } from '@/components/interview/InterviewQuestionView';
import { InterviewResultView } from '@/components/interview/InterviewResultView';
import { AuthModal } from '@/components/auth/AuthModal';

export default function InterviewPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [step, setStep] = useState<'setup' | 'active' | 'result'>('setup');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [result, setResult] = useState<InterviewResultResponse['data'] | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = async (payload: StartInterviewPayload) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsStarting(true);
      const res = await api.startInterview(payload);
      setSessionId(res.data.sessionId);
      setTotalQuestions(res.data.totalQuestions);
      setCurrentIndex(res.data.currentIndex);
      setCurrentQuestion(res.data.question);
      setStep('active');
    } catch (err: any) {
      alert(err.message || 'Failed to start practice interview session.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async (userAnswer: string, rating: number) => {
    if (!sessionId || !currentQuestion) {
      throw new Error('No active interview session.');
    }

    const res = await api.submitInterviewAnswer(sessionId, {
      questionId: currentQuestion.id,
      userAnswer,
      rating,
    });

    let nextQuestionData: Question | null = null;
    if (res.data.isComplete) {
      const resultRes = await api.getInterviewResult(sessionId);
      setResult(resultRes.data);
    } else if (res.data.nextQuestion) {
      nextQuestionData = res.data.nextQuestion;
    }

    return {
      expectedAnswer: res.data.expectedAnswer,
      aiEvaluation: res.data.aiEvaluation,
      isComplete: res.data.isComplete,
      nextQuestion: nextQuestionData,
      nextIndex: res.data.currentIndex,
    };
  };

  const handleRetry = () => {
    setStep('setup');
    setSessionId(null);
    setCurrentQuestion(null);
    setCurrentIndex(0);
    setTotalQuestions(0);
    setResult(null);
  };

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Auth Gated Hero Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 sm:p-12 shadow-2xl text-center space-y-6 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-3xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            🤖
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              Member Exclusive Feature
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Phỏng Vấn Giả Lập Thời Gian Thực Với AI
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Trải nghiệm môi trường phỏng vấn thực tế với sự hỗ trợ của trí tuệ nhân tạo. AI sẽ đánh giá câu trả lời, phân tích điểm mạnh, điểm yếu và tự động phân tích file CV PDF của bạn.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-xl">⚡</span>
              <h3 className="text-xs font-bold text-white">Chấm Điểm Tự Động</h3>
              <p className="text-[11px] text-slate-400">AI chấm điểm câu trả lời và đề xuất cách cải thiện tối ưu.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-xl">📄</span>
              <h3 className="text-xs font-bold text-white">Phân Tích CV PDF</h3>
              <p className="text-[11px] text-slate-400">Trích xuất kỹ năng từ CV và gợi ý bộ câu hỏi trúng đích.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-xl">📊</span>
              <h3 className="text-xs font-bold text-white">Báo Cáo Readiness</h3>
              <p className="text-[11px] text-slate-400">Đánh giá mức độ sẵn sàng phỏng vấn trước ngày gặp nhà tuyển dụng.</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer"
            >
              🔑 Đăng Nhập Để Khởi Tạo Phỏng Vấn AI
            </button>
            <Link
              href="/questions"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition-all text-center"
            >
              Xem Ngân Hàng Câu Hỏi Miễn Phí
            </Link>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title="🤖 Phỏng Vấn Giả Lập & Phân Tích CV Bằng AI"
          description="Vui lòng đăng nhập hoặc đăng ký tài khoản miễn phí để khởi tạo phiên phỏng vấn tương tác với AI."
          icon="🤖"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {step === 'setup' && (
        <InterviewSetup onStart={handleStartInterview} isStarting={isStarting} />
      )}

      {step === 'active' && currentQuestion && (
        <InterviewQuestionView
          question={currentQuestion}
          totalQuestions={totalQuestions}
          currentIndex={currentIndex}
          onSubmit={handleSubmitAnswer}
          onNextQuestion={(nextQuestion, nextIndex) => {
            if (nextQuestion && typeof nextIndex === 'number') {
              setCurrentQuestion(nextQuestion);
              setCurrentIndex(nextIndex);
            } else {
              setStep('result');
            }
          }}
        />
      )}

      {step === 'result' && result && (
        <InterviewResultView result={result} onRetry={handleRetry} />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="🤖 Phỏng Vấn Giả Lập AI"
        description="Vui lòng đăng nhập để bắt đầu phỏng vấn AI."
        icon="🤖"
      />
    </div>
  );
}

