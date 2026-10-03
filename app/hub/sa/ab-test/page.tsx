'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AbTestCalculatorSA() {
  // بيانات الحملة A
  const [visitorsA, setVisitorsA] = useState<number>(5000);
  const [conversionsA, setConversionsA] = useState<number>(150);

  // بيانات الحملة B
  const [visitorsB, setVisitorsB] = useState<number>(5000);
  const [conversionsB, setConversionsB] = useState<number>(210);

  // حساب معدل التحويل لكل حملة
  const rateA = visitorsA > 0 ? (conversionsA / visitorsA) * 100 : 0;
  const rateB = visitorsB > 0 ? (conversionsB / visitorsB) * 100 : 0;

  // تحديد الإعلان الفائز والفرق النسبة
  const differencePercent = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;
  const winner = rateB > rateA ? 'الإعلان (B) هو الفائز والمتفوق! 🚀' : rateA > rateB ? 'الإعلان (A) هو الفائز والمتفوق! 🚀' : 'النتائج متطابقة تماماً';

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
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        
        .result-banner { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border-radius: 16px; padding: 25px; text-align: center; box-shadow: 0 10px 25px -5px rgba(4,120,87,0.3); }
        .result-banner h2 { margin: 0 0 10px 0; font-size: 22px; font-weight: 900; }
        .result-banner p { margin: 0; font-size: 15px; opacity: 0.95; font-weight: 600; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة اختبارات الإعلانات (A/B Test) ⚖️</h1>
          <p>قارن بين نسختين إعلانيتين واعرف الإعلان الذي يحقق أفضل معدل تحويل وعوائد</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* إدخال بيانات الإعلان A */}
        <div className="card" style={{ borderColor: rateA >= rateB ? '#047857' : '#e2e8f0' }}>
          <h2 className="card-title">الإعلان الأول (نسخة A)</h2>
          
          <div className="input-group">
            <label>عدد الزوار أو المشاهدات (Visitors)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={visitorsA || ''} onChange={(e) => setVisitorsA(Number(e.target.value))} />
            </div>
          </div>

          <div className="input-group">
            <label>عدد الطلبات أو التحويلات (Conversions)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={conversionsA || ''} onChange={(e) => setConversionsA(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, display: 'block' }}>معدل التحويل (Conversion Rate):</span>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{rateA.toFixed(2)}%</span>
          </div>
        </div>

        {/* إدخال بيانات الإعلان B */}
        <div className="card" style={{ borderColor: rateB > rateA ? '#047857' : '#e2e8f0' }}>
          <h2 className="card-title">الإعلان الثاني (نسخة B)</h2>
          
          <div className="input-group">
            <label>عدد الزوار أو المشاهدات (Visitors)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={visitorsB || ''} onChange={(e) => setVisitorsB(Number(e.target.value))} />
            </div>
          </div>

          <div className="input-group">
            <label>عدد الطلبات أو التحويلات (Conversions)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={conversionsB || ''} onChange={(e) => setConversionsB(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, display: 'block' }}>معدل التحويل (Conversion Rate):</span>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{rateB.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="result-banner">
        <h2>{winner}</h2>
        <p>نسبة التفوق وتحسن الأداء: <span style={{ background: '#f59e0b', padding: '2px 8px', borderRadius: '6px', fontWeight: 900 }}>{Math.abs(differencePercent).toFixed(1)}%</span></p>
      </div>
    </div>
  );
}
