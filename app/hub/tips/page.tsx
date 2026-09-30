'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StoreAnalyticsHub() {
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(10000);
  const [conversionRate, setConversionRate] = useState<number>(2.0); // نسبة التحويل %
  const [averageOrderValue, setAverageOrderValue] = useState<number>(250);
  const [netProfitMargin, setNetProfitMargin] = useState<number>(30); // هامش الربح الصافي %

  // الحسابات
  const totalOrders = Math.round(monthlyVisitors * (conversionRate / 100));
  const totalRevenue = totalOrders * averageOrderValue;
  const netProfit = totalRevenue * (netProfitMargin / 100);

  return (
    <div className="tool-container">
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 70px; }
        
        .header { max-width: 1000px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 40px; }
        .tool-title h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 16px; }

        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .input-wrapper { position: relative; }
        .input-wrapper input { width: 100%; padding: 14px 15px 14px 45px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 16px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus { border-color: #4f46e5; background: #ffffff; }
        .input-wrapper .unit { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-weight: 700; font-size: 14px; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .highlight .result-label { color: #ffffff; }
        
        .result-value { font-size: 22px; font-weight: 900; color: #ffffff; }
        .result-value span { font-size: 14px; font-weight: 500; opacity: 0.7; margin-right: 5px; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>محلل مقاييس وأداء <span>المتجر الشامل</span></h1>
        <p>توقع مبيعاتك وأرباحك الشهرية بدقة بناءً على زوار متجرك، معدل التحويل، وهامش الربح.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>📈 مؤشرات أداء المتجر الشهرية</h2>
          
          <div className="input-group">
            <label>إجمالي الزيارات الشهرية للمتجر</label>
            <div className="input-wrapper">
              <input type="number" value={monthlyVisitors || ''} onChange={(e) => setMonthlyVisitors(Number(e.target.value))} />
              <span className="unit">زائر</span>
            </div>
          </div>

          <div className="input-group">
            <label>معدل التحويل (Conversion Rate)</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" value={conversionRate || ''} onChange={(e) => setConversionRate(Number(e.target.value))} />
              <span className="unit">%</span>
            </div>
          </div>

          <div className="input-group">
            <label>متوسط قيمة الطلب الواحد</label>
            <div className="input-wrapper">
              <input type="number" value={averageOrderValue || ''} onChange={(e) => setAverageOrderValue(Number(e.target.value))} />
              <span className="unit">ر.س</span>
            </div>
          </div>

          <div className="input-group">
            <label>هامش الربح الصافي التقريبي</label>
            <div className="input-wrapper">
              <input type="number" value={netProfitMargin || ''} onChange={(e) => setNetProfitMargin(Number(e.target.value))} />
              <span className="unit">%</span>
            </div>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>🎯 لوحة التوقعات والنتائج المالية</h2>

          <div className="result-box">
            <span className="result-label">الطلبات المتوقعة شهرياً</span>
            <span className="result-value" dir="ltr">{totalOrders.toLocaleString()} <span>طلب</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي الإيرادات المتوقعة</span>
            <span className="result-value" dir="ltr">{totalRevenue.toLocaleString()} <span>ر.س</span></span>
          </div>

          <div className="result-box highlight">
            <span className="result-label">صافي الأرباح المتوقعة</span>
            <span className="result-value" dir="ltr">{netProfit.toLocaleString()} <span>ر.س</span></span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginTop: '15px' }}>
            💡 <strong>تحليل ذكي:</strong> بتحسين معدل التحويل أو زيادة الزيارات، ستتضاعف أرباحك الصافية بشكل طردي. استغل بقية أدوات المنصة لرفع كفاءة متجرك!
          </p>
        </div>
      </div>
    </div>
  );
}
