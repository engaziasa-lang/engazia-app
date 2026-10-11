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
  timestamp?: number;
}

export default function PlatformFeesCalculatorBH() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  
  const [storeName, setStoreName] = useState<string>('');
  const [platformType, setPlatformType] = useState<string>('');
  const [packageName, setPackageName] = useState<string>('');
  const [monthlyFee, setMonthlyFee] = useState<number | ''>(15);
  const [expectedMonthlyOrders, setExpectedMonthlyOrders] = useState<number | ''>(300);

  const [items, setItems] = useState<PlatformItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_bh'));

    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    if (savedLang === 'en') {
      setStoreName('Enjazya Store');
      setPlatformType('Shopify');
      setPackageName('Basic Plan');
    } else {
      setStoreName('متجر إنجازيا');
      setPlatformType('شوبيفاي (Shopify)');
      setPackageName('الباقة القياسية (Basic)');
    }

    const saved = localStorage.getItem('seerk_bh_platform_fees_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: PlatformItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_bh_platform_fees_items', JSON.stringify(newItems));
  };

  const fee = typeof monthlyFee === 'number' ? monthlyFee : 0;
  const orders = typeof expectedMonthlyOrders === 'number' ? expectedMonthlyOrders : 0;

  const costPerOrder = orders > 0 ? fee / orders : 0;

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة رسوم واشتراكات المنصات (شوبيفاي، ووكومرس) 🛒',
      desc: 'احسب التكاليف الخفية واشتراكات المنصات العالمية والمحلية بالبحرين لضمان تسعير منتجاتك بشكل صحيح وعادل',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب رسوم منصة جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      platformLabel: 'اختر المنصة',
      optShopify: 'شوبيفاي (Shopify)',
      optWoo: 'ووكومرس (WooCommerce)',
      optCustom: 'منصة مخصصة',
      storeNameLabel: 'اسم المتجر',
      storeNamePH: 'متجر إنجازيا',
      pkgLabel: 'اسم الباقة (قابل للتعديل)',
      pkgPH: 'الباقة القياسية',
      pkgShopifyDef: 'باقة شوبيفاي الأساسية',
      pkgWooDef: 'استضافة ووكومرس',
      pkgCustomDef: 'باقة مخصصة',
      feeLabel: 'اشتراك المنصة الشهري',
      ordersLabel: 'عدد الطلبات المتوقعة شهرياً',
      saveBtnNew: '+ حفظ الحساب في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'تحليل تكلفة المنصة الفوري',
      costPerOrderLabel: 'تكلفة اشتراك المنصة محملة على الطلب الواحد',
      costPerOrderSub: 'الخصم الفعلي من كل عملية بيع نظير المنصة',
      monthlyFeeLabel: 'الاشتراك الشهري المدفوع',
      totalOrdersLabel: 'إجمالي الطلبات الشهرية المتوقعة',
      currency: 'د.ب',
      ordersUnit: 'طلب',
      searchPH: '🔍 بحث بالمتجر أو المنصة أو الباقة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      filters: {
        all: 'الكل',
        day: 'آخر يوم',
        week: 'آخر أسبوع',
        month: 'آخر شهر',
        sixMonths: 'آخر 6 أشهر',
        year: 'آخر سنة'
      },
      table: {
        noRecords: 'لا توجد سجلات رسوم منصات تطابق بحثك.',
        th1: '#',
        th2: 'المتجر والتاريخ',
        th3: 'المنصة والباقة',
        th4: 'الاشتراك الشهري',
        th5: 'الطلبات المتوقعة',
        th6: 'تكلفة المنصة / طلب',
        th7: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي / المتوسط'
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
      title: 'Platform Fees Calculator (Shopify, WooCommerce) 🛒',
      desc: 'Calculate hidden costs and global platform subscriptions to price your products correctly and fairly in Bahrain',
      editRecord: 'Edit Record',
      newRecord: 'Calculate New Platform Fees',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      platformLabel: 'Select Platform',
      optShopify: 'Shopify',
      optWoo: 'WooCommerce',
      optCustom: 'Custom Platform',
      storeNameLabel: 'Store Name',
      storeNamePH: 'Enjazya Store',
      pkgLabel: 'Package Name (Editable)',
      pkgPH: 'Basic Plan',
      pkgShopifyDef: 'Shopify Basic Plan',
      pkgWooDef: 'WooCommerce Hosting',
      pkgCustomDef: 'Custom Plan',
      feeLabel: 'Monthly Platform Subscription',
      ordersLabel: 'Expected Monthly Orders',
      saveBtnNew: '+ Save Calculation to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Platform Cost Analysis',
      costPerOrderLabel: 'Platform Subscription Cost per Order',
      costPerOrderSub: 'Actual deduction from each sale for the platform',
      monthlyFeeLabel: 'Paid Monthly Subscription',
      totalOrdersLabel: 'Total Expected Monthly Orders',
      currency: 'BHD',
      ordersUnit: 'order(s)',
      searchPH: '🔍 Search by store, platform, or package...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      filters: {
        all: 'All Time',
        day: 'Last Day',
        week: 'Last Week',
        month: 'Last Month',
        sixMonths: 'Last 6 Months',
        year: 'Last Year'
      },
      table: {
        noRecords: 'No platform fee records match your search.',
        th1: '#',
        th2: 'Store & Date',
        th3: 'Platform & Package',
        th4: 'Monthly Sub.',
        th5: 'Expected Orders',
        th6: 'Platform Cost / Order',
        th7: 'Actions',
        totalLabel: 'Grand Total / Average'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure store name, package, and valid monthly orders are filled.',
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
    if (p === text.optShopify) {
      setPackageName(text.pkgShopifyDef);
      setMonthlyFee(15);
    } else if (p === text.optWoo) {
      setPackageName(text.pkgWooDef);
      setMonthlyFee(10);
    } else {
      setPackageName(text.pkgCustomDef);
      setMonthlyFee(20);
    }
  };

  const handleClearForm = () => {
    setStoreName(lang === 'ar' ? 'متجر إنجازيا' : 'Enjazya Store');
    setPlatformType(text.optShopify);
    setPackageName(lang === 'ar' ? 'الباقة القياسية' : 'Basic Plan');
    setMonthlyFee(15);
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
    const localeStr = lang === 'ar' ? 'ar-BH' : 'en-BH';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        storeName,
        platformName: platformType,
        packageName,
        monthlyFee: fee,
        expectedMonthlyOrders: orders,
        costPerOrder: Number(costPerOrder.toFixed(2)),
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
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
        costPerOrder: Number(costPerOrder.toFixed(2)),
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); 
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: PlatformItem) => {
    setStoreName(item.storeName);
    
    const isShopify = item.platformName.toLowerCase().includes('shopify') || item.platformName.includes('شوبيفاي');
    const isWoo = item.platformName.toLowerCase().includes('woo') || item.platformName.includes('ووكومرس');

    let matchedPlatform = '';
    if (isShopify) matchedPlatform = text.optShopify;
    else if (isWoo) matchedPlatform = text.optWoo;
    else matchedPlatform = text.optCustom;

    setPlatformType(matchedPlatform);
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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.packageName.toLowerCase().includes(searchQuery.toLowerCase());
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

  const totalMonthlyFees = filteredItems.reduce((acc, curr) => acc + curr.monthlyFee, 0);
  const totalMonthlyOrders = filteredItems.reduce((acc, curr) => acc + curr.expectedMonthlyOrders, 0);
  const avgCostPerOrder = totalMonthlyOrders > 0 ? totalMonthlyFees / totalMonthlyOrders : 0;

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
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.storeNameLabel}</th>
                <th>Date / Time</th>
                <th>${text.table.th3.split(' ')[0]}</th>
                <th>${text.pkgLabel.split(' ')[0]}</th>
                <th>${text.table.th4} (${text.currency})</th>
                <th>${text.table.th5}</th>
                <th>${text.table.th6} (${text.currency})</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.storeName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.platformName}</td>
          <td>${row.packageName}</td>
          <td>${row.monthlyFee}</td>
          <td>${row.expectedMonthlyOrders}</td>
          <td>${row.costPerOrder}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">${text.table.totalLabel}</td>
                <td>${totalMonthlyFees.toFixed(2)}</td>
                <td>${totalMonthlyOrders}</td>
                <td>${avgCostPerOrder.toFixed(2)} ${text.currency}</td>
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
    link.setAttribute("download", `enjazya_bh_platform_fees_${dateFilter}.xls`);
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
    <div className="tool-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
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

        .radio-group-container { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .radio-box { border: 2px solid #cbd5e1; border-radius: 8px; padding: 10px 5px; text-align: center; cursor: pointer; background: #f8fafc; font-weight: 800; font-size: 13px; color: #475569; transition: all 0.2s; display: flex; align-items: center; justify-content: center; user-select: none; }
        .radio-box.active { border-color: #CE1126; background: #FDECEE; color: #CE1126; }
        .radio-box input { display: none; }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus { border-color: #CE1126; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #CE1126; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #A60E1E; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #CE1126 0%, #A60E1E 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 26px; color: #ffffff; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #CE1126; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #CE1126; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #CE1126; color: #CE1126; }

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
        <Link href="/hub/bh" className="back-btn">
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
              <label>{text.platformLabel}</label>
              <div className="radio-group-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                <label className={`radio-box ${platformType === text.optShopify ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType === text.optShopify} onChange={() => handlePlatformChange(text.optShopify)} />
                  {text.optShopify.split(' ')[0]}
                </label>
                <label className={`radio-box ${platformType === text.optWoo ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType === text.optWoo} onChange={() => handlePlatformChange(text.optWoo)} />
                  {text.optWoo.split(' ')[0]}
                </label>
                <label className={`radio-box ${platformType === text.optCustom ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType === text.optCustom} onChange={() => handlePlatformChange(text.optCustom)} />
                  {lang === 'ar' ? 'منصة أخرى' : 'Other Platform'}
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.storeNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder={text.storeNamePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.pkgLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder={text.pkgPH} required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.feeLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={monthlyFee === '' ? '' : monthlyFee} onChange={(e) => setMonthlyFee(e.target.value === '' ? '' : Number(e.target.value))} placeholder="15" required />
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
          <h2 className="card-title">{text.analysisTitle}</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.costPerOrderLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.costPerOrderSub}</div>
            </div>
            <div className="result-value">
              {costPerOrder.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.monthlyFeeLabel}</span>
            <span className="result-value" style={{ color: '#CE1126' }}>{fee.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.totalOrdersLabel}</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{orders} {text.ordersUnit}</span>
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
            <button className="t-btn" onClick={handleExportExcel}>
              {lang === 'ar' ? 'تصدير 📥' : 'Export 📥'}
            </button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>
              {lang === 'ar' ? 'استيراد 📂' : 'Import 📂'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{text.table.th1}</th>
                <th>{text.storeNameLabel}</th>
                <th>Date / Time</th>
                <th>{text.table.th3.split(' ')[0]}</th>
                <th>{text.pkgLabel.split(' ')[0]}</th>
                <th>{text.table.th4} ({text.currency})</th>
                <th>{text.table.th5}</th>
                <th>{text.table.th6} ({text.currency})</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.storeName}</td>
                    <td>{item.createdAt || '-'}</td>
                    <td><span style={{ fontWeight: 800, color: '#CE1126' }}>{item.platformName}</span></td>
                    <td>{item.packageName}</td>
                    <td>{item.monthlyFee}</td>
                    <td>{item.expectedMonthlyOrders}</td>
                    <td style={{ fontWeight: 900, color: '#047857' }}>{item.costPerOrder}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="✏️">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="❌">❌</button>
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
                  <td>{totalMonthlyFees.toFixed(2)}</td>
                  <td>{totalMonthlyOrders}</td>
                  <td style={{ color: '#047857' }}>{avgCostPerOrder.toFixed(2)} {text.currency}</td>
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
