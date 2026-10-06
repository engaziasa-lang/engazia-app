'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function PricingAE() {
  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d?locale=en';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'إنجازيا | باقات الاشتراك (الإمارات)';
    }
  }, []);

  // جميع الميزات الـ 24 مخصصة للسوق الإماراتي
  const features = [
    { text: 'تفعيل فوري لكافة الأدوات الـ 24', icon: '🚀' },
    { text: 'إدارة عملاء واتساب (إنجازيا Pro Max)', icon: '💬' },
    { text: 'أداة جسمل لتحليل ومقارنة الأسعار', icon: '🕷️' },
    { text: 'حسابات ضريبية للهيئة الاتحادية (FTA)', icon: '🏛️' },
    { text: 'محلل خسائر المرتجعات والشحن العكسي', icon: '🔄' },
    { text: 'حاسبة أرباح ونقاط التعادل (5% ضريبة)', icon: '📊' },
    { text: 'حاسبة رسوم بوابات الدفع (تابي، Stripe)', icon: '💳' },
    { text: 'مجهز بيانات الإقرار الضريبي', icon: '📑' },
    { text: 'أداة استرجاع السلال المتروكة آلياً', icon: '🛒' },
    { text: 'مولد الفواتير الإلكترونية (FTA)', icon: '🧾' },
    { text: 'محلل عائد الإعلانات (سناب وتيك توك)', icon: '📈' },
    { text: 'مخطط المخزون للمواسم الإماراتية', icon: '📅' },
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
    { text: 'مولد السياسات (اقتصادية دبي)', icon: '⚖' },
    { text: 'مولد نصوص الإكسبلور (باللهجة الإماراتية)', icon: '✍' },
    { text: 'حاسبة اختبارات الإعلانات (A/B)', icon: '⚖️' },
    { text: 'صانع روابط واتساب السريعة', icon: '🔗' },
    { text: 'أسرار نمو المتاجر الإماراتية', icon: '💡' }
  ];

  return (
    <div className="pricing-container" style={{ direction: 'rtl' }}>
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        .pricing-container { min-height: 100vh; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
        
        .header { width: 100%; max-width: 1000px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .brand { font-size: 24px; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 10px; }
        .ae-badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 4px 8px; border-radius: 6px; }
        
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }

        .pricing-card {
          background: #ffffff;
          border: 2px solid #047857; /* الإطار الأخضر المطلوب */
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
        
        .new-price { font-size: 64px; font-weight: 900; color: #047857; display: flex; align-items: center; gap: 8px; line-height: 1; }
        .new-price span { font-size: 24px; font-weight: 800; }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 40px;
          text-align: right;
          margin-bottom: 50px;
        }

        .feature-item { display: flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 700; color: #1e293b; }
        .feature-icon-box { background: #047857; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .check-svg { width: 14px; height: 14px; fill: none; stroke: white; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }

        .subscribe-btn {
          background: #047857;
          color: #ffffff;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Tajawal', sans-serif;
          box-shadow: 0 4px 15px rgba(4,120,87,0.2);
          width: 100%;
          max-width: 400px;
        }
        .subscribe-btn:hover { background: #065f46; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(4,120,87,0.3); }

        @media(max-width: 768px) {
          .pricing-card { padding: 30px 20px; }
          .features-grid { grid-template-columns: 1fr; gap: 20px; }
          .new-price { font-size: 48px; }
          .card-title { font-size: 24px; }
        }
      `}</style>

      <div className="header">
        <div className="brand">
          إنجازيا <span className="ae-badge">السوق الإماراتي AE</span>
        </div>
        <Link href="/hub/ae" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="pricing-card">
        <h1 className="card-title">الباقة الشاملة (PRO ULTRA)</h1>
        <p className="card-desc">وصول غير محدود لجميع الأدوات الـ 24 والتحديثات المستقبلية وميزات التصدير والاستيراد.</p>

        <div className="price-section">
          <div className="old-price">299 <span>د.إ / شهرياً</span></div>
          <div className="new-price">49.99 <span>د.إ</span></div>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div className="feature-item" key={idx}>
              <div className="feature-icon-box">
                <svg className="check-svg" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span>{feature.text} {feature.icon}</span>
            </div>
          ))}
        </div>

        <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
          <button className="subscribe-btn">
            الاشتراك الآن بـ 49.99 د.إ
          </button>
        </a>
      </div>
    </div>
  );
}
