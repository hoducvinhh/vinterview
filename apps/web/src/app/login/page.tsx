import { Metadata } from 'next';
import { LoginFormClient } from '@/components/auth/LoginFormClient';

export const metadata: Metadata = {
  title: 'Đăng Nhập Tài Khoản — Vinterview',
  description: 'Đăng nhập vào hệ thống Vinterview để bắt đầu luyện phỏng vấn công nghệ và theo dõi tiến độ.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginFormClient />;
}
