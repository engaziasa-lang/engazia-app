'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppToolPage() {
  const [customerName, setCustomerName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [whatsappResult, setWhatsappResult] = useState('');

  const generateMsg = () => {
    const msg = `مرحباً بك يا ${customerName || 'عالمنا الكريم'}، بخصوص طلبك رقم (${orderNumber || '---'}): يسعدنا خدمتك وتأكيد تفاصيل الشحن والتوصيل عبر منصة إنجازيا.`;
    setWhatsappResult(msg);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '30px', border: '1px solid #cbd5e1' }}>
        <Link href="/hub" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>← العودة للوحة الرئيسية</Link>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '20px 0 10px' }}>💬 منظم وقوالب محادثات واتساب</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>أنشئ رسائل تسويقية احترافية لعملائك على واتساب بضغطة زر.</p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>اسم العميل</label>
          <input type="text" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} placeholder="مثال: أحمد" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>رقم الطلب</label>
          <input type="text" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} placeholder="مثال: #1024" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        </div>

        <button onClick={generateMsg} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>توليد ونسخ الرسالة</button>

        {whatsappResult && (
          <div style={{ marginTop: '20px', background: '#eff6ff', padding: '15px', borderRadius: '8px', color: '#1e40af' }}>
            <strong>النتيجة الجاهزة:</strong>
            <p style={{ marginTop: '8px' }}>{whatsappResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}
