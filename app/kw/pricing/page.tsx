'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PricingKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d?locale=en';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
      if (savedLang) {
        setLang(savedLang);
      }
      document.title = savedLang === 'en' ? 'Enjazya | Pricing Plans (Kuwait)' : 'إنجازيا | باقات الاشتراك (الكويت)';
    }
  }, []);

  const t = {
    ar: {
      brand: 'إنجازيا',
      badge: 'السوق الكويتي KW',
      back: '← عودة للمنصة',
      title: 'الباقة الشاملة (PRO ULTRA)',
      desc: 'وصول غير محدود لجميع الأدوات الـ 24 والتحديثات المستقبلية وميزات التصدير والاستيراد.',
      oldPriceUnit: 'د.ك / شهرياً',
      newPriceUnit: 'د.ك',
      subscribeBtn: 'الاشتراك الآن بـ 3.99 د.ك',
      features: [
        { text: 'تفعيل فوري لكافة الأدوات الـ 24', icon: '🚀' },
        { text: 'إدارة عملاء واتساب (إنجازيا Pro Max)', icon: '💬' },
        { text: 'أداة جسمل لتحليل ومقارنة الأسعار', icon: '🕷️' },
        { text: 'حسابات وتجهيز التقارير المالية والمبيعات', icon: '🏛️' },
        { text: 'محلل خسائر المرتجعات والشحن العكسي', icon: '🔄' },
        { text: 'حاسبة أرباح ونقاط التعادل (بدون ضريبة)', icon: '📊' },
        { text: 'حاسبة رسوم بوابات الدفع (كي نت، تاب)', icon: '💳' },
        { text: 'مجهز سجلات المبيعات والمشتريات', icon: '📑' },
        { text: 'أداة استرجاع السلال المتروكة آلياً', icon: '🛒' },
        { text: 'مولد الفواتير التجارية (وزارة التجارة)', icon: '🧾' },
        { text: 'محلل عائد الإعلانات (سناب وتيك توك)', icon: '📈' },
        { text: 'مخطط المخزون للمواسم الكويتية', icon: '📅' },
        { text: 'مدير تتبع الشحنات المحلية', icon: '📦' },
        { text: 'حاسبة القيمة الدائمة للعميل (LTV)', icon: '🎯' },
        { text: 'حاسبة رسوم المنصات (سلة، زد، شوبيفاي)', icon: '🛒' },
        { text: 'نظام طلب التقييمات الآلي', icon: '⭐' },
        { text: 'حاسبة جدوى إعلانات المشاهير', icon: '🤳' },
        { text: 'حاسبة أرباح الدروبشيبينغ', icon: '🌍' },
        { text: 'محلل تكاليف الدفع عند الاستلام', icon: '🚚' },
        { text: 'قوالب خدمة العملاء السريعة', icon: '🎧' },
        { text: 'مدير النفقات والمصاريف التشغيلية', icon: '💸' },
        { text: 'حاسبة جدوى أكواد الخصم والعروض', icon: '🎟️' },
        { text: 'مولد السياسات (حماية المستهلك)', icon: '⚖' },
        { text: 'مولد نصوص الإكسبلور (باللهجة الكويتية)', icon: '✍' },
        { text: 'حاسبة اختبارات الإعلانات (A/B)', icon: '⚖️' },
        { text: 'صانع روابط واتساب السريعة', icon: '🔗' },
        { text: 'أسرار نمو المتاجر الكويتية', icon: '💡' }
      ]
    },
    en: {
      brand: 'Enjazya',
      badge: 'Kuwait Market KW',
      back: '→ Back to Hub',
      title: 'All-Inclusive Plan (PRO ULTRA)',
      desc: 'Unlimited access to all 24 tools, future updates, and export/import features.',
      oldPriceUnit: 'KWD / monthly',
      newPriceUnit: 'KWD',
      subscribeBtn: 'Subscribe Now for 3.99 KWD',
      features: [
        { text: 'Instant activation of all 24 tools', icon: '🚀' },
        { text: 'WhatsApp CRM Management (Enjazya Pro Max)', icon: '💬' },
        { text: 'Jasml Price Analysis & Comparison Tool', icon: '🕷️' },
        { text: 'Financial & Sales Reporting Management', icon: '🏛️' },
        { text: 'Returns & Reverse Shipping Loss Analyzer', icon: '🔄' },
        { text: 'Profit & Break-Even Calculator (Tax-Free)', icon: '📊' },
        { text: 'Payment Gateway Fees Calculator (K-Net, Tap)', icon: '💳' },
        { text: 'Sales & Purchases Log Preparer', icon: '📑' },
        { text: 'Automated Abandoned Cart Recovery Tool', icon: '🛒' },
        { text: 'Commercial Invoice Generator (MOCI)', icon: '🧾' },
        { text: 'Ad ROAS Analyzer (Snapchat & TikTok)', icon: '📈' },
        { text: 'Inventory Planner for Kuwaiti Seasons', icon: '📅' },
        { text: 'Local Shipment Tracking Manager', icon: '📦' },
        { text: 'Customer Lifetime Value (LTV) Calculator', icon: '🎯' },
        { text: 'Platform Fees Calculator (Salla, Zid, Shopify)', icon: '🛒' },
        { text: 'Automated Review Request System', icon: '⭐' },
        { text: 'Influencer Ads ROI Calculator', icon: '🤳' },
        { text: 'Dropshipping Profit Calculator', icon: '🌍' },
        { text: 'Cash on Delivery (COD) Cost Analyzer', icon: '🚚' },
        { text: 'Quick Customer Support Templates', icon: '🎧' },
        { text: 'Operational Expenses Manager', icon: '💸' },
        { text: 'Discount & Promo Code ROI Calculator', icon: '🎟️' },
        { text: 'Policies Generator (Consumer Protection)', icon: '⚖' },
        { text: 'Explore Copywriting Generator (Kuwaiti Dialect)', icon: '✍' },
        { text: 'A/B Testing Calculator', icon: '⚖️' },
        { text: 'Quick WhatsApp Link Generator', icon: '🔗' },
        { text: 'Kuwaiti Store Growth Secrets', icon: '💡' }
      ]
    }
  };

  const text = t[lang];

  return (
    <div className="pricing-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f1f5f9; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>

      <style jsx>{`
        .pricing-container { min-height: 100vh; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
        
        .header { width: 100%; max-width: 1000px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .brand { font-size: 24px; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .kw-badge { background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 800; padding: 4px 8px; border-radius: 6px; border: 1px solid #bae6fd; }
        
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 10px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f8fafc; color: #0f172a; border-color: #0284c7; }

        .pricing-card {
          background: #ffffff;
          border: 2px solid #0284c7;
          border-radius: 20px;
          padding: 50px;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          text-align: center;
        }

        .card-title { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 15px; }
        .card-desc { font-size: 16px; color: #475569; font-weight: 500; margin-bottom: 40px; }

        .price-section { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 50px; flex-wrap: wrap; }
        
        .old-price { font-size: 24px; font-weight: 800; color: #94a3b8; text-decoration: line-through; display: flex; align-items: center; gap: 5px; }
        .old-price span { font-size: 16px; }
        
        .new-price { font-size: 64px; font-weight: 900; color: #0284c7; display: flex; align-items: center; gap: 8px; line-height: 1; direction: ltr; }
        .new-price span { font-size: 24px; font-weight: 800; }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 40px;
          text-align: ${lang === 'ar' ? 'right' : 'left'};
          margin-bottom: 50px;
        }

        .feature-item { display: flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 700; color: #1e293b; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; justify-content: flex-end; }
        .feature-icon-box { background: #0284c7; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .check-svg { width: 14px; height: 14px; fill: none; stroke: white; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }

        .subscribe-btn {
          background: #0284c7;
          color: #ffffff;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.25);
          width: 100%;
          max-width: 400px;
        }
        .subscribe-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35); }

        @media(max-width: 768px) {
          .pricing-card { padding: 30px 20px; }
          .features-grid { grid-template-columns: 1fr; gap: 20px; }
          .new-price { font-size: 48px; }
          .card-title { font-size: 24px; }
        }
      `}</style>

      <div className="header">
        <div className="brand">
          {text.brand} <span className="kw-badge">{text.badge}</span>
        </div>
        <Link href="/kw" className="back-btn">
          {text.back}
        </Link>
      </div>

      <div className="pricing-card">
        <h1 className="card-title">{text.title}</h1>
        <p className="card-desc">{text.desc}</p>

        <div className="price-section">
          <div className="old-price">24.99 <span>{text.oldPriceUnit}</span></div>
          <div className="new-price">3.99 <span>{text.newPriceUnit}</span></div>
        </div>

        <div className="features-grid">
          {text.features.map((feature, idx) => (
            <div className="feature-item" key={idx} style={{ flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span style={{ textAlign: lang === 'ar' ? 'right' : 'left', flex: 1 }}>{feature.text} {feature.icon}</span>
              <div className="feature-icon-box">
                <svg className="check-svg" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          ))}
        </div>

        <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
          <button className="subscribe-btn">
            {text.subscribeBtn}
          </button>
        </a>
      </div>
    </div>
  );
}
