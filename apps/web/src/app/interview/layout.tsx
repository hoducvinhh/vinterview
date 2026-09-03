import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phỏng Vấn Giả Lập AI & Phân Tích CV IT — Vinterview',
  description:
    'Luyện phỏng vấn giả lập thời gian thực với AI Gemini. Phân tích file CV PDF cá nhân, trích xuất kỹ năng và sinh bộ câu hỏi phỏng vấn trúng đích cho sinh viên IT & Fresher.',
  keywords: [
    'phỏng vấn giả lập AI',
    'phỏng vấn theo CV IT',
    'phân tích CV lập trình viên',
    'luyện phỏng vấn sinh viên IT',
    'mock interview AI',
    'phỏng vấn thực tập sinh IT',
  ],
  openGraph: {
    title: 'Phỏng Vấn Giả Lập AI & Phân Tích CV IT — Vinterview',
    description:
      'Luyện phỏng vấn giả lập thời gian thực với AI Gemini. Tải CV PDF của bạn để nhận đánh giá điểm mạnh, điểm yếu và gợi ý bộ câu hỏi phỏng vấn phù hợp.',
    url: '/interview',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phỏng Vấn Giả Lập AI & Phân Tích CV IT — Vinterview',
    description: 'Tải CV PDF để AI phỏng vấn giả lập và đánh giá độ sẵn sàng (Readiness Grade) của bạn!',
  },
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
