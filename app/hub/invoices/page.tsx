'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function InvoiceGenerator() {
  const [storeName, setStoreName] = useState('متجرك الإلكتروني');
  const [storeId, setStoreId] = useState('300000000000003'); // رقم ضريبي افتراضي
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');

  // قائمة المنتجات داخل الفاتورة
  const [items, setItems] = useState([
    { id: 1, name: 'منتج رقم 1', quantity: 1, price: 150 }
  ]);

  const addItem = () => {
    setItems([...items, { id: items.length + 1, name: '', quantity: 1, price: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // الحسابات المالية
  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);
  const tax = subtotal * 0.15; // ضريبة القيمة المضافة 15%
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
        @media print {
          body { background: #ffffff !important; }
          .no-print { display: none !important; }
          .print-area { border: none !important; box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 70px; }
        
        .header { max-width: 900px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }

        .action-btns { display: flex; gap: 10px; }
        .print-btn { background: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
        .print-btn:hover { background: #4338ca; }

        .tool-title { text-align: center; margin-bottom: 30px; }
        .tool-title h1 { font-size: 30px; font-weight: 900; color: #0f172a; margin-bottom: 8px; }
        .tool-title span { color: #4f46e5; }
        
        /* هيكل الفاتورة */
        .invoice-card { background: #ffffff; border-radius: 16px; padding: 40px; max-width: 900px; margin: 0 auto; border: 1px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        
        .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 25px; margin-bottom: 30px; }
        .store-info input { font-size: 22px; font-weight: 900; color: #0f172a; border: none; border-bottom: 1px dashed transparent; outline: none; width: 100%; background: transparent; }
        .store-info input:focus { border-bottom-color: #4f46e5; }
        .store-info p { color: #64748b; font-size: 14px; margin-top: 5px; }
        
        .invoice-meta { text-align: left; }
        .invoice-meta h2 { font-size: 22px; font-weight: 900; color: #4f46e5; margin-bottom: 5px; }
        .invoice-meta input { font-size: 14px; font-weight: 700; color: #475569; border: 1px solid #e2e8f0; padding: 4px 8px; border-radius: 6px; text-align: left; width: 130px; }

        .client-section { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-weight: 700; color: #0f172a; background: #ffffff; outline: none; }
        .form-group input:focus { border-color: #4f46e5; }

        /* جدول المنتجات */
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .items-table th { background: #f1f5f9; color: #334155; font-size: 14px; font-weight: 800; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; }
        .items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .items-table input { width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; font-weight: 700; background: #fff; outline: none; }
        .items-table input:focus { border-color: #4f46e5; }
        
        .del-btn { background: #fee2e2; color: #dc2626; border: none; width: 35px; height: 35px; border-radius: 6px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .del-btn:hover { background: #fecaca; }

        .add-row-btn { background: #e0e7ff; color: #4f46e5; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: background 0.2s; margin-bottom: 30px; }
        .add-row-btn:hover { background: #c7d2fe; }

        /* ملخص الحسابات */
        .summary-box { display: flex; justify-content: flex-end; }
        .summary-table { width: 300px; background: #f8fafc; border-radius: 10px; padding: 15px; border: 1px solid #e2e8f0; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; font-weight: 700; color: #475569; }
        .summary-row.total { border-top: 2px solid #cbd5e1; padding-top: 10px; margin-top: 10px; font-size: 18px; font-weight: 900; color: #0f172a; }

        @media(max-width: 768px) { .client-section { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header no-print">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
        <div className="action-btns">
          <button onClick={handlePrint} className="print-btn">
            🖨️ طباعة أو حفظ PDF
          </button>
        </div>
      </div>

      <div className="tool-title no-print">
        <h1>مولد <span>الفواتير وسندات القبض</span></h1>
        <p>أنشئ فواتير مبيعات نظامية واحترافية وجهزها للطباعة أو الإرسال الفوري للعملاء.</p>
      </div>

      <div className="invoice-card print-area">
        {/* رأس الفاتورة */}
        <div className="invoice-header">
          <div className="store-info" style={{ width: '50%' }}>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="اسم متجرك" />
            <p>الرقم الضريبي: <input type="text" value={storeId} onChange={(e) => setStoreId(e.target.value)} style={{ display: 'inline', width: '150px', border: 'none', background: 'transparent', fontWeight: 'bold' }} /></p>
          </div>
          <div className="invoice-meta">
            <h2>فاتورة مبيعات</h2>
            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '3px' }}>رقم الفاتورة:</label>
              <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '3px' }}>التاريخ:</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} style={{ width: '130px' }} />
            </div>
          </div>
        </div>

        {/* معلومات العميل */}
        <div className="client-section">
          <div className="form-group">
            <label>اسم العميل الكريم</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: محمد عبد الله" />
          </div>
          <div className="form-group">
            <label>رقم الجوال / التواصل</label>
            <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="مثال: 0500000000" />
          </div>
        </div>

        {/* جدول المنتجات */}
        <table className="items-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>وصف المنتج أو الخدمة</th>
              <th style={{ width: '15%' }}>الكمية</th>
              <th style={{ width: '20%' }}>السعر (ر.س)</th>
              <th style={{ width: '15%' }}>الإجمالي</th>
              <th style={{ width: '5%' }} className="no-print"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input type="text" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} placeholder="اسم المنتج" />
                </td>
                <td>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} />
                </td>
                <td>
                  <input type="number" min="0" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} />
                </td>
                <td style={{ fontWeight: '800', color: '#0f172a' }} dir="ltr">
                  {(Number(item.quantity) * Number(item.price)).toFixed(2)} ر.س
                </td>
                <td className="no-print">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(index)} className="del-btn">✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem} className="add-row-btn no-print">+ إضافة منتج آخر</button>

        {/* ملخص المبالغ والضريبة */}
        <div className="summary-box">
          <div className="summary-table">
            <div className="summary-row">
              <span>المجموع الفرعي:</span>
              <span dir="ltr">{subtotal.toFixed(2)} ر.س</span>
            </div>
            <div className="summary-row">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span dir="ltr">{tax.toFixed(2)} ر.س</span>
            </div>
            <div className="summary-row total">
              <span>الإجمالي النهائي:</span>
              <span dir="ltr">{total.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
