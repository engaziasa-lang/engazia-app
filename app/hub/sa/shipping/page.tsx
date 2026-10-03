'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ShippingTrackerSA() {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [shippingCompany, setShippingCompany] = useState<string>('سمسا (SMSA)');
  const [shipmentStatus, setShipmentStatus] = useState<string>('في الطريق إليك');

  // روابط التتبع المباشر لشركات الشحن في السعودية
  const getTrackingUrl = (company: string, num: string) => {
    if (!num) return '#';
    switch (company) {
      case 'سمسا (SMSA)':
        return `https://www.smsaexpress.com/sa/ar/tracking?trackno=${num}`;
      case 'أرامكس (Aramex)':
        return `https://www.aramex.com/sa/ar/track/results?shipmentNumber=${num}`;
      case 'ريدبوكس (RedBox)':
        return `https://redboxsa.com/track/?tracking_number=${num}`;
      case 'أي أم إي اكس (IMEX)':
        return `https://imex.com.sa/`;
      default:
        return `https://www.google.com/search?q=تتبع+شحنة+${num}`;
    }
  };

  const generatedTrackingUrl = getTrackingUrl(shippingCompany, trackingNumber);

  // توليد رسالة التتبع الجاهزة للإرسال للعميل
  const getCustomerMessage = () => {
    const name = customerName.trim() ? `عزيزنا العميل ${customerName}` : 'عزيزنا العميل';
    return `مرحباً ${name} 📦\nنحيطك علماً بأن طلبك تم تسليمه لشركة (${shippingCompany}) وحالته الحالية: (${shipmentStatus}).\n\nيمكنك تتبع شحنتك مباشرة عبر الرابط التالي:\n${generatedTrackingUrl || '[رابط التتبع]'}\n\nنسعد بخدمتك دائماً في متجرنا! ✨`;
  };

  const handleOpenWhatsApp = () => {
    let cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('05')) {
      cleanPhone = '966' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('966') && cleanPhone.length === 9) {
      cleanPhone = '966' + cleanPhone;
    }

    const message = encodeURIComponent(getCustomerMessage());
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getCustomerMessage());
    alert('✨ تم نسخ رسالة التتبع بنجاح!');
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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        
        .preview-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px; white-space: pre-wrap; font-size: 14px; color: #166534; line-height: 1.6; font-weight: 500; min-height: 140px; }
        
        .action-btns { display: flex; gap: 10px; }
        .wa-btn { background: #25d366; color: #fff; border: none; flex: 1; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; font-family: 'Tajawal', sans-serif; box-shadow: 0 4px 10px rgba(37,211,102,0.2); }
        .wa-btn:hover { background: #20ba5a; }
        
        .copy-btn { background: #e2e8f0; color: #334155; border: none; padding: 12px 18px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .copy-btn:hover { background: #cbd5e1; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مدير تتبع الشحنات المحلية 📦</h1>
          <p>تابع شحنات عملك مع شركات الشحن السعودية وأرسل تحديثات التوصيل عبر واتساب</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">بيانات الشحنة والعميل</h2>
          
          <div className="input-group">
            <label>اسم العميل</label>
            <div className="input-wrapper">
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: فهد الشمري" />
            </div>
          </div>

          <div className="input-group">
            <label>رقم جوال العميل</label>
            <div className="input-wrapper">
              <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="مثال: 0501234567" />
            </div>
          </div>

          <div className="input-group">
            <label>اختر شركة الشحن</label>
            <div className="input-wrapper">
              <select value={shippingCompany} onChange={(e) => setShippingCompany(e.target.value)}>
                <option value="سمسا (SMSA)">سمسا (SMSA)</option>
                <option value="أرامكس (Aramex)">أرامكس (Aramex)</option>
                <option value="ريدبوكس (RedBox)">ريدبوكس (RedBox)</option>
                <option value="أي أم إي اكس (IMEX)">أي أم إي اكس (IMEX)</option>
                <option value="أخرى">شركة أخرى</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>رقم بوليصة الشحن (Tracking Number)</label>
            <div className="input-wrapper">
              <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="مثال: 29012345678" />
            </div>
          </div>

          <div className="input-group">
            <label>حالة الشحنة الحالية</label>
            <div className="input-wrapper">
              <select value={shipmentStatus} onChange={(e) => setShipmentStatus(e.target.value)}>
                <option value="تم تجهيز الشحنة">تم تجهيز الشحنة</option>
                <option value="في الطريق إليك (مع مندوب التوصيل)">في الطريق إليك (مع مندوب التوصيل)</option>
                <option value="جاهزة للاستلام من الخزانة (RedBox)">جاهزة للاستلام من الخزانة (RedBox)</option>
                <option value="تأخرت قليلاً بسبب ضغط المواسم">تأخرت قليلاً بسبب ضغط المواسم</option>
              </select>
            </div>
          </div>
        </div>

        {/* قسم المعاينة والإرسال */}
        <div className="card">
          <h2 className="card-title">معاينة رسالة التوصيل</h2>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>النص الجاهز للارسال عبر واتساب:</label>
          <div className="preview-box">
            {getCustomerMessage()}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <a href={generatedTrackingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#047857', fontWeight: 700, textDecoration: 'underline' }}>
              🔗 رابط التتبع المباشر: {trackingNumber ? 'انقر للاختبار' : 'أدخل رقم البوليصة لتفعيل الرابط'}
            </a>
          </div>

          <div className="action-btns">
            <button className="wa-btn" onClick={handleOpenWhatsApp}>
              💬 إرسال رسالة التتبع عبر واتساب
            </button>
            <button className="copy-btn" onClick={handleCopyText}>
              📋 نسخ النص
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
