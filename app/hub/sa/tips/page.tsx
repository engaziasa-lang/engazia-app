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
}

export default function StoreGrowthSecretsSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [strategyName, setStrategyName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const [categorySelect, setCategorySelect] = useState<string>('زيادة معدل التحويل 🚀');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [executionStatus, setExecutionStatus] = useState<string>('لم تبدأ ⏸️');

  const [items, setItems] = useState<GrowthItem[]>([]);
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
      setCategorySelect('Increase Conversion Rate 🚀');
      setExecutionStatus('Not Started ⏸️');
    } else {
      setCategorySelect('زيادة معدل التحويل 🚀');
      setExecutionStatus('لم تبدأ ⏸️');
    }

    const saved = localStorage.getItem('seerk_growth_secrets_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: GrowthItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_growth_secrets_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'أسرار نمو المتاجر السعودية 💡',
      desc: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء في السوق المحلي السعودي',
      editRecord: 'تعديل خطة النمو',
      newRecord: 'إضافة استراتيجية نمو جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      stratNameLabel: 'اسم الاستراتيجية / الفكرة الترويجية',
      stratNamePH: 'مثال: تفعيل الدفع بتابي/تمارا أو برنامج ولاء النقاط',
      catLabel: 'تصنيف الاستراتيجية',
      optConv: 'زيادة معدل التحويل 🚀',
      optLoyalty: 'رفع ولاء العملاء 🤝',
      optCart: 'استرداد السلات المتروكة 🛒',
      optCustom: '➕ تصنيف آخر (كتابة يدوية)',
      customPH: 'اكتب التصنيف هنا...',
      statusLabel: 'حالة التنفيذ الحالية',
      statusNotStarted: 'لم تبدأ ⏸️',
      statusInProgress: 'قيد التنفيذ ⏳',
      statusDone: 'مكتملة ومفعلة ✅',
      descLabel: 'وصف الاستراتيجية وخطوات التنفيذ بالمتجر',
      descPH: 'اكتب تفاصيل الفكرة وكيفية تطبيقها في سلة أو زد للرجوع إليها لاحقاً...',
      saveBtnNew: '+ إضافة الاستراتيجية للمكتبة',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات تطبيق خطط النمو',
      totalStratLabel: 'إجمالي الاستراتيجيات المسجلة',
      totalStratSub: 'مكتبة الأفكار الترويجية',
      doneStratLabel: 'الاستراتيجيات المكتملة والمفعلة',
      progressLabel: 'مؤشر التقدم في التطبيق',
      searchPH: '🔍 بحث باسم الاستراتيجية أو التصنيف...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'مكتبة النمو فارغة حالياً. ابدأ بإضافة استراتيجيات جديدة.',
        th1: '#',
        th2: 'الاستراتيجية والتاريخ',
        th3: 'التصنيف',
        th4: 'الوصف / الملاحظات',
        th5: 'حالة التنفيذ',
        th6: 'الإجراءات',
        editAction: '✏️',
        delAction: '❌',
        noDesc: 'بدون وصف',
        totalLabel: 'إجمالي الاستراتيجيات والخطط',
        unit: 'خطة'
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
      title: 'Saudi Store Growth Secrets 💡',
      desc: 'Exclusive strategy library to increase conversion and boost customer loyalty in the local market',
      editRecord: 'Edit Growth Plan',
      newRecord: 'Add New Growth Strategy',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      stratNameLabel: 'Strategy Name / Promotional Idea',
      stratNamePH: 'e.g. Enable Tabby/Tamara or Points Loyalty Program',
      catLabel: 'Strategy Category',
      optConv: 'Increase Conversion Rate 🚀',
      optLoyalty: 'Boost Customer Loyalty 🤝',
      optCart: 'Recover Abandoned Carts 🛒',
      optCustom: '➕ Other Category (Custom)',
      customPH: 'Type category here...',
      statusLabel: 'Current Execution Status',
      statusNotStarted: 'Not Started ⏸️',
      statusInProgress: 'In Progress ⏳',
      statusDone: 'Completed & Active ✅',
      descLabel: 'Strategy Description & Store Implementation Steps',
      descPH: 'Write details of the idea and how to apply it in Salla or Zid for future reference...',
      saveBtnNew: '+ Add Strategy to Library',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Growth Plan Implementation Indicators',
      totalStratLabel: 'Total Registered Strategies',
      totalStratSub: 'Promotional ideas library',
      doneStratLabel: 'Completed & Active Strategies',
      progressLabel: 'Implementation Progress Index',
      searchPH: '🔍 Search by strategy name or category...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'Growth library is currently empty. Start adding new strategies.',
        th1: '#',
        th2: 'Strategy & Date',
        th3: 'Category',
        th4: 'Description / Notes',
        th5: 'Execution Status',
        th6: 'Actions',
        editAction: '✏️',
        delAction: '❌',
        noDesc: 'No description',
        totalLabel: 'Grand Total Strategies & Plans',
        unit: 'plans'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 strategies). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure strategy name and category are filled.',
        updateSuccess: '✨ Strategy updated successfully!',
        saveSuccess: '✅ Strategy added to growth library successfully!',
        delConfirm: 'Are you sure you want to delete this strategy?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Growth strategies library imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const actualCategory = (categorySelect === 'تصنيف آخر (كتابة يدوية)' || categorySelect === 'Other Category (Custom)') ? customCategory : categorySelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategorySelect(val);
    if (val !== 'تصنيف آخر (كتابة يدوية)' && val !== 'Other Category (Custom)') {
      setCustomCategory('');
    }
  };

  const handleClearForm = () => {
    setStrategyName('');
    setDescription('');
    setCategorySelect(lang === 'ar' ? 'زيادة معدل التحويل 🚀' : 'Increase Conversion Rate 🚀');
    setCustomCategory('');
    setExecutionStatus(lang === 'ar' ? 'لم تبدأ ⏸️' : 'Not Started ⏸️');
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
    const localeStr = lang === 'ar' ? 'ar-SA' : 'en-US';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        strategyName,
        category: actualCategory,
        description,
        executionStatus,
        createdAt: item.createdAt || formattedDate
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
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: GrowthItem) => {
    setStrategyName(item.strategyName);
    setDescription(item.description);
    setExecutionStatus(item.executionStatus);
    
    const standardCategories = [
      'زيادة معدل التحويل 🚀', 'رفع ولاء العملاء 🤝', 'استرداد السلات المتروكة 🛒',
      'Increase Conversion Rate 🚀', 'Boost Customer Loyalty 🤝', 'Recover Abandoned Carts 🛒'
    ];
    if (standardCategories.includes(item.category)) {
      setCategorySelect(item.category);
      setCustomCategory('');
    } else {
      setCategorySelect(lang === 'ar' ? 'تصنيف آخر (كتابة يدوية)' : 'Other Category (Custom)');
      setCustomCategory(item.category);
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

  const completedCount = items.filter(i => i.executionStatus.includes('مكتملة') || i.executionStatus.includes('Completed')).length;
  const progressPercentage = items.length > 0 ? (completedCount / items.length) * 100 : 0;

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
          <h2>Store Growth Secrets Report</h2>
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
          <td>${row.strategyName}</td>
          <td>${row.category}</td>
          <td>${row.executionStatus}</td>
          <td>${row.description}</td>
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
    link.setAttribute("download", "enjazya_sa_growth_secrets.xls");
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
    (item?.strategyName || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (item?.category || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

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
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

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
        <Link href="/hub/sa" className="back-btn">
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
              <label>{text.stratNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={strategyName} onChange={(e) => setStrategyName(e.target.value)} placeholder={text.stratNamePH} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.catLabel}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={categorySelect} onChange={handleSelectChange}>
                    <option value={lang === 'ar' ? 'زيادة معدل التحويل 🚀' : 'Increase Conversion Rate 🚀'}>{text.optConv}</option>
                    <option value={lang === 'ar' ? 'رفع ولاء العملاء 🤝' : 'Boost Customer Loyalty 🤝'}>{text.optLoyalty}</option>
                    <option value={lang === 'ar' ? 'استرداد السلات المتروكة 🛒' : 'Recover Abandoned Carts 🛒'}>{text.optCart}</option>
                    <option value={lang === 'ar' ? 'تصنيف آخر (كتابة يدوية)' : 'Other Category (Custom)'}>{text.optCustom}</option>
                  </select>
                </div>

                {(categorySelect === 'تصنيف آخر (كتابة يدوية)' || categorySelect === 'Other Category (Custom)') && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      placeholder={text.customPH} 
                      required 
                    />
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>{text.statusLabel}</label>
                <div className="input-wrapper">
                  <select value={executionStatus} onChange={(e) => setExecutionStatus(e.target.value)}>
                    <option value={lang === 'ar' ? 'لم تبدأ ⏸️' : 'Not Started ⏸️'}>{text.statusNotStarted}</option>
                    <option value={lang === 'ar' ? 'قيد التنفيذ ⏳' : 'In Progress ⏳'}>{text.statusInProgress}</option>
                    <option value={lang === 'ar' ? 'مكتملة ومفعلة ✅' : 'Completed & Active ✅'}>{text.statusDone}</option>
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
          <h2 className="card-title">{text.resultsTitle}</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.totalStratLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>{text.totalStratSub}</div>
            </div>
            <div className="result-value">
              {items.length} {text.table.unit}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #047857' : 'none', borderLeft: lang === 'en' ? '4px solid #047857' : 'none' }}>
            <span className="result-label">{text.doneStratLabel}</span>
            <span className="result-value" style={{ color: '#047857' }}>{completedCount}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #d97706' : 'none', borderLeft: lang === 'en' ? '4px solid #d97706' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.progressLabel}</span>
            <span className="result-value" style={{ color: '#d97706' }}>{progressPercentage.toFixed(1)}%</span>
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
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  let statusColor = '#0f172a';
                  let statusBg = '#f1f5f9';
                  if (item.executionStatus.includes('مكتملة') || item.executionStatus.includes('Completed')) { statusColor = '#15803d'; statusBg = '#dcfce7'; }
                  else if (item.executionStatus.includes('قيد التنفيذ') || item.executionStatus.includes('Progress')) { statusColor = '#b45309'; statusBg = '#fef3c7'; }
                  else { statusColor = '#475569'; statusBg = '#e2e8f0'; }

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.strategyName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td><span style={{ fontWeight: 800, color: '#0369a1' }}>{item.category}</span></td>
                      <td style={{ maxWidth: '250px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.description || <span style={{ color: '#94a3b8' }}>{text.table.noDesc}</span>}
                      </td>
                      <td>
                        <span style={{ color: statusColor, background: statusBg, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.executionStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td colSpan={2}>{items.length} {text.table.unit}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
