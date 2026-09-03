import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api, Question } from '@/lib/api';
import { QuestionDetailClient } from '@/components/questions/QuestionDetailClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.getQuestionBySlug(slug);
    const question = res.data;
    return {
      title: `${question.title} — Vinterview`,
      description: question.content.substring(0, 160),
    };
  } catch (err) {
    return {
      title: 'Chi Tiết Câu Hỏi — Vinterview',
      description: 'Nền tảng luyện phỏng vấn công nghệ chuyên sâu.',
    };
  }
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { slug } = await params;

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

  return <QuestionDetailClient question={question} relatedQuestions={relatedQuestions} />;
}
