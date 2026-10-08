'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d';

  useEffect(() => {
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);
    if (typeof window !== 'undefined') {
      document.title = savedLang === 'ar' ? 'إنجازيا | الأسئلة الشائعة (السوق السعودي)' : 'Enjazya | FAQ (Saudi Market)';
    }
  }, []);

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'الأسئلة الشائعة 💡',
      desc: 'إجابات وافية عن كل ما تحتاج لمعرفته حول منصة إنجازيا برو ماكس في السوق السعودي',
      otherQuestionTitle: 'هل لديك استفسار آخر؟',
      otherQuestionDesc: 'فريق الدعم الفني جاهز لمساعدتك في أي وقت.',
      supportBtn: 'تواصل معنا 🎧',
      subscribeBtn: 'اشترك بـ 49.99 ر.س ⚡',
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
          a: 'الاشتراك يمنحك وصولاً كاملاً وغير محدود لجميع الأدوات الـ 24. العرض الساري حالياً يتيح لك الاشتراك بـ 49.99 ر.س شهرياً بدلاً من السعر السابق 299 ر.س (بتخفيض حصري 83% لفترة محدودة).'
        },
        {
          q: 'هل يمكنني استعادة بياناتي أو نقلها بين الأجهزة؟',
          a: 'نعم! توفر لك المنصة زراً خاصاً لتصدير واستيراد البيانات (JSON Backup) في الأعلى، مما يتيح لك حفظ نسختك الاحتياطية واسترجاعها في أي وقت.'
        }
      ]
    },
    en: {
      back: '→ Back to Hub',
      title: 'Frequently Asked Questions 💡',
      desc: 'Comprehensive answers to everything you need to know about Enjazya Pro Max in the Saudi market',
      otherQuestionTitle: 'Have another question?',
      otherQuestionDesc: 'Our technical support team is ready to help you anytime.',
      supportBtn: 'Contact Us 🎧',
      subscribeBtn: 'Subscribe for 49.99 SAR ⚡',
      faqs: [
        {
          q: 'How do Enjazya tools work and who protects my store data?',
          a: 'All tools and calculators are designed to run locally inside your browser (Local Storage) to ensure maximum confidentiality and privacy. Your data is never uploaded to any external cloud server.'
        },
        {
          q: 'How do I get the license key after completing payment?',
          a: 'Once the payment is successfully processed through the secure payment gateway, the system will instantly send the License Key to your registered email.'
        },
        {
          q: 'How much is the monthly subscription and does it include all tools?',
          a: 'The subscription grants you full and unlimited access to all 24 tools. The current active offer lets you subscribe for 49.99 SAR monthly instead of the previous 299 SAR (exclusive 83% discount for a limited time).'
        },
        {
          q: 'Can I restore my data or transfer it between devices?',
          a: 'Yes! The platform provides a dedicated button to export and import data (JSON Backup) at the top, allowing you to save your backup and restore it anytime.'
        }
      ]
    }
  };

  const text = t[lang];

  return (
    <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr', fontFamily: lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>{text.title}</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>{text.desc}</p>
          </div>
          <Link href="/hub/sa" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>{text.back}</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {text.faqs.map((faq, index) => (
            <div key={index} style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>{faq.q}</h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', margin: 0, fontWeight: 500 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '30px', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ color: '#065f46', fontSize: '20px', fontWeight: 900, marginBottom: '10px' }}>{text.otherQuestionTitle}</h3>
          <p style={{ color: '#047857', fontSize: '15px', marginBottom: '20px', fontWeight: 700 }}>{text.otherQuestionDesc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
            <Link href="/support/contact" style={{ background: '#047857', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 900, fontSize: '14px' }}>{text.supportBtn}</Link>
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 900, fontSize: '14px' }}>{text.subscribeBtn}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
