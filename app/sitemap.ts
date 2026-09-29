import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // قائمة موسعة للمنصات وأنظمة المتاجر
  const platforms = [
    'سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'متاجر', 'مريدي', 'مستقل', 'خمسات', 'سوق دوت كوم', 'نون'
  ];

  // قائمة موسعة للأنشطة والقطاعات التجارية
  const categories = [
    'العبايات', 'العطور', 'الإلكترونيات', 'المواد الغذائية', 'التجميل', 
    'المستلزمات الرجالية', 'الإكسسوارات', 'الأثاث', 'المستلزمات الرياضية', 
    'المجوهرات', 'الكتب', 'الألعاب', 'القهوة المختصة', 'الزهور والهدايا'
  ];

  // قائمة شاملة لمدن ومناطق استهداف التجار
  const cities = [
    'الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'القصيم', 
    'أبها', 'تبوك', 'الخبر', 'الطائف', 'حائل', 'الخميس', 'الجبيل'
  ];

  const generatedUrls: MetadataRoute.Sitemap = [];

  // الصفحة الرئيسية
  generatedUrls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  // توليد آلاف الروابط عبر التداخل الرياضي للمصفوفات (Matrix SEO)
  platforms.forEach((platform) => {
    categories.forEach((category) => {
      // مزيج المنصة + النشاط
      const combo1 = `${platform}-${category}`;
      generatedUrls.push({
        url: `${baseUrl}/${encodeURIComponent(combo1)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      // مزيج المنصة + النشاط + المدينة (لاستهداف البحث المحلي بدقة فائقة)
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
