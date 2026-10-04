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
  productProfitMargin: number; // نسبة أو قيمة الربح الصافي للطلب الواحد
  netCampaignProfit: number;
  roiPercent: number;
  status: string;
  createdAt?: string;
}

export default function InfluencersCalculatorSA() {
  const [influencerName, setInfluencerName] = useState<string>('');
  const [platform, setPlatform] = useState<string>('سناب شات (Snapchat)');
  const [adCost, setAdCost] = useState<number | ''>('');
  const [expectedOrders, setExpectedOrders] = useState<number | ''>('');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>('');
  const [productProfitMargin, setProductProfitMargin] = useState<number | ''>(40); // نسبة الربح الصافي الافتراضية 40%

  const [items, setItems] = useState<InfluencerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_influencers_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: InfluencerItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_influencers_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const cost = typeof adCost === 'number' ? adCost : 0;
  const orders = typeof expectedOrders === 'number' ? expectedOrders : 0;
  const orderVal = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const margin = typeof productProfitMargin === 'number' ? productProfitMargin : 0;

  // الحسابات
  const totalRevenue = orders * orderVal;
  const grossProfit = totalRevenue * (margin / 100);
  const netCampaignProfit = grossProfit - cost; // الربح الصافي بعد خصم تكلفة الإعلان
  const roiPercent = cost > 0 ? (netCampaignProfit / cost) * 100 : 0;

  let decisionStatus = 'خسارة محتملة (لا تشرع بالإعلان)';
  let statusColor = '#dc2626';
  if (netCampaignProfit > 0) {
    decisionStatus = 'إعلان مربح (ممتاز للتعاون) 🚀';
    statusColor = '#047857';
  }

  const handleClearForm = () => {
    setInfluencerName('');
    setPlatform('سناب شات (Snapchat)');
    setAdCost('');
    setExpectedOrders('');
    setAvgOrderValue('');
    setProductProfitMargin(40);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!influencerName.trim() || cost <= 0 || orders <= 0) {
      alert('الرجاء التأكد من تعبئة اسم المؤثر، تكلفة الإعلان، وعدد الطلبات بشكل صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

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
      alert('✨ تم تحديث السجل بنجاح!');
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
      alert('✅ تمت إضافة جدوى الإعلان إلى السجل بنجاح!');
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
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
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
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    let tableHtml = `
      <html dir="rtl" lang="ar">
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
                <th>م</th>
                <th>اسم المؤثر</th>
                <th>التاريخ والوقت</th>
                <th>المنصة</th>
                <th>تكلفة الإعلان</th>
                <th>الطلبات المتوقعة</th>
                <th>صافي أرباح الحملة</th>
                <th>العائد (ROI %)</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
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
                <td colspan="4">الإجمالي الكلي / المتوسط</td>
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
    link.setAttribute("download", "seerk_influencers_roi.xls");
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
            alert('✨ تم استيراد البيانات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.influencerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input.with-currency { padding-left: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value, .danger .result-value { font-size: 26px; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: 'Tajawal', sans-serif;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة جدوى إعلانات المشاهير والمؤثرين 🤝</h1>
          <p>حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل السجل' : 'تحليل إعلان مؤثر جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>اسم المؤثر / المشهور</label>
                <div className="input-wrapper">
                  <input type="text" value={influencerName} onChange={(e) => setInfluencerName(e.target.value)} placeholder="مثال: سلطان بن نايف" required />
                </div>
              </div>
              <div className="input-group">
                <label>المنصة الإعلانية</label>
                <div className="input-wrapper">
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value="سناب شات (Snapchat)">سناب شات (Snapchat)</option>
                    <option value="تيك توك (TikTok)">تيك توك (TikTok)</option>
                    <option value="انستغرام (Instagram)">انستغرام (Instagram)</option>
                    <option value="منصة أخرى">منصة أخرى</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>تكلفة الإعلان المطلوبة (ر.س)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={adCost === '' ? '' : adCost} onChange={(e) => setAdCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="5000" required />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
              <div className="input-group">
                <label>عدد الطلبات المتوقعة من الإعلان</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={expectedOrders === '' ? '' : expectedOrders} onChange={(e) => setExpectedOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="80" required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>متوسط قيمة الطلب (ر.س)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={avgOrderValue === '' ? '' : avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="250" required />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
              <div className="input-group">
                <label>نسبة صافي الربح من المنتج (%)</label>
                <div className="input-wrapper">
                  <input type="number" step="1" min="1" max="100" value={productProfitMargin === '' ? '' : productProfitMargin} onChange={(e) => setProductProfitMargin(e.target.value === '' ? '' : Number(e.target.value))} placeholder="40" required />
                  <span className="currency-tag">%</span>
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ التحليل في السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">تحليل الجدوى الفوري</h2>

          <div className={`result-box ${netCampaignProfit > 0 ? 'primary' : 'danger'}`}>
            <div>
              <div className="result-label">صافي ربح الحملة (بعد خصم التكلفة)</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>الربح الحقيقي العائد لجيبك</div>
            </div>
            <div className="result-value">
              {netCampaignProfit.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">عائد الاستثمار (ROI %)</span>
            <span className="result-value" style={{ color: roiPercent > 0 ? '#047857' : '#dc2626' }}>{roiPercent.toFixed(2)}%</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">إجمالي إيرادات المبيعات المتوقعة</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{totalRevenue.toFixed(2)} ر.س</span>
          </div>

          <div style={{ marginTop: '15px', padding: '12px', borderRadius: '8px', background: netCampaignProfit > 0 ? '#ecfdf5' : '#fef2f2', border: `1px solid ${netCampaignProfit > 0 ? '#a7f3d0' : '#fecaca'}`, textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '3px', fontWeight: 800 }}>القرار التسويقي المقترح:</div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: statusColor }}>{decisionStatus}</div>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المؤثر أو المنصة..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel} title="تصدير بصيغة Excel لدعم اللغة العربية">📥 تصدير Excel</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 استيراد</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>المؤثر والتاريخ</th>
                <th>المنصة</th>
                <th>تكلفة الإعلان</th>
                <th>الطلبات المتوقعة</th>
                <th>صافي أرباح الحملة</th>
                <th>العائد (ROI)</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سجلات إعلانات مشاهير مسجلة حالياً.
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
                    <td style={{ color: '#dc2626' }}>{item.adCost} ر.س</td>
                    <td style={{ fontWeight: 800 }}>{item.expectedOrders} طلب</td>
                    <td style={{ fontWeight: 900, color: item.netCampaignProfit > 0 ? '#047857' : '#dc2626' }}>
                      {item.netCampaignProfit} ر.س
                    </td>
                    <td>
                      <span style={{ color: item.roiPercent > 0 ? '#047857' : '#dc2626', fontWeight: 900 }}>
                        {item.roiPercent}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={3} style={{ textAlign: 'center' }}>الإجمالي الكلي / المتوسط</td>
                  <td style={{ color: '#dc2626' }}>{totalAdCosts.toFixed(2)} ر.س</td>
                  <td>{totalExpectedOrders} طلب</td>
                  <td style={{ color: totalNetProfits > 0 ? '#047857' : '#dc2626' }}>{totalNetProfits.toFixed(2)} ر.س</td>
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
