'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PricingQA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d?locale=en';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
      if (savedLang) {
        setLang(savedLang);
      }
      document.title = savedLang === 'en' ? 'Enjazya | Pricing Plans (Qatar)' : 'إنجازيا | باقات الاشتراك (قطر)';
    }
  }, []);

  const t = {
    ar: {
      brand: 'إنجازيا',
      badge: 'السوق القطري QA',
      back: '← عودة للمنصة',
      title: 'الباقة الشاملة (PRO ULTRA)',
      desc: 'وصول غير محدود لجميع الأدوات الـ 24 والتحديثات المستقبلية وميزات التصدير والاستيراد.',
      oldPriceUnit: 'ر.ق / شهرياً',
      newPriceUnit: 'ر.ق',
      subscribeBtn: 'الاشتراك الآن بـ 49.99 ر.ق',
      features: [
        { text: 'تفعيل فوري لكافة الأدوات الـ 24', icon: '🚀' },
        { text: 'إدارة عملاء واتساب (إنجازيا Pro Max)', icon: '💬' },
        { text: 'أداة جسمل لتحليل ومقارنة الأسعار', icon: '🕷️' },
        { text: 'حسابات ضريبية للهيئة العامة للضرائب (GTA)', icon: '🏛️' },
        { text: 'محلل خسائر المرتجعات والشحن العكسي', icon: '🔄' },
        { text: 'حاسبة أرباح ونقاط التعادل (بدون ضريبة)', icon: '📊' },
        { text: 'حاسبة رسوم بوابات الدفع الإلكترونية', icon: '💳' },
        { text: 'مجهز بيانات الإقرار الضريبي', icon: '📑' },
        { text: 'أداة استرجاع السلال المتروكة آلياً', icon: '🛒' },
        { text: 'مولد الفواتير الإلكترونية', icon: '🧾' },
        { text: 'محلل عائد الإعلانات (سناب وتيك توك)', icon: '📈' },
        { text: 'مخطط المخزون للمواسم والمناسبات', icon: '📅' },
        { text: 'مقارن ومتبع أسعار شركات الشحن', icon: '📦' },
        { text: 'حاسبة القيمة الدائمة للعميل (LTV)', icon: '🎯' },
        { text: 'حاسبة رسوم المنصات (شوبيفاي، ووكومرس)', icon: '🛒' },
        { text: 'نظام طلب التقييمات الآلي', icon: '⭐' },
        { text: 'حاسبة جدوى إعلانات المشاهير', icon: '🤳' },
        { text: 'حاسبة أرباح الدروبشيبينغ', icon: '🌍' },
        { text: 'محلل تكاليف الدفع عند الاستلام', icon: '🚚' },
        { text: 'قوالب خدمة العملاء السريعة', icon: '🎧' },
        { text: 'مدير النفقات والمصاريف التشغيلية', icon: '💸' },
        { text: 'حاسبة جدوى أكواد الخصم والعروض', icon: '🎟️' },
        { text: 'مولد السياسات وحماية المستهلك', icon: '⚖' },
        { text: 'مولد نصوص الإكسبلور والتسويق', icon: '✍' },
        { text: 'حاسبة اختبارات الإعلانات (A/B)', icon: '⚖️' },
        { text: 'صانع روابط واتساب السريعة', icon: '🔗' },
        { text: 'أسرار نمو المتاجر الإلكترونية', icon: '💡' }
      ]
    },
    en: {
      brand: 'Enjazya',
      badge: 'Qatar Market QA',
      back: '→ Back to Hub',
      title: 'All-Inclusive Plan (PRO ULTRA)',
      desc: 'Unlimited access to all 24 tools, future updates, and export/import features.',
      oldPriceUnit: 'QAR / monthly',
      newPriceUnit: 'QAR',
      subscribeBtn: 'Subscribe Now for 49.99 QAR',
      features: [
        { text: 'Instant activation of all 24 tools', icon: '🚀' },
        { text: 'WhatsApp CRM Management (Enjazya Pro Max)', icon: '💬' },
        { text: 'Jasml Price Analysis & Comparison Tool', icon: '🕷️' },
        { text: 'Tax Calculations for Qatar GTA', icon: '🏛️' },
        { text: 'Returns & Reverse Shipping Loss Analyzer', icon: '🔄' },
        { text: 'Profit & Break-Even Calculator', icon: '📊' },
        { text: 'Payment Gateway Fees Calculator', icon: '💳' },
        { text: 'Tax Return Preparer', icon: '📑' },
        { text: 'Automated Abandoned Cart Recovery Tool', icon: '🛒' },
        { text: 'Electronic Invoice Generator', icon: '🧾' },
        { text: 'Ad ROAS Analyzer (Snapchat & TikTok)', icon: '📈' },
        { text: 'Inventory Planner for Seasons', icon: '📅' },
        { text: 'Shipping Company Rate Comparator', icon: '📦' },
        { text: 'Customer Lifetime Value (LTV) Calculator', icon: '🎯' },
        { text: 'Platform Fees Calculator (Shopify, WooCommerce)', icon: '🛒' },
        { text: 'Automated Review Request System', icon: '⭐' },
        { text: 'Influencer Ads ROI Calculator', icon: '🤳' },
        { text: 'Dropshipping Profit Calculator', icon: '🌍' },
        { text: 'Cash on Delivery (COD) Cost Analyzer', icon: '🚚' },
        { text: 'Quick Customer Support Templates', icon: '🎧' },
        { text: 'Operational Expenses Manager', icon: '💸' },
        { text: 'Discount & Promo Code ROI Calculator', icon: '🎟️' },
        { text: 'Policies & Consumer Law Generator', icon: '⚖' },
        { text: 'Marketing Copywriting Generator', icon: '✍' },
        { text: 'A/B Testing Calculator', icon: '⚖️' },
        { text: 'Quick WhatsApp Link Generator', icon: '🔗' },
        { text: 'Store Growth Secrets', icon: '💡' }
      ]
    }
  };

  const text = t[lang];

  return (
    <div className="pricing-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>

      <style jsx>{`
        .pricing-container { min-height: 100vh; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
        
        .header { width: 100%; max-width: 1000px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .brand { font-size: 24px; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .qa-badge { background: #FAF0F2; color: #8A1538; border: 1px solid #EBB8C6; font-size: 12px; font-weight: 800; padding: 4px 8px; border-radius: 6px; }
        
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }

        .pricing-card {
          background: #ffffff;
          border: 2px solid #8A1538;
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
        
        .new-price { font-size: 64px; font-weight: 900; color: #8A1538; display: flex; align-items: center; gap: 8px; line-height: 1; direction: ltr; }
        .new-price span { font-size: 24px; font-weight: 800; }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 40px;
          text-align: ${lang === 'ar' ? 'right' : 'left'};
          margin-bottom: 50px;
        }

        .feature-item { display: flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 700; color: #1e293b; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; justify-content: flex-end; }
        .feature-icon-box { background: #8A1538; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .check-svg { width: 14px; height: 14px; fill: none; stroke: white; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }

        .subscribe-btn {
          background: #8A1538;
          color: #ffffff;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          box-shadow: 0 4px 15px rgba(138,21,56,0.2);
          width: 100%;
          max-width: 400px;
        }
        .subscribe-btn:hover { background: #6A102B; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(138,21,56,0.3); }

        @media(max-width: 768px) {
          .pricing-card { padding: 30px 20px; }
          .features-grid { grid-template-columns: 1fr; gap: 20px; }
          .new-price { font-size: 48px; }
          .card-title { font-size: 24px; }
        }
      `}</style>

      <div className="header">
        <div className="brand">
          {text.brand} <span className="qa-badge">{text.badge}</span>
        </div>
        <Link href="/hub/qa" className="back-btn">
          {text.back}
        </Link>
      </div>

      <div className="pricing-card">
        <h1 className="card-title">{text.title}</h1>
        <p className="card-desc">{text.desc}</p>

        <div className="price-section">
          <div className="old-price">299 <span>{text.oldPriceUnit}</span></div>
          <div className="new-price">49.99 <span>{text.newPriceUnit}</span></div>
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
