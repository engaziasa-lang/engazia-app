'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlatformFeesCalculatorSA() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(50000); // إجمالي المبيعات الشهرية
  const [monthlyOrders, setMonthlyOrders] = useState<number>(200); // عدد الطلبات الشهرية
  const [selectedPlan, setSelectedPlan] = useState<'salla_pro' | 'zid_pro' | 'custom'>('salla_pro');

  const [results, setResults] = useState({
    platformSubscriptionMonthly: 0,
    transactionFees: 0,
    totalPlatformCost: 0,
    netRevenueAfterPlatform: 0,
    effectiveFeePercent: 0,
  });

  useEffect(() => {
    let subCost = 0;
    let transactionFeePercent = 0;

    // باقات تقريبية شائعة في السوق السعودي للمنصات الاحترافية
    if (selectedPlan === 'salla_pro') {
      subCost = 99; // تكلفة اشتراك سلة بلس/برو تقريبية بالشهر
      transactionFeePercent = 0; // سلة غالباً لا تأخذ نسبة على المبيعات في الباقات المدفوعة، الاعتماد على رسوم بوابات الدفع فقط
    } else if (selectedPlan === 'zid_pro') {
      subCost = 199; // تكلفة اشتراك زد بلس/برو تقريبية بالشهر
      transactionFeePercent = 0;
    } else {
      subCost = 0;
      transactionFeePercent = 1.0; // نسبة افتراضية إضافية إن وجدت
    }

    const transactionFees = monthlyRevenue * (transactionFeePercent / 100);
    const totalPlatformCost = subCost + transactionFees;
    const netRevenueAfterPlatform = monthlyRevenue - totalPlatformCost;
    const effectiveFeePercent = monthlyRevenue > 0 ? (totalPlatformCost / monthlyRevenue) * 100 : 0;

    setResults({
      platformSubscriptionMonthly: subCost,
      transactionFees,
      totalPlatformCost,
      netRevenueAfterPlatform,
      effectiveFeePercent,
    });
  }, [monthlyRevenue, monthlyOrders, selectedPlan]);

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
        
        .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
        .plan-btn { padding: 12px 8px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px; color: #475569; transition: all 0.2s; text-align: center; }
        .plan-btn.active { background: #ecfdf5; border-color: #047857; color: #047857; box-shadow: 0 2px 4px rgba(4,120,87,0.1); }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value { font-size: 26px; color: #ffffff; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة رسوم واشتراكات المنصات (سلة، زد) 🛒</h1>
          <p>احسب التكاليف الشهرية لاشتراكات المنصات المحلية وتأثيرها على مبيعات متجرك</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">معطيات المتجر الشهرية</h2>
          
          <div className="input-group">
            <label>إجمالي المبيعات المتوقعة شهرياً</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={monthlyRevenue || ''} onChange={(e) => setMonthlyRevenue(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>إجمالي عدد الطلبات شهرياً</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={monthlyOrders || ''} onChange={(e) => setMonthlyOrders(Number(e.target.value))} />
              <span className="currency-tag">طلب</span>
            </div>
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>اختر المنصة أو الباقة</label>
          <div className="plans-grid">
            <button className={`plan-btn ${selectedPlan === 'salla_pro' ? 'active' : ''}`} onClick={() => setSelectedPlan('salla_pro')}>
              سلة (باقة برو)
            </button>
            <button className={`plan-btn ${selectedPlan === 'zid_pro' ? 'active' : ''}`} onClick={() => setSelectedPlan('zid_pro')}>
              زد (باقة بلس/برو)
            </button>
            <button className={`plan-btn ${selectedPlan === 'custom' ? 'active' : ''}`} onClick={() => setSelectedPlan('custom')}>
              أخرى / نسبة مبيعات
            </button>
          </div>
        </div>

        {/* قسم النتائج والتكاليف */}
        <div className="card">
          <h2 className="card-title">تحليل تكاليف المنصة</h2>

          <div className="result-box">
            <span className="result-label">اشتراك المنصة الشهري الثابت</span>
            <span className="result-value">{results.platformSubscriptionMonthly.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">النسبة المقتطعة من المبيعات</span>
            <span className="result-value">{results.transactionFees.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
            <span className="result-label" style={{ color: '#991b1b' }}>إجمالي تكلفة المنصة شهرياً</span>
            <span className="result-value" style={{ color: '#991b1b' }}>{results.totalPlatformCost.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box primary">
            <div>
              <div className="result-label">صافي الإيرادات بعد تكلفة المنصة</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>المبلغ المتبقي قبل تكاليف البضاعة والإعلانات</div>
            </div>
            <div className="result-value">
              {results.netRevenueAfterPlatform.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">نسبة تكلفة المنصة من إجمالي المبيعات</span>
            <span className="result-value">{results.effectiveFeePercent.toFixed(2)}%</span>
          </div>

        </div>
      </div>
    </div>
  );
}
