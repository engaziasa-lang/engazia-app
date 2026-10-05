import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app/seo'; // استبدله برابط موقعك الفعلي عند اللزوم
  
  const tools = ['breakeven', 'fees', 'zatca', 'whatsapp', 'roas', 'returns', 'policy'];
  const platforms = ['salla', 'zid', 'shopify'];
  const niches = ['perfume', 'abaya', 'dates', 'coffee', 'electronics', 'fashion'];
  const cities = ['riyadh', 'jeddah', 'dammam', 'medina'];

  const urls: MetadataRoute.Sitemap = [];

  // توليد مصفوفة الروابط البرمجية (Programmatic Matrix)
  tools.forEach(tool => {
    platforms.forEach(platform => {
      niches.forEach(niche => {
        cities.forEach(city => {
          urls.push({
            url: `${baseUrl}/${tool}-${platform}-${niche}-${city}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      });
    });
  });

  return urls;
}
