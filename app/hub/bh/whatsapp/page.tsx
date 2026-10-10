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
  timestamp?: number;
}

export default function WhatsappCrmOM() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [orderValue, setOrderValue] = useState<number | ''>('');
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [messageTemplate, setMessageTemplate] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const [items, setItems] = useState<CustomerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_om'));
    
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    if (savedLang === 'en') {
      setStatus('Abandoned Cart');
      setMessageTemplate('Hello {name}, we noticed you left great items in your cart 🛒. Here is the direct payment link to complete your order quickly: {link}');
    } else {
      setStatus('سلة متروكة');
      setMessageTemplate('مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}');
    }

    const saved = localStorage.getItem('seerk_om_whatsapp_crm_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: CustomerItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_om_whatsapp_crm_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'إدارة عملاء واتساب (إنجازيا برو ماكس) 💬',
      desc: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء متجرك بعُمان',
      editRecord: 'تعديل بيانات العميل',
      newRecord: 'إضافة عميل / سلة جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      custName: 'اسم العميل',
      custNamePH: 'مثال: أحمد البلوشي',
      phone: 'رقم الجوال (العُماني)',
      phonePH: '9XXXXXXX أو 7XXXXXXX',
      statusLabel: 'حالة العميل (اختر أو اكتب ما تريد)',
      stAbandoned: 'سلة متروكة',
      stPending: 'بانتظار الدفع',
      stCompleted: 'طلب مكتمل',
      stInquiry: 'استفسار عام',
      stVip: 'عميل VIP',
      stReturned: 'طلب مسترجع',
      statusPH: 'أو اكتب الحالة هنا...',
      orderVal: 'قيمة السلة أو الطلب',
      paidCheck: 'تم تحصيل المبلغ (يُحسب ضمن المبيعات)',
      payLink: 'رابط الدفع السريع (أو رابط تتبع الشحنة)',
      presetTitle: 'اختر نموذج الرسالة (لتعبئة المربع أدناه)',
      presetAbandoned: 'سلة متروكة (تذكير بالدفع)',
      presetPending: 'بانتظار الدفع (تأكيد الطلب)',
      presetCompleted: 'طلب مكتمل (رسالة شكر وتتبع)',
      presetCustom: 'كتابة رسالة فارغة جديدة',
      templateTitle: 'قالب الرسالة (قابل للتعديل بحرية)',
      varsText: 'المتغيرات: {name} - {amount} - {link}',
      saveBtnNew: '+ حفظ العميل في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'مؤشرات قاعدة العملاء',
      collectedRev: 'إجمالي الإيرادات المحصلة (المبيعات)',
      collectedSub: 'تم دفعها واستلامها بالفعل',
      pendingRev: 'المبالغ المحتملة (قيد الانتظار)',
      pendingSub: 'سلال متروكة وبانتظار التحويل',
      totalCust: 'إجمالي العملاء المسجلين',
      paidOrders: 'الطلبات المحصلة',
      abandonedCarts: 'السلال المتروكة',
      currency: 'ر.ع',
      searchPH: '🔍 بحث باسم العميل أو الحالة...',
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
        noRecords: 'لا يوجد عملاء مطابقين لبحثك في السجل.',
        th1: '#',
        th2: 'العميل والتاريخ',
        th3: 'رقم الجوال',
        th4: 'الحالة',
        th5: 'قيمة السلة/الطلب',
        th6: 'الإجراءات',
        paidTag: '✅ محصل',
        unpaidTag: '⏳ بانتظار الدفع',
        waBtn: '💬 واتساب',
        fastCollect: '💰 تحصيل سريع',
        cancelCollect: '↩️ إلغاء التحصيل',
        totalCollected: 'إجمالي المبالغ المحصلة المكتملة (مبيعات)',
        totalPending: 'إجمالي المبالغ المحتملة (سلال متروكة وبانتظار الدفع)',
        custUnit: 'عميل'
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
      title: 'WhatsApp CRM Management (Enjazya Pro Max) 💬',
      desc: 'Manage abandoned carts, send quick payment links, and categorize your Oman store customers',
      editRecord: 'Edit Customer Data',
      newRecord: 'Add New Customer / Cart',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      custName: 'Customer Name',
      custNamePH: 'e.g. Ahmed Al Balushi',
      phone: 'Phone Number (Oman)',
      phonePH: '9XXXXXXX or 7XXXXXXX',
      statusLabel: 'Customer Status (Select or Type)',
      stAbandoned: 'Abandoned Cart',
      stPending: 'Pending Payment',
      stCompleted: 'Completed Order',
      stInquiry: 'General Inquiry',
      stVip: 'VIP Customer',
      stReturned: 'Returned Order',
      statusPH: 'Or type custom status...',
      orderVal: 'Cart or Order Value',
      paidCheck: 'Amount Collected (Counted in Sales)',
      payLink: 'Quick Payment Link (or Tracking Link)',
      presetTitle: 'Select Message Template (Fills box below)',
      presetAbandoned: 'Abandoned Cart (Payment Reminder)',
      presetPending: 'Pending Payment (Order Confirmation)',
      presetCompleted: 'Completed Order (Thank You & Tracking)',
      presetCustom: 'Write New Empty Message',
      templateTitle: 'Message Template (Fully Editable)',
      varsText: 'Variables: {name} - {amount} - {link}',
      saveBtnNew: '+ Save Customer to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Customer Base Indicators',
      collectedRev: 'Total Collected Revenue (Sales)',
      collectedSub: 'Already paid and received',
      pendingRev: 'Potential Revenue (Pending)',
      pendingSub: 'Abandoned carts and awaiting transfer',
      totalCust: 'Total Registered Customers',
      paidOrders: 'Collected Orders',
      abandonedCarts: 'Abandoned Carts',
      currency: 'OMR',
      searchPH: '🔍 Search by customer name or status...',
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
        noRecords: 'No customers match your search.',
        th1: '#',
        th2: 'Customer & Date',
        th3: 'Phone Number',
        th4: 'Status',
        th5: 'Cart/Order Value',
        th6: 'Actions',
        paidTag: '✅ Collected',
        unpaidTag: '⏳ Pending Payment',
        waBtn: '💬 WhatsApp',
        fastCollect: '💰 Quick Collect',
        cancelCollect: '↩️ Cancel Collect',
        totalCollected: 'Total Collected Completed Revenue (Sales)',
        totalPending: 'Total Potential Revenue (Abandoned & Pending)',
        custUnit: 'customer(s)'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 customers). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure customer name, phone number, and order status are filled.',
        updateSuccess: '✨ Customer data updated successfully!',
        saveSuccess: '✅ Customer data saved successfully!',
        delConfirm: 'Are you sure you want to delete this customer?',
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
      setMessageTemplate(lang === 'ar' 
        ? 'مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}'
        : 'Hello {name}, we noticed you left great items in your cart 🛒. Here is the direct payment link to complete your order quickly: {link}'
      );
    } else if (selected === 'pending') {
      setMessageTemplate(lang === 'ar'
        ? 'أهلاً بك {name}، طلبك بقيمة {amount} ر.ع بانتظار الدفع 💳. لإتمام الطلب وتأكيده يرجى زيارة الرابط: {link}'
        : 'Welcome {name}, your order of {amount} OMR is pending payment 💳. To complete and confirm your order please visit: {link}'
      );
    } else if (selected === 'completed') {
      setMessageTemplate(lang === 'ar'
        ? 'شكراً لك {name} لثقتك بمتجرنا 🎉. تم تأكيد طلبك بقيمة {amount} ر.ع، وسيتم تجهيزه وشحنه قريباً. لتتبع الطلب: {link}'
        : 'Thank you {name} for trusting our store 🎉. Your order of {amount} OMR is confirmed and will be shipped soon. Track your order: {link}'
      );
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
    setMessageTemplate(lang === 'ar' 
      ? 'مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}'
      : 'Hello {name}, we noticed you left great items in your cart 🛒. Here is the direct payment link to complete your order quickly: {link}'
    );
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
    const localeStr = lang === 'ar' ? 'ar-OM' : 'en-OM';
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
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
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
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); 
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: CustomerItem) => {
    setCustomerName(item.customerName || '');
    
    let displayPhone = item.phoneNumber || '';
    if (displayPhone.startsWith('968')) {
      displayPhone = displayPhone.substring(3);
    }
    setPhoneNumber(displayPhone);

    setStatus(item.status || (lang === 'ar' ? 'سلة متروكة' : 'Abandoned Cart'));
    setOrderValue(item.orderValue || 0);
    setPaymentLink(item.paymentLink || '');
    setMessageTemplate(item.messageTemplate || '');
    
    const currentPaidStatus = item.isPaid !== undefined ? item.isPaid : ((item.status || '').includes('مكتمل') || (item.status || '').toLowerCase().includes('completed'));
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
        const currentPaidStatus = item.isPaid !== undefined ? item.isPaid : ((item.status || '').includes('مكتمل') || (item.status || '').toLowerCase().includes('completed'));
        return { ...item, isPaid: !currentPaidStatus };
      }
      return item;
    });
    saveToLocalStorage(updated);
  };

  const handleSendWhatsapp = (item: CustomerItem) => {
    const safePhone = item.phoneNumber || '';
    const safeName = item.customerName || (lang === 'ar' ? 'عميلنا العزيز' : 'Valued Customer');
    const safeAmount = (item.orderValue || 0).toString();
    const safeLink = item.paymentLink || '';
    const safeTemplate = item.messageTemplate || '';

    let phone = safePhone.replace(/\D/g, '');
    if (phone.length === 8 && (phone.startsWith('9') || phone.startsWith('7'))) {
      phone = '968' + phone;
    } else if (phone.startsWith('00968')) {
      phone = phone.substring(2);
    } else if (phone.startsWith('0')) {
      phone = '968' + phone.substring(1);
    } else if (!phone.startsWith('968')) {
      phone = '968' + phone;
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

  const collectedRevenue = filteredItems.filter(i => {
    return i.isPaid !== undefined ? i.isPaid : ((i.status || '').includes('مكتمل') || (i.status || '').toLowerCase().includes('completed'));
  }).reduce((acc, curr) => acc + (curr.orderValue || 0), 0);

  const pendingRevenue = filteredItems.filter(i => {
    return !(i.isPaid !== undefined ? i.isPaid : ((i.status || '').includes('مكتمل') || (i.status || '').toLowerCase().includes('completed')));
  }).reduce((acc, curr) => acc + (curr.orderValue || 0), 0);

  const abandonedCount = filteredItems.filter(i => (i.status || '').includes('متروكة') || (i.status || '').toLowerCase().includes('abandoned')).length;
  const completedCount = filteredItems.filter(i => {
    return i.isPaid !== undefined ? i.isPaid : ((i.status || '').includes('مكتمل') || (i.status || '').toLowerCase().includes('completed'));
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
            .tfoot-row td { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.custName}</th>
                <th>Date / Time</th>
                <th>${text.phone.split(' ')[0]}</th>
                <th>${text.statusLabel.split(' ')[0]}</th>
                <th>${text.orderVal} (${text.currency})</th>
                <th>Payment Link</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      const isPaidFlag = row.isPaid !== undefined ? row.isPaid : ((row.status || '').includes('مكتمل') || (row.status || '').toLowerCase().includes('completed'));
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.customerName || ''}</td>
          <td>${row.createdAt || '-'}</td>
          <td dir="ltr">${row.phoneNumber || ''}</td>
          <td>${row.status || ''}</td>
          <td>${row.orderValue || 0}</td>
          <td>${row.paymentLink || ''}</td>
          <td>${isPaidFlag ? (lang === 'ar' ? 'تم التحصيل' : 'Collected') : (lang === 'ar' ? 'غير محصل (معلق)' : 'Pending')}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">${text.table.totalCollected}</td>
                <td>${collectedRevenue.toFixed(2)}</td>
                <td colspan="2"></td>
              </tr>
              <tr class="tfoot-row" style="background-color: #fffbeb;">
                <td colspan="5" style="color: #d97706;">${text.table.totalPending}</td>
                <td style="color: #d97706;">${pendingRevenue.toFixed(2)}</td>
                <td colspan="2"></td>
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
    link.setAttribute("download", `enjazya_om_whatsapp_crm_${dateFilter}.xls`);
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
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #C62828; background: #ffffff; }
        
        .action-btn { background: #C62828; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #B71C1C; }

        .analysisTitle { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #C62828 0%, #B71C1C 100%); color: #fff; border: none; padding: 20px; }
        .result-box.warning { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .warning .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value, .warning .result-value { font-size: 26px; color: #ffffff; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #C62828; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #C62828; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #C62828; color: #C62828; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit;}
        .btn-wa { background: #22c55e; color: #ffffff; }
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-paid { background: #C62828; color: #ffffff; }
        .btn-unpaid { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }

        .checkbox-wrapper { display: flex; align-items: center; gap: 8px; background: #FFEBEE; padding: 12px; border-radius: 8px; border: 1px solid #FFCDD2; margin-top: 15px; cursor: pointer; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .checkbox-wrapper input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: #C62828; margin: 0; }
        .checkbox-wrapper label { font-size: 14px; font-weight: 800; color: #B71C1C; cursor: pointer; margin: 0; user-select: none; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/om" className="back-btn">
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
                <label>{text.custName}</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={text.custNamePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.phone}</label>
                <div className="input-wrapper">
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={text.phonePH} required dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.statusLabel}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select onChange={(e) => setStatus(e.target.value)} value={[text.stAbandoned, text.stPending, text.stCompleted, text.stInquiry, text.stVip, text.stReturned].includes(status) ? status : ''}>
                    <option value={text.stAbandoned}>{text.stAbandoned}</option>
                    <option value={text.stPending}>{text.stPending}</option>
                    <option value={text.stCompleted}>{text.stCompleted}</option>
                    <option value={text.stInquiry}>{text.stInquiry}</option>
                    <option value={text.stVip}>{text.stVip}</option>
                    <option value={text.stReturned}>{text.stReturned}</option>
                    <option value="" disabled style={{ display: 'none' }}>...</option>
                  </select>
                </div>
                <div className="input-wrapper">
                  <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder={text.statusPH} required />
                </div>
              </div>

              <div className="input-group">
                <label>{text.orderVal} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" min="0" value={orderValue === '' ? '' : orderValue} onChange={(e) => setOrderValue(e.target.value === '' ? '' : Number(e.target.value))} placeholder="25" />
                  <span className="currency-tag">{text.currency}</span>
                </div>

                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    id="paidStatusCheck"
                    checked={isPaid} 
                    onChange={(e) => setIsPaid(e.target.checked)} 
                  />
                  <label htmlFor="paidStatusCheck">{text.paidCheck}</label>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.payLink}</label>
              <div className="input-wrapper">
                <input type="url" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
              <div className="input-group">
                <label style={{ color: '#0f172a' }}>{text.presetTitle}</label>
                <div className="input-wrapper">
                  <select onChange={handlePresetMessageChange} defaultValue="abandoned">
                    <option value="abandoned">{text.presetAbandoned}</option>
                    <option value="pending">{text.presetPending}</option>
                    <option value="completed">{text.presetCompleted}</option>
                    <option value="custom">{text.presetCustom}</option>
                  </select>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
                  <label style={{ color: '#0f172a', margin: 0 }}>{text.templateTitle}</label>
                  <span style={{ fontSize: '11px', color: '#64748b', direction: 'ltr' }}>{text.varsText}</span>
                </div>
                <div className="input-wrapper">
                  <textarea 
                    rows={4} 
                    value={messageTemplate} 
                    onChange={(e) => setMessageTemplate(e.target.value)} 
                    placeholder="Type your custom message here..."
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
          <h2 className="analysisTitle">{text.analysisTitle}</h2>

          <div className="result-box primary">
            <div>
              <div className="result-label">{text.collectedRev}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.collectedSub}</div>
            </div>
            <div className="result-value">
              {collectedRevenue.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box warning">
            <div>
              <div className="result-label">{text.pendingRev}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.pendingSub}</div>
            </div>
            <div className="result-value">
              {pendingRevenue.toFixed(2)} {text.currency}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.totalCust}</span>
            <span className="result-value" style={{ color: '#C62828' }}>{filteredItems.length}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             <div className="result-box" style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: 0, textAlign: lang === 'ar' ? 'right' : 'left' }}>
               <span className="result-label" style={{ fontSize: '12px' }}>{text.paidOrders}</span>
               <span className="result-value" style={{ color: '#047857' }}>{completedCount}</span>
             </div>
             <div className="result-box" style={{ flexDirection: 'column', alignItems: 'flex-start', marginBottom: 0, textAlign: lang === 'ar' ? 'right' : 'left' }}>
               <span className="result-label" style={{ fontSize: '12px' }}>{text.abandonedCarts}</span>
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
                  if (st.includes('متروكة') || st.includes('انتظار') || st.includes('abandoned') || st.includes('pending')) statusColor = '#d97706';
                  if (st.includes('مكتمل') || st.includes('vip') || st.includes('completed')) statusColor = '#C62828';
                  if (st.includes('مسترجع') || st.includes('إلغاء') || st.includes('returned')) statusColor = '#dc2626';

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
                          <span style={{ fontSize: '10px', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>{text.table.paidTag}</span> : 
                          <span style={{ fontSize: '10px', background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>{text.table.unpaidTag}</span>
                        }
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title="WhatsApp">{text.table.waBtn}</button>
                          
                          <button 
                            className={`tb-action-btn ${itemIsPaid ? 'btn-unpaid' : 'btn-paid'}`} 
                            onClick={() => handleTogglePaidStatus(item.id)} 
                            title="Toggle Paid Status"
                          >
                            {itemIsPaid ? text.table.cancelCollect : text.table.fastCollect}
                          </button>

                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">❌</button>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>{text.table.totalCollected}</td>
                  <td colSpan={2} style={{ color: '#047857' }}>{collectedRevenue.toFixed(2)} {text.currency}</td>
                </tr>
                <tr className="tfoot-row" style={{ backgroundColor: '#fffbeb' }}>
                  <td colSpan={4} style={{ textAlign: 'center', color: '#d97706' }}>{text.table.totalPending}</td>
                  <td colSpan={2} style={{ color: '#d97706' }}>{pendingRevenue.toFixed(2)} {text.currency}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
