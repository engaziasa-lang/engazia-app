'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SupportItem {
  id: string;
  customerName: string;
  inquiryType: string;
  storeName: string;
  orderNumber: string;
  generatedReply: string;
  createdAt?: string;
}

export default function SupportTemplatesSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [customerName, setCustomerName] = useState<string>('');
  const [inquirySelect, setInquirySelect] = useState<string>('استفسار عن تأخر الشحنة');
  const [customInquiryType, setCustomInquiryType] = useState<string>('استفسار عن تأخر الشحنة');
  const [storeName, setStoreName] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [generatedReply, setGeneratedReply] = useState<string>('');

  const [items, setItems] = useState<SupportItem[]>([]);
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
      setCustomerName('John');
      setInquirySelect('Shipping Delay Inquiry');
      setCustomInquiryType('Shipping Delay Inquiry');
      setStoreName('Enjazya Store');
      setOrderNumber('#84920');
    } else {
      setCustomerName('خالد');
      setInquirySelect('استفسار عن تأخر الشحنة');
      setCustomInquiryType('استفسار عن تأخر الشحنة');
      setStoreName('متجر إنجازيا');
      setOrderNumber('#84920');
    }

    const saved = localStorage.getItem('seerk_support_templates_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: SupportItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_support_templates_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'قوالب خدمة العملاء السريعة 🎧',
      desc: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة عبر واتساب في السوق السعودي',
      editRecord: 'تعديل القالب',
      newRecord: 'توليد قالب رد جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      custNameLabel: 'اسم العميل',
      custPH: 'مثال: خالد',
      inquiryTypeLabel: 'نوع الاستفسار',
      optDelay: 'استفسار عن تأخر الشحنة 🚚',
      optReturn: 'طلب الاستبدال والاسترجاع 🔄',
      optPay: 'استفسار عن الدفع والتحصيل 💳',
      optCustom: '➕ استفسار آخر (كتابة يدوية)',
      customPH: 'اكتب نوع الاستفسار هنا...',
      storeLabel: 'اسم المتجر',
      storePH: 'متجر إنجازيا',
      orderNumLabel: 'رقم الطلب',
      orderPH: '#84920',
      saveBtnNew: '+ حفظ القالب في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      previewTitle: 'معاينة نص الرد الاحترافي',
      copyBtn: '📋 نسخ الرد للحافظة واتساب',
      searchPH: '🔍 بحث باسم العميل أو نوع الاستفسار...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد قوالب ردود مسجلة حالياً.',
        th1: '#',
        th2: 'العميل والتاريخ',
        th3: 'نوع الاستفسار',
        th4: 'رقم الطلب',
        th5: 'الإجراءات',
        copyAction: '📋 نسخ',
        editAction: '✏️',
        delAction: '❌',
        totalLabel: 'إجمالي القوالب المسجلة',
        unit: 'قوالب'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 قوالب). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم العميل ونوع الاستفسار.',
        updateSuccess: '✨ تم تحديث القالب بنجاح!',
        saveSuccess: '✅ تمت إضافة الرد إلى سجل خدمة العملاء بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        copySuccess: '📋 تم نسخ الرد بنجاح! جاهز للإرسال للعميل عبر واتساب.',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد قوالب خدمة العملاء بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Quick Customer Support Templates 🎧',
      desc: 'Copy ready-made professional responses for repeated customer inquiries via WhatsApp in Saudi Arabia',
      editRecord: 'Edit Template',
      newRecord: 'Generate New Response Template',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      custNameLabel: 'Customer Name',
      custPH: 'e.g. John',
      inquiryTypeLabel: 'Inquiry Type',
      optDelay: 'Shipping Delay Inquiry 🚚',
      optReturn: 'Return & Exchange Request 🔄',
      optPay: 'Payment & Collection Inquiry 💳',
      optCustom: '➕ Other Inquiry (Custom)',
      customPH: 'Type inquiry type here...',
      storeLabel: 'Store Name',
      storePH: 'Enjazya Store',
      orderNumLabel: 'Order Number',
      orderPH: '#84920',
      saveBtnNew: '+ Save Template to Log',
      saveBtnEdit: '💾 Save Changes',
      previewTitle: 'Professional Reply Preview',
      copyBtn: '📋 Copy Reply to WhatsApp Clipboard',
      searchPH: '🔍 Search by customer name or inquiry type...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No response templates currently registered.',
        th1: '#',
        th2: 'Customer & Date',
        th3: 'Inquiry Type',
        th4: 'Order Number',
        th5: 'Actions',
        copyAction: '📋 Copy',
        editAction: '✏️',
        delAction: '❌',
        totalLabel: 'Total Registered Templates',
        unit: 'templates'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 templates). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure customer name and inquiry type are filled.',
        updateSuccess: '✨ Template updated successfully!',
        saveSuccess: '✅ Reply added to customer service log successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        copySuccess: '📋 Reply copied successfully! Ready to send to customer via WhatsApp.',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Customer service templates imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const actualInquiryType = (inquirySelect === 'استفسار آخر (كتابة يدوية)' || inquirySelect === 'Other Inquiry (Custom)') ? customInquiryType : inquirySelect;

  useEffect(() => {
    const cName = customerName.trim() || (lang === 'ar' ? 'عزيزنا العميل' : 'Dear Customer');
    const sName = storeName.trim() || (lang === 'ar' ? 'المتجر' : 'Store');
    const oNum = orderNumber.trim() || (lang === 'ar' ? 'الطلب' : 'Order');

    if (lang === 'ar') {
      if (inquirySelect.includes('تأخر الشحنة')) {
        setGeneratedReply(
          `مرحباً بك يا ${cName} 🌸\n` +
          `نعتذر منك بشدة عن التأخير البسيط الحاصل في توصيل طلبك رقم (${oNum}). نحن نتابع حالياً مع شركة الشحن لضمان وصول طلبك لأقرب وقت ممكن. شكراً لتفهمك وصبرك معنا!`
        );
      } else if (inquirySelect.includes('الاستبدال والاسترجاع')) {
        setGeneratedReply(
          `أهلاً بك يا ${cName} في ${sName} ✨\n` +
          `بخصوص طلبك (${oNum})، يسعدنا خدمتك في الاستبدال أو الاسترجاع خلال المدة المحددة بشرط أن يكون المنتج بحالته الأصلية. تفضل بزيارة صفحة السياسات بالمتجر أو تزويدنا بسبب الاسترجاع لنخدمك فوراً.`
        );
      } else if (inquirySelect.includes('الدفع')) {
        setGeneratedReply(
          `مرحباً بك يا ${cName} 💳\n` +
          `نؤكد لك أن جميع عمليات الدفع الإلكتروني والدفع عند الاستلام في ${sName} آمنة ومحمولة بالكامل. طلبك رقم (${oNum}) يتم تجهيزه الآن بكل اهتمام!`
        );
      } else {
        setGeneratedReply(
          `مرحباً بك يا ${cName} في ${sName} 🤝\n` +
          `بخصوص استفسارك عن (${actualInquiryType}) للطلب (${oNum}), نحن نعمل بكل جهد لخدمتك وتلبية طلبك في أسرع وقت ممكن. نسعد دائماً بتواصلك معنا!`
        );
      }
    } else {
      if (inquirySelect.includes('Delay') || inquirySelect.includes('تأخر')) {
        setGeneratedReply(
          `Hello ${cName} 🌸\n` +
          `We sincerely apologize for the slight delay in delivering your order #${oNum}. We are currently following up with the shipping company to ensure your order arrives as soon as possible. Thank you for your patience!`
        );
      } else if (inquirySelect.includes('Return') || inquirySelect.includes('الاستبدال')) {
        setGeneratedReply(
          `Welcome ${cName} to ${sName} ✨\n` +
          `Regarding your order (${oNum}), we are happy to assist you with return or exchange within the specified timeframe provided the product is in its original condition. Please visit our store policies or provide the reason for return to assist you immediately.`
        );
      } else if (inquirySelect.includes('Payment') || inquirySelect.includes('الدفع')) {
        setGeneratedReply(
          `Hello ${cName} 💳\n` +
          `We assure you that all electronic payment and cash on delivery transactions at ${sName} are completely secure. Your order #${oNum} is currently being prepared with utmost care!`
        );
      } else {
        setGeneratedReply(
          `Hello ${cName} at ${sName} 🤝\n` +
          `Regarding your inquiry about (${actualInquiryType}) for order (${oNum}), we are working hard to serve you and fulfill your request as quickly as possible. We are always happy to hear from you!`
        );
      }
    }
  }, [customerName, inquirySelect, customInquiryType, storeName, orderNumber, lang]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setInquirySelect(val);
    if (val !== 'استفسار آخر (كتابة يدوية)' && val !== 'Other Inquiry (Custom)') {
      setCustomInquiryType(val);
    } else {
      setCustomInquiryType('');
    }
  };

  const handleClearForm = () => {
    setCustomerName(lang === 'ar' ? 'خالد' : 'John');
    setInquirySelect(lang === 'ar' ? 'استفسار عن تأخر الشحنة' : 'Shipping Delay Inquiry');
    setCustomInquiryType(lang === 'ar' ? 'استفسار عن تأخر الشحنة' : 'Shipping Delay Inquiry');
    setStoreName(lang === 'ar' ? 'متجر إنجازيا' : 'Enjazya Store');
    setOrderNumber('#84920');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalType = (inquirySelect === 'استفسار آخر (كتابة يدوية)' || inquirySelect === 'Other Inquiry (Custom)') ? customInquiryType : inquirySelect;
    if (!customerName.trim() || !finalType.trim()) {
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
        customerName,
        inquiryType: finalType,
        storeName,
        orderNumber,
        generatedReply,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: SupportItem = {
        id: Date.now().toString(),
        customerName,
        inquiryType: finalType,
        storeName,
        orderNumber,
        generatedReply,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: SupportItem) => {
    setCustomerName(item.customerName);
    const standardInquiries = [
      'استفسار عن تأخر الشحنة', 'طلب الاستبدال والاسترجاع', 'استفسار عن الدفع والتحصيل',
      'Shipping Delay Inquiry', 'Return & Exchange Request', 'Payment & Collection Inquiry'
    ];
    if (standardInquiries.includes(item.inquiryType)) {
      setInquirySelect(item.inquiryType);
      setCustomInquiryType(item.inquiryType);
    } else {
      setInquirySelect(lang === 'ar' ? 'استفسار آخر (كتابة يدوية)' : 'Other Inquiry (Custom)');
      setCustomInquiryType(item.inquiryType);
    }
    setStoreName(item.storeName);
    setOrderNumber(item.orderNumber);
    setGeneratedReply(item.generatedReply);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCopyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    alert(text.alerts.copySuccess);
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
          <h2>Support Templates Report</h2>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.customerName}</td>
          <td>${row.inquiryType}</td>
          <td>${row.orderNumber}</td>
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
    link.setAttribute("download", "enjazya_sa_support_templates.xls");
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
    item.inquiryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }
        
        .copy-btn { background: #0369a1; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #0284c7; }

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
                <label>{text.custNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={text.custPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.inquiryTypeLabel}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={inquirySelect} onChange={handleSelectChange}>
                    <option value={lang === 'ar' ? 'استفسار عن تأخر الشحنة' : 'Shipping Delay Inquiry'}>{text.optDelay}</option>
                    <option value={lang === 'ar' ? 'طلب الاستبدال والاسترجاع' : 'Return & Exchange Request'}>{text.optReturn}</option>
                    <option value={lang === 'ar' ? 'استفسار عن الدفع والتحصيل' : 'Payment & Collection Inquiry'}>{text.optPay}</option>
                    <option value={lang === 'ar' ? 'استفسار آخر (كتابة يدوية)' : 'Other Inquiry (Custom)'}>{text.optCustom}</option>
                  </select>
                </div>

                {(inquirySelect === 'استفسار آخر (كتابة يدوية)' || inquirySelect === 'Other Inquiry (Custom)') && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customInquiryType} 
                      onChange={(e) => setCustomInquiryType(e.target.value)} 
                      placeholder={text.customPH} 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.storeLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder={text.storePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.orderNumLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder={text.orderPH} required />
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.previewTitle} ({actualInquiryType})</h2>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <div className="input-wrapper">
              <textarea 
                rows={10} 
                value={generatedReply} 
                onChange={(e) => setGeneratedReply(e.target.value)} 
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: '#f8fafc', color: '#0f172a', resize: 'vertical', lineHeight: '1.6', textAlign: lang === 'ar' ? 'right' : 'left' }}
              ></textarea>
            </div>
          </div>

          <button type="button" className="copy-btn" onClick={() => handleCopyText(generatedReply)}>
            {text.copyBtn}
          </button>
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
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.customerName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#0369a1' }}>{item.inquiryType}</span></td>
                    <td><span style={{ fontWeight: 700, color: '#047857' }}>{item.orderNumber}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-wa" onClick={() => handleCopyText(item.generatedReply)} title="Copy">{text.table.copyAction}</button>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">{text.table.editAction}</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">{text.table.delAction}</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={4} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{items.length} {text.table.unit}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
