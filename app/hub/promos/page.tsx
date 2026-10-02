'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة ممول وأكواد الخصم
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'ممول وأكواد',
    titleSub: 'خصم المتاجر',
    desc: 'أنشئ أكواد خصم جذابة، واضبط قيمتها بدقة لزيادة المبيعات وتحفيز العملاء المترددين.',
    panel1Title: '🎟️ إعدادات كود الخصم',
    codeLabel: 'رمز الكود (Promo Code)',
    randBtn: 'توليد عشوائي',
    origPriceLabel: 'سعر المنتج الأصلي',
    discTypeLabel: 'نوع الخصم',
    percentOpt: 'نسبة مئوية (%)',
    fixedOpt: 'مبلغ ثابت',
    discValLabel: 'قيمة الخصم',
    panel2Title: '📊 نتائج وتأثير الكود',
    finalPriceLabel: 'السعر بعد الخصم للعميل',
    savedValLabel: 'قيمة التخفيض الموفرة للعميل',
    shareCodeLabel: 'الكود الجاهز للمشاركة:',
    copyBtn: '📋 نسخ كود الخصم',
    alertCopied: 'تم نسخ كود الخصم ({code}) بنجاح ومزامنته سحابياً!'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Discount Promos',
    titleSub: 'Manager',
    desc: 'Create attractive promo codes and adjust their values to boost sales and convert hesitant customers.',
    panel1Title: '🎟️ Promo Code Settings',
    codeLabel: 'Promo Code',
    randBtn: 'Randomize',
    origPriceLabel: 'Original Product Price',
    discTypeLabel: 'Discount Type',
    percentOpt: 'Percentage (%)',
    fixedOpt: 'Fixed Amount',
    discValLabel: 'Discount Value',
    panel2Title: '📊 Results & Impact',
    finalPriceLabel: 'Customer Price After Discount',
    savedValLabel: 'Amount Saved for Customer',
    shareCodeLabel: 'Ready-to-Share Code:',
    copyBtn: '📋 Copy Promo Code',
    alertCopied: 'Promo code ({code}) copied and synced to cloud successfully!'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Gestionnaire de codes',
    titleSub: 'promo',
    desc: 'Créez des codes promo attractifs pour stimuler vos ventes.',
    panel1Title: '🎟️ Paramètres du code',
    codeLabel: 'Code promo',
    randBtn: 'Aléatoire',
    origPriceLabel: 'Prix original',
    discTypeLabel: 'Type de remise',
    percentOpt: 'Pourcentage (%)',
    fixedOpt: 'Montant fixe',
    discValLabel: 'Valeur de la remise',
    panel2Title: '📊 Résultats et impact',
    finalPriceLabel: 'Prix final client',
    savedValLabel: 'Montant économisé',
    shareCodeLabel: 'Code à partager :',
    copyBtn: '📋 Copier le code',
    alertCopied: 'Code promo ({code}) copié avec succès !'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Gestor de códigos',
    titleSub: 'promocionales',
    desc: 'Crea códigos de descuento atractivos para aumentar las ventas.',
    panel1Title: '🎟️ Configuración del código',
    codeLabel: 'Código promocional',
    randBtn: 'Aleatorio',
    origPriceLabel: 'Precio original',
    discTypeLabel: 'Tipo de descuento',
    percentOpt: 'Porcentaje (%)',
    fixedOpt: 'Monto fijo',
    discValLabel: 'Valor del descuento',
    panel2Title: '📊 Resultados e impacto',
    finalPriceLabel: 'Precio final para el cliente',
    savedValLabel: 'Ahorro para el cliente',
    shareCodeLabel: 'Código listo para compartir:',
    copyBtn: '📋 Copiar código',
    alertCopied: '¡Código promo ({code}) copiado con éxito!'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'İndirim Kuponu',
    titleSub: 'Yöneticisi',
    desc: 'Satışları artırmak ve kararsız müşterileri çekmek için cazip kuponlar oluşturun.',
    panel1Title: '🎟️ İndirim Kodu Ayarları',
    codeLabel: 'Kupon Kodu (Promo Code)',
    randBtn: 'Rastgele Üret',
    origPriceLabel: 'Orijinal Ürün Fiyatı',
    discTypeLabel: 'İndirim Türü',
    percentOpt: 'Yüzde (%)',
    fixedOpt: 'Sabit Tutar',
    discValLabel: 'İndirim Değeri',
    panel2Title: '📊 Sonuçlar ve Etki',
    finalPriceLabel: 'İndirim Sonrası Müşteri Fiyatı',
    savedValLabel: 'Müşterinin Tasarrufu',
    shareCodeLabel: 'Paylaşılmaya Hazır Kod:',
    copyBtn: '📋 Kupon Kodu Kopyala',
    alertCopied: 'İndirim kodu ({code}) kopyalandı ve buluta senkronize edildi!'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '优惠码',
    titleSub: '管理器',
    desc: '创建极具吸引力的优惠码，精准设置折扣力度以刺激犹豫不决的客户。',
    panel1Title: '🎟️ 优惠码设置',
    codeLabel: '优惠码 (Promo Code)',
    randBtn: '随机生成',
    origPriceLabel: '产品原价',
    discTypeLabel: '折扣类型',
    percentOpt: '百分比 (%)',
    fixedOpt: '固定金额',
    discValLabel: '折扣额度',
    panel2Title: '📊 结果与影响',
    finalPriceLabel: '折后客户购买价',
    savedValLabel: '为客户节省的金额',
    shareCodeLabel: '准备分享的优惠码:',
    copyBtn: '📋 复制优惠码',
    alertCopied: '优惠码 ({code}) 已成功复制并同步至云端！'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Gutschein-',
    titleSub: 'und Rabatt-Manager',
    desc: 'Erstellen Sie attraktive Rabattcodes zur Umsatzsteigerung.',
    panel1Title: '🎟️ Gutscheineinstellungen',
    codeLabel: 'Gutscheincode',
    randBtn: 'Zufällig',
    origPriceLabel: 'Ursprünglicher Preis',
    discTypeLabel: 'Rabatttyp',
    percentOpt: 'Prozentsatz (%)',
    fixedOpt: 'Fester Betrag',
    discValLabel: 'Rabattwert',
    panel2Title: '📊 Ergebnisse & Wirkung',
    finalPriceLabel: 'Endpreis für Kunden',
    savedValLabel: 'Ersparnis für Kunden',
    shareCodeLabel: 'Bereiter Code:',
    copyBtn: '📋 Gutscheincode kopieren',
    alertCopied: 'Gutscheincode ({code}) erfolgreich kopiert und synchronisiert!'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Manajer Promo',
    titleSub: '& Diskon Toko',
    desc: 'Buat kode diskon menarik untuk tingkatkan penjualan dan pengikut.',
    panel1Title: '🎟️ Pengaturan Kode Promo',
    codeLabel: 'Kode Promo',
    randBtn: 'Acak',
    origPriceLabel: 'Harga Produk Asli',
    discTypeLabel: 'Jenis Diskon',
    percentOpt: 'Persentase (%)',
    fixedOpt: 'Jumlah Tetap',
    discValLabel: 'Nilai Diskon',
    panel2Title: '📊 Hasil & Dampak',
    finalPriceLabel: 'Harga Setelah Diskon',
    savedValLabel: 'Jumlah Penghematan Pelanggan',
    shareCodeLabel: 'Kode Siap Dibagikan:',
    copyBtn: '📋 Salin Kode Promo',
    alertCopied: 'Kode promo ({code}) berhasil disalin dan disinkronkan ke cloud!'
  }
};

export default function PromosManager() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [originalPrice, setOriginalPrice] = useState<number>(300);
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [promoCode, setPromoCode] = useState('ENGAZIA15');

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

  const discountAmount = discountType === 'percent' 
    ? (originalPrice * (discountValue / 100)) 
    : discountValue;
  
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SALE';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPromoCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(promoCode);
    alert(t.alertCopied.replace('{code}', promoCode));
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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #4f46e5; background: #ffffff; }

        .action-btn { background: #e0e7ff; color: #4f46e5; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; font-size: 13px; margin-top: 8px; }
        .action-btn:hover { background: #c7d2fe; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .highlight .result-label { color: #ffffff; }
        
        .result-value { font-size: 22px; font-weight: 900; color: #ffffff; }
        .result-value span { font-size: 14px; font-weight: 500; opacity: 0.7; margin-right: 5px; }

        .copy-code-btn { background: #10b981; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 15px; }
        .copy-code-btn:hover { background: #059669; }

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
            <label>{t.codeLabel}</label>
            <div className="input-wrapper" style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} style={{ flex: 1 }} />
              <button onClick={generateRandomCode} className="action-btn" style={{ margin: 0 }}>{t.randBtn}</button>
            </div>
          </div>

          <div className="input-group">
            <label>{t.origPriceLabel} ({currentCurrency})</label>
            <div className="input-wrapper">
              <input type="number" value={originalPrice || ''} onChange={(e) => setOriginalPrice(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label>{t.discTypeLabel}</label>
              <div className="input-wrapper">
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)}>
                  <option value="percent">{t.percentOpt}</option>
                  <option value="fixed">{t.fixedOpt} ({currentCurrency})</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>{t.discValLabel}</label>
              <div className="input-wrapper">
                <input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} />
              </div>
            </div>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>{t.panel2Title}</h2>

          <div className="result-box highlight">
            <span className="result-label">{t.finalPriceLabel}</span>
            <span className="result-value" dir="ltr">{finalPrice.toFixed(2)} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.savedValLabel}</span>
            <span className="result-value" style={{ color: '#86efac' }} dir="ltr">{discountAmount.toFixed(2)} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box" style={{ background: '#1e293b', borderColor: '#334155', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <span className="result-label">{t.shareCodeLabel}</span>
            <span style={{ fontSize: '20px', fontWeight: '900', color: '#818cf8', letterSpacing: '1px' }}>{promoCode}</span>
          </div>

          <button onClick={copyCode} className="copy-code-btn">
            {t.copyBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
