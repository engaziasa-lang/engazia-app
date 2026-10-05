import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  // 1. جميع أدوات إنجازيا الـ 24 كاملة
  const tools = [
    'profit', 'fees', 'invoices', 'roas', 'whatsapp', 'returns', 'vat-report', 'platforms',
    'influencer', 'cod-risk', 'shipping', 'inventory', 'expenses', 'legal', 'jasmal',
    'reviews', 'dropshipping', 'copy', 'support', 'promos', 'ltv', 'ab-test', 'links', 'tips'
  ];

  // 2. أكثر من 50 مدينة ومحافظة رئيسية في المملكة العربية السعودية
  const cities = [
    'riyadh', 'jeddah', 'makkah', 'madinah', 'dammam', 'khobar', 'dhahran', 'al-ahsa', 'jubail',
    'qatif', 'buraydah', 'unaizah', 'al-rass', 'abha', 'khamis-mushait', 'tabuk', 'hail', 'najran',
    'jazan', 'al-baha', 'arar', 'sakaka', 'hafar-albatin', 'taif', 'yanbu', 'al-ula', 'khafji',
    'bisha', 'qurayyat', 'ras-tanura', 'al-majmaah', 'wadi-al-dawasir', 'al-kharj', 'diriyah',
    'shaqra', 'zulfi', 'abu-arish', 'samtah', 'baish', 'ahad-rufaidah', 'baljurashi',
    'sabya', 'tanomah', 'namas', 'al-wajh', 'duba', 'umluj', 'haql'
  ];

  // 3. منصات التجارة والقطاعات المستهدفة
  const categories = ['salla', 'zid', 'perfumes', 'dates', 'fashion', 'gifts'];

  const landingPages: MetadataRoute.Sitemap = [];

  tools.forEach((t) => {
    cities.forEach((c) => {
      categories.forEach((cat) => {
        landingPages.push({
          url: `${baseUrl}/landing/${t}-${c}-${cat}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    });
  });

  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/hub/sa`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  return [...corePages, ...landingPages];
}
