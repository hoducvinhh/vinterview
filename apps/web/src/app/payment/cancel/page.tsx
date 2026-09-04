'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 overflow-hidden">
        {/* Icon Cancel */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl shadow-xl">
          🛑
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">
            Thanh Toán Đã Hủy
          </h1>
          <p className="text-xs text-slate-400">
            Bạn đã hủy giao dịch nâng cấp tài khoản Premium. Đơn hàng chưa được tính tiền.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/interview"
            className="block w-full py-3.5 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-600/20"
          >
            Quay lại Trang Phỏng Vấn
          </Link>
          <Link
            href="/"
            className="block text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
