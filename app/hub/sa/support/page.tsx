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
  const [customerName, setCustomerName] = useState<string>('خالد');
  const [inquirySelect, setInquirySelect] = useState<string>('استفسار عن تأخر الشحنة');
  const [customInquiryType, setCustomInquiryType] = useState<string>('استفسار عن تأخر الشحنة');
  const [storeName, setStoreName] = useState<string>('متجر إنجازيا');
  const [orderNumber, setOrderNumber] = useState<string>('#84920');
  const [generatedReply, setGeneratedReply] = useState<string>('');

  const [items, setItems] = useState<SupportItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_support_templates_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const actualInquiryType = inquirySelect === 'استفسار آخر (كتابة يدوية)' ? customInquiryType : inquirySelect;

  // توليد الرد تلقائياً عند تغيير المدخلات
  useEffect(() => {
    const cName = customerName.trim() || 'عزيزنا العميل';
    const sName = storeName.trim() || 'المتجر';
    const oNum = orderNumber.trim() || 'الطلب';

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
        `بخصوص استفسارك عن (${actualInquiryType}) للطلب (${oNum})، نحن نعمل بكل جهد لخدمتك وتلبية طلبك في أسرع وقت ممكن. نسعد دائماً بتواصلك معنا!`
      );
    }
  }, [customerName, inquirySelect, customInquiryType, storeName, orderNumber]);

  const saveToLocalStorage = (newItems: SupportItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_support_templates_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setInquirySelect(val);
    if (val !== 'استفسار آخر (كتابة يدوية)') {
      setCustomInquiryType(val);
    } else {
      setCustomInquiryType('');
    }
  };

  const handleClearForm = () => {
    setCustomerName('خالد');
    setInquirySelect('استفسار عن تأخر الشحنة');
    setCustomInquiryType('استفسار عن تأخر الشحنة');
    setStoreName('متجر إنجازيا');
    setOrderNumber('#84920');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 قوالب). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    const finalType = inquirySelect === 'استفسار آخر (كتابة يدوية)' ? customInquiryType : inquirySelect;
    if (!customerName.trim() || !finalType.trim()) {
      alert('الرجاء التأكد من تعبئة اسم العميل ونوع الاستفسار.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = `${now.toLocaleDateString('ar-SA')} - ${now.toLocaleTimeString('ar-SA', timeOptions)}`;

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
      alert('✨ تم تحديث القالب بنجاح!');
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
      alert('✅ تمت إضافة الرد إلى سجل خدمة العملاء بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: SupportItem) => {
    setCustomerName(item.customerName);
    const standardInquiries = ['استفسار عن تأخر الشحنة', 'طلب الاستبدال والاسترجاع', 'استفسار عن الدفع والتحصيل'];
    if (standardInquiries.includes(item.inquiryType)) {
      setInquirySelect(item.inquiryType);
      setCustomInquiryType(item.inquiryType);
    } else {
      setInquirySelect('استفسار آخر (كتابة يدوية)');
      setCustomInquiryType(item.inquiryType);
    }
    setStoreName(item.storeName);
    setOrderNumber(item.orderNumber);
    setGeneratedReply(item.generatedReply);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedReply);
    alert('📋 تم نسخ الرد بنجاح! جاهز للإرسال للعميل عبر واتساب.');
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
                <th>اسم العميل</th>
                <th>نوع الاستفسار</th>
                <th>رقم الطلب</th>
                <th>التاريخ والوقت</th>
                <th>نص الرد الجاهز</th>
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
          <td>${row.createdAt || '-'}</td>
          <td>${row.generatedReply.replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">إجمالي القوالب المسجلة</td>
                <td>${items.length} قوالب</td>
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
    link.setAttribute("download", "seerk_support_templates.xls");
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
            alert('✨ تم استيراد قوالب خدمة العملاء بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
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
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }
        
        .copy-btn { background: #0369a1; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #0284c7; }

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
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>قوالب خدمة العملاء السريعة 🎧</h1>
          <p>انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة عبر واتساب</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل القالب' : 'توليد قالب رد جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>اسم العميل</label>
                <div className="input-wrapper">
                  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: خالد" required />
                </div>
              </div>
              <div className="input-group">
                <label>نوع الاستفسار</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={inquirySelect} onChange={handleSelectChange}>
                    <option value="استفسار عن تأخر الشحنة">استفسار عن تأخر الشحنة 🚚</option>
                    <option value="طلب الاستبدال والاسترجاع">طلب الاستبدال والاسترجاع 🔄</option>
                    <option value="استفسار عن الدفع والتحصيل">استفسار عن الدفع والتحصيل 💳</option>
                    <option value="استفسار آخر (كتابة يدوية)">➕ استفسار آخر (كتابة يدوية)</option>
                  </select>
                </div>

                {inquirySelect === 'استفسار آخر (كتابة يدوية)' && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customInquiryType} 
                      onChange={(e) => setCustomInquiryType(e.target.value)} 
                      placeholder="اكتب نوع الاستفسار هنا..." 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>اسم المتجر</label>
                <div className="input-wrapper">
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="متجر إنجازيا" required />
                </div>
              </div>
              <div className="input-group">
                <label>رقم الطلب</label>
                <div className="input-wrapper">
                  <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="#84920" required />
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ القالب في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة والنسخ الفوري */}
        <div className="card">
          <h2 className="card-title">معاينة نص الرد الاحترافي ({actualInquiryType})</h2>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <div className="input-wrapper">
              <textarea 
                rows={10} 
                value={generatedReply} 
                onChange={(e) => setGeneratedReply(e.target.value)} 
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'Tajawal, sans-serif', outline: 'none', background: '#f8fafc', color: '#0f172a', resize: 'vertical', lineHeight: '1.6' }}
              ></textarea>
            </div>
          </div>

          <button type="button" className="copy-btn" onClick={handleCopyText}>
            📋 نسخ الرد للحافظة واتساب
          </button>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم العميل أو نوع الاستفسار..." 
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
                <th>العميل والتاريخ</th>
                <th>نوع الاستفسار</th>
                <th>رقم الطلب</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد قوالب ردود مسجلة حالياً.
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
                        <button className="tb-action-btn btn-wa" onClick={() => { navigator.clipboard.writeText(item.generatedReply); alert('📋 تم نسخ الرد!'); }} title="نسخ النص">📋 نسخ</button>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>إجمالي القوالب المسجلة</td>
                  <td>{items.length} قوالب</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
