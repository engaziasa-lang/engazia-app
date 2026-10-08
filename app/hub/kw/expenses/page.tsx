'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ExpenseItem {
  id: string;
  expenseName: string;
  expenseType: string;
  recurrence: string;
  amount: number;
  periodOrNote: string;
  createdAt?: string;
}

export default function ExpensesManagerKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [expenseName, setExpenseName] = useState<string>('');
  const [typeSelect, setTypeSelect] = useState<string>('مصاريف ثابتة');
  const [customType, setCustomType] = useState<string>('مصاريف ثابتة');
  const [recurrence, setRecurrence] = useState<string>('شهري (Monthly)');
  const [amount, setAmount] = useState<number | ''>('');
  const [periodOrNote, setPeriodOrNote] = useState<string>('أكتوبر 2026');

  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    if (savedLang === 'en') {
      setPeriodOrNote('October 2026');
      setRecurrence('Monthly');
    } else {
      setPeriodOrNote('أكتوبر 2026');
      setRecurrence('شهري (Monthly)');
    }

    const saved = localStorage.getItem('seerk_kw_expenses_manager_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ExpenseItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_expenses_manager_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مدير النفقات والمصاريف التشغيلية 💸',
      desc: 'تتبع مصاريف المتجر الثابتة والمتغيرة، وتكرار المصروف (شهري، سنوي، مرة واحدة) لضبط التدفق النقدي في السوق الكويتي',
      editRecord: 'تعديل السجل',
      newRecord: 'إضافة مصروف تشغيلي جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      expNameLabel: 'اسم المصروف أو البند',
      expNamePH: 'مثال: اشتراك المنصة / رواتب الموظفين',
      typeLabel: 'نوع المصروف',
      optFixed: 'مصاريف ثابتة 🏢',
      optVariable: 'مصاريف متغيرة 📦',
      optAds: 'إعلانات تسويقية 📢',
      optSalaries: 'رواتب وأجور 👤',
      optShipping: 'تغليف وشحن 📦',
      optSubs: 'اشتراكات برمجية 💻',
      optCustom: '➕ نوع آخر (كتابة يدوية)',
      customPH: 'اكتب نوع المصروف هنا...',
      recurLabel: 'تكرار المصروف',
      recMonthly: 'شهري (Monthly)',
      recYearly: 'سنوي (Yearly)',
      recOneTime: 'مرة واحدة (One-time)',
      amountLabel: 'مبلغ المصروف',
      periodLabel: 'الفترة أو ملاحظة',
      periodPH: 'أكتوبر 2026',
      currency: 'د.ك',
      saveBtnNew: '+ حفظ المصروف في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات المصاريف الفورية',
      totalExpLabel: 'إجمالي المصاريف التشغيلية',
      totalExpSub: 'مجموع النفقات الخارجة من المتجر',
      fixedLabel: 'المصاريف الثابتة والرواتب',
      variableLabel: 'المصاريف المتغيرة والإعلانات',
      searchPH: '🔍 بحث باسم المصروف أو التكرار...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد مصاريف تشغيلية مسجلة حالياً.',
        th1: '#',
        th2: 'البند والتاريخ',
        th3: 'نوع المصروف',
        th4: 'تكرار المصروف',
        th5: 'الفترة / ملاحظة',
        th6: 'المبلغ',
        th7: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي للمصاريف'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المصروف، النوع، ومبلغ صحيح.',
        updateSuccess: '✨ تم تحديث المصروف بنجاح!',
        saveSuccess: '✅ تمت إضافة المصروف إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا المصروف؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد المصاريف بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Operational Expenses Manager 💸',
      desc: 'Track fixed and variable store expenses, and recurrence (monthly, yearly, one-time) to control cash flow in Kuwait',
      editRecord: 'Edit Record',
      newRecord: 'Add New Operational Expense',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      expNameLabel: 'Expense Name or Item',
      expNamePH: 'e.g. Platform Subscription / Salaries',
      typeLabel: 'Expense Type',
      optFixed: 'Fixed Expenses 🏢',
      optVariable: 'Variable Expenses 📦',
      optAds: 'Marketing Ads 📢',
      optSalaries: 'Salaries & Wages 👤',
      optShipping: 'Packaging & Shipping 📦',
      optSubs: 'Software Subscriptions 💻',
      optCustom: '➕ Other (Custom)',
      customPH: 'Type expense type here...',
      recurLabel: 'Expense Recurrence',
      recMonthly: 'Monthly',
      recYearly: 'Yearly',
      recOneTime: 'One-time',
      amountLabel: 'Expense Amount',
      periodLabel: 'Period or Note',
      periodPH: 'October 2026',
      currency: 'KWD',
      saveBtnNew: '+ Save Expense to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Expense Indicators',
      totalExpLabel: 'Total Operational Expenses',
      totalExpSub: 'Sum of outgoing store expenses',
      fixedLabel: 'Fixed Expenses & Salaries',
      variableLabel: 'Variable Expenses & Ads',
      searchPH: '🔍 Search by expense name or recurrence...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No operational expenses currently registered.',
        th1: '#',
        th2: 'Item & Date',
        th3: 'Expense Type',
        th4: 'Recurrence',
        th5: 'Period / Note',
        th6: 'Amount',
        th7: 'Actions',
        totalLabel: 'Grand Total Expenses'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure expense name, type, and a valid amount are entered.',
        updateSuccess: '✨ Expense updated successfully!',
        saveSuccess: '✅ Expense added to log successfully!',
        delConfirm: 'Are you sure you want to delete this expense?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Expenses imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const expAmount = typeof amount === 'number' ? amount : 0;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTypeSelect(val);
    if (val !== 'نوع آخر (كتابة يدوية)' && val !== 'Other (Custom)') {
      setCustomType(val);
    } else {
      setCustomType('');
    }
  };

  const handleClearForm = () => {
    setExpenseName('');
    setTypeSelect('مصاريف ثابتة');
    setCustomType('مصاريف ثابتة');
    setRecurrence(lang === 'ar' ? 'شهري (Monthly)' : 'Monthly');
    setAmount('');
    setPeriodOrNote(lang === 'ar' ? 'أكتوبر 2026' : 'October 2026');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalType = (typeSelect === 'نوع آخر (كتابة يدوية)' || typeSelect === 'Other (Custom)') ? customType : typeSelect;
    if (!expenseName.trim() || expAmount <= 0 || !finalType.trim()) {
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
        expenseName,
        expenseType: finalType,
        recurrence,
        amount: expAmount,
        periodOrNote,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: ExpenseItem = {
        id: Date.now().toString(),
        expenseName,
        expenseType: finalType,
        recurrence,
        amount: expAmount,
        periodOrNote,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: ExpenseItem) => {
    setExpenseName(item.expenseName);
    const standardTypes = ['مصاريف ثابتة', 'مصاريف متغيرة', 'إعلانات تسويقية', 'رواتب وأجور', 'تغليف وشحن', 'اشتراكات برمجية', 'Fixed Expenses', 'Variable Expenses', 'Marketing Ads', 'Salaries & Wages', 'Packaging & Shipping', 'Software Subscriptions'];
    if (standardTypes.includes(item.expenseType)) {
      setTypeSelect(item.expenseType);
      setCustomType(item.expenseType);
    } else {
      setTypeSelect(lang === 'ar' ? 'نوع آخر (كتابة يدوية)' : 'Other (Custom)');
      setCustomType(item.expenseType);
    }
    setRecurrence(item.recurrence || (lang === 'ar' ? 'شهري (Monthly)' : 'Monthly'));
    setAmount(item.amount);
    setPeriodOrNote(item.periodOrNote);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalFixedExpenses = items.filter(i => i.expenseType.includes('ثابتة') || i.expenseType.includes('رواتب') || i.expenseType.includes('اشتراكات') || i.expenseType.includes('Fixed') || i.expenseType.includes('Salaries')).reduce((acc, curr) => acc + curr.amount, 0);
  const totalVariableExpenses = items.filter(i => !i.expenseType.includes('ثابتة') && !i.expenseType.includes('رواتب') && !i.expenseType.includes('اشتراكات') && !i.expenseType.includes('Fixed') && !i.expenseType.includes('Salaries')).reduce((acc, curr) => acc + curr.amount, 0);
  const grandTotalExpenses = items.reduce((acc, curr) => acc + curr.amount, 0);

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
          <h2>Expenses Manager Report (KW)</h2>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>${text.table.th5}</th>
                <th>${text.table.th6}</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.expenseName}</td>
          <td>${row.expenseType}</td>
          <td>${row.recurrence}</td>
          <td>${row.periodOrNote}</td>
          <td>${row.amount}</td>
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
    link.setAttribute("download", "enjazya_kw_expenses.xls");
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
    item.expenseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.expenseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.recurrence || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.periodOrNote.toLowerCase().includes(searchQuery.toLowerCase())
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
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2); }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .danger .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

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
            {isClient && !isActivated && <span className="trial-badge">{text.trial}: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>{text.expNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} placeholder={text.expNamePH} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.typeLabel}</label>
                <div className="input-wrapper">
                  <select value={typeSelect} onChange={handleSelectChange}>
                    <option value={lang === 'ar' ? 'مصاريف ثابتة' : 'Fixed Expenses'}>{text.optFixed}</option>
                    <option value={lang === 'ar' ? 'مصاريف متغيرة' : 'Variable Expenses'}>{text.optVariable}</option>
                    <option value={lang === 'ar' ? 'إعلانات تسويقية' : 'Marketing Ads'}>{text.optAds}</option>
                    <option value={lang === 'ar' ? 'رواتب وأجور' : 'Salaries & Wages'}>{text.optSalaries}</option>
                    <option value={lang === 'ar' ? 'تغليف وشحن' : 'Packaging & Shipping'}>{text.optShipping}</option>
                    <option value={lang === 'ar' ? 'اشتراكات برمجية' : 'Software Subscriptions'}>{text.optSubs}</option>
                    <option value={lang === 'ar' ? 'نوع آخر (كتابة يدوية)' : 'Other (Custom)'}>{text.optCustom}</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>{text.recurLabel}</label>
                <div className="input-wrapper">
                  <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                    <option value={lang === 'ar' ? 'شهري (Monthly)' : 'Monthly'}>{text.recMonthly}</option>
                    <option value={lang === 'ar' ? 'سنوي (Yearly)' : 'Yearly'}>{text.recYearly}</option>
                    <option value={lang === 'ar' ? 'مرة واحدة (One-time)' : 'One-time'}>{text.recOneTime}</option>
                  </select>
                </div>
              </div>
            </div>

            {(typeSelect === 'نوع آخر (كتابة يدوية)' || typeSelect === 'Other (Custom)') && (
              <div className="input-group">
                <label>{text.customPH}</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customType} 
                    onChange={(e) => setCustomType(e.target.value)} 
                    placeholder={text.customPH} 
                    required 
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="input-group">
                <label>{text.amountLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={amount === '' ? '' : amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="15" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.periodLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={periodOrNote} onChange={(e) => setPeriodOrNote(e.target.value)} placeholder={text.periodPH} required />
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.resultsTitle}</h2>

          <div className="result-box danger">
            <div>
              <div className="result-label">{text.totalExpLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalExpSub}</div>
            </div>
            <div className="result-value">
              {grandTotalExpenses.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0284c7' : 'none', borderLeft: lang === 'en' ? '4px solid #0284c7' : 'none' }}>
            <span className="result-label">{text.fixedLabel}</span>
            <span className="result-value" style={{ color: '#0284c7' }}>{totalFixedExpenses.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #d97706' : 'none', borderLeft: lang === 'en' ? '4px solid #d97706' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.variableLabel}</span>
            <span className="result-value" style={{ color: '#d97706' }}>{totalVariableExpenses.toFixed(2)} {text.currency}</span>
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
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.expenseName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#0284c7' }}>{item.expenseType}</span></td>
                    <td>
                      <span style={{ fontWeight: 800, color: item.recurrence?.includes('شهري') || item.recurrence?.includes('Monthly') ? '#0284c7' : item.recurrence?.includes('سنوي') || item.recurrence?.includes('Yearly') ? '#d97706' : '#475569', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>
                        {item.recurrence || 'شهري (Monthly)'}
                      </span>
                    </td>
                    <td>{item.periodOrNote}</td>
                    <td style={{ fontWeight: 900, color: '#dc2626' }}>{item.amount} {text.currency}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={5} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td style={{ color: '#dc2626' }}>{grandTotalExpenses.toFixed(2)} {text.currency}</td>
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
