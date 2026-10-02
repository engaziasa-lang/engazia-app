'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة محلل أداء المتجر الشامل
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'محلل مقاييس وأداء',
    titleSub: 'المتجر الشامل',
    desc: 'توقع مبيعاتك وأرباحك الشهرية بدقة بناءً على زوار متجرك، معدل التحويل، وهامش الربح.',
    panel1Title: '📈 مؤشرات أداء المتجر الشهرية',
    visitorsLabel: 'إجمالي الزيارات الشهرية للمتجر',
    visitorsUnit: 'زائر',
    conversionLabel: 'معدل التحويل (Conversion Rate)',
    avgOrderLabel: 'متوسط قيمة الطلب الواحد',
    marginLabel: 'هامش الربح الصافي التقريبي',
    panel2Title: '🎯 لوحة التوقعات والنتائج المالية',
    ordersLabel: 'الطلبات المتوقعة شهرياً',
    ordersUnit: 'طلب',
    revenueLabel: 'إجمالي الإيرادات المتوقعة',
    profitLabel: 'صافي الأرباح المتوقعة',
    smartTip: '💡 تحليل ذكي: بتحسين معدل التحويل أو زيادة الزيارات، ستتضاعف أرباحك الصافية بشكل طردي. استغل بقية أدوات المنصة لرفع كفاءة متجرك!'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Store Metrics & Performance',
    titleSub: 'Analytics Hub',
    desc: 'Forecast your monthly sales and profits accurately based on visitors, conversion rate, and margin.',
    panel1Title: '📈 Monthly Store Performance Indicators',
    visitorsLabel: 'Total Monthly Store Visitors',
    visitorsUnit: 'visitors',
    conversionLabel: 'Conversion Rate',
    avgOrderLabel: 'Average Order Value',
    marginLabel: 'Approximate Net Profit Margin',
    panel2Title: '🎯 Forecast & Financial Results Dashboard',
    ordersLabel: 'Expected Monthly Orders',
    ordersUnit: 'orders',
    revenueLabel: 'Total Expected Revenue',
    profitLabel: 'Expected Net Profit',
    smartTip: '💡 Smart Analysis: By improving your conversion rate or increasing traffic, your net profits will multiply exponentially. Utilize other platform tools to boost efficiency!'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Hub d’analyse',
    titleSub: 'de performance',
    desc: 'Prévoyez vos ventes et bénéfices mensuels.',
    panel1Title: '📈 Indicateurs mensuels',
    visitorsLabel: 'Visiteurs mensuels totaux',
    visitorsUnit: 'visiteurs',
    conversionLabel: 'Taux de conversion',
    avgOrderLabel: 'Valeur moyenne de la commande',
    marginLabel: 'Marge nette approximative',
    panel2Title: '🎯 Tableau de bord financier',
    ordersLabel: 'Commandes mensuelles prévues',
    ordersUnit: 'commandes',
    revenueLabel: 'Revenus totaux prévus',
    profitLabel: 'Bénéfice net prévu',
    smartTip: '💡 Analyse : Améliorez votre taux de conversion pour multiplier vos profits.'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Centro de análisis',
    titleSub: 'de la tienda',
    desc: 'Pronostica tus ventas y ganancias mensuales con precisión.',
    panel1Title: '📈 Indicadores de rendimiento mensual',
    visitorsLabel: 'Visitas mensuales totales',
    visitorsUnit: 'visitas',
    conversionLabel: 'Tasa de conversión',
    avgOrderLabel: 'Valor promedio del pedido',
    marginLabel: 'Margen de beneficio neto aproximado',
    panel2Title: '🎯 Panel de resultados financieros',
    ordersLabel: 'Pedidos mensuales esperados',
    ordersUnit: 'pedidos',
    revenueLabel: 'Ingresos totales esperados',
    profitLabel: 'Beneficio neto esperado',
    smartTip: '💡 Análisis inteligente: Mejora tu tasa de conversión para multiplicar tus ganancias.'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Mağaza Metrikleri',
    titleSub: 've Performans Merkezi',
    desc: 'Ziyaretçiler, dönüşüm oranı ve kâr marjına göre aylık satış ve kârınızı doğru tahmin edin.',
    panel1Title: '📈 Aylık Mağaza Performans Göstergeleri',
    visitorsLabel: 'Toplam Aylık Mağaza Ziyaretçisi',
    visitorsUnit: 'ziyaretçi',
    conversionLabel: 'Dönüşüm Oranı (Conversion Rate)',
    avgOrderLabel: 'Ortalama Sipariş Tutarı',
    marginLabel: 'Yaklaşık Net Kâr Marjı',
    panel2Title: '🎯 Tahmin ve Finansal Sonuçlar Paneli',
    ordersLabel: 'Aylık Beklenen Sipariş',
    ordersUnit: 'sipariş',
    revenueLabel: 'Toplam Beklenen Gelir',
    profitLabel: 'Beklenen Net Kâr',
    smartTip: '💡 Akıllı Analiz: Dönüşüm oranını artırarak net kârınızı katlayabilirsiniz. Platform araçlarını aktif kullanın!'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '店铺指标与性能',
    titleSub: '分析中心',
    desc: '根据访客量、转化率和利润率，准确预测您的月度销售额与利润。',
    panel1Title: '📈 每月店铺核心指标',
    visitorsLabel: '每月店铺总访客数',
    visitorsUnit: '访客',
    conversionLabel: '转化率 (Conversion Rate)',
    avgOrderLabel: '平均客单价',
    marginLabel: '大致净利润率',
    panel2Title: '🎯 预测与财务结果仪表盘',
    ordersLabel: '预计每月订单数',
    ordersUnit: '单',
    revenueLabel: '预计总收入',
    profitLabel: '预计净利润',
    smartTip: '💡 智能分析：通过提升转化率或增加访问量，您的净利润将成倍增长。充分利用平台工具提升效率！'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Shop-Metriken',
    titleSub: '& Performance-Hub',
    desc: 'Prognostizieren Sie Ihre monatlichen Verkäufe und Gewinne.',
    panel1Title: '📈 Monatliche Leistungsindikatoren',
    visitorsLabel: 'Monatliche Besucher gesamt',
    visitorsUnit: 'Besucher',
    conversionLabel: 'Conversion-Rate',
    avgOrderLabel: 'Durchschnittlicher Bestellwert',
    marginLabel: 'Ungefähre Nettogewinnmarge',
    panel2Title: '🎯 Finanz- und Prognose-Dashboard',
    ordersLabel: 'Erwartete monatliche Bestellungen',
    ordersUnit: 'Bestellungen',
    revenueLabel: 'Erwarteter Gesamtumsatz',
    profitLabel: 'Erwarteter Nettogewinn',
    smartTip: '💡 Smart-Analyse: Steigern Sie Ihre Conversion-Rate, um Gewinne zu maximieren.'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Pusat Analisis',
    titleSub: 'Kinerja Toko',
    desc: 'Proyeksikan penjualan dan keuntungan bulanan Anda secara akurat.',
    panel1Title: '📈 Indikator Kinerja Toko Bulanan',
    visitorsLabel: 'Total Pengunjung Toko Bulanan',
    visitorsUnit: 'pengunjung',
    conversionLabel: 'Tingkat Konversi',
    avgOrderLabel: 'Nilai Rata-rata Pesanan',
    marginLabel: 'Perkiraan Margin Keuntungan Bersih',
    panel2Title: '🎯 Dasbor Proyeksi & Hasil Finansial',
    ordersLabel: 'Perkiraan Pesanan Bulanan',
    ordersUnit: 'pesanan',
    revenueLabel: 'Total Pendapatan yang Diharapkan',
    profitLabel: 'Perkiraan Keuntungan Bersih',
    smartTip: '💡 Analisis Cerdas: Tingkatkan konversi atau kunjungan untuk melipatgandakan keuntungan Anda!'
  }
};

export default function StoreAnalyticsHub() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(10000);
  const [conversionRate, setConversionRate] = useState<number>(2.0);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(250);
  const [netProfitMargin, setNetProfitMargin] = useState<number>(30);

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

  const totalOrders = Math.round(monthlyVisitors * (conversionRate / 100));
  const totalRevenue = totalOrders * averageOrderValue;
  const netProfit = totalRevenue * (netProfitMargin / 100);

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
        .input-wrapper input:focus { border-color: #4f46e5; background: #ffffff; }
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
            <label>{t.visitorsLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={monthlyVisitors || ''} onChange={(e) => setMonthlyVisitors(Number(e.target.value))} />
              <span className="unit">{t.visitorsUnit}</span>
            </div>
          </div>

          <div className="input-group">
            <label>{t.conversionLabel}</label>
            <div className="input-wrapper">
              <input type="number" step="0.1" value={conversionRate || ''} onChange={(e) => setConversionRate(Number(e.target.value))} />
              <span className="unit">%</span>
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
            <label>{t.marginLabel}</label>
            <div className="input-wrapper">
              <input type="number" value={netProfitMargin || ''} onChange={(e) => setNetProfitMargin(Number(e.target.value))} />
              <span className="unit">%</span>
            </div>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>{t.panel2Title}</h2>

          <div className="result-box">
            <span className="result-label">{t.ordersLabel}</span>
            <span className="result-value" dir="ltr">{totalOrders.toLocaleString()} <span>{t.ordersUnit}</span></span>
          </div>

          <div className="result-box">
            <span className="result-label">{t.revenueLabel}</span>
            <span className="result-value" dir="ltr">{totalRevenue.toLocaleString()} <span>{currentCurrency}</span></span>
          </div>

          <div className="result-box highlight">
            <span className="result-label">{t.profitLabel}</span>
            <span className="result-value" dir="ltr">{netProfit.toLocaleString()} <span>{currentCurrency}</span></span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginTop: '15px' }}>
            {t.smartTip}
          </p>
        </div>
      </div>
    </div>
  );
}
