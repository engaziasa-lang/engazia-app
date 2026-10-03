'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: 'ثابتة' | 'متغيرة' | 'تسويق';
}

export default function ExpensesManagerSA() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', name: 'اشتراك منصة سلة/زد', amount: 99, category: 'ثابتة' },
    { id: '2', name: 'أدوات التصميم والتسويق', amount: 150, category: 'ثابتة' },
    { id: '3', name: 'خدمة العملاء وتغليف الطلبات', amount: 1200, category: 'متغيرة' },
    { id: '4', name: 'مصاريف إضافية متنوعة', amount: 300, category: 'متغيرة' },
  ]);

  const [newName, setNewName] = useState<string>('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newCategory, setNewCategory] = useState<'ثابتة' | 'متغيرة' | 'تسويق'>('ثابتة');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newAmount === '' || newAmount <= 0) return;

    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      amount: Number(newAmount),
      category: newCategory,
    };

    setExpenses([...expenses, newItem]);
    setNewName('');
    setNewAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  // المجاميع حسب التصنيف
  const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
  const fixedTotal = expenses.filter(i => i.category === 'ثابتة').reduce((acc, i) => acc + i.amount, 0);
  const variableTotal = expenses.filter(i => i.category === 'متغيرة').reduce((acc, i) => acc + i.amount, 0);
  const marketingTotal = expenses.filter(i => i.category === 'تسويق').reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1000px; margin: 40px auto; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 20px; }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        
        .add-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .add-btn:hover { background: #065f46; }

        .expense-item { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 12px 15px; border-radius: 10px; margin-bottom: 10px; border: 1px solid #e2e8f0; }
        .expense-info { display: flex; flex-direction: column; gap: 3px; }
        .expense-name { font-weight: 800; color: #0f172a; font-size: 14px; }
        .expense-cat { font-size: 11px; background: #e2e8f0; color: #475569; padding: 2px 6px; border-radius: 4px; width: fit-content; font-weight: 700; }
        
        .expense-right { display: flex; align-items: center; gap: 15px; }
        .expense-amount { font-weight: 900; color: #dc2626; font-size: 15px; }
        .delete-btn { background: #fee2e2; color: #dc2626; border: none; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center; }

        .summary-box { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 700; color: #334155; }
        .summary-box.grand { font-size: 18px; font-weight: 900; color: #0f172a; border-top: 2px solid #e2e8f0; border-bottom: none; padding-top: 15px; margin-top: 10px; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مدير النفقات والمصاريف التشغيلية 💸</h1>
          <p>تتبع مصاريف متجرك الثابتة والمتغيرة بالريال السعودي لضبط التدفق النقدي</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* إضافة مصروف جديد */}
        <div>
          <div className="card">
            <h2 className="card-title">إضافة مصروف جديد</h2>
            <form onSubmit={handleAddExpense}>
              <div className="input-group">
                <label>اسم المصروف (مثال: رواتب، اشتراكات)</label>
                <div className="input-wrapper">
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="أدخل اسم المصروف" />
                </div>
              </div>

              <div className="input-group">
                <label>المبلغ (ر.س)</label>
                <div className="input-wrapper">
                  <input type="number" min="0" value={newAmount} onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="مثال: 500" />
                </div>
              </div>

              <div className="input-group">
                <label>تصنيف المصروف</label>
                <div className="input-wrapper">
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)}>
                    <option value="ثابتة">مصاريف ثابتة (اشتراكات، إيجار)</option>
                    <option value="متغيرة">مصاريف متغيرة (تغليف، تشغيل)</option>
                    <option value="تسويق">مصاريف تسويقية إضافية</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="add-btn">+ إضافة المصروف للقائمة</button>
            </form>
          </div>

          <div className="card">
            <h2 className="card-title">ملخص النفقات الشهرية</h2>
            <div className="summary-box">
              <span>المصاريف الثابتة:</span>
              <span style={{ color: '#0f172a' }}>{fixedTotal.toFixed(2)} ر.س</span>
            </div>
            <div className="summary-box">
              <span>المصاريف المتغيرة:</span>
              <span style={{ color: '#0f172a' }}>{variableTotal.toFixed(2)} ر.س</span>
            </div>
            <div className="summary-box">
              <span>المصاريف التسويقية:</span>
              <span style={{ color: '#0f172a' }}>{marketingTotal.toFixed(2)} ر.س</span>
            </div>
            <div className="summary-box grand">
              <span>إجمالي المصاريف الشهرية:</span>
              <span style={{ color: '#dc2626' }}>{totalExpenses.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        {/* قائمة المصاريف */}
        <div className="card">
          <h2 className="card-title">قائمة المصاريف المسجلة ({expenses.length})</h2>
          {expenses.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>لا توجد مصاريف مسجلة حالياً.</p>
          ) : (
            expenses.map(item => (
              <div className="expense-item" key={item.id}>
                <div className="expense-info">
                  <span className="expense-name">{item.name}</span>
                  <span className="expense-cat">{item.category}</span>
                </div>
                <div className="expense-right">
                  <span className="expense-amount">-{item.amount} ر.س</span>
                  <button className="delete-btn" onClick={() => handleDeleteExpense(item.id)} title="حذف">✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
