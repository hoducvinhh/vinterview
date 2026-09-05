import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản Trị Hệ Thống — Vinterview',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
