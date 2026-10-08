'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UpdatesPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);
  }, []);

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'التحديثات الجديدة 🚀',
      desc: 'نحن نعمل باستمرار على تطوير المنصة وإضافة أدوات جديدة تلبي احتياجاتك في السوق السعودي',
      updates: [
        {
          version: 'الإصدار 2.0 (إنجازيا برو ماكس الشاملة)',
          date: 'أكتوبر 2026',
          changes: [
            'إعادة هيكلة المنصة بالكامل بهوية إنجازيا برو ماكس الجديدة للسوق السعودي.',
            'إضافة أدوات متقدمة متعددة (LTV، جاسمال، وغيرها) مع التوطين الثنائي الكامل.',
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
            'إضافة ميزة تصدير الجداول السفلية إلى ملفات Excel متوافقة مع اللغة العربية والإنجليزية بالكامل.'
          ]
        }
      ]
    },
    en: {
      back: '→ Back to Hub',
      title: 'New Updates 🚀',
      desc: 'We are constantly improving the platform and adding new tools to meet your needs in Saudi Arabia',
      updates: [
        {
          version: 'Version 2.0 (Enjazya Pro Max Comprehensive)',
          date: 'October 2026',
          changes: [
            'Fully restructured the platform with the new Enjazya Pro Max branding for the Saudi market.',
            'Added multiple advanced tools (LTV, Jasmal, etc.) with complete bilingual localization.',
            'Launched comprehensive export and import for all platform tools in a single JSON file to protect merchant data.',
            'Improved VAT calculator algorithms (ZATCA) to support detailed sales and purchases.'
          ]
        },
        {
          version: 'Version 1.5 (Feasibility & Analytics Update)',
          date: 'September 2026',
          changes: [
            'Launched the "Discount & BOGO Offer Feasibility Calculator" tool.',
            'Enhanced WhatsApp link generator to accept local numbers (05) and convert them automatically.',
            'Added table export feature to fully localized Excel files.'
          ]
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {text.updates.map((update, index) => (
            <div key={index} style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '30px', [lang === 'ar' ? 'right' : 'left']: '-15px', background: '#047857', width: '30px', height: '4px', borderRadius: '4px' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{update.version}</h2>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>📅 {update.date}</span>
              </div>
              <ul style={{ [lang === 'ar' ? 'paddingRight' : 'paddingLeft']: '20px', margin: 0, color: '#334155', fontSize: '15px', lineHeight: '1.8' }}>
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
