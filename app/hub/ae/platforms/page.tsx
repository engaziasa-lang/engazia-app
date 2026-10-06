'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface PlatformItem {
  id: string;
  storeName: string;
  platformName: string;
  packageName: string;
  monthlyFee: number;
  expectedMonthlyOrders: number;
  costPerOrder: number;
  createdAt?: string;
}

export default function PlatformFeesCalculatorAE() {
  const [storeName, setStoreName] = useState<string>('متجر إنجازيا');
  const [platformType, setPlatformType] = useState<'شوبيفاي (Shopify)' | 'ووكومرس (WooCommerce)' | 'منصة مخصصة'>('شوبيفاي (Shopify)');
  const [packageName, setPackageName] = useState<string>('الباقة القياسية (Basic)');
  const [monthlyFee, setMonthlyFee] = useState<number | ''>(149);
  const [expectedMonthlyOrders, setExpectedMonthlyOrders] = useState<number | ''>(300);

  const [items, setItems] = useState<PlatformItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // تم تغيير مفتاح التخزين لفصل بيانات الإمارات عن السعودية
    const saved = localStorage.getItem('seerk_ae_platform_fees_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: PlatformItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ae_platform_fees_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const fee = typeof monthlyFee === 'number' ? monthlyFee : 0;
  const orders = typeof expectedMonthlyOrders === 'number' ? expectedMonthlyOrders : 0;

  // الحساب الفعلي: تكلفة اشتراك المنصة محملة على الطلب الواحد شهرياً
  const costPerOrder = orders > 0 ? fee / orders : 0;

  const handlePlatformChange = (p: 'شوبيفاي (Shopify)' | 'ووكومرس (WooCommerce)' | 'منصة مخصصة') => {
    setPlatformType(p);
    if (p === 'شوبيفاي (Shopify)') {
      setPackageName('باقة شوبيفاي الأساسية');
      setMonthlyFee(149);
    } else if (p === 'ووكومرس (WooCommerce)') {
      setPackageName('استضافة ووكومرس');
      setMonthlyFee(99);
    } else {
      setPackageName('باقة مخصصة');
      setMonthlyFee(199);
    }
  };

  const handleClearForm = () => {
    setStoreName('متجر إنجازيا');
    setPlatformType('شوبيفاي (Shopify)');
    setPackageName('الباقة القياسية');
    setMonthlyFee(149);
    setExpectedMonthlyOrders(300);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (fee < 0 || orders <= 0 || !storeName.trim() || !packageName.trim()) {
      alert('الرجاء التأكد من تعبئة اسم المتجر، الباقة، وعدد طلبات شهري صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    // تعديل التوقيت ليطابق الإمارات
    const formattedDate = `${now.toLocaleDateString('ar-AE')} - ${now.toLocaleTimeString('ar-AE', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        storeName,
        platformName: platformType,
        packageName,
        monthlyFee: fee,
        expectedMonthlyOrders: orders,
        costPerOrder: Number(costPerOrder.toFixed(2)),
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السجل بنجاح!');
    } else {
      const newItem: PlatformItem = {
        id: Date.now().toString(),
        storeName,
        platformName: platformType,
        packageName,
        monthlyFee: fee,
        expectedMonthlyOrders: orders,
        costPerOrder: Number(costPerOrder.toFixed(2)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة السجل إلى قائمة رسوم المنصات بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: PlatformItem) => {
    setStoreName(item.storeName);
    setPlatformType(item.platformName as any);
    setPackageName(item.packageName);
    setMonthlyFee(item.monthlyFee);
    setExpectedMonthlyOrders(item.expectedMonthlyOrders);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalMonthlyFees = items.reduce((acc, curr) => acc + curr.monthlyFee, 0);
  const totalMonthlyOrders = items.reduce((acc, curr) => acc + curr.expectedMonthlyOrders, 0);
  const avgCostPerOrder = totalMonthlyOrders > 0 ? totalMonthlyFees / totalMonthlyOrders : 0;

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
                <th>اسم المتجر</th>
                <th>التاريخ والوقت</th>
                <th>المنصة</th>
                <th>الباقة</th>
                <th>الاشتراك الشهري (د.إ)</th>
                <th>الطلبات المتوقعة شهرياً</th>
                <th>تكلفة المنصة للطلب الواحد (د.إ)</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.storeName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.platformName}</td>
          <td>${row.packageName}</td>
          <td>${row.monthlyFee}</td>
          <td>${row.expectedMonthlyOrders}</td>
          <td>${row.costPerOrder}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">الإجمالي الكلي / المتوسط</td>
                <td>${totalMonthlyFees.toFixed(2)}</td>
                <td>${totalMonthlyOrders}</td>
                <td>${avgCostPerOrder.toFixed(2)} د.إ</td>
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
    link.setAttribute("download", "seerk_ae_platform_fees.xls");
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
            alert('✨ تم استيراد بيانات رسوم المنصات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.packageName.toLowerCase().includes(searchQuery.toLowerCase())
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

        .radio-group-container { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .radio-box { border: 2px solid #cbd5e1; border-radius: 8px; padding: 10px 5px; text-align: center; cursor: pointer; background: #f8fafc; font-weight: 800; font-size: 13px; color: #475569; transition: all 0.2s; display: flex; align-items: center; justify-content: center; user-select: none; }
        .radio-box.active { border-color: #047857; background: #ecfdf5; color: #047857; }
        .radio-box input { display: none; }

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input.with-currency { padding-left: 45px; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
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
          <h1>حاسبة رسوم واشتراكات المنصات (شوبيفاي، ووكومرس) 🛒</h1>
          <p>احسب التكاليف الخفية واشتراكات المنصات العالمية والمحلية لضمان تسعير منتجاتك بشكل صحيح وعادل</p>
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
              <span>{editingId ? 'تعديل السجل' : 'حساب رسوم منصة جديدة'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اختر المنصة</label>
              <div className="radio-group-container">
                <label className={`radio-box ${platformType === 'شوبيفاي (Shopify)' ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType === 'شوبيفاي (Shopify)'} onChange={() => handlePlatformChange('شوبيفاي (Shopify)')} />
                  شوبيفاي
                </label>
                <label className={`radio-box ${platformType === 'ووكومرس (WooCommerce)' ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType === 'ووكومرس (WooCommerce)'} onChange={() => handlePlatformChange('ووكومرس (WooCommerce)')} />
                  ووكومرس
                </label>
                <label className={`radio-box ${platformType === 'منصة مخصصة' ? 'active' : ''}`}>
                  <input type="radio" name="plt" checked={platformType === 'منصة مخصصة'} onChange={() => handlePlatformChange('منصة مخصصة')} />
                  منصة أخرى
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>اسم المتجر</label>
                <div className="input-wrapper">
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="متجر إنجازيا" required />
                </div>
              </div>
              <div className="input-group">
                <label>اسم الباقة (قابل للتعديل)</label>
                <div className="input-wrapper">
                  <input type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="الباقة القياسية" required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>اشتراك المنصة الشهري (د.إ)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={monthlyFee === '' ? '' : monthlyFee} onChange={(e) => setMonthlyFee(e.target.value === '' ? '' : Number(e.target.value))} placeholder="149" required />
                  <span className="currency-tag">د.إ</span>
                </div>
              </div>
              <div className="input-group">
                <label>عدد الطلبات المتوقعة شهرياً</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={expectedMonthlyOrders === '' ? '' : expectedMonthlyOrders} onChange={(e) => setExpectedMonthlyOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="300" required />
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ الحساب في السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">تحليل تكلفة المنصة الفوري</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">تكلفة اشتراك المنصة محملة على الطلب الواحد</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>الخصم الفعلي من كل عملية بيع نظير المنصة</div>
            </div>
            <div className="result-value">
              {costPerOrder.toFixed(2)} د.إ
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">الاشتراك الشهري المدفوع</span>
            <span className="result-value" style={{ color: '#047857' }}>{fee.toFixed(2)} د.إ</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">إجمالي الطلبات الشهرية المتوقعة</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{orders} طلب</span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث بالمتجر أو المنصة أو الباقة..." 
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
                <th>المتجر والتاريخ</th>
                <th>المنصة والباقة</th>
                <th>الاشتراك الشهري</th>
                <th>الطلبات المتوقعة</th>
                <th>تكلفة المنصة / طلب</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سجلات رسوم منصات مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.storeName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#047857' }}>{item.platformName}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{item.packageName}</div>
                    </td>
                    <td>{item.monthlyFee} د.إ</td>
                    <td>{item.expectedMonthlyOrders} طلب</td>
                    <td style={{ fontWeight: 900, color: '#d97706' }}>{item.costPerOrder} د.إ</td>
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
                  <td>{totalMonthlyFees.toFixed(2)} د.إ</td>
                  <td>{totalMonthlyOrders} طلب</td>
                  <td style={{ color: '#d97706' }}>{avgCostPerOrder.toFixed(2)} د.إ</td>
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
