import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app/seo';
  
  // 1. جميع الأدوات الـ 24
  const tools = [
    'breakeven', 'fees', 'zatca', 'whatsapp', 'roas', 'returns', 'policy', 'tax', 
    'ltv', 'promos', 'inventory', 'shipping', 'pricing', 'conversion', 'checkout', 
    'profit-margin', 'ads-budget', 'discount-calc', 'cart-recovery', 'invoice-gen', 
    'vat-calc', 'salary-calc', 'subscription-calc', 'roi-calc'
  ];

  // 2. المنصات المدعومة
  const platforms = ['salla', 'zid', 'shopify', 'woocommerce'];

  // 3. المجالات والتخصصات التجارية
  const niches = [
    'perfume', 'abaya', 'dates', 'coffee', 'electronics', 'fashion', 
    'cosmetics', 'furniture', 'books', 'gifting', 'supplements', 'shoes', 
    'jewelery', 'sports', 'toys'
  ];

  // 4. أبرز 50 مدينة ومنطقة سعودية لتغطية السيو المحلي (Local SEO)
  const cities = [
    'riyadh', 'jeddah', 'mecca', 'medina', 'dammam', 'khobar', 'dhahran', 
    'tabuk', 'buraidah', 'khamis-mushait', 'abha', 'hail', 'najran', 
    'yanbu', 'al-jubail', 'arar', 'sakaka', 'jizan', 'qatif', 'al-hasa', 
    'taif', 'al-bahha', 'hafr-al-batin', 'unayzah', 'al-kharj', 
    'qurayyat', 'al-qunfudhah', 'bishe', 'rafha', 'khafji', 
    'sharurah', 'al-Ula', 'huraymila', 'duwadimi', 'zulfi', 
    'majmaah', 'wadi-al-dawasir', 'tanumah', 'abal-larah', 'ar-rass',
    'saihat', 'tarout', 'safwa', 'tubarjal', 'abu-arish', 
    'samtah', 'ahad-rufaidah', 'badr', 'rabigh', 'al-Wajh'
  ];

  const urls: MetadataRoute.Sitemap = [];

  // توليد خريطة الروابط الضخمة (Programmatic Sitemap Matrix)
  // 24 أداة × 4 منصات × 15 مجال × 50 مدينة = 72,000 صفحة!
  tools.forEach(tool => {
    platforms.forEach(platform => {
      niches.forEach(niche => {
        cities.forEach(city => {
          urls.push({
            url: `${baseUrl}/${tool}-${platform}-${niche}-${city}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      });
    });
  });

  return urls;
}
