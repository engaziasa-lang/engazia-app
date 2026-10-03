'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface InventoryItem {
  id: string;
  productName: string;
  seasonName: string;
  currentStock: number;
  expectedDemand: number;
  leadTimeDays: number;
  recommendedOrder: number;
}

export default function InventoryPlannerSA() {
  const [productName, setProductName] = useState<string>('');
  const [seasonName, setSeasonName] = useState<string>('موسم رمضان والعيد');
  const [currentStock, setCurrentStock] = useState<number | ''>('');
  const [expectedDemand, setExpectedDemand] = useState<number | ''>('');
  const [leadTimeDays, setLeadTimeDays] = useState<number | ''>(14);

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_inventory_planner_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: InventoryItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_inventory_planner_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const stock = typeof currentStock === 'number' ? currentStock : 0;
  const demand = typeof expectedDemand === 'number' ? expectedDemand : 0;
  const lt = typeof leadTimeDays === 'number' ? leadTimeDays : 0;

  // الحسابات الفعلية: الكمية الموصى بطلبها = الطلب المتوقع خلال الموسم + احتياطي الأمان لفترة التوريد ناقص المخزون الحالي
  const safetyStock = Math.ceil((demand / 30) * lt * 0.2);
  const recommendedOrder = Math.max(0, (demand + safetyStock) - stock);

  const handleClearForm = () => {
    setProductName('');
    setSeasonName('موسم رمضان والعيد');
    setCurrentStock('');
    setExpectedDemand('');
    setLeadTimeDays(14);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 خطط). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!productName.trim() || demand <= 0) {
      alert('الرجاء إدخال اسم المنتج والطلب المتوقع.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        seasonName,
        currentStock: stock,
        expectedDemand: demand,
        leadTimeDays: lt,
        recommendedOrder,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث خطة المخزون بنجاح!');
    } else {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        productName,
        seasonName,
        currentStock: stock,
        expectedDemand: demand,
        leadTimeDays: lt,
        recommendedOrder,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة خطة المخزون إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: InventoryItem) => {
    setProductName(item.productName);
    setSeasonName(item.seasonName);
    setCurrentStock(item.currentStock);
    setExpectedDemand(item.expectedDemand);
    setLeadTimeDays(item.leadTimeDays);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخطة من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,Product,Season,Stock,Demand,Recommended\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.productName},${row.seasonName},${row.currentStock},${row.expectedDemand},${row.recommendedOrder}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_inventory_planner.csv");
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
            alert('✨ تم استيراد بيانات المخزون بنجاح!');
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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        
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
          <h1>مخطط المخزون للمواسم السعودية 📅</h1>
          <p>توقع الكميات المطلوبة لمواسم (رمضان، العيد، اليوم الوطني) لتجنب نفاذ الكمية وضياع المبيعات</p>
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
              <span>{editingId ? 'تعديل الخطة' : 'تخطيط موسم جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المنتج أو الصنف</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: بوكس عطور العيد" required />
              </div>
            </div>

            <div className="input-group">
              <label>اسم الموسم المستهدف</label>
              <div className="input-wrapper">
                <select value={seasonName} onChange={(e) => setSeasonName(e.target.value)}>
                  <option value="موسم رمضان والعيد">موسم رمضان والعيد</option>
                  <option value="اليوم الوطني السعودي (23 سبتمبر)">اليوم الوطني السعودي (23 سبتمبر)</option>
                  <option value="يوم التأسيس (22 فبراير)">يوم التأسيس (22 فبراير)</option>
                  <option value="موسم العودة للمدارس">موسم العودة للمدارس</option>
                  <option value="الجمعة البيضاء (تخفيضات نوفمبر)">الجمعة البيضاء (تخفيضات نوفمبر)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>المخزون الحالي المتوفر (قطعة)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={currentStock === '' ? '' : currentStock} onChange={(e) => setCurrentStock(e.target.value === '' ? '' : Number(e.target.value))} placeholder="100" required />
              </div>
            </div>

            <div className="input-group">
              <label>الطلب أو المبيعات المتوقعة خلال الموسم (قطعة)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={expectedDemand === '' ? '' : expectedDemand} onChange={(e) => setExpectedDemand(e.target.value === '' ? '' : Number(e.target.value))} placeholder="600" required />
              </div>
            </div>

            <div className="input-group">
              <label>فترة التوريد من المورد (Lead Time بالأيام)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={leadTimeDays === '' ? '' : leadTimeDays} onChange={(e) => setLeadTimeDays(e.target.value === '' ? '' : Number(e.target.value))} placeholder="14" required />
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ الخطة في السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">توصية المخزون الفورية</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">الكمية الموصى بطلبها وتوريدها للموسم</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>الطلب المتوقع + احتياطي الأمان - المخزون الحالي</div>
            </div>
            <div className="result-value">
              {recommendedOrder} قطعة
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">مخزون الأمان المقترح لفترة التوريد</span>
            <span className="result-value" style={{ color: '#047857' }}>{safetyStock} قطعة</span>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي الاحتياج الكلي للموسم</span>
            <span className="result-value">{demand + safetyStock} قطعة</span>
          </div>
        </div>
      </div>

      {/* جدول إدارة السجلات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المنتج أو الموسم..." 
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
                <th>اسم المنتج</th>
                <th>الموسم</th>
                <th>المخزون الحالي</th>
                <th>الطلب المتوقع</th>
                <th>الكمية الموصى بطلبها</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد خطط مخزون مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.productName}</td>
                    <td>{item.seasonName}</td>
                    <td>{item.currentStock} قطعه</td>
                    <td>{item.expectedDemand} قطعه</td>
                    <td style={{ color: '#047857', fontWeight: 900 }}>{item.recommendedOrder} قطعة</td>
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
