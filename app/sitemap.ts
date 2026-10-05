import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app/seo';
  
  // 1. أهم 20 أداة رئيسية عالية الطلب
  const tools = [
    'breakeven', 'fees', 'zatca', 'whatsapp', 'roas', 'returns', 'policy', 'tax', 
    'ltv', 'promos', 'inventory', 'shipping', 'pricing', 'conversion', 'checkout', 
    'profit-margin', 'ads-budget', 'discount-calc', 'cart-recovery', 'vat-calc'
  ];

  // 2. أبرز المنصات التجارية في السعودية
  const platforms = ['salla', 'zid', 'shopify'];

  // 3. أبرز 12 مجال ونيتش تجاري
  const niches = [
    'perfume', 'abaya', 'dates', 'coffee', 'electronics', 'fashion', 
    'cosmetics', 'furniture', 'gifting', 'supplements', 'shoes', 'jewelery'
  ];

  // 4. أبرز 15 مدينة رئيسية (لتغطية القوة الشرائية الكبرى بدقة)
  const cities = [
    'riyadh', 'jeddah', 'mecca', 'medina', 'dammam', 'khobar', 'tabuk', 
    'buraidah', 'khamis-mushait', 'abha', 'hail', 'najran', 'yanbu', 'taif', 'al-hasa'
  ];

  const urls: MetadataRoute.Sitemap = [];

  // توليد المصفوفة بدقة: 20 أداة × 3 منصات × 12 مجال × 15 مدينة = 10,800 صفحة مثالية
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
