'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ReviewItem {
  id: string;
  customerName: string;
  phoneNumber: string;
  orderNumber: string;
  productName: string;
  reviewStatus: string;
  createdAt?: string;
}

export default function AutomatedReviewsKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  
  const [statusSelect, setStatusSelect] = useState<string>('في انتظار الإرسال 🕒');
  const [customStatus, setCustomStatus] = useState<string>('في انتظار الإرسال 🕒');

  const [items, setItems] = useState<ReviewItem[]>([]);
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
      setStatusSelect('Pending 🕒');
      setCustomStatus('Pending 🕒');
    } else {
      setStatusSelect('في انتظار الإرسال 🕒');
      setCustomStatus('في انتظار الإرسال 🕒');
    }

    const saved = localStorage.getItem('seerk_kw_automated_reviews_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ReviewItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_automated_reviews_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'نظام طلب التقييمات الآلي ⭐',
      desc: 'أرسل رسائل تلقائية للعملاء عبر واتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية في السوق الكويتي',
      editRecord: 'تعديل السجل',
      newRecord: 'إضافة عميل لطلب تقييم',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      custNameLabel: 'اسم العميل',
      custPH: 'مثال: فهد المطيري',
      phoneLabel: 'رقم جوال العميل (الكويتي)',
      orderNumLabel: 'رقم الطلب',
      orderPH: 'مثال: #89201',
      prodNameLabel: 'اسم المنتج (اختياري)',
      prodPH: 'مثال: عطر إنجازيا الفاخر',
      statusLabel: 'حالة التقييم',
      optPending: 'في انتظار الإرسال 🕒',
      optSent: 'تم إرسال الطلب 📤',
      optDone: 'تم التقييم بنجاح ⭐',
      optFailed: 'لم يستجب ❌',
      optCustom: '➕ حالة أخرى (كتابة يدوية)',
      customPH: 'اكتب حالة التقييم المخصصة هنا...',
      saveBtnNew: '+ إضافة العميل إلى السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات التقييمات الفورية',
      totalCustLabel: 'إجمالي العملاء المستهدفين',
      totalCustSub: 'سجل متابعة طلبات التقييم',
      doneLabel: 'التقييمات المكتملة (⭐)',
      rateLabel: 'معدل الاستجابة والتوثيق',
      searchPH: '🔍 بحث باسم العميل أو رقم الطلب...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد سجلات تقييمات مسجلة حالياً.',
        th1: '#',
        th2: 'العميل والتاريخ',
        th3: 'رقم الطلب والمنتج',
        th4: 'رقم الجوال',
        th5: 'حالة التقييم',
        th6: 'الإجراءات',
        waAction: '💬 واتساب',
        editAction: '✏️',
        delAction: '❌',
        generalOrder: 'طلب عام',
        totalLabel: 'إجمالي العملاء المسجلين',
        unit: 'عميل'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 عملاء). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم العميل، رقم الجوال، رقم الطلب، وحالة التقييم.',
        updateSuccess: '✨ تم تحديث السجل بنجاح!',
        saveSuccess: '✅ تمت إضافة العميل إلى سجل طلبات التقييم بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات التقييمات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Automated Review Request System ⭐',
      desc: 'Send automated WhatsApp messages after delivery to collect reviews and build trust in Kuwait',
      editRecord: 'Edit Record',
      newRecord: 'Add Customer for Review',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      custNameLabel: 'Customer Name',
      custPH: 'e.g. John Doe',
      phoneLabel: 'Customer Mobile Number (Kuwaiti)',
      orderNumLabel: 'Order Number',
      orderPH: 'e.g. #89201',
      prodNameLabel: 'Product Name (Optional)',
      prodPH: 'e.g. Enjazya Luxury Perfume',
      statusLabel: 'Review Status',
      optPending: 'Pending 🕒',
      optSent: 'Request Sent 📤',
      optDone: 'Reviewed Successfully ⭐',
      optFailed: 'No Response ❌',
      optCustom: '➕ Other Status (Custom)',
      customPH: 'Type custom review status here...',
      saveBtnNew: '+ Add Customer to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Review Indicators',
      totalCustLabel: 'Total Target Customers',
      totalCustSub: 'Review request tracking log',
      doneLabel: 'Completed Reviews (⭐)',
      rateLabel: 'Response & Documentation Rate',
      searchPH: '🔍 Search by customer or order number...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No review records currently registered.',
        th1: '#',
        th2: 'Customer & Date',
        th3: 'Order & Product',
        th4: 'Mobile Number',
        th5: 'Review Status',
        th6: 'Actions',
        waAction: '💬 WhatsApp',
        editAction: '✏️',
        delAction: '❌',
        generalOrder: 'General Order',
        totalLabel: 'Total Registered Customers',
        unit: 'customers'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 customers). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure customer name, mobile number, order number, and review status are entered.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ Customer added to review requests log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Review data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const finalReviewStatus = (statusSelect === 'حالة أخرى (كتابة يدوية)' || statusSelect === 'Other Status (Custom)') ? customStatus : statusSelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatusSelect(val);
    if (val !== 'حالة أخرى (كتابة يدوية)' && val !== 'Other Status (Custom)') {
      setCustomStatus(val);
    } else {
      setCustomStatus('');
    }
  };

  const handleClearForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setOrderNumber('');
    setProductName('');
    setStatusSelect(lang === 'ar' ? 'في انتظار الإرسال 🕒' : 'Pending 🕒');
    setCustomStatus(lang === 'ar' ? 'في انتظار الإرسال 🕒' : 'Pending 🕒');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!customerName.trim() || !phoneNumber.trim() || !orderNumber.trim() || !finalReviewStatus.trim()) {
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
        customerName,
        phoneNumber,
        orderNumber,
        productName,
        reviewStatus: finalReviewStatus,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: ReviewItem = {
        id: Date.now().toString(),
        customerName,
        phoneNumber,
        orderNumber,
        productName,
        reviewStatus: finalReviewStatus,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: ReviewItem) => {
    setCustomerName(item.customerName);
    setPhoneNumber(item.phoneNumber);
    setOrderNumber(item.orderNumber);
    setProductName(item.productName);
    
    const standardStatuses = [
      'في انتظار الإرسال 🕒', 'تم إرسال الطلب 📤', 'تم التقييم بنجاح ⭐', 'لم يستجب ❌',
      'Pending 🕒', 'Request Sent 📤', 'Reviewed Successfully ⭐', 'No Response ❌'
    ];
    if (standardStatuses.includes(item.reviewStatus)) {
      setStatusSelect(item.reviewStatus);
      setCustomStatus(item.reviewStatus);
    } else {
      setStatusSelect(lang === 'ar' ? 'حالة أخرى (كتابة يدوية)' : 'Other Status (Custom)');
      setCustomStatus(item.reviewStatus);
    }
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleSendWhatsapp = (item: ReviewItem) => {
    let phone = (item.phoneNumber || '').replace(/\D/g, '');
    if (phone.length === 8) {
      phone = '965' + phone;
    } else if (phone.startsWith('00965')) {
      phone = phone.substring(2);
    }
    
    const waText = lang === 'ar'
      ? `مرحباً بك يا ${item.customerName} 🌟. نتمنى أن منتجك (${item.productName || 'الطلب رقم ' + item.orderNumber}) قد نال إعجابك! نتشرف برأيك وتقييمك لخدمتنا عبر الرد على هذه الرسالة أو من خلال تقييم المتجر. شكراً لثقتك بنا!`
      : `Hello ${item.customerName} 🌟. We hope you love your product (${item.productName || 'Order #' + item.orderNumber})! We would love to hear your feedback and review. Thank you for trusting us!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
  };

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
          <h2>Automated Reviews Report (KW)</h2>
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
          <td>${row.customerName}</td>
          <td>${row.orderNumber} (${row.productName || '-'})</td>
          <td dir="ltr">${row.phoneNumber}</td>
          <td>${row.reviewStatus}</td>
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
    link.setAttribute("download", "enjazya_kw_reviews.xls");
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
    item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phoneNumber.includes(searchQuery)
  );

  const completedReviews = filteredItems.filter(i => i.reviewStatus.includes('تم التقييم') || i.reviewStatus.includes('Reviewed')).length;

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
        
        .grid-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; margin-bottom: 40px; }
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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        
        .action-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #fff; border: none; padding: 20px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.2); }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .t-btn:hover { background: #f1f5f9; color: #0284c7; border-color: #0284c7; }

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
        .btn-wa { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .btn-wa:hover { background: #dcfce7; }
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
                <label>{text.custNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={text.custPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.phoneLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="6XXXXXXXX" required dir="ltr" style={{ textAlign: 'left' }} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.orderNumLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder={text.orderPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.prodNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodPH} />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.statusLabel}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={statusSelect} onChange={handleSelectChange}>
                  <option value={lang === 'ar' ? 'في انتظار الإرسال 🕒' : 'Pending 🕒'}>{text.optPending}</option>
                  <option value={lang === 'ar' ? 'تم إرسال الطلب 📤' : 'Request Sent 📤'}>{text.optSent}</option>
                  <option value={lang === 'ar' ? 'تم التقييم بنجاح ⭐' : 'Reviewed Successfully ⭐'}>{text.optDone}</option>
                  <option value={lang === 'ar' ? 'لم يستجب ❌' : 'No Response ❌'}>{text.optFailed}</option>
                  <option value={lang === 'ar' ? 'حالة أخرى (كتابة يدوية)' : 'Other Status (Custom)'}>{text.optCustom}</option>
                </select>
              </div>

              {(statusSelect === 'حالة أخرى (كتابة يدوية)' || statusSelect === 'Other Status (Custom)') && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customStatus} 
                    onChange={(e) => setCustomStatus(e.target.value)} 
                    placeholder={text.customPH} 
                    required 
                  />
                </div>
              )}
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
              <div className="result-label">{text.totalCustLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalCustSub}</div>
            </div>
            <div className="result-value">
              {items.length} {text.table.unit}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0284c7' : 'none', borderLeft: lang === 'en' ? '4px solid #0284c7' : 'none' }}>
            <span className="result-label">{text.doneLabel}</span>
            <span className="result-value" style={{ color: '#0284c7' }}>{completedReviews}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.rateLabel}</span>
            <span className="result-value" style={{ color: '#0369a1' }}>
              {items.length > 0 ? ((completedReviews / items.length) * 100).toFixed(1) : 0}%
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
                filteredItems.map((item, idx) => {
                  let statusColor = '#0369a1';
                  if (item.reviewStatus.includes('تم التقييم') || item.reviewStatus.includes('Reviewed')) statusColor = '#16a34a';
                  if (item.reviewStatus.includes('الإرسال') || item.reviewStatus.includes('Pending')) statusColor = '#d97706';
                  if (item.reviewStatus.includes('لم يستجب') || item.reviewStatus.includes('No Response')) statusColor = '#dc2626';

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.customerName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: '#0284c7' }}>{item.orderNumber}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.productName || text.table.generalOrder}</div>
                      </td>
                      <td style={{ direction: 'ltr', textAlign: lang === 'ar' ? 'right' : 'left', fontWeight: 700 }}>{item.phoneNumber}</td>
                      <td>
                        <span style={{ color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.reviewStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title="Send via WhatsApp">{text.table.waAction}</button>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">{text.table.editAction}</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">{text.table.delAction}</button>
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
                  <td colSpan={5} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{filteredItems.length} {text.table.unit}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
