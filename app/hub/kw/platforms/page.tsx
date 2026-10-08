'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface PlatformItem {
  id: string;
  storeName: string;
  platformName: string;
  packageName: string;
  monthlyFee: number;
  expectedMonthlyOrders: number;
  costPerOrder: number;
  createdAt?: string;
}

export default function PlatformFeesCalculatorKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [storeName, setStoreName] = useState<string>('');
  const [platformType, setPlatformType] = useState<string>('سلة (Salla)');
  const [packageName, setPackageName] = useState<string>('');
  const [monthlyFee, setMonthlyFee] = useState<number | ''>(29);
  const [expectedMonthlyOrders, setExpectedMonthlyOrders] = useState<number | ''>(300);

  const [items, setItems] = useState<PlatformItem[]>([]);
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
      setStoreName('Enjazya Store');
      setPlatformType('Salla');
      setPackageName('Salla Pro Package');
    } else {
      setStoreName('متجر إنجازيا');
      setPlatformType('سلة (Salla)');
      setPackageName('باقة سلة الاحترافية');
    }

    const saved = localStorage.getItem('seerk_kw_platform_fees_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: PlatformItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_platform_fees_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة رسوم واشتراكات المنصات (سلة، زد) 🛒',
      desc: 'احسب التكاليف الخفية واشتراكات المنصات لضمان تسعير منتجاتك بشكل صحيح وعادل في السوق الكويتي',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب رسوم منصة جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      selectPlatform: 'اختر المنصة',
      optSalla: 'سلة (Salla)',
      optZid: 'زد (Zid)',
      optOther: 'منصة أخرى',
      storeLabel: 'اسم المتجر',
      storePH: 'متجر إنجازيا',
      packageLabel: 'اسم الباقة (قابل للتعديل)',
      packagePH: 'الباقة الاحترافية',
      feeLabel: 'اشتراك المنصة الشهري',
      ordersLabel: 'عدد الطلبات المتوقعة شهرياً',
      currency: 'د.ك',
      saveBtnNew: '+ حفظ الحساب في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'تحليل تكلفة المنصة الفوري',
      costPerOrderLabel: 'تكلفة اشتراك المنصة محملة على الطلب الواحد',
      costPerOrderSub: 'الخصم الفعلي من كل عملية بيع نظير المنصة',
      monthlyFeeLabel: 'الاشتراك الشهري المدفوع',
      totalOrdersLabel: 'إجمالي الطلبات الشهرية المتوقعة',
      searchPH: '🔍 بحث بالمتجر أو المنصة أو الباقة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد سجلات رسوم منصات مسجلة حالياً.',
        th1: '#',
        th2: 'المتجر والتاريخ',
        th3: 'المنصة والباقة',
        th4: 'الاشتراك الشهري',
        th5: 'الطلبات المتوقعة',
        th6: 'تكلفة المنصة / طلب',
        th7: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي / المتوسط',
        orderUnit: 'طلب'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المتجر، الباقة، وعدد طلبات شهري صحيح.',
        updateSuccess: '✨ تم تحديث السجل بنجاح!',
        saveSuccess: '✅ تمت إضافة السجل إلى قائمة رسوم المنصات بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات رسوم المنصات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Platform Fee Calculator (Salla, Zid) 🛒',
      desc: 'Calculate hidden costs and platform subscriptions to price your products correctly and fairly in Kuwait',
      editRecord: 'Edit Record',
      newRecord: 'Calculate New Platform Fees',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      selectPlatform: 'Select Platform',
      optSalla: 'Salla',
      optZid: 'Zid',
      optOther: 'Other Platform',
      storeLabel: 'Store Name',
      storePH: 'Enjazya Store',
      packageLabel: 'Package Name (Editable)',
      packagePH: 'Pro Package',
      feeLabel: 'Monthly Platform Subscription',
      ordersLabel: 'Expected Monthly Orders',
      currency: 'KWD',
      saveBtnNew: '+ Save Calculation to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Platform Cost Analysis',
      costPerOrderLabel: 'Platform Subscription Cost per Order',
      costPerOrderSub: 'Actual deduction from each sale for platform',
      monthlyFeeLabel: 'Paid Monthly Subscription',
      totalOrdersLabel: 'Total Expected Monthly Orders',
      searchPH: '🔍 Search by store, platform or package...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No platform fee records currently registered.',
        th1: '#',
        th2: 'Store & Date',
        th3: 'Platform & Package',
        th4: 'Monthly Fee',
        th5: 'Expected Orders',
        th6: 'Platform Cost / Order',
        th7: 'Actions',
        totalLabel: 'Grand Total / Average',
        orderUnit: 'orders'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure store name, package, and valid monthly orders are entered.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ Record added to platform fees list successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Platform fees data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handlePlatformChange = (p: string) => {
    setPlatformType(p);
    if (p.includes('سلة') || p.includes('Salla')) {
      setPackageName(lang === 'ar' ? 'باقة سلة الاحترافية' : 'Salla Pro Package');
      setMonthlyFee(29);
    } else if (p.includes('زد') || p.includes('Zid')) {
      setPackageName(lang === 'ar' ? 'باقة زد النموذجية' : 'Zid Growth Package');
      setMonthlyFee(29);
    } else {
      setPackageName(lang === 'ar' ? 'باقة مخصصة' : 'Custom Package');
      setMonthlyFee(19);
    }
  };

  const fee = typeof monthlyFee === 'number' ? monthlyFee : 0;
  const orders = typeof expectedMonthlyOrders === 'number' ? expectedMonthlyOrders : 0;
  const costPerOrder = orders > 0 ? fee / orders : 0;

  const handleClearForm = () => {
    setStoreName(lang === 'ar' ? 'متجر إنجازيا' : 'Enjazya Store');
    setPlatformType(lang === 'ar' ? 'سلة (Salla)' : 'Salla');
    setPackageName(lang === 'ar' ? 'الباقة الاحترافية' : 'Pro Package');
    setMonthlyFee(29);
    setExpectedMonthlyOrders(300);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (fee < 0 || orders <= 0 || !storeName.trim() || !packageName.trim()) {
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
        storeName,
        platformName: platformType,
        packageName,
        monthlyFee: fee,
        expectedMonthlyOrders: orders,
        costPerOrder: Number(costPerOrder.toFixed(3)),
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: PlatformItem = {
        id: Date.now().toString(),
        storeName,
        platformName: platformType,
        packageName,
        monthlyFee: fee,
        expectedMonthlyOrders: orders,
        costPerOrder: Number(costPerOrder.toFixed(3)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: PlatformItem) => {
    setStoreName(item.storeName);
    setPlatformType(item.platformName);
    setPackageName(item.packageName);
    setMonthlyFee(item.monthlyFee);
    setExpectedMonthlyOrders(item.expectedMonthlyOrders);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalMonthlyFees = items.reduce((acc, curr) => acc + curr.monthlyFee, 0);
  const totalMonthlyOrders = items.reduce((acc, curr) => acc + curr.expectedMonthlyOrders, 0);
  const avgCostPerOrder = totalMonthlyOrders > 0 ? totalMonthlyFees / totalMonthlyOrders : 0;

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
          <h2>Platform Fees Calculator Report (KW)</h2>
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
          <td>${row.storeName}</td>
          <td>${row.platformName} (${row.packageName})</td>
          <td>${row.monthlyFee}</td>
          <td>${row.expectedMonthlyOrders}</td>
          <td>${row.costPerOrder}</td>
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
    link.setAttribute("download", "enjazya_kw_platform_fees.xls");
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
    item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.packageName.toLowerCase().includes(searchQuery.toLowerCase())
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

        .radio-group-container { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .radio-box { border: 2px solid #cbd5e1; border-radius: 10px; padding: 10px 5px; text-align: center; cursor: pointer; background: #f8fafc; font-weight: 800; font-size: 13px; color: #475569; transition: all 0.2s; display: flex; align-items: center; justify-content: center; user-select: none; }
        .radio-box.active { border-color: #0284c7; background: #e0f2fe; color: #0369a1; }
        .radio-box input { display: none; }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
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
            {isClient && !isActivated && <span className="trial-badge">{text.trial}: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>{text.selectPlatform}</label>
              <div className="radio-group-container">
                <label className={`radio-box ${platformType.includes('سلة') || platformType === 'Salla' ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType.includes('سلة') || platformType === 'Salla'} onChange={() => handlePlatformChange(lang === 'ar' ? 'سلة (Salla)' : 'Salla')} />
                  {text.optSalla}
                </label>
                <label className={`radio-box ${platformType.includes('زد') || platformType === 'Zid' ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType.includes('زد') || platformType === 'Zid'} onChange={() => handlePlatformChange(lang === 'ar' ? 'زد (Zid)' : 'Zid')} />
                  {text.optZid}
                </label>
                <label className={`radio-box ${platformType.includes('مخصصة') || platformType.includes('Other') ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType.includes('مخصصة') || platformType.includes('Other')} onChange={() => handlePlatformChange(lang === 'ar' ? 'منصة مخصصة' : 'Other Platform')} />
                  {text.optOther}
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.storeLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder={text.storePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.packageLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder={text.packagePH} required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.feeLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={monthlyFee === '' ? '' : monthlyFee} onChange={(e) => setMonthlyFee(e.target.value === '' ? '' : Number(e.target.value))} placeholder="29" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.ordersLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={expectedMonthlyOrders === '' ? '' : expectedMonthlyOrders} onChange={(e) => setExpectedMonthlyOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="300" required />
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

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.costPerOrderLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.costPerOrderSub}</div>
            </div>
            <div className="result-value">
              {costPerOrder.toFixed(3)} {text.currency}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0284c7' : 'none', borderLeft: lang === 'en' ? '4px solid #0284c7' : 'none' }}>
            <span className="result-label">{text.monthlyFeeLabel}</span>
            <span className="result-value" style={{ color: '#0284c7' }}>{fee.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.totalOrdersLabel}</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{orders} {text.table.orderUnit}</span>
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
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.storeName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0284c7' }}>{item.platformName}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{item.packageName}</div>
                    </td>
                    <td>{item.monthlyFee} {text.currency}</td>
                    <td>{item.expectedMonthlyOrders} {text.table.orderUnit}</td>
                    <td style={{ fontWeight: 900, color: '#d97706' }}>{item.costPerOrder} {text.currency}</td>
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
                  <td colSpan={3} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{totalMonthlyFees.toFixed(2)} {text.currency}</td>
                  <td>{totalMonthlyOrders} {text.table.orderUnit}</td>
                  <td style={{ color: '#d97706' }}>{avgCostPerOrder.toFixed(3)} {text.currency}</td>
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
