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
}

export default function ShippingTrackerKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [shippingSelect, setShippingSelect] = useState<string>('أرامكس (Aramex)');
  const [customShipping, setCustomShipping] = useState<string>('أرامكس (Aramex)');
  const [shipmentStatus, setShipmentStatus] = useState<string>('قيد التوصيل');

  const [items, setItems] = useState<ShipmentItem[]>([]);
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
      setShippingSelect('Aramex');
      setCustomShipping('Aramex');
      setShipmentStatus('In Transit');
    } else {
      setShippingSelect('أرامكس (Aramex)');
      setCustomShipping('أرامكس (Aramex)');
      setShipmentStatus('قيد التوصيل');
    }

    const saved = localStorage.getItem('seerk_kw_shipping_tracker_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ShipmentItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_shipping_tracker_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مدير تتبع الشحنات المحلية 📦',
      desc: 'تابع حالات الشحنات في دولة الكويت وحل استفسارات تأخر التوصيل عبر واتساب',
      editRecord: 'تعديل السجل',
      newRecord: 'إضافة شحنة جديدة للتتبع',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      trackNumLabel: 'رقم البوليصة / التتبع',
      trackNumPH: 'مثال: 384920192',
      custLabel: 'اسم العميل',
      custPH: 'مثال: فهد الميع',
      phoneLabel: 'رقم جوال العميل (الكويتي)',
      statusLabel: 'حالة الشحنة',
      optTransit: 'قيد التوصيل 🚚',
      optDelivered: 'تم التوصيل بنجاح ✅',
      optDelayed: 'متأخرة / تحتاج متابعة ⚠️',
      optReturned: 'مرتجعة للمتجر 🔄',
      shipCompLabel: 'شركة الشحن',
      optAramex: 'أرامكس (Aramex)',
      optDhl: 'دي إتش إل (DHL)',
      optFedex: 'فيديكس (FedEx)',
      optLocal: 'مندوب توصيل محلي',
      optCustom: '➕ شركة أخرى (كتابة يدوية)',
      customPH: 'اكتب اسم شركة الشحن هنا...',
      saveBtnNew: '+ حفظ الشحنة في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مؤشرات حالة الشحنات',
      totalShipLabel: 'إجمالي الشحنات المسجلة',
      totalShipSub: 'قيد المتابعة والخدمة',
      deliveredLabel: 'الشحنات المسلمة',
      delayedLabel: 'الشحنات المتأخرة (تحتاج تدخل)',
      searchPH: '🔍 بحث برقم البوليصة أو اسم العميل...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد شحنات مسجلة للتتبع حالياً.',
        th1: '#',
        th2: 'رقم البوليصة والتاريخ',
        th3: 'العميل ورقم الجوال',
        th4: 'شركة الشحن',
        th5: 'حالة الشحنة',
        th6: 'الإجراءات',
        waAction: '💬 واتساب',
        editAction: '✏️',
        delAction: '❌',
        totalLabel: 'إجمالي الشحنات المسجلة',
        unit: 'شحنة'
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
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Local Shipment Tracker Manager 📦',
      desc: 'Track shipment statuses in Kuwait and resolve delivery delay inquiries via WhatsApp',
      editRecord: 'Edit Record',
      newRecord: 'Add New Shipment to Track',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      trackNumLabel: 'Tracking / Waybill Number',
      trackNumPH: 'e.g. 384920192',
      custLabel: 'Customer Name',
      custPH: 'e.g. Fahad Al-Mai',
      phoneLabel: 'Customer Mobile Number (Kuwaiti)',
      statusLabel: 'Shipment Status',
      optTransit: 'In Transit 🚚',
      optDelivered: 'Delivered Successfully ✅',
      optDelayed: 'Delayed / Needs Attention ⚠️',
      optReturned: 'Returned to Store 🔄',
      shipCompLabel: 'Shipping Company',
      optAramex: 'Aramex',
      optDhl: 'DHL',
      optFedex: 'FedEx',
      optLocal: 'Local Delivery Representative',
      optCustom: '➕ Other Company (Custom)',
      customPH: 'Type shipping company name...',
      saveBtnNew: '+ Save Shipment to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Shipment Status Indicators',
      totalShipLabel: 'Total Registered Shipments',
      totalShipSub: 'Under follow-up & service',
      deliveredLabel: 'Delivered Shipments',
      delayedLabel: 'Delayed Shipments (Needs Attention)',
      searchPH: '🔍 Search by tracking number or customer name...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No shipments currently registered for tracking.',
        th1: '#',
        th2: 'Tracking No. & Date',
        th3: 'Customer & Mobile',
        th4: 'Shipping Company',
        th5: 'Shipment Status',
        th6: 'Actions',
        waAction: '💬 WhatsApp',
        editAction: '✏️',
        delAction: '❌',
        totalLabel: 'Total Registered Shipments',
        unit: 'shipments'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 shipments). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure tracking number, customer name, and mobile number are filled.',
        updateSuccess: '✨ Shipment data updated successfully!',
        saveSuccess: '✅ Shipment added to tracking log successfully!',
        delConfirm: 'Are you sure you want to delete this shipment?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Shipments imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setShippingSelect(val);
    if (val !== 'شركة أخرى (كتابة يدوية)' && val !== 'Other Company (Custom)') {
      setCustomShipping(val);
    } else {
      setCustomShipping('');
    }
  };

  const handleClearForm = () => {
    setTrackingNumber('');
    setCustomerName('');
    setPhoneNumber('');
    setShippingSelect(lang === 'ar' ? 'أرامكس (Aramex)' : 'Aramex');
    setCustomShipping(lang === 'ar' ? 'أرامكس (Aramex)' : 'Aramex');
    setShipmentStatus(lang === 'ar' ? 'قيد التوصيل' : 'In Transit');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalCompany = (shippingSelect === 'شركة أخرى (كتابة يدوية)' || shippingSelect === 'Other Company (Custom)') ? customShipping : shippingSelect;
    if (!trackingNumber.trim() || !customerName.trim() || !phoneNumber.trim()) {
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
        trackingNumber,
        customerName,
        phoneNumber,
        shippingCompany: finalCompany,
        shipmentStatus,
        createdAt: item.createdAt || formattedDate
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
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: ShipmentItem) => {
    setTrackingNumber(item.trackingNumber);
    setCustomerName(item.customerName);
    setPhoneNumber(item.phoneNumber);
    
    const standardCompanies = [
      'أرامكس (Aramex)', 'دي إتش إل (DHL)', 'فيديكس (FedEx)', 'مندوب توصيل محلي',
      'Aramex', 'DHL', 'FedEx', 'Local Delivery Representative'
    ];
    if (standardCompanies.includes(item.shippingCompany)) {
      setShippingSelect(item.shippingCompany);
      setCustomShipping(item.shippingCompany);
    } else {
      setShippingSelect(lang === 'ar' ? 'شركة أخرى (كتابة يدوية)' : 'Other Company (Custom)');
      setCustomShipping(item.shippingCompany);
    }
    setShipmentStatus(item.shipmentStatus);
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
    if (phone.length === 8) {
      phone = '965' + phone;
    } else if (phone.startsWith('00965')) {
      phone = phone.substring(2);
    }
    
    const waText = lang === 'ar'
      ? `مرحباً بك يا ${item.customerName} 📦. بخصوص شحنتك رقم (${item.trackingNumber}) عبر شركة (${item.shippingCompany})، حالتها الحالية هي: (${item.shipmentStatus}). نشكر لثقتك بنا!`
      : `Hello ${item.customerName} 📦. Regarding your shipment #${item.trackingNumber} via ${item.shippingCompany}, its current status is: ${item.shipmentStatus}. Thank you for trusting us!`;

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
          <h2>Shipping Tracker Report (KW)</h2>
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
          <td>${row.trackingNumber}</td>
          <td>${row.customerName} (${row.phoneNumber})</td>
          <td>${row.shippingCompany}</td>
          <td>${row.shipmentStatus}</td>
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
    link.setAttribute("download", "enjazya_kw_shipping_tracker.xls");
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
    item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.shippingCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deliveredCount = filteredItems.filter(i => i.shipmentStatus.includes('تم التوصيل') || i.shipmentStatus.includes('Delivered')).length;
  const delayedCount = filteredItems.filter(i => i.shipmentStatus.includes('متأخرة') || i.shipmentStatus.includes('Delayed')).length;

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
                <label>{text.trackNumLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder={text.trackNumPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.custLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={text.custPH} required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.phoneLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="6XXXXXXXX" required dir="ltr" style={{ textAlign: 'left' }} />
                </div>
              </div>
              <div className="input-group">
                <label>{text.statusLabel}</label>
                <div className="input-wrapper">
                  <select value={shipmentStatus} onChange={(e) => setShipmentStatus(e.target.value)}>
                    <option value={lang === 'ar' ? 'قيد التوصيل' : 'In Transit'}>{text.optTransit}</option>
                    <option value={lang === 'ar' ? 'تم التوصيل بنجاح' : 'Delivered Successfully'}>{text.optDelivered}</option>
                    <option value={lang === 'ar' ? 'متأخرة / تحتاج متابعة' : 'Delayed / Needs Attention'}>{text.optDelayed}</option>
                    <option value={lang === 'ar' ? 'مرتجعة للمتجر' : 'Returned to Store'}>{text.optReturned}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.shipCompLabel}</label>
              <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                <select value={shippingSelect} onChange={handleSelectChange}>
                  <option value={lang === 'ar' ? 'أرامكس (Aramex)' : 'Aramex'}>{text.optAramex}</option>
                  <option value={lang === 'ar' ? 'دي إتش إل (DHL)' : 'DHL'}>{text.optDhl}</option>
                  <option value={lang === 'ar' ? 'فيديكس (FedEx)' : 'FedEx'}>{text.optFedex}</option>
                  <option value={lang === 'ar' ? 'مندوب توصيل محلي' : 'Local Delivery Representative'}>{text.optLocal}</option>
                  <option value={lang === 'ar' ? 'شركة أخرى (كتابة يدوية)' : 'Other Company (Custom)'}>{text.optCustom}</option>
                </select>
              </div>

              {(shippingSelect === 'شركة أخرى (كتابة يدوية)' || shippingSelect === 'Other Company (Custom)') && (
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    value={customShipping} 
                    onChange={(e) => setCustomShipping(e.target.value)} 
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
              <div className="result-label">{text.totalShipLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.totalShipSub}</div>
            </div>
            <div className="result-value">
              {items.length} {text.table.unit}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #16a34a' : 'none', borderLeft: lang === 'en' ? '4px solid #16a34a' : 'none' }}>
            <span className="result-label">{text.deliveredLabel}</span>
            <span className="result-value" style={{ color: '#16a34a' }}>{deliveredCount}</span>
          </div>

          <div className="result-box" style={{ background: '#f8fafc' }}>
            <span className="result-label">{text.delayedLabel}</span>
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
                  let statusColor = '#0284c7';
                  if (item.shipmentStatus.includes('تم التوصيل') || item.shipmentStatus.includes('Delivered')) statusColor = '#16a34a';
                  if (item.shipmentStatus.includes('متأخرة') || item.shipmentStatus.includes('Delayed')) statusColor = '#dc2626';
                  if (item.shipmentStatus.includes('مرتجعة') || item.shipmentStatus.includes('Returned')) statusColor = '#d97706';

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
                      <td><span style={{ fontWeight: 800, color: '#334155' }}>{item.shippingCompany}</span></td>
                      <td>
                        <span style={{ color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                          {item.shipmentStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button className="tb-action-btn btn-wa" onClick={() => handleSendWhatsapp(item)} title="WhatsApp">{text.table.waAction}</button>
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
