import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api, Question } from '@/lib/api';
import { QuestionDetailClient } from '@/components/questions/QuestionDetailClient';
import { JsonLd, getQAPageJsonLd } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinterview.vn';

  try {
    const res = await api.getQuestionBySlug(slug);
    const question = res.data;
    const cleanDescription = question.content
      .replace(/[#*`_~]/g, '')
      .substring(0, 160)
      .trim();

    const pageUrl = `${baseUrl}/questions/${question.slug}`;
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(question.title)}&category=${encodeURIComponent(question.category.name)}&technology=${encodeURIComponent(question.technology.name)}`;

    return {
      title: `${question.title} — Câu Hỏi Phỏng Vấn IT`,
      description: `Đáp án chi tiết câu hỏi phỏng vấn: ${question.title}. ${cleanDescription}`,
      keywords: [
        question.title,
        `câu hỏi phỏng vấn ${question.technology.name}`,
        `phỏng vấn ${question.category.name}`,
        'luyện phỏng vấn IT',
        'câu hỏi phỏng vấn sinh viên IT',
      ],
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: `${question.title} — Vinterview`,
        description: cleanDescription,
        url: pageUrl,
        type: 'article',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: question.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${question.title} — Vinterview`,
        description: cleanDescription,
        images: [ogImageUrl],
      },
    };
  } catch (err) {
    return {
      title: 'Chi Tiết Câu Hỏi Phỏng Vấn — Vinterview',
      description: 'Nền tảng luyện phỏng vấn công nghệ chuyên sâu dành cho sinh viên IT & Fresher.',
    };
  }
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinterview.vn';

  let question: Question;
  let relatedQuestions: Question[] = [];

  try {
    const res = await api.getQuestionBySlug(slug);
    question = res.data;

    // Fetch related questions by same technology
    const relatedRes = await api.getQuestions({
      technology: question.technology.slug,
      limit: 3,
    });
    relatedQuestions = relatedRes.data.filter((q) => q.id !== question.id);
  } catch (err) {
    notFound();
  }

  const qaJsonLd = getQAPageJsonLd({
    title: question.title,
    content: question.answer?.content || question.content,
    url: `${baseUrl}/questions/${question.slug}`,
    dateCreated: question.createdAt,
    category: question.category.name,
    technology: question.technology.name,
  });

  return (
    <>
      <JsonLd data={qaJsonLd} />
      <QuestionDetailClient question={question} relatedQuestions={relatedQuestions} />
    </>
  );
}
