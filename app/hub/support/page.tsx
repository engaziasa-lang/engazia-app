'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة قوالب ردود خدمة العملاء
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'قوالب ردود',
    titleSub: 'خدمة العملاء السريعة',
    desc: 'ردود جاهزة واحترافية لأسئلة العملاء اليومية عبر الواتساب لتوفير وقتك وزيادة سرعة الرد.',
    panel1Title: '⚙️ إعدادات الردود',
    storeNameLabel: 'اسم المتجر',
    shippingDaysLabel: 'مدة الشحن الاعتيادية',
    selectCatTitle: 'اختر التصنيف:',
    catShipping: '📦 الاستفسار عن الشحن والتوصيل',
    catPayment: '💳 طرق ووسائل الدفع المتاحة',
    catIssues: '⚠️ معالجة الشكاوي أو استرجاع المنتجات',
    catGreeting: '👋 رسالة الترحيب والبدء',
    panel2Title: '👁️ الرد الجاهز للنسخ',
    copyBtn: '📋 نسخ الرد للواتساب',
    alertCopied: 'تم نسخ الرد الجاهز بنجاح ومزامنته سحابياً!'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Customer Support',
    titleSub: 'Quick Response Templates',
    desc: 'Professional ready-made responses for daily customer inquiries via WhatsApp.',
    panel1Title: '⚙️ Response Settings',
    storeNameLabel: 'Store Name',
    shippingDaysLabel: 'Standard Shipping Time',
    selectCatTitle: 'Select Category:',
    catShipping: '📦 Shipping & Delivery Inquiry',
    catPayment: '💳 Available Payment Methods',
    catIssues: '⚠️ Handling Complaints or Returns',
    catGreeting: '👋 Greeting & Welcome Message',
    panel2Title: '👁️ Ready-to-Copy Response',
    copyBtn: '📋 Copy Response for WhatsApp',
    alertCopied: 'Response copied and synced to cloud successfully!'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Modèles de réponses',
    titleSub: 'service client',
    desc: 'Réponses professionnelles prêtes à l’emploi pour WhatsApp.',
    panel1Title: '⚙️ Paramètres',
    storeNameLabel: 'Nom de la boutique',
    shippingDaysLabel: 'Délai de livraison',
    selectCatTitle: 'Sélectionnez la catégorie :',
    catShipping: '📦 Suivi de livraison',
    catPayment: '💳 Modes de paiement',
    catIssues: '📦 Gestion des réclamations',
    catGreeting: '👋 Message de bienvenue',
    panel2Title: '👁️ Aperçu de la réponse',
    copyBtn: '📋 Copier la réponse',
    alertCopied: 'Réponse copiée et synchronisée avec succès !'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Plantillas de atención',
    titleSub: 'al cliente',
    desc: 'Respuestas profesionales listas para consultas diarias por WhatsApp.',
    panel1Title: '⚙️ Configuración',
    storeNameLabel: 'Nombre de la tienda',
    shippingDaysLabel: 'Tiempo de envío estándar',
    selectCatTitle: 'Selecciona la categoría:',
    catShipping: '📦 Consulta de envío y entrega',
    catPayment: '💳 Métodos de pago disponibles',
    catIssues: '⚠️ Gestión de reclamos o devoluciones',
    catGreeting: '👋 Mensaje de bienvenida',
    panel2Title: '👁️ Respuesta lista para copiar',
    copyBtn: '📋 Copiar respuesta para WhatsApp',
    alertCopied: '¡Respuesta copiada y sincronizada con éxito!'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Müşteri Hizmetleri',
    titleSub: 'Hızlı Yanıt Şablonları',
    desc: 'WhatsApp üzerinden günlük müşteri soruları için profesyonel hazır yanıtlar.',
    panel1Title: '⚙️️ Yanıt Ayarları',
    storeNameLabel: 'Mağaza Adı',
    shippingDaysLabel: 'Standart Kargo Süresi',
    selectCatTitle: 'Kategori Seçin:',
    catShipping: '📦 Kargo ve Teslimat Sorgusu',
    catPayment: '💳 Mevcut Ödeme Yöntemleri',
    catIssues: '⚠️ Şikayet veya İade Yönetimi',
    catGreeting: '👋 Karşılama ve Hoş Geldiniz Mesajı',
    panel2Title: '👁️ Kopyalanmaya Hazır Yanıt',
    copyBtn: '📋 WhatsApp İçin Yanıtı Kopyala',
    alertCopied: 'Yanıt kopyalandı ve buluta senkronize edildi!'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '客服快捷回复',
    titleSub: '模板工具',
    desc: '为 WhatsApp 上的日常客户咨询提供专业、现成的回复模版，提升效率。',
    panel1Title: '⚙️ 回复设置',
    storeNameLabel: '店铺名称',
    shippingDaysLabel: '标准配送时间',
    selectCatTitle: '选择分类：',
    catShipping: '📦 运输与配送咨询',
    catPayment: '💳 可用支付方式',
    catIssues: '⚠️ 处理投诉或退货',
    catGreeting: '👋 欢迎与问候消息',
    panel2Title: '👁️ 准备复制的回复',
    copyBtn: '📋 复制回复发送至 WhatsApp',
    alertCopied: '回复内容已成功复制并同步至云端！'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Kundenservice-',
    titleSub: 'Schnellantwort-Vorlagen',
    desc: 'Professionelle vorgefertigte Antworten für WhatsApp-Anfragen.',
    panel1Title: '⚙️ Einstellungen',
    storeNameLabel: 'Shop-Name',
    shippingDaysLabel: 'Standard-Lieferzeit',
    selectCatTitle: 'Kategorie auswählen:',
    catShipping: '📦 Versand- und Lieferanfrage',
    catPayment: '💳 Verfügbare Zahlungsmethoden',
    catIssues: '⚠️ Beschwerden oder Retouren',
    catGreeting: '👋 Begrüßungsnachricht',
    panel2Title: '👁️ Bereite Antwort',
    copyBtn: '📋 Antwort für WhatsApp kopieren',
    alertCopied: 'Antwort erfolgreich kopiert und synchronisiert!'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Templat Respon',
    titleSub: 'Layanan Pelanggan Cepat',
    desc: 'Respons siap pakai profesional untuk pertanyaan pelanggan harian via WhatsApp.',
    panel1Title: '⚙️ Pengaturan Respon',
    storeNameLabel: 'Nama Toko',
    shippingDaysLabel: 'Waktu Pengiriman Standar',
    selectCatTitle: 'Pilih Kategori:',
    catShipping: '📦 Pertanyaan Pengiriman',
    catPayment: '💳 Metode Pembayaran Tersedia',
    catIssues: '⚠️ Penanganan Komplain atau Retur',
    catGreeting: '👋 Pesan Sambutan & Selamat Datang',
    panel2Title: '👁️ Respon Siap Salin',
    copyBtn: '📋 Salin Respon untuk WhatsApp',
    alertCopied: 'Respon berhasil disalin dan disinkronkan ke cloud!'
  }
};

export default function SupportTemplatesTool() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [storeName, setStoreName] = useState('متجرنا');
  const [shippingDays, setShippingDays] = useState('2 إلى 4 أيام عمل');
  const [selectedCategory, setSelectedCategory] = useState<'shipping' | 'payment' | 'issues' | 'greeting'>('shipping');

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

  const templates = {
    shipping: `أهلاً بك يا غالي في ${storeName} 🌟
مدة الشحن والتوصيل تستغرق عادة من ${shippingDays} حسب المدينة، وسيتم إرسال رابط التتبع فور خروج الشحنة مع شركة الشحن. نسعد بخدمتك! 📦`,
    
    payment: `حياك الله! 💳 (العملة المعتمدة: ${currentCurrency})
نعم، نوفر وسائل دفع متعددة وآمنة بالكامل:
- شبكة مدى Mada
- بطاقات ائتمانية (فيزا / ماستركارد)
- خدمة الدفع على دفعات (تابي / تمارا)
- والدفع عند الاستلام (حسب المنطقة).`,

    issues: `نعتذر منك جداً عن هذا الإشكال وصادق الحرص على رضاتك 🤍
الرجاء تزويدنا برقم الطلب وتصوير المشكلة أو المنتج، وفريق الدعم سيعالج طلبك ويقوم بالتعويض أو الاستبدال فوراً خلال ساعات.`,

    greeting: `أهلاً بك في ${storeName}، كيف يمكننا مساعدتك اليوم؟ نسعد بخدمتك والإجابة عن كافة استفساراتك بكل وقت ✨`
  };

  const copyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
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

        .category-list { display: flex; flex-direction: column; gap: 10px; }
        .cat-btn { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 12px 15px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: start; cursor: pointer; transition: all 0.2s; }
        .cat-btn.active { background: #4f46e5; color: #ffffff; border-color: #4f46e5; }

        .preview-box { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 25px; font-size: 15px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; min-height: 200px; border: 1px solid #1e293b; margin-bottom: 20px; }

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
            <label>{t.storeNameLabel}</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>{t.shippingDaysLabel}</label>
            <input type="text" value={shippingDays} onChange={(e) => setShippingDays(e.target.value)} />
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '20px 0 10px', color: '#1e293b' }}>{t.selectCatTitle}</h3>
          <div className="category-list">
            <button className={`cat-btn ${selectedCategory === 'shipping' ? 'active' : ''}`} onClick={() => setSelectedCategory('shipping')}>
              {t.catShipping}
            </button>
            <button className={`cat-btn ${selectedCategory === 'payment' ? 'active' : ''}`} onClick={() => setSelectedCategory('payment')}>
              {t.catPayment}
            </button>
            <button className={`cat-btn ${selectedCategory === 'issues' ? 'active' : ''}`} onClick={() => setSelectedCategory('issues')}>
              {t.catIssues}
            </button>
            <button className={`cat-btn ${selectedCategory === 'greeting' ? 'active' : ''}`} onClick={() => setSelectedCategory('greeting')}>
              {t.catGreeting}
            </button>
          </div>
        </div>

        <div className="panel">
          <h2>{t.panel2Title}</h2>
          
          <div className="preview-box">
            {templates[selectedCategory]}
          </div>

          <button onClick={() => copyTemplate(templates[selectedCategory])} className="copy-btn">
            {t.copyBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
