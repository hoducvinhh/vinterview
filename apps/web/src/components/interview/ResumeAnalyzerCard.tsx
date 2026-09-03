'use client';

import { useState } from 'react';
import { api, CvAnalysisResponse, StartInterviewPayload } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

interface ResumeAnalyzerCardProps {
  onStartInterview: (payload: StartInterviewPayload) => Promise<void>;
  isStarting: boolean;
}

export function ResumeAnalyzerCard({ onStartInterview, isStarting }: ResumeAnalyzerCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvResult, setCvResult] = useState<CvAnalysisResponse['data'] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
        alert('Vui lòng chỉ chọn file định dạng PDF (.pdf).');
        return;
      }
      setFile(selected);
      setCvResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      const res = await api.analyzeResume(file);
      setCvResult(res.data);
    } catch (err: any) {
      alert(`Lỗi khi phân tích CV: ${err.message || err}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLaunchTargetedInterview = async () => {
    if (!cvResult) return;
    
    // Choose primary matched technology or general interview
    const primaryTech = cvResult.matchedTechnologies[0]?.slug || undefined;

    await onStartInterview({
      technology: primaryTech,
      questionCount: 5,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-xl">
          📄
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Phân Tích CV Bằng Gemini AI & Tạo Bài Phỏng Vấn
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tải lên file PDF CV của bạn để AI tự động nhận diện kỹ năng và chọn bộ câu hỏi trúng đích
          </p>
        </div>
      </div>

      {/* File Upload Dropzone */}
      {!cvResult ? (
        <div className="space-y-4">
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-purple-500 rounded-2xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-950/50">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl">
              📤
            </div>
            {file ? (
              <div>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400">{file.name}</p>
                <p className="text-[11px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB - Nhấn để chọn lại</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Kéo thả file PDF CV vào đây hoặc <span className="text-purple-600 dark:text-purple-400 font-bold">Duyệt File</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Chấp nhận định dạng file .pdf (Tối đa 10MB)</p>
              </div>
            )}
          </label>

          <button
            type="button"
            disabled={!file || isAnalyzing}
            onClick={handleAnalyze}
            className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Gemini AI đang đọc & phân tích CV...</span>
              </>
            ) : (
              <>
                <span>✨ Phân Tích CV Ngay</span>
                <span>&rarr;</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* CV Analysis Summary Result */
        <div className="bg-slate-50 dark:bg-slate-950 border border-purple-500/30 rounded-2xl p-6 space-y-5 animate-fade-in">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">Ứng Viên Nhận Diện</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{cvResult.candidateName}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">{cvResult.title}</p>
            </div>
            <div className="bg-purple-500/10 dark:bg-purple-950/60 border border-purple-500/30 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-300 block">Cấp Độ Ước Tính</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{cvResult.experienceLevel}</span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Tóm Tắt Năng Lực từ AI:</span>
            <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed">{cvResult.summary}</p>
          </div>

          {/* Detected Skills */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Kỹ Năng Nhận Diện Được:</span>
            <div className="flex flex-wrap gap-1.5">
              {cvResult.detectedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Matched Database Techs */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Công Nghệ Khớp Trong Database Vinterview:</span>
            <div className="flex flex-wrap gap-2">
              {cvResult.matchedTechnologies.map((tech) => (
                <Badge key={tech.id} variant="tech">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action to Start Interview */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              disabled={isStarting}
              onClick={handleLaunchTargetedInterview}
              className="flex-1 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isStarting ? 'Đang khởi tạo phỏng vấn...' : `🚀 Phỏng Vấn Theo CV (${cvResult.matchingQuestionCount} câu khả dụng) →`}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setCvResult(null);
              }}
              className="px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm"
            >
              Chọn CV Khác
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
