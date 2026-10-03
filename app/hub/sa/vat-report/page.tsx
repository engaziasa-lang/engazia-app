'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VatReportGeneratorSA() {
  // إدخالات المبيعات
  const [totalSalesWithVat, setTotalSalesWithVat] = useState<number>(115000); // إجمالي المبيعات الشاملة للضريبة
  const [zeroRatedSales, setZeroRatedSales] = useState<number>(0); // المبيعات الصفرية
  const [exemptSales, setExemptSales] = useState<number>(0); // المبيعات المعفاة

  // إدخالات المشتريات والمصاريف
  const [totalPurchasesWithVat, setTotalPurchasesWithVat] = useState<number>(57500); // إجمالي المشتريات الشاملة للضريبة
  const [importsVatPaid, setImportsVatPaid] = useState<number>(0); // ضريبة الواردات المسددة عبر الجمارك (إن وجدت)

  // النتائج المحسوبة
  const [results, setResults] = useState({
    taxableSales: 0,
    outputVat: 0,
    taxablePurchases: 0,
    inputVat: 0,
    netVatDue: 0,
  });

  useEffect(() => {
    // 1. حساب المبيعات الخاضعة للضريبة وضريبة المخرجات (Output VAT)
    // المبيعات الشاملة للضريبة / 1.15 لتعطي المبلغ بدون ضريبة
    const taxableSales = (totalSalesWithVat - zeroRatedSales - exemptSales) / 1.15;
    const outputVat = taxableSales * 0.15;

    // 2. حساب المشتريات الخاضعة للضريبة وضريبة المدخلات (Input VAT)
    const taxablePurchases = totalPurchasesWithVat / 1.15;
    const inputVat = (taxablePurchases * 0.15) + importsVatPaid;

    // 3. صافي ضريبة القيمة المضافة المستحقة للدفع أو الاسترداد
    const netVatDue = outputVat - inputVat;

    setResults({
      taxableSales,
      outputVat,
      taxablePurchases,
      inputVat,
      netVatDue,
    });
  }, [totalSalesWithVat, zeroRatedSales, exemptSales, totalPurchasesWithVat, importsVatPaid]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
        @media print {
          .no-print { display: none !important; }
          body { background-color: #ffffff; }
          .tool-container { margin: 0; padding: 0; max-width: 100%; }
          .card { box-shadow: none !important; border: none !important; }
        }
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
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 20px; }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; left: 15px; color: #94a3b8; font-weight: 700; font-size: 13px; }
        
        .result-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 700; color: #334155; }
        .result-row.highlight { background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; margin-top: 15px; }
        
        .print-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 14px; border-radius: 8px; font-weight: 900; font-size: 16px; cursor: pointer; margin-top: 20px; display: flex; justify-content: center; align-items: center; gap: 10px; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .print-btn:hover { background: #065f46; }
      `}</style>

      <div className="header no-print">
        <div className="title-box">
          <h1>مجهز بيانات الإقرار الضريبي (زاتكا) 📑</h1>
          <p>جهّز أرقام مبيعاتك ومشترياتك لفترة الإقرار الضريبي بكل سهولة ودقة</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم إدخال المبيعات والمشتريات */}
        <div>
          <div className="card">
            <h2 className="card-title">1. بيانات المبيعات خلال الفترة</h2>
            
            <div className="input-group">
              <label>إجمالي المبيعات الشاملة للضريبة (15%)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={totalSalesWithVat || ''} onChange={(e) => setTotalSalesWithVat(Number(e.target.value))} />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>المبيعات الصفرية (إن وجدت)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={zeroRatedSales || ''} onChange={(e) => setZeroRatedSales(Number(e.target.value))} />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>المبيعات المعفاة (إن وجدت)</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={exemptSales || ''} onChange={(e) => setExemptSales(Number(e.target.value))} />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">2. بيانات المشتريات والمصاريف</h2>
            
            <div className="input-group">
              <label>إجمالي المشتريات والمصاريف الشاملة للضريبة</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={totalPurchasesWithVat || ''} onChange={(e) => setTotalPurchasesWithVat(Number(e.target.value))} />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>

            <div className="input-group">
              <label>ضريبة الواردات المسددة عبر الجمارك</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={importsVatPaid || ''} onChange={(e) => setImportsVatPaid(Number(e.target.value))} />
                <span className="currency-tag">ر.س</span>
              </div>
            </div>
          </div>
        </div>

        {/* قسم النتائج والملخص للإقرار */}
        <div>
          <div className="card" style={{ background: '#f8fafc' }}>
            <h2 className="card-title">ملخص الإقرار الضريبي (للنقل إلى موقع زاتكا)</h2>

            <div className="result-row">
              <span>المبيعات الخاضعة للضريبة (بدون ضريبة):</span>
              <span style={{ color: '#0f172a' }}>{results.taxableSales.toFixed(2)} ر.س</span>
            </div>

            <div className="result-row">
              <span>ضريبة المخرجات المستحقة (Output VAT):</span>
              <span style={{ color: '#047857' }}>{results.outputVat.toFixed(2)} ر.س</span>
            </div>

            <div className="result-row" style={{ marginTop: '15px', borderTop: '2px solid #e2e8f0', paddingTop: '15px' }}>
              <span>المشتريات الخاضعة للضريبة (بدون ضريبة):</span>
              <span style={{ color: '#0f172a' }}>{results.taxablePurchases.toFixed(2)} ر.س</span>
            </div>

            <div className="result-row">
              <span>ضريبة المدخلات القابلة للخصم (Input VAT):</span>
              <span style={{ color: '#2563eb' }}>{results.inputVat.toFixed(2)} ر.س</span>
            </div>

            <div className="result-row highlight">
              <div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: results.netVatDue >= 0 ? '#047857' : '#dc2626' }}>
                  {results.netVatDue >= 0 ? 'صافي الضريبة المستحقة للدفع:' : 'صافي الضريبة القابلة للاسترداد:'}
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: results.netVatDue >= 0 ? '#047857' : '#dc2626' }}>
                {Math.abs(results.netVatDue).toFixed(2)} ر.س
              </div>
            </div>

            <button className="print-btn no-print" onClick={handlePrint}>
              🖨️ طباعة ملخص الإقرار الضريبي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
