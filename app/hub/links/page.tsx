'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WhatsappLinksBuilder() {
  const [phone, setPhone] = useState('9665xxxxxxxx');
  const [message, setMessage] = useState('السلام عليكم، أرغب الاستفسار عن منتجاتكم في المتجر.');

  // تنسيق رقم الجوال ورابط الواتساب
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  const copyLink = () => {
    navigator.clipboard.writeText(whatsappUrl);
    alert('تم نسخ الرابط المباشر بنجاح!');
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 70px; }
        
        .header { max-width: 1000px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 40px; }
        .tool-title h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 16px; }

        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        
        input, textarea { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit; background: #f8fafc; color: #0f172a; outline: none; }
        input:focus, textarea:focus { border-color: #4f46e5; background: #ffffff; }

        textarea { height: 120px; resize: vertical; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; word-break: break-all; }
        .result-label { font-size: 14px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 10px; }
        
        .link-display { font-size: 14px; font-weight: 700; color: #818cf8; line-height: 1.6; }

        .action-btn { background: #10b981; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; }
        .action-btn:hover { background: #059669; }

        .copy-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; }
        .copy-btn:hover { background: #4338ca; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>صانع روابط <span>واتساب المباشرة</span></h1>
        <p>أنشئ روابط مخصصة برسائل جاهزة للبايو في تيك توك، سناب شات، وإعلاناتك المستهدفة.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>📱 إعدادات رقم الواتساب والرسالة</h2>
          
          <div className="input-group">
            <label>رقم الجوال (مع رمز الدولة)</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="مثال: 966500000000" 
            />
          </div>

          <div className="input-group">
            <label>الرسالة الجاهزة التي ستظهر للعميل</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="اكتب رسالة الترحيب أو الاستفسار هنا..."
            />
          </div>
        </div>

        <div className="panel results-panel">
          <h2>🔗 الرابط الناتج الجاهز للاستخدام</h2>

          <div className="result-box">
            <span className="result-label">الرابط المباشر للواتساب:</span>
            <div className="link-display" dir="ltr">{whatsappUrl}</div>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="action-btn">
            🚀 تجربة فتح الرابط الآن
          </a>

          <button onClick={copyLink} className="copy-btn">
            📋 نسخ الرابط إلى الحافظة
          </button>
        </div>
      </div>
    </div>
  );
}
