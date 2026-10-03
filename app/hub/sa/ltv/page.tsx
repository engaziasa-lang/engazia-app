'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerLifetimeValueCalculatorSA() {
  const [averageOrderValue, setAverageOrderValue] = useState<number>(250); // متوسط قيمة الطلب (ر.س)
  const [purchaseFrequency, setPurchaseFrequency] = useState<number>(2.5); // معدل تكرار الشراء سنوياً لكل عميل
  const [customerLifespanYears, setCustomerLifespanYears] = useState<number>(2); // العمر الإفتراضي للعميل (بالسنوات)
  const [grossMarginPercent, setGrossMarginPercent] = useState<number>(40); // هامش الربح الإجمالي للمنتجات (%)
  const [acquisitionCost, setAcquisitionCost] = useState<number>(60); // تكلفة الاستحواذ على العميل (CAC - ر.س)

  const [results, setResults] = useState({
    customerValue: 0,
    ltv: 0,
    ltvToCacRatio: 0,
    isHealthy: false,
  });

  useEffect(() => {
    // 1. القيمة الإجمالية للعميل (Customer Value) = متوسط الطلب * تكرار الشراء سنوياً * سنوات العمر الافتراضي
    const customerValue = averageOrderValue * purchaseFrequency * customerLifespanYears;

    // 2. القيمة الدائمة للعميل (LTV) = القيمة الإجمالية * هامش الربح الإجمالي
    const ltv = customerValue * (grossMarginPercent / 100);

    // 3. نسبة العائد LTV / CAC (المعيار الصحي المثالي هو 3:1 أو أعلى)
    const ltvToCacRatio = acquisitionCost > 0 ? ltv / acquisitionCost : 0;

    setResults({
      customerValue,
      ltv,
      ltvToCacRatio,
      isHealthy: ltvToCacRatio >= 3,
    });
  }, [averageOrderValue, purchaseFrequency, customerLifespanYears, grossMarginPercent, acquisitionCost]);

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
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 15px; color: #94a3b8; font-weight: 700; font-size: 13px; }
        
        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-box.warning { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 20px; }
        
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .warning .result-label { color: #ffffff; opacity: 0.9; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value, .warning .result-value { font-size: 26px; color: #ffffff; }
        
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 13px; margin-bottom: 15px; }
        .status-badge.success { background: #dcfce7; color: #166534; }
        .status-badge.fail { background: #fef3c7; color: #92400e; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة القيمة الدائمة للعميل (LTV) 🎯</h1>
          <p>اعرف القيمة الحقيقية للعميل على المدى الطويل وقارنها بتكلفة الاستحواذ (CAC)</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">معطيات العملاء والمبيعات</h2>
          
          <div className="input-group">
            <label>متوسط قيمة الطلب الواحد</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={averageOrderValue || ''} onChange={(e) => setAverageOrderValue(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>معدل تكرار الشراء السنوي لكل عميل</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" min="0" value={purchaseFrequency || ''} onChange={(e) => setPurchaseFrequency(Number(e.target.value))} />
              <span className="currency-tag">مرة/سنة</span>
            </div>
          </div>

          <div className="input-group">
            <label>العمر الافتراضي للعميل (بالسنوات)</label>
            <div className="input-wrapper">
              <input type="number" step="0.5" min="0" value={customerLifespanYears || ''} onChange={(e) => setCustomerLifespanYears(Number(e.target.value))} />
              <span className="currency-tag">سنوات</span>
            </div>
          </div>

          <div className="input-group">
            <label>هامش الربح الإجمالي للمنتجات (%)</label>
            <div className="input-wrapper">
              <input type="number" min="0" max="100" value={grossMarginPercent || ''} onChange={(e) => setGrossMarginPercent(Number(e.target.value))} />
              <span className="currency-tag">%</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الاستحواذ على العميل (CAC)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={acquisitionCost || ''} onChange={(e) => setAcquisitionCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>
        </div>

        {/* قسم النتائج والتحليل */}
        <div className="card">
          <h2 className="card-title">تحليل LTV مقابل CAC</h2>

          <div>
            {results.isHealthy ? (
              <div className="status-badge success">🟢 نموذج العائد ممتاز ومستدام (LTV أعلى بكثير من CAC)</div>
            ) : (
              <div className="status-badge fail">🟡 تنبيه: نسبة LTV إلى CAC تحتاج لتحسين لزيادة الأرباح</div>
            )}
          </div>

          <div className="result-box primary">
            <div>
              <div className="result-label">القيمة الدائمة للعميل (LTV)</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>صافي الربح المتوقع من العميل طوال فترة تعامله</div>
            </div>
            <div className="result-value">
              {results.ltv.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">نسبة العائد (LTV : CAC)</span>
            <span className="result-value" style={{ color: results.ltvToCacRatio >= 3 ? '#10b981' : '#d97706' }}>
              {results.ltvToCacRatio.toFixed(1)} : 1
            </span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي إيرادات العميل (قبل خصم التكلفة)</span>
            <span className="result-value">{results.customerValue.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">تكلفة الاستحواذ المدخلة (CAC)</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{acquisitionCost.toFixed(2)} ر.س</span>
          </div>

        </div>
      </div>
    </div>
  );
}
