'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UpdatesPageKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
      if (savedLang) {
        setLang(savedLang);
      }
      document.title = savedLang === 'en' ? 'Enjazya | What’s New (Kuwait)' : 'إنجازيا | التحديثات الجديدة (الكويت)';
    }
  }, []);

  const t = {
    ar: {
      title: 'التحديثات الجديدة 🚀',
      desc: 'سجل التطورات والتحديثات المستمرة لمنصة إنجازيا في السوق الكويتي',
      back: '← عودة للمنصة',
      updates: [
        {
          version: 'الإصدار 3.2.0 (الكويت)',
          date: 'أكتوبر 2026',
          desc: 'إطلاق النسخة المخصصة للسوق الكويتي بـ 24 أداة متكاملة، وحاسبات مالية متوافقة مع متطلبات وزارة التجارة والصناعة ودعم العمل بالدينار الكويتي (د.ك).'
        },
        {
          version: 'الإصدار 3.1.0',
          date: 'سبتمبر 2026',
          desc: 'تحديث نظام إدارة عملاء واتساب (إنجازيا Pro Max) وتحسين سرعة استجابة أدوات استرجاع السلات المتروكة.'
        }
      ]
    },
    en: {
      title: 'What’s New 🚀',
      desc: 'Log of continuous developments and updates for the Enjazya platform in Kuwait',
      back: '→ Back to Hub',
      updates: [
        {
          version: 'Version 3.2.0 (Kuwait)',
          date: 'October 2026',
          desc: 'Launch of the Kuwait market edition featuring 24 integrated tools, financial calculators compliant with the Ministry of Commerce & Industry, and KWD currency support.'
        },
        {
          version: 'Version 3.1.0',
          date: 'September 2026',
          desc: 'Updated WhatsApp CRM management system (Enjazya Pro Max) and improved response speed for abandoned cart recovery tools.'
        }
      ]
    }
  };

  const text = t[lang];

  return (
    <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr', fontFamily: lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif", backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
          <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>{text.title}</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>{text.desc}</p>
          </div>
          <Link href="/kw" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s' }}>
            {text.back}
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {text.updates.map((item, idx) => (
            <div key={idx} style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0284c7', margin: 0 }}>{item.version}</h3>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>{item.date}</span>
              </div>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', margin: 0, fontWeight: 500 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
