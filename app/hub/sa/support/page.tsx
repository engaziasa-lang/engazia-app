'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CustomerSupportTemplatesSA() {
  const [selectedCategory, setSelectedCategory] = useState<'shipping' | 'payment' | 'exchange' | 'greeting'>('shipping');

  const templates = {
    shipping: {
      title: '📦 الاستفسار عن موعد التوصيل والشحن',
      text: 'أهلاً بك عزيزنا العميل 👋\nمدة التوصيل داخل مدن المملكة تستغرق عادة من 2 إلى 4 أيام عمل (عبر سمسا أو أرامكس). فور خروج طلبك مع المندوب، ستصلك رسالة نصية برابط التتبع المباشر. نسعد بخدمتك دائماً! ✨'
    },
    payment: {
      title: '💳 طرق الدفع المتاحة',
      text: 'مرحباً بك 👋\nنوفّر في متجرنا عدة خيارات دفع آمنة وسهلة تشمل:\n1. مدى (Mada)\n2. البطاقات الائتمانية (Visa / MasterCard)\n3. أبل باي (Apple Pay)\n4. الدفع بالتقسيط عبر (تابي و تمارا)\n5. الدفع عند الاستلام (COD).\nاختر ما يناسبك بكل سهولة أثناء إتمام الطلب! 🔒'
    },
    exchange: {
      title: '🔄 سياسة الاستبدال والاسترجاع',
      text: 'أهلاً بك عزيزنا العميل 🌸\nيحق لك استبدال أو استرجاع المنتج خلال 7 أيام من تاريخ الاستلام، بشرط أن يكون المنتج بحالته الأصلية وغير مستخدم. يمكنك التواصل معنا لتزويدك ببوليصة الإرجاع بكل سهولة. نسعد رضاك دائماً! 🙏'
    },
    greeting: {
      title: '👋 الترحيب بالعميل والرد الآلي',
      text: 'أهلاً ومرحباً بك في متجرنا 🌟\nيسعدنا خدمتكم وتواصلكم معنا. تفضل بطرح استفسارك أو طلبك، وسيتم الرد عليك في أقرب وقت ممكن من قبل فريق خدمة العملاء. يومك سعيد! 🛒'
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✨ تم نسخ الرد الجاهز إلى الحافظة بنجاح!');
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1000px; margin: 40px auto; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .types-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .type-btn { padding: 14px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 10px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 14px; color: #475569; transition: all 0.2s; text-align: start; }
        .type-btn.active { background: #ecfdf5; border-color: #047857; color: #047857; box-shadow: 0 2px 4px rgba(4,120,87,0.1); }
        
        .preview-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 20px; white-space: pre-wrap; font-size: 15px; color: #0f172a; line-height: 1.8; font-weight: 500; min-height: 220px; }
        
        .copy-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #065f46; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>قوالب خدمة العملاء السريعة 🎧</h1>
          <p>انسخ ردود احترافية جاهزة ومجهزة للرد الفوري على استفسارات العملاء المتكررة عبر واتساب</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قائمة التصنيفات */}
        <div className="card">
          <h2 className="card-title">اختر نوع الاستفسار</h2>
          <div className="types-grid">
            <button className={`type-btn ${selectedCategory === 'shipping' ? 'active' : ''}`} onClick={() => setSelectedCategory('shipping')}>
              📦 الشحن ومواعيد التوصيل
            </button>
            <button className={`type-btn ${selectedCategory === 'payment' ? 'active' : ''}`} onClick={() => setSelectedCategory('payment')}>
              💳 بوابات الدفع والتقسيط (تابي/تمارا)
            </button>
            <button className={`type-btn ${selectedCategory === 'exchange' ? 'active' : ''}`} onClick={() => setSelectedCategory('exchange')}>
              🔄 الاستبدال والاسترجاع
            </button>
            <button className={`type-btn ${selectedCategory === 'greeting' ? 'active' : ''}`} onClick={() => setSelectedCategory('greeting')}>
              👋 الترحيب والرد الآلي
            </button>
          </div>
        </div>

        {/* صندوق المعاينة والنسخ */}
        <div className="card">
          <h2 className="card-title">{templates[selectedCategory].title}</h2>
          
          <div className="preview-box">
            {templates[selectedCategory].text}
          </div>

          <button className="copy-btn" onClick={() => handleCopy(templates[selectedCategory].text)}>
            <span>📋</span> نسخ الرد الجاهز للواتساب
          </button>
        </div>
      </div>
    </div>
  );
}
