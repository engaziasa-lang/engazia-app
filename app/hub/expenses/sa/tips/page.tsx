'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface GrowthItem {
  id: string;
  strategyName: string;
  category: string;
  description: string;
  executionStatus: string;
  createdAt?: string;
}

export default function StoreGrowthSecretsSA() {
  // تفريغ الحقول بالكامل كقيمة ابتدائية
  const [strategyName, setStrategyName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // القوائم المنسدلة
  const [categorySelect, setCategorySelect] = useState<string>('زيادة معدل التحويل 🚀');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [executionStatus, setExecutionStatus] = useState<string>('لم تبدأ ⏸️');

  const [items, setItems] = useState<GrowthItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // حماية ضد أخطاء Hydration
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const saved = localStorage.getItem('seerk_growth_secrets_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: GrowthItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_growth_secrets_items', JSON.stringify(newItems));
  };

  const actualCategory = categorySelect === 'تصنيف آخر (كتابة يدوية)' ? customCategory : categorySelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategorySelect(val);
    if (val !== 'تصنيف آخر (كتابة يدوية)') {
      setCustomCategory('');
    }
  };

  // تفريغ الحقول لتصبح فارغة تماماً وجاهزة للإدخال
  const handleClearForm = () => {
    setStrategyName('');
    setDescription('');
    setCategorySelect('زيادة معدل التحويل 🚀');
    setCustomCategory('');
    setExecutionStatus('لم تبدأ ⏸️');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 استراتيجيات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!strategyName.trim() || !actualCategory.trim()) {
      alert('الرجاء التأكد من تعبئة اسم الاستراتيجية وتحديد التصنيف.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        strategyName,
        category: actualCategory,
        description,
        executionStatus,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث الاستراتيجية بنجاح!');
    } else {
      const newItem: GrowthItem = {
        id: Date.now().toString(),
        strategyName,
        category: actualCategory,
        description,
        executionStatus,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الاستراتيجية إلى مكتبة النمو بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: GrowthItem) => {
    setStrategyName(item.strategyName);
    setDescription(item.description);
    setExecutionStatus(item.executionStatus);
    
    const standardCategories = ['زيادة معدل التحويل 🚀', 'رفع ولاء العملاء 🤝', 'استرداد السلات المتروكة 🛒'];
    if (standardCategories.includes(item.category)) {
      setCategorySelect(item.category);
      setCustomCategory('');
    } else {
      setCategorySelect('تصنيف آخر (كتابة يدوية)');
      setCustomCategory(item.category);
    }
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الاستراتيجية؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const completedCount = items.filter(i => i.executionStatus.includes('مكتملة')).length;
  const inProgressCount = items.filter(i => i.executionStatus.includes('قيد التنفيذ')).length;
  const progressPercentage = items.length > 0 ? (completedCount / items.length) * 100 : 0;

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
                <th>اسم الاستراتيجية</th>
                <th>التصنيف</th>
                <th>حالة التنفيذ</th>
                <th>تاريخ الإضافة</th>
                <th>الوصف والخطوات</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.strategyName}</td>
          <td>${row.category}</td>
          <td>${row.executionStatus}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.description.replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">إجمالي الاستراتيجيات المسجلة</td>
                <td>${items.length} استراتيجية</td>
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
    link.setAttribute("download", "seerk_store_growth_secrets.xls");
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
            alert('✨ تم استيراد مكتبة الاستراتيجيات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    (item?.strategyName || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (item?.category || '').toLowerCase().includes((searchQuery || '').toLowerCase())
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
        
        .grid-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; margin-bottom: 40px; }
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
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #fff; border: none; padding: 20px; }
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
          <h1>أسرار نمو المتاجر السعودية 💡</h1>
          <p>مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء في السوق المحلي</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل خطة النمو' : 'إضافة استراتيجية نمو جديدة'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول لتصبح فارغة تماماً">
                🧹 مسح الحقول
              </button>
            </span>
            {isClient && !isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم الاستراتيجية / الفكرة الترويجية</label>
              <div className="input-wrapper">
                <input type="text" value={strategyName} onChange={(e) => setStrategyName(e.target.value)} placeholder="مثال: تفعيل الدفع بتابي/تمارا أو برنامج ولاء النقاط" required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>تصنيف الاستراتيجية</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={categorySelect} onChange={handleSelectChange}>
                    <option value="زيادة معدل التحويل 🚀">زيادة معدل التحويل 🚀</option>
                    <option value="رفع ولاء العملاء 🤝">رفع ولاء العملاء 🤝</option>
                    <option value="استرداد السلات المتروكة 🛒">استرداد السلات المتروكة 🛒</option>
                    <option value="تصنيف آخر (كتابة يدوية)">➕ تصنيف آخر (كتابة يدوية)</option>
                  </select>
                </div>

                {categorySelect === 'تصنيف آخر (كتابة يدوية)' && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      placeholder="اكتب التصنيف هنا..." 
                      required 
                    />
                  </div>
                )}
              </div>

              <div className="input-group">
                <label>حالة التنفيذ الحالية</label>
                <div className="input-wrapper">
                  <select value={executionStatus} onChange={(e) => setExecutionStatus(e.target.value)}>
                    <option value="لم تبدأ ⏸️">لم تبدأ ⏸️</option>
                    <option value="قيد التنفيذ ⏳">قيد التنفيذ ⏳</option>
                    <option value="مكتملة ومفعلة ✅">مكتملة ومفعلة ✅</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>وصف الاستراتيجية وخطوات التنفيذ بالمتجر</label>
              <div className="input-wrapper">
                <textarea 
                  rows={4} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="اكتب تفاصيل الفكرة وكيفية تطبيقها في سلة أو زد للرجوع إليها لاحقاً..." 
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ إضافة الاستراتيجية للمكتبة'}
            </button>
          </form>
        </div>

        {/* قسم المؤشرات الحية */}
        <div className="card">
          <h2 className="card-title">مؤشرات تطبيق خطط النمو</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">إجمالي الاستراتيجيات المسجلة</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>مكتبة الأفكار الترويجية</div>
            </div>
            <div className="result-value">
              {items.length} خطة
            </div>
          </div>

          <div className="result-box" style={{ borderRight: '4px solid #047857' }}>
            <span className="result-label">الاستراتيجيات المكتملة والمفعلة</span>
            <span className="result-value" style={{ color: '#047857' }}>{completedCount}</span>
          </div>

          <div className="result-box" style={{ borderRight: '4px solid #d97706', background: '#f8fafc' }}>
            <span className="result-label">مؤشر التقدم في التطبيق</span>
            <span className="result-value" style={{ color: '#d97706' }}>{progressPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم الاستراتيجية أو التصنيف..." 
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
                <th>الاستراتيجية والتاريخ</th>
                <th>التصنيف</th>
                <th>الوصف / الملاحظات</th>
                <th>حالة التنفيذ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    مكتبة النمو فارغة حالياً. ابدأ بإضافة استراتيجيات جديدة.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  let statusColor = '#0f172a';
                  let statusBg = '#f1f5f9';
                  if (item.executionStatus.includes('مكتملة')) { statusColor = '#15803d'; statusBg = '#dcfce7'; }
                  else if (item.executionStatus.includes('قيد التنفيذ')) { statusColor = '#b45309'; statusBg = '#fef3c7'; }
                  else { statusColor = '#475569'; statusBg = '#e2e8f0'; }

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.strategyName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td><span style={{ fontWeight: 800, color: '#0369a1' }}>{item.category}</span></td>
                      <td style={{ maxWidth: '250px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.description || <span style={{ color: '#94a3b8' }}>بدون وصف</span>}
                      </td>
                      <td>
                        <span style={{ color: statusColor, background: statusBg, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.executionStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل">✏️</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={4} style={{ textAlign: 'center' }}>إجمالي الاستراتيجيات والخطط</td>
                  <td colSpan={2}>{items.length} خطة</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
