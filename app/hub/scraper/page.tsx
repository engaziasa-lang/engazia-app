'use client';
import React from 'react';
import Link from 'next/link';

export default function ScraperToolPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #cbd5e1' }}>
        <Link href="/hub" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>← العودة للوحة الرئيسية</Link>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '20px 0 10px' }}>⚡ أداة تنسيق واستخراج البيانات</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>نظف الجداول والنصوص العشوائية وحولها بصيغة مرتبة.</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>الصق النصوص أو الجداول هنا</label>
          <textarea rows={5} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} placeholder="الصق بياناتك..."></textarea>
        </div>

        <button onClick={() => alert('تم تنظيف البيانات بنجاح!')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>تنظيف وتصدير إلى Excel</button>
      </div>
    </div>
  );
}
