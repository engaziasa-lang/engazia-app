'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const supportedLangs = ['ar', 'en', 'fr', 'es', 'tr', 'zh', 'de', 'id'];

const getInitialConfig = () => {
  if (typeof window === 'undefined') {
    return { lang: 'en', currency: 'USD', licenseKey: '', isActivated: false };
  }
  
  let storedLang = localStorage.getItem('engazia_global_lang');
  let storedCurrency = localStorage.getItem('engazia_global_currency');

  if (!storedLang) {
    const browserLang = navigator.language ? navigator.language.slice(0, 2).toLowerCase() : 'en';
    if (supportedLangs.includes(browserLang)) {
      storedLang = browserLang;
    } else {
      storedLang = 'en';
    }
    localStorage.setItem('engazia_global_lang', storedLang);
  }

  if (!storedCurrency) {
    if (storedLang === 'ar') {
      storedCurrency = 'SAR';
    } else if (storedLang === 'fr' || storedLang === 'de') {
      storedCurrency = 'EUR';
    } else if (storedLang === 'tr') {
      storedCurrency = 'TRY';
    } else {
      storedCurrency = 'USD';
    }
    localStorage.setItem('engazia_global_currency', storedCurrency);
  }

  const licenseKey = localStorage.getItem('merchant_license_key') || '';
  const isActivated = !!licenseKey;

  return { lang: storedLang, currency: storedCurrency, licenseKey, isActivated };
};

const setGlobalConfig = (lang: string, currency: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('engazia_global_lang', lang);
    localStorage.setItem('engazia_global_currency', currency);
  }
};

interface ToolInfo {
  id: string;
  title: string;
  desc: string;
  icon: string;
  link: string;
}

interface Translations {
  [key: string]: {
    brandName: string;
    live: string;
    activate: string;
    deactivate: string;
    keyPlaceholder: string;
    upgradeBtn: string;
    heroTitle: string;
    heroDesc: string;
    runTool: string;
    footerDesc: string;
    platform: string;
    allTools: string;
    updates: string;
    pricing: string;
    support: string;
    faq: string;
    terms: string;
    privacy: string;
    rights: string;
    promoTitle: string;
    promoDesc: string;
    promoOld: string;
    promoPer: string;
    upgradeNowBtn: string;
    tools: ToolInfo[];
  };
}

const translations: Translations = {
  ar: {
    brandName: 'إنجازيا',
    live: 'النظام مفعل',
    activate: 'تفعيل',
    deactivate: 'إلغاء',
    keyPlaceholder: 'أدخل مفتاح الترخيص...',
    upgradeBtn: '⚡ ترقية اشتراك',
    heroTitle: 'منصة إنجازيا ULTRA MAX',
    heroDesc: 'الترسانة السحابية المتكاملة لرواد التجارة الإلكترونية، 16 أداة تغنيك عن كل الاشتراكات الأخرى.',
    runTool: 'تشغيل الأداة',
    footerDesc: 'المنصة السحابية الأولى لتمكين تجار التجارة الإلكترونية. أدوات ذكية، قرارات دقيقة، أرباح مضاعفة تغنيك عن جميع الاشتراكات الأخرى.',
    platform: 'المنصة',
    allTools: 'جميع الأدوات',
    updates: 'التحديثات الجديدة',
    pricing: 'أسعار الباقات',
    support: 'الدعم والمساعدة',
    faq: 'الأسئلة الشائعة',
    terms: 'شروط الاستخدام',
    privacy: 'سياسة الخصوصية',
    rights: 'جميع الحقوق محفوظة © 2026 منصة إنجازيا لتمكين التجارة الإلكترونية',
    promoTitle: '🔥 عرض لفترة محدودة - احصل على النسخة الشاملة الآن!',
    promoDesc: 'اشترك اليوم مقابل',
    promoOld: 'بدلاً من',
    promoPer: 'شهرياً',
    upgradeNowBtn: '🚀 ترقية حسابك الآن بخصم 65%',
    tools: [
      { id: 'whatsapp', title: 'إدارة عملاء واتساب والمبيعات', desc: 'إدارة السلال المتروكة، إرسال روابط الدفع، وتصنيف عملاء الـ VIP.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'حاسبة أرباح ونقاط التعادل', desc: 'احسب صافي أرباح منتجك بدقة بعد خصم التكاليف والإعلانات.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'مولد الفواتير وسندات القبض', desc: 'أنشئ فواتير مبيعات نظامية واحترافية وجهزها للإرسال الفوري.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'حاسبة وتحليل خسائر المرتجعات', desc: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'مدير المصاريف والنفقات', desc: 'تتبع مصاريف المتجر الثابتة والمتغيرة لضبط التدفق النقدي.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'مولد السياسات القانونية للمتجر', desc: 'أنشئ صفحات الاستبدال، الاسترجاع، والخصوصية المتوافقة نظامياً.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'محلل عائد الإنفاق الإعلاني', desc: 'قس بدقة أداء إعلانات سناب وتيك توك وهل هي رابحة أم خاسرة.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'حاسبة رسوم بوابات الدفع', desc: 'احسب نسبة بوابات الدفع (تاب، مدى، تابي) وتأثيرها على الأرباح.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'مولد النصوص التسويقية والإعلانات', desc: 'اصنع سكربتات تيك توك وإعلانات جذابة لزيادة مبيعات منتجاتك.', icon: '✍', link: '/hub/copy' },
      { id: 'promos', title: 'ممول وأكواد خصم المتاجر', desc: 'أدر وأنشئ أكواد الخصم السريعة لتحفيز العملاء المترددين.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'مدير تتبع الشحنات والتوصيل', desc: 'تابع حالات الشحنات وحل مشاكل استفسارات العملاء اليومية.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'تنسيق وتنظيف بيانات الإكسل', desc: 'نظف قوائم المنتجات والأسعار العشوائية وحولها لملفات مرتبة.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'صانع روابط واتساب المباشرة', desc: 'أنشئ روابط مخصصة برسائل جاهزة للبايو في تيك توك وإعلاناتك.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'أداة طلب وتقييمات العملاء', desc: 'ارسل رسائل تلقائية للعملاء بعد الاستلام لجمع التقييمات وبناء الثقة.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'ردود خدمة العملاء السريعة', desc: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'مكتبة أسرار وحيل نمو المتاجر', desc: 'استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء.', icon: '💡', link: '/hub/tips' }
    ]
  },
  en: {
    brandName: 'Engazia',
    live: 'System Active',
    activate: 'Activate',
    deactivate: 'Reset',
    keyPlaceholder: 'Enter license key...',
    upgradeBtn: '⚡ Upgrade Plan',
    heroTitle: 'ENGAZIA ULTRA MAX Platform',
    heroDesc: 'The ultimate cloud ecosystem for e-commerce entrepreneurs, 16 powerful tools replacing all other subscriptions.',
    runTool: 'Launch Tool',
    footerDesc: 'The premier cloud platform for e-commerce merchants. Smart tools, accurate decisions, and multiplied profits.',
    platform: 'Platform',
    allTools: 'All Tools',
    updates: 'New Updates',
    pricing: 'Pricing Plans',
    support: 'Support',
    faq: 'FAQ',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    rights: 'All rights reserved © 2026 Engazia Platform',
    promoTitle: '🔥 Limited Time Offer - Get Pro Access Now!',
    promoDesc: 'Subscribe today for',
    promoOld: 'instead of',
    promoPer: 'per month',
    upgradeNowBtn: '🚀 Upgrade Account with 65% Off',
    tools: [
      { id: 'whatsapp', title: 'WhatsApp CRM & Sales', desc: 'Manage abandoned carts, payment links, and VIP customers.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'Profit & Break-even Calculator', desc: 'Calculate exact net profits after ad and product costs.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'Invoice & Receipt Generator', desc: 'Generate professional sales invoices instantly.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'Returns & Loss Analyzer', desc: 'Measure return impact on monthly net profits.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'Expenses Manager', desc: 'Track fixed and variable store expenses.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'Store Legal Policies Generator', desc: 'Create compliant return and privacy policies.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'Ad Spend ROAS Analyzer', desc: 'Measure exact performance of your ad campaigns.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'Payment Gateway Fees Calculator', desc: 'Calculate gateway fees impact on profit margins.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'Marketing Copy & Ad Generator', desc: 'Create TikTok scripts and converting ad copy.', icon: '✍', link: '/hub/copy' },
      { id: 'promos', title: 'Discount Promos Manager', desc: 'Manage and create instant discount codes.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'Shipping & Delivery Tracker', desc: 'Track shipments and resolve customer inquiries.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'Excel Data Cleaner & Formatter', desc: 'Clean product lists and pricing formats.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'WhatsApp Direct Link Maker', desc: 'Create custom WhatsApp bio links.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'Customer Reviews Collector', desc: 'Send automated post-delivery review requests.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'Quick Support Templates', desc: 'Copy professional ready-made support replies.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'Store Growth Secrets Library', desc: 'Exclusive growth and conversion strategies.', icon: '💡', link: '/hub/tips' }
    ]
  },
  fr: {
    brandName: 'Engazia',
    live: 'Système Actif',
    activate: 'Activer',
    deactivate: 'Réinitialiser',
    keyPlaceholder: 'Entrer la clé...',
    upgradeBtn: '⚡ Mettre à niveau',
    heroTitle: 'Plateforme ENGAZIA ULTRA MAX',
    heroDesc: 'L\'écosystème cloud ultime pour les e-commerçants, 16 outils puissants remplaçant tous les abonnements.',
    runTool: 'Lancer l\'outil',
    footerDesc: 'La première plateforme cloud pour dynamiser les marchands e-commerce.',
    platform: 'Plateforme',
    allTools: 'Tous les outils',
    updates: 'Mises à jour',
    pricing: 'Tarifs',
    support: 'Support',
    faq: 'FAQ',
    terms: 'Conditions',
    privacy: 'Confidentialité',
    rights: 'Tous droits réservés © 2026 Engazia',
    promoTitle: '🔥 Offre Limitée - Obtenez l\'accès Pro maintenant !',
    promoDesc: 'Abonnez-vous aujourd\'hui pour',
    promoOld: 'au lieu de',
    promoPer: 'par mois',
    upgradeNowBtn: '🚀 Mettre à niveau avec 65% de réduction',
    tools: [
      { id: 'whatsapp', title: 'CRM WhatsApp & Ventes', desc: 'Gérez les paniers abandonnés et clients VIP.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'Calculateur de profits', desc: 'Calculez vos bénéfices nets exacts.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'Générateur de factures', desc: 'Générez des factures professionnelles instantanément.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'Analyseur de retours', desc: 'Mesurez l\'impact des retours sur vos profits.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'Gestionnaire de dépenses', desc: 'Suivez les dépenses fixes et variables.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'Générateur de politiques', desc: 'Créez des politiques de retour conformes.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'Analyseur ROAS', desc: 'Mesurez la performance de vos pubs.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'Calculateur de frais', desc: 'Calculez l\'impact des frais de passerelle.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'Générateur de texte marketing', desc: 'Créez des textes publicitaires performants.', icon: '✍️', link: '/hub/copy' },
      { id: 'promos', title: 'Gestionnaire de promos', desc: 'Créez des codes de réduction instantanés.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'Suivi des expéditions', desc: 'Suivez les envois et résolvez les requêtes.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'Nettoyeur de données Excel', desc: 'Nettoyez vos listes de prix et produits.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'Générateur de lien WhatsApp', desc: 'Créez des liens bio WhatsApp personnalisés.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'Collecteur d\'avis', desc: 'Envoyez des demandes d\'avis automatisées.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'Modèles de support', desc: 'Copiez des réponses de support prêtes à l\'emploi.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'Bibliothèque de croissance', desc: 'Stratégies de croissance et conversion.', icon: '💡', link: '/hub/tips' }
    ]
  },
  es: {
    brandName: 'Engazia',
    live: 'Sistema Activo',
    activate: 'Activar',
    deactivate: 'Restablecer',
    keyPlaceholder: 'Ingrese clave...',
    upgradeBtn: '⚡ Actualizar plan',
    heroTitle: 'Plataforma ENGAZIA ULTRA MAX',
    heroDesc: 'El ecosistema en la nube definitivo para emprendedores de comercio electrónico, 16 potentes herramientas.',
    runTool: 'Iniciar herramienta',
    footerDesc: 'La plataforma en nube líder para comerciantes de comercio electrónico.',
    platform: 'Plataforma',
    allTools: 'Todas las herramientas',
    updates: 'Actualizaciones',
    pricing: 'Precios',
    support: 'Soporte',
    faq: 'FAQ',
    terms: 'Términos',
    privacy: 'Privacidad',
    rights: 'Todos los derechos reservados © 2026 Engazia',
    promoTitle: '🔥 ¡Oferta por tiempo limitado - Obtén acceso Pro ahora!',
    promoDesc: 'Suscríbete hoy por',
    promoOld: 'en lugar de',
    promoPer: 'al mes',
    upgradeNowBtn: '🚀 Actualizar cuenta con 65% de descuento',
    tools: [
      { id: 'whatsapp', title: 'CRM de WhatsApp y Ventas', desc: 'Gestiona carritos abandonados y clientes VIP.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'Calculadora de Beneficios', desc: 'Calcula beneficios netos exactos.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'Generador de Facturas', desc: 'Genera facturas de venta profesionales.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'Analizador de Devoluciones', desc: 'Mide el impacto en tus beneficios mensuales.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'Gestor de Gastos', desc: 'Controla gastos fijos y variables.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'Generador de Políticas', desc: 'Crea páginas de reembolso legales.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'Analizador ROAS', desc: 'Mide el rendimiento de tus anuncios.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'Calculadora de Comisiones', desc: 'Calcula comisiones de pasarelas de pago.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'Generador de Copys', desc: 'Crea guiones y anuncios persuasivos.', icon: '✍', link: '/hub/copy' },
      { id: 'promos', title: 'Gestor de Códigos Promocionales', desc: 'Crea cupones de descuento instantáneos.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'Rastreador de Envíos', desc: 'Sigue el estado de tus envíos.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'Limpiador de Datos Excel', desc: 'Limpia listas de precios y productos.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'Creador de Enlaces WhatsApp', desc: 'Crea enlaces directos personalizados.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'Recolector de Reseñas', desc: 'Solicita valoraciones automáticamente.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'Plantillas de Soporte', desc: 'Respuestas rápidas para atención al cliente.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'Secretos de Crecimiento', desc: 'Estrategias exclusivas para escalar ventas.', icon: '💡', link: '/hub/tips' }
    ]
  },
  tr: {
    brandName: 'Engazia',
    live: 'Sistem Aktif',
    activate: 'Etkinleştir',
    deactivate: 'Sıfırla',
    keyPlaceholder: 'Lisans anahtarı...',
    upgradeBtn: '⚡ Planı Yükselt',
    heroTitle: 'ENGAZIA ULTRA MAX Platformu',
    heroDesc: 'E-ticaret girişimcileri için nihai bulut ekosistemi, tüm aboneliklerin yerini alan 16 güçlü araç.',
    runTool: 'Aracı Başlat',
    footerDesc: 'E-ticaret satıcıları için lider bulut platformu.',
    platform: 'Platform',
    allTools: 'Tüm Araçlar',
    updates: 'Güncellemeler',
    pricing: 'Fiyatlandırma',
    support: 'Destek',
    faq: 'SSS',
    terms: 'Şartlar',
    privacy: 'Gizlilik',
    rights: 'Tüm hakları saklıdır © 2026 Engazia',
    promoTitle: '🔥 Sınırlı Süreli Teklif - Pro Erişimi Şimdi Alın!',
    promoDesc: 'Bugün abone olun:',
    promoOld: 'yerine',
    promoPer: 'aylık',
    upgradeNowBtn: '🚀 Hesabınızı %65 İndirimle Yükseltin',
    tools: [
      { id: 'whatsapp', title: 'WhatsApp CRM ve Satış', desc: 'Terk edilmiş sepetleri ve VIP müşterileri yönetin.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'Kâr ve Başa Baş Hesaplayıcı', desc: 'Net kârınızı tam olarak hesaplayın.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'Fatura Oluşturucu', desc: 'Profesyonel satış faturaları oluşturun.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'İade ve Kayıp Analizcisi', desc: 'İadelerin kârınıza etkisini ölçün.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'Gider Yöneticisi', desc: 'Mağaza giderlerini takip edin.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'Yasal Politika Oluşturucu', desc: 'Uyumlu iade ve gizlilik politikaları oluşturun.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'Reklam ROAS Analizcisi', desc: 'Reklam kampanyalarınızın performansını ölçün.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'Ödeme Ağ Geçidi Komisyon Hesaplayıcı', desc: 'Komisyon oranlarını hesaplayın.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'Pazarlama Metni Oluşturucu', desc: 'Dönüşüm oranını artıracak reklam metinleri yazın.', icon: '✍️', link: '/hub/copy' },
      { id: 'promos', title: 'İndirim Kuponu Yöneticisi', desc: 'Anında indirim kodları oluşturun.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'Kargo Takip Yöneticisi', desc: 'Kargo durumlarını takip edin.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'Excel Veri Temizleyici', desc: 'Ürün listelerini ve fiyatları düzenleyin.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'WhatsApp Direkt Bağlantı Oluşturucu', desc: 'Özel WhatsApp bağlantıları oluşturun.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'Müşteri Yorum Toplayıcı', desc: 'Teslimat sonrası otomatik değerlendirme isteyin.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'Hızlı Destek Yanıtları', desc: 'Hazır müşteri hizmetleri şablonları.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'Mağaza Büyüme Sırları', desc: 'Dönüşümü artıracak özel stratejiler.', icon: '💡', link: '/hub/tips' }
    ]
  },
  zh: {
    brandName: 'Engazia',
    live: '系统已激活',
    activate: '激活',
    deactivate: '重置',
    keyPlaceholder: '输入授权密钥...',
    upgradeBtn: '⚡ 升级高级版',
    heroTitle: 'ENGAZIA ULTRA MAX 平台',
    heroDesc: '电商创业者的终极云端生态系统，16款强大工具助您业务腾飞。',
    runTool: '启动工具',
    footerDesc: '面向电商商家的首选云平台。智能工具，精准决策。',
    platform: '平台',
    allTools: '所有工具',
    updates: '最新更新',
    pricing: '价格方案',
    support: '支持与帮助',
    faq: '常见问题',
    terms: '使用条款',
    privacy: '隐私政策',
    rights: '版权所有 © 2026 Engazia 平台',
    promoTitle: '🔥 限时优惠 - 立即获取高级版权限！',
    promoDesc: '今日订阅仅需',
    promoOld: '原价',
    promoPer: '每月',
    upgradeNowBtn: '🚀 立即升级账号享受 65% 折扣',
    tools: [
      { id: 'whatsapp', title: 'WhatsApp CRM 与销售', desc: '管理未付款购物车和VIP客户。', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: '利润与盈亏平衡计算器', desc: '精准计算扣除广告成本后的净利润。', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: '发票与收据生成器', desc: '立即生成专业的销售发票。', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: '退货损失分析器', desc: '评估退货对月度净利润的影响。', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: '店铺支出管理器', desc: '追踪固定与变动运营成本。', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: '法律政策生成器', desc: '创建符合规范的退换货与隐私政策。', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: '广告投资回报分析器', desc: '精准衡量广告投放效果是否盈利。', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: '支付网关手续费计算器', desc: '计算支付通道费率对利润的影响。', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: '营销文案与广告生成器', desc: '制作高转化率的广告脚本与文案。', icon: '✍️', link: '/hub/copy' },
      { id: 'promos', title: '折扣优惠券管理器', desc: '管理并创建促销折扣代码。', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: '物流配送追踪器', desc: '实时跟进包裹状态并解决物流问题。', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'Excel 数据清洗与整理', desc: '快速清理混乱的产品表格与价格。', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'WhatsApp 直链生成器', desc: '为社媒主页创建自定义直达链接。', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: '客户评价收集工具', desc: '自动发送收货后好评邀请。', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: '客服快捷回复模板', desc: '复制专业标准的客服常用回复。', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: '店铺爆单增长秘籍', desc: '独家提升转化率与复购率的策略。', icon: '💡', link: '/hub/tips' }
    ]
  },
  de: {
    brandName: 'Engazia',
    live: 'System Aktiv',
    activate: 'Aktivieren',
    deactivate: 'Zurücksetzen',
    keyPlaceholder: 'Lizenzschlüssel eingeben...',
    upgradeBtn: '⚡ Plan upgraden',
    heroTitle: 'ENGAZIA ULTRA MAX Plattform',
    heroDesc: 'Das ultimative Cloud-Ökosystem für E-Commerce-Unternehmer, 16 leistungsstarke Tools.',
    runTool: 'Tool starten',
    footerDesc: 'Die führende Cloud-Plattform für E-Commerce-Händler.',
    platform: 'Plattform',
    allTools: 'Alle Tools',
    updates: 'Updates',
    pricing: 'Preise',
    support: 'Support',
    faq: 'FAQ',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    rights: 'Alle Rechte vorbehalten © 2026 Engazia',
    promoTitle: '🔥 Zeitlich begrenztes Angebot - Jetzt Pro-Zugang sichern!',
    promoDesc: 'Abonnieren Sie heute für',
    promoOld: 'statt',
    promoPer: 'pro Monat',
    upgradeNowBtn: '🚀 Konto jetzt mit 65% Rabatt upgraden',
    tools: [
      { id: 'whatsapp', title: 'WhatsApp CRM & Verkauf', desc: 'Warenkörbe und VIP-Kunden verwalten.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'Gewinn- & Break-Even-Rechner', desc: 'Nettogewinne präzise berechnen.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'Rechnungsgenerator', desc: 'Professionelle Rechnungen sofort erstellen.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'Retouren-Analysator', desc: 'Auswirkungen von Retouren messen.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'Ausgabenmanager', desc: 'Fixe und variable Kosten im Blick behalten.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'Rechtsrichtlinien-Generator', desc: 'Konforme Widerrufsbelehrungen erstellen.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'ROAS-Analysator', desc: 'Werbeperformance exakt messen.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'Zahlungs-Gateway Gebührenrechner', desc: 'Transaktionsgebühren kalkulieren.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'Marketing-Text-Generator', desc: 'Verkaufsfördernde Werbetexte erstellen.', icon: '✍️', link: '/hub/copy' },
      { id: 'promos', title: 'Gutschein-Manager', desc: 'Rabattcodes unkompliziert verwalten.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'Versand-Tracker', desc: 'Sendungsstatus überwachen.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'Excel Datenbereinigung', desc: 'Produktlisten und Preise formatieren.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'WhatsApp Direktlink-Ersteller', desc: 'Individuelle Chat-Links generieren.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'Kundenbewertungs-Tool', desc: 'Automatisierte Bewertungsanfragen versenden.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'Support-Antwortvorlagen', desc: 'Professionelle Kundenservice-Vorlagen.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'Wachstums-Geheimnisse', desc: 'Exklusive Strategien zur Umsatzsteigerung.', icon: '💡', link: '/hub/tips' }
    ]
  },
  id: {
    brandName: 'Engazia',
    live: 'Sistem Aktif',
    activate: 'Aktifkan',
    deactivate: 'Atur Ulang',
    keyPlaceholder: 'Masukkan kunci lisensi...',
    upgradeBtn: '⚡ Upgrade Paket',
    heroTitle: 'Platform ENGAZIA ULTRA MAX',
    heroDesc: 'Ekosistem cloud ultimate untuk wirausahawan e-commerce, 16 alat canggih.',
    runTool: 'Buka Alat',
    footerDesc: 'Platform cloud terkemuka untuk pedagang e-commerce.',
    platform: 'Platform',
    allTools: 'Semua Alat',
    updates: 'Pembaruan',
    pricing: 'Harga',
    support: 'Dukungan',
    faq: 'FAQ',
    terms: 'Ketentuan',
    privacy: 'Privasi',
    rights: 'Hak cipta dilindungi © 2026 Engazia',
    promoTitle: '🔥 Penawaran Terbatas - Dapatkan Akses Pro Sekarang!',
    promoDesc: 'Berlangganan hari ini seharga',
    promoOld: 'alih-alih',
    promoPer: 'per bulan',
    upgradeNowBtn: '🚀 Upgrade Akun dengan Diskon 65%',
    tools: [
      { id: 'whatsapp', title: 'CRM & Penjualan WhatsApp', desc: 'Kelola keranjang terbengkalai dan pelanggan VIP.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'Kalkulator Laba & Titik Impas', desc: 'Hitung laba bersih akurat setelah biaya iklan.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'Pembuat Faktur & Kwitansi', desc: 'Buat faktur penjualan profesional secara instan.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'Analisis Kerugian Retur', desc: 'Ukur dampak pengembalian terhadap laba bulanan.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'Manajer Pengeluaran', desc: 'Lacak pengeluaran toko tetap dan variabel.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'Pembuat Kebijakan Toko', desc: 'Buat halaman kebijakan privasi dan pengembalian.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'Analisis ROAS Iklan', desc: 'Ukur kinerja kampanye iklan dengan tepat.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'Kalkulator Biaya Gateway Pembayaran', desc: 'Hitung dampak biaya pembayaran.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'Pembuat Salinan Pemasaran', desc: 'Buat skrip iklan dan salinan yang menghasilkan.', icon: '✍️', link: '/hub/copy' },
      { id: 'promos', title: 'Manajer Promo Diskon', desc: 'Kelola dan buat kode diskon instan.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'Pelacak Pengiriman & Logistik', desc: 'Lacak pengiriman dan atasi pertanyaan.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'Pembersih Data Excel', desc: 'Bersihkan daftar produk dan harga acak.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'Pembuat Tautan Langsung WhatsApp', desc: 'Buat tautan khusus untuk bio TikTok/Iklan.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'Kolektor Ulasan Pelanggan', desc: 'Kirim pesan otomatis untuk kumpulkan ulasan.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'Balasan Cepat Layanan Pelanggan', desc: 'Salin balasan dukungan profesional siap pakai.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'Perpustakaan Rahasia Pertumbuhan', desc: 'Strategi eksklusif untuk tingkatkan konversi.', icon: '💡', link: '/hub/tips' }
    ]
  }
};

export default function EngaziaHomeHub() {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/80ff492a-01eb-4455-b1a8-96e12ab72562';

  const getConvertedPrice = (usdAmount: number) => {
    let rate = 3.75;
    let symbol = 'ر.س';
    
    if (currentCurrency === 'USD') { rate = 1; symbol = '$'; }
    else if (currentCurrency === 'AED') { rate = 3.67; symbol = 'د.إ'; }
    else if (currentCurrency === 'EUR') { rate = 0.92; symbol = '€'; }
    else if (currentCurrency === 'GBP') { rate = 0.79; symbol = '£'; }
    else if (currentCurrency === 'TRY') { rate = 32.5; symbol = '₺'; }
    else if (currentCurrency === 'KWD') { rate = 0.31; symbol = 'د.ك'; }
    else if (currentCurrency === 'QAR') { rate = 3.64; symbol = 'ر.ق'; }
    
    const converted = (usdAmount * rate).toFixed(2);
    return `${converted} ${symbol}`;
  };

  useEffect(() => {
    const config = getInitialConfig();
    setCurrentLang(config.lang);
    setCurrentCurrency(config.currency);
    setLicenseKeyInput(config.licenseKey);
    setIsActivated(config.isActivated);
  }, []);

  const handleLanguageChange = (lang: string) => {
    let newCurrency = currentCurrency;
    if (lang === 'ar') newCurrency = 'SAR';
    else if (lang === 'fr' || lang === 'de') newCurrency = 'EUR';
    else if (lang === 'tr') newCurrency = 'TRY';
    else if (lang === 'en' || lang === 'es' || lang === 'zh' || lang === 'id') newCurrency = 'USD';

    setCurrentLang(lang);
    setCurrentCurrency(newCurrency);
    setGlobalConfig(lang, newCurrency);
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrentCurrency(curr);
    setGlobalConfig(currentLang, curr);
  };

  const handleActivateLicense = () => {
    if (!licenseKeyInput.trim()) {
      alert('الرجاء إدخال مفتاح الاشتراك الصحيح.');
      return;
    }
    const cleanKey = licenseKeyInput.trim();
    localStorage.setItem('merchant_license_key', cleanKey);
    setIsActivated(true);
    alert('✨ تم تفعيل النظام والمزامنة السحابية بنجاح عبر كل الأدوات!');
  };

  const handleDeactivateLicense = () => {
    localStorage.removeItem('merchant_license_key');
    setLicenseKeyInput('');
    setIsActivated(false);
    alert('⚠️ تم إلغاء تفعيل الاشتراك.');
  };

  const t = translations[currentLang] || translations.en;
  const isRtl = currentLang === 'ar';

  return (
    <div className="hub-container" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .hub-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 40px; }
        
        /* تم تقليص المساحات الفارغة وجعل الـ Navbar متناسقاً ومتلاصقاً بذكاء */
        .navbar { max-width: 1250px; margin: 0 auto 25px; padding: 12px 24px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #cbd5e1; flex-wrap: nowrap; gap: 10px; }
        .brand { font-size: 22px; font-weight: 900; color: #0f172a; white-space: nowrap; }
        .brand span { color: #4f46e5; }
        
        .nav-controls { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; }
        .select-control { padding: 6px 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px; color: #1e293b; outline: none; cursor: pointer; }
        
        /* توسيع حقل إدخال مفتاح التفعيل ليصبح أطول وأوضح */
        .license-box { display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 4px 8px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .license-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 10px; font-size: 12px; outline: none; width: 170px; font-family: 'Tajawal, sans-serif'; background: #fff; color: #0f172a; }
        .license-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79,70,229,0.1); }
        
        .upgrade-btn { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff !important; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(79,70,229,0.2); white-space: nowrap; }
        
        /* إعلان الترقية (يختفي فور تفعيل الاشتراك) */
        .promo-banner { max-width: 1250px; margin: 0 auto 35px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff; border-radius: 16px; padding: 22px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 12px 30px rgba(79,70,229,0.3); border: 1px solid rgba(255,255,255,0.25); position: relative; overflow: hidden; }
        .promo-banner::before { content: ''; position: absolute; top: -60px; right: -60px; width: 180px; height: 180px; background: rgba(255,255,255,0.12); border-radius: 50%; pointer-events: none; }
        .promo-content { display: flex; flex-direction: column; gap: 8px; z-index: 1; }
        .promo-heading { font-size: 18px; font-weight: 900; display: flex; align-items: center; gap: 8px; letter-spacing: -0.3px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .promo-text { font-size: 14px; font-weight: 700; opacity: 0.98; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .price-tag-new { background: #10b981; color: #fff; padding: 3px 10px; border-radius: 8px; font-weight: 900; font-size: 15px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4); }
        .price-tag-old { text-decoration: line-through; opacity: 0.75; font-size: 12.5px; font-weight: 800; }
        .promo-btn { background: #fff; color: #4f46e5; border: none; padding: 12px 26px; border-radius: 12px; font-weight: 900; font-size: 14px; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 6px 15px rgba(0,0,0,0.15); z-index: 1; }
        .promo-btn:hover { background: #f8fafc; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }

        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #4f46e5; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }

        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 60px; }
        
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; text-align: start; }
        
        .card:hover { transform: translateY(-5px); border-color: #4f46e5; box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.15); z-index: 10; }

        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .card-icon { font-size: 28px; background: #f1f5f9; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 10px; transition: all 0.3s ease; }
        .card:hover .card-icon { background: #e0e7ff; }
        
        .card-badge { background: #f1f5f9; color: #475569; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 8px; }
        .card:hover .card-badge { color: #4f46e5; background: #e0e7ff; }

        .card h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 10px; line-height: 1.4; transition: color 0.3s ease; }
        .card:hover h3 { color: #4f46e5; }
        
        .card p { color: #64748b; font-size: 14px; line-height: 1.6; font-weight: 500; margin-bottom: 24px; min-height: 48px; }
        
        .card-btn { background: #e0e7ff; color: #4f46e5; text-align: center; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .card:hover .card-btn { background: #4f46e5; color: #ffffff; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }

        .footer { max-width: 1250px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 40px; color: #f8fafc; border: 1px solid #1e293b; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); text-align: start; }
        .footer-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 30px; margin-bottom: 30px; border-bottom: 1px solid #334155; padding-bottom: 30px; }
        .footer-brand { max-width: 400px; }
        .footer-brand h3 { font-size: 24px; font-weight: 900; margin-bottom: 15px; color: #ffffff; }
        .footer-brand h3 span { color: #818cf8; }
        .footer-brand p { color: #94a3b8; font-size: 14px; line-height: 1.8; font-weight: 500; }
        .footer-links { display: flex; gap: 60px; }
        .links-column h4 { color: #ffffff; font-size: 16px; font-weight: 800; margin-bottom: 20px; }
        .links-column ul { list-style: none; padding: 0; margin: 0; }
        .links-column ul li { margin-bottom: 12px; }
        .links-column ul li a { color: #94a3b8 !important; font-size: 14px; font-weight: 500; transition: color 0.2s ease; }
        .links-column ul li a:hover { color: #818cf8 !important; }
        .footer-bottom { text-align: center; color: #64748b; font-size: 14px; font-weight: 500; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } .footer-content { flex-direction: column; } }
        @media(max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 28px; } .footer-links { flex-direction: column; gap: 30px; } }
      `}</style>

      {/* شريط التحكم العلوي */}
      <div className="navbar">
        <div className="brand">{t.brandName}</div>

        <div className="nav-controls">
          <select className="select-control" value={currentLang} onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="ar">العربية 🇸🇦</option>
            <option value="en">English 🇬🇧</option>
            <option value="fr">Français 🇫🇷</option>
            <option value="es">Español 🇪🇸</option>
            <option value="tr">Türkçe 🇹🇷</option>
            <option value="zh">中文 🇨🇳</option>
            <option value="de">Deutsch 🇩🇪</option>
            <option value="id">Bahasa 🇮🇩</option>
          </select>

          <select className="select-control" value={currentCurrency} onChange={(e) => handleCurrencyChange(e.target.value)}>
            <option value="SAR">SAR (ر.س)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="TRY">TRY (₺)</option>
            <option value="KWD">KWD (د.ك)</option>
            <option value="QAR">QAR (ر.ق)</option>
          </select>

          <div className="license-box">
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>🔑 PRO:</span>
            {isActivated ? (
              <>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>{t.live} ✓</span>
                <button 
                  onClick={handleDeactivateLicense}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '3px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                  title="إلغاء التفعيل للاختبار"
                >
                  {t.deactivate}
                </button>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  className="license-input"
                  placeholder={t.keyPlaceholder} 
                  value={licenseKeyInput} 
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                />
                <button 
                  onClick={handleActivateLicense}
                  style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', whiteSpace: 'nowrap' }}
                >
                  {t.activate}
                </button>
              </>
            )}
          </div>

          {!isActivated && (
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="upgrade-btn">
              {t.upgradeBtn}
            </a>
          )}
        </div>
      </div>

      {/* إعلان الترقية (يختفي تماماً بعد الاشتراك) */}
      {!isActivated && (
        <div className="promo-banner">
          <div className="promo-content">
            <div className="promo-heading">{t.promoTitle}</div>
            <div className="promo-text">
              <span>{t.promoDesc}</span>
              <span className="price-tag-new">{getConvertedPrice(9.99)}</span>
              <span>{t.promoPer}</span>
              <span className="price-tag-old">({t.promoOld} {getConvertedPrice(29)})</span>
            </div>
          </div>
          <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
            <button className="promo-btn">
              {t.upgradeNowBtn}
            </button>
          </a>
        </div>
      )}

      <div className="hero">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroDesc}</p>
      </div>

      <div className="cards-grid">
        {t.tools.map((tool, index) => (
          <Link href={tool.link} key={tool.id} className="card clean-link">
            <div>
              <div className="card-top">
                <div className="card-icon">{tool.icon}</div>
                <span className="card-badge">#{index + 1}</span>
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </div>
            <div className="card-btn">
              <span>{t.runTool}</span>
              <span>{isRtl ? '←' : '→'}</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>{t.brandName}</h3>
            <p>{t.footerDesc}</p>
          </div>
          <div className="footer-links">
            <div className="links-column">
              <h4>{t.platform}</h4>
              <ul>
                <li><a href="#">{t.allTools}</a></li>
                <li><a href="#">{t.updates}</a></li>
                <li><a href="#">{t.pricing}</a></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{t.support}</h4>
              <ul>
                <li><a href="#">{t.support}</a></li>
                <li><a href="#">{t.faq}</a></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{t.terms}</h4>
              <ul>
                <li><a href="#">{t.terms}</a></li>
                <li><a href="#">{t.privacy}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.rights}</p>
        </div>
      </footer>
    </div>
  );
}
