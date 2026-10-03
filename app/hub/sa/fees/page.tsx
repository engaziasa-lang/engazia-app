'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// النسب التقريبية الشائعة في السوق السعودي (يمكن للتاجر تعديلها)
const paymentGateways = [
  { id: 'mada', name: 'بطاقة مدى (Mada)', percent: 1.0, fixed: 1.0, cap: 40 }, // مدى غالباً لها حد أقصى للرسوم
  { id: 'visa', name: 'فيزا / ماستر كارد', percent: 2.5, fixed: 1.0, cap: null },
  { id: 'applepay_mada', name: 'Apple Pay (مدى)', percent: 1.0, fixed: 1.0, cap: 40 },
  { id: 'tabby', name: 'تابي (Tabby)', percent: 6.0, fixed: 1.5, cap: null },
  { id: 'tamara', name: 'تمارا (Tamara)', percent: 6.5, fixed: 1.5, cap: null },
  { id: 'custom', name: 'إدخال يدوي (بوابة أخرى)', percent: 0, fixed: 0, cap: null },
];

export default function PaymentFeesCalculatorSA() {
  const [orderValue, setOrderValue] = useState<number>(0);
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('mada');
  
  // حقول الإدخال اليدوي إذا اختار بوابة مخصصة أو أراد تعديل النسب
  const [customPercent, setCustomPercent] = useState<number>(1.0);
  const [customFixed, setCustomFixed] = useState<number>(1.0);
  
  // النتائج
  const [results, setResults] = useState({
    baseFee: 0,
    feeVat: 0,
    totalDeduction: 0,
    netPayout: 0,
  });

  // تحديث الحقول عند تغيير البوابة
  useEffect(() => {
    const gateway = paymentGateways.find(g => g.id === selectedGatewayId);
    if (gateway && gateway.id !== 'custom') {
      setCustomPercent(gateway.percent);
      setCustomFixed(gateway.fixed);
    }
  }, [selectedGatewayId]);

  // العمليات الحسابية
  useEffect(() => {
    if (orderValue <= 0) {
      setResults({ baseFee: 0, feeVat: 0, totalDeduction: 0, netPayout: 0 });
      return;
    }

    const gateway = paymentGateways.find(g => g.id === selectedGatewayId);
    let calculatedBaseFee = (orderValue * (customPercent / 100)) + customFixed;

    // تطبيق الحد الأقصى لرسوم مدى إن وجد (مثال: 40 ريال كحد أقصى للرسوم)
    if (gateway && gateway.cap !== null && calculatedBaseFee > gateway.cap) {
      calculatedBaseFee = gateway.cap;
    }

    // ضريبة القيمة المضافة (15%) على رسوم بوابة الدفع نفسها
    const feeVat = calculatedBaseFee * 0.15;
    
    // إجمالي المخصوم من التاجر
    const totalDeduction = calculatedBaseFee + feeVat;
    
    // الصافي المحول لحساب التاجر
    const netPayout = orderValue - totalDeduction;

    setResults({
      baseFee: calculatedBaseFee,
      feeVat: feeVat,
      totalDeduction: totalDeduction,
      netPayout: netPayout,
    });
  }, [orderValue, customPercent, customFixed, selectedGatewayId]);

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
        
        .input-group { margin-bottom: 18px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #4f46e5; background: #ffffff; }
        .currency-tag { position: absolute; left: 15px; color: #94a3b8; font-weight: 700; font-size: 14px; }
        
        .gateways-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
        .gateway-btn { padding: 12px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px; color: #475569; transition: all 0.2s; text-align: center; }
        .gateway-btn.active { background: #e0e7ff; border-color: #4f46e5; color: #4f46e5; box-shadow: 0 2px 4px rgba(79,70,229,0.1); }
        
        .custom-rates-box { background: #f1f5f9; padding: 15px; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; border: 1px dashed #cbd5e1; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff; border: none; padding: 22px; margin-top: 10px; }
        
        .result-label { font-size: 14px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #e0e7ff; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value { font-size: 28px; color: #ffffff; }
        
        .deduction { color: #dc2626; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة رسوم بوابات الدفع 💳</h1>
          <p>تعرف على الصافي المحول لحسابك بعد استقطاع رسوم البوابة والضريبة</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">بيانات الطلب والبوابة</h2>
          
          <div className="input-group">
            <label>إجمالي قيمة الطلب (المدفوع من العميل)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={orderValue || ''} onChange={(e) => setOrderValue(Number(e.target.value))} placeholder="مثال: 500" />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>اختر بوابة الدفع</label>
          <div className="gateways-grid">
            {paymentGateways.map(gateway => (
              <button 
                key={gateway.id}
                className={`gateway-btn ${selectedGatewayId === gateway.id ? 'active' : ''}`}
                onClick={() => setSelectedGatewayId(gateway.id)}
              >
                {gateway.name}
              </button>
            ))}
          </div>

          <div className="custom-rates-box">
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '12px' }}>النسبة المئوية</label>
              <div className="input-wrapper">
                <input 
                  type="number" step="0.1" 
                  value={customPercent} 
                  onChange={(e) => setCustomPercent(Number(e.target.value))}
                  disabled={selectedGatewayId !== 'custom'}
                  style={{ background: selectedGatewayId !== 'custom' ? '#e2e8f0' : '#fff' }}
                />
                <span className="currency-tag">%</span>
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '12px' }}>الرسوم الثابتة</label>
              <div className="input-wrapper">
                <input 
                  type="number" step="0.1" 
                  value={customFixed} 
                  onChange={(e) => setCustomFixed(Number(e.target.value))}
                  disabled={selectedGatewayId !== 'custom'}
                  style={{ background: selectedGatewayId !== 'custom' ? '#e2e8f0' : '#fff' }}
                />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '10px' }}>* ملاحظة: النسب الموجودة تقريبية وقد تختلف قليلاً حسب الباقة وحجم مبيعات متجرك مع مزود الخدمة.</p>
        </div>

        {/* قسم النتائج */}
        <div className="card">
          <h2 className="card-title">تفاصيل الاستقطاعات والصافي</h2>

          <div className="result-box">
            <span className="result-label">رسوم البوابة (نسبة + ثابت)</span>
            <span className="result-value">{results.baseFee.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <div>
              <div className="result-label">ضريبة القيمة المضافة (15%)</div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: '#94a3b8' }}>تُحسب على رسوم البوابة فقط</div>
            </div>
            <span className="result-value">{results.feeVat.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
            <span className="result-label" style={{ color: '#991b1b' }}>إجمالي الخصم من الطلب</span>
            <span className="result-value deduction">-{results.totalDeduction.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box primary">
            <div>
              <div className="result-label">الصافي المحول لحسابك</div>
              <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>المبلغ الفعلي الذي ستستلمه</div>
            </div>
            <div className="result-value">
              {results.netPayout.toFixed(2)} ر.س
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
