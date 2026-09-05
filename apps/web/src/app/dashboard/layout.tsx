import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Tiến Độ Học Tập — Vinterview',
  robots: {
    index: false,
    follow: true,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
