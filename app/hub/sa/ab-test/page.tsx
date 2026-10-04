'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface AbTestItem {
  id: string;
  testName: string;
  visitorsA: number;
  conversionsA: number;
  visitorsB: number;
  conversionsB: number;
  convRateA: number;
  convRateB: number;
  winner: string;
}

export default function AbTestCalculatorSA() {
  const [testName, setTestName] = useState<string>('اختبار إعلانات سناب شات للمنتج الجديد');
  const [visitorsA, setVisitorsA] = useState<number | ''>(5000);
  const [conversionsA, setConversionsA] = useState<number | ''>(150);
  const [visitorsB, setVisitorsB] = useState<number | ''>(5000);
  const [conversionsB, setConversionsB] = useState<number | ''>(210);

  const [items, setItems] = useState<AbTestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_ab_test_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: AbTestItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ab_test_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const vA = typeof visitorsA === 'number' ? visitorsA : 0;
  const cA = typeof conversionsA === 'number' ? conversionsA : 0;
  const vB = typeof visitorsB === 'number' ? visitorsB : 0;
  const cB = typeof conversionsB === 'number' ? conversionsB : 0;

  // الحسابات الفعلية لمعدل التحويل
  const convRateA = vA > 0 ? (cA / vA) * 100 : 0;
  const convRateB = vB > 0 ? (cB / vB) * 100 : 0;

  let winner = 'التعادل / تقارب النتائج';
  let improvement = 0;
  if (convRateB > convRateA) {
    winner = 'الإعلان الثاني (نسخة B) هو الفائز والمتفوق! 🚀';
    improvement = convRateA > 0 ? ((convRateB - convRateA) / convRateA) * 100 : 0;
  } else if (convRateA > convRateB) {
    winner = 'الإعلان الأول (نسخة A) هو الفائز والمتفوق! 🏆';
    improvement = convRateB > 0 ? ((convRateA - convRateB) / convRateB) * 100 : 0;
  }

  const handleClearForm = () => {
    setTestName('');
    setVisitorsA('');
    setConversionsA('');
    setVisitorsB('');
    setConversionsB('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 اختبارات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!testName.trim()) {
      alert('الرجاء إدخال اسم الاختبار.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        testName,
        visitorsA: vA,
        conversionsA: cA,
        visitorsB: vB,
        conversionsB: cB,
        convRateA: Number(convRateA.toFixed(2)),
        convRateB: Number(convRateB.toFixed(2)),
        winner,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث الاختبار بنجاح!');
    } else {
      const newItem: AbTestItem = {
        id: Date.now().toString(),
        testName,
        visitorsA: vA,
        conversionsA: cA,
        visitorsB: vB,
        conversionsB: cB,
        convRateA: Number(convRateA.toFixed(2)),
        convRateB: Number(convRateB.toFixed(2)),
        winner,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الاختبار إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: AbTestItem) => {
    setTestName(item.testName);
    setVisitorsA(item.visitorsA);
    setConversionsA(item.conversionsA);
    setVisitorsB(item.visitorsB);
    setConversionsB(item.conversionsB);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,TestName,VisitorsA,ConvA,VisitorsB,ConvB,Winner\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.testName},${row.visitorsA},${row.conversionsA},${row.visitorsB},${row.conversionsB},"${row.winner}"\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_ab_tests.csv");
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
            alert('✨ تم استيراد الاختبارات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => item.testName.toLowerCase().includes(searchQuery.toLowerCase()));

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
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

        .result-banner { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .result-banner h3 { font-size: 22px; margin: 0 0 10px 0; font-weight: 900; }
        .result-banner p { font-size: 15px; margin: 0; opacity: 0.9; font-weight: 700; }

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
          <h1>حاسبة اختبارات الإعلانات (A/B Test) ⚖️</h1>
          <p>قارن بين نسختين إعلانيتين لمعرفة الإعلان الذي يحقق أفضل معدل تحويل وعوائد</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <form onSubmit={handleSaveItem}>
        <div className="card" style={{ marginBottom: '30px' }}>
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <label>عنوان الاختبار أو اسم الحملة</label>
            <div className="input-wrapper">
              <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="مثال: حملة إعلانات سناب شات للمنتج الجديد" required />
            </div>
          </div>
        </div>

        <div className="grid-layout">
          {/* الإعلان الأول (نسخة A) */}
          <div className="card">
            <h2 className="card-title">
              <span>الإعلان الأول (نسخة A)</span>
              {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
            </h2>

            <div className="input-group">
              <label>عدد الزوار أو المشاهدات (Visitors)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={visitorsA === '' ? '' : visitorsA} onChange={(e) => setVisitorsA(e.target.value === '' ? '' : Number(e.target.value))} placeholder="5000" required />
              </div>
            </div>

            <div className="input-group">
              <label>عدد الطلبات أو التحويلات (Conversions)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={conversionsA === '' ? '' : conversionsA} onChange={(e) => setConversionsA(e.target.value === '' ? '' : Number(e.target.value))} placeholder="150" required />
              </div>
            </div>

            <div className="result-box" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginTop: '20px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>معدل التحويل (Conversion Rate):</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{convRateA.toFixed(2)}%</span>
            </div>
          </div>

          {/* الإعلان الثاني (نسخة B) */}
          <div className="card">
            <h2 className="card-title">
              <span>الإعلان الثاني (نسخة B)</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </h2>

            <div className="input-group">
              <label>عدد الزوار أو المشاهدات (Visitors)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={visitorsB === '' ? '' : visitorsB} onChange={(e) => setVisitorsB(e.target.value === '' ? '' : Number(e.target.value))} placeholder="5000" required />
              </div>
            </div>

            <div className="input-group">
              <label>عدد الطلبات أو التحويلات (Conversions)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={conversionsB === '' ? '' : conversionsB} onChange={(e) => setConversionsB(e.target.value === '' ? '' : Number(e.target.value))} placeholder="210" required />
              </div>
            </div>

            <div className="result-box" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginTop: '20px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>معدل التحويل (Conversion Rate):</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{convRateB.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* بانر نتيجة الفحص الفوري */}
        <div className="result-banner">
          <h3>{winner}</h3>
          {improvement > 0 && <p>نسبة التفوق وتحسن الأداء: {improvement.toFixed(1)}%</p>}
        </div>

        <div style={{ marginBottom: '40px' }}>
          <button type="submit" className="action-btn" style={{ padding: '15px', fontSize: '16px' }}>
            {editingId ? '💾 حفظ التعديلات' : '+ حفظ نتيجة الاختبار في السجل'}
          </button>
        </div>
      </form>

      {/* جدول إدارة السجلات السفلي */}
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
                <th>اسم الاختبار</th>
                <th>معدل A</th>
                <th>معدل B</th>
                <th>النتيجة الفائزة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد اختبارات مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.testName}</td>
                    <td>{item.convRateA}%</td>
                    <td>{item.convRateB}%</td>
                    <td style={{ color: '#047857', fontWeight: 900 }}>{item.winner}</td>
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
