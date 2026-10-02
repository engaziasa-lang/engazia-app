'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة مدير المصاريف
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'مدير المصاريف',
    titleSub: 'والنفقات التشغيلية',
    desc: 'تتبع مصاريف متجرك الثابتة والمتغيرة بدقة لضبط التدفق النقدي ومعرفة نقطة التعادل الشهرية.',
    panel1Title: '➕ إضافة مصروف جديد',
    typeLabel: 'نوع المصروف',
    fixedOpt: 'مصروف ثابت (يتكرر شهرياً كاشتراكات المنصة)',
    varOpt: 'مصروف متغير (مرتبط بحجم الطلبات كتغليف وشحن)',
    nameLabel: 'اسم المصروف أو البند',
    namePh: 'مثال: رواتب، إعلانات، تغليف...',
    amountLabel: 'المبلغ الشهري',
    amountPh: 'مثال: 300',
    addBtn: 'إضافة للقائمة',
    panel2Title: '📊 ملخص النفقات الشهرية',
    totalExp: 'إجمالي المصاريف الشهرية',
    fixedExp: 'المصاريف الثابتة',
    varExp: 'المصاريف المتغيرة',
    itemsList: 'البنود المسجلة:',
    fixedTag: 'ثابت',
    varTag: 'متغير'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Expenses',
    titleSub: 'Manager',
    desc: 'Track your fixed and variable store expenses accurately to control cash flow.',
    panel1Title: '➕ Add New Expense',
    typeLabel: 'Expense Type',
    fixedOpt: 'Fixed Expense (monthly recurring like subscriptions)',
    varOpt: 'Variable Expense (tied to order volume like packaging)',
    nameLabel: 'Expense Name',
    namePh: 'e.g., Salaries, Ads, Packaging...',
    amountLabel: 'Monthly Amount',
    amountPh: 'e.g., 300',
    addBtn: 'Add to List',
    panel2Title: '📊 Monthly Expenses Summary',
    totalExp: 'Total Monthly Expenses',
    fixedExp: 'Fixed Expenses',
    varExp: 'Variable Expenses',
    itemsList: 'Recorded Items:',
    fixedTag: 'Fixed',
    varTag: 'Variable'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Gestionnaire',
    titleSub: 'de dépenses',
    desc: 'Suivez vos dépenses fixes et variables avec précision.',
    panel1Title: '➕ Ajouter une dépense',
    typeLabel: 'Type de dépense',
    fixedOpt: 'Dépense fixe',
    varOpt: 'Dépense variable',
    nameLabel: 'Nom de la dépense',
    namePh: 'ex: Salaires, Publicités...',
    amountLabel: 'Montant mensuel',
    amountPh: 'ex: 300',
    addBtn: 'Ajouter',
    panel2Title: '📊 Résumé des dépenses',
    totalExp: 'Total des dépenses',
    fixedExp: 'Dépenses fixes',
    varExp: 'Dépenses variables',
    itemsList: 'Éléments enregistrés :',
    fixedTag: 'Fixe',
    varTag: 'Variable'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Gestor',
    titleSub: 'de Gastos',
    desc: 'Rastrea los gastos fijos y variables de tu tienda.',
    panel1Title: '➕ Agregar gasto',
    typeLabel: 'Tipo de gasto',
    fixedOpt: 'Gasto fijo',
    varOpt: 'Gasto variable',
    nameLabel: 'Nombre del gasto',
    namePh: 'ej. Salarios, Anuncios...',
    amountLabel: 'Monto mensual',
    amountPh: 'ej. 300',
    addBtn: 'Agregar',
    panel2Title: '📊 Resumen de gastos',
    totalExp: 'Gastos totales',
    fixedExp: 'Gastos fijos',
    varExp: 'Gastos variables',
    itemsList: 'Elementos registrados:',
    fixedTag: 'Fijo',
    varTag: 'Variable'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Gider',
    titleSub: 'Yöneticisi',
    desc: 'Nakit akışını kontrol etmek için sabit ve değişken giderlerinizi takip edin.',
    panel1Title: '➕ Yeni Gider Ekle',
    typeLabel: 'Gider Türü',
    fixedOpt: 'Sabit Gider',
    varOpt: 'Değişken Gider',
    nameLabel: 'Gider Adı',
    namePh: 'örn: Maaşlar, Reklamlar...',
    amountLabel: 'Aylık Tutar',
    amountPh: 'örn: 300',
    addBtn: 'Listeye Ekle',
    panel2Title: '📊 Aylık Gider Özeti',
    totalExp: 'Toplam Aylık Giderler',
    fixedExp: 'Sabit Giderler',
    varExp: 'Değişken Giderler',
    itemsList: 'Kayıtlı Öğeler:',
    fixedTag: 'Sabit',
    varTag: 'Değişken'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '支出',
    titleSub: '管理器',
    desc: '精准追踪店铺的固定与变动支出，掌控现金流。',
    panel1Title: '➕ 添加新支出',
    typeLabel: '支出类型',
    fixedOpt: '固定支出（如平台订阅）',
    varOpt: '变动支出（如包装和运费）',
    nameLabel: '支出名称',
    namePh: '例如：薪资、广告、包装...',
    amountLabel: '每月金额',
    amountPh: '例如：300',
    addBtn: '添加到列表',
    panel2Title: '📊 月度支出摘要',
    totalExp: '每月总支出',
    fixedExp: '固定支出',
    varExp: '变动支出',
    itemsList: '已记录项目：',
    fixedTag: '固定',
    varTag: '变动'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Ausgaben',
    titleSub: 'Manager',
    desc: 'Verfolgen Sie Ihre festen und variablen Geschäftsausgaben.',
    panel1Title: '➕ Ausgabe hinzufügen',
    typeLabel: 'Ausgabentyp',
    fixedOpt: 'Fixkosten',
    varOpt: 'Variable Kosten',
    nameLabel: 'Ausgabenname',
    namePh: 'z.B. Gehälter, Werbung...',
    amountLabel: 'Monatlicher Betrag',
    amountPh: 'z.B. 300',
    addBtn: 'Hinzufügen',
    panel2Title: '📊 Zusammenfassung',
    totalExp: 'Gesamtausgaben',
    fixedExp: 'Fixkosten',
    varExp: 'Variable Kosten',
    itemsList: 'Erfasste Posten:',
    fixedTag: 'Fix',
    varTag: 'Variabel'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Manajer',
    titleSub: 'Pengeluaran',
    desc: 'Lacak pengeluaran tetap dan variabel toko Anda dengan akurat.',
    panel1Title: '➕ Tambah Pengeluaran Baru',
    typeLabel: 'Jenis Pengeluaran',
    fixedOpt: 'Pengeluaran Tetap',
    varOpt: 'Pengeluaran Variabel',
    nameLabel: 'Nama Pengeluaran',
    namePh: 'cth: Gaji, Iklan...',
    amountLabel: 'Jumlah Bulanan',
    amountPh: 'cth: 300',
    addBtn: 'Tambah ke Daftar',
    panel2Title: '📊 Ringkasan Pengeluaran Bulanan',
    totalExp: 'Total Pengeluaran Bulanan',
    fixedExp: 'Pengeluaran Tetap',
    varExp: 'Pengeluaran Variabel',
    itemsList: 'Item Tercatat:',
    fixedTag: 'Tetap',
    varTag: 'Variabel'
  }
};

export default function ExpensesManager() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [fixedExpenses, setFixedExpenses] = useState([
    { id: 1, name: 'اشتراك منصة المتجر', amount: 299 },
    { id: 2, name: 'اشتراكات الأدوات والتطبيقات', amount: 150 },
    { id: 3, name: 'استضافة البريد والخدمات', amount: 50 },
  ]);

  const [variableExpenses, setVariableExpenses] = useState([
    { id: 1, name: 'أكياس وكراتين التغليف', amount: 500 },
    { id: 2, name: 'رسوم إضافية وطوارئ', amount: 200 },
  ]);

  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [expenseType, setExpenseType] = useState<'fixed' | 'variable'>('fixed');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('engazia_global_lang') || 'ar';
      const savedCurr = localStorage.getItem('engazia_global_currency') || 'SAR';
      const savedKey = localStorage.getItem('merchant_license_key') || '';
      
      setCurrentLang(savedLang);
      setCurrentCurrency(savedCurr);
      setLicenseKey(savedKey);
    }
  }, []);

  const t = toolTranslations[currentLang] || toolTranslations.ar;
  const isRtl = currentLang === 'ar';

  const addExpense = () => {
    if (!newName || newAmount === '' || newAmount <= 0) return;
    const newItem = { id: Date.now(), name: newName, amount: Number(newAmount) };
    if (expenseType === 'fixed') {
      setFixedExpenses([...fixedExpenses, newItem]);
    } else {
      setVariableExpenses([...variableExpenses, newItem]);
    }
    setNewName('');
    setNewAmount('');
  };

  const removeFixed = (id: number) => {
    setFixedExpenses(fixedExpenses.filter(item => item.id !== id));
  };

  const removeVariable = (id: number) => {
    setVariableExpenses(variableExpenses.filter(item => item.id !== id));
  };

  const totalFixed = fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalVariable = variableExpenses.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = totalFixed + totalVariable;

  return (
    <div className="tool-container" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 70px; }
        
        .header { max-width: 1000px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 40px; }
        .tool-title h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 16px; }

        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #4f46e5; background: #ffffff; }

        .add-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; margin-top: 10px; }
        .add-btn:hover { background: #4338ca; }

        .list-section { margin-top: 25px; }
        .list-section h3 { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 12px; }
        
        .expense-item { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 8px; font-size: 14px; font-weight: 700; }
        .del-item { background: #fee2e2; color: #dc2626; border: none; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-weight: 900; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .highlight .result-label { color: #ffffff; }
        
        .result-value { font-size: 22px; font-weight: 900; color: #ffffff; }
        .result-value span { font-size: 14px; font-weight: 500; opacity: 0.7; margin-right: 5px; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>{isRtl ? '→' : '←'}</span> {t.back}
        </Link>
        {licenseKey && (
          <span style={{ fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontWeight: 800 }}>
            🔒 سحابي مفعل (PRO)
          </span>
        )}
      </div>

      <div className="tool-title">
        <h1>{t.titleMain} <span>{t.titleSub}</span></h1>
        <p>{t.desc}</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>{t.panel1Title}</h2>
          
          <div className="input-group">
            <label>{t.typeLabel}</label>
            <div className="input-wrapper">
              <select value={expenseType} onChange={(e) => setExpenseType(e.target.value as any)}>
                <option value="fixed">{t.fixedOpt}</option>
                <option value="variable">{t.varOpt}</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>{t.nameLabel}</label>
            <div className="input-wrapper">
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t.namePh} />
            </div>
          </div>

          <div className="input-group">
            <label>{t.amountLabel} ({currentCurrency})</label>
            <div className="input-wrapper">
              <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder={t.amountPh} />
            </div>
          </div>

          <button onClick={addExpense} className="add-btn">{t.addBtn}</button>
        </div>

        <div className="panel results-panel">
          <h2>{t.panel2Title}</h2>

          <div className="result-box highlight">
            <span className="result-label">{t.totalExp}</span>
            <span className="result-value" dir="ltr">{grandTotal.toLocaleString()} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.fixedExp}</span>
            <span className="result-value" dir="ltr">{totalFixed.toLocaleString()} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.varExp}</span>
            <span className="result-value" dir="ltr">{totalVariable.toLocaleString()} <span>{currentCurrency}</span></span>
          </div>

          <div className="list-section" style={{ color: '#ffffff' }}>
            <h3>{t.itemsList}</h3>
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {fixedExpenses.map(item => (
                <div key={item.id} className="expense-item" style={{ background: '#1e293b', borderColor: '#334155', color: '#fff' }}>
                  <span>{item.name} ({t.fixedTag})</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span dir="ltr">{item.amount} {currentCurrency}</span>
                    <button onClick={() => removeFixed(item.id)} className="del-item">✕</button>
                  </div>
                </div>
              ))}
              {variableExpenses.map(item => (
                <div key={item.id} className="expense-item" style={{ background: '#1e293b', borderColor: '#334155', color: '#fff' }}>
                  <span>{item.name} ({t.varTag})</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span dir="ltr">{item.amount} {currentCurrency}</span>
                    <button onClick={() => removeVariable(item.id)} className="del-item">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
