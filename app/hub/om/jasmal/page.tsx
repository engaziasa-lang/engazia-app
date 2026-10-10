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
  timestamp?: number; // تمت الإضافة للفرز الزمني
}

export default function JasmalScraperQA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [competitorName, setCompetitorName] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<number | ''>('');
  const [productUrl, setProductUrl] = useState<string>('');
  
  const [categorySelect, setCategorySelect] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [items, setItems] = useState<JasmalItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all'); // الفرز الزمني
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_qa'));

    // قراءة اللغة من الصفحة الرئيسية
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    // ضبط القيم الافتراضية بناءً على اللغة
    if (savedLang === 'en') {
      setCategorySelect('Electronics & Tech 💻');
      setCustomCategory('Electronics & Tech 💻');
      setNotes('Strong competitor product in the market');
    } else {
      setCategorySelect('منتجات إلكترونية وتكنولوجية 💻');
      setCustomCategory('منتجات إلكترونية وتكنولوجية 💻');
      setNotes('منتج منافس قوي في السوق');
    }

    const saved = localStorage.getItem('seerk_qa_jasmal_scraper_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: JasmalItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_qa_jasmal_scraper_items', JSON.stringify(newItems));
  };

  const price = typeof productPrice === 'number' ? productPrice : 0;

  // قاموس الترجمة الفوري
  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'جاسمال (Jasmal) لاستخراج البيانات 🕷️',
      desc: 'اسحب بيانات المنتجات والأسعار من المتاجر المنافسة بقطر ورتبها فوراً في ملفات إكسل',
      editRecord: 'تعديل بيانات المنتج',
      newRecord: 'إضافة منتج منافس جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      compName: 'اسم المتجر المنافس',
      compNamePH: 'مثال: طلبات مارت / متجر سنتربوينت قطر',
      prodName: 'اسم المنتج المنافس',
      prodNamePH: 'مثال: ساعة يد رجالية جلد',
      priceLabel: 'سعر المنتج المنافس',
      pricePH: '299',
      category: 'التصنيف',
      catTech: 'منتجات إلكترونية وتكنولوجية 💻',
      catFashion: 'أزياء وملابس رجالية/نسائية 👕',
      catPerfume: 'عطور وبخور وعناية شخصية 🌸',
      catAccessory: 'أكسسوارات وساعات ⌚',
      catOther: '➕ تصنيف آخر (كتابة يدوية)',
      otherPH: 'اكتب التصنيف المخصص هنا...',
      urlLabel: 'رابط المنتج المنافس (اختياري)',
      urlPH: 'https://competitor.qa/product/123',
      notesLabel: 'ملاحظات أو مميزات المنتج',
      notesPH: 'يشمل توصيل مجاني وضمان سنتين',
      saveBtnNew: '+ استخراج وإضافة المنتج للسجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'مؤشرات الاستخبارات الفورية',
      totalItems: 'إجمالي المنتجات المنافسة المرصودة',
      totalItemsSub: 'قاعدة بيانات الأسعار المرصودة',
      itemsUnit: 'منتج',
      avgPrice: 'متوسط أسعار المنافسين',
      toolStatus: 'حالة أداة الاستخراج',
      statusActive: 'نشطة وجاهزة للتصدير 🟢',
      currency: 'ر.ق',
      searchPH: '🔍 بحث باسم المتجر أو المنتج...',
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
        noRecords: 'لا توجد منتجات منافسة تطابق بحثك حالياً.',
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
      title: 'Jasmal Data Extractor (QA) 🕷️',
      desc: 'Extract competitor product and pricing data in Qatar and organize it instantly in Excel',
      editRecord: 'Edit Product Data',
      newRecord: 'Add New Competitor Product',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      compName: 'Competitor Store Name',
      compNamePH: 'e.g. Talabat Mart / Centrepoint Qatar',
      prodName: 'Competitor Product Name',
      prodNamePH: 'e.g. Men\'s Leather Watch',
      priceLabel: 'Competitor Product Price',
      pricePH: '299',
      category: 'Category',
      catTech: 'Electronics & Tech 💻',
      catFashion: 'Men/Women Fashion & Clothing 👕',
      catPerfume: 'Perfumes & Personal Care 🌸',
      catAccessory: 'Accessories & Watches ⌚',
      catOther: '➕ Other Category (Manual Entry)',
      otherPH: 'Type custom category here...',
      urlLabel: 'Competitor Product URL (Optional)',
      urlPH: 'https://competitor.qa/product/123',
      notesLabel: 'Notes or Product Features',
      notesPH: 'Includes free shipping and 2-year warranty',
      saveBtnNew: '+ Extract & Add Product to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Intelligence Indicators',
      totalItems: 'Total Competitor Products Tracked',
      totalItemsSub: 'Tracked Pricing Database',
      itemsUnit: 'product(s)',
      avgPrice: 'Average Competitor Price',
      toolStatus: 'Extractor Tool Status',
      statusActive: 'Active & Ready to Export 🟢',
      currency: 'QAR',
      searchPH: '🔍 Search by store or product...',
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
        noRecords: 'No competitor products match your search.',
        th1: '#',
        th2: 'Store & Date',
        th3: 'Product Name & Category',
        th4: 'Competitor Price',
        th5: 'Link & Notes',
        th6: 'Actions',
        visitLink: '🔗 Visit Link',
        noLink: 'No link',
        totalLabel: 'Overall Competitor Average Price'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 extracted products). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure competitor name, product name, category, and valid price are filled.',
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
  const finalCategory = categorySelect === text.catOther ? customCategory : categorySelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategorySelect(val);
    if (val !== text.catOther) {
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
    if (lang === 'en') {
      setCategorySelect('Electronics & Tech 💻');
      setCustomCategory('Electronics & Tech 💻');
      setNotes('Strong competitor product in the market');
    } else {
      setCategorySelect('منتجات إلكترونية وتكنولوجية 💻');
      setCustomCategory('منتجات إلكترونية وتكنولوجية 💻');
      setNotes('منتج منافس قوي في السوق');
    }
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
    const localeStr = lang === 'ar' ? 'ar-QA' : 'en-QA';
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
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
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
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); // حفظ الجديد للأعلى
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: JasmalItem) => {
    setCompetitorName(item.competitorName);
    setProductName(item.productName);
    setProductPrice(item.productPrice);
    setProductUrl(item.productUrl);
    
    // مطابقة التصنيفات بذكاء بناءً على المحتوى
    const isTech = item.category.includes('إلكترونية') || item.category.includes('Tech');
    const isFashion = item.category.includes('أزياء') || item.category.includes('Fashion');
    const isPerfume = item.category.includes('عطور') || item.category.includes('Perfume');
    const isAccessory = item.category.includes('أكسسوارات') || item.category.includes('Accessory') || item.category.includes('Watches');

    let matchedCategory = '';
    if (isTech) matchedCategory = text.catTech;
    else if (isFashion) matchedCategory = text.catFashion;
    else if (isPerfume) matchedCategory = text.catPerfume;
    else if (isAccessory) matchedCategory = text.catAccessory;
    else matchedCategory = text.catOther;

    setCategorySelect(matchedCategory);
    setCustomCategory(item.category);
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

  // فلترة النتائج بناءً على البحث والفرز الزمني
  const filteredItems = items.filter(item => {
    const matchesSearch = item.competitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
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

  const avgCompetitorPrice = filteredItems.length > 0 ? filteredItems.reduce((acc, curr) => acc + curr.productPrice, 0) / filteredItems.length : 0;

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
                <th>${text.compName}</th>
                <th>${text.prodName}</th>
                <th>Date / Time</th>
                <th>${text.category}</th>
                <th>${text.priceLabel} (${text.currency})</th>
                <th>${text.urlLabel.split(' ')[0]} URL</th>
                <th>${text.notesLabel.split(' ')[0]}</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.competitorName}</td>
          <td>${row.productName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.category}</td>
          <td>${row.productPrice}</td>
          <td>${row.productUrl}</td>
          <td>${row.notes}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">${text.table.totalLabel}</td>
                <td colspan="3">${avgCompetitorPrice.toFixed(2)} ${text.currency}</td>
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
    link.setAttribute("download", `enjazya_qa_jasmal_extracted_data_${dateFilter}.xls`);
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
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #8A1538; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #8A1538; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #6A102B; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #8A1538 0%, #6A102B 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 26px; color: #ffffff; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #8A1538; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #8A1538; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #8A1538; color: #8A1538; }

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
        <Link href="/hub/qa" className="back-btn">
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
                <label>{text.compName}</label>
                <div className="input-wrapper">
                  <input type="text" value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} placeholder={text.compNamePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.prodName}</label>
                <div className="input-wrapper">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodNamePH} required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.priceLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={productPrice === '' ? '' : productPrice} onChange={(e) => setProductPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.pricePH} required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              
              <div className="input-group">
                <label>{text.category}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={categorySelect} onChange={handleSelectChange}>
                    <option value={text.catTech}>{text.catTech}</option>
                    <option value={text.catFashion}>{text.catFashion}</option>
                    <option value={text.catPerfume}>{text.catPerfume}</option>
                    <option value={text.catAccessory}>{text.catAccessory}</option>
                    <option value={text.catOther}>{text.catOther}</option>
                  </select>
                </div>

                {categorySelect === text.catOther && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customCategory} 
                      onChange={(e) => setCustomCategory(e.target.value)} 
                      placeholder={text.otherPH} 
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
          <h2 className="card-title">{text.analysisTitle}</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.totalItems}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalItemsSub}</div>
            </div>
            <div className="result-value">
              {filteredItems.length} {text.itemsUnit}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.avgPrice}</span>
            <span className="result-value" style={{ color: '#8A1538' }}>{avgCompetitorPrice.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.toolStatus}</span>
            <span className="result-value" style={{ color: '#047857', fontSize: '15px' }}>{text.statusActive}</span>
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
                      <div style={{ fontWeight: 800, color: '#8A1538' }}>{item.productName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.category}</div>
                    </td>
                    <td style={{ fontWeight: 900, color: '#0f172a' }}>{item.productPrice} {text.currency}</td>
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
                  <td colSpan={3} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td colSpan={3} style={{ color: '#8A1538' }}>{avgCompetitorPrice.toFixed(2)} {text.currency}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
