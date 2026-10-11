'use client';

import React from 'react';
import Link from 'next/link';

export default function MarketSelector() {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ textAlign: 'center', maxWidth: '750px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '10px', letterSpacing: '-0.5px' }}>
          منصة إنجازيا <span>ULTRA MAX</span>
        </h1>
        <p style={{ color: '#475569', fontSize: '15px', fontWeight: 600, lineHeight: '1.5' }}>
          الترسانة السحابية المتكاملة بـ 24 أداة ذكية لتمكين وتطوير المتاجر الإلكترونية. اختر السوق المستهدف للبدء:
        </p>
      </div>

      {/* تم التعديل إلى repeat(6, minmax(0, 1fr)) لتستوعب 6 أسواق */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '15px', width: '100%', maxWidth: '1400px' }}>
        
        {/* بطاقة السوق السعودي */}
        <Link href="/hub/sa" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#047857'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: '10px', display: 'inline-block', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <img src="https://flagcdn.com/w160/sa.png" alt="علم المملكة العربية السعودية" style={{ width: '60px', height: '38px', objectFit: 'cover', display: 'block' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>السوق السعودي</h2>
            <p style={{ color: '#64748b', fontSize: '12.5px', fontWeight: 500, margin: '0 0 15px 0', lineHeight: '1.4' }}>متوافق مع سلة، زد، والريال.</p>
            <span style={{ display: 'inline-block', background: '#ecfdf5', color: '#047857', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '12.5px' }}>دخول السوق ←</span>
          </div>
        </Link>

        {/* بطاقة السوق الإماراتي */}
        <Link href="/hub/ae" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00732f'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: '10px', display: 'inline-block', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <img src="https://flagcdn.com/w160/ae.png" alt="علم دولة الإمارات العربية المتحدة" style={{ width: '60px', height: '38px', objectFit: 'cover', display: 'block' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>السوق الإماراتي</h2>
            <p style={{ color: '#64748b', fontSize: '12.5px', fontWeight: 500, margin: '0 0 15px 0', lineHeight: '1.4' }}>متوافق مع ضريبة FTA والدرهم.</p>
            <span style={{ display: 'inline-block', background: '#f0fdf4', color: '#00732f', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '12.5px' }}>دخول السوق ←</span>
          </div>
        </Link>

        {/* بطاقة السوق القطري */}
        <Link href="/hub/qa" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8A1538'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: '10px', display: 'inline-block', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <img src="https://flagcdn.com/w160/qa.png" alt="علم دولة قطر" style={{ width: '60px', height: '38px', objectFit: 'cover', display: 'block' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>السوق القطري</h2>
            <p style={{ color: '#64748b', fontSize: '12.5px', fontWeight: 500, margin: '0 0 15px 0', lineHeight: '1.4' }}>متوافق مع متطلبات GTA والريال.</p>
            <span style={{ display: 'inline-block', background: '#FAF0F2', color: '#8A1538', border: '1px solid #EBB8C6', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '12.5px' }}>دخول السوق ←</span>
          </div>
        </Link>

        {/* بطاقة السوق الكويتي */}
        <Link href="/hub/kw" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: '10px', display: 'inline-block', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <img src="https://flagcdn.com/w160/kw.png" alt="علم دولة الكويت" style={{ width: '60px', height: '38px', objectFit: 'cover', display: 'block' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>السوق الكويتي</h2>
            <p style={{ color: '#64748b', fontSize: '12.5px', fontWeight: 500, margin: '0 0 15px 0', lineHeight: '1.4' }}>متوافق مع وزارة التجارة والدينار.</p>
            <span style={{ display: 'inline-block', background: '#e0f2fe', color: '#0284c7', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '12.5px' }}>دخول السوق ←</span>
          </div>
        </Link>

        {/* بطاقة السوق العُماني */}
        <Link href="/hub/om" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C62828'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: '10px', display: 'inline-block', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <img src="https://flagcdn.com/w160/om.png" alt="علم سلطنة عُمان" style={{ width: '60px', height: '38px', objectFit: 'cover', display: 'block' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>السوق العُماني</h2>
            <p style={{ color: '#64748b', fontSize: '12.5px', fontWeight: 500, margin: '0 0 15px 0', lineHeight: '1.4' }}>متوافق مع جهاز الضرائب (OTA) والريال.</p>
            <span style={{ display: 'inline-block', background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '12.5px' }}>دخول السوق ←</span>
          </div>
        </Link>

        {/* بطاقة السوق البحريني (الجديدة) */}
        <Link href="/hub/bh" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '20px 15px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}
               onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#CE1126'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ marginBottom: '10px', display: 'inline-block', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <img src="https://flagcdn.com/w160/bh.png" alt="علم مملكة البحرين" style={{ width: '60px', height: '38px', objectFit: 'cover', display: 'block' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>السوق البحريني</h2>
            <p style={{ color: '#64748b', fontSize: '12.5px', fontWeight: 500, margin: '0 0 15px 0', lineHeight: '1.4' }}>متوافق مع الجهاز الوطني للإيرادات (NBR) والدينار.</p>
            <span style={{ display: 'inline-block', background: '#FDECEE', color: '#CE1126', border: '1px solid #F9C9CE', padding: '8px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '12.5px' }}>دخول السوق ←</span>
          </div>
        </Link>

      </div>

      <style jsx>{`
        /* تعديلات الـ Responsive لتتوافق مع الـ 6 بطاقات */
        @media(max-width: 1200px) {
          div :global(div[style*="grid-template-columns"]) {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
        @media(max-width: 768px) {
          div :global(div[style*="grid-template-columns"]) {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media(max-width: 550px) {
          div :global(div[style*="grid-template-columns"]) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ marginTop: '40px', color: '#94a3b8', fontSize: '12.5px', fontWeight: 500 }}>
        جميع الحقوق محفوظة © 2026 منصة إنجازيا للحلول الرقمية
      </div>
    </div>
  );
}
