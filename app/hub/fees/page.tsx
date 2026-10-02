'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة حاسبة بوابات الدفع
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'حاسبة رسوم',
    titleSub: 'بوابات الدفع',
    desc: 'احسب بدقة المبالغ المقتطعة بواسطة بوابات الدفع (مدى، فيزا، تابي) وتأثيرها على حسابات متجرك.',
    panel1Title: '💳 إعدادات العملية وبوابة الدفع',
    orderAmountLabel: 'قيمة طلب العميل الإجمالية',
    gatewayLabel: 'اختر بوابة الدفع',
    madaOpt: 'مدى Mada (تقديري: ~1%)',
    visaOpt: 'فيزا / ماستركارد Visa/Mastercard (تقديري: ~2.5%)',
    tabbyOpt: 'تابي / تمارا - الشراء لاحقاً (تقديري: ~4.5%)',
    customOpt: 'بوابة مخصصة (أدخل النسبة يدوياً)',
    percentLabel: 'النسبة (%)',
    fixedLabel: 'الرسوم الثابتة',
    vatLabel: 'احتساب ضريبة القيمة المضافة (15%) على رسوم البوابة',
    panel2Title: '📊 صافي ما سيصل لحسابك',
    netReceived: 'المبلغ الصافي المحول لحسابك',
    totalDeduction: 'إجمالي اقتطاعات البوابة والرسوم',
    breakdownLabel: 'الرسوم الأساسية + الضريبة على الرسوم'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Payment Gateway',
    titleSub: 'Fees Calculator',
    desc: 'Calculate exact gateway deduction fees (Mada, Visa, Tabby) and their impact.',
    panel1Title: '💳 Transaction & Gateway Settings',
    orderAmountLabel: 'Total Order Amount',
    gatewayLabel: 'Select Payment Gateway',
    madaOpt: 'Mada (~1%)',
    visaOpt: 'Visa / Mastercard (~2.5%)',
    tabbyOpt: 'Tabby / Tamara (~4.5%)',
    customOpt: 'Custom Gateway (Enter manually)',
    percentLabel: 'Percentage (%)',
    fixedLabel: 'Fixed Fee',
    vatLabel: 'Include VAT (15%) on gateway fees',
    panel2Title: '📊 Net Amount You Receive',
    netReceived: 'Net Amount Transferred to Account',
    totalDeduction: 'Total Gateway Deductions & Fees',
    breakdownLabel: 'Base Fees + VAT on Fees'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Calculateur',
    titleSub: 'de frais de paiement',
    desc: 'Calculez avec précision les frais de passerelle de paiement.',
    panel1Title: '💳 Paramètres de transaction',
    orderAmountLabel: 'Montant total de la commande',
    gatewayLabel: 'Sélectionnez la passerelle',
    madaOpt: 'Mada (~1%)',
    visaOpt: 'Visa / Mastercard (~2.5%)',
    tabbyOpt: 'Tabby / Tamara (~4.5%)',
    customOpt: 'Passerelle personnalisée',
    percentLabel: 'Pourcentage (%)',
    fixedLabel: 'Frais fixes',
    vatLabel: 'Inclure la TVA (15%) sur les frais',
    panel2Title: '📊 Montant net reçu',
    netReceived: 'Montant net transféré',
    totalDeduction: 'Total des déductions',
    breakdownLabel: 'Frais de base + TVA'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Calculadora de comisiones',
    titleSub: 'de pasarelas de pago',
    desc: 'Calcula con precisión las deducciones de las pasarelas de pago.',
    panel1Title: '💳 Configuración de la transacción',
    orderAmountLabel: 'Monto total del pedido',
    gatewayLabel: 'Selecciona la pasarela',
    madaOpt: 'Mada (~1%)',
    visaOpt: 'Visa / Mastercard (~2.5%)',
    tabbyOpt: 'Tabby / Tamara (~4.5%)',
    customOpt: 'Pasarela personalizada',
    percentLabel: 'Porcentaje (%)',
    fixedLabel: 'Tarifa fija',
    vatLabel: 'Incluir IVA (15%) en las comisiones',
    panel2Title: '📊 Monto neto recibido',
    netReceived: 'Monto neto transferido',
    totalDeduction: 'Deducciones totales',
    breakdownLabel: 'Tarifas base + IVA'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Ödeme Ağ Geçidi',
    titleSub: 'Komisyon Hesaplayıcı',
    desc: 'Ödeme ağ geçidi kesintilerini (Mada, Visa, Tabby) tam olarak hesaplayın.',
    panel1Title: '💳 İşlem ve Ağ Geçidi Ayarları',
    orderAmountLabel: 'Toplam Sipariş Tutarı',
    gatewayLabel: 'Ödeme Ağ Geçidini Seçin',
    madaOpt: 'Mada (~1%)',
    visaOpt: 'Visa / Mastercard (~2.5%)',
    tabbyOpt: 'Tabby / Tamara (~4.5%)',
    customOpt: 'Özel Ağ Geçidi (Manuel)',
    percentLabel: 'Yüzde (%)',
    fixedLabel: 'Sabit Ücret',
    vatLabel: 'Komisyonlar üzerinden KDV (%15) hesapla',
    panel2Title: '📊 Hesabınıza Gelecek Net Tutar',
    netReceived: 'Hesabınıza Aktarılan Net Tutar',
    totalDeduction: 'Toplam Kesintiler ve Ücretler',
    breakdownLabel: 'Temel Ücretler + KDV'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '支付网关',
    titleSub: '手续费计算器',
    desc: '精准计算支付网关（Mada、Visa、Tabby等）扣除的手续费及其影响。',
    panel1Title: '💳 交易与网关设置',
    orderAmountLabel: '订单总金额',
    gatewayLabel: '选择支付网关',
    madaOpt: 'Mada (~1%)',
    visaOpt: 'Visa / Mastercard (~2.5%)',
    tabbyOpt: 'Tabby / Tamara (~4.5%)',
    customOpt: '自定义网关（手动输入）',
    percentLabel: '费率 (%)',
    fixedLabel: '固定费用',
    vatLabel: '在网关手续费中包含增值税 (15%)',
    panel2Title: '📊 实际到账净额',
    netReceived: '转入您账户的净额',
    totalDeduction: '网关扣除与总费用',
    breakdownLabel: '基础费用 + 费用增值税'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Zahlungs-Gateway',
    titleSub: 'Gebührenrechner',
    desc: 'Berechnen Sie exakt die Gebühren von Zahlungsgateways.',
    panel1Title: '💳 Transaktions- & Gateway-Einstellungen',
    orderAmountLabel: 'Gesamtbestellwert',
    gatewayLabel: 'Zahlungsgateway auswählen',
    madaOpt: 'Mada (~1%)',
    visaOpt: 'Visa / Mastercard (~2.5%)',
    tabbyOpt: 'Tabby / Tamara (~4.5%)',
    customOpt: 'Benutzerdefiniertes Gateway',
    percentLabel: 'Prozentsatz (%)',
    fixedLabel: 'Feste Gebühr',
    vatLabel: 'MwSt. (15%) auf Gebühren einbeziehen',
    panel2Title: '📊 Nettoauszahlung',
    netReceived: 'Nettobetrag auf Ihrem Konto',
    totalDeduction: 'Gesamtabzüge & Gebühren',
    breakdownLabel: 'Basisgebühren + MwSt.'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Kalkulator Biaya',
    titleSub: 'Gateway Pembayaran',
    desc: 'Hitung persis biaya pemotongan gateway pembayaran.',
    panel1Title: '💳 Pengaturan Transaksi & Gateway',
    orderAmountLabel: 'Total Nilai Pesanan',
    gatewayLabel: 'Pilih Gateway Pembayaran',
    madaOpt: 'Mada (~1%)',
    visaOpt: 'Visa / Mastercard (~2.5%)',
    tabbyOpt: 'Tabby / Tamara (~4.5%)',
    customOpt: 'Gateway Kustom (Manual)',
    percentLabel: 'Persentase (%)',
    fixedLabel: 'Biaya Tetap',
    vatLabel: 'Sertakan PPN (15%) pada biaya gateway',
    panel2Title: '📊 Jumlah Bersih yang Diterima',
    netReceived: 'Jumlah Bersih yang Ditransfer',
    totalDeduction: 'Total Potongan & Biaya Gateway',
    breakdownLabel: 'Biaya Dasar + PPN'
  }
};

export default function PaymentFeesCalculator() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [orderAmount, setOrderAmount] = useState<number>(250);
  const [gatewayName, setGatewayName] = useState<string>('mada');
  const [customPercent, setCustomPercent] = useState<number>(2.2);
  const [customFixed, setCustomFixed] = useState<number>(1);
  const [includeVatOnFees, setIncludeVatOnFees] = useState<boolean>(true);

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

  const getFeesConfig = () => {
    if (gatewayName === 'mada') return { p: 1.0, f: 1 };
    if (gatewayName === 'visa') return { p: 2.5, f: 1 };
    if (gatewayName === 'tabby') return { p: 4.5, f: 1 };
    return { p: customPercent, f: customFixed };
  };

  const config = getFeesConfig();

  const rawFee = (orderAmount * (config.p / 100)) + config.f;
  const vatOnFee = includeVatOnFees ? rawFee * 0.15 : 0;
  const totalGatewayDeduction = rawFee + vatOnFee;
  const netReceivedAmount = orderAmount - totalGatewayDeduction;

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
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 14px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #4f46e5; background: #ffffff; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .highlight .result-label { color: #ffffff; }
        
        .result-value { font-size: 22px; font-weight: 900; color: #ffffff; }
        .result-value span { font-size: 14px; font-weight: 500; opacity: 0.7; margin-right: 5px; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
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
            <label>{t.orderAmountLabel} ({currentCurrency})</label>
            <div className="input-wrapper">
              <input type="number" value={orderAmount || ''} onChange={(e) => setOrderAmount(Number(e.target.value))} />
            </div>
          </div>

          <div className="input-group">
            <label>{t.gatewayLabel}</label>
            <div className="input-wrapper">
              <select value={gatewayName} onChange={(e) => setGatewayName(e.target.value)}>
                <option value="mada">{t.madaOpt}</option>
                <option value="visa">{t.visaOpt}</option>
                <option value="tabby">{t.tabbyOpt}</option>
                <option value="custom">{t.customOpt}</option>
              </select>
            </div>
          </div>

          {gatewayName === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label>{t.percentLabel}</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" value={customPercent} onChange={(e) => setCustomPercent(Number(e.target.value))} />
                </div>
              </div>
              <div className="input-group">
                <label>{t.fixedLabel} ({currentCurrency})</label>
                <div className="input-wrapper">
                  <input type="number" value={customFixed} onChange={(e) => setCustomFixed(Number(e.target.value))} />
                </div>
              </div>
            </div>
          )}

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
            <input 
              type="checkbox" 
              id="vatCheck" 
              checked={includeVatOnFees} 
              onChange={(e) => setIncludeVatOnFees(e.target.checked)} 
              style={{ width: '20px', height: '20px', accentColor: '#4f46e5' }}
            />
            <label htmlFor="vatCheck" style={{ margin: 0, cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>
              {t.vatLabel}
            </label>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>{t.panel2Title}</h2>

          <div className="result-box highlight">
            <span className="result-label">{t.netReceived}</span>
            <span className="result-value" dir="ltr">{netReceivedAmount.toFixed(2)} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.totalDeduction}</span>
            <span className="result-value" style={{ color: '#fca5a5' }} dir="ltr">-{totalGatewayDeduction.toFixed(2)} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.breakdownLabel}</span>
            <span className="result-value" style={{ fontSize: '16px' }} dir="ltr">
              {rawFee.toFixed(2)} + {vatOnFee.toFixed(2)} {currentCurrency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
