'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ProfitItem {
  id: string;
  name: string;
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  gatewayFeePercent: number;
  netProfit: number;
  margin: number;
  createdAt?: string;
}

export default function ProfitCalculatorKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [productName, setProductName] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [gatewayFeePercent, setGatewayFeePercent] = useState<number | ''>(2.5);

  const [items, setItems] = useState<ProfitItem[]>([]);
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

    const saved = localStorage.getItem('seerk_kw_profit_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ProfitItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_profit_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة أرباح ونقاط التعادل (بدون ضريبة) 📊',
      desc: 'احسب صافي أرباحك بدقة بعد خصم التكاليف ورسوم الشحن بالدينار الكويتي في السوق الكويتي',
      editRecord: 'تعديل بيانات المنتج',
      newRecord: 'حساب منتج جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodNameLabel: 'اسم المنتج أو الخدمة',
      prodNamePH: 'مثال: عطر فاخر',
      sellPriceLabel: 'سعر بيع المنتج للعميل',
      costLabel: 'تكلفة المنتج الأساسية من المورد',
      shipLabel: 'تكلفة التوصيل والشحن للطلب',
      gatewayLabel: 'رسوم بوابة الدفع (%)',
      currency: 'د.ك',
      saveBtnNew: '+ حفظ وإضافة المنتج للجدول',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'التحليل المالي الفوري',
      netProfitLabel: 'صافي الربح الفعلي للقطعة الواحدة',
      netProfitSub: 'بعد خصم التكلفة، الشحن، وبوابة الدفع',
      marginLabel: 'هامش الربح الصافي (%)',
      totalCostLabel: 'إجمالي التكاليف الشاملة للطلب',
      searchPH: '🔍 بحث في المنتجات المحفوظة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد منتجات مسجلة في الجدول حالياً. قم بإضافة منتج عبر نموذج الحاسبة أعلاه.',
        th1: '#',
        th2: 'اسم المنتج والتاريخ',
        th3: 'سعر البيع',
        th4: 'التكلفة والشحن',
        th5: 'صافي الربح',
        th6: 'هامش الربح',
        th7: 'الإجراءات',
        editBtn: 'تعديل',
        delBtn: 'حذف',
        totalLabel: 'الإجمالي الكلي / المتوسط'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 منتجات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء إدخال اسم المنتج وسعر بيع صحيح.',
        updateSuccess: '✨ تم تحديث بيانات المنتج بنجاح!',
        saveSuccess: '✅ تمت إضافة المنتج إلى جدول التحليل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا المنتج من الجدول؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Profit & Break-Even Calculator (Tax-Free) 📊',
      desc: 'Accurately calculate net profits after deducting costs and shipping fees in KWD for the Kuwaiti market',
      editRecord: 'Edit Product Data',
      newRecord: 'Calculate New Product',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodNameLabel: 'Product or Service Name',
      prodNamePH: 'e.g. Luxury Perfume',
      sellPriceLabel: 'Customer Selling Price',
      costLabel: 'Original Product Cost from Supplier',
      shipLabel: 'Delivery & Shipping Cost per Order',
      gatewayLabel: 'Payment Gateway Fee (%)',
      currency: 'KWD',
      saveBtnNew: '+ Save & Add Product to Table',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Financial Analysis',
      netProfitLabel: 'Actual Net Profit per Single Unit',
      netProfitSub: 'After deducting cost, shipping, and payment gateway',
      marginLabel: 'Net Profit Margin (%)',
      totalCostLabel: 'Total Comprehensive Order Costs',
      searchPH: '🔍 Search saved products...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No products currently registered in table. Add a product using the calculator form above.',
        th1: '#',
        th2: 'Product & Date',
        th3: 'Selling Price',
        th4: 'Cost & Shipping',
        th5: 'Net Profit',
        th6: 'Profit Margin',
        th7: 'Actions',
        editBtn: 'Edit',
        delBtn: 'Delete',
        totalLabel: 'Grand Total / Average'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 products). Please upgrade to unlock unlimited access!',
        fillErr: 'Please enter a valid product name and selling price.',
        updateSuccess: '✨ Product data updated successfully!',
        saveSuccess: '✅ Product added to analysis table successfully!',
        delConfirm: 'Are you sure you want to delete this product from the table?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const sPrice = typeof sellingPrice === 'number' ? sellingPrice : 0;
  const pCost = typeof productCost === 'number' ? productCost : 0;
  const sCost = typeof shippingCost === 'number' ? shippingCost : 0;
  const gFee = typeof gatewayFeePercent === 'number' ? gatewayFeePercent : 0;

  const gatewayFeeAmount = sPrice * (gFee / 100);
  const totalCosts = pCost + sCost + gatewayFeeAmount;
  const netProfit = sPrice - totalCosts;
  const margin = sPrice > 0 ? (netProfit / sPrice) * 100 : 0;

  const handleClearForm = () => {
    setProductName('');
    setSellingPrice('');
    setProductCost('');
    setShippingCost('');
    setGatewayFeePercent(2.5);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!productName.trim() || sPrice <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-KW' : 'en-KW';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        name: productName,
        sellingPrice: sPrice,
        productCost: pCost,
        shippingCost: sCost,
        gatewayFeePercent: gFee,
        netProfit: Number(netProfit.toFixed(3)),
        margin: Number(margin.toFixed(1))
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: ProfitItem = {
        id: Date.now().toString(),
        name: productName,
        sellingPrice: sPrice,
        productCost: pCost,
        shippingCost: sCost,
        gatewayFeePercent: gFee,
        netProfit: Number(netProfit.toFixed(3)),
        margin: Number(margin.toFixed(1)),
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: ProfitItem) => {
    setProductName(item.name);
    setSellingPrice(item.sellingPrice);
    setProductCost(item.productCost);
    setShippingCost(item.shippingCost);
    setGatewayFeePercent(item.gatewayFeePercent);
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

    const totalSellingPrice = items.reduce((acc, curr) => acc + curr.sellingPrice, 0);
    const totalCostsValue = items.reduce((acc, curr) => acc + curr.productCost + curr.shippingCost, 0);
    const totalNetProfitValue = items.reduce((acc, curr) => acc + curr.netProfit, 0);
    const overallMargin = totalSellingPrice > 0 ? (totalNetProfitValue / totalSellingPrice) * 100 : 0;

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
          <h2>Profit Calculator Report (KW)</h2>
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
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.name}</td>
          <td>${row.sellingPrice}</td>
          <td>${row.productCost + row.shippingCost}</td>
          <td>${row.netProfit}</td>
          <td>${row.margin}%</td>
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
    link.setAttribute("download", "enjazya_kw_profit_analysis.xls");
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

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalSellingPrice = filteredItems.reduce((acc, curr) => acc + curr.sellingPrice, 0);
  const totalCostsValue = filteredItems.reduce((acc, curr) => acc + curr.productCost + curr.shippingCost, 0);
  const totalNetProfitValue = filteredItems.reduce((acc, curr) => acc + curr.netProfit, 0);
  const overallMargin = totalSellingPrice > 0 ? (totalNetProfitValue / totalSellingPrice) * 100 : 0;

  return (
    <div className="tool-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f1f5f9; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 10px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f8fafc; color: #0f172a; border-color: #0284c7; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input { width: 100%; padding: 10px 45px 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 15px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2); }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2); }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value, .danger .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .t-btn:hover { background: #f1f5f9; color: #0284c7; border-color: #0284c7; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 700px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit; transition: all 0.2s; }
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-edit:hover { background: #bae6fd; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-delete:hover { background: #fca5a5; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/kw" className="back-btn">
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
              <label>{text.prodNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodNamePH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.sellPriceLabel} ({text.currency})</label>
              <div className="input-wrapper">
                <input type="number" step="0.001" min="0" value={sellingPrice === '' ? '' : sellingPrice} onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="20" required />
                <span className="currency-tag">{text.currency}</span>
              </div>
            </div>

            <div className="input-group">
              <label>{text.costLabel} ({text.currency})</label>
              <div className="input-wrapper">
                <input type="number" step="0.001" min="0" value={productCost === '' ? '' : productCost} onChange={(e) => setProductCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="6" required />
                <span className="currency-tag">{text.currency}</span>
              </div>
            </div>

            <div className="input-group">
              <label>{text.shipLabel} ({text.currency})</label>
              <div className="input-wrapper">
                <input type="number" step="0.001" min="0" value={shippingCost === '' ? '' : shippingCost} onChange={(e) => setShippingCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1.5" />
                <span className="currency-tag">{text.currency}</span>
              </div>
            </div>

            <div className="input-group">
              <label>{text.gatewayLabel}</label>
              <div className="input-wrapper">
                <input type="number" step="0.1" min="0" value={gatewayFeePercent === '' ? '' : gatewayFeePercent} onChange={(e) => setGatewayFeePercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2.5" />
                <span className="currency-tag">%</span>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.resultsTitle}</h2>

          <div className={`result-box ${netProfit > 0 ? 'primary' : 'danger'}`}>
            <div>
              <div className="result-label">{text.netProfitLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.netProfitSub}</div>
            </div>
            <div className="result-value">
              {netProfit.toFixed(3)} {text.currency}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0284c7' : 'none', borderLeft: lang === 'en' ? '4px solid #0284c7' : 'none' }}>
            <span className="result-label">{text.marginLabel}</span>
            <span className="result-value" style={{ color: margin >= 20 ? '#0284c7' : '#d97706' }}>
              {margin.toFixed(1)}%
            </span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #dc2626' : 'none', borderLeft: lang === 'en' ? '4px solid #dc2626' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.totalCostLabel}</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{totalCosts.toFixed(3)} {text.currency}</span>
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
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.name}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td>{item.sellingPrice.toFixed(3)} {text.currency}</td>
                    <td>{(item.productCost + item.shippingCost).toFixed(3)} {text.currency}</td>
                    <td style={{ color: item.netProfit > 0 ? '#0284c7' : '#dc2626', fontWeight: 900 }}>{item.netProfit.toFixed(3)} {text.currency}</td>
                    <td>{item.margin}%</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">{text.table.editBtn}</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">{text.table.delBtn}</button>
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
                  <td>{totalSellingPrice.toFixed(3)} {text.currency}</td>
                  <td>{totalCostsValue.toFixed(3)} {text.currency}</td>
                  <td style={{ color: totalNetProfitValue > 0 ? '#0284c7' : '#dc2626' }}>{totalNetProfitValue.toFixed(3)} {text.currency}</td>
                  <td style={{ color: overallMargin > 0 ? '#0284c7' : '#dc2626' }}>{overallMargin.toFixed(1)}%</td>
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
