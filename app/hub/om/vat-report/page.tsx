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
  timestamp?: number; // تمت الإضافة للفرز الزمني
}

export default function TaxReturnPreparerQA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('');
  const [amountBeforeVat, setAmountBeforeVat] = useState<number | ''>('');
  const [vatAmount, setVatAmount] = useState<number | ''>('');

  const [items, setItems] = useState<TaxItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all'); // الفرز الزمني
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_qa'));
    
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }

    if (savedLang === 'en') {
      setTransactionType('Sales (Collected Tax) ↗');
    } else {
      setTransactionType('مبيعات (ضريبة محصلة) ↗');
    }
    
    const saved = localStorage.getItem('seerk_qa_tax_return_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: TaxItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_qa_tax_return_items', JSON.stringify(newItems));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setAmountBeforeVat('');
      setVatAmount('');
    } else {
      const numVal = Number(val);
      setAmountBeforeVat(numVal);
      setVatAmount(Number((numVal * 0.05).toFixed(2))); // افتراضي 5% إن وجد
    }
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مجهز بيانات الإقرار الضريبي 📄',
      desc: 'اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل رفع الإقرار الضريبي للهيئة العامة للضرائب (GTA) بقطر بدون أخطاء',
      editRecord: 'تعديل الفاتورة',
      newRecord: 'إضافة فاتورة جديدة للسجل',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      invDate: 'تاريخ الفاتورة',
      invNum: 'رقم الفاتورة (اختياري)',
      invNumPH: 'مثال: INV-1002',
      transType: 'نوع المعاملة',
      optSales: 'مبيعات (ضريبة محصلة) ↗',
      optPurchases: 'مشتريات (ضريبة مدفوعة) ↙️',
      amtBefore: 'المبلغ قبل الضريبة',
      vatAmt: 'قيمة الضريبة المضافة (محسوبة آلياً)',
      vatNote: '* يمكنك تعديل المبلغ يدوياً إذا اختلف عن الفاتورة الأصلية.',
      saveBtnNew: '+ حفظ الفاتورة في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'مؤشرات الإقرار الضريبي الحية',
      netVatDue: 'صافي الضريبة المستحقة (GTA)',
      netVatPos: 'مبلغ واجب السداد للهيئة',
      netVatNeg: 'رصيد دائن مسترد لك',
      totalSalesVat: 'إجمالي ضريبة المبيعات المحصلة',
      totalPurchVat: 'إجمالي ضريبة المشتريات المدفوعة',
      currency: 'ر.ق',
      searchPH: '🔍 بحث برقم الفاتورة أو النوع...',
      exportBtn: '📥 تصدير الإقرار (Excel)',
      importBtn: '📂 استيراد',
      noNum: 'بدون رقم',
      filters: {
        all: 'الكل',
        day: 'آخر يوم',
        week: 'آخر أسبوع',
        month: 'آخر شهر',
        sixMonths: 'آخر 6 أشهر',
        year: 'آخر سنة'
      },
      table: {
        noRecords: 'سجل الفواتير مطابقة لبحثك في السجل.',
        th1: '#',
        th2: 'الفاتورة والتاريخ',
        th3: 'نوع المعاملة',
        th4: 'المبلغ (بدون ضريبة)',
        th5: 'الضريبة',
        th6: 'الإجمالي',
        th7: 'الإجراءات',
        netDue: 'الصافي المستحق (GTA)'
      },
      export: {
        title: 'تقرير الإقرار الضريبي المبدئي',
        salesVat: 'إجمالي ضريبة المبيعات',
        purchVat: 'إجمالي ضريبة المشتريات',
        netVat: 'صافي الضريبة المستحقة (GTA)',
        thDate: 'تاريخ الفاتورة',
        thInvNum: 'رقم الفاتورة',
        thType: 'نوع المعاملة',
        thInputDate: 'تاريخ الإدخال',
        thAmtBefore: 'المبلغ (قبل الضريبة)',
        thVat: 'قيمة الضريبة',
        thTotal: 'المبلغ الإجمالي'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (5 فواتير). يرجى ترقية حسابك لفتح السعة الكاملة!',
        fillErr: 'الرجاء التأكد من تعبئة التاريخ، نوع المعاملة، والمبلغ بشكل صحيح.',
        updateSuccess: '✨ تم تحديث بيانات الفاتورة بنجاح!',
        saveSuccess: '✅ تمت إضافة الفاتورة إلى سجل الإقرار الضريبي بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذه الفاتورة من السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات الفواتير بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Tax Return Preparer 📄',
      desc: 'Collect and organize your sales and purchases to easily file your tax return with Qatar GTA without errors',
      editRecord: 'Edit Invoice',
      newRecord: 'Add New Invoice to Log',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      invDate: 'Invoice Date',
      invNum: 'Invoice Number (Optional)',
      invNumPH: 'e.g. INV-1002',
      transType: 'Transaction Type',
      optSales: 'Sales (Collected Tax) ↗',
      optPurchases: 'Purchases (Paid Tax) ↙️',
      amtBefore: 'Amount Before VAT',
      vatAmt: 'VAT Amount (Auto-calculated)',
      vatNote: '* You can manually edit the amount if it differs from the original invoice.',
      saveBtnNew: '+ Save Invoice to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Live Tax Return Indicators',
      netVatDue: 'Net VAT Due (GTA)',
      netVatPos: 'Amount payable to the authority',
      netVatNeg: 'Creditor balance refundable to you',
      totalSalesVat: 'Total Sales VAT Collected',
      totalPurchVat: 'Total Purchases VAT Paid',
      currency: 'QAR',
      searchPH: '🔍 Search by invoice number or type...',
      exportBtn: '📥 Export Return (Excel)',
      importBtn: '📂 Import',
      noNum: 'No Number',
      filters: {
        all: 'All Time',
        day: 'Last Day',
        week: 'Last Week',
        month: 'Last Month',
        sixMonths: 'Last 6 Months',
        year: 'Last Year'
      },
      table: {
        noRecords: 'No invoices currently match your search.',
        th1: '#',
        th2: 'Invoice & Date',
        th3: 'Transaction Type',
        th4: 'Amount (Excl. VAT)',
        th5: 'VAT',
        th6: 'Total',
        th7: 'Actions',
        netDue: 'Net Due (GTA)'
      },
      export: {
        title: 'Preliminary Tax Return Report',
        salesVat: 'Total Sales VAT',
        purchVat: 'Total Purchases VAT',
        netVat: 'Net VAT Due (GTA)',
        thDate: 'Invoice Date',
        thInvNum: 'Invoice Number',
        thType: 'Transaction Type',
        thInputDate: 'Entry Date',
        thAmtBefore: 'Amount (Excl. VAT)',
        thVat: 'VAT Amount',
        thTotal: 'Total Amount'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (5 invoices). Please upgrade to unlock full capacity!',
        fillErr: 'Please ensure date, transaction type, and amount are filled correctly.',
        updateSuccess: '✨ Invoice data updated successfully!',
        saveSuccess: '✅ Invoice added to tax return log successfully!',
        delConfirm: 'Are you sure you want to delete this invoice from the log?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Invoices data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handleClearForm = () => {
    setInvoiceDate('');
    setInvoiceNumber('');
    setTransactionType(lang === 'en' ? text.optSales : text.optSales);
    setAmountBeforeVat('');
    setVatAmount('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 5 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    
    const amtBefore = typeof amountBeforeVat === 'number' ? amountBeforeVat : 0;
    const vat = typeof vatAmount === 'number' ? vatAmount : 0;
    
    if (!invoiceDate || !transactionType || amtBefore <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const totalAmount = amtBefore + vat;
    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-QA' : 'en-QA';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        invoiceDate,
        invoiceNumber: invoiceNumber || text.noNum,
        transactionType,
        amountBeforeVat: amtBefore,
        vatAmount: vat,
        totalAmount: Number(totalAmount.toFixed(2)),
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: TaxItem = {
        id: Date.now().toString(),
        invoiceDate,
        invoiceNumber: invoiceNumber || text.noNum,
        transactionType,
        amountBeforeVat: amtBefore,
        vatAmount: vat,
        totalAmount: Number(totalAmount.toFixed(2)),
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); // حفظ الجديد في الأعلى
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: TaxItem) => {
    setInvoiceDate(item.invoiceDate);
    setInvoiceNumber(item.invoiceNumber !== 'بدون رقم' && item.invoiceNumber !== 'No Number' ? item.invoiceNumber : '');
    
    const isSales = item.transactionType.includes('مبيعات') || item.transactionType.includes('Sales');
    setTransactionType(isSales ? text.optSales : text.optPurchases);
    
    setAmountBeforeVat(item.amountBeforeVat);
    setVatAmount(item.vatAmount);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  // فلترة النتائج بناءً على البحث والفرز الزمني
  const filteredItems = items.filter(item => {
    const matchesSearch = (item?.invoiceNumber || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
                          (item?.transactionType || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    let matchesDate = true;
    
    if (dateFilter !== 'all') {
      const itemTime = item.timestamp || 0;
      const now = Date.now();
      const diff = now - itemTime;
      const dayMs = 24 * 60 * 60 * 1000;
      
      if (dateFilter === 'day') matchesDate = diff <= dayMs;
      else if (dateFilter === 'week') matchesDate = diff <= 7 * dayMs;
      else if (dateFilter === 'month') matchesDate = diff <= 30 * dayMs;
      else if (dateFilter === '6months') matchesDate = diff <= 180 * dayMs;
      else if (dateFilter === 'year') matchesDate = diff <= 365 * dayMs;
    }
    
    return matchesSearch && matchesDate;
  });

  const salesItems = filteredItems.filter(i => i.transactionType.includes('مبيعات') || i.transactionType.includes('Sales'));
  const purchaseItems = filteredItems.filter(i => i.transactionType.includes('مشتريات') || i.transactionType.includes('Purchases'));

  const totalSalesVat = salesItems.reduce((acc, curr) => acc + curr.vatAmount, 0);
  const totalPurchaseVat = purchaseItems.reduce((acc, curr) => acc + curr.vatAmount, 0);
  
  const netVatDue = totalSalesVat - totalPurchaseVat;

  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
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
            .tfoot-row td { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          </style>
        </head>
        <body>
          <h2>${text.export.title}</h2>
          <p>${text.export.salesVat}: ${totalSalesVat.toFixed(2)} ${text.currency}</p>
          <p>${text.export.purchVat}: ${totalPurchaseVat.toFixed(2)} ${text.currency}</p>
          <p><strong>${text.export.netVat}: ${netVatDue.toFixed(2)} ${text.currency}</strong></p>
          <br/>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.export.thDate}</th>
                <th>${text.export.thInvNum}</th>
                <th>${text.export.thType}</th>
                <th>${text.export.thInputDate}</th>
                <th>${text.export.thAmtBefore} (${text.currency})</th>
                <th>${text.export.thVat} (${text.currency})</th>
                <th>${text.export.thTotal} (${text.currency})</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
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
    link.setAttribute("download", `enjazya_qa_tax_return_data_${dateFilter}.xls`);
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
            const newItems = imported.filter(imp => !items.find(i => i.id === imp.id));
            saveToLocalStorage([...newItems, ...items]);
            alert(text.alerts.importSuccess);
          }
        } catch (err) {
          alert(text.alerts.importErr);
        }
      };
    }
  };

  return (
    <div className="tool-container" lang={lang} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #8A1538; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #8A1538; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #6A102B; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #8A1538; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #8A1538; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #8A1538; color: #8A1538; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/qa" className="back-btn">
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
                <label>{text.invDate}</label>
                <div className="input-wrapper">
                  <input 
                    type="date" 
                    lang={lang === 'ar' ? 'ar-QA' : 'en-US'} 
                    value={invoiceDate} 
                    onChange={(e) => setInvoiceDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="input-group">
                <label>{text.invNum}</label>
                <div className="input-wrapper">
                  <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder={text.invNumPH} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.transType}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                    <option value={text.optSales}>{text.optSales}</option>
                    <option value={text.optPurchases}>{text.optPurchases}</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>{text.amtBefore} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={amountBeforeVat === '' ? '' : amountBeforeVat} onChange={handleAmountChange} placeholder="1000" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.vatAmt} ({text.currency})</label>
              <div className="input-wrapper">
                <input className="with-currency" type="number" step="0.01" min="0" value={vatAmount === '' ? '' : vatAmount} onChange={(e) => setVatAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="50" required />
                <span className="currency-tag">{text.currency}</span>
              </div>
              <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '4px' }}>{text.vatNote}</small>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.analysisTitle}</h2>

          <div className="result-box" style={{ background: netVatDue >= 0 ? 'linear-gradient(135deg, #8A1538 0%, #6A102B 100%)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff' }}>
            <div>
              <div className="result-label" style={{ color: '#fff' }}>{text.netVatDue}</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>{netVatDue >= 0 ? text.netVatPos : text.netVatNeg}</div>
            </div>
            <div className="result-value" dir="ltr" style={{ textAlign: lang === 'ar' ? 'left' : 'right', color: '#fff' }}>
              {Math.abs(netVatDue).toFixed(2)} {text.currency} {netVatDue < 0 && '-'}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #8A1538' : 'none', borderLeft: lang === 'en' ? '4px solid #8A1538' : 'none' }}>
            <span className="result-label">{text.totalSalesVat}</span>
            <span className="result-value" style={{ color: '#8A1538' }}>{totalSalesVat.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #d97706' : 'none', borderLeft: lang === 'en' ? '4px solid #d97706' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.totalPurchVat}</span>
            <span className="result-value" style={{ color: '#d97706' }}>{totalPurchaseVat.toFixed(2)} {text.currency}</span>
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

          <select 
            className="filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">{text.filters.all}</option>
            <option value="day">{text.filters.day}</option>
            <option value="week">{text.filters.week}</option>
            <option value="month">{text.filters.month}</option>
            <option value="sixMonths">{text.filters.sixMonths}</option>
            <option value="year">{text.filters.year}</option>
          </select>

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
                <th>{text.table.th6}</th>
                <th>{text.table.th7}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
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
                        <span style={{ color: isSales ? '#8A1538' : '#d97706', background: isSales ? '#FAF0F2' : '#fffbeb', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.transactionType}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{item.amountBeforeVat} {text.currency}</td>
                      <td style={{ fontWeight: 800, color: isSales ? '#8A1538' : '#d97706' }}>{item.vatAmount} {text.currency}</td>
                      <td style={{ fontWeight: 900 }}>{item.totalAmount} {text.currency}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="✏️">✏️</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="❌">❌</button>
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
                  <td colSpan={3} style={{ textAlign: 'center' }}>{text.table.netDue}</td>
                  <td colSpan={4} style={{ color: netVatDue >= 0 ? '#8A1538' : '#0284c7', fontSize: '15px' }} dir="ltr">{netVatDue >= 0 ? netVatDue.toFixed(2) : `(${Math.abs(netVatDue).toFixed(2)})`} {text.currency}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
