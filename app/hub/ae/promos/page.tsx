'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface DiscountItem {
  id: string;
  offerName: string;
  offerType: string;
  originalPrice: number;
  productCost: number;
  discountValue: number; // نسبة الخصم % أو القيمة الثابتة
  finalSellingPrice: number;
  netProfitAfterOffer: number;
  profitMarginPercent: number;
  isProfitable: boolean;
  createdAt?: string;
}

export default function DiscountCalculatorSA() {
  const [offerName, setOfferName] = useState<string>('كود خصم (SAVE20)');
  const [typeSelect, setTypeSelect] = useState<string>('خصم نسبة مئوية (%)');
  const [customOfferType, setCustomOfferType] = useState<string>('خصم نسبة مئوية (%)');
  const [originalPrice, setOriginalPrice] = useState<number | ''>(200);
  const [productCost, setProductCost] = useState<number | ''>(80);
  const [discountValue, setDiscountValue] = useState<number | ''>(20); // 20% خصم مثلاً

  const [items, setItems] = useState<DiscountItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_discount_calculator_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: DiscountItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_discount_calculator_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const origPrice = typeof originalPrice === 'number' ? originalPrice : 0;
  const cost = typeof productCost === 'number' ? productCost : 0;
  const disc = typeof discountValue === 'number' ? discountValue : 0;

  // الحسابات المالية للعرض
  let finalSellingPrice = origPrice;
  if (typeSelect.includes('نسبة مئوية')) {
    finalSellingPrice = origPrice - (origPrice * (disc / 100));
  } else if (typeSelect.includes('مبلغ ثابت')) {
    finalSellingPrice = origPrice - disc;
  } else if (typeSelect.includes('1+1')) {
    // في حالة عرض 1+1، العميل يدفع سعر قطعة ويأخذ قطعتين، بالتالي التكلفة تتضاعف لقطعتين
    finalSellingPrice = origPrice;
    const netProfitAfterOffer = origPrice - (cost * 2);
    var profitMargin = origPrice > 0 ? (netProfitAfterOffer / origPrice) * 100 : 0;
    var profitable = netProfitAfterOffer > 0;
  } else {
    finalSellingPrice = origPrice - disc;
  }

  const netProfitAfterOffer = typeSelect.includes('1+1') ? origPrice - (cost * 2) : finalSellingPrice - cost;
  const profitMarginPercent = finalSellingPrice > 0 ? (netProfitAfterOffer / finalSellingPrice) * 100 : 0;
  const isProfitable = netProfitAfterOffer > 0;

  const actualOfferType = typeSelect === 'نوع آخر (كتابة يدوية)' ? customOfferType : typeSelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTypeSelect(val);
    if (val !== 'نوع آخر (كتابة يدوية)') {
      setCustomOfferType(val);
    } else {
      setCustomOfferType('');
    }
  };

  const handleClearForm = () => {
    setOfferName('كود خصم (SAVE20)');
    setTypeSelect('خصم نسبة مئوية (%)');
    setCustomOfferType('خصم نسبة مئوية (%)');
    setOriginalPrice(200);
    setProductCost(80);
    setDiscountValue(20);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 عروض). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    const finalType = typeSelect === 'نوع آخر (كتابة يدوية)' ? customOfferType : typeSelect;
    if (!offerName.trim() || origPrice <= 0 || cost <= 0) {
      alert('الرجاء التأكد من تعبئة اسم العرض، سعر البيع الأصلي، والتكلفة بشكل صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        offerName,
        offerType: finalType,
        originalPrice: origPrice,
        productCost: cost,
        discountValue: disc,
        finalSellingPrice: Number(finalSellingPrice.toFixed(2)),
        netProfitAfterOffer: Number(netProfitAfterOffer.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
        isProfitable,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث حساب الجدوى بنجاح!');
    } else {
      const newItem: DiscountItem = {
        id: Date.now().toString(),
        offerName,
        offerType: finalType,
        originalPrice: origPrice,
        productCost: cost,
        discountValue: disc,
        finalSellingPrice: Number(finalSellingPrice.toFixed(2)),
        netProfitAfterOffer: Number(netProfitAfterOffer.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
        isProfitable,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة عرض الخصم إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: DiscountItem) => {
    setOfferName(item.offerName);
    const standardTypes = ['خصم نسبة مئوية (%)', 'خصم مبلغ ثابت (ر.س)', 'عرض 1+1 مجاناً'];
    if (standardTypes.includes(item.offerType)) {
      setTypeSelect(item.offerType);
      setCustomOfferType(item.offerType);
    } else {
      setTypeSelect('نوع آخر (كتابة يدوية)');
      setCustomOfferType(item.offerType);
    }
    setOriginalPrice(item.originalPrice);
    setProductCost(item.productCost);
    setDiscountValue(item.discountValue);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalProfitSum = items.reduce((acc, curr) => acc + curr.netProfitAfterOffer, 0);

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

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
                <th>اسم العرض أو الكود</th>
                <th>نوع العرض</th>
                <th>التاريخ والوقت</th>
                <th>السعر الأصلي</th>
                <th>التكلفة</th>
                <th>سعر البيع بعد العرض</th>
                <th>صافي الربح</th>
                <th>هامش الربح (%)</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.offerName}</td>
          <td>${row.offerType}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.originalPrice}</td>
          <td>${row.productCost}</td>
          <td>${row.finalSellingPrice}</td>
          <td>${row.netProfitAfterOffer}</td>
          <td>${row.profitMarginPercent}%</td>
          <td>${row.isProfitable ? 'مربح ✅' : 'خسارة ⚠️'}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="7">إجمالي الأرباح المتوقعة</td>
                <td colspan="3">${totalProfitSum.toFixed(2)} ر.س</td>
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
    link.setAttribute("download", "seerk_discount_feasibility.xls");
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
            alert('✨ تم استيراد بيانات العروض بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.offerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.offerType.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input.with-currency { padding-left: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 14px; color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; }
        .result-box.primary { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 20px; }
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
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>حاسبة جدوى أكواد الخصم والعروض 🎟️</h1>
          <p>تأكد من أن عروضك الترويجية (مثل 1+1 أو الشحن المجاني) لا تسبب لك خسائر مالية مخفية</p>
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
              <span>{editingId ? 'تعديل السجل' : 'حساب جدوى عرض أو كود جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>اسم العرض أو كود الخصم</label>
                <div className="input-wrapper">
                  <input type="text" value={offerName} onChange={(e) => setOfferName(e.target.value)} placeholder="مثال: كود خصم (SAVE20)" required />
                </div>
              </div>
              <div className="input-group">
                <label>نوع العرض أو الخصم</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={typeSelect} onChange={handleSelectChange}>
                    <option value="خصم نسبة مئوية (%)">خصم نسبة مئوية (%) 📉</option>
                    <option value="خصم مبلغ ثابت (ر.س)">خصم مبلغ ثابت (ر.س) 💵</option>
                    <option value="عرض 1+1 مجاناً">عرض 1+1 مجاناً 🎁</option>
                    <option value="نوع آخر (كتابة يدوية)">➕ نوع آخر (كتابة يدوية)</option>
                  </select>
                </div>

                {typeSelect === 'نوع آخر (كتابة يدوية)' && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customOfferType} 
                      onChange={(e) => setCustomOfferType(e.target.value)} 
                      placeholder="اكتب نوع العرض هنا..." 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>سعر البيع الأصلي (ر.س)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={originalPrice === '' ? '' : originalPrice} onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="200" required />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
              <div className="input-group">
                <label>تكلفة المنتج الأساسية (ر.س)</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={productCost === '' ? '' : productCost} onChange={(e) => setProductCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="80" required />
                  <span className="currency-tag">ر.س</span>
                </div>
              </div>
            </div>

            {!typeSelect.includes('1+1') && (
              <div className="input-group">
                <label>{typeSelect.includes('مبلغ ثابت') ? 'قيمة الخصم (ر.س)' : 'نسبة الخصم (%)'}</label>
                <div className="input-wrapper">
                  <input type="number" step="0.01" min="0" value={discountValue === '' ? '' : discountValue} onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="20" required />
                </div>
              </div>
            )}

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ حساب الجدوى في السجل'}
            </button>
          </form>
        </div>

        {/* قسم النتائج الفورية */}
        <div className="card">
          <h2 className="card-title">تحليل جدوى العرض الفوري</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">صافي الربح بعد تطبيق العرض</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>الربح الصافي للقطعة بعد الخصم</div>
            </div>
            <div className="result-value">
              {netProfitAfterOffer.toFixed(2)} ر.س
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">سعر البيع النهائي بعد الخصم</span>
            <span className="result-value" style={{ color: '#0369a1' }}>{finalSellingPrice.toFixed(2)} ر.س</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">حالة جدوى العرض</span>
            <span className="result-value" style={{ color: isProfitable ? '#047857' : '#dc2626' }}>
              {isProfitable ? 'العرض مربح ✅' : 'العرض يسبب خسارة ⚠️'}
            </span>
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم العرض أو الكود..." 
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
                <th>العرض والكود والتاريخ</th>
                <th>نوع العرض</th>
                <th>السعر الأصلي والتكلفة</th>
                <th>السعر بعد الخصم</th>
                <th>صافي الربح</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد حسابات جدوى عروض مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.offerName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#d97706' }}>{item.offerType}</span></td>
                    <td>{item.originalPrice} ر.س <span style={{ color: '#64748b', fontSize: '12px' }}>(تكلفة: {item.productCost})</span></td>
                    <td style={{ fontWeight: 800 }}>{item.finalSellingPrice} ر.س</td>
                    <td style={{ fontWeight: 900, color: item.netProfitAfterOffer > 0 ? '#047857' : '#dc2626' }}>
                      {item.netProfitAfterOffer} ر.س
                    </td>
                    <td>
                      <span style={{ color: item.isProfitable ? '#047857' : '#dc2626', background: item.isProfitable ? '#d1fae5' : '#fee2e2', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                        {item.isProfitable ? 'مربح ✅' : 'خسارة ⚠️'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={5} style={{ textAlign: 'center' }}>إجمالي الأرباح المتوقعة من العروض</td>
                  <td colSpan={3} style={{ color: '#047857' }}>{totalProfitSum.toFixed(2)} ر.س</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
