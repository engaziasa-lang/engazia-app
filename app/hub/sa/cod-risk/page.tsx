'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CodRiskAnalyzerSA() {
  const [orderValue, setOrderValue] = useState<number>(250); // قيمة الطلب
  const [productCost, setProductCost] = useState<number>(70); // تكلفة المنتج
  const [shippingCost, setShippingCost] = useState<number>(25); // شحن الذهاب
  const [returnShippingCost, setReturnShippingCost] = useState<number>(25); // شحن العودة في حال الرفض
  const [codExtraFee, setCodExtraFee] = useState<number>(10); // رسوم خدمة الدفع عند الاستلام الإضافية لشركات الشحن
  const [refusalRate, setRefusalRate] = useState<number>(15); // نسبة رفض الاستلام %

  const [results, setResults] = useState({
    successfulOrderProfit: 0,
    refusedOrderLoss: 0,
    expectedValuePerOrder: 0,
    totalMonthlyRiskLoss: 0,
  });

  useEffect(() => {
    // 1. ربح الطلب الناجح (المستلم) مع الدفع عند الاستلام
    // السعر - التكلفة - شحن الذهاب - رسوم خدمة الدفع عند الاستلام
    const successfulOrderProfit = orderValue - productCost - shippingCost - codExtraFee;

    // 2. خسارة الطلب المرفوض (الذي لم يستلمه العميل)
    // تشمل: تكلفة شحن الذهاب + تكلفة شحن العودة (عكسي) + أي خسائر تغليف/تالف (نحتسبها افتراضياً 5 ريال)
    const refusalHandlingLoss = shippingCost + returnShippingCost + 5;
    const refusedOrderLoss = refusalHandlingLoss;

    // 3. القيمة المتوقعة للطلب الواحد بناءً على نسبة الرفض (Expected Value)
    // (ربح الطلب الناجح * نسبة النجاح) - (خسارة الطلب المرفوض * نسبة الرفض)
    const successRate = 1 - (refusalRate / 100);
    const refuseDecimal = refusalRate / 100;
    const expectedValuePerOrder = (successfulOrderProfit * successRate) - (refusedOrderLoss * refuseDecimal);

    // 4. الخسارة الشهرية المتوقعة من الطلبات المرفوضة (بافتراض 300 طلب شهرياً مثلاً)
    const totalMonthlyRiskLoss = refusedOrderLoss * (300 * refuseDecimal);

    setResults({
      successfulOrderProfit,
      refusedOrderLoss,
      expectedValuePerOrder,
      totalMonthlyRiskLoss,
    });
  }, [orderValue, productCost, shippingCost, returnShippingCost, codExtraFee, refusalRate]);

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
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label, .primary .result-label { color: #ffffff; opacity: 0.9; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .danger .result-value, .primary .result-value { font-size: 24px; color: #ffffff; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>محلل تكاليف ومخاطر الدفع عند الاستلام (COD) 🚚</h1>
          <p>احسب تأثير نسبة رفض الطلبات وتكاليف الشحن العكسي على أرباح متجرك</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">معطيات الشحن والطلبات</h2>
          
          <div className="input-group">
            <label>قيمة الطلب الإجمالية</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={orderValue || ''} onChange={(e) => setOrderValue(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة المنتج الأساسية</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={productCost || ''} onChange={(e) => setProductCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
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
            <label>تكلفة الشحن العكسي (عند رفض الاستلام)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={returnShippingCost || ''} onChange={(e) => setReturnShippingCost(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>رسوم خدمة الدفع عند الاستلام الإضافية (من شركة الشحن)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={codExtraFee || ''} onChange={(e) => setCodExtraFee(Number(e.target.value))} />
              <span className="currency-tag">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>نسبة رفض الاستلام المتوقعة (%)</label>
            <div className="input-wrapper">
              <input type="number" min="0" max="100" value={refusalRate || ''} onChange={(e) => setRefusalRate(Number(e.target.value))} />
              <span className="currency-tag">%</span>
            </div>
          </div>
        </div>

        {/* قسم النتائج والمخاطر */}
        <div className="card">
          <h2 className="card-title">تحليل مخاطر وتكاليف COD</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">ربح الطلب في حال الاستلام الناجح</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>بعد خصم التكلفة والشحن ورسوم الخدمة</div>
            </div>
            <div className="result-value">
              {results.successfulOrderProfit.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box danger">
            <div>
              <div className="result-label">خسارة الطلب في حال رفض العميل الاستلام</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>شحن ذهاب وعودة وتالف</div>
            </div>
            <div className="result-value">
              -{results.refusedOrderLoss.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">القيمة المتوقعة الحقيقية لكل طلب (مع حساب الرفض)</span>
            <span className="result-value" style={{ color: results.expectedValuePerOrder >= 0 ? '#10b981' : '#dc2626' }}>
              {results.expectedValuePerOrder.toFixed(2)} ر.س
            </span>
          </div>

          <div className="result-box" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
            <div>
              <div className="result-label" style={{ color: '#991b1b' }}>إجمالي الخسارة الشهرية المقدرة (بافتراض 300 طلب)</div>
              <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '2px' }}>بسبب الطلبات المرفوضة وعدم الاستلام</div>
            </div>
            <span className="result-value" style={{ color: '#991b1b' }}>
              {results.totalMonthlyRiskLoss.toFixed(2)} ر.س
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
