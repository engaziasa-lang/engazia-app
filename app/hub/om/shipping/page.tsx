'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ShipmentItem {
  id: string;
  trackingNumber: string;
  customerName: string;
  phoneNumber: string;
  shippingCompany: string;
  shipmentStatus: string;
  createdAt?: string;
  timestamp?: number; // تمت الإضافة للفرز الزمني
}

export default function ShippingTrackerQA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [shippingSelect, setShippingSelect] = useState<string>('');
  const [customShipping, setCustomShipping] = useState<string>('');
  const [shipmentStatus, setShipmentStatus] = useState<string>('');

  const [items, setItems] = useState<ShipmentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all'); // الفرز الزمني
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_qa'));
    
    // قراءة اللغة من الصفحة الرئيسية
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    // ضبط القيم الافتراضية
    if (savedLang === 'en') {
      setShippingSelect('Qatar Post');
      setCustomShipping('Qatar Post');
      setShipmentStatus('In Transit 🚚');
    } else {
      setShippingSelect('بريد قطر (Qatar Post)');
      setCustomShipping('بريد قطر (Qatar Post)');
      setShipmentStatus('قيد التوصيل 🚚');
    }

    const saved = localStorage.getItem('seerk_qa_shipping_tracker_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ShipmentItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_qa_shipping_tracker_items', JSON.stringify(newItems));
  };

  // قاموس الترجمة الفوري
  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مدير تتبع الشحنات المحلية 📦',
      desc: 'تابع حالات الشحنات في قطر وحل استفسارات تأخر التوصيل عبر واتساب بضغطة زر',
      editRecord: 'تعديل السجل',
      newRecord: 'إضافة شحنة جديدة للتتبع',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      trackNum: 'رقم البوليصة / التتبع',
      trackNumPH: 'مثال: 384920192',
      custName: 'اسم العميل',
      custNamePH: 'مثال: ناصر الكبيسي',
      phone: 'رقم جوال العميل (القطري)',
      phonePH: '55XXXXXX أو 33XXXXXX',
      statusLabel: 'حالة الشحنة',
      statTransit: 'قيد التوصيل 🚚',
      statDelivered: 'تم التوصيل بنجاح ✅',
      statDelayed: 'متأخرة / تحتاج متابعة ⚠️',
      statReturned: 'مرتجعة للمتجر 🔄',
      compLabel: 'شركة الشحن',
      compQatarPost: 'بريد قطر (Qatar Post)',
      compAramex: 'أرامكس (Aramex)',
      compQExpress: 'كيو إكسبرس (Q-Express)',
      compDHL: 'دي إتش إل (DHL)',
      compIMile: 'آي مايل (iMile)',
      compOther: '➕ شركة أخرى (كتابة يدوية)',
      otherPH: 'اكتب اسم شركة الشحن هنا...',
      saveBtnNew: '+ حفظ الشحنة في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'مؤشرات حالة الشحنات',
      totalTracked: 'إجمالي الشحنات المسجلة',
      totalTrackedSub: 'قيد المتابعة والخدمة',
      totalDelivered: 'الشحنات المسلمة',
      totalDelayed: 'الشحنات المتأخرة (تحتاج تدخل)',
      searchPH: '🔍 بحث برقم البوليصة أو اسم العميل...',
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
        noRecords: 'لا توجد شحنات مطابقة لبحثك في السجل.',
        th1: '#',
        th2: 'رقم البوليصة والتاريخ',
        th3: 'العميل ورقم الجوال',
        th4: 'شركة الشحن',
        th5: 'حالة الشحنة',
        th6: 'الإجراءات',
        waBtn: '💬 واتساب',
        totalLabel: 'إجمالي الشحنات المعروضة',
        shipUnit: 'شحنة'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 شحنات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة رقم البوليصة، اسم العميل، ورقم الجوال.',
        updateSuccess: '✨ تم تحديث بيانات الشحنة بنجاح!',
        saveSuccess: '✅ تمت إضافة الشحنة إلى سجل التتبع بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذه الشحنة؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد الشحنات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      },
      waMessage: (name: string, track: string, comp: string, stat: string) => `مرحباً بك يا ${name} 📦. بخصوص شحنتك رقم (${track}) عبر شركة (${comp})، حالتها الحالية هي: (${stat}). نشكر لثقتك بنا!`
    },
    en: {
      back: '→ Back to Hub',
      title: 'Local Shipments Tracker 📦',
      desc: 'Track shipment statuses in Qatar and resolve delayed delivery inquiries via WhatsApp with a single click',
      editRecord: 'Edit Record',
      newRecord: 'Add New Shipment to Track',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      trackNum: 'Tracking / Waybill Number',
      trackNumPH: 'e.g. 384920192',
      custName: 'Customer Name',
      custNamePH: 'e.g. Nasser Al Kubaisi',
      phone: 'Customer Phone (Qatar)',
      phonePH: '55XXXXXX or 33XXXXXX',
      statusLabel: 'Shipment Status',
      statTransit: 'In Transit 🚚',
      statDelivered: 'Delivered Successfully ✅',
      statDelayed: 'Delayed / Needs Follow-up ⚠️',
      statReturned: 'Returned to Store 🔄',
      compLabel: 'Shipping Company',
      compQatarPost: 'Qatar Post',
      compAramex: 'Aramex',
      compQExpress: 'Q-Express',
      compDHL: 'DHL',
      compIMile: 'iMile',
      compOther: '➕ Other Company (Manual Entry)',
      otherPH: 'Type shipping company name here...',
      saveBtnNew: '+ Save Shipment to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Shipment Status Indicators',
      totalTracked: 'Total Tracked Shipments',
      totalTrackedSub: 'Currently being monitored',
      totalDelivered: 'Delivered Shipments',
      totalDelayed: 'Delayed Shipments (Action Required)',
      searchPH: '🔍 Search by tracking number or customer...',
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
        noRecords: 'No shipments match your search.',
        th1: '#',
        th2: 'Tracking No. & Date',
        th3: 'Customer & Phone',
        th4: 'Shipping Company',
        th5: 'Shipment Status',
        th6: 'Actions',
        waBtn: '💬 WhatsApp',
        totalLabel: 'Total Displayed Shipments',
        shipUnit: 'shipment(s)'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 shipments). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure tracking number, customer name, and phone are filled correctly.',
        updateSuccess: '✨ Shipment data updated successfully!',
        saveSuccess: '✅ Shipment added to tracking log successfully!',
        delConfirm: 'Are you sure you want to delete this shipment?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Shipments data imported successfully!',
        importErr: '❌ Invalid file.'
      },
      waMessage: (name: string, track: string, comp: string, stat: string) => `Hello ${name} 📦. Regarding your shipment no. (${track}) via (${comp}), its current status is: (${stat}). Thank you for trusting us!`
    }
  };

  const text = t[lang];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setShippingSelect(val);
    if (val !== text.compOther) {
      setCustomShipping(val);
    } else {
      setCustomShipping('');
    }
  };

  const handleClearForm = () => {
    setTrackingNumber('');
    setCustomerName('');
    setPhoneNumber('');
    
    if (lang === 'en') {
      setShippingSelect(text.compQatarPost);
      setCustomShipping(text.compQatarPost);
      setShipmentStatus(text.statTransit);
    } else {
      setShippingSelect(text.compQatarPost);
      setCustomShipping(text.compQatarPost);
      setShipmentStatus(text.statTransit);
    }
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalCompany = shippingSelect === text.compOther ? customShipping : shippingSelect;
    if (!trackingNumber.trim() || !customerName.trim() || !phoneNumber.trim()) {
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
        trackingNumber,
        customerName,
        phoneNumber,
        shippingCompany: finalCompany,
        shipmentStatus,
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: ShipmentItem = {
        id: Date.now().toString(),
        trackingNumber,
        customerName,
        phoneNumber,
        shippingCompany: finalCompany,
        shipmentStatus,
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); // حفظ الجديد في الأعلى
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: ShipmentItem) => {
    setTrackingNumber(item.trackingNumber);
    setCustomerName(item.customerName);
    setPhoneNumber(item.phoneNumber);
    
    const isQatarPost = item.shippingCompany.includes('Qatar Post') || item.shippingCompany.includes('بريد قطر');
    const isAramex = item.shippingCompany.includes('Aramex') || item.shippingCompany.includes('أرامكس');
    const isQExpress = item.shippingCompany.includes('Q-Express') || item.shippingCompany.includes('كيو');
    const isDHL = item.shippingCompany.includes('DHL') || item.shippingCompany.includes('دي إتش إل');
    const isIMile = item.shippingCompany.includes('iMile') || item.shippingCompany.includes('آي مايل');

    let matchedComp = '';
    if (isQatarPost) matchedComp = text.compQatarPost;
    else if (isAramex) matchedComp = text.compAramex;
    else if (isQExpress) matchedComp = text.compQExpress;
    else if (isDHL) matchedComp = text.compDHL;
    else if (isIMile) matchedComp = text.compIMile;
    else matchedComp = text.compOther;

    setShippingSelect(matchedComp);
    setCustomShipping(item.shippingCompany);

    const isTransit = item.shipmentStatus.includes('قيد') || item.shipmentStatus.includes('Transit');
    const isDelivered = item.shipmentStatus.includes('بنجاح') || item.shipmentStatus.includes('Delivered');
    const isDelayed = item.shipmentStatus.includes('متأخر') || item.shipmentStatus.includes('Delayed');
    const isReturned = item.shipmentStatus.includes('مرتجع') || item.shipmentStatus.includes('Returned');

    let matchedStatus = '';
    if (isTransit) matchedStatus = text.statTransit;
    else if (isDelivered) matchedStatus = text.statDelivered;
    else if (isDelayed) matchedStatus = text.statDelayed;
    else if (isReturned) matchedStatus = text.statReturned;
    else matchedStatus = item.shipmentStatus;

    setShipmentStatus(matchedStatus);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleSendWhatsapp = (item: ShipmentItem) => {
    let phone = (item.phoneNumber || '').replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '974' + phone.substring(1);
    } else if (phone.length === 8 && !phone.startsWith('974')) {
      phone = '974' + phone;
    } else if (!phone.startsWith('974')) {
      phone = '974' + phone;
    }
    
    const textMsg = text.waMessage(item.customerName, item.trackingNumber, item.shippingCompany, item.shipmentStatus);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(textMsg)}`;
    window.open(url, '_blank');
  };

  // فلترة النتائج بناءً على البحث والفرز الزمني
  const filteredItems = items.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.shippingCompany.toLowerCase().includes(searchQuery.toLowerCase());
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

  const deliveredCount = filteredItems.filter(i => i.shipmentStatus.includes('بنجاح') || i.shipmentStatus.includes('Delivered')).length;
  const delayedCount = filteredItems.filter(i => i.shipmentStatus.includes('متأخر') || i.shipmentStatus.includes('Delayed')).length;

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
                <th>${text.trackNum}</th>
                <th>${text.custName}</th>
                <th>${text.phone.split(' ')[0]}</th>
                <th>${text.compLabel}</th>
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
          <td>${row.trackingNumber}</td>
          <td>${row.customerName}</td>
          <td dir="ltr">${row.phoneNumber}</td>
          <td>${row.shippingCompany}</td>
          <td>${row.shipmentStatus}</td>
          <td>${row.createdAt || '-'}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="6">${text.table.totalLabel}</td>
                <td>${filteredItems.length} ${text.table.shipUnit}</td>
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
    link.setAttribute("download", `enjazya_qa_shipping_tracker_${dateFilter}.xls`);
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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #8A1538; background: #ffffff; }
        
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
        .btn-wa { background: #22c55e; color: #ffffff; }
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
                <label>{text.trackNum}</label>
                <div className="input-wrapper">
                  <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder={text.trackNumPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.custName}</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={text.custNamePH} required />
                </div>
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
                <label>{text.statusLabel}</label>
                <div className="input-wrapper">
                  <select value={shipmentStatus} onChange={(e) => setShipmentStatus(e.target.value)}>
                    <option value={text.statTransit}>{text.statTransit}</option>
                    <option value={text.statDelivered}>{text.statDelivered}</option>
                    <option value={text.statDelayed}>{text.statDelayed}</option>
                    <option value={text.statReturned}>{text.statReturned}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.compLabel}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={shippingSelect} onChange={handleSelectChange}>
                  <option value={text.compQatarPost}>{text.compQatarPost}</option>
                  <option value={text.compAramex}>{text.compAramex}</option>
                  <option value={text.compQExpress}>{text.compQExpress}</option>
                  <option value={text.compDHL}>{text.compDHL}</option>
                  <option value={text.compIMile}>{text.compIMile}</option>
                  <option value={text.compOther}>{text.compOther}</option>
                </select>
              </div>

              {shippingSelect === text.compOther && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customShipping} 
                    onChange={(e) => setCustomShipping(e.target.value)} 
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
              <div className="result-label">{text.totalTracked}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalTrackedSub}</div>
            </div>
            <div className="result-value">
              {filteredItems.length} {text.table.shipUnit}
            </div>
          </div>

          <div className="result-box">
            <span className="result-label">{text.totalDelivered}</span>
            <span className="result-value" style={{ color: '#047857' }}>{deliveredCount}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.totalDelayed}</span>
            <span className="result-value" style={{ color: '#dc2626' }}>{delayedCount}</span>
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
                  if (item.shipmentStatus.includes('بنجاح') || item.shipmentStatus.includes('Delivered')) statusColor = '#047857';
                  if (item.shipmentStatus.includes('متأخر') || item.shipmentStatus.includes('Delayed')) statusColor = '#dc2626';
                  if (item.shipmentStatus.includes('مرتجع') || item.shipmentStatus.includes('Returned')) statusColor = '#d97706';

                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.trackingNumber}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 800 }}>{item.customerName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', direction: 'ltr', textAlign: lang === 'ar' ? 'right' : 'left' }}>{item.phoneNumber}</div>
                      </td>
                      <td><span style={{ fontWeight: 800, color: '#8A1538' }}>{item.shippingCompany}</span></td>
                      <td>
                        <span style={{ color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.shipmentStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title={text.table.waBtn}>💬 {text.table.waBtn.split(' ')[1]}</button>
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
                  <td>{filteredItems.length} {text.table.shipUnit}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
