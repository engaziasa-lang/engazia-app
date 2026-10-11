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
  timestamp?: number;
}

export default function InfluencersCalculatorBH() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [influencerName, setInfluencerName] = useState<string>('');
  const [platform, setPlatform] = useState<string>('سناب شات (Snapchat)');
  const [adCost, setAdCost] = useState<number | ''>('');
  const [expectedOrders, setExpectedOrders] = useState<number | ''>('');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>('');
  const [productProfitMargin, setProductProfitMargin] = useState<number | ''>(40);

  const [items, setItems] = useState<InfluencerItem[]>([]);
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
      setPlatform('Snapchat');
    } else {
      setPlatform('سناب شات (Snapchat)');
    }

    const saved = localStorage.getItem('seerk_bh_influencers_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: InfluencerItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_bh_influencers_items', JSON.stringify(newItems));
  };

  const cost = typeof adCost === 'number' ? adCost : 0;
  const orders = typeof expectedOrders === 'number' ? expectedOrders : 0;
  const orderVal = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const margin = typeof productProfitMargin === 'number' ? productProfitMargin : 0;

  const totalRevenue = orders * orderVal;
  const grossProfit = totalRevenue * (margin / 100);
  const netCampaignProfit = grossProfit - cost;
  const roiPercent = cost > 0 ? (netCampaignProfit / cost) * 100 : 0;

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة جدوى إعلانات المشاهير والمؤثرين 🤝',
      desc: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية في البحرين',
      editRecord: 'تعديل السجل',
      newRecord: 'تحليل إعلان مؤثر جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      infName: 'اسم المؤثر / المشهور',
      infNamePH: 'مثال: خالد',
      platform: 'المنصة الإعلانية',
      platSnap: 'سناب شات (Snapchat)',
      platTiktok: 'تيك توك (TikTok)',
      platInsta: 'انستغرام (Instagram)',
      platOther: 'منصة أخرى',
      adCostLabel: 'تكلفة الإعلان المطلوبة',
      adCostPH: '50',
      ordersLabel: 'عدد الطلبات المتوقعة من الإعلان',
      ordersPH: '80',
      avgValLabel: 'متوسط قيمة الطلب',
      avgValPH: '25',
      marginLabel: 'نسبة صافي الربح من المنتج (%)',
      marginPH: '40',
      saveBtnNew: '+ حفظ التحليل في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'تحليل الجدوى الفوري',
      netProfit: 'صافي ربح الحملة (بعد خصم التكلفة)',
      netProfitSub: 'الربح الحقيقي العائد لجيبك',
      roiLabel: 'عائد الاستثمار (ROI %)',
      revenueLabel: 'إجمالي إيرادات المبيعات المتوقعة',
      decisionLabel: 'القرار التسويقي المقترح:',
      decisionGood: 'إعلان مربح (ممتاز للتعاون) 🚀',
      decisionBad: 'خسارة محتملة (لا تشرع بالإعلان)',
      currency: 'د.ب',
      searchPH: '🔍 بحث باسم المؤثر أو المنصة...',
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
        noRecords: 'لا توجد سجلات إعلانات مشاهير تطابق بحثك حالياً.',
        th1: '#',
        th2: 'المؤثر والتاريخ',
        th3: 'المنصة',
        th4: 'تكلفة الإعلان',
        th5: 'الطلبات المتوقعة',
        th6: 'صافي أرباح الحملة',
        th7: 'العائد (ROI)',
        th8: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي / المتوسط',
        ordersCount: 'طلب'
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
      desc: 'Analyze the expected ROI from influencer campaigns before investing your marketing budget in Bahrain',
      editRecord: 'Edit Record',
      newRecord: 'New Influencer Analysis',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      infName: 'Influencer Name',
      infNamePH: 'e.g. Khalid',
      platform: 'Ad Platform',
      platSnap: 'Snapchat',
      platTiktok: 'TikTok',
      platInsta: 'Instagram',
      platOther: 'Other Platform',
      adCostLabel: 'Requested Ad Cost',
      adCostPH: '50',
      ordersLabel: 'Expected Orders from Ad',
      ordersPH: '80',
      avgValLabel: 'Average Order Value',
      avgValPH: '25',
      marginLabel: 'Product Net Profit Margin (%)',
      marginPH: '40',
      saveBtnNew: '+ Save Analysis to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Feasibility Analysis',
      netProfit: 'Net Campaign Profit (After Cost)',
      netProfitSub: 'Real profit returning to your pocket',
      roiLabel: 'Return on Investment (ROI %)',
      revenueLabel: 'Total Expected Sales Revenue',
      decisionLabel: 'Suggested Marketing Decision:',
      decisionGood: 'Profitable Ad (Great for colab) 🚀',
      decisionBad: 'Potential Loss (Do NOT proceed)',
      currency: 'BHD',
      searchPH: '🔍 Search by influencer or platform...',
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
        noRecords: 'No influencer ad records match your search.',
        th1: '#',
        th2: 'Influencer & Date',
        th3: 'Platform',
        th4: 'Ad Cost',
        th5: 'Expected Orders',
        th6: 'Net Campaign Profit',
        th7: 'ROI',
        th8: 'Actions',
        totalLabel: 'Grand Total / Average',
        ordersCount: 'orders'
      },
      alerts: {
        limit: '🔒 Sorry, you have reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure influencer name, ad cost, and orders are filled correctly.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ Influencer feasibility added to log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  let decisionStatus = text.decisionBad;
  let statusColor = '#dc2626';
  if (netCampaignProfit > 0) {
    decisionStatus = text.decisionGood;
    statusColor = '#047857';
  }

  const handleClearForm = () => {
    setInfluencerName('');
    setPlatform(lang === 'en' ? 'Snapchat' : 'سناب شات (Snapchat)');
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
    const localeStr = lang === 'ar' ? 'ar-BH' : 'en-BH';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    const dbStatus = netCampaignProfit > 0 ? 'إعلان مربح (ممتاز للتعاون) 🚀' : 'خسارة محتملة (لا تشرع بالإعلان)';

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
        status: dbStatus,
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
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
        status: dbStatus,
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: InfluencerItem) => {
    setInfluencerName(item.influencerName);
    
    const isSnap = item.platform.includes('سناب') || item.platform.includes('Snap');
    const isTik = item.platform.includes('تيك') || item.platform.includes('Tik');
    const isInsta = item.platform.includes('انستغرام') || item.platform.includes('Insta');
    
    if (isSnap) setPlatform(lang === 'ar' ? 'سناب شات (Snapchat)' : 'Snapchat');
    else if (isTik) setPlatform(lang === 'ar' ? 'تيك توك (TikTok)' : 'TikTok');
    else if (isInsta) setPlatform(lang === 'ar' ? 'انستغرام (Instagram)' : 'Instagram');
    else setPlatform(lang === 'ar' ? 'منصة أخرى' : 'Other Platform');

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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.influencerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.platform.toLowerCase().includes(searchQuery.toLowerCase());
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

  const totalAdCosts = filteredItems.reduce((acc, curr) => acc + curr.adCost, 0);
  const totalExpectedOrders = filteredItems.reduce((acc, curr) => acc + curr.expectedOrders, 0);
  const totalNetProfits = filteredItems.reduce((acc, curr) => acc + curr.netCampaignProfit, 0);
  const avgRoi = totalAdCosts > 0 ? (totalNetProfits / totalAdCosts) * 100 : 0;

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
                <th>${text.infName.split('/')[0]}</th>
                <th>Date / Time</th>
                <th>${text.platform}</th>
                <th>${text.table.th4} (${text.currency})</th>
                <th>${text.table.th5}</th>
                <th>${text.table.th6} (${text.currency})</th>
                <th>${text.table.th7} (%)</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.influencerName}</td>
          <td>${row.createdAt || '-'}</td>
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
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="4">${text.table.totalLabel}</td>
                <td>${totalAdCosts.toFixed(2)}</td>
                <td>${totalExpectedOrders}</td>
                <td>${totalNetProfits.toFixed(2)}</td>
                <td>${avgRoi.toFixed(2)}%</td>
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
    link.setAttribute("download", `enjazya_bh_influencers_roi_${dateFilter}.xls`);
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
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #CE1126; background: #ffffff; }
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
            <div className="form-row">
              <div className="input-group">
                <label>{text.infName}</label>
                <div className="input-wrapper">
                  <input type="text" value={influencerName} onChange={(e) => setInfluencerName(e.target.value)} placeholder={text.infNamePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.platform}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value={lang === 'ar' ? 'سناب شات (Snapchat)' : 'Snapchat'}>{text.platSnap}</option>
                    <option value={lang === 'ar' ? 'تيك توك (TikTok)' : 'TikTok'}>{text.platTiktok}</option>
                    <option value={lang === 'ar' ? 'انستغرام (Instagram)' : 'Instagram'}>{text.platInsta}</option>
                    <option value={lang === 'ar' ? 'منصة أخرى' : 'Other Platform'}>{text.platOther}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.adCostLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={adCost === '' ? '' : adCost} onChange={(e) => setAdCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.adCostPH} required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.ordersLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={expectedOrders === '' ? '' : expectedOrders} onChange={(e) => setExpectedOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.ordersPH} required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.avgValLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={avgOrderValue === '' ? '' : avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.avgValPH} required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.marginLabel}</label>
                <div className="input-wrapper">
                  <input type="number" step="1" min="1" max="100" value={productProfitMargin === '' ? '' : productProfitMargin} onChange={(e) => setProductProfitMargin(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.marginPH} required />
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

          <div className={`result-box ${netCampaignProfit > 0 ? 'primary' : ''}`} style={netCampaignProfit <= 0 ? { background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', color: '#fff', border: 'none', padding: '20px' } : {}}>
            <div>
              <div className="result-label" style={{ color: '#fff' }}>{text.netProfit}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px', color: '#fff' }}>{text.netProfitSub}</div>
            </div>
            <div className="result-value" style={{ fontSize: '26px', color: '#ffffff', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
              {netCampaignProfit.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box">
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
                    <td style={{ fontWeight: 800 }}>{item.expectedOrders} {text.table.ordersCount}</td>
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
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title={text.editRecord}>✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title={text.alerts.delConfirm}>❌</button>
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
                  <td>{totalExpectedOrders} {text.table.ordersCount}</td>
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
