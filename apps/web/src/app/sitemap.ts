import { MetadataRoute } from 'next';

export const revalidate = 3600; // Revalidate sitemap every hour

interface QuestionSlugItem {
  slug: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vinterview.vn';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  // Base static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/questions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/interview`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic question pages
  let questionRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/questions?limit=500`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        questionRoutes = data.data.map((question: QuestionSlugItem) => ({
          url: `${baseUrl}/questions/${question.slug}`,
          lastModified: question.updatedAt ? new Date(question.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
      }
    }
  } catch (err) {
    // If backend is offline during static build, sitemap safely falls back to static routes
  }

  return [...staticRoutes, ...questionRoutes];
}
