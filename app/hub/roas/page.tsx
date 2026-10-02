'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة تحليل ROAS
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'محلل عائد الإنفاق الإعلاني',
    titleSub: 'ROAS',
    desc: 'قس بدقة أداء إعلاناتك الممولة واكتشف ما إذا كانت حملاتك تحقق أرباحاً حقيقية أم تستنزف ميزانيتك.',
    panel1Title: '📊 بيانات الحملة الإعلانية',
    adSpendLabel: 'إجمالي المصروف الإعلاني (ميزانية الحملة)',
    revenueLabel: 'إجمالي العوائد أو المبيعات المحققة',
    costPercentLabel: 'نسبة تكلفة المنتجات والتشغيل من المبيعات (%)',
    panel2Title: '🎯 تحليل أداء الحملة',
    roasIndexLabel: 'مؤشر العائد ROAS',
    statusLabel: 'حالة الحملة',
    netProfitLabel: 'صافي الربح الفعلي (بعد الإعلانات والتكاليف)',
    profitMarginLabel: 'هامش الربح الصافي النهائي',
    statusLegend1: '🚀 حملة أسطورية ورابحة جداً',
    statusLegend2: '✅ حملة جيدة ومربحة',
    statusLegend3: '⚠️ حملة بالكاد تغطي التكاليف (تحتاج تحسين)',
    statusLegend4: '❌ حملة خاسرة (يجب إيقافها فوراً)'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Ad Spend Return Analyzer',
    titleSub: 'ROAS',
    desc: 'Accurately measure your ad performance and discover if your campaigns generate real profits.',
    panel1Title: '📊 Ad Campaign Data',
    adSpendLabel: 'Total Ad Spend (Campaign Budget)',
    revenueLabel: 'Total Revenue / Sales Generated',
    costPercentLabel: 'Product & Operational Cost Share (%)',
    panel2Title: '🎯 Campaign Performance Analysis',
    roasIndexLabel: 'ROAS Index',
    statusLabel: 'Campaign Status',
    netProfitLabel: 'Actual Net Profit (After Ads & Costs)',
    profitMarginLabel: 'Final Net Profit Margin',
    statusLegend1: '🚀 Legendary & Highly Profitable Campaign',
    statusLegend2: '✅ Good & Profitable Campaign',
    statusLegend3: '⚠️ Barely Covering Costs (Needs Improvement)',
    statusLegend4: '❌ Losing Campaign (Must Stop Immediately)'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Analyseur de ROAS',
    titleSub: 'ROAS',
    desc: 'Mesurez précisément la performance de vos publicités.',
    panel1Title: '📊 Données de la campagne',
    adSpendLabel: 'Dépenses publicitaires totales',
    revenueLabel: 'Chiffre d’affaires total généré',
    costPercentLabel: 'Part des coûts produits (%)',
    panel2Title: '🎯 Analyse des performances',
    roasIndexLabel: 'Indice ROAS',
    statusLabel: 'Statut de la campagne',
    netProfitLabel: 'Bénéfice net réel',
    profitMarginLabel: 'Marge bénéficiaire nette finale',
    statusLegend1: '🚀 Campagne légendaire et très rentable',
    statusLegend2: '✅ Bonne campagne rentable',
    statusLegend3: '⚠️ Couvre à peine les coûts',
    statusLegend4: '❌ Campagne perdante'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Analizador de ROAS',
    titleSub: 'ROAS',
    desc: 'Mide con precisión el rendimiento de tus anuncios.',
    panel1Title: '📊 Datos de la campaña',
    adSpendLabel: 'Gasto total en publicidad',
    revenueLabel: 'Ingresos totales generados',
    costPercentLabel: 'Porcentaje de costos de productos (%)',
    panel2Title: '🎯 Análisis de rendimiento',
    roasIndexLabel: 'Índice ROAS',
    statusLabel: 'Estado de la campaña',
    netProfitLabel: 'Beneficio neto real',
    profitMarginLabel: 'Margen de beneficio neto final',
    statusLegend1: '🚀 Campaña legendaria y muy rentable',
    statusLegend2: '✅ Buena campaña rentable',
    statusLegend3: '⚠️ Apenas cubre costos',
    statusLegend4: '❌ Campaña perdedora'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Reklam Harcaması Getiri Analizcisi',
    titleSub: 'ROAS',
    desc: 'Reklam performansınızı doğru bir şekilde ölçün ve gerçek kâr getirip getirmediğini görün.',
    panel1Title: '📊 Reklam Kampanyası Verileri',
    adSpendLabel: 'Toplam Reklam Harcaması',
    revenueLabel: 'Elde Edilen Toplam Gelir / Satış',
    costPercentLabel: 'Ürün ve Operasyon Maliyet Oranı (%)',
    panel2Title: '🎯 Kampanya Performans Analizi',
    roasIndexLabel: 'ROAS Endeksi',
    statusLabel: 'Kampanya Durumu',
    netProfitLabel: 'Gerçek Net Kâr (Reklam ve Maliyetler Sonrası)',
    profitMarginLabel: 'Nihai Net Kâr Marjı',
    statusLegend1: '🚀 Efsanevi ve Çok Karlı Kampanya',
    statusLegend2: '✅ İyi ve Karlı Kampanya',
    statusLegend3: '⚠️ Maliyetleri Zor Kurtarıyor (İyileştirilmeli)',
    statusLegend4: '❌ Zarar Eden Kampanya (Derhal Durdurulmalı)'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '广告支出回报率',
    titleSub: 'ROAS 分析器',
    desc: '精准衡量广告投放表现，探明您的广告系列究竟是在实现盈利还是在消耗预算。',
    panel1Title: '📊 广告系列数据',
    adSpendLabel: '广告总支出 (预算)',
    revenueLabel: '总收益 / 实现的销售额',
    costPercentLabel: '产品与运营成本占比 (%)',
    panel2Title: '🎯 广告效果分析',
    roasIndexLabel: 'ROAS 指数',
    statusLabel: '广告状态',
    netProfitLabel: '实际净利润 (扣除广告与成本后)',
    profitMarginLabel: '最终净利润率',
    statusLegend1: '🚀 传奇爆款，极度盈利',
    statusLegend2: '✅ 优秀且盈利的广告',
    statusLegend3: '⚠️ 勉强盈亏平衡 (需要优化)',
    statusLegend4: '❌ 亏损广告 (必须立即关停)'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'ROAS-Analysator',
    titleSub: 'ROAS',
    desc: 'Messen Sie präzise die Leistung Ihrer Werbeanzeigen.',
    panel1Title: '📊 Kampagnendaten',
    adSpendLabel: 'Gesamte Werbeausgaben',
    revenueLabel: 'Generierter Gesamtumsatz',
    costPercentLabel: 'Produktkostenanteil (%)',
    panel2Title: '🎯 Leistungsanalyse',
    roasIndexLabel: 'ROAS-Index',
    statusLabel: 'Kampagnenstatus',
    netProfitLabel: 'Echter Nettogewinn',
    profitMarginLabel: 'Nettogewinnmarge',
    statusLegend1: '🚀 Legendäre & sehr profitable Kampagne',
    statusLegend2: '✅ Gute & profitable Kampagne',
    statusLegend3: '⚠️ Deckt kaum die Kosten',
    statusLegend4: '❌ Verlustbringende Kampagne'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Analisis Pengembalian Iklan',
    titleSub: 'ROAS',
    desc: 'Ukur kinerja iklan Anda dengan akurat dan ketahui keuntungan bersihnya.',
    panel1Title: '📊 Data Kampanye Iklan',
    adSpendLabel: 'Total Belanja Iklan',
    revenueLabel: 'Total Pendapatan / Penjualan',
    costPercentLabel: 'Persentase Biaya Produk (%)',
    panel2Title: '🎯 Analisis Kinerja Kampanye',
    roasIndexLabel: 'Indeks ROAS',
    statusLabel: 'Status Kampanye',
    netProfitLabel: 'Keuntungan Bersih Aktual',
    profitMarginLabel: 'Margin Keuntungan Bersih Akhir',
    statusLegend1: '🚀 Kampanye Sangat Menguntungkan',
    statusLegend2: '✅ Kampanye Bagus & Untung',
    statusLegend3: '⚠️ Hampir Menutupi Biaya (Perlu Optimasi)',
    statusLegend4: '❌ Kampanye Rugi (Harus Segera Dihentikan)'
  }
};

export default function RoasAnalyzer() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [adSpend, setAdSpend] = useState<number>(1000);
  const [totalSalesRevenue, setTotalSalesRevenue] = useState<number>(4000);
  const [productCostPercent, setProductCostPercent] = useState<number>(30);

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

  const roas = adSpend > 0 ? totalSalesRevenue / adSpend : 0;
  const productCostAmount = totalSalesRevenue * (productCostPercent / 100);
  const netProfitBeforeAds = totalSalesRevenue - productCostAmount;
  const finalNetProfit = netProfitBeforeAds - adSpend;
  const profitMargin = totalSalesRevenue > 0 ? (finalNetProfit / totalSalesRevenue) * 100 : 0;

  const getStatus = () => {
    if (roas >= 4) return { text: t.statusLegend1, color: '#14532d' };
    if (roas >= 2.5) return { text: t.statusLegend2, color: '#166534' };
    if (roas >= 1.5) return { text: t.statusLegend3, color: '#ca8a04' };
    return { text: t.statusLegend4, color: '#991b1b' };
  };

  const status = getStatus();

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
            <label>{t.adSpendLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={adSpend || ''} onChange={(e) => setAdSpend(Number(e.target.value))} />
              <span className="unit">{currentCurrency}</span>
            </div>
          </div>

          <div className="input-group">
            <label>{t.revenueLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={totalSalesRevenue || ''} onChange={(e) => setTotalSalesRevenue(Number(e.target.value))} />
              <span className="unit">{currentCurrency}</span>
            </div>
          </div>

          <div className="input-group">
            <label>{t.costPercentLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={productCostPercent || ''} onChange={(e) => setProductCostPercent(Number(e.target.value))} />
              <span className="unit">%</span>
            </div>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>{t.panel2Title}</h2>

          <div className="result-box highlight">
            <span className="result-label">{t.roasIndexLabel}</span>
            <span className="result-value" dir="ltr">{roas.toFixed(2)}x</span>
          </div>

          <div className="result-box" style={{ background: status.color, borderColor: 'transparent' }}>
            <span className="result-label">{t.statusLabel}</span>
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#fff' }}>{status.text}</span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.netProfitLabel}</span>
            <span className="result-value" dir="ltr">{finalNetProfit.toLocaleString()} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.profitMarginLabel}</span>
            <span className="result-value" dir="ltr">{profitMargin.toFixed(1)} <span>%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
