'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CustomerItem {
  id: string;
  customerName: string;
  phoneNumber: string;
  status: string;
  orderValue: number;
  paymentLink: string;
  messageTemplate: string;
  createdAt?: string;
}

export default function WhatsappCrmSA() {
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [status, setStatus] = useState<string>('سلة متروكة');
  const [orderValue, setOrderValue] = useState<number | ''>('');
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [messageTemplate, setMessageTemplate] = useState<string>('مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}');

  const [items, setItems] = useState<CustomerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_whatsapp_crm_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: CustomerItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_whatsapp_crm_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const val = typeof orderValue === 'number' ? orderValue : 0;

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === 'abandoned') {
      setMessageTemplate('مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}');
    } else if (selected === 'pending') {
      setMessageTemplate('أهلاً بك {name}، طلبك بقيمة {amount} ر.س بانتظار الدفع 💳. لإتمام الطلب وتأكيده يرجى زيارة الرابط: {link}');
    } else if (selected === 'completed') {
      setMessageTemplate('شكراً لك {name} لثقتك بمتجرنا 🎉. تم تأكيد طلبك بقيمة {amount} ر.س، وسيتم تجهيزه وشحنه قريباً. لتتبع الطلب: {link}');
    } else if (selected === 'custom') {
      setMessageTemplate('');
    }
  };

  const handleClearForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setStatus('سلة متروكة');
    setOrderValue('');
    setPaymentLink('');
    setMessageTemplate('مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 عملاء). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!customerName.trim() || !phoneNumber.trim()) {
      alert('الرجاء إدخال اسم العميل ورقم الجوال بشكل صحيح.');
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
        status,
        orderValue: val,
        paymentLink,
        messageTemplate,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث بيانات العميل بنجاح!');
    } else {
      const newItem: CustomerItem = {
        id: Date.now().toString(),
        customerName,
        phoneNumber,
        status,
        orderValue: val,
        paymentLink,
        messageTemplate,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تم حفظ بيانات العميل في السجل!');
    }

    handleClearForm();
  };

  const handleEdit = (item: CustomerItem) => {
    setCustomerName(item.customerName || '');
    setPhoneNumber(item.phoneNumber || '');
    setStatus(item.status || 'سلة متروكة');
    setOrderValue(item.orderValue || 0);
    setPaymentLink(item.paymentLink || '');
    setMessageTemplate(item.messageTemplate || '');
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleSendWhatsapp = (item: CustomerItem) => {
    // حماية إضافية للبيانات
    const safePhone = item.phoneNumber || '';
    const safeName = item.customerName || 'عميلنا العزيز';
    const safeAmount = (item.orderValue || 0).toString();
    const safeLink = item.paymentLink || '';
    const safeTemplate = item.messageTemplate || '';

    let phone = safePhone.replace(/\D/g, '');
    if (phone.startsWith('05')) {
      phone = '966' + phone.substring(1);
    }
    
    let text = safeTemplate
      .replace(/{name}/g, safeName)
      .replace(/{amount}/g, safeAmount)
      .replace(/{link}/g, safeLink);

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const totalOrdersValue = items.reduce((acc, curr) => acc + (curr.orderValue || 0), 0);

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
                <th>التاريخ والوقت</th>
                <th>رقم الجوال</th>
                <th>حالة العميل</th>
                <th>قيمة السلة/الطلب</th>
                <th>الرابط المرفق</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.customerName || ''}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.phoneNumber || ''}</td>
          <td>${row.status || ''}</td>
          <td>${row.orderValue || 0}</td>
          <td>${row.paymentLink || ''}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">الإجمالي الكلي</td>
                <td>${totalOrdersValue.toFixed(2)}</td>
                <td></td>
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
    link.setAttribute("download", "seerk_whatsapp_crm.xls");
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
            alert('✨ تم استيراد بيانات العملاء بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  // إضافة حماية || '' لمنع انهيار الصفحة بسبب بيانات قديمة فارغة
  const filteredItems = items.filter(item => 
    (item.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.phoneNumber || '').includes(searchQuery)
  );

  const totalOrdersValue = filteredItems.reduce((acc, curr) => acc + (curr.orderValue || 0), 0);
  const abandonedCount = filteredItems.filter(i => i.status === 'سلة متروكة').length;
  const completedCount = filteredItems.filter(i => i.status === 'طلب مكتمل').length;

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

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input.with-currency { padding-left: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
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
          <h1>إدارة عملاء واتساب (Seerk Pro Max) 💬</h1>
          <p>إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل بيانات العميل' : 'إضافة عميل / سلة جديدة'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label>اسم العميل</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: أحمد الدوسري" required />
                </div>
              </div>
              <div className="input-group">
                <label>رقم الجوال</label>
                <div className="input-wrapper">
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="05XXXXXXXX" required />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label>حالة العميل / الطلب</label>
                <div className="input-wrapper">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="سلة متروكة">سلة متروكة (لم يكمل الدفع)</option>
                    <option value="بانتظار الدفع">بانتظار الدفع (تحويل بنكي)</option>
                    <option value="طلب مكتمل">طلب مكتمل (تأكيد الشحن)</option>
                    <option value="استفسار عام">استفسار عام</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>قيمة السلة أو الطلب (ر.س)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" min="0" value={orderValue === '' ? '' : orderValue} onChange={(e) => setOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="250" />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>رابط الدفع السريع (أو رابط تتبع الشحنة)</label>
              <div className="input-wrapper">
                <input type="url" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
              <div className="input-group">
                <label style={{ color: '#0f172a' }}>اختر نموذج الرسالة (لتعبئة المربع أدناه)</label>
                <div className="input-wrapper">
                  <select onChange={handlePresetChange} defaultValue="abandoned">
                    <option value="abandoned">سلة متروكة (تذكير بالدفع)</option>
                    <option value="pending">بانتظار الدفع (تأكيد الطلب)</option>
                    <option value="completed">طلب مكتمل (رسالة شكر وتتبع)</option>
                    <option value="custom">كتابة رسالة فارغة جديدة</option>
                  </select>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ color: '#0f172a', margin: 0 }}>قالب الرسالة (قابل للتعديل بحرية)</label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>المتغيرات: {`{name}`} - {`{amount}`} - {`{link}`}</span>
                </div>
                <div className="input-wrapper">
                  <textarea 
                    rows={4} 
                    value={messageTemplate} 
                    onChange={(e) => setMessageTemplate(e.target.value)} 
                    placeholder="اكتب رسالتك المخصصة هنا..."
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ العميل في السجل'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">مؤشرات قاعدة العملاء</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">إجمالي قيمة السلال والطلبات المحفوظة</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>مجموع الإيرادات المحتملة والمحققة</div>
            </div>
            <div className="result-value">
              {totalOrdersValue.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي العملاء في السجل</span>
            <span className="result-value" style={{ color: '#0369a1' }}>{items.length} عميل</span>
          </div>

          <div className="result-box">
            <span className="result-label">السلال المتروكة (فرص بيع)</span>
            <span className="result-value" style={{ color: '#d97706' }}>{abandonedCount}</span>
          </div>

          <div className="result-box">
            <span className="result-label">الطلبات المكتملة</span>
            <span className="result-value" style={{ color: '#047857' }}>{completedCount}</span>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم العميل أو رقم الجوال..." 
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
                <th>رقم الجوال</th>
                <th>الحالة</th>
                <th>قيمة السلة/الطلب</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا يوجد عملاء مسجلين حالياً. ابدأ بإضافة سلال متروكة لاسترجاعها.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  let statusColor = '#475569';
                  if (item.status === 'سلة متروكة') statusColor = '#d97706';
                  if (item.status === 'طلب مكتمل') statusColor = '#047857';
                  if (item.status === 'بانتظار الدفع') statusColor = '#0369a1';

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.customerName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td style={{ fontWeight: 800, color: '#334155', direction: 'ltr', textAlign: 'right' }}>{item.phoneNumber}</td>
                      <td>
                        <span style={{ color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 900 }}>{item.orderValue} ر.س</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title="فتح محادثة واتساب وإرسال الرسالة المجهزة">💬 واتساب</button>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>الإجمالي الكلي</td>
                  <td>{totalOrdersValue.toFixed(2)} ر.س</td>
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
