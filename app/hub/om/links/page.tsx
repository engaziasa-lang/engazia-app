'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface WaLinkItem {
  id: string;
  campaignName: string;
  phoneNumber: string;
  presetMessage: string;
  generatedLink: string;
  createdAt?: string;
  timestamp?: number; // تمت الإضافة للفرز الزمني
}

export default function WaLinkGeneratorQA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [campaignName, setCampaignName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [presetMessage, setPresetMessage] = useState<string>('');

  const [items, setItems] = useState<WaLinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all'); // الفرز الزمني
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_qa'));
    
    // قراءة اللغة المحفوظة
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    const saved = localStorage.getItem('seerk_qa_wa_link_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: WaLinkItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_qa_wa_link_items', JSON.stringify(newItems));
  };

  // معالجة رقم الجوال لقطر (+974)
  let formattedPhone = phoneNumber.replace(/\D/g, ''); 
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '974' + formattedPhone.substring(1);
  } else if (formattedPhone.length === 8 && !formattedPhone.startsWith('974')) {
    formattedPhone = '974' + formattedPhone;
  } else if (formattedPhone.length > 8 && !formattedPhone.startsWith('974')) {
    // محاولة التعامل مع أرقام بدون الصفر
    formattedPhone = '974' + formattedPhone;
  }

  const liveLink = formattedPhone 
    ? `https://wa.me/${formattedPhone}${presetMessage.trim() ? `?text=${encodeURIComponent(presetMessage.trim())}` : ''}`
    : '';

  // قاموس الترجمة
  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'صانع روابط واتساب السريعة 🔗',
      desc: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستقرام بقطر',
      editRecord: 'تعديل الرابط',
      newRecord: 'إنشاء رابط واتساب جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      campName: 'اسم الحملة أو الرابط (للتمييز الداخلي)',
      campNamePH: 'مثال: رابط بايو تيك توك',
      phone: 'رقم الواتساب (القطري)',
      phonePH: '55XXXXXX أو 33XXXXXX',
      message: 'الرسالة الجاهزة (اختياري)',
      messagePH: 'مثال: أهلاً، أريد الاستفسار عن عرض العطور...',
      saveBtnEdit: '💾 حفظ التعديلات',
      saveBtnNew: '+ حفظ الرابط في السجل',
      previewTitle: 'معاينة الرابط الحي',
      finalLink: 'الرابط النهائي (تحديث تلقائي):',
      linkWait: 'قم بإدخال الرقم لإنشاء الرابط...',
      copyBtn: '📋 نسخ الرابط',
      testBtn: '💬 تجربة الرابط',
      searchPH: '🔍 بحث باسم الحملة...',
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
        noRecords: 'لا توجد روابط واتساب مطابقة لبحثك.',
        th1: '#',
        th2: 'اسم الحملة',
        th3: 'رقم الواتساب',
        th4: 'الرسالة المجهزة',
        th5: 'الإجراءات',
        noMsg: 'بدون رسالة',
        copyLink: '🔗 نسخ',
        totalLabel: 'إجمالي الروابط المعروضة',
        linksCount: 'رابط'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 روابط). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم الحملة ورقم الواتساب بشكل صحيح.',
        updateSuccess: '✨ تم تحديث الرابط بنجاح!',
        saveSuccess: '✅ تم إنشاء الرابط وحفظه في السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا الرابط؟',
        copyErr: 'الرابط غير مكتمل بعد!',
        copySuccess: '📋 تم نسخ رابط الواتساب بنجاح! جاهز للاستخدام في حملاتك.',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد الروابط بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Quick WhatsApp Link Generator 🔗',
      desc: 'Create custom links with pre-filled messages for TikTok bios or Instagram campaigns in Qatar',
      editRecord: 'Edit Link',
      newRecord: 'Create New WhatsApp Link',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      campName: 'Campaign or Link Name (Internal)',
      campNamePH: 'e.g. TikTok Bio Link',
      phone: 'WhatsApp Number (Qatar)',
      phonePH: '55XXXXXX or 33XXXXXX',
      message: 'Pre-filled Message (Optional)',
      messagePH: 'e.g. Hello, I want to inquire about the perfume offer...',
      saveBtnEdit: '💾 Save Changes',
      saveBtnNew: '+ Save Link to Log',
      previewTitle: 'Live Link Preview',
      finalLink: 'Final Link (Auto-updates):',
      linkWait: 'Enter a number to generate the link...',
      copyBtn: '📋 Copy Link',
      testBtn: '💬 Test Link',
      searchPH: '🔍 Search by campaign name...',
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
        noRecords: 'No WhatsApp links currently match your search.',
        th1: '#',
        th2: 'Campaign Name',
        th3: 'WhatsApp Number',
        th4: 'Pre-filled Message',
        th5: 'Actions',
        noMsg: 'No message',
        copyLink: '🔗 Copy',
        totalLabel: 'Total Displayed Links',
        linksCount: 'link(s)'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 links). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure campaign name and WhatsApp number are filled correctly.',
        updateSuccess: '✨ Link updated successfully!',
        saveSuccess: '✅ Link created and saved successfully!',
        delConfirm: 'Are you sure you want to delete this link?',
        copyErr: 'Link is not complete yet!',
        copySuccess: '📋 WhatsApp link copied! Ready to use in your campaigns.',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Links imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handleClearForm = () => {
    setCampaignName('');
    setPhoneNumber('');
    setPresetMessage('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!campaignName.trim() || !formattedPhone) {
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
        campaignName,
        phoneNumber: formattedPhone,
        presetMessage,
        generatedLink: liveLink,
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: WaLinkItem = {
        id: Date.now().toString(),
        campaignName,
        phoneNumber: formattedPhone,
        presetMessage,
        generatedLink: liveLink,
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); // حفظ للأعلى
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: WaLinkItem) => {
    setCampaignName(item.campaignName);
    
    // إزالة رمز الدولة (974) إذا كان موجوداً لتسهيل التعديل
    let displayPhone = item.phoneNumber;
    if (displayPhone.startsWith('974')) {
      displayPhone = displayPhone.substring(3);
    }
    setPhoneNumber(displayPhone);
    setPresetMessage(item.presetMessage);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCopyLink = (linkToCopy: string) => {
    if (!linkToCopy) {
      alert(text.alerts.copyErr);
      return;
    }
    navigator.clipboard.writeText(linkToCopy);
    alert(text.alerts.copySuccess);
  };

  // فلترة النتائج بناءً على البحث والفرز الزمني
  const filteredItems = items.filter(item => {
    const matchesSearch = (item?.campaignName || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
                          (item?.presetMessage || '').toLowerCase().includes((searchQuery || '').toLowerCase());
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
                <th>${text.table.th2}</th>
                <th>Date / Time</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
                <th>Final Link</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.campaignName}</td>
          <td>${row.createdAt || '-'}</td>
          <td dir="ltr">${row.phoneNumber}</td>
          <td>${row.presetMessage}</td>
          <td dir="ltr">${row.generatedLink}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">${text.table.totalLabel}</td>
                <td>${filteredItems.length} ${text.table.linksCount}</td>
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
    link.setAttribute("download", `enjazya_qa_wa_links_${dateFilter}.xls`);
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

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input:focus, .input-wrapper textarea:focus { border-color: #8A1538; background: #ffffff; }
        
        .action-btn { background: #8A1538; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #6A102B; }
        
        .copy-btn { background: #8A1538; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #6A102B; }

        .test-btn { background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;}
        .test-btn:hover { background: #f1f5f9; }

        .link-preview-box { background: #FAF0F2; border: 1px dashed #EBB8C6; padding: 15px; border-radius: 8px; margin-bottom: 15px; direction: ltr; text-align: left; word-break: break-all; font-family: monospace; font-size: 13px; color: #8A1538; line-height: 1.5; min-height: 50px;}

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
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
        .btn-wa { background: #FAF0F2; color: #8A1538; border: 1px solid #EBB8C6; }
        .btn-wa:hover { background: #8A1538; color: #ffffff; }
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
            <div className="input-group">
              <label>{text.campName}</label>
              <div className="input-wrapper">
                <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder={text.campNamePH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.phone}</label>
              <div className="input-wrapper">
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={text.phonePH} required dir="ltr" style={{ textAlign: 'left' }} />
              </div>
            </div>

            <div className="input-group">
              <label>{text.message}</label>
              <div className="input-wrapper">
                <textarea 
                  rows={4} 
                  value={presetMessage} 
                  onChange={(e) => setPresetMessage(e.target.value)} 
                  placeholder={text.messagePH} 
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.previewTitle}</h2>

          <div className="input-group">
            <label>{text.finalLink}</label>
            <div className="link-preview-box">
              {liveLink || text.linkWait}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
            <button type="button" className="copy-btn" onClick={() => handleCopyLink(liveLink)} style={{ flex: 1 }}>
              {text.copyBtn}
            </button>
            
            {liveLink ? (
              <a href={liveLink} target="_blank" rel="noopener noreferrer" className="test-btn" style={{ flex: 1 }}>
                {text.testBtn}
              </a>
            ) : (
              <button type="button" className="test-btn" style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed' }}>
                {text.testBtn}
              </button>
            )}
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
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.campaignName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left', fontWeight: 700, color: '#8A1538' }}>{item.phoneNumber}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>
                      {item.presetMessage || <span style={{ color: '#94a3b8' }}>{text.table.noMsg}</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-wa" onClick={() => handleCopyLink(item.generatedLink)} title={text.table.copyLink}>{text.table.copyLink}</button>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{filteredItems.length} {text.table.linksCount}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
