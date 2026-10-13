'use client';

import { useState } from 'react';

export default function SallaCalculatorPage() {
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [gatewayFeePercent, setGatewayFeePercent] = useState<number | string>('2.2');
  const [fixedFee, setFixedFee] = useState<number | string>('1');

  const numCost = Number(costPrice) || 0;
  const numSelling = Number(sellingPrice) || 0;
  const numGatewayPercent = Number(gatewayFeePercent) || 0;
  const numFixed = Number(fixedFee) || 0;

  const gatewayTotalFee = (numSelling * (numGatewayPercent / 100)) + numFixed;
  const netProfit = numSelling - numCost - gatewayTotalFee;
  const profitMargin = numSelling > 0 ? (netProfit / numSelling) * 100 : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Tajawal, sans-serif' }} dir="rtl">
      <div style={{ maxWidth: '600px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '32px', border: '1px solid #e5e7eb' }}>
        
        {/* هيدر التطبيق */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>حاسبة رسوم وأرباح سلة</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            احسب صافي ربحك بدقة بالهللة واكتشف تأثير بوابات الدفع على تسعير منتجاتك.
          </p>
        </div>

        {/* حقول الإدخال */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>سعر تكلفة المنتج (ريال)</label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 50"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>سعر بيع المنتج للعميل (ريال)</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 120"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>نسبة بوابة الدفع (%)</label>
              <input
                type="number"
                value={gatewayFeePercent}
                onChange={(e) => setGatewayFeePercent(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>رسوم ثابتة لكل طلب (ريال)</label>
              <input
                type="number"
                value={fixedFee}
                onChange={(e) => setFixedFee(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* صندوق النتائج */}
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#4b5563' }}>إجمالي رسوم بوابة الدفع:</span>
            <span style={{ fontWeight: '600', color: '#dc2626' }}>{gatewayTotalFee.toFixed(2)} ر.س</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#4b5563' }}>صافي الربح الفعلي:</span>
            <span style={{ fontWeight: 'bold', color: netProfit >= 0 ? '#059669' : '#dc2626' }}>
              {netProfit.toFixed(2)} ر.س
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
            <span style={{ color: '#4b5563' }}>هامش الربح:</span>
            <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{profitMargin.toFixed(1)}%</span>
          </div>
        </div>

        {/* مصيدة الاشتراكات */}
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
          <h3 style={{ fontWeight: 'bold', color: '#065f46', fontSize: '14px', margin: '0 0 6px 0' }}>هل لديك مئات المنتجات وتخشى تكرار الحسابات؟</h3>
          <p style={{ fontSize: '12px', color: '#047857', margin: '0 0 14px 0', lineHeight: '1.5' }}>
            أنشئ حسابك الشامل على منصة إنجازيا لربط متجرك، جرد المخزون، وأتمتة تسعير كافة منتجاتك بضغطة زر واحدة.
          </p>
          <a
            href="https://engazia.sa/pricing" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', width: '100%', backgroundColor: '#059669', color: '#ffffff', fontWeight: '500', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', boxSizing: 'border-box' }}
          >
            انتقل إلى إنجازيا وفعّل الباقة الكاملة (12.99$) 🚀
          </a>
        </div>

      </div>
    </div>
  );
}
