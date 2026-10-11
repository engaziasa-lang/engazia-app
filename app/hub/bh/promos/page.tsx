'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface DiscountItem {
  id: string;
  offerName: string;
  offerType: string;
  originalPrice: number;
  productCost: number;
  discountValue: number;
  finalSellingPrice: number;
  netProfitAfterOffer: number;
  profitMarginPercent: number;
  isProfitable: boolean;
  createdAt?: string;
  timestamp?: number;
}

export default function DiscountCalculatorBH() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [offerName, setOfferName] = useState<string>('');
  const [typeSelect, setTypeSelect] = useState<string>('');
  const [customOfferType, setCustomOfferType] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>(20);
  const [productCost, setProductCost] = useState<number | ''>(8);
  const [discountValue, setDiscountValue] = useState<number | ''>(20);

  const [items, setItems] = useState<DiscountItem[]>([]);
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
      setOfferName('Discount Code (SAVE20)');
      setTypeSelect('Percentage Discount (%) 📉');
      setCustomOfferType('Percentage Discount (%) 📉');
    } else {
      setOfferName('كود خصم (SAVE20)');
      setTypeSelect('خصم نسبة مئوية (%) 📉');
      setCustomOfferType('خصم نسبة مئوية (%) 📉');
    }

    const saved = localStorage.getItem('seerk_bh_discount_calculator_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: DiscountItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_bh_discount_calculator_items', JSON.stringify(newItems));
  };

  const origPrice = typeof originalPrice === 'number' ? originalPrice : 0;
  const cost = typeof productCost === 'number' ? productCost : 0;
  const disc = typeof discountValue === 'number' ? discountValue : 0;

  const isPercent = typeSelect.includes('%') || typeSelect.includes('نسبة') || typeSelect.includes('Percent');
  const isFixed = typeSelect.includes('مبلغ ثابت') || typeSelect.includes('Fixed') || typeSelect.includes('BHD') || typeSelect.includes('د.ب');
  const isBogo = typeSelect.includes('1+1');

  let finalSellingPrice = origPrice;
  if (isPercent) {
    finalSellingPrice = origPrice - (origPrice * (disc / 100));
  } else if (isFixed) {
    finalSellingPrice = origPrice - disc;
  } else if (isBogo) {
    finalSellingPrice = origPrice;
  } else {
    finalSellingPrice = origPrice - disc;
  }

  const netProfitAfterOffer = isBogo ? origPrice - (cost * 2) : finalSellingPrice - cost;
  const profitMarginPercent = finalSellingPrice > 0 ? (netProfitAfterOffer / finalSellingPrice) * 100 : 0;
  const isProfitable = netProfitAfterOffer > 0;

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة جدوى أكواد الخصم والعروض 🎟️',
      desc: 'تأكد من أن عروضك الترويجية (مثل 1+1 أو الشحن المجاني) لا تسبب لك خسائر مالية مخفية في متجرك بمملكة البحرين',
      editRecord: 'تعديل السجل',
      newRecord: 'حساب جدوى عرض أو كود جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      offerName: 'اسم العرض أو كود الخصم',
      offerNamePH: 'مثال: كود خصم (SAVE20)',
      offerType: 'نوع العرض أو الخصم',
      optPercent: 'خصم نسبة مئوية (%) 📉',
      optFixed: 'خصم مبلغ ثابت (د.ب) 💵',
      optBogo: 'عرض 1+1 مجاناً 🎁',
      optOther: '➕ نوع آخر (كتابة يدوية)',
      otherPH: 'اكتب نوع العرض هنا...',
      origPrice: 'سعر البيع الأصلي',
      origPricePH: '20',
      prodCost: 'تكلفة المنتج الأساسية',
      prodCostPH: '8',
      discValFixed: 'قيمة الخصم',
      discValPercent: 'نسبة الخصم (%)',
      discPH: '20',
      saveBtnNew: '+ حفظ حساب الجدوى في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'تحليل جدوى العرض الفوري',
      netProfit: 'صافي الربح بعد تطبيق العرض',
      netProfitSub: 'الربح الصافي للقطعة بعد الخصم',
      finalPriceLabel: 'سعر البيع النهائي بعد الخصم',
      statusLabel: 'حالة جدوى العرض',
      statusProfitable: 'العرض مربح ✅',
      statusLoss: 'العرض يسبب خسارة ⚠️',
      currency: 'د.ب',
      searchPH: '🔍 بحث باسم العرض أو الكود...',
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
        noRecords: 'لا توجد حسابات جدوى عروض تطابق بحثك حالياً.',
        th1: '#',
        th2: 'العرض والكود والتاريخ',
        th3: 'نوع العرض',
        th4: 'السعر الأصلي والتكلفة',
        th5: 'السعر بعد الخصم',
        th6: 'صافي الربح',
        th7: 'الحالة',
        th8: 'الإجراءات',
        costLabel: 'تكلفة',
        profitable: 'مربح ✅',
        loss: 'خسارة ⚠️',
        totalLabel: 'إجمالي الأرباح المتوقعة من العروض المحددة'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 عروض). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم العرض، سعر البيع الأصلي، والتكلفة بشكل صحيح.',
        updateSuccess: '✨ تم تحديث حساب الجدوى بنجاح!',
        saveSuccess: '✅ تمت إضافة عرض الخصم إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات العروض بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Discount & Promo Code ROI Calculator 🎟️',
      desc: 'Ensure your promotional offers (like 1+1 or free shipping) do not cause hidden financial losses in your Bahrain store',
      editRecord: 'Edit Record',
      newRecord: 'Calculate New Offer or Code',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      offerName: 'Offer or Discount Code Name',
      offerNamePH: 'e.g. Discount Code (SAVE20)',
      offerType: 'Offer or Discount Type',
      optPercent: 'Percentage Discount (%) 📉',
      optFixed: 'Fixed Amount Discount (BHD) 💵',
      optBogo: 'Buy 1 Get 1 Free (1+1) 🎁',
      optOther: '➕ Other (Manual Entry)',
      otherPH: 'Type offer type here...',
      origPrice: 'Original Selling Price',
      origPricePH: '20',
      prodCost: 'Base Product Cost',
      prodCostPH: '8',
      discValFixed: 'Discount Value',
      discValPercent: 'Discount Percentage (%)',
      discPH: '20',
      saveBtnNew: '+ Save Feasibility to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Offer Feasibility Analysis',
      netProfit: 'Net Profit After Offer',
      netProfitSub: 'Net profit per item after discount',
      finalPriceLabel: 'Final Selling Price After Discount',
      statusLabel: 'Offer Feasibility Status',
      statusProfitable: 'Profitable Offer ✅',
      statusLoss: 'Offer Causes Loss ⚠️',
      currency: 'BHD',
      searchPH: '🔍 Search by offer name or code...',
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
        noRecords: 'No offer feasibility calculations match your search.',
        th1: '#',
        th2: 'Offer, Code & Date',
        th3: 'Offer Type',
        th4: 'Original Price & Cost',
        th5: 'Price After Discount',
        th6: 'Net Profit',
        th7: 'Status',
        th8: 'Actions',
        costLabel: 'Cost',
        profitable: 'Profitable ✅',
        loss: 'Loss ⚠️',
        totalLabel: 'Total Expected Profits from Selected Offers'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 offers). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure offer name, original price, and cost are filled correctly.',
        updateSuccess: '✨ Feasibility record updated successfully!',
        saveSuccess: '✅ Discount offer added to log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Offer data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];
  const actualOfferType = typeSelect === text.optOther ? customOfferType : typeSelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTypeSelect(val);
    if (val !== text.optOther) {
      setCustomOfferType(val);
    } else {
      setCustomOfferType('');
    }
  };

  const handleClearForm = () => {
    if (lang === 'en') {
      setOfferName('Discount Code (SAVE20)');
      setTypeSelect('Percentage Discount (%) 📉');
      setCustomOfferType('Percentage Discount (%) 📉');
    } else {
      setOfferName('كود خصم (SAVE20)');
      setTypeSelect('خصم نسبة مئوية (%) 📉');
      setCustomOfferType('خصم نسبة مئوية (%) 📉');
    }
    setOriginalPrice(20);
    setProductCost(8);
    setDiscountValue(20);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!offerName.trim() || origPrice <= 0 || cost <= 0) {
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
        offerName,
        offerType: actualOfferType,
        originalPrice: origPrice,
        productCost: cost,
        discountValue: disc,
        finalSellingPrice: Number(finalSellingPrice.toFixed(2)),
        netProfitAfterOffer: Number(netProfitAfterOffer.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
        isProfitable,
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: DiscountItem = {
        id: Date.now().toString(),
        offerName,
        offerType: actualOfferType,
        originalPrice: origPrice,
        productCost: cost,
        discountValue: disc,
        finalSellingPrice: Number(finalSellingPrice.toFixed(2)),
        netProfitAfterOffer: Number(netProfitAfterOffer.toFixed(2)),
        profitMarginPercent: Number(profitMarginPercent.toFixed(2)),
        isProfitable,
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); 
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: DiscountItem) => {
    setOfferName(item.offerName);
    
    const itemIsPercent = item.offerType.includes('%') || item.offerType.includes('نسبة');
    const itemIsFixed = item.offerType.includes('ثابت') || item.offerType.includes('Fixed') || item.offerType.includes('BHD') || item.offerType.includes('د.ب');
    const itemIsBogo = item.offerType.includes('1+1');

    let matchedType = '';
    if (itemIsPercent) matchedType = text.optPercent;
    else if (itemIsFixed) matchedType = text.optFixed;
    else if (itemIsBogo) matchedType = text.optBogo;
    else matchedType = text.optOther;

    setTypeSelect(matchedType);
    setCustomOfferType(item.offerType);
    setOriginalPrice(item.originalPrice);
    setProductCost(item.productCost);
    setDiscountValue(item.discountValue);
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
    const matchesSearch = item.offerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.offerType.toLowerCase().includes(searchQuery.toLowerCase());
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

  const totalProfitSum = filteredItems.reduce((acc, curr) => acc + curr.netProfitAfterOffer, 0);

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
                <th>${text.table.th3}</th>
                <th>Date / Time</th>
                <th>${text.origPrice} (${text.currency})</th>
                <th>${text.prodCost} (${text.currency})</th>
                <th>${text.table.th5} (${text.currency})</th>
                <th>${text.table.th6} (${text.currency})</th>
                <th>Margin (%)</th>
                <th>${text.table.th7}</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
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
          <td>${row.isProfitable ? text.table.profitable : text.table.loss}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="7">${text.table.totalLabel}</td>
                <td colspan="3">${totalProfitSum.toFixed(2)} ${text.currency}</td>
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
    link.setAttribute("download", `enjazya_bh_discount_feasibility_${dateFilter}.xls`);
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
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #CE1126; background: #ffffff; }
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
            <div className="input-group">
              <label>{text.offerName}</label>
              <div className="input-wrapper">
                <input type="text" value={offerName} onChange={(e) => setOfferName(e.target.value)} placeholder={text.offerNamePH} required />
              </div>
            </div>
            <div className="input-group">
              <label>{text.offerType}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={typeSelect} onChange={handleSelectChange}>
                  <option value={text.optPercent}>{text.optPercent}</option>
                  <option value={text.optFixed}>{text.optFixed}</option>
                  <option value={text.optBogo}>{text.optBogo}</option>
                  <option value={text.optOther}>{text.optOther}</option>
                </select>
              </div>

              {typeSelect === text.optOther && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customOfferType} 
                    onChange={(e) => setCustomOfferType(e.target.value)} 
                    placeholder={text.otherPH} 
                    required 
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.origPrice} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={originalPrice === '' ? '' : originalPrice} onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.origPricePH} required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.prodCost} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={productCost === '' ? '' : productCost} onChange={(e) => setProductCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.prodCostPH} required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            {!isBogo && (
              <div className="input-group">
                <label>{isFixed ? `${text.discValFixed} (${text.currency})` : text.discValPercent}</label>
                <div className="input-wrapper">
                  <input type="number" step="0.01" min="0" value={discountValue === '' ? '' : discountValue} onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.discPH} required />
                </div>
              </div>
            )}

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.analysisTitle}</h2>

          <div className={`result-box ${netProfitAfterOffer > 0 ? 'primary' : ''}`} style={netProfitAfterOffer <= 0 ? { background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', color: '#fff', border: 'none', padding: '20px' } : {}}>
            <div>
              <div className="result-label" style={{ color: '#fff' }}>{text.netProfit}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px', color: '#fff' }}>{text.netProfitSub}</div>
            </div>
            <div className="result-value" style={{ fontSize: '26px', color: '#ffffff', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
              {netProfitAfterOffer.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.finalPriceLabel}</span>
            <span className="result-value" style={{ color: '#CE1126' }}>{finalSellingPrice.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.statusLabel}</span>
            <span className="result-value" style={{ color: isProfitable ? '#047857' : '#dc2626' }}>
              {isProfitable ? text.statusProfitable : text.statusLoss}
            </span>
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
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.offerName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#CE1126' }}>{item.offerType}</span></td>
                    <td>{item.originalPrice} {text.currency} <br/><span style={{ color: '#64748b', fontSize: '12px' }}>({text.table.costLabel}: {item.productCost})</span></td>
                    <td style={{ fontWeight: 800 }}>{item.finalSellingPrice} {text.currency}</td>
                    <td style={{ fontWeight: 900, color: item.netProfitAfterOffer > 0 ? '#047857' : '#dc2626' }}>
                      {item.netProfitAfterOffer} {text.currency}
                    </td>
                    <td>
                      <span style={{ color: item.isProfitable ? '#047857' : '#dc2626', background: item.isProfitable ? '#d1fae5' : '#fee2e2', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                        {item.isProfitable ? text.table.profitable : text.table.loss}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="✏️">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="❌">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={7} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td colspan="3" style={{ color: '#047857' }}>{totalProfitSum.toFixed(2)} {text.currency}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
