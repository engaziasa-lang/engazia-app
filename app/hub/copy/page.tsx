'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري الخاص بالأداة ليتوافق مع القائمة الرئيسية
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'مولد النصوص',
    titleSub: 'التسويقية والإعلانات',
    desc: 'اصنع سكربتات تيك توك، إعلانات تويتر، ورسائل واتساب تسويقية جذابة لزيادة مبيعات منتجاتك.',
    panel1Title: '📝 تفاصيل المنتج والجمهور',
    prodNameLabel: 'اسم المنتج أو الخدمة',
    prodNamePh: 'مثال: جهاز تنظيف السيارات اللاسلكي',
    prodBenefitLabel: 'الفائدة الكبرى أو المشكلة التي يحلها المنتج',
    prodBenefitPh: 'مثال: تنظيف سيارتك بدقائق وبدون مغسلة',
    audienceLabel: 'الجمهور المستهدف',
    audiencePh: 'مثال: أصحاب السيارات، العائلات',
    selectType: 'اختر نوع المحتوى للتوليد:',
    btnTikTok: '🎬 توليد سكربت إعلان تيك توك / ريلز',
    btnTwitter: '🐦 توليد منشور إعلاني لمنصة إكس (تويتر)',
    btnWhatsapp: '💬 توليد رسالة برودكاست واتساب تسويقية',
    panel2Title: '👁️ النص الجاهز للنشر',
    previewPh: 'اضغط على أحد أزرار التوليد باليسار ليظهر النص هنا...',
    copyBtn: '📋 نسخ النص إلى الحافظة',
    alertMissing: 'الرجاء إدخال اسم المنتج والفائدة الرئيسية على الأقل.',
    alertCopied: 'تم نسخ النص التسويقي بنجاح ومزامنته سحابياً!'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Marketing Copy',
    titleSub: '& Ad Generator',
    desc: 'Create TikTok scripts, Twitter ads, and engaging WhatsApp marketing messages.',
    panel1Title: '📝 Product & Audience Details',
    prodNameLabel: 'Product or Service Name',
    prodNamePh: 'e.g., Wireless Car Vacuum Cleaner',
    prodBenefitLabel: 'Main Benefit or Solved Problem',
    prodBenefitPh: 'e.g., Clean your car in minutes without a wash',
    audienceLabel: 'Target Audience',
    audiencePh: 'e.g., Car owners, families',
    selectType: 'Select content type to generate:',
    btnTikTok: '🎬 Generate TikTok / Reels Script',
    btnTwitter: '🐦 Generate X (Twitter) Ad Post',
    btnWhatsapp: '💬 Generate WhatsApp Broadcast Message',
    panel2Title: '👁️ Ready-to-Publish Text',
    previewPh: 'Click one of the generate buttons on the left to see the text here...',
    copyBtn: '📋 Copy Text to Clipboard',
    alertMissing: 'Please enter at least the product name and main benefit.',
    alertCopied: 'Marketing copy copied and synced to cloud successfully!'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Copie Marketing',
    titleSub: '& Générateur d\'annonces',
    desc: 'Créez des scripts TikTok, des annonces Twitter et des messages WhatsApp.',
    panel1Title: '📝 Détails du produit',
    prodNameLabel: 'Nom du produit ou service',
    prodNamePh: 'ex: Aspirateur sans fil',
    prodBenefitLabel: 'Avantage principal',
    prodBenefitPh: 'ex: Nettoyez votre voiture en quelques minutes',
    audienceLabel: 'Public cible',
    audiencePh: 'ex: Propriétaires de voitures',
    selectType: 'Sélectionnez le type de contenu :',
    btnTikTok: '🎬 Générer un script TikTok',
    btnTwitter: '🐦 Générer une annonce Twitter',
    btnWhatsapp: '💬 Générer un message WhatsApp',
    panel2Title: '👁️ Texte prêt à publier',
    previewPh: 'Cliquez sur un bouton pour générer le texte...',
    copyBtn: '📋 Copier le texte',
    alertMissing: 'Veuillez entrer le nom du produit et l\'avantage principal.',
    alertCopied: 'Texte copié et synchronisé avec succès !'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Copywriting',
    titleSub: 'y Generador de Anuncios',
    desc: 'Crea guiones de TikTok, anuncios de Twitter y mensajes de WhatsApp.',
    panel1Title: '📝 Detalles del producto',
    prodNameLabel: 'Nombre del producto o servicio',
    prodNamePh: 'ej. Aspiradora inalámbrica',
    prodBenefitLabel: 'Beneficio principal',
    prodBenefitPh: 'ej. Limpia tu auto en minutos',
    audienceLabel: 'Público objetivo',
    audiencePh: 'ej. Dueños de autos',
    selectType: 'Selecciona el tipo de contenido:',
    btnTikTok: '🎬 Generar guión de TikTok',
    btnTwitter: '🐦 Generar anuncio de Twitter',
    btnWhatsapp: '💬 Generar mensaje de WhatsApp',
    panel2Title: '👁️ Texto listo para publicar',
    previewPh: 'Haz clic en un botón de generación...',
    copyBtn: '📋 Copiar texto',
    alertMissing: 'Por favor ingresa el nombre del producto y el beneficio.',
    alertCopied: '¡Texto copiado y sincronizado con éxito!'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Pazarlama Metni',
    titleSub: 've Reklam Oluşturucu',
    desc: 'TikTok, Twitter ve WhatsApp için etkileyici pazarlama metinleri oluşturun.',
    panel1Title: '📝 Ürün ve Hedef Kitle Detayları',
    prodNameLabel: 'Ürün veya Hizmet Adı',
    prodNamePh: 'örn: Kablosuz Araç Süpürgesi',
    prodBenefitLabel: 'Ana Fayda veya Çözülen Sorun',
    prodBenefitPh: 'örn: Arabanızı dakikalar içinde temizleyin',
    audienceLabel: 'Hedef Kitle',
    audiencePh: 'örn: Araç sahipleri, aileler',
    selectType: 'İçerik türünü seçin:',
    btnTikTok: '🎬 TikTok / Reels Senaryosu Oluştur',
    btnTwitter: '🐦 X (Twitter) Reklam Gönderisi Oluştur',
    btnWhatsapp: '💬 WhatsApp Yayın Mesajı Oluştur',
    panel2Title: '👁️ Yayınlamaya Hazır Metin',
    previewPh: 'Metni görmek için soldaki butonlardan birine tıklayın...',
    copyBtn: '📋 Metni Panoya Kopyala',
    alertMissing: 'Lütfen en az ürün adını ve ana faydayı girin.',
    alertCopied: 'Pazarlama metni kopyalandı ve buluta senkronize edildi!'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '营销文案',
    titleSub: '与广告生成器',
    desc: '创建吸引人的抖音/TikTok脚本、推特广告和WhatsApp营销消息。',
    panel1Title: '📝 产品与受众详情',
    prodNameLabel: '产品或服务名称',
    prodNamePh: '例如：无线车载吸尘器',
    prodBenefitLabel: '核心优势或解决的问题',
    prodBenefitPh: '例如：几分钟内清洁汽车',
    audienceLabel: '目标受众',
    audiencePh: '例如：车主、家庭',
    selectType: '选择要生成的内容类型：',
    btnTikTok: '🎬 生成 TikTok/Reels 脚本',
    btnTwitter: '🐦 生成推特广告文案',
    btnWhatsapp: '💬 生成 WhatsApp 营销广播消息',
    panel2Title: '👁️️ 准备发布的文本',
    previewPh: '点击左侧的生成按钮，文案将显示在此处...',
    copyBtn: '📋 复制文本到剪贴板',
    alertMissing: '请输入产品名称和核心优势。',
    alertCopied: '营销文案已成功复制并同步至云端！'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Marketing-Text',
    titleSub: '& Anzeigen-Generator',
    desc: 'Erstellen Sie TikTok-Skripte, Twitter-Ads und WhatsApp-Nachrichten.',
    panel1Title: '📝 Produkt- & Zielruppendetails',
    prodNameLabel: 'Produkt- oder Dienstleistungsname',
    prodNamePh: 'z.B. Kabelloser Staubsauger',
    prodBenefitLabel: 'Hauptnutzen oder gelöstes Problem',
    prodBenefitPh: 'z.B. Auto in Minuten reinigen',
    audienceLabel: 'Zielgruppe',
    audiencePh: 'z.B. Autobesitzer, Familien',
    selectType: 'Inhaltstyp auswählen:',
    btnTikTok: '🎬 TikTok / Reels Skript generieren',
    btnTwitter: '🐦 Twitter Werbebeitrag generieren',
    btnWhatsapp: '💬 WhatsApp Broadcast Nachricht generieren',
    panel2Title: '👁️ Fertiger Text',
    previewPh: 'Klicken Sie links auf eine Schaltfläche...',
    copyBtn: '📋 Text in die Zwischenablage kopieren',
    alertMissing: 'Bitte geben Sie mindestens den Produktnamen und den Hauptnutzen ein.',
    alertCopied: 'Marketing-Text erfolgreich kopiert und synchronisiert!'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Salinan Pemasaran',
    titleSub: '& Pembuat Iklan',
    desc: 'Buat skrip TikTok, iklan Twitter, dan pesan pemasaran WhatsApp.',
    panel1Title: '📝 Detail Produk & Audiens',
    prodNameLabel: 'Nama Produk atau Layanan',
    prodNamePh: 'cth: Vakum Mobil Nirkabel',
    prodBenefitLabel: 'Manfaat Utama',
    prodBenefitPh: 'cth: Bersihkan mobil dalam hitungan menit',
    audienceLabel: 'Target Audiens',
    audiencePh: 'cth: Pemilik mobil, keluarga',
    selectType: 'Pilih jenis konten:',
    btnTikTok: '🎬 Buat Skrip TikTok / Reels',
    btnTwitter: '🐦 Buat Postingan Iklan X (Twitter)',
    btnWhatsapp: '💬 Buat Pesan Broadcast WhatsApp',
    panel2Title: '👁️ Teks Siap Publikasi',
    previewPh: 'Klik salah satu tombol di kiri...',
    copyBtn: '📋 Salin Teks ke Clipboard',
    alertMissing: 'Harap masukkan setidaknya nama produk dan manfaat utama.',
    alertCopied: 'Salinan pemasaran berhasil disalin dan disinkronkan ke cloud!'
  }
};

export default function MarketingCopyGenerator() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');
  
  const [productName, setProductName] = useState('');
  const [productBenefit, setProductBenefit] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedResult, setGeneratedResult] = useState('');

  // جلب الإعدادات من القائمة الرئيسية (localStorage) فور تحميل الأداة
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

  const generateTikTokScript = () => {
    if (!productName || !productBenefit) {
      alert(t.alertMissing);
      return;
    }
    setGeneratedResult(`🎬 [سكربت إعلان تيك توك / ريلز احترافي]

[الخطاف - أول 3 ثوانٍ]:
تخيل لو تقدر ${productBenefit} بكل سهولة وبدون تعقيد؟ 🤯

[المشكلة]:
كثير من ${targetAudience || 'الناس'} يعانون من هذه المشكلة يومياً..

[الحل - عرض المنتج]:
لكن مع "${productName}" الحل صار بين يديك!

[نداء للعمل - Call to Action]:
اطلبها الآن عبر الرابط في البايو أو المتجر! 👇 (العملة المعتمدة: ${currentCurrency})`);
  };

  const generateTwitterPost = () => {
    if (!productName || !productBenefit) {
      alert(t.alertMissing);
      return;
    }
    setGeneratedResult(`🔥 سر جديد لكل مهتم بـ ${targetAudience || 'التجارة والتسوق'}!

إذا كنت تبحث عن طريقة فعالة لـ ${productBenefit}، فـ "${productName}" هو الخيار الأمثل لك اليوم 🎯 (العملة: ${currentCurrency})

✨ المميزات:
- جودة عالية وتصميم عصري
- يحل مشكلتك من أول استخدام

📦 اطلبه الآن: [رابط المتجر]`);
  };

  const generateWhatsappBroadcast = () => {
    if (!productName || !productBenefit) {
      alert(t.alertMissing);
      return;
    }
    setGeneratedResult(`🌟 عميلنا الغالي في ${targetAudience || 'متجرنا'}، يسعدنا نعلن لك عن وصول "${productName}"!

نوفر لك المنتج اللي بيساعدك على ${productBenefit} بسعر حصري (${currentCurrency}) ⏳

حياك اطلب عبر الرابط المباشر: [رابط المنتج]`);
  };

  const copyText = () => {
    navigator.clipboard.writeText(generatedResult);
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

        .main-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .input-wrapper input, .input-wrapper textarea { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus { border-color: #4f46e5; background: #ffffff; }

        .btn-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 15px; }
        .action-btn { background: #e0e7ff; color: #4f46e5; border: none; padding: 12px; border-radius: 8px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; font-size: 14px; text-align: start; }
        .action-btn:hover { background: #4f46e5; color: #fff; }

        .preview-box { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 25px; font-size: 15px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; min-height: 250px; max-height: 350px; overflow-y: auto; border: 1px solid #1e293b; margin-bottom: 20px; }

        .copy-btn { background: #10b981; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #059669; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/" className="back-btn">
          <span>{isRtl ? '→' : '←'}</span> {t.back}
        </Link>
        {licenseKey && (
          <span style={{ fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontWeight: 800 }}>
            🔒 سحابي مفعل (PRO)
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
            <label>{t.prodNameLabel}</label>
            <div className="input-wrapper">
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={t.prodNamePh} />
            </div>
          </div>

          <div className="input-group">
            <label>{t.prodBenefitLabel}</label>
            <div className="input-wrapper">
              <input type="text" value={productBenefit} onChange={(e) => setProductBenefit(e.target.value)} placeholder={t.prodBenefitPh} />
            </div>
          </div>

          <div className="input-group">
            <label>{t.audienceLabel}</label>
            <div className="input-wrapper">
              <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder={t.audiencePh} />
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '20px 0 10px', color: '#1e293b' }}>{t.selectType}</h3>
          <div className="btn-grid">
            <button className="action-btn" onClick={generateTikTokScript}>{t.btnTikTok}</button>
            <button className="action-btn" onClick={generateTwitterPost}>{t.btnTwitter}</button>
            <button className="action-btn" onClick={generateWhatsappBroadcast}>{t.btnWhatsapp}</button>
          </div>
        </div>

        <div className="panel">
          <h2>{t.panel2Title}</h2>
          
          <div className="preview-box">
            {generatedResult || t.previewPh}
          </div>

          {generatedResult && (
            <button onClick={copyText} className="copy-btn">
              {t.copyBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
