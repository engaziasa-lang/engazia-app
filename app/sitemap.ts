import { MetadataRoute } from 'next/navigation';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // قوائم المدن والأدوات لتوليد الروابط آلياً
  const cities = ['riyadh', 'jeddah', 'makkah', 'madinah', 'dammam', 'qassim', 'abha'];
  const tools = ['profit', 'fees', 'whatsapp', 'vat', 'jasmal'];

  // توليد مصفوفة الروابط البرمجية لجيش صفحات الهبوط
  const landingPages: MetadataRoute.Sitemap = [];

  cities.forEach((city) => {
    tools.forEach((tool) => {
      landingPages.push({
        url: `${baseUrl}/landing/${city}-${tool}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // الصفحات الأساسية للمنصة
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/hub/sa`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  return [...corePages, ...landingPages];
}
