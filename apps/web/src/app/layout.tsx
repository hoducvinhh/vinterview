import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vinterview — Nền Tảng Luyện Phỏng Vấn Lập Trình Chuyên Sâu',
  description: 'Chinh phục các câu hỏi phỏng vấn lập trình, thiết kế hệ thống và core frameworks với đáp án chuẩn production.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
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
