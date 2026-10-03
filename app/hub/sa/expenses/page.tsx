'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ExpenseItem {
  id: string;
  expenseName: string;
  category: string;
  amount: number;
  frequency: string;
  date: string;
}

export default function ExpensesManagerSA() {
  const [expenseName, setExpenseName] = useState<string>('');
  const [category, setCategory] = useState<string>('مصاريف تسويقية وإعلانية');
  const [amount, setAmount] = useState<number | ''>('');
  const [frequency, setFrequency] = useState<string>('شهري (Monthly)');

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

  const amt = typeof amount === 'number' ? amount : 0;
  const currentDate = new Date().toISOString().slice(0, 10);

  // إجمالي المصاريف المسجلة
  const totalExpenses = items.reduce((acc, curr) => acc + curr.amount, 0);

  const handleClearForm = () => {
    setExpenseName('');
    setCategory('مصاريف تسويقية وإعلانية');
    setAmount('');
    setFrequency('شهري (Monthly)');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 مصاريف). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!expenseName.trim() || amt <= 0) {
      alert('الرجاء إدخال اسم المصروف والمبلغ بشكل صحيح.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        expenseName,
        category,
        amount: amt,
        frequency,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث المصروف بنجاح!');
    } else {
      const newItem: ExpenseItem = {
        id: Date.now().toString(),
        expenseName,
        category,
        amount: amt,
        frequency,
        date: currentDate,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة المصروف إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ExpenseItem) => {
    setExpenseName(item.expenseName);
    setCategory(item.category);
    setAmount(item.amount);
    setFrequency(item.frequency);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,ExpenseName,Category,Amount,Frequency,Date\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.expenseName},${row.category},${row.amount},${row.frequency},${row.date}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_expenses_manager.csv");
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
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
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
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .danger .result-value { font-size: 26px; color: #ffffff; }

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
          <h1>مدير النفقات والمصاريف التشغيلية 💸</h1>
          <p>تتبع مصاريف المتجر الثابتة والمتغيرة بالريال السعودي لضبط التدفق النقدي بدقة عالية</p>
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
              <span>{editingId ? 'تعديل المصروف' : 'إضافة مصروف جديد'}</span>
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
                <input type="text" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} placeholder="مثال: اشتراك منصة سلة / إعلانات سناب" required />
              </div>
            </div>

            <div className="input-group">
              <label>تصنيف المصروف</label>
              <div className="input-wrapper">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="مصاريف تسويقية وإعلانية">مصاريف تسويقية وإعلانية</option>
                  <option value="اشتراكات برمجيات ومنصات">اشتراكات برمجيات ومنصات</option>
                  <option value="رواتب وأجور">رواتب وأجور</option>
                  <option value="تغليف وشحن وتخزين">تغليف وشحن وتخزين</option>
                  <option value="مصاريف نثرية أخرى">مصاريف نثرية أخرى</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>المبلغ (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={amount === '' ? '' : amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1200" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>تكرار المصروف</label>
              <div className="input-wrapper">
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option value="شهري (Monthly)">شهري (Monthly)</option>
                  <option value="سنوي (Yearly)">سنوي (Yearly)</option>
                  <option value="مرة واحدة (One-time)">مرة واحدة (One-time)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ المصروف في السجل'}
            </button>
          </form>
        </div>

        {/* قسم الملخص الفوري */}
        <div className="card">
          <h2 className="card-title">ملخص المصاريف الفوري</h2>

          <div className="result-box danger">
            <div>
              <div className="result-label">إجمالي النفقات والمصاريف المسجلة</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>مجموع التكاليف التشغيلية للمتجر</div>
            </div>
            <div className="result-value">
              {totalExpenses.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">عدد بنود المصاريف المسجلة</span>
            <span className="result-value" style={{ color: '#047857' }}>{items.length} بند</span>
          </div>
        </div>
      </div>

      {/* جدول إدارة السجلات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المصروف أو التصنيف..." 
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
                <th>اسم المصروف</th>
                <th>التصنيف</th>
                <th>المبلغ</th>
                <th>التكرار</th>
                <th>التاريخ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد مصاريف مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.expenseName}</td>
                    <td><span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>{item.category}</span></td>
                    <td style={{ color: '#dc2626', fontWeight: 900 }}>{item.amount} ر.س</td>
                    <td>{item.frequency}</td>
                    <td>{item.date}</td>
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
