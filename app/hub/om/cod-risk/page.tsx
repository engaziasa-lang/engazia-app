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
  timestamp?: number;
}

export default function CodAnalyzerOM() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [shippingSelect, setShippingSelect] = useState<string>('بريد عُمان (Oman Post)');
  const [customShipping, setCustomShipping] = useState<string>('بريد عُمان (Oman Post)');
  const [totalCodOrders, setTotalCodOrders] = useState<number | ''>('');
  const [avgOrderValue, setAvgOrderValue] = useState<number | ''>('');
  const [codFeePerOrder, setCodFeePerOrder] = useState<number | ''>(1.5);
  const [returnRatePercent, setReturnRatePercent] = useState<number | ''>(15);

  const [items, setItems] = useState<CodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_om'));

    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }

    if (savedLang === 'en') {
      setShippingSelect('Oman Post');
      setCustomShipping('Oman Post');
    } else {
      setShippingSelect('بريد عُمان (Oman Post)');
      setCustomShipping('بريد عُمان (Oman Post)');
    }

    const saved = localStorage.getItem('seerk_om_cod_analyzer_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: CodItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_om_cod_analyzer_items', JSON.stringify(newItems));
  };

  const orders = typeof totalCodOrders === 'number' ? totalCodOrders : 0;
  const orderVal = typeof avgOrderValue === 'number' ? avgOrderValue : 0;
  const fee = typeof codFeePerOrder === 'number' ? codFeePerOrder : 0;
  const retRate = typeof returnRatePercent === 'number' ? returnRatePercent : 0;

  const totalCodFees = orders * fee;
  const rejectedOrdersCount = orders * (retRate / 100);
  const shippingAndHandlingLossPerReject = 3; // تكلفة الشحن العكسي التقريبية بالريال العُماني
  const totalReturnLoss = rejectedOrdersCount * shippingAndHandlingLossPerReject;
  const grandTotalCost = totalCodFees + totalReturnLoss;

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'محلل تكاليف الدفع عند الاستلام (COD) 🚚',
      desc: 'احسب نسبة المخاطرة، رسوم شركات الشحن، وخسائر عدم الاستلام وتأثيرها على صافي أرباحك',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب تكاليف شحن COD جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      shippingComp: 'اختر شركة الشحن',
      compOmanPost: 'بريد عُمان (Oman Post)',
      compAsyad: 'أسياد إكسبريس (Asyad Express)',
      compDalilak: 'دليلك (Dalilak)',
      compAramex: 'أرامكس (Aramex)',
      compDHL: 'دي إتش إل (DHL)',
      otherComp: '➕ شركة أخرى (كتابة يدوية)',
      otherCompPH: 'اكتب اسم شركة الشحن هنا...',
      ordersLabel: 'عدد طلبات الدفع عند الاستلام',
      ordersPH: '50',
      avgValLabel: 'متوسط قيمة الطلب',
      avgValPH: '35',
      feeLabel: 'رسوم خدمة COD للطلب الواحد',
      feePH: '1.5',
      retRateLabel: 'نسبة عدم الاستلام / الرفض (%)',
      retRatePH: '15',
      saveBtnNew: '+ حفظ التحليل في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'تحليل التكاليف الخفية الفوري',
      grandTotal: 'إجمالي التكلفة الخفية لخدمة COD',
      grandTotalSub: 'مجموع رسوم التحصيل وخسائر الرفض',
      feeTotal: 'إجمالي رسوم خدمة التحصيل',
      retLossTotal: 'خسائر الطلبات المرفوضة (الشحن العكسي والتالف)',
      currency: 'ر.ع',
      searchPH: '🔍 بحث بشركة الشحن...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      filters: {
        all: 'الكل',
        day: 'آخر يوم',
        week: 'آخر أسبوع',
        month: 'آخر شهر',
        sixMonths: 'آخر 6 أشهر',
        year: 'آخر سنة'
      },
      table: {
        noRecords: 'لا توجد سجلات مطابقة مسجلة حالياً.',
        th1: '#',
        th2: 'شركة الشحن والتاريخ',
        th3: 'طلبات COD',
        th4: 'نسبة الرفض',
        th5: 'رسوم التحصيل',
        th6: 'خسائر الرفض',
        th7: 'إجمالي التكلفة الخفية',
        th8: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي',
        ordersCount: 'طلب'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تحديد شركة الشحن، عدد الطلبات، وقيمة الطلب بشكل صحيح.',
        updateSuccess: '✨ تم تحديث السجل بنجاح!',
        saveSuccess: '✅ تمت إضافة تحليل تكاليف COD إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.',
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Cash on Delivery (COD) Analyzer 🚚',
      desc: 'Calculate risk ratios, shipping fees, return losses, and their impact on net profit',
      editRecord: 'Edit Record',
      newRecord: 'New COD Calculation',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      shippingComp: 'Select Shipping Company',
      compOmanPost: 'Oman Post',
      compAsyad: 'Asyad Express',
      compDalilak: 'Dalilak',
      compAramex: 'Aramex',
      compDHL: 'DHL',
      otherComp: '➕ Other Company (Manual Entry)',
      otherCompPH: 'Enter shipping company name...',
      ordersLabel: 'Number of COD Orders',
      ordersPH: '50',
      avgValLabel: 'Average Order Value',
      avgValPH: '35',
      feeLabel: 'COD Service Fee per Order',
      feePH: '1.5',
      retRateLabel: 'Non-Delivery / Return Rate (%)',
      retRatePH: '15',
      saveBtnNew: '+ Save Analysis to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Hidden Cost Analysis',
      grandTotal: 'Total Hidden Cost of COD Service',
      grandTotalSub: 'Sum of collection fees and return losses',
      feeTotal: 'Total Collection Service Fees',
      retLossTotal: 'Losses from Rejected Orders (Reverse Shipping)',
      currency: 'OMR',
      searchPH: '🔍 Search by shipping company...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      filters: {
        all: 'All Time',
        day: 'Last Day',
        week: 'Last Week',
        month: 'Last Month',
        sixMonths: 'Last 6 Months',
        year: 'Last Year'
      },
      table: {
        noRecords: 'No matching COD cost records currently saved.',
        th1: '#',
        th2: 'Shipping Company & Date',
        th3: 'COD Orders',
        th4: 'Return Rate',
        th5: 'Collection Fees',
        th6: 'Return Losses',
        th7: 'Total Hidden Cost',
        th8: 'Actions',
        totalLabel: 'Grand Total',
        ordersCount: 'order'
      },
      alerts: {
        limit: '🔒 Sorry, you have reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure shipping company, number of orders, and order value are filled correctly.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ COD cost analysis added to log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.',
      }
    }
  };

  const text = t[lang];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setShippingSelect(val);
    if (val !== 'OTHER') {
      setCustomShipping(val);
    } else {
      setCustomShipping('');
    }
  };

  const handleClearForm = () => {
    const defComp = lang === 'en' ? 'Oman Post' : 'بريد عُمان (Oman Post)';
    setShippingSelect(defComp);
    setCustomShipping(defComp);
    setTotalCodOrders('');
    setAvgOrderValue('');
    setCodFeePerOrder(1.5);
    setReturnRatePercent(15);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalCompany = shippingSelect === 'OTHER' ? customShipping : shippingSelect;
    if (!finalCompany.trim() || orders <= 0 || orderVal <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-OM' : 'en-OM';
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
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
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
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: CodItem) => {
    const isOmanPost = item.shippingCompany.includes('Oman Post') || item.shippingCompany.includes('بريد عُمان');
    const isAsyad = item.shippingCompany.includes('Asyad') || item.shippingCompany.includes('أسياد');
    const isDalilak = item.shippingCompany.includes('Dalilak') || item.shippingCompany.includes('دليلك');
    const isAramex = item.shippingCompany.includes('Aramex') || item.shippingCompany.includes('أرامكس');
    const isDHL = item.shippingCompany.includes('DHL') || item.shippingCompany.includes('دي إتش إل');

    let matchedComp = '';
    if (isOmanPost) matchedComp = text.compOmanPost;
    else if (isAsyad) matchedComp = text.compAsyad;
    else if (isDalilak) matchedComp = text.compDalilak;
    else if (isAramex) matchedComp = text.compAramex;
    else if (isDHL) matchedComp = text.compDHL;
    else matchedComp = 'OTHER';

    setShippingSelect(matchedComp);
    setCustomShipping(item.shippingCompany);
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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.shippingCompany.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    
    if (dateFilter !== 'all') {
      const itemTime = item.timestamp || 0;
      const now = Date.now();
      const diff = now - itemTime;
      const dayMs = 24 * 60 * 60 * 1000;
      
      if (dateFilter === 'day') matchesDate = diff <= dayMs;
      else if (dateFilter === 'week') matchesDate = diff <= 7 * dayMs;
      else if (dateFilter === 'month') matchesDate = diff <= 30 * dayMs;
      else if (dateFilter === '6months') matchesDate = diff <= 180 * dayMs;
      else if (dateFilter === 'year') matchesDate = diff <= 365 * dayMs;
    }
    
    return matchesSearch && matchesDate;
  });

  const totalOrdersSum = filteredItems.reduce((acc, curr) => acc + curr.totalCodOrders, 0);
  const totalCodFeesSum = filteredItems.reduce((acc, curr) => acc + curr.totalCodFees, 0);
  const totalReturnLossSum = filteredItems.reduce((acc, curr) => acc + curr.totalReturnLoss, 0);
  const grandTotalCostSum = filteredItems.reduce((acc, curr) => acc + curr.grandTotalCost, 0);

  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
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
            .tfoot-row td { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>Date / Time</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>${text.table.th5} (${text.currency})</th>
                <th>${text.table.th6} (${text.currency})</th>
                <th>${text.table.th7} (${text.currency})</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.shippingCompany}</td>
          <td>${row.createdAt || '-'}</td>
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
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="3">${text.table.totalLabel}</td>
                <td>${totalOrdersSum}</td>
                <td>-</td>
                <td>${totalCodFeesSum.toFixed(2)}</td>
                <td>${totalReturnLossSum.toFixed(2)}</td>
                <td>${grandTotalCostSum.toFixed(2)} ${text.currency}</td>
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
    link.setAttribute("download", `enjazya_om_cod_analysis_${dateFilter}.xls`);
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
            const newItems = imported.filter(imp => !items.find(i => i.id === imp.id));
            saveToLocalStorage([...newItems, ...items]);
            alert(text.alerts.importSuccess);
          }
        } catch (err) {
          alert(text.alerts.importErr);
        }
      };
    }
  };

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
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #C62828; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #C62828; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #B71C1C; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .danger .result-value { font-size: 26px; color: #ffffff; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #C62828; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #C62828; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #C62828; color: #C62828; }

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
        <Link href="/hub/om" className="back-btn">
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
              <label>{text.shippingComp}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={shippingSelect} onChange={handleSelectChange}>
                  <option value={text.compOmanPost}>{text.compOmanPost}</option>
                  <option value={text.compAsyad}>{text.compAsyad}</option>
                  <option value={text.compDalilak}>{text.compDalilak}</option>
                  <option value={text.compAramex}>{text.compAramex}</option>
                  <option value={text.compDHL}>{text.compDHL}</option>
                  <option value="OTHER">{text.otherComp}</option>
                </select>
              </div>

              {shippingSelect === 'OTHER' && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customShipping} 
                    onChange={(e) => setCustomShipping(e.target.value)} 
                    placeholder={text.otherCompPH} 
                    required 
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.ordersLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={totalCodOrders === '' ? '' : totalCodOrders} onChange={(e) => setTotalCodOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.ordersPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.avgValLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={avgOrderValue === '' ? '' : avgOrderValue} onChange={(e) => setAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.avgValPH} required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.feeLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={codFeePerOrder === '' ? '' : codFeePerOrder} onChange={(e) => setCodFeePerOrder(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.feePH} required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.retRateLabel}</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" min="0" max="100" value={returnRatePercent === '' ? '' : returnRatePercent} onChange={(e) => setReturnRatePercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.retRatePH} required />
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
          <h2 className="card-title">{text.analysisTitle}</h2>

          <div className="result-box danger">
            <div>
              <div className="result-label">{text.grandTotal}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.grandTotalSub}</div>
            </div>
            <div className="result-value">
              {grandTotalCost.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.feeTotal}</span>
            <span className="result-value" style={{ color: '#d97706' }}>{totalCodFees.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.retLossTotal}</span>
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

          <select 
            className="filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">{text.filters.all}</option>
            <option value="day">{text.filters.day}</option>
            <option value="week">{text.filters.week}</option>
            <option value="month">{text.filters.month}</option>
            <option value="6months">{text.filters.sixMonths}</option>
            <option value="year">{text.filters.year}</option>
          </select>

          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel}>
              {lang === 'ar' ? 'تصدير 📥' : 'Export 📥'}
            </button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>
              {lang === 'ar' ? 'استيراد 📂' : 'Import 📂'}
            </button>
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
                    <td style={{ fontWeight: 800 }}>{item.totalCodOrders} {text.table.ordersCount}</td>
                    <td><span style={{ color: '#dc2626', fontWeight: 800 }}>{item.returnRatePercent}%</span></td>
                    <td style={{ color: '#d97706' }}>{item.totalCodFees} {text.currency}</td>
                    <td style={{ color: '#dc2626' }}>{item.totalReturnLoss} {text.currency}</td>
                    <td style={{ fontWeight: 900, color: '#991b1b' }}>{item.grandTotalCost} {text.currency}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title={text.editRecord}>✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title={text.alerts.delConfirm}>❌</button>
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
                  <td>{totalOrdersSum} {text.table.ordersCount}</td>
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
