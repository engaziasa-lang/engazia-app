import { MetadataRoute } from 'next'

// قائمة شاملة تستهدف المنصات، القطاعات التجارية، ونية البحث الصريحة للتجار
const activeTargets = [
  // المنصات
  'سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'فايندر', 'مخزن', 'محلي',
  // القطاعات التجارية
  'متاجر-العطور', 'متاجر-العبايات', 'متاجر-القهوة', 'متاجر-الالكترونيات',
  'متاجر-الملابس', 'متاجر-الهدايا', 'متاجر-التجميل', 'متاجر-الاحذية',
  'الاسر-المنتجة', 'تجارة-الدروبشيبينغ',
  // نية البحث (Search Intent) لحل المشاكل
  'استرجاع-السلال-المتروكة', 'ادارة-عملاء-واتساب', 'رد-الي-واتساب-للمتاجر',
  'زيادة-مبيعات-المتاجر', 'تنظيم-طلبات-الواتساب', 'تسويق-المتاجر-بالواتساب'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://engazia-app.vercel.app';

  const dynamicRoutes = activeTargets.map((target) => ({
    url: `${baseUrl}/${target}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl, 
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...dynamicRoutes, 
  ]
}
