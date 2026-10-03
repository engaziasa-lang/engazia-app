'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReturnsLossAnalyzerSA() {
  const [totalMonthlyOrders, setTotalMonthlyOrders] = useState<number>(500); // إجمالي الطلبات الشهرية
  const [returnRatePercent, setReturnRatePercent] = useState<number>(15); // نسبة المرتجعات %
  const [productPrice, setProductPrice] = useState<number>(200); // متوسط سعر المنتج
  const [productCost, setProductCost] = useState<number>(60); // تكلفة المنتج
  const [shippingCost, setShippingCost] = useState<number>(25); // تكلفة الشحن الأساسي
  const [returnShippingCost, setReturnShippingCost] = useState<number>(25); // تكلفة الشحن العكسي (المرتجِع)
  const [packagingLoss, setPackagingLoss] = useState<number>(5); // خسارة التغليف والتالف

  const [results, setResults] = useState({
    monthlyReturnsCount: 0,
    costPerReturn: 0,
    totalMonthlyLoss: 0,
    annualLoss: 0,
    profitImpactPercent: 0,
  });

  useEffect(() => {
    const returnsCount = Math.round((totalMonthlyOrders * (returnRatePercent / 100)));
    
    // تكلفة الطلب المرتجع الواحد تشمل: الشحن الذهاب + الشحن العكسي + خسارة التغليف (أحياناً يفقد المنتج قيمته أو يتطلب صيانة)
    const costPerReturn = shippingCost + returnShippingCost + packagingLoss;

    // إجمالي الخسارة الشهرية للمرتجعات
    const totalMonthlyLoss = returnsCount * costPerReturn;

    // الخسارة السنوية
    const annualLoss = totalMonthlyLoss * 12;

    setResults({
      monthlyReturnsCount: returnsCount,
      costPerReturn,
      totalMonthlyLoss,
      annualLoss,
      profitImpactPercent: 0, // يمكن ربطها لاحقاً إذا احتجنا
    });
  }, [totalMonthlyOrders, returnRatePercent, productPrice, productCost, shippingCost, returnShippingCost, packagingLoss]);

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
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .danger .result-value { font-size: 26px; color: #ffffff; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>محلل خسائر المرتجعات والشحن العكسي 🔄</h1>
          <p>قس بدقة تأثير الاسترجاع والاستبدال على أرباح متجرك الشهرية والسنوية</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">معطيات الطلبات والمرتجعات</h2>
          
          <div className="input-group">
            <label>إجمالي عدد الطلبات الشهرية</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={totalMonthlyOrders || ''} onChange={(e) => setTotalMonthlyOrders(Number(e.target.value))} />
              <span className="currency-tag">طلب</span>
            </div>
          </div>

          <div className="input-group">
            <label>نسبة المرتجعات المتوقعة من الطلبات</label>
            <div className="input-wrapper">
              <input type="number" step="0.5" min="0" max="100" value={returnRatePercent || ''} onChange={(e) => setReturnRatePercent(Number(e.target.value))} />
              <span className="currency-tag">%</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة شحن الذهاب للعميل</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={shippingCost || ''} onChange={(e) => setShippingCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الشحن العكسي (المرتجِع)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={returnShippingCost || ''} onChange={(e) => setReturnShippingCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>خسارة التغليف والتالف لكل طلب مرتجع</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={packagingLoss || ''} onChange={(e) => setPackagingLoss(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>
        </div>

        {/* قسم النتائج والخسائر */}
        <div className="card">
          <h2 className="card-title">تحليل الخسائر المالية</h2>

          <div className="result-box">
            <span className="result-label">عدد الطلبات المرتجعة شهرياً</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{results.monthlyReturnsCount} طلب</span>
          </div>

          <div className="result-box">
            <span className="result-label">التكلفة الخفية للطلب المرتجع الواحد</span>
            <span className="result-value">{results.costPerReturn.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box danger">
            <div>
              <div className="result-label">إجمالي الخسارة الشهرية للمرتجعات</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>شحن ذهاب وعودة وتغليف تالف</div>
            </div>
            <div className="result-value">
              {results.totalMonthlyLoss.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
            <div>
              <div className="result-label" style={{ color: '#991b1b' }}>إجمالي الخسارة السنوية المتوقعة</div>
              <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '2px' }}>تؤثر مباشرة على صافي أرباح متجرك</div>
            </div>
            <span className="result-value" style={{ color: '#991b1b' }}>
              {results.annualLoss.toFixed(2)} ر.س
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
