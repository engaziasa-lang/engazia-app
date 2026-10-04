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
  // تفريغ الحقول بالكامل كقيمة ابتدائية
  const [campaignName, setCampaignName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [presetMessage, setPresetMessage] = useState<string>('');

  const [items, setItems] = useState<WaLinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // حماية ضد أخطاء Hydration
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
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

  // معالجة رقم الجوال وتوليد الرابط المباشر
  let formattedPhone = phoneNumber.replace(/\D/g, ''); // إزالة أي رموز غير رقمية
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
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 روابط). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!campaignName.trim() || !formattedPhone) {
      alert('الرجاء التأكد من تعبئة اسم الحملة ورقم الواتساب بشكل صحيح.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

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
      alert('✨ تم تحديث الرابط بنجاح!');
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
      alert('✅ تم إنشاء الرابط وحفظه في السجل بنجاح!');
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
    if (confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCopyLink = (linkToCopy: string) => {
    if (!linkToCopy) {
      alert('الرابط غير مكتمل بعد!');
      return;
    }
    navigator.clipboard.writeText(linkToCopy);
    alert('📋 تم نسخ رابط الواتساب بنجاح! جاهز للاستخدام في حملاتك.');
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    let tableHtml = `
      <html dir="rtl" lang="ar">
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
                <th>م</th>
                <th>اسم الحملة / الرابط</th>
                <th>التاريخ والوقت</th>
                <th>رقم الواتساب</th>
                <th>الرسالة الجاهزة</th>
                <th>الرابط النهائي</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
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
                <td colspan="5">إجمالي الروابط المسجلة</td>
                <td>${items.length} رابط</td>
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
    link.setAttribute("download", "seerk_wa_links.xls");
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
            alert('✨ تم استيراد الروابط بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    (item?.campaignName || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (item?.presetMessage || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input:focus, .input-wrapper textarea:focus { border-color: #059669; background: #ffffff; }
        
        .action-btn { background: #059669; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #047857; }
        
        .copy-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #0369a1; }

        .test-btn { background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;}
        .test-btn:hover { background: #f1f5f9; }

        .link-preview-box { background: #f0fdf4; border: 1px dashed #4ade80; padding: 15px; border-radius: 8px; margin-bottom: 15px; direction: ltr; text-align: left; word-break: break-all; font-family: monospace; font-size: 13px; color: #065f46; line-height: 1.5; min-height: 50px;}

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: 'Tajawal', sans-serif;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-copy { background: #dcfce7; color: #15803d; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>صانع روابط واتساب السريعة 🔗</h1>
          <p>أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستقرام</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل الرابط' : 'إنشاء رابط واتساب جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول لتصبح فارغة تماماً">
                🧹 مسح الحقول
              </button>
            </span>
            {isClient && !isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم الحملة أو الرابط (للتمييز الداخلي)</label>
              <div className="input-wrapper">
                <input type="text" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="مثال: رابط بايو تيك توك" required />
              </div>
            </div>

            <div className="input-group">
              <label>رقم الواتساب (السعودي)</label>
              <div className="input-wrapper">
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="05XXXXXXXX" required dir="ltr" style={{ textAlign: 'left' }} />
              </div>
            </div>

            <div className="input-group">
              <label>الرسالة الجاهزة (اختياري)</label>
              <div className="input-wrapper">
                <textarea 
                  rows={4} 
                  value={presetMessage} 
                  onChange={(e) => setPresetMessage(e.target.value)} 
                  placeholder="مثال: أهلاً، أريد الاستفسار عن عرض العطور..." 
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ الرابط في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة الحية */}
        <div className="card">
          <h2 className="card-title">معاينة الرابط الحي</h2>

          <div className="input-group">
            <label>الرابط النهائي (تحديث تلقائي):</label>
            <div className="link-preview-box">
              {liveLink || 'قم بإدخال الرقم لإنشاء الرابط...'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="copy-btn" onClick={() => handleCopyLink(liveLink)} style={{ flex: 1 }}>
              📋 نسخ الرابط
            </button>
            
            {liveLink ? (
              <a href={liveLink} target="_blank" rel="noopener noreferrer" className="test-btn" style={{ flex: 1 }}>
                💬 تجربة الرابط
              </a>
            ) : (
              <button type="button" className="test-btn" style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed' }}>
                💬 تجربة الرابط
              </button>
            )}
          </div>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم الحملة..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel} title="تصدير بصيغة Excel لدعم اللغة العربية">📥 تصدير Excel</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 استيراد</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الحملة</th>
                <th>رقم الواتساب</th>
                <th>الرسالة المجهزة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد روابط واتساب مسجلة حالياً.
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
                    <td dir="ltr" style={{ textAlign: 'right', fontWeight: 700, color: '#047857' }}>{item.phoneNumber}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>
                      {item.presetMessage || <span style={{ color: '#94a3b8' }}>بدون رسالة</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-copy" onClick={() => handleCopyLink(item.generatedLink)} title="نسخ الرابط النهائي">🔗 نسخ</button>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={4} style={{ textAlign: 'center' }}>إجمالي الروابط المسجلة</td>
                  <td>{items.length} رابط</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
