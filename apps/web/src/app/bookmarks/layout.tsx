import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Câu Hỏi Đã Lưu — Vinterview',
  robots: {
    index: false,
    follow: true,
  },
};

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
