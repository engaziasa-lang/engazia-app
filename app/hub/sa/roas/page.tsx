'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RoasAnalyzerSA() {
  // المدخلات الأساسية للإعلان
  const [adSpend, setAdSpend] = useState<number>(1000); // إجمالي ميزانية الإعلان
  const [productPrice, setProductPrice] = useState<number>(200); // سعر بيع المنتج
  const [productCost, setProductCost] = useState<number>(50); // تكلفة المنتج من المورد
  const [shippingCost, setShippingCost] = useState<number>(25); // تكلفة الشحن
  const [conversions, setConversions] = useState<number>(25); // عدد الطلبات (التحويلات)
  const [paymentFeePercent, setPaymentFeePercent] = useState<number>(2.5); // رسوم بوابة الدفع

  // النتائج المحسوبة
  const [results, setResults] = useState({
    totalRevenue: 0,
    roas: 0,
    cpa: 0, // تكلفة الاستحواذ على العميل
    netProfitPerOrder: 0,
    totalNetProfit: 0,
    breakEvenRoas: 0,
    isProfitable: false,
  });

  useEffect(() => {
    if (conversions <= 0 || productPrice <= 0) {
      setResults({
        totalRevenue: 0,
        roas: 0,
        cpa: 0,
        netProfitPerOrder: 0,
        totalNetProfit: 0,
        breakEvenRoas: 0,
        isProfitable: false,
      });
      return;
    }

    // إجمالي المبيعات (الإيرادات)
    const totalRevenue = conversions * productPrice;

    // العائد على الإنفاق الإعلاني (ROAS) = الإيرادات / صرف الإعلان
    const roas = adSpend > 0 ? totalRevenue / adSpend : 0;

    // تكلفة الاستحواذ الفعلية للطلب الواحد (CPA) = صرف الإعلان / عدد الطلبات
    const cpa = adSpend / conversions;

    // رسوم بوابة الدفع لكل طلب
    const paymentFee = productPrice * (paymentFeePercent / 100);

    // ضريبة القيمة المضافة المحسوبة من السعر (15%)
    const vatAmount = productPrice - (productPrice / 1.15);

    // تكلفة الطلب الواحد الإجمالية (بدون الإعلان)
    const totalItemCost = productCost + shippingCost + paymentFee + vatAmount;

    // صافي الربح للطلب الواحد قبل خصم الإعلان
    const grossProfitPerOrder = productPrice - totalItemCost;

    // صافي الربح الفعلي للطلب الواحد بعد خصم تكلفة الإعلان (CPA)
    const netProfitPerOrder = grossProfitPerOrder - cpa;

    // إجمالي صافي الأرباح للحملة ككل
    const totalNetProfit = netProfitPerOrder * conversions;

    // حساب ROAS نقطة التعادل (Break-even ROAS) = سعر البيع / ربح الطلب الصافي قبل الإعلان
    const breakEvenRoas = grossProfitPerOrder > 0 ? productPrice / grossProfitPerOrder : 0;

    setResults({
      totalRevenue,
      roas,
      cpa,
      netProfitPerOrder,
      totalNetProfit,
      breakEvenRoas,
      isProfitable: totalNetProfit > 0,
    });
  }, [adSpend, productPrice, productCost, shippingCost, conversions, paymentFeePercent]);

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
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value, .danger .result-value { font-size: 26px; color: #ffffff; }
        
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 13px; margin-bottom: 15px; }
        .status-badge.success { background: #dcfce7; color: #166534; }
        .status-badge.fail { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>محلل عائد الإنفاق الإعلاني (ROAS) 📈</h1>
          <p>قيم أداء حملات سناب شات وتيك توك واكتشف هل أنت في منطقة الأرباح أم الخسائر</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">بيانات الحملة والمنتج</h2>
          
          <div className="input-group">
            <label>إجمالي صرف الإعلان (الميزانية المستخدمة)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={adSpend || ''} onChange={(e) => setAdSpend(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>عدد الطلبات المحققة (Conversions)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={conversions || ''} onChange={(e) => setConversions(Number(e.target.value))} />
              <span className="currency-tag">طلب</span>
            </div>
          </div>

          <div className="input-group">
            <label>سعر بيع المنتج للعميل</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={productPrice || ''} onChange={(e) => setProductPrice(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة المنتج من المورد</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={productCost || ''} onChange={(e) => setProductCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الشحن والتوصيل للطلب الواحد</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={shippingCost || ''} onChange={(e) => setShippingCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>رسوم بوابة الدفع (تقريبي)</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" min="0" value={paymentFeePercent || ''} onChange={(e) => setPaymentFeePercent(Number(e.target.value))} />
              <span className="currency-tag">%</span>
            </div>
          </div>
        </div>

        {/* قسم النتائج والتحليل */}
        <div className="card">
          <h2 className="card-title">تحليل أداء الحملة</h2>

          <div>
            {results.isProfitable ? (
              <div className="status-badge success">🟢 الحملة رابحة وتسير بشكل ممتاز!</div>
            ) : (
              <div className="status-badge fail">🔴 الحملة خاسرة وتستنزف ميزانيتك!</div>
            )}
          </div>

          <div className={`result-box ${results.isProfitable ? 'primary' : 'danger'}`}>
            <div>
              <div className="result-label">إجمالي صافي الربح / الخسارة</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>بعد خصم الإعلان والتكاليف والضريبة</div>
            </div>
            <div className="result-value">
              {results.totalNetProfit.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">عائد الإعلانات الفعلي (ROAS)</span>
            <span className="result-value" style={{ color: results.roas >= results.breakEvenRoas ? '#10b981' : '#dc2626' }}>
              {results.roas.toFixed(2)}x
            </span>
          </div>

          <div className="result-box">
            <span className="result-label">تكلفة الاستحواذ على العميل (CPA)</span>
            <span className="result-value">{results.cpa.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي إيرادات المبيعات</span>
            <span className="result-value">{results.totalRevenue.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box" style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>
            <div>
              <div className="result-label" style={{ color: '#92400e' }}>ROAS نقطة التعادل (Break-even)</div>
              <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px' }}>أقل عائد تحتاجه لتغطية التكاليف بدون خسارة</div>
            </div>
            <span className="result-value" style={{ color: '#92400e' }}>
              {results.breakEvenRoas.toFixed(2)}x
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
