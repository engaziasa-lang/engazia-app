'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PaymentFeesCalculator() {
  const [orderAmount, setOrderAmount] = useState<number>(250);
  const [gatewayName, setGatewayName] = useState<string>('mada'); // mada, visa, tabby
  const [customPercent, setCustomPercent] = useState<number>(2.2);
  const [customFixed, setCustomFixed] = useState<number>(1);
  const [includeVatOnFees, setIncludeVatOnFees] = useState<boolean>(true); // ضريبة 15% على الرسوم

  // تحديد النسبة بناءً على البوابة المختارة
  const getFeesConfig = () => {
    if (gatewayName === 'mada') return { p: 1.0, f: 1 };
    if (gatewayName === 'visa') return { p: 2.5, f: 1 };
    if (gatewayName === 'tabby') return { p: 4.5, f: 1 };
    return { p: customPercent, f: customFixed };
  };

  const config = getFeesConfig();

  // الحسابات
  const rawFee = (orderAmount * (config.p / 100)) + config.f;
  const vatOnFee = includeVatOnFees ? rawFee * 0.15 : 0;
  const totalGatewayDeduction = rawFee + vatOnFee;
  const netReceivedAmount = orderAmount - totalGatewayDeduction;

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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 14px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #4f46e5; background: #ffffff; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .highlight .result-label { color: #ffffff; }
        
        .result-value { font-size: 22px; font-weight: 900; color: #ffffff; }
        .result-value span { font-size: 14px; font-weight: 500; opacity: 0.7; margin-right: 5px; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>حاسبة رسوم <span>بوابات الدفع</span></h1>
        <p>احسب بدقة المبالغ المقتطعة بواسطة بوابات الدفع (مدى، فيزا، تابي) وتأثيرها على حسابات متجرك.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>💳 إعدادات العملية وبوابة الدفع</h2>
          
          <div className="input-group">
            <label>قيمة طلب العميل الإجمالية</label>
            <div className="input-wrapper">
              <input type="number" value={orderAmount || ''} onChange={(e) => setOrderAmount(Number(e.target.value))} />
            </div>
          </div>

          <div className="input-group">
            <label>اختر بوابة الدفع</label>
            <div className="input-wrapper">
              <select value={gatewayName} onChange={(e) => setGatewayName(e.target.value)}>
                <option value="mada">مدى Mada (تقديري: ~1%)</option>
                <option value="visa">فيزا / ماستركارد Visa/Mastercard (تقديري: ~2.5%)</option>
                <option value="tabby">تابي / تمارا - الشراء لاحقاً (تقديري: ~4.5%)</option>
                <option value="custom">بوابة مخصصة (أدخل النسبة يدوياً)</option>
              </select>
            </div>
          </div>

          {gatewayName === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label>النسبة (%)</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" value={customPercent} onChange={(e) => setCustomPercent(Number(e.target.value))} />
                </div>
              </div>
              <div className="input-group">
                <label>الرسوم الثابتة (ر.س)</label>
                <div className="input-wrapper">
                  <input type="number" value={customFixed} onChange={(e) => setCustomFixed(Number(e.target.value))} />
                </div>
              </div>
            </div>
          )}

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
            <input 
              type="checkbox" 
              id="vatCheck" 
              checked={includeVatOnFees} 
              onChange={(e) => setIncludeVatOnFees(e.target.checked)} 
              style={{ width: '20px', height: '20px', accentColor: '#4f46e5' }}
            />
            <label htmlFor="vatCheck" style={{ margin: 0, cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>
              احتساب ضريبة القيمة المضافة (15%) على رسوم البوابة
            </label>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>📊 صافي ما سيصل لحسابك</h2>

          <div className="result-box highlight">
            <span className="result-label">المبلغ الصافي المحول لحسابك</span>
            <span className="result-value" dir="ltr">{netReceivedAmount.toFixed(2)} <span>ر.س</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي اقتطاعات البوابة والرسوم</span>
            <span className="result-value" style={{ color: '#fca5a5' }} dir="ltr">-{totalGatewayDeduction.toFixed(2)} <span>ر.س</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">الرسوم الأساسية + الضريبة على الرسوم</span>
            <span className="result-value" style={{ fontSize: '16px' }} dir="ltr">
              {rawFee.toFixed(2)} + {vatOnFee.toFixed(2)} ر.س
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
