'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppManagerSA() {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [orderAmount, setOrderAmount] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [messageType, setMessageType] = useState<'abandoned' | 'payment' | 'shipping' | 'review'>('abandoned');

  // توليد الرسائل الجاهزة باللهجة السعودية والمهنية
  const getGeneratedMessage = () => {
    const name = customerName.trim() ? `عزيزنا العميل ${customerName}` : 'عزيزنا العميل';
    const product = productName.trim() ? `منتج (${productName})` : 'سلتك الشرائية';
    const amount = orderAmount.trim() ? `بمبلغ ${orderAmount} ر.س` : '';

    switch (messageType) {
      case 'abandoned':
        return `مرحباً ${name} 🌟\nلاحظنا أنك تركْت ${product} ${amount} في سلة المتاجر لدينا بانتظار إتمام طلبك.\nهل تواجه أي مشكلة في الدفع؟ يسعدنا مساعدتك وإتمام طلبك بكل سهولة! 🛒✨`;
      case 'payment':
        return `أهلاً بك ${name} 👋\nشكراً لاختيارك متجرنا. لإتمام طلبك ${product} ${amount}، تفضل بزيارة رابط الدفع الآمن المعتمد:\n[أدخل رابط الدفع هنا]\nنسعد بخدمتك دائماً! 💳🔒`;
      case 'shipping':
        return `مرحباً ${name} 📦\nنحيطك علماً بأن طلبك ${product} قد تم تسليمه لشركة الشحن (سمسا / أرامكس) وهو في طريقه إليك الآن.\nيمكنك تتبع شحنتك عبر الرابط المرفق. نتمنى لك تجربة ممتعة! 🚚✨`;
      case 'review':
        return `مرحباً ${name} ⭐\nنتمنى أن يكون ${product} قد نال إعجابك ورضاك!\nيسعدنا جداً تقييمك لتجربتك معنا لمساعدتنا على تحسين خدماتنا في المرات القادمة. شكراً لثقتك بنا! 🙏❤️`;
      default:
        return '';
    }
  };

  const handleOpenWhatsApp = () => {
    let cleanPhone = customerPhone.replace(/\D/g, '');
    // إذا بدأ الرقم بـ 05 (السعودية)، حوله إلى 9665
    if (cleanPhone.startsWith('05')) {
      cleanPhone = '966' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('966') && cleanPhone.length === 9) {
      cleanPhone = '966' + cleanPhone;
    }

    const message = encodeURIComponent(getGeneratedMessage());
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getGeneratedMessage());
    alert('✨ تم نسخ النص بنجاح إلى الحافظة!');
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
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        
        .types-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .type-btn { padding: 10px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px; color: #475569; transition: all 0.2s; text-align: center; }
        .type-btn.active { background: #ecfdf5; border-color: #047857; color: #047857; box-shadow: 0 2px 4px rgba(4,120,87,0.1); }
        
        .preview-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px; white-space: pre-wrap; font-size: 14px; color: #166534; line-height: 1.6; font-weight: 500; min-height: 120px; }
        
        .action-btns { display: flex; gap: 10px; }
        .wa-btn { background: #25d366; color: #fff; border: none; flex: 1; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; font-family: 'Tajawal', sans-serif; box-shadow: 0 4px 10px rgba(37,211,102,0.2); }
        .wa-btn:hover { background: #20ba5a; }
        
        .copy-btn { background: #e2e8f0; color: #334155; border: none; padding: 12px 18px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .copy-btn:hover { background: #cbd5e1; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>إدارة عملاء واتساب (Seerk Pro Max) 💬</h1>
          <p>أرسل رسائل السلال المتروكة ورابط الدفع للعملاء مباشرة عبر واتساب بضغطة زر</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">بيانات العميل والطلب</h2>
          
          <div className="input-group">
            <label>اسم العميل</label>
            <div className="input-wrapper">
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: محمد القحطاني" />
            </div>
          </div>

          <div className="input-group">
            <label>رقم جوال العميل (يبدأ بـ 05 أو 966)</label>
            <div className="input-wrapper">
              <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="مثال: 0551234567" />
            </div>
          </div>

          <div className="input-group">
            <label>اسم المنتج</label>
            <div className="input-wrapper">
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: ساعة لكسور الفاخرة" />
            </div>
          </div>

          <div className="input-group">
            <label>إجمالي مبلغ الطلب (اختياري)</label>
            <div className="input-wrapper">
              <input type="number" value={orderAmount} onChange={(e) => setOrderAmount(e.target.value)} placeholder="مثال: 350" />
            </div>
          </div>
        </div>

        {/* قسم معاينة الرسالة والإرسال */}
        <div className="card">
          <h2 className="card-title">نوع الرسالة والجاهزية</h2>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>اختر القالب المناسب</label>
          <div className="types-grid">
            <button className={`type-btn ${messageType === 'abandoned' ? 'active' : ''}`} onClick={() => setMessageType('abandoned')}>
              🛒 استرجاع السلة المتروكة
            </button>
            <button className={`type-btn ${messageType === 'payment' ? 'active' : ''}`} onClick={() => setMessageType('payment')}>
              💳 إرسال رابط الدفع
            </button>
            <button className={`type-btn ${messageType === 'shipping' ? 'active' : ''}`} onClick={() => setMessageType('shipping')}>
              📦 متابعة وتتبع الشحنة
            </button>
            <button className={`type-btn ${messageType === 'review' ? 'active' : ''}`} onClick={() => setMessageType('review')}>
              ⭐ طلب تقييم المنتج
            </button>
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>معاينة النص الجاهز للإرسال:</label>
          <div className="preview-box">
            {getGeneratedMessage()}
          </div>

          <div className="action-btns">
            <button className="wa-btn" onClick={handleOpenWhatsApp}>
              💬 إرسال عبر واتساب الآن
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
