'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ==========================================
// 1. الواجهات (Interfaces)
// ==========================================
interface ToolInfo {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  link: string;
}

interface CustomerItem {
  id: string;
  customerName: string;
  phoneNumber: string;
  status: string;
  orderValue: number;
  paymentLink: string;
  messageTemplate: string;
  isPaid?: boolean;
  createdAt?: string;
  createdAtTimestamp?: number;
}

// ==========================================
// 2. مصفوفة الأدوات الـ 23 
// ==========================================
const saTools: ToolInfo[] = [
  { id: 'profit', titleAr: 'حاسبة أرباح ونقاط التعادل (15% ضريبة)', titleEn: 'Profit & Break-Even Calculator', descAr: 'احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة.', descEn: 'Calculate your net profit accurately after deducting costs, shipping fees, and VAT.', icon: '📊', link: '/hub/sa/profit' },
  { id: 'fees', titleAr: 'حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)', titleEn: 'Payment Gateway Fee Calculator', descAr: 'احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك.', descEn: 'Calculate local payment gateway rates and their actual impact on your store margins.', icon: '💳', link: '/hub/sa/fees' },
  { id: 'invoices', titleAr: 'مولد الفواتير الإلكترونية (زاتكا)', titleEn: 'E-Invoicing Generator (ZATCA)', descAr: 'أنشئ فواتير مبيعات نظامية مبسطة متوافقة مع متطلبات هيئة الزكاة والضريبة.', descEn: 'Generate simplified sales invoices compliant with ZATCA requirements.', icon: '🧾', link: '/hub/sa/invoices' },
  { id: 'roas', titleAr: 'محلل عائد الإعلانات (سناب وتيك توك)', titleEn: 'Ad Return Analyzer', descAr: 'قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق السعودي.', descEn: 'Measure your ad performance precisely and check if they yield rewarding returns.', icon: '📈', link: '/hub/sa/roas' },
  { id: 'returns', titleAr: 'محلل خسائر المرتجعات والشحن العكسي', titleEn: 'Returns Loss Analyzer', descAr: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي.', descEn: 'Measure the impact of returns and exchanges on your monthly net profit.', icon: '🔄', link: '/hub/sa/returns' },
  { id: 'vat_report', titleAr: 'مجهز بيانات الإقرار الضريبي', titleEn: 'VAT Return Data Preparer', descAr: 'اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل رفع الإقرار الضريبي لزاتكا.', descEn: 'Gather and organize sales and purchases data to simplify filing VAT returns.', icon: '📑', link: '/hub/sa/vat-report' },
  { id: 'platforms', titleAr: 'حاسبة رسوم المنصات (سلة، زد)', titleEn: 'Platform Fee Calculator', descAr: 'احسب التكاليف الخفية واشتراكات المنصات المحلية لضمان تسعير منتجاتك صحيحاً.', descEn: 'Calculate hidden costs and local platform subscriptions.', icon: '🛒', link: '/hub/sa/platforms' },
  { id: 'influencer', titleAr: 'حاسبة جدوى إعلانات المشاهير', titleEn: 'Influencer Marketing ROI', descAr: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل الدفع.', descEn: 'Analyze expected ROI from influencer ads before paying out budgets.', icon: '🤳', link: '/hub/sa/influencer' },
  { id: 'cod_risk', titleAr: 'محلل تكاليف الدفع عند الاستلام', titleEn: 'COD Risk Analyzer', descAr: 'احسب نسبة المخاطرة والرسوم الإضافية لطلبات الدفع عند الاستلام.', descEn: 'Calculate risk ratios and extra fees for COD orders.', icon: '🚚', link: '/hub/sa/cod-risk' },
  { id: 'shipping', titleAr: 'مدير تتبع الشحنات المحلية', titleEn: 'Shipment Tracking Manager', descAr: 'تابع حالات الشحنات (سمسا، أرامكس) وحل استفسارات التأخير.', descEn: 'Track shipment statuses and resolve delivery delays.', icon: '📦', link: '/hub/sa/shipping' },
  { id: 'inventory', titleAr: 'مخطط المخزون للمواسم السعودية', titleEn: 'Seasonal Inventory Planner', descAr: 'توقع الكميات المطلوبة لمواسم (رمضان، العيد، اليوم الوطني).', descEn: 'Forecast required stock for Saudi seasons to prevent stockouts.', icon: '📅', link: '/hub/sa/inventory' },
  { id: 'expenses', titleAr: 'مدير النفقات والمصاريف التشغيلية', titleEn: 'Operational Expenses Manager', descAr: 'تتبع مصاريف المتجر الثابتة والمتغيرة لضبط التدفق النقدي.', descEn: 'Track fixed and variable store expenses in SAR to control cash flow.', icon: '💸', link: '/hub/sa/expenses' },
  { id: 'legal', titleAr: 'مولد السياسات (وزارة التجارة)', titleEn: 'Store Policies Generator', descAr: 'أنشئ صفحات الاستبدال والاسترجاع المتوافقة مع القوانين المحلية.', descEn: 'Generate return policies and privacy terms compliant with regulations.', icon: '⚖', link: '/hub/sa/legal' },
  { id: 'jasmal', titleAr: 'جاسمال (Jasmal) لاستخراج البيانات', titleEn: 'Jasmal Data Extraction Tool', descAr: 'اسحب بيانات المنتجات والأسعار من المتاجر المنافسة لملفات إكسل.', descEn: 'Extract product data and prices from competitor stores instantly.', icon: '🕷️', link: '/hub/sa/jasmal' },
  { id: 'reviews', titleAr: 'نظام طلب التقييمات الآلي', titleEn: 'Automated Review Request', descAr: 'أرسل رسائل تلقائية للعملاء لجمع التقييمات وبناء الموثوقية.', descEn: 'Send automated WhatsApp messages to collect reviews and build trust.', icon: '⭐', link: '/hub/sa/reviews' },
  { id: 'dropshipping', titleAr: 'حاسبة أرباح الدروبشيبينغ', titleEn: 'Dropshipping Profit Calculator', descAr: 'احسب هوامش الربح للمنتجات المستوردة مع رسوم الجمارك والشحن.', descEn: 'Calculate profit margins for imported products with custom duties.', icon: '🌍', link: '/hub/sa/dropshipping' },
  { id: 'copy', titleAr: 'مولد نصوص الإكسبلور (باللهجة السعودية)', titleEn: 'Copywriting Generator', descAr: 'اصنع سكربتات تيك توك وإعلانات جذابة باللهجة المحلية.', descEn: 'Create catchy TikTok scripts and ads in the local Saudi dialect.', icon: '✍', link: '/hub/sa/copy' },
  { id: 'support', titleAr: 'قوالب خدمة العملاء السريعة', titleEn: 'Customer Service Templates', descAr: 'انسخ ردود احترافية للرد على استفسارات العملاء المكررة.', descEn: 'Copy ready professional responses for repetitive customer inquiries.', icon: '🎧', link: '/hub/sa/support' },
  { id: 'promos', titleAr: 'حاسبة جدوى أكواد الخصم والعروض', titleEn: 'Discount ROI Calculator', descAr: 'تأكد من أن عروضك الترويجية لا تسبب لك خسائر مخفية.', descEn: 'Ensure your promotional offers do not cause hidden losses.', icon: '🎟️', link: '/hub/sa/promos' },
  { id: 'ltv', titleAr: 'حاسبة القيمة الدائمة للعميل (LTV)', titleEn: 'LTV Calculator', descAr: 'اعرف تكلفة الاستحواذ على العميل وقيمته الفعلية لمتجرك.', descEn: 'Know your customer acquisition cost and long-term value.', icon: '🎯', link: '/hub/sa/ltv' },
  { id: 'ab_test', titleAr: 'حاسبة اختبارات الإعلانات (A/B)', titleEn: 'A/B Ad Testing Calculator', descAr: 'قارن بين حملتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة.', descEn: 'Compare two ad campaigns to see which achieves better returns.', icon: '⚖️', link: '/hub/sa/ab-test' },
  { id: 'links', titleAr: 'صانع روابط واتساب السريعة', titleEn: 'Quick WhatsApp Link', descAr: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو حملات الانستقرام.', descEn: 'Create custom links with pre-filled messages for campaigns.', icon: '🔗', link: '/hub/sa/links' },
  { id: 'tips', titleAr: 'أسرار نمو المتاجر السعودية', titleEn: 'Store Growth Secrets', descAr: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء.', descEn: 'Exclusive strategy library to increase conversions and loyalty.', icon: '💡', link: '/hub/sa/tips' }
];

// ==========================================
// 3. مكون أداة الواتساب المجانية المكشوفة (Hero Tool)
// ==========================================
function FreeWhatsappCrmSA({ lang }: { lang: 'ar' | 'en' }) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState(lang === 'ar' ? 'سلة متروكة' : 'Abandoned Cart');
  const [orderValue, setOrderValue] = useState<number | ''>('');
  const [paymentLink, setPaymentLink] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [items, setItems] = useState<CustomerItem[]>([]);

  useEffect(() => {
    if (lang === 'en') {
      setStatus('Abandoned Cart');
      setMessageTemplate('Hi {name}, we noticed you left great items in your cart 🛒. Here is your direct payment link to complete your order quickly: {link}');
    } else {
      setStatus('سلة متروكة');
      setMessageTemplate('مرحباً {name}، لاحظنا أنك تركت منتجات رائعة في سلتك 🛒. تفضل رابط الدفع المباشر لإكمال طلبك بأسرع وقت: {link}');
    }
    const saved = localStorage.getItem('seerk_whatsapp_crm_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, [lang]);

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phoneNumber.trim()) {
      alert(lang === 'ar' ? 'أدخل اسم العميل ورقم الجوال' : 'Enter name and phone');
      return;
    }
    const newItem: CustomerItem = {
      id: Date.now().toString(),
      customerName, phoneNumber, status,
      orderValue: typeof orderValue === 'number' ? orderValue : 0,
      paymentLink, messageTemplate, isPaid,
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    localStorage.setItem('seerk_whatsapp_crm_items', JSON.stringify(newItems));
    alert(lang === 'ar' ? '✅ تم حفظ العميل المحتمل! يمكنك إدارة العملاء من الأداة المخصصة بالأسفل.' : '✅ Lead Saved!');
    setCustomerName(''); setPhoneNumber(''); setOrderValue('');
  };

  return (
    <div className="hero-tool-container">
      <div className="hero-badge">✨ {lang === 'ar' ? 'أداة مجانية للتجربة' : 'Free Trial Tool'}</div>
      <h2 className="hero-tool-title">
        {lang === 'ar' ? 'إدارة السلال المتروكة واسترداد المبيعات عبر الواتساب' : 'Recover Abandoned Carts via WhatsApp'}
      </h2>
      <p className="hero-tool-desc">
        {lang === 'ar' 
          ? 'استخدم هذه الأداة المجانية الآن لإرسال روابط دفع سريعة لعملائك الذين تركوا منتجات في السلة، وضاعف مبيعاتك فوراً.'
          : 'Use this free tool to instantly send payment links to customers who left items in their cart.'}
      </p>

      <form onSubmit={handleSaveItem} className="hero-form">
        <div className="h-row">
          <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder={lang === 'ar' ? 'اسم العميل...' : 'Customer Name...'} required />
          <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="05XXXXXXXX" required />
          <input type="number" value={orderValue} onChange={e => setOrderValue(Number(e.target.value) || '')} placeholder={lang === 'ar' ? 'قيمة السلة (ر.س)' : 'Cart Value (SAR)'} />
        </div>
        <div className="h-row">
          <input type="url" value={paymentLink} onChange={e => setPaymentLink(e.target.value)} placeholder={lang === 'ar' ? 'رابط الدفع المباشر...' : 'Payment Link...'} style={{ flex: 2 }} />
          <button type="submit" className="hero-submit-btn">
             {lang === 'ar' ? 'حفظ وإرسال واتساب 🚀' : 'Save & Send WhatsApp 🚀'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .hero-tool-container { background: #ffffff; border-radius: 20px; padding: 30px; border: 2px solid #047857; box-shadow: 0 15px 35px -5px rgba(4,120,87,0.15); margin-bottom: 50px; text-align: ${lang === 'ar' ? 'right' : 'left'}; position: relative; overflow: hidden;}
        .hero-badge { position: absolute; top: 0; ${lang === 'ar' ? 'left: 0' : 'right: 0'}; background: #047857; color: white; padding: 6px 16px; border-bottom-${lang === 'ar' ? 'right' : 'left'}-radius: 15px; font-weight: bold; font-size: 13px; }
        .hero-tool-title { font-size: 22px; font-weight: 900; color: #0f172a; margin-bottom: 10px; margin-top: 10px;}
        .hero-tool-desc { color: #64748b; font-size: 15px; margin-bottom: 25px; line-height: 1.6; }
        .hero-form { display: flex; flex-direction: column; gap: 15px; }
        .h-row { display: flex; gap: 15px; flex-wrap: wrap; }
        .h-row input { flex: 1; padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; font-size: 14px; outline: none; background: #f8fafc; }
        .h-row input:focus { border-color: #047857; background: #fff; }
        .hero-submit-btn { background: #047857; color: white; border: none; padding: 12px 25px; border-radius: 10px; font-weight: 900; cursor: pointer; transition: 0.3s; flex: 1; font-family: inherit; font-size: 15px; }
        .hero-submit-btn:hover { background: #065f46; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(4,120,87,0.3); }
        @media(max-width: 768px) { .h-row { flex-direction: column; } }
      `}</style>
    </div>
  );
}

// ==========================================
// 4. المكون الرئيسي للمنصة (الشبكة الضبابية)
// ==========================================
export default function EnjazyaSaudiHub() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/55d16a28-3c2d-4688-a98d-7168e50a5f44';

  useEffect(() => {
    const savedLang = (localStorage.getItem('enjazya_sa_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);
    const licenseKey = localStorage.getItem('merchant_license_key') || '';
    setLicenseKeyInput(licenseKey);
    setIsActivated(!!licenseKey);
    document.title = savedLang === 'en' ? 'Enjazya Platform | Saudi Market 🇸🇦' : 'منصة إنجازيا | السوق السعودي 🇸🇦';
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('enjazya_sa_lang', newLang);
  };

  const handleActivateLicense = async (keyToValidate: string) => {
    const cleanKey = keyToValidate.trim();
    if (!cleanKey) {
      alert(lang === 'en' ? 'Please enter your license key.' : 'الرجاء إدخال مفتاح الترخيص.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'license_key': cleanKey })
      });
      const data = await response.json();
      if (data.valid) {
        localStorage.setItem('merchant_license_key', cleanKey);
        setIsActivated(true);
        alert(lang === 'en' ? '✨ Platform unlocked!' : '✨ تم التفعيل وانقشاع الضباب بنجاح!');
      } else {
        alert(lang === 'en' ? '❌ Invalid key.' : '❌ مفتاح الترخيص غير صالح أو منتهي.');
      }
    } catch (error) {
      if (cleanKey.length >= 10 && cleanKey.includes('-')) {
        localStorage.setItem('merchant_license_key', cleanKey);
        setIsActivated(true);
      } else {
        alert(lang === 'en' ? '❌ Invalid key.' : '❌ مفتاح غير صالح.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hub-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .hub-container { padding: 30px 20px 40px; min-height: 100vh; }
        .navbar { max-width: 1250px; margin: 0 auto 40px; padding: 14px 24px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; border-top: 5px solid #047857; flex-wrap: wrap; gap: 15px;}
        .brand { font-size: 26px; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 12px; }
        .sa-badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 5px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #a7f3d0; }
        
        .nav-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .lang-toggle-btn { background: #f8fafc; border: 2px solid #e2e8f0; font-weight: 800; padding: 7px 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        
        .hero-text { text-align: center; max-width: 800px; margin: 0 auto 40px; }
        .hero-text h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .hero-text h1 span { color: #047857; }
        
        /* التأثير الضبابي والشبكة */
        .locked-section-wrapper { position: relative; max-width: 1250px; margin: 0 auto; }
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; transition: all 0.4s ease; }
        .blurred-grid { filter: blur(7px); pointer-events: none; user-select: none; opacity: 0.6; }
        
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; }
        .card-icon { font-size: 28px; background: #f8fafc; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 10px; margin-bottom: 15px; }
        .card h3 { font-size: 17px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .card p { color: #64748b; font-size: 13.5px; line-height: 1.6; font-weight: 500; }

        /* نافذة التفعيل العائمة (Overlay) */
        .activation-overlay {
          position: absolute; top: 15%; left: 50%; transform: translate(-50%, 0);
          background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);
          padding: 40px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(4, 120, 87, 0.25);
          border: 2px solid #a7f3d0; text-align: center; width: 90%; max-width: 500px; z-index: 10;
        }
        .lock-icon { font-size: 40px; margin-bottom: 15px; }
        .overlay-title { font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .overlay-desc { color: #475569; font-size: 15px; margin-bottom: 25px; line-height: 1.5; font-weight: 600; }
        .price-box { background: #ecfdf5; border: 1px dashed #047857; padding: 15px; border-radius: 12px; margin-bottom: 25px; }
        .price-old { text-decoration: line-through; color: #64748b; font-size: 14px; display: block; }
        .price-new { color: #047857; font-size: 28px; font-weight: 900; }
        
        .overlay-input { width: 100%; padding: 14px; border: 2px solid #cbd5e1; border-radius: 10px; font-size: 16px; margin-bottom: 15px; text-align: center; font-family: inherit; font-weight: bold; outline: none; }
        .overlay-input:focus { border-color: #047857; }
        .overlay-btn-activate { background: #0f172a; color: white; width: 100%; padding: 14px; border: none; border-radius: 10px; font-weight: 900; font-size: 16px; cursor: pointer; transition: 0.3s; margin-bottom: 10px; }
        .overlay-btn-activate:hover { background: #1e293b; }
        .overlay-btn-buy { background: #047857; color: white; display: block; width: 100%; padding: 14px; border-radius: 10px; font-weight: 900; font-size: 16px; cursor: pointer; transition: 0.3s; box-sizing: border-box; text-decoration: none;}
        .overlay-btn-buy:hover { background: #065f46; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(4,120,87,0.3); }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 768px) { .cards-grid { grid-template-columns: 1fr; } .activation-overlay { top: 5%; padding: 25px; } }
      `}</style>

      <div className="navbar">
        <div className="brand">
          {lang === 'ar' ? 'إنجازيا' : 'Enjazya'} 
          <span className="sa-badge">🇸🇦 {lang === 'ar' ? 'السوق السعودي' : 'Saudi Market'}</span>
        </div>
        <div className="nav-controls">
          <button onClick={toggleLanguage} className="lang-toggle-btn">{lang === 'ar' ? 'English' : 'العربية'}</button>
          {isActivated && (
            <span style={{background: '#dcfce7', color: '#16a34a', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', border: '1px solid #bbf7d0'}}>
               {lang === 'ar' ? '🔓 النسخة الكاملة مفعلة' : '🔓 Pro Activated'}
            </span>
          )}
        </div>
      </div>

      <div className="hero-text">
        <h1>{lang === 'ar' ? 'منصة إنجازيا ' : 'Enjazya Platform '}<span>ULTRA MAX</span></h1>
        <p style={{color: '#64748b', fontSize: '16px', fontWeight: 600}}>
          {lang === 'ar' ? 'أقوى ترسانة حاسبات وأدوات لحماية وتطوير المتاجر الإلكترونية.' : 'The ultimate arsenal of calculators and tools to scale e-commerce stores.'}
        </p>
      </div>

      {/* المكون الأول: أداة الواتساب المكشوفة والمجانية */}
      <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
         <FreeWhatsappCrmSA lang={lang} />
      </div>

      {/* المكون الثاني: الشبكة المغلقة بالضباب */}
      <div className="locked-section-wrapper">
        <div className={`cards-grid ${!isActivated ? 'blurred-grid' : ''}`}>
          {saTools.map((tool) => (
            <div key={tool.id} className="card">
              <div>
                <div className="card-icon">{tool.icon}</div>
                <h3>{lang === 'ar' ? tool.titleAr : tool.titleEn}</h3>
                <p>{lang === 'ar' ? tool.descAr : tool.descEn}</p>
              </div>
            </div>
          ))}
        </div>

        {/* نافذة التفعيل (تظهر فقط إذا لم يتم التفعيل) */}
        {!isActivated && (
          <div className="activation-overlay">
            <div className="lock-icon">🔒</div>
            <h3 className="overlay-title">
              {lang === 'ar' ? 'افتح الترسانة الكاملة' : 'Unlock Full Arsenal'}
            </h3>
            <p className="overlay-desc">
              {lang === 'ar' 
                ? 'احصل على رخصة الوصول لجميع الأدوات الـ 23 المتبقية لمدة عام كامل عبر متصفحك.' 
                : 'Get access to the remaining 23 tools for a full year directly in your browser.'}
            </p>
            
            <div className="price-box">
              <span className="price-old">{lang === 'ar' ? 'السعر السابق: 299 ر.س' : 'Old Price: 299 SAR'}</span>
              <span className="price-new">{lang === 'ar' ? '49.99 ر.س / سنوياً' : '49.99 SAR / Year'}</span>
            </div>

            <input 
              type="text" 
              className="overlay-input" 
              placeholder={lang === 'ar' ? 'أدخل مفتاح الترخيص هنا...' : 'Enter License Key...'}
              value={licenseKeyInput}
              onChange={(e) => setLicenseKeyInput(e.target.value)}
            />
            
            <button className="overlay-btn-activate" onClick={() => handleActivateLicense(licenseKeyInput)} disabled={isLoading}>
              {isLoading ? '...' : (lang === 'ar' ? 'التحقق وفتح الأدوات ✨' : 'Verify & Unlock ✨')}
            </button>

            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="overlay-btn-buy">
               {lang === 'ar' ? 'شراء مفتاح التفعيل الآن 🛒' : 'Buy License Key Now 🛒'}
            </a>
          </div>
        )}
      </div>

    </div>
  );
}
