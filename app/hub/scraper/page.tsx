'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ExcelScraperTool() {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');

  const cleanData = () => {
    if (!inputText) {
      alert('الرجاء لصق بعض النص أو البيانات أولاً.');
      return;
    }

    // تنظيف النص: إزالة الفراغات المزدوجة، الأسطر الفارغة الزائدة، وتنظيم الفواصل
    const lines = inputText.split('\n');
    const cleanedLines = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    setCleanedText(cleanedLines);
  };

  const copyCleaned = () => {
    navigator.clipboard.writeText(cleanedText);
    alert('تم نسخ البيانات النظيفة بنجاح!');
  };

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

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        
        textarea { width: 100%; height: 250px; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit; background: #f8fafc; color: #0f172a; outline: none; resize: vertical; }
        textarea:focus { border-color: #4f46e5; background: #ffffff; }

        .action-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .action-btn:hover { background: #4338ca; }

        .copy-btn { background: #10b981; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 15px; }
        .copy-btn:hover { background: #059669; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>تنسيق وتنظيف <span>بيانات الإكسل</span></h1>
        <p>نظف قوائم المنتجات والأسعار العشوائية، وأزل المسافات والأسطر الزائدة لتحويلها لملفات مرتبة.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>📥 البيانات العشوائية (قبل التنظيف)</h2>
          <div className="input-group">
            <label>الرجاء لصق النص أو الجدول هنا:</label>
            <textarea 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="ألصق البيانات المبعثرة هنا..."
            />
          </div>
          <button onClick={cleanData} className="action-btn">
            ⚡ تنظيف وترتيب البيانات الآن
          </button>
        </div>

        <div className="panel" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
          <h2 style={{ color: '#fff', borderColor: '#334155' }}>📤 البيانات النظيفة والمرتبة</h2>
          <div className="input-group">
            <label style={{ color: '#cbd5e1' }}>الناتج النهائي:</label>
            <textarea 
              value={cleanedText} 
              readOnly 
              placeholder="البيانات المرتبة ستظهر هنا..."
              style={{ background: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
            />
          </div>
          {cleanedText && (
            <button onClick={copyCleaned} className="copy-btn">
              📋 نسخ البيانات النظيفة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
