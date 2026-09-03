import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generates WebSite Schema.org JSON-LD data
 */
export function getWebSiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vinterview',
    alternateName: ['Vinterview AI', 'Nền Tảng Luyện Phỏng Vấn IT'],
    url: siteUrl,
    description: 'Nền tảng luyện phỏng vấn IT, phỏng vấn giả lập AI theo CV và ngân hàng câu hỏi môn học dành cho sinh viên CNTT & Fresher.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/questions?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates QAPage Schema.org JSON-LD data for interview questions
 */
export function getQAPageJsonLd({
  title,
  content,
  url,
  dateCreated,
  category,
  technology,
}: {
  title: string;
  content: string;
  url: string;
  dateCreated?: string;
  category?: string;
  technology?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: title,
      text: content.substring(0, 300),
      answerCount: 1,
      dateCreated: dateCreated || new Date().toISOString(),
      about: [
        category && { '@type': 'Thing', name: category },
        technology && { '@type': 'Thing', name: technology },
      ].filter(Boolean),
      acceptedAnswer: {
        '@type': 'Answer',
        text: content,
        dateCreated: dateCreated || new Date().toISOString(),
        url: url,
      },
    },
  };
}
