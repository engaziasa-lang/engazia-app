import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // المنصات التجارية وأنظمة المتاجر الموسعة
  const platforms = [
    'سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'متاجر', 'مريدي', 'مستقل', 'خمسات', 'سوق دوت كوم', 'نون', 'اكسترا'
  ];

  // الأنشطة والقطاعات التجارية الشاملة
  const categories = [
    'العبايات', 'العطور', 'الإلكترونيات', 'المواد الغذائية', 'التجميل', 
    'المستلزمات الرجالية', 'الإكسسوارات', 'الأثاث', 'المستلزمات الرياضية', 
    'المجوهرات', 'الكتب', 'الألعاب', 'القهوة المختصة', 'الزهور والهدايا',
    'المنتجات الرقمية', 'الدورات التدريبية', 'الملابس النسائية', 'المستلزمات الطبية'
  ];

  // المدن والعواصم الإقليمية والعربية
  const cities = [
    'الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'القصيم', 
    'أبها', 'تبوك', 'الخبر', 'الطائف', 'حائل', 'الخميس', 
    'الجبيل', 'جازان', 'نجران', 'بريدة', 'الكويت', 'دبي', 'الدوحة', 'أبوظبي'
  ];

  // مصطلحات الأهداف والنيات البحثية (Intents)
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

  // توليد الشبكة الضخمة عبر الضرب الرياضي للمصفوفات
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
