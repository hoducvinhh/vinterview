import { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate sitemap every hour

interface QuestionSlugItem {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinterview.vn';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  // Fixed static date for static routes to prevent constantly fluctuating lastModified on crawlers
  const staticLastMod = new Date('2026-01-01T00:00:00.000Z');

  // Base public static routes ONLY (excluding admin, login, register, profile, dashboard)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticLastMod,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/questions`,
      lastModified: staticLastMod,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/interview`,
      lastModified: staticLastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: staticLastMod,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Dynamic question pages fetched from backend API
  let questionRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/questions?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        questionRoutes = data.data.map((question: QuestionSlugItem) => {
          const modDate = question.updatedAt || question.createdAt;
          return {
            url: `${baseUrl}/questions/${question.slug}`,
            lastModified: modDate ? new Date(modDate) : staticLastMod,
            changeFrequency: 'weekly',
            priority: 0.8,
          };
        });
      }
    }
  } catch (err) {
    // Fallback gracefully to static routes if API is unreachable during build
  }

  return [...staticRoutes, ...questionRoutes];
}
