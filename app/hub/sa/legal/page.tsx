'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface LegalItem {
  id: string;
  storeName: string;
  policyType: string;
  returnDays: number;
  contactEmail: string;
  generatedText: string;
}

export default function LegalPolicyGeneratorSA() {
  const [storeName, setStoreName] = useState<string>('متجر إنجازيا');
  const [policyType, setPolicyType] = useState<string>('سياسة الاستبدال والاسترجاع');
  const [returnDays, setReturnDays] = useState<number | ''>(7);
  const [contactEmail, setContactEmail] = useState<string>('support@store.com');

  const [items, setItems] = useState<LegalItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seerk_legal_policies_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: LegalItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_legal_policies_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const days = typeof returnDays === 'number' ? returnDays : 7;

  // توليد النص القانوني المتوافق مع نظام وزارة التجارة السعودي
  const generatedText = policyType.includes('الاستبدال') 
    ? `سياسة الاستبدال والاسترجاع لمتجر ${storeName || 'المتجر'}:\n\n1. يحق للعميل استرجاع أو استبدال المنتجات خلال (${days}) أيام من تاريخ استلام الطلب.\n2. يشترط أن يكون المنتج بحالته الأصلية، غير المستخدم، وبغلافه الأصلي.\n3. يتحمل العميل رسوم الشحن العكسي في حال لم يكن هناك عيب مصنعي.\n4. للبدء بإجراءات الاسترجاع، يرجى التواصل معنا عبر البريد: ${contactEmail || 'support@store.com'}.`
    : `سياسة الخصوصية وحماية البيانات لمتجر ${storeName || 'المتجر'}:\n\n1. نلتزم بحماية خصوصية بياناتك الشخصية ومعلومات الدفع وفقاً لنظام حماية البيانات الشخصية في المملكة.\n2. لا يتم مشاركة بيانات العملاء مع أي طرف ثالث إلا لأغراض الشحن والتوصيل فقط.\n3. نستخدم تقنيات تشفير عالية الأمان لضمان تسوق آمن وموثوق.\n4. لأي استفسارات تتعلق بالخصوصية، تواصل معنا عبر: ${contactEmail || 'support@store.com'}.`;

  const handleClearForm = () => {
    setStoreName('');
    setPolicyType('سياسة الاستبدال والاسترجاع');
    setReturnDays(7);
    setContactEmail('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 سياسات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!storeName.trim() || !contactEmail.trim()) {
      alert('الرجاء إدخال اسم المتجر وبريد التواصل.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        storeName,
        policyType,
        returnDays: days,
        contactEmail,
        generatedText,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث السياسة بنجاح!');
    } else {
      const newItem: LegalItem = {
        id: Date.now().toString(),
        storeName,
        policyType,
        returnDays: days,
        contactEmail,
        generatedText,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة السياسة إلى السجل بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: LegalItem) => {
    setStoreName(item.storeName);
    setPolicyType(item.policyType);
    setReturnDays(item.returnDays);
    setContactEmail(item.contactEmail);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه السياسة من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,StoreName,PolicyType,Days,Email\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.storeName},${row.policyType},${row.returnDays},${row.contactEmail}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_legal_policies.csv");
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
            alert('✨ تم استيراد السياسات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.policyType.toLowerCase().includes(searchQuery.toLowerCase())
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

        .preview-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; font-size: 13.5px; color: #0f172a; line-height: 1.8; white-space: pre-wrap; font-weight: 500; max-height: 400px; overflow-y: auto; }

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
          <h1>مولد السياسات القانونية (وزارة التجارة) ⚖</h1>
          <p>أنشئ صفحات الاستبدال والاسترجاع وسياسة الخصوصية المتوافقة تماماً مع القوانين التجارية في المملكة</p>
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
              <span>{editingId ? 'تعديل السياسة' : 'إنشاء سياسة جديدة'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول">
                🧹 مسح الحقول
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>اسم المتجر</label>
              <div className="input-wrapper">
                <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="مثال: متجر إنجازيا" required />
              </div>
            </div>

            <div className="input-group">
              <label>نوع السياسة القانونية</label>
              <div className="input-wrapper">
                <select value={policyType} onChange={(e) => setPolicyType(e.target.value)}>
                  <option value="سياسة الاستبدال والاسترجاع">سياسة الاستبدال والاسترجاع</option>
                  <option value="سياسة الخصوصية وحماية البيانات">سياسة الخصوصية وحماية البيانات</option>
                  <option value="الشروط والأحكام العامة">الشروط والأحكام العامة</option>
                </select>
              </div>
            </div>

            {policyType.includes('الاستبدال') && (
              <div className="input-group">
                <label>مدة الاستبدال والاسترجاع (بالأيام)</label>
                <div className="input-wrapper">
                  <input type="number" min="1" value={returnDays === '' ? '' : returnDays} onChange={(e) => setReturnDays(e.target.value === '' ? '' : Number(e.target.value))} placeholder="7" required />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>البريد الإلكتروني المعتمد للتواصل</label>
              <div className="input-wrapper">
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="support@store.com" required />
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 حفظ التعديلات' : '+ حفظ السياسة في السجل'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة الفورية */}
        <div className="card">
          <h2 className="card-title">معاينة النص القانوني المولد</h2>
          <div className="preview-box">
            {generatedText}
          </div>
        </div>
      </div>

      {/* جدول إدارة السجلات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث باسم المتجر أو نوع السياسة..." 
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
                <th>اسم المتجر</th>
                <th>نوع السياسة</th>
                <th>المدة (أيام)</th>
                <th>البريد الإلكتروني</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد سياسات مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.storeName}</td>
                    <td>{item.policyType}</td>
                    <td>{item.returnDays} أيام</td>
                    <td style={{ color: '#047857' }}>{item.contactEmail}</td>
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
