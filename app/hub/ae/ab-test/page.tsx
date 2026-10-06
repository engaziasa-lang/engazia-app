'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ABTestItem {
  id: string;
  testName: string;
  campAName: string;
  campASpend: number;
  campAOrders: number;
  campACpa: number;
  campBName: string;
  campBSpend: number;
  campBOrders: number;
  campBCpa: number;
  winner: string;
  createdAt?: string;
}

export default function ABTestingCalculatorSA() {
  // تفريغ الحقول بالكامل كقيمة ابتدائية
  const [testName, setTestName] = useState<string>('');
  
  const [campAName, setCampAName] = useState<string>('');
  const [campASpend, setCampASpend] = useState<number | ''>('');
  const [campAOrders, setCampAOrders] = useState<number | ''>('');

  const [campBName, setCampBName] = useState<string>('');
  const [campBSpend, setCampBSpend] = useState<number | ''>('');
  const [campBOrders, setCampBOrders] = useState<number | ''>('');

  const [items, setItems] = useState<ABTestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const saved = localStorage.getItem('seerk_ab_testing_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ABTestItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ab_testing_items', JSON.stringify(newItems));
  };

  // تأمين القيم العددية للحساب
  const spendA = typeof campASpend === 'number' ? campASpend : 0;
  const ordersA = typeof campAOrders === 'number' ? campAOrders : 0;
  
  const spendB = typeof campBSpend === 'number' ? campBSpend : 0;
  const ordersB = typeof campBOrders === 'number' ? campBOrders : 0;

  // حساب تكلفة الاستحواذ للطلب الواحد (CPA / Cost Per Order)
  const cpaA = ordersA > 0 ? spendA / ordersA : 0;
  const cpaB = ordersB > 0 ? spendB / ordersB : 0;

  // تحديد الحملة الفائزة (الأقل تكلفة للطلب هي الفائزة)
  let winnerText = 'في انتظار البيانات...';
  let winnerColor = '#64748b';
  
  if (ordersA > 0 || ordersB > 0) {
    if (cpaA > 0 && cpaB > 0) {
      if (cpaA < cpaB) {
        winnerText = `🏆 الفائز: الحملة (أ) - ${campAName || 'بدون اسم'}`;
        winnerColor = '#047857';
      } else if (cpaB < cpaA) {
        winnerText = `🏆 الفائز: الحملة (ب) - ${campBName || 'بدون اسم'}`;
        winnerColor = '#0284c7';
      } else {
        winnerText = '⚖️ تعادل في التكلفة';
        winnerColor = '#d97706';
      }
    } else if (cpaA > 0 && cpaB === 0) {
      winnerText = `🏆 الفائز: الحملة (أ)`;
      winnerColor = '#047857';
    } else if (cpaB > 0 && cpaA === 0) {
      winnerText = `🏆 الفائز: الحملة (ب)`;
      winnerColor = '#0284c7';
    }
  }

  const handleClearForm = () => {
    setTestName('');
    setCampAName('');
    setCampASpend('');
    setCampAOrders('');
    setCampBName('');
    setCampBSpend('');
    setCampBOrders('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!testName.trim() || spendA <= 0 || spendB <= 0) {
      alert('الرجاء التأكد من تعبئة اسم الاختبار والمصروفات للحملتين بشكل صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    const newItemData = {
      testName,
      campAName: campAName || 'الحملة أ',
      campASpend: spendA,
      campAOrders: ordersA,
      campACpa: Number(cpaA.toFixed(2)),
      campBName: campBName || 'الحملة ب',
      campBSpend: spendB,
      campBOrders: ordersB,
      campBCpa: Number(cpaB.toFixed(2)),
      winner: winnerText.replace('🏆 الفائز: ', ''),
      createdAt: formattedDate
    };

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? { ...item, ...newItemData, createdAt: item.createdAt || formattedDate } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السجل بنجاح!');
    } else {
      const newItem: ABTestItem = { id: Date.now().toString(), ...newItemData };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تم حفظ نتيجة اختبار الـ A/B في السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ABTestItem) => {
    setTestName(item.testName);
    setCampAName(item.campAName);
    setCampASpend(item.campASpend);
    setCampAOrders(item.campAOrders);
    setCampBName(item.campBName);
    setCampBSpend(item.campBSpend);
    setCampBOrders(item.campBOrders);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

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
                <th>اسم الاختبار</th>
                <th>التاريخ والوقت</th>
                <th>(أ) اسم الحملة</th>
                <th>(أ) التكلفة</th>
                <th>(أ) الطلبات</th>
                <th>(أ) تكلفة الطلب (CPA)</th>
                <th>(ب) اسم الحملة</th>
                <th>(ب) التكلفة</th>
                <th>(ب) الطلبات</th>
                <th>(ب) تكلفة الطلب (CPA)</th>
                <th>الفائز</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.testName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.campAName}</td>
          <td>${row.campASpend}</td>
          <td>${row.campAOrders}</td>
          <td>${row.campACpa}</td>
          <td>${row.campBName}</td>
          <td>${row.campBSpend}</td>
          <td>${row.campBOrders}</td>
          <td>${row.campBCpa}</td>
          <td>${row.winner}</td>
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
    link.setAttribute("download", "seerk_ab_testing.xls");
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
    (item?.testName || '').toLowerCase().includes((searchQuery || '').toLowerCase())
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
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input.with-currency { padding-left: 45px; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { color: #fff; border: none; padding: 20px; transition: background 0.3s ease; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value { font-size: 22px; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-top: 20px;}
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: center; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; text-align: center; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: 'Tajawal', sans-serif;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة اختبارات الإعلانات (A/B) ⚖️</h1>
          <p>قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب</p>
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
              <span>{editingId ? 'تعديل الاختبار' : 'إضافة اختبار A/B جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول لتصبح فارغة تماماً">
                🧹 مسح الحقول
              </button>
            </span>
            {isClient && !isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>مسمى الاختبار الاستراتيجي</label>
              <div className="input-wrapper">
                <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="مثال: مقارنة إعلان تيك توك ضد إنستقرام" required />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#047857' }}>الحملة الأولى (أ)</h3>
              <div className="form-row">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>اسم الحملة (أ)</label>
                  <div className="input-wrapper">
                    <input type="text" value={campAName} onChange={(e) => setCampAName(e.target.value)} placeholder="مثال: إعلان تيك توك" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>تكلفة الإعلان (ر.س)</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={campASpend === '' ? '' : campASpend} onChange={(e) => setCampASpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="500" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>عدد الطلبات</label>
                  <div className="input-wrapper">
                    <input type="number" min="0" value={campAOrders === '' ? '' : campAOrders} onChange={(e) => setCampAOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="20" required />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#0284c7' }}>الحملة الثانية (ب)</h3>
              <div className="form-row">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>اسم الحملة (ب)</label>
                  <div className="input-wrapper">
                    <input type="text" value={campBName} onChange={(e) => setCampBName(e.target.value)} placeholder="مثال: إعلان إنستقرام" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>تكلفة الإعلان (ر.س)</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={campBSpend === '' ? '' : campBSpend} onChange={(e) => setCampBSpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="500" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>عدد الطلبات</label>
                  <div className="input-wrapper">
                    <input type="number" min="0" value={campBOrders === '' ? '' : campBOrders} onChange={(e) => setCampBOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="15" required />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ نتيجة الاختبار في السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">مقارنة النتائج الحية</h2>

          <div className="result-box primary" style={{ background: winnerColor }}>
            <div>
              <div className="result-label">النتيجة النهائية للمقارنة</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>الحملة الأفضل بناءً على تكلفة الاستحواذ</div>
            </div>
            <div className="result-value">
              {winnerText}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: '4px solid #047857' }}>
            <span className="result-label">تكلفة الطلب (CPA) للحملة (أ)</span>
            <span className="result-value" style={{ color: '#047857' }}>{cpaA.toFixed(2)} ر.س/طلب</span>
          </div>

          <div className="result-box" style={{ borderRight: '4px solid #0284c7', background: '#f8fafc' }}>
            <span className="result-label">تكلفة الطلب (CPA) للحملة (ب)</span>
            <span className="result-value" style={{ color: '#0284c7' }}>{cpaB.toFixed(2)} ر.س/طلب</span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم الاختبار..." 
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
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>م</th>
                <th rowSpan={2} style={{ verticalAlign: 'middle', textAlign: 'right' }}>اسم الاختبار</th>
                <th colSpan={3} style={{ borderBottom: '2px solid #047857', color: '#047857', background: '#ecfdf5' }}>الحملة (أ)</th>
                <th colSpan={3} style={{ borderBottom: '2px solid #0284c7', color: '#0284c7', background: '#f0f9ff' }}>الحملة (ب)</th>
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>الحملة الفائزة</th>
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>الإجراءات</th>
              </tr>
              <tr>
                <th style={{ background: '#ecfdf5', fontSize: '12px' }}>الاسم</th>
                <th style={{ background: '#ecfdf5', fontSize: '12px' }}>التكلفة/الطلبات</th>
                <th style={{ background: '#ecfdf5', fontSize: '12px' }}>تكلفة الطلب</th>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>الاسم</th>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>التكلفة/الطلبات</th>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>تكلفة الطلب</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد اختبارات A/B مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.testName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td style={{ fontWeight: 800, color: '#047857', background: '#f8fafc' }}>{item.campAName}</td>
                    <td style={{ background: '#f8fafc', fontSize: '12.5px' }}>{item.campASpend} ر.س <br/> <span style={{ color: '#64748b' }}>({item.campAOrders} طلب)</span></td>
                    <td style={{ fontWeight: 900, background: '#f8fafc' }}>{item.campACpa}</td>
                    
                    <td style={{ fontWeight: 800, color: '#0284c7' }}>{item.campBName}</td>
                    <td style={{ fontSize: '12.5px' }}>{item.campBSpend} ر.س <br/> <span style={{ color: '#64748b' }}>({item.campBOrders} طلب)</span></td>
                    <td style={{ fontWeight: 900 }}>{item.campBCpa}</td>
                    
                    <td>
                      <span style={{ color: '#fff', background: item.winner.includes('(أ)') ? '#047857' : item.winner.includes('(ب)') ? '#0284c7' : '#d97706', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                        {item.winner}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌</button>
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
