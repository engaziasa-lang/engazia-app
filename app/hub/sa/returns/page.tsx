'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ReturnItem {
  id: string;
  productName: string;
  returnReason: string;
  productPrice: number;
  returnShippingFee: number;
  restockingCost: number;
  totalLoss: number;
}

export default function ReturnsAnalyzerSA() {
  const [productName, setProductName] = useState<string>('');
  const [returnReason, setReturnReason] = useState<string>('لم يعجب المنتج العميل');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [returnShippingFee, setReturnShippingFee] = useState<number | ''>('');
  const [restockingCost, setRestockingCost] = useState<number | ''>('');

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

  const pPrice = typeof productPrice === 'number' ? productPrice : 0;
  const sFee = typeof returnShippingFee === 'number' ? returnShippingFee : 0;
  const rCost = typeof restockingCost === 'number' ? restockingCost : 0;

  // إجمالي الخسارة (قيمة الشحن العكسي + تكلفة إعادة التغليف + فقدان قيمة المنتج أو تلفه الجزئي)
  const totalLoss = sFee + rCost + (pPrice * 0.15); // افتراض خسارة 15% من قيمة المنتج كفقدان أو إعادة بيع كمستعمل

  const handleClearForm = () => {
    setProductName('');
    setReturnReason('لم يعجب المنتج العميل');
    setProductPrice('');
    setReturnShippingFee('');
    setRestockingCost('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!productName.trim() || pPrice <= 0) {
      alert('الرجاء إدخال اسم المنتج وسعر صحيح.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        returnReason,
        productPrice: pPrice,
        returnShippingFee: sFee,
        restockingCost: rCost,
        totalLoss: Number(totalLoss.toFixed(2)),
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السجل بنجاح!');
    } else {
      const newItem: ReturnItem = {
        id: Date.now().toString(),
        productName,
        returnReason,
        productPrice: pPrice,
        returnShippingFee: sFee,
        restockingCost: rCost,
        totalLoss: Number(totalLoss.toFixed(2)),
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة السجل إلى النظام بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ReturnItem) => {
    setProductName(item.productName);
    setReturnReason(item.returnReason);
    setProductPrice(item.productPrice);
    setReturnShippingFee(item.returnShippingFee);
    setRestockingCost(item.restockingCost);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,ProductName,Reason,Price,ShippingFee,TotalLoss\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.productName},${row.returnReason},${row.productPrice},${row.returnShippingFee},${row.totalLoss}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_returns_analysis.csv");
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
            alert('✨ تم استيراد السجلات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.returnReason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 40px auto; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .danger .result-value { font-size: 26px; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 250px; }
        .table-btns { display: flex; gap: 10px; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; }
        .t-btn:hover { background: #f1f5f9; }

        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>محلل خسائر المرتجعات والشحن العكسي 🔄</h1>
          <p>قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي في المتجر</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{editingId ? 'تعديل السجل' : 'تحليل مرتجع جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المنتج المسترجع</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: ساعة يد ذكية" required />
              </div>
            </div>

            <div className="input-group">
              <label>سبب الاسترجاع الرئيسي</label>
              <div className="input-wrapper">
                <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)}>
                  <option value="لم يعجب المنتج العميل">لم يعجب المنتج العميل</option>
                  <option value="مقاس غير مناسب">مقاس غير مناسب</option>
                  <option value="عنصر تالف أو به عيب مصنعي">عنصر تالف أو به عيب مصنعي</option>
                  <option value="تأخر التوصيل فرفض الاستلام">تأخر التوصيل فرفض الاستلام</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>سعر بيع المنتج الأصلي (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={productPrice === '' ? '' : productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="250" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>تكلفة الشحن العكسي لشركة الشحن (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={returnShippingFee === '' ? '' : returnShippingFee} onChange={(e) => setReturnShippingFee(e.target.value === '' ? '' : Number(e.target.value))} placeholder="25" />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>تكاليف إعادة التغليف والفحص (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={restockingCost === '' ? '' : restockingCost} onChange={(e) => setRestockingCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="10" />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ السجل في النظام'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">تحليل الخسارة الفورية</h2>

          <div className="result-box danger">
            <div>
              <div className="result-label">إجمالي التكلفة والخسارة من هذا المرتجع</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>شاملة الشحن العكسي، التغليف وفقدان القيمة</div>
            </div>
            <div className="result-value">
              {totalLoss.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">تكلفة الشحن العكسي المقتطعة</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{sFee} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">تقدير تلف المنتج وفقدان قيمته</span>
            <span className="result-value" style={{ color: '#d97706' }}>{(pPrice * 0.15).toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* جدول إدارة السجلات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المنتج أو سبب الاسترجاع..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportCsv}>📥 تصدير CSV</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 استيراد</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم المنتج</th>
                <th>السبب</th>
                <th>سعر المنتج</th>
                <th>الشحن العكسي</th>
                <th>إجمالي الخسارة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سجلات مرتجعات مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.productName}</td>
                    <td>{item.returnReason}</td>
                    <td>{item.productPrice} ر.س</td>
                    <td>{item.returnShippingFee} ر.س</td>
                    <td style={{ color: '#dc2626', fontWeight: 900 }}>{item.totalLoss} ر.س</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(item)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>تعديل</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
