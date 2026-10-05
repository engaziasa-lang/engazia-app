import React from 'react';
import Link from 'next/link';

// 1. تعريف القوائم الضخمة التي تولد عشرات الآلاف من التداخلات الفريدة
const platformTools = [
  { id: 'profit-calculator', name: 'حاسبة أرباح ونقاط التعادل وضريبة 15%', category: 'الإدارة المالية' },
  { id: 'whatsapp-crm', name: 'إدارة عملاء واتساب والسلال المتروكة', category: 'زيادة المبيعات' },
  { id: 'vat-system', name: 'مجهز بيانات الإقرار الضريبي لزاتكا', category: 'الزكاة والضريبة' },
  { id: 'fees-analyzer', name: 'حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)', category: 'التكاليف الخفية' },
  { id: 'competitor-jasmal', name: 'جاسمال لاستخراج بيانات المنافسين وإكسل', category: 'ذكاء الأعمال' }
];

const citiesList = [
  { id: 'riyadh', name: 'الرياض' },
  { id: 'jeddah', name: 'جدة' },
  { id: 'dammam', name: 'الدمام والمنطقة الشرقية' },
  { id: 'madinah', name: 'المدينة المنورة' },
  { id: 'makkah', name: 'مكة المكرمة' },
  { id: 'hafar-albatin', name: 'حفر الباطن' },
  { id: 'qassim', name: 'بريدة والقصيم' },
  { id: 'abha', name: 'أبها وعسير' },
  { id: 'tabuk', name: 'تبوك' },
  { id: 'khobar', name: 'الخبر' },
  { id: 'taif', name: 'الطائف' },
  { id: 'khamis-mushait', name: 'خميس مشيط' }
];

const ecommercePlatforms = [
  { id: 'salla', name: 'متجر سلة (Salla)' },
  { id: 'zid', name: 'متجر زد (Zid)' }
];

// 2. دالة generateStaticParams لتوليد مسارات عشرات الآلاف من الصفحات لـ Next.js
export async function generateStaticParams() {
  const paths: { slug: string }[] = [];

  platformTools.forEach((tool) => {
    citiesList.forEach((city) => {
      ecommercePlatforms.forEach((ecom) => {
        paths.push({
          slug: `${tool.id}-${city.id}-${ecom.id}`,
        });
      });
    });
  });

  return paths;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EnjazyaHubProgrammaticLanding({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  // استخراج المتغيرات ديناميكياً من الـ Slug
  const currentTool = platformTools.find((t) => slug.includes(t.id)) || platformTools[0];
  const currentCity = citiesList.find((c) => slug.includes(c.id)) || citiesList[0];
  const currentEcom = ecommercePlatforms.find((e) => slug.includes(e.id)) || ecommercePlatforms[0];

  const pageTitle = `${currentTool.name} في ${currentCity.name} لتجار ${currentEcom.name} | منصة إنجازيا`;
  const pageDescription = `اكتشف كيف تساعد ${currentTool.name} أصحاب المتاجر على ${currentEcom.name} في ${currentCity.name} على مضاعفة الأرباح وضبط الحسابات بدقة تامة.`;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>
        
        {/* شريط التنظيم العلوي */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '13px' }}>
              🚀 منصة إنجازيا (24 أداة سحابية)
            </span>
            <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '6px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '13px' }}>
              📍 {currentCity.name}
            </span>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '13px' }}>
              🛒 {currentEcom.name}
            </span>
          </div>
          <Link href="/hub/sa" style={{ background: '#0f172a', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '13px' }}>
            ← الدخول للترسانة الكاملة
          </Link>
        </div>

        {/* صندوق الهبوط الرئيسي للمنصة */}
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid #e2e8f0', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', marginBottom: '35px', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-block', background: '#ecfdf5', color: '#047857', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 900, marginBottom: '20px' }}>
            الترسانة السحابية الأولى لتمكين تجار {currentEcom.name} في {currentCity.name}
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '20px', lineHeight: '1.4' }}>
            {pageTitle}
          </h1>
          
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8', marginBottom: '35px', fontWeight: 500, maxWidth: '800px', margin: '0 auto 35px' }}>
            {pageDescription} إذا كنت تدير متجراً عبر {currentEcom.name} وتسعى لتطوير عملياتك في {currentCity.name}، فإن إنجازيا توفر لك حلولاً متكاملة تتوافق مع القوانين السعودية وضريبة القيمة المضافة.
          </p>

          <div style={{ marginBottom: '25px' }}>
            <Link href="/hub/sa" style={{ display: 'inline-block', background: '#047857', color: '#fff', padding: '16px 40px', borderRadius: '14px', fontSize: '17px', fontWeight: 900, textDecoration: 'none', boxShadow: '0 8px 20px rgba(4,120,87,0.3)' }}>
              ⚡ فتح جميع أدوات المنصة الـ 24 الآن (49.99 ر.س) 🚀
            </Link>
          </div>

          <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 700 }}>
            🔒 حماية تامة للبيانات محلياً • متوافق مع زاتكا • دعم كامل بالريال السعودي
          </div>
        </div>

        {/* فوائد ومميزات أدوات إنجازيا */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '15px' }}>
            لماذا يعتمد رواد الأعمال في {currentCity.name} على أدوات إنجازيا؟
          </h3>
          <ul style={{ margin: 0, paddingRight: '20px', color: '#334155', fontSize: '15px', fontWeight: 700, lineHeight: '2' }}>
            <li>حسابات مالية دقيقة ومخصصة لنموذج عمل المتاجر على {currentEcom.name}.</li>
            <li>توفير آلاف الريالات عبر إدارة التكاليف الخفية ورسوم بوابات الدفع المحلية.</li>
            <li>سرعة إنجاز المهام والإقرار الضريبي لخدمة تجار {currentCity.name} بكل احترافية.</li>
          </ul>
        </div>

        {/* شبكة الربط الداخلي الذكي لأرشفة آلاف الصفحات */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '25px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginBottom: '12px' }}>🔗 تصفح أدوات إنجازيا في مناطق المنصة الأخرى:</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {citiesList.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/landing/${currentTool.id}-${c.id}-${currentEcom.id}`} style={{ background: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                {currentTool.name} في {c.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
