'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ShippingItem {
  id: string;
  trackingNumber: string;
  customerName: string;
  courierCompany: string;
  status: string;
  destinationCity: string;
  notes: string;
}

export default function ShippingManagerSA() {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [courierCompany, setCourierCompany] = useState<string>('سمسا (SMSA Express)');
  const [status, setStatus] = useState<string>('قيد الشحن والتوصيل (In Transit)');
  const [destinationCity, setDestinationCity] = useState<string>('الرياض');
  const [notes, setNotes] = useState<string>('');

  const [items, setItems] = useState<ShippingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_shipping_manager_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ShippingItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_shipping_manager_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const handleClearForm = () => {
    setTrackingNumber('');
    setCustomerName('');
    setCourierCompany('سمسا (SMSA Express)');
    setStatus('قيد الشحن والتوصيل (In Transit)');
    setDestinationCity('الرياض');
    setNotes('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 شحنات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!trackingNumber.trim() || !customerName.trim()) {
      alert('الرجاء إدخال رقم البوليصة واسم العميل.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        trackingNumber,
        customerName,
        courierCompany,
        status,
        destinationCity,
        notes,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث الشحنة بنجاح!');
    } else {
      const newItem: ShippingItem = {
        id: Date.now().toString(),
        trackingNumber,
        customerName,
        courierCompany,
        status,
        destinationCity,
        notes,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الشحنة إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ShippingItem) => {
    setTrackingNumber(item.trackingNumber);
    setCustomerName(item.customerName);
    setCourierCompany(item.courierCompany);
    setStatus(item.status);
    setDestinationCity(item.destinationCity);
    setNotes(item.notes);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الشحنة من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,TrackingNo,Customer,Company,Status,City\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.trackingNumber},${row.customerName},${row.courierCompany},${row.status},${row.destinationCity}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_shipping_manager.csv");
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
    item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.customerName.toLowerCase().includes(searchQuery.toLowerCase())
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
        
        .grid-layout { display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px; }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media(max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        .input-wrapper textarea { height: 80px; resize: vertical; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

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
          <h1>مدير تتبع الشحنات المحلية 📦</h1>
          <p>تابع حالات الشحنات مع شركات الشحن المحلية (سمسا، أرامكس، ريدبوكس) وحل استفسارات تأخر التوصيل</p>
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
              <span>{editingId ? 'تعديل بيانات الشحنة' : 'إضافة شحنة جديدة للتتبع'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-grid">
              <div className="input-group">
                <label>رقم بوليصة الشحن أو التتبع</label>
                <div className="input-wrapper">
                  <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="مثال: SMSA123456789" required />
                </div>
              </div>

              <div className="input-group">
                <label>اسم العميل المستلم</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: فهد الدوسري" required />
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>شركة الشحن اللوجستية</label>
                <div className="input-wrapper">
                  <select value={courierCompany} onChange={(e) => setCourierCompany(e.target.value)}>
                    <option value="سمسا (SMSA Express)">سمسا (SMSA Express)</option>
                    <option value="أرامكس (Aramex)">أرامكس (Aramex)</option>
                    <option value="ريدبوكس (RedBox)">ريدبوكس (RedBox)</option>
                    <option value="ناقل (Naqel Express)">ناقل (Naqel Express)</option>
                    <option value="أي أم إي اكس (IMLEGAL)">أي أم إي اكس (IMILE)</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>حالة الشحنة الحالية</label>
                <div className="input-wrapper">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="قيد الشحن والتوصيل (In Transit)">قيد الشحن والتوصيل (In Transit)</option>
                    <option value="تم التوصيل بنجاح (Delivered)">تم التوصيل بنجاح (Delivered)</option>
                    <option value="تأخر في التوصيل (Delayed)">تأخر في التوصيل (Delayed)</option>
                    <option value="بانتظار الاستلام من الخزانة">بانتظار الاستلام من الخزانة</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>مدينة الوجهة (المدينة المستهدفة)</label>
                <div className="input-wrapper">
                  <input type="text" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} placeholder="الرياض، جدة، الدمام..." />
                </div>
              </div>

              <div className="input-group">
                <label>ملاحظات الشحنة</label>
                <div className="input-wrapper">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات حول حالة الشحنة أو تأخرها..."></textarea>
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ الشحنة في السجل'}
            </button>
          </form>
        </div>
      </div>

      {/* جدول إدارة الشحنات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث برقم البوليصة أو اسم العميل..." 
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
                <th>رقم البوليصة</th>
                <th>العميل</th>
                <th>شركة الشحن</th>
                <th>المدينة</th>
                <th>الحالة</th>
                <th>ملاحظات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد شحنات مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.trackingNumber}</td>
                    <td>{item.customerName}</td>
                    <td>{item.courierCompany}</td>
                    <td>{item.destinationCity}</td>
                    <td><span style={{ background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>{item.status}</span></td>
                    <td style={{ color: '#64748b' }}>{item.notes}</td>
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
