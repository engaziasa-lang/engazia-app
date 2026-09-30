'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ExpensesManager() {
  const [fixedExpenses, setFixedExpenses] = useState([
    { id: 1, name: 'اشتراك منصة المتجر (سلة/زد)', amount: 299 },
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
    <div className="tool-container">
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 70px; }
        
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
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>مدير المصاريف <span>والنفقات التشغيلية</span></h1>
        <p>تتبع مصاريف متجرك الثابتة والمتغيرة بدقة لضبط التدفق النقدي ومعرفة نقطة التعادل الشهرية.</p>
      </div>

      <div className="main-grid">
        {/* لوحة الإضافة */}
        <div className="panel">
          <h2>➕ إضافة مصروف جديد</h2>
          
          <div className="input-group">
            <label>نوع المصروف</label>
            <div className="input-wrapper">
              <select value={expenseType} onChange={(e) => setExpenseType(e.target.value as any)}>
                <option value="fixed">مصروف ثابت (يتكرر شهرياً كاشتراكات المنصة)</option>
                <option value="variable">مصروف متغير (مرتبط بحجم الطلبات كتغليف وشحن)</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>اسم المصروف أو البند</label>
            <div className="input-wrapper">
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="مثال: رواتب، إعلانات، تغليف..." />
            </div>
          </div>

          <div className="input-group">
            <label>المبلغ الشهري (ر.س)</label>
            <div className="input-wrapper">
              <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="مثال: 300" />
            </div>
          </div>

          <button onClick={addExpense} className="add-btn">إضافة للقائمة</button>
        </div>

        {/* لوحة النتائج والقوائم */}
        <div className="panel results-panel">
          <h2>📊 ملخص النفقات الشهرية</h2>

          <div className="result-box highlight">
            <span className="result-label">إجمالي المصاريف الشهرية</span>
            <span className="result-value" dir="ltr">{grandTotal.toLocaleString()} <span>ر.س</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">المصاريف الثابتة</span>
            <span className="result-value" dir="ltr">{totalFixed.toLocaleString()} <span>ر.س</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">المصاريف المتغيرة</span>
            <span className="result-value" dir="ltr">{totalVariable.toLocaleString()} <span>ر.س</span></span>
          </div>

          {/* قوائم المصاريف */}
          <div className="list-section" style={{ color: '#ffffff' }}>
            <h3>البنود المسجلة:</h3>
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {fixedExpenses.map(item => (
                <div key={item.id} className="expense-item" style={{ background: '#1e293b', borderColor: '#334155', color: '#fff' }}>
                  <span>{item.name} (ثابت)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span dir="ltr">{item.amount} ر.س</span>
                    <button onClick={() => removeFixed(item.id)} className="del-item">✕</button>
                  </div>
                </div>
              ))}
              {variableExpenses.map(item => (
                <div key={item.id} className="expense-item" style={{ background: '#1e293b', borderColor: '#334155', color: '#fff' }}>
                  <span>{item.name} (متغير)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span dir="ltr">{item.amount} ر.س</span>
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
