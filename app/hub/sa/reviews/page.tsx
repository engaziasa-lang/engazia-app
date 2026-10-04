'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ReviewItem {
  id: string;
  customerName: string;
  phoneNumber: string;
  orderNumber: string;
  productName: string;
  reviewStatus: string;
  createdAt?: string;
}

export default function AutomatedReviewsSA() {
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  
  // الخيارات الذكية لحالة التقييم مع الكتابة اليدوية
  const [statusSelect, setStatusSelect] = useState<string>('في انتظار الإرسال 🕒');
  const [customStatus, setCustomStatus] = useState<string>('في انتظار الإرسال 🕒');

  const [items, setItems] = useState<ReviewItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_automated_reviews_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ReviewItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_automated_reviews_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const finalReviewStatus = statusSelect === 'حالة أخرى (كتابة يدوية)' ? customStatus : statusSelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatusSelect(val);
    if (val !== 'حالة أخرى (كتابة يدوية)') {
      setCustomStatus(val);
    } else {
      setCustomStatus('');
    }
  };

  const handleClearForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setOrderNumber('');
    setProductName('');
    setStatusSelect('في انتظار الإرسال 🕒');
    setCustomStatus('في انتظار الإرسال 🕒');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 عملاء). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!customerName.trim() || !phoneNumber.trim() || !orderNumber.trim() || !finalReviewStatus.trim()) {
      alert('الرجاء التأكد من تعبئة اسم العميل، رقم الجوال، رقم الطلب، وحالة التقييم.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        customerName,
        phoneNumber,
        orderNumber,
        productName,
        reviewStatus: finalReviewStatus,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السجل بنجاح!');
    } else {
      const newItem: ReviewItem = {
        id: Date.now().toString(),
        customerName,
        phoneNumber,
        orderNumber,
        productName,
        reviewStatus: finalReviewStatus,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة العميل إلى سجل طلبات التقييم بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ReviewItem) => {
    setCustomerName(item.customerName);
    setPhoneNumber(item.phoneNumber);
    setOrderNumber(item.orderNumber);
    setProductName(item.productName);
    
    const standardStatuses = ['في انتظار الإرسال 🕒', 'تم إرسال الطلب 📤', 'تم التقييم بنجاح ⭐', 'لم يستجب ❌'];
    if (standardStatuses.includes(item.reviewStatus)) {
      setStatusSelect(item.reviewStatus);
      setCustomStatus(item.reviewStatus);
    } else {
      setStatusSelect('حالة أخرى (كتابة يدوية)');
      setCustomStatus(item.reviewStatus);
    }
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  // دالة إرسال رسالة واتساب لطلب التقييم
  const handleSendWhatsapp = (item: ReviewItem) => {
    let phone = (item.phoneNumber || '').replace(/\D/g, '');
    if (phone.startsWith('05')) {
      phone = '966' + phone.substring(1);
    }
    
    const text = `مرحباً بك يا ${item.customerName} 🌟. نتمنى أن منتجك (${item.productName || 'الطلب رقم ' + item.orderNumber}) قد نال إعجابك! نتشرف برأيك وتقييمك لخدمتنا عبر الرد على هذه الرسالة أو من خلال تقييم المتجر. شكراً لثقتك بنا!`;
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
                <th>اسم العميل</th>
                <th>رقم الجوال</th>
                <th>رقم الطلب</th>
                <th>المنتج</th>
                <th>حالة التقييم</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.customerName}</td>
          <td>${row.phoneNumber}</td>
          <td>${row.orderNumber}</td>
          <td>${row.productName || '-'}</td>
          <td>${row.reviewStatus}</td>
          <td>${row.createdAt || '-'}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="6">إجمالي العملاء المسجلين</td>
                <td>${items.length} عميل</td>
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
    link.setAttribute("download", "seerk_automated_reviews.xls");
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
            alert('✨ تم استيراد بيانات التقييمات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phoneNumber.includes(searchQuery)
  );

  const completedReviews = filteredItems.filter(i => i.reviewStatus.includes('تم التقييم')).length;

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
        .btn-wa { background: #22c55e; color: #ffffff; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>نظام طلب التقييمات الآلي ⭐</h1>
          <p>أرسل رسائل تلقائية للعملاء عبر واتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية</p>
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
              <span>{editingId ? 'تعديل السجل' : 'إضافة عميل لطلب تقييم'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>اسم العميل</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: فهد الشمري" required />
                </div>
              </div>
              <div className="input-group">
                <label>رقم جوال العميل</label>
                <div className="input-wrapper">
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="05XXXXXXXX" required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>رقم الطلب</label>
                <div className="input-wrapper">
                  <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="مثال: #89201" required />
                </div>
              </div>
              <div className="input-group">
                <label>اسم المنتج (اختياري)</label>
                <div className="input-wrapper">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: عطر إنجازيا الفاخر" />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>حالة التقييم</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={statusSelect} onChange={handleSelectChange}>
                  <option value="في انتظار الإرسال 🕒">في انتظار الإرسال 🕒</option>
                  <option value="تم إرسال الطلب 📤">تم إرسال الطلب 📤</option>
                  <option value="تم التقييم بنجاح ⭐">تم التقييم بنجاح ⭐</option>
                  <option value="لم يستجب ❌">لم يستجب ❌</option>
                  <option value="حالة أخرى (كتابة يدوية)">➕ حالة أخرى (كتابة يدوية)</option>
                </select>
              </div>

              {statusSelect === 'حالة أخرى (كتابة يدوية)' && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customStatus} 
                    onChange={(e) => setCustomStatus(e.target.value)} 
                    placeholder="اكتب حالة التقييم المخصصة هنا..." 
                    required 
                  />
                </div>
              )}
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ إضافة العميل إلى السجل'}
            </button>
          </form>
        </div>

        {/* قسم المؤشرات الفورية */}
        <div className="card">
          <h2 className="card-title">مؤشرات التقييمات الفورية</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">إجمالي العملاء المستهدفين</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>سجل متابعة طلبات التقييم</div>
            </div>
            <div className="result-value">
              {items.length} عميل
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">التقييمات المكتملة (⭐)</span>
            <span className="result-value" style={{ color: '#047857' }}>{completedReviews}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">معدل الاستجابة والتوثيق</span>
            <span className="result-value" style={{ color: '#d97706' }}>
              {items.length > 0 ? ((completedReviews / items.length) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم العميل أو رقم الطلب..." 
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
                <th>العميل والتاريخ</th>
                <th>رقم الطلب والمنتج</th>
                <th>رقم الجوال</th>
                <th>حالة التقييم</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سجلات تقييمات مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  let statusColor = '#0369a1';
                  if (item.reviewStatus.includes('تم التقييم')) statusColor = '#047857';
                  if (item.reviewStatus.includes('الإرسال')) statusColor = '#d97706';
                  if (item.reviewStatus.includes('لم يستجب')) statusColor = '#dc2626';

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.customerName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: '#0369a1' }}>{item.orderNumber}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.productName || 'طلب عام'}</div>
                      </td>
                      <td style={{ direction: 'ltr', textAlign: 'right', fontWeight: 700 }}>{item.phoneNumber}</td>
                      <td>
                        <span style={{ color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.reviewStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title="إرسال طلب التقييم عبر واتساب">💬 واتساب</button>
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
                  <td colSpan={5} style={{ textAlign: 'center' }}>إجمالي العملاء المسجلين</td>
                  <td>{filteredItems.length} عميل</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
