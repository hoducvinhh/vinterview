import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinterview.vn';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vinterview — Nền Tảng Luyện Phỏng Vấn IT & Phân Tích CV Cho Sinh Viên',
    template: '%s | Vinterview',
  },
  description:
    'Nền tảng luyện phỏng vấn lập trình hàng đầu cho sinh viên IT & Fresher. Ngân hàng câu hỏi phỏng vấn chuẩn môn học Đại học, phỏng vấn giả lập AI và phân tích CV tự động.',
  keywords: [
    'luyện phỏng vấn IT',
    'câu hỏi phỏng vấn sinh viên IT',
    'phỏng vấn intern IT',
    'phỏng vấn fresher lập trình',
    'phỏng vấn theo CV IT',
    'câu hỏi phỏng vấn Cấu trúc dữ liệu và giải thuật',
    'phỏng vấn Cơ sở dữ liệu SQL',
    'câu hỏi phỏng vấn Mạng máy tính',
    'câu hỏi phỏng vấn OOP Java C++',
    'câu hỏi phỏng vấn ReactJS Node.js',
    'phỏng vấn AI IT',
    'Vinterview',
  ],
  authors: [{ name: 'Vinterview Team', url: siteUrl }],
  creator: 'Vinterview',
  publisher: 'Vinterview',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Vinterview — Nền Tảng Luyện Phỏng Vấn IT & Phân Tích CV Cho Sinh Viên',
    description:
      'Chinh phục phỏng vấn thực tập sinh (Intern), Fresher IT và các môn học Đại học. Đáp án chuẩn production, minh họa code rõ ràng và phỏng vấn giả lập AI theo CV.',
    url: siteUrl,
    siteName: 'Vinterview',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/api/og?title=Vinterview%20%E2%80%94%20Platform%20Luy%E1%BB%87n%20Ph%E1%BB%8Fng%20V%E1%BA%A5n%20IT%20Cho%20Sinh%20Vi%C3%AAn&category=IT%20Interview&technology=Intern%20%26%20Fresher',
        width: 1200,
        height: 630,
        alt: 'Vinterview - Nền Tảng Luyện Phỏng Vấn Lập Trình Cho Sinh Viên IT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vinterview — Nền Tảng Luyện Phỏng Vấn IT & Phân Tích CV Cho Sinh Viên',
    description:
      'Chinh phục phỏng vấn Intern/Fresher IT và câu hỏi môn học Đại học với ngân hàng câu hỏi chọn lọc & phỏng vấn AI.',
    images: [
      '/api/og?title=Vinterview%20%E2%80%94%20Platform%20Luy%E1%BB%87n%20Ph%E1%BB%8Fng%20V%E1%BA%A5n%20IT%20Cho%20Sinh%20Vi%C3%AAn&category=IT%20Interview&technology=Intern%20%26%20Fresher',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vinterview',
    alternateName: ['Vinterview AI', 'Platform Luyện Phỏng Vấn IT'],
    url: siteUrl,
    description: 'Nền tảng luyện phỏng vấn IT, phỏng vấn giả lập AI theo CV và ngân hàng câu hỏi môn học dành cho sinh viên CNTT & Fresher.',
  };

  return (
    <html lang="vi" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            <AnalyticsTracker />
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
