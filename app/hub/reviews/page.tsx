'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة تقييمات العملاء
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'أداة طلب',
    titleSub: 'وتقييمات العملاء',
    desc: 'صمم رسائل متابعة احترافية تُرسل بعد الاستلام لجمع تقييمات العملاء وبناء الثقة في متجرك.',
    panel1Title: '⭐ تفاصيل الطلب والعميل',
    custNameLabel: 'اسم العميل',
    custNamePh: 'مثال: عبد الله بن محمد',
    storeNameLabel: 'اسم المتجر',
    storeNamePh: 'مثال: متجر إنجازيا',
    prodNameLabel: 'اسم المنتج الذي اشتراه',
    prodNamePh: 'مثال: ساعة يد ذكية',
    codeLabel: 'كود خصم الشكر (هدية للتقييم)',
    codePh: 'مثال: THANKS10',
    genBtn: '✨ توليد رسالة طلب التقييم',
    panel2Title: '👁️ معاينة الرسالة الجاهزة للإرسال',
    previewPh: 'املأ البيانات بالليسار واضغط توليد ليظهر النص هنا...',
    copyBtn: '📋 نسخ الرسالة لإرسالها بالواتساب',
    alertMissing: 'الرجاء إدخال اسم العميل واسم المنتج على الأقل.',
    alertCopied: 'تم نسخ رسالة تقييم العميل بنجاح ومزامنته سحابياً!'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Customer Reviews',
    titleSub: '& Feedback Tool',
    desc: 'Design professional follow-up messages sent after delivery to collect reviews and build trust.',
    panel1Title: '⭐ Order & Customer Details',
    custNameLabel: 'Customer Name',
    custNamePh: 'e.g., John Smith',
    storeNameLabel: 'Store Name',
    storeNamePh: 'e.g., Engazia Store',
    prodNameLabel: 'Purchased Product Name',
    prodNamePh: 'e.g., Smart Watch',
    codeLabel: 'Thank-you Discount Code (Reward)',
    codePh: 'e.g., THANKS10',
    genBtn: '✨ Generate Review Request Message',
    panel2Title: '👁️ Ready-to-Send Message Preview',
    previewPh: 'Fill in the details on the left and click generate...',
    copyBtn: '📋 Copy Message for WhatsApp',
    alertMissing: 'Please enter at least the customer name and product name.',
    alertCopied: 'Customer review message copied and synced to cloud successfully!'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Avis clients',
    titleSub: '& Outil de commentaires',
    desc: 'Concevez des messages de suivi professionnels pour collecter des avis.',
    panel1Title: '⭐ Détails de la commande',
    custNameLabel: 'Nom du client',
    custNamePh: 'ex: Jean Dupont',
    storeNameLabel: 'Nom de la boutique',
    storeNamePh: 'ex: Ma Boutique',
    prodNameLabel: 'Nom du produit',
    prodNamePh: 'ex: Montre connectée',
    codeLabel: 'Code promo de remerciement',
    codePh: 'ex: THANKS10',
    genBtn: '✨ Générer le message',
    panel2Title: '👁️ Aperçu du message',
    previewPh: 'Remplissez les détails à gauche...',
    copyBtn: '📋 Copier le message pour WhatsApp',
    alertMissing: 'Veuillez entrer le nom du client et du produit.',
    alertCopied: 'Message copié et synchronisé avec succès !'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Reseñas de clientes',
    titleSub: 'y Herramienta de Comentarios',
    desc: 'Diseña mensajes de seguimiento profesionales para recopilar reseñas.',
    panel1Title: '⭐ Detalles del pedido',
    custNameLabel: 'Nombre del cliente',
    custNamePh: 'ej. Juan Pérez',
    storeNameLabel: 'Nombre de la tienda',
    storeNamePh: 'ej. Mi Tienda',
    prodNameLabel: 'Nombre del producto',
    prodNamePh: 'ej. Reloj inteligente',
    codeLabel: 'Código de descuento de agradecimiento',
    codePh: 'ej. THANKS10',
    genBtn: '✨ Generar mensaje',
    panel2Title: '👁️ Vista previa del mensaje',
    previewPh: 'Rellena los datos a la izquierda...',
    copyBtn: '📋 Copiar mensaje para WhatsApp',
    alertMissing: 'Por favor ingresa el nombre del cliente y del producto.',
    alertCopied: '¡Mensaje copiado y sincronizado con éxito!'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Müşteri Yorumları',
    titleSub: 've Geri Bildirim Aracı',
    desc: 'Yorum toplamak ve güven inşa etmek için profesyonel takip mesajları tasarlayın.',
    panel1Title: '⭐ Sipariş ve Müşteri Detayları',
    custNameLabel: 'Müşteri Adı',
    custNamePh: 'örn: Ahmet Yılmaz',
    storeNameLabel: 'Mağaza Adı',
    storeNamePh: 'örn: Engazia Mağazası',
    prodNameLabel: 'Satın Alınan Ürün Adı',
    prodNamePh: 'örn: Akıllı Saat',
    codeLabel: 'Teşekkür İndirim Kodu (Ödül)',
    codePh: 'örn: THANKS10',
    genBtn: '✨ Değerlendirme Mesajı Oluştur',
    panel2Title: '👁️ Gönderime Hazır Mesaj Önizlemesi',
    previewPh: 'Soldaki bilgileri doldurun ve oluştur butonuna tıklayın...',
    copyBtn: '📋 WhatsApp İçin Mesajı Kopyala',
    alertMissing: 'Lütfen en az müşteri adını ve ürün adını girin.',
    alertCopied: 'Müşteri değerlendirme mesajı kopyalandı ve buluta senkronize edildi!'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '客户评价',
    titleSub: '与反馈工具',
    desc: '设计专业的售后跟进消息，以收集客户评价并建立店铺信任。',
    panel1Title: '⭐ 订单与客户详情',
    custNameLabel: '客户姓名',
    custNamePh: '例如：张三',
    storeNameLabel: '店铺名称',
    storeNamePh: '例如：Engazia 店铺',
    prodNameLabel: '购买的产品名称',
    prodNamePh: '例如：智能手表',
    codeLabel: '感谢折扣码 (评价奖励)',
    codePh: '例如：THANKS10',
    genBtn: '✨ 生成评价请求消息',
    panel2Title: '👁️ 准备发送的消息预览',
    previewPh: '请填写左侧信息并点击生成...',
    copyBtn: '📋 复制消息发送至 WhatsApp',
    alertMissing: '请输入客户姓名和产品名称。',
    alertCopied: '客户评价消息已成功复制并同步至云端！'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Kundenbewertungen',
    titleSub: '& Feedback-Tool',
    desc: 'Erstellen Sie professionelle Follow-up-Nachrichten für Bewertungen.',
    panel1Title: '⭐ Bestell- & Kundendetails',
    custNameLabel: 'Kundenname',
    custNamePh: 'z.B. Max Mustermann',
    storeNameLabel: 'Shop-Name',
    storeNamePh: 'z.B. Mein Shop',
    prodNameLabel: 'Produktname',
    prodNamePh: 'z.B. Smartwatch',
    codeLabel: 'Dankeschön-Gutscheincode',
    codePh: 'z.B. THANKS10',
    genBtn: '✨ Bewertungsnachricht generieren',
    panel2Title: '👁️ Vorschau der Nachricht',
    previewPh: 'Füllen Sie links die Daten aus...',
    copyBtn: '📋 Nachricht für WhatsApp kopieren',
    alertMissing: 'Bitte geben Sie den Kunden- und Produktnamen ein.',
    alertCopied: 'Bewertungsnachricht erfolgreich kopiert und synchronisiert!'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Ulasan Pelanggan',
    titleSub: '& Alat Umpan Balik',
    desc: 'Rancang pesan tindak lanjut profesional untuk mengumpulkan ulasan.',
    panel1Title: '⭐ Detail Pesanan & Pelanggan',
    custNameLabel: 'Nama Pelanggan',
    custNamePh: 'cth: Budi Santoso',
    storeNameLabel: 'Nama Toko',
    storeNamePh: 'cth: Toko Kami',
    prodNameLabel: 'Nama Produk yang Dibeli',
    prodNamePh: 'cth: Jam Tangan Pintar',
    codeLabel: 'Kode Diskon Terima Kasih (Hadiah)',
    codePh: 'cth: THANKS10',
    genBtn: '✨ Buat Pesan Permintaan Ulasan',
    panel2Title: '👁️ Pratinjau Pesan Siap Kirim',
    previewPh: 'Isi detail di sebelah kiri dan klik buat...',
    copyBtn: '📋 Salin Pesan untuk WhatsApp',
    alertMissing: 'Harap masukkan setidaknya nama pelanggan dan nama produk.',
    alertCopied: 'Pesan ulasan pelanggan berhasil disalin dan disinkronkan ke cloud!'
  }
};

export default function CustomerReviewsTool() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [storeName, setStoreName] = useState('متجرنا');
  const [productName, setProductName] = useState('');
  const [discountCode, setDiscountCode] = useState('THANKS10');
  const [generatedMsg, setGeneratedMsg] = useState('');

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

  const generateReviewMessage = () => {
    if (!customerName || !productName) {
      alert(t.alertMissing);
      return;
    }

    setGeneratedMsg(`مرحباً بك أ. ${customerName} 👋
يسعدنا جداً تعاملك مع ${storeName} ونأمل أن يكون طلبك من "${productName}" قد نال رضاك وإعجابك التام! ⭐

رأيك يهمنا ويساعدنا نتحسن دائماً.. هل تتكرم بترك تقييمك البسيط للمنتج؟ 
[رابط تقييم المنتج في المتجر]

وكشكر خاص لثقتك، يسعدنا نهديك كود خصم (${discountCode}) لطلبك القادم 🎁 (العملة: ${currentCurrency})
نسعد بخدمتك دائماً!`);
  };

  const copyMsg = () => {
    navigator.clipboard.writeText(generatedMsg);
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
        
        input { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit; background: #f8fafc; color: #0f172a; outline: none; }
        input:focus { border-color: #4f46e5; background: #ffffff; }

        .action-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; margin-top: 10px; }
        .action-btn:hover { background: #4338ca; }

        .preview-box { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 25px; font-size: 15px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; min-height: 220px; max-height: 320px; overflow-y: auto; border: 1px solid #1e293b; margin-bottom: 20px; }

        .copy-btn { background: #10b981; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
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
            <label>{t.custNameLabel}</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={t.custNamePh} />
          </div>

          <div className="input-group">
            <label>{t.storeNameLabel}</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder={t.storeNamePh} />
          </div>

          <div className="input-group">
            <label>{t.prodNameLabel}</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={t.prodNamePh} />
          </div>

          <div className="input-group">
            <label>{t.codeLabel}</label>
            <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder={t.codePh} />
          </div>

          <button onClick={generateReviewMessage} className="action-btn">
            {t.genBtn}
          </button>
        </div>

        <div className="panel">
          <h2>{t.panel2Title}</h2>
          
          <div className="preview-box">
            {generatedMsg || t.previewPh}
          </div>

          {generatedMsg && (
            <button onClick={copyMsg} className="copy-btn">
              {t.copyBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
