'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PremiumModal({ isOpen, onClose, onSuccess }: PremiumModalProps) {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayOSCheckout = async () => {
    try {
      setLoading(true);
      const res = await api.createCheckout('LIFETIME');
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      alert(`Lỗi khởi tạo thanh toán: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestActivate = async () => {
    try {
      setTestLoading(true);
      const res = await api.testActivatePremium();
      if (res.success) {
        alert('🎉 Đã kích hoạt tài khoản Premium thử nghiệm thành công!');
        if (onSuccess) onSuccess();
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      alert(`Lỗi kích hoạt: ${err.message || err}`);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          ✕
        </button>

        {/* Badge & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
            <span>✨ Tính Năng Độc Quyền</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Nâng Cấp Tài Khoản <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-amber-500">PRO Premium</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Mở khóa sức mạnh AI để phân tích CV cá nhân và phỏng vấn thử nghiệm nâng cao cùng Gemini AI!
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold text-sm">✓</span>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Phân Tích CV Tự Động Bằng AI</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Nhận diện trúng đích các công nghệ trong CV và đề xuất bài phỏng vấn phù hợp.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold text-sm">✓</span>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Chấm Điểm & Phản Hồi Chi Tiết phỏng vấn</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Gemini AI chấm điểm câu trả lời và chỉ ra điểm cần cải thiện.</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold text-sm">✓</span>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Xem Lời Giải & Code Mẫu Độc Quyền</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Không giới hạn số lượt truy cập câu hỏi và lời giải chi tiết.</p>
            </div>
          </div>
        </div>

        {/* Price Tag */}
        <div className="text-center bg-purple-50 dark:bg-purple-950/40 border border-purple-500/30 p-4 rounded-2xl">
          <div className="text-[11px] uppercase font-bold text-purple-600 dark:text-purple-400">Gói Nâng Cấp Trọn Đời</div>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">199.000đ</span>
            <span className="text-xs text-slate-400 line-through">499.000đ</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Thanh toán 1 lần duy nhất - Dùng mãi mãi</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handlePayOSCheckout}
            disabled={loading}
            className="w-full py-3.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Đang kết nối PayOS VietQR...</span>
            ) : (
              <>
                <span>💳 Thanh Toán Qua PayOS (Mã VietQR Ngân Hàng)</span>
                <span>&rarr;</span>
              </>
            )}
          </button>

          {/* Quick Test Mode Button */}
          <button
            onClick={handleTestActivate}
            disabled={testLoading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-xl border border-purple-500/30 transition-all cursor-pointer"
          >
            {testLoading ? 'Đang kích hoạt...' : '⚡ Kích Hoạt Nhanh Dùng Thử (Sandbox/Test Mode)'}
          </button>
        </div>
      </div>
    </div>
  );
}
