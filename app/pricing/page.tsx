'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PricingSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d';

  useEffect(() => {
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);
    if (typeof window !== 'undefined') {
      document.title = savedLang === 'ar' ? 'إنجازيا | باقات الاشتراك (السوق السعودي)' : 'Enjazya | Pricing Plans (Saudi Market)';
    }
  }, []);

  const t = {
    ar: {
      brand: 'إنجازيا',
      saBadge: 'السوق السعودي SA',
      back: '← عودة للمنصة',
      cardTitle: 'الباقة الشاملة (PRO ULTRA)',
      cardDesc: 'وصول غير محدود لجميع الأدوات الـ 24 والتحديثات المستقبلية وميزات التصدير والاستيراد في السوق السعودي.',
      oldPriceUnit: 'ر.س / شهرياً',
      newPriceUnit: 'ر.س',
      subscribeBtn: 'الاشتراك الآن بـ 49.99 ر.س 🚀',
      features: [
        { text: 'تفعيل فوري لكافة الأدوات الـ 24', icon: '🚀' },
        { text: 'إدارة عملاء واتساب الشاملة (إنجازيا Pro Max)', icon: '📱' },
        { text: 'أداة جسمل (مقارنة وتحليل الأسعار مع المنافسين)', icon: '⚖️' },
        { text: 'حسابات ضريبية متوافقة مع هيئة الزكاة (ZATCA)', icon: '🏛️' },
        { text: 'حاسبة الأرباح والتكاليف التشغيلية الشاملة', icon: '📊' },
        { text: 'حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)', icon: '💳' },
        { text: 'أداة استرجاع السلات المتروكة آلياً', icon: '🛒' },
        { text: 'محلل عائد الإنفاق الإعلاني الدقيق (ROAS)', icon: '📈' },
        { text: 'مدير سياسة المرتجعات والشحن العكسي', icon: '🔄' },
        { text: 'منشئ الفواتير الإلكترونية المعتمدة', icon: '🧾' },
        { text: 'مقارن ومتبع أسعار شركات الشحن', icon: '🚚' },
        { text: 'مستشار الذكاء الاصطناعي لنمو المتاجر', icon: '💡' },
        { text: 'مقارن منصات التجارة الإلكترونية', icon: '🛍️' },
        { text: 'محلل تجارب الأداء وتحسين التحويل (A/B Test)', icon: '🧪' },
        { text: 'حاسبة القيمة الدائمة للعملاء (LTV)', icon: '💎' },
        { text: 'مخطط العروض الترويجية والخصومات', icon: '🎁' },
        { text: 'مركز الدعم الذكي وإدارة التذاكر', icon: '🎧' },
        { text: 'مولد النصوص التسويقية والإعلانية', icon: '✍️' },
        { text: 'محلل ومخطط أعمال الدروبشيبينغ', icon: '📦' },
        { text: 'مجمع تقييمات العملاء لزيادة الموثوقية', icon: '⭐' },
        { text: 'منشئ السياسات القانونية والشروط', icon: '📜' },
        { text: 'متتبع المصاريف والنفقات المتغيرة', icon: '📉' },
        { text: 'نظام إدارة وتتبع حركة المخزون', icon: '📋' },
        { text: 'مقيم مخاطر الدفع عند الاستلام (COD)', icon: '⚠️' },
        { text: 'محلل أداء حملات المشاهير (Influencers)', icon: '🌟' },
        { text: 'إمكانية التفعيل على 3 أجهزة للموظفين', icon: '💻' },
        { text: 'نسخ احتياطي وتصدير كامل للبيانات بصيغة JSON', icon: '💾' }
      ]
    },
    en: {
      brand: 'Enjazya',
      saBadge: 'Saudi Market SA',
      back: '→ Back to Hub',
      cardTitle: 'Comprehensive Plan (PRO ULTRA)',
      cardDesc: 'Unlimited access to all 24 tools, future updates, and export/import features in the Saudi market.',
      oldPriceUnit: 'SAR / monthly',
      newPriceUnit: 'SAR',
      subscribeBtn: 'Subscribe Now for 49.99 SAR 🚀',
      features: [
        { text: 'Instant activation of all 24 tools', icon: '🚀' },
        { text: 'Comprehensive WhatsApp CRM (Enjazya Pro Max)', icon: '📱' },
        { text: 'Jasmal Tool (Competitor price tracking & analysis)', icon: '⚖️' },
        { text: 'ZATCA compliant tax calculations', icon: '🏛️' },
        { text: 'Comprehensive profit & operational cost calculator', icon: '📊' },
        { text: 'Payment gateway fee calculator (Tabby, Tamara, Mada)', icon: '💳' },
        { text: 'Automated abandoned cart recovery tool', icon: '🛒' },
        { text: 'Accurate Ad Spend Return Analyzer (ROAS)', icon: '📈' },
        { text: 'Returns & reverse logistics policy manager', icon: '🔄' },
        { text: 'Certified electronic invoice generator', icon: '🧾' },
        { text: 'Shipping company price comparator & tracker', icon: '🚚' },
        { text: 'AI store growth advisor', icon: '💡' },
        { text: 'E-commerce platform comparator', icon: '🛍️' },
        { text: 'Performance testing & conversion rate analyzer (A/B Test)', icon: '🧪' },
        { text: 'Customer Lifetime Value (LTV) Calculator', icon: '💎' },
        { text: 'Promotions and discount planner', icon: '🎁' },
        { text: 'Smart support center & ticket management', icon: '🎧' },
        { text: 'Marketing and ad copy generator', icon: '✍️' },
        { text: 'Dropshipping business analyst & planner', icon: '📦' },
        { text: 'Customer review aggregator to build trust', icon: '⭐' },
        { text: 'Legal policies and terms generator', icon: '📜' },
        { text: 'Variable expense and cost tracker', icon: '📉' },
        { text: 'Inventory movement management & tracking system', icon: '📋' },
        { text: 'Cash on Delivery (COD) risk assessor', icon: '⚠️' },
        { text: 'Influencer campaign performance analyst', icon: '🌟' },
        { text: 'Activation on up to 3 employee devices', icon: '💻' },
        { text: 'Full data backup and export in JSON format', icon: '💾' }
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
        .sa-badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 4px 8px; border-radius: 6px; }
        
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }

        .pricing-card {
          background: #ffffff;
          border: 2px solid #059669;
          border-radius: 20px;
          padding: 50px;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          text-align: center;
        }

        .card-title { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 15px; }
        .card-desc { font-size: 16px; color: #475569; font-weight: 500; margin-bottom: 40px; }

        .price-section { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 50px; flex-wrap: wrap; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .old-price { font-size: 24px; font-weight: 800; color: #94a3b8; text-decoration: line-through; display: flex; align-items: center; gap: 5px; }
        .old-price span { font-size: 16px; }
        
        .new-price { font-size: 64px; font-weight: 900; color: #059669; display: flex; align-items: center; gap: 8px; line-height: 1; direction: ltr; }
        .new-price span { font-size: 24px; font-weight: 800; }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 40px;
          text-align: ${lang === 'ar' ? 'right' : 'left'};
          margin-bottom: 50px;
        }

        .feature-item { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: #1e293b; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; justify-content: flex-end; }
        .feature-icon-box { background: #059669; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .check-svg { width: 14px; height: 14px; fill: none; stroke: white; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }

        .subscribe-btn {
          background: #059669;
          color: #ffffff;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          box-shadow: 0 4px 15px rgba(5,150,105,0.2);
          width: 100%;
          max-width: 400px;
        }
        .subscribe-btn:hover { background: #047857; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(5,150,105,0.3); }

        @media(max-width: 768px) {
          .pricing-card { padding: 30px 20px; }
          .features-grid { grid-template-columns: 1fr; gap: 20px; }
          .new-price { font-size: 48px; }
          .card-title { font-size: 24px; }
        }
      `}</style>

      <div className="header">
        <div className="brand">
          {text.brand} <span className="sa-badge">{text.saBadge}</span>
        </div>
        <Link href="/hub/sa" className="back-btn">
          {text.back}
        </Link>
      </div>

      <div className="pricing-card">
        <h1 className="card-title">{text.cardTitle}</h1>
        <p className="card-desc">{text.cardDesc}</p>

        <div className="price-section">
          <div className="old-price">299 <span>{text.oldPriceUnit}</span></div>
          <div className="new-price">49.99 <span>{text.newPriceUnit}</span></div>
        </div>

        <div className="features-grid">
          {text.features.map((feature, idx) => (
            <div className="feature-item" key={idx} style={{ justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
              <span>{feature.text} {feature.icon}</span>
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
