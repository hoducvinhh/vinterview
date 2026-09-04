'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const demo = searchParams.get('demo');

  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    async function verifyPayment() {
      if (demo === 'true') {
        // Mode Demo: kích hoạt trực tiếp
        try {
          await api.testActivatePremium();
          setActivated(true);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (orderCode) {
        try {
          const res = await api.getPaymentStatus(Number(orderCode));
          if (res && res.status === 'SUCCESS') {
            setActivated(true);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [orderCode, demo]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Icon Success */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20">
          <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-4xl">
            🎉
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">
            Thanh Toán Thành Công!
          </h1>
          <p className="text-xs text-slate-400">
            Tài khoản của bạn đã được nâng cấp lên <span className="font-bold text-amber-400">PRO Premium</span>.
          </p>
        </div>

        {loading ? (
          <div className="py-4 text-xs text-purple-400 animate-pulse">
            Đang xác nhận đơn hàng #{orderCode}...
          </div>
        ) : (
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Mã đơn hàng:</span>
              <span className="font-mono font-bold text-white">#{orderCode || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Trạng thái:</span>
              <span className="font-bold text-emerald-400">Đã Mở Khóa Premium</span>
            </div>
          </div>
        )}

        <div className="pt-2 space-y-3">
          <Link
            href="/interview"
            className="block w-full py-3.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-500/25 transition-all"
          >
            🚀 Thử Ngay Tính Năng Phân Tích CV Bằng AI
          </Link>
          <Link
            href="/"
            className="block text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Quay về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-xs">Đang tải...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
