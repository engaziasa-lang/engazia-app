'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface LtvItem {
  id: string;
  analysisName: string;
  avgOrderValue: number;
  purchaseFrequency: number;
  customerLifespan: number;
  profitMargin: number;
  cacCost: number;
  ltvValue: number;
  ratio: string;
}

export default function LtvCalculatorSA() {
  const [analysisName, setAnalysisName] = useState<string>('تحليل عملاء المتجر العام');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>(250);
  const [purchaseFrequency, setPurchaseFrequency] = useState<number | ''>(2.5);
  const [customerLifespan, setCustomerLifespan] = useState<number | ''>(2);
  const [profitMargin, setProfitMargin] = useState<number | ''>(40);
  const [cacCost, setCacCost] = useState<number | ''>(60);

  const [items, setItems] = useState<LtvItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_ltv_calculator_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: LtvItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ltv_calculator_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const aov = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const freq = typeof purchaseFrequency === 'number' ? purchaseFrequency : 0;
  const life = typeof customerLifespan === 'number' ? customerLifespan : 0;
  const margin = typeof profitMargin === 'number' ? profitMargin : 0;
  const cac = typeof cacCost === 'number' ? cacCost : 0;

  // الحسابات الفعلية: القيمة الدائمة للعميل (LTV) = (متوسط قيمة الطلب × معدل التكرار السنوي × العمر الافتراضي) × هامش الربح
  const totalRevenuePerCustomer = aov * freq * life;
  const ltvValue = totalRevenuePerCustomer * (margin / 100);
  const ratioNum = cac > 0 ? (ltvValue / cac) : 0;
  const ratio = `1 : ${ratioNum.toFixed(1)}`;

  const handleClearForm = () => {
    setAnalysisName('');
    setAvgOrderValue('');
    setPurchaseFrequency('');
    setCustomerLifespan('');
    setProfitMargin('');
    setCacCost('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 تحليلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!analysisName.trim() || aov <= 0) {
      alert('الرجاء إدخال اسم التحليل ومتوسط قيمة الطلب.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        analysisName,
        avgOrderValue: aov,
        purchaseFrequency: freq,
        customerLifespan: life,
        profitMargin: margin,
        cacCost: cac,
        ltvValue: Number(ltvValue.toFixed(2)),
        ratio,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث التحليل بنجاح!');
    } else {
      const newItem: LtvItem = {
        id: Date.now().toString(),
        analysisName,
        avgOrderValue: aov,
        purchaseFrequency: freq,
        customerLifespan: life,
        profitMargin: margin,
        cacCost: cac,
        ltvValue: Number(ltvValue.toFixed(2)),
        ratio,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة التحليل إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: LtvItem) => {
    setAnalysisName(item.analysisName);
    setAvgOrderValue(item.avgOrderValue);
    setPurchaseFrequency(item.purchaseFrequency);
    setCustomerLifespan(item.customerLifespan);
    setProfitMargin(item.profitMargin);
    setCacCost(item.cacCost);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التحليل من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,AnalysisName,AOV,Frequency,Lifespan,Margin,CAC,LTV\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.analysisName},${row.avgOrderValue},${row.purchaseFrequency},${row.customerLifespan},${row.profitMargin},${row.cacCost},${row.ltvValue}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_ltv_analysis.csv");
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
            alert('✨ تم استيراد بيانات التحليلات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => item.analysisName.toLowerCase().includes(searchQuery.toLowerCase()));

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
        .input-wrapper input { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value { font-size: 26px; color: #ffffff; }

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
          <h1>حاسبة القيمة الدائمة للعميل (LTV) 🎯</h1>
          <p>اعرف القيمة الحقيقية للعميل على المدى الطويل وقارنها بتكلفة الاستحواذ (CAC)</p>
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
              <span>{editingId ? 'تعديل التحليل' : 'معطيات العملاء والمبيعات'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>عنوان التحليل أو المرجع</label>
              <div className="input-wrapper">
                <input type="text" value={analysisName} onChange={(e) => setAnalysisName(e.target.value)} placeholder="مثال: تحليل عملاء المتجر العام" required />
              </div>
            </div>

            <div className="input-group">
              <label>متوسط قيمة الطلب الواحد (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={avgOrderValue === '' ? '' : avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="250" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>معدل تكرار الشراء السنوي لكل عميل</label>
              <div className="input-wrapper">
                <input type="number" step="0.1" min="0" value={purchaseFrequency === '' ? '' : purchaseFrequency} onChange={(e) => setPurchaseFrequency(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2.5" required />
              </div>
            </div>

            <div className="input-group">
              <label>العمر الافتراضي للعميل (بالسنوات)</label>
              <div className="input-wrapper">
                <input type="number" step="0.1" min="0" value={customerLifespan === '' ? '' : customerLifespan} onChange={(e) => setCustomerLifespan(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2" required />
              </div>
            </div>

            <div className="input-group">
              <label>هامش الربح الإجمالي للمنتجات (%)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={profitMargin === '' ? '' : profitMargin} onChange={(e) => setProfitMargin(e.target.value === '' ? '' : Number(e.target.value))} placeholder="40" required />
                <span className="currency-tag">%</span>
              </div>
            </div>

            <div className="input-group">
              <label>تكلفة الاستحواذ على العميل (CAC في الإعلانات)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={cacCost === '' ? '' : cacCost} onChange={(e) => setCacCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="60" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ التحليل في السجل'}
            </button>
          </form>
        </div>

        {/* قسم التحليل الفوري */}
        <div className="card">
          <h2 className="card-title">تحليل LTV مقابل CAC</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">القيمة الدائمة للعميل (LTV)</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>صافي الربح المتوقع من العميل طوال فترة تعامله</div>
            </div>
            <div className="result-value">
              {ltvValue.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">نسبة العائد (LTV : CAC)</span>
            <span className="result-value" style={{ color: '#047857' }}>{ratio}</span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي إيرادات العميل (قبل خصم التكلفة)</span>
            <span className="result-value">{totalRevenuePerCustomer.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">تكلفة الاستحواذ المدخلة (CAC)</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{cac.toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* جدول إدارة السجلات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم التحليل..." 
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
                <th>اسم التحليل</th>
                <th>متوسط الطلب</th>
                <th>التكرار السنوي</th>
                <th>تكلفة الاستحواذ (CAC)</th>
                <th>القيمة الدائمة (LTV)</th>
                <th>النسبة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد تحليلات مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.analysisName}</td>
                    <td>{item.avgOrderValue} ر.س</td>
                    <td>{item.purchaseFrequency} مرة</td>
                    <td>{item.cacCost} ر.س</td>
                    <td style={{ color: '#047857', fontWeight: 900 }}>{item.ltvValue} ر.س</td>
                    <td>{item.ratio}</td>
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
