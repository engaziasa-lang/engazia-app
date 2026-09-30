'use client';

import React, { useState } from 'react';

export default function EngaziaHubPage() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'profit' | 'scraper'>('whatsapp');

  // حالات أداة واتساب
  const [customerName, setCustomerName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [whatsappResult, setWhatsappResult] = useState('');

  // حالات حاسبة الأرباح
  const [productCost, setProductCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [adCost, setAdCost] = useState('');
  const [profitResult, setProfitResult] = useState<number | null>(null);

  // توليد رسالة الواتساب
  const generateWhatsAppMsg = () => {
    const msg = `مرحباً بك يا ${customerName || 'عالمنا الكريم'}، بخصوص طلبك رقم (${orderNumber || '---'}): يسعدنا خدمتك وتأكيد تفاصيل الشحن والتوصيل السريع عبر منصة إنجازيا.`;
    setWhatsappResult(msg);
  };

  // حساب الأرباح
  const calculateProfit = () => {
    const cost = parseFloat(productCost) || 0;
    const price = parseFloat(sellingPrice) || 0;
    const ads = parseFloat(adCost) || 0;
    const net = price - (cost + ads);
    setProfitResult(net);
  };

  return (
    <div className="hub-container">
      <style jsx>{`
        .hub-container { background-color: #f8fafc; color: #1e293b; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
        .header p { color: #64748b; font-size: 15px; }
        .main-card { max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
        .tabs-nav { display: flex; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; overflow-x: auto; }
        .tab-btn { flex: 1; padding: 15px 20px; border: none; background: none; font-size: 15px; font-weight: 700; color: #64748b; cursor: pointer; text-align: center; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #ffffff; color: #2563eb; border-bottom: 3px solid #2563eb; }
        .tab-content { padding: 30px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 14px; font-weight: 700; margin-bottom: 8px; color: #334155; }
        .form-control { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; }
        .form-control:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .action-btn { background: #2563eb; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .action-btn:hover { background: #1d4ed8; }
        .result-box { margin-top: 20px; background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 8px; color: #1e40af; font-size: 14px; word-break: break-all; }
        .metric-display { font-size: 22px; font-weight: 800; color: #16a34a; margin-top: 15px; }
      `}</style>

      <header className="header">
        <h1>إنجازيا للحلول المالية والتقنية - لوحة أدوات التجار</h1>
        <p>استخدم أدواتنا السحابية المتكاملة مباشرة لتطوير متجرك الإلكتروني بكل سهولة</p>
      </header>

      <div className="main-card">
        {/* شريط التنقل بين الأدوات */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            💬 قوالب رسائل واتساب
          </button>
          <button 
            className={`tab-btn ${activeTab === 'profit' ? 'active' : ''}`}
            onClick={() => setActiveTab('profit')}
          >
            📊 حاسبة أرباح المتاجر
          </button>
          <button 
            className={`tab-btn ${activeTab === 'scraper' ? 'active' : ''}`}
            onClick={() => setActiveTab('scraper')}
          >
            ⚡ أداة استخراج وتنظيف البيانات
          </button>
        </div>

        {/* محتوى الأداة الأولى: واتساب */}
        {activeTab === 'whatsapp' && (
          <div className="tab-content">
            <h3>منظم وقوالب محادثات واتساب الذكية</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>قم بتعبئة البيانات لتوليد نص تسويقي احترافي لعملائك على واتساب بضغطة زر.</p>
            
            <div className="form-group">
              <label>اسم العميل الكريم</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="مثال: محمد السعيد" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>رقم الطلب أو الفاتورة</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="مثال: #4052" 
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>

            <button className="action-btn" onClick={generateWhatsAppMsg}>توليد ونسخ الرسالة التسويقية</button>

            {whatsappResult && (
              <div className="result-box">
                <strong>النتيجة الجاهزة للإرسال:</strong>
                <p style={{ marginTop: '8px' }}>{whatsappResult}</p>
              </div>
            )}
          </div>
        )}

        {/* محتوى الأداة الثانية: حاسبة الأرباح */}
        {activeTab === 'profit' && (
          <div className="tab-content">
            <h3>حاسبة هامش الربح ونقاط التعادل</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>احسب صافي أرباح منتجك بدقة بعد خصم تكلفة المنتج والمصاريف التسويقية.</p>

            <div className="form-group">
              <label>تكلفة شراء المنتج (ر.س)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="50" 
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>سعر البيع للعميل (ر.س)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="150" 
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>تكلفة الإعلان التقريبية لكل قطعة (ر.س)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="30" 
                value={adCost}
                onChange={(e) => setAdCost(e.target.value)}
              />
            </div>

            <button className="action-btn" onClick={calculateProfit}>احسب صافي الربح الآن</button>

            {profitResult !== null && (
              <div className="result-box">
                <span>صافي الربح التقديري لكل قطعة:</span>
                <div className="metric-display">{profitResult} ريال سعودي</div>
              </div>
            )}
          </div>
        )}

        {/* محتوى الأداة الثالثة: استخراج البيانات */}
        {activeTab === 'scraper' && (
          <div className="tab-content">
            <h3>أداة تنظيف واستخراج البيانات السريعة</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>الصق النصوص العشوائية أو قوائم البيانات أدناه لتحويلها إلى صيغة مرتبة.</p>

            <div className="form-group">
              <label>صق النصوص أو البيانات المراد تنظيفها</label>
              <textarea 
                className="form-control" 
                rows={4} 
                placeholder="الصق النصوص هنا..."
              ></textarea>
            </div>

            <button className="action-btn" onClick={() => alert('تمت معالجة البيانات بنجاح!')}>تنظيف وتصدير إلى Excel</button>
          </div>
        )}

      </div>
    </div>
  );
}
