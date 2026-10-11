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
  timestamp?: number;
}

export default function AutomatedReviewsBH() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  
  const [statusSelect, setStatusSelect] = useState<string>('');
  const [customStatus, setCustomStatus] = useState<string>('');

  const [items, setItems] = useState<ReviewItem[]>([]);
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
      setStatusSelect('Pending 🕒');
      setCustomStatus('Pending 🕒');
    } else {
      setStatusSelect('في انتظار الإرسال 🕒');
      setCustomStatus('في انتظار الإرسال 🕒');
    }

    const saved = localStorage.getItem('seerk_bh_automated_reviews_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ReviewItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_bh_automated_reviews_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'نظام طلب التقييمات الآلي ⭐',
      desc: 'أرسل رسائل تلقائية للعملاء عبر واتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية في متجرك بمملكة البحرين',
      editRecord: 'تعديل السجل',
      newRecord: 'إضافة عميل لطلب تقييم',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      custName: 'اسم العميل',
      custNamePH: 'مثال: ناصر الدوسري',
      phone: 'رقم جوال العميل (البحريني)',
      phonePH: '3XXXXXXX أو 6XXXXXXX',
      orderNum: 'رقم الطلب',
      orderNumPH: 'مثال: #89201',
      prodName: 'اسم المنتج (اختياري)',
      prodNamePH: 'مثال: عطر إنجازيا الفاخر',
      statusLabel: 'حالة التقييم',
      statusPending: 'في انتظار الإرسال 🕒',
      statusSent: 'تم إرسال الطلب 📤',
      statusDone: 'تم التقييم بنجاح ⭐',
      statusNoResp: 'لم يستجب ❌',
      statusOther: '➕ حالة أخرى (كتابة يدوية)',
      otherPH: 'اكتب حالة التقييم المخصصة هنا...',
      saveBtnNew: '+ إضافة العميل إلى السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'مؤشرات التقييمات الفورية',
      totalTarget: 'إجمالي العملاء المستهدفين',
      totalTargetSub: 'سجل متابعة طلبات التقييم',
      completedRev: 'التقييمات المكتملة (⭐)',
      responseRate: 'معدل الاستجابة والتوثيق',
      searchPH: '🔍 بحث باسم العميل أو رقم الطلب...',
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
        noRecords: 'لا توجد سجلات تقييمات تطابق بحثك حالياً.',
        th1: '#',
        th2: 'العميل والتاريخ',
        th3: 'رقم الطلب والمنتج',
        th4: 'رقم الجوال',
        th5: 'حالة التقييم',
        th6: 'الإجراءات',
        generalOrder: 'طلب عام',
        waBtn: '💬 واتساب',
        totalLabel: 'إجمالي العملاء المعروضين',
        custUnit: 'عميل'
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
      },
      whatsappMsg: (name: string, prod: string) => `مرحباً بك يا ${name} 🌟. نتمنى أن منتجك (${prod}) قد نال إعجابك! نتشرف برأيك وتقييمك لخدمتنا عبر الرد على هذه الرسالة أو من خلال تقييم المتجر. شكراً لثقتك بنا!`
    },
    en: {
      back: '→ Back to Hub',
      title: 'Automated Review Request System ⭐',
      desc: 'Send automated WhatsApp messages to customers after delivery to collect reviews and build trust in your Bahrain store',
      editRecord: 'Edit Record',
      newRecord: 'Add Customer for Review Request',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      custName: 'Customer Name',
      custNamePH: 'e.g. Nasser Al Dossary',
      phone: 'Customer Phone Number (Bahrain)',
      phonePH: '3XXXXXXX or 6XXXXXXX',
      orderNum: 'Order Number',
      orderNumPH: 'e.g. #89201',
      prodName: 'Product Name (Optional)',
      prodNamePH: 'e.g. Luxury Enjazya Perfume',
      statusLabel: 'Review Status',
      statusPending: 'Pending 🕒',
      statusSent: 'Request Sent 📤',
      statusDone: 'Reviewed Successfully ⭐',
      statusNoResp: 'No Response ❌',
      statusOther: '➕ Other Status (Manual Entry)',
      otherPH: 'Type custom review status here...',
      saveBtnNew: '+ Add Customer to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Review Indicators',
      totalTarget: 'Total Targeted Customers',
      totalTargetSub: 'Review requests tracking log',
      completedRev: 'Completed Reviews (⭐)',
      responseRate: 'Response & Documentation Rate',
      searchPH: '🔍 Search by customer name or order number...',
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
        noRecords: 'No review records match your search.',
        th1: '#',
        th2: 'Customer & Date',
        th3: 'Order No. & Product',
        th4: 'Phone Number',
        th5: 'Review Status',
        th6: 'Actions',
        generalOrder: 'General Order',
        waBtn: '💬 WhatsApp',
        totalLabel: 'Total Displayed Customers',
        custUnit: 'customer(s)'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 customers). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure customer name, phone, order number, and status are filled correctly.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ Customer added to review requests log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Reviews data imported successfully!',
        importErr: '❌ Invalid file.'
      },
      whatsappMsg: (name: string, prod: string) => `Hello ${name} 🌟. We hope you liked your product (${prod})! We would be honored to have your feedback and review of our service by replying to this message or reviewing our store. Thank you for trusting us!`
    }
  };

  const text = t[lang];
  const finalReviewStatus = statusSelect === text.statusOther ? customStatus : statusSelect;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatusSelect(val);
    if (val !== text.statusOther) {
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
    const defStatus = lang === 'en' ? 'Pending 🕒' : 'في انتظار الإرسال 🕒';
    setStatusSelect(defStatus);
    setCustomStatus(defStatus);
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
    const localeStr = lang === 'ar' ? 'ar-BH' : 'en-BH';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        customerName,
        phoneNumber,
        orderNumber,
        productName,
        reviewStatus: finalReviewStatus,
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
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
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); 
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: ReviewItem) => {
    setCustomerName(item.customerName);
    
    let displayPhone = item.phoneNumber;
    if (displayPhone.startsWith('973')) {
      displayPhone = displayPhone.substring(3);
    }
    setPhoneNumber(displayPhone);
    setOrderNumber(item.orderNumber);
    setProductName(item.productName);
    
    const isPending = item.reviewStatus.includes('انتظار') || item.reviewStatus.includes('Pending');
    const isSent = item.reviewStatus.includes('إرسال') || item.reviewStatus.includes('Sent');
    const isDone = item.reviewStatus.includes('بنجاح') || item.reviewStatus.includes('Successfully');
    const isNoResp = item.reviewStatus.includes('يستجب') || item.reviewStatus.includes('No Response');

    let matchedStatus = '';
    if (isPending) matchedStatus = text.statusPending;
    else if (isSent) matchedStatus = text.statusSent;
    else if (isDone) matchedStatus = text.statusDone;
    else if (isNoResp) matchedStatus = text.statusNoResp;
    else matchedStatus = text.statusOther;

    setStatusSelect(matchedStatus);
    setCustomStatus(item.reviewStatus);
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
    if (phone.startsWith('0')) {
      phone = '973' + phone.substring(1);
    } else if (phone.length === 8 && !phone.startsWith('973')) {
      phone = '973' + phone;
    } else if (!phone.startsWith('973')) {
      phone = '973' + phone;
    }
    
    const prodDisplay = item.productName || (lang === 'ar' ? 'الطلب رقم ' + item.orderNumber : 'Order #' + item.orderNumber);
    const textMsg = text.whatsappMsg(item.customerName, prodDisplay);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(textMsg)}`;
    window.open(url, '_blank');
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.phoneNumber.includes(searchQuery);
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

  const completedReviews = filteredItems.filter(i => i.reviewStatus.includes('⭐') || i.reviewStatus.includes('بنجاح') || i.reviewStatus.includes('Successfully')).length;

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
                <th>${text.custName}</th>
                <th>${text.phone}</th>
                <th>${text.orderNum}</th>
                <th>${text.prodName.split(' ')[0]}</th>
                <th>${text.statusLabel}</th>
                <th>Date / Time</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.customerName}</td>
          <td dir="ltr">${row.phoneNumber}</td>
          <td>${row.orderNumber}</td>
          <td>${row.productName || '-'}</td>
          <td>${row.reviewStatus}</td>
          <td>${row.createdAt || '-'}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colSpan={5}>${text.table.totalLabel}</td>
                <td colSpan={2}>${filteredItems.length} ${text.table.custUnit}</td>
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
    link.setAttribute("download", `enjazya_bh_automated_reviews_${dateFilter}.xls`);
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
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #CE1126; background: #ffffff; }
        
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
        .btn-wa { background: #22c55e; color: #ffffff; }
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
              <label>{text.custName}</label>
              <div className="input-wrapper">
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={text.custNamePH} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.phone}</label>
                <div className="input-wrapper">
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={text.phonePH} required dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }} />
                </div>
              </div>
              <div className="input-group">
                <label>{text.orderNum}</label>
                <div className="input-wrapper">
                  <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder={text.orderNumPH} required />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.prodName}</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodNamePH} />
              </div>
            </div>

            <div className="input-group">
              <label>{text.statusLabel}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={statusSelect} onChange={handleSelectChange}>
                  <option value={text.statusPending}>{text.statusPending}</option>
                  <option value={text.statusSent}>{text.statusSent}</option>
                  <option value={text.statusDone}>{text.statusDone}</option>
                  <option value={text.statusNoResp}>{text.statusNoResp}</option>
                  <option value={text.statusOther}>{text.statusOther}</option>
                </select>
              </div>

              {statusSelect === text.statusOther && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customStatus} 
                    onChange={(e) => setCustomStatus(e.target.value)} 
                    placeholder={text.otherPH} 
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
          <h2 className="card-title">{text.analysisTitle}</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.totalTarget}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalTargetSub}</div>
            </div>
            <div className="result-value">
              {filteredItems.length} {text.table.custUnit}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.completedRev}</span>
            <span className="result-value" style={{ color: '#047857' }}>{completedReviews}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.responseRate}</span>
            <span className="result-value" style={{ color: '#d97706' }}>
              {filteredItems.length > 0 ? ((completedReviews / filteredItems.length) * 100).toFixed(1) : 0}%
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
                  if (item.reviewStatus.includes('⭐') || item.reviewStatus.includes('بنجاح') || item.reviewStatus.includes('Successfully')) statusColor = '#047857';
                  if (item.reviewStatus.includes('إرسال') || item.reviewStatus.includes('Sent')) statusColor = '#d97706';
                  if (item.reviewStatus.includes('يستجب') || item.reviewStatus.includes('No Response') || item.reviewStatus.includes('❌')) statusColor = '#dc2626';

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.customerName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: '#CE1126' }}>{item.orderNumber}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.productName || text.table.generalOrder}</div>
                      </td>
                      <td style={{ direction: 'ltr', textAlign: lang === 'ar' ? 'right' : 'left', fontWeight: 700 }}>{item.phoneNumber}</td>
                      <td>
                        <span style={{ color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.reviewStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title={text.table.waBtn}>{text.table.waBtn}</button>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="✏️">✏️</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="❌">❌</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={5} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{filteredItems.length} {text.table.custUnit}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
