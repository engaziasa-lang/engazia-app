'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TermsPageKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
      if (savedLang) {
        setLang(savedLang);
      }
      document.title = savedLang === 'en' ? 'Enjazya | Terms of Use (Kuwait)' : 'إنجازيا | شروط الاستخدام (الكويت)';
    }
  }, []);

  const t = {
    ar: {
      title: 'شروط الاستخدام ⚖️',
      back: '← عودة للمنصة',
      intro: 'أهلاً بك في منصة إنجازيا المخصصة للسوق الكويتي. استخدامك للمنصة يعتبر موافقة صريحة على الالتزام بالشروط والأحكام التالية:',
      sec1Title: '1. الترخيص والاستخدام',
      sec1Desc: 'تمنحك العضوية حقاً فردياً وغير حصري وغير قابل للتحويل لاستخدام الأدوات الـ 24 الخاصة بإدارة وتطوير المتاجر الإلكترونية وفقاً لمتطلبات القوانين المعمول بها في دولة الكويت.',
      sec2Title: '2. حماية وتخزين البيانات',
      sec2Desc: 'جميع الحسابات والبيانات تُعالج محلياً داخل متصفحك لضمان أعلى معايير الخصوصية والسرية. المنصة لا تتحمل مسؤولية فقدان البيانات المحلية في حال عدم استخدام ميزة التصدير الدوري (JSON Backup).',
      sec3Title: '3. الاشتراكات والمدفوعات',
      sec3Desc: 'تتم عمليات الدفع عبر بوابة Lemon Squeezy الآمنة بقيمة 3.99 د.ك شهرياً، ولا يتم تفعيل التراخيص إلا بعد التحقق الكامل من نجاح عملية الدفع وإرسال مفتاح الترخيص لبريدك.'
    },
    en: {
      title: 'Terms of Use ⚖️',
      back: '→ Back to Hub',
      intro: 'Welcome to the Enjazya platform dedicated to the Kuwait market. Your use of the platform constitutes explicit agreement to abide by the following terms and conditions:',
      sec1Title: '1. License and Use',
      sec1Desc: 'Membership grants you an individual, non-exclusive, non-transferable right to use the 24 tools for managing and developing e-commerce stores in accordance with the requirements of the State of Kuwait.',
      sec2Title: '2. Data Protection and Storage',
      sec2Desc: 'All accounts and data are processed locally inside your browser to ensure the highest standards of privacy and confidentiality. The platform is not responsible for the loss of local data if the periodic export feature (JSON Backup) is not used.',
      sec3Title: '3. Subscriptions and Payments',
      sec3Desc: 'Payments are processed securely via the Lemon Squeezy gateway at 3.99 KWD monthly, and licenses are only activated after full verification of successful payment and delivery of the license key to your email.'
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

          <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, margin: '10px 0 0 0' }}>{text.sec3Title}</h3>
          <p>{text.sec3Desc}</p>
        </div>
      </div>
    </div>
  );
}
