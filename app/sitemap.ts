import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // قائمة المنصات والأنشطة التجارية المستهدفة للانتشار الواسع
  const platforms = [
    'سلة',
    'زد',
    'شوبيفاي',
    'ووكومرس',
    'مريدي',
    'متاجر العبايات',
    'متاجر العطور',
    'الأسر المنتجة',
    'التجارة الإلكترونية',
    'المتاجر الرقمية'
  ];

  // توليد رابط لكل منصة أو نشاط تجاري بشكل آلي
  const platformSitemaps = platforms.map((platform) => ({
    url: `${baseUrl}/${encodeURIComponent(platform)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...platformSitemaps,
  ];
}
