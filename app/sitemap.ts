import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://engazia-app.vercel.app';

  const tools = ['profit-calculator', 'whatsapp-crm', 'vat-system', 'fees-analyzer', 'competitor-jasmal'];
  const cities = ['riyadh', 'jeddah', 'dammam', 'madinah', 'makkah', 'hafar-albatin', 'qassim', 'abha', 'tabuk', 'khobar', 'taif', 'khamis-mushait'];
  const ecom = ['salla', 'zid'];

  const landingPages: MetadataRoute.Sitemap = [];

  tools.forEach((t) => {
    cities.forEach((c) => {
      ecom.forEach((e) => {
        landingPages.push({
          url: `${baseUrl}/landing/${t}-${c}-${e}`,
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
