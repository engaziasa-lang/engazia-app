import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // قوائم الدمج لتوليد آلاف الكلمات المستهدفة بدقة
  const platforms = ['سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'متاجر', 'سوق دوت كوم', 'نون'];
  const categories = ['العبايات', 'العطور', 'الإلكترونيات', 'المواد الغذائية', 'التجميل', 'المستلزمات الرجالية', 'الإكسسوارات', 'الأثاث', 'المستلزمات الرياضية'];
  const cities = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'القصيم', 'أبها', 'تبوك'];

  const generatedUrls: MetadataRoute.Sitemap = [];

  // الرابط الرئيسي
  generatedUrls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  // توليد مصفوفة توافقية ذكية (Matrix Generation) لآلاف الصفحات المستهدفة
  platforms.forEach((platform) => {
    categories.forEach((category) => {
      // الدمج الأول: منصة + تصنيف
      const combo1 = `${platform}-${category}`;
      generatedUrls.push({
        url: `${baseUrl}/${encodeURIComponent(combo1)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      // الدمج الثاني مع المدن لمضاعفة النتائج واستهداف البحث المحلي (Local SEO)
      cities.forEach((city) => {
        const combo2 = `${platform}-${category}-${city}`;
        generatedUrls.push({
          url: `${baseUrl}/${encodeURIComponent(combo2)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    });
  });

  return generatedUrls;
}
