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

export default function TaxReturnPreparerKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('مبيعات تجارية ↗️');
  const [amountBeforeVat, setAmountBeforeVat] = useState<number | ''>('');
  const [vatAmount, setVatAmount] = useState<number | ''>(0);

  const [items, setItems] = useState<TaxItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    if (savedLang === 'en') {
      setTransactionType('Commercial Sales ↗️');
    } else {
      setTransactionType('مبيعات تجارية ↗️');
    }

    const saved = localStorage.getItem('seerk_kw_tax_return_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: TaxItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_tax_return_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مجهز سجلات المبيعات والمشتريات 📄',
      desc: 'اجمع ورتب بيانات مبيعاتك ومشترياتك التجارية بدقة بالدينار الكويتي في السوق الكويتي',
      editRecord: 'تعديل الفاتورة',
      newRecord: 'إضافة معاملة جديدة للسجل',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      invDateLabel: 'تاريخ المعاملة',
      invNumLabel: 'رقم الفاتورة أو المستند (اختياري)',
      invNumPH: 'مثال: INV-1002',
      transTypeLabel: 'نوع المعاملة',
      optSales: 'مبيعات تجارية ↗️',
      optPurchases: 'مشتريات وتكاليف ↙️',
      amtLabel: 'قيمة المعاملة الإجمالية',
      vatNote: '* السوق الكويتي خالٍ من ضريبة القيمة المضافة الحالية، يتم تسجيل القيم الصافية.',
      currency: 'د.ك',
      saveBtnNew: '+ حفظ المعاملة في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات الأداء المالي الحية',
      netVatLabel: 'صافي التدفق التجاري (المبيعات - المشتريات)',
      netVatSubPay: 'إجمالي العائد الصافي',
      salesVatLabel: 'إجمالي المبيعات المحققة',
      purchasesVatLabel: 'إجمالي المشتريات والتكاليف',
      searchPH: '🔍 بحث برقم الفاتورة أو النوع...',
      exportBtn: '📥 تصدير السجل (Excel)',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'سجل المعاملات فارغ حالياً.',
        th1: '#',
        th2: 'المستند والتاريخ',
        th3: 'نوع المعاملة',
        th4: 'القيمة المالية',
        th5: 'الإجراءات',
        editAction: '✏️',
        delAction: '❌',
        noNum: 'بدون رقم',
        totalLabel: 'صافي الربح التشغيلي الإجمالي'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (5 فواتير). يرجى ترقية حسابك لفتح السعة الكاملة!',
        fillErr: 'الرجاء التأكد من تعبئة التاريخ، نوع المعاملة، والمبلغ بشكل صحيح.',
        updateSuccess: '✨ تم تحديث بيانات المعاملة بنجاح!',
        saveSuccess: '✅ تمت إضافة المعاملة إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذه المعاملة من السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات الفواتير بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Sales & Purchases Log Preparer 📄',
      desc: 'Collect and organize your commercial sales and purchase data accurately in KWD for the Kuwaiti market',
      editRecord: 'Edit Invoice',
      newRecord: 'Add New Transaction to Log',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      invDateLabel: 'Transaction Date',
      invNumLabel: 'Invoice Number (Optional)',
      invNumPH: 'e.g. INV-1002',
      transTypeLabel: 'Transaction Type',
      optSales: 'Commercial Sales ↗️',
      optPurchases: 'Purchases & Costs ↙️',
      amtLabel: 'Total Transaction Amount',
      vatNote: '* Kuwait market is currently tax-free; net values are recorded.',
      currency: 'KWD',
      saveBtnNew: '+ Save Transaction to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Live Financial Indicators',
      netVatLabel: 'Net Commercial Flow (Sales - Purchases)',
      netVatSubPay: 'Total Net Revenue',
      salesVatLabel: 'Total Realized Sales',
      purchasesVatLabel: 'Total Purchases & Costs',
      searchPH: '🔍 Search by invoice number or type...',
      exportBtn: '📥 Export Log (Excel)',
      importBtn: '📂 Import',
      table: {
        noRecords: 'Transaction log is currently empty.',
        th1: '#',
        th2: 'Document & Date',
        th3: 'Transaction Type',
        th4: 'Amount',
        th5: 'Actions',
        editAction: '✏️',
        delAction: '❌',
        noNum: 'No Number',
        totalLabel: 'Net Operating Profit'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (5 invoices). Please upgrade to unlock full capacity!',
        fillErr: 'Please ensure date, transaction type, and amount are entered correctly.',
        updateSuccess: '✨ Transaction data updated successfully!',
        saveSuccess: '✅ Transaction added to log successfully!',
        delConfirm: 'Are you sure you want to delete this transaction from log?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Transaction data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handleClearForm = () => {
    setInvoiceDate('');
    setInvoiceNumber('');
    setTransactionType(lang === 'ar' ? 'مبيعات تجارية ↗️' : 'Commercial Sales ↗️');
    setAmountBeforeVat('');
    setVatAmount(0);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 5 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    
    const amtBefore = typeof amountBeforeVat === 'number' ? amountBeforeVat : 0;
    
    if (!invoiceDate || !transactionType || amtBefore <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-KW' : 'en-KW';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        invoiceDate,
        invoiceNumber: invoiceNumber || text.table.noNum,
        transactionType,
        amountBeforeVat: amtBefore,
        vatAmount: 0,
        totalAmount: Number(amtBefore.toFixed(3)),
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: TaxItem = {
        id: Date.now().toString(),
        invoiceDate,
        invoiceNumber: invoiceNumber || text.table.noNum,
        transactionType,
        amountBeforeVat: amtBefore,
        vatAmount: 0,
        totalAmount: Number(amtBefore.toFixed(3)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: TaxItem) => {
    setInvoiceDate(item.invoiceDate);
    setInvoiceNumber(item.invoiceNumber !== text.table.noNum ? item.invoiceNumber : '');
    setTransactionType(item.transactionType);
    setAmountBeforeVat(item.amountBeforeVat);
    setVatAmount(0);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const salesItems = items.filter(i => i.transactionType.includes('مبيعات') || i.transactionType.includes('Sales'));
  const purchaseItems = items.filter(i => i.transactionType.includes('مشتريات') || i.transactionType.includes('Purchases'));

  const totalSalesAmount = salesItems.reduce((acc, curr) => acc + curr.amountBeforeVat, 0);
  const totalPurchaseAmount = purchaseItems.reduce((acc, curr) => acc + curr.amountBeforeVat, 0);
  
  const netFlow = totalSalesAmount - totalPurchaseAmount;

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert(text.alerts.noDataExp);
      return;
    }

    let tableHtml = `
      <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
            th { background-color: #f8fafc; font-weight: bold; color: #334155; }
          </style>
        </head>
        <body>
          <h2>Sales & Purchases Log Report (KW)</h2>
          <p>Total Sales: ${totalSalesAmount.toFixed(3)} ${text.currency}</p>
          <p>Total Purchases: ${totalPurchaseAmount.toFixed(3)} ${text.currency}</p>
          <p><strong>Net Flow: ${netFlow.toFixed(3)} ${text.currency}</strong></p>
          <br/>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>${text.table.th5}</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.invoiceNumber} (${row.invoiceDate})</td>
          <td>${row.transactionType}</td>
          <td>${row.amountBeforeVat}</td>
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
    link.setAttribute("download", "enjazya_kw_tax_return.xls");
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
            alert(text.alerts.importSuccess);
          }
        } catch (err) {
          alert(text.alerts.importErr);
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    (item?.invoiceNumber || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (item?.transactionType || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div className="tool-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f1f5f9; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 10px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f8fafc; color: #0f172a; border-color: #0284c7; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2); }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .t-btn:hover { background: #f1f5f9; color: #0284c7; border-color: #0284c7; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit; transition: all 0.2s; }
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-edit:hover { background: #bae6fd; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-delete:hover { background: #fca5a5; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/kw" className="back-btn">
          {text.back}
        </Link>
      </div>

      <div className="grid-layout">
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span>{editingId ? text.editRecord : text.newRecord}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm}>
                {text.clear}
              </button>
            </div>
            {isClient && !isActivated && <span className="trial-badge">{text.trial}: {items.length}/5</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>{text.invDateLabel}</label>
                <div className="input-wrapper">
                  <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.invNumLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder={text.invNumPH} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.transTypeLabel}</label>
                <div className="input-wrapper">
                  <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                    <option value={lang === 'ar' ? 'مبيعات تجارية ↗️' : 'Commercial Sales ↗️'}>{text.optSales}</option>
                    <option value={lang === 'ar' ? 'مشتريات وتكاليف ↙️' : 'Purchases & Costs ↙️'}>{text.optPurchases}</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>{text.amtLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.001" min="0" value={amountBeforeVat === '' ? '' : amountBeforeVat} onChange={(e) => setAmountBeforeVat(e.target.value === '' ? '' : Number(e.target.value))} placeholder="100" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginBottom: '15px' }}>{text.vatNote}</small>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.resultsTitle}</h2>

          <div className="result-box primary" style={{ background: netFlow >= 0 ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
            <div>
              <div className="result-label">{text.netVatLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>{text.netVatSubPay}</div>
            </div>
            <div className="result-value">
              {Math.abs(netFlow).toFixed(3)} {text.currency} {netFlow < 0 && '-'}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0284c7' : 'none', borderLeft: lang === 'en' ? '4px solid #0284c7' : 'none' }}>
            <span className="result-label">{text.salesVatLabel}</span>
            <span className="result-value" style={{ color: '#0284c7' }}>{totalSalesAmount.toFixed(3)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #d97706' : 'none', borderLeft: lang === 'en' ? '4px solid #d97706' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.purchasesVatLabel}</span>
            <span className="result-value" style={{ color: '#d97706' }}>{totalPurchaseAmount.toFixed(3)} {text.currency}</span>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder={text.searchPH} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel}>{text.exportBtn}</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>{text.importBtn}</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{text.table.th1}</th>
                <th>{text.table.th2}</th>
                <th>{text.table.th3}</th>
                <th>{text.table.th4}</th>
                <th>{text.table.th5}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSales = item.transactionType.includes('مبيعات') || item.transactionType.includes('Sales');
                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }} dir="ltr">{item.invoiceNumber}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>📅 {item.invoiceDate}</div>
                      </td>
                      <td>
                        <span style={{ color: isSales ? '#0284c7' : '#d97706', background: isSales ? '#e0f2fe' : '#fffbeb', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.transactionType}
                        </span>
                      </td>
                      <td style={{ fontWeight: 900, color: isSales ? '#0284c7' : '#d97706' }}>{item.amountBeforeVat.toFixed(3)} {text.currency}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">{text.table.editAction}</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">{text.table.delAction}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={3} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td colSpan={2} style={{ color: netFlow >= 0 ? '#0284c7' : '#dc2626', fontSize: '15px' }}>
                    {netFlow >= 0 ? netFlow.toFixed(3) : `(${Math.abs(netFlow).toFixed(3)})`} {text.currency}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
