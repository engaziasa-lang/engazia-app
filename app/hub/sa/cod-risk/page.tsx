'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CodItem {
  id: string;
  shippingCompany: string;
  totalCodOrders: number;
  avgOrderValue: number;
  codFeePerOrder: number;
  returnRatePercent: number;
  totalCodFees: number;
  totalReturnLoss: number;
  grandTotalCost: number;
  createdAt?: string;
}

export default function CodAnalyzerSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [shippingSelect, setShippingSelect] = useState<string>('أرامكس (Aramex)');
  const [customShipping, setCustomShipping] = useState<string>('أرامكس (Aramex)');
  const [totalCodOrders, setTotalCodOrders] = useState<number | ''>('');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>('');
  const [codFeePerOrder, setCodFeePerOrder] = useState<number | ''>(12);
  const [returnRatePercent, setReturnRatePercent] = useState<number | ''>(15);

  const [items, setItems] = useState<CodItem[]>([]);
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

    const saved = localStorage.getItem('seerk_cod_analyzer_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: CodItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_cod_analyzer_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'محلل تكاليف الدفع عند الاستلام (COD) 🚚',
      desc: 'احسب نسبة المخاطرة، رسوم شركات الشحن، وخسائر عدم الاستلام وتأثيرها على صافي أرباحك في السوق السعودي',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب تكاليف شحن COD جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      selectCompany: 'اختر شركة الشحن',
      optAramex: 'أرامكس (Aramex)',
      optSmsa: 'سمسا (SMSA)',
      optDhl: 'دي إتش إل (DHL)',
      optImleap: 'اليكسبرس (IMLEAP)',
      optNaqel: 'نايل إكسبرس (Naqel)',
      optCustom: '➕ شركة أخرى (كتابة يدوية)',
      customPH: 'اكتب اسم شركة الشحن هنا...',
      ordersLabel: 'عدد طلبات الدفع عند الاستلام',
      orderValLabel: 'متوسط قيمة الطلب',
      codFeeLabel: 'رسوم خدمة COD للطلب الواحد',
      returnRateLabel: 'نسبة عدم الاستلام / الرفض (%)',
      currency: 'ر.س',
      saveBtnNew: '+ حفظ التحليل في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'تحليل التكاليف الخفية الفوري',
      totalCostLabel: 'إجمالي التكلفة الخفية لخدمة COD',
      totalCostSub: 'مجموع رسوم التحصيل وخسائر الرفض',
      codFeesLabel: 'إجمالي رسوم خدمة التحصيل',
      returnLossLabel: 'خسائر الطلبات المرفوضة (الشحن العكسي والتالف)',
      searchPH: '🔍 بحث بشركة الشحن...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد سجلات تكاليف COD مسجلة حالياً.',
        th1: '#',
        th2: 'شركة الشحن والتاريخ',
        th3: 'طلبات COD',
        th4: 'نسبة الرفض',
        th5: 'رسوم التحصيل',
        th6: 'خسائر الرفض',
        th7: 'إجمالي التكلفة الخفية',
        th8: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي',
        ordersUnit: 'طلب'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تحديد شركة الشحن، عدد الطلبات، وقيمة الطلب بشكل صحيح.',
        updateSuccess: '✨ تم تحديث السجل بنجاح!',
        saveSuccess: '✅ تمت إضافة تحليل تكاليف COD إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Cash on Delivery (COD) Cost Analyzer 🚚',
      desc: 'Calculate risk ratio, shipping fees, and non-delivery losses and their impact on your net profit in Saudi Arabia',
      editRecord: 'Edit Record',
      newRecord: 'Calculate New COD Costs',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      selectCompany: 'Select Shipping Company',
      optAramex: 'Aramex',
      optSmsa: 'SMSA',
      optDhl: 'DHL',
      optImleap: 'IMLEAP',
      optNaqel: 'Naqel',
      optCustom: '➕ Other Company (Custom)',
      customPH: 'Type shipping company name...',
      ordersLabel: 'Total COD Orders Count',
      orderValLabel: 'Average Order Value',
      codFeeLabel: 'COD Service Fee per Order',
      returnRateLabel: 'Rejection / Return Rate (%)',
      currency: 'SAR',
      saveBtnNew: '+ Save Analysis to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Hidden Cost Analysis',
      totalCostLabel: 'Total Hidden Cost for COD Service',
      totalCostSub: 'Sum of collection fees and rejection losses',
      codFeesLabel: 'Total Collection Service Fees',
      returnLossLabel: 'Rejected Orders Loss (Return Shipping & Damage)',
      searchPH: '🔍 Search by shipping company...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No COD cost records currently registered.',
        th1: '#',
        th2: 'Company & Date',
        th3: 'COD Orders',
        th4: 'Return Rate',
        th5: 'Collection Fees',
        th6: 'Return Losses',
        th7: 'Total Hidden Cost',
        th8: 'Actions',
        totalLabel: 'Grand Total',
        ordersUnit: 'orders'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure shipping company, order count, and order value are entered correctly.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ COD cost analysis saved to log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const orders = typeof totalCodOrders === 'number' ? totalCodOrders : 0;
  const orderVal = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const fee = typeof codFeePerOrder === 'number' ? codFeePerOrder : 0;
  const retRate = typeof returnRatePercent === 'number' ? returnRatePercent : 0;

  const totalCodFees = orders * fee;
  const rejectedOrdersCount = orders * (retRate / 100);
  const shippingAndHandlingLossPerReject = 25;
  const totalReturnLoss = rejectedOrdersCount * shippingAndHandlingLossPerReject;
  const grandTotalCost = totalCodFees + totalReturnLoss;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setShippingSelect(val);
    if (val !== 'شركة أخرى (كتابة يدوية)' && val !== 'Other Company (Custom)') {
      setCustomShipping(val);
    } else {
      setCustomShipping('');
    }
  };

  const handleClearForm = () => {
    setShippingSelect('أرامكس (Aramex)');
    setCustomShipping('أرامكس (Aramex)');
    setTotalCodOrders('');
    setAvgOrderValue('');
    setCodFeePerOrder(12);
    setReturnRatePercent(15);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalCompany = (shippingSelect === 'شركة أخرى (كتابة يدوية)' || shippingSelect === 'OtherCompany') ? customShipping : shippingSelect;
    if (!finalCompany.trim() || orders <= 0 || orderVal <= 0) {
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
        shippingCompany: finalCompany,
        totalCodOrders: orders,
        avgOrderValue: orderVal,
        codFeePerOrder: fee,
        returnRatePercent: retRate,
        totalCodFees: Number(totalCodFees.toFixed(2)),
        totalReturnLoss: Number(totalReturnLoss.toFixed(2)),
        grandTotalCost: Number(grandTotalCost.toFixed(2)),
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: CodItem = {
        id: Date.now().toString(),
        shippingCompany: finalCompany,
        totalCodOrders: orders,
        avgOrderValue: orderVal,
        codFeePerOrder: fee,
        returnRatePercent: retRate,
        totalCodFees: Number(totalCodFees.toFixed(2)),
        totalReturnLoss: Number(totalReturnLoss.toFixed(2)),
        grandTotalCost: Number(grandTotalCost.toFixed(2)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: CodItem) => {
    const standardCompanies = ['أرامكس (Aramex)', 'سمسا (SMSA)', 'دي إتش إل (DHL)', 'اليكسبرس (IMLEAP)', 'نايل إكسبرس (Naqel)'];
    if (standardCompanies.includes(item.shippingCompany)) {
      setShippingSelect(item.shippingCompany);
      setCustomShipping(item.shippingCompany);
    } else {
      setShippingSelect('شركة أخرى (كتابة يدوية)');
      setCustomShipping(item.shippingCompany);
    }
    setTotalCodOrders(item.totalCodOrders);
    setAvgOrderValue(item.avgOrderValue);
    setCodFeePerOrder(item.codFeePerOrder);
    setReturnRatePercent(item.returnRatePercent);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const totalOrdersSum = items.reduce((acc, curr) => acc + curr.totalCodOrders, 0);
  const totalCodFeesSum = items.reduce((acc, curr) => acc + curr.totalCodFees, 0);
  const totalReturnLossSum = items.reduce((acc, curr) => acc + curr.totalReturnLoss, 0);
  const grandTotalCostSum = items.reduce((acc, curr) => acc + curr.grandTotalCost, 0);

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert(text.alerts.noDataExp);
      return;
    }

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
          <h2>COD Cost Analyzer Report</h2>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>${text.table.th5}</th>
                <th>${text.table.th6}</th>
                <th>${text.table.th7}</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.shippingCompany}</td>
          <td>${row.totalCodOrders}</td>
          <td>${row.returnRatePercent}%</td>
          <td>${row.totalCodFees}</td>
          <td>${row.totalReturnLoss}</td>
          <td>${row.grandTotalCost}</td>
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
    link.setAttribute("download", "enjazya_sa_cod_analysis.xls");
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

  const filteredItems = items.filter(item => 
    item.shippingCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .danger .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
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
              <label>{text.selectCompany}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={shippingSelect} onChange={handleSelectChange}>
                  <option value="أرامكس (Aramex)">{text.optAramex}</option>
                  <option value="سمسا (SMSA)">{text.optSmsa}</option>
                  <option value="دي إتش إل (DHL)">{text.optDhl}</option>
                  <option value="اليكسبرس (IMLEAP)">{text.optImleap}</option>
                  <option value="نايل إكسبرس (Naqel)">{text.optNaqel}</option>
                  <option value="شركة أخرى (كتابة يدوية)">{text.optCustom}</option>
                </select>
              </div>

              {(shippingSelect === 'شركة أخرى (كتابة يدوية)' || shippingSelect === 'OtherCompany') && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customShipping} 
                    onChange={(e) => setCustomShipping(e.target.value)} 
                    placeholder={text.customPH} 
                    required 
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.ordersLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={totalCodOrders === '' ? '' : totalCodOrders} onChange={(e) => setTotalCodOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="200" required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.orderValLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={avgOrderValue === '' ? '' : avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="300" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.codFeeLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={codFeePerOrder === '' ? '' : codFeePerOrder} onChange={(e) => setCodFeePerOrder(e.target.value === '' ? '' : Number(e.target.value))} placeholder="12" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.returnRateLabel}</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.1" min="0" max="100" value={returnRatePercent === '' ? '' : returnRatePercent} onChange={(e) => setReturnRatePercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder="15" required />
                  <span className="currency-tag">%</span>
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

          <div className="result-box danger">
            <div>
              <div className="result-label">{text.totalCostLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalCostSub}</div>
            </div>
            <div className="result-value">
              {grandTotalCost.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #d97706' : 'none', borderLeft: lang === 'en' ? '4px solid #d97706' : 'none' }}>
            <span className="result-label">{text.codFeesLabel}</span>
            <span className="result-value" style={{ color: '#d97706' }}>{totalCodFees.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #dc2626' : 'none', borderLeft: lang === 'en' ? '4px solid #dc2626' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.returnLossLabel}</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{totalReturnLoss.toFixed(2)} {text.currency}</span>
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
                <th>{text.table.th8}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.shippingCompany}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td style={{ fontWeight: 800 }}>{item.totalCodOrders} {text.table.ordersUnit}</td>
                    <td><span style={{ color: '#dc2626', fontWeight: 800 }}>{item.returnRatePercent}%</span></td>
                    <td style={{ color: '#d97706' }}>{item.totalCodFees} {text.currency}</td>
                    <td style={{ color: '#dc2626' }}>{item.totalReturnLoss} {text.currency}</td>
                    <td style={{ fontWeight: 900, color: '#991b1b' }}>{item.grandTotalCost} {text.currency}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={2} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{totalOrdersSum} {text.table.ordersUnit}</td>
                  <td>-</td>
                  <td style={{ color: '#d97706' }}>{totalCodFeesSum.toFixed(2)} {text.currency}</td>
                  <td style={{ color: '#dc2626' }}>{totalReturnLossSum.toFixed(2)} {text.currency}</td>
                  <td style={{ color: '#991b1b' }}>{grandTotalCostSum.toFixed(2)} {text.currency}</td>
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
