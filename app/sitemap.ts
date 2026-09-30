import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  const platforms = ['سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'مستقل', 'متاجر', 'سوق', 'مخزن', 'محلي', 'فايندر', 'سلة-برو', 'زد-بلس'];
  
  const categories = [
    'متاجر-العطور', 'متاجر-العبايات', 'متاجر-الالكترونيات', 'متاجر-القهوة-المختصة', 
    'متاجر-التجميل-والمكياج', 'متاجر-الملابس-الرجالية', 'متاجر-الملابس-النسائية', 
    'متاجر-الهدايا-والورد', 'متاجر-الاحذية-والحقائب', 'متاجر-الساعات-والاكسسوارات', 
    'متاجر-الذهب-والمجوهرات', 'متاجر-المستلزمات-الرياضية', 'متاجر-الاثاث-الديكور',
    'الاسر-المنتجة', 'تجارة-الدروبشيبينغ', 'متاجر-المخابز-والحلويات', 'متاجر-المكملات-الغذائية',
    'متاجر-العناية-الشخصية', 'متاجر-السيارات-وقطاعاتها', 'متاجر-التقنية-والبرمجيات'
  ];

  const locations = [
    'الرياض', 'جدة', 'مكة-المكرمة', 'المدينة-المنورة', 'الدمام', 'الخبر', 
    'الطائف', 'تبوك', 'بريدة', 'القصيم', 'خميس-مشيط', 'حائل', 'الجبيل', 
    'الهفوف', 'الإحساء', 'نجران', 'جازان', 'ينبع', 'عرعر', 'سكاكة',
    'حفر-الباطن', 'الخرج', 'القطيف', 'أبها', 'الباحة', 'جازان', 'الوطن-العربي'
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // 12 منصة × 20 قطاع × 26 منطقة = 6,240 صفحة هبوط فريدة ومستهدفة بدقة!
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
