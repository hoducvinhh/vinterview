'use client';

import { useState } from 'react';
import Link from 'next/link';

export function DonateClient() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const donateAccounts = [
    {
      bank: 'VietinBank (Ngân hàng TMCP Công Thương Việt Nam)',
      bankCode: 'ICB',
      accountNumber: '102876830022',
      accountName: 'HO DUC VINH',
      badge: 'VietQR Chuyển Khoản Nhanh 24/7 (Miễn Phí)',
      qrUrl: 'https://img.vietqr.io/image/ICB-102876830022-compact2.png?addInfo=Donate%20Vinterview&accountName=HO%20DUC%20VINH',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Donate Card Container */}
      <div className="max-w-md mx-auto w-full">
        {donateAccounts.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6 hover:border-rose-500/50 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  {item.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">24/7 Service</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.bank}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chủ tài khoản:{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{item.accountName}</strong>
                </p>
              </div>

              {/* QR Code Container */}
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center items-center">
                <img
                  src={item.qrUrl}
                  alt={`Mã QR chuyển khoản ủng hộ ${item.bank}`}
                  width={320}
                  height={320}
                  loading="lazy"
                  className="w-72 h-72 sm:w-80 sm:h-80 object-contain rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-3 shadow-lg hover:scale-105 transition-transform"
                />
              </div>

              {/* Account Number Box */}
              <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Số tài khoản / SĐT:</span>
                  <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white tracking-wider">
                    {item.accountNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(item.accountNumber, item.bank)}
                  className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-all shadow-md cursor-pointer shrink-0"
                >
                  {copiedAccount === item.bank ? '✓ Đã Copy!' : '📋 Sao Chép'}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic">
              Nội dung chuyển khoản: <strong className="text-slate-700 dark:text-slate-300 font-mono">Donate Vinterview</strong>
            </p>
          </div>
        ))}
      </div>

      {/* Thank you Footer Box */}
      <div className="bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          🙏 Trân Trọng Cảm Ơn Sự Đồng Hành Của Bạn!
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Mỗi đóng góp giúp chúng tôi duy trì server ổn định, cập nhật thêm hàng nghìn câu hỏi phỏng vấn chuẩn và cung cấp AI feedback miễn phí cho tất cả mọi người.
        </p>
        <div className="pt-2">
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            <span>🚀 Quay Lại Luyện Phỏng Vấn</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
