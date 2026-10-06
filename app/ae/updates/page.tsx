'use client';

import React from 'react';
import Link from 'next/link';

export default function UpdatesPageAE() {
  const updates = [
    {
      version: 'الإصدار 3.2.0 (الإمارات)',
      date: 'أكتوبر 2026',
      desc: 'إطلاق النسخة المخصصة للسوق الإماراتي بـ 24 أداة متكاملة، وحاسبات ضريبية متوافقة مع الهيئة الاتحادية للضرائب (FTA) ودعم العمل بالدرهم الإماراتي (د.إ).'
    },
    {
      version: 'الإصدار 3.1.0',
      date: 'سبتمبر 2026',
      desc: 'تحديث نظام إدارة عملاء واتساب (إنجازيا Pro Max) وتحسين سرعة استجابة أدوات استرجاع السلال المتروكة.'
    }
  ];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>التحديثات الجديدة 🚀</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>سجل التطورات والتحديثات المستمرة لمنصة إنجازيا</p>
          </div>
          <Link href="/hub/ae" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {updates.map((item, idx) => (
            <div key={idx} style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#047857', margin: 0 }}>{item.version}</h3>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>{item.date}</span>
              </div>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', margin: 0, fontWeight: 500 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
