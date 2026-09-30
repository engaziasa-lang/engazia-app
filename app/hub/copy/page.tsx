'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MarketingCopyGenerator() {
  const [productName, setProductName] = useState('');
  const [productBenefit, setProductBenefit] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedResult, setGeneratedResult] = useState('');

  const generateTikTokScript = () => {
    if (!productName || !productBenefit) {
      alert('الرجاء إدخال اسم المنتج والفائدة الرئيسية على الأقل.');
      return;
    }
    setGeneratedResult(`🎬 [سكربت إعلان تيك توك / ريلز احترافي]

[الخطاف - أول 3 ثوانٍ]:
تخيل لو تقدر ${productBenefit} بكل سهولة وبدون تعقيد؟ 🤯

[المشكلة]:
كثير من ${targetAudience || 'الناس'} يعانون من هذه المشكلة يومياً ويصرفون فلوس كثيرة بدون نتيجة..

[الحل - عرض المنتج]:
لكن مع "${productName}" الحل صار بين يديك! المنتج المصمم خصيصاً ليغير تجربتك تماماً.

[نداء للعمل - Call to Action]:
الكمية محدودة والطلب عليها عالي جداً.. اطلبها الآن قبل نفاذ الكمية عبر الرابط في البايو أو المتجر! 👇`);
  };

  const generateTwitterPost = () => {
    if (!productName || !productBenefit) {
      alert('الرجاء إدخال اسم المنتج والفائدة الرئيسية على الأقل.');
      return;
    }
    setGeneratedResult(`🔥 سر جديد لكل مهتم بـ ${targetAudience || 'التجارة والتسوق'}!

إذا كنت تبحث عن طريقة فعالة لـ ${productBenefit}، فـ "${productName}" هو الخيار الأمثل لك اليوم 🎯

✨ المميزات:
- جودة عالية وتصميم عصري
- يحل مشكلتك من أول استخدام
- ضمان الاسترجاع والرضا التام

📦 اطلبه الآن ووصله لحد باب بيتك:
[رابط المتجر]
#${productName.replace(/\s+/g, '')} #عروض`);
  };

  const generateWhatsappBroadcast = () => {
    if (!productName || !productBenefit) {
      alert('الرجاء إدخال اسم المنتج والفائدة الرئيسية على الأقل.');
      return;
    }
    setGeneratedResult(`🌟 عميلنا الغالي في ${targetAudience || 'متجرنا'}، يسعدنا نعلن لك عن وصول دفعة جديدة من "${productName}"!

لأننا نبي لك الأفضل دائماً، وفرنا لك المنتج اللي بيساعدك على ${productBenefit} وبسعر حصري لفترة محدودة ⏳

🎁 عرض خاص اليوم: اطلب الآن واستفيد من الشحن السريع!
حياك اطلب عبر الرابط المباشر:
[رابط المنتج]`);
  };

  const copyText = () => {
    navigator.clipboard.writeText(generatedResult);
    alert('تم نسخ النص التسويقي بنجاح!');
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

        .main-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .input-wrapper input, .input-wrapper textarea { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus, .input-wrapper textarea:focus { border-color: #4f46e5; background: #ffffff; }

        .btn-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 15px; }
        .action-btn { background: #e0e7ff; color: #4f46e5; border: none; padding: 12px; border-radius: 8px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; font-size: 14px; }
        .action-btn:hover { background: #4f46e5; color: #fff; }

        .preview-box { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 25px; font-size: 15px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; min-height: 250px; max-height: 350px; overflow-y: auto; border: 1px solid #1e293b; margin-bottom: 20px; }

        .copy-btn { background: #10b981; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #059669; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>مولد النصوص <span>التسويقية والإعلانات</span></h1>
        <p>اصنع سكربتات تيك توك، إعلانات تويتر، ورسائل واتساب تسويقية جذابة لزيادة مبيعات منتجاتك.</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>📝 تفاصيل المنتج والجمهور</h2>
          
          <div className="input-group">
            <label>اسم المنتج أو الخدمة</label>
            <div className="input-wrapper">
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: جهاز تنظيف السيارات اللاسلكي" />
            </div>
          </div>

          <div className="input-group">
            <label>الفائدة الكبرى أو المشكلة التي يحلها المنتج</label>
            <div className="input-wrapper">
              <input type="text" value={productBenefit} onChange={(e) => setProductBenefit(e.target.value)} placeholder="مثال: تنظيف سيارتك بدقائق وبدون مغسلة" />
            </div>
          </div>

          <div className="input-group">
            <label>الجمهور المستهدف</label>
            <div className="input-wrapper">
              <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="مثال: أصحاب السيارات، العائلات" />
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '20px 0 10px', color: '#1e293b' }}>اختر نوع المحتوى للتوليد:</h3>
          <div className="btn-grid">
            <button className="action-btn" onClick={generateTikTokScript}>🎬 توليد سكربت إعلان تيك توك / ريلز</button>
            <button className="action-btn" onClick={generateTwitterPost}>🐦 توليد منشور إعلاني لمنصة إكس (تويتر)</button>
            <button className="action-btn" onClick={generateWhatsappBroadcast}>💬 توليد رسالة برودكاست واتساب تسويقية</button>
          </div>
        </div>

        <div className="panel">
          <h2>👁️ النص الجاهز للنشر</h2>
          
          <div className="preview-box">
            {generatedResult || 'اضغط على أحد أزرار التوليد باليسار ليظهر النص هنا...'}
          </div>

          {generatedResult && (
            <button onClick={copyText} className="copy-btn">
              📋 نسخ النص إلى الحافظة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
