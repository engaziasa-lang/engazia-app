'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ProfitItem {
  id: string;
  name: string;
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  gatewayFeePercent: number;
  netProfit: number;
  margin: number;
  createdAt?: string;
}

export default function ProfitCalculatorSA() {
  const [productName, setProductName] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [gatewayFeePercent, setGatewayFeePercent] = useState<number | ''>(2.2);

  const [items, setItems] = useState<ProfitItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_profit_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ProfitItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_profit_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const sPrice = typeof sellingPrice === 'number' ? sellingPrice : 0;
  const pCost = typeof productCost === 'number' ? productCost : 0;
  const sCost = typeof shippingCost === 'number' ? shippingCost : 0;
  const gFee = typeof gatewayFeePercent === 'number' ? gatewayFeePercent : 0;

  const vatAmount = sPrice - (sPrice / 1.15);
  const gatewayFeeAmount = sPrice * (gFee / 100);
  const totalCosts = pCost + sCost + vatAmount + gatewayFeeAmount;
  const netProfit = sPrice - totalCosts;
  const margin = sPrice > 0 ? (netProfit / sPrice) * 100 : 0;

  const handleClearForm = () => {
    setProductName('');
    setSellingPrice('');
    setProductCost('');
    setShippingCost('');
    setGatewayFeePercent(2.2);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 منتجات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!productName.trim() || sPrice <= 0) {
      alert('الرجاء إدخال اسم المنتج وسعر بيع صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        name: productName,
        sellingPrice: sPrice,
        productCost: pCost,
        shippingCost: sCost,
        gatewayFeePercent: gFee,
        netProfit: Number(netProfit.toFixed(2)),
        margin: Number(margin.toFixed(1))
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث بيانات المنتج بنجاح!');
    } else {
      const newItem: ProfitItem = {
        id: Date.now().toString(),
        name: productName,
        sellingPrice: sPrice,
        productCost: pCost,
        shippingCost: sCost,
        gatewayFeePercent: gFee,
        netProfit: Number(netProfit.toFixed(2)),
        margin: Number(margin.toFixed(1)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة المنتج إلى جدول التحليل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ProfitItem) => {
    setProductName(item.name);
    setSellingPrice(item.sellingPrice);
    setProductCost(item.productCost);
    setShippingCost(item.shippingCost);
    setGatewayFeePercent(item.gatewayFeePercent);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج من الجدول؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  // تصدير متوافق 100% مع الإكسل (يدعم اليمين لليسار واللغة العربية)
  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const totalSellingPrice = items.reduce((acc, curr) => acc + curr.sellingPrice, 0);
    const totalCostsValue = items.reduce((acc, curr) => acc + curr.productCost + curr.shippingCost, 0);
    const totalNetProfitValue = items.reduce((acc, curr) => acc + curr.netProfit, 0);

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
                <th>اسم المنتج</th>
                <th>التاريخ والوقت</th>
                <th>سعر البيع</th>
                <th>التكلفة والشحن</th>
                <th>صافي الربح</th>
                <th>هامش الربح</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.name}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.sellingPrice}</td>
          <td>${row.productCost + row.shippingCost}</td>
          <td>${row.netProfit}</td>
          <td>${row.margin}%</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="3">الإجمالي الكلي</td>
                <td>${totalSellingPrice.toFixed(2)}</td>
                <td>${totalCostsValue.toFixed(2)}</td>
                <td>${totalNetProfitValue.toFixed(2)}</td>
                <td></td>
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
    link.setAttribute("download", "seerk_profit_analysis.xls");
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

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // حساب المجاميع للجدول السفلي في الواجهة
  const totalSellingPrice = filteredItems.reduce((acc, curr) => acc + curr.sellingPrice, 0);
  const totalCostsValue = filteredItems.reduce((acc, curr) => acc + curr.productCost + curr.shippingCost, 0);
  const totalNetProfitValue = filteredItems.reduce((acc, curr) => acc + curr.netProfit, 0);

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
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value, .danger .result-value { font-size: 26px; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 100%; max-width: 300px; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 700px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة أرباح ونقاط التعادل (15% ضريبة) 📊</h1>
          <p>احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة</p>
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
              <span>{editingId ? 'تعديل بيانات المنتج' : 'حساب منتج جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح وتفريغ الحقول تماماً">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المنتج أو الخدمة</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: عطر فاخر" required />
              </div>
            </div>

            <div className="input-group">
              <label>سعر بيع المنتج للعميل</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={sellingPrice === '' ? '' : sellingPrice} onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="200" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>تكلفة المنتج الأساسية من المورد</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={productCost === '' ? '' : productCost} onChange={(e) => setProductCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="60" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>تكلفة التوصيل والشحن للطلب</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={shippingCost === '' ? '' : shippingCost} onChange={(e) => setShippingCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="25" />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>رسوم بوابة الدفع (%)</label>
              <div className="input-wrapper">
                <input type="number" step="0.1" min="0" value={gatewayFeePercent === '' ? '' : gatewayFeePercent} onChange={(e) => setGatewayFeePercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2.2" />
                <span className="currency-tag">%</span>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ وإضافة المنتج للجدول'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">التحليل المالي الفوري</h2>

          <div className={`result-box ${netProfit > 0 ? 'primary' : 'danger'}`}>
            <div>
              <div className="result-label">صافي الربح الفعلي للقطعة الواحدة</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>بعد خصم التكلفة، الشحن، البوابة والضريبة</div>
            </div>
            <div className="result-value">
              {netProfit.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">هامش الربح الصافي (%)</span>
            <span className="result-value" style={{ color: margin >= 20 ? '#10b981' : '#d97706' }}>
              {margin.toFixed(1)}%
            </span>
          </div>

          <div className="result-box">
            <span className="result-label">ضريبة القيمة المضافة المستقطعة (15%)</span>
            <span className="result-value">{vatAmount.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي التكاليف الشاملة للطلب</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{totalCosts.toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* جدول إدارة البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث في المنتجات المحفوظة..." 
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
                <th>سعر البيع</th>
                <th>التكلفة والشحن</th>
                <th>صافي الربح</th>
                <th>هامش الربح</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد منتجات مسجلة في الجدول حالياً. قم بإضافة منتج عبر نموذج الحاسبة أعلاه.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.name}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td>{item.sellingPrice} ر.س</td>
                    <td>{(item.productCost + item.shippingCost)} ر.س</td>
                    <td style={{ color: item.netProfit > 0 ? '#047857' : '#dc2626', fontWeight: 900 }}>{item.netProfit} ر.س</td>
                    <td>{item.margin}%</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(item)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>تعديل</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* شريط الإجماليات يظهر فقط إذا كان هناك بيانات */}
            {filteredItems.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center' }}>الإجمالي الكلي</td>
                  <td>{totalSellingPrice.toFixed(2)} ر.س</td>
                  <td>{totalCostsValue.toFixed(2)} ر.س</td>
                  <td style={{ color: totalNetProfitValue > 0 ? '#047857' : '#dc2626' }}>{totalNetProfitValue.toFixed(2)} ر.س</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
