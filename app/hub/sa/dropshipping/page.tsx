'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DropshippingCalculatorSA() {
  const [sellingPrice, setSellingPrice] = useState<number>(199); // سعر البيع للعميل (ر.س)
  const [productCostUSD, setProductCostUSD] = useState<number>(12); // تكلفة المنتج بالدولار من المورد
  const [exchangeRate, setExchangeRate] = useState<number>(3.75); // سعر صرف الدولار مقابل الريال
  const [shippingCostUSD, setShippingCostUSD] = useState<number>(4); // تكلفة الشحن الدولي بالدولار
  const [adSpendPerOrder, setAdSpendPerOrder] = useState<number>(45); // تكلفة الإعلان المستهدفة لكل طلب (CPA)
  const [localShippingCost, setLocalShippingCost] = useState<number>(20); // تكلفة التوصيل المحلي الأخير (Last-mile)

  const [results, setResults] = useState({
    totalCostSAR: 0,
    vatAmount: 0,
    netProfitPerOrder: 0,
    profitMarginPercent: 0,
    isProfitable: false,
  });

  useEffect(() => {
    // تحويل تكلفة المنتج والشحن الدولي إلى الريال السعودي
    const productCostSAR = productCostUSD * exchangeRate;
    const shippingCostSAR = shippingCostUSD * exchangeRate;

    // ضريبة القيمة المضافة (15% مستقطعة من سعر البيع)
    const vatAmount = sellingPrice - (sellingPrice / 1.15);

    // إجمالي التكاليف الشاملة (تكلفة المنتج + شحن دولي + شحن محلي + إعلان + ضريبة)
    const totalCostSAR = productCostSAR + shippingCostSAR + localShippingCost + adSpendPerOrder + vatAmount;

    // صافي الربح للطلب الواحد
    const netProfitPerOrder = sellingPrice - totalCostSAR;

    // نسبة هامش الربح الصافي
    const profitMarginPercent = sellingPrice > 0 ? (netProfitPerOrder / sellingPrice) * 100 : 0;

    setResults({
      totalCostSAR,
      vatAmount,
      netProfitPerOrder,
      profitMarginPercent,
      isProfitable: netProfitPerOrder > 0,
    });
  }, [sellingPrice, productCostUSD, exchangeRate, shippingCostUSD, adSpendPerOrder, localShippingCost]);

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
          <h1>حاسبة أرباح الدروبشيبينغ 🌍</h1>
          <p>احسب هوامش الربح بدقة للمنتجات المستوردة مع أخذ الشحن الدولي والضرائب والإعلانات في الحسبان</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">معطيات تكاليف الدروبشيبينغ</h2>
          
          <div className="input-group">
            <label>سعر بيع المنتج للعميل في المتجر</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={sellingPrice || ''} onChange={(e) => setSellingPrice(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة المنتج من المورد (بالدولار)</label>
            <div className="input-wrapper">
              <input type="number" step="0.5" min="0" value={productCostUSD || ''} onChange={(e) => setProductCostUSD(Number(e.target.value))} />
              <span className="currency-tag">$</span>
            </div>
          </div>

          <div className="input-group">
            <label>سعر صرف الدولار</label>
            <div className="input-wrapper">
              <input type="number" step="0.01" value={exchangeRate} onChange={(e) => setExchangeRate(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الشحن الدولي (بالدولار)</label>
            <div className="input-wrapper">
              <input type="number" step="0.5" min="0" value={shippingCostUSD || ''} onChange={(e) => setShippingCostUSD(Number(e.target.value))} />
              <span className="currency-tag">$</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة التوصيل المحلي الأخير (Last-mile)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={localShippingCost || ''} onChange={(e) => setLocalShippingCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الإعلان المستهدفة للطلب الواحد (CPA)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={adSpendPerOrder || ''} onChange={(e) => setAdSpendPerOrder(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>
        </div>

        {/* قسم النتائج والتحليل */}
        <div className="card">
          <h2 className="card-title">تحليل الربحية والشحن الدولي</h2>

          <div>
            {results.isProfitable ? (
              <div className="status-badge success">🟢 المنتج مربح وهامشه آمن!</div>
            ) : (
              <div className="status-badge fail">🔴 المنتج خاسر ولا يغطي التكاليف والشحن!</div>
            )}
          </div>

          <div className={`result-box ${results.isProfitable ? 'primary' : 'danger'}`}>
            <div>
              <div className="result-label">صافي الربح الفعلي للطلب الواحد</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>بعد خصم المورد، الشحن الدولي والمحلي، الإعلان والضريبة</div>
            </div>
            <div className="result-value">
              {results.netProfitPerOrder.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">هامش الربح الصافي (%)</span>
            <span className="result-value" style={{ color: results.profitMarginPercent >= 20 ? '#10b981' : '#d97706' }}>
              {results.profitMarginPercent.toFixed(1)}%
            </span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي التكاليف الشاملة</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{results.totalCostSAR.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">ضريبة القيمة المضافة المستقطعة (15%)</span>
            <span className="result-value">{results.vatAmount.toFixed(2)} ر.س</span>
          </div>

        </div>
      </div>
    </div>
  );
}
