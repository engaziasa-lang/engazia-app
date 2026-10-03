'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface RoasItem {
  id: string;
  campaignName: string;
  platform: string;
  adSpend: number;
  totalRevenue: number;
  ordersCount: number;
  roas: number;
  cpa: number;
}

export default function RoasAnalyzerSA() {
  const [campaignName, setCampaignName] = useState<string>('حملة إكسبلور العيد');
  const [platform, setPlatform] = useState<string>('تيك توك (TikTok Ads)');
  const [adSpend, setAdSpend] = useState<number | ''>(1500);
  const [totalRevenue, setTotalRevenue] = useState<number | ''>(6000);
  const [ordersCount, setOrdersCount] = useState<number | ''>(40);

  const [items, setItems] = useState<RoasItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_roas_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: RoasItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_roas_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const spend = typeof adSpend === 'number' ? adSpend : 0;
  const rev = typeof totalRevenue === 'number' ? totalRevenue : 0;
  const orders = typeof ordersCount === 'number' && ordersCount > 0 ? ordersCount : 0;

  // الحسابات الفعلية
  const roas = spend > 0 ? rev / spend : 0;
  const cpa = orders > 0 ? spend / orders : 0;

  const handleClearForm = () => {
    setCampaignName('');
    setPlatform('تيك توك (TikTok Ads)');
    setAdSpend('');
    setTotalRevenue('');
    setOrdersCount('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 حملات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!campaignName.trim() || spend <= 0) {
      alert('الرجاء إدخال اسم الحملة وميزانية الإعلان بشكل صحيح.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        campaignName,
        platform,
        adSpend: spend,
        totalRevenue: rev,
        ordersCount: orders,
        roas: Number(roas.toFixed(2)),
        cpa: Number(cpa.toFixed(2)),
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث الحملة بنجاح!');
    } else {
      const newItem: RoasItem = {
        id: Date.now().toString(),
        campaignName,
        platform,
        adSpend: spend,
        totalRevenue: rev,
        ordersCount: orders,
        roas: Number(roas.toFixed(2)),
        cpa: Number(cpa.toFixed(2)),
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الحملة إلى سجل التحليل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: RoasItem) => {
    setCampaignName(item.campaignName);
    setPlatform(item.platform);
    setAdSpend(item.adSpend);
    setTotalRevenue(item.totalRevenue);
    setOrdersCount(item.ordersCount);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الحملة من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,Campaign,Platform,Spend,Revenue,ROAS,CPA\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.campaignName},${row.platform},${row.adSpend},${row.totalRevenue},${row.roas},${row.cpa}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_roas_analysis.csv");
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
            alert('✨ تم استيراد بيانات الحملات بنجاح!');
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

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 40px auto; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value, .danger .result-value { font-size: 26px; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 250px; }
        .table-btns { display: flex; gap: 10px; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; }
        .t-btn:hover { background: #f1f5f9; }

        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>محلل عائد الإعلانات (سناب وتيك توك) 📈</h1>
          <p>قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق السعودي أم تستنزف ميزانيتك</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{editingId ? 'تعديل الحملة' : 'تحليل حملة جديدة'}</span>
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
              <label>المنصة الإعلانية</label>
              <div className="input-wrapper">
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="تيك توك (TikTok Ads)">تيك توك (TikTok Ads)</option>
                  <option value="سناب شات (Snapchat Ads)">سناب شات (Snapchat Ads)</option>
                  <option value="إعلانات جوجل (Google Ads)">إعلانات جوجل (Google Ads)</option>
                  <option value="ميتا (Instagram / Meta)">ميتا (Instagram / Meta)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>ميزانية أو تكلفة الحملة الإعلانية (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={adSpend === '' ? '' : adSpend} onChange={(e) => setAdSpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1500" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>إجمالي المبيعات أو الإيرادات الناتجة (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={totalRevenue === '' ? '' : totalRevenue} onChange={(e) => setTotalRevenue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="6000" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>عدد الطلبات المحققة من الحملة</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={ordersCount === '' ? '' : ordersCount} onChange={(e) => setOrdersCount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="40" required />
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ وإضافة الحملة للسجل'}
            </button>
          </form>
        </div>

        {/* قسم التحليل الفوري */}
        <div className="card">
          <h2 className="card-title">تحليل أداء الحملة الفوري</h2>

          <div className={`result-box ${roas >= 3 ? 'primary' : roas >= 1.5 ? '' : 'danger'}`}>
            <div>
              <div className="result-label">عائد الإنفاق الإعلاني (ROAS)</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>كل ريال تم إنفاقه حقق (س) ريال إيرادات</div>
            </div>
            <div className="result-value">
              {roas.toFixed(2)}x
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">تكلفة الاستحواذ الفعلية للطلب الواحد (CPA)</span>
            <span className="result-value" style={{ color: '#047857' }}>{cpa.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي العائد صافي المضاعفة</span>
            <span className="result-value" style={{ color: rev - spend >= 0 ? '#10b981' : '#dc2626' }}>
              {(rev - spend).toFixed(2)} ر.س
            </span>
          </div>
        </div>
      </div>

      {/* جدول إدارة الحملات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث في الحملات أو المنصات..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportCsv}>📥 تصدير CSV</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 استيراد</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الحملة</th>
                <th>المنصة</th>
                <th>الميزانية</th>
                <th>الإيرادات</th>
                <th>ROAS</th>
                <th>تكلفة الطلب (CPA)</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد حملات مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.campaignName}</td>
                    <td>{item.platform}</td>
                    <td>{item.adSpend} ر.س</td>
                    <td>{item.totalRevenue} ر.س</td>
                    <td style={{ color: item.roas >= 3 ? '#047857' : '#d97706', fontWeight: 900 }}>{item.roas}x</td>
                    <td>{item.cpa} ر.س</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(item)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>تعديل</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
