'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function ProfitToolPage() {
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [ads, setAds] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const net = (parseFloat(price) || 0) - ((parseFloat(cost) || 0) + (parseFloat(ads) || 0));
    setResult(net);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #cbd5e1' }}>
        <Link href="/hub" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>← العودة للوحة الرئيسية</Link>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '20px 0 10px' }}>📊 حاسبة أرباح المتاجر الإلكترونية</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>احسب صافي أرباح منتجك ونقطة التعادل بدقة عالية.</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>تكلفة شراء المنتج (ر.س)</label>
          <input type="number" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} placeholder="50" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>سعر البيع (ر.س)</label>
          <input type="number" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} placeholder="150" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>تكلفة الإعلان لكل قطعة (ر.س)</label>
          <input type="number" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} placeholder="30" value={ads} onChange={(e) => setAds(e.target.value)} />
        </div>

        <button onClick={calculate} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>احسب صافي الربح</button>

        {result !== null && (
          <div style={{ marginTop: '20px', background: '#f0fdf4', padding: '15px', borderRadius: '8px', color: '#16a34a', fontSize: '18px', fontWeight: '800' }}>
            صافي الربح التقديري: {result} ريال سعودي
          </div>
        )}
      </div>
    </div>
  );
}
