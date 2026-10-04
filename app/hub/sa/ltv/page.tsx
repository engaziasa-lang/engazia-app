'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LtvCalculatorSA() {
  const [segmentName, setSegmentName] = useState('العملاء الدائمين (VIP)');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>(300);
  const [purchaseFrequency, setPurchaseFrequency] = useState<number | ''>(3);
  const [customerLifespan, setCustomerLifespan] = useState<number | ''>(2);

  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_ltv_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveToLocalStorage = (newItems: any[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ltv_items', JSON.stringify(newItems));
  };

  const orderVal = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const freq = typeof purchaseFrequency === 'number' ? purchaseFrequency : 0;
  const lifespan = typeof customerLifespan === 'number' ? customerLifespan : 0;
  const ltvValue = orderVal * freq * lifespan;

  const handleClear = () => {
    setSegmentName('');
    setAvgOrderValue('');
    setPurchaseFrequency('');
    setCustomerLifespan('');
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!segmentName || orderVal <= 0) {
      alert('الرجاء التأكد من تعبئة البيانات بشكل صحيح.');
      return;
    }

    const newItem = {
      id: editingId || Date.now().toString(),
      segmentName,
      avgOrderValue: orderVal,
      purchaseFrequency: freq,
      customerLifespan: lifespan,
      ltvValue,
      createdAt: new Date().toLocaleString('ar-SA')
    };

    if (editingId) {
      saveToLocalStorage(items.map(i => i.id === editingId ? newItem : i));
      setEditingId(null);
      alert('✨ تم التحديث بنجاح!');
    } else {
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت الإضافة بنجاح!');
    }
    handleClear();
  };

  const handleEdit = (item: any) => {
    setSegmentName(item.segmentName);
    setAvgOrderValue(item.avgOrderValue);
    setPurchaseFrequency(item.purchaseFrequency);
    setCustomerLifespan(item.customerLifespan);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من الحذف؟')) {
      saveToLocalStorage(items.filter(i => i.id !== id));
    }
  };

  const filteredItems = items.filter(i => i.segmentName.toLowerCase().includes(searchQuery.toLowerCase()));
  const avgLtv = items.length > 0 ? items.reduce((acc, curr) => acc + curr.ltvValue, 0) / items.length : 0;

  return (
    <div style={{ direction: 'rtl', padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Tajawal, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>حاسبة القيمة الدائمة للعميل (LTV) 🎯</h1>
        <Link href="/hub/sa" style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: '#334155', fontWeight: 700 }}>← عودة للمنصة</Link>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>شريحة العملاء</label>
            <input type="text" value={segmentName} onChange={e => setSegmentName(e.target.value)} placeholder="مثال: العملاء المميزين" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>متوسط قيمة الطلب</label>
              <input type="number" value={avgOrderValue} onChange={e => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="300" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>الشراء السنوي المتكرر</label>
              <input type="number" value={purchaseFrequency} onChange={e => setPurchaseFrequency(e.target.value === '' ? '' : Number(e.target.value))} placeholder="3" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#475569' }}>عمر العميل (سنوات)</label>
              <input type="number" value={customerLifespan} onChange={e => setCustomerLifespan(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold', color: '#047857' }}>
            القيمة الدائمة الناتجة (LTV): {ltvValue.toFixed(2)} ر.س
          </div>

          <button type="submit" style={{ background: '#047857', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', width: '100%' }}>
            {editingId ? 'حفظ التعديلات' : 'حفظ في السجل'}
          </button>
        </form>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <input type="text" placeholder="🔍 بحث..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '8px 12px', marginBottom: '15px', width: '100%', maxWidth: '250px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '10px' }}>الشريحة</th>
                <th style={{ padding: '10px' }}>متوسط الطلب</th>
                <th style={{ padding: '10px' }}>التكرار السنوي</th>
                <th style={{ padding: '10px' }}>العمر (سنوات)</th>
                <th style={{ padding: '10px' }}>LTV</th>
                <th style={{ padding: '10px' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>لا توجد بيانات مسجلة.</td></tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px', fontWeight: 800 }}>{item.segmentName}</td>
                    <td style={{ padding: '10px' }}>{item.avgOrderValue} ر.س</td>
                    <td style={{ padding: '10px' }}>{item.purchaseFrequency}</td>
                    <td style={{ padding: '10px' }}>{item.customerLifespan}</td>
                    <td style={{ padding: '10px', fontWeight: 900, color: '#0284c7' }}>{item.ltvValue} ر.س</td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => handleEdit(item)} style={{ background: '#e0f2fe', border: 'none', padding: '4px 8px', borderRadius: '4px', marginLeft: '5px', cursor: 'pointer', color: '#0369a1', fontWeight: 700 }}>✏️</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: '#991b1b', fontWeight: 700 }}>❌</button>
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
