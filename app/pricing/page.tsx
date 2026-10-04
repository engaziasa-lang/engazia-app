'use client';

import React from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d';

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>باقات الأسعار 💎</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>استثمر في نمو متجرك الإلكتروني بأدوات احترافية وبأسعار تنافسية</p>
          </div>
          <Link href="/hub/sa" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '20px', border: '2px solid #047857', padding: '40px', boxShadow: '0 20px 40px rgba(4,120,87,0.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, background: '#ef4444', color: '#fff', padding: '8px 30px', fontWeight: 900, fontSize: '13px', borderBottomRightRadius: '12px' }}>
            خصم لفترة محدودة 83% 🔥
          </div>

          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>الباقة الشاملة (PRO ULTRA)</h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px' }}>وصول غير محدود لجميع الأدوات الـ 24 والتحديثات المستقبلية وميزات التصدير والاستيراد.</p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '15px', marginBottom: '20px' }}>
              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '22px', fontWeight: 800 }}>299 ر.س</span>
              <span style={{ fontSize: '48px', fontWeight: 900, color: '#047857' }}>49.99 ر.س</span>
              <span style={{ color: '#64748b', fontWeight: 700, fontSize: '16px' }}>/ شهرياً</span>
            </div>

            <ul style={{ textAlign: 'right', listStyle: 'none', padding: 0, margin: '0 auto 35px', display: 'inline-block', color: '#334155', fontSize: '15px', fontWeight: 700, lineHeight: '2.2' }}>
              <li>✅ تفعيل فوري لكافة الأدوات الـ 24</li>
              <li>✅ حسابات ضريبية متوافقة مع زاتكا (ZATCA)</li>
              <li>✅ إدارة عملاء واتساب (إنجازيا Pro Max)</li>
              <li>✅ أداة استخراج بيانات المنافسين (جاسمال)</li>
              <li>✅ إمكانية التفعيل على أجهزة متعددة للموظفين</li>
              <li>✅ نسخ احتياطي وتصدير كامل للبيانات بصيغة JSON</li>
            </ul>

            <div>
              <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#047857', color: '#fff', padding: '16px 40px', borderRadius: '12px', fontSize: '18px', fontWeight: 900, textDecoration: 'none', boxShadow: '0 8px 20px rgba(4,120,87,0.3)', transition: 'transform 0.2s' }}>
                🚀 اشترك الآن وفتح جميع الأدوات
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
