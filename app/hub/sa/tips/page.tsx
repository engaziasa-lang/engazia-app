'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface GrowthTipItem {
  id: string;
  tipTitle: string;
  category: string;
  description: string;
  actionStep: string;
  status: string;
}

export default function GrowthTipsSA() {
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [items, setItems] = useState<GrowthTipItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tipTitle, setTipTitle] = useState<string>('تفعيل خيارات الدفع المحلي الموثوقة (مدى وأبل باي)');
  const [category, setCategory] = useState<string>('التحويل والمبيعات');
  const [description, setDescription] = useState<string>('المستهلك السعودي يثق بشكل مطلق ببطاقات "مدى" و"Apple Pay". إبراز هذه الشعارات في صفحة الدفع يرفع معدل إتمام السلة بنسبة تتجاوز 40%.');
  const [actionStep, setActionStep] = useState<string>('تأكد من تفعيل بوابة دفع تدعم مدى وأبل باي بشكل مباشر في متجرك.');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tipsList = [
    {
      title: 'تفعيل خيارات الدفع المحلي الموثوقة (مدى وأبل باي)',
      category: 'التحويل والمبيعات',
      desc: 'المستهلك السعودي يثق بشكل مطلق ببطاقات "مدى" و"Apple Pay". إبراز هذه الشعارات في صفحة الدفع يرفع معدل إتمام السلة بنسبة تتجاوز 40%.',
      action: 'تأكد من تفعيل بوابة دفع تدعم مدى وأبل باي بشكل مباشر في متجرك.',
    },
    {
      title: 'الدمج الذكي لخدمات الشراء الآن وادفع لاحقاً (تابي وتمارا)',
      category: 'التسسيط والقدرة الشرائية',
      desc: 'إتاحة خيار التقسيم على 4 دفعات بدون فوائد يزيل تردد العميل الشرائي ويزيد متوسط قيمة السلة (AOV) بنسبة تصل إلى 35%.',
      action: 'اربط متجرك بخدمتي تابي وتمارا واعرض أزرار الأقساط بصفحة المنتج مباشرة.',
    },
    {
      title: 'حملات إكسبلور تيك توك وسناب شات باللهجة المحلية',
      category: 'التسويق والإعلانات',
      desc: 'المحتوى العفوي باللهجة السعودية المصور بطريقة "القصة أو التجربة" يحقق تفاعلاً أعلى بأضعاف من الإعلانات التقليدية.',
      action: 'اصنع فيديوهات قصيرة مدتها 15 ثانية تبدأ بمشكلة يحلها منتجك بأسلوب محلي.',
    },
    {
      title: 'خدمة عملاء واتساب السريعة خلال 5 دقائق',
      category: 'الاحتفاظ بالعملاء',
      desc: 'السرعة في الرد على استفسارات واتساب قبل إتمام الطلب ترفع نسبة إغلاق المبيعات المتروكة بأكثر من 50%.',
      action: 'وفر زر واتساب عائم بصفحة المنتج وضع ردوداً آلية جاهزة للاستفسارات السريعة.',
    },
    {
      title: 'تنويع خيارات الشحن وإضافة الاستلام من الخزائن (RedBox)',
      category: 'اللوجستيات والشحن',
      desc: 'الكثير من العملاء يفضلون استلام طلباتهم بأنفسهم عبر خزائن الذكية لتجنب انتظار مندوب التوصيل في المنزل.',
      action: 'اربط متجرك بشركات شحن توفر خدمة الخزائن الذكية كخيار إضافي.',
    },
    {
      title: 'الشفافية الكاملة وعرض السعر الشامل للضريبة (%15)',
      category: 'الالتزام والأنظمة',
      desc: 'إظهار السعر النهائي شاملاً ضريبة القيمة المضافة منذ البداية يبني ثقة عمياء بين العميل والمتجر ويقلل الاسترجاع.',
      action: 'راجع أسعار منتجاتك في المتجر واجعل السعر الظاهر هو السعر النهائي للعميل.',
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('seerk_growth_tips_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: GrowthTipItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_growth_tips_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const handleSelectTip = (index: number) => {
    setSelectedTip(index);
    setTipTitle(tipsList[index].title);
    setCategory(tipsList[index].category);
    setDescription(tipsList[index].desc);
    setActionStep(tipsList[index].action);
    setEditingId(null);
  };

  const handleClearForm = () => {
    setTipTitle('');
    setCategory('');
    setDescription('');
    setActionStep('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 استراتيجيات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!tipTitle.trim()) {
      alert('الرجاء إدخال عنوان الاستراتيجية.');
      return;
    }

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        tipTitle,
        category,
        description,
        actionStep,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث الاستراتيجية بنجاح!');
    } else {
      const newItem: GrowthTipItem = {
        id: Date.now().toString(),
        tipTitle,
        category,
        description,
        actionStep,
        status: 'مفعل ومطبق',
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الاستراتيجية إلى سجلك بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: GrowthTipItem) => {
    setTipTitle(item.tipTitle);
    setCategory(item.category);
    setDescription(item.description);
    setActionStep(item.actionStep);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الاستراتيجية من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }
    let csv = "data:text/csv;charset=utf-8,ID,Title,Category,Status\n";
    items.forEach((row, idx) => {
      csv += `${idx + 1},${row.tipTitle},${row.category},${row.status}\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "seerk_growth_tips.csv");
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
            alert('✨ تم استيراد الاستراتيجيات بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => item.tipTitle.toLowerCase().includes(searchQuery.toLowerCase()));

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
        
        .grid-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .tips-list { display: flex; flex-direction: column; gap: 10px; }
        .tip-item { padding: 12px 16px; border-radius: 10px; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer; font-weight: 700; font-size: 13.5px; color: #334155; transition: all 0.2s; }
        .tip-item:hover { background: #f1f5f9; color: #0f172a; }
        .tip-item.active { background: #ecfdf5; border-color: #047857; color: #047857; }

        .tip-detail-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; font-size: 14px; color: #0f172a; line-height: 1.8; margin-bottom: 20px; font-weight: 600; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .action-btn:hover { background: #065f46; }

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
          <h1>أسرار نمو المتاجر السعودية 💡</h1>
          <p>مكتبة استراتيجيات حصرية لزيادة التحويل، تقليل المرتجعات، ورفع ولاء العملاء في السوق المحلي</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قائمة الاستراتيجيات الجاهزة */}
        <div className="card">
          <h2 className="card-title">مواضيع النمو (6 استراتيجيات)</h2>
          <div className="tips-list">
            {tipsList.map((tip, idx) => (
              <div 
                key={idx} 
                className={`tip-item ${selectedTip === idx ? 'active' : ''}`}
                onClick={() => handleSelectTip(idx)}
              >
                {tip.title}
              </div>
            ))}
          </div>
        </div>

        {/* تفاصيل الاستراتيجية وتطبيقها */}
        <div className="card">
          <h2 className="card-title">
            <span>تفاصيل والتطبيق العملي</span>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <div style={{ marginBottom: '10px', fontSize: '13px', fontWeight: 700, color: '#475569' }}>التصنيف: {category}</div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 15px 0' }}>{tipTitle}</h3>

          <div className="tip-detail-box">
            <p style={{ margin: '0 0 10px 0' }}><strong>💡 السر الاستراتيجي:</strong> {description}</p>
            <p style={{ margin: 0 }}><strong>🚀 خطوات التطبيق العملي في متجرك:</strong> {actionStep}</p>
          </div>

          <button type="button" className="action-btn" onClick={(e) => {
            e.preventDefault();
            if (!isActivated && items.length >= 3 && !editingId) {
              alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 استراتيجيات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
              return;
            }
            const newItem: GrowthTipItem = {
              id: Date.now().toString(),
              tipTitle,
              category,
              description,
              actionStep,
              status: 'مفعل ومطبق',
            };
            saveToLocalStorage([...items, newItem]);
            alert('✅ تمت إضافة هذه الاستراتيجية إلى سجلك بنجاح!');
          }}>
            + حفظ هذه الاستراتيجية في سجلي
          </button>
        </div>
      </div>

      {/* جدول إدارة السجلات السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث في الاستراتيجيات المحفوظة..." 
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
                <th>عنوان الاستراتيجية</th>
                <th>التصنيف</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد استراتيجيات محفوظة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 800 }}>{item.tipTitle}</td>
                    <td><span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>{item.category}</span></td>
                    <td><span style={{ background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>{item.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
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
