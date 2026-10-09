'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ABTestItem {
  id: string;
  testName: string;
  campAName: string;
  campASpend: number;
  campAOrders: number;
  campACpa: number;
  campBName: string;
  campBSpend: number;
  campBOrders: number;
  campBCpa: number;
  winner: string;
  createdAt?: string;
}

export default function ABTestingCalculatorQA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // تفريغ الحقول بالكامل كقيمة ابتدائية
  const [testName, setTestName] = useState<string>('');
  
  const [campAName, setCampAName] = useState<string>('');
  const [campASpend, setCampASpend] = useState<number | ''>('');
  const [campAOrders, setCampAOrders] = useState<number | ''>('');

  const [campBName, setCampBName] = useState<string>('');
  const [campBSpend, setCampBSpend] = useState<number | ''>('');
  const [campBOrders, setCampBOrders] = useState<number | ''>('');

  const [items, setItems] = useState<ABTestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    // استخدام مفتاح التفعيل الخاص بقطر فقط
    setIsActivated(!!localStorage.getItem('merchant_license_key_qa'));
    
    // قراءة اللغة
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    // استخدام مساحة حفظ منفصلة تماماً للسوق القطري
    const saved = localStorage.getItem('seerk_qa_ab_testing_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  // قاموس الترجمة
  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة اختبارات الإعلانات (A/B) ⚖️',
      desc: 'قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب',
      newEdit: 'تعديل الاختبار',
      newAdd: 'إضافة اختبار A/B جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      testName: 'مسمى الاختبار الاستراتيجي',
      testNamePH: 'مثال: مقارنة إعلان تيك توك ضد إنستقرام',
      campA: 'الحملة الأولى (أ)',
      campAName: 'اسم الحملة (أ)',
      campANamePH: 'مثال: إعلان تيك توك',
      campB: 'الحملة الثانية (ب)',
      campBName: 'اسم الحملة (ب)',
      campBNamePH: 'مثال: إعلان إنستقرام',
      adSpend: 'تكلفة الإعلان',
      orders: 'عدد الطلبات',
      saveBtnNew: '+ حفظ نتيجة الاختبار في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      liveCompare: 'مقارنة النتائج الحية',
      finalResult: 'النتيجة النهائية للمقارنة',
      bestCamp: 'الحملة الأفضل بناءً على تكلفة الاستحواذ',
      cpaA: 'تكلفة الطلب (CPA) للحملة (أ)',
      cpaB: 'تكلفة الطلب (CPA) للحملة (ب)',
      currency: 'ر.ق',
      perOrder: 'طلب',
      searchPH: '🔍 بحث باسم الاختبار...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم الاختبار والمصروفات للحملتين بشكل صحيح.',
        updateSuccess: '✨ تم تحديث السجل بنجاح!',
        saveSuccess: '✅ تم حفظ نتيجة اختبار الـ A/B في السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا الاختبار؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.',
      },
      table: {
        noTests: 'لا توجد اختبارات A/B مسجلة حالياً.',
        th1: 'م',
        th2: 'اسم الاختبار',
        th3: 'الحملة (أ)',
        th4: 'الحملة (ب)',
        th5: 'الحملة الفائزة',
        th6: 'الإجراءات',
        sub1: 'الاسم',
        sub2: 'التكلفة/الطلبات',
        sub3: 'تكلفة الطلب'
      },
      winners: {
        waiting: 'في انتظار البيانات...',
        tie: '⚖️ تعادل في التكلفة',
        winA: '🏆 الفائز: الحملة (أ)',
        winB: '🏆 الفائز: الحملة (ب)',
        noName: 'بدون اسم'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'A/B Ad Testing Calculator ⚖️',
      desc: 'Compare two ad campaigns to find which yields the best return at the lowest CPA',
      newEdit: 'Edit Test',
      newAdd: 'Add New A/B Test',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      testName: 'Strategic Test Name',
      testNamePH: 'e.g. TikTok vs Instagram Ads',
      campA: 'First Campaign (A)',
      campAName: 'Campaign (A) Name',
      campANamePH: 'e.g. TikTok Ad',
      campB: 'Second Campaign (B)',
      campBName: 'Campaign (B) Name',
      campBNamePH: 'e.g. Instagram Ad',
      adSpend: 'Ad Spend',
      orders: 'Number of Orders',
      saveBtnNew: '+ Save Test to Log',
      saveBtnEdit: '💾 Save Changes',
      liveCompare: 'Live Results Comparison',
      finalResult: 'Final Comparison Result',
      bestCamp: 'Best campaign based on Customer Acquisition Cost',
      cpaA: 'Campaign (A) CPA',
      cpaB: 'Campaign (B) CPA',
      currency: 'QAR',
      perOrder: 'order',
      searchPH: '🔍 Search by test name...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      alerts: {
        limit: '🔒 Sorry, you have reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure the test name and expenses for both campaigns are filled correctly.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ A/B test result saved successfully!',
        delConfirm: 'Are you sure you want to delete this test?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.',
      },
      table: {
        noTests: 'No A/B tests recorded currently.',
        th1: '#',
        th2: 'Test Name',
        th3: 'Campaign (A)',
        th4: 'Campaign (B)',
        th5: 'Winning Campaign',
        th6: 'Actions',
        sub1: 'Name',
        sub2: 'Spend/Orders',
        sub3: 'CPA'
      },
      winners: {
        waiting: 'Waiting for data...',
        tie: '⚖️ Tie in Cost',
        winA: '🏆 Winner: Campaign (A)',
        winB: '🏆 Winner: Campaign (B)',
        noName: 'Unnamed'
      }
    }
  };

  const text = t[lang];

  const saveToLocalStorage = (newItems: ABTestItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_qa_ab_testing_items', JSON.stringify(newItems));
  };

  const spendA = typeof campASpend === 'number' ? campASpend : 0;
  const ordersA = typeof campAOrders === 'number' ? campAOrders : 0;
  const spendB = typeof campBSpend === 'number' ? campBSpend : 0;
  const ordersB = typeof campBOrders === 'number' ? campBOrders : 0;

  const cpaA = ordersA > 0 ? spendA / ordersA : 0;
  const cpaB = ordersB > 0 ? spendB / ordersB : 0;

  let winnerText = text.winners.waiting;
  let winnerColor = '#64748b';
  
  if (ordersA > 0 || ordersB > 0) {
    if (cpaA > 0 && cpaB > 0) {
      if (cpaA < cpaB) {
        winnerText = `${text.winners.winA} - ${campAName || text.winners.noName}`;
        winnerColor = '#047857';
      } else if (cpaB < cpaA) {
        winnerText = `${text.winners.winB} - ${campBName || text.winners.noName}`;
        winnerColor = '#0284c7';
      } else {
        winnerText = text.winners.tie;
        winnerColor = '#d97706';
      }
    } else if (cpaA > 0 && cpaB === 0) {
      winnerText = text.winners.winA;
      winnerColor = '#047857';
    } else if (cpaB > 0 && cpaA === 0) {
      winnerText = text.winners.winB;
      winnerColor = '#0284c7';
    }
  }

  const handleClearForm = () => {
    setTestName('');
    setCampAName('');
    setCampASpend('');
    setCampAOrders('');
    setCampBName('');
    setCampBSpend('');
    setCampBOrders('');
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!testName.trim() || spendA <= 0 || spendB <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-QA' : 'en-QA';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    const newItemData = {
      testName,
      campAName: campAName || text.campA,
      campASpend: spendA,
      campAOrders: ordersA,
      campACpa: Number(cpaA.toFixed(2)),
      campBName: campBName || text.campB,
      campBSpend: spendB,
      campBOrders: ordersB,
      campBCpa: Number(cpaB.toFixed(2)),
      winner: winnerText.replace('🏆 الفائز: ', '').replace('🏆 Winner: ', ''),
      createdAt: formattedDate
    };

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? { ...item, ...newItemData, createdAt: item.createdAt || formattedDate } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: ABTestItem = { id: Date.now().toString(), ...newItemData };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: ABTestItem) => {
    setTestName(item.testName);
    setCampAName(item.campAName);
    setCampASpend(item.campASpend);
    setCampAOrders(item.campAOrders);
    setCampBName(item.campBName);
    setCampBSpend(item.campBSpend);
    setCampBOrders(item.campBOrders);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
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
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>Date / Time</th>
                <th>${text.table.th3} - ${text.table.sub1}</th>
                <th>${text.table.th3} - ${text.adSpend}</th>
                <th>${text.table.th3} - ${text.orders}</th>
                <th>${text.table.th3} - ${text.table.sub3}</th>
                <th>${text.table.th4} - ${text.table.sub1}</th>
                <th>${text.table.th4} - ${text.adSpend}</th>
                <th>${text.table.th4} - ${text.orders}</th>
                <th>${text.table.th4} - ${text.table.sub3}</th>
                <th>${text.table.th5}</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.testName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.campAName}</td>
          <td>${row.campASpend}</td>
          <td>${row.campAOrders}</td>
          <td>${row.campACpa}</td>
          <td>${row.campBName}</td>
          <td>${row.campBSpend}</td>
          <td>${row.campBOrders}</td>
          <td>${row.campBCpa}</td>
          <td>${row.winner}</td>
        </tr>
      `;
    });

    tableHtml += `</tbody></table></body></html>`;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "enjazya_qa_ab_testing.xls");
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
    (item?.testName || '').toLowerCase().includes((searchQuery || '').toLowerCase())
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
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus { border-color: #8A1538; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        /* تلوين الزر الأساسي باللون القطري العنابي */
        .action-btn { background: #8A1538; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #6A102B; }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { color: #fff; border: none; padding: 20px; transition: background 0.3s ease; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 22px; color: #ffffff; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-top: 20px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #8A1538; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: center; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; text-align: center; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit;}
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span>{editingId ? text.newEdit : text.newAdd}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm}>
                {text.clear}
              </button>
            </span>
            {isClient && !isActivated && <span className="trial-badge">{text.trial}: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="input-group">
              <label>{text.testName}</label>
              <div className="input-wrapper">
                <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder={text.testNamePH} required />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#047857', textAlign: lang === 'ar' ? 'right' : 'left' }}>{text.campA}</h3>
              <div className="form-row">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.campAName}</label>
                  <div className="input-wrapper">
                    <input type="text" value={campAName} onChange={(e) => setCampAName(e.target.value)} placeholder={text.campANamePH} required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.adSpend} ({text.currency})</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={campASpend === '' ? '' : campASpend} onChange={(e) => setCampASpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="500" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.orders}</label>
                  <div className="input-wrapper">
                    <input type="number" min="0" value={campAOrders === '' ? '' : campAOrders} onChange={(e) => setCampAOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="20" required />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#0284c7', textAlign: lang === 'ar' ? 'right' : 'left' }}>{text.campB}</h3>
              <div className="form-row">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.campBName}</label>
                  <div className="input-wrapper">
                    <input type="text" value={campBName} onChange={(e) => setCampBName(e.target.value)} placeholder={text.campBNamePH} required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.adSpend} ({text.currency})</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={campBSpend === '' ? '' : campBSpend} onChange={(e) => setCampBSpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="500" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.orders}</label>
                  <div className="input-wrapper">
                    <input type="number" min="0" value={campBOrders === '' ? '' : campBOrders} onChange={(e) => setCampBOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="15" required />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.liveCompare}</h2>

          <div className="result-box primary" style={{ background: winnerColor }}>
            <div>
              <div className="result-label">{text.finalResult}</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>{text.bestCamp}</div>
            </div>
            <div className="result-value">
              {winnerText}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #047857' : 'none', borderLeft: lang === 'en' ? '4px solid #047857' : 'none' }}>
            <span className="result-label">{text.cpaA}</span>
            <span className="result-value" style={{ color: '#047857' }}>{cpaA.toFixed(2)} {text.currency}/{text.perOrder}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0284c7' : 'none', borderLeft: lang === 'en' ? '4px solid #0284c7' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.cpaB}</span>
            <span className="result-value" style={{ color: '#0284c7' }}>{cpaB.toFixed(2)} {text.currency}/{text.perOrder}</span>
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
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>{text.table.th1}</th>
                <th rowSpan={2} style={{ verticalAlign: 'middle', textAlign: lang === 'ar' ? 'right' : 'left' }}>{text.table.th2}</th>
                <th colSpan={3} style={{ borderBottom: '2px solid #047857', color: '#047857', background: '#ecfdf5' }}>{text.table.th3}</th>
                <th colSpan={3} style={{ borderBottom: '2px solid #0284c7', color: '#0284c7', background: '#f0f9ff' }}>{text.table.th4}</th>
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>{text.table.th5}</th>
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>{text.table.th6}</th>
              </tr>
              <tr>
                <th style={{ background: '#ecfdf5', fontSize: '12px' }}>{text.table.sub1}</th>
                <th style={{ background: '#ecfdf5', fontSize: '12px' }}>{text.table.sub2}</th>
                <th style={{ background: '#ecfdf5', fontSize: '12px' }}>{text.table.sub3}</th>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>{text.table.sub1}</th>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>{text.table.sub2}</th>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>{text.table.sub3}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noTests}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.testName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td style={{ fontWeight: 800, color: '#047857', background: '#f8fafc' }}>{item.campAName}</td>
                    <td style={{ background: '#f8fafc', fontSize: '12.5px' }}>{item.campASpend} {text.currency} <br/> <span style={{ color: '#64748b' }}>({item.campAOrders} {text.perOrder})</span></td>
                    <td style={{ fontWeight: 900, background: '#f8fafc' }}>{item.campACpa}</td>
                    
                    <td style={{ fontWeight: 800, color: '#0284c7' }}>{item.campBName}</td>
                    <td style={{ fontSize: '12.5px' }}>{item.campBSpend} {text.currency} <br/> <span style={{ color: '#64748b' }}>({item.campBOrders} {text.perOrder})</span></td>
                    <td style={{ fontWeight: 900 }}>{item.campBCpa}</td>
                    
                    <td>
                      <span style={{ color: '#fff', background: item.winner.includes('أ') || item.winner.includes('A)') ? '#047857' : item.winner.includes('ب') || item.winner.includes('B)') ? '#0284c7' : '#d97706', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                        {item.winner}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title={text.newEdit}>✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title={text.alerts.delConfirm}>❌</button>
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
