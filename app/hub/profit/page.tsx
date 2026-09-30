'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfitCalculator() {
  const [productCost, setProductCost] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [adSpend, setAdSpend] = useState<number>(0);
  const [paymentFeePercent, setPaymentFeePercent] = useState<number>(2.5);
  const [paymentFeeFixed, setPaymentFeeFixed] = useState<number>(1);
  const [taxPercent, setTaxPercent] = useState<number>(15);
  const [returnRate, setReturnRate] = useState<number>(10);

  const [results, setResults] = useState({
    grossProfit: 0,
    paymentFees: 0,
    taxAmount: 0,
    netProfit: 0,
    roi: 0,
    breakEvenUnits: 0,
    profitMargin: 0,
    returnsCost: 0
  });

  useEffect(() => {
    calculateProfit();
  }, [productCost, sellingPrice, shippingCost, adSpend, paymentFeePercent, paymentFeeFixed, taxPercent, returnRate]);

  const calculateProfit = () => {
    if (sellingPrice <= 0) return;

    // 1. حساب رسوم الدفع
    const paymentFees = (sellingPrice * (paymentFeePercent / 100)) + paymentFeeFixed;
    
    // 2. حساب الضريبة (على سعر البيع)
    const taxAmount = sellingPrice * (taxPercent / 100);
    
    // 3. حساب تكلفة المرتجعات التقديرية
    const returnsCost = (productCost + shippingCost) * (returnRate / 100);

    // 4. إجمالي التكاليف للمنتج الواحد
    const totalCostPerUnit = productCost + shippingCost + paymentFees + taxAmount + returnsCost;

    // 5. الربح الإجمالي (قبل الإعلانات)
    const grossProfit = sellingPrice - totalCostPerUnit;

    // 6. الربح الصافي (بعد خصم الإعلانات إن وجدت للمنتج الواحد)
    const netProfit = grossProfit - adSpend;

    // 7. هامش الربح
    const profitMargin = (netProfit / sellingPrice) * 100;

    // 8. العائد على الاستثمار (ROI)
    const totalInvestment = productCost + shippingCost + adSpend;
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    // 9. نقطة التعادل (كم حبة أحتاج أبيع لأغطي الإعلانات)
    const breakEvenUnits = grossProfit > 0 && adSpend > 0 ? Math.ceil(adSpend / grossProfit) : 0;

    setResults({
      grossProfit,
      paymentFees,
      taxAmount,
      netProfit,
      roi,
      breakEvenUnits,
      profitMargin,
      returnsCost
    });
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
        .input-wrapper { position: relative; }
        .input-wrapper input { width: 100%; padding: 14px 15px 14px 45px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 16px; font-family: inherit; transition: border-color 0.2s; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus { border-color: #4f46e5; background: #ffffff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        .input-wrapper .currency { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-weight: 700; font-size: 14px; }

        .grid-2-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        /* Results Panel Styling */
        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        .result-box.warning { background: #7f1d1d; border-color: #991b1b; }
        .result-box.success { background: #14532d; border-color: #166534; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .highlight .result-label, .warning .result-label, .success .result-label { color: #ffffff; opacity: 0.9; }
        
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
        <h1>حاسبة <span>أرباح ونقاط التعادل</span> الدقيقة</h1>
        <p>احسب صافي أرباحك الحقيقية وتأكد من تسعير منتجك بشكل صحيح قبل إطلاق الحملات.</p>
      </div>

      <div className="main-grid">
        {/* قسم إدخال البيانات */}
        <div className="panel">
          <h2>📊 بيانات المنتج والتكاليف</h2>
          
          <div className="input-group">
            <label>سعر بيع المنتج للعميل</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={sellingPrice || ''} onChange={(e) => setSellingPrice(Number(e.target.value))} placeholder="مثال: 199" />
              <span className="currency">ر.س</span>
            </div>
          </div>

          <div className="grid-2-cols">
            <div className="input-group">
              <label>تكلفة المنتج عليك</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={productCost || ''} onChange={(e) => setProductCost(Number(e.target.value))} placeholder="مثال: 50" />
                <span className="currency">ر.س</span>
              </div>
            </div>
            
            <div className="input-group">
              <label>تكلفة الشحن والتغليف</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={shippingCost || ''} onChange={(e) => setShippingCost(Number(e.target.value))} placeholder="مثال: 25" />
                <span className="currency">ر.س</span>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة التسويق المقدرة (للمبيعة الواحدة)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={adSpend || ''} onChange={(e) => setAdSpend(Number(e.target.value))} placeholder="مثال: 40" />
              <span className="currency">ر.س</span>
            </div>
          </div>

          <div className="grid-2-cols">
            <div className="input-group">
              <label>رسوم بوابة الدفع (%)</label>
              <div className="input-wrapper">
                <input type="number" step="0.1" value={paymentFeePercent} onChange={(e) => setPaymentFeePercent(Number(e.target.value))} />
                <span className="currency">%</span>
              </div>
            </div>
            <div className="input-group">
              <label>نسبة المرتجعات المتوقعة</label>
              <div className="input-wrapper">
                <input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
                <span className="currency">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* قسم النتائج والتحليل */}
        <div className="panel results-panel">
          <h2>🎯 التحليل المالي والنتائج</h2>

          <div className={`result-box ${results.netProfit > 0 ? 'success' : results.netProfit < 0 ? 'warning' : ''}`}>
            <span className="result-label">الربح الصافي (للمبيعة الواحدة)</span>
            <span className="result-value" dir="ltr">{results.netProfit.toFixed(2)} <span>ر.س</span></span>
          </div>

          <div className="result-box highlight">
            <span className="result-label">هامش الربح الصافي</span>
            <span className="result-value" dir="ltr">{results.profitMargin.toFixed(1)} <span>%</span></span>
          </div>

          <div className="grid-2-cols" style={{ gap: '15px', marginBottom: '15px' }}>
            <div className="result-box" style={{ marginBottom: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="result-label" style={{ fontSize: '12px', marginBottom: '8px' }}>رسوم الدفع للعملية</span>
              <span className="result-value" style={{ fontSize: '18px' }} dir="ltr">{results.paymentFees.toFixed(2)} <span>ر.س</span></span>
            </div>
            <div className="result-box" style={{ marginBottom: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="result-label" style={{ fontSize: '12px', marginBottom: '8px' }}>خسارة المرتجعات التقديرية</span>
              <span className="result-value" style={{ fontSize: '18px', color: '#fca5a5' }} dir="ltr">-{results.returnsCost.toFixed(2)} <span>ر.س</span></span>
            </div>
          </div>

          <div className="result-box" style={{ background: '#334155', borderColor: '#475569' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="result-label">نقطة التعادل الإعلانية</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>المبيعات المطلوبة لتغطية الإعلانات</span>
            </div>
            <span className="result-value">{results.breakEvenUnits} <span>مبيعة</span></span>
          </div>
          
        </div>
      </div>
    </div>
  );
}
