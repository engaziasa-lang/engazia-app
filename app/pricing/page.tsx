'use client';

import React from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const LEMON_CHECKOUT_URL = 'https://seerk.lemonsqueezy.com/checkout/buy/80ff492a-01eb-4455-b1a8-96e12ab72562';

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>أسعار الباقات 💎</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>استثمر في نمو متجرك مع أدوات إنجازيا الاحترافية المصممة للسوق السعودي</p>
          </div>
          <Link href="/hub/sa" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* الباقة المجانية */}
          <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#475569', margin: '0 0 15px 0' }}>الباقة التجريبية</h2>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>مجاناً</div>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px', minHeight: '40px' }}>لتجربة الأدوات والتعرف على واجهة المنصة.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1, color: '#334155', fontSize: '15px', lineHeight: '2' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>✅</span> 3 استخدامات لكل أداة كحد أقصى</li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>✅</span> وصول لجميع الـ 24 أداة</li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>❌</span> لا تشمل التصدير لملفات Excel</li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>❌</span> لا تشمل استعادة النسخ الاحتياطية</li>
            </ul>
            
            <Link href="/hub/sa" style={{ background: '#f1f5f9', color: '#334155', textAlign: 'center', padding: '15px', borderRadius: '12px', textDecoration: 'none', fontWeight: 800 }}>البدء مجاناً</Link>
          </div>

          {/* باقة PRO */}
          <div style={{ background: '#047857', padding: '40px', borderRadius: '20px', border: '2px solid #059669', color: '#fff', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(4,120,87,0.3)' }}>
            <div style={{ position: 'absolute', top: '20px', left: '-30px', background: '#f59e0b', color: '#fff', padding: '5px 40px', transform: 'rotate(-45deg)', fontWeight: 900, fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>الأكثر طلباً</div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#ecfdf5', margin: '0 0 15px 0' }}>باقة إنجازيا PRO</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '36px', fontWeight: 900 }}>37.46 ر.س</span>
              <span style={{ fontSize: '16px', fontWeight: 600, opacity: 0.8 }}>/ شهرياً</span>
            </div>
            <p style={{ color: '#d1fae5', fontSize: '14px', marginBottom: '30px', minHeight: '40px' }}>للتجار المحترفين، تشمل كل ميزات المنصة بلا حدود.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', flex: 1, fontSize: '15px', lineHeight: '2' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>✅</span> استخدام <b>غير محدود</b> لجميع الـ 24 أداة</li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>✅</span> تصدير الإقرارات والتقارير لـ Excel</li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>✅</span> نظام التصدير والاستيراد الشامل</li>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>✅</span> الحصول على التحديثات والأدوات الجديدة مجاناً</li>
            </ul>
            
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#047857', textAlign: 'center', padding: '15px', borderRadius: '12px', textDecoration: 'none', fontWeight: 900, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>الاشتراك الآن ⚡</a>
          </div>

        </div>
      </div>
    </div>
  );
}
