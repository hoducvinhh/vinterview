import { Metadata } from 'next';
import { DonateClient } from '@/components/donate/DonateClient';
import { JsonLd, getBreadcrumbJsonLd } from '@/components/seo/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinterview.vn';

export const metadata: Metadata = {
  title: 'Donate & Ủng Hộ Dự Án Vinterview — Nền Tảng Luyện Phỏng Vấn IT',
  description:
    'Ủng hộ và tiếp sức duy trì máy chủ cho dự án Vinterview. Giúp cộng đồng sinh viên CNTT & Fresher Việt Nam tiếp cận ngân hàng câu hỏi phỏng vấn và AI giả lập miễn phí.',
  alternates: {
    canonical: `${siteUrl}/donate`,
  },
  openGraph: {
    title: 'Donate & Ủng Hộ Dự Án Vinterview',
    description: 'Chung tay phát triển nền tảng luyện phỏng vấn công nghệ miễn phí cho sinh viên IT.',
    url: `${siteUrl}/donate`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donate & Ủng Hộ Dự Án Vinterview',
    description: 'Chung tay phát triển nền tảng luyện phỏng vấn công nghệ miễn phí cho sinh viên IT.',
  },
};

export default function DonatePage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Trang chủ', url: siteUrl },
    { name: 'Donate', url: `${siteUrl}/donate` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Hero Header */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider">
            💖 Ủng Hộ & Đồng Hành Cùng Vinterview
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Donate & Tiếp Sức Cho Dự Án
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Vinterview được duy trì miễn phí cho cộng đồng lập trình viên Việt Nam. Mọi đóng góp của bạn (dù chỉ là 1 ly cà phê ☕️) đều giúp chúng tôi duy trì máy chủ & phát triển các tính năng AI chất lượng cao!
          </p>
        </header>

        <DonateClient />
      </div>
    </>
  );
}
