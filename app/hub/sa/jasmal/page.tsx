'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface JasmalItem {
  id: string;
  competitorName: string;
  productName: string;
  productPrice: number;
  productUrl: string;
  category: string;
  notes: string;
  createdAt?: string;
}

export default function JasmalScraperSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [competitorName, setCompetitorName] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [productUrl, setProductUrl] = useState<string>('');
  
  const [categorySelect, setCategorySelect] = useState<string>('منتجات إلكترونية وتكنولوجية');
  const [customCategory, setCustomCategory] = useState<string>('منتجات إلكترونية وتكنولوجية');
  
  const [notes, setNotes] = useState<string>('منتج منافس قوي في السوق');

  const [items, setItems] = useState<JasmalItem[]>([]);
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
      setCategorySelect('Electronic & Tech Products');
      setCustomCategory('Electronic & Tech Products');
      setNotes('Strong competitor product in the market');
    } else {
      setCategorySelect('منتجات إلكترونية وتكنولوجية');
      setCustomCategory('منتجات إلكترونية وتكنولوجية');
      setNotes('منتج منافس قوي في السوق');
    }

    const saved = localStorage.getItem('seerk_jasmal_scraper_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: JasmalItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_jasmal_scraper_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'جاسمال (Jasmal) لاستخراج البيانات 🕷️',
      desc: 'اسحب بيانات المنتجات والأسعار من المتاجر المنافسة ورتبها فوراً في ملفات إكسل في السوق السعودي',
      editRecord: 'تعديل بيانات المنتج',
      newRecord: 'إضافة منتج منافس جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      compNameLabel: 'اسم المتجر المنافس',
      compPH: 'مثال: متجر نون / زليج',
      prodNameLabel: 'اسم المنتج المنافس',
      prodPH: 'مثال: ساعة يد رجالية جلد',
      priceLabel: 'سعر المنتج المنافس',
      catLabel: 'التصنيف',
      optElect: 'منتجات إلكترونية وتكنولوجية 💻',
      optFashion: 'أزياء وملابس رجالية/نسائية 👕',
      optPerfume: 'عطور وبخور وعناية شخصية 🌸',
      optAccessory: 'أكسسوارات وساعات ⌚',
      optCustom: '➕ تصنيف آخر (كتابة يدوية)',
      customPH: 'اكتب التصنيف المخصص هنا...',
      urlLabel: 'رابط المنتج المنافس (اختياري)',
      urlPH: 'https://competitor.com/product/123',
      notesLabel: 'ملاحظات أو مميزات المنتج',
      notesPH: 'يشمل توصيل مجاني وضمان سنتين',
      currency: 'ر.س',
      saveBtnNew: '+ استخراج وإضافة المنتج للسجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات الاستخبارات الفورية',
      totalResLabel: 'إجمالي المنتجات المنافسة المرصودة',
      totalResSub: 'قاعدة بيانات الأسعار المرصودة',
      avgPriceLabel: 'متوسط أسعار المنافسين',
      statusLabel: 'حالة أداة الاستخراج',
      statusVal: 'نشطة وجاهزة للتصدير 🟢',
      searchPH: '🔍 بحث باسم المتجر أو المنتج...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد منتجات منافسة مسجلة حالياً.',
        th1: '#',
        th2: 'المتجر والتاريخ',
        th3: 'اسم المنتج والتصنيف',
        th4: 'السعر المنافس',
        th5: 'الرابط والملاحظات',
        th6: 'الإجراءات',
        visitLink: '🔗 زيارة الرابط',
        noLink: 'بدون رابط',
        totalLabel: 'متوسط أسعار المنافسين الإجمالي'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 منتجات مستخرجة). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المنافس، اسم المنتج، التصنيف، وسعر صحيح.',
        updateSuccess: '✨ تم تحديث بيانات المنتج بنجاح!',
        saveSuccess: '✅ تمت إضافة المنتج المنافس إلى قاعدة بيانات جاسمال بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات المنتجات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Jasmal Data Extraction Tool 🕷️',
      desc: 'Extract product data and prices from competitor stores and organize them instantly into Excel files in Saudi Arabia',
      editRecord: 'Edit Product Data',
      newRecord: 'Add New Competitor Product',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      compNameLabel: 'Competitor Store Name',
      compPH: 'e.g. Noon / Amazon',
      prodNameLabel: 'Competitor Product Name',
      prodPH: 'e.g. Leather Men Watch',
      priceLabel: 'Competitor Product Price',
      catLabel: 'Category',
      optElect: 'Electronic & Tech Products 💻',
      optFashion: 'Men/Women Fashion & Apparel 👕',
      optPerfume: 'Perfumes & Personal Care 🌸',
      optAccessory: 'Accessories & Watches ⌚',
      optCustom: '➕ Other Category (Custom)',
      customPH: 'Type custom category here...',
      urlLabel: 'Competitor Product URL (Optional)',
      urlPH: 'https://competitor.com/product/123',
      notesLabel: 'Notes or Product Features',
      notesPH: 'Includes free shipping and 2-year warranty',
      currency: 'SAR',
      saveBtnNew: '+ Extract & Add Product to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Intelligence Indicators',
      totalResLabel: 'Total Monitored Competitor Products',
      totalResSub: 'Monitored price database',
      avgPriceLabel: 'Competitors Average Price',
      statusLabel: 'Extraction Tool Status',
      statusVal: 'Active & Ready for Export 🟢',
      searchPH: '🔍 Search by store or product...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No competitor products currently registered.',
        th1: '#',
        th2: 'Store & Date',
        th3: 'Product Name & Category',
        th4: 'Competitor Price',
        th5: 'URL & Notes',
        th6: 'Actions',
        visitLink: '🔗 Visit Link',
        noLink: 'No Link',
        totalLabel: 'Grand Total Competitors Average Price'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 extracted products). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure competitor name, product name, category, and valid price are entered.',
        updateSuccess: '✨ Product data updated successfully!',
        saveSuccess: '✅ Competitor product added to Jasmal database successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Product data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const price = typeof productPrice === 'number' ? productPrice : 0;
  const finalCategory = (categorySelect === 'تصنيف آخر (كتابة يدوية)' || categorySelect === 'Other Category (Custom)') ? customCategory : categorySelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategorySelect(val);
    if (val !== 'تصنيف آخر (كتابة يدوية)' && val !== 'Other Category (Custom)') {
      setCustomCategory(val);
    } else {
      setCustomCategory('');
    }
  };

  const handleClearForm = () => {
    setCompetitorName('');
    setProductName('');
    setProductPrice('');
    setProductUrl('');
    setCategorySelect(lang === 'ar' ? 'منتجات إلكترونية وتكنولوجية' : 'Electronic & Tech Products');
    setCustomCategory(lang === 'ar' ? 'منتجات إلكترونية وتكنولوجية' : 'Electronic & Tech Products');
    setNotes(lang === 'ar' ? 'منتج منافس قوي في السوق' : 'Strong competitor product in the market');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!competitorName.trim() || !productName.trim() || price <= 0 || !finalCategory.trim()) {
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
        competitorName,
        productName,
        productPrice: price,
        productUrl,
        category: finalCategory,
        notes,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: JasmalItem = {
        id: Date.now().toString(),
        competitorName,
        productName,
        productPrice: price,
        productUrl,
        category: finalCategory,
        notes,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: JasmalItem) => {
    setCompetitorName(item.competitorName);
    setProductName(item.productName);
    setProductPrice(item.productPrice);
    setProductUrl(item.productUrl);
    
    const standardCategories = [
      'منتجات إلكترونية وتكنولوجية', 'أزياء وملابس رجالية/نسائية', 'عطور وبخور وعناية شخصية', 'أكسسوارات وساعات',
      'Electronic & Tech Products', 'Men/Women Fashion & Apparel', 'Perfumes & Personal Care', 'Accessories & Watches'
    ];
    if (standardCategories.includes(item.category)) {
      setCategorySelect(item.category);
      setCustomCategory(item.category);
    } else {
      setCategorySelect(lang === 'ar' ? 'تصنيف آخر (كتابة يدوية)' : 'Other Category (Custom)');
      setCustomCategory(item.category);
    }
    setNotes(item.notes);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const avgCompetitorPrice = items.length > 0 ? items.reduce((acc, curr) => acc + curr.productPrice, 0) / items.length : 0;

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
          <h2>Jasmal Scraper Report</h2>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>${text.table.th5}</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.competitorName}</td>
          <td>${row.productName} (${row.category})</td>
          <td>${row.productPrice}</td>
          <td>${row.productUrl}</td>
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
    link.setAttribute("download", "enjazya_sa_jasmal.xls");
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
    item.competitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="form-row">
              <div className="input-group">
                <label>{text.compNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} placeholder={text.compPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.prodNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodPH} required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.priceLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={productPrice === '' ? '' : productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="299" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              
              <div className="input-group">
                <label>{text.catLabel}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={categorySelect} onChange={handleSelectChange}>
                    <option value={lang === 'ar' ? 'منتجات إلكترونية وتكنولوجية' : 'Electronic & Tech Products'}>{text.optElect}</option>
                    <option value={lang === 'ar' ? 'أزياء وملابس رجالية/نسائية' : 'Men/Women Fashion & Apparel'}>{text.optFashion}</option>
                    <option value={lang === 'ar' ? 'عطور وبخور وعناية شخصية' : 'Perfumes & Personal Care'}>{text.optPerfume}</option>
                    <option value={lang === 'ar' ? 'أكسسوارات وساعات' : 'Accessories & Watches'}>{text.optAccessory}</option>
                    <option value={lang === 'ar' ? 'تصنيف آخر (كتابة يدوية)' : 'Other Category (Custom)'}>{text.optCustom}</option>
                  </select>
                </div>

                {(categorySelect === 'تصنيف آخر (كتابة يدوية)' || categorySelect === 'Other Category (Custom)') && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      placeholder={text.customPH} 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>{text.urlLabel}</label>
              <div className="input-wrapper">
                <input type="url" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder={text.urlPH} />
              </div>
            </div>

            <div className="input-group">
              <label>{text.notesLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={text.notesPH} />
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
              <div className="result-label">{text.totalResLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalResSub}</div>
            </div>
            <div className="result-value">
              {items.length} {lang === 'ar' ? 'منتج' : 'products'}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #047857' : 'none', borderLeft: lang === 'en' ? '4px solid #047857' : 'none' }}>
            <span className="result-label">{text.avgPriceLabel}</span>
            <span className="result-value" style={{ color: '#047857' }}>{avgCompetitorPrice.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.statusLabel}</span>
            <span className="result-value" style={{ color: '#0369a1', fontSize: '15px' }}>{text.statusVal}</span>
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
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.competitorName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0369a1' }}>{item.productName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.category}</div>
                    </td>
                    <td style={{ fontWeight: 900, color: '#047857' }}>{item.productPrice} {text.currency}</td>
                    <td>
                      {item.productUrl ? (
                        <a href={item.productUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 700, display: 'block', fontSize: '12.5px' }}>
                          {text.table.visitLink}
                        </a>
                      ) : <span style={{ color: '#94a3b8' }}>{text.table.noLink}</span>}
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px' }}>{item.notes}</div>
                    </td>
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
                  <td colSpan={3} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td style={{ color: '#047857' }}>{avgCompetitorPrice.toFixed(2)} {text.currency}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
