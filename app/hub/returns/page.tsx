'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة تحليل المرتجعات
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'حاسبة وتحليل',
    titleSub: 'خسائر المرتجعات',
    desc: 'اكتشف الحجم الحقيقي للأموال التي تبتلعها طلبات الاسترجاع والاستبدال وكيف تؤثر على صافي أرباحك.',
    panel1Title: '📦 معطيات المتجر الشهرية',
    ordersLabel: 'إجمالي الطلبات الشهرية',
    ordersUnit: 'طلب',
    avgOrderLabel: 'متوسط قيمة الطلب الواحد',
    returnRateLabel: 'نسبة المرتجعات المئوية (%)',
    shippingLossLabel: 'تكلفة الشحن الضائعة (ذهاب وعودة لكل طلب)',
    panel2Title: '🚨 تقرير الأثر المالي للمرتجعات',
    totalReturnsLabel: 'عدد الطلبات المسترجعة شهرياً',
    returnsUnit: 'طلب',
    totalSalesLossLabel: 'إجمالي قيمة البضاعة المسترجعة',
    shippingLossTotalLabel: 'إجمالي الهدر في مصاريف الشحن',
    tipText: '💡 تنبيه للتاجر: هذه الخسائر تشمل تكاليف الشحن المعاكس وضياع فرصة البيع، ويُنصح دائماً بربط حسابات المتجر بـ (الدفع الإلكتروني المسبق) لتقليل نسبة المرتجعات مقارنة بالدفع عند الاستلام.'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Returns Loss',
    titleSub: 'Calculator & Analyzer',
    desc: 'Discover the real financial impact of returns and exchanges on your net profit.',
    panel1Title: '📦 Monthly Store Metrics',
    ordersLabel: 'Total Monthly Orders',
    ordersUnit: 'orders',
    avgOrderLabel: 'Average Order Value',
    returnRateLabel: 'Return Rate (%)',
    shippingLossLabel: 'Lost Shipping Cost (Roundtrip per return)',
    panel2Title: '🚨 Returns Financial Impact Report',
    totalReturnsLabel: 'Monthly Returned Orders',
    returnsUnit: 'orders',
    totalSalesLossLabel: 'Total Value of Returned Goods',
    shippingLossTotalLabel: 'Total Shipping Wasted Costs',
    tipText: '💡 Merchant Tip: These losses include reverse shipping and lost sales opportunities. It is strongly advised to encourage prepaid online payments over cash-on-delivery (COD) to lower return rates.'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Analyseur de pertes',
    titleSub: 'sur retours',
    desc: 'Découvrez l’impact financier réel des retours sur vos bénéfices.',
    panel1Title: '📦 Données mensuelles',
    ordersLabel: 'Total des commandes mensuelles',
    ordersUnit: 'commandes',
    avgOrderLabel: 'Valeur moyenne de la commande',
    returnRateLabel: 'Taux de retour (%)',
    shippingLossLabel: 'Coût d’expédition perdu',
    panel2Title: '🚨 Rapport d’impact financier',
    totalReturnsLabel: 'Commandes retournées par mois',
    returnsUnit: 'commandes',
    totalSalesLossLabel: 'Valeur totale des marchandises retournées',
    shippingLossTotalLabel: 'Total des frais d’expédition gaspillés',
    tipText: '💡 Conseil : Encouragez les paiements en ligne pour réduire les retours.'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Calculadora de pérdidas',
    titleSub: 'por devoluciones',
    desc: 'Descubre el impacto financiero real de las devoluciones en tus ganancias.',
    panel1Title: '📦 Métricas mensuales de la tienda',
    ordersLabel: 'Total de pedidos mensuales',
    ordersUnit: 'pedidos',
    avgOrderLabel: 'Valor promedio del pedido',
    returnRateLabel: 'Tasa de devolución (%)',
    shippingLossLabel: 'Costo de envío perdido',
    panel2Title: '🚨 Informe de impacto financiero',
    totalReturnsLabel: 'Pedidos devueltos mensualmente',
    returnsUnit: 'pedidos',
    totalSalesLossLabel: 'Valor total de bienes devueltos',
    shippingLossTotalLabel: 'Costos totales de envío desperdiciados',
    tipText: '💡 Consejo: Fomenta los pagos en línea prepagos para reducir las devoluciones.'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'İade Kayıpları',
    titleSub: 'Hesaplayıcı ve Analiz',
    desc: 'İadelerin net kârınız üzerindeki gerçek finansal etkisini keşfedin.',
    panel1Title: '📦 Aylık Mağaza Verileri',
    ordersLabel: 'Toplam Aylık Sipariş',
    ordersUnit: 'sipariş',
    avgOrderLabel: 'Ortalama Sipariş Tutarı',
    returnRateLabel: 'İade Oranı (%)',
    shippingLossLabel: 'Kayıp Kargo Maliyeti (Gidiş-Dönüş)',
    panel2Title: '🚨 İade Finansal Etki Raporu',
    totalReturnsLabel: 'Aylık İade Edilen Sipariş Sayısı',
    returnsUnit: 'sipariş',
    totalSalesLossLabel: 'İade Edilen Ürünlerin Toplam Değeri',
    shippingLossTotalLabel: 'Toplam Kargo İsrafı Maliyeti',
    tipText: '💡 Satıcı Tavsiyesi: Kapıda ödeme yerine peşin online ödeme seçeneklerini teşvik ederek iade oranlarını düşürebilirsiniz.'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '退货损失',
    titleSub: '计算与分析器',
    desc: '发现退货和换货对您净利润的真实财务影响。',
    panel1Title: '📦 月度店铺数据',
    ordersLabel: '每月总订单数',
    ordersUnit: '单',
    avgOrderLabel: '平均客单价',
    returnRateLabel: '退货率 (%)',
    shippingLossLabel: '退货运费损失 (往返)',
    panel2Title: '🚨 退货财务影响报告',
    totalReturnsLabel: '每月退货订单数',
    returnsUnit: '单',
    totalSalesLossLabel: '退货商品总价值',
    shippingLossTotalLabel: '运费浪费总额',
    tipText: '💡 商家提示：建议引导客户使用在线预付支付，以降低货到付款带来的高退货率。'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Retouren-Verlust',
    titleSub: 'Rechner & Analysator',
    desc: 'Ermitteln Sie die realen finanziellen Auswirkungen von Retouren.',
    panel1Title: '📦 Monatliche Shop-Metriken',
    ordersLabel: 'Gesamte monatliche Bestellungen',
    ordersUnit: 'Bestellungen',
    avgOrderLabel: 'Durchschnittlicher Bestellwert',
    returnRateLabel: 'Retourenquote (%)',
    shippingLossLabel: 'Verlorene Versandkosten (Hin & Rück)',
    panel2Title: '🚨 Finanzbericht zu Retouren',
    totalReturnsLabel: 'Monatliche Retouren',
    returnsUnit: 'Bestellungen',
    totalSalesLossLabel: 'Gesamtwert der retournierten Waren',
    shippingLossTotalLabel: 'Verschwendete Versandkosten',
    tipText: '💡 Händler-Tipp: Fördern Sie Vorauszahlungen, um Retourenquoten zu senken.'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Kalkulator Kerugian',
    titleSub: '& Analisis Retur',
    desc: 'Temukan dampak finansial nyata dari retur barang terhadap keuntungan bersih Anda.',
    panel1Title: '📦 Metrik Toko Bulanan',
    ordersLabel: 'Total Pesanan Bulanan',
    ordersUnit: 'pesanan',
    avgOrderLabel: 'Nilai Rata-rata Pesanan',
    returnRateLabel: 'Tingkat Retur (%)',
    shippingLossLabel: 'Biaya Pengiriman Hilang (PP)',
    panel2Title: '🚨 Laporan Dampak Finansial Retur',
    totalReturnsLabel: 'Pesanan Diretur per Bulan',
    returnsUnit: 'pesanan',
    totalSalesLossLabel: 'Total Nilai Barang Diretur',
    shippingLossTotalLabel: 'Total Pemborosan Biaya Pengiriman',
    tipText: '💡 Tips Pedagang: Gunakan pembayaran online di muka untuk menekan angka retur.'
  }
};

export default function ReturnsAnalyzer() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [monthlyOrders, setMonthlyOrders] = useState<number>(500);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(200);
  const [returnRate, setReturnRate] = useState<number>(15);
  const [shippingLossPerReturn, setShippingLossPerReturn] = useState<number>(30);

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

  const totalReturns = Math.round(monthlyOrders * (returnRate / 100));
  const totalMonthlySalesLoss = totalReturns * averageOrderValue;
  const totalShippingLoss = totalReturns * shippingLossPerReturn;
  const totalMonthlyFinancialImpact = totalShippingLoss;

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
        .input-wrapper { position: relative; }
        .input-wrapper input { width: 100%; padding: 14px 15px 14px 55px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 16px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus { border-color: #4f46e5; background: #ffffff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        .input-wrapper .unit { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-weight: 700; font-size: 14px; }

        .results-panel { background: #0f172a; border-color: #1e293b; color: #ffffff; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .result-box.danger { background: #7f1d1d; border-color: #991b1b; }
        
        .result-label { font-size: 15px; font-weight: 700; color: #cbd5e1; }
        .danger .result-label { color: #ffffff; opacity: 0.9; }
        
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
            <label>{t.ordersLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={monthlyOrders || ''} onChange={(e) => setMonthlyOrders(Number(e.target.value))} />
              <span className="unit">{t.ordersUnit}</span>
            </div>
          </div>

          <div className="input-group">
            <label>{t.avgOrderLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={averageOrderValue || ''} onChange={(e) => setAverageOrderValue(Number(e.target.value))} />
              <span className="unit">{currentCurrency}</span>
            </div>
          </div>

          <div className="input-group">
            <label>{t.returnRateLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={returnRate || ''} onChange={(e) => setReturnRate(Number(e.target.value))} />
              <span className="unit">%</span>
            </div>
          </div>

          <div className="input-group">
            <label>{t.shippingLossLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={shippingLossPerReturn || ''} onChange={(e) => setShippingLossPerReturn(Number(e.target.value))} />
              <span className="unit">{currentCurrency}</span>
            </div>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>{t.panel2Title}</h2>

          <div className="result-box">
            <span className="result-label">{t.totalReturnsLabel}</span>
            <span className="result-value" dir="ltr">{totalReturns} <span>{t.returnsUnit}</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.totalSalesLossLabel}</span>
            <span className="result-value" dir="ltr">{totalMonthlySalesLoss.toLocaleString()} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box danger">
            <span className="result-label">{t.shippingLossTotalLabel}</span>
            <span className="result-value" dir="ltr">{totalMonthlyFinancialImpact.toLocaleString()} <span>{currentCurrency}</span></span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginTop: '20px' }}>
            {t.tipText}
          </p>
        </div>
      </div>
    </div>
  );
}
