'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface TaxItem {
  id: string;
  invoiceDate: string;
  invoiceNumber: string;
  transactionType: string;
  amountBeforeVat: number;
  vatAmount: number;
  totalAmount: number;
  createdAt?: string;
}

export default function TaxReturnPreparerSA() {
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('مبيعات ↗️');
  const [amountBeforeVat, setAmountBeforeVat] = useState<number | ''>('');
  const [vatAmount, setVatAmount] = useState<number | ''>('');

  const [items, setItems] = useState<TaxItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const saved = localStorage.getItem('seerk_tax_return_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: TaxItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_tax_return_items', JSON.stringify(newItems));
  };

  // الحساب التلقائي للضريبة 15% عند إدخال المبلغ
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setAmountBeforeVat('');
      setVatAmount('');
    } else {
      const numVal = Number(val);
      setAmountBeforeVat(numVal);
      setVatAmount(Number((numVal * 0.15).toFixed(2)));
    }
  };

  const handleClearForm = () => {
    setInvoiceDate('');
    setInvoiceNumber('');
    setTransactionType('مبيعات ↗️');
    setAmountBeforeVat('');
    setVatAmount('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 5 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (5 فواتير). يرجى ترقية حسابك لفتح السعة الكاملة!');
      return;
    }
    
    const amtBefore = typeof amountBeforeVat === 'number' ? amountBeforeVat : 0;
    const vat = typeof vatAmount === 'number' ? vatAmount : 0;
    
    if (!invoiceDate || !transactionType || amtBefore <= 0) {
      alert('الرجاء التأكد من تعبئة التاريخ، نوع المعاملة، والمبلغ بشكل صحيح.');
      return;
    }

    const totalAmount = amtBefore + vat;
    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        invoiceDate,
        invoiceNumber: invoiceNumber || 'بدون رقم',
        transactionType,
        amountBeforeVat: amtBefore,
        vatAmount: vat,
        totalAmount: Number(totalAmount.toFixed(2)),
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث بيانات الفاتورة بنجاح!');
    } else {
      const newItem: TaxItem = {
        id: Date.now().toString(),
        invoiceDate,
        invoiceNumber: invoiceNumber || 'بدون رقم',
        transactionType,
        amountBeforeVat: amtBefore,
        vatAmount: vat,
        totalAmount: Number(totalAmount.toFixed(2)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الفاتورة إلى سجل الإقرار الضريبي بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: TaxItem) => {
    setInvoiceDate(item.invoiceDate);
    setInvoiceNumber(item.invoiceNumber !== 'بدون رقم' ? item.invoiceNumber : '');
    setTransactionType(item.transactionType);
    setAmountBeforeVat(item.amountBeforeVat);
    setVatAmount(item.vatAmount);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  // العمليات الحسابية الحية للإقرار الضريبي
  const salesItems = items.filter(i => i.transactionType.includes('مبيعات'));
  const purchaseItems = items.filter(i => i.transactionType.includes('مشتريات'));

  const totalSalesVat = salesItems.reduce((acc, curr) => acc + curr.vatAmount, 0);
  const totalPurchaseVat = purchaseItems.reduce((acc, curr) => acc + curr.vatAmount, 0);
  
  // الضريبة المستحقة = ضريبة المبيعات المحصلة - ضريبة المشتريات المدفوعة
  const netVatDue = totalSalesVat - totalPurchaseVat;

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

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
          <h2>تقرير الإقرار الضريبي المبدئي</h2>
          <p>إجمالي ضريبة المبيعات: ${totalSalesVat.toFixed(2)} ر.س</p>
          <p>إجمالي ضريبة المشتريات: ${totalPurchaseVat.toFixed(2)} ر.س</p>
          <p><strong>صافي الضريبة المستحقة (ZATCA): ${netVatDue.toFixed(2)} ر.س</strong></p>
          <br/>
          <table>
            <thead>
              <tr>
                <th>م</th>
                <th>تاريخ الفاتورة</th>
                <th>رقم الفاتورة</th>
                <th>نوع المعاملة</th>
                <th>تاريخ الإدخال</th>
                <th>المبلغ (قبل الضريبة)</th>
                <th>قيمة الضريبة (15%)</th>
                <th>المبلغ الإجمالي</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.invoiceDate}</td>
          <td>${row.invoiceNumber}</td>
          <td>${row.transactionType}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.amountBeforeVat}</td>
          <td>${row.vatAmount}</td>
          <td>${row.totalAmount}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "seerk_tax_return_data.xls");
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
            alert('✨ تم استيراد بيانات الفواتير بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    (item?.invoiceNumber || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (item?.transactionType || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input.with-currency { padding-left: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value { font-size: 26px; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
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
          <h1>مجهز بيانات الإقرار الضريبي 📄</h1>
          <p>اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل رفع الإقرار الضريبي لزاتكا بدون أخطاء</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل الفاتورة' : 'إضافة فاتورة جديدة للسجل'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول لتصبح فارغة تماماً">
                🧹 مسح الحقول
              </button>
            </span>
            {isClient && !isActivated && <span className="trial-badge">تجريبي: {items.length}/5</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>تاريخ الفاتورة</label>
                <div className="input-wrapper">
                  <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
                </div>
              </div>
              <div className="input-group">
                <label>رقم الفاتورة (اختياري)</label>
                <div className="input-wrapper">
                  <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="مثال: INV-1002" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>نوع المعاملة</label>
                <div className="input-wrapper">
                  <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                    <option value="مبيعات ↗️">مبيعات (ضريبة محصلة) ↗️️</option>
                    <option value="مشتريات ↙️">مشتريات (ضريبة مدفوعة) ↙️</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>المبلغ قبل الضريبة (ر.س)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={amountBeforeVat === '' ? '' : amountBeforeVat} onChange={handleAmountChange} placeholder="1000" required />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>قيمة الضريبة المضافة 15% (محسوبة آلياً)</label>
              <div className="input-wrapper">
                <input className="with-currency" type="number" step="0.01" min="0" value={vatAmount === '' ? '' : vatAmount} onChange={(e) => setVatAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="150" required />
                <span className="currency-tag">ر.س</span>
              </div>
              <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '4px' }}>* يمكنك تعديل الهللات يدوياً إذا اختلفت عن الفاتورة الأصلية.</small>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ الفاتورة في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المؤشرات الحية */}
        <div className="card">
          <h2 className="card-title">مؤشرات الإقرار الضريبي الحية</h2>

          <div className="result-box primary" style={{ background: netVatDue >= 0 ? 'linear-gradient(135deg, #047857 0%, #065f46 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
            <div>
              <div className="result-label">صافي الضريبة المستحقة (ZATCA)</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>{netVatDue >= 0 ? 'مبلغ واجب السداد للهيئة' : 'رصيد دائن مسترد لك'}</div>
            </div>
            <div className="result-value" dir="ltr" style={{ textAlign: 'right' }}>
              {Math.abs(netVatDue).toFixed(2)} ر.س {netVatDue < 0 && '-'}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: '4px solid #047857' }}>
            <span className="result-label">إجمالي ضريبة المبيعات المحصلة</span>
            <span className="result-value" style={{ color: '#047857' }}>{totalSalesVat.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box" style={{ borderRight: '4px solid #d97706', background: '#f8fafc' }}>
            <span className="result-label">إجمالي ضريبة المشتريات المدفوعة</span>
            <span className="result-value" style={{ color: '#d97706' }}>{totalPurchaseVat.toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث برقم الفاتورة أو النوع..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel} title="تصدير الإقرار بصيغة Excel لدعم اللغة العربية">📥 تصدير الإقرار (Excel)</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 استيراد</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الفاتورة والتاريخ</th>
                <th>نوع المعاملة</th>
                <th>المبلغ (بدون ضريبة)</th>
                <th>الضريبة (15%)</th>
                <th>الإجمالي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    سجل الفواتير فارغ حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSales = item.transactionType.includes('مبيعات');
                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }} dir="ltr">{item.invoiceNumber}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>📅 {item.invoiceDate}</div>
                      </td>
                      <td>
                        <span style={{ color: isSales ? '#047857' : '#d97706', background: isSales ? '#ecfdf5' : '#fffbeb', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.transactionType}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{item.amountBeforeVat} ر.س</td>
                      <td style={{ fontWeight: 800, color: isSales ? '#047857' : '#d97706' }}>{item.vatAmount} ر.س</td>
                      <td style={{ fontWeight: 900 }}>{item.totalAmount} ر.س</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل">✏️</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={3} style={{ textAlign: 'center' }}>الصافي المستحق (زاتكا)</td>
                  <td colSpan={4} style={{ color: netVatDue >= 0 ? '#047857' : '#0284c7', fontSize: '15px' }} dir="ltr">{netVatDue >= 0 ? netVatDue.toFixed(2) : `(${Math.abs(netVatDue).toFixed(2)})`} ر.س</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
