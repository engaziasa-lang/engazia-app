'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ShipmentItem {
  id: string;
  trackingNumber: string;
  customerName: string;
  phoneNumber: string;
  shippingCompany: string;
  shipmentStatus: string;
  createdAt?: string;
}

export default function ShippingTrackerAE() {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [shippingSelect, setShippingSelect] = useState<string>('أرامكس (Aramex)');
  const [customShipping, setCustomShipping] = useState<string>('أرامكس (Aramex)');
  const [shipmentStatus, setShipmentStatus] = useState<string>('قيد التوصيل');

  const [items, setItems] = useState<ShipmentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // تم تغيير مفتاح التخزين لفصل البيانات للإمارات
    const saved = localStorage.getItem('seerk_ae_shipping_tracker_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ShipmentItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ae_shipping_tracker_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setShippingSelect(val);
    if (val !== 'شركة أخرى (كتابة يدوية)') {
      setCustomShipping(val);
    } else {
      setCustomShipping('');
    }
  };

  const handleClearForm = () => {
    setTrackingNumber('');
    setCustomerName('');
    setPhoneNumber('');
    setShippingSelect('أرامكس (Aramex)');
    setCustomShipping('أرامكس (Aramex)');
    setShipmentStatus('قيد التوصيل');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 شحنات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    const finalCompany = shippingSelect === 'شركة أخرى (كتابة يدوية)' ? customShipping : shippingSelect;
    if (!trackingNumber.trim() || !customerName.trim() || !phoneNumber.trim()) {
      alert('الرجاء التأكد من تعبئة رقم البوليصة، اسم العميل، ورقم الجوال.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    // تعديل التوقيت ليطابق الإمارات
    const formattedDate = `${now.toLocaleDateString('ar-AE')} - ${now.toLocaleTimeString('ar-AE', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        trackingNumber,
        customerName,
        phoneNumber,
        shippingCompany: finalCompany,
        shipmentStatus,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث بيانات الشحنة بنجاح!');
    } else {
      const newItem: ShipmentItem = {
        id: Date.now().toString(),
        trackingNumber,
        customerName,
        phoneNumber,
        shippingCompany: finalCompany,
        shipmentStatus,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الشحنة إلى سجل التتبع بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ShipmentItem) => {
    setTrackingNumber(item.trackingNumber);
    setCustomerName(item.customerName);
    setPhoneNumber(item.phoneNumber);
    
    // تخصيص قائمة الشركات للسوق الإماراتي
    const standardCompanies = ['أرامكس (Aramex)', 'فيديكس (FedEx)', 'إمبوست (Emirates Post)', 'دي إتش إل (DHL)', 'كريم (Careem)'];
    if (standardCompanies.includes(item.shippingCompany)) {
      setShippingSelect(item.shippingCompany);
      setCustomShipping(item.shippingCompany);
    } else {
      setShippingSelect('شركة أخرى (كتابة يدوية)');
      setCustomShipping(item.shippingCompany);
    }
    setShipmentStatus(item.shipmentStatus);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الشحنة؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  // دالة إرسال واتساب للعميل بخصوص شحنته (محدثة لكود الإمارات 971)
  const handleSendWhatsapp = (item: ShipmentItem) => {
    let phone = (item.phoneNumber || '').replace(/\D/g, '');
    if (phone.startsWith('05')) {
      phone = '971' + phone.substring(1);
    } else if (phone.startsWith('5') && phone.length === 9) {
      phone = '971' + phone;
    }
    
    const text = `مرحباً بك يا ${item.customerName} 📦. بخصوص شحنتك رقم (${item.trackingNumber}) عبر شركة (${item.shippingCompany})، حالتها الحالية هي: (${item.shipmentStatus}). نشكر لثقتك بنا!`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
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
                <th>رقم البوليصة</th>
                <th>اسم العميل</th>
                <th>رقم الجوال</th>
                <th>شركة الشحن</th>
                <th>حالة الشحنة</th>
                <th>تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.trackingNumber}</td>
          <td>${row.customerName}</td>
          <td>${row.phoneNumber}</td>
          <td>${row.shippingCompany}</td>
          <td>${row.shipmentStatus}</td>
          <td>${row.createdAt || '-'}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="6">إجمالي الشحنات المسجلة</td>
                <td>${items.length} شحنة</td>
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
    link.setAttribute("download", "seerk_ae_shipping_tracker.xls");
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
            alert('✨ تم استيراد الشحنات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.shippingCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deliveredCount = filteredItems.filter(i => i.shipmentStatus.includes('تم التوصيل')).length;
  const delayedCount = filteredItems.filter(i => i.shipmentStatus.includes('متأخرة')).length;

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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%); color: #fff; border: none; padding: 20px; }
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
        .btn-wa { background: #22c55e; color: #ffffff; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مدير تتبع الشحنات المحلية 📦</h1>
          <p>تابع حالات الشحنات في الإمارات وحل استفسارات تأخر التوصيل عبر واتساب بضغطة زر</p>
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
              <span>{editingId ? 'تعديل السجل' : 'إضافة شحنة جديدة للتتبع'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>رقم البوليصة / التتبع</label>
                <div className="input-wrapper">
                  <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="مثال: 384920192" required />
                </div>
              </div>
              <div className="input-group">
                <label>اسم العميل</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: خالد المنصوري" required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>رقم جوال العميل (الإماراتي)</label>
                <div className="input-wrapper">
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="05XXXXXXXX" required />
                </div>
              </div>
              <div className="input-group">
                <label>حالة الشحنة</label>
                <div className="input-wrapper">
                  <select value={shipmentStatus} onChange={(e) => setShipmentStatus(e.target.value)}>
                    <option value="قيد التوصيل">قيد التوصيل 🚚</option>
                    <option value="تم التوصيل بنجاح">تم التوصيل بنجاح ✅</option>
                    <option value="متأخرة / تحتاج متابعة">متأخرة / تحتاج متابعة ⚠️</option>
                    <option value="مرتجعة للمتجر">مرتجعة للمتجر 🔄</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>شركة الشحن</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={shippingSelect} onChange={handleSelectChange}>
                  <option value="أرامكس (Aramex)">أرامكس (Aramex)</option>
                  <option value="فيديكس (FedEx)">فيديكس (FedEx)</option>
                  <option value="إمبوست (Emirates Post)">إمبوست (Emirates Post)</option>
                  <option value="دي إتش إل (DHL)">دي إتش إل (DHL)</option>
                  <option value="كريم (Careem)">كريم (Careem)</option>
                  <option value="شركة أخرى (كتابة يدوية)">➕ شركة أخرى (كتابة يدوية)</option>
                </select>
              </div>

              {shippingSelect === 'شركة أخرى (كتابة يدوية)' && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customShipping} 
                    onChange={(e) => setCustomShipping(e.target.value)} 
                    placeholder="اكتب اسم شركة الشحن هنا..." 
                    required 
                  />
                </div>
              )}
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ الشحنة في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المؤشرات الفورية */}
        <div className="card">
          <h2 className="card-title">مؤشرات حالة الشحنات</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">إجمالي الشحنات المسجلة</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>قيد المتابعة والخدمة</div>
            </div>
            <div className="result-value">
              {items.length} شحنة
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">الشحنات المسلمة</span>
            <span className="result-value" style={{ color: '#047857' }}>{deliveredCount}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">الشحنات المتأخرة (تحتاج تدخل)</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{delayedCount}</span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
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
                <th>رقم البوليصة والتاريخ</th>
                <th>العميل ورقم الجوال</th>
                <th>شركة الشحن</th>
                <th>حالة الشحنة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد شحنات مسجلة للتتبع حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  let statusColor = '#0369a1';
                  if (item.shipmentStatus.includes('تم التوصيل')) statusColor = '#047857';
                  if (item.shipmentStatus.includes('متأخرة')) statusColor = '#dc2626';
                  if (item.shipmentStatus.includes('مرتجعة')) statusColor = '#d97706';

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.trackingNumber}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 800 }}>{item.customerName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', direction: 'ltr', textAlign: 'right' }}>{item.phoneNumber}</div>
                      </td>
                      <td><span style={{ fontWeight: 800, color: '#334155' }}>{item.shippingCompany}</span></td>
                      <td>
                        <span style={{ color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.shipmentStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title="إرسال رسالة واتساب للعميل">💬 واتساب</button>
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
                  <td colSpan={5} style={{ textAlign: 'center' }}>إجمالي الشحنات المسجلة</td>
                  <td>{filteredItems.length} شحنة</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
