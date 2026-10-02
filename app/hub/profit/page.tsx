'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavedProduct {
  id: string;
  name: string;
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  adSpend: number;
  paymentFeePercent: number;
  paymentFeeFixed: number;
  taxPercent: number;
  isTaxInclusive: boolean;
  returnRate: number;
  
  netProfit: number;
  profitMargin: number;
  maxCPA: number;
  breakEvenROAS: number;
  roi: number;
}

export default function ProfitCalculator() {
  // مدخلات المنتج الأساسية
  const [productName, setProductName] = useState<string>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [adSpend, setAdSpend] = useState<number | ''>('');
  
  // مدخلات النسب والرسوم المتغيرة
  const [paymentFeePercent, setPaymentFeePercent] = useState<number>(2.5);
  const [paymentFeeFixed, setPaymentFeeFixed] = useState<number>(1);
  const [taxPercent, setTaxPercent] = useState<number>(15);
  const [isTaxInclusive, setIsTaxInclusive] = useState<boolean>(true); // السعر شامل الضريبة
  const [returnRate, setReturnRate] = useState<number>(10);

  // النتائج اللحظية
  const [results, setResults] = useState({
    paymentFees: 0,
    taxAmount: 0,
    returnsCost: 0,
    totalCostWithoutAds: 0,
    maxCPA: 0, 
    breakEvenROAS: 0, // العائد الإعلاني المطلوب للتعادل
    netProfit: 0,
    profitMargin: 0,
    roi: 0,
  });

  // المنتجات المحفوظة
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);

  // استرجاع المنتجات المحفوظة عند التحميل
  useEffect(() => {
    const saved = localStorage.getItem('engazia_profit_products_v2');
    if (saved) {
      try { setSavedProducts(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  // حساب النتائج تلقائياً عند تغيير أي رقم
  useEffect(() => {
    calculateProfit();
  }, [productCost, sellingPrice, shippingCost, adSpend, paymentFeePercent, paymentFeeFixed, taxPercent, isTaxInclusive, returnRate]);

  const calculateProfit = () => {
    const sPrice = Number(sellingPrice) || 0;
    const pCost = Number(productCost) || 0;
    const sCost = Number(shippingCost) || 0;
    const aSpend = Number(adSpend) || 0;

    if (sPrice <= 0) {
      setResults({ paymentFees: 0, taxAmount: 0, returnsCost: 0, totalCostWithoutAds: 0, maxCPA: 0, breakEvenROAS: 0, netProfit: 0, profitMargin: 0, roi: 0 });
      return;
    }

    // 1. حساب رسوم الدفع (النسبة + الرسوم الثابتة)
    const paymentFees = (sPrice * (paymentFeePercent / 100)) + paymentFeeFixed;
    
    // 2. حساب الضريبة (تعتمد على هل السعر شامل أم غير شامل)
    const taxValue = taxPercent / 100;
    const taxAmount = isTaxInclusive 
      ? sPrice - (sPrice / (1 + taxValue)) // استخراج الضريبة من السعر الشامل
      : sPrice * taxValue; // حساب الضريبة كإضافة على السعر
    
    // 3. حساب تكلفة المرتجعات التقديرية (من تكلفة المنتج والشحن فقط)
    const returnsCost = (pCost + sCost) * (returnRate / 100);

    // 4. إجمالي التكاليف الأساسية (بدون إعلانات)
    const totalCostWithoutAds = pCost + sCost + paymentFees + taxAmount + returnsCost;

    // 5. أقصى تكلفة استحواذ للعميل (Max CPA)
    const maxCPA = sPrice - totalCostWithoutAds;

    // 6. العائد الإعلاني المطلوب (Break-even ROAS)
    const breakEvenROAS = maxCPA > 0 ? (sPrice / maxCPA) : 0;

    // 7. الربح الصافي الفعلي للمبيعة الواحدة
    const netProfit = maxCPA - aSpend;

    // 8. هامش الربح
    const profitMargin = (netProfit / sPrice) * 100;

    // 9. العائد على الاستثمار (ROI)
    const totalInvestment = pCost + sCost + aSpend;
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    setResults({
      paymentFees,
      taxAmount,
      returnsCost,
      totalCostWithoutAds,
      maxCPA,
      breakEvenROAS,
      netProfit,
      profitMargin,
      roi
    });
  };

  const saveProduct = () => {
    if (!productName.trim() || !sellingPrice) {
      alert('الرجاء إدخال اسم المنتج وسعر البيع على الأقل للحفظ.');
      return;
    }

    const newProduct: SavedProduct = {
      id: Date.now().toString(),
      name: productName,
      sellingPrice: Number(sellingPrice),
      productCost: Number(productCost) || 0,
      shippingCost: Number(shippingCost) || 0,
      adSpend: Number(adSpend) || 0,
      paymentFeePercent,
      paymentFeeFixed,
      taxPercent,
      isTaxInclusive,
      returnRate,
      netProfit: results.netProfit,
      profitMargin: results.profitMargin,
      maxCPA: results.maxCPA,
      breakEvenROAS: results.breakEvenROAS,
      roi: results.roi
    };

    const updatedList = [newProduct, ...savedProducts];
    setSavedProducts(updatedList);
    localStorage.setItem('engazia_profit_products_v2', JSON.stringify(updatedList));
    
    setProductName('');
  };

  const loadProduct = (prod: SavedProduct) => {
    setProductName(prod.name);
    setSellingPrice(prod.sellingPrice);
    setProductCost(prod.productCost);
    setShippingCost(prod.shippingCost);
    setAdSpend(prod.adSpend);
    setPaymentFeePercent(prod.paymentFeePercent);
    setPaymentFeeFixed(prod.paymentFeeFixed);
    setTaxPercent(prod.taxPercent);
    setIsTaxInclusive(prod.isTaxInclusive);
    setReturnRate(prod.returnRate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج من المحفظة؟')) {
      const updatedList = savedProducts.filter(p => p.id !== id);
      setSavedProducts(updatedList);
      localStorage.setItem('engazia_profit_products_v2', JSON.stringify(updatedList));
    }
  };

  const exportToCSV = () => {
    if (savedProducts.length === 0) return alert('المحفظة فارغة.');
    const headers = ['اسم المنتج', 'سعر البيع', 'التكلفة', 'الشحن', 'التسويق المخصص', 'Max CPA', 'Break-even ROAS', 'الربح الصافي', 'هامش الربح %'];
    const rows = savedProducts.map(p => [
      p.name,
      p.sellingPrice,
      p.productCost,
      p.shippingCost,
      p.adSpend,
      p.maxCPA.toFixed(2),
      p.breakEvenROAS.toFixed(2),
      p.netProfit.toFixed(2),
      p.profitMargin.toFixed(2)
    ]);
    
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profit_portfolio_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f1f5f9; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 70px; }
        
        .header { max-width: 1200px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 10px; font-weight: 800; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #e2e8f0; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 40px; }
        .tool-title h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; letter-spacing: -0.5px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 15px; font-weight: 500; }

        .main-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 25px; max-width: 1200px; margin: 0 auto 40px; }
        
        .panel { background: #ffffff; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
        .panel h2 { font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; }

        .input-group { margin-bottom: 18px; }
        .input-group label { display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; color: #475569; margin-bottom: 8px; }
        .input-wrapper { position: relative; }
        .input-wrapper input { width: 100%; padding: 12px 15px 12px 45px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 15px; font-family: 'Tajawal', sans-serif; transition: border-color 0.2s; background: #fff; font-weight: 800; color: #1e293b; outline: none; box-sizing: border-box; }
        .input-wrapper input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }
        .input-wrapper .currency { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-weight: 800; font-size: 13px; direction: ltr; }

        .grid-2-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .grid-3-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }

        /* Results Panel Styling */
        .results-panel { background: #1e293b; border: none; color: #ffffff; position: relative; overflow: hidden; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #334155; padding: 20px; border-radius: 16px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #475569; transition: 0.3s; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        .result-box.warning { background: #7f1d1d; border-color: #991b1b; }
        .result-box.success { background: #14532d; border-color: #166534; }
        
        .result-label { font-size: 14px; font-weight: 800; color: #cbd5e1; display: flex; flex-direction: column; }
        .result-label small { font-size: 11px; color: #94a3b8; font-weight: 500; margin-top: 4px; }
        .highlight .result-label, .warning .result-label, .success .result-label { color: #ffffff; opacity: 0.9; }
        .highlight .result-label small { color: #e0e7ff; }
        
        .result-value { font-size: 24px; font-weight: 900; color: #ffffff; display: flex; align-items: baseline; gap: 4px; direction: ltr; }
        .result-value span { font-size: 13px; font-weight: 700; opacity: 0.8; }

        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .detail-item { background: #0f172a; padding: 12px; border-radius: 10px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 5px; }
        .detail-label { font-size: 11px; color: #94a3b8; font-weight: 700; }
        .detail-val { font-size: 15px; font-weight: 900; color: #f8fafc; direction: ltr; text-align: right; }

        .btn-save { background: #10b981; color: #fff; border: none; padding: 14px; width: 100%; border-radius: 12px; font-size: 15px; font-weight: 900; cursor: pointer; transition: 0.2s; margin-top: 10px; font-family: 'Tajawal', sans-serif; }
        .btn-save:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); }

        /* Saved Products Grid */
        .saved-section-title { font-size: 20px; font-weight: 900; color: #1e293b; margin-bottom: 20px; max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
        .btn-export { background: #fff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 800; color: #475569; cursor: pointer; transition: 0.2s; }
        .btn-export:hover { background: #f8fafc; border-color: #94a3b8; color: #0f172a; }
        
        .saved-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
        
        .product-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; position: relative; transition: 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .product-card:hover { border-color: #cbd5e1; transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .product-card.status-good { border-top: 4px solid #10b981; }
        .product-card.status-warn { border-top: 4px solid #f59e0b; }
        .product-card.status-bad { border-top: 4px solid #ef4444; }

        .pc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
        .pc-title { font-size: 16px; font-weight: 900; color: #0f172a; margin: 0; }
        .pc-price { font-size: 13px; color: #64748b; font-weight: 700; }
        
        .pc-actions { display: flex; gap: 8px; }
        .pc-btn { width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; border: none; font-size: 14px; }
        .pc-btn-edit { background: #e0e7ff; color: #4f46e5; }
        .pc-btn-edit:hover { background: #c7d2fe; }
        .pc-btn-delete { background: #fee2e2; color: #ef4444; }
        .pc-btn-delete:hover { background: #ef4444; color: #fff; }

        .pc-stats { display: flex; flex-direction: column; gap: 10px; background: #f8fafc; padding: 15px; border-radius: 12px; }
        .pc-stat-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 800; }
        
        .badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 900; }
        .bg-green { background: #dcfce7; color: #166534; }
        .bg-yellow { background: #fef3c7; color: #92400e; }
        .bg-red { background: #fee2e2; color: #991b1b; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للرئيسية
        </Link>
      </div>

      <div className="tool-title">
        <h1>حاسبة <span>أرباح ونقاط التعادل</span></h1>
        <p>احسب صافي أرباحك الحقيقية، واعرف الحد الأقصى لتكلفة الإعلان قبل أن تبدأ بالخسارة.</p>
      </div>

      <div className="main-grid">
        {/* القسم الأول: إدخال البيانات */}
        <div className="panel">
          <h2>🛒 بيانات المنتج والتكاليف</h2>
          
          <div className="input-group">
            <label>اسم المنتج (اختياري لحفظ الحسبة)</label>
            <div className="input-wrapper">
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: سماعة البلوتوث الرياضية" />
            </div>
          </div>

          <div className="grid-2-cols">
            <div className="input-group">
              <label>سعر بيع المنتج للعميل</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} placeholder="199" />
                <span className="currency">ر.س</span>
              </div>
            </div>
            <div className="input-group">
              <label>تكلفة المنتج عليك</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={productCost} onChange={(e) => setProductCost(Number(e.target.value))} placeholder="50" />
                <span className="currency">ر.س</span>
              </div>
            </div>
          </div>

          <div className="grid-2-cols">
            <div className="input-group">
              <label>تكلفة الشحن والتغليف</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} placeholder="25" />
                <span className="currency">ر.س</span>
              </div>
            </div>
            <div className="input-group">
              <label>تكلفة التسويق (للمبيعة الواحدة)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} placeholder="40" />
                <span className="currency">ر.س</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
            <h3 style={{ fontSize: '13px', color: '#1e293b', marginBottom: '15px', fontWeight: 900 }}>⚙️ الإعدادات المتقدمة (الرسوم والضرائب)</h3>
            
            <div className="grid-3-cols">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>رسوم الدفع (%)</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" value={paymentFeePercent} onChange={(e) => setPaymentFeePercent(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>رسوم (مبلغ ثابت)</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" value={paymentFeeFixed} onChange={(e) => setPaymentFeeFixed(Number(e.target.value))} />
                  <span className="currency">ر.س</span>
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>نسبة المرتجعات</label>
                <div className="input-wrapper">
                  <input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>الضريبة (VAT)</label>
                <div className="input-wrapper">
                  <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 800, color: '#475569', flex: 2, marginTop: '20px' }}>
                <input type="checkbox" checked={isTaxInclusive} onChange={(e) => setIsTaxInclusive(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }} />
                سعر البيع "شامل" الضريبة (تخصم منه)
              </label>
            </div>
          </div>
        </div>

        {/* القسم الثاني: النتائج اللحظية */}
        <div className="panel results-panel">
          <h2>🎯 التحليل المالي والنتائج</h2>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">بوابة الدفع</span>
              <span className="detail-val">{results.paymentFees.toFixed(2)} ر.س</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">الضريبة المقتطعة</span>
              <span className="detail-val">{results.taxAmount.toFixed(2)} ر.س</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">مخاطر المرتجعات</span>
              <span className="detail-val text-red-400" style={{ color: '#fca5a5' }}>-{results.returnsCost.toFixed(2)} ر.س</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">عائد الاستثمار ROI</span>
              <span className="detail-val" style={{ color: '#86efac' }}>%{results.roi.toFixed(0)}</span>
            </div>
          </div>

          <div className="grid-2-cols" style={{ gap: '10px' }}>
            <div className="result-box" style={{ background: '#0f172a', borderColor: '#334155', padding: '15px' }}>
              <span className="result-label" style={{ color: '#fcd34d' }}>
                أقصى تكلفة استحواذ (Max CPA)
                <small>الحد الأقصى للإعلان قبل الخسارة</small>
              </span>
              <span className="result-value" style={{ color: '#fcd34d' }}>
                {results.maxCPA.toFixed(2)} <span>ر.س</span>
              </span>
            </div>

            <div className="result-box" style={{ background: '#0f172a', borderColor: '#334155', padding: '15px' }}>
              <span className="result-label" style={{ color: '#38bdf8' }}>
                العائد الإعلاني المطلوب
                <small>Break-even ROAS</small>
              </span>
              <span className="result-value" style={{ color: '#38bdf8' }}>
                {results.breakEvenROAS.toFixed(2)}x
              </span>
            </div>
          </div>

          <div className={`result-box ${results.netProfit > 0 ? 'success' : results.netProfit < 0 ? 'warning' : ''}`}>
            <span className="result-label">الربح الصافي الفعلي</span>
            <span className="result-value">
              {results.netProfit.toFixed(2)} <span>ر.س</span>
            </span>
          </div>

          <div className="result-box highlight" style={{ marginBottom: '20px' }}>
            <span className="result-label">هامش الربح الصافي</span>
            <span className="result-value">
              {results.profitMargin.toFixed(1)} <span>%</span>
            </span>
          </div>

          <button className="btn-save" onClick={saveProduct}>
            💾 حفظ المنتج في المحفظة للمقارنة
          </button>
        </div>
      </div>

      {/* القسم الثالث: محفظة المنتجات المحفوظة */}
      {savedProducts.length > 0 && (
        <>
          <div className="saved-section-title">
            <span>💼 محفظة المنتجات والمقارنة ({savedProducts.length})</span>
            <button className="btn-export" onClick={exportToCSV}>📥 تصدير الإحصائيات (Excel)</button>
          </div>
          <div className="saved-grid">
            {savedProducts.map((prod) => (
              <div 
                key={prod.id} 
                className={`product-card ${prod.profitMargin >= 20 ? 'status-good' : prod.profitMargin > 0 ? 'status-warn' : 'status-bad'}`}
              >
                <div className="pc-header">
                  <div>
                    <h3 className="pc-title">{prod.name}</h3>
                    <span className="pc-price">سعر البيع: {prod.sellingPrice} ر.س</span>
                  </div>
                  <div className="pc-actions">
                    <button className="pc-btn pc-btn-edit" onClick={() => loadProduct(prod)} title="استدعاء للتعديل">✏️</button>
                    <button className="pc-btn pc-btn-delete" onClick={() => deleteProduct(prod.id)} title="حذف المنتج">✕</button>
                  </div>
                </div>
                
                <div className="pc-stats">
                  <div className="pc-stat-row">
                    <span style={{ color: '#475569' }}>صافي الربح:</span>
                    <span style={{ color: '#0f172a', direction: 'ltr' }}>{prod.netProfit.toFixed(2)} ر.س</span>
                  </div>
                  <div className="pc-stat-row">
                    <span style={{ color: '#475569' }}>Max CPA / ROAS:</span>
                    <span style={{ color: '#0f172a', direction: 'ltr' }}>
                      <span style={{ color: '#f59e0b' }}>{prod.maxCPA.toFixed(0)} ر.س</span> / <span style={{ color: '#38bdf8' }}>{prod.breakEvenROAS.toFixed(1)}x</span>
                    </span>
                  </div>
                  <div className="pc-stat-row" style={{ marginTop: '5px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                    <span style={{ color: '#475569' }}>الهامش الربحي:</span>
                    <span className={`badge ${prod.profitMargin >= 20 ? 'bg-green' : prod.profitMargin > 0 ? 'bg-yellow' : 'bg-red'}`} style={{ direction: 'ltr' }}>
                      {prod.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
