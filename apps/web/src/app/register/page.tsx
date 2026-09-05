import { Metadata } from 'next';
import { RegisterFormClient } from '@/components/auth/RegisterFormClient';

export const metadata: Metadata = {
  title: 'Đăng Ký Tài Khoản — Vinterview',
  description: 'Tạo tài khoản miễn phí để sử dụng ngân hàng câu hỏi IT và tính năng phỏng vấn giả lập AI.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterFormClient />;
}
