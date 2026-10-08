'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CustomerItem {
  id: string;
  customerName: string;
  phoneNumber: string;
  status: string;
  orderValue: number;
  paymentLink: string;
  messageTemplate: string;
  isPaid?: boolean;
  createdAt?: string;
}

export default function WhatsappCrmSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [status, setStatus] = useState<string>('سلة متروكة');
  const [orderValue, setOrderValue] = useState<number | ''>('');
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [messageTemplate, setMessageTemplate] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const [items, setItems] = useState<CustomerItem[]>([]);
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
      setStatus('Abandoned Cart');
      setMessageTemplate('Hi {name}, we noticed you left great items in your cart 🛒. Here is your direct payment link to complete your order quickly: {link}');
    } else {
      setStatus('سلة متروكة');
      setMessageTemplate('مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}');
    }

    const saved = localStorage.getItem('seerk_whatsapp_crm_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: CustomerItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_whatsapp_crm_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'إدارة عملاء واتساب (Seerk Pro Max) 💬',
      desc: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين في السوق السعودي',
      editRecord: 'تعديل بيانات العميل',
      newRecord: 'إضافة عميل / سلة جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      custNameLabel: 'اسم العميل',
      custPH: 'مثال: أحمد الدوسري',
      phoneLabel: 'رقم الجوال',
      statusLabel: 'حالة العميل (اختر أو اكتب ما تريد)',
      optAbandoned: 'سلة متروكة',
      optPending: 'بانتظار الدفع',
      optCompleted: 'طلب مكتمل',
      optInquiry: 'استفسار عام',
      optVip: 'عميل VIP',
      optReturn: 'طلب مسترجع',
      customPH: 'أو اكتب الحالة هنا...',
      orderValLabel: 'قيمة السلة أو الطلب',
      paidCheckLabel: 'تم تحصيل المبلغ (يُحسب ضمن المبيعات)',
      payLinkLabel: 'رابط الدفع السريع (أو رابط تتبع الشحنة)',
      msgSelectLabel: 'اختر نموذج الرسالة (لتعبئة المربع أدناه)',
      optMsgAbandoned: 'سلة متروكة (تذكير بالدفع)',
      optMsgPending: 'بانتظار الدفع (تأكيد الطلب)',
      optMsgCompleted: 'طلب مكتمل (رسالة شكر وتتبع)',
      optMsgCustom: 'كتابة رسالة فارغة جديدة',
      templateLabel: 'قالب الرسالة (قابل للتعديل بحرية)',
      varsText: 'المتغيرات: {name} - {amount} - {link}',
      currency: 'ر.س',
      saveBtnNew: '+ حفظ العميل في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات قاعدة العملاء',
      collectedLabel: 'إجمالي الإيرادات المحصلة (المبيعات)',
      collectedSub: 'تم دفعها واستلامها بالفعل',
      pendingLabel: 'المبالغ المحتملة (قيد الانتظار)',
      pendingSub: 'سلال متروكة وبانتظار التحويل',
      totalCustLabel: 'إجمالي العملاء المسجلين',
      completedOrdersLabel: 'الطلبات المحصلة',
      abandonedCartsLabel: 'السلال المتروكة',
      searchPH: '🔍 بحث باسم العميل أو الحالة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا يوجد عملاء مسجلين حالياً. ابدأ بإضافة سلال متروكة لاسترجاعها.',
        th1: '#',
        th2: 'العميل والتاريخ',
        th3: 'رقم الجوال',
        th4: 'الحالة',
        th5: 'قيمة السلة/الطلب',
        th6: 'الإجراءات',
        waAction: '💬 واتساب',
        paidAction: '💰 تحصيل سريع',
        unpaidAction: '↩️ إلغاء التحصيل',
        editAction: '✏️',
        delAction: '❌',
        paidBadge: '✅ محصل',
        unpaidBadge: '⏳ بانتظار الدفع',
        totalCollectedLabel: 'إجمالي المبالغ المحصلة المكتملة (مبيعات)',
        totalPendingLabel: 'إجمالي المبالغ المحتملة (سلال متروكة وبانتظار الدفع)'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 عملاء). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من إدخال اسم العميل ورقم الجوال وحالة الطلب.',
        updateSuccess: '✨ تم تحديث بيانات العميل بنجاح!',
        saveSuccess: '✅ تم حفظ بيانات العميل في السجل!',
        delConfirm: 'هل أنت متأكد من حذف هذا العميل من السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات العملاء بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'WhatsApp CRM Management (Seerk Pro Max) 💬',
      desc: 'Manage abandoned carts, send quick payment links, and classify active store customers in Saudi Arabia',
      editRecord: 'Edit Customer Data',
      newRecord: 'Add New Customer / Cart',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      custNameLabel: 'Customer Name',
      custPH: 'e.g. John Smith',
      phoneLabel: 'Mobile Number',
      statusLabel: 'Customer Status (Select or type custom)',
      optAbandoned: 'Abandoned Cart',
      optPending: 'Pending Payment',
      optCompleted: 'Completed Order',
      optInquiry: 'General Inquiry',
      optVip: 'VIP Customer',
      optReturn: 'Returned Order',
      customPH: 'Or type status here...',
      orderValLabel: 'Cart or Order Value',
      paidCheckLabel: 'Amount Collected (Counted in sales)',
      payLinkLabel: 'Quick Payment Link (or Tracking Link)',
      msgSelectLabel: 'Select Message Template (to fill box below)',
      optMsgAbandoned: 'Abandoned Cart (Payment Reminder)',
      optMsgPending: 'Pending Payment (Order Confirmation)',
      optMsgCompleted: 'Completed Order (Thank you & Tracking)',
      optMsgCustom: 'Write new blank message',
      templateLabel: 'Message Template (Fully Editable)',
      varsText: 'Variables: {name} - {amount} - {link}',
      currency: 'SAR',
      saveBtnNew: '+ Save Customer to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Customer Base Indicators',
      collectedLabel: 'Total Collected Revenue (Sales)',
      collectedSub: 'Paid and received already',
      pendingLabel: 'Potential Revenue (Pending)',
      pendingSub: 'Abandoned carts waiting for transfer',
      totalCustLabel: 'Total Registered Customers',
      completedOrdersLabel: 'Collected Orders',
      abandonedCartsLabel: 'Abandoned Carts',
      searchPH: '🔍 Search by customer name or status...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No customers currently registered. Start adding abandoned carts to recover them.',
        th1: '#',
        th2: 'Customer & Date',
        th3: 'Mobile Number',
        th4: 'Status',
        th5: 'Cart/Order Value',
        th6: 'Actions',
        waAction: '💬 WhatsApp',
        paidAction: '💰 Quick Collect',
        unpaidAction: '↩️ Uncollect',
        editAction: '✏️',
        delAction: '❌',
        paidBadge: '✅ Collected',
        unpaidBadge: '⏳ Pending Payment',
        totalCollectedLabel: 'Grand Total Collected Revenue (Sales)',
        totalPendingLabel: 'Grand Total Potential Revenue (Abandoned / Pending)'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 customers). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure customer name, mobile number, and order status are entered.',
        updateSuccess: '✨ Customer data updated successfully!',
        saveSuccess: '✅ Customer data saved to log successfully!',
        delConfirm: 'Are you sure you want to delete this customer from log?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Customer data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const val = typeof orderValue === 'number' ? orderValue : 0;

  const handlePresetMessageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === 'abandoned') {
      setMessageTemplate(lang === 'ar' ? 'مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}' : 'Hi {name}, we noticed you left great items in your cart 🛒. Here is your direct payment link to complete your order quickly: {link}');
    } else if (selected === 'pending') {
      setMessageTemplate(lang === 'ar' ? 'أهلاً بك {name}، طلبك بقيمة {amount} ر.س بانتظار الدفع 💳. لإتمام الطلب وتأكيده يرجى زيارة الرابط: {link}' : 'Hello {name}, your order of {amount} SAR is pending payment 💳. To complete and confirm your order, please visit: {link}');
    } else if (selected === 'completed') {
      setMessageTemplate(lang === 'ar' ? 'شكراً لك {name} لثقتك بمتجرنا 🎉. تم تأكيد طلبك بقيمة {amount} ر.س، وسيتم تجهيزه وشحنه قريباً. لتتبع الطلب: {link}' : 'Thank you {name} for trusting our store 🎉. Your order of {amount} SAR is confirmed and will be prepared & shipped soon. Track order: {link}');
    } else if (selected === 'custom') {
      setMessageTemplate('');
    }
  };

  const handleClearForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setStatus(lang === 'ar' ? 'سلة متروكة' : 'Abandoned Cart');
    setOrderValue('');
    setPaymentLink('');
    setMessageTemplate(lang === 'ar' ? 'مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}' : 'Hi {name}, we noticed you left great items in your cart 🛒. Here is your direct payment link to complete your order quickly: {link}');
    setIsPaid(false);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!customerName.trim() || !phoneNumber.trim() || !status.trim()) {
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
        phoneNumber,
        status,
        orderValue: val,
        paymentLink,
        messageTemplate,
        isPaid,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: CustomerItem = {
        id: Date.now().toString(),
        customerName,
        phoneNumber,
        status,
        orderValue: val,
        paymentLink,
        messageTemplate,
        isPaid,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: CustomerItem) => {
    setCustomerName(item.customerName || '');
    setPhoneNumber(item.phoneNumber || '');
    setStatus(item.status || (lang === 'ar' ? 'سلة متروكة' : 'Abandoned Cart'));
    setOrderValue(item.orderValue || 0);
    setPaymentLink(item.paymentLink || '');
    setMessageTemplate(item.messageTemplate || '');
    
    const currentPaidStatus = item.isPaid !== undefined ? item.isPaid : (item.status || '').includes('مكتمل') || (item.status || '').includes('Completed');
    setIsPaid(currentPaidStatus);
    
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleTogglePaidStatus = (id: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const currentPaidStatus = item.isPaid !== undefined ? item.isPaid : (item.status || '').includes('مكتمل') || (item.status || '').includes('Completed');
        return { ...item, isPaid: !currentPaidStatus };
      }
      return item;
    });
    saveToLocalStorage(updated);
  };

  const handleSendWhatsapp = (item: CustomerItem) => {
    const safePhone = item.phoneNumber || '';
    const safeName = item.customerName || (lang === 'ar' ? 'عميلنا العزيز' : 'Dear Customer');
    const safeAmount = (item.orderValue || 0).toString();
    const safeLink = item.paymentLink || '';
    const safeTemplate = item.messageTemplate || '';

    let phone = safePhone.replace(/\D/g, '');
    if (phone.startsWith('05')) {
      phone = '966' + phone.substring(1);
    }
    
    let textMsg = safeTemplate
      .replace(/{name}/g, safeName)
      .replace(/{amount}/g, safeAmount)
      .replace(/{link}/g, safeLink);

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(textMsg)}`;
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
          <h2>WhatsApp CRM Report</h2>
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
          <td dir="ltr">${row.phoneNumber}</td>
          <td>${row.status}</td>
          <td>${row.orderValue} ${text.currency}</td>
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
    link.setAttribute("download", "enjazya_sa_whatsapp_crm.xls");
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
    (item.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.phoneNumber || '').includes(searchQuery) ||
    (item.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const collectedRevenue = filteredItems.filter(i => {
    return i.isPaid !== undefined ? i.isPaid : ((i.status || '').includes('مكتمل') || (i.status || '').includes('Completed'));
  }).reduce((acc, curr) => acc + (curr.orderValue || 0), 0);

  const pendingRevenue = filteredItems.filter(i => {
    return !(i.isPaid !== undefined ? i.isPaid : ((i.status || '').includes('مكتمل') || (i.status || '').includes('Completed')));
  }).reduce((acc, curr) => acc + (curr.orderValue || 0), 0);

  const abandonedCount = filteredItems.filter(i => (i.status || '').includes('متروكة') || (i.status || '').includes('Abandoned')).length;
  const completedCount = filteredItems.filter(i => {
    return i.isPaid !== undefined ? i.isPaid : ((i.status || '').includes('مكتمل') || (i.status || '').includes('Completed'));
  }).length;

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
        
        .grid-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; margin-bottom: 40px; }
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
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%); color: #fff; border: none; padding: 20px; }
        .result-box.warning { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .warning .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value, .warning .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 1000px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-wa { background: #22c55e; color: #ffffff; }
        .btn-paid { background: #047857; color: #ffffff; }
        .btn-unpaid { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }

        .checkbox-wrapper { display: flex; align-items: center; gap: 8px; background: #ecfdf5; padding: 12px; border-radius: 8px; border: 1px solid #a7f3d0; margin-top: 15px; cursor: pointer; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .checkbox-wrapper input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: #047857; margin: 0; }
        .checkbox-wrapper label { font-size: 14px; font-weight: 800; color: #065f46; cursor: pointer; margin: 0; user-select: none; }
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
                <label>{text.phoneLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="05XXXXXXXX" required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.statusLabel}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select onChange={(e) => setStatus(e.target.value)} value={['سلة متروكة', 'بانتظار الدفع', 'طلب مكتمل', 'استفسار عام', 'عميل VIP', 'مسترجع', 'Abandoned Cart', 'Pending Payment', 'Completed Order', 'General Inquiry', 'VIP Customer', 'Returned Order'].includes(status) ? status : ''}>
                    <option value={lang === 'ar' ? 'سلة متروكة' : 'Abandoned Cart'}>{text.optAbandoned}</option>
                    <option value={lang === 'ar' ? 'بانتظار الدفع' : 'Pending Payment'}>{text.optPending}</option>
                    <option value={lang === 'ar' ? 'طلب مكتمل' : 'Completed Order'}>{text.optCompleted}</option>
                    <option value={lang === 'ar' ? 'استفسار عام' : 'General Inquiry'}>{text.optInquiry}</option>
                    <option value={lang === 'ar' ? 'عميل VIP' : 'VIP Customer'}>{text.optVip}</option>
                    <option value={lang === 'ar' ? 'مسترجع' : 'Returned Order'}>{text.optReturn}</option>
                    <option value="" disabled style={{ display: 'none' }}>Custom status...</option>
                  </select>
                </div>
                <div className="input-wrapper">
                  <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder={text.customPH} required />
                </div>
              </div>

              <div className="input-group">
                <label>{text.orderValLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" min="0" value={orderValue === '' ? '' : orderValue} onChange={(e) => setOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="250" />
                  <span className="currency-tag">{text.currency}</span>
                </div>

                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    id="paidStatusCheck"
                    checked={isPaid} 
                    onChange={(e) => setIsPaid(e.target.checked)} 
                  />
                  <label htmlFor="paidStatusCheck">{text.paidCheckLabel}</label>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.payLinkLabel}</label>
              <div className="input-wrapper">
                <input type="url" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
              <div className="input-group">
                <label style={{ color: '#0f172a' }}>{text.msgSelectLabel}</label>
                <div className="input-wrapper">
                  <select onChange={handlePresetMessageChange} defaultValue="abandoned">
                    <option value="abandoned">{text.optMsgAbandoned}</option>
                    <option value="pending">{text.optMsgPending}</option>
                    <option value="completed">{text.optMsgCompleted}</option>
                    <option value="custom">{text.optMsgCustom}</option>
                  </select>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
                  <label style={{ color: '#0f172a', margin: 0 }}>{text.templateLabel}</label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{text.varsText}</span>
                </div>
                <div className="input-wrapper">
                  <textarea 
                    rows={4} 
                    value={messageTemplate} 
                    onChange={(e) => setMessageTemplate(e.target.value)} 
                    placeholder="Type custom message here..."
                    style={{ resize: 'vertical' }}
                  ></textarea>
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
              <div className="result-label">{text.collectedLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.collectedSub}</div>
            </div>
            <div className="result-value">
              {collectedRevenue.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box warning">
            <div>
              <div className="result-label">{text.pendingLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.pendingSub}</div>
            </div>
            <div className="result-value">
              {pendingRevenue.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.totalCustLabel}</span>
            <span className="result-value" style={{ color: '#0369a1' }}>{items.length}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             <div className="result-box" style={{ flexDirection: 'column', alignItems: lang === 'ar' ? 'flex-start' : 'flex-end', marginBottom: 0 }}>
               <span className="result-label" style={{ fontSize: '12px' }}>{text.completedOrdersLabel}</span>
               <span className="result-value" style={{ color: '#047857' }}>{completedCount}</span>
             </div>
             <div className="result-box" style={{ flexDirection: 'column', alignItems: lang === 'ar' ? 'flex-start' : 'flex-end', marginBottom: 0 }}>
               <span className="result-label" style={{ fontSize: '12px' }}>{text.abandonedCartsLabel}</span>
               <span className="result-value" style={{ color: '#d97706' }}>{abandonedCount}</span>
             </div>
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
                  let statusColor = '#475569';
                  const st = (item.status || '').toLowerCase();
                  if (st.includes('متروكة') || st.includes('abandoned') || st.includes('انتظار') || st.includes('pending')) statusColor = '#d97706';
                  if (st.includes('مكتمل') || st.includes('completed') || st.includes('vip')) statusColor = '#047857';
                  if (st.includes('مسترجع') || st.includes('returned') || st.includes('إلغاء')) statusColor = '#dc2626';

                  const itemIsPaid = item.isPaid !== undefined ? item.isPaid : (st.includes('مكتمل') || st.includes('completed'));

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.customerName}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td style={{ fontWeight: 800, color: '#334155', direction: 'ltr', textAlign: lang === 'ar' ? 'right' : 'left' }}>{item.phoneNumber}</td>
                      <td>
                        <span style={{ color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.status || 'N/A'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 900 }}>
                        <div style={{ marginBottom: '4px' }}>{item.orderValue} {text.currency}</div>
                        {itemIsPaid ? 
                          <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>{text.table.paidBadge}</span> : 
                          <span style={{ fontSize: '10px', background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>{text.table.unpaidBadge}</span>
                        }
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title="WhatsApp">{text.table.waAction}</button>
                          
                          <button 
                            className={`tb-action-btn ${itemIsPaid ? 'btn-unpaid' : 'btn-paid'}`} 
                            onClick={() => handleTogglePaidStatus(item.id)} 
                            title={itemIsPaid ? "Uncollect" : "Collect"}
                          >
                            {itemIsPaid ? text.table.unpaidAction : text.table.paidAction}
                          </button>

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
                  <td colSpan={4} style={{ textAlign: 'center' }}>{text.table.totalCollectedLabel}</td>
                  <td style={{ color: '#047857' }}>{collectedRevenue.toFixed(2)} {text.currency}</td>
                  <td></td>
                </tr>
                <tr className="tfoot-row" style={{ backgroundColor: '#fffbeb' }}>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#d97706' }}>{text.table.totalPendingLabel}</td>
                  <td style={{ color: '#d97706' }}>{pendingRevenue.toFixed(2)} {text.currency}</td>
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
