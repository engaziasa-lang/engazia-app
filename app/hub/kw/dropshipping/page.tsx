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
  createdAtTimestamp?: number; // للفرز الزمني
}

export default function DropshippingCalculatorKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [productName, setProductName] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [customsAndVat, setCustomsAndVat] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');

  const [items, setItems] = useState<DropshipItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month' | '6months' | 'year'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
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
      if (!supplierName) setSupplierName('AliExpress / External Supplier');
    } else {
      if (!supplierName) setSupplierName('AliExpress / مورد خارجي');
    }

    const saved = localStorage.getItem('seerk_kw_dropshipping_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: DropshipItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_dropshipping_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة أرباح الدروبشيبينغ 🌍',
      desc: 'احسب هوامش الربح للمنتجات المستوردة مع أخذ رسوم الجمارك والشحن الدولي في الحسبان في السوق الكويتي',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب أرباح منتج دروبشيبينغ جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodName: 'اسم المنتج',
      prodPH: 'مثال: ساعة ذكية مقاومة للماء',
      supplierLabel: 'اسم المورد (اختياري)',
      supplierPH: 'AliExpress',
      costLabel: 'تكلفة شراء المنتج',
      shipLabel: 'تكلفة الشحن الدولي',
      customsLabel: 'الجمارك والضريبة التقديرية',
      sellLabel: 'سعر البيع المستهدف في متجرك',
      currency: 'د.ك',
      saveBtnNew: '+ حفظ الحساب في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'تحليل الربحية الفوري',
      netProfitLabel: 'صافي الربح الفعلي للقطعة',
      netProfitSub: 'الربح الصافي بعد خصم الشحن والجمارك',
      marginLabel: 'هامش الربح الصافي (%)',
      totalCostLabel: 'إجمالي التكلفة (شراء + شحن + جمارك)',
      searchPH: '🔍 بحث باسم المنتج أو المورد...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      fromDate: 'من',
      toDate: 'إلى',
      filter: {
        all: 'الكل',
        day: 'يوم',
        week: 'أسبوع',
        month: 'شهر',
        sixMonths: '6 أشهر',
        year: 'سنة'
      },
      table: {
        noRecords: 'لا توجد منتجات دروبشيبينغ مسجلة تطابق بحثك والفترة المحددة.',
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
      desc: 'Calculate profit margins for imported products factoring in custom duties and international shipping in Kuwait',
      editRecord: 'Edit Record',
      newRecord: 'Calculate New Dropshipping Product',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodName: 'Product Name',
      prodPH: 'e.g. Waterproof Smartwatch',
      supplierLabel: 'Supplier Name (Optional)',
      supplierPH: 'AliExpress',
      costLabel: 'Product Purchase Cost',
      shipLabel: 'International Shipping Cost',
      customsLabel: 'Estimated Customs & VAT',
      sellLabel: 'Target Selling Price in Store',
      currency: 'KWD',
      saveBtnNew: '+ Save Calculation to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Profitability Analysis',
      netProfitLabel: 'Actual Net Profit per Item',
      netProfitSub: 'Net profit after shipping and customs',
      marginLabel: 'Net Profit Margin (%)',
      totalCostLabel: 'Total Cost (Purchase + Shipping + Customs)',
      searchPH: '🔍 Search by product name or supplier...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      fromDate: 'From',
      toDate: 'To',
      filter: {
        all: 'All',
        day: '1 Day',
        week: '1 Week',
        month: '1 Month',
        sixMonths: '6 Months',
        year: '1 Year'
      },
      table: {
        noRecords: 'No dropshipping products found matching your search and date range.',
        th1: '#',
        th2: 'Product, Supplier & Date',
        th3: 'Purchase Cost',
        th4: 'Shipping & Customs',
        th5: 'Selling Price',
        th6: 'Net Profit',
        th7: 'Profit Margin (%)',
        th8: 'Actions',
        totalLabel: 'Grand Total / Average Margin'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 products). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure product name, selling price, and product costs are entered correctly.',
        updateSuccess: '✨ Profit calculator updated successfully!',
        saveSuccess: '✅ Product added to dropshipping profits log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const cost = typeof productCost === 'number' ? productCost : 0;
  const shipping = typeof shippingCost === 'number' ? shippingCost : 0;
  const customs = typeof customsAndVat === 'number' ? customsAndVat : 0;
  const price = typeof sellingPrice === 'number' ? sellingPrice : 0;

  const totalCost = cost + shipping + customs;
  const netProfit = price - totalCost;
  const profitMarginPercent = price > 0 ? (netProfit / price) * 100 : 0;

  const handleClearForm = () => {
    setProductName('');
    setSupplierName(lang === 'ar' ? 'AliExpress / مورد خارجي' : 'AliExpress / External Supplier');
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
    const localeStr = lang === 'ar' ? 'ar-KW' : 'en-KW';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;
    const currentTimestamp = Date.now();

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        supplierName: supplierName || (lang === 'ar' ? 'مورد خارجي' : 'External Supplier'),
        productCost: cost,
        shippingCost: shipping,
        customsAndVat: customs,
        sellingPrice: price,
        netProfit: Number(netProfit.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
        createdAt: item.createdAt || formattedDate,
        createdAtTimestamp: item.createdAtTimestamp || currentTimestamp
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: DropshipItem = {
        id: Date.now().toString(),
        productName,
        supplierName: supplierName || (lang === 'ar' ? 'مورد خارجي' : 'External Supplier'),
        productCost: cost,
        shippingCost: shipping,
        customsAndVat: customs,
        sellingPrice: price,
        netProfit: Number(netProfit.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
        createdAt: formattedDate,
        createdAtTimestamp: currentTimestamp
      };
      saveToLocalStorage([...items, newItem]);
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

  // تصفية النتائج بناءً على البحث، نطاق التاريخ، والفرز السريع
  const filteredItems = items.filter(item => {
    const matchesSearch = (item?.productName || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
                          (item?.supplierName || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    if (!matchesSearch) return false;

    if (item.createdAtTimestamp) {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (item.createdAtTimestamp < start.getTime()) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (item.createdAtTimestamp > end.getTime()) return false;
      }
    }

    if (timeFilter === 'all') return true;
    if (!item.createdAtTimestamp) return true;

    const now = Date.now();
    const diff = now - item.createdAtTimestamp;
    const dayMs = 24 * 60 * 60 * 1000;

    if (timeFilter === 'day') return diff <= dayMs;
    if (timeFilter === 'week') return diff <= 7 * dayMs;
    if (timeFilter === 'month') return diff <= 30 * dayMs;
    if (timeFilter === '6months') return diff <= 180 * dayMs;
    if (timeFilter === 'year') return diff <= 365 * dayMs;

    return true;
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
          </style>
        </head>
        <body>
          <h2>Dropshipping Profit Calculator Report (KW)</h2>
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

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.productName} (${row.supplierName})</td>
          <td>${row.productCost}</td>
          <td>${row.shippingCost + row.customsAndVat}</td>
          <td>${row.sellingPrice}</td>
          <td>${row.netProfit}</td>
          <td>${row.profitMarginPercent}%</td>
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
    link.setAttribute("download", "enjazya_kw_dropshipping.xls");
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

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2); }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        /* شريط الأدوات بترتيب احترافي بصف واحد متناسق تماماً بدون فراغات مزعجة */
        .table-toolbar { display: flex; justify-content: flex-start; align-items: center; margin-bottom: 20px; flex-wrap: nowrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; overflow-x: auto; padding-bottom: 8px; }
        
        .search-input-wrapper { position: relative; display: flex; align-items: center; flex-shrink: 0; width: 175px; }
        .search-input-wrapper span { position: absolute; ${lang === 'ar' ? 'right: 12px' : 'left: 12px'}; font-size: 13px; pointer-events: none; }
        .search-input { padding: 8px 12px; ${lang === 'ar' ? 'padding-right: 34px' : 'padding-left: 34px'}; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; font-size: 12.5px; outline: none; width: 100%; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; background: #ffffff; color: #0f172a; font-weight: 600; }
        .search-input:focus { border-color: #0284c7; background: #f8fafc; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }

        .filter-row { display: flex; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 4px; gap: 3px; flex-shrink: 0; }
        .filter-btn { background: transparent; border: none; padding: 6px 10px; border-radius: 7px; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; font-family: inherit; white-space: nowrap; }
        .filter-btn:hover { color: #0f172a; background: #f1f5f9; }
        .filter-btn.active { background: #f8fafc; color: #0284c7; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;}

        .date-filter-box { display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 6px 10px; font-size: 12px; font-weight: 700; color: #475569; flex-shrink: 0; }
        .date-filter-box input[type="date"] { border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 6px; font-family: inherit; font-size: 11.5px; outline: none; background: #f8fafc; color: #0f172a; width: 115px; cursor: pointer;}

        .table-btns { display: flex; gap: 8px; flex-wrap: nowrap; flex-shrink: 0; ${lang === 'ar' ? 'margin-right: auto;' : 'margin-left: auto;'} }
        .t-btn { padding: 8px 14px; border-radius: 10px; font-weight: 700; font-size: 12.5px; cursor: pointer; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; transition: all 0.2s; white-space: nowrap; gap: 6px; }
        .t-btn:hover { background: #f8fafc; color: #0284c7; border-color: #0284c7; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
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
            <div className="form-row">
              <div className="input-group">
                <label>{text.prodName}</label>
                <div className="input-wrapper">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.supplierLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder={text.supplierPH} required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.costLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={productCost === '' ? '' : productCost} onChange={(e) => setProductCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="4.5" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.shipLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={shippingCost === '' ? '' : shippingCost} onChange={(e) => setShippingCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2.0" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.customsLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={customsAndVat === '' ? '' : customsAndVat} onChange={(e) => setCustomsAndVat(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1.0" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.sellLabel} ({text.currency})</label>
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
          <h2 className="card-title">{text.resultsTitle}</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.netProfitLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.netProfitSub}</div>
            </div>
            <div className="result-value">
              {netProfit.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #16a34a' : 'none', borderLeft: lang === 'en' ? '4px solid #16a34a' : 'none' }}>
            <span className="result-label">{text.marginLabel}</span>
            <span className="result-value" style={{ color: profitMarginPercent > 0 ? '#16a34a' : '#dc2626' }}>{profitMarginPercent.toFixed(2)}%</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.totalCostLabel}</span>
            <span className="result-value" style={{ color: '#0f172a' }}>{totalCost.toFixed(2)} {text.currency}</span>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <div className="search-input-wrapper">
            <span>🔍</span>
            <input 
              type="text" 
              className="search-input" 
              placeholder={text.searchPH.replace('🔍 ', '')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <button className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`} onClick={() => setTimeFilter('all')}>{text.filter.all}</button>
            <button className={`filter-btn ${timeFilter === 'day' ? 'active' : ''}`} onClick={() => setTimeFilter('day')}>{text.filter.day}</button>
            <button className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`} onClick={() => setTimeFilter('week')}>{text.filter.week}</button>
            <button className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`} onClick={() => setTimeFilter('month')}>{text.filter.month}</button>
            <button className={`filter-btn ${timeFilter === '6months' ? 'active' : ''}`} onClick={() => setTimeFilter('6months')}>{text.filter.sixMonths}</button>
            <button className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`} onClick={() => setTimeFilter('year')}>{text.filter.year}</button>
          </div>

          <div className="date-filter-box">
            <span>{text.fromDate}:</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
            <span>{text.toDate}:</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
            {(startDate || endDate) && (
              <button 
                type="button" 
                onClick={() => { setStartDate(''); setEndDate(''); }} 
                style={{ background: '#fee2e2', border: 'none', color: '#991b1b', borderRadius: '4px', padding: '1px 5px', cursor: 'pointer', fontSize: '10px', fontWeight: 800 }}
                title="إلغاء تصفية التاريخ"
              >
                ✕
              </button>
            )}
          </div>

          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel}>📥 {text.exportBtn.replace('📥 ', '')}</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 {text.importBtn.replace('📂 ', '')}</button>
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
                      <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: 700 }}>{item.supplierName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td>{item.productCost} {text.currency}</td>
                    <td>{(item.shippingCost + item.customsAndVat).toFixed(2)} {text.currency}</td>
                    <td style={{ fontWeight: 800 }}>{item.sellingPrice} {text.currency}</td>
                    <td style={{ fontWeight: 900, color: item.netProfit > 0 ? '#16a34a' : '#dc2626' }}>
                      {item.netProfit} {text.currency}
                    </td>
                    <td>
                      <span style={{ color: item.profitMarginPercent > 0 ? '#16a34a' : '#dc2626', fontWeight: 900 }}>
                        {item.profitMarginPercent}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                  <td colSpan={5} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td style={{ color: '#16a34a' }}>{totalProfitSum.toFixed(2)} {text.currency}</td>
                  <td style={{ color: '#16a34a' }}>{avgMargin.toFixed(2)}%</td>
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
