'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ReturnsAnalyzer() {
  const [monthlyOrders, setMonthlyOrders] = useState<number>(500);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(200);
  const [returnRate, setReturnRate] = useState<number>(15);
  const [shippingLossPerReturn, setShippingLossPerReturn] = useState<number>(30); // تكلفة شحن ذهاب وعودة ضائعة
  const [productDamageLoss, setProductDamageLoss] = useState<number>(20); // خسارة تلف أو إعادة تغليف

  // الحسابات
  const totalReturns = Math.round(monthlyOrders * (returnRate / 100));
  const totalMonthlySalesLoss = totalReturns * averageOrderValue;
  const totalShippingLoss = totalReturns * shippingLossPerReturn;
  const totalOperationLoss = totalReturns * productDamageLoss;
  const totalMonthlyFinancialImpact = totalShippingLoss + totalOperationLoss;

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
        .input-wrapper input:focus { border-color: #4f46e5; background: #ffffff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        .input-wrapper .unit { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-weight: 700; font-size: 14px; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.danger { background: #7f1d1d; border-color: #991b1b; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        
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
        <h1>حاسبة وتحليل <span>خسائر المرتجعات</span></h1>
        <p>اكتشف الحجم الحقيقي للأموال التي تبتلعها طلبات الاسترجاع والاستبدال وكيف تؤثر على صافي أرباحك.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>📦 معطيات المتجر الشهرية</h2>
          
          <div className="input-group">
            <label>إجمالي الطلبات الشهرية</label>
            <div className="input-wrapper">
              <input type="number" value={monthlyOrders || ''} onChange={(e) => setMonthlyOrders(Number(e.target.value))} />
              <span className="unit">طلب</span>
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
            <label>نسبة المرتجعات المئوية (%)</label>
            <div className="input-wrapper">
              <input type="number" value={returnRate || ''} onChange={(e) => setReturnRate(Number(e.target.value))} />
              <span className="unit">%</span>
            </div>
          </div>

          <div className="input-group">
            <label>تكلفة الشحن الضائعة (ذهاب وعودة لكل طلب)</label>
            <div className="input-wrapper">
              <input type="number" value={shippingLossPerReturn || ''} onChange={(e) => setShippingLossPerReturn(Number(e.target.value))} />
              <span className="unit">ر.س</span>
            </div>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>🚨 تقرير الأثر المالي للمرتجعات</h2>

          <div className="result-box">
            <span className="result-label">عدد الطلبات المسترجعة شهرياً</span>
            <span className="result-value" dir="ltr">{totalReturns} <span>طلب</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي قيمة البضاعة المسترجعة</span>
            <span className="result-value" dir="ltr">{totalMonthlySalesLoss.toLocaleString()} <span>ر.س</span></span>
          </div>

          <div className="result-box danger">
            <span className="result-label">إجمالي الهدر في مصاريف الشحن</span>
            <span className="result-value" dir="ltr">{totalMonthlyFinancialImpact.toLocaleString()} <span>ر.س</span></span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginTop: '20px' }}>
            💡 <strong>تنبيه للتاجر:</strong> هذه الخسائر تشمل تكاليف الشحن المعاكس وضياع فرصة البيع، ويُنصح دائماً بربط حسابات المتجر بـ (الدفع الإلكتروني المسبق) لتقليل نسبة المرتجعات مقارنة بالدفع عند الاستلام.
          </p>
        </div>
      </div>
    </div>
  );
}
