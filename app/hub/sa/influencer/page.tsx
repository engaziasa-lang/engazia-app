'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InfluencerRoiCalculatorSA() {
  const [influencerCost, setInfluencerCost] = useState<number>(5000); // تكلفة إعلان المشهور (ر.س)
  const [estimatedViews, setEstimatedViews] = useState<number>(50000); // المشاهدات المتوقعة
  const [conversionRate, setConversionRate] = useState<number>(0.5); // نسبة التحويل % (المشاهدين الذين اشتروا)
  const [productPrice, setProductPrice] = useState<number>(200); // سعر بيع المنتج
  const [netProfitPerOrder, setNetProfitPerOrder] = useState<number>(70); // صافي ربح الطلب الواحد قبل الإعلان

  const [results, setResults] = useState({
    expectedOrders: 0,
    expectedRevenue: 0,
    expectedProfit: 0,
    roi: 0,
    breakEvenViews: 0,
    isProfitable: false,
  });

  useEffect(() => {
    if (estimatedViews <= 0 || influencerCost <= 0) {
      setResults({
        expectedOrders: 0,
        expectedRevenue: 0,
        expectedProfit: 0,
        roi: 0,
        breakEvenViews: 0,
        isProfitable: false,
      });
      return;
    }

    // عدد الطلبات المتوقعة = المشاهدات * (نسبة التحويل / 100)
    const expectedOrders = Math.round(estimatedViews * (conversionRate / 100));

    // الإيرادات المتوقعة
    const expectedRevenue = expectedOrders * productPrice;

    // إجمالي الأرباح قبل الإعلان = الطلبات * ربح الطلب الواحد
    const grossProfit = expectedOrders * netProfitPerOrder;

    // صافي الربح الفعلي بعد دفع تكلفة المشهور
    const expectedProfit = grossProfit - influencerCost;

    // العائد على الاستثمار (ROI) = (الربح الإجمالي من الطلبات / تكلفة المشهور) * 100
    const roi = influencerCost > 0 ? (grossProfit / influencerCost) * 100 : 0;

    // المشاهدات المطلوبة للتعادل (Break-even views)
    // كم مشاهدة تحتاج لتغطية تكلفة المشهور بناءً على نسبة التحويل وربح الطلب؟
    const profitPerView = (conversionRate / 100) * netProfitPerOrder;
    const breakEvenViews = profitPerView > 0 ? Math.ceil(influencerCost / profitPerView) : 0;

    setResults({
      expectedOrders,
      expectedRevenue,
      expectedProfit,
      roi,
      breakEvenViews,
      isProfitable: expectedProfit > 0,
    });
  }, [influencerCost, estimatedViews, conversionRate, productPrice, netProfitPerOrder]);

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
          <h1>حاسبة جدوى إعلانات المشاهير 🤳</h1>
          <p>حلل العائد المتوقع من إعلانات المؤثرين قبل دفع تكلفة الحملة التسويقية</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">معطيات الحملة والمؤثر</h2>
          
          <div className="input-group">
            <label>تكلّفة الإعلان المطلوبة من المشهور</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={influencerCost || ''} onChange={(e) => setInfluencerCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>المشاهدات المتوقعة لإعلان المشهور (Views)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={estimatedViews || ''} onChange={(e) => setEstimatedViews(Number(e.target.value))} />
              <span className="currency-tag">مشاهدة</span>
            </div>
          </div>

          <div className="input-group">
            <label>نسبة التحويل المتوقعة (%)</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" min="0" max="100" value={conversionRate || ''} onChange={(e) => setConversionRate(Number(e.target.value))} />
              <span className="currency-tag">%</span>
            </div>
          </div>

          <div className="input-group">
            <label>سعر بيع المنتج</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={productPrice || ''} onChange={(e) => setProductPrice(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>صافي ربح الطلب الواحد (قبل إعلان المشهور)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={netProfitPerOrder || ''} onChange={(e) => setNetProfitPerOrder(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>
        </div>

        {/* قسم النتائج والتقييم */}
        <div className="card">
          <h2 className="card-title">تحليل جدوى الحملة</h2>

          <div>
            {results.isProfitable ? (
              <div className="status-badge success">🟢 الحملة مجزية ومتوقعة أن تكون رابحة!</div>
            ) : (
              <div className="status-badge fail">🔴 الحملة قد تكون خاسرة بالمعطيات الحالية!</div>
            )}
          </div>

          <div className={`result-box ${results.isProfitable ? 'primary' : 'danger'}`}>
            <div>
              <div className="result-label">صافي الربح المتوقع من الإعلان</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>بعد خصم تكلفة المشهور وتكاليف المنتجات</div>
            </div>
            <div className="result-value">
              {results.expectedProfit.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">عدد الطلبات المتوقعة</span>
            <span className="result-value" style={{ color: '#047857' }}>{results.expectedOrders} طلب</span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي الإيرادات المتوقعة</span>
            <span className="result-value">{results.expectedRevenue.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">نسبة العائد على الاستثمار (ROI)</span>
            <span className="result-value" style={{ color: results.roi >= 100 ? '#10b981' : '#dc2626' }}>
              {results.roi.toFixed(1)}%
            </span>
          </div>

          <div className="result-box" style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>
            <div>
              <div className="result-label" style={{ color: '#92400e' }}>المشاهدات المطلوبة لنقطة التعادل</div>
              <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px' }}>أقل عدد مشاهدات لتغطية قيمة الإعلان</div>
            </div>
            <span className="result-value" style={{ color: '#92400e' }}>
              {results.breakEvenViews} مشاهدة
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
