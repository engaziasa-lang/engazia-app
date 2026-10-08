'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ReturnItem {
  id: string;
  productName: string;
  returnedOrders: number;
  avgOrderValue: number;
  reverseShippingCost: number;
  damageCost: number;
  totalLoss: number;        
  totalLostRevenue: number;  
  createdAt?: string;
}

export default function ReturnsAnalyzerKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [productName, setProductName] = useState<string>('');
  const [returnedOrders, setReturnedOrders] = useState<number | ''>('');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>('');
  const [reverseShippingCost, setReverseShippingCost] = useState<number | ''>(2.5);
  const [damageCost, setDamageCost] = useState<number | ''>(0.5);

  const [items, setItems] = useState<ReturnItem[]>([]);
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

    const saved = localStorage.getItem('seerk_kw_returns_analysis_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ReturnItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_returns_analysis_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'محلل خسائر المرتجعات والشحن العكسي 🔄',
      desc: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي في السوق الكويتي',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب خسائر منتج جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodNameLabel: 'اسم المنتج أو الفئة المسترجعة',
      prodNamePH: 'مثال: فساتين سهرة مقاس M',
      returnsCountLabel: 'عدد الطلبات المسترجعة',
      orderValLabel: 'متوسط قيمة الطلب',
      revShipLabel: 'تكلفة الشحن العكسي للطلب الواحد',
      dmgLabel: 'تكلفة التغليف المهدر / التالف للطلب',
      currency: 'د.ك',
      saveBtnNew: '+ حفظ وإضافة السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'تحليل الخسائر الفوري (لهذا المنتج)',
      totalLossLabel: 'إجمالي الخسارة الفعلية المباشرة',
      totalLossSub: 'مبالغ دُفعت للشحن العكسي والتوالف',
      lostRevLabel: 'إجمالي المبيعات المفقودة',
      lostRevSub: 'إيرادات طارت بسبب الاسترجاع',
      unitLossLabel: 'الخسارة التشغيلية للطلب الواحد',
      searchPH: '🔍 بحث في المنتجات المسترجعة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد بيانات مسجلة. قم بإضافة بيانات مرتجعات لتحليلها.',
        th1: '#',
        th2: 'اسم المنتج والتاريخ',
        th3: 'عدد المرتجعات',
        th4: 'المبيعات المفقودة',
        th5: 'الشحن العكسي والتالف',
        th6: 'الخسارة الفعلية',
        th7: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي',
        ordersUnit: 'طلب',
        shipText: 'شحن:',
        dmgText: 'تالف:'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من إدخال اسم المنتج أو الفئة وعدد المرتجعات بشكل صحيح.',
        updateSuccess: '✨ تم تحديث بيانات السجل بنجاح!',
        saveSuccess: '✅ تم إضافة بيانات الاسترجاع إلى السجل!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Returns & Reverse Logistics Loss Analyzer 🔄',
      desc: 'Measure the impact of returns and exchanges on your monthly net profit and cash flow in Kuwait',
      editRecord: 'Edit Record',
      newRecord: 'Calculate New Product Losses',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodNameLabel: 'Returned Product Name or Category',
      prodNamePH: 'e.g. Evening Dresses Size M',
      returnsCountLabel: 'Returned Orders Count',
      orderValLabel: 'Average Order Value',
      revShipLabel: 'Reverse Shipping Cost per Order',
      dmgLabel: 'Wasted Packaging / Damage Cost per Order',
      currency: 'KWD',
      saveBtnNew: '+ Save & Add Record',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Loss Analysis (For this product)',
      totalLossLabel: 'Total Direct Actual Loss',
      totalLossSub: 'Amounts paid for reverse shipping & damages',
      lostRevLabel: 'Total Lost Sales Revenue',
      lostRevSub: 'Revenue lost due to returns',
      unitLossLabel: 'Operational Loss per Single Order',
      searchPH: '🔍 Search returned products...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No data registered. Add return data to analyze.',
        th1: '#',
        th2: 'Product & Date',
        th3: 'Returns Count',
        th4: 'Lost Revenue',
        th5: 'Reverse Ship & Damage',
        th6: 'Actual Loss',
        th7: 'Actions',
        totalLabel: 'Grand Total',
        ordersUnit: 'orders',
        shipText: 'Ship:',
        dmgText: 'Dmg:'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure product name or category and return count are entered correctly.',
        updateSuccess: '✨ Record data updated successfully!',
        saveSuccess: '✅ Return data added to log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const returnsCount = typeof returnedOrders === 'number' ? returnedOrders : 0;
  const avgVal = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const revShipping = typeof reverseShippingCost === 'number' ? reverseShippingCost : 0;
  const dmg = typeof damageCost === 'number' ? damageCost : 0;

  const totalLostRevenue = returnsCount * avgVal;
  const lossPerOrder = revShipping + dmg;
  const totalLoss = returnsCount * lossPerOrder;

  const handleClearForm = () => {
    setProductName('');
    setReturnedOrders('');
    setAvgOrderValue('');
    setReverseShippingCost(2.5);
    setDamageCost(0.5);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!productName.trim() || returnsCount <= 0) {
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
        productName,
        returnedOrders: returnsCount,
        avgOrderValue: avgVal,
        reverseShippingCost: revShipping,
        damageCost: dmg,
        totalLoss: Number(totalLoss.toFixed(3)),
        totalLostRevenue: Number(totalLostRevenue.toFixed(3)),
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: ReturnItem = {
        id: Date.now().toString(),
        productName,
        returnedOrders: returnsCount,
        avgOrderValue: avgVal,
        reverseShippingCost: revShipping,
        damageCost: dmg,
        totalLoss: Number(totalLoss.toFixed(3)),
        totalLostRevenue: Number(totalLostRevenue.toFixed(3)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: ReturnItem) => {
    setProductName(item.productName);
    setReturnedOrders(item.returnedOrders);
    setAvgOrderValue(item.avgOrderValue);
    setReverseShippingCost(item.reverseShippingCost);
    setDamageCost(item.damageCost);
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
          <h2>Returns Analyzer Report (KW)</h2>
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
          <td>${row.returnedOrders}</td>
          <td>${row.totalLostRevenue}</td>
          <td>${row.reverseShippingCost + row.damageCost}</td>
          <td>${row.totalLoss}</td>
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
    link.setAttribute("download", "enjazya_kw_returns.xls");
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
    item.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sumReturns = filteredItems.reduce((acc, curr) => acc + curr.returnedOrders, 0);
  const sumLostRev = filteredItems.reduce((acc, curr) => acc + curr.totalLostRevenue, 0);
  const sumActualLoss = filteredItems.reduce((acc, curr) => acc + curr.totalLoss, 0);

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
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2); }
        .result-box.warning { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.2); }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label, .warning .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .danger .result-value, .warning .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .t-btn:hover { background: #f1f5f9; color: #0284c7; border-color: #0284c7; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 850px; }
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
              <label>{text.prodNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodNamePH} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.returnsCountLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={returnedOrders === '' ? '' : returnedOrders} onChange={(e) => setReturnedOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="15" required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.orderValLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.001" min="0" value={avgOrderValue === '' ? '' : avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="35" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.revShipLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.001" min="0" value={reverseShippingCost === '' ? '' : reverseShippingCost} onChange={(e) => setReverseShippingCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2.5" />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.dmgLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.001" min="0" value={damageCost === '' ? '' : damageCost} onChange={(e) => setDamageCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0.5" />
                  <span className="currency-tag">{text.currency}</span>
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
              <div className="result-label">{text.totalLossLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalLossSub}</div>
            </div>
            <div className="result-value">
              {totalLoss.toFixed(3)} {text.currency}
            </div>
          </div>

          <div className="result-box warning">
            <div>
              <div className="result-label">{text.lostRevLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.lostRevSub}</div>
            </div>
            <div className="result-value">
              {totalLostRevenue.toFixed(3)} {text.currency}
            </div>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.unitLossLabel}</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{lossPerOrder.toFixed(3)} {text.currency}</span>
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
                    <td style={{ fontWeight: 800 }}>{item.returnedOrders} {text.table.ordersUnit}</td>
                    <td style={{ color: '#d97706', fontWeight: 800 }}>{item.totalLostRevenue.toFixed(3)} {text.currency}</td>
                    <td style={{ fontSize: '12px' }}>
                      <div style={{ color: '#475569' }}>{text.table.shipText} {item.reverseShippingCost.toFixed(3)} {text.currency}</div>
                      <div style={{ color: '#64748b' }}>{text.table.dmgText} {item.damageCost.toFixed(3)} {text.currency}</div>
                    </td>
                    <td style={{ color: '#dc2626', fontWeight: 900 }}>{item.totalLoss.toFixed(3)} {text.currency}</td>
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
                  <td colSpan={2} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{sumReturns} {text.table.ordersUnit}</td>
                  <td style={{ color: '#d97706' }}>{sumLostRev.toFixed(3)} {text.currency}</td>
                  <td></td>
                  <td style={{ color: '#dc2626' }}>{sumActualLoss.toFixed(3)} {text.currency}</td>
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
