'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SupportTemplatesTool() {
  const [storeName, setStoreName] = useState('متجرنا');
  const [shippingDays, setShippingDays] = useState('2 إلى 4 أيام عمل');
  const [selectedCategory, setSelectedCategory] = useState<'shipping' | 'payment' | 'issues' | 'greeting'>('shipping');

  const templates = {
    shipping: `أهلاً بك يا غالي في ${storeName} 🌟
مدة الشحن والتوصيل تستغرق عادة من ${shippingDays} حسب المدينة، وسيتم إرسال رابط التتبع فور خروج الشحنة مع شركة الشحن. نسعد بخدمتك! 📦`,
    
    payment: `حياك الله! 💳
نعم، نوفر وسائل دفع متعددة وآمنة بالكامل:
- شبكة مدى Mada
- بطاقات ائتمانية (فيزا / ماستركارد)
- خدمة الدفع على دفعات (تابي / تمارا)
- والدفع عند الاستلام (حسب المنطقة).`,

    issues: `نعتذر منك جداً عن هذا الإشكال وصادق الحرص على رضاتك 🤍
الرجاء تزويدنا برقم الطلب وتصوير المشكلة أو المنتج، وفريق الدعم سيعالج طلبك ويقوم بالتعويض أو الاستبدال فوراً خلال ساعات.`,

    greeting: `أهلاً بك في ${storeName}، كيف يمكننا مساعدتك اليوم؟ نسعد بخدمتك والإجابة عن كافة استفساراتك بكل وقت ✨`
  };

  const copyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الرد الجاهز بنجاح!');
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

        .category-list { display: flex; flex-direction: column; gap: 10px; }
        .cat-btn { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 12px 15px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: right; cursor: pointer; transition: all 0.2s; }
        .cat-btn.active { background: #4f46e5; color: #ffffff; border-color: #4f46e5; }

        .preview-box { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 25px; font-size: 15px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; min-height: 200px; border: 1px solid #1e293b; margin-bottom: 20px; }

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
        <h1>قوالب ردود <span>خدمة العملاء السريعة</span></h1>
        <p>ردود جاهزة واحترافية لأسئلة العملاء اليومية عبر الواتساب لتوفير وقتك وزيادة سرعة الرد.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>⚙️ إعدادات الردود</h2>
          
          <div className="input-group">
            <label>اسم المتجر</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>مدة الشحن الاعتيادية</label>
            <input type="text" value={shippingDays} onChange={(e) => setShippingDays(e.target.value)} />
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '20px 0 10px', color: '#1e293b' }}>اختر التصنيف:</h3>
          <div className="category-list">
            <button className={`cat-btn ${selectedCategory === 'shipping' ? 'active' : ''}`} onClick={() => setSelectedCategory('shipping')}>
              📦 الاستفسار عن الشحن والتوصيل
            </button>
            <button className={`cat-btn ${selectedCategory === 'payment' ? 'active' : ''}`} onClick={() => setSelectedCategory('payment')}>
              💳 طرق ووسائل الدفع المتاحة
            </button>
            <button className={`cat-btn ${selectedCategory === 'issues' ? 'active' : ''}`} onClick={() => setSelectedCategory('issues')}>
              ⚠️ معالجة الشكاوي أو استرجاع المنتجات
            </button>
            <button className={`cat-btn ${selectedCategory === 'greeting' ? 'active' : ''}`} onClick={() => setSelectedCategory('greeting')}>
              👋 رسالة الترحيب والبدء
            </button>
          </div>
        </div>

        <div className="panel">
          <h2>👁️ الرد الجاهز للنسخ</h2>
          
          <div className="preview-box">
            {templates[selectedCategory]}
          </div>

          <button onClick={() => copyTemplate(templates[selectedCategory])} className="copy-btn">
            📋 نسخ الرد للواتساب
          </button>
        </div>
      </div>
    </div>
  );
}
