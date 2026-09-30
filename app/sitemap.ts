import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // 1. منصات التجارة الإلكترونية الشائعة
  const platforms = [
    'سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'مستقل', 'متاجر', 'سوق', 'مخزن', 'محلي', 'فايندر'
  ];

  // 2. القطاعات التجارية والأنشطة المستهدفة
  const categories = [
    'متاجر-العطور', 'متاجر-العبايات', 'متاجر-الالكترونيات', 'متاجر-القهوة', 
    'متاجر-التجميل', 'متاجر-الملابس', 'متاجر-الهدايا', 'متاجر-الاحذية', 
    'متاجر-الساعات', 'متاجر-الذهب', 'متاجر-المستلزمات-الرياضية', 'متاجر-الاثاث',
    'الاسر-المنتجة', 'تجارة-الدروبشيبينغ', 'متاجر-المخابز-والحلويات', 'متاجر-المكملات-الغذائية'
  ];

  // 3. مدن ومناطق المملكة العربية السعودية ومجلس التعاون لتغطية نية البحث الجغرافية
  const locations = [
    'الرياض', 'جدة', 'مكة-المكرمة', 'المدينة-المنورة', 'الدمام', 'الخبر', 
    'الطائف', 'تبوك', 'بريدة', 'القصيم', 'خميس-مشيط', 'حائل', 'الجبيل', 
    'الهفوف', 'الإحساء', 'نجران', 'جازان', 'ينبع', 'الابها', 'عرعر', 'سكاكة'
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // 4. حلقة تكرار لدمج المتغيرات (ضرب الأعداد ببعضها لتوليد آلاف الصفحات)
  // 10 منصات × 16 قطاع × 21 مدينة = 3,360 صفحة فريدة تماماً وموجهة بدقة!
  for (const platform of platforms) {
    for (const category of categories) {
      for (const location of locations) {
        const slug = `${platform}-${category}-${location}`;
        
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
    ...dynamicRoutes,
  ];
}
