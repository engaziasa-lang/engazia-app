'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface FeeItem {
  id: string;
  gatewayName: string;
  orderAmount: number;
  feePercent: number;
  feeFixed: number;
  netReceived: number;
  totalFee: number;
  createdAt?: string;
}

export default function GatewayFeesCalculatorSA() {
  // الحقول أصبحت كلها قابلة للتعديل
  const [orderAmount, setOrderAmount] = useState<number | ''>(350);
  const [gatewayName, setGatewayName] = useState<string>('مدى (Mada)');
  const [feePercent, setFeePercent] = useState<number | ''>(1.0);
  const [feeFixed, setFeeFixed] = useState<number | ''>(1.0);

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

  // تحديث الحقول بناءً على القائمة المنسدلة (لتسريع الإدخال مع السماح بالتعديل اليدوي)
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'mada') {
      setGatewayName('مدى (Mada)');
      setFeePercent(1.0);
      setFeeFixed(1.0);
    } else if (val === 'visa') {
      setGatewayName('فيزا / ماستركارد (Visa/Master)');
      setFeePercent(2.2);
      setFeeFixed(1.0);
    } else if (val === 'tabby') {
      setGatewayName('التقسيط (تابي / تمارا)');
      setFeePercent(2.5);
      setFeeFixed(2.0);
    } else if (val === 'custom') {
      setGatewayName('بوابة مخصصة');
      setFeePercent('');
      setFeeFixed('');
    }
  };

  const amt = typeof orderAmount === 'number' ? orderAmount : 0;
  const pct = typeof feePercent === 'number' ? feePercent : 0;
  const fxd = typeof feeFixed === 'number' ? feeFixed : 0;

  // الحساب الفعلي: (المبلغ * النسب%) + المبلغ الثابت + ضريبة القيمة المضافة 15% على العمولة
  const baseFee = (amt * (pct / 100)) + fxd;
  const totalFeeWithVat = baseFee > 0 ? baseFee * 1.15 : 0; // إضافة ضريبة 15% على رسوم البوابة
  const netReceived = Math.max(0, amt - totalFeeWithVat);

  const handleClearForm = () => {
    setOrderAmount('');
    setGatewayName('مدى (Mada)');
    setFeePercent(1.0);
    setFeeFixed(1.0);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 عمليات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (amt <= 0 || !gatewayName.trim()) {
      alert('الرجاء إدخال مبلغ طلب صحيح واسم للبوابة.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        gatewayName,
        orderAmount: amt,
        feePercent: pct,
        feeFixed: fxd,
        netReceived: Number(netReceived.toFixed(2)),
        totalFee: Number(totalFeeWithVat.toFixed(2)),
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السجل بنجاح!');
    } else {
      const newItem: FeeItem = {
        id: Date.now().toString(),
        gatewayName,
        orderAmount: amt,
        feePercent: pct,
        feeFixed: fxd,
        netReceived: Number(netReceived.toFixed(2)),
        totalFee: Number(totalFeeWithVat.toFixed(2)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة العملية إلى الجدول بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: FeeItem) => {
    setGatewayName(item.gatewayName);
    setOrderAmount(item.orderAmount);
    setFeePercent(item.feePercent);
    setFeeFixed(item.feeFixed);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const totalOrderAmount = items.reduce((acc, curr) => acc + curr.orderAmount, 0);
    const totalFees = items.reduce((acc, curr) => acc + curr.totalFee, 0);
    const totalNetReceived = items.reduce((acc, curr) => acc + curr.netReceived, 0);
    const overallFeePercent = totalOrderAmount > 0 ? (totalFees / totalOrderAmount) * 100 : 0;

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
                <th>بوابة الدفع</th>
                <th>التاريخ والوقت</th>
                <th>قيمة الطلب</th>
                <th>الرسوم (شاملة الضريبة)</th>
                <th>نسبة الاستقطاع الفعلي</th>
                <th>المبلغ الصافي</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      const feePct = row.orderAmount > 0 ? (row.totalFee / row.orderAmount) * 100 : 0;
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.gatewayName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.orderAmount}</td>
          <td>${row.totalFee}</td>
          <td>${feePct.toFixed(2)}%</td>
          <td>${row.netReceived}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="3">الإجمالي الكلي / المتوسط</td>
                <td>${totalOrderAmount.toFixed(2)}</td>
                <td>${totalFees.toFixed(2)}</td>
                <td>${overallFeePercent.toFixed(2)}%</td>
                <td>${totalNetReceived.toFixed(2)}</td>
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
    link.setAttribute("download", "seerk_gateway_fees.xls");
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

  // حساب المجاميع للجدول السفلي في الواجهة
  const totalOrderAmount = filteredItems.reduce((acc, curr) => acc + curr.orderAmount, 0);
  const totalFees = filteredItems.reduce((acc, curr) => acc + curr.totalFee, 0);
  const totalNetReceived = filteredItems.reduce((acc, curr) => acc + curr.netReceived, 0);
  const overallFeePercent = totalOrderAmount > 0 ? (totalFees / totalOrderAmount) * 100 : 0;

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
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; }
        .primary .result-value, .danger .result-value { font-size: 26px; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 700px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
              <label>اختيار البوابة لملء البيانات التلقائي (اختياري)</label>
              <div className="input-wrapper">
                <select onChange={handlePresetChange} defaultValue="mada">
                  <option value="mada">مدى (Mada) - (1% + 1 ريال)</option>
                  <option value="visa">فيزا / ماستركارد (Visa/Master) - (2.2% + 1 ريال)</option>
                  <option value="tabby">التقسيط (تابي / تمارا) - (2.5% + 2 ريال)</option>
                  <option value="custom">تفريغ الحقول (إدخال يدوي بالكامل)</option>
                </select>
              </div>
            </div>

            {/* الحقول المفتوحة للتعديل في كل الأوقات */}
            <div className="input-group" style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ color: '#0f172a' }}>اسم البوابة (قابل للتعديل)</label>
              <div className="input-wrapper" style={{ marginBottom: '10px' }}>
                <input type="text" value={gatewayName} onChange={(e) => setGatewayName(e.target.value)} placeholder="مثال: أبل باي" required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ color: '#0f172a' }}>النسبة (%)</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={feePercent === '' ? '' : feePercent} onChange={(e) => setFeePercent(e.target.value === '' ? '' : Number(e.target.value))} required />
                    <span className="currency-tag">%</span>
                  </div>
                </div>
                <div>
                  <label style={{ color: '#0f172a' }}>رسوم ثابتة (ر.س)</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={feeFixed === '' ? '' : feeFixed} onChange={(e) => setFeeFixed(e.target.value === '' ? '' : Number(e.target.value))} required />
                    <span className="currency-tag">ر.س</span>
                  </div>
                </div>
              </div>
            </div>

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
                <th>بوابة الدفع والتاريخ</th>
                <th>قيمة الطلب</th>
                <th>الرسوم (شاملة الضريبة)</th>
                <th>نسبة الاستقطاع</th>
                <th>المبلغ الصافي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سجلات بوابات دفع مسجلة في الجدول حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const feePct = item.orderAmount > 0 ? (item.totalFee / item.orderAmount) * 100 : 0;
                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.gatewayName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td>{item.orderAmount} ر.س</td>
                      <td style={{ color: '#dc2626' }}>{item.totalFee} ر.س</td>
                      <td style={{ color: '#d97706' }}>{feePct.toFixed(2)}%</td>
                      <td style={{ color: '#047857', fontWeight: 900 }}>{item.netReceived} ر.س</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button onClick={() => handleEdit(item)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>تعديل</button>
                          <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>حذف</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={2} style={{ textAlign: 'center' }}>الإجمالي الكلي / المتوسط</td>
                  <td>{totalOrderAmount.toFixed(2)} ر.س</td>
                  <td style={{ color: '#dc2626' }}>{totalFees.toFixed(2)} ر.س</td>
                  <td style={{ color: '#d97706' }}>{overallFeePercent.toFixed(2)}%</td>
                  <td style={{ color: '#047857' }}>{totalNetReceived.toFixed(2)} ر.س</td>
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
