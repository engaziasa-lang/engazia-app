'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface InfluencerItem {
  id: string;
  influencerName: string;
  platform: string;
  adCost: number;
  expectedOrders: number;
  avgOrderValue: number;
  productProfitMargin: number;
  netCampaignProfit: number;
  roiPercent: number;
  status: string;
  createdAt?: string;
}

export default function InfluencersCalculatorSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [influencerName, setInfluencerName] = useState<string>('');
  const [platform, setPlatform] = useState<string>('سناب شات (Snapchat)');
  const [adCost, setAdCost] = useState<number | ''>('');
  const [expectedOrders, setExpectedOrders] = useState<number | ''>('');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>('');
  const [productProfitMargin, setProductProfitMargin] = useState<number | ''>(40);

  const [items, setItems] = useState<InfluencerItem[]>([]);
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
      setPlatform('Snapchat');
    } else {
      setPlatform('سناب شات (Snapchat)');
    }

    const saved = localStorage.getItem('seerk_influencers_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: InfluencerItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_influencers_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة جدوى إعلانات المشاهير والمؤثرين 🤝',
      desc: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية في السوق السعودي',
      editRecord: 'تعديل السجل',
      newRecord: 'تحليل إعلان مؤثر جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      infNameLabel: 'اسم المؤثر / المشهور',
      infNamePH: 'مثال: سلطان بن نايف',
      platformLabel: 'المنصة الإعلانية',
      optSnap: 'سناب شات (Snapchat)',
      optTikTok: 'تيك توك (TikTok)',
      optInsta: 'انستغرام (Instagram)',
      optOther: 'منصة أخرى',
      adCostLabel: 'تكلفة الإعلان المطلوبة',
      ordersLabel: 'عدد الطلبات المتوقعة من الإعلان',
      orderValLabel: 'متوسط قيمة الطلب',
      marginLabel: 'نسبة صافي الربح من المنتج (%)',
      currency: 'ر.س',
      saveBtnNew: '+ حفظ التحليل في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'تحليل الجدوى الفوري',
      netProfitLabel: 'صافي ربح الحملة (بعد خصم التكلفة)',
      netProfitSub: 'الربح الحقيقي العائد لجيبك',
      roiLabel: 'عائد الاستثمار (ROI %)',
      revenueLabel: 'إجمالي إيرادات المبيعات المتوقعة',
      decisionLabel: 'القرار التسويقي المقترح:',
      profitStatus: 'إعلان مربح (ممتاز للتعاون) 🚀',
      lossStatus: 'خسارة محتملة (لا تشرع بالإعلان)',
      searchPH: '🔍 بحث باسم المؤثر أو المنصة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد سجلات إعلانات مشاهير مسجلة حالياً.',
        th1: '#',
        th2: 'المؤثر والتاريخ',
        th3: 'المنصة',
        th4: 'تكلفة الإعلان',
        th5: 'الطلبات المتوقعة',
        th6: 'صافي أرباح الحملة',
        th7: 'العائد (ROI)',
        th8: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي / المتوسط',
        ordersUnit: 'طلب'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المؤثر، تكلفة الإعلان، وعدد الطلبات بشكل صحيح.',
        updateSuccess: '✨ تم تحديث السجل بنجاح!',
        saveSuccess: '✅ تمت إضافة جدوى الإعلان إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Influencer Marketing ROI Calculator 🤝',
      desc: 'Analyze expected ROI from influencer ads before paying out campaign marketing budgets in the Saudi market',
      editRecord: 'Edit Record',
      newRecord: 'Analyze New Influencer Ad',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      infNameLabel: 'Influencer / Celebrity Name',
      infNamePH: 'e.g. John Doe',
      platformLabel: 'Ad Platform',
      optSnap: 'Snapchat',
      optTikTok: 'TikTok',
      optInsta: 'Instagram',
      optOther: 'Other Platform',
      adCostLabel: 'Required Ad Cost',
      ordersLabel: 'Expected Orders from Ad',
      orderValLabel: 'Average Order Value',
      marginLabel: 'Product Net Profit Margin (%)',
      currency: 'SAR',
      saveBtnNew: '+ Save Analysis to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Feasibility Analysis',
      netProfitLabel: 'Net Campaign Profit (After Cost)',
      netProfitSub: 'Real profit returned to your pocket',
      roiLabel: 'Return on Investment (ROI %)',
      revenueLabel: 'Total Expected Sales Revenue',
      decisionLabel: 'Suggested Marketing Decision:',
      profitStatus: 'Profitable Ad (Excellent for Collaboration) 🚀',
      lossStatus: 'Potential Loss (Do Not Proceed)',
      searchPH: '🔍 Search by influencer or platform...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No influencer ad records currently registered.',
        th1: '#',
        th2: 'Influencer & Date',
        th3: 'Platform',
        th4: 'Ad Cost',
        th5: 'Expected Orders',
        th6: 'Campaign Net Profit',
        th7: 'ROI (%)',
        th8: 'Actions',
        totalLabel: 'Grand Total / Average',
        ordersUnit: 'orders'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure influencer name, ad cost, and order count are entered correctly.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ Influencer ad feasibility added to log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const cost = typeof adCost === 'number' ? adCost : 0;
  const orders = typeof expectedOrders === 'number' ? expectedOrders : 0;
  const orderVal = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const margin = typeof productProfitMargin === 'number' ? productProfitMargin : 0;

  const totalRevenue = orders * orderVal;
  const grossProfit = totalRevenue * (margin / 100);
  const netCampaignProfit = grossProfit - cost;
  const roiPercent = cost > 0 ? (netCampaignProfit / cost) * 100 : 0;

  const decisionStatus = netCampaignProfit > 0 ? text.profitStatus : text.lossStatus;
  const statusColor = netCampaignProfit > 0 ? '#047857' : '#dc2626';

  const handleClearForm = () => {
    setInfluencerName('');
    setPlatform(lang === 'ar' ? 'سناب شات (Snapchat)' : 'Snapchat');
    setAdCost('');
    setExpectedOrders('');
    setAvgOrderValue('');
    setProductProfitMargin(40);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!influencerName.trim() || cost <= 0 || orders <= 0) {
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
        influencerName,
        platform,
        adCost: cost,
        expectedOrders: orders,
        avgOrderValue: orderVal,
        productProfitMargin: margin,
        netCampaignProfit: Number(netCampaignProfit.toFixed(2)),
        roiPercent: Number(roiPercent.toFixed(2)),
        status: decisionStatus,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: InfluencerItem = {
        id: Date.now().toString(),
        influencerName,
        platform,
        adCost: cost,
        expectedOrders: orders,
        avgOrderValue: orderVal,
        productProfitMargin: margin,
        netCampaignProfit: Number(netCampaignProfit.toFixed(2)),
        roiPercent: Number(roiPercent.toFixed(2)),
        status: decisionStatus,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: InfluencerItem) => {
    setInfluencerName(item.influencerName);
    setPlatform(item.platform);
    setAdCost(item.adCost);
    setExpectedOrders(item.expectedOrders);
    setAvgOrderValue(item.avgOrderValue);
    setProductProfitMargin(item.productProfitMargin);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalAdCosts = items.reduce((acc, curr) => acc + curr.adCost, 0);
  const totalExpectedOrders = items.reduce((acc, curr) => acc + curr.expectedOrders, 0);
  const totalNetProfits = items.reduce((acc, curr) => acc + curr.netCampaignProfit, 0);
  const avgRoi = totalAdCosts > 0 ? (totalNetProfits / totalAdCosts) * 100 : 0;

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
          <h2>Influencers ROI Calculator Report</h2>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>${text.table.th5}</th>
                <th>${text.table.th6}</th>
                <th>${text.table.th7}</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.influencerName}</td>
          <td>${row.platform}</td>
          <td>${row.adCost}</td>
          <td>${row.expectedOrders}</td>
          <td>${row.netCampaignProfit}</td>
          <td>${row.roiPercent}%</td>
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
    link.setAttribute("download", "enjazya_sa_influencers.xls");
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
    item.influencerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.platform.toLowerCase().includes(searchQuery.toLowerCase())
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
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value, .danger .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

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
            <div className="form-row">
              <div className="input-group">
                <label>{text.infNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={influencerName} onChange={(e) => setInfluencerName(e.target.value)} placeholder={text.infNamePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.platformLabel}</label>
                <div className="input-wrapper">
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value={lang === 'ar' ? 'سناب شات (Snapchat)' : 'Snapchat'}>{text.optSnap}</option>
                    <option value={lang === 'ar' ? 'تيك توك (TikTok)' : 'TikTok'}>{text.optTikTok}</option>
                    <option value={lang === 'ar' ? 'انستغرام (Instagram)' : 'Instagram'}>{text.optInsta}</option>
                    <option value={lang === 'ar' ? 'منصة أخرى' : 'Other Platform'}>{text.optOther}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.adCostLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={adCost === '' ? '' : adCost} onChange={(e) => setAdCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="5000" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.ordersLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={expectedOrders === '' ? '' : expectedOrders} onChange={(e) => setExpectedOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="80" required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.orderValLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={avgOrderValue === '' ? '' : avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="250" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.marginLabel}</label>
                <div className="input-wrapper">
                  <input type="number" step="1" min="1" max="100" value={productProfitMargin === '' ? '' : productProfitMargin} onChange={(e) => setProductProfitMargin(e.target.value === '' ? '' : Number(e.target.value))} placeholder="40" required />
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

          <div className={`result-box ${netCampaignProfit > 0 ? 'primary' : 'danger'}`}>
            <div>
              <div className="result-label">{text.netProfitLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.netProfitSub}</div>
            </div>
            <div className="result-value">
              {netCampaignProfit.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #047857' : 'none', borderLeft: lang === 'en' ? '4px solid #047857' : 'none' }}>
            <span className="result-label">{text.roiLabel}</span>
            <span className="result-value" style={{ color: roiPercent > 0 ? '#047857' : '#dc2626' }}>{roiPercent.toFixed(2)}%</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.revenueLabel}</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{totalRevenue.toFixed(2)} {text.currency}</span>
          </div>

          <div style={{ marginTop: '15px', padding: '12px', borderRadius: '8px', background: netCampaignProfit > 0 ? '#ecfdf5' : '#fef2f2', border: `1px solid ${netCampaignProfit > 0 ? '#a7f3d0' : '#fecaca'}`, textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '3px', fontWeight: 800 }}>{text.decisionLabel}</div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: statusColor }}>{decisionStatus}</div>
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
                <th>{text.table.th8}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.influencerName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ color: '#0369a1', fontWeight: 800 }}>{item.platform}</span></td>
                    <td style={{ color: '#dc2626' }}>{item.adCost} {text.currency}</td>
                    <td style={{ fontWeight: 800 }}>{item.expectedOrders} {text.table.ordersUnit}</td>
                    <td style={{ fontWeight: 900, color: item.netCampaignProfit > 0 ? '#047857' : '#dc2626' }}>
                      {item.netCampaignProfit} {text.currency}
                    </td>
                    <td>
                      <span style={{ color: item.roiPercent > 0 ? '#047857' : '#dc2626', fontWeight: 900 }}>
                        {item.roiPercent}%
                      </span>
                    </td>
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
                  <td style={{ color: '#dc2626' }}>{totalAdCosts.toFixed(2)} {text.currency}</td>
                  <td>{totalExpectedOrders} {text.table.ordersUnit}</td>
                  <td style={{ color: totalNetProfits > 0 ? '#047857' : '#dc2626' }}>{totalNetProfits.toFixed(2)} {text.currency}</td>
                  <td style={{ color: avgRoi > 0 ? '#047857' : '#dc2626' }}>{avgRoi.toFixed(2)}%</td>
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
