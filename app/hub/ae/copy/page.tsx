'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CopyItem {
  id: string;
  productName: string;
  contentType: string;
  problemSolved: string;
  offerText: string;
  generatedScript: string;
  createdAt?: string;
}

export default function ExploredCopywritingAE() {
  const [productName, setProductName] = useState<string>('عطر إنجازيا الفاخر');
  const [contentSelect, setContentSelect] = useState<string>('إعلان فيديو تيك توك (حماسي)');
  const [customContentType, setCustomContentType] = useState<string>('إعلان فيديو تيك توك (حماسي)');
  const [problemSolved, setProblemSolved] = useState<string>('تدور على عطر فخم يثبت معاك طول اليوم وبسعر مناسب؟');
  const [offerText, setOfferText] = useState<string>('خصم 30% + توصيل مجاني لأول 100 طلب');
  const [generatedScript, setGeneratedScript] = useState<string>('');

  const [items, setItems] = useState<CopyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // تم تغيير مفتاح التخزين لفصل البيانات للإمارات
    const saved = localStorage.getItem('seerk_ae_copywriting_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const actualContentType = contentSelect === 'نوع آخر (كتابة يدوية)' ? customContentType : contentSelect;

  // توليد السكريبت تلقائياً عند تغيير المدخلات (باللهجة الإماراتية)
  useEffect(() => {
    const pName = productName.trim() || 'المنتج';
    const prob = problemSolved.trim() || 'تدور على الأفضل دايماً؟';
    const offer = offerText.trim() || 'عروض لفترة محدودة';

    if (contentSelect.includes('تيك توك')) {
      setGeneratedScript(
        `🎬 **[سكريبت إعلان تيك توك - باللهجة الإماراتية]**\n\n` +
        `🎵 *(موسيقى حماسية وترند في الخلفية)*\n\n` +
        `🗣️ **المشهد الأول (الخطاف - أول 3 ثواني):**\n` +
        `"يا مرحبا الساع، إذا ${prob}.. ركزوا وياي للآخر لأن هالشي بيفرق معاكم وايد!"\n\n` +
        `🗣️ **المشهد الثاني (المشكلة والحل):**\n` +
        `"وايد ندور على الجودة والشي الغاوي بس نلقى الأسعار نار.. لكن مع (${pName}) طاح الهم! المنتج فخم، عملي، ومصمم خصيصاً عشان يريحكم."\n\n` +
        `🗣️ **المشهد الثالث (العرض والطلب من الإكسبلور):**\n` +
        `"واللي يايين من الإكسبلور لهم بشارة طيبة: ${offer}!\n` +
        `الكمية محدودة جداً، الحق اطلب قبل لا يخلص المخزون، الرابط تحت بالفيديو أو بالبايو! 🚀"`
      );
    } else if (contentSelect.includes('سناب شات')) {
      setGeneratedScript(
        `👻 **[سكريبت سناب شات - تفاعلي وعفوي]**\n\n` +
        `🗣️ **سنابة 1 (جذب الانتباه):**\n` +
        `"مساكم الله بالخير يا الربع.. وصلني اليوم (${pName}) اللي مكسر الدنيا! تدرون إن ${prob}"\n\n` +
        `🗣️ **سنابة 2 (استعراض المنتج):**\n` +
        `"شوفوا وياي الجودة والتفاصيل كيف ما شاء الله. شي فاخر من الآخر ويهدي البال."\n\n` +
        `🗣 **سنابة 3 (Call to Action):**\n` +
        `"وعشانكم غالين علينا، وفرنا لكم: ${offer}.\n` +
        `ارفع الشاشة لفوق 👆 وطلبك يوصلك لباب بيتك وين ما كنت في الإمارات!"`
      );
    } else {
      setGeneratedScript(
        `📢 **[بوست إعلاني جذاب - تسويقي]**\n\n` +
        `🔥 يا هلا بكل متابع ومتابعـة!\n\n` +
        `إذا كنت ${prob}، مالك إلا (${pName}).\n\n` +
        `💎 **ليش تختارنا؟**\n` +
        `- جودة عالية تبيض الويه.\n` +
        `- خدمة عملاء على مدار الساعة.\n` +
        `- ${offer}.\n\n` +
        `🛒 لا تفوت الفرصة واطلب الحين عبر المتجر قبل نفاد الكمية!`
      );
    }
  }, [productName, contentSelect, customContentType, problemSolved, offerText]);

  const saveToLocalStorage = (newItems: CopyItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ae_copywriting_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setContentSelect(val);
    if (val !== 'نوع آخر (كتابة يدوية)') {
      setCustomContentType(val);
    } else {
      setCustomContentType('');
    }
  };

  const handleClearForm = () => {
    setProductName('عطر إنجازيا الفاخر');
    setContentSelect('إعلان فيديو تيك توك (حماسي)');
    setCustomContentType('إعلان فيديو تيك توك (حماسي)');
    setProblemSolved('تدور على عطر فخم يثبت معاك طول اليوم وبسعر مناسب؟');
    setOfferText('خصم 30% + توصيل مجاني لأول 100 طلب');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سكريبتات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    const finalType = contentSelect === 'نوع آخر (كتابة يدوية)' ? customContentType : contentSelect;
    if (!productName.trim() || !finalType.trim()) {
      alert('الرجاء التأكد من تعبئة اسم المنتج ونوع المحتوى.');
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    // تعديل التوقيت ليطابق الإمارات
    const formattedDate = `${now.toLocaleDateString('ar-AE')} - ${now.toLocaleTimeString('ar-AE', timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        contentType: finalType,
        problemSolved,
        offerText,
        generatedScript,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السكريبت بنجاح!');
    } else {
      const newItem: CopyItem = {
        id: Date.now().toString(),
        productName,
        contentType: finalType,
        problemSolved,
        offerText,
        generatedScript,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة السكريبت إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: CopyItem) => {
    setProductName(item.productName);
    const standardTypes = ['إعلان فيديو تيك توك (حماسي)', 'سكريبت سناب شات (تفاعلي)', 'بوست إعلاني جذاب'];
    if (standardTypes.includes(item.contentType)) {
      setContentSelect(item.contentType);
      setCustomContentType(item.contentType);
    } else {
      setContentSelect('نوع آخر (كتابة يدوية)');
      setCustomContentType(item.contentType);
    }
    setProblemSolved(item.problemSolved);
    setOfferText(item.offerText);
    setGeneratedScript(item.generatedScript);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السكريبت؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedScript);
    alert('📋 تم نسخ السكريبت بنجاح! جاهز للاستخدام في إعلانك القادم.');
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
                <th>اسم المنتج</th>
                <th>نوع المحتوى</th>
                <th>التاريخ والوقت</th>
                <th>العرض التسويقي</th>
                <th>النص الإعلاني</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.productName}</td>
          <td>${row.contentType}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.offerText}</td>
          <td>${row.generatedScript.replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">إجمالي السكريبتات المسجلة</td>
                <td>${items.length} سكريبت</td>
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
    link.setAttribute("download", "seerk_ae_explore_copywriting.xls");
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
            alert('✨ تم استيراد السكريبتات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contentType.toLowerCase().includes(searchQuery.toLowerCase())
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
        .btn-wa { background: #dcfce7; color: #166534; }
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مولد نصوص الإكسبلور باللهجة الإماراتية ✍️</h1>
          <p>اصنع سكريبتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة تفاعل العملاء ومعدل التحويل</p>
        </div>
        <Link href="/hub/ae" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل السكريبت' : 'توليد سكريبت إعلاني جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>اسم المنتج</label>
                <div className="input-wrapper">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: عطر إنجازيا الفاخر" required />
                </div>
              </div>
              <div className="input-group">
                <label>نوع المحتوى الإعلاني</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={contentSelect} onChange={handleSelectChange}>
                    <option value="إعلان فيديو تيك توك (حماسي)">إعلان فيديو تيك توك (حماسي) 🎬</option>
                    <option value="سكريبت سناب شات (تفاعلي)">سكريبت سناب شات (تفاعلي) 👻</option>
                    <option value="بوست إعلاني جذاب">بوست إعلاني جذاب 📢</option>
                    <option value="نوع آخر (كتابة يدوية)">➕ نوع آخر (كتابة يدوية)</option>
                  </select>
                </div>

                {contentSelect === 'نوع آخر (كتابة يدوية)' && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customContentType} 
                      onChange={(e) => setCustomContentType(e.target.value)} 
                      placeholder="اكتب نوع المحتوى هنا..." 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>المشكلة التي يحلها المنتج (باللهجة المحلية)</label>
              <div className="input-wrapper">
                <input type="text" value={problemSolved} onChange={(e) => setProblemSolved(e.target.value)} placeholder="تدور على عطر فخم يثبت معاك طول اليوم؟" required />
              </div>
            </div>

            <div className="input-group">
              <label>العرض التسويقي الخاص بالمتجر</label>
              <div className="input-wrapper">
                <input type="text" value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="خصم 30% + توصيل مجاني لأول 100 طلب" required />
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ السكريبت في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة والنسخ الفوري */}
        <div className="card">
          <h2 className="card-title">معاينة النص الإعلاني ({actualContentType})</h2>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <div className="input-wrapper">
              <textarea 
                rows={11} 
                value={generatedScript} 
                onChange={(e) => setGeneratedScript(e.target.value)} 
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'Tajawal, sans-serif', outline: 'none', background: '#f8fafc', color: '#0f172a', resize: 'vertical', lineHeight: '1.6' }}
              ></textarea>
            </div>
          </div>

          <button type="button" className="copy-btn" onClick={handleCopyText}>
            📋 نسخ السكريبت للحافظة
          </button>
        </div>
      </div>

      {/* جدول البيانات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المنتج أو نوع المحتوى..." 
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
                <th>المنتج والتاريخ</th>
                <th>نوع المحتوى</th>
                <th>العرض التسويقي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سكريبتات مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.productName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#0369a1' }}>{item.contentType}</span></td>
                    <td><span style={{ fontWeight: 700, color: '#047857' }}>{item.offerText}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-wa" onClick={() => { navigator.clipboard.writeText(item.generatedScript); alert('📋 تم نسخ السكريبت!'); }} title="نسخ النص">📋 نسخ</button>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>إجمالي السكريبتات المسجلة</td>
                  <td>{items.length} سكريبت</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
