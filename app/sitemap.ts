import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // 1. قوائم المتغيرات الأساسية
  const platforms = ['سلة', 'زد', 'شوبيفاي', 'ووكومرس'];
  const categories = ['متاجر-العطور', 'متاجر-العبايات', 'متاجر-الالكترونيات', 'متاجر-القهوة', 'متاجر-التجميل'];
  const cities = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'القصيم', 'تبوك', 'أبها'];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // 2. حلقة التكرار الذكية لدمج المتغيرات وتوليد آلاف الروابط الفريدة
  for (const platform of platforms) {
    for (const category of categories) {
      for (const city of cities) {
        // الناتج سيكون رابط فريد مثل: /سلة-متاجر-العطور-الرياض
        const slug = `${platform}-${category}-${city}`;
        
        dynamicRoutes.push({
          url: `${baseUrl}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...dynamicRoutes, // إدراج آلاف الروابط المتولدة تلقائياً
  ];
}
