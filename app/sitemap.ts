import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // هنا نضع قائمة بالمنصات التي نستهدفها (يمكنك زيادة العدد لاحقاً إلى مئات)
  const platforms = ['سلة', 'زد', 'شوبيفاي', 'ووكومرس', 'فايندي', 'متجري'];
  const baseUrl = 'https://engazia-app.vercel.app';

  // توليد الروابط آلياً لكل منصة
  const platformUrls = platforms.map((platform) => ({
    url: `${baseUrl}/${platform}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // إرجاع الخريطة النهائية لجوجل
  return [
    {
      url: baseUrl, // رابط الصفحة الرئيسية
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...platformUrls, // روابط المنصات
  ]
}
