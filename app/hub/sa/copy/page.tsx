'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CopywritingItem {
  id: string;
  productName: string;
  copyStyle: string;
  mainBenefit: string;
  offerText: string;
  generatedCopy: string;
}

export default function CopywritingGeneratorSA() {
  const [productName, setProductName] = useState<string>('عطر ليالي نجد');
  const [copyStyle, setCopyStyle] = useState<string>('أفضل أسلوب الجذب السريع (Hook)');
  const [mainBenefit, setMainBenefit] = useState<string>('ثبات يطول طوال اليوم وفواح بشكل خيالي');
  const [offerText, setOfferText] = useState<string>('خصم 30% مع شحن مجاني لفترة محدودة');

  const [items, setItems] = useState<CopywritingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_copywriting_generator_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: CopywritingItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_copywriting_generator_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  // توليد النص التسويقي بناءً على الأسلوب المختار
  const generatedCopy = copyStyle.includes('Hook')
    ? `🔥 يا أهلنا في السعودية! 🇸🇦\nدوركم على عطر فخم ومميز يثبت معك من الصباح لين الليل؟\n\nنقدم لكم (${productName || 'المنتج'}) - ${mainBenefit || 'جودة عالية تدوم طويلاً'}.\n\n✨ العرض الحالي: ${offerText || 'خصم لفترة محدودة'}\n\n🛒 اطلبه الحين من المتجر ولا تفوت الفرصة!`
    : copyStyle.includes('Storytelling')
    ? `📖 قصة نجاح يومية:\nكنت أدور دايم على ${productName || 'منتج مميز'} يعطيني النتيجة اللي أبيها بدون تعقيد.. لين طحت على هذا المنتج المعجزة!\n\nالمميز فيه إن ${mainBenefit || 'يحل المشكلة من أول استخدام'}.\n\n🎁 لا تفوت عرضنا: ${offerText || 'لفترة محدودة'}، اطلبه اليوم!`
    : `⚡ تنبيه هام لكل عملاءنا الكرام في المملكة!\n\nباقي ساعات قليلة وينتهي عرض (${offerText || 'العرض الخاص'}) على ${productName || 'المنتج'} الأكثر طلباً.\n\nالمميزات: ${mainBenefit || 'أعلى جودة بأفضل سعر'}.\n\n⏳ اطلب الآن قبل نفاذ الكمية من المتجر!`;

  const handleClearForm = () => {
    setProductName('');
    setCopyStyle('أفضل أسلوب الجذب السريع (Hook)');
    setMainBenefit('');
    setOfferText('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 نصوص). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!productName.trim()) {
      alert('الرجاء إدخال اسم المنتج أو الخدمة.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        copyStyle,
        mainBenefit,
        offerText,
        generatedCopy,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث النص التسويقي بنجاح!');
    } else {
      const newItem: CopywritingItem = {
        id: Date.now().toString(),
        productName,
        copyStyle,
        mainBenefit: mainBenefit || 'جودة عالية',
        offerText: offerText || 'عرض خاص',
        generatedCopy,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة النص التسويقي إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: CopywritingItem) => {
    setProductName(item.productName);
    setCopyStyle(item.copyStyle);
    setMainBenefit(item.mainBenefit);
    setOfferText(item.offerText);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا النص من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,Product,Style,Benefit,Offer\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.productName},${row.copyStyle},${row.mainBenefit},${row.offerText}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_copywriting_generator.csv");
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
            alert('✨ تم استيراد النصوص بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.copyStyle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 40px auto; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; }
        .action-btn:hover { background: #065f46; }

        .preview-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; font-size: 13.5px; color: #0f172a; line-height: 1.8; white-space: pre-wrap; font-weight: 500; max-height: 320px; overflow-y: auto; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 250px; }
        .table-btns { display: flex; gap: 10px; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; }
        .t-btn:hover { background: #f1f5f9; }

        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مولد النصوص التسويقية الإبداعية ✍️</h1>
          <p>اصنع نصوص إعلانية جذابة بأساليب (الجذب السريع، القصة، والإلحاح) لزيادة معدل التحويل والمبيعات</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{editingId ? 'تعديل النص التسويقي' : 'إنشاء نص جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المنتج أو الخدمة</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: عطر ليالي نجد" required />
              </div>
            </div>

            <div className="input-group">
              <label>ألوب الإعلان والصياغة</label>
              <div className="input-wrapper">
                <select value={copyStyle} onChange={(e) => setCopyStyle(e.target.value)}>
                  <option value="أفضل أسلوب الجذب السريع (Hook)">🔥 أسلوب الجذب السريع (Hook)</option>
                  <option value="أسلوب القصة والتجربة (Storytelling)">📖 أسلوب القصة والتجربة (Storytelling)</option>
                  <option value="أسلوب الإلحاح والعرض السريع (Urgency)">⚡ أسلوب الإلحاح والعرض السريع (Urgency)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>الميزة الكبرى أو فائدة المنتج</label>
              <div className="input-wrapper">
                <input type="text" value={mainBenefit} onChange={(e) => setMainBenefit(e.target.value)} placeholder="مثال: ثبات يطول طوال اليوم وفواح بشكل خيالي" />
              </div>
            </div>

            <div className="input-group">
              <label>العرض أو الخصم الحالي</label>
              <div className="input-wrapper">
                <input type="text" value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder="مثال: خصم 30% مع شحن مجاني لفترة محدودة" />
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ النص في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة الفورية */}
        <div className="card">
          <h2 className="card-title">معاينة النص التسويقي المولد</h2>
          <div className="preview-box">
            {generatedCopy}
          </div>
        </div>
      </div>

      {/* جدول إدارة السجلات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المنتج أو الأسلوب..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportCsv}>📥 تصدير CSV</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 استيراد</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم المنتج</th>
                <th>أسلوب الصياغة</th>
                <th>الميزة الكبرى</th>
                <th>العرض</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد نصوص تسويقية مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.productName}</td>
                    <td>{item.copyStyle}</td>
                    <td>{item.mainBenefit}</td>
                    <td>{item.offerText}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(item)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>تعديل</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
