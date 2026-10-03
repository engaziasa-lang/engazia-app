'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface FeeItem {
  id: string;
  gatewayName: string;
  orderAmount: number;
  paymentType: string;
  netReceived: number;
  totalFee: number;
}

export default function GatewayFeesCalculatorSA() {
  const [orderAmount, setOrderAmount] = useState<number | ''>(350);
  const [gatewayType, setGatewayType] = useState<string>('mada'); // mada, tabby_tamara, visa_master
  const [customPercent, setCustomPercent] = useState<number | ''>(1.0);
  const [customFixed, setCustomFixed] = useState<number | ''>(1.0);

  const [items, setItems] = useState<FeeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_gateway_fees_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: FeeItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_gateway_fees_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  // حساب نسب الرسوم بناءً على البوابة المختارة في السوق السعودي
  let feePercent = 1.0;
  let feeFixed = 1.0;
  let gwNameLabel = 'مدى (Mada)';

  if (gatewayType === 'mada') {
    feePercent = 1.0;
    feeFixed = 1.0;
    gwNameLabel = 'مدى (Mada)';
  } else if (gatewayType === 'tabby_tamara') {
    feePercent = 2.5;
    feeFixed = 2.0;
    gwNameLabel = 'التقسيط (تابي / تمارا)';
  } else if (gatewayType === 'visa_master') {
    feePercent = 2.2;
    feeFixed = 1.0;
    gwNameLabel = 'فيزا / ماستركارد (Visa/Master)';
  } else if (gatewayType === 'custom') {
    feePercent = typeof customPercent === 'number' ? customPercent : 0;
    feeFixed = typeof customFixed === 'number' ? customFixed : 0;
    gwNameLabel = 'بوابة مخصصة';
  }

  const amt = typeof orderAmount === 'number' ? orderAmount : 0;

  // الحساب الفعلي: (المبلغ * النسب%) + المبلغ الثابت + ضريبة القيمة المضافة 15% على العمولة
  const baseFee = (amt * (feePercent / 100)) + feeFixed;
  const totalFeeWithVat = baseFee * 1.15; // إضافة ضريبة 15% على رسوم البوابة
  const netReceived = Math.max(0, amt - totalFeeWithVat);

  const handleClearForm = () => {
    setOrderAmount('');
    setGatewayType('mada');
    setCustomPercent(1.0);
    setCustomFixed(1.0);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 عمليات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (amt <= 0) {
      alert('الرجاء إدخال مبلغ طلب صحيح.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        gatewayName: gwNameLabel,
        orderAmount: amt,
        paymentType: gatewayType,
        netReceived: Number(netReceived.toFixed(2)),
        totalFee: Number(totalFeeWithVat.toFixed(2))
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السجل بنجاح!');
    } else {
      const newItem: FeeItem = {
        id: Date.now().toString(),
        gatewayName: gwNameLabel,
        orderAmount: amt,
        paymentType: gatewayType,
        netReceived: Number(netReceived.toFixed(2)),
        totalFee: Number(totalFeeWithVat.toFixed(2))
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة العملية إلى الجدول بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: FeeItem) => {
    setOrderAmount(item.orderAmount);
    setGatewayType(item.paymentType);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,GatewayName,OrderAmount,TotalFee,NetReceived\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.gatewayName},${row.orderAmount},${row.totalFee},${row.netReceived}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_gateway_fees.csv");
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
            alert('✨ تم استيراد البيانات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => item.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()));

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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value { font-size: 26px; color: #ffffff; }

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
          <h1>حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى) 💳</h1>
          <p>احسب بدقة عمولات وبوابات الدفع المحلية مع رسوم الضريبة (15%) على العمولة وتأثيرها على حسابك</p>
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
              <span>{editingId ? 'تعديل السجل' : 'حساب رسوم جديدة'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح وتفريغ الحقول تماماً">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>قيمة طلب العميل الإجمالية</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={orderAmount === '' ? '' : orderAmount} onChange={(e) => setOrderAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="350" required />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>اختر بوابة الدفع أو الخدمة</label>
              <div className="input-wrapper">
                <select value={gatewayType} onChange={(e) => setGatewayType(e.target.value)}>
                  <option value="mada">مدى (Mada) - (تقريبي 1% + 1 ريال)</option>
                  <option value="visa_master">فيزا / ماستركارد (Visa/Master) - (تقريبي 2.2% + 1 ريال)</option>
                  <option value="tabby_tamara">التقسيط (تابي / تمارا) - (تقريبي 2.5% + 2 ريال)</option>
                  <option value="custom">بوابة مخصصة (تحديد يدوي)</option>
                </select>
              </div>
            </div>

            {gatewayType === 'custom' && (
              <>
                <div className="input-group">
                  <label>النسبة المئوية للعمولة (%)</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.1" min="0" value={customPercent === '' ? '' : customPercent} onChange={(e) => setCustomPercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1.5" />
                    <span className="currency-tag">%</span>
                  </div>
                </div>
                <div className="input-group">
                  <label>المبلغ الثابت للعمولة (ر.س)</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.1" min="0" value={customFixed === '' ? '' : customFixed} onChange={(e) => setCustomFixed(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1.0" />
                    <span className="currency-tag">ر.س</span>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ العملية في الجدول'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">تحليل الرسوم الفوري</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">المبلغ الصافي الذي يدخل لحسابك البنكي</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>بعد خصم عمولة البوابة وضريبة 15% عليها</div>
            </div>
            <div className="result-value">
              {netReceived.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">إجمالي الرسوم المقتطعة (شاملة الضريبة)</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{totalFeeWithVat.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box">
            <span className="result-label">النسبة المؤثرة الفعلية من قيمة الطلب</span>
            <span className="result-value" style={{ color: '#d97706' }}>{amt > 0 ? ((totalFeeWithVat / amt) * 100).toFixed(2) : 0}%</span>
          </div>
        </div>
      </div>

      {/* جدول إدارة البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث في السجلات المحفوظة..." 
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
                <th>بوابة الدفع</th>
                <th>قيمة الطلب</th>
                <th>الرسوم (شاملة الضريبة)</th>
                <th>المبلغ الصافي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سجلات بوابات دفع مسجلة في الجدول حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.gatewayName}</td>
                    <td>{item.orderAmount} ر.س</td>
                    <td style={{ color: '#dc2626' }}>{item.totalFee} ر.س</td>
                    <td style={{ color: '#047857', fontWeight: 900 }}>{item.netReceived} ر.س</td>
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
