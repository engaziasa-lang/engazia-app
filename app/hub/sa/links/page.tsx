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
}

export default function WaLinkGeneratorSA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [campaignName, setCampaignName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [presetMessage, setPresetMessage] = useState<string>('');

  const [items, setItems] = useState<WaLinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    const saved = localStorage.getItem('seerk_wa_link_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: WaLinkItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_wa_link_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'صانع روابط واتساب السريعة 🔗',
      desc: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستقرام في السوق السعودي',
      editRecord: 'تعديل الرابط',
      newRecord: 'إنشاء رابط واتساب جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      campNameLabel: 'اسم الحملة أو الرابط (للتمييز الداخلي)',
      campNamePH: 'مثال: رابط بايو تيك توك',
      phoneLabel: 'رقم الواتساب (السعودي)',
      phonePH: '05XXXXXXXX',
      msgLabel: 'الرسالة الجاهزة (اختياري)',
      msgPH: 'مثال: أهلاً، أريد الاستفسار عن عرض العطور...',
      saveBtnNew: '+ حفظ الرابط في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      previewTitle: 'معاينة الرابط الحي',
      finalLinkText: 'الرابط النهائي (تحديث تلقائي):',
      defaultLinkPH: 'قم بإدخال الرقم لإنشاء الرابط...',
      copyBtn: '📋 نسخ الرابط',
      testBtn: '💬 تجربة الرابط',
      searchPH: '🔍 بحث باسم الحملة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد روابط واتساب مسجلة حالياً.',
        th1: '#',
        th2: 'اسم الحملة',
        th3: 'رقم الواتساب',
        th4: 'الرسالة المجهزة',
        th5: 'الإجراءات',
        copyAction: '🔗 نسخ',
        editAction: '✏️',
        delAction: '❌',
        noMsg: 'بدون رسالة',
        totalLabel: 'إجمالي الروابط المسجلة',
        unit: 'رابط'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 روابط). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم الحملة ورقم الواتساب بشكل صحيح.',
        updateSuccess: '✨ تم تحديث الرابط بنجاح!',
        saveSuccess: '✅ تم إنشاء الرابط وحفظه في السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا الرابط؟',
        copyIncomplete: 'الرابط غير مكتمل بعد!',
        copySuccess: '📋 تم نسخ رابط الواتساب بنجاح! جاهز للاستخدام في حملاتك.',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد الروابط بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Quick WhatsApp Link Generator 🔗',
      desc: 'Create custom links with pre-filled messages for TikTok bio or Instagram campaigns in the Saudi market',
      editRecord: 'Edit Link',
      newRecord: 'Create New WhatsApp Link',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      campNameLabel: 'Campaign or Link Name (Internal)',
      campNamePH: 'e.g. TikTok Bio Link',
      phoneLabel: 'WhatsApp Number (Saudi)',
      phonePH: '05XXXXXXXX',
      msgLabel: 'Pre-filled Message (Optional)',
      msgPH: 'e.g. Hi, I would like to inquire about the perfume offer...',
      saveBtnNew: '+ Save Link to Log',
      saveBtnEdit: '💾 Save Changes',
      previewTitle: 'Live Link Preview',
      finalLinkText: 'Final Link (Auto-updates):',
      defaultLinkPH: 'Enter phone number to generate link...',
      copyBtn: '📋 Copy Link',
      testBtn: '💬 Test Link',
      searchPH: '🔍 Search by campaign name...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No WhatsApp links currently registered.',
        th1: '#',
        th2: 'Campaign Name',
        th3: 'WhatsApp Number',
        th4: 'Prepared Message',
        th5: 'Actions',
        copyAction: '🔗 Copy',
        editAction: '✏️',
        delAction: '❌',
        noMsg: 'No message',
        totalLabel: 'Total Registered Links',
        unit: 'links'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 links). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure campaign name and WhatsApp number are entered correctly.',
        updateSuccess: '✨ Link updated successfully!',
        saveSuccess: '✅ Link created and saved to log successfully!',
        delConfirm: 'Are you sure you want to delete this link?',
        copyIncomplete: 'Link is not complete yet!',
        copySuccess: '📋 WhatsApp link copied successfully! Ready for your campaigns.',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Links imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  let formattedPhone = phoneNumber.replace(/\D/g, '');
  if (formattedPhone.startsWith('05')) {
    formattedPhone = '966' + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith('5') && formattedPhone.length === 9) {
    formattedPhone = '966' + formattedPhone;
  }

  const liveLink = formattedPhone 
    ? `https://wa.me/${formattedPhone}${presetMessage.trim() ? `?text=${encodeURIComponent(presetMessage.trim())}` : ''}`
    : '';

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
    const localeStr = lang === 'ar' ? 'ar-SA' : 'en-US';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        campaignName,
        phoneNumber: formattedPhone,
        presetMessage,
        generatedLink: liveLink,
        createdAt: item.createdAt || formattedDate
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
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: WaLinkItem) => {
    setCampaignName(item.campaignName);
    setPhoneNumber(item.phoneNumber);
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
      alert(text.alerts.copyIncomplete);
      return;
    }
    navigator.clipboard.writeText(linkToCopy);
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
          <h2>WhatsApp Link Generator Report</h2>
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
          <td>${row.campaignName}</td>
          <td dir="ltr">${row.phoneNumber}</td>
          <td>${row.presetMessage}</td>
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
    link.setAttribute("download", "enjazya_sa_wa_links.xls");
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
    (item?.campaignName || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (item?.presetMessage || '').toLowerCase().includes((searchQuery || '').toLowerCase())
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
        .input-wrapper input, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input:focus, .input-wrapper textarea:focus { border-color: #059669; background: #ffffff; }
        
        .action-btn { background: #059669; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #047857; }
        
        .copy-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #0369a1; }

        .test-btn { background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;}
        .test-btn:hover { background: #f1f5f9; }

        .link-preview-box { background: #f0fdf4; border: 1px dashed #4ade80; padding: 15px; border-radius: 8px; margin-bottom: 15px; direction: ltr; text-align: left; word-break: break-all; font-family: monospace; font-size: 13px; color: #065f46; line-height: 1.5; min-height: 50px;}

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
        .btn-copy { background: #dcfce7; color: #15803d; }
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
            <div className="input-group">
              <label>{text.campNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder={text.campNamePH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.phoneLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={text.phonePH} required dir="ltr" style={{ textAlign: 'left' }} />
              </div>
            </div>

            <div className="input-group">
              <label>{text.msgLabel}</label>
              <div className="input-wrapper">
                <textarea 
                  rows={4} 
                  value={presetMessage} 
                  onChange={(e) => setPresetMessage(e.target.value)} 
                  placeholder={text.msgPH} 
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
            <label>{text.finalLinkText}</label>
            <div className="link-preview-box">
              {liveLink || text.defaultLinkPH}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
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
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.campaignName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left', fontWeight: 700, color: '#047857' }}>{item.phoneNumber}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>
                      {item.presetMessage || <span style={{ color: '#94a3b8' }}>{text.table.noMsg}</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-copy" onClick={() => handleCopyLink(item.generatedLink)} title="Copy Link">{text.table.copyAction}</button>
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
