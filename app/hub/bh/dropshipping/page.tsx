'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface DropshipItem {
  id: string;
  productName: string;
  supplierName: string;
  productCost: number;
  shippingCost: number;
  customsAndVat: number;
  sellingPrice: number;
  netProfit: number;
  profitMarginPercent: number;
  createdAt?: string;
  timestamp?: number;
}

export default function DropshippingCalculatorBH() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [productName, setProductName] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [customsAndVat, setCustomsAndVat] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');

  const [items, setItems] = useState<DropshipItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_bh'));

    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    if (savedLang === 'en') {
      setSupplierName('AliExpress / External Supplier');
    } else {
      setSupplierName('AliExpress / مورد خارجي');
    }

    const saved = localStorage.getItem('seerk_bh_dropshipping_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: DropshipItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_bh_dropshipping_items', JSON.stringify(newItems));
  };

  const cost = typeof productCost === 'number' ? productCost : 0;
  const shipping = typeof shippingCost === 'number' ? shippingCost : 0;
  const customs = typeof customsAndVat === 'number' ? customsAndVat : 0;
  const price = typeof sellingPrice === 'number' ? sellingPrice : 0;

  const totalCost = cost + shipping + customs;
  const netProfit = price - totalCost;
  const profitMarginPercent = price > 0 ? (netProfit / price) * 100 : 0;

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة أرباح الدروبشيبينغ 🌍',
      desc: 'احسب هوامش الربح للمنتجات المستوردة مع أخذ رسوم الجمارك والشحن الدولي في الحسبان في البحرين',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب أرباح منتج دروبشيبينغ جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodName: 'اسم المنتج',
      prodNamePH: 'مثال: ساعة ذكية مقاومة للماء',
      supplier: 'اسم المورد (اختياري)',
      supplierPH: 'AliExpress',
      prodCost: 'تكلفة شراء المنتج',
      shippingCost: 'تكلفة الشحن الدولي',
      customs: 'الجمارك والضريبة التقديرية',
      sellPrice: 'سعر البيع المستهدف في متجرك',
      currency: 'د.ب',
      saveBtnNew: '+ حفظ الحساب في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'تحليل الربحية الفوري',
      netProfit: 'صافي الربح الفعلي للقطعة',
      netProfitSub: 'الربح الصافي بعد خصم الشحن والجمارك',
      margin: 'هامش الربح الصافي (%)',
      totalCostLabel: 'إجمالي التكاليف (شراء + شحن + جمارك)',
      searchPH: '🔍 بحث باسم المنتج أو المورد...',
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
        noRecords: 'لا توجد منتجات دروبشيبينغ مسجلة تطابق بحثك.',
        th1: '#',
        th2: 'المنتج والمورد والتاريخ',
        th3: 'تكلفة الشراء',
        th4: 'الشحن والجمارك',
        th5: 'سعر البيع',
        th6: 'صافي الربح',
        th7: 'هامش الربح (%)',
        th8: 'الإجراءات',
        totalLabel: 'الإجمالي / متوسط هامش الربح'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 منتجات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المنتج، سعر البيع، وتكاليف المنتج بشكل صحيح.',
        updateSuccess: '✨ تم تحديث حاسبة الأرباح بنجاح!',
        saveSuccess: '✅ تمت إضافة المنتج إلى سجل أرباح الدروبشيبينغ بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Dropshipping Profit Calculator 🌍',
      desc: 'Calculate profit margins for imported products factoring in custom duties and international shipping in Bahrain',
      editRecord: 'Edit Record',
      newRecord: 'New Dropshipping Calculation',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodName: 'Product Name',
      prodNamePH: 'e.g. Waterproof Smartwatch',
      supplier: 'Supplier Name (Optional)',
      supplierPH: 'AliExpress',
      prodCost: 'Product Purchase Cost',
      shippingCost: 'International Shipping Cost',
      customs: 'Estimated Customs & VAT',
      sellPrice: 'Target Selling Price in Store',
      currency: 'BHD',
      saveBtnNew: '+ Save to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Profitability Analysis',
      netProfit: 'Actual Net Profit per Item',
      netProfitSub: 'Net profit after deducting shipping & customs',
      margin: 'Net Profit Margin (%)',
      totalCostLabel: 'Total Costs (Purchase + Shipping + Customs)',
      searchPH: '🔍 Search by product or supplier...',
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
        noRecords: 'No dropshipping products currently found.',
        th1: '#',
        th2: 'Product, Supplier & Date',
        th3: 'Purchase Cost',
        th4: 'Shipping & Customs',
        th5: 'Selling Price',
        th6: 'Net Profit',
        th7: 'Profit Margin (%)',
        th8: 'Actions',
        totalLabel: 'Total / Avg Margin'
      },
      alerts: {
        limit: '🔒 Sorry, you have reached the trial limit (3 products). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure product name, selling price, and product costs are filled correctly.',
        updateSuccess: '✨ Profit calculator updated successfully!',
        saveSuccess: '✅ Product added to dropshipping log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handleClearForm = () => {
    setProductName('');
    setSupplierName(lang === 'en' ? 'AliExpress / External Supplier' : 'AliExpress / مورد خارجي');
    setProductCost('');
    setShippingCost('');
    setCustomsAndVat('');
    setSellingPrice('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!productName.trim() || price <= 0 || totalCost <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-BH' : 'en-BH';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        supplierName,
        productCost: cost,
        shippingCost: shipping,
        customsAndVat: customs,
        sellingPrice: price,
        netProfit: Number(netProfit.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: DropshipItem = {
        id: Date.now().toString(),
        productName,
        supplierName,
        productCost: cost,
        shippingCost: shipping,
        customsAndVat: customs,
        sellingPrice: price,
        netProfit: Number(netProfit.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: DropshipItem) => {
    setProductName(item.productName);
    setSupplierName(item.supplierName);
    setProductCost(item.productCost);
    setShippingCost(item.shippingCost);
    setCustomsAndVat(item.customsAndVat);
    setSellingPrice(item.sellingPrice);
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
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
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

  const totalProfitSum = filteredItems.reduce((acc, curr) => acc + curr.netProfit, 0);
  const avgMargin = filteredItems.length > 0 ? filteredItems.reduce((acc, curr) => acc + curr.profitMarginPercent, 0) / filteredItems.length : 0;

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
                <th>Product Name</th>
                <th>Supplier</th>
                <th>Date / Time</th>
                <th>${text.table.th3} (${text.currency})</th>
                <th>Intl Shipping (${text.currency})</th>
                <th>Customs & VAT (${text.currency})</th>
                <th>${text.table.th5} (${text.currency})</th>
                <th>${text.table.th6} (${text.currency})</th>
                <th>${text.table.th7}</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.productName}</td>
          <td>${row.supplierName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.productCost}</td>
          <td>${row.shippingCost}</td>
          <td>${row.customsAndVat}</td>
          <td>${row.sellingPrice}</td>
          <td>${row.netProfit}</td>
          <td>${row.profitMarginPercent}%</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="8">${text.table.totalLabel}</td>
                <td>${totalProfitSum.toFixed(2)} ${text.currency}</td>
                <td>${avgMargin.toFixed(2)}%</td>
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
    link.setAttribute("download", `enjazya_bh_dropshipping_profits_${dateFilter}.xls`);
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
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus { border-color: #CE1126; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #CE1126; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #A60E1E; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #CE1126 0%, #A60E1E 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 26px; color: #ffffff; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #CE1126; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #CE1126; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #CE1126; color: #CE1126; }

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
        <Link href="/hub/bh" className="back-btn">
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
            <div className="form-row">
              <div className="input-group">
                <label>{text.prodName}</label>
                <div className="input-wrapper">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodNamePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.supplier}</label>
                <div className="input-wrapper">
                  <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder={text.supplierPH} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.prodCost} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={productCost === '' ? '' : productCost} onChange={(e) => setProductCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="4.5" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.shippingCost} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={shippingCost === '' ? '' : shippingCost} onChange={(e) => setShippingCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2.5" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.customs} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={customsAndVat === '' ? '' : customsAndVat} onChange={(e) => setCustomsAndVat(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1.2" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.sellPrice} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={sellingPrice === '' ? '' : sellingPrice} onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="19.9" required />
                  <span className="currency-tag">{text.currency}</span>
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

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.netProfit}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.netProfitSub}</div>
            </div>
            <div className="result-value">
              {netProfit.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.margin}</span>
            <span className="result-value" style={{ color: profitMarginPercent > 0 ? '#047857' : '#dc2626' }}>{profitMarginPercent.toFixed(2)}%</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.totalCostLabel}</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{totalCost.toFixed(2)} {text.currency}</span>
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
            <option value="sixMonths">{text.filters.sixMonths}</option>
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
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.productName}</div>
                      <div style={{ fontSize: '12px', color: '#CE1126', fontWeight: 700 }}>{item.supplierName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td>{item.productCost} {text.currency}</td>
                    <td>{(item.shippingCost + item.customsAndVat).toFixed(2)} {text.currency}</td>
                    <td style={{ fontWeight: 800 }}>{item.sellingPrice} {text.currency}</td>
                    <td style={{ fontWeight: 900, color: item.netProfit > 0 ? '#047857' : '#dc2626' }}>
                      {item.netProfit} {text.currency}
                    </td>
                    <td>
                      <span style={{ color: item.profitMarginPercent > 0 ? '#047857' : '#dc2626', fontWeight: 900 }}>
                        {item.profitMarginPercent}%
                      </span>
                    </td>
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
                  <td colSpan={5} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td style={{ color: '#047857' }}>{totalProfitSum.toFixed(2)} {text.currency}</td>
                  <td style={{ color: '#047857' }}>{avgMargin.toFixed(2)}%</td>
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
