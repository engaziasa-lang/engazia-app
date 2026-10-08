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

export default function ABTestingCalculatorKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

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
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    const saved = localStorage.getItem('seerk_kw_ab_testing_items');
    if (saved) {
      try { 
        const parsedData = JSON.parse(saved);
        if (Array.isArray(parsedData)) setItems(parsedData);
      } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ABTestItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_ab_testing_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'حاسبة اختبارات الإعلانات (A/B) ⚖️',
      desc: 'قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب في السوق الكويتي',
      editRecord: 'تعديل الاختبار',
      newRecord: 'إضافة اختبار A/B جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      testNameLabel: 'مسمى الاختبار الاستراتيجي',
      testNamePH: 'مثال: مقارنة إعلان تيك توك ضد إنستقرام',
      campAHeading: 'الحملة الأولى (أ)',
      campANameLabel: 'اسم الحملة (أ)',
      campANamePH: 'مثال: إعلان تيك توك',
      spendLabel: 'تكلفة الإعلان',
      ordersLabel: 'عدد الطلبات',
      campBHeading: 'الحملة الثانية (ب)',
      campBNameLabel: 'اسم الحملة (ب)',
      campBNamePH: 'مثال: إعلان إنستقرام',
      currency: 'د.ك',
      saveBtnNew: '+ حفظ نتيجة الاختبار في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'مقارنة النتائج الحية',
      resLabel: 'النتيجة النهائية للمقارنة',
      resSub: 'الحملة الأفضل بناءً على تكلفة الاستحواذ',
      waitData: 'في انتظار البيانات...',
      winnerA: '🏆 الفائز: الحملة (أ)',
      winnerB: '🏆 الفائز: الحملة (ب)',
      tie: '⚖️ تعادل في التكلفة',
      cpaALabel: 'تكلفة الطلب (CPA) للحملة (أ)',
      cpaBLabel: 'تكلفة الطلب (CPA) للحملة (ب)',
      searchPH: '🔍 بحث باسم الاختبار...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد اختبارات A/B مسجلة حالياً.',
        th1: 'م',
        th2: 'اسم الاختبار',
        campAHeader: 'الحملة (أ)',
        campBHeader: 'الحملة (ب)',
        colName: 'الاسم',
        colSpendOrders: 'التكلفة/الطلبات',
        colCpa: 'تكلفة الطلب',
        winnerCol: 'الحملة الفائزة',
        actions: 'الإجراءات'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم الاختبار والمصروفات للحملتين بشكل صحيح.',
        updateSuccess: '✨ تم تحديث السجل بنجاح!',
        saveSuccess: '✅ تم حفظ نتيجة اختبار الـ A/B في السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا الاختبار؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'A/B Ad Testing Calculator ⚖️',
      desc: 'Compare two ad campaigns to see which achieves better returns at a lower cost in the Kuwaiti market',
      editRecord: 'Edit Test',
      newRecord: 'Add New A/B Test',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      testNameLabel: 'Strategic Test Name',
      testNamePH: 'e.g. TikTok Ad vs Instagram Ad',
      campAHeading: 'First Campaign (A)',
      campANameLabel: 'Campaign Name (A)',
      campANamePH: 'e.g. TikTok Ad',
      spendLabel: 'Ad Spend',
      ordersLabel: 'Orders Count',
      campBHeading: 'Second Campaign (B)',
      campBNameLabel: 'Campaign Name (B)',
      campBNamePH: 'e.g. Instagram Ad',
      currency: 'KWD',
      saveBtnNew: '+ Save Test Result to Log',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Live Results Comparison',
      resLabel: 'Final Comparison Result',
      resSub: 'Best campaign based on cost per acquisition',
      waitData: 'Awaiting data...',
      winnerA: '🏆 Winner: Campaign (A)',
      winnerB: '🏆 Winner: Campaign (B)',
      tie: '⚖️ Cost Tie',
      cpaALabel: 'Cost Per Order (CPA) - Campaign A',
      cpaBLabel: 'Cost Per Order (CPA) - Campaign B',
      searchPH: '🔍 Search by test name...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No A/B tests currently registered.',
        th1: '#',
        th2: 'Test Name',
        campAHeader: 'Campaign (A)',
        campBHeader: 'Campaign (B)',
        colName: 'Name',
        colSpendOrders: 'Spend/Orders',
        colCpa: 'CPA',
        winnerCol: 'Winning Campaign',
        actions: 'Actions'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure test name and spend for both campaigns are entered correctly.',
        updateSuccess: '✨ Record updated successfully!',
        saveSuccess: '✅ A/B test result saved to log successfully!',
        delConfirm: 'Are you sure you want to delete this test?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const spendA = typeof campASpend === 'number' ? campASpend : 0;
  const ordersA = typeof campAOrders === 'number' ? campAOrders : 0;
  
  const spendB = typeof campBSpend === 'number' ? campBSpend : 0;
  const ordersB = typeof campBOrders === 'number' ? campBOrders : 0;

  const cpaA = ordersA > 0 ? spendA / ordersA : 0;
  const cpaB = ordersB > 0 ? spendB / ordersB : 0;

  let winnerText = text.waitData;
  let winnerColor = '#64748b';
  
  if (ordersA > 0 || ordersB > 0) {
    if (cpaA > 0 && cpaB > 0) {
      if (cpaA < cpaB) {
        winnerText = `${text.winnerA} - ${campAName || (lang === 'ar' ? 'بدون اسم' : 'Unnamed')}`;
        winnerColor = '#0284c7'; // الأزرق الكويتي للحملة أ
      } else if (cpaB < cpaA) {
        winnerText = `${text.winnerB} - ${campBName || (lang === 'ar' ? 'بدون اسم' : 'Unnamed')}`;
        winnerColor = '#6d28d9'; // البنفسجي للحملة ب
      } else {
        winnerText = text.tie;
        winnerColor = '#d97706';
      }
    } else if (cpaA > 0 && cpaB === 0) {
      winnerText = text.winnerA;
      winnerColor = '#0284c7';
    } else if (cpaB > 0 && cpaA === 0) {
      winnerText = text.winnerB;
      winnerColor = '#6d28d9';
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
    const localeStr = lang === 'ar' ? 'ar-KW' : 'en-KW';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    const newItemData = {
      testName,
      campAName: campAName || (lang === 'ar' ? 'الحملة أ' : 'Campaign A'),
      campASpend: spendA,
      campAOrders: ordersA,
      campACpa: Number(cpaA.toFixed(2)),
      campBName: campBName || (lang === 'ar' ? 'الحملة ب' : 'Campaign B'),
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
          <h2>A/B Testing Calculator Report (KW)</h2>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>A Name</th>
                <th>A Spend</th>
                <th>A Orders</th>
                <th>A CPA</th>
                <th>B Name</th>
                <th>B Spend</th>
                <th>B Orders</th>
                <th>B CPA</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.testName}</td>
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
    link.setAttribute("download", "enjazya_kw_ab_testing.xls");
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
        body { background-color: #f1f5f9; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 10px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f8fafc; color: #0f172a; border-color: #0284c7; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        
        .action-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { color: #fff; border: none; padding: 20px; transition: background 0.3s ease; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value { font-size: 20px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); margin-top: 20px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .t-btn:hover { background: #f1f5f9; color: #0284c7; border-color: #0284c7; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: center; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; text-align: center; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit; transition: all 0.2s; }
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-edit:hover { background: #bae6fd; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-delete:hover { background: #fca5a5; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/kw" className="back-btn">
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
              <label>{text.testNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder={text.testNamePH} required />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#0284c7' }}>{text.campAHeading}</h3>
              <div className="form-row">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.campANameLabel}</label>
                  <div className="input-wrapper">
                    <input type="text" value={campAName} onChange={(e) => setCampAName(e.target.value)} placeholder={text.campANamePH} required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.spendLabel} ({text.currency})</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={campASpend === '' ? '' : campASpend} onChange={(e) => setCampASpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="150" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.ordersLabel}</label>
                  <div className="input-wrapper">
                    <input type="number" min="0" value={campAOrders === '' ? '' : campAOrders} onChange={(e) => setCampAOrders(e.target.value === '' ? '' : Number(e.target.value))} placeholder="20" required />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', color: '#6d28d9' }}>{text.campBHeading}</h3>
              <div className="form-row">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.campBNameLabel}</label>
                  <div className="input-wrapper">
                    <input type="text" value={campBName} onChange={(e) => setCampBName(e.target.value)} placeholder={text.campBNamePH} required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.spendLabel} ({text.currency})</label>
                  <div className="input-wrapper">
                    <input type="number" step="0.01" min="0" value={campBSpend === '' ? '' : campBSpend} onChange={(e) => setCampBSpend(e.target.value === '' ? '' : Number(e.target.value))} placeholder="150" required />
                  </div>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{text.ordersLabel}</label>
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
          <h2 className="card-title">{text.resultsTitle}</h2>

          <div className="result-box primary" style={{ background: winnerColor }}>
            <div>
              <div className="result-label">{text.resLabel}</div>
              <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>{text.resSub}</div>
            </div>
            <div className="result-value">
              {winnerText}
            </div>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0284c7' : 'none', borderLeft: lang === 'en' ? '4px solid #0284c7' : 'none' }}>
            <span className="result-label">{text.cpaALabel}</span>
            <span className="result-value" style={{ color: '#0284c7' }}>{cpaA.toFixed(2)} {text.currency}</span>
          </div>

          <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #6d28d9' : 'none', borderLeft: lang === 'en' ? '4px solid #6d28d9' : 'none', background: '#f8fafc' }}>
            <span className="result-label">{text.cpaBLabel}</span>
            <span className="result-value" style={{ color: '#6d28d9' }}>{cpaB.toFixed(2)} {text.currency}</span>
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
                <th colSpan={3} style={{ borderBottom: '2px solid #0284c7', color: '#0284c7', background: '#f0f9ff' }}>{text.table.campAHeader}</th>
                <th colSpan={3} style={{ borderBottom: '2px solid #6d28d9', color: '#6d28d9', background: '#f3e8ff' }}>{text.table.campBHeader}</th>
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>{text.table.winnerCol}</th>
                <th rowSpan={2} style={{ verticalAlign: 'middle' }}>{text.table.actions}</th>
              </tr>
              <tr>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>{text.table.colName}</th>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>{text.table.colSpendOrders}</th>
                <th style={{ background: '#f0f9ff', fontSize: '12px' }}>{text.table.colCpa}</th>
                <th style={{ background: '#f3e8ff', fontSize: '12px' }}>{text.table.colName}</th>
                <th style={{ background: '#f3e8ff', fontSize: '12px' }}>{text.table.colSpendOrders}</th>
                <th style={{ background: '#f3e8ff', fontSize: '12px' }}>{text.table.colCpa}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
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
                    <td style={{ fontWeight: 800, color: '#0284c7', background: '#f8fafc' }}>{item.campAName}</td>
                    <td style={{ background: '#f8fafc', fontSize: '12.5px' }}>{item.campASpend} {text.currency} <br/> <span style={{ color: '#64748b' }}>({item.campAOrders} orders)</span></td>
                    <td style={{ fontWeight: 900, background: '#f8fafc', color: '#0f172a' }}>{item.campACpa}</td>
                    
                    <td style={{ fontWeight: 800, color: '#6d28d9' }}>{item.campBName}</td>
                    <td style={{ fontSize: '12.5px' }}>{item.campBSpend} {text.currency} <br/> <span style={{ color: '#64748b' }}>({item.campBOrders} orders)</span></td>
                    <td style={{ fontWeight: 900, color: '#0f172a' }}>{item.campBCpa}</td>
                    
                    <td>
                      <span style={{ color: '#fff', background: item.winner.includes('(أ)') || item.winner.includes('A') ? '#0284c7' : item.winner.includes('(ب)') || item.winner.includes('B') ? '#6d28d9' : '#d97706', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                        {item.winner}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">❌</button>
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
