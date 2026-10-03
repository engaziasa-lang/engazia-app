'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function JasmalDataScraperSA() {
  const [rawText, setRawText] = useState<string>('');
  const [cleanedData, setCleanedData] = useState<Array<{ name: string; price: string; category: string }>>([]);

  // محاكاة عملية تنظيف واستخراج البيانات من النصوص العشوائية
  const handleCleanData = () => {
    if (!rawText.trim()) {
      alert('الرجاء إدخال بعض النصوص أو بيانات المنتجات لاستخراجها.');
      return;
    }

    // تقسيم النص إلى أسطر كمحاكاة لمعالجة الجداول أو قوائم المنتجات
    const lines = rawText.split('\n').filter(line => line.trim() !== '');
    const parsed = lines.map((line, index) => {
      // محاولة استخراج أرقام أو أسعار افتراضية
      return {
        name: line.replace(/[0-9]/g, '').trim() || `منتج رقم ${index + 1}`,
        price: (Math.floor(Math.random() * 300) + 50).toString() + ' ر.س',
        category: 'إلكترونيات / عام',
      };
    });

    setCleanedData(parsed);
    alert('⚡ تم تنظيف واستخراج البيانات وترتيبها بنجاح!');
  };

  const handleExportCsv = () => {
    if (cleanedData.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,ProductName,Price,Category\n";
    cleanedData.forEach(row => {
      csvContent += `${row.name},${row.price},${row.category}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "jasmal_exported_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper textarea { width: 100%; height: 180px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; resize: vertical; }
        .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .action-btn:hover { background: #065f46; }
        
        .export-btn { background: #2563eb; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 15px; }
        .export-btn:hover { background: #1d4ed8; }

        .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
        .data-table th { background: #f1f5f9; padding: 8px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; }
        .data-table td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>جاسمال (Jasmal) لاستخراج البيانات 🕷️</h1>
          <p>استخرج ونظف بيانات المنتجات والأسعار العشوائية وحولها لملفات مرتبة</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم إدخال النصوص العشوائية */}
        <div className="card">
          <h2 className="card-title">إدخال البيانات الخام</h2>
          <div className="input-group">
            <label>الصق النص أو جدول المنتجات العشوائي هنا:</label>
            <div className="input-wrapper">
              <textarea 
                value={rawText} 
                onChange={(e) => setRawText(e.target.value)} 
                placeholder="مثال:&#10;ساعة ذكية فاخرة&#10;عطر رجالي ملكي&#10;سماعة بلوتوث لاسلكية"
              />
            </div>
          </div>
          <button className="action-btn" onClick={handleCleanData}>
            ⚡ معالجة وتخريج البيانات
          </button>
        </div>

        {/* قسم عرض النتائج والتصدير */}
        <div className="card">
          <h2 className="card-title">البيانات المرتبة والجاهزة</h2>
          {cleanedData.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>قم بإدخال بيانات ومعالجتها لعرضها هنا.</p>
          ) : (
            <div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>اسم المنتج</th>
                      <th>السعر المقترح</th>
                      <th>التصنيف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cleanedData.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.name}</td>
                        <td>{row.price}</td>
                        <td>{row.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="export-btn" onClick={handleExportCsv}>
                📥 تحميل كملف CSV (إكسل)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
