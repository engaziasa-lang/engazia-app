'use client';

import React from 'react';
import Link from 'next/link';

export default function FAQPageAE() {
  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d';

  const faqs = [
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
      a: 'الاشتراك يمنحك وصولاً كاملاً وغير محدود لجميع الأدوات الـ 24. العرض الساري حالياً يتيح لك الاشتراك بـ 49.99 د.إ شهرياً بدلاً من السعر السابق 299 د.إ (بتخفيض حصري 83% لفترة محدودة).'
    },
    {
      q: 'هل يمكنني استعادة بياناتي أو نقلها بين الأجهزة؟',
      a: 'نعم! توفر لك المنصة زراً خاصاً لتصدير واستيراد البيانات (JSON Backup) في الأعلى، مما يتيح لك حفظ نسختك الاحتياطية واسترجاعها في أي وقت.'
    }
  ];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>الأسئلة الشائعة 💡</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>إجابات وافية عن كل ما تحتاج لمعرفته حول منصة إنجازيا (الإمارات)</p>
          </div>
          <Link href="/hub/ae" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ background: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>{faq.q}</h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', margin: 0, fontWeight: 500 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '30px', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ color: '#065f46', fontSize: '20px', fontWeight: 900, marginBottom: '10px' }}>هل لديك استفسار آخر؟</h3>
          <p style={{ color: '#047857', fontSize: '15px', marginBottom: '20px', fontWeight: 700 }}>فريق الدعم الفني جاهز لمساعدتك في أي وقت.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <Link href="/ae/support/contact" style={{ background: '#047857', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 900, fontSize: '14px' }}>تواصل معنا 🎧</Link>
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#8b5cf6', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 900, fontSize: '14px' }}>اشترك بـ 49.99 د.إ ⚡</a>
          </div>
        </div>

      </div>
    </div>
  );
}
