'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppToolPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [templateType, setTemplateType] = useState('confirm');
  const [extraInfo, setExtraInfo] = useState('');
  const [generatedMsg, setGeneratedMsg] = useState('');

  // توليد الرسالة بناءً على اختيار التاجر
  const generateMessage = () => {
    let name = customerName || 'عالمنا الكريم';
    let order = orderNumber || '---';
    let msg = '';

    switch (templateType) {
      case 'confirm':
        msg = `مرحباً بك يا ${name} 👋\nيسعدنا جداً اختيارك لنا! تم تأكيد طلبك رقم (${order}) بنجاح، ونعمل حالياً على تجهيزه وشحنه لك بأسرعเวลา ممكن. شكراً لثقتك بنا 💙`;
        break;
      case 'abandoned':
        msg = `أهلاً بك يا ${name} 😊\nلاحظنا أنك أتممت خطوة إضافية ولم تكمل طلبك رقم (${order}). هل تواجه أي مشكلة في إتمام الدفع؟ نحن هنا لمساعدتك، ويمكنك إكمال الطلب مباشرة عبر المتجر.`;
        break;
      case 'shipping':
        msg = `مرحباً ${name} 📦\nتم تسليم طلبك رقم (${order}) لشركة الشحن المختصة، وسيثري وصوله إليك خلال الأيام القليلة القادمة عبر تفاصيل التتبع المرسلة لبريدك.`;
        break;
      case 'payment':
        msg = `مرحباً بك يا ${name} 💳\nلتسهيل إتمام طلبك رقم (${order})، يسعدنا تزويدك برابط الدفع السريع المباشر: ${extraInfo || '[رابط الدفع]'}\nننتظر تأكيدك لنشرع بالتجهيز فوراً!`;
        break;
      case 'custom':
        msg = `مرحباً ${name} 🌟\n${extraInfo || 'يسعدنا تواصلك معنا وخدمتك دائماً عبر متجرنا.'}`;
        break;
      default:
        msg = `مرحباً ${name}، بخصوص طلبك رقم (${order}).`;
    }

    setGeneratedMsg(msg);
  };

  // فتح واتساب مباشرة مع الرقم والنص
  const openWhatsAppDirect = () => {
    if (!generatedMsg) return;
    let phone = customerPhone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '966' + phone.substring(1); // تحويل الرقم للسعودي تلقائياً
    }
    const encodedMsg = encodeURIComponent(generatedMsg);
    const url = phone ? `https://wa.me/${phone}?text=${encodedMsg}` : `https://wa.me/?text=${encodedMsg}`;
    window.open(url, '_blank');
  };

  // نسخ النص للحافظة
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMsg);
    alert('تم نسخ الرسالة بنجاح إلى الحافظة!');
  };

  return (
    <div className="tool-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        .tool-container {
          background-color: #f8fafc;
          color: #0f172a;
          min-height: 100vh;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          padding: 30px 20px 60px;
        }

        .main-card {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          padding: 35px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .back-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          display: inline-block;
          margin-bottom: 20px;
        }

        .header-title {
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .header-desc {
          color: #64748b;
          font-size: 15px;
          margin-bottom: 30px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group.full {
          grid-column: span 2;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
        }

        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 15px;
          outline: none;
          font-family: 'Tajawal', sans-serif;
          background: #fff;
        }

        .form-control:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .templates-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 25px;
        }

        .template-btn {
          padding: 12px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .template-btn.active {
          background: #eff6ff;
          color: #2563eb;
          border-color: #2563eb;
          box-shadow: 0 2px 4px rgba(37,99,235,0.1);
        }

        .action-btns {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn-primary {
          flex: 1;
          background: #2563eb;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-whatsapp {
          flex: 1;
          background: #16a34a;
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-whatsapp:hover {
          background: #15803d;
        }

        .result-box {
          margin-top: 25px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 20px;
          border-radius: 12px;
        }

        .result-box h4 {
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 10px;
        }

        .result-content {
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          white-space: pre-wrap;
          font-size: 15px;
          line-height: 1.6;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
          .form-group.full { grid-column: span 1; }
          .action-btns { flex-direction: column; }
        }
      `}</style>

      <div className="main-card">
        <Link href="/hub" className="back-link">← العودة للوحة الرئيسية</Link>
        <h2 className="header-title">💬 منظم وقوالب محادثات واتساب الشاملة</h2>
        <p className="header-desc">الأداة الاحترافية الأولى لتجار المتاجر الإلكترونية لإدارة وتوليد رسائل العملاء في جميع حالات البيع والشحن.</p>

        {/* اختيار نوع القالب */}
        <div className="form-group">
          <label>اختر نوع الحالة أو القالب التسويقي:</label>
          <div className="templates-selector">
            <button 
              className={`template-btn ${templateType === 'confirm' ? 'active' : ''}`}
              onClick={() => setTemplateType('confirm')}
            >
              ✅ تأكيد الطلب
            </button>
            <button 
              className={`template-btn ${templateType === 'abandoned' ? 'active' : ''}`}
              onClick={() => setTemplateType('abandoned')}
            >
              🛒 السلال المتروكة
            </button>
            <button 
              className={`template-btn ${templateType === 'shipping' ? 'active' : ''}`}
              onClick={() => setTemplateType('shipping')}
            >
              📦 تتبع الشحنة
            </button>
            <button 
              className={`template-btn ${templateType === 'payment' ? 'active' : ''}`}
              onClick={() => setTemplateType('payment')}
            >
              💳 رابط الدفع
            </button>
            <button 
              className={`template-btn ${templateType === 'custom' ? 'active' : ''}`}
              onClick={() => setTemplateType('custom')}
            >
              ✨ رسالة مخصصة
            </button>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>اسم العميل الكريم</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="مثال: سلطان العتيبي" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>رقم جوال العميل (اختياري للفتح المباشر)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="مثال: 0551234567" 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>رقم الطلب أو الفاتورة</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="مثال: #8942" 
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>ملاحظات إضافية / رابط الدفع</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="ضع رابط الدفع أو ملاحظة التوصيل هنا..." 
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={generateMessage}>
          توليد الرسالة الاحترافية الآن
        </button>

        {generatedMsg && (
          <div className="result-box">
            <h4>النتيجة الجاهزة للإرسال:</h4>
            <div className="result-content">{generatedMsg}</div>
            
            <div className="action-btns">
              <button className="btn-primary" onClick={copyToClipboard}>
                📋 نسخ النص فقط
              </button>
              <button className="btn-whatsapp" onClick={openWhatsAppDirect}>
                🟢 إرسال عبر واتساب مباشرة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
