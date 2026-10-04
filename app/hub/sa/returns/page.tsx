'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ReturnItem {
  id: string;
  productName: string;
  returnedOrders: number;
  avgOrderValue: number;
  reverseShippingCost: number;
  damageCost: number;
  totalLoss: number;         // الخسارة الفعلية المدفوعة (شحن + تالف)
  totalLostRevenue: number;  // المبيعات التي طارت
  createdAt?: string;
}

export default function ReturnsAnalyzerSA() {
  const [productName, setProductName] = useState<string>('');
  const [returnedOrders, setReturnedOrders] = useState<number | ''>('');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>('');
  const [reverseShippingCost, setReverseShippingCost] = useState<number | ''>(28); // متوسط الشحن العكسي
  const [damageCost, setDamageCost] = useState<number | ''>(5); // تغليف أو تلف بسيط

  const [items, setItems] = useState<ReturnItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_returns_analysis_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ReturnItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_returns_analysis_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const returnsCount = typeof returnedOrders === 'number' ? returnedOrders : 0;
  const avgVal = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const revShipping = typeof reverseShippingCost === 'number' ? reverseShippingCost : 0;
  const dmg = typeof damageCost === 'number' ? damageCost : 0;

  // الحسابات
  const totalLostRevenue = returnsCount * avgVal;
  const lossPerOrder = revShipping + dmg;
  const totalLoss = returnsCount * lossPerOrder;

  const handleClearForm = () => {
    setProductName('');
    setReturnedOrders('');
    setAvgOrderValue('');
    setReverseShippingCost(28);
    setDamageCost(5);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!productName.trim() || returnsCount <= 0) {
      alert('الرجاء التأكد من إدخال اسم المنتج أو الفئة وعدد المرتجعات بشكل صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        returnedOrders: returnsCount,
        avgOrderValue: avgVal,
        reverseShippingCost: revShipping,
        damageCost: dmg,
        totalLoss: Number(totalLoss.toFixed(2)),
        totalLostRevenue: Number(totalLostRevenue.toFixed(2)),
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث بيانات السجل بنجاح!');
    } else {
      const newItem: ReturnItem = {
        id: Date.now().toString(),
        productName,
        returnedOrders: returnsCount,
        avgOrderValue: avgVal,
        reverseShippingCost: revShipping,
        damageCost: dmg,
        totalLoss: Number(totalLoss.toFixed(2)),
        totalLostRevenue: Number(totalLostRevenue.toFixed(2)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تم إضافة بيانات الاسترجاع إلى السجل!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ReturnItem) => {
    setProductName(item.productName);
    setReturnedOrders(item.returnedOrders);
    setAvgOrderValue(item.avgOrderValue);
    setReverseShippingCost(item.reverseShippingCost);
    setDamageCost(item.damageCost);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const sumReturns = items.reduce((acc, curr) => acc + curr.returnedOrders, 0);
    const sumLostRev = items.reduce((acc, curr) => acc + curr.totalLostRevenue, 0);
    const sumActualLoss = items.reduce((acc, curr) => acc + curr.totalLoss, 0);

    let tableHtml = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
            th { background-color: #f8fafc; font-weight: bold; color: #334155; }
            .tfoot-row td { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>م</th>
                <th>اسم المنتج أو الفئة</th>
                <th>التاريخ والوقت</th>
                <th>عدد المرتجعات</th>
                <th>المبيعات المفقودة</th>
                <th>تكلفة الشحن العكسي للطلب</th>
                <th>تكلفة التالف للطلب</th>
                <th>إجمالي الخسارة الفعلية</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.productName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.returnedOrders}</td>
          <td>${row.totalLostRevenue}</td>
          <td>${row.reverseShippingCost}</td>
          <td>${row.damageCost}</td>
          <td>${row.totalLoss}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="3">الإجمالي الكلي</td>
                <td>${sumReturns}</td>
                <td>${sumLostRev.toFixed(2)}</td>
                <td colspan="2"></td>
                <td>${sumActualLoss.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "seerk_returns_analysis.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            saveToLocalStorage(imported);
            alert('✨ تم استيراد البيانات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sumReturns = filteredItems.reduce((acc, curr) => acc + curr.returnedOrders, 0);
  const sumLostRev = filteredItems.reduce((acc, curr) => acc + curr.totalLostRevenue, 0);
  const sumActualLoss = filteredItems.reduce((acc, curr) => acc + curr.totalLoss, 0);

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input.with-currency { padding-left: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-box.warning { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label, .warning .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .danger .result-value, .warning .result-value { font-size: 26px; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 850px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: 'Tajawal', sans-serif;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>محلل خسائر المرتجعات والشحن العكسي 🔄</h1>
          <p>قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل السجل' : 'حساب خسائر منتج جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المنتج أو الفئة المسترجعة</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: فساتين سهرة مقاس M" required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>عدد الطلبات المسترجعة</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={returnedOrders === '' ? '' : returnedOrders} onChange={(e) => setReturnedOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="15" required />
                </div>
              </div>
              <div className="input-group">
                <label>متوسط قيمة الطلب (ر.س)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" min="0" value={avgOrderValue === '' ? '' : avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="350" required />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>تكلفة الشحن العكسي للطلب الواحد</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" min="0" value={reverseShippingCost === '' ? '' : reverseShippingCost} onChange={(e) => setReverseShippingCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="28" />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
              <div className="input-group">
                <label>تكلفة التغليف المهدر / التالف للطلب</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" min="0" value={damageCost === '' ? '' : damageCost} onChange={(e) => setDamageCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="5" />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ وإضافة السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">تحليل الخسائر الفوري (لهذا المنتج)</h2>

          <div className="result-box danger">
            <div>
              <div className="result-label">إجمالي الخسارة الفعلية المباشرة</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>مبالغ دُفعت للشحن العكسي والتوالف</div>
            </div>
            <div className="result-value">
              {totalLoss.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box warning">
            <div>
              <div className="result-label">إجمالي المبيعات المفقودة</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>إيرادات طارت بسبب الاسترجاع</div>
            </div>
            <div className="result-value">
              {totalLostRevenue.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">الخسارة التشغيلية للطلب الواحد</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{lossPerOrder.toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* جدول إدارة البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث في المنتجات المسترجعة..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel} title="تصدير بصيغة Excel لدعم اللغة العربية">📥 تصدير Excel</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 استيراد</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم المنتج والتاريخ</th>
                <th>عدد المرتجعات</th>
                <th>المبيعات المفقودة</th>
                <th>الشحن العكسي والتالف</th>
                <th>الخسارة الفعلية</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد بيانات مسجلة. قم بإضافة بيانات مرتجعات لتحليلها.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.productName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td style={{ fontWeight: 800 }}>{item.returnedOrders} طلب</td>
                    <td style={{ color: '#d97706', fontWeight: 800 }}>{item.totalLostRevenue} ر.س</td>
                    <td style={{ fontSize: '12px' }}>
                      <div style={{ color: '#475569' }}>شحن: {item.reverseShippingCost} ر.س</div>
                      <div style={{ color: '#64748b' }}>تالف: {item.damageCost} ر.س</div>
                    </td>
                    <td style={{ color: '#dc2626', fontWeight: 900 }}>{item.totalLoss} ر.س</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل البيانات">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={2} style={{ textAlign: 'center' }}>الإجمالي الكلي</td>
                  <td>{sumReturns} طلب</td>
                  <td style={{ color: '#d97706' }}>{sumLostRev.toFixed(2)} ر.س</td>
                  <td></td>
                  <td style={{ color: '#dc2626' }}>{sumActualLoss.toFixed(2)} ر.س</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
