'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPageAE() {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0 }}>سياسة الخصوصية 🔒</h1>
          <Link href="/hub/ae" style={{ background: '#f1f5f9', color: '#334155', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', fontWeight: 500, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p>نحن في منصة إنجازيا نولي اهتماماً بالغاً بخصوصية بياناتك التجارية والشخصية وفقاً للقوانين المعمول بها في دولة الإمارات العربية المتحدة.</p>
          
          <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, margin: '10px 0 0 0' }}>1. سرية البيانات</h3>
          <p>تعتمد أدواتنا على التخزين المحلي (Local Storage)، مما يعني أن بيانات مبيعاتك، حساباتك الضريبية (FTA)، وعملاء متجرك تبقى مخزنة في متصفحك الخاص ولا يتم رفعها لخوادم خارجية.</p>

          <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, margin: '10px 0 0 0' }}>2. المعلومات التي نجمعها</h3>
          <p>نجمع فقط بيانات التواصل الأساسية (مثل البريد الإلكتروني) عند إتمام عملية الشراء لغرض إصدار وإرسال مفتاح الترخيص ودعمك فنياً عند الحاجة.</p>
        </div>
      </div>
    </div>
  );
}
