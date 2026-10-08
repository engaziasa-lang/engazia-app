'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface RoasItem {
  id: string;
  campaignName: string;
  platform: string;
  adSpend: number;
  ordersGenerated: number;
  revenueGenerated: number;
  cac: number;
  roas: number;
  status: string;
  createdAt?: string;
}

export default function RoasCalculatorKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [campaignName, setCampaignName] = useState<string>('');
  const [platformInput, setPlatformInput] = useState<string>('');
  const [adSpend, setAdSpend] = useState<number | ''>('');
  const [ordersGenerated, setOrdersGenerated] = useState<number | ''>('');
  const [revenueGenerated, setRevenueGenerated] = useState<number | ''>('');

  const [items, setItems] = useState<RoasItem[]>([]);
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
      setPlatformInput('TikTok Ads');
    } else {
      setPlatformInput('تيك توك (TikTok Ads)');
    }

    const saved = localStorage.getItem('seerk_kw_roas_calculator_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: RoasItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_roas_calculator_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'محلل عائد الإعلانات (ROAS) 📈',
      desc: 'قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق الكويتي أم تستنزف ميزانيتك',
      editRecord: 'تعديل الحملة',
      newRecord: 'تحليل حملة إعلانية جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      campNameLabel: 'اسم الحملة الإعلانية',
      campNamePH: 'مثال: حملة إكسبلور العيد',
      platformLabel: 'اختيار المنصة (أو كتابتها يدوياً)',
      optTikTok: 'تيك توك (TikTok Ads)',
      optSnap: 'سناب شات (Snapchat Ads)',
      optGoogle: 'إعلانات جوجل (Google Ads)',
      optMeta: 'ميتا (Instagram / Meta)',
      spendLabel: 'الميزانية المنفقة على الحملة (Ad Spend)',
      ordersLabel: 'عدد الطلبات المحققة من الحملة',
      revenueLabel: 'إجمالي العائد المحقق (Revenue)',
      currency: 'د.ك',
      saveBtnNew: '+ حفظ التحليل في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات الأداء الفورية (KPIs)',
      roasLabel: 'مؤشر العائد على الإنفاق (ROAS)',
      roasSub: 'كل دينار تم إنفاقه كم حقق إيرادات',
      cacLabel: 'تكلفة الاستحواذ على العميل (CAC)',
      totalRevLabel: 'إجمالي العائد (Revenue)',
      decisionLabel: 'القرار المقترح للحملة:',
      statusExcellent: 'ممتاز جداً (زيادة الميزانية) 🚀',
      statusGood: 'جيد (تحتاج تحسين)',
      statusLoss: 'خسارة (إيقاف الحملة)',
      searchPH: '🔍 بحث في الحملات...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد حملات إعلانية مسجلة في الجدول حالياً.',
        th1: '#',
        th2: 'الحملة والمنصة',
        th3: 'الإنفاق',
        th4: 'الطلبات (CAC)',
        th5: 'العائد (Revenue)',
        th6: 'مؤشر (ROAS)',
        th7: 'الإجراءات',
        editAction: '✏️ تعديل',
        delAction: '❌ حذف',
        ordersUnit: 'طلب',
        totalLabel: 'الإجمالي الكلي / المتوسط'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 حملات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء إدخال اسم الحملة والميزانية بشكل صحيح.',
        updateSuccess: '✨ تم تحديث الحملة بنجاح!',
        saveSuccess: '✅ تمت إضافة التحليل إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذه الحملة من السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Ad Return Analyzer (ROAS) 📈',
      desc: 'Measure your ad performance precisely and check if they yield rewarding returns in the Kuwaiti market',
      editRecord: 'Edit Campaign',
      newRecord: 'Analyze New Ad Campaign',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      campNameLabel: 'Ad Campaign Name',
      campNamePH: 'e.g. Eid Explore Campaign',
      platformLabel: 'Select Platform (or type manually)',
      optTikTok: 'TikTok Ads',
      optSnap: 'Snapchat Ads',
      optGoogle: 'Google Ads',
      optMeta: 'Instagram / Meta',
      spendLabel: 'Campaign Budget Spent (Ad Spend)',
      ordersLabel: 'Orders Generated from Campaign',
      revenueLabel: 'Total Revenue Generated',
      currency: 'KWD',
      saveBtnNew: '+ Save Analysis to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Performance Indicators (KPIs)',
      roasLabel: 'Return on Ad Spend (ROAS)',
      roasSub: 'Revenue generated per 1 KWD spent',
      cacLabel: 'Customer Acquisition Cost (CAC)',
      totalRevLabel: 'Total Revenue',
      decisionLabel: 'Suggested Campaign Decision:',
      statusExcellent: 'Excellent (Increase Budget) 🚀',
      statusGood: 'Good (Needs Optimization)',
      statusLoss: 'Loss (Stop Campaign)',
      searchPH: '🔍 Search campaigns...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No ad campaigns currently registered in table.',
        th1: '#',
        th2: 'Campaign & Platform',
        th3: 'Spend',
        th4: 'Orders (CAC)',
        th5: 'Revenue',
        th6: 'ROAS',
        th7: 'Actions',
        editAction: '✏️ Edit',
        delAction: '❌ Delete',
        ordersUnit: 'orders',
        totalLabel: 'Grand Total / Average'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 campaigns). Please upgrade to unlock unlimited access!',
        fillErr: 'Please enter campaign name and budget correctly.',
        updateSuccess: '✨ Campaign updated successfully!',
        saveSuccess: '✅ Analysis added to log successfully!',
        delConfirm: 'Are you sure you want to delete this campaign from log?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const spend = typeof adSpend === 'number' ? adSpend : 0;
  const orders = typeof ordersGenerated === 'number' ? ordersGenerated : 0;
  const rev = typeof revenueGenerated === 'number' ? revenueGenerated : 0;

  const cac = orders > 0 ? spend / orders : 0;
  const roas = spend > 0 ? rev / spend : 0;

  let status = text.statusLoss;
  let statusColor = '#dc2626';
  if (roas >= 3) {
    status = text.statusExcellent;
    statusColor = '#0284c7';
  } else if (roas >= 1.5) {
    status = text.statusGood;
    statusColor = '#d97706';
  }

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatformInput(e.target.value);
  };

  const handleClearForm = () => {
    setCampaignName('');
    setPlatformInput(lang === 'ar' ? 'تيك توك (TikTok Ads)' : 'TikTok Ads');
    setAdSpend('');
    setOrdersGenerated('');
    setRevenueGenerated('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!campaignName.trim() || spend <= 0) {
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
        campaignName,
        platform: platformInput,
        adSpend: spend,
        ordersGenerated: orders,
        revenueGenerated: rev,
        cac: Number(cac.toFixed(3)),
        roas: Number(roas.toFixed(2)),
        status,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: RoasItem = {
        id: Date.now().toString(),
        campaignName,
        platform: platformInput,
        adSpend: spend,
        ordersGenerated: orders,
        revenueGenerated: rev,
        cac: Number(cac.toFixed(3)),
        roas: Number(roas.toFixed(2)),
        status,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: RoasItem) => {
    setCampaignName(item.campaignName);
    setPlatformInput(item.platform);
    setAdSpend(item.adSpend);
    setOrdersGenerated(item.ordersGenerated);
    setRevenueGenerated(item.revenueGenerated);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

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
          <h2>ROAS Calculator Report (KW)</h2>
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
          <td>${row.campaignName} (${row.platform})</td>
          <td>${row.adSpend}</td>
          <td>${row.ordersGenerated} (CAC: ${row.cac})</td>
          <td>${row.revenueGenerated}</td>
          <td>${row.roas}x</td>
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
    link.setAttribute("download", "enjazya_kw_roas.xls");
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
    item.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAdSpend = filteredItems.reduce((acc, curr) => acc + curr.adSpend, 0);
  const totalOrders = filteredItems.reduce((acc, curr) => acc + curr.ordersGenerated, 0);
  const totalRevenue = filteredItems.reduce((acc, curr) => acc + curr.revenueGenerated, 0);
  const overallRoas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
  const overallCac = totalOrders > 0 ? totalAdSpend / totalOrders : 0;

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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 15px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2); }
        .result-box.warning { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.2); }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2); }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label, .warning .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value, .danger .result-value, .warning .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

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
              <label>{text.campNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder={text.campNamePH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.platformLabel}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select onChange={handlePresetChange} defaultValue={lang === 'ar' ? 'تيك توك (TikTok Ads)' : 'TikTok Ads'}>
                  <option value={lang === 'ar' ? 'تيك توك (TikTok Ads)' : 'TikTok Ads'}>{text.optTikTok}</option>
                  <option value={lang === 'ar' ? 'سناب شات (Snapchat Ads)' : 'Snapchat Ads'}>{text.optSnap}</option>
                  <option value={lang === 'ar' ? 'إعلانات جوجل (Google Ads)' : 'Google Ads'}>{text.optGoogle}</option>
                  <option value={lang === 'ar' ? 'ميتا (Instagram / Meta)' : 'Instagram / Meta'}>{text.optMeta}</option>
                </select>
              </div>
              <div className="input-wrapper">
                <input type="text" value={platformInput} onChange={(e) => setPlatformInput(e.target.value)} placeholder="Platform Name" required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.spendLabel} ({text.currency})</label>
              <div className="input-wrapper">
                <input className="with-currency" type="number" step="0.001" min="0" value={adSpend === '' ? '' : adSpend} onChange={(e) => setAdSpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="600" required />
                <span className="currency-tag">{text.currency}</span>
              </div>
            </div>

            <div className="input-group">
              <label>{text.ordersLabel}</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={ordersGenerated === '' ? '' : ordersGenerated} onChange={(e) => setOrdersGenerated(e.target.value === '' ? '' : Number(e.target.value))} placeholder="120" />
              </div>
            </div>

            <div className="input-group">
              <label>{text.revenueLabel} ({text.currency})</label>
              <div className="input-wrapper">
                <input className="with-currency" type="number" step="0.001" min="0" value={revenueGenerated === '' ? '' : revenueGenerated} onChange={(e) => setRevenueGenerated(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2400" required />
                <span className="currency-tag">{text.currency}</span>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.resultsTitle}</h2>

          <div className={`result-box ${roas >= 3 ? 'primary' : roas >= 1.5 ? 'warning' : 'danger'}`}>
            <div>
              <div className="result-label">{text.roasLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.roasSub}</div>
            </div>
            <div className="result-value">
              {roas.toFixed(2)}x
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0284c7' : 'none', borderLeft: lang === 'en' ? '4px solid #0284c7' : 'none' }}>
            <span className="result-label">{text.cacLabel}</span>
            <span className="result-value" style={{ color: '#0284c7' }}>{cac.toFixed(3)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.totalRevLabel}</span>
            <span className="result-value">{rev.toFixed(3)} {text.currency}</span>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', borderRadius: '12px', background: roas >= 3 ? '#f0fdf4' : roas >= 1.5 ? '#fffbeb' : '#fef2f2', border: `1px solid ${roas >= 3 ? '#bbf7d0' : roas >= 1.5 ? '#fde68a' : '#fecaca'}`, textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '5px', fontWeight: 800 }}>{text.decisionLabel}</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: statusColor }}>{status}</div>
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
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.campaignName}</div>
                      <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '2px', fontWeight: 800 }}>{item.platform}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td style={{ color: '#dc2626' }}>{item.adSpend.toFixed(3)} {text.currency}</td>
                    <td>
                      <div style={{ fontWeight: 800 }}>{item.ordersGenerated} {text.table.ordersUnit}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>CAC: {item.cac.toFixed(3)} {text.currency}</div>
                    </td>
                    <td style={{ fontWeight: 900 }}>{item.revenueGenerated.toFixed(3)} {text.currency}</td>
                    <td>
                      <span style={{ background: item.roas >= 3 ? '#f0fdf4' : item.roas >= 1.5 ? '#fffbeb' : '#fef2f2', color: item.roas >= 3 ? '#16a34a' : item.roas >= 1.5 ? '#d97706' : '#dc2626', padding: '4px 8px', borderRadius: '6px', fontWeight: 900, fontSize: '14px' }}>
                        {item.roas}x
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">{text.table.editAction}</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">{text.table.delAction}</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={2} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td style={{ color: '#dc2626' }}>{totalAdSpend.toFixed(3)} {text.currency}</td>
                  <td>
                    <div>{totalOrders} {text.table.ordersUnit}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>CAC: {overallCac.toFixed(3)} {text.currency}</div>
                  </td>
                  <td>{totalRevenue.toFixed(3)} {text.currency}</td>
                  <td style={{ color: overallRoas >= 3 ? '#16a34a' : overallRoas >= 1.5 ? '#d97706' : '#dc2626' }}>{overallRoas.toFixed(2)}x</td>
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
