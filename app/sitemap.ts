import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // قوائم المتغيرات التي ستدمجها "الطابعة السحرية" لتوليد آلاف الصفحات
  const platforms = ['سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'متاجر', 'مريدي'];
  const categories = ['العبايات', 'العطور', 'الإلكترونيات', 'المواد الغذائية', 'التجميل', 'المستلزمات الرجالية'];
  const cities = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'القصيم', 'أبها', 'تبوك'];
  const intents = ['إدارة-عملاء', 'سلال-متروكة', 'ردود-آلية', 'crm-واتساب'];

  const generatedUrls: MetadataRoute.Sitemap = [];

  // الصفحة الرئيسية للموقع
  generatedUrls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  // توليد شبكة الصفحات الديناميكية تلقائياً عبر دمج المصفوفات رياضياً
  platforms.forEach((platform) => {
    categories.forEach((category) => {
      cities.forEach((city) => {
        intents.forEach((intent) => {
          const dynamicSlug = `${platform}-${category}-${city}-${intent}`;
          generatedUrls.push({
            url: `${baseUrl}/${encodeURIComponent(dynamicSlug)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      });
    });
  });

  return generatedUrls;
}
