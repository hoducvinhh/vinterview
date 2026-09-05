import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ Sơ Cá Nhân — Vinterview',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
