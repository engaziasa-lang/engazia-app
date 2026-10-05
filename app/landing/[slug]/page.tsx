import React from 'react';
import Link from 'next/link';

const toolsMap: Record<string, string> = {
  profit: 'حاسبة أرباح ونقاط التعادل',
  fees: 'حاسبة رسوم بوابات الدفع',
  invoices: 'مولد الفواتير الإلكترونية (زاتكا)',
  roas: 'محلل عائد الإعلانات',
  whatsapp: 'إدارة عملاء واتساب (Pro Max)',
  returns: 'محلل خسائر المرتجعات',
  'vat-report': 'مجهز بيانات الإقرار الضريبي',
  platforms: 'حاسبة رسوم المنصات',
  influencer: 'حاسبة جدوى إعلانات المشاهير',
  'cod-risk': 'محلل تكاليف الدفع عند الاستلام',
  shipping: 'مدير تتبع الشحنات المحلية',
  inventory: 'مخطط المخزون للمواسم',
  expenses: 'مدير النفقات التشغيلية',
  legal: 'مولد السياسات والقوانين',
  jasmal: 'جاسمال لاستخراج بيانات المنافسين',
  reviews: 'نظام طلب التقييمات الآلي',
  dropshipping: 'حاسبة أرباح الدروبشيبينغ',
  copy: 'مولد نصوص الإكسبلور',
  support: 'قوالب خدمة العملاء',
  promos: 'حاسبة جدوى العروض',
  ltv: 'حاسبة القيمة الدائمة للعميل',
  'ab-test': 'حاسبة اختبارات الإعلانات',
  links: 'صانع روابط واتساب',
  tips: 'أسرار نمو المتاجر'
};

const citiesMap: Record<string, string> = {
  riyadh: 'الرياض', jeddah: 'جدة', makkah: 'مكة المكرمة', madinah: 'المدينة المنورة',
  dammam: 'الدمام', khobar: 'الخبر', dhahran: 'الظهران', 'al-ahsa': 'الأحساء',
  jubail: 'الجبيل', qatif: 'القطيف', buraydah: 'بريدة', unaizah: 'عنيزة',
  'al-rass': 'الرس', abha: 'أبها', 'khamis-mushait': 'خميس مشيط', tabuk: 'تبوك',
  hail: 'حائل', najran: 'نجران', jazan: 'جازان', 'al-baha': 'الباحة',
  arar: 'عرعر', sakaka: 'سكاكا', 'hafar-albatin': 'حفر الباطن', taif: 'الطائف',
  yanbu: 'ينبع', 'al-ula': 'العلا', khafji: 'الخفجي', bisha: 'بيشة',
  qurayyat: 'القريات', 'ras-tanura': 'رأس تنورة', 'al-majmaah': 'المجمعة',
  'wadi-al-dawasir': 'وادي الدواسر', 'al-kharj': 'الخرج', diriyah: 'الدرعية',
  shaqra: 'شقراء', zulfi: 'الزلفي', 'abu-arish': 'أبو عريش', samtah: 'صامطة',
  baish: 'بيش', 'ahad-rufaidah': 'أحد رفيدة', baljurashi: 'بلجرشي',
  sabya: 'صبيا', tanomah: 'تنومة', namas: 'النماص', 'al-wajh': 'الوجه',
  duba: 'ضباء', umluj: 'املج', haql: 'حقل'
};

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  const tools = Object.keys(toolsMap);
  const cities = Object.keys(citiesMap);
  const categories = ['salla', 'zid', 'perfumes', 'dates', 'fashion', 'gifts'];

  tools.forEach((t) => {
    cities.forEach((c) => {
      categories.forEach((cat) => {
        paths.push({ slug: `${t}-${c}-${cat}` });
      });
    });
  });

  return paths;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProgrammaticLanding({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  const matchedToolKey = Object.keys(toolsMap).find((t) => slug.startsWith(t)) || 'profit';
  const matchedCityKey = Object.keys(citiesMap).find((c) => slug.includes(c)) || 'riyadh';

  const toolName = toolsMap[matchedToolKey];
  const cityName = citiesMap[matchedCityKey];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '13px' }}>
            📍 مخصص لمدينة {cityName}
          </span>
          <Link href="/hub/sa" style={{ background: '#0f172a', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '13px' }}>
            ← الانتقال للترسانة الكاملة (24 أداة)
          </Link>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid #e2e8f0', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', marginBottom: '35px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '20px', lineHeight: '1.4' }}>
            {toolName} في {cityName} | منصة إنجازيا
          </h1>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8', marginBottom: '35px', fontWeight: 500 }}>
            اكتشف كيف تساعدك {toolName} في تطوير متجرك وزيادة مبيعاتك داخل نطاق {cityName} وضبط الحسابات المالية بكل دقة وفقاً لمتطلبات السوق السعودي.
          </p>
          <Link href="/hub/sa" style={{ display: 'inline-block', background: '#047857', color: '#fff', padding: '16px 40px', borderRadius: '14px', fontSize: '17px', fontWeight: 900, textDecoration: 'none', boxShadow: '0 8px 20px rgba(4,120,87,0.3)' }}>
            ⚡ تفعيل كافة الأدوات الـ 24 الآن (49.99 ر.س) 🚀
          </Link>
        </div>
      </div>
    </div>
  );
}
