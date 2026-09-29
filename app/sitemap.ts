import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // المنصات التجارية
  const platforms = [
    'سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'متاجر', 'مريدي', 'مستقل', 'خمسات', 'سوق دوت كوم', 'نون', 'اكسترا'
  ];

  // الأنشطة والقطاعات التجارية الواسعة
  const categories = [
    'العبايات', 'العطور', 'الإلكترونيات', 'المواد الغذائية', 'التجميل', 
    'المستلزمات الرجالية', 'الإكسسوارات', 'الأثاث', 'المستلزمات الرياضية', 
    'المجوهرات', 'الكتب', 'الألعاب', 'القهوة المختصة', 'الزهور والهدايا',
    'المنتجات الرقمية', 'الدورات التدريبية', 'الخدمات الاستشارية', 'الملابس النسائية',
    'مستحضرات التجميل', 'المستلزمات الطبية', 'إهداءات ومواليد', 'المكسرات والحلويات'
  ];

  // المدن والمناطق الإقليمية
  const cities = [
    'الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'القصيم', 
    'أبها', 'تبوك', 'الخبر', 'الطائف', 'حائل', 'الخميس', 
    'الجبيل', 'جازان', 'نجران', 'بريدة', 'الكويت', 'دبي', 'الدوحة'
  ];

  // مصطلحات البحث الاحترافية (Long-tail Intent Modifiers)
  const intents = [
    'إدارة-عملاء', 'سلال-متروكة', 'ردود-آلية', 'crm-واتساب', 'زيادة-مبيعات'
  ];

  const generatedUrls: MetadataRoute.Sitemap = [];

  // الصفحة الرئيسية
  generatedUrls.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  // توليد شبكة ضخمة جداً من الروابط (عشرات الآلاف من الصفحات المستهدفة)
  platforms.forEach((platform) => {
    categories.forEach((category) => {
      cities.forEach((city) => {
        intents.forEach((intent) => {
          // دمج ذكي وعميق يولد آلاف الصفحات الدقيقة لكل كلمة بحث محتملة
          const uniqueSlug = `${platform}-${category}-${city}-${intent}`;
          generatedUrls.push({
            url: `${baseUrl}/${encodeURIComponent(uniqueSlug)}`,
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
