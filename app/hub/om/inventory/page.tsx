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
  timestamp?: number;
}

export default function SeasonalInventoryPlannerOM() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  
  const [productName, setProductName] = useState<string>('');
  const [seasonSelect, setSeasonSelect] = useState<string>('');
  const [customSeason, setCustomSeason] = useState<string>('');
  const [normalMonthlySales, setNormalMonthlySales] = useState<number | ''>('');
  const [growthRatePercent, setGrowthRatePercent] = useState<number | ''>(150);

  const [items, setItems] = useState<SeasonItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_om'));

    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    if (savedLang === 'en') {
      setSeasonSelect('Salalah Khareef 🌴');
      setCustomSeason('Salalah Khareef 🌴');
    } else {
      setSeasonSelect('خريف صلالة 🌴');
      setCustomSeason('خريف صلالة 🌴');
    }

    const saved = localStorage.getItem('seerk_om_seasonal_inventory_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: SeasonItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_om_seasonal_inventory_items', JSON.stringify(newItems));
  };

  const sales = typeof normalMonthlySales === 'number' ? normalMonthlySales : 0;
  const growth = typeof growthRatePercent === 'number' ? growthRatePercent : 0;

  const requiredStock = Math.round(sales + (sales * (growth / 100)));

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مخطط المخزون للمواسم العُمانية 📅',
      desc: 'توقع الكميات المطلوبة لمواسم عُمان (خريف صلالة، مهرجان مسقط، العيد الوطني) لتجنب نفاد المخزون',
      editRecord: 'تعديل السجل',
      newRecord: 'تخطيط مخزون لموسم جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodName: 'اسم المنتج أو الفئة',
      prodNamePH: 'مثال: عبايات نسائية فاخرة',
      seasonLabel: 'اختر الموسم المستهدف',
      s_khareef: 'خريف صلالة 🌴',
      s_national: 'العيد الوطني العُماني 🇴🇲',
      s_muscat: 'مهرجان مسقط 🎭',
      s_friday: 'الجمعة البيضاء / السوداء 🏷️',
      s_eid: 'موسم رمضان والعيد 🌙',
      s_other: '➕ موسم آخر (كتابة يدوية)',
      otherPH: 'اكتب اسم الموسم هنا...',
      salesLabel: 'مبيعات المنتج العادية (شهرياً)',
      salesPH: '100',
      growthLabel: 'نسبة نمو المبيعات بالموسم (%)',
      growthPH: '150',
      saveBtnNew: '+ حفظ الخطة في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'توقع المخزون الموسمي الفوري',
      reqStock: 'الكمية المطلوبة لتغطية الموسم',
      reqStockSub: 'المخزون الكافي لتجنب نفاد البضاعة',
      normalSales: 'معدل المبيعات الشهري العادي',
      growthExp: 'نسبة الطلب المتوقعة في الموسم',
      unit: 'وحدة',
      unitMonth: 'وحدة/شهر',
      searchPH: '🔍 بحث بالمنتج أو الموسم...',
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
        noRecords: 'لا توجد خطط مخزون موسمية تطابق بحثك حالياً.',
        th1: '#',
        th2: 'المنتج والتاريخ',
        th3: 'الموسم المستهدف',
        th4: 'المبيعات العادية',
        th5: 'نسبة النمو',
        th6: 'الكمية المطلوبة',
        th7: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي'
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
      title: 'Oman Seasonal Inventory Planner 📅',
      desc: 'Forecast required stock for Oman seasons (Salalah Khareef, Muscat Festival, National Day) to prevent stockouts',
      editRecord: 'Edit Record',
      newRecord: 'Plan New Seasonal Inventory',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodName: 'Product or Category Name',
      prodNamePH: 'e.g. Luxury Women Abayas',
      seasonLabel: 'Select Target Season',
      s_khareef: 'Salalah Khareef 🌴',
      s_national: 'Oman National Day 🇴🇲',
      s_muscat: 'Muscat Festival 🎭',
      s_friday: 'White / Black Friday 🏷️',
      s_eid: 'Ramadan & Eid Season 🌙',
      s_other: '➕ Other Season (Manual Entry)',
      otherPH: 'Type season name here...',
      salesLabel: 'Normal Monthly Sales',
      salesPH: '100',
      growthLabel: 'Expected Season Growth (%)',
      growthPH: '150',
      saveBtnNew: '+ Save Plan to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Seasonal Stock Forecast',
      reqStock: 'Required Stock for the Season',
      reqStockSub: 'Sufficient inventory to avoid stockouts',
      normalSales: 'Regular Monthly Sales Rate',
      growthExp: 'Expected Demand Growth',
      unit: 'unit(s)',
      unitMonth: 'units/month',
      searchPH: '🔍 Search by product or season...',
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
        noRecords: 'No seasonal inventory plans match your search.',
        th1: '#',
        th2: 'Product & Date',
        th3: 'Target Season',
        th4: 'Normal Sales',
        th5: 'Growth Rate',
        th6: 'Required Stock',
        th7: 'Actions',
        totalLabel: 'Grand Total'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure product name, season, and normal sales are filled correctly.',
        updateSuccess: '✨ Inventory plan updated successfully!',
        saveSuccess: '✅ Seasonal plan added successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Seasonal inventory data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSeasonSelect(val);
    if (val !== text.s_other) {
      setCustomSeason(val);
    } else {
      setCustomSeason('');
    }
  };

  const handleClearForm = () => {
    setProductName('');
    const defaultSeason = lang === 'en' ? text.s_khareef : text.s_khareef;
    setSeasonSelect(defaultSeason);
    setCustomSeason(defaultSeason);
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
    const finalSeason = seasonSelect === text.s_other ? customSeason : seasonSelect;
    if (!productName.trim() || !finalSeason.trim() || sales <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-OM' : 'en-OM';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        seasonName: finalSeason,
        normalMonthlySales: sales,
        growthRatePercent: growth,
        requiredStock,
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
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
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: SeasonItem) => {
    setProductName(item.productName);
    
    const isKhareef = item.seasonName.includes('خريف') || item.seasonName.includes('صلالة') || item.seasonName.includes('Khareef');
    const isNational = item.seasonName.includes('وطني') || item.seasonName.includes('National');
    const isMuscat = item.seasonName.includes('مسقط') || item.seasonName.includes('Muscat');
    const isFriday = item.seasonName.includes('جمعة') || item.seasonName.includes('Friday');
    const isEid = item.seasonName.includes('رمضان') || item.seasonName.includes('Eid');

    let matchedSeason = '';
    if (isKhareef) matchedSeason = text.s_khareef;
    else if (isNational) matchedSeason = text.s_national;
    else if (isMuscat) matchedSeason = text.s_muscat;
    else if (isFriday) matchedSeason = text.s_friday;
    else if (isEid) matchedSeason = text.s_eid;
    else matchedSeason = text.s_other;

    setSeasonSelect(matchedSeason);
    setCustomSeason(item.seasonName);
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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.seasonName.toLowerCase().includes(searchQuery.toLowerCase());
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

  const totalNormalSalesSum = filteredItems.reduce((acc, curr) => acc + curr.normalMonthlySales, 0);
  const totalRequiredStockSum = filteredItems.reduce((acc, curr) => acc + curr.requiredStock, 0);

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
                <th>${text.prodName.split(' ')[0]}</th>
                <th>Date / Time</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>${text.table.th5} (%)</th>
                <th>${text.table.th6}</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.productName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.seasonName}</td>
          <td>${row.normalMonthlySales}</td>
          <td>${row.growthRatePercent}%</td>
          <td>${row.requiredStock}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="4">${text.table.totalLabel}</td>
                <td>${totalNormalSalesSum}</td>
                <td>-</td>
                <td>${totalRequiredStockSum}</td>
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
    link.setAttribute("download", `enjazya_om_seasonal_inventory_${dateFilter}.xls`);
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

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #C62828; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #C62828; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #B71C1C; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #C62828 0%, #B71C1C 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 26px; color: #ffffff; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #C62828; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #C62828; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #C62828; color: #C62828; }

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
        <Link href="/hub/om" className="back-btn">
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
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodNamePH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.seasonLabel}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={seasonSelect} onChange={handleSelectChange}>
                  <option value={text.s_khareef}>{text.s_khareef}</option>
                  <option value={text.s_national}>{text.s_national}</option>
                  <option value={text.s_muscat}>{text.s_muscat}</option>
                  <option value={text.s_friday}>{text.s_friday}</option>
                  <option value={text.s_eid}>{text.s_eid}</option>
                  <option value={text.s_other}>{text.s_other}</option>
                </select>
              </div>

              {seasonSelect === text.s_other && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customSeason} 
                    onChange={(e) => setCustomSeason(e.target.value)} 
                    placeholder={text.otherPH} 
                    required 
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.salesLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={normalMonthlySales === '' ? '' : normalMonthlySales} onChange={(e) => setNormalMonthlySales(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.salesPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.growthLabel}</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" min="0" max="1000" value={growthRatePercent === '' ? '' : growthRatePercent} onChange={(e) => setGrowthRatePercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.growthPH} required />
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
          <h2 className="card-title">{text.analysisTitle}</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.reqStock}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.reqStockSub}</div>
            </div>
            <div className="result-value">
              {requiredStock} {text.unit}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.normalSales}</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{sales} {text.unitMonth}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.growthExp}</span>
            <span className="result-value" style={{ color: '#C62828' }}>+{growth}%</span>
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
            <option value="6months">{text.filters.sixMonths}</option>
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
                    <td><span style={{ fontWeight: 800, color: '#C62828' }}>{item.seasonName}</span></td>
                    <td>{item.normalMonthlySales} {text.unit}</td>
                    <td><span style={{ color: '#047857', fontWeight: 800 }}>+{item.growthRatePercent}%</span></td>
                    <td style={{ fontWeight: 900, color: '#0f172a' }}>{item.requiredStock} {text.unit}</td>
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
                  <td colSpan={3} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{totalNormalSalesSum} {text.unit}</td>
                  <td>-</td>
                  <td style={{ color: '#C62828' }}>{totalRequiredStockSum} {text.unit}</td>
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
