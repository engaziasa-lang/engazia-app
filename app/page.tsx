'use client';

import React from 'react';
import Link from 'next/link';

export default function MarketSelector() {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ textAlign: 'center', maxWidth: '700px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', marginBottom: '15px', letterSpacing: '-0.5px' }}>
          منصة إنجازيا <span>ULTRA MAX</span>
        </h1>
        <p style={{ color: '#475569', fontSize: '16px', fontWeight: 600, lineHeight: '1.6' }}>
          الترسانة السحابية المتكاملة بـ 24 أداة ذكية لتمكين وتطوير المتاجر الإلكترونية. اختر السوق المستهدف للبدء:
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', width: '100%', maxWidth: '650px' }}>
        
        {/* بطاقة السوق السعودي */}
        <Link href="/hub/sa" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '35px 25px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', cursor: 'pointer' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#047857'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: '15px', display: 'inline-block', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src="https://flagcdn.com/w160/sa.png" alt="علم المملكة العربية السعودية" style={{ width: '80px', height: '50px', objectFit: 'cover', display: 'block' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>السوق السعودي</h2>
            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, margin: '0 0 20px 0' }}>متوافق مع متطلبات سلة، زد، والريال السعودي.</p>
            <span style={{ display: 'inline-block', background: '#ecfdf5', color: '#047857', padding: '10px 24px', borderRadius: '10px', fontWeight: 800, fontSize: '14px' }}>الدخول للسوق السعودي ←</span>
          </div>
        </Link>

        {/* بطاقة السوق الإماراتي */}
        <Link href="/hub/ae" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '20px', padding: '35px 25px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', cursor: 'pointer' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00732f'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: '15px', display: 'inline-block', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src="https://flagcdn.com/w160/ae.png" alt="علم دولة الإمارات العربية المتحدة" style={{ width: '80px', height: '50px', objectFit: 'cover', display: 'block' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>السوق الإماراتي</h2>
            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, margin: '0 0 20px 0' }}>متوافق مع ضريبة الهيئة الاتحادية (FTA) والدرهم.</p>
            <span style={{ display: 'inline-block', background: '#f0fdf4', color: '#00732f', padding: '10px 24px', borderRadius: '10px', fontWeight: 800, fontSize: '14px' }}>الدخول للسوق الإماراتي ←</span>
          </div>
        </Link>

      </div>

      <div style={{ marginTop: '50px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>
        جميع الحقوق محفوظة © 2026 منصة إنجازيا للحلول الرقمية
      </div>
    </div>
  );
}
