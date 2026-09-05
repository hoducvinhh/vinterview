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
 * Generates Organization Schema.org JSON-LD data
 */
export function getOrganizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vinterview',
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    sameAs: [
      'https://github.com/hoducvinhh/vinterview',
    ],
    description: 'Nền tảng luyện phỏng vấn công nghệ thông tin và phân tích CV giả lập bằng AI dành cho sinh viên CNTT & Fresher.',
  };
}

/**
 * Generates BreadcrumbList Schema.org JSON-LD data
 */
export function getBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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

/**
 * Generates SoftwareApplication Schema.org JSON-LD data for AI Interview feature
 */
export function getSoftwareApplicationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Vinterview AI Simulator',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    url: `${siteUrl}/interview`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    description: 'Trình phỏng vấn giả lập AI và phân tích CV PDF tự động dành cho sinh viên IT & Fresher.',
  };
}

/**
 * Generates CollectionPage Schema.org JSON-LD data for question catalog
 */
export function getCollectionPageJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Ngân Hàng Câu Hỏi Phỏng Vấn IT',
    url: `${siteUrl}/questions`,
    description: 'Tổng hợp ngân hàng câu hỏi phỏng vấn Lập trình, Cấu trúc dữ liệu, Cơ sở dữ liệu, React, Node.js, System Design.',
  };
}

