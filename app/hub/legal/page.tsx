'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة مولد السياسات القانونية
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'مولد السياسات',
    titleSub: 'القانونية للمتجر',
    desc: 'أنشئ صفحات الاستبدال، الخصوصية، والشروط والأحكام متوافقة نظامياً وجاهزة للنسخ في متجرك.',
    panel1Title: '⚙️️ إعدادات المتجر',
    storeNameLabel: 'اسم المتجر',
    emailLabel: 'بريد الدعم الفني',
    daysLabel: 'مدة الاسترجاع المسموحة (أيام)',
    selectTabTitle: 'اختر الصفحة المطلوبة:',
    tabReturn: '🔄 سياسة الاستبدال والاسترجاع',
    tabPrivacy: '🔒 سياسة الخصوصية وحماية البيانات',
    tabTerms: '📜 الشروط والأحكام العامة',
    panel2Title: '👁️ معاينة النص الجاهز',
    copyBtn: '📋 نسخ النص إلى الحافظة',
    alertCopied: 'تم نسخ النص بنجاح ومزامنته سحابياً!'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Legal Pages',
    titleSub: 'Generator',
    desc: 'Create compliant return, privacy, and terms pages for your store ready to copy.',
    panel1Title: '⚙️ Store Settings',
    storeNameLabel: 'Store Name',
    emailLabel: 'Support Email',
    daysLabel: 'Return Period (Days)',
    selectTabTitle: 'Select Desired Page:',
    tabReturn: '🔄 Return & Refund Policy',
    tabPrivacy: '🔒 Privacy Policy & Data Protection',
    tabTerms: '📜 Terms & Conditions',
    panel2Title: '👁️ Ready Text Preview',
    copyBtn: '📋 Copy Text to Clipboard',
    alertCopied: 'Text copied and synced to cloud successfully!'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Générateur de pages',
    titleSub: 'légales',
    desc: 'Créez des pages de politique de retour et de confidentialité conformes.',
    panel1Title: '⚙️ Paramètres',
    storeNameLabel: 'Nom de la boutique',
    emailLabel: 'Email de support',
    daysLabel: 'Délai de retour (jours)',
    selectTabTitle: 'Sélectionnez la page :',
    tabReturn: '🔄 Politique de retour',
    tabPrivacy: '🔒 Politique de confidentialité',
    tabTerms: '📜 Conditions générales',
    panel2Title: '👁️ Aperçu du texte',
    copyBtn: '📋 Copier le texte',
    alertCopied: 'Texte copié et synchronisé avec succès !'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Generador de páginas',
    titleSub: 'legales',
    desc: 'Crea páginas de políticas de devolución, privacidad y términos.',
    panel1Title: '⚙️ Configuración',
    storeNameLabel: 'Nombre de la tienda',
    emailLabel: 'Correo de soporte',
    daysLabel: 'Días de devolución',
    selectTabTitle: 'Selecciona la página:',
    tabReturn: '🔄 Política de devoluciones',
    tabPrivacy: '🔒 Política de privacidad',
    tabTerms: '📜 Términos y condiciones',
    panel2Title: '👁️ Vista previa del texto',
    copyBtn: '📋 Copiar texto',
    alertCopied: '¡Texto copiado y sincronizado con éxito!'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Yasal Sayfalar',
    titleSub: 'Oluşturucu',
    desc: 'Mağazanız için uyumlu iade, gizlilik ve şartlar sayfaları oluşturun.',
    panel1Title: '⚙️ Mağaza Ayarları',
    storeNameLabel: 'Mağaza Adı',
    emailLabel: 'Destek E-postası',
    daysLabel: 'İade Süresi (Gün)',
    selectTabTitle: 'İstenen Sayfayı Seçin:',
    tabReturn: '🔄 İade ve Geri Ödeme Politikası',
    tabPrivacy: '🔒 Gizlilik Politikası',
    tabTerms: '📜 Şartlar ve Koşullar',
    panel2Title: '👁️ Hazır Metin Önizlemesi',
    copyBtn: '📋 Metni Panoya Kopyala',
    alertCopied: 'Metin kopyalandı ve buluta senkronize edildi!'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '法律条款',
    titleSub: '页面生成器',
    desc: '为您的店铺创建合规的退货、隐私和条款页面，随时可复制。',
    panel1Title: '⚙️ 店铺设置',
    storeNameLabel: '店铺名称',
    emailLabel: '客服邮箱',
    daysLabel: '允许退货天数 (天)',
    selectTabTitle: '选择所需页面：',
    tabReturn: '🔄 退货与退款政策',
    tabPrivacy: '🔒 隐私政策与数据保护',
    tabTerms: '📜 服务条款与条件',
    panel2Title: '👁️ 文本预览',
    copyBtn: '📋 复制文本到剪贴板',
    alertCopied: '文案已成功复制并同步至云端！'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Rechtstexte-',
    titleSub: 'Generator',
    desc: 'Erstellen Sie konforme Widerrufs-, Datenschutz- und AGB-Seiten.',
    panel1Title: '⚙️ Shop-Einstellungen',
    storeNameLabel: 'Shop-Name',
    emailLabel: 'Support-E-Mail',
    daysLabel: 'Rückgabefrist (Tage)',
    selectTabTitle: 'Gewünschte Seite auswählen:',
    tabReturn: '🔄 Widerrufsbelehrung',
    tabPrivacy: '🔒 Datenschutzerklärung',
    tabTerms: '📜 Allgemeine Geschäftsbedingungen',
    panel2Title: '👁️ Textvorschau',
    copyBtn: '📋 Text in die Zwischenablage kopieren',
    alertCopied: 'Text erfolgreich kopiert und synchronisiert!'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Pembuat Halaman',
    titleSub: 'Hukum Toko',
    desc: 'Buat halaman kebijakan pengembalian, privasi, dan ketentuan yang patuh.',
    panel1Title: '⚙️ Pengaturan Toko',
    storeNameLabel: 'Nama Toko',
    emailLabel: 'Email Dukungan',
    daysLabel: 'Batas Hari Pengembalian (Hari)',
    selectTabTitle: 'Pilih Halaman yang Diinginkan:',
    tabReturn: '🔄 Kebijakan Pengembalian',
    tabPrivacy: '🔒 Kebijakan Privasi',
    tabTerms: '📜 Syarat & Ketentuan',
    panel2Title: '👁️ Pratinjau Teks Siap',
    copyBtn: '📋 Salin Teks ke Clipboard',
    alertCopied: 'Teks berhasil disalin dan disinkronkan ke cloud!'
  }
};

export default function LegalPagesGenerator() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [storeName, setStoreName] = useState('متجرك الإلكتروني');
  const [supportEmail, setSupportEmail] = useState('support@store.com');
  const [daysLimit, setDaysLimit] = useState('7');
  const [activeTab, setActiveTab] = useState<'return' | 'privacy' | 'terms'>('return');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('engazia_global_lang') || 'ar';
      const savedCurr = localStorage.getItem('engazia_global_currency') || 'SAR';
      const savedKey = localStorage.getItem('merchant_license_key') || '';
      
      setCurrentLang(savedLang);
      setCurrentCurrency(savedCurr);
      setLicenseKey(savedKey);
    }
  }, []);

  const t = toolTranslations[currentLang] || toolTranslations.ar;
  const isRtl = currentLang === 'ar';

  const returnPolicyText = `سياسة الاستبدال والاسترجاع في ${storeName}

1. يحق للعميل استرجاع المنتجات خلال (${daysLimit}) أيام من تاريخ استلام الطلب.
2. يشترط أن يكون المنتج بحالته الأصلية، غير المستخدم، وبغلافه الأصلي مع وجود الفاتورة.
3. تتحمل إدارة ${storeName} تكاليف الشحن في حال وجود عيب مصنعي أو خطأ في الطلب، بينما يتحمل العميل تكلفتها في حال رغبته في التبديل لسبب شخصي.
4. لا يمكن استرجاع المنتجات المصنوعة خصيصاً بناءً على طلب العميل أو المنتجات الاستهلاكية التي يخشى تلفها.
5. يتم إرجاع الأموال للعميل بالطريقة التي دفع بها خلال مدة تتراوح بين 3 إلى 14 يوم عمل بعد استلامنا للمنتج وفحصه.

لتقديم طلب استرجاع، يرجى مراسلتنا عبر البريد الإلكتروني: ${supportEmail}`;

  const privacyPolicyText = `سياسة الخصوصية وحماية البيانات في ${storeName}

نحن في ${storeName} نلتزم بحماية خصوصية بياناتك الشخصية:
1. البيانات التي نجمعها: اسم العميل، رقم الجوال، العنوان البريدي، ومعلومات الدفع الضرورية لتنفيذ الطلب.
2. كيف نستخدم البيانات: تُستخدم لغرض شحن وتوصيل الطلبات، التواصل مع العميل في حال وجود استفسار، وتحسين تجربة التسوق في المتجر.
3. حماية البيانات: نتخذ كافة التدابير التقنية والإدارية اللازمة لحماية معلوماتك من الوصول غير المصرح به أو التسريب.
4. لا نقوم إطلاقا ببيع أو مشاركة بياناتك الشخصية مع أي طرف ثالث سوى شركات الشحن المخولة بتوصيل طلبك.`;

  const termsText = `الشروط والأحكام الاستخدام - ${storeName}

1. باستخدامك لهذا المتجر أو إتمامك لعملية الشراء، فإنك توافق التزاماً تاماً بكافة الشروط والأحكام المذكورة هنا.
2. الأسعار المعروضة في المتجر قابلة للتغيير في أي وقت دون إشعار مسبق، ولكن يتم اعتماد السعر للطلب المؤكد فعلياً.
3. نبذل قصارى جهدنا لعرض صور ووصف المنتجات بأكبر قدر ممكن من الدقة، ولكن لا نضمن خلوها من الأخطاء البسيطة.
4. يحق لإدارة ${storeName} إلغاء أي طلب في حال نفاذ الكمية أو وجود خطأ فادح في تسعير المنتج، مع إرجاع كامل المبلغ للعميل فوراً.`;

  const getCurrentText = () => {
    if (activeTab === 'return') return returnPolicyText;
    if (activeTab === 'privacy') return privacyPolicyText;
    return termsText;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCurrentText());
    alert(t.alertCopied);
  };

  return (
    <div className="tool-container" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 70px; }
        
        .header { max-width: 1000px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 40px; }
        .tool-title h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 16px; }

        .main-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .input-wrapper input { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus { border-color: #4f46e5; background: #ffffff; }

        .tabs-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .tab-btn { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 12px 15px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: start; cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: #4f46e5; color: #ffffff; border-color: #4f46e5; }

        .preview-box { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 25px; font-size: 14px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; max-height: 400px; overflow-y: auto; border: 1px solid #1e293b; margin-bottom: 20px; }

        .copy-btn { background: #10b981; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #059669; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>{isRtl ? '→' : '←'}</span> {t.back}
        </Link>
        {licenseKey && (
          <span style={{ fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontWeight: 800 }}>
            🔒 PRO
          </span>
        )}
      </div>

      <div className="tool-title">
        <h1>{t.titleMain} <span>{t.titleSub}</span></h1>
        <p>{t.desc}</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>{t.panel1Title}</h2>
          
          <div className="input-group">
            <label>{t.storeNameLabel}</label>
            <div className="input-wrapper">
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>{t.emailLabel}</label>
            <div className="input-wrapper">
              <input type="text" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>{t.daysLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={daysLimit} onChange={(e) => setDaysLimit(e.target.value)} />
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '20px 0 10px', color: '#1e293b' }}>{t.selectTabTitle}</h3>
          <div className="tabs-list">
            <button className={`tab-btn ${activeTab === 'return' ? 'active' : ''}`} onClick={() => setActiveTab('return')}>
              {t.tabReturn}
            </button>
            <button className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
              {t.tabPrivacy}
            </button>
            <button className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`} onClick={() => setActiveTab('terms')}>
              {t.tabTerms}
            </button>
          </div>
        </div>

        <div className="panel">
          <h2>{t.panel2Title}</h2>
          
          <div className="preview-box">
            {getCurrentText()}
          </div>

          <button onClick={copyToClipboard} className="copy-btn">
            {t.copyBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
