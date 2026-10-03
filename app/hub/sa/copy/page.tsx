'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SaudiAdCopyGenerator() {
  const [productName, setProductName] = useState<string>('عطر ليالي نجد');
  const [productBenefit, setProductBenefit] = useState<string>('ثبات يطول طوال اليوم وفواح بشكل خيالي');
  const [discountOffer, setDiscountOffer] = useState<string>('خصم 30% مع شحن مجاني لفترة محدودة');
  const [copyStyle, setCopyStyle] = useState<'hook' | 'story' | 'urgent'>('hook');

  const getGeneratedCopy = () => {
    switch (copyStyle) {
      case 'hook':
        return `يا أهلنا في السعودية! 🇸🇦🔥\nدوركم على عطر فخم ومميز يثبت معك من الصباح لين الليل؟\n\nنقدم لكم (${productName}) - ${productBenefit} ✨\n\nالعرض لفترة محدودة: ${discountOffer} 🎁\n\nاطلب الآن قبل تنفذ الكمية! الرابط في البايو أو المتجر 🛒👇`;
      case 'story':
        return `تدري وش أحلى شعور؟ لما تدخل أي مكان وكلهم يسألونك عن ريحتك المميزة! 😍\n\nمع (${productName})، وفرنا لك ${productBenefit}.\n\nولا تشيل هم السعر، لأننا مسوين ${discountOffer} 🚚💨\n\nاطلب اليوم وفالك الطيب! ارفع السواقة واطلب من المتجر مباشرة 📲`;
      case 'urgent':
        return `🚨 تنبيه لكل عشاق التميز والأناقة في السعودية!\n\nكمية محدودة جداً من (${productName}) وصلت للمستودعات 📦\n${productBenefit}.\n\nاللحق ما تلحق: ${discountOffer} ⚡\n\nاضغط على الرابط بالأسفل واطلب طلبك قبل تفوتك الفرصة 🏃‍♂️👇`;
      default:
        return '';
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getGeneratedCopy());
    alert('✨ تم نسخ الإعلان باللهجة السعودية بنجاح!');
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
        
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        
        .types-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px; }
        .type-btn { padding: 12px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px; color: #475569; transition: all 0.2s; text-align: center; }
        .type-btn.active { background: #ecfdf5; border-color: #047857; color: #047857; box-shadow: 0 2px 4px rgba(4,120,87,0.1); }
        
        .preview-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin-bottom: 20px; white-space: pre-wrap; font-size: 14px; color: #166534; line-height: 1.8; font-weight: 500; min-height: 200px; }
        
        .copy-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .copy-btn:hover { background: #065f46; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مولد نصوص الإكسبلور (باللهجة السعودية) ✍</h1>
          <p>اصنع إعلانات وسكربتات تيك توك وسناب شات جذابة باللهجة المحلية لزيادة معدل التحويل</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">تفاصيل المنتج والعرض</h2>
          
          <div className="input-group">
            <label>اسم المنتج أو الخدمة</label>
            <div className="input-wrapper">
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>الميزة الكبرى أو فائدة المنتج</label>
            <div className="input-wrapper">
              <input type="text" value={productBenefit} onChange={(e) => setProductBenefit(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>العرض أو الخصم الحالي</label>
            <div className="input-wrapper">
              <input type="text" value={discountOffer} onChange={(e) => setDiscountOffer(e.target.value)} />
            </div>
          </div>
        </div>

        {/* قسم المعاينة والنسخ */}
        <div className="card">
          <h2 className="card-title">أسلوب الإعلان</h2>

          <div className="types-grid">
            <button className={`type-btn ${copyStyle === 'hook' ? 'active' : ''}`} onClick={() => setCopyStyle('hook')}>
              🔥 أسلوب الجذب السريع (Hook)
            </button>
            <button className={`type-btn ${copyStyle === 'story' ? 'active' : ''}`} onClick={() => setCopyStyle('story')}>
              📖 أسلوب القصة والتجربة (Storytelling)
            </button>
            <button className={`type-btn ${copyStyle === 'urgent' ? 'active' : ''}`} onClick={() => setCopyStyle('urgent')}>
              ⚡ أسلوب الإلحاح والعرض السريع (Urgency)
            </button>
          </div>

          <div className="preview-box">
            {getGeneratedCopy()}
          </div>

          <button className="copy-btn" onClick={handleCopyText}>
            📋 نسخ نص الإعلان
          </button>
        </div>
      </div>
    </div>
  );
}
