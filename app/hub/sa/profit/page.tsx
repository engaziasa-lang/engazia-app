'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfitCalculatorSA() {
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [productCost, setProductCost] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [packagingCost, setPackagingCost] = useState<number>(0);
  const [adsCPA, setAdsCPA] = useState<number>(0);
  const [paymentFeePercent, setPaymentFeePercent] = useState<number>(2.5);
  const [hasVat, setHasVat] = useState<boolean>(true);

  const [results, setResults] = useState({
    netProfit: 0,
    profitMargin: 0,
    totalCosts: 0,
    vatAmount: 0,
    paymentFeeAmount: 0,
    breakEvenPrice: 0,
  });

  useEffect(() => {
    // العمليات الحسابية للسوق السعودي
    const vatMultiplier = hasVat ? 0.15 : 0;
    
    // ضريبة القيمة المضافة تحسب من سعر البيع (إذا كان التاجر مسجلاً)
    const vatAmount = sellingPrice - (sellingPrice / (1 + vatMultiplier));
    const priceWithoutVat = sellingPrice - vatAmount;

    // رسوم بوابات الدفع (تُحسب من السعر الإجمالي الذي يدفعه العميل)
    const paymentFeeAmount = sellingPrice * (paymentFeePercent / 100);

    // إجمالي التكاليف
    const totalCosts = productCost + shippingCost + packagingCost + adsCPA + paymentFeeAmount + vatAmount;

    // صافي الربح
    const netProfit = sellingPrice - totalCosts;

    // هامش الربح
    const profitMargin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;

    // نقطة التعادل (السعر الذي يغطي جميع التكاليف بدون ربح أو خسارة)
    const fixedCosts = productCost + shippingCost + packagingCost + adsCPA;
    const breakEvenPrice = fixedCosts / (1 - (paymentFeePercent / 100) - (hasVat ? 0.15 / 1.15 : 0));

    setResults({
      netProfit,
      profitMargin,
      totalCosts,
      vatAmount,
      paymentFeeAmount,
      breakEvenPrice
    });
  }, [sellingPrice, productCost, shippingCost, packagingCost, adsCPA, paymentFeePercent, hasVat]);

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
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input { width: 100%; padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 15px; color: #94a3b8; font-weight: 700; font-size: 14px; }
        
        .checkbox-group { display: flex; align-items: center; gap: 10px; margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5; cursor: pointer; }
        .checkbox-group input { width: 20px; height: 20px; accent-color: #047857; cursor: pointer; }
        .checkbox-group label { font-weight: 800; color: #065f46; cursor: pointer; margin: 0; }
        
        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        
        .result-label { font-size: 14px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #d1fae5; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value { font-size: 28px; color: #ffffff; }
        
        .negative { color: #dc2626 !important; }
        .positive { color: #10b981 !important; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة أرباح ونقاط التعادل 📊</h1>
          <p>احسب صافي أرباح متجرك بدقة مع دعم ضريبة القيمة المضافة (15%)</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">بيانات المنتج والتكاليف</h2>
          
          <div className="input-group">
            <label>سعر بيع المنتج للعميل</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={sellingPrice || ''} onChange={(e) => setSellingPrice(Number(e.target.value))} placeholder="مثال: 150" />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة المنتج (من المورد)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={productCost || ''} onChange={(e) => setProductCost(Number(e.target.value))} placeholder="مثال: 40" />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الشحن والتوصيل للطلب</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={shippingCost || ''} onChange={(e) => setShippingCost(Number(e.target.value))} placeholder="مثال: 25" />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة تغليف الطلب</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={packagingCost || ''} onChange={(e) => setPackagingCost(Number(e.target.value))} placeholder="مثال: 5" />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الإعلان لكل طلب (CPA)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={adsCPA || ''} onChange={(e) => setAdsCPA(Number(e.target.value))} placeholder="مثال: 20" />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>رسوم بوابة الدفع (مدى، فيزا، تابي)</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" min="0" value={paymentFeePercent || ''} onChange={(e) => setPaymentFeePercent(Number(e.target.value))} placeholder="مثال: 2.5" />
              <span className="currency-tag">%</span>
            </div>
          </div>

          <label className="checkbox-group">
            <input type="checkbox" checked={hasVat} onChange={(e) => setHasVat(e.target.checked)} />
            <span>المنشأة مسجلة في ضريبة القيمة المضافة (15%)</span>
          </label>
        </div>

        {/* قسم النتائج */}
        <div className="card">
          <h2 className="card-title">تحليل الأرباح</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">الربح الصافي لكل طلب</div>
              <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>بعد خصم جميع التكاليف والضريبة</div>
            </div>
            <div className={`result-value ${results.netProfit < 0 ? 'negative' : ''}`}>
              {results.netProfit.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">هامش الربح (%)</span>
            <span className={`result-value ${results.profitMargin < 0 ? 'negative' : 'positive'}`}>
              {results.profitMargin.toFixed(1)}%
            </span>
          </div>

          <div className="result-box">
            <span className="result-label">ضريبة القيمة المضافة (للزكاة والضريبة)</span>
            <span className="result-value text-red-500">{results.vatAmount.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">استقطاع بوابة الدفع</span>
            <span className="result-value">{results.paymentFeeAmount.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي التكاليف للطلب الواحد</span>
            <span className="result-value">{results.totalCosts.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box" style={{ background: '#fffbeb', borderColor: '#fde68a', marginTop: '20px' }}>
            <div>
              <div className="result-label" style={{ color: '#b45309' }}>نقطة التعادل (Break-Even)</div>
              <div style={{ fontSize: '11px', color: '#b45309', marginTop: '4px' }}>أقل سعر بيع لتجنب الخسارة</div>
            </div>
            <span className="result-value" style={{ color: '#b45309' }}>
              {isFinite(results.breakEvenPrice) ? results.breakEvenPrice.toFixed(2) : '0.00'} ر.س
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
