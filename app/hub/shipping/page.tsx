'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ShippingManager() {
  const [shipments, setShipments] = useState([
    { id: 1, customer: 'سارة خالد', trackingNo: 'TRK-98421', company: 'أرامكس', status: 'خرجت للتوصيل' },
    { id: 2, customer: 'فيصل العتيبي', trackingNo: 'TRK-33210', company: 'سمسا', status: 'تم التوصيل' },
  ]);

  const [customer, setCustomer] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [company, setCompany] = useState('أرامكس');
  const [status, setStatus] = useState('قيد المعالجة والتجهيز');

  const addShipment = () => {
    if (!customer || !trackingNo) {
      alert('الرجاء إدخال اسم العميل ورقم البوليصة.');
      return;
    }
    const newShipment = {
      id: Date.now(),
      customer,
      trackingNo,
      company,
      status
    };
    setShipments([newShipment, ...shipments]);
    setCustomer('');
    setTrackingNo('');
  };

  const removeShipment = (id: number) => {
    setShipments(shipments.filter(item => item.id !== id));
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 70px; }
        
        .header { max-width: 1000px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 40px; }
        .tool-title h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 16px; }

        .main-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #4f46e5; background: #ffffff; }

        .add-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; }
        .add-btn:hover { background: #4338ca; }

        .shipment-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .shipment-info h3 { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .shipment-info p { font-size: 13px; color: #64748b; font-weight: 600; }
        
        .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; background: #e0e7ff; color: #4f46e5; }
        
        .del-btn { background: #fee2e2; color: #dc2626; border: none; width: 30px; height: 30px; border-radius: 6px; cursor: pointer; font-weight: 900; }
        .del-btn:hover { background: #fecaca; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>مدير تتبع <span>الشحنات والتوصيل</span></h1>
        <p>تابع حالات شحنات عملائك وأرقام البوليصات لحل استفساراتهم اليومية بسرعة وسهولة.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>📦 تسجيل شحنة جديدة</h2>
          
          <div className="input-group">
            <label>اسم العميل</label>
            <div className="input-wrapper">
              <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="مثال: خالد عبد العزيز" />
            </div>
          </div>

          <div className="input-group">
            <label>رقم بوليصة الشحن</label>
            <div className="input-wrapper">
              <input type="text" value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="مثال: TRK-12345" />
            </div>
          </div>

          <div className="input-group">
            <label>شركة الشحن</label>
            <div className="input-wrapper">
              <select value={company} onChange={(e) => setCompany(e.target.value)}>
                <option value="أرامكس">أرامكس Aramex</option>
                <option value="سمسا">سمسا SMSA</option>
                <option value="ناجل">ناجل Naqel</option>
                <option value="SPL">البريد السعودي SPL</option>
                <option value="أخرى">شركة أخرى</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>حالة الشحنة</label>
            <div className="input-wrapper">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="قيد المعالجة والتجهيز">قيد المعالجة والتجهيز</option>
                <option value="خرجت للتوصيل">خرجت للتوصيل مع مندوب التوصيل</option>
                <option value="تم التوصيل بنجاح">تم التوصيل بنجاح</option>
                <option value="تأخرت / توقفت">تأخرت / توقفت مؤقتاً</option>
              </select>
            </div>
          </div>

          <button onClick={addShipment} className="add-btn">حفظ وإضافة للقائمة</button>
        </div>

        <div className="panel">
          <h2>📋 قائمة الشحنات المسجلة</h2>
          
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {shipments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>لا توجد شحنات مسجلة حالياً.</p>
            ) : (
              shipments.map(item => (
                <div key={item.id} className="shipment-card">
                  <div className="shipment-info">
                    <h3>{item.customer}</h3>
                    <p>البوليصة: <strong>{item.trackingNo}</strong> | الشركة: {item.company}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="status-badge">{item.status}</span>
                    <button onClick={() => removeShipment(item.id)} className="del-btn">✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
