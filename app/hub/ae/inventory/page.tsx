'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SeasonItem {
  id: string;
  productName: string;
  seasonName: string;
  normalMonthlySales: number;
  growthRatePercent: number; // نسبة الزيادة المتوقعة بالموسم (%)
  requiredStock: number;     // الكمية المطلوبة للموسم
  createdAt?: string;
}

export default function SeasonalInventoryPlannerAE() {
  const [productName, setProductName] = useState<string>('');
  const [seasonSelect, setSeasonSelect] = useState<string>('مفاجآت صيف دبي (DSS)');
  const [customSeason, setCustomSeason] = useState<string>('مفاجآت صيف دبي (DSS)');
  const [normalMonthlySales, setNormalMonthlySales] = useState<number | ''>('');
  const [growthRatePercent, setGrowthRatePercent] = useState<number | ''>(150); // نسبة نمو افتراضية 150%

  const [items, setItems] = useState<SeasonItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // تم تغيير مفتاح التخزين لفصل البيانات للإمارات
    const saved = localStorage.getItem('seerk_ae_seasonal_inventory_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: SeasonItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ae_seasonal_inventory_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const sales = typeof normalMonthlySales === 'number' ? normalMonthlySales : 0;
  const growth = typeof growthRatePercent === 'number' ? growthRatePercent : 0;

  // الحساب: الكمية المطلوبة للموسم = المبيعات العادية + نسبة النمو المتوقعة
  const requiredStock = Math.round(sales + (sales * (growth / 100)));

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSeasonSelect(val);
    if (val !== 'موسم آخر (كتابة يدوية)') {
      setCustomSeason(val);
    } else {
      setCustomSeason('');
    }
  };

  const handleClearForm = () => {
    setProductName('');
    setSeasonSelect('مفاجآت صيف دبي (DSS)');
    setCustomSeason('مفاجآت صيف دبي (DSS)');
    setNormalMonthlySales('');
    setGrowthRatePercent(150);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    const finalSeason = seasonSelect === 'موسم آخر (كتابة يدوية)' ? customSeason : seasonSelect;
    if (!productName.trim() || !finalSeason.trim() || sales <= 0) {
      alert('الرجاء التأكد من تعبئة اسم المنتج، الموسم، ومعدل مبيعات صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    // تعديل التوقيت ليطابق الإمارات
    const formattedDate = `${now.toLocaleDateString('ar-AE')} - ${now.toLocaleTimeString('ar-AE', timeOptions)}`;

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
      alert('✨ تم تحديث خطة المخزون بنجاح!');
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
      alert('✅ تمت إضافة خطة المخزون للموسم بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: SeasonItem) => {
    setProductName(item.productName);
    const standardSeasons = ['مفاجآت صيف دبي (DSS)', 'اليوم الوطني الإماراتي', 'مهرجان دبي للتسوق (DSF)', 'الجمعة البيضاء / السوداء', 'موسم رمضان والعيد'];
    if (standardSeasons.includes(item.seasonName)) {
      setSeasonSelect(item.seasonName);
      setCustomSeason(item.seasonName);
    } else {
      setSeasonSelect('موسم آخر (كتابة يدوية)');
      setCustomSeason(item.seasonName);
    }
    setNormalMonthlySales(item.normalMonthlySales);
    setGrowthRatePercent(item.growthRatePercent);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalNormalSalesSum = items.reduce((acc, curr) => acc + curr.normalMonthlySales, 0);
  const totalRequiredStockSum = items.reduce((acc, curr) => acc + curr.requiredStock, 0);

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
                <th>اسم المنتج</th>
                <th>التاريخ والوقت</th>
                <th>الموسم المستهدف</th>
                <th>المبيعات العادية (شهرياً)</th>
                <th>نسبة النمو المتوقعة (%)</th>
                <th>الكمية المطلوبة للموسم</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
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
                <td colspan="4">الإجمالي الكلي</td>
                <td>${totalNormalSalesSum}</td>
                <td>-</td>
                <td>${totalRequiredStockSum} وحدة</td>
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
    link.setAttribute("download", "seerk_ae_seasonal_inventory.xls");
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
            alert('✨ تم استيراد بيانات المخزون الموسمي بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.seasonName.toLowerCase().includes(searchQuery.toLowerCase())
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
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value { font-size: 26px; color: #ffffff; }

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
          <h1>مخطط المخزون للمواسم الإماراتية 📅</h1>
          <p>توقع الكميات المطلوبة لمواسم الإمارات (مفاجآت صيف دبي، العيد، اليوم الوطني) لتجنب نفاد المخزون</p>
        </div>
        <Link href="/hub/ae" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل السجل' : 'تخطيط مخزون لموسم جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المنتج أو الفئة</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: عبايات نسائية فاخرة" required />
              </div>
            </div>

            <div className="input-group">
              <label>اختر الموسم المستهدف</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={seasonSelect} onChange={handleSelectChange}>
                  <option value="مفاجآت صيف دبي (DSS)">مفاجآت صيف دبي (DSS) 🛍️</option>
                  <option value="اليوم الوطني الإماراتي">اليوم الوطني الإماراتي 🇦🇪</option>
                  <option value="مهرجان دبي للتسوق (DSF)">مهرجان دبي للتسوق (DSF) ⭐</option>
                  <option value="الجمعة البيضاء / السوداء">الجمعة البيضاء / السوداء 🏷️</option>
                  <option value="موسم رمضان والعيد">موسم رمضان والعيد 🌙</option>
                  <option value="موسم آخر (كتابة يدوية)">➕ موسم آخر (كتابة يدوية)</option>
                </select>
              </div>

              {seasonSelect === 'موسم آخر (كتابة يدوية)' && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customSeason} 
                    onChange={(e) => setCustomSeason(e.target.value)} 
                    placeholder="اكتب اسم الموسم هنا..." 
                    required 
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>مبيعات المنتج العادية (شهرياً)</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={normalMonthlySales === '' ? '' : normalMonthlySales} onChange={(e) => setNormalMonthlySales(e.target.value === '' ? '' : Number(e.target.value))} placeholder="100" required />
                </div>
              </div>
              <div className="input-group">
                <label>نسبة نمو المبيعات بالموسم (%)</label>
                <div className="input-wrapper">
                  <input type="number" min="0" max="1000" value={growthRatePercent === '' ? '' : growthRatePercent} onChange={(e) => setGrowthRatePercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder="150" required />
                  <span className="currency-tag">%</span>
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ الخطة في السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">توقع المخزون الموسمي الفوري</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">الكمية المطلوبة لتغطية الموسم</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>المخزون الكافي لتجنب نفاد البضاعة</div>
            </div>
            <div className="result-value">
              {requiredStock} وحدة
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">معدل المبيعات الشهري العادي</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{sales} وحدة/شهر</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">نسبة الطلب المتوقعة في الموسم</span>
            <span className="result-value" style={{ color: '#047857' }}>+{growth}%</span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث بالمنتج أو الموسم..." 
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
                <th>المنتج والتاريخ</th>
                <th>الموسم المستهدف</th>
                <th>المبيعات العادية</th>
                <th>نسبة النمو</th>
                <th>الكمية المطلوبة للموسم</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد خطط مخزون موسمية مسجلة حالياً.
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
                    <td>{item.normalMonthlySales} وحدة</td>
                    <td><span style={{ color: '#d97706', fontWeight: 800 }}>+{item.growthRatePercent}%</span></td>
                    <td style={{ fontWeight: 900, color: '#0f172a' }}>{item.requiredStock} وحدة</td>
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
                  <td colSpan={3} style={{ textAlign: 'center' }}>الإجمالي الكلي</td>
                  <td>{totalNormalSalesSum} وحدة</td>
                  <td>-</td>
                  <td style={{ color: '#047857' }}>{totalRequiredStockSum} وحدة</td>
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
