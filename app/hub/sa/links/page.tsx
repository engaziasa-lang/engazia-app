'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppQuickLinkGeneratorSA() {
  const [phoneNumber, setPhoneNumber] = useState<string>('966500000000');
  const [defaultMessage, setDefaultMessage] = useState<string>('مرحباً، أرغب بالاستفسار عن المنتجات وعروض المتجر الحالية 🛍️');

  // تنظيف رقم الهاتف وتنسيقه لرابط واتساب الرسمي
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.startsWith('05')) {
    cleanPhone = '966' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('966') && cleanPhone.length === 9) {
    cleanPhone = '966' + cleanPhone;
  }

  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whatsappUrl);
    alert('✨ تم نسخ رابط واتساب السريع بنجاح!');
  };

  const handleTestLink = () => {
    window.open(whatsappUrl, '_blank');
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
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper textarea:focus { border-color: #25d366; background: #ffffff; }
        .input-wrapper textarea { height: 120px; resize: vertical; }
        
        .link-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px; word-break: break-all; font-size: 14px; color: #166534; font-weight: 600; min-height: 80px; }
        
        .action-btns { display: flex; gap: 10px; }
        .wa-btn { background: #25d366; color: #fff; border: none; flex: 1; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; font-family: 'Tajawal', sans-serif; box-shadow: 0 4px 10px rgba(37,211,102,0.2); }
        .wa-btn:hover { background: #20ba5a; }
        
        .copy-btn { background: #e2e8f0; color: #334155; border: none; padding: 12px 18px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .copy-btn:hover { background: #cbd5e1; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>صانع روابط واتساب السريعة 🔗</h1>
          <p>أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك، انستقرام، أو الحملات الإعلانية</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">إعدادات رقم الواتساب والرسالة</h2>
          
          <div className="input-group">
            <label>رقم الجوال التجاري (يبدأ بـ 05 أو 966)</label>
            <div className="input-wrapper">
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="مثال: 0500000000" />
            </div>
          </div>

          <div className="input-group">
            <label>الرسالة الافتراضية التلقائية</label>
            <div className="input-wrapper">
              <textarea value={defaultMessage} onChange={(e) => setDefaultMessage(e.target.value)} placeholder="اكتب النص الافتراضي الذي سيظهر عندما يضغط العميل على الرابط..." />
            </div>
          </div>
        </div>

        {/* قسم الناتج والرابط */}
        <div className="card">
          <h2 className="card-title">الرابط الجاهز للاستخدام</h2>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>رابط واتساب المباشر:</label>
          <div className="link-box">
            {whatsappUrl}
          </div>

          <div className="action-btns">
            <button className="wa-btn" onClick={handleTestLink}>
              🚀 اختبار الرابط الآن
            </button>
            <button className="copy-btn" onClick={handleCopyLink}>
              📋 نسخ الرابط
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
