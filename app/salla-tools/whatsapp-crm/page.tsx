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
  createdAtTimestamp?: number;
}

export default function SallaWhatsappCrm() {
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
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month' | '6months' | 'year'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  const isActivated = false; 

  useEffect(() => {
    setIsClient(true);
    
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    if (savedLang === 'en') {
      setStatus('Abandoned Cart');
      setMessageTemplate('Hi {name}, we noticed you left great items in your cart 🛒. Here is your direct payment link to complete your order quickly: {link}');
    } else {
      setStatus('سلة متروكة');
      setMessageTemplate('مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}');
    }

    const saved = localStorage.getItem('salla_whatsapp_crm_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: CustomerItem[]) => {
    setItems(newItems);
    localStorage.setItem('salla_whatsapp_crm_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للوحة التحكم',
      title: 'إدارة عملاء واتساب (حاسبة سلة و CRM) 💬',
      desc: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين يدوي بكل سهولة',
      editRecord: 'تعديل بيانات العميل',
      newRecord: 'إضافة عميل / سلة جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي (سجل محلي)',
      custNameLabel: 'اسم العميل',
      custPH: 'مثال: أحمد الدوسري',
      phoneLabel: 'رقم الجوال',
      statusLabel: 'حالة العميل',
      optAbandoned: 'سلة متروكة',
      optPending: 'بانتظار الدفع',
      optCompleted: 'طلب مكتمل',
      optInquiry: 'استفسار عام',
      optVip: 'عميل VIP',
      optReturn: 'طلب مسترجع',
      customPH: 'أو اكتب الحالة هنا...',
      orderValLabel: 'قيمة السلة أو الطلب',
      paidCheckLabel: 'تم تحصيل المبلغ (يُحسب ضمن المبيعات)',
      payLinkLabel: 'رابط الدفع السريع (أو تتبع الشحنة)',
      msgSelectLabel: 'اختر نموذج الرسالة',
      optMsgAbandoned: 'سلة متروكة (تذكير بالدفع)',
      optMsgPending: 'بانتظار الدفع (تأكيد الطلب)',
      optMsgCompleted: 'طلب مكتمل (رسالة شكر)',
      optMsgCustom: 'كتابة رسالة فارغة',
      templateLabel: 'قالب الرسالة (قابل للتعديل)',
      varsText: 'المتغيرات: {name} - {amount} - {link}',
      currency: 'ر.س',
      saveBtnNew: '+ حفظ العميل في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات قاعدة العملاء',
      collectedLabel: 'إجمالي الإيرادات المحصلة',
      collectedSub: 'تم دفعها واستلامها بالفعل',
      pendingLabel: 'المبالغ المحتملة (قيد الانتظار)',
      pendingSub: 'سلال متروكة وبانتظار التحويل',
      totalCustLabel: 'إجمالي العملاء المسجلين',
      completedOrdersLabel: 'الطلبات المحصلة',
      abandonedCartsLabel: 'السلال المتروكة',
      searchPH: '🔍 بحث بالاسم أو الحالة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      filter: { all: 'الكل', day: 'يوم', week: 'أسبوع', month: 'شهر', sixMonths: '6 أشهر', year: 'سنة' },
      table: {
        noRecords: 'لا توجد بيانات عملاء مسجلة حالياً.',
        th1: '#',
        th2: 'العميل والتاريخ',
        th3: 'رقم الجوال',
        th4: 'الحالة',
        th5: 'قيمة السلة/الطلب',
        th6: 'الإجراءات',
        waAction: '💬 واتساب',
        paidAction: '💰 تحصيل',
        unpaidAction: '↩️ إلغاء',
        editAction: '✏️',
        delAction: '❌',
        paidBadge: '✅ محصل',
        unpaidBadge: '⏳ بانتظار',
        totalCollectedLabel: 'إجمالي المحصل',
        totalPendingLabel: 'إجمالي المعلق'
      },
      alerts: {
        limit: '🔒 لقد استهلكت الحد التجريبي (3 عملاء). اشترك الآن في منصة إنجازيا لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من إدخال اسم العميل ورقم الجوال وحالة الطلب.',
        updateSuccess: '✨ تم تحديث بيانات العميل بنجاح!',
        saveSuccess: '✅ تم حفظ بيانات العميل في السجل!',
        delConfirm: 'هل أنت متأكد من حذف هذا العميل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back',
      title: 'WhatsApp CRM Management 💬',
      desc: 'Manage abandoned carts and quick payment links manually',
      editRecord: 'Edit Customer',
      newRecord: 'Add New Customer',
      clear: '🧹 Clear',
      trial: 'Trial (Local Log)',
      custNameLabel: 'Customer Name',
      custPH: 'e.g. John Smith',
      phoneLabel: 'Mobile Number',
      statusLabel: 'Status',
      optAbandoned: 'Abandoned Cart',
      optPending: 'Pending Payment',
      optCompleted: 'Completed Order',
      optInquiry: 'General Inquiry',
      optVip: 'VIP Customer',
      optReturn: 'Returned Order',
      customPH: 'Type status...',
      orderValLabel: 'Order Value',
      paidCheckLabel: 'Amount Collected',
      payLinkLabel: 'Payment Link',
      msgSelectLabel: 'Message Template',
      optMsgAbandoned: 'Abandoned Cart Reminder',
      optMsgPending: 'Pending Payment',
      optMsgCompleted: 'Completed Order',
      optMsgCustom: 'Blank Message',
      templateLabel: 'Template',
      varsText: 'Vars: {name} - {amount} - {link}',
      currency: 'SAR',
      saveBtnNew: '+ Save to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Indicators',
      collectedLabel: 'Collected Revenue',
      collectedSub: 'Paid already',
      pendingLabel: 'Pending Revenue',
      pendingSub: 'Abandoned carts',
      totalCustLabel: 'Total Customers',
      completedOrdersLabel: 'Collected Orders',
      abandonedCartsLabel: 'Abandoned Carts',
      searchPH: '🔍 Search...',
      exportBtn: '📥 Export',
      importBtn: '📂 Import',
      filter: { all: 'All', day: 'Day', week: 'Week', month: 'Month', sixMonths: '6M', year: 'Year' },
      table: {
        noRecords: 'No records found.',
        th1: '#',
        th2: 'Customer',
        th3: 'Mobile',
        th4: 'Status',
        th5: 'Value',
        th6: 'Actions',
        waAction: '💬 WhatsApp',
        paidAction: '💰 Collect',
        unpaidAction: '↩️ Uncollect',
        editAction: '✏️',
        delAction: '❌',
        paidBadge: '✅ Collected',
        unpaidBadge: '⏳ Pending',
        totalCollectedLabel: 'Total Collected',
        totalPendingLabel: 'Total Pending'
      },
      alerts: {
        limit: '🔒 Trial limit reached (3 customers). Upgrade on Enjazya to unlock unlimited access!',
        fillErr: 'Please fill required fields.',
        updateSuccess: '✨ Updated successfully!',
        saveSuccess: '✅ Saved successfully!',
        delConfirm: 'Are you sure?',
        noDataExp: 'No data.',
        importSuccess: '✨ Imported successfully!',
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
    const currentTimestamp = Date.now();

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
        createdAt: item.createdAt || formattedDate,
        createdAtTimestamp: item.createdAtTimestamp || currentTimestamp
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
        createdAt: formattedDate,
        createdAtTimestamp: currentTimestamp
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

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.phoneNumber || '').includes(searchQuery) ||
                          (item.status || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

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

    filteredItems.forEach((row, idx) => {
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
    link.setAttribute("download", "salla_whatsapp_crm.xls");
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px', direction: lang === 'ar' ? 'rtl' : 'ltr', fontFamily: 'Tajawal, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* هيدر التطبيق */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: '0 0 5px 0' }}>{text.title}</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>{text.desc}</p>
          </div>
          <Link href="https://engazia-app.vercel.app/hub/sa" target="_blank" rel="noopener noreferrer" style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', color: '#475569', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
            {text.back}
          </Link>
        </div>

        {/* صندوق لافتة ترويجية */}
        <div style={{ marginBottom: '30px', padding: '18px 24px', backgroundColor: '#ecfdf5', borderRadius: '16px', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ fontWeight: 'bold', color: '#065f46', fontSize: '15px', margin: '0 0 4px 0' }}>احصل على أكثر من 24 أداة ذكية لإدارة متجرك!</h3>
            <p style={{ fontSize: '13px', color: '#047857', margin: 0 }}>
              تجربتك الحالية تشمل حفظ حتى 3 عملاء. انضم الآن لمنصة إنجازيا وفعّل كافة الأدوات الذكية بلا حدود.
            </p>
          </div>
          <a
            href="https://engazia-app.vercel.app/hub/sa" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#059669', color: '#ffffff', fontWeight: 'bold', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            استعرض أكثر من 24 أداة على منصة إنجازيا (12.99$) 🚀
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', marginBottom: '40px' }}>
          
          {/* نموذج الإدخال */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{editingId ? text.editRecord : text.newRecord}</span>
                <button type="button" onClick={handleClearForm} style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                  {text.clear}
                </button>
              </div>
              {isClient && <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>{text.trial}: {items.length}/3</span>}
            </div>

            <form onSubmit={handleSaveItem}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>{text.custNameLabel}</label>
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={text.custPH} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>{text.phoneLabel}</label>
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="05XXXXXXXX" required style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>{text.statusLabel}</label>
                  <select onChange={(e) => setStatus(e.target.value)} value={status} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', marginBottom: '8px', boxSizing: 'border-box' }}>
                    <option value={lang === 'ar' ? 'سلة متروكة' : 'Abandoned Cart'}>{text.optAbandoned}</option>
                    <option value={lang === 'ar' ? 'بانتظار الدفع' : 'Pending Payment'}>{text.optPending}</option>
                    <option value={lang === 'ar' ? 'طلب مكتمل' : 'Completed Order'}>{text.optCompleted}</option>
                    <option value={lang === 'ar' ? 'استفسار عام' : 'General Inquiry'}>{text.optInquiry}</option>
                    <option value={lang === 'ar' ? 'عميل VIP' : 'VIP Customer'}>{text.optVip}</option>
                    <option value={lang === 'ar' ? 'مسترجع' : 'Returned Order'}>{text.optReturn}</option>
                  </select>
                  <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder={text.customPH} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>{text.orderValLabel} ({text.currency})</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input type="number" min="0" value={orderValue === '' ? '' : orderValue} onChange={(e) => setOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="250" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', padding: '10px', borderRadius: '8px', border: '1px solid #a7f3d0', marginTop: '10px' }}>
                    <input type="checkbox" id="paidCheck" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#047857' }} />
                    <label htmlFor="paidCheck" style={{ fontSize: '13px', fontWeight: '700', color: '#065f46', cursor: 'pointer', margin: 0 }}>{text.paidCheckLabel}</label>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>{text.payLinkLabel}</label>
                <input type="url" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '15px', border: '1px solid #e2e8f0' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>{text.msgSelectLabel}</label>
                  <select onChange={handlePresetMessageChange} defaultValue="abandoned" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                    <option value="abandoned">{text.optMsgAbandoned}</option>
                    <option value="pending">{text.optMsgPending}</option>
                    <option value="completed">{text.optMsgCompleted}</option>
                    <option value="custom">{text.optMsgCustom}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>{text.templateLabel}</label>
                  <textarea rows={3} value={messageTemplate} onChange={(e) => setMessageTemplate(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
                </div>
              </div>

              <button type="submit" style={{ background: '#047857', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '8px', fontWeight: '900', fontSize: '15px', cursor: 'pointer', marginTop: '15px' }}>
                {editingId ? text.saveBtnEdit : text.saveBtnNew}
              </button>
            </form>
          </div>

          {/* المؤشرات والإحصائيات */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>{text.resultsTitle}</h2>

            <div style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)', color: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.9 }}>{text.collectedLabel}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.collectedSub}</div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', direction: 'ltr' }}>{collectedRevenue.toFixed(2)} {text.currency}</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.9 }}>{text.pendingLabel}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.pendingSub}</div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '900', direction: 'ltr' }}>{pendingRevenue.toFixed(2)} {text.currency}</div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>{text.totalCustLabel}</span>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#0369a1' }}>{filteredItems.length}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '15px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>{text.completedOrdersLabel}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#047857' }}>{completedCount}</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '15px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>{text.abandonedCartsLabel}</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#d97706' }}>{abandonedCount}</div>
              </div>
            </div>
          </div>

        </div>

        {/* الجدول وسجل البيانات */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <input type="text" placeholder={text.searchPH} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', width: '100%', maxWidth: '250px', boxSizing: 'border-box' }} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleExportExcel} style={{ padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155' }}>{text.exportBtn}</button>
              <button onClick={() => fileInputRef.current?.click()} style={{ padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155' }}>{text.importBtn}</button>
              <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1', textAlign: 'right', fontWeight: '800', color: '#334155' }}>{text.table.th1}</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1', textAlign: 'right', fontWeight: '800', color: '#334155' }}>{text.table.th2}</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1', textAlign: 'right', fontWeight: '800', color: '#334155' }}>{text.table.th3}</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1', textAlign: 'right', fontWeight: '800', color: '#334155' }}>{text.table.th4}</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1', textAlign: 'right', fontWeight: '800', color: '#334155' }}>{text.table.th5}</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #cbd5e1', textAlign: 'right', fontWeight: '800', color: '#334155' }}>{text.table.th6}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>{text.table.noRecords}</td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const itemIsPaid = item.isPaid !== undefined ? item.isPaid : ((item.status || '').includes('مكتمل') || (item.status || '').includes('Completed'));
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{idx + 1}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: '900', color: '#0f172a' }}>{item.customerName}</div>
                          {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>🕒 {item.createdAt}</div>}
                        </td>
                        <td style={{ padding: '12px', fontWeight: '800', direction: 'ltr', textAlign: 'right' }}>{item.phoneNumber}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '800', color: '#475569' }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: '900' }}>
                          <div>{item.orderValue} {text.currency}</div>
                          {itemIsPaid ? 
                            <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{text.table.paidBadge}</span> : 
                            <span style={{ fontSize: '10px', background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{text.table.unpaidBadge}</span>
                          }
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleSendWhatsapp(item)} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>{text.table.waAction}</button>
                            <button onClick={() => handleTogglePaidStatus(item.id)} style={{ background: itemIsPaid ? '#f1f5f9' : '#047857', color: itemIsPaid ? '#475569' : '#fff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                              {itemIsPaid ? text.table.unpaidAction : text.table.paidAction}
                            </button>
                            <button onClick={() => handleEdit(item)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>{text.table.editAction}</button>
                            <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>{text.table.delAction}</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
