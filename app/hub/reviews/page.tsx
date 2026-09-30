'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CustomerReviewsTool() {
  const [customerName, setCustomerName] = useState('');
  const [storeName, setStoreName] = useState('متجرنا');
  const [productName, setProductName] = useState('');
  const [discountCode, setDiscountCode] = useState('THANKS10');
  const [generatedMsg, setGeneratedMsg] = useState('');

  const generateReviewMessage = () => {
    if (!customerName || !productName) {
      alert('الرجاء إدخال اسم العميل واسم المنتج على الأقل.');
      return;
    }

    setGeneratedMsg(`مرحباً بك أ. ${customerName} 👋
يسعدنا جداً تعاملك مع ${storeName} ونأمل أن يكون طلبك من "${productName}" قد نال رضاك وإعجابك التام! ⭐

رأيك يهمنا ويساعدنا نتحسن دائماً.. هل تتكرم بترك تقييمك البسيط للمنتج؟ 
[رابط تقييم المنتج في المتجر]

وكشكر خاص لثقتك، يسعدنا نهديك كود خصم (${discountCode}) لطلبك القادم 🎁
نسعد بخدمتك دائماً!`);
  };

  const copyMsg = () => {
    navigator.clipboard.writeText(generatedMsg);
    alert('تم نسخ رسالة تقييم العميل بنجاح!');
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

        .main-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        
        input { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit; background: #f8fafc; color: #0f172a; outline: none; }
        input:focus { border-color: #4f46e5; background: #ffffff; }

        .action-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; margin-top: 10px; }
        .action-btn:hover { background: #4338ca; }

        .preview-box { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 25px; font-size: 15px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; min-height: 220px; max-height: 320px; overflow-y: auto; border: 1px solid #1e293b; margin-bottom: 20px; }

        .copy-btn { background: #10b981; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #059669; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>أداة طلب <span>وتقييمات العملاء</span></h1>
        <p>صمم رسائل متابعة احترافية تُرسل بعد الاستلام لجمع تقييمات العملاء وبناء الثقة في متجرك.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>⭐ تفاصيل الطلب والعميل</h2>
          
          <div className="input-group">
            <label>اسم العميل</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: عبد الله بن محمد" />
          </div>

          <div className="input-group">
            <label>اسم المتجر</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="مثال: متجر إنجازيا" />
          </div>

          <div className="input-group">
            <label>اسم المنتج الذي اشتراه</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: ساعة يد ذكية" />
          </div>

          <div className="input-group">
            <label>كود خصم الشكر (هدية للتقييم)</label>
            <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="مثال: THANKS10" />
          </div>

          <button onClick={generateReviewMessage} className="action-btn">
            ✨ توليد رسالة طلب التقييم
          </button>
        </div>

        <div className="panel">
          <h2>👁️ معاينة الرسالة الجاهزة للإرسال</h2>
          
          <div className="preview-box">
            {generatedMsg || 'املأ البيانات بالليسار واضغط توليد ليظهر النص هنا...'}
          </div>

          {generatedMsg && (
            <button onClick={copyMsg} className="copy-btn">
              📋 نسخ الرسالة لإرسالها بالواتساب
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
