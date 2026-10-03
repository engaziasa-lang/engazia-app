'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromoCodeCalculatorSA() {
  const [originalPrice, setOriginalPrice] = useState<number>(200); // السعر الأصلي للمنتج
  const [productCost, setProductCost] = useState<number>(60); // تكلفة المنتج
  const [shippingCost, setShippingCost] = useState<number>(25); // تكلفة الشحن
  const [promoType, setPromoType] = useState<'percent' | 'fixed' | 'bogo'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(20); // قيمة الخصم (20% أو 40 ريال مثلاً)

  const [results, setResults] = useState({
    finalSellingPrice: 0,
    discountAmount: 0,
    netProfitAfterPromo: 0,
    profitMarginPercent: 0,
    isProfitable: false,
  });

  useEffect(() => {
    let finalPrice = originalPrice;
    let discountAmt = 0;

    if (promoType === 'percent') {
      discountAmt = originalPrice * (discountValue / 100);
      finalPrice = originalPrice - discountAmt;
    } else if (promoType === 'fixed') {
      discountAmt = discountValue;
      finalPrice = Math.max(0, originalPrice - discountAmt);
    } else if (promoType === 'bogo') {
      // عرض اشتري قطعة وحصل على الثانية مجاناً (يعني قطعتين بسعر قطعة واحدة)
      discountAmt = originalPrice;
      finalPrice = originalPrice / 2; // متوسط السعر للقطعة الواحدة في العرض
    }

    // ضريبة القيمة المضافة (15% مستقطعة من السعر النهائي)
    const vatAmount = finalPrice - (finalPrice / 1.15);

    // التكاليف الإجمالية (تكلفة المنتج + الشحن + الضريبة)
    // في حالة BOGO التكلفة تضرب في قطعتين
    const actualProductCost = promoType === 'bogo' ? productCost * 2 : productCost;
    const totalCost = actualProductCost + shippingCost + vatAmount;

    // صافي الربح بعد العرض
    const netProfitAfterPromo = finalPrice - totalCost;
    const profitMarginPercent = finalPrice > 0 ? (netProfitAfterPromo / finalPrice) * 100 : 0;

    setResults({
      finalSellingPrice: finalPrice,
      discountAmount: discountAmt,
      netProfitAfterPromo,
      profitMarginPercent,
      isProfitable: netProfitAfterPromo > 0,
    });
  }, [originalPrice, productCost, shippingCost, promoType, discountValue]);

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
        
        .types-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
        .type-btn { padding: 10px 6px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 12px; color: #475569; transition: all 0.2s; text-align: center; }
        .type-btn.active { background: #ecfdf5; border-color: #047857; color: #047857; box-shadow: 0 2px 4px rgba(4,120,87,0.1); }

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
          <h1>حاسبة جدوى أكواد الخصم والعروض 🎟️</h1>
          <p>تأكد من أن عروضك الترويجية (نسبة، مبلغ ثابت، أو 1+1) لا تتسبب في خسائر مخفية لمتجرك</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">معطيات المنتج والعرض</h2>
          
          <div className="input-group">
            <label>سعر بيع المنتج الأصلي</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={originalPrice || ''} onChange={(e) => setOriginalPrice(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة المنتج الأساسية من المورد</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={productCost || ''} onChange={(e) => setProductCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الشحن والتوصيل للطلب</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={shippingCost || ''} onChange={(e) => setShippingCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>نوع العرض أو الخصم</label>
          <div className="types-grid">
            <button className={`type-btn ${promoType === 'percent' ? 'active' : ''}`} onClick={() => setPromoType('percent')}>
              خصم نسبة (%)
            </button>
            <button className={`type-btn ${promoType === 'fixed' ? 'active' : ''}`} onClick={() => setPromoType('fixed')}>
              خصم مبلغ (ر.س)
            </button>
            <button className={`type-btn ${promoType === 'bogo' ? 'active' : ''}`} onClick={() => setPromoType('bogo')}>
              قطعة والثانية مجاناً
            </button>
          </div>

          {promoType !== 'bogo' && (
            <div className="input-group">
              <label>{promoType === 'percent' ? 'نسبة الخصم (%)' : 'مبلغ الخصم (ر.س)'}</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={discountValue || ''} onChange={(e) => setDiscountValue(Number(e.target.value))} />
                <span className="currency-tag">{promoType === 'percent' ? '%' : 'ر.س'}</span>
              </div>
            </div>
          )}
        </div>

        {/* قسم النتائج وتحليل الجدوى */}
        <div className="card">
          <h2 className="card-title">تحليل أثر العرض على الأرباح</h2>

          <div>
            {results.isProfitable ? (
              <div className="status-badge success">🟢 العرض آمن ومحقق للأرباح بعد الخصم</div>
            ) : (
              <div className="status-badge fail">🔴 تحذير: هذا العرض يسبب خسارة مالية!</div>
            )}
          </div>

          <div className={`result-box ${results.isProfitable ? 'primary' : 'danger'}`}>
            <div>
              <div className="result-label">صافي الربح للطلب بعد الخصم</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>بعد خصم التكلفة، الشحن والضريبة</div>
            </div>
            <div className="result-value">
              {results.netProfitAfterPromo.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">السعر النهائي بعد الخصم</span>
            <span className="result-value" style={{ color: '#047857' }}>{results.finalSellingPrice.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">قيمة التخفيض المقدم للعميل</span>
            <span className="result-value" style={{ color: '#d97706' }}>{results.discountAmount.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">هامش الربح الصافي (%)</span>
            <span className="result-value" style={{ color: results.profitMarginPercent >= 15 ? '#10b981' : '#dc2626' }}>
              {results.profitMarginPercent.toFixed(1)}%
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
