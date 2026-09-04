'use client';

import { useEffect, useState } from 'react';
import { api, Category, Technology, StartInterviewPayload } from '@/lib/api';
import { ResumeAnalyzerCard } from './ResumeAnalyzerCard';

interface InterviewSetupProps {
  onStart: (payload: StartInterviewPayload) => void;
  isStarting: boolean;
}

export function InterviewSetup({ onStart, isStarting }: InterviewSetupProps) {
  const [activeTab, setActiveTab] = useState<'standard' | 'cv'>('standard');
  const [categories, setCategories] = useState<Category[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [technology, setTechnology] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | ''>('');
  const [questionCount, setQuestionCount] = useState(5);

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoading(true);
        const [catRes, techRes] = await Promise.all([
          api.getCategories(),
          api.getTechnologies(),
        ]);
        setCategories(catRes.data);
        setTechnologies(techRes.data);
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      ...(technology && { technology }),
      ...(category && { category }),
      ...(difficulty && { difficulty: difficulty as any }),
      questionCount,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-semibold uppercase tracking-wider">
          🚀 Chế Độ Luyện Phỏng Vấn AI
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Cấu Hình Buổi Phỏng Vấn Thử</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Chọn cấu hình tiêu chuẩn hoặc tải lên CV để AI phân tích bộ câu hỏi phù hợp nhất với bạn
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('standard')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'standard'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
        >
          <span>🎯 Theo Chủ Đề & Công Nghệ</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cv')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'cv'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
        >
          <span>📄 Phân Tích CV Bằng AI (Mới)</span>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
            AI
          </span>
        </button>
      </div>

      {/* Tab 1: Standard Topic Selection */}
      {activeTab === 'standard' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl space-y-5 animate-fade-in">
          {/* Technology Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Công Nghệ Trọng Tâm (Technology Stack)
            </label>
            <select
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Tất cả công nghệ (Tổng hợp)</option>
              {technologies.map((tech) => (
                <option key={tech.id} value={tech.slug}>
                  {tech.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chủ Đề / Domain
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">Tất cả chủ đề (Tổng hợp)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty & Count Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Độ Khó
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Tất cả độ khó (Tổng hợp)</option>
                <option value="EASY">EASY (Dễ)</option>
                <option value="MEDIUM">MEDIUM (Trung bình)</option>
                <option value="HARD">HARD (Khó)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số Lượng Câu Hỏi
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
              >
                <option value={3}>3 Câu hỏi (Ôn tập nhanh)</option>
                <option value={5}>5 Câu hỏi (Phỏng vấn tiêu chuẩn)</option>
                <option value={10}>10 Câu hỏi (Đánh giá chuyên sâu)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isStarting || loading}
            className="w-full py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 disabled:opacity-50 transition-all hover:shadow-blue-600/40 cursor-pointer"
          >
            {isStarting ? 'Đang khởi tạo bộ câu hỏi...' : 'Bắt Đầu Luyện Phỏng Vấn Ngay '}
          </button>
        </form>
      )}

      {/* Tab 2: Resume Upload & Analysis */}
      {activeTab === 'cv' && (
        <ResumeAnalyzerCard onStartInterview={async (payload) => onStart(payload)} isStarting={isStarting} />
      )}
    </div>
  );
}
