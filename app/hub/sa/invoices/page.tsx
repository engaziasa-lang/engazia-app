'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  storeName: string;
  vatNumber: string;
  totalAmount: number;
  vatAmount: number;
  date: string;
}

export default function ZatcaInvoiceGeneratorSA() {
  const [storeName, setStoreName] = useState<string>('متجر إنجازيا');
  const [vatNumber, setVatNumber] = useState<string>('300000000000003');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-001');
  const [customerName, setCustomerName] = useState<string>('محمد القحطاني');
  const [totalAmount, setTotalAmount] = useState<number | ''>(575);

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_zatca_invoices_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: InvoiceItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_zatca_invoices_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const amt = typeof totalAmount === 'number' ? totalAmount : 0;
  const vatAmt = amt - (amt / 1.15); // استخراج ضريبة 15% الشاملة

  // محاكاة رابط QR Code المعتمد لزاتكا
  const currentDate = new Date().toISOString().slice(0, 10);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `المتجر: ${storeName} | الرقم الضريبي: ${vatNumber} \vert{} التاريخ: ${currentDate} | الإجمالي: ${amt} ر.س \vert{} الضريبة: ${vatAmt.toFixed(2)} ر.س`
  )}`;

  const handleClearForm = () => {
    setInvoiceNumber('INV-2026-002');
    setCustomerName('');
    setTotalAmount('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 فواتير). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!invoiceNumber.trim() || amt <= 0) {
      alert('الرجاء إدخال رقم الفواتير والمبلغ الإجمالي بشكل صحيح.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        invoiceNumber,
        customerName: customerName.trim() || 'عميل نقدي',
        storeName,
        vatNumber,
        totalAmount: amt,
        vatAmount: Number(vatAmt.toFixed(2)),
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث الفاتورة بنجاح!');
    } else {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        invoiceNumber,
        customerName: customerName.trim() || 'عميل نقدي',
        storeName,
        vatNumber,
        totalAmount: amt,
        vatAmount: Number(vatAmt.toFixed(2)),
        date: currentDate,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الفاتورة إلى سجل النظام بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: InvoiceItem) => {
    setStoreName(item.storeName);
    setVatNumber(item.vatNumber);
    setInvoiceNumber(item.invoiceNumber);
    setCustomerName(item.customerName);
    setTotalAmount(item.totalAmount);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد فواتير لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,InvoiceNo,Customer,Total,VAT,Date\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.invoiceNumber},${row.customerName},${row.totalAmount},${row.vatAmount},${row.date}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_zatca_invoices.csv");
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
            alert('✨ تم استيراد الفواتير بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
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
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

        .invoice-preview { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; }
        .invoice-header-text { font-weight: 900; font-size: 16px; color: #0f172a; margin-bottom: 5px; }
        .invoice-sub { font-size: 12px; color: #64748b; margin-bottom: 15px; }
        .qr-box { margin: 15px auto; width: 120px; height: 120px; background: #fff; padding: 5px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; }
        .qr-box img { width: 110px; height: 110px; }

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
          <h1>مولد الفواتير الإلكترونية (متوافق مع زاتكا) 🧾</h1>
          <p>أنشئ فواتير مبسطة برمز الاستجابة السريعة (QR Code) المتوافقة مع متطلبات هيئة الزكاة والضريبة</p>
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
              <span>{editingId ? 'تعديل الفاتورة' : 'إصدار فاتورة جديدة'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المتجر</label>
              <div className="input-wrapper">
                <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>الرقم الضريبي للمتجر (15 رقماً)</label>
              <div className="input-wrapper">
                <input type="text" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>رقم الفاتورة المرجعي</label>
              <div className="input-wrapper">
                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>اسم العميل</label>
              <div className="input-wrapper">
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: محمد القحطاني" />
              </div>
            </div>

            <div className="input-group">
              <label>المبلغ الإجمالي الشامل للضريبة (ر.س)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={totalAmount === '' ? '' : totalAmount} onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="575" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ وإضافة الفاتورة للسجل'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة ورمز QR */}
        <div className="card">
          <h2 className="card-title">معاينة الفاتورة ورمز زاتكا (QR)</h2>

          <div className="invoice-preview">
            <div className="invoice-header-text">{storeName}</div>
            <div className="invoice-sub">الرقم الضريبي: {vatNumber}</div>
            
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', margin: '10px 0' }}>
              فاتورة مبيعات مبسطة - #{invoiceNumber}
            </div>

            <div className="qr-box">
              <img src={qrCodeUrl} alt="Zatca QR Code" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, padding: '5px 10px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
              <span>ضريبة القيمة المضافة (15%):</span>
              <span style={{ color: '#047857' }}>{vatAmt.toFixed(2)} ر.س</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 900, padding: '8px 10px', background: '#047857', color: '#fff', borderRadius: '6px', marginTop: '8px' }}>
              <span>المبلغ الإجمالي الشامل:</span>
              <span>{amt} ر.س</span>
            </div>
          </div>
        </div>
      </div>

      {/* جدول إدارة الفواتير السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث برقم الفاتورة أو العميل..." 
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
                <th>رقم الفاتورة</th>
                <th>اسم العميل</th>
                <th>المبلغ الإجمالي</th>
                <th>الضريبة (15%)</th>
                <th>التاريخ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد فواتير مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.invoiceNumber}</td>
                    <td>{item.customerName}</td>
                    <td>{item.totalAmount} ر.س</td>
                    <td style={{ color: '#047857' }}>{item.vatAmount} ر.س</td>
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
