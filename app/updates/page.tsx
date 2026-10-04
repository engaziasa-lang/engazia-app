'use client';

import React from 'react';
import Link from 'next/link';

export default function UpdatesPage() {
  const updates = [
    {
      version: 'الإصدار 2.0 (إنجازيا الشاملة)',
      date: 'أكتوبر 2026',
      changes: [
        'إعادة هيكلة المنصة بالكامل بهوية إنجازيا الجديدة للسوق السعودي.',
        'إضافة 6 أدوات جديدة (LTV، A/B Testing، جاسمال، وغيرها) ليصل المجموع إلى 24 أداة.',
        'إطلاق ميزة التصدير والاستيراد الشامل لجميع أدوات المنصة في ملف JSON واحد لحماية بيانات التجار.',
        'تحسين خوارزميات حاسبة الضرائب (زاتكا) لتدعم تفصيل المبيعات والمشتريات.'
      ]
    },
    {
      version: 'الإصدار 1.5 (تحديث الجدوى والتحليلات)',
      date: 'سبتمبر 2026',
      changes: [
        'إطلاق أداة "حاسبة جدوى أكواد الخصم والعروض 1+1".',
        'تطوير صانع روابط الواتساب ليقبل الأرقام بالصيغة المحلية (05) ويحولها آلياً.',
        'إضافة ميزة تصدير الجداول السفلية إلى ملفات Excel متوافقة مع اللغة العربية بالكامل.'
      ]
    }
  ];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>التحديثات الجديدة 🚀</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>نحن نعمل باستمرار على تطوير المنصة وإضافة أدوات جديدة تلبي احتياجاتك</p>
          </div>
          <Link href="/hub/sa" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {updates.map((update, index) => (
            <div key={index} style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '30px', right: '-15px', background: '#047857', width: '30px', height: '4px', borderRadius: '4px' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{update.version}</h2>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>📅 {update.date}</span>
              </div>
              <ul style={{ paddingRight: '20px', margin: 0, color: '#334155', fontSize: '15px', lineHeight: '1.8' }}>
                {update.changes.map((change, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
