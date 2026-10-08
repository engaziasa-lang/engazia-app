'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPageKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
      if (savedLang) {
        setLang(savedLang);
      }
      document.title = savedLang === 'en' ? 'Enjazya | Privacy Policy (Kuwait)' : 'إنجازيا | سياسة الخصوصية (الكويت)';
    }
  }, []);

  const t = {
    ar: {
      title: 'سياسة الخصوصية 🔒',
      back: '← عودة للمنصة',
      intro: 'نحن في منصة إنجازيا نولي اهتماماً بالغاً بخصوصية بياناتك التجارية والشخصية وفقاً للقوانين والتشريعات المعمول بها في دولة الكويت.',
      sec1Title: '1. سرية البيانات',
      sec1Desc: 'تعتمد أدواتنا على التخزين المحلي (Local Storage)، مما يعني أن بيانات مبيعاتك، سجلاتك التجارية، وعملاء متجرك تبقى مخزنة في متصفحك الخاص ولا يتم رفعها لأي خوادم خارجية.',
      sec2Title: '2. المعلومات التي نجمعها',
      sec2Desc: 'نجمع فقط بيانات التواصل الأساسية (مثل البريد الإلكتروني) عند إتمام عملية الشراء لغرض إصدار وإرسال مفتاح الترخيص ودعمك فنياً عند الحاجة.'
    },
    en: {
      title: 'Privacy Policy 🔒',
      back: '→ Back to Hub',
      intro: 'At Enjazya, we place great importance on the privacy of your business and personal data in accordance with the laws and regulations applicable in the State of Kuwait.',
      sec1Title: '1. Data Confidentiality',
      sec1Desc: 'Our tools rely on Local Storage, meaning your sales data, commercial records, and store customers remain stored in your private browser and are never uploaded to external servers.',
      sec2Title: '2. Information We Collect',
      sec2Desc: 'We only collect basic contact information (such as email) upon completing a purchase for the purpose of issuing and sending the license key and providing technical support when needed.'
    }
  };

  const text = t[lang];

  return (
    <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr', fontFamily: lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif", backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', textAlign: lang === 'ar' ? 'right' : 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{text.title}</h1>
          <Link href="/kw" style={{ background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', transition: 'all 0.2s' }}>
            {text.back}
          </Link>
        </div>

        <div style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', fontWeight: 500, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p>{text.intro}</p>
          
          <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, margin: '10px 0 0 0' }}>{text.sec1Title}</h3>
          <p>{text.sec1Desc}</p>

          <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, margin: '10px 0 0 0' }}>{text.sec2Title}</h3>
          <p>{text.sec2Desc}</p>
        </div>
      </div>
    </div>
  );
}
