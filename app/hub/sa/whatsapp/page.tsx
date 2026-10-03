'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface WhatsAppClientItem {
  id: string;
  clientName: string;
  phoneNumber: string;
  orderStatus: string;
  orderValue: number;
  notes: string;
}

export default function WhatsAppCrmManagerSA() {
  const [clientName, setClientName] = useState<string>('سارة الشمري');
  const [phoneNumber, setPhoneNumber] = useState<string>('0501234567');
  const [orderStatus, setOrderStatus] = useState<string>('سلة متروكة (Abandoned Cart)');
  const [orderValue, setOrderValue] = useState<number | ''>(320);
  const [notes, setNotes] = useState<string>('لم تكمل الدفع عند بوابات الدفع');

  const [items, setItems] = useState<WhatsAppClientItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_whatsapp_crm_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: WhatsAppClientItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_whatsapp_crm_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  // تنسيق رقم الجوال لرابط واتساب الدولي (السعودية 966)
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.startsWith('05')) {
    cleanPhone = '966' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('966') && cleanPhone.length === 9) {
    cleanPhone = '966' + cleanPhone;
  }

  const defaultMsg = `أهلاً بك يا أستاذ/ة ${clientName || 'عزيزنا العميل'} 👋\nلاحظنا عدم إتمامك للطلب في متجرنا بقيمة ${orderValue || 0} ر.س. هل تواجه مشكلة في الدفع أو تحتاج مساعدة؟ تفضل وهذا رابط مباشر لإتمام طلبك بكل سهولة ✨`;
  const encodedMsg = encodeURIComponent(defaultMsg);
  const whatsappDirectUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const handleClearForm = () => {
    setClientName('');
    setPhoneNumber('');
    setOrderStatus('سلة متروكة (Abandoned Cart)');
    setOrderValue('');
    setNotes('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 عملاء). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!clientName.trim() || !phoneNumber.trim()) {
      alert('الرجاء إدخال اسم العميل ورقم الجوال.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        clientName,
        phoneNumber,
        orderStatus,
        orderValue: typeof orderValue === 'number' ? orderValue : 0,
        notes,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث بيانات العميل بنجاح!');
    } else {
      const newItem: WhatsAppClientItem = {
        id: Date.now().toString(),
        clientName,
        phoneNumber,
        orderStatus,
        orderValue: typeof orderValue === 'number' ? orderValue : 0,
        notes,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة العميل إلى سجل CRM بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: WhatsAppClientItem) => {
    setClientName(item.clientName);
    setPhoneNumber(item.phoneNumber);
    setOrderStatus(item.orderStatus);
    setOrderValue(item.orderValue);
    setNotes(item.notes);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,ClientName,Phone,Status,OrderValue,Notes\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.clientName},${row.phoneNumber},${row.orderStatus},${row.orderValue},${row.notes}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_whatsapp_crm.csv");
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
            alert('✨ تم استيراد عملاء واتساب بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.phoneNumber.includes(searchQuery)
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
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #25d366; background: #ffffff; }
        .input-wrapper textarea { height: 80px; resize: vertical; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #25d366; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .action-btn:hover { background: #20ba5a; }

        .preview-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; font-size: 14px; color: #166534; font-weight: 600; }
        .preview-box h3 { font-size: 16px; font-weight: 900; margin-top: 0; margin-bottom: 12px; color: #14532d; }

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
          <h1>إدارة عملاء واتساب (Seerk Pro Max) 💬</h1>
          <p>إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين بكل إحترافية</p>
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
              <span>{editingId ? 'تعديل العميل' : 'إضافة عميل جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم العميل</label>
              <div className="input-wrapper">
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="مثال: سارة الشمري" required />
              </div>
            </div>

            <div className="input-group">
              <label>رقم الجوال (يبدأ بـ 05 أو 966)</label>
              <div className="input-wrapper">
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="0501234567" required />
              </div>
            </div>

            <div className="input-group">
              <label>حالة الطلب أو العميل</label>
              <div className="input-wrapper">
                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                  <option value="سلة متروكة (Abandoned Cart)">سلة متروكة (Abandoned Cart)</option>
                  <option value="بانتظار الدفع (Pending Payment)">بانتظار الدفع (Pending Payment)</option>
                  <option value="عميل متكرر ومميز (VIP)">عميل متكرر ومميز (VIP)</option>
                  <option value="استفسار عن منتج">استفسار عن منتج</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>قيمة السلة أو الطلب (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={orderValue === '' ? '' : orderValue} onChange={(e) => setOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="320" />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>ملاحظات إضافية</label>
              <div className="input-wrapper">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات حول تواصلك مع العميل..."></textarea>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ العميل في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة ورابط واتساب المباشر */}
        <div className="card">
          <h2 className="card-title">معاينة الرسالة ورابط واتساب المباشر</h2>

          <div className="preview-box">
            <h3>💬 معاينة رسالة المتابعة:</h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '20px', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              {defaultMsg}
            </div>

            <a href={whatsappDirectUrl} target="_blank" rel="noopener noreferrer">
              <button type="button" className="action-btn" style={{ width: '100%', marginTop: '0' }}>
                🚀 فتح محادثة واتساب فوراً
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* جدول إدارة العملاء السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم العميل أو الجوال..." 
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
                <th>اسم العميل</th>
                <th>رقم الجوال</th>
                <th>الحالة</th>
                <th>قيمة السلة</th>
                <th>الملاحظات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد جهات اتصال مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.clientName}</td>
                    <td>{item.phoneNumber}</td>
                    <td><span style={{ background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>{item.orderStatus}</span></td>
                    <td>{item.orderValue} ر.س</td>
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
