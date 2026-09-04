'use client';

import { useState, useRef, useEffect } from 'react';
import { Question, Answer, AiEvaluationResult } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { CodeSandboxEditor } from '../code/CodeSandboxEditor';

interface SubmitResult {
  expectedAnswer: Answer;
  aiEvaluation?: AiEvaluationResult;
  isComplete: boolean;
  nextQuestion?: Question | null;
  nextIndex?: number;
}

interface InterviewQuestionViewProps {
  question: Question;
  totalQuestions: number;
  currentIndex: number;
  onSubmit: (userAnswer: string, rating: number) => Promise<SubmitResult>;
  onNextQuestion: (nextQuestion?: Question | null, nextIndex?: number) => void;
}

export function InterviewQuestionView({
  question,
  totalQuestions,
  currentIndex,
  onSubmit,
  onNextQuestion,
}: InterviewQuestionViewProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<SubmitResult | null>(null);

  // Editor Mode State
  const [activeInputMode, setActiveInputMode] = useState<'text' | 'code'>('text');

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLang, setSpeechLang] = useState<'vi-VN' | 'en-US'>('vi-VN');

  const recognitionRef = useRef<any>(null);

  // Cleanup speech synthesis & recognition on unmount or question change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) { }
      }
    };
  }, [question.id]);

  // Speech-to-Text Handler (Record Voice)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Google Chrome hoặc Microsoft Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      let finalTranscript = userAnswer;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += (finalTranscript ? ' ' : '') + transcriptPiece;
          } else {
            currentTranscript += transcriptPiece;
          }
        }
        setUserAnswer(finalTranscript + (currentTranscript ? ` ${currentTranscript}` : ''));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Text-to-Speech Handler (Read Question Aloud)
  const toggleReadQuestion = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ đọc văn bản bằng giọng nói (SpeechSynthesis).');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${question.title}. ${question.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = speechLang;
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      alert('Vui lòng nhập câu trả lời hoặc ý chính của bạn trước khi gửi AI đánh giá.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (isSpeaking && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      setIsSubmitting(true);
      const res = await onSubmit(userAnswer, 3);
      setEvaluationResult(res);
    } catch (err: any) {
      alert(`Lỗi khi gọi AI đánh giá: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedNext = () => {
    const nextQ = evaluationResult?.nextQuestion;
    const nextIdx = evaluationResult?.nextIndex;

    // Reset component local state
    setUserAnswer('');
    setEvaluationResult(null);
    setIsListening(false);
    setIsSpeaking(false);
    setActiveInputMode('text');

    onNextQuestion(nextQ, nextIdx);
  };

  const difficultyVariant =
    question.difficulty === 'EASY'
      ? 'easy'
      : question.difficulty === 'MEDIUM'
        ? 'medium'
        : 'hard';

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const ai = evaluationResult?.aiEvaluation;

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

      {/* Question Statement Card with Voice Read Aloud Button */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {question.title}
          </h2>

          {/* Voice Text-to-Speech Button */}
          <button
            type="button"
            onClick={toggleReadQuestion}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${isSpeaking
                ? 'bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-purple-500'
              }`}
            title="Đọc câu hỏi bằng giọng nói"
          >
            <span>{isSpeaking ? '⏹ Dừng Đọc' : '🔊 Đọc Câu Hỏi'}</span>
          </button>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
          {question.content}
        </p>
      </div>

      {/* Answer Form & AI Evaluation State */}
      {!evaluationResult ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          {/* Mode Switcher Header: Text/Voice vs Monaco Code Editor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveInputMode('text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeInputMode === 'text'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                ✍️ Trả Lời Văn Bản / Giọng Nói
              </button>

              <button
                type="button"
                onClick={() => setActiveInputMode('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${activeInputMode === 'code'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <span>💻 Viết & Chạy Code (VS Code)</span>
              </button>
            </div>

            {activeInputMode === 'text' && (
              <div className="flex items-center gap-2">
                {/* Voice Language Switcher */}
                <div className="flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSpeechLang('vi-VN')}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${speechLang === 'vi-VN'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                  >
                    🇻🇳 VN
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLang('en-US')}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${speechLang === 'en-US'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                  >
                    🇺🇸 EN
                  </button>
                </div>

                {/* Speech-to-Text Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${isListening
                      ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 animate-pulse'
                      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                    }`}
                >
                  <span>{isListening ? '🔴 Đang Thu Âm' : '🎙️ Nói Trực Tiếp'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mode 1: Textarea & Voice Input */}
          {activeInputMode === 'text' ? (
            <div className="relative space-y-2">
              <textarea
                required
                rows={6}
                disabled={isSubmitting}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Bạn có thể gõ giải thích hoặc bấm '🎙️ Nói Trực Tiếp' để micro tự ghi âm..."
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl p-4 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 disabled:opacity-50 transition-colors ${isListening
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 bg-rose-500/5'
                    : 'border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-purple-500'
                  }`}
              />
              {isListening && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Micro đang nghe...</span>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Live Monaco Code Editor & Runner */
            <div className="space-y-4">
              <CodeSandboxEditor
                onAppendCodeToAnswer={(snippet) => {
                  setUserAnswer((prev) => prev + snippet);
                  setActiveInputMode('text');
                }}
              />
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Nội dung câu trả lời hoàn chỉnh (Sẽ gửi tới AI):
                </label>
                <textarea
                  required
                  rows={4}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Đoạn code của bạn sẽ được chèn vào đây. Bạn có thể bổ sung thêm giải thích trước khi bấm gửi AI..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-60 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>AI Tech Lead đang chấm điểm & phân tích câu trả lời...</span>
              </>
            ) : (
              <>
                <span>✨ Gửi Đáp Án & Nhận Feedback AI Tech Lead</span>
                <span></span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* AI Evaluation Result Card */
        <div className="space-y-6 animate-fade-in">
          {/* AI Feedback Banner */}
          <div className="bg-gradient-to-br from-purple-500/10 via-white to-blue-500/10 dark:from-purple-900/20 dark:via-slate-900 dark:to-blue-900/20 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* AI Score Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-500/20 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 dark:bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xl">
                  ✨
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Đánh giá từ AI Tech Lead
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-300/80">
                    Phân tích tự động dựa trên Gemini 2.5 AI Model
                  </p>
                </div>
              </div>

              {/* Score Badges */}
              {ai && (
                <div className="flex items-center gap-3 bg-white dark:bg-purple-950/60 p-2 rounded-xl border border-purple-500/30 shadow-sm">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-300">Điểm AI</div>
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                      {ai.scorePercent}%
                    </div>
                  </div>
                  <div className="h-8 w-px bg-purple-500/20" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-300">Xếp loại</div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {ai.rating >= 4 ? '⭐️⭐️⭐️⭐️⭐️ Xuất sắc' : ai.rating >= 3 ? '⭐️⭐️⭐️ Khá tốt' : '⚠️ Cần cố gắng'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Feedback Overview */}
            {ai?.aiFeedback && (
              <div className="bg-white/80 dark:bg-slate-950/80 p-4 rounded-xl border border-purple-500/20 space-y-2 shadow-sm">
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  📝 Nhận xét của Chuyên gia AI:
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {ai.aiFeedback}
                </p>
              </div>
            )}

            {/* Strengths & Improvements Grid */}
            {ai && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>✓</span> Điểm tốt trong câu trả lời:
                  </span>
                  <ul className="space-y-1.5">
                    {ai.strengths && ai.strengths.length > 0 ? (
                      ai.strengths.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-800 dark:text-emerald-200/90 flex items-start gap-2">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-500 dark:text-slate-400 italic">Chưa ghi nhận điểm sáng nổi bật.</li>
                    )}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💡</span> Cần bổ sung / Cải thiện:
                  </span>
                  <ul className="space-y-1.5">
                    {ai.improvements && ai.improvements.length > 0 ? (
                      ai.improvements.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-800 dark:text-amber-200/90 flex items-start gap-2">
                          <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-emerald-600 dark:text-emerald-400 italic">Không có thiếu sót lớn nào!</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* AI Suggested Answer */}
            {ai?.suggestedAnswer && (
              <div className="bg-white/80 dark:bg-slate-950/90 p-4 rounded-xl border border-blue-500/20 space-y-2 shadow-sm">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  🌟 Gợi ý câu trả lời chuẩn mực từ AI:
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-500/10">
                  {ai.suggestedAnswer}
                </p>
              </div>
            )}

            {/* User Submitted Answer Review */}
            <div className="bg-white/60 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Câu trả lời bạn đã gửi:</span>
              <p className="text-xs text-slate-800 dark:text-slate-300 whitespace-pre-line">{userAnswer}</p>
            </div>

            {/* Canonical Answer from Database */}
            {question.answer && (
              <div className="bg-white/60 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Đáp án hệ thống mẫu:</span>
                <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {question.answer.content}
                </p>
                {question.answer.codeSnippet && (
                  <pre className="p-3 text-xs font-mono text-cyan-600 dark:text-cyan-300 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto border border-slate-200 dark:border-slate-800 mt-2">
                    <code>{question.answer.codeSnippet}</code>
                  </pre>
                )}
              </div>
            )}


            {/* Action button to proceed */}
            <button
              type="button"
              onClick={handleProceedNext}
              className="w-full py-3.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{evaluationResult.isComplete ? 'Hoàn Thành Phỏng Vấn & Xem Tổng Kết' : 'Chuyển Sang Câu Hỏi Tiếp Theo'}</span>
              <span></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
