'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PromosManager() {
  const [originalPrice, setOriginalPrice] = useState<number>(300);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [promoCode, setPromoCode] = useState('ENGAZIA15');

  // الحسابات
  const discountAmount = discountType === 'percent' 
    ? (originalPrice * (discountValue / 100)) 
    : discountValue;
  
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SALE';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPromoCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(promoCode);
    alert(`تم نسخ كود الخصم (${promoCode}) بنجاح!`);
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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #4f46e5; background: #ffffff; }

        .action-btn { background: #e0e7ff; color: #4f46e5; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; font-size: 13px; margin-top: 8px; }
        .action-btn:hover { background: #c7d2fe; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .highlight .result-label { color: #ffffff; }
        
        .result-value { font-size: 22px; font-weight: 900; color: #ffffff; }
        .result-value span { font-size: 14px; font-weight: 500; opacity: 0.7; margin-right: 5px; }

        .copy-code-btn { background: #10b981; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 15px; }
        .copy-code-btn:hover { background: #059669; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>ممول وأكواد <span>خصم المتاجر</span></h1>
        <p>أنشئ أكواد خصم جذابة، واضبط قيمتها بدقة لزيادة المبيعات وتحفيز العملاء المترددين.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>🎟️ إعدادات كود الخصم</h2>
          
          <div className="input-group">
            <label>رمز الكود (Promo Code)</label>
            <div className="input-wrapper" style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} style={{ flex: 1 }} />
              <button onClick={generateRandomCode} className="action-btn" style={{ margin: 0 }}>توليد عشوائي</button>
            </div>
          </div>

          <div className="input-group">
            <label>سعر المنتج الأصلي</label>
            <div className="input-wrapper">
              <input type="number" value={originalPrice || ''} onChange={(e) => setOriginalPrice(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label>نوع الخصم</label>
              <div className="input-wrapper">
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)}>
                  <option value="percent">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ر.س)</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>قيمة الخصم</label>
              <div className="input-wrapper">
                <input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} />
              </div>
            </div>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>📊 نتائج وتأثير الكود</h2>

          <div className="result-box highlight">
            <span className="result-label">السعر بعد الخصم للعميل</span>
            <span className="result-value" dir="ltr">{finalPrice.toFixed(2)} <span>ر.س</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">قيمة التخفيض الموفرة للعميل</span>
            <span className="result-value" style={{ color: '#86efac' }} dir="ltr">{discountAmount.toFixed(2)} <span>ر.س</span></span>
          </div>

          <div className="result-box" style={{ background: '#1e293b', borderColor: '#334155', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <span className="result-label">الكود الجاهز للمشاركة:</span>
            <span style={{ fontSize: '20px', fontWeight: '900', color: '#818cf8', letterSpacing: '1px' }}>{promoCode}</span>
          </div>

          <button onClick={copyCode} className="copy-code-btn">
            📋 نسخ كود الخصم
          </button>
        </div>
      </div>
    </div>
  );
}
