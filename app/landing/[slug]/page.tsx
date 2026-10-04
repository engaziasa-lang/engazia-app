'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// قاعدة بيانات المتغيرات الذكية (تولد آلاف التداخلات الفريدة بدون تكرار)
const cities = [
  { name: 'الرياض', slug: 'riyadh', desc: 'عاصمة التجارة والأعمال الرقمية، حيث تنشط مئات المتاجر على سلة وزد.' },
  { name: 'جدة', slug: 'jeddah', desc: 'بوابة التجارة واللوجستيات الكبرى، ومقر لكبرى مشاريع الدروبشيبينغ والاستيراد.' },
  { name: 'مكة المكرمة', slug: 'makkah', desc: 'سوق واعد للمتاجر الموسمية وخدمات ضيوف الرحمن والتجارة الإلكترونية.' },
  { name: 'المدينة المنورة', slug: 'madinah', desc: 'موطن رواد الأعمال الطموحين ومشاريع تمور راكان والخدمات الرقمية المتطورة.' },
  { name: 'الدمام والمنطقة الشرقية', slug: 'dammam', desc: 'مركز الصناعات اللوجستية والتجارة الخليجية المجاورة.' },
  { name: 'بريدة وقسيم التجارة', slug: 'qassim', desc: 'عاصمة التوزيع الزراعي والتجاري الرقمي وس سلاسل الإمداد.' },
  { name: 'أبها وسراة عسير', slug: 'abha', desc: 'محبوبة السياحة والمتاجر المحلية المتنامية في قطاع التجزئة.' }
];

const toolsList = [
  { id: 'profit', name: 'حاسبة أرباح ونقاط التعادل', keyword: 'حساب أرباح المتجر الإلكتروني وضريبة 15%' },
  { id: 'fees', name: 'حاسبة رسوم بوابات الدفع تابي وتمارا', keyword: 'حساب نسب بوابات الدفع وتقليل التكاليف' },
  { id: 'whatsapp', name: 'إدارة عملاء واتساب السلال المتروكة', keyword: 'استعادة السلال المتروكة عبر واتساب تلقائياً' },
  { id: 'vat', name: 'مجهز بيانات الإقرار الضريبي زاتكا', keyword: 'إعداد ملفات ضريبة القيمة المضافة لزاتكا بسهولة' },
  { id: 'jasmal', name: 'جاسمال لاستخراج بيانات المنافسين', keyword: 'سحب أسعار ومنتجات المنافسين في السوق السعودي' }
];

export default function ProgrammaticLandingPage() {
  const params = useParams();
  const slug = params?.slug as string || '';

  // تحليل الـ Slug لاستخراج المدينة والأداة بشكل ديناميكي فريد
  const parts = slug.split('-');
  const matchedCity = cities.find(c => slug.includes(c.slug)) || cities[0];
  const matchedTool = toolsList.find(t => slug.includes(t.id)) || toolsList[0];

  const pageTitle = `${matchedTool.name} في ${matchedCity.name} | أدوات إنجازيا للمتاجر السعودية`;
  const pageDescription = `اكتشف أفضل طريقة لـ ${matchedTool.keyword} ${matchedCity.name}. ${matchedCity.desc} احصل على وصول شامل لأدوات إنجازيا الاحترافية.`;

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* شبار التنظيم العلوي */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '13px' }}>
            🇸🇦 موجه لتجار {matchedCity.name}
          </span>
          <Link href="/hub/sa" style={{ background: '#0f172a', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '13px' }}>
            ← الانتقال للمنصة الرئيسية (24 أداة)
          </Link>
        </div>

        {/* صندوق الهبوط الرئيسي */}
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid #e2e8f0', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', marginBottom: '15px', lineHeight: '1.4' }}>
            {pageTitle}
          </h1>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.8', marginBottom: '30px', fontWeight: 500 }}>
            {pageDescription} إذا كنت تدير متجراً على سلة أو زد في <b>{matchedCity.name}</b> وتبحث عن حلول دقيقة لنمو المبيعات وضبط الحسابات المالية بعيداً عن التعقيد، فإن منصة إنجازيا توفر لك الترسانة الأقوى مصممة خصيصاً للسوق السعودي.
          </p>

          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '25px', borderRadius: '12px', marginBottom: '30px' }}>
            <h3 style={{ color: '#065f46', fontSize: '18px', fontWeight: 900, marginBottom: '10px' }}>لماذا يعتمد تجار {matchedCity.name} على إنجازيا؟</h3>
            <ul style={{ margin: 0, paddingRight: '20px', color: '#047857', fontSize: '15px', fontWeight: 700, lineHeight: '2' }}>
              <li>توافق تام مع متطلبات ضريبة القيمة المضافة وهيئة الزكاة (ZATCA).</li>
              <li>حسابات دقيقة بالريال السعودي تشمل رسوم بوابات الدفع (تابي، تمارا، مدى).</li>
              <li>أمان تام: تعمل البيانات محلياً داخل متصفحك لضمان السرية المطلقة.</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/hub/sa" style={{ display: 'inline-block', background: '#047857', color: '#fff', padding: '16px 35px', borderRadius: '12px', fontSize: '16px', fontWeight: 900, textDecoration: 'none', boxShadow: '0 6px 15px rgba(4,120,87,0.3)' }}>
              🚀 تفعيل جميع الأدوات الـ 24 الآن (عرض خاص بـ 49.99 ر.س)
            </Link>
          </div>
        </div>

        {/* شبكة الربط الداخلي الذكي (لإجبار عناكب جوجل على أرشفة كافة الصفحات) */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '15px' }}>🔗 استكشف خدمات إنجازيا في مناطق أخرى:</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {cities.map((c) => (
              <Link key={c.slug} href={`/landing/${c.slug}-${matchedTool.id}`} style={{ background: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                {matchedTool.name} في {c.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
