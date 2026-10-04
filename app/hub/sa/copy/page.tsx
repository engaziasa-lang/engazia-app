'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ExplorScriptItem {
  id: string;
  productName: string;
  hookStyle: string;
  targetAudience: string;
  generatedScript: string;
}

export default function ExplorGeneratorSA() {
  const [productName, setProductName] = useState<string>('منتج مميز لمتجرنا');
  const [hookStyle, setHookStyle] = useState<string>('طريقة "يا إلهي، كيف ما شفت هذا من زمان؟"');
  const [targetAudience, setTargetAudience] = useState<string>('المتصفحين في إكسبلور تيك توك وسناب');
  const [problemSolved, setProblemSolved] = useState<string>('يوفر الوقت والجهد ويفك عزلتي بالبيت');

  const [items, setItems] = useState<ExplorScriptItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_explor_generator_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ExplorScriptItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_explor_generator_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  // توليد سكربت الإكسبلور الاحترافي باللهجة السعودية
  const generatedScript = `🎬 **سكربت فيديو إكسبلور (باللهجة السعودية)**:\n\n[الخطاف / الهووك - أول 3 ثواني]:\n"يا جماعة الخير، قسم بالله طحت على شي راح يفك عنا أزمة ويختصر عليكم نص مشاويركم! اسمعوني للأخير.." 🤯\n\n[المشكلة والصدمة]:\n"دايماً نواجه مشكلة إننا ${problemSolved || 'ندور على حل عملي وسريع وما نلقى شي يضبط معنا صح؟'}.. بس كل هذا تغير!"\n\n[الحل واستعراض المنتج]:\n"شوفوا معي ${productName || 'هذا المنتج الجبار'}.. تصميم فخم، جودة عالية، ومصمم خصيصاً لكل من يعاني من نفس السالفة في ${targetAudience || 'السوق السعودي'}."\n\n[الدعوة لاتخاذ إجراء - CTA]:\n"الكمية محدودة والطلب عالي جداً، الحق العرض واطلبها الحين من الرابط البايو أو المتجر قبل لا تخلص! 🛍️✨"`;

  const handleClearForm = () => {
    setProductName('');
    setHookStyle('طريقة "يا إلهي، كيف ما شفت هذا من زمان؟"');
    setTargetAudience('');
    setProblemSolved('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سكربتات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!productName.trim()) {
      alert('الرجاء إدخال اسم المنتج.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        hookStyle,
        targetAudience: targetAudience || 'عام',
        generatedScript,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السكربت بنجاح!');
    } else {
      const newItem: ExplorScriptItem = {
        id: Date.now().toString(),
        productName,
        hookStyle,
        targetAudience: targetAudience || 'عام',
        generatedScript,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة السكربت إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: ExplorScriptItem) => {
    setProductName(item.productName);
    setHookStyle(item.hookStyle);
    setTargetAudience(item.targetAudience);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السكربت من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,Product,HookStyle,Audience\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.productName},${row.hookStyle},${row.targetAudience}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_explor_generator.csv");
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
            alert('✨ تم استيراد السكربتات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.hookStyle.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1>مولد نصوص الإكسبلور (باللهجة السعودية) 🎬</h1>
          <p>اصنع سكربتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة التفاعل ومعدل التحويل في متجرك</p>
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
              <span>{editingId ? 'تعديل السكربت' : 'صناعة سكربت جديد'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المنتج أو الخدمة المعلن عنها</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: جهاز تنظيف لاسلكي" required />
              </div>
            </div>

            <div className="input-group">
              <label>نمط الخطاف (الهووك - أول 3 ثواني)</label>
              <div className="input-wrapper">
                <select value={hookStyle} onChange={(e) => setHookStyle(e.target.value)}>
                  <option value='طريقة "يا إلهي، كيف ما شفت هذا من زمان؟"'>طريقة "يا إلهي، كيف ما شفت هذا من زمان؟"</option>
                  <option value='طريقة "تحدي أو صدمة بأسعار السوق"'>طريقة "تحدي أو صدمة بأسعار السوق"</option>
                  <option value='طريقة "حل مشكلة يومية مزعجة"'>طريقة "حل مشكلة يومية مزعجة"</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>المشكلة التي يحلها المنتج</label>
              <div className="input-wrapper">
                <input type="text" value={problemSolved} onChange={(e) => setProblemSolved(e.target.value)} placeholder="مثال: يوفر الوقت والجهد في التنظيف" />
              </div>
            </div>

            <div className="input-group">
              <label>الفئة المستهدفة في السعودية</label>
              <div className="input-wrapper">
                <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="مثال: ربات البيوت والمهتمين بالترتيب" />
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ السكربت في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة الفورية */}
        <div className="card">
          <h2 className="card-title">معاينة السكربت المولد</h2>
          <div className="preview-box">
            {generatedScript}
          </div>
        </div>
      </div>

      {/* جدول إدارة السجلات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المنتج أو النمط..." 
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
                <th>نمط الخطاف (الهووك)</th>
                <th>الفئة المستهدفة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سكربتات مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.productName}</td>
                    <td>{item.hookStyle}</td>
                    <td>{item.targetAudience}</td>
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
