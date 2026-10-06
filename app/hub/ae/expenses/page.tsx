'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ExpenseItem {
  id: string;
  expenseName: string;
  expenseType: string;
  recurrence: string; // تكرار المصروف (شهري، سنوي، مرة واحدة)
  amount: number;
  periodOrNote: string;
  createdAt?: string;
}

export default function ExpensesManagerSA() {
  const [expenseName, setExpenseName] = useState<string>('');
  const [typeSelect, setTypeSelect] = useState<string>('مصاريف ثابتة');
  const [customType, setCustomType] = useState<string>('مصاريف ثابتة');
  const [recurrence, setRecurrence] = useState<string>('شهري (Monthly)'); // الميزة الجديدة
  const [amount, setAmount] = useState<number | ''>('');
  const [periodOrNote, setPeriodOrNote] = useState<string>('أكتوبر 2026');

  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_expenses_manager_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ExpenseItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_expenses_manager_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const expAmount = typeof amount === 'number' ? amount : 0;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTypeSelect(val);
    if (val !== 'نوع آخر (كتابة يدوية)') {
      setCustomType(val);
    } else {
      setCustomType('');
    }
  };

  const handleClearForm = () => {
    setExpenseName('');
    setTypeSelect('مصاريف ثابتة');
    setCustomType('مصاريف ثابتة');
    setRecurrence('شهري (Monthly)');
    setAmount('');
    setPeriodOrNote('أكتوبر 2026');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    const finalType = typeSelect === 'نوع آخر (كتابة يدوية)' ? customType : typeSelect;
    if (!expenseName.trim() || expAmount <= 0 || !finalType.trim()) {
      alert('الرجاء التأكد من تعبئة اسم المصروف، النوع، ومبلغ صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        expenseName,
        expenseType: finalType,
        recurrence,
        amount: expAmount,
        periodOrNote,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث المصروف بنجاح!');
    } else {
      const newItem: ExpenseItem = {
        id: Date.now().toString(),
        expenseName,
        expenseType: finalType,
        recurrence,
        amount: expAmount,
        periodOrNote,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة المصروف إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ExpenseItem) => {
    setExpenseName(item.expenseName);
    const standardTypes = ['مصاريف ثابتة', 'مصاريف متغيرة', 'إعلانات تسويقية', 'رواتب وأجور', 'تغليف وشحن', 'اشتراكات برمجية'];
    if (standardTypes.includes(item.expenseType)) {
      setTypeSelect(item.expenseType);
      setCustomType(item.expenseType);
    } else {
      setTypeSelect('نوع آخر (كتابة يدوية)');
      setCustomType(item.expenseType);
    }
    setRecurrence(item.recurrence || 'شهري (Monthly)');
    setAmount(item.amount);
    setPeriodOrNote(item.periodOrNote);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalFixedExpenses = items.filter(i => i.expenseType.includes('ثابتة') || i.expenseType.includes('رواتب') || i.expenseType.includes('اشتراكات')).reduce((acc, curr) => acc + curr.amount, 0);
  const totalVariableExpenses = items.filter(i => !i.expenseType.includes('ثابتة') && !i.expenseType.includes('رواتب') && !i.expenseType.includes('اشتراكات')).reduce((acc, curr) => acc + curr.amount, 0);
  const grandTotalExpenses = items.reduce((acc, curr) => acc + curr.amount, 0);

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
                <th>اسم المصروف البند</th>
                <th>التاريخ والوقت</th>
                <th>نوع المصروف</th>
                <th>تكرار المصروف</th>
                <th>الفترة أو الملاحظة</th>
                <th>المبلغ (ر.س)</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.expenseName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.expenseType}</td>
          <td>${row.recurrence || 'شهري (Monthly)'}</td>
          <td>${row.periodOrNote}</td>
          <td>${row.amount}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="6">إجمالي المصاريف التشغيلية</td>
                <td>${grandTotalExpenses.toFixed(2)} ر.س</td>
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
    link.setAttribute("download", "seerk_expenses_manager.xls");
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
            alert('✨ تم استيراد المصاريف بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.expenseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.expenseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.recurrence || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.periodOrNote.toLowerCase().includes(searchQuery.toLowerCase())
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
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .danger .result-value { font-size: 26px; color: #ffffff; }

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
          <h1>مدير النفقات والمصاريف التشغيلية 💸</h1>
          <p>تتبع مصاريف المتجر الثابتة والمتغيرة، وتكرار المصروف (شهري، سنوي، مرة واحدة) لضبط التدفق النقدي</p>
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
              <span>{editingId ? 'تعديل السجل' : 'إضافة مصروف تشغيلي جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المصروف أو البند</label>
              <div className="input-wrapper">
                <input type="text" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} placeholder="مثال: اشتراك منصة سلة / رواتب الموظفين" required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>نوع المصروف</label>
                <div className="input-wrapper">
                  <select value={typeSelect} onChange={handleSelectChange}>
                    <option value="مصاريف ثابتة">مصاريف ثابتة 🏢</option>
                    <option value="مصاريف متغيرة">مصاريف متغيرة 📦</option>
                    <option value="إعلانات تسويقية">إعلانات تسويقية 📢</option>
                    <option value="رواتب وأجور">رواتب وأجور 👤</option>
                    <option value="تغليف وشحن">تغليف وشحن 📦</option>
                    <option value="اشتراكات برمجية">اشتراكات برمجية 💻</option>
                    <option value="نوع آخر (كتابة يدوية)">➕ نوع آخر (كتابة يدوية)</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>تكرار المصروف</label>
                <div className="input-wrapper">
                  <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                    <option value="شهري (Monthly)">شهري (Monthly)</option>
                    <option value="سنوي (Yearly)">سنوي (Yearly)</option>
                    <option value="مرة واحدة (One-time)">مرة واحدة (One-time)</option>
                  </select>
                </div>
              </div>
            </div>

            {typeSelect === 'نوع آخر (كتابة يدوية)' && (
              <div className="input-group">
                <label>اكتب نوع المصروف المخصص</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customType} 
                    onChange={(e) => setCustomType(e.target.value)} 
                    placeholder="اكتب نوع المصروف هنا..." 
                    required 
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="input-group">
                <label>مبلغ المصروف (ر.س)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={amount === '' ? '' : amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1500" required />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
              <div className="input-group">
                <label>الفترة أو ملاحظة</label>
                <div className="input-wrapper">
                  <input type="text" value={periodOrNote} onChange={(e) => setPeriodOrNote(e.target.value)} placeholder="أكتوبر 2026" required />
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ المصروف في السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">مؤشرات المصاريف الفورية</h2>

          <div className="result-box danger">
            <div>
              <div className="result-label">إجمالي المصاريف التشغيلية</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>مجموع النفقات الخارجة من المتجر</div>
            </div>
            <div className="result-value">
              {grandTotalExpenses.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">المصاريف الثابتة والرواتب</span>
            <span className="result-value" style={{ color: '#0369a1' }}>{totalFixedExpenses.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">المصاريف المتغيرة والإعلانات</span>
            <span className="result-value" style={{ color: '#d97706' }}>{totalVariableExpenses.toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المصروف أو التكرار..." 
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
                <th>البند والتاريخ</th>
                <th>نوع المصروف</th>
                <th>تكرار المصروف</th>
                <th>الفترة / ملاحظة</th>
                <th>المبلغ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد مصاريف تشغيلية مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.expenseName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#0369a1' }}>{item.expenseType}</span></td>
                    <td>
                      <span style={{ fontWeight: 800, color: item.recurrence?.includes('شهري') ? '#047857' : item.recurrence?.includes('سنوي') ? '#d97706' : '#475569', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>
                        {item.recurrence || 'شهري (Monthly)'}
                      </span>
                    </td>
                    <td>{item.periodOrNote}</td>
                    <td style={{ fontWeight: 900, color: '#dc2626' }}>{item.amount} ر.س</td>
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
                  <td colSpan={5} style={{ textAlign: 'center' }}>الإجمالي الكلي للمصاريف</td>
                  <td style={{ color: '#dc2626' }}>{grandTotalExpenses.toFixed(2)} ر.س</td>
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
