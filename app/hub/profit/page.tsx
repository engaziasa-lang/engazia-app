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
  const [isTaxInclusive, setIsTaxInclusive] = useState<boolean>(true);
  const [returnRate, setReturnRate] = useState<number>(10);

  // مربع البحث
  const [searchQuery, setSearchQuery] = useState<string>('');

  // النتائج اللحظية
  const [results, setResults] = useState({
    paymentFees: 0,
    taxAmount: 0,
    returnsCost: 0,
    totalCostWithoutAds: 0,
    maxCPA: 0, 
    breakEvenROAS: 0, 
    netProfit: 0,
    profitMargin: 0,
    roi: 0,
  });

  // المنتجات المحفوظة
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('engazia_profit_products_v5');
    if (saved) {
      try { setSavedProducts(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

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

    const paymentFees = (sPrice * (paymentFeePercent / 100)) + paymentFeeFixed;
    const taxValue = taxPercent / 100;
    const taxAmount = isTaxInclusive 
      ? sPrice - (sPrice / (1 + taxValue)) 
      : sPrice * taxValue;
    const returnsCost = (pCost + sCost) * (returnRate / 100);
    const totalCostWithoutAds = pCost + sCost + paymentFees + taxAmount + returnsCost;
    const maxCPA = sPrice - totalCostWithoutAds;
    const breakEvenROAS = maxCPA > 0 ? (sPrice / maxCPA) : 0;
    const netProfit = maxCPA - aSpend;
    const profitMargin = (netProfit / sPrice) * 100;
    const totalInvestment = pCost + sCost + aSpend;
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    setResults({ paymentFees, taxAmount, returnsCost, totalCostWithoutAds, maxCPA, breakEvenROAS, netProfit, profitMargin, roi });
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
      paymentFeePercent, paymentFeeFixed, taxPercent, isTaxInclusive, returnRate,
      netProfit: results.netProfit, profitMargin: results.profitMargin, maxCPA: results.maxCPA, breakEvenROAS: results.breakEvenROAS, roi: results.roi
    };

    const updatedList = [newProduct, ...savedProducts];
    setSavedProducts(updatedList);
    localStorage.setItem('engazia_profit_products_v5', JSON.stringify(updatedList));
    setProductName('');
  };

  const clearInputs = () => {
    setProductName('');
    setSellingPrice('');
    setProductCost('');
    setShippingCost('');
    setAdSpend('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const updatedList = savedProducts.filter(p => p.id !== id);
      setSavedProducts(updatedList);
      localStorage.setItem('engazia_profit_products_v5', JSON.stringify(updatedList));
    }
  };

  // دالة التصدير المحدثة لدعم اللغة العربية والاتجاه من اليمين لليسار (Excel HTML format)
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

    // بناء جدول HTML وتضمين تعليمات الاتجاه (RTL) وترميز UTF-8
    let htmlTable = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <!-- فرض اتجاه الورقة من اليمين لليسار -->
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>المحفظة</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayRightToLeft/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
      </head>
      <body>
        <table border="1" dir="rtl">
          <thead>
            <tr>
              ${headers.map(h => `<th style="background-color:#f1f5f9; font-weight:bold;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => 
              `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
            ).join('')}
          </tbody>
        </table>
      </body>
    </html>`;

    // استخدام Data URI مع ترميز Base64 لتجنب أي مشاكل في الترميز
    const uri = 'data:application/vnd.ms-excel;base64,';
    const base64 = (s: string) => window.btoa(unescape(encodeURIComponent(s)));

    const link = document.createElement('a');
    link.href = uri + base64(htmlTable);
    // تغيير اللاحقة إلى xls لضمان قراءة الجدول والتنسيقات
    link.download = `profit_portfolio_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = savedProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tool-container">
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f1f5f9; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px 15px 40px; }
        
        .header { max-width: 1000px; margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 13px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .back-btn:hover { background: #e2e8f0; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 25px; }
        .tool-title h1 { font-size: 26px; font-weight: 900; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.5px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 13px; font-weight: 500; margin: 0; }

        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 1000px; margin: 0 auto 30px; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 15px; font-weight: 900; color: #1e293b; margin-bottom: 18px; margin-top: 0; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }

        .input-group { margin-bottom: 14px; }
        .input-group label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; }
        .input-wrapper input { width: 100%; padding: 10px 12px 10px 35px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: 'Tajawal', sans-serif; transition: border-color 0.2s; background: #fff; font-weight: 700; color: #1e293b; outline: none; box-sizing: border-box; }
        .input-wrapper input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        .input-wrapper .currency { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-weight: 800; font-size: 11px; direction: ltr; }

        .grid-2-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-3-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 12px; }

        .results-panel { background: #1e293b; border: none; color: #ffffff; position: relative; overflow: hidden; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #334155; padding: 12px 15px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #475569; transition: 0.3s; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        .result-box.warning { background: #7f1d1d; border-color: #991b1b; }
        .result-box.success { background: #14532d; border-color: #166534; }
        
        .result-label { font-size: 13px; font-weight: 800; color: #cbd5e1; display: flex; flex-direction: column; }
        .result-label small { font-size: 10px; color: #94a3b8; font-weight: 500; margin-top: 2px; }
        .highlight .result-label, .warning .result-label, .success .result-label { color: #ffffff; opacity: 0.9; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #ffffff; display: flex; align-items: baseline; gap: 4px; direction: ltr; }
        .result-value span { font-size: 11px; font-weight: 700; opacity: 0.8; }

        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .detail-item { background: #0f172a; padding: 10px; border-radius: 8px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 4px; }
        .detail-label { font-size: 10px; color: #94a3b8; font-weight: 700; }
        .detail-val { font-size: 13px; font-weight: 900; color: #f8fafc; direction: ltr; text-align: right; }

        /* الأزرار الجديدة للحفظ والمسح */
        .action-buttons { display: flex; gap: 10px; margin-top: 15px; }
        .btn-save { background: #10b981; color: #fff; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 900; cursor: pointer; transition: 0.2s; font-family: 'Tajawal', sans-serif; flex: 2; }
        .btn-save:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2); }
        .btn-clear { background: transparent; color: #94a3b8; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; font-family: 'Tajawal', sans-serif; flex: 1; }
        .btn-clear:hover { background: #334155; color: #fff; }

        /* قسم الجدول والبحث */
        .saved-section-title { font-size: 16px; font-weight: 900; color: #1e293b; margin-bottom: 15px; max-width: 1000px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        
        .table-controls { display: flex; gap: 10px; align-items: center; flex: 1; justify-content: flex-end; }
        .search-box { position: relative; max-width: 250px; width: 100%; }
        .search-box input { width: 100%; padding: 8px 12px 8px 30px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-family: 'Tajawal', sans-serif; outline: none; box-sizing: border-box; }
        .search-box span { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #94a3b8; }
        
        .btn-export { background: #fff; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; color: #475569; cursor: pointer; transition: 0.2s; white-space: nowrap; }
        .btn-export:hover { background: #f8fafc; border-color: #94a3b8; color: #0f172a; }
        
        .table-container { max-width: 1000px; margin: 0 auto; overflow-x: auto; background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .styled-table { width: 100%; border-collapse: collapse; text-align: right; font-size: 12px; white-space: nowrap; min-width: 850px; }
        .styled-table th, .styled-table td { padding: 14px 15px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .styled-table th { background-color: #f8fafc; font-weight: 900; color: #475569; font-size: 12px; }
        .styled-table tbody tr { transition: 0.2s; }
        .styled-table tbody tr:hover { background-color: #f8fafc; }
        
        .table-badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 900; direction: ltr; display: inline-block; }
        .bg-green { background: #dcfce7; color: #166534; }
        .bg-yellow { background: #fef3c7; color: #92400e; }
        .bg-red { background: #fee2e2; color: #991b1b; }

        .pc-actions { display: flex; gap: 6px; }
        .pc-btn { width: 28px; height: 28px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; border: none; font-size: 12px; }
        .pc-btn-edit { background: #e0e7ff; color: #4f46e5; }
        .pc-btn-edit:hover { background: #c7d2fe; }
        .pc-btn-delete { background: #fee2e2; color: #ef4444; }
        .pc-btn-delete:hover { background: #ef4444; color: #fff; }

        @media(max-width: 800px) { 
          .main-grid { grid-template-columns: 1fr; gap: 15px; } 
          .tool-container { padding: 15px 10px 30px; }
          .saved-section-title { flex-direction: column; align-items: stretch; }
          .table-controls { justify-content: space-between; }
          .search-box { max-width: none; }
        }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة
        </Link>
      </div>

      <div className="tool-title">
        <h1>حاسبة <span>أرباح ونقاط التعادل</span></h1>
        <p>احسب صافي أرباحك الحقيقية والحد الأقصى لتكلفة الإعلان</p>
      </div>

      <div className="main-grid">
        {/* القسم الأول: إدخال البيانات */}
        <div className="panel">
          <h2>🛒 بيانات المنتج والتكاليف</h2>
          
          <div className="input-group">
            <label>اسم المنتج</label>
            <div className="input-wrapper">
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: سماعة البلوتوث" />
            </div>
          </div>

          <div className="grid-2-cols">
            <div className="input-group">
              <label>سعر البيع للعميل</label>
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
              <label>تكلفة التسويق (مبيعة)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} placeholder="40" />
                <span className="currency">ر.س</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '5px' }}>
            <h3 style={{ fontSize: '11px', color: '#1e293b', marginBottom: '10px', fontWeight: 900 }}>⚙️ الإعدادات المتقدمة (الرسوم)</h3>
            
            <div className="grid-3-cols">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>دفع (%)</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" value={paymentFeePercent} onChange={(e) => setPaymentFeePercent(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>رسوم (ثابت)</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" value={paymentFeeFixed} onChange={(e) => setPaymentFeeFixed(Number(e.target.value))} />
                  <span className="currency">ر.س</span>
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>المرتجعات</label>
                <div className="input-wrapper">
                  <input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>الضريبة (VAT)</label>
                <div className="input-wrapper">
                  <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, color: '#475569', flex: 2, marginTop: '15px' }}>
                <input type="checkbox" checked={isTaxInclusive} onChange={(e) => setIsTaxInclusive(e.target.checked)} style={{ width: '14px', height: '14px', accentColor: '#4f46e5' }} />
                السعر "شامل" الضريبة
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

          <div className="grid-2-cols" style={{ gap: '8px' }}>
            <div className="result-box" style={{ background: '#0f172a', borderColor: '#334155', padding: '12px' }}>
              <span className="result-label" style={{ color: '#fcd34d' }}>
                أقصى تكلفة استحواذ
                <small>Max CPA المسموح</small>
              </span>
              <span className="result-value" style={{ color: '#fcd34d' }}>
                {results.maxCPA.toFixed(2)} <span>ر.س</span>
              </span>
            </div>

            <div className="result-box" style={{ background: '#0f172a', borderColor: '#334155', padding: '12px' }}>
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

          <div className="result-box highlight" style={{ marginBottom: '5px' }}>
            <span className="result-label">هامش الربح الصافي</span>
            <span className="result-value">
              {results.profitMargin.toFixed(1)} <span>%</span>
            </span>
          </div>

          <div className="action-buttons">
            <button className="btn-save" onClick={saveProduct}>💾 حفظ في المحفظة</button>
            <button className="btn-clear" onClick={clearInputs}>🗑 مسح الحقول</button>
          </div>
        </div>
      </div>

      {/* القسم الثالث: محفظة المنتجات المحفوظة (الجدول والبحث) */}
      {savedProducts.length > 0 && (
        <>
          <div className="saved-section-title">
            <span>💼 المحفظة ({savedProducts.length})</span>
            <div className="table-controls">
              <div className="search-box">
                <span>🔍</span>
                <input 
                  type="text" 
                  placeholder="ابحث عن منتج..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn-export" onClick={exportToCSV}>📥 تصدير Excel</button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>سعر البيع</th>
                  <th>التكلفة</th>
                  <th>الشحن</th>
                  <th>الإعلان</th>
                  <th>Max CPA</th>
                  <th>ROAS</th>
                  <th>الربح الصافي</th>
                  <th>الهامش</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <tr key={prod.id} style={{ borderLeft: `4px solid ${prod.profitMargin >= 20 ? '#10b981' : prod.profitMargin > 0 ? '#f59e0b' : '#ef4444'}` }}>
                      <td style={{ fontWeight: 900, color: '#0f172a' }}>{prod.name}</td>
                      <td dir="ltr" style={{ color: '#64748b' }}>{prod.sellingPrice} ر.س</td>
                      <td dir="ltr" style={{ color: '#64748b' }}>{prod.productCost} ر.س</td>
                      <td dir="ltr" style={{ color: '#64748b' }}>{prod.shippingCost} ر.س</td>
                      <td dir="ltr" style={{ color: '#64748b' }}>{prod.adSpend} ر.س</td>
                      
                      <td dir="ltr" style={{ color: '#f59e0b', fontWeight: 800 }}>{prod.maxCPA.toFixed(2)}</td>
                      <td dir="ltr" style={{ color: '#38bdf8', fontWeight: 800 }}>{prod.breakEvenROAS.toFixed(2)}x</td>
                      
                      <td dir="ltr" style={{ fontWeight: 900, color: prod.netProfit > 0 ? '#166534' : '#991b1b' }}>
                        {prod.netProfit.toFixed(2)} ر.س
                      </td>
                      <td>
                        <span className={`table-badge ${prod.profitMargin >= 20 ? 'bg-green' : prod.profitMargin > 0 ? 'bg-yellow' : 'bg-red'}`}>
                          {prod.profitMargin.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <div className="pc-actions">
                          <button className="pc-btn pc-btn-edit" onClick={() => loadProduct(prod)} title="استدعاء للتعديل">✏️</button>
                          <button className="pc-btn pc-btn-delete" onClick={() => deleteProduct(prod.id)} title="حذف المنتج">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>لا يوجد منتج يطابق بحثك "{searchQuery}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
