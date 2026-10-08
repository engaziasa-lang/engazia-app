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
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [orderAmount, setOrderAmount] = useState<number | ''>(350);
  const [gatewayName, setGatewayName] = useState<string>('مدى (Mada)');
  const [feePercent, setFeePercent] = useState<number | ''>(1.0);
  const [feeFixed, setFeeFixed] = useState<number | ''>(1.0);

  const [items, setItems] = useState<FeeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    if (savedLang === 'en') {
      setGatewayName('Mada');
    } else {
      setGatewayName('مدى (Mada)');
    }

    const saved = localStorage.getItem('seerk_gateway_fees_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: FeeItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_gateway_fees_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى) 💳',
      desc: 'احسب بدقة عمولات وبوابات الدفع المحلية مع رسوم الضريبة (15%) على العمولة وتأثيرها على حسابك في السوق السعودي',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب رسوم جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      orderAmtLabel: 'قيمة طلب العميل الإجمالية',
      presetLabel: 'اختيار البوابة لملء البيانات التلقائي (اختياري)',
      optMada: 'مدى (Mada) - (1% + 1 ريال)',
      optVisa: 'فيزا / ماستركارد (Visa/Master) - (2.2% + 1 ريال)',
      optTabby: 'التقسيط (تابي / تمارا) - (2.5% + 2 ريال)',
      optCustom: 'تفريغ الحقول (إدخال يدوي بالكامل)',
      gwNameLabel: 'اسم البوابة (قابل للتعديل)',
      gwNamePH: 'مثال: أبل باي',
      pctLabel: 'النسبة (%)',
      fixedLabel: 'رسوم ثابتة',
      currency: 'ر.س',
      saveBtnNew: '+ حفظ العملية في الجدول',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'تحليل الرسوم الفوري',
      netRecLabel: 'المبلغ الصافي الذي يدخل لحسابك البنكي',
      netRecSub: 'بعد خصم عمولة البوابة وضريبة 15% عليها',
      totalFeeLabel: 'إجمالي الرسوم المقتطعة (شاملة الضريبة)',
      effPctLabel: 'النسبة المؤثرة الفعلية من قيمة الطلب',
      searchPH: '🔍 بحث في السجلات المحفوظة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد سجلات بوابات دفع مسجلة في الجدول حالياً.',
        th1: '#',
        th2: 'بوابة الدفع والتاريخ',
        th3: 'قيمة الطلب',
        th4: 'الرسوم (شاملة الضريبة)',
        th5: 'نسبة الاستقطاع',
        th6: 'المبلغ الصافي',
        th7: 'الإجراءات',
        editBtn: 'تعديل',
        delBtn: 'حذف',
        totalLabel: 'الإجمالي الكلي / المتوسط'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 عمليات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء إدخال مبلغ طلب صحيح واسم للبوابة.',
        updateSuccess: '✨ تم تحديث السجل بنجاح!',
        saveSuccess: '✅ تمت إضافة العملية إلى الجدول بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Payment Gateway Fee Calculator (Tabby, Tamara, Mada) 💳',
      desc: 'Accurately calculate local payment gateway commissions with 15% VAT on fees and their impact in the Saudi market',
      editRecord: 'Edit Record',
      newRecord: 'Calculate New Fees',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      orderAmtLabel: 'Total Customer Order Amount',
      presetLabel: 'Select Gateway for Auto-Fill (Optional)',
      optMada: 'Mada - (1% + 1 SAR)',
      optVisa: 'Visa / MasterCard - (2.2% + 1 SAR)',
      optTabby: 'Installments (Tabby / Tamara) - (2.5% + 2 SAR)',
      optCustom: 'Clear Fields (Full Manual Entry)',
      gwNameLabel: 'Gateway Name (Editable)',
      gwNamePH: 'e.g. Apple Pay',
      pctLabel: 'Percentage (%)',
      fixedLabel: 'Fixed Fee',
      currency: 'SAR',
      saveBtnNew: '+ Save Operation to Table',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Fee Analysis',
      netRecLabel: 'Net Amount Entering Your Bank Account',
      netRecSub: 'After gateway commission and 15% VAT deduction',
      totalFeeLabel: 'Total Deducted Fees (Incl. VAT)',
      effPctLabel: 'Actual Effective Percentage of Order Value',
      searchPH: '🔍 Search saved records...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No payment gateway records currently registered in the table.',
        th1: '#',
        th2: 'Gateway & Date',
        th3: 'Order Amount',
        th4: 'Fees (Incl. VAT)',
        th5: 'Deduction %',
        th6: 'Net Amount',
        th7: 'Actions',
        editBtn: 'Edit',
        delBtn: 'Delete',
        totalLabel: 'Grand Total / Average'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 operations). Please upgrade to unlock unlimited access!',
        fillErr: 'Please enter a valid order amount and gateway name.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ Operation added to table successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'mada') {
      setGatewayName(lang === 'ar' ? 'مدى (Mada)' : 'Mada');
      setFeePercent(1.0);
      setFeeFixed(1.0);
    } else if (val === 'visa') {
      setGatewayName(lang === 'ar' ? 'فيزا / ماستركارد (Visa/Master)' : 'Visa / MasterCard');
      setFeePercent(2.2);
      setFeeFixed(1.0);
    } else if (val === 'tabby') {
      setGatewayName(lang === 'ar' ? 'التقسيط (تابي / تمارا)' : 'Installments (Tabby / Tamara)');
      setFeePercent(2.5);
      setFeeFixed(2.0);
    } else if (val === 'custom') {
      setGatewayName(lang === 'ar' ? 'بوابة مخصصة' : 'Custom Gateway');
      setFeePercent('');
      setFeeFixed('');
    }
  };

  const amt = typeof orderAmount === 'number' ? orderAmount : 0;
  const pct = typeof feePercent === 'number' ? feePercent : 0;
  const fxd = typeof feeFixed === 'number' ? feeFixed : 0;

  const baseFee = (amt * (pct / 100)) + fxd;
  const totalFeeWithVat = baseFee > 0 ? baseFee * 1.15 : 0;
  const netReceived = Math.max(0, amt - totalFeeWithVat);

  const handleClearForm = () => {
    setOrderAmount('');
    setGatewayName(lang === 'ar' ? 'مدى (Mada)' : 'Mada');
    setFeePercent(1.0);
    setFeeFixed(1.0);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (amt <= 0 || !gatewayName.trim()) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-SA' : 'en-US';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

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
      alert(text.alerts.updateSuccess);
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
      alert(text.alerts.saveSuccess);
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
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert(text.alerts.noDataExp);
      return;
    }

    const totalOrderAmount = items.reduce((acc, curr) => acc + curr.orderAmount, 0);
    const totalFees = items.reduce((acc, curr) => acc + curr.totalFee, 0);
    const totalNetReceived = items.reduce((acc, curr) => acc + curr.netReceived, 0);
    const overallFeePercent = totalOrderAmount > 0 ? (totalFees / totalOrderAmount) * 100 : 0;

    let tableHtml = `
      <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
            th { background-color: #f8fafc; font-weight: bold; color: #334155; }
          </style>
        </head>
        <body>
          <h2>Gateway Fees Calculator Report</h2>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>${text.table.th5}</th>
                <th>${text.table.th6}</th>
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
          <td>${row.orderAmount}</td>
          <td>${row.totalFee}</td>
          <td>${feePct.toFixed(2)}%</td>
          <td>${row.netReceived}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "enjazya_sa_gateway_fees.xls");
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
            alert(text.alerts.importSuccess);
          }
        } catch (err) {
          alert(text.alerts.importErr);
        }
      };
    }
  };

  const filteredItems = items.filter(item => item.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalOrderAmount = filteredItems.reduce((acc, curr) => acc + curr.orderAmount, 0);
  const totalFees = filteredItems.reduce((acc, curr) => acc + curr.totalFee, 0);
  const totalNetReceived = filteredItems.reduce((acc, curr) => acc + curr.netReceived, 0);
  const overallFeePercent = totalOrderAmount > 0 ? (totalFees / totalOrderAmount) * 100 : 0;

  return (
    <div className="tool-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 700px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          {text.back}
        </Link>
      </div>

      <div className="grid-layout">
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span>{editingId ? text.editRecord : text.newRecord}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm}>
                {text.clear}
              </button>
            </div>
            {isClient && !isActivated && <span className="trial-badge">{text.trial}: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>{text.orderAmtLabel} ({text.currency})</label>
              <div className="input-wrapper">
                <input className="with-currency" type="number" min="0" value={orderAmount === '' ? '' : orderAmount} onChange={(e) => setOrderAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="350" required />
                <span className="currency-tag">{text.currency}</span>
              </div>
            </div>

            <div className="input-group">
              <label>{text.presetLabel}</label>
              <div className="input-wrapper">
                <select onChange={handlePresetChange} defaultValue="mada">
                  <option value="mada">{text.optMada}</option>
                  <option value="visa">{text.optVisa}</option>
                  <option value="tabby">{text.optTabby}</option>
                  <option value="custom">{text.optCustom}</option>
                </select>
              </div>
            </div>

            <div className="input-group" style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ color: '#0f172a' }}>{text.gwNameLabel}</label>
              <div className="input-wrapper" style={{ marginBottom: '10px' }}>
                <input type="text" value={gatewayName} onChange={(e) => setGatewayName(e.target.value)} placeholder={text.gwNamePH} required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ color: '#0f172a' }}>{text.pctLabel}</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={feePercent === '' ? '' : feePercent} onChange={(e) => setFeePercent(e.target.value === '' ? '' : Number(e.target.value))} required />
                    <span className="currency-tag">%</span>
                  </div>
                </div>
                <div>
                  <label style={{ color: '#0f172a' }}>{text.fixedLabel} ({text.currency})</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={feeFixed === '' ? '' : feeFixed} onChange={(e) => setFeeFixed(e.target.value === '' ? '' : Number(e.target.value))} required />
                    <span className="currency-tag">{text.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.resultsTitle}</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.netRecLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.netRecSub}</div>
            </div>
            <div className="result-value">
              {netReceived.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #dc2626' : 'none', borderLeft: lang === 'en' ? '4px solid #dc2626' : 'none' }}>
            <span className="result-label">{text.totalFeeLabel}</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{totalFeeWithVat.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #d97706' : 'none', borderLeft: lang === 'en' ? '4px solid #d97706' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.effPctLabel}</span>
            <span className="result-value" style={{ color: '#d97706' }}>{amt > 0 ? ((totalFeeWithVat / amt) * 100).toFixed(2) : 0}%</span>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder={text.searchPH} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel}>{text.exportBtn}</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>{text.importBtn}</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{text.table.th1}</th>
                <th>{text.table.th2}</th>
                <th>{text.table.th3}</th>
                <th>{text.table.th4}</th>
                <th>{text.table.th5}</th>
                <th>{text.table.th6}</th>
                <th>{text.table.th7}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
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
                      <td>{item.orderAmount} {text.currency}</td>
                      <td style={{ color: '#dc2626' }}>{item.totalFee} {text.currency}</td>
                      <td style={{ color: '#d97706' }}>{feePct.toFixed(2)}%</td>
                      <td style={{ color: '#047857', fontWeight: 900 }}>{item.netReceived} {text.currency}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">{text.table.editBtn}</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">{text.table.delBtn}</button>
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
                  <td colSpan={2} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{totalOrderAmount.toFixed(2)} {text.currency}</td>
                  <td style={{ color: '#dc2626' }}>{totalFees.toFixed(2)} {text.currency}</td>
                  <td style={{ color: '#d97706' }}>{overallFeePercent.toFixed(2)}%</td>
                  <td style={{ color: '#047857' }}>{totalNetReceived.toFixed(2)} {text.currency}</td>
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
