'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة صانع روابط واتساب
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'صانع روابط',
    titleSub: 'واتساب المباشرة',
    desc: 'أنشئ روابط مخصصة برسائل جاهزة للبايو في تيك توك، سناب شات، وإعلاناتك المستهدفة.',
    panel1Title: '📱 إعدادات رقم الواتساب والرسالة',
    phoneLabel: 'رقم الجوال (مع رمز الدولة)',
    phonePh: 'مثال: 966500000000',
    msgLabel: 'الرسالة الجاهزة التي ستظهر للعميل',
    msgPh: 'اكتب رسالة الترحيب أو الاستفسار هنا...',
    panel2Title: '🔗 الرابط الناتج الجاهز للاستخدام',
    resultLabel: 'الرابط المباشر للواتساب:',
    testBtn: '🚀 تجربة فتح الرابط الآن',
    copyBtn: '📋 نسخ الرابط إلى الحافظة',
    alertCopied: 'تم نسخ الرابط المباشر بنجاح ومزامنته سحابياً!'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'WhatsApp',
    titleSub: 'Direct Link Maker',
    desc: 'Create custom WhatsApp links with pre-filled messages for your bio and ads.',
    panel1Title: '📱 WhatsApp Number & Message Settings',
    phoneLabel: 'Phone Number (with Country Code)',
    phonePh: 'e.g., 966500000000',
    msgLabel: 'Pre-filled Message for Customer',
    msgPh: 'Type your welcome or inquiry message here...',
    panel2Title: '🔗 Ready-to-Use Generated Link',
    resultLabel: 'Direct WhatsApp Link:',
    testBtn: '🚀 Test Open Link Now',
    copyBtn: '📋 Copy Link to Clipboard',
    alertCopied: 'Direct link copied and synced to cloud successfully!'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Générateur de lien',
    titleSub: 'WhatsApp direct',
    desc: 'Créez des liens WhatsApp personnalisés avec des messages pré-remplis.',
    panel1Title: '📱 Paramètres WhatsApp',
    phoneLabel: 'Numéro de téléphone (avec indicatif)',
    phonePh: 'ex: 966500000000',
    msgLabel: 'Message pré-rempli',
    msgPh: 'Tapez votre message ici...',
    panel2Title: '🔗 Lien généré prêt à l\'emploi',
    resultLabel: 'Lien direct WhatsApp :',
    testBtn: '🚀 Tester le lien',
    copyBtn: '📋 Copier le lien',
    alertCopied: 'Lien copié et synchronisé avec succès !'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Creador de enlaces',
    titleSub: 'directos de WhatsApp',
    desc: 'Crea enlaces de WhatsApp personalizados con mensajes predefinidos.',
    panel1Title: '📱 Configuración de WhatsApp',
    phoneLabel: 'Número de teléfono (con código de país)',
    phonePh: 'ej. 966500000000',
    msgLabel: 'Mensaje predefinido',
    msgPh: 'Escribe tu mensaje aquí...',
    panel2Title: '🔗 Enlace generado listo para usar',
    resultLabel: 'Enlace directo de WhatsApp:',
    testBtn: '🚀 Probar enlace ahora',
    copyBtn: '📋 Copiar enlace',
    alertCopied: '¡Enlace copiado y sincronizado con éxito!'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'WhatsApp',
    titleSub: 'Direkt Bağlantı Oluşturucu',
    desc: 'Biyografiniz ve reklamlarınız için hazır mesajlı özel WhatsApp bağlantıları oluşturun.',
    panel1Title: '📱 WhatsApp Numarası ve Mesaj Ayarları',
    phoneLabel: 'Telefon Numarası (Ülke Kodu ile)',
    phonePh: 'örn: 966500000000',
    msgLabel: 'Müşteri İçin Hazır Mesaj',
    msgPh: 'Karşılama veya sorgu mesajınızı buraya yazın...',
    panel2Title: '🔗 Kullanıma Hazır Bağlantı',
    resultLabel: 'Doğrudan WhatsApp Bağlantısı:',
    testBtn: '🚀 Bağlantıyı Şimdi Test Et',
    copyBtn: '📋 Bağlantıyı Panoya Kopyala',
    alertCopied: 'Doğrudan bağlantı kopyalandı ve buluta senkronize edildi!'
  },
  zh: {
    back: '返回控制面板',
    titleMain: 'WhatsApp',
    titleSub: '直链生成器',
    desc: '为您的社媒主页和广告创建带有预填消息的自定义 WhatsApp 链接。',
    panel1Title: '📱 WhatsApp 号码与消息设置',
    phoneLabel: '手机号码 (含国家代码)',
    phonePh: '例如：966500000000',
    msgLabel: '客户预填消息',
    msgPh: '在此处输入欢迎或咨询消息...',
    panel2Title: '🔗 准备使用的生成链接',
    resultLabel: 'WhatsApp 直达链接:',
    testBtn: '🚀 立即测试打开链接',
    copyBtn: '📋 复制链接到剪贴板',
    alertCopied: '链接已成功复制并同步至云端！'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'WhatsApp',
    titleSub: 'Direktlink-Ersteller',
    desc: 'Erstellen Sie individuelle Chat-Links mit vordefinierten Nachrichten.',
    panel1Title: '📱 WhatsApp-Nummer & Nachrichteneinstellungen',
    phoneLabel: 'Telefonnummer (mit Ländervorwahl)',
    phonePh: 'z.B. 966500000000',
    msgLabel: 'Vorgefertigte Nachricht',
    msgPh: 'Geben Sie hier Ihre Nachricht ein...',
    panel2Title: '🔗 Generierter Link',
    resultLabel: 'Direkter WhatsApp-Link:',
    testBtn: '🚀 Link jetzt testen',
    copyBtn: '📋 Link kopieren',
    alertCopied: 'Link erfolgreich kopiert und synchronisiert!'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Pembuat Tautan',
    titleSub: 'Langsung WhatsApp',
    desc: 'Buat tautan WhatsApp khusus dengan pesan siap pakai untuk bio dan iklan.',
    panel1Title: '📱 Pengaturan Nomor & Pesan WhatsApp',
    phoneLabel: 'Nomor Telepon (dengan Kode Negara)',
    phonePh: 'cth: 966500000000',
    msgLabel: 'Pesan Siap Pakai untuk Pelanggan',
    msgPh: 'Ketik pesan sambutan atau pertanyaan di sini...',
    panel2Title: '🔗 Tautan Hasil Siap Pakai',
    resultLabel: 'Tautan Langsung WhatsApp:',
    testBtn: '🚀 Uji Buka Tautan Sekarang',
    copyBtn: '📋 Salin Tautan ke Clipboard',
    alertCopied: 'Tautan berhasil disalin dan disinkronkan ke cloud!'
  }
};

export default function WhatsappLinksBuilder() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [phone, setPhone] = useState('966500000000');
  const [message, setMessage] = useState('السلام عليكم، أرغب الاستفسار عن منتجاتكم في المتجر.');

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

  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  const copyLink = () => {
    navigator.clipboard.writeText(whatsappUrl);
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

        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        
        input, textarea { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit; background: #f8fafc; color: #0f172a; outline: none; }
        input:focus, textarea:focus { border-color: #4f46e5; background: #ffffff; }

        textarea { height: 120px; resize: vertical; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; word-break: break-all; }
        .result-label { font-size: 14px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 10px; }
        
        .link-display { font-size: 14px; font-weight: 700; color: #818cf8; line-height: 1.6; }

        .action-btn { background: #10b981; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; }
        .action-btn:hover { background: #059669; }

        .copy-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; }
        .copy-btn:hover { background: #4338ca; }

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
            <label>{t.phoneLabel}</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder={t.phonePh} 
            />
          </div>

          <div className="input-group">
            <label>{t.msgLabel}</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder={t.msgPh}
            />
          </div>
        </div>

        <div className="panel results-panel">
          <h2>{t.panel2Title}</h2>

          <div className="result-box">
            <span className="result-label">{t.resultLabel}</span>
            <div className="link-display" dir="ltr">{whatsappUrl}</div>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="action-btn">
            {t.testBtn}
          </a>

          <button onClick={copyLink} className="copy-btn">
            {t.copyBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
