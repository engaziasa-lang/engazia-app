'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface GrowthItem {
  id: string;
  strategyName: string;
  category: string;
  description: string;
  executionStatus: string;
  createdAt?: string;
  timestamp?: number;
}

export default function StoreGrowthSecretsBH() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [strategyName, setStrategyName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const [categorySelect, setCategorySelect] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [executionStatus, setExecutionStatus] = useState<string>('');

  const [items, setItems] = useState<GrowthItem[]>([]);
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
      setCategorySelect('Increase Conversion Rate 🚀');
      setExecutionStatus('Not Started ⏸️');
    } else {
      setCategorySelect('زيادة معدل التحويل 🚀');
      setExecutionStatus('لم تبدأ ⏸️');
    }

    const saved = localStorage.getItem('seerk_bh_growth_secrets_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: GrowthItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_bh_growth_secrets_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'أسرار نمو المتاجر البحرينية 💡',
      desc: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء في السوق البحريني',
      editRecord: 'تعديل خطة النمو',
      newRecord: 'إضافة استراتيجية نمو جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      stratName: 'اسم الاستراتيجية / الفكرة الترويجية',
      stratNamePH: 'مثال: تفعيل الدفع بـ تابي / تمارا أو برنامج ولاء النقاط',
      category: 'تصنيف الاستراتيجية',
      catConversion: 'زيادة معدل التحويل 🚀',
      catLoyalty: 'رفع ولاء العملاء 🤝',
      catCarts: 'استرداد السلات المتروكة 🛒',
      catOther: '➕ تصنيف آخر (كتابة يدوية)',
      otherPH: 'اكتب التصنيف هنا...',
      statusLabel: 'حالة التنفيذ الحالية',
      statNotStarted: 'لم تبدأ ⏸️',
      statInProgress: 'قيد التنفيذ ⏳',
      statCompleted: 'مكتملة ومفعلة ✅',
      descLabel: 'وصف الاستراتيجية وخطوات التنفيذ بالمتجر',
      descPH: 'اكتب تفاصيل الفكرة وكيفية تطبيقها للرجوع إليها لاحقاً...',
      saveBtnNew: '+ إضافة الاستراتيجية للمكتبة',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'مؤشرات تطبيق خطط النمو',
      totalStrats: 'إجمالي الاستراتيجيات المسجلة',
      totalStratsSub: 'مكتبة الأفكار الترويجية',
      completedStrats: 'الاستراتيجيات المكتملة والمفعلة',
      progressRate: 'مؤشر التقدم في التطبيق',
      searchPH: '🔍 بحث باسم الاستراتيجية أو التصنيف...',
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
        noRecords: 'مكتبة النمو تطابق بحثك حالياً. ابدأ بإضافة استراتيجيات جديدة.',
        th1: '#',
        th2: 'الاستراتيجية والتاريخ',
        th3: 'التصنيف',
        th4: 'الوصف / الملاحظات',
        th5: 'حالة التنفيذ',
        th6: 'الإجراءات',
        noDesc: 'بدون وصف',
        totalLabel: 'إجمالي الاستراتيجيات والخطط المعروضة',
        planUnit: 'خطة'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 استراتيجيات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم الاستراتيجية وتحديد التصنيف.',
        updateSuccess: '✨ تم تحديث الاستراتيجية بنجاح!',
        saveSuccess: '✅ تمت إضافة الاستراتيجية إلى مكتبة النمو بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذه الاستراتيجية؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد مكتبة الاستراتيجيات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Bahrain Store Growth Secrets 💡',
      desc: 'Exclusive library of strategies to increase conversions and boost customer loyalty in the Bahrain market',
      editRecord: 'Edit Growth Plan',
      newRecord: 'Add New Growth Strategy',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      stratName: 'Strategy / Promo Idea Name',
      stratNamePH: 'e.g. Activate Tabby/Tamara payments or Loyalty Points',
      category: 'Strategy Category',
      catConversion: 'Increase Conversion Rate 🚀',
      catLoyalty: 'Boost Customer Loyalty 🤝',
      catCarts: 'Recover Abandoned Carts 🛒',
      catOther: '➕ Other Category (Manual Entry)',
      otherPH: 'Type category here...',
      statusLabel: 'Current Execution Status',
      statNotStarted: 'Not Started ⏸️',
      statInProgress: 'In Progress ⏳',
      statCompleted: 'Completed & Active ✅',
      descLabel: 'Strategy Description & Execution Steps',
      descPH: 'Write the details of the idea and how to apply it for future reference...',
      saveBtnNew: '+ Add Strategy to Library',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Growth Plans Implementation Indicators',
      totalStrats: 'Total Registered Strategies',
      totalStratsSub: 'Promotional Ideas Library',
      completedStrats: 'Completed & Active Strategies',
      progressRate: 'Implementation Progress Rate',
      searchPH: '🔍 Search by strategy or category...',
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
        noRecords: 'Growth library matches your search.',
        th1: '#',
        th2: 'Strategy & Date',
        th3: 'Category',
        th4: 'Description / Notes',
        th5: 'Execution Status',
        th6: 'Actions',
        noDesc: 'No description',
        totalLabel: 'Total Displayed Strategies & Plans',
        planUnit: 'plan(s)'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 strategies). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure strategy name and category are filled.',
        updateSuccess: '✨ Strategy updated successfully!',
        saveSuccess: '✅ Strategy added to growth library successfully!',
        delConfirm: 'Are you sure you want to delete this strategy?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Strategies library imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];
  const actualCategory = categorySelect === text.catOther ? customCategory : categorySelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategorySelect(val);
    if (val !== text.catOther) {
      setCustomCategory('');
    }
  };

  const handleClearForm = () => {
    setStrategyName('');
    setDescription('');
    if (lang === 'en') {
      setCategorySelect(text.catConversion);
      setExecutionStatus(text.statNotStarted);
    } else {
      setCategorySelect(text.catConversion);
      setExecutionStatus(text.statNotStarted);
    }
    setCustomCategory('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!strategyName.trim() || !actualCategory.trim()) {
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
        strategyName,
        category: actualCategory,
        description,
        executionStatus,
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: GrowthItem = {
        id: Date.now().toString(),
        strategyName,
        category: actualCategory,
        description,
        executionStatus,
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); 
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: GrowthItem) => {
    setStrategyName(item.strategyName);
    setDescription(item.description);
    
    const isCompleted = item.executionStatus.includes('مكتمل') || item.executionStatus.includes('Completed');
    const isInProgress = item.executionStatus.includes('قيد') || item.executionStatus.includes('Progress');
    
    if (isCompleted) setExecutionStatus(text.statCompleted);
    else if (isInProgress) setExecutionStatus(text.statInProgress);
    else setExecutionStatus(text.statNotStarted);
    
    const isConv = item.category.includes('تحويل') || item.category.includes('Conversion');
    const isLoyalty = item.category.includes('ولاء') || item.category.includes('Loyalty');
    const isCarts = item.category.includes('سلات') || item.category.includes('Carts');

    let matchedCat = '';
    if (isConv) matchedCat = text.catConversion;
    else if (isLoyalty) matchedCat = text.catLoyalty;
    else if (isCarts) matchedCat = text.catCarts;
    else matchedCat = text.catOther;

    setCategorySelect(matchedCat);
    if (matchedCat === text.catOther) {
      setCustomCategory(item.category);
    } else {
      setCustomCategory('');
    }
    
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
    const matchesSearch = (item?.strategyName || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
                          (item?.category || '').toLowerCase().includes((searchQuery || '').toLowerCase());
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

  const completedCount = filteredItems.filter(i => i.executionStatus.includes('مكتمل') || i.executionStatus.includes('Completed')).length;
  const progressPercentage = filteredItems.length > 0 ? (completedCount / filteredItems.length) * 100 : 0;

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
                <th>${text.stratName.split(' / ')[0]}</th>
                <th>${text.category}</th>
                <th>${text.statusLabel}</th>
                <th>Date / Time</th>
                <th>${text.table.th4}</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.strategyName}</td>
          <td>${row.category}</td>
          <td>${row.executionStatus}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.description.replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">${text.table.totalLabel}</td>
                <td>${filteredItems.length} ${text.table.planUnit}</td>
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
    link.setAttribute("download", `enjazya_bh_store_growth_secrets_${dateFilter}.xls`);
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
        
        .grid-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; margin-bottom: 40px; }
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
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #CE1126; background: #ffffff; }
        
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
              <label>{text.stratName}</label>
              <div className="input-wrapper">
                <input type="text" value={strategyName} onChange={(e) => setStrategyName(e.target.value)} placeholder={text.stratNamePH} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.category}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={categorySelect} onChange={handleSelectChange}>
                    <option value={text.catConversion}>{text.catConversion}</option>
                    <option value={text.catLoyalty}>{text.catLoyalty}</option>
                    <option value={text.catCarts}>{text.catCarts}</option>
                    <option value={text.catOther}>{text.catOther}</option>
                  </select>
                </div>

                {categorySelect === text.catOther && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      placeholder={text.otherPH} 
                      required 
                    />
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>{text.statusLabel}</label>
                <div className="input-wrapper">
                  <select value={executionStatus} onChange={(e) => setExecutionStatus(e.target.value)}>
                    <option value={text.statNotStarted}>{text.statNotStarted}</option>
                    <option value={text.statInProgress}>{text.statInProgress}</option>
                    <option value={text.statCompleted}>{text.statCompleted}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.descLabel}</label>
              <div className="input-wrapper">
                <textarea 
                  rows={4} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder={text.descPH} 
                  style={{ resize: 'vertical' }}
                ></textarea>
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
              <div className="result-label">{text.totalStrats}</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>{text.totalStratsSub}</div>
            </div>
            <div className="result-value">
              {filteredItems.length} {text.table.planUnit.split('(')[0]}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #047857' : 'none', borderLeft: lang === 'en' ? '4px solid #047857' : 'none' }}>
            <span className="result-label">{text.completedStrats}</span>
            <span className="result-value" style={{ color: '#047857' }}>{completedCount}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #d97706' : 'none', borderLeft: lang === 'en' ? '4px solid #d97706' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.progressRate}</span>
            <span className="result-value" style={{ color: '#d97706', direction: 'ltr' }}>{progressPercentage.toFixed(1)}%</span>
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
                <th>{text.stratName.split(' / ')[0]}</th>
                <th>{text.category}</th>
                <th>{text.statusLabel}</th>
                <th>Date / Time</th>
                <th>{text.table.th4}</th>
                <th>{text.table.th6}</th>
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
                  let statusColor = '#0f172a';
                  let statusBg = '#f1f5f9';
                  if (item.executionStatus.includes('مكتمل') || item.executionStatus.includes('Completed')) { statusColor = '#15803d'; statusBg = '#dcfce7'; }
                  else if (item.executionStatus.includes('قيد') || item.executionStatus.includes('Progress')) { statusColor = '#b45309'; statusBg = '#fef3c7'; }
                  else { statusColor = '#475569'; statusBg = '#e2e8f0'; }

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.strategyName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td><span style={{ fontWeight: 800, color: '#CE1126' }}>{item.category}</span></td>
                      <td>
                        <span style={{ color: statusColor, background: statusBg, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.executionStatus}
                        </span>
                      </td>
                      <td>{item.createdAt || '-'}</td>
                      <td style={{ maxWidth: '250px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.description || <span style={{ color: '#94a3b8' }}>{text.table.noDesc}</span>}
                      </td>
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
                  <td colSpan={6} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{filteredItems.length} {text.table.planUnit}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
