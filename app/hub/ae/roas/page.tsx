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

export default function RoasCalculatorSA() {
  const [campaignName, setCampaignName] = useState<string>('');
  const [platformInput, setPlatformInput] = useState<string>('تيك توك (TikTok Ads)');
  const [adSpend, setAdSpend] = useState<number | ''>('');
  const [ordersGenerated, setOrdersGenerated] = useState<number | ''>('');
  const [revenueGenerated, setRevenueGenerated] = useState<number | ''>('');

  const [items, setItems] = useState<RoasItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_roas_calculator_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: RoasItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_roas_calculator_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const spend = typeof adSpend === 'number' ? adSpend : 0;
  const orders = typeof ordersGenerated === 'number' ? ordersGenerated : 0;
  const rev = typeof revenueGenerated === 'number' ? revenueGenerated : 0;

  // الحسابات الفعلية
  const cac = orders > 0 ? spend / orders : 0; // تكلفة الاستحواذ على العميل
  const roas = spend > 0 ? rev / spend : 0; // العائد على الإنفاق الإعلاني

  let status = 'خسارة (إيقاف الحملة)';
  let statusColor = '#dc2626';
  if (roas >= 3) {
    status = 'ممتاز جداً (زيادة الميزانية) 🚀';
    statusColor = '#047857';
  } else if (roas >= 1.5) {
    status = 'جيد (تحتاج تحسين)';
    statusColor = '#d97706';
  }

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatformInput(e.target.value);
  };

  const handleClearForm = () => {
    setCampaignName('');
    setPlatformInput('تيك توك (TikTok Ads)');
    setAdSpend('');
    setOrdersGenerated('');
    setRevenueGenerated('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 حملات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!campaignName.trim() || spend <= 0) {
      alert('الرجاء إدخال اسم الحملة والميزانية بشكل صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        campaignName,
        platform: platformInput,
        adSpend: spend,
        ordersGenerated: orders,
        revenueGenerated: rev,
        cac: Number(cac.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        status,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث الحملة بنجاح!');
    } else {
      const newItem: RoasItem = {
        id: Date.now().toString(),
        campaignName,
        platform: platformInput,
        adSpend: spend,
        ordersGenerated: orders,
        revenueGenerated: rev,
        cac: Number(cac.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        status,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة التحليل إلى السجل بنجاح!');
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
    if (confirm('هل أنت متأكد من حذف هذه الحملة من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const totalAdSpend = items.reduce((acc, curr) => acc + curr.adSpend, 0);
    const totalOrders = items.reduce((acc, curr) => acc + curr.ordersGenerated, 0);
    const totalRevenue = items.reduce((acc, curr) => acc + curr.revenueGenerated, 0);
    const overallRoas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
    const overallCac = totalOrders > 0 ? totalAdSpend / totalOrders : 0;

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
                <th>اسم الحملة</th>
                <th>التاريخ والوقت</th>
                <th>المنصة الإعلانية</th>
                <th>الميزانية (الإنفاق)</th>
                <th>عدد الطلبات</th>
                <th>إجمالي العائد</th>
                <th>تكلفة الاستحواذ (CAC)</th>
                <th>مؤشر العائد (ROAS)</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.campaignName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.platform}</td>
          <td>${row.adSpend}</td>
          <td>${row.ordersGenerated}</td>
          <td>${row.revenueGenerated}</td>
          <td>${row.cac}</td>
          <td>${row.roas}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="4">الإجمالي الكلي / المتوسط</td>
                <td>${totalAdSpend.toFixed(2)}</td>
                <td>${totalOrders}</td>
                <td>${totalRevenue.toFixed(2)}</td>
                <td>${overallCac.toFixed(2)}</td>
                <td>${overallRoas.toFixed(2)}x</td>
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
    link.setAttribute("download", "seerk_roas_analysis.xls");
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
    item.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAdSpend = filteredItems.reduce((acc, curr) => acc + curr.adSpend, 0);
  const totalOrders = filteredItems.reduce((acc, curr) => acc + curr.ordersGenerated, 0);
  const totalRevenue = filteredItems.reduce((acc, curr) => acc + curr.revenueGenerated, 0);
  const overallRoas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
  const overallCac = totalOrders > 0 ? totalAdSpend / totalOrders : 0;

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

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-box.warning { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 20px; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label, .warning .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value, .danger .result-value, .warning .result-value { font-size: 26px; color: #ffffff; }

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
          <h1>محلل عائد الإعلانات (ROAS) 📈</h1>
          <p>قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية أم تستنزف ميزانيتك</p>
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
              <span>{editingId ? 'تعديل الحملة' : 'تحليل حملة إعلانية جديدة'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم الحملة الإعلانية</label>
              <div className="input-wrapper">
                <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="مثال: حملة إكسبلور العيد" required />
              </div>
            </div>

            <div className="input-group">
              <label>اختيار المنصة (أو كتابتها يدوياً)</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select onChange={handlePresetChange} defaultValue="تيك توك (TikTok Ads)" style={{ padding: '10px' }}>
                  <option value="تيك توك (TikTok Ads)">تيك توك (TikTok Ads)</option>
                  <option value="سناب شات (Snapchat Ads)">سناب شات (Snapchat Ads)</option>
                  <option value="إعلانات جوجل (Google Ads)">إعلانات جوجل (Google Ads)</option>
                  <option value="ميتا (Instagram / Meta)">ميتا (Instagram / Meta)</option>
                </select>
              </div>
              <div className="input-wrapper">
                <input type="text" value={platformInput} onChange={(e) => setPlatformInput(e.target.value)} placeholder="اسم المنصة الفعلي" required />
              </div>
            </div>

            <div className="input-group">
              <label>الميزانية المنفقة على الحملة (Ad Spend)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={adSpend === '' ? '' : adSpend} onChange={(e) => setAdSpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="6000" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>عدد الطلبات المحققة من الحملة</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={ordersGenerated === '' ? '' : ordersGenerated} onChange={(e) => setOrdersGenerated(e.target.value === '' ? '' : Number(e.target.value))} placeholder="120" />
              </div>
            </div>

            <div className="input-group">
              <label>إجمالي العائد المحقق (Revenue)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={revenueGenerated === '' ? '' : revenueGenerated} onChange={(e) => setRevenueGenerated(e.target.value === '' ? '' : Number(e.target.value))} placeholder="24000" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ التحليل في السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">مؤشرات الأداء الفورية (KPIs)</h2>

          <div className={`result-box ${roas >= 3 ? 'primary' : roas >= 1.5 ? 'warning' : 'danger'}`}>
            <div>
              <div className="result-label">مؤشر العائد على الإنفاق (ROAS)</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>كل ريال تم إنفاقه كم حقق إيرادات</div>
            </div>
            <div className="result-value">
              {roas.toFixed(2)}x
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">تكلفة الاستحواذ على العميل (CAC)</span>
            <span className="result-value" style={{ color: '#047857' }}>{cac.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">إجمالي العائد (Revenue)</span>
            <span className="result-value">{rev.toFixed(2)} ر.س</span>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', background: roas >= 3 ? '#ecfdf5' : roas >= 1.5 ? '#fffbeb' : '#fef2f2', border: `1px solid ${roas >= 3 ? '#a7f3d0' : roas >= 1.5 ? '#fde68a' : '#fecaca'}`, textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '5px', fontWeight: 800 }}>القرار المقترح للحملة:</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: statusColor }}>{status}</div>
          </div>
        </div>
      </div>

      {/* جدول إدارة البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث في الحملات..." 
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
                <th>الحملة والمنصة</th>
                <th>الإنفاق</th>
                <th>الطلبات (CAC)</th>
                <th>العائد (Revenue)</th>
                <th>مؤشر (ROAS)</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد حملات إعلانية مسجلة في الجدول حالياً.
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
                    <td style={{ color: '#dc2626' }}>{item.adSpend} ر.س</td>
                    <td>
                      <div style={{ fontWeight: 800 }}>{item.ordersGenerated} طلب</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>CAC: {item.cac} ر.س</div>
                    </td>
                    <td style={{ fontWeight: 900 }}>{item.revenueGenerated} ر.س</td>
                    <td>
                      <span style={{ background: item.roas >= 3 ? '#ecfdf5' : item.roas >= 1.5 ? '#fffbeb' : '#fef2f2', color: item.roas >= 3 ? '#047857' : item.roas >= 1.5 ? '#d97706' : '#dc2626', padding: '4px 8px', borderRadius: '6px', fontWeight: 900, fontSize: '14px' }}>
                        {item.roas}x
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل">✏️ تعديل</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌ حذف</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={2} style={{ textAlign: 'center' }}>الإجمالي الكلي / المتوسط</td>
                  <td style={{ color: '#dc2626' }}>{totalAdSpend.toFixed(2)} ر.س</td>
                  <td>
                    <div>{totalOrders} طلب</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>CAC: {overallCac.toFixed(2)} ر.س</div>
                  </td>
                  <td>{totalRevenue.toFixed(2)} ر.س</td>
                  <td style={{ color: overallRoas >= 3 ? '#047857' : overallRoas >= 1.5 ? '#d97706' : '#dc2626' }}>{overallRoas.toFixed(2)}x</td>
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
