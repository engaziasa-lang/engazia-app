'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SeasonItem {
  id: string;
  productName: string;
  seasonName: string;
  normalMonthlySales: number;
  growthRatePercent: number;
  requiredStock: number;
  createdAt?: string;
}

export default function SeasonalInventoryPlannerSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [productName, setProductName] = useState<string>('');
  const [seasonSelect, setSeasonSelect] = useState<string>('موسم رمضان والعيد');
  const [customSeason, setCustomSeason] = useState<string>('موسم رمضان والعيد');
  const [normalMonthlySales, setNormalMonthlySales] = useState<number | ''>('');
  const [growthRatePercent, setGrowthRatePercent] = useState<number | ''>(150);

  const [items, setItems] = useState<SeasonItem[]>([]);
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
      setSeasonSelect('Ramadan & Eid Season');
      setCustomSeason('Ramadan & Eid Season');
    } else {
      setSeasonSelect('موسم رمضان والعيد');
      setCustomSeason('موسم رمضان والعيد');
    }

    const saved = localStorage.getItem('seerk_seasonal_inventory_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: SeasonItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_seasonal_inventory_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مخطط المخزون للمواسم السعودية 📅',
      desc: 'توقع الكميات المطلوبة لمواسم السعودية (رمضان، العيد، اليوم الوطني) لتجنب نفاد المخزون',
      editRecord: 'تعديل السجل',
      newRecord: 'تخطيط مخزون لموسم جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodName: 'اسم المنتج أو الفئة',
      prodPH: 'مثال: عبايات نسائية فاخرة',
      seasonLabel: 'اختر الموسم المستهدف',
      optRamadan: 'موسم رمضان والعيد 🌙',
      optNational: 'اليوم الوطني السعودي 🇸🇦',
      optBlackFriday: 'الجمعة البيضاء / السوداء 🏷️',
      optSchool: 'موسم العودة للمدارس 📚',
      optNewYear: 'رأس السنة / العروض الكبرى ⭐',
      optCustom: '➕ موسم آخر (كتابة يدوية)',
      customPH: 'اكتب اسم الموسم هنا...',
      salesLabel: 'مبيعات المنتج العادية (شهرياً)',
      growthLabel: 'نسبة نمو المبيعات بالموسم (%)',
      saveBtnNew: '+ حفظ الخطة في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'توقع المخزون الموسمي الفوري',
      reqStockLabel: 'الكمية المطلوبة لتغطية الموسم',
      reqStockSub: 'المخزون الكافي لتجنب نفاد البضاعة',
      normalSalesLabel: 'معدل المبيعات الشهري العادي',
      growthRateLabel: 'نسبة الطلب المتوقعة في الموسم',
      searchPH: '🔍 بحث بالمنتج أو الموسم...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد خطط مخزون موسمية مسجلة حالياً.',
        th1: '#',
        th2: 'المنتج والتاريخ',
        th3: 'الموسم المستهدف',
        th4: 'المبيعات العادية',
        th5: 'نسبة النمو',
        th6: 'الكمية المطلوبة للموسم',
        th7: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي',
        unit: 'وحدة'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المنتج، الموسم، ومعدل مبيعات صحيح.',
        updateSuccess: '✨ تم تحديث خطة المخزون بنجاح!',
        saveSuccess: '✅ تمت إضافة خطة المخزون للموسم بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات المخزون الموسمي بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Saudi Seasonal Inventory Planner 📅',
      desc: 'Forecast required stock for Saudi seasons (Ramadan, Eid, National Day) to prevent stockouts',
      editRecord: 'Edit Record',
      newRecord: 'Plan Inventory for New Season',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodName: 'Product Name or Category',
      prodPH: 'e.g. Luxury Women Abayas',
      seasonLabel: 'Select Target Season',
      optRamadan: 'Ramadan & Eid Season 🌙',
      optNational: 'Saudi National Day 🇸🇦',
      optBlackFriday: 'White / Black Friday 🏷️',
      optSchool: 'Back to School Season 📚',
      optNewYear: 'New Year / Mega Sales ⭐',
      optCustom: '➕ Other Season (Custom)',
      customPH: 'Type season name here...',
      salesLabel: 'Normal Product Sales (Monthly)',
      growthLabel: 'Sales Growth Rate in Season (%)',
      saveBtnNew: '+ Save Plan to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Seasonal Inventory Forecast',
      reqStockLabel: 'Required Quantity to Cover Season',
      reqStockSub: 'Sufficient inventory to prevent stockouts',
      normalSalesLabel: 'Normal Monthly Sales Rate',
      growthRateLabel: 'Expected Demand Growth in Season',
      searchPH: '🔍 Search by product or season...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No seasonal inventory plans currently registered.',
        th1: '#',
        th2: 'Product & Date',
        th3: 'Target Season',
        th4: 'Normal Sales',
        th5: 'Growth Rate',
        th6: 'Required Season Stock',
        th7: 'Actions',
        totalLabel: 'Grand Total',
        unit: 'units'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure product name, season, and sales rate are entered correctly.',
        updateSuccess: '✨ Inventory plan updated successfully!',
        saveSuccess: '✅ Seasonal inventory plan added to log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Seasonal inventory data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const sales = typeof normalMonthlySales === 'number' ? normalMonthlySales : 0;
  const growth = typeof growthRatePercent === 'number' ? growthRatePercent : 0;

  const requiredStock = Math.round(sales + (sales * (growth / 100)));

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSeasonSelect(val);
    if (val !== 'موسم آخر (كتابة يدوية)' && val !== 'Other Season (Custom)') {
      setCustomSeason(val);
    } else {
      setCustomSeason('');
    }
  };

  const handleClearForm = () => {
    setProductName('');
    setSeasonSelect(lang === 'ar' ? 'موسم رمضان والعيد' : 'Ramadan & Eid Season');
    setCustomSeason(lang === 'ar' ? 'موسم رمضان والعيد' : 'Ramadan & Eid Season');
    setNormalMonthlySales('');
    setGrowthRatePercent(150);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalSeason = (seasonSelect === 'موسم آخر (كتابة يدوية)' || seasonSelect === 'Other Season (Custom)') ? customSeason : seasonSelect;
    if (!productName.trim() || !finalSeason.trim() || sales <= 0) {
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
        productName,
        seasonName: finalSeason,
        normalMonthlySales: sales,
        growthRatePercent: growth,
        requiredStock,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: SeasonItem = {
        id: Date.now().toString(),
        productName,
        seasonName: finalSeason,
        normalMonthlySales: sales,
        growthRatePercent: growth,
        requiredStock,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: SeasonItem) => {
    setProductName(item.productName);
    const standardSeasons = ['موسم رمضان والعيد', 'اليوم الوطني السعودي', 'الجمعة البيضاء / السوداء', 'موسم العودة للمدارس', 'رأس السنة / العروض الكبرى', 'Ramadan & Eid Season', 'Saudi National Day', 'White / Black Friday', 'Back to School Season', 'New Year / Mega Sales'];
    if (standardSeasons.includes(item.seasonName)) {
      setSeasonSelect(item.seasonName);
      setCustomSeason(item.seasonName);
    } else {
      setSeasonSelect(lang === 'ar' ? 'موسم آخر (كتابة يدوية)' : 'Other Season (Custom)');
      setCustomSeason(item.seasonName);
    }
    setNormalMonthlySales(item.normalMonthlySales);
    setGrowthRatePercent(item.growthRatePercent);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalNormalSalesSum = items.reduce((acc, curr) => acc + curr.normalMonthlySales, 0);
  const totalRequiredStockSum = items.reduce((acc, curr) => acc + curr.requiredStock, 0);

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
          <h2>Seasonal Inventory Planner Report</h2>
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
          <td>${row.productName}</td>
          <td>${row.seasonName}</td>
          <td>${row.normalMonthlySales}</td>
          <td>${row.growthRatePercent}%</td>
          <td>${row.requiredStock}</td>
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
    link.setAttribute("download", "enjazya_sa_seasonal_inventory.xls");
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
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.seasonName.toLowerCase().includes(searchQuery.toLowerCase())
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
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
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
              <label>{text.prodName}</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodPH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.seasonLabel}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={seasonSelect} onChange={handleSelectChange}>
                  <option value={lang === 'ar' ? 'موسم رمضان والعيد' : 'Ramadan & Eid Season'}>{text.optRamadan}</option>
                  <option value={lang === 'ar' ? 'اليوم الوطني السعودي' : 'Saudi National Day'}>{text.optNational}</option>
                  <option value={lang === 'ar' ? 'الجمعة البيضاء / السوداء' : 'White / Black Friday'}>{text.optBlackFriday}</option>
                  <option value={lang === 'ar' ? 'موسم العودة للمدارس' : 'Back to School Season'}>{text.optSchool}</option>
                  <option value={lang === 'ar' ? 'رأس السنة / العروض الكبرى' : 'New Year / Mega Sales'}>{text.optNewYear}</option>
                  <option value={lang === 'ar' ? 'موسم آخر (كتابة يدوية)' : 'Other Season (Custom)'}>{text.optCustom}</option>
                </select>
              </div>

              {(seasonSelect === 'موسم آخر (كتابة يدوية)' || seasonSelect === 'Other Season (Custom)') && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customSeason} 
                    onChange={(e) => setCustomSeason(e.target.value)} 
                    placeholder={text.customPH} 
                    required 
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.salesLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={normalMonthlySales === '' ? '' : normalMonthlySales} onChange={(e) => setNormalMonthlySales(e.target.value === '' ? '' : Number(e.target.value))} placeholder="100" required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.growthLabel}</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" min="0" max="1000" value={growthRatePercent === '' ? '' : growthRatePercent} onChange={(e) => setGrowthRatePercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder="150" required />
                  <span className="currency-tag">%</span>
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
              <div className="result-label">{text.reqStockLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.reqStockSub}</div>
            </div>
            <div className="result-value">
              {requiredStock} {text.table.unit}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0f172a' : 'none', borderLeft: lang === 'en' ? '4px solid #0f172a' : 'none' }}>
            <span className="result-label">{text.normalSalesLabel}</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{sales} {text.table.unit}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #047857' : 'none', borderLeft: lang === 'en' ? '4px solid #047857' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.growthRateLabel}</span>
            <span className="result-value" style={{ color: '#047857' }}>+{growth}%</span>
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
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.productName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#047857' }}>{item.seasonName}</span></td>
                    <td>{item.normalMonthlySales} {text.table.unit}</td>
                    <td><span style={{ color: '#d97706', fontWeight: 800 }}>+{item.growthRatePercent}%</span></td>
                    <td style={{ fontWeight: 900, color: '#0f172a' }}>{item.requiredStock} {text.table.unit}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                  <td>{totalNormalSalesSum} {text.table.unit}</td>
                  <td>-</td>
                  <td style={{ color: '#047857' }}>{totalRequiredStockSum} {text.table.unit}</td>
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
