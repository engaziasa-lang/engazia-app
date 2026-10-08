'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FAQPageKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
      if (savedLang) {
        setLang(savedLang);
      }
      document.title = savedLang === 'en' ? 'Enjazya | FAQ (Kuwait)' : 'إنجازيا | الأسئلة الشائعة (الكويت)';
    }
  }, []);

  const t = {
    ar: {
      title: 'الأسئلة الشائعة 💡',
      desc: 'إجابات وافية عن كل ما تحتاج لمعرفته حول منصة إنجازيا (الكويت)',
      back: '← عودة للمنصة',
      otherTitle: 'هل لديك استفسار آخر؟',
      otherDesc: 'فريق الدعم الفني جاهز لمساعدتك في أي وقت.',
      contactBtn: 'تواصل معنا 🎧',
      subBtn: 'اشترك بـ 3.99 د.ك ⚡',
      faqs: [
        {
          q: 'كيف تعمل أدوات منصة إنجازيا ومن المسؤول عن حماية بيانات متجري؟',
          a: 'جميع الأدوات والحاسبات مصممة للعمل محلياً داخل متصفحك (Local Storage) لضمان أقصى درجات السرية والخصوصية. بياناتك لا ترفع لأي خادم سحابي خارجي.'
        },
        {
          q: 'كيف أحصل على مفتاح الترخيص بعد اتمام الدفع؟',
          a: 'بمجرد إتمام عملية الدفع بنجاح عبر بوابة الدفع الآمنة، سيقوم النظام فوراً بإرسال مفتاح الترخيص (License Key) إلى بريدك الإلكتروني المسجل.'
        },
        {
          q: 'كم سعر الاشتراك الشهري وهل يشمل جميع الأدوات؟',
          a: 'الاشتراك يمنحك وصولاً كاملاً وغير محدود لجميع الأدوات الـ 24. العرض الساري حالياً يتيح لك الاشتراك بـ 3.99 د.ك شهرياً بدلاً من السعر السابق 24.99 د.ك (بتخفيض حصري 83% لفترة محدودة).'
        },
        {
          q: 'هل يمكنني استعادة بياناتي أو نقلها بين الأجهزة؟',
          a: 'نعم! توفر لك المنصة زراً خاصاً لتصدير واستيراد البيانات (JSON Backup) في الأعلى، مما يتيح لك حفظ نسختك الاحتياطية واسترجاعها في أي وقت.'
        }
      ]
    },
    en: {
      title: 'Frequently Asked Questions 💡',
      desc: 'Comprehensive answers to everything you need to know about the Enjazya platform (Kuwait)',
      back: '→ Back to Hub',
      otherTitle: 'Have another question?',
      otherDesc: 'Our technical support team is ready to help you at any time.',
      contactBtn: 'Contact Us 🎧',
      subBtn: 'Subscribe for 3.99 KWD ⚡',
      faqs: [
        {
          q: 'How do Enjazya tools work and who is responsible for protecting my store data?',
          a: 'All tools and calculators are designed to run locally inside your browser (Local Storage) to ensure maximum privacy and confidentiality. Your data is never uploaded to any external cloud server.'
        },
        {
          q: 'How do I get my license key after completing the payment?',
          a: 'Once the payment is successfully completed through the secure payment gateway, the system will instantly send the License Key to your registered email.'
        },
        {
          q: 'How much is the monthly subscription and does it include all tools?',
          a: 'The subscription grants you full and unlimited access to all 24 tools. The current active offer allows you to subscribe for 3.99 KWD monthly instead of the previous 24.99 KWD (an 83% exclusive discount for a limited time).'
        },
        {
          q: 'Can I restore my data or transfer it between devices?',
          a: 'Yes! The platform provides a dedicated button for exporting and importing data (JSON Backup) at the top, allowing you to save your backup and restore it anytime.'
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
          <Link href="/kw" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}>
            {text.back}
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {text.faqs.map((faq, index) => (
            <div key={index} style={{ background: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>{faq.q}</h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', margin: 0, fontWeight: 500 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#0369a1', fontSize: '20px', fontWeight: 900, marginBottom: '10px' }}>{text.otherTitle}</h3>
          <p style={{ color: '#0284c7', fontSize: '15px', marginBottom: '20px', fontWeight: 700 }}>{text.otherDesc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
            <Link href="/kw/support/contact" style={{ background: '#0284c7', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 900, fontSize: '14px', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.2)' }}>{text.contactBtn}</Link>
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#0f172a', color: '#fff', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 900, fontSize: '14px', transition: 'all 0.2s' }}>{text.subBtn}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
