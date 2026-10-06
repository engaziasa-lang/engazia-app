import React from 'react';

export default function PricingCard() {
  // مصفوفة تشمل الميزات الأساسية + كافة الـ 24 أداة بترتيب منسق وجذاب
  const allFeatures = [
    "تفعيل فوري لكافة الأدوات الـ 24 🚀",
    "أداة جسمل (مقارنة وتحليل الأسعار مع المنافسين) ⚖️",
    "إدارة عملاء واتساب الشاملة (إنجازيا Pro Max) 📱",
    "حسابات ضريبية متوافقة مع هيئة الزكاة (ZATCA) 🏛️",
    "حاسبة الأرباح والتكاليف التشغيلية الشاملة 📊",
    "حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى) 💳",
    "أداة استرجاع السلال المتروكة آلياً 🛒",
    "محلل عائد الإنفاق الإعلاني الدقيق (ROAS) 📈",
    "مدير سياسة المرتجعات والشحن العكسي 🔄",
    "منشئ الفواتير الإلكترونية المعتمدة 🧾",
    "مقارن ومتبع أسعار شركات الشحن 🚚",
    "مستشار الذكاء الاصطناعي لنمو المتاجر 💡",
    "مقارن منصات التجارة الإلكترونية 🛍️",
    "محلل تجارب الأداء وتحسين التحويل (A/B Test) 🧪",
    "حاسبة القيمة الدائمة للعملاء (LTV) 💎",
    "مخطط العروض الترويجية والخصومات 🎁",
    "مركز الدعم الذكي وإدارة التذاكر 🎧",
    "مولد النصوص التسويقية والإعلانية ✍️",
    "محلل ومخطط أعمال الدروبشيبينغ 📦",
    "مجمع تقييمات العملاء لزيادة الموثوقية ⭐",
    "منشئ السياسات القانونية والشروط 📜",
    "متتبع المصاريف والنفقات المتغيرة 📉",
    "نظام إدارة وتتبع حركة المخزون 📋",
    "مقيم مخاطر الدفع عند الاستلام (COD) ⚠️",
    "محلل أداء حملات المشاهير (Influencers) 🌟",
    "إمكانية التفعيل على 3 أجهزة للموظفين 💻",
    "نسخ احتياطي وتصدير كامل للبيانات بصيغة JSON 💾"
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 16px', direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* بطاقة الباقة الشاملة */}
      <div style={{ border: '2px solid #059669', borderRadius: '16px', padding: '40px', backgroundColor: '#ffffff', maxWidth: '900px', margin: '0 auto', boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.15)' }}>
        
        {/* عنوان الباقة */}
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '12px' }}>
          الباقة الشاملة (PRO ULTRA)
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '18px', marginBottom: '32px' }}>
          وصول غير محدود لجميع الأدوات الـ 24 والتحديثات المستقبلية وميزات التصدير والاستيراد.
        </p>

        {/* السعر */}
        <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '56px', fontWeight: '900', color: '#059669', lineHeight: '1' }}>
            49.99 <span style={{ fontSize: '24px', fontWeight: '700' }}>ر.س</span>
          </span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#94a3b8', textDecoration: 'line-through' }}>
            299 ر.س
          </span>
          <span style={{ fontSize: '18px', color: '#64748b', alignSelf: 'flex-end', paddingBottom: '10px' }}>
            / شهرياً
          </span>
        </div>

        {/* شبكة الأدوات */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {allFeatures.map((feature, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <rect width="24" height="24" rx="4" fill="#059669"/>
                <path d="M7 12.5L10.5 16L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: '16px', color: '#1e293b', fontWeight: '700' }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* زر الاشتراك */}
        <div style={{ textAlign: 'center' }}>
          <button style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '18px 48px', fontSize: '22px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', width: '100%', maxWidth: '450px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)', transition: 'transform 0.2s, backgroundColor 0.2s' }}>
            اشترك الآن وافتح جميع الأدوات 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
