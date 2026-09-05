import { Metadata } from 'next';
import { InterviewPageClient } from '@/components/interview/InterviewPageClient';
import { JsonLd, getSoftwareApplicationJsonLd, getBreadcrumbJsonLd } from '@/components/seo/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinterview.vn';

export const metadata: Metadata = {
  title: 'Phỏng Vấn Giả Lập AI & Phân Tích CV IT — Vinterview',
  description:
    'Luyện phỏng vấn IT giả lập với AI theo file CV PDF cá nhân. AI phân tích kỹ năng, đưa ra câu hỏi trúng đích Intern/Fresher và nhận xét chi tiết.',
  alternates: {
    canonical: `${siteUrl}/interview`,
  },
  openGraph: {
    title: 'Phỏng Vấn Giả Lập AI & Phân Tích CV IT — Vinterview',
    description:
      'Luyện phỏng vấn giả lập thời gian thực với AI. Phân tích CV PDF cá nhân và nhận xét đáp án chuẩn công ty công nghệ.',
    url: `${siteUrl}/interview`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phỏng Vấn Giả Lập AI & Phân Tích CV IT — Vinterview',
    description:
      'Luyện phỏng vấn giả lập thời gian thực với AI. Phân tích CV PDF cá nhân và nhận xét đáp án chuẩn công ty công nghệ.',
  },
};

export default function InterviewPage() {
  const softwareAppJsonLd = getSoftwareApplicationJsonLd(siteUrl);
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Trang chủ', url: siteUrl },
    { name: 'Phỏng vấn AI', url: `${siteUrl}/interview` },
  ]);

  return (
    <>
      <JsonLd data={softwareAppJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <InterviewPageClient />
    </>
  );
}
