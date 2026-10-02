'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavedProduct {
  id: string;
  name: string;
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  adSpend: number;
  paymentFeePercent: number;
  paymentFeeFixed: number;
  taxPercent: number;
  isTaxInclusive: boolean;
  returnRate: number;
  currency: string;
  
  netProfit: number;
  profitMargin: number;
  maxCPA: number;
  breakEvenROAS: number;
  roi: number;
}

interface Translations {
  [key: string]: {
    back: string;
    title: string;
    subtitle: string;
    productData: string;
    productName: string;
    sellingPrice: string;
    productCost: string;
    shippingCost: string;
    adSpend: string;
    advancedSettings: string;
    paymentFeePercent: string;
    paymentFeeFixed: string;
    returnRate: string;
    taxPercent: string;
    taxInclusive: string;
    financialAnalysis: string;
    paymentGateway: string;
    taxAmount: string;
    returnsRisk: string;
    roiLabel: string;
    maxCPA: string;
    breakEvenROAS: string;
    netProfit: string;
    profitMargin: string;
    saveBtn: string;
    clearBtn: string;
    portfolio: string;
    searchPlaceholder: string;
    importExcel: string;
    exportExcel: string;
    thNum: string;
    thProduct: string;
    thPrice: string;
    thCost: string;
    thShipping: string;
    thAd: string;
    thMaxCPA: string;
    thROAS: string;
    thNetProfit: string;
    thMargin: string;
    thActions: string;
    emptyPortfolio: string;
  };
}

const translations: Translations = {
  ar: {
    back: 'العودة',
    title: 'حاسبة أرباح ونقاط التعادل',
    subtitle: 'احسب صافي أرباحك الحقيقية والحد الأقصى لتكلفة الإعلان',
    productData: '🛒 بيانات المنتج والتكاليف',
    productName: 'اسم المنتج',
    sellingPrice: 'سعر البيع للعميل',
    productCost: 'تكلفة المنتج عليك',
    shippingCost: 'تكلفة الشحن والتغليف',
    adSpend: 'تكلفة التسويق (مبيعة)',
    advancedSettings: '⚙ الإعدادات المتقدمة (الرسوم)',
    paymentFeePercent: 'دفع (%)',
    paymentFeeFixed: 'رسوم (ثابت)',
    returnRate: 'المرتجعات',
    taxPercent: 'الضريبة (VAT)',
    taxInclusive: 'السعر "شامل" الضريبة',
    financialAnalysis: '🎯 التحليل المالي والنتائج',
    paymentGateway: 'بوابة الدفع',
    taxAmount: 'الضريبة المقتطعة',
    returnsRisk: 'مخاطر المرتجعات',
    roiLabel: 'عائد الاستثمار ROI',
    maxCPA: 'أقصى تكلفة استحواذ',
    breakEvenROAS: 'العائد الإعلاني المطلوب',
    netProfit: 'الربح الصافي الفعلي',
    profitMargin: 'هامش الربح الصافي',
    saveBtn: '💾 حفظ في المحفظة',
    clearBtn: '🗑 مسح الحقول',
    portfolio: '💼 المحفظة',
    searchPlaceholder: 'ابحث عن منتج...',
    importExcel: '📤 استيراد Excel',
    exportExcel: '📥 تصدير Excel',
    thNum: '#',
    thProduct: 'المنتج',
    thPrice: 'سعر البيع',
    thCost: 'التكلفة',
    thShipping: 'الشحن',
    thAd: 'الإعلان',
    thMaxCPA: 'Max CPA',
    thROAS: 'ROAS',
    thNetProfit: 'الربح الصافي',
    thMargin: 'الهامش',
    thActions: 'إجراءات',
    emptyPortfolio: 'المحفظة فارغة حالياً. يمكنك حفظ المنتجات يدوياً من الأعلى، أو النقر على "استيراد Excel" لرفع ملف منتجاتك السابقة.'
  },
  en: {
    back: 'Back',
    title: 'Profit & Break-even Calculator',
    subtitle: 'Calculate exact net profits and maximum allowable ad spend',
    productData: '🛒 Product Data & Costs',
    productName: 'Product Name',
    sellingPrice: 'Customer Selling Price',
    productCost: 'Product Cost',
    shippingCost: 'Shipping & Packaging Cost',
    adSpend: 'Ad Spend (per sale)',
    advancedSettings: '⚙ Advanced Settings (Fees)',
    paymentFeePercent: 'Gateway (%)',
    paymentFeeFixed: 'Fixed Fee',
    returnRate: 'Returns (%)',
    taxPercent: 'Tax (VAT %)',
    taxInclusive: 'Price includes VAT',
    financialAnalysis: '🎯 Financial Analysis & Results',
    paymentGateway: 'Payment Gateway',
    taxAmount: 'Deducted Tax',
    returnsRisk: 'Returns Risk',
    roiLabel: 'ROI',
    maxCPA: 'Max CPA',
    breakEvenROAS: 'Break-even ROAS',
    netProfit: 'Actual Net Profit',
    profitMargin: 'Net Profit Margin',
    saveBtn: '💾 Save to Portfolio',
    clearBtn: '🗑 Clear Fields',
    portfolio: '💼 Portfolio',
    searchPlaceholder: 'Search product...',
    importExcel: '📤 Import Excel',
    exportExcel: '📥 Export Excel',
    thNum: '#',
    thProduct: 'Product',
    thPrice: 'Price',
    thCost: 'Cost',
    thShipping: 'Shipping',
    thAd: 'Ad Spend',
    thMaxCPA: 'Max CPA',
    thROAS: 'ROAS',
    thNetProfit: 'Net Profit',
    thMargin: 'Margin',
    thActions: 'Actions',
    emptyPortfolio: 'Portfolio is currently empty. You can save products manually above or click "Import Excel".'
  },
  fr: {
    back: 'Retour',
    title: 'Calculateur de profits et seuil de rentabilité',
    subtitle: 'Calculez vos bénéfices nets exacts et le CPA maximum autorisé',
    productData: '🛒 Données du produit et Coûts',
    productName: 'Nom du produit',
    sellingPrice: 'Prix de vente client',
    productCost: 'Coût du produit',
    shippingCost: 'Coût de livraison',
    adSpend: 'Dépense publicitaire (par vente)',
    advancedSettings: '⚙ Paramètres avancés (Frais)',
    paymentFeePercent: 'Passerelle (%)',
    paymentFeeFixed: 'Frais fixes',
    returnRate: 'Retours (%)',
    taxPercent: 'TVA (%)',
    taxInclusive: 'Prix TTC',
    financialAnalysis: '🎯 Analyse financière & Résultats',
    paymentGateway: 'Passerelle de paiement',
    taxAmount: 'Taxe déduite',
    returnsRisk: 'Risque de retours',
    roiLabel: 'ROI',
    maxCPA: 'CPA Max',
    breakEvenROAS: 'ROAS d\'équilibre',
    netProfit: 'Bénéfice net réel',
    profitMargin: 'Marge bénéficiaire nette',
    saveBtn: '💾 Enregistrer',
    clearBtn: '🗑 Effacer',
    portfolio: '💼 Portefeuille',
    searchPlaceholder: 'Rechercher...',
    importExcel: '📤 Importer Excel',
    exportExcel: '📥 Exporter Excel',
    thNum: '#',
    thProduct: 'Produit',
    thPrice: 'Prix',
    thCost: 'Coût',
    thShipping: 'Livraison',
    thAd: 'Publicité',
    thMaxCPA: 'CPA Max',
    thROAS: 'ROAS',
    thNetProfit: 'Bénéfice Net',
    thMargin: 'Marge',
    thActions: 'Actions',
    emptyPortfolio: 'Le portefeuille est vide.'
  },
  es: {
    back: 'Volver',
    title: 'Calculadora de Beneficios y Punto de Equilibrio',
    subtitle: 'Calcula tus beneficios netos exactos y el CPA máximo permitido',
    productData: '🛒 Datos del Producto y Costes',
    productName: 'Nombre del Producto',
    sellingPrice: 'Precio de Venta',
    productCost: 'Coste del Producto',
    shippingCost: 'Coste de Envío',
    adSpend: 'Gasto en Publicidad',
    advancedSettings: '⚙ Configuración Avanzada',
    paymentFeePercent: 'Pasarela (%)',
    paymentFeeFixed: 'Tarifa Fija',
    returnRate: 'Devoluciones (%)',
    taxPercent: 'Impuesto (%)',
    taxInclusive: 'Precio con IVA incluido',
    financialAnalysis: '🎯 Análisis Financiero y Resultados',
    paymentGateway: 'Pasarela de pago',
    taxAmount: 'Impuesto deducido',
    returnsRisk: 'Riesgo de devoluciones',
    roiLabel: 'ROI',
    maxCPA: 'CPA Máximo',
    breakEvenROAS: 'ROAS de equilibrio',
    netProfit: 'Beneficio Net Real',
    profitMargin: 'Margen de Beneficio',
    saveBtn: '💾 Guardar',
    clearBtn: '🗑 Limpiar',
    portfolio: '💼 Cartera',
    searchPlaceholder: 'Buscar producto...',
    importExcel: '📤 Importar Excel',
    exportExcel: '📥 Exportar Excel',
    thNum: '#',
    thProduct: 'Producto',
    thPrice: 'Precio',
    thCost: 'Coste',
    thShipping: 'Envío',
    thAd: 'Anuncio',
    thMaxCPA: 'CPA Max',
    thROAS: 'ROAS',
    thNetProfit: 'Beneficio Net',
    thMargin: 'Margen',
    thActions: 'Acciones',
    emptyPortfolio: 'La cartera está vacía.'
  },
  tr: {
    back: 'Geri',
    title: 'Kâr ve Başa Baş Hesaplayıcı',
    subtitle: 'Net kârınızı ve izin verilen maksimum reklam maliyetini hesaplayın',
    productData: '🛒 Ürün Verileri ve Maliyetler',
    productName: 'Ürün Adı',
    sellingPrice: 'Satış Fiyatı',
    productCost: 'Ürün Maliyeti',
    shippingCost: 'Kargo Maliyeti',
    adSpend: 'Reklam Gideri',
    advancedSettings: '⚙ Gelişmiş Ayarlar',
    paymentFeePercent: 'Ödeme Komisyonu (%)',
    paymentFeeFixed: 'Sabit Komisyon',
    returnRate: 'İade Oranı (%)',
    taxPercent: 'KDV (%)',
    taxInclusive: 'Fiyat KDV Dahil',
    financialAnalysis: '🎯 Finansal Analiz ve Sonuçlar',
    paymentGateway: 'Ödeme Ağ Geçidi',
    taxAmount: 'Kesilen Vergi',
    returnsRisk: 'İade Riski',
    roiLabel: 'ROI',
    maxCPA: 'Maks CPA',
    breakEvenROAS: 'Başa Baş ROAS',
    netProfit: 'Net Kâr',
    profitMargin: 'Kâr Marjı',
    saveBtn: '💾 Kaydet',
    clearBtn: '🗑 Temizle',
    portfolio: '💼 Portföy',
    searchPlaceholder: 'Ürün ara...',
    importExcel: '📤 Excel İçe Aktar',
    exportExcel: '📥 Excel Dışa Aktar',
    thNum: '#',
    thProduct: 'Ürün',
    thPrice: 'Fiyat',
    thCost: 'Maliyet',
    thShipping: 'Kargo',
    thAd: 'Reklam',
    thMaxCPA: 'Maks CPA',
    thROAS: 'ROAS',
    thNetProfit: 'Net Kâr',
    thMargin: 'Marj',
    thActions: 'İşlemler',
    emptyPortfolio: 'Portföy boş.'
  },
  zh: {
    back: '返回',
    title: '利润与盈亏平衡计算器',
    subtitle: '精准计算净利润与最高允许广告成本',
    productData: '🛒 产品数据与成本',
    productName: '产品名称',
    sellingPrice: '销售价格',
    productCost: '产品成本',
    shippingCost: '运费成本',
    adSpend: '广告支出',
    advancedSettings: '⚙ 高级设置（手续费）',
    paymentFeePercent: '网关费 (%)',
    paymentFeeFixed: '固定费用',
    returnRate: '退货率 (%)',
    taxPercent: '税率 (%)',
    taxInclusive: '价格含税',
    financialAnalysis: '🎯 财务分析与结果',
    paymentGateway: '支付网关',
    taxAmount: '抵扣税额',
    returnsRisk: '退货风险',
    roiLabel: '投资回报率 ROI',
    maxCPA: '最高 CPA',
    breakEvenROAS: '盈亏平衡 ROAS',
    netProfit: '实际净利润',
    profitMargin: '净利润率',
    saveBtn: '💾 保存到投资组合',
    clearBtn: '🗑 清空',
    portfolio: '💼 投资组合',
    searchPlaceholder: '搜索产品...',
    importExcel: '📤 导入 Excel',
    exportExcel: '📥 导出 Excel',
    thNum: '#',
    thProduct: '产品',
    thPrice: '售价',
    thCost: '成本',
    thShipping: '运费',
    thAd: '广告',
    thMaxCPA: 'Max CPA',
    thROAS: 'ROAS',
    thNetProfit: '净利润',
    thMargin: '利润率',
    thActions: '操作',
    emptyPortfolio: '投资组合当前为空。'
  },
  de: {
    back: 'Zurück',
    title: 'Gewinn- & Break-Even-Rechner',
    subtitle: 'Berechnen Sie Nettogewinne und maximale Werbekosten',
    productData: '🛒 Produktdaten & Kosten',
    productName: 'Produktname',
    sellingPrice: 'Verkaufspreis',
    productCost: 'Produktkosten',
    shippingCost: 'Versandkosten',
    adSpend: 'Werbekosten',
    advancedSettings: '⚙ Erweiterte Einstellungen',
    paymentFeePercent: 'Gateway (%)',
    paymentFeeFixed: 'Feste Gebühr',
    returnRate: 'Retouren (%)',
    taxPercent: 'MwSt. (%)',
    taxInclusive: 'Preis inkl. MwSt.',
    financialAnalysis: '🎯 Finanzanalyse & Ergebnisse',
    paymentGateway: 'Zahlungs-Gateway',
    taxAmount: 'Abgezogene Steuer',
    returnsRisk: 'Retourenrisiko',
    roiLabel: 'ROI',
    maxCPA: 'Max CPA',
    breakEvenROAS: 'Break-Even ROAS',
    netProfit: 'Nettogewinn',
    profitMargin: 'Gewinnmarge',
    saveBtn: '💾 Speichern',
    clearBtn: '🗑 Löschen',
    portfolio: '💼 Portfolio',
    searchPlaceholder: 'Produkt suchen...',
    importExcel: '📤 Excel Importieren',
    exportExcel: '📥 Excel Exportieren',
    thNum: '#',
    thProduct: 'Produkt',
    thPrice: 'Preis',
    thCost: 'Kosten',
    thShipping: 'Versand',
    thAd: 'Werbung',
    thMaxCPA: 'Max CPA',
    thROAS: 'ROAS',
    thNetProfit: 'Nettogewinn',
    thMargin: 'Marge',
    thActions: 'Aktionen',
    emptyPortfolio: 'Das Portfolio ist leer.'
  },
  id: {
    back: 'Kembali',
    title: 'Kalkulator Laba & Titik Impas',
    subtitle: 'Hitung laba bersih akurat dan biaya iklan maksimum yang diizinkan',
    productData: '🛒 Data Produk & Biaya',
    productName: 'Nama Produk',
    sellingPrice: 'Harga Jual',
    productCost: 'Biaya Produk',
    shippingCost: 'Biaya Pengiriman',
    adSpend: 'Biaya Iklan',
    advancedSettings: '⚙ Pengaturan Lanjutan',
    paymentFeePercent: 'Gateway (%)',
    paymentFeeFixed: 'Biaya Tetap',
    returnRate: 'Retur (%)',
    taxPercent: 'Pajak (%)',
    taxInclusive: 'Harga sudah termasuk pajak',
    financialAnalysis: '🎯 Analisis Keuangan & Hasil',
    paymentGateway: 'Gateway Pembayaran',
    taxAmount: 'Pajak Dipotong',
    returnsRisk: 'Risiko Retur',
    roiLabel: 'ROI',
    maxCPA: 'Max CPA',
    breakEvenROAS: 'Break-even ROAS',
    netProfit: 'Laba Bersih Aktual',
    profitMargin: 'Margin Laba',
    saveBtn: '💾 Simpan',
    clearBtn: '🗑 Bersihkan',
    portfolio: '💼 Portofolio',
    searchPlaceholder: 'Cari produk...',
    importExcel: '📤 Impor Excel',
    exportExcel: '📥 Ekspor Excel',
    thNum: '#',
    thProduct: 'Produk',
    thPrice: 'Harga',
    thCost: 'Biaya',
    thShipping: 'Pengiriman',
    thAd: 'Iklan',
    thMaxCPA: 'Max CPA',
    thROAS: 'ROAS',
    thNetProfit: 'Laba Bersih',
    thMargin: 'Margin',
    thActions: 'Aksi',
    emptyPortfolio: 'Portofolio kosong.'
  }
};

export default function ProfitCalculator() {
  const [currentLang, setCurrentLang] = useState<string>('ar');
  const [currency, setCurrency] = useState<string>('SAR');

  const [productName, setProductName] = useState<string>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [adSpend, setAdSpend] = useState<number | ''>('');

  const [paymentFeePercent, setPaymentFeePercent] = useState<number>(2.5);
  const [paymentFeeFixed, setPaymentFeeFixed] = useState<number>(1);
  const [taxPercent, setTaxPercent] = useState<number>(15);
  const [isTaxInclusive, setIsTaxInclusive] = useState<boolean>(true);
  const [returnRate, setReturnRate] = useState<number>(10);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [results, setResults] = useState({
    paymentFees: 0,
    taxAmount: 0,
    returnsCost: 0,
    totalCostWithoutAds: 0,
    maxCPA: 0, 
    breakEvenROAS: 0, 
    netProfit: 0,
    profitMargin: 0,
    roi: 0,
  });

  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);

  // إعدادات JSONbin للمزامنة السحابية الذكية
  const MASTER_KEY = '$2a$10$MjUOD019x6uuVhydjtfL.cBlGqmIXvWR5b/tNrOZU6Ey8P.JOcyu';

  const loadDataFromCloud = async (licenseKey: string) => {
    if (!licenseKey) return;
    try {
      const binId = localStorage.getItem(`bin_id_${licenseKey}`);
      if (!binId) return;

      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: { 'X-Master-Key': MASTER_KEY }
      });
      const responseData = await res.json();
      if (responseData && responseData.record && responseData.record.tools_data) {
        const cloudProducts = responseData.record.tools_data.profit_calculator || [];
        setSavedProducts(cloudProducts);
        localStorage.setItem('engazia_profit_products_v10', JSON.stringify(cloudProducts));
      }
    } catch (err) {
      console.error('خطأ في سحب البيانات سحابياً:', err);
    }
  };

  const saveToCloud = async (updatedProducts: SavedProduct[]) => {
    const licenseKey = localStorage.getItem('merchant_license_key');
    if (!licenseKey) return;

    try {
      let binId = localStorage.getItem(`bin_id_${licenseKey}`);
      const payload = {
        merchant_key: licenseKey,
        tools_data: { profit_calculator: updatedProducts }
      };

      if (!binId) {
        const createRes = await fetch('https://api.jsonbin.io/v3/b', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': MASTER_KEY,
            'X-Bin-Name': `Merchant_${licenseKey}`
          },
          body: JSON.stringify(payload)
        });
        const createData = await createRes.json();
        if (createData && createData.metadata && createData.metadata.id) {
          binId = createData.metadata.id;
          localStorage.setItem(`bin_id_${licenseKey}`, binId!);
        }
      } else {
        await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': MASTER_KEY
          },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.error('فشل الحفظ السحابي:', err);
    }
  };

  useEffect(() => {
    // جلب اللغة والعملة المفضلة من إعدادات المنصة العامة
    const storedLang = localStorage.getItem('engazia_global_lang') || 'ar';
    const storedCurr = localStorage.getItem('engazia_global_currency') || 'SAR';
    setCurrentLang(storedLang);
    setCurrency(storedCurr);

    const savedKey = localStorage.getItem('merchant_license_key');
    if (savedKey) {
      loadDataFromCloud(savedKey);
    }

    const saved = localStorage.getItem('engazia_profit_products_v10');
    if (saved) {
      try { setSavedProducts(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    calculateProfit();
  }, [productCost, sellingPrice, shippingCost, adSpend, paymentFeePercent, paymentFeeFixed, taxPercent, isTaxInclusive, returnRate]);

  const calculateProfit = () => {
    const sPrice = Number(sellingPrice) || 0;
    const pCost = Number(productCost) || 0;
    const sCost = Number(shippingCost) || 0;
    const aSpend = Number(adSpend) || 0;

    if (sPrice <= 0) {
      setResults({ paymentFees: 0, taxAmount: 0, returnsCost: 0, totalCostWithoutAds: 0, maxCPA: 0, breakEvenROAS: 0, netProfit: 0, profitMargin: 0, roi: 0 });
      return;
    }

    const paymentFees = (sPrice * (paymentFeePercent / 100)) + paymentFeeFixed;
    const taxValue = taxPercent / 100;
    const taxAmount = isTaxInclusive 
      ? sPrice - (sPrice / (1 + taxValue)) 
      : sPrice * taxValue;
    const returnsCost = (pCost + sCost) * (returnRate / 100);
    const totalCostWithoutAds = pCost + sCost + paymentFees + taxAmount + returnsCost;
    const maxCPA = sPrice - totalCostWithoutAds;
    const breakEvenROAS = maxCPA > 0 ? (sPrice / maxCPA) : 0;
    const netProfit = maxCPA - aSpend;
    const profitMargin = (netProfit / sPrice) * 100;
    const totalInvestment = pCost + sCost + aSpend;
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

    setResults({ paymentFees, taxAmount, returnsCost, totalCostWithoutAds, maxCPA, breakEvenROAS, netProfit, profitMargin, roi });
  };

  const saveProduct = () => {
    if (!productName.trim() || !sellingPrice) {
      alert(currentLang === 'ar' ? 'الرجاء إدخال اسم المنتج وسعر البيع على الأقل للحفظ.' : 'Please enter product name and selling price.');
      return;
    }

    const newProduct: SavedProduct = {
      id: Date.now().toString(),
      name: productName,
      sellingPrice: Number(sellingPrice),
      productCost: Number(productCost) || 0,
      shippingCost: Number(shippingCost) || 0,
      adSpend: Number(adSpend) || 0,
      paymentFeePercent, paymentFeeFixed, taxPercent, isTaxInclusive, returnRate,
      currency,
      netProfit: results.netProfit, profitMargin: results.profitMargin, maxCPA: results.maxCPA, breakEvenROAS: results.breakEvenROAS, roi: results.roi
    };

    const updatedList = [newProduct, ...savedProducts];
    setSavedProducts(updatedList);
    localStorage.setItem('engazia_profit_products_v10', JSON.stringify(updatedList));
    saveToCloud(updatedList);
    setProductName('');
  };

  const clearInputs = () => {
    setProductName('');
    setSellingPrice('');
    setProductCost('');
    setShippingCost('');
    setAdSpend('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadProduct = (prod: SavedProduct) => {
    setProductName(prod.name);
    setSellingPrice(prod.sellingPrice);
    setProductCost(prod.productCost);
    setShippingCost(prod.shippingCost);
    setAdSpend(prod.adSpend);
    setPaymentFeePercent(prod.paymentFeePercent);
    setPaymentFeeFixed(prod.paymentFeeFixed);
    setTaxPercent(prod.taxPercent);
    setIsTaxInclusive(prod.isTaxInclusive);
    setReturnRate(prod.returnRate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = (id: string) => {
    if (window.confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      const updatedList = savedProducts.filter(p => p.id !== id);
      setSavedProducts(updatedList);
      localStorage.setItem('engazia_profit_products_v10', JSON.stringify(updatedList));
      saveToCloud(updatedList);
    }
  };

  const exportToCSV = () => {
    if (savedProducts.length === 0) return;
    const headers = ['Product', 'Currency', 'Price', 'Cost', 'Shipping', 'Ad', 'Max CPA', 'ROAS', 'Net Profit', 'Margin %'];
    const rows = savedProducts.map(p => [
      p.name, p.currency || currency, p.sellingPrice, p.productCost, p.shippingCost, p.adSpend,
      p.maxCPA.toFixed(2), p.breakEvenROAS.toFixed(2), p.netProfit.toFixed(2), p.profitMargin.toFixed(2)
    ]);

    let htmlTable = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"/></head><body><table border="1"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
    const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profit_portfolio.xls`;
    link.click();
  };

  const importFromExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const rows = doc.querySelectorAll('tbody tr');
        if (rows.length === 0) return;

        const newProducts: SavedProduct[] = [];
        rows.forEach((row) => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
            const name = cells[0]?.textContent?.trim() || 'Imported';
            const sPrice = parseFloat(cells[2]?.textContent || '0') || 0;
            const pCost = parseFloat(cells[3]?.textContent || '0') || 0;
            const sCost = parseFloat(cells[4]?.textContent || '0') || 0;
            const aSpend = parseFloat(cells[5]?.textContent || '0') || 0;

            const pFees = (sPrice * (paymentFeePercent / 100)) + paymentFeeFixed;
            const tValue = taxPercent / 100;
            const tAmount = isTaxInclusive ? sPrice - (sPrice / (1 + tValue)) : sPrice * tValue;
            const rCost = (pCost + sCost) * (returnRate / 100);
            const totalCostWithoutAds = pCost + sCost + pFees + tAmount + rCost;
            const maxC = sPrice - totalCostWithoutAds;
            const beROAS = maxC > 0 ? (sPrice / maxC) : 0;
            const nProfit = maxC - aSpend;
            const pMargin = sPrice > 0 ? (nProfit / sPrice) * 100 : 0;
            const totalInv = pCost + sCost + aSpend;
            const roiVal = totalInv > 0 ? (nProfit / totalInv) * 100 : 0;

            newProducts.push({
              id: Date.now().toString() + Math.random(),
              name, sellingPrice: sPrice, productCost: pCost, shippingCost: sCost, adSpend: aSpend,
              paymentFeePercent, paymentFeeFixed, taxPercent, isTaxInclusive, returnRate, currency,
              netProfit: nProfit, profitMargin: pMargin, maxCPA: maxC, breakEvenROAS: beROAS, roi: roiVal
            });
          }
        });

        if (newProducts.length > 0) {
          const updatedList = [...newProducts, ...savedProducts];
          setSavedProducts(updatedList);
          localStorage.setItem('engazia_profit_products_v10', JSON.stringify(updatedList));
          saveToCloud(updatedList);
        }
      } catch (err) { console.error(err); }
    };
    reader.readAsText(file);
  };

  const t = translations[currentLang] || translations.en;
  const isRtl = currentLang === 'ar';
  const filteredProducts = savedProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="tool-container" style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}>
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f1f5f9; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 20px 15px 40px; }
        
        .header { max-width: 1000px; margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 13px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .back-btn:hover { background: #e2e8f0; color: #0f172a; }

        .tool-title { text-align: center; margin-bottom: 25px; }
        .tool-title h1 { font-size: 26px; font-weight: 900; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.5px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 13px; font-weight: 500; margin: 0; }

        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 1000px; margin: 0 auto 30px; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 15px; font-weight: 900; color: #1e293b; margin-bottom: 18px; margin-top: 0; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }

        .input-group { margin-bottom: 14px; }
        .input-group label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; }
        .input-wrapper input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: 'Tajawal', sans-serif; transition: border-color 0.2s; background: #fff; font-weight: 700; color: #1e293b; outline: none; box-sizing: border-box; }
        .input-wrapper input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        .input-wrapper .currency { position: absolute; ${isRtl ? 'left: 12px;' : 'right: 12px;'} top: 50%; transform: translateY(-50%); color: #94a3b8; font-weight: 800; font-size: 11px; direction: ltr; }

        .grid-2-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-3-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 12px; }

        .results-panel { background: #1e293b; border: none; color: #ffffff; position: relative; overflow: hidden; }
        .results-panel h2 { color: #ffffff; border-color: #334155; }
        
        .result-box { background: #334155; padding: 12px 15px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #475569; transition: 0.3s; }
        .result-box.highlight { background: #4f46e5; border-color: #6366f1; }
        .result-box.warning { background: #7f1d1d; border-color: #991b1b; }
        .result-box.success { background: #14532d; border-color: #166534; }
        
        .result-label { font-size: 13px; font-weight: 800; color: #cbd5e1; display: flex; flex-direction: column; }
        .result-label small { font-size: 10px; color: #94a3b8; font-weight: 500; margin-top: 2px; }
        
        .result-value { font-size: 18px; font-weight: 900; color: #ffffff; display: flex; align-items: baseline; gap: 4px; direction: ltr; }
        .result-value span { font-size: 11px; font-weight: 700; opacity: 0.8; }

        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .detail-item { background: #0f172a; padding: 10px; border-radius: 8px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 4px; }
        .detail-label { font-size: 10px; color: #94a3b8; font-weight: 700; }
        .detail-val { font-size: 13px; font-weight: 900; color: #f8fafc; direction: ltr; text-align: ${isRtl ? 'right' : 'left'}; }

        .action-buttons { display: flex; gap: 10px; margin-top: 15px; }
        .btn-save { background: #10b981; color: #fff; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 900; cursor: pointer; transition: 0.2s; font-family: 'Tajawal', sans-serif; flex: 2; }
        .btn-save:hover { background: #059669; }
        .btn-clear { background: transparent; color: #94a3b8; border: 1px solid #334155; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; font-family: 'Tajawal', sans-serif; flex: 1; }
        .btn-clear:hover { background: #334155; color: #fff; }

        .saved-section-title { font-size: 16px; font-weight: 900; color: #1e293b; margin-bottom: 15px; max-width: 1000px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        
        .table-controls { display: flex; gap: 10px; align-items: center; flex: 1; justify-content: flex-end; flex-wrap: wrap; }
        .search-box { position: relative; max-width: 200px; width: 100%; }
        .search-box input { width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-family: 'Tajawal', sans-serif; outline: none; box-sizing: border-box; }
        
        .btn-action { display: inline-flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; color: #475569; cursor: pointer; transition: 0.2s; white-space: nowrap; font-family: 'Tajawal', sans-serif; }
        .btn-action:hover { background: #f8fafc; color: #0f172a; }
        
        .table-container { max-width: 1000px; margin: 0 auto; overflow-x: auto; background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .styled-table { width: 100%; border-collapse: collapse; text-align: ${isRtl ? 'right' : 'left'}; font-size: 12px; white-space: nowrap; min-width: 850px; }
        .styled-table th, .styled-table td { padding: 14px 15px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .styled-table th { background-color: #f8fafc; font-weight: 900; color: #475569; font-size: 12px; }
        
        .table-badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 900; direction: ltr; display: inline-block; }
        .bg-green { background: #dcfce7; color: #166534; }
        .bg-yellow { background: #fef3c7; color: #92400e; }
        .bg-red { background: #fee2e2; color: #991b1b; }

        .pc-actions { display: flex; gap: 6px; }
        .pc-btn { width: 28px; height: 28px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; border: none; font-size: 12px; }
        .pc-btn-edit { background: #e0e7ff; color: #4f46e5; }
        .pc-btn-delete { background: #fee2e2; color: #ef4444; }

        @media(max-width: 800px) { 
          .main-grid { grid-template-columns: 1fr; gap: 15px; } 
          .tool-container { padding: 15px 10px 30px; }
        }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>{isRtl ? '→' : '←'}</span> {t.back}
        </Link>
      </div>

      <div className="tool-title">
        <h1>{t.title.split(' ')[0]} <span>{t.title.split(' ').slice(1).join(' ')}</span></h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>{t.productData}</h2>
          
          <div className="input-group">
            <label>{t.productName}</label>
            <div className="input-wrapper">
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: سماعة" />
            </div>
          </div>

          <div className="grid-2-cols">
            <div className="input-group">
              <label>{t.sellingPrice}</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} placeholder="199" />
                <span className="currency">{currency}</span>
              </div>
            </div>
            <div className="input-group">
              <label>{t.productCost}</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={productCost} onChange={(e) => setProductCost(Number(e.target.value))} placeholder="50" />
                <span className="currency">{currency}</span>
              </div>
            </div>
          </div>

          <div className="grid-2-cols">
            <div className="input-group">
              <label>{t.shippingCost}</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} placeholder="25" />
                <span className="currency">{currency}</span>
              </div>
            </div>
            <div className="input-group">
              <label>{t.adSpend}</label>
              <div className="input-wrapper">
                <input type="number" min="0" value={adSpend} onChange={(e) => setAdSpend(Number(e.target.value))} placeholder="40" />
                <span className="currency">{currency}</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '5px' }}>
            <h3 style={{ fontSize: '11px', color: '#1e293b', marginBottom: '10px', fontWeight: 900 }}>{t.advancedSettings}</h3>
            
            <div className="grid-3-cols">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>{t.paymentFeePercent}</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" value={paymentFeePercent} onChange={(e) => setPaymentFeePercent(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>{t.paymentFeeFixed}</label>
                <div className="input-wrapper">
                  <input type="number" step="0.1" value={paymentFeeFixed} onChange={(e) => setPaymentFeeFixed(Number(e.target.value))} />
                  <span className="currency">{currency}</span>
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>{t.returnRate}</label>
                <div className="input-wrapper">
                  <input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>{t.taxPercent}</label>
                <div className="input-wrapper">
                  <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} />
                  <span className="currency">%</span>
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, color: '#475569', flex: 2, marginTop: '15px' }}>
                <input type="checkbox" checked={isTaxInclusive} onChange={(e) => setIsTaxInclusive(e.target.checked)} style={{ width: '14px', height: '14px', accentColor: '#4f46e5' }} />
                {t.taxInclusive}
              </label>
            </div>
          </div>
        </div>

        <div className="panel results-panel">
          <h2>{t.financialAnalysis}</h2>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">{t.paymentGateway}</span>
              <span className="detail-val">{results.paymentFees.toFixed(2)} {currency}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t.taxAmount}</span>
              <span className="detail-val">{results.taxAmount.toFixed(2)} {currency}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t.returnsRisk}</span>
              <span className="detail-val" style={{ color: '#fca5a5' }}>-{results.returnsCost.toFixed(2)} {currency}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t.roiLabel}</span>
              <span className="detail-val" style={{ color: '#86efac' }}>%{results.roi.toFixed(0)}</span>
            </div>
          </div>

          <div className="grid-2-cols" style={{ gap: '8px' }}>
            <div className="result-box" style={{ background: '#0f172a', borderColor: '#334155', padding: '12px' }}>
              <span className="result-label" style={{ color: '#fcd34d' }}>
                {t.maxCPA}
              </span>
              <span className="result-value" style={{ color: '#fcd34d' }}>
                {results.maxCPA.toFixed(2)} <span>{currency}</span>
              </span>
            </div>

            <div className="result-box" style={{ background: '#0f172a', borderColor: '#334155', padding: '12px' }}>
              <span className="result-label" style={{ color: '#38bdf8' }}>
                {t.breakEvenROAS}
              </span>
              <span className="result-value" style={{ color: '#38bdf8' }}>
                {results.breakEvenROAS.toFixed(2)}x
              </span>
            </div>
          </div>

          <div className={`result-box ${results.netProfit > 0 ? 'success' : results.netProfit < 0 ? 'warning' : ''}`}>
            <span className="result-label">{t.netProfit}</span>
            <span className="result-value">
              {results.netProfit.toFixed(2)} <span>{currency}</span>
            </span>
          </div>

          <div className="result-box highlight" style={{ marginBottom: '5px' }}>
            <span className="result-label">{t.profitMargin}</span>
            <span className="result-value">
              {results.profitMargin.toFixed(1)} <span>%</span>
            </span>
          </div>

          <div className="action-buttons">
            <button className="btn-save" onClick={saveProduct}>{t.saveBtn}</button>
            <button className="btn-clear" onClick={clearInputs}>{t.clearBtn}</button>
          </div>
        </div>
      </div>

      <div className="saved-section-title">
        <span>{t.portfolio} ({savedProducts.length})</span>
        <div className="table-controls">
          {savedProducts.length > 0 && (
            <div className="search-box">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <label className="btn-action" style={{ cursor: 'pointer' }}>
            {t.importExcel}
            <input type="file" accept=".xls,.html" onChange={importFromExcel} style={{ display: 'none' }} />
          </label>
          {savedProducts.length > 0 && (
            <button className="btn-action" onClick={exportToCSV}>{t.exportExcel}</button>
          )}
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center', width: '40px' }}>{t.thNum}</th>
                <th>{t.thProduct}</th>
                <th>{t.thPrice}</th>
                <th>{t.thCost}</th>
                <th>{t.thShipping}</th>
                <th>{t.thAd}</th>
                <th>{t.thMaxCPA}</th>
                <th>{t.thROAS}</th>
                <th>{t.thNetProfit}</th>
                <th>{t.thMargin}</th>
                <th>{t.thActions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod, index) => (
                  <tr key={prod.id}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ fontWeight: 900, color: '#0f172a' }}>{prod.name}</td>
                    <td dir="ltr">{prod.sellingPrice} {prod.currency || currency}</td>
                    <td dir="ltr">{prod.productCost} {prod.currency || currency}</td>
                    <td dir="ltr">{prod.shippingCost} {prod.currency || currency}</td>
                    <td dir="ltr">{prod.adSpend} {prod.currency || currency}</td>
                    <td dir="ltr" style={{ color: '#f59e0b', fontWeight: 800 }}>{prod.maxCPA.toFixed(2)}</td>
                    <td dir="ltr" style={{ color: '#38bdf8', fontWeight: 800 }}>{prod.breakEvenROAS.toFixed(2)}x</td>
                    <td dir="ltr" style={{ fontWeight: 900, color: prod.netProfit > 0 ? '#166534' : '#991b1b' }}>
                      {prod.netProfit.toFixed(2)} {prod.currency || currency}
                    </td>
                    <td>
                      <span className={`table-badge ${prod.profitMargin >= 20 ? 'bg-green' : prod.profitMargin > 0 ? 'bg-yellow' : 'bg-red'}`}>
                        {prod.profitMargin.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <div className="pc-actions">
                        <button className="pc-btn pc-btn-edit" onClick={() => loadProduct(prod)} title="Edit">✏️</button>
                        <button className="pc-btn pc-btn-delete" onClick={() => deleteProduct(prod.id)} title="Delete">✕</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b', fontSize: '13px', fontWeight: 700 }}>
          {t.emptyPortfolio}
        </div>
      )}
    </div>
  );
}
