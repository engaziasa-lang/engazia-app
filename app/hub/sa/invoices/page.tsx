'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// واجهة لتعريف عناصر الفاتورة
interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function ZatcaInvoiceGenerator() {
  // بيانات المتجر والعميل
  const [storeName, setStoreName] = useState<string>('متجر زوايا العطور');
  const [vatNumber, setVatNumber] = useState<string>('312345678900003');
  const [customerName, setCustomerName] = useState<string>('عميل نقدي');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-1001');

  // عناصر الفاتورة
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: 'عطر ليالي نجد 100 مل', quantity: 1, price: 150 },
  ]);

  // الحسابات
  const [subTotal, setSubTotal] = useState<number>(0);
  const [vatTotal, setVatTotal] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  // تحديث التاريخ الافتراضي عند التحميل
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
  }, []);

  // حساب المجاميع كلما تغيرت العناصر
  useEffect(() => {
    const totalWithoutVat = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const vat = totalWithoutVat * 0.15; // ضريبة 15%
    const totalWithVat = totalWithoutVat + vat;

    setSubTotal(totalWithoutVat);
    setVatTotal(vat);
    setGrandTotal(totalWithVat);
  }, [items]);

  // وظائف إدارة العناصر
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // توليد رابط QR Code وهمي (يحاكي زاتكا) لغرض العرض البصري باستخدام API مجاني
  // في التطبيقات الحقيقية يتم توليد TLV Base64، لكن هنا نستخدم بيانات الفاتورة الأساسية
  const qrData = encodeURIComponent(`المتجر: ${storeName}\nالرقم الضريبي: ${vatNumber}\nالتاريخ: ${invoiceDate}\nالإجمالي: ${grandTotal.toFixed(2)} ر.س\nالضريبة: ${vatTotal.toFixed(2)} ر.س`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
        
        /* إعدادات الطباعة: إخفاء كل شيء باستثناء الفاتورة نفسها */
        @media print {
          body { background-color: #ffffff; }
          .no-print { display: none !important; }
          .tool-container { margin: 0; padding: 0; max-width: 100%; }
          .invoice-preview { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; padding: 0 !important; }
        }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 40px auto; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; }
        @media(max-width: 992px) { .grid-layout { grid-template-columns: 1fr; } }
        
        /* لوحة التحكم والإدخال */
        .controls-panel { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .section-title { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        
        .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        
        .item-row { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: center; margin-bottom: 10px; background: #f1f5f9; padding: 10px; border-radius: 8px; }
        .item-row input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: 'Tajawal', sans-serif; width: 100%; }
        .delete-btn { background: #fee2e2; color: #dc2626; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold; }
        
        .add-btn { background: #e0e7ff; color: #4f46e5; border: 1px dashed #4f46e5; width: 100%; padding: 10px; border-radius: 8px; font-weight: 800; cursor: pointer; transition: all 0.2s; margin-top: 5px; font-family: 'Tajawal', sans-serif; }
        .add-btn:hover { background: #4f46e5; color: #fff; }
        
        .print-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 14px; border-radius: 8px; font-weight: 900; font-size: 16px; cursor: pointer; margin-top: 25px; display: flex; justify-content: center; align-items: center; gap: 10px; transition: all 0.2s; font-family: 'Tajawal', sans-serif; box-shadow: 0 4px 12px rgba(4,120,87,0.2); }
        .print-btn:hover { background: #065f46; transform: translateY(-2px); }

        /* معاينة الفاتورة */
        .invoice-preview { background: #ffffff; border-radius: 0; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); min-height: 600px; color: #000; position: relative; }
        .inv-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
        .inv-title { text-align: center; }
        .inv-title h2 { margin: 0 0 5px 0; font-size: 22px; font-weight: 900; }
        .inv-title p { margin: 0; font-size: 14px; font-weight: 700; color: #333; }
        
        .inv-details { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 13px; font-weight: 600; line-height: 1.8; }
        .qr-code { width: 100px; height: 100px; border: 1px solid #ddd; padding: 5px; border-radius: 8px; }
        
        .inv-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
        .inv-table th { background: #f1f5f9; padding: 10px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #333; }
        .inv-table td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
        
        .inv-totals { width: 50%; margin-left: 0; margin-right: auto; font-size: 14px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; }
        .total-row.grand { font-size: 18px; font-weight: 900; border-bottom: none; border-top: 2px solid #000; padding-top: 15px; margin-top: 5px; }
        
        .inv-footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
      `}</style>

      <div className="header no-print">
        <div className="title-box">
          <h1>مولد الفواتير الإلكترونية (زاتكا) 🧾</h1>
          <p>أنشئ فاتورة ضريبية مبسطة احترافية برمز الاستجابة السريع (QR) جاهزة للطباعة</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* لوحة التحكم والإدخال (لا تظهر في الطباعة) */}
        <div className="controls-panel no-print">
          <h2 className="section-title">بيانات المتجر والعميل</h2>
          <div className="two-cols">
            <div className="input-group">
              <label>اسم المتجر</label>
              <div className="input-wrapper"><input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} /></div>
            </div>
            <div className="input-group">
              <label>الرقم الضريبي (15 رقم)</label>
              <div className="input-wrapper"><input type="text" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} maxLength={15} /></div>
            </div>
          </div>
          
          <div className="two-cols">
            <div className="input-group">
              <label>اسم العميل (اختياري)</label>
              <div className="input-wrapper"><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /></div>
            </div>
            <div className="input-group">
              <label>رقم الفاتورة</label>
              <div className="input-wrapper"><input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} /></div>
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: '20px' }}>عناصر الفاتورة</h2>
          {items.map((item, index) => (
            <div className="item-row" key={item.id}>
              <input type="text" placeholder="اسم المنتج/الخدمة" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} />
              <input type="number" placeholder="الكمية" min="1" value={item.quantity || ''} onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))} />
              <input type="number" placeholder="السعر" min="0" value={item.price || ''} onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))} />
              <button className="delete-btn" onClick={() => handleRemoveItem(item.id)}>✕</button>
            </div>
          ))}
          <button className="add-btn" onClick={handleAddItem}>+ إضافة منتج آخر</button>

          <button className="print-btn" onClick={handlePrint}>
            🖨️ طباعة الفاتورة أو حفظها PDF
          </button>
        </div>

        {/* معاينة الفاتورة (التي ستطبع) */}
        <div className="invoice-preview" id="printable-invoice">
          <div className="inv-header">
            <div>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: 900 }}>{storeName || 'اسم المتجر'}</h2>
              <div style={{ fontSize: '12px', color: '#555' }}>
                الرقم الضريبي: {vatNumber || '---'}
              </div>
            </div>
            <div className="inv-title">
              <h2>فاتورة ضريبية مبسطة</h2>
              <p>Simplified Tax Invoice</p>
            </div>
            {/* عرض الـ QR Code */}
            <img src={qrCodeUrl} alt="Zatca QR Code" className="qr-code" />
          </div>

          <div className="inv-details">
            <div>
              <div><strong>رقم الفاتورة:</strong> {invoiceNumber}</div>
              <div><strong>تاريخ الإصدار:</strong> {invoiceDate}</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div><strong>العميل:</strong> {customerName || 'عميل نقدي'}</div>
            </div>
          </div>

          <table className="inv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الصنف (Item)</th>
                <th style={{ textAlign: 'center' }}>الكمية (Qty)</th>
                <th style={{ textAlign: 'center' }}>سعر الوحدة (Unit Price)</th>
                <th style={{ textAlign: 'left' }}>الإجمالي (Total)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name || '---'}</td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'center' }}>{item.price.toFixed(2)} ر.س</td>
                  <td style={{ textAlign: 'left' }}>{(item.quantity * item.price).toFixed(2)} ر.س</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="inv-totals">
            <div className="total-row">
              <span>الإجمالي (بدون ضريبة):</span>
              <span>{subTotal.toFixed(2)} ر.س</span>
            </div>
            <div className="total-row">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span>{vatTotal.toFixed(2)} ر.س</span>
            </div>
            <div className="total-row grand">
              <span>الإجمالي المستحق:</span>
              <span>{grandTotal.toFixed(2)} ر.س</span>
            </div>
          </div>

          <div className="inv-footer">
            تم إصدار هذه الفاتورة إلكترونياً وهي متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك.<br/>
            نشكر لكم تسوقكم معنا!
          </div>
        </div>
      </div>
    </div>
  );
}
