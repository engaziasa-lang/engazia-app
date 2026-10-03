'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InventoryPlannerSA() {
  const [currentStock, setCurrentStock] = useState<number>(500); // المخزون الحالي المتوفر
  const [dailySalesNormal, setDailySalesNormal] = useState<number>(15); // متوسط المبيعات اليومية في الأيام العادية
  const [seasonMultiplier, setSeasonMultiplier] = useState<number>(3.0); // مضاعف الطلب في الموسم (مثلاً 3 أضعاف المعتاد)
  const [seasonDays, setSeasonDays] = useState<number>(10); // عدد أيام الموسم (مثل ذروة العشر الأواخر أو اليوم الوطني)
  const [supplierLeadTimeDays, setSupplierLeadTimeDays] = useState<number>(14); // مدة توريد الشحنة الجديدة من المورد (بالأيام)

  const [results, setResults] = useState({
    projectedSeasonDemand: 0,
    requiredStockToOrder: 0,
    daysUntilStockout: 0,
    isAtRisk: false,
  });

  useEffect(() => {
    // 1. الطلب المتوقع خلال أيام الموسم (مبيعات الموسم المتوقعة)
    const projectedSeasonDemand = Math.round(dailySalesNormal * seasonMultiplier * seasonDays);

    // 2. المبيعات المتوقعة خلال فترة وصول الشحنة من المورد (Lead Time)
    const demandDuringLeadTime = dailySalesNormal * supplierLeadTimeDays;

    // 3. الكمية المطلوبة للطلب من المورد لتغطية الموسم مع أمان المخزون
    // (الطلب المتوقع للموسم + الاستهلاك أثناء الانتظار) - المخزون الحالي
    const totalNeeded = projectedSeasonDemand + demandDuringLeadTime;
    const requiredStockToOrder = Math.max(0, totalNeeded - currentStock);

    // 4. متى سينفذ المخزون الحالي بالأسعار العادية؟
    const daysUntilStockout = dailySalesNormal > 0 ? Math.floor(currentStock / dailySalesNormal) : 0;

    // هل المخزون الحالي في خطر النفاذ قبل انتهاء الموسم؟
    const isAtRisk = currentStock < (demandDuringLeadTime + (dailySalesNormal * seasonDays));

    setResults({
      projectedSeasonDemand,
      requiredStockToOrder,
      daysUntilStockout,
      isAtRisk,
    });
  }, [currentStock, dailySalesNormal, seasonMultiplier, seasonDays, supplierLeadTimeDays]);

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
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        
        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value, .danger .result-value { font-size: 24px; color: #ffffff; }
        
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 13px; margin-bottom: 15px; }
        .status-badge.success { background: #dcfce7; color: #166534; }
        .status-badge.fail { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مخطط المخزون للمواسم السعودية 📅</h1>
          <p>توقع كميات البضاعة المطلوبة لمواسم (رمضان، اليوم الوطني، العيد) بدقة وتجنب نفاذ المخزون</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">معطيات المخزون والموسم</h2>
          
          <div className="input-group">
            <label>المخزون الحالي المتوفر (قطعة)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={currentStock || ''} onChange={(e) => setCurrentStock(Number(e.target.value))} />
            </div>
          </div>

          <div className="input-group">
            <label>متوسط المبيعات اليومية في الأيام العادية</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={dailySalesNormal || ''} onChange={(e) => setDailySalesNormal(Number(e.target.value))} />
            </div>
          </div>

          <div className="input-group">
            <label>مضاعف ارتفاع الطلب في الموسم (Multiplier)</label>
            <div className="input-wrapper">
              <input type="number" step="0.5" min="1" value={seasonMultiplier || ''} onChange={(e) => setSeasonMultiplier(Number(e.target.value))} />
            </div>
          </div>

          <div className="input-group">
            <label>عدد أيام ذروة الموسم</label>
            <div className="input-wrapper">
              <input type="number" min="1" value={seasonDays || ''} onChange={(e) => setSeasonDays(Number(e.target.value))} />
            </div>
          </div>

          <div className="input-group">
            <label>مدة توريد الشحنة الجديدة من المورد (بالأيام)</label>
            <div className="input-wrapper">
              <input type="number" min="0" value={supplierLeadTimeDays || ''} onChange={(e) => setSupplierLeadTimeDays(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* قسم النتائج والتوصيات */}
        <div className="card">
          <h2 className="card-title">تحليل خطة المخزون</h2>

          <div>
            {!results.isAtRisk ? (
              <div className="status-badge success">🟢 المخزون مطمئن ويفي بمتطلبات الموسم</div>
            ) : (
              <div className="status-badge fail">🔴 تحذير: خطر نفاذ البضاعة أثناء الموسم!</div>
            )}
          </div>

          <div className="result-box primary">
            <div>
              <div className="result-label">الكمية المطلوبة للطلب من المورد فوراً</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>لتغطية طلبات الموسم بدون انقطاع</div>
            </div>
            <div className="result-value">
              {results.requiredStockToOrder} قطعة
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">المبيعات المتوقعة خلال أيام الموسم</span>
            <span className="result-value" style={{ color: '#047857' }}>{results.projectedSeasonDemand} قطعة</span>
          </div>

          <div className="result-box">
            <span className="result-label">عدد الأيام حتى نفاذ المخزون الحالي (بالمعدل العادي)</span>
            <span className="result-value">{results.daysUntilStockout} يوم</span>
          </div>

        </div>
      </div>
    </div>
  );
}
