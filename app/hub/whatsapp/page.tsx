'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface TimelineLog {
  id: string;
  date: string;
  action: string;
  note: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  orderNumber: string;
  category: string;
  status: string;
  responseState?: string;
  amount: string;
  note: string;
  date: string;
  lastContactDate?: string;
  timeline?: TimelineLog[];
}

interface TagConfig {
  name: string;
  bg: string;
  color: string;
  isSale: boolean;
}

interface StatusConfig {
  name: string;
  bg: string;
  color: string;
}

interface ResponseStateConfig {
  name: string;
  bg: string;
  color: string;
}

interface Template {
  id: number;
  title: string;
  text: string;
}

// قاموس الترجمة الشامل والدقيق لجميع لغات المنصة الـ 8
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: '← العودة لوحة التحكم',
    titleMain: 'نظام إدارة علاقات العملاء',
    titleSub: 'واتساب CRM',
    desc: 'النظام الأذكى لإدارة عملاء التجارة الإلكترونية وأتمتة المراسلات',
    tabDashboard: '📊 لوحة القيادة',
    tabAnalytics: '📈 التحليلات المتقدمة',
    tabCrm: '👥 إدارة العملاء',
    tabMessaging: '💬 المراسلات والحملات',
    tabTags: '⚙️ الإعدادات',
    salesTitle: 'إجمالي المبيعات الفعلية',
    totalCustomers: 'إجمالي العملاء',
    newCustomerTitle: '➕ تسجيل عميل جديد',
    nameLabel: 'اسم العميل',
    phoneLabel: 'رقم الجوال (10 أرقام على الأقل)',
    orderNumLabel: 'رقم الطلب (#)',
    categoryLabel: 'التصنيف',
    statusLabel: 'حالة العميل',
    responseStateLabel: '💬 حالة الرد',
    amountLabel: 'المشتريات',
    noteLabel: 'ملاحظات العميل',
    saveBtn: 'حفظ وإضافة العميل',
    searchPlaceholder: '🔍 بحث بالاسم، الجوال، أو رقم الطلب...',
    importBtn: '📤 استيراد CSV',
    exportBtn: '📥 تصدير Excel',
    actions: 'الإجراءات',
    settingsIdentity: '🛍 إعدادات هوية المتجر',
    storeNameLabel: 'اسم المتجر',
    storeLogoBtn: '🖼 اختر صورة الشعار من جهازك',
    backupBox: '💾 النسخ الاحتياطي واستعادة البيانات',
    downloadBackup: '📥 تحميل نسخة احتياطية (JSON)',
    restoreBackup: '♻️️ استعادة البيانات من ملف',
    filterByTime: '📅 فلترة حسب الفترة الزمنية:',
    filterAllTime: 'كل الوقت',
    filterToday: 'اليوم',
    filterThisWeek: 'هذا الأسبوع',
    filterThisMonth: 'هذا الشهر',
    perfIndicators: 'مؤشرات الأداء المباشرة',
    latestCustomers: 'أحدث العملاء تسجيلاً',
    dealSuccessRate: '📊 نسبة إتمام الصفقات',
    pendingResponses: '⏳ العملاء بانتظار الرد',
    avgCustomerValue: '💰 متوسط قيمة العميل (LTV)',
    categoryDistribution: '🎯 توزيع الحالات والنسب المئوية للتصنيفات',
    singleMsgMode: 'رسالة لعميل محدد',
    broadcastMsgMode: 'حملة جماعية (طابور)',
    targetCustomerData: '1. بيانات العميل المستهدف',
    searchCrmPlaceholder: 'اكتب اسم العميل لجلبه تلقائياً...',
    selectTemplateTitle: '2. اختر أو صمم رسالتك',
    generateMsgBtn: '⚡ توليد ومعاينة الرسالة',
    copyOnlyBtn: '📋 نسخ فقط',
    sendWaBtn: '🟢 إرسال عبر واتساب (Wa.me)',
    storeLogoLabel: 'شعار المتجر (صورة من جهاز الكمبيوتر)',
    generalSysSettings: '⚡ إعدادات النظام العامة',
    defaultDiscountLabel: 'كود الخصم الافتراضي',
    templatesTitle: '📝 قوالب الرسائل الجاهزة',
    templateTitleLabel: 'عنوان القالب (للتنظيم)',
    templateTextLabel: 'نص الرسالة (المتغيرات المدعومة: [الاسم]، [الطلب]، [إضافي])',
    saveTemplateBtn: '💾 حفظ القالب في النظام',
    customizeStatusTitle: '📌 تخصيص حالات العملاء',
    customizeRespTitle: '💬 تخصيص حالات الرد',
    customizeCatTitle: '🏷️ تخصيص تصنيفات وحالات العملاء',
    upgradePro: '⚡ ترقية / اشتراك PRO',
    subscriptionKey: '🔑 الاشتراك:',
    activated: 'مفعل ✓',
    activateBtn: 'تفعيل'
  },
  en: {
    back: '← Back to Dashboard',
    titleMain: 'Customer Relationship Management',
    titleSub: 'WhatsApp CRM',
    desc: 'The smartest system for e-commerce customer management and messaging automation',
    tabDashboard: '📊 Dashboard',
    tabAnalytics: '📈 Advanced Analytics',
    tabCrm: '👥 CRM & Contacts',
    tabMessaging: '💬 Messaging & Campaigns',
    tabTags: '⚙️ Settings',
    salesTitle: 'Total Actual Sales',
    totalCustomers: 'Total Customers',
    newCustomerTitle: '➕ Register New Customer',
    nameLabel: 'Customer Name',
    phoneLabel: 'Phone Number (At least 10 digits)',
    orderNumLabel: 'Order Number (#)',
    categoryLabel: 'Category',
    statusLabel: 'Customer Status',
    responseStateLabel: '💬 Response State',
    amountLabel: 'Purchases',
    noteLabel: 'Customer Notes',
    saveBtn: 'Save & Add Customer',
    searchPlaceholder: '🔍 Search by name, phone, or order #...',
    importBtn: '📤 Import CSV',
    exportBtn: '📥 Export Excel',
    actions: 'Actions',
    settingsIdentity: '🛍 Store Identity Settings',
    storeNameLabel: 'Store Name',
    storeLogoBtn: '🖼 Choose Logo from Device',
    backupBox: '💾 Backup & Restore Data',
    downloadBackup: '📥 Download Backup (JSON)',
    restoreBackup: '♻️ Restore Data from File',
    filterByTime: '📅 Filter by Time Range:',
    filterAllTime: 'All Time',
    filterToday: 'Today',
    filterThisWeek: 'This Week',
    filterThisMonth: 'This Month',
    perfIndicators: 'Live Performance Indicators',
    latestCustomers: 'Latest Registered Customers',
    dealSuccessRate: '📊 Deal Success Rate',
    pendingResponses: '⏳ Pending Responses',
    avgCustomerValue: '💰 Customer Lifetime Value (LTV)',
    categoryDistribution: '🎯 Category Distribution & Percentages',
    singleMsgMode: 'Single Customer Message',
    broadcastMsgMode: 'Broadcast Campaign (Queue)',
    targetCustomerData: '1. Target Customer Data',
    searchCrmPlaceholder: 'Type customer name to fetch automatically...',
    selectTemplateTitle: '2. Select or Design Message',
    generateMsgBtn: '⚡ Generate & Preview Message',
    copyOnlyBtn: '📋 Copy Only',
    sendWaBtn: '🟢 Send via WhatsApp (Wa.me)',
    storeLogoLabel: 'Store Logo (Image from PC)',
    generalSysSettings: '⚡ General System Settings',
    defaultDiscountLabel: 'Default Discount Code',
    templatesTitle: '📝 Ready Message Templates',
    templateTitleLabel: 'Template Title',
    templateTextLabel: 'Message Text (Supported variables: [الاسم], [الطلب], [إضافي])',
    saveTemplateBtn: '💾 Save Template to System',
    customizeStatusTitle: '📌 Customize Customer Statuses',
    customizeRespTitle: '💬 Customize Response States',
    customizeCatTitle: '🏷️ Customize Customer Categories',
    upgradePro: '⚡ Upgrade / PRO Subscription',
    subscriptionKey: '🔑 Subscription:',
    activated: 'Activated ✓',
    activateBtn: 'Activate'
  },
  fr: {
    back: '← Retour au tableau de bord',
    titleMain: 'Gestion de la relation client',
    titleSub: 'WhatsApp CRM',
    desc: 'Le système le plus intelligent pour la gestion des clients e-commerce',
    tabDashboard: '📊 Tableau de bord',
    tabAnalytics: '📈 Analyses avancées',
    tabCrm: '👥 Clients',
    tabMessaging: '💬 Messagerie',
    tabTags: '⚙️ Paramètres',
    salesTitle: 'Ventes totales',
    totalCustomers: 'Clients totaux',
    newCustomerTitle: '➕ Ajouter un client',
    nameLabel: 'Nom du client',
    phoneLabel: 'Numéro de téléphone',
    orderNumLabel: 'Numéro de commande',
    categoryLabel: 'Catégorie',
    statusLabel: 'Statut',
    responseStateLabel: '💬 État de réponse',
    amountLabel: 'Achats',
    noteLabel: 'Notes',
    saveBtn: 'Enregistrer',
    searchPlaceholder: '🔍 Rechercher...',
    importBtn: '📤 Importer',
    exportBtn: '📥 Exporter',
    actions: 'Actions',
    settingsIdentity: '🛍 Paramètres de la boutique',
    storeNameLabel: 'Nom de la boutique',
    storeLogoBtn: '🖼 Choisir un logo',
    backupBox: '💾 Sauvegarde',
    downloadBackup: '📥 Télécharger la sauvegarde',
    restoreBackup: '♻️ Restaurer',
    filterByTime: '📅 Filtrer par période :',
    filterAllTime: 'Tout le temps',
    filterToday: 'Aujourd\'hui',
    filterThisWeek: 'Cette semaine',
    filterThisMonth: 'Ce mois-ci',
    perfIndicators: 'Indicateurs de performance en direct',
    latestCustomers: 'Derniers clients enregistrés',
    dealSuccessRate: '📊 Taux de réussite des transactions',
    pendingResponses: '⏳ Réponses en attente',
    avgCustomerValue: '💰 Valeur à vie du client (LTV)',
    categoryDistribution: '🎯 Distribution des catégories',
    singleMsgMode: 'Message client unique',
    broadcastMsgMode: 'Campagne de diffusion',
    targetCustomerData: '1. Données du client cible',
    searchCrmPlaceholder: 'Tapez le nom du client...',
    selectTemplateTitle: '2. Sélectionnez ou concevez un message',
    generateMsgBtn: '⚡ Générer et prévisualiser',
    copyOnlyBtn: '📋 Copier uniquement',
    sendWaBtn: '🟢 Envoyer via WhatsApp',
    storeLogoLabel: 'Logo du magasin',
    generalSysSettings: '⚡ Paramètres généraux du système',
    defaultDiscountLabel: 'Code de réduction par défaut',
    templatesTitle: '📝 Modèles de messages prêts',
    templateTitleLabel: 'Titre du modèle',
    templateTextLabel: 'Texte du message',
    saveTemplateBtn: '💾 Enregistrer le modèle',
    customizeStatusTitle: '📌 Personnaliser les statuts',
    customizeRespTitle: '💬 Personnaliser les états de réponse',
    customizeCatTitle: '🏷️ Personnaliser les catégories',
    upgradePro: '⚡ Mettre à niveau / PRO',
    subscriptionKey: '🔑 Abonnement :',
    activated: 'Activé ✓',
    activateBtn: 'Activer'
  },
  es: {
    back: '← Volver al panel',
    titleMain: 'Gestión de relaciones con clientes',
    titleSub: 'WhatsApp CRM',
    desc: 'El sistema más inteligente para la gestión de clientes de comercio electrónico',
    tabDashboard: '📊 Panel',
    tabAnalytics: '📈 Análisis avanzados',
    tabCrm: '👥 Clientes',
    tabMessaging: '💬 Mensajería',
    tabTags: '⚙️ Configuración',
    salesTitle: 'Ventas totales reales',
    totalCustomers: 'Clientes totales',
    newCustomerTitle: '➕ Registrar nuevo cliente',
    nameLabel: 'Nombre del cliente',
    phoneLabel: 'Número de teléfono',
    orderNumLabel: 'Número de pedido',
    categoryLabel: 'Categoría',
    statusLabel: 'Estado del cliente',
    responseStateLabel: '💬 Estado de respuesta',
    amountLabel: 'Compras',
    noteLabel: 'Notas del cliente',
    saveBtn: 'Guardar y agregar cliente',
    searchPlaceholder: '🔍 Buscar por nombre, teléfono...',
    importBtn: '📤 Importar CSV',
    exportBtn: '📥 Exportar Excel',
    actions: 'Acciones',
    settingsIdentity: '🛍 Configuración de identidad',
    storeNameLabel: 'Nombre de la tienda',
    storeLogoBtn: '🖼 Elegir logotipo',
    backupBox: '💾 Copia de seguridad y restauración',
    downloadBackup: '📥 Descargar copia de seguridad',
    restoreBackup: '♻️ Restaurar datos',
    filterByTime: '📅 Filtrar por período:',
    filterAllTime: 'Todo el tiempo',
    filterToday: 'Hoy',
    filterThisWeek: 'Esta semana',
    filterThisMonth: 'Este mes',
    perfIndicators: 'Indicadores de rendimiento en vivo',
    latestCustomers: 'Últimos clientes registrados',
    dealSuccessRate: '📊 Tasa de éxito de acuerdos',
    pendingResponses: '⏳ Respuestas pendientes',
    avgCustomerValue: '💰 Valor del cliente (LTV)',
    categoryDistribution: '🎯 Distribución de categorías',
    singleMsgMode: 'Mensaje de cliente único',
    broadcastMsgMode: 'Campaña de difusión',
    targetCustomerData: '1. Datos del cliente objetivo',
    searchCrmPlaceholder: 'Escribe el nombre del cliente...',
    selectTemplateTitle: '2. Seleccionar o diseñar mensaje',
    generateMsgBtn: '⚡ Generar y vista previa',
    copyOnlyBtn: '📋 Copiar solo',
    sendWaBtn: '🟢 Enviar por WhatsApp',
    storeLogoLabel: 'Logotipo de la tienda',
    generalSysSettings: '⚡ Configuración general del sistema',
    defaultDiscountLabel: 'Código de descuento predeterminado',
    templatesTitle: '📝 Plantillas de mensajes',
    templateTitleLabel: 'Título de la plantilla',
    templateTextLabel: 'Texto del mensaje',
    saveTemplateBtn: '💾 Guardar plantilla',
    customizeStatusTitle: '📌 Personalizar estados',
    customizeRespTitle: '💬 Personalizar estados de respuesta',
    customizeCatTitle: '🏷️ Personalizar categorías',
    upgradePro: '⚡ Actualizar / PRO',
    subscriptionKey: '🔑 Suscripción:',
    activated: 'Activado ✓',
    activateBtn: 'Activar'
  },
  tr: {
    back: '← Kontrol Paneline Dön',
    titleMain: 'Müşteri İlişkileri Yönetimi',
    titleSub: 'WhatsApp CRM',
    desc: 'E-ticaret müşteri yönetimi ve mesajlaşma otomasyonu için en akıllı sistem',
    tabDashboard: '📊 Kontrol Paneli',
    tabAnalytics: '📈 Gelişmiş Analitik',
    tabCrm: '👥 Müşteri Yönetimi',
    tabMessaging: '💬 Mesajlaşma ve Kampanyalar',
    tabTags: '⚙️ Ayarlar',
    salesTitle: 'Toplam Gerçekleşen Satış',
    totalCustomers: 'Toplam Müşteri',
    newCustomerTitle: '➕ Yeni Müşteri Kaydet',
    nameLabel: 'Müşteri Adı',
    phoneLabel: 'Telefon Numarası',
    orderNumLabel: 'Sipariş Numarası (#)',
    categoryLabel: 'Kategori',
    statusLabel: 'Müşteri Durumu',
    responseStateLabel: '💬 Yanıt Durumu',
    amountLabel: 'Alışveriş Tutarı',
    noteLabel: 'Müşteri Notları',
    saveBtn: 'Kaydet ve Müşteri Ekle',
    searchPlaceholder: '🔍 İsim, telefon veya sipariş no ile ara...',
    importBtn: '📤 CSV İçe Aktar',
    exportBtn: '📥 Excel Dışa Aktar',
    actions: 'İşlemler',
    settingsIdentity: '🛍 Mağaza Kimliği Ayarları',
    storeNameLabel: 'Mağaza Adı',
    storeLogoBtn: '🖼 Cihazdan Logo Seç',
    backupBox: '💾 Yedekleme ve Geri Yükleme',
    downloadBackup: '📥 Yedek İndir (JSON)',
    restoreBackup: '♻️ Dosyadan Geri Yükle',
    filterByTime: '📅 Zaman Aralığına Göre Filtrele:',
    filterAllTime: 'Tüm Zamanlar',
    filterToday: 'Bugün',
    filterThisWeek: 'Bu Hafta',
    filterThisMonth: 'Bu Ay',
    perfIndicators: 'Canlı Performans Göstergeleri',
    latestCustomers: 'Son Kayıt olan Müşteriler',
    dealSuccessRate: '📊 Anlaşma Başarı Oranı',
    pendingResponses: '⏳ Bekleyen Yanıtlar',
    avgCustomerValue: '💰 Müşteri Yaşam Boyu Değeri (LTV)',
    categoryDistribution: '🎯 Kategori Dağılımı ve Yüzdeleri',
    singleMsgMode: 'Tekil Müşteri Mesajı',
    broadcastMsgMode: 'Toplu Kampanya (Kuyruk)',
    targetCustomerData: '1. Hedef Müşteri Verileri',
    searchCrmPlaceholder: 'Müşteri adını yazın...',
    selectTemplateTitle: '2. Mesaj Seç veya Tasarla',
    generateMsgBtn: '⚡ Mesajı Oluştur ve Önizle',
    copyOnlyBtn: '📋 Sadece Kopyala',
    sendWaBtn: '🟢 WhatsApp ile Gönder',
    storeLogoLabel: 'Mağaza Logosu',
    generalSysSettings: '⚡ Genel Sistem Ayarları',
    defaultDiscountLabel: 'Varsayılan İndirim Kodu',
    templatesTitle: '📝 Hazır Mesaj Şablonları',
    templateTitleLabel: 'Şablon Başlığı',
    templateTextLabel: 'Mesaj Metni',
    saveTemplateBtn: '💾 Şablonu Kaydet',
    customizeStatusTitle: '📌 Müşteri Durumlarını Özelleştir',
    customizeRespTitle: '💬 Yanıt Durumlarını Özelleştir',
    customizeCatTitle: '🏷️ Müşteri Kategorilerini Özelleştir',
    upgradePro: '⚡ Yükselt / PRO Abone',
    subscriptionKey: '🔑 Abonelik:',
    activated: 'Aktif ✓',
    activateBtn: 'Etkinleştir'
  },
  zh: {
    back: '← 返回控制面板',
    titleMain: '客户关系管理系统',
    titleSub: 'WhatsApp CRM',
    desc: '最智能的电商客户管理与消息自动化系统',
    tabDashboard: '📊 仪表盘',
    tabAnalytics: '📈 高级分析',
    tabCrm: '👥 客户管理',
    tabMessaging: '💬 消息与营销',
    tabTags: '⚙️ 设置',
    salesTitle: '实际销售总额',
    totalCustomers: '客户总数',
    newCustomerTitle: '➕ 登记新客户',
    nameLabel: '客户姓名',
    phoneLabel: '手机号码',
    orderNumLabel: '订单号 (#)',
    categoryLabel: '分类',
    statusLabel: '客户状态',
    responseStateLabel: '💬 回复状态',
    amountLabel: '购买金额',
    noteLabel: '客户备注',
    saveBtn: '保存并添加客户',
    searchPlaceholder: '🔍 按姓名、手机号或订单号搜索...',
    importBtn: '📤 导入 CSV',
    exportBtn: '📥 导出 Excel',
    actions: '操作',
    settingsIdentity: '🛍 店铺标识设置',
    storeNameLabel: '店铺名称',
    storeLogoBtn: '🖼 从设备选择 Logo',
    backupBox: '💾 备份与恢复数据',
    downloadBackup: '📥 下载备份 (JSON)',
    restoreBackup: '♻️ 从文件恢复数据',
    filterByTime: '📅 按时间范围筛选：',
    filterAllTime: '所有时间',
    filterToday: '今天',
    filterThisWeek: '本周',
    filterThisMonth: '本月',
    perfIndicators: '实时业绩指标',
    latestCustomers: '最新登记客户',
    dealSuccessRate: '📊 交易成交率',
    pendingResponses: '⏳ 待回复',
    avgCustomerValue: '💰 客户生命周期价值 (LTV)',
    categoryDistribution: '🎯 分类分布与百分比',
    singleMsgMode: '单客户消息',
    broadcastMsgMode: '群发营销活动',
    targetCustomerData: '1. 目标客户数据',
    searchCrmPlaceholder: '输入客户姓名...',
    selectTemplateTitle: '2. 选择或设计消息',
    generateMsgBtn: '⚡ 生成并预览消息',
    copyOnlyBtn: '📋 仅复制',
    sendWaBtn: '🟢 通过 WhatsApp 发送',
    storeLogoLabel: '店铺 Logo',
    generalSysSettings: '⚡ 系统通用设置',
    defaultDiscountLabel: '默认优惠码',
    templatesTitle: '📝 快捷消息模板',
    templateTitleLabel: '模板标题',
    templateTextLabel: '消息正文',
    saveTemplateBtn: '💾 保存模板',
    customizeStatusTitle: '📌 自定义客户状态',
    customizeRespTitle: '💬 自定义回复状态',
    customizeCatTitle: '🏷️ 自定义客户分类',
    upgradePro: '⚡ 升级 / PRO 订阅',
    subscriptionKey: '🔑 订阅秘钥：',
    activated: '已激活 ✓',
    activateBtn: '激活'
  },
  de: {
    back: '← Zurück zum Dashboard',
    titleMain: 'Kundenbeziehungsmanagement',
    titleSub: 'WhatsApp CRM',
    desc: 'Das intelligenteste System für E-Commerce-Kundenmanagement',
    tabDashboard: '📊 Dashboard',
    tabAnalytics: '📈 Erweiterte Analysen',
    tabCrm: '👥 Kundenverwaltung',
    tabMessaging: '💬 Nachrichten & Kampagnen',
    tabTags: '⚙️ Einstellungen',
    salesTitle: 'Gesamtumsatz',
    totalCustomers: 'Kunden gesamt',
    newCustomerTitle: '➕ Neuen Kunden registrieren',
    nameLabel: 'Kundenname',
    phoneLabel: 'Telefonnummer',
    orderNumLabel: 'Bestellnummer (#)',
    categoryLabel: 'Kategorie',
    statusLabel: 'Kundenstatus',
    responseStateLabel: '💬 Antworteinfluss',
    amountLabel: 'Einkäufe',
    noteLabel: 'Kundennotizen',
    saveBtn: 'Speichern & Hinzufügen',
    searchPlaceholder: '🔍 Suchen nach Name, Telefon...',
    importBtn: '📤 CSV importieren',
    exportBtn: '📥 Excel exportieren',
    actions: 'Aktionen',
    settingsIdentity: '🛍 Shop-Identitätseinstellungen',
    storeNameLabel: 'Shop-Name',
    storeLogoBtn: '🖼 Logo auswählen',
    backupBox: '💾 Backup & Wiederherstellung',
    downloadBackup: '📥 Backup herunterladen (JSON)',
    restoreBackup: '♻️ Daten wiederherstellen',
    filterByTime: '📅 Nach Zeitrahmen filtern:',
    filterAllTime: 'Alle Zeit',
    filterToday: 'Heute',
    filterThisWeek: 'Diese Woche',
    filterThisMonth: 'Diesen Monat',
    perfIndicators: 'Live-Leistungsindikatoren',
    latestCustomers: 'Neueste Kunden',
    dealSuccessRate: '📊 Abschlussquote',
    pendingResponses: '⏳ Ausstehende Antworten',
    avgCustomerValue: '💰 Kundenwert (LTV)',
    categoryDistribution: '🎯 Kategorieduschnitt',
    singleMsgMode: 'Einzelnachricht',
    broadcastMsgMode: 'Kampagne (Warteschlange)',
    targetCustomerData: '1. Zielkundendaten',
    searchCrmPlaceholder: 'Kundenname eingeben...',
    selectTemplateTitle: '2. Nachricht auswählen',
    generateMsgBtn: '⚡ Nachricht generieren',
    copyOnlyBtn: '📋 Nur kopieren',
    sendWaBtn: '🟢 Über WhatsApp senden',
    storeLogoLabel: 'Shop-Logo',
    generalSysSettings: '⚡ Allgemeine Systemeinstellungen',
    defaultDiscountLabel: 'Standard-Gutscheincode',
    templatesTitle: '📝 Vorlagen',
    templateTitleLabel: 'Titel',
    templateTextLabel: 'Nachrichtentext',
    saveTemplateBtn: '💾 Vorlage speichern',
    customizeStatusTitle: '📌 Status anpassen',
    customizeRespTitle: '💬 Antwortstatus anpassen',
    customizeCatTitle: '🏷️ Kategorien anpassen',
    upgradePro: '⚡ Upgrade / PRO',
    subscriptionKey: '🔑 Lizenzschlüssel:',
    activated: 'Aktiviert ✓',
    activateBtn: 'Aktivieren'
  },
  id: {
    back: '← Kembali ke Dasbor',
    titleMain: 'Manajemen Hubungan Pelanggan',
    titleSub: 'WhatsApp CRM',
    desc: 'Sistem cerdas untuk manajemen pelanggan e-commerce dan otomatisasi pesan',
    tabDashboard: '📊 Dasbor',
    tabAnalytics: '📈 Analisis Lanjutan',
    tabCrm: '👥 Manajemen Pelanggan',
    tabMessaging: '💬 Pesan & Kampanye',
    tabTags: '⚙️ Pengaturan',
    salesTitle: 'Total Penjualan Aktual',
    totalCustomers: 'Total Pelanggan',
    newCustomerTitle: '➕ Daftarkan Pelanggan Baru',
    nameLabel: 'Nama Pelanggan',
    phoneLabel: 'Nomor Telepon',
    orderNumLabel: 'Nomor Pesanan (#)',
    categoryLabel: 'Kategori',
    statusLabel: 'Status Pelanggan',
    responseStateLabel: '💬 Status Respon',
    amountLabel: 'Pembelian',
    noteLabel: 'Catatan Pelanggan',
    saveBtn: 'Simpan & Tambah Pelanggan',
    searchPlaceholder: '🔍 Cari berdasarkan nama, telepon...',
    importBtn: '📤 Impor CSV',
    exportBtn: '📥 Ekspor Excel',
    actions: 'Tindakan',
    settingsIdentity: '🛍 Pengaturan Identitas Toko',
    storeNameLabel: 'Nama Toko',
    storeLogoBtn: '🖼 Pilih Logo dari Perangkat',
    backupBox: '💾 Cadangkan & Pulihkan Data',
    downloadBackup: '📥 Unduh Cadangan (JSON)',
    restoreBackup: '♻️ Pulihkan dari File',
    filterByTime: '📅 Filter Berdasarkan Waktu:',
    filterAllTime: 'Semua Waktu',
    filterToday: 'Hari Ini',
    filterThisWeek: 'Minggu Ini',
    filterThisMonth: 'Bulan Ini',
    perfIndicators: 'Indikator Kinerja Langsung',
    latestCustomers: 'Pelanggan Terbaru',
    dealSuccessRate: '📊 Tingkat Keberhasilan Kesepakatan',
    pendingResponses: '⏳ Respon Tertunda',
    avgCustomerValue: '💰 Nilai Pelanggan (LTV)',
    categoryDistribution: '🎯 Distribusi Kategori',
    singleMsgMode: 'Pesan Pelanggan Tunggal',
    broadcastMsgMode: 'Kampanye Siaran',
    targetCustomerData: '1. Data Pelanggan Target',
    searchCrmPlaceholder: 'Ketik nama pelanggan...',
    selectTemplateTitle: '2. Pilih atau Rancang Pesan',
    generateMsgBtn: '⚡ Buat & Pratinjau Pesan',
    copyOnlyBtn: '📋 Salin Saja',
    sendWaBtn: '🟢 Kirim via WhatsApp',
    storeLogoLabel: 'Logo Toko',
    generalSysSettings: '⚡ Pengaturan Sistem Umum',
    defaultDiscountLabel: 'Kode Diskon Default',
    templatesTitle: '📝 Templat Pesan',
    templateTitleLabel: 'Judul Templat',
    templateTextLabel: 'Teks Pesan',
    saveTemplateBtn: '💾 Simpan Templat',
    customizeStatusTitle: '📌 Sesuaikan Status',
    customizeRespTitle: '💬 Sesuaikan Status Respon',
    customizeCatTitle: '🏷️ Sesuaikan Kategori',
    upgradePro: '⚡ Tingkatkan / PRO',
    subscriptionKey: '🔑 Kunci Lisensi:',
    activated: 'Diaktifkan ✓',
    activateBtn: 'Aktifkan'
  }
};

export default function EngaziaWhatsAppCRM() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'messaging' | 'tags' | 'analytics'>('dashboard');

  const [storeName, setStoreName] = useState('متجري الإلكتروني');
  const [storeLogo, setStoreLogo] = useState('🛍');

  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'this_week' | 'this_month'>('all');
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newTimelineNote, setNewTimelineNote] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrderNumber, setNewOrderNumber] = useState('');
  const [newCategory, setNewCategory] = useState('عميل جديد');
  const [newStatus, setNewStatus] = useState('نشط');
  const [newResponseState, setNewResponseState] = useState('بانتظار الرد');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');

  const [statusOptions, setStatusOptions] = useState<StatusConfig[]>([
    { name: 'نشط', bg: '#dcfce7', color: '#15803d' },
    { name: 'مميز VIP', bg: '#fef3c7', color: '#d97706' },
    { name: 'متوقف', bg: '#fee2e2', color: '#dc2626' },
    { name: 'محظور', bg: '#f1f5f9', color: '#475569' }
  ]);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusBg, setNewStatusBg] = useState('#e0e7ff');
  const [newStatusColor, setNewStatusColor] = useState('#4f46e5');

  const [responseStateOptions, setResponseStateOptions] = useState<ResponseStateConfig[]>([
    { name: 'بانتظار الرد', bg: '#fef3c7', color: '#d97706' },
    { name: 'تم الاتفاق', bg: '#dcfce7', color: '#15803d' },
    { name: 'أغلق الطلب', bg: '#fee2e2', color: '#dc2626' }
  ]);
  const [newRespName, setNewRespName] = useState('');
  const [newRespBg, setNewRespBg] = useState('#e0e7ff');
  const [newRespColor, setNewRespColor] = useState('#4f46e5');

  const [defaultDiscountCode, setDefaultDiscountCode] = useState('ENGAZIA10');

  const [messagingMode, setMessagingMode] = useState<'single' | 'broadcast'>('single');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [includeDiscount, setIncludeDiscount] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState('');
  
  const [broadcastCat, setBroadcastCat] = useState('سلة متروكة');
  const [broadcastIndex, setBroadcastIndex] = useState(0);

  const [activeTemplateId, setActiveTemplateId] = useState<number>(1);
  const [templates, setTemplates] = useState<Template[]>([
    { id: 1, title: '✅ تأكيد الطلب', text: 'مرحباً بك يا [الاسم] 👋\nتم تأكيد طلبك رقم ([الطلب]) بنجاح، ونعمل حالياً على تجهيزه وشحنه لك. شكراً لثقتك بمتجرنا 💙' },
    { id: 2, title: '🛒 سلة متروكة', text: 'أهلاً بك يا [الاسم] 😊\nلاحظنا عدم إتمام طلبك رقم ([الطلب]). هل تواجه مشكلة في الدفع؟ نحن هنا لمساعدتك.' },
    { id: 3, title: '📦 تتبع الشحنة', text: 'مرحباً [الاسم] 📦\nتم تسليم طلبك رقم ([الطلب]) لشركة الشحن، وسيصلك قريباً.' },
    { id: 4, title: '💳 رابط الدفع', text: 'مرحباً بك يا [الاسم] 💳\nلتسهيل إتمام طلبك، يسعدنا تزويدك برابط الدفع السريع: [إضافي]' }
  ]);
  const [newTplTitle, setNewTplTitle] = useState('');
  const [newTplText, setNewTplText] = useState('');

  const [categories, setCategories] = useState<TagConfig[]>([
    { name: 'عميل جديد', bg: '#dbeafe', color: '#1d4ed8', isSale: true },
    { name: 'سلة متروكة', bg: '#fee2e2', color: '#dc2626', isSale: false },
    { name: 'بانتظار الدفع', bg: '#fef3c7', color: '#d97706', isSale: false },
    { name: 'تم الشحن والتوصيل', bg: '#dcfce7', color: '#15803d', isSale: true }
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBg, setNewCatBg] = useState('#e0e7ff');
  const [newCatColor, setNewCatColor] = useState('#4f46e5');
  const [newCatIsSale, setNewCatIsSale] = useState(true);

  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const MASTER_KEY = '$2a$10$MjUOD019x6uuVhydjtfL.cBlGqmIXvWR5b/tNrOZU6Ey8P.JOcyu';

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/80ff492a-01eb-4455-b1a8-96e12ab72562';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeLogoFileRef = useRef<HTMLInputElement>(null);
  const restoreFileRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const loadDataFromCloud = async (licenseKey: string) => {
    if (!licenseKey) return;
    try {
      const binId = localStorage.getItem(`bin_id_${licenseKey}`);
      if (!binId) return;

      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: { 'X-Master-Key': MASTER_KEY }
      });
      const responseData = await res.json();
      if (responseData && responseData.record && responseData.record.tools_data && responseData.record.tools_data.whatsapp_crm) {
        const cloudData = responseData.record.tools_data.whatsapp_crm;
        if (cloudData.contacts) { setContacts(cloudData.contacts); localStorage.setItem('engazia_whatsapp_pro_crm_v16', JSON.stringify(cloudData.contacts)); }
        if (cloudData.categories) { setCategories(cloudData.categories); localStorage.setItem('engazia_whatsapp_categories_v2', JSON.stringify(cloudData.categories)); }
        if (cloudData.statusOptions) { setStatusOptions(cloudData.statusOptions); localStorage.setItem('engazia_whatsapp_statuses_v1', JSON.stringify(cloudData.statusOptions)); }
        if (cloudData.responseStateOptions) { setResponseStateOptions(cloudData.responseStateOptions); localStorage.setItem('engazia_whatsapp_response_states_v1', JSON.stringify(cloudData.responseStateOptions)); }
        if (cloudData.templates) { setTemplates(cloudData.templates); localStorage.setItem('engazia_templates_v2', JSON.stringify(cloudData.templates)); }
        if (cloudData.storeName) { setStoreName(cloudData.storeName); localStorage.setItem('engazia_store_name', cloudData.storeName); }
        if (cloudData.storeLogo) { setStoreLogo(cloudData.storeLogo); localStorage.setItem('engazia_store_logo', cloudData.storeLogo); }
        if (cloudData.defaultDiscountCode) { setDefaultDiscountCode(cloudData.defaultDiscountCode); localStorage.setItem('engazia_default_discount', cloudData.defaultDiscountCode); }
      }
    } catch (err) {
      console.error('خطأ في سحب بيانات الواتساب سحابياً:', err);
    }
  };

  const saveToCloud = async (newData?: {
    contacts?: Customer[];
    categories?: TagConfig[];
    statusOptions?: StatusConfig[];
    responseStateOptions?: ResponseStateConfig[];
    templates?: Template[];
    storeName?: string;
    storeLogo?: string;
    defaultDiscountCode?: string;
  }) => {
    const currentContacts = newData?.contacts !== undefined ? newData.contacts : contacts;
    const currentCategories = newData?.categories !== undefined ? newData.categories : categories;
    const currentStatuses = newData?.statusOptions !== undefined ? newData.statusOptions : statusOptions;
    const currentRespStates = newData?.responseStateOptions !== undefined ? newData.responseStateOptions : responseStateOptions;
    const currentTemplates = newData?.templates !== undefined ? newData.templates : templates;
    const currentStoreName = newData?.storeName !== undefined ? newData.storeName : storeName;
    const currentStoreLogo = newData?.storeLogo !== undefined ? newData.storeLogo : storeLogo;
    const currentDisc = newData?.defaultDiscountCode !== undefined ? newData.defaultDiscountCode : defaultDiscountCode;

    const licenseKey = localStorage.getItem('merchant_license_key');
    if (!licenseKey) return;

    try {
      let binId = localStorage.getItem(`bin_id_${licenseKey}`);
      const payload = {
        merchant_key: licenseKey,
        tools_data: {
          whatsapp_crm: {
            contacts: currentContacts,
            categories: currentCategories,
            statusOptions: currentStatuses,
            responseStateOptions: currentRespStates,
            templates: currentTemplates,
            storeName: currentStoreName,
            storeLogo: currentStoreLogo,
            defaultDiscountCode: currentDisc
          }
        }
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
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('engazia_global_lang') || 'ar';
      const savedCurr = localStorage.getItem('engazia_global_currency') || 'SAR';
      setCurrentLang(savedLang);
      setCurrentCurrency(savedCurr);
    }

    const savedKey = localStorage.getItem('merchant_license_key');
    if (savedKey) {
      setLicenseKeyInput(savedKey);
      setIsActivated(true);
      loadDataFromCloud(savedKey);
    }

    const savedContacts = localStorage.getItem('engazia_whatsapp_pro_crm_v16');
    if (savedContacts) { try { setContacts(JSON.parse(savedContacts)); } catch (e) { console.error(e); } }
    
    const savedCats = localStorage.getItem('engazia_whatsapp_categories_v2');
    if (savedCats) { try { setCategories(JSON.parse(savedCats)); } catch (e) { console.error(e); } }

    const savedStatuses = localStorage.getItem('engazia_whatsapp_statuses_v1');
    if (savedStatuses) { try { setStatusOptions(JSON.parse(savedStatuses)); } catch (e) { console.error(e); } }

    const savedResponseStates = localStorage.getItem('engazia_whatsapp_response_states_v1');
    if (savedResponseStates) { try { setResponseStateOptions(JSON.parse(savedResponseStates)); } catch (e) { console.error(e); } }

    const savedTpls = localStorage.getItem('engazia_templates_v2');
    if (savedTpls) { try { setTemplates(JSON.parse(savedTpls)); } catch (e) { console.error(e); } }

    const savedDisc = localStorage.getItem('engazia_default_discount');
    if (savedDisc) setDefaultDiscountCode(savedDisc);

    const savedStoreName = localStorage.getItem('engazia_store_name');
    if (savedStoreName) setStoreName(savedStoreName);

    const savedStoreLogo = localStorage.getItem('engazia_store_logo');
    if (savedStoreLogo) setStoreLogo(savedStoreLogo);

    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = toolTranslations[currentLang] || toolTranslations.ar;
  const isRtl = currentLang === 'ar';

  const handleActivateLicense = () => {
    if (!licenseKeyInput.trim()) return;
    const cleanKey = licenseKeyInput.trim();
    localStorage.setItem('merchant_license_key', cleanKey);
    setIsActivated(true);
    loadDataFromCloud(cleanKey);
    showToast('تم تفعيل مفتاح الاشتراك بنجاح وتزامن أدواتك!');
  };

  const saveContacts = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_whatsapp_pro_crm_v16', JSON.stringify(updated));
    saveToCloud({ contacts: updated });
  };

  const saveCategories = (updated: TagConfig[]) => {
    setCategories(updated);
    localStorage.setItem('engazia_whatsapp_categories_v2', JSON.stringify(updated));
    saveToCloud({ categories: updated });
  };

  const saveStatuses = (updated: StatusConfig[]) => {
    setStatusOptions(updated);
    localStorage.setItem('engazia_whatsapp_statuses_v1', JSON.stringify(updated));
    saveToCloud({ statusOptions: updated });
  };

  const saveResponseStates = (updated: ResponseStateConfig[]) => {
    setResponseStateOptions(updated);
    localStorage.setItem('engazia_whatsapp_response_states_v1', JSON.stringify(updated));
    saveToCloud({ responseStateOptions: updated });
  };

  const saveTemplates = (updated: Template[]) => {
    setTemplates(updated);
    localStorage.setItem('engazia_templates_v2', JSON.stringify(updated));
    saveToCloud({ templates: updated });
  };

  const saveDefaultDiscount = (code: string) => {
    setDefaultDiscountCode(code);
    localStorage.setItem('engazia_default_discount', code);
    saveToCloud({ defaultDiscountCode: code });
    showToast('تم تحديث كود الخصم الافتراضي بنجاح');
  };

  const handleSaveStoreName = (name: string) => {
    setStoreName(name);
    localStorage.setItem('engazia_store_name', name);
    saveToCloud({ storeName: name });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setStoreLogo(result);
        localStorage.setItem('engazia_store_logo', result);
        saveToCloud({ storeLogo: result });
        showToast('🖼 تم رفع شعار المتجر بنجاح!');
      }
    };
    reader.readAsDataURL(file);
  };

  const exportBackupJSON = () => {
    const backupData = {
      storeName, storeLogo, defaultDiscountCode, contacts, categories, statusOptions, responseStateOptions, templates, version: '2.3'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `engazia_backup_${storeName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast('📦 تم تصدير نسخة الاحتياط بنجاح');
  };

  const importBackupJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        let newContacts = contacts;
        let newCats = categories;
        let newStats = statusOptions;
        let newResps = responseStateOptions;
        let newTpls = templates;
        let newNameStore = storeName;

        if (data && data.contacts) { newContacts = data.contacts; setContacts(newContacts); localStorage.setItem('engazia_whatsapp_pro_crm_v16', JSON.stringify(newContacts)); }
        if (data && data.categories) { newCats = data.categories; setCategories(newCats); localStorage.setItem('engazia_whatsapp_categories_v2', JSON.stringify(newCats)); }
        if (data && data.statusOptions) { newStats = data.statusOptions; setStatusOptions(newStats); localStorage.setItem('engazia_whatsapp_statuses_v1', JSON.stringify(newStats)); }
        if (data && data.responseStateOptions) { newResps = data.responseStateOptions; setResponseStateOptions(newResps); localStorage.setItem('engazia_whatsapp_response_states_v1', JSON.stringify(newResps)); }
        if (data && data.templates) { newTpls = data.templates; setTemplates(newTpls); localStorage.setItem('engazia_templates_v2', JSON.stringify(newTpls)); }
        if (data && data.storeName) { newNameStore = data.storeName; handleSaveStoreName(newNameStore); }

        saveToCloud({ contacts: newContacts, categories: newCats, statusOptions: newStats, responseStateOptions: newResps, templates: newTpls, storeName: newNameStore });
        showToast('♻ تم استعادة النسخة الاحتياطية بنجاح!');
      } catch (err) {
        showToast('❌ ملف النسخ الاحتياطي غير صالح.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const formatPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '966' + clean.substring(1);
    return clean;
  };

  const toEnglishDigits = (str: string) => {
    if (!str) return '';
    return str.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
              .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  };

  const isPhoneValid = (phone: string) => {
    const clean = toEnglishDigits(phone).replace(/\D/g, '');
    return clean.length >= 10;
  };

  const updateLastContact = (id: string, customNote?: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const updated = contacts.map(c => {
      if (c.id === id) {
        const newLog: TimelineLog = {
          id: Date.now().toString(),
          date: dateStr,
          action: 'تم التواصل عبر واتساب',
          note: customNote || 'فتح رابط المحادثة'
        };
        const existingTimeline = c.timeline || [];
        return { ...c, lastContactDate: dateStr, timeline: [newLog, ...existingTimeline] };
      }
      return c;
    });

    saveContacts(updated);
    if (selectedCustomer && selectedCustomer.id === id) {
      const target = updated.find(x => x.id === id);
      if (target) setSelectedCustomer(target);
    }
    showToast('🕒 تم تسجيل وقت التواصل والأرشيف بنجاح');
  };

  const addTimelineLogToCustomer = (customerId: string) => {
    if (!newTimelineNote.trim()) return showToast('⚠️ أدخل نص الملاحظة في الأرشيف.');
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newLog: TimelineLog = {
      id: Date.now().toString(),
      date: dateStr,
      action: 'إضافة ملاحظة يدوية',
      note: newTimelineNote
    };

    const updated = contacts.map(c => {
      if (c.id === customerId) {
        const tLine = c.timeline || [];
        return { ...c, timeline: [newLog, ...tLine] };
      }
      return c;
    });

    saveContacts(updated);
    const target = updated.find(x => x.id === customerId);
    if (target) setSelectedCustomer(target);
    setNewTimelineNote('');
    showToast('📝 تمت إضافة الملاحظة للأرشيف بنجاح');
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return showToast('⚠️ أدخل الاسم ورقم الجوال.');
    
    const cleanPhoneCheck = toEnglishDigits(newPhone).replace(/\D/g, '');
    if (cleanPhoneCheck.length < 10) return showToast('❌ رقم الجوال يجب أن يكون 10 أرقام على الأقل!');

    const now = new Date();
    const enDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newCust: Customer = {
      id: Date.now().toString(),
      name: newName,
      phone: toEnglishDigits(formatPhone(newPhone)),
      orderNumber: toEnglishDigits(newOrderNumber || '#---'),
      category: newCategory,
      status: newStatus,
      responseState: newResponseState,
      amount: toEnglishDigits(newAmount || '0'),
      note: newNote,
      date: enDate,
      lastContactDate: 'لم يتم التواصل',
      timeline: [{ id: '1', date: enDate, action: 'إنشاء العميل', note: 'تم إضافة العميل للنظام' }]
    };
    saveContacts([newCust, ...contacts]);
    setNewName(''); setNewPhone(''); setNewOrderNumber(''); setNewAmount(''); setNewNote('');
    showToast('✨ تم إضافة العميل بنجاح!');
  };

  const updateCustomerField = (id: string, field: string, value: string) => {
    const cleanVal = (field === 'phone' || field === 'orderNumber' || field === 'amount') ? toEnglishDigits(value) : value;
    const updated = contacts.map(c => c.id === id ? { ...c, [field]: cleanVal } : c);
    saveContacts(updated);
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer({ ...selectedCustomer, [field]: cleanVal });
    }
  };

  const deleteContact = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      saveContacts(contacts.filter(c => c.id !== id));
      setSelectedCustomer(null);
      showToast('🗑️ تم حذف العميل');
    }
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    saveCategories([...categories, { name: newCatName, bg: newCatBg, color: newCatColor, isSale: newCatIsSale }]);
    setNewCatName('');
    showToast('🏷 تم إضافة التصنيف بنجاح');
  };

  const deleteCategory = (catName: string) => {
    if (categories.length <= 1) return showToast('⚠️ يجب أن يبقى تصنيف واحد على الأقل.');
    if (window.confirm(`حذف التصنيف "${catName}"؟`)) {
      saveCategories(categories.filter(c => c.name !== catName));
      showToast('🗑 تم حذف التصنيف');
    }
  };

  const addStatusOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName) return;
    saveStatuses([...statusOptions, { name: newStatusName, bg: newStatusBg, color: newStatusColor }]);
    setNewStatusName('');
    showToast('✨ تم إضافة الحالة بنجاح');
  };

  const deleteStatusOption = (stName: string) => {
    if (statusOptions.length <= 1) return showToast('⚠️ يجب أن تبقى حالة واحدة على الأقل.');
    saveStatuses(statusOptions.filter(s => s.name !== stName));
    showToast('🗑️ تم حذف الحالة');
  };

  const addResponseStateOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRespName) return;
    saveResponseStates([...responseStateOptions, { name: newRespName, bg: newRespBg, color: newRespColor }]);
    setNewRespName('');
    showToast('✨ تم إضافة حالة الرد بنجاح');
  };

  const deleteResponseStateOption = (respName: string) => {
    if (responseStateOptions.length <= 1) return showToast('⚠️ يجب أن تبقى حالة رد واحدة على الأقل.');
    saveResponseStates(responseStateOptions.filter(r => r.name !== respName));
    showToast('🗑️ تم حذف حالة الرد');
  };

  const routeToMessaging = (c: Customer) => {
    setSelectedCustomer(null);
    setCustomerName(c.name);
    setCustomerPhone(c.phone);
    setOrderNumber(c.orderNumber);
    setMessagingMode('single');
    setActiveTab('messaging');
    window.scrollTo(0, 0);
  };

  const handleGenerateMessage = () => {
    const tpl = templates.find(t => t.id === activeTemplateId);
    if (!tpl) return;
    let msg = tpl.text
      .replace(/\[الاسم\]/g, customerName || 'عالمنا الكريم')
      .replace(/\[الطلب\]/g, orderNumber || '---')
      .replace(/\[إضافي\]/g, extraInfo);
    if (includeDiscount) msg += `\n\n🎁 كود خصم خاص لك: *${defaultDiscountCode}*`;
    setGeneratedMsg(msg);
  };

  const openWhatsAppDirect = (phone: string, text: string, customerId?: string) => {
    const clean = formatPhone(phone);
    const encodedText = encodeURIComponent(text);
    const url = clean ? `https://wa.me/${clean}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank');
    if (customerId) updateLastContact(customerId, 'مراسلة عبر Wa.me');
  };

  const filterByDateRange = (cList: Customer[]) => {
    if (dateFilter === 'all') return cList;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return cList.filter(c => {
      if (!c.date) return false;
      const cDate = new Date(c.date);
      if (isNaN(cDate.getTime())) return false;
      if (dateFilter === 'today') return c.date === todayStr;
      if (dateFilter === 'this_month') return cDate.getFullYear() === now.getFullYear() && cDate.getMonth() === now.getMonth();
      if (dateFilter === 'this_week') {
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        firstDayOfWeek.setHours(0, 0, 0, 0);
        return cDate >= firstDayOfWeek;
      }
      return true;
    });
  };

  const timeFilteredContacts = filterByDateRange(contacts);
  const saleCategoriesNames = categories.filter(cat => cat.isSale).map(cat => cat.name);
  const totalValidSales = timeFilteredContacts
    .filter(c => saleCategoriesNames.includes(c.category))
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  
  const filteredContacts = timeFilteredContacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm) || c.orderNumber.includes(searchTerm);
    const matchCat = filterCategory === 'all' || c.category === filterCategory;
    return matchSearch && matchCat;
  });

  const matchingCustomers = customerName.trim() === '' ? [] : contacts.filter(c => c.name.toLowerCase().includes(customerName.toLowerCase()));
  const broadcastList = contacts.filter(c => c.category === broadcastCat);

  return (
    <div className="app-container" style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}>
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .app-container { background: #f1f5f9; color: #0f172a; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 15px; position: relative; }
        .wrapper { max-width: 1200px; margin: 0 auto; background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        .toast-banner { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #1e293b; color: #fff; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 800; z-index: 9999; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
        .license-section { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .license-box { display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .upgrade-btn { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff !important; text-decoration: none; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(79,70,229,0.25); white-space: nowrap; }
        .header-brand { text-align: center; margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .store-logo-badge { width: 68px; height: 68px; border-radius: 18px; background: #eef2ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 900; box-shadow: 0 4px 15px rgba(79,70,229,0.15); border: 2px solid #c7d2fe; overflow: hidden; }
        .store-logo-badge img { width: 100%; height: 100%; object-fit: cover; }
        .brand-title { font-size: 28px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px; margin: 0; }
        .brand-title span { color: #4f46e5; }
        .brand-desc { color: #64748b; font-size: 14px; font-weight: 500; margin: 0; }
        .nav-tabs { display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; overflow-x: auto; justify-content: center; }
        .tab-btn { background: transparent; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 14px; color: #64748b; cursor: pointer; white-space: nowrap; }
        .tab-btn.active { background: #4f46e5; color: #fff; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; }
        .stat-num { font-size: 24px; font-weight: 900; color: #1e293b; margin-top: 8px; direction: ltr; }
        .stat-title { font-size: 13px; color: #64748b; font-weight: 700; }
        .section-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 20px; text-align: ${isRtl ? 'right' : 'left'}; }
        .section-title { font-size: 16px; font-weight: 900; color: #1e293b; margin-bottom: 5px; display: flex; align-items: center; gap: 8px; }
        .section-desc { font-size: 13px; color: #64748b; margin-bottom: 20px; font-weight: 500; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .form-group { margin-bottom: 15px; position: relative; text-align: ${isRtl ? 'right' : 'left'}; }
        .form-group label { display: block; font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 8px; }
        .form-control { width: 100%; padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; outline: none; font-family: 'Tajawal', sans-serif; background: #fff; color: #1e293b; font-weight: 700; box-sizing: border-box; text-align: ${isRtl ? 'right' : 'left'}; }
        .input-ltr { direction: ltr; text-align: left; }
        .btn-main { background: #4f46e5; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-wa { background: #10b981; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; flex: 1; display: inline-flex; justify-content: center; align-items: center; }
        .btn-sm { padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; border: none; white-space: nowrap; }
        .btn-success { background: #dcfce7; color: #15803d; }
        .btn-edit { background: #e0e7ff; color: #4f46e5; }
        .btn-danger { background: #fee2e2; color: #dc2626; }
        .table-container { width: 100%; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow-x: auto; }
        .contacts-table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: ${isRtl ? 'right' : 'left'}; min-width: 850px; }
        .contacts-table th, .contacts-table td { padding: 10px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .contacts-table th { background: #f8fafc; color: #475569; font-weight: 800; font-size: 11.5px; }
        .cell-input { padding: 5px 8px; font-size: 11.5px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; font-family: 'Tajawal', sans-serif; font-weight: 700; color: #1e293b; width: 100%; outline: none; box-sizing: border-box; text-align: ${isRtl ? 'right' : 'left'}; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 20px; font-size: 10.5px; font-weight: 800; text-align: center; }
        .radio-group { display: flex; gap: 10px; margin-bottom: 20px; background: #e2e8f0; padding: 4px; border-radius: 12px; width: fit-content; }
        .radio-btn { padding: 8px 20px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; color: #64748b; border: none; background: transparent; }
        .radio-btn.active { background: #fff; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .filter-chips { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 15px; flex-wrap: wrap; }
        .chip-btn { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 800; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; color: #475569; white-space: nowrap; }
        .chip-btn.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .modal-content { background: #fff; border-radius: 20px; padding: 30px; width: 100%; max-width: 650px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; position: relative; max-height: 90vh; overflow-y: auto; text-align: ${isRtl ? 'right' : 'left'}; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
        .modal-title { font-size: 18px; font-weight: 900; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 8px; }
        .close-modal-btn { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-weight: 900; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center; }
        .modal-body-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .modal-item { background: #f8fafc; padding: 12px 15px; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 6px; }
        .modal-item-label { font-size: 11.5px; font-weight: 800; color: #64748b; }
        .modal-edit-input { width: 100%; background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 13.5px; font-weight: 800; font-family: 'Tajawal', sans-serif; color: #1e293b; outline: none; box-sizing: border-box; text-align: ${isRtl ? 'right' : 'left'}; }
        .timeline-box { margin-top: 15px; border-top: 2px dashed #e2e8f0; padding-top: 15px; }
        .timeline-title { font-size: 14px; font-weight: 900; color: #1e293b; margin-bottom: 10px; }
        .timeline-list { max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
        .timeline-item { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 8px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; }
        .settings-creation-box { display: flex; gap: 15px; align-items: flex-end; background: #fff; padding: 20px; border-radius: 12px; border: 2px dashed #cbd5e1; margin-bottom: 25px; flex-wrap: wrap; }
        .color-picker { padding: 2px; height: 44px; cursor: pointer; }
        .tags-list-container { display: flex; flex-direction: column; gap: 10px; }
        .tag-row { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 12px 20px; border-radius: 12px; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 15px; }
        .tag-input-clean { border: 1px solid transparent; background: transparent; font-weight: 800; font-size: 14px; max-width: 200px; padding: 8px 12px; border-radius: 8px; text-align: ${isRtl ? 'right' : 'left'}; }
        .tag-controls { display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
        .color-group { display: flex; align-items: center; gap: 8px; }
        .color-label { font-size: 12px; color: #64748b; font-weight: 700; }
        .color-picker-sm { width: 34px; height: 34px; border-radius: 8px; cursor: pointer; border: 1px solid #e2e8f0; padding: 0; }
        .template-creation-box { background: #fff; padding: 20px; border-radius: 12px; border: 2px dashed #cbd5e1; margin-bottom: 25px; }
        .template-card-view { background: #fff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 12px; }
        .template-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .template-title { font-weight: 900; color: #1e293b; font-size: 14px; }
        .template-body { font-size: 13px; color: #475569; white-space: pre-wrap; line-height: 1.7; }
        .btn-icon { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; border: none; display: flex; align-items: center; gap: 5px; }
        .suggestions-box { position: absolute; top: 100%; right: 0; left: 0; background: #fff; border: 1px solid #cbd5e1; border-radius: 10px; max-height: 180px; overflow-y: auto; z-index: 10; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-top: 5px; text-align: ${isRtl ? 'right' : 'left'}; }
        .suggestion-item { padding: 10px 15px; font-size: 13px; font-weight: 700; cursor: pointer; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
      `}</style>

      {toastMessage && <div className="toast-banner">{toastMessage}</div>}

      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">✏ ملف العميل الشامل والأرشيف السجلي</h3>
              <button className="close-modal-btn" onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>
            
            <div className="modal-body-grid">
              <div className="modal-item" style={{ gridColumn: '1 / -1' }}>
                <span className="modal-item-label">{t.nameLabel}</span>
                <input type="text" className="modal-edit-input" value={selectedCustomer.name} onChange={e => updateCustomerField(selectedCustomer.id, 'name', e.target.value)} />
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.phoneLabel}</span>
                <input type="text" className="modal-edit-input input-ltr" style={{ borderColor: isPhoneValid(selectedCustomer.phone) ? '#cbd5e1' : '#dc2626' }} value={selectedCustomer.phone} onChange={e => updateCustomerField(selectedCustomer.id, 'phone', e.target.value)} />
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.orderNumLabel}</span>
                <input type="text" className="modal-edit-input input-ltr" value={selectedCustomer.orderNumber} onChange={e => updateCustomerField(selectedCustomer.id, 'orderNumber', e.target.value)} />
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.categoryLabel}</span>
                <select className="modal-edit-input" value={selectedCustomer.category} onChange={e => updateCustomerField(selectedCustomer.id, 'category', e.target.value)}>
                  {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.statusLabel}</span>
                <select className="modal-edit-input" value={selectedCustomer.status || 'نشط'} onChange={e => updateCustomerField(selectedCustomer.id, 'status', e.target.value)}>
                  {statusOptions.map(st => <option key={st.name} value={st.name}>{st.name}</option>)}
                </select>
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.responseStateLabel}</span>
                <select className="modal-edit-input" value={selectedCustomer.responseState || 'بانتظار الرد'} onChange={e => updateCustomerField(selectedCustomer.id, 'responseState', e.target.value)}>
                  {responseStateOptions.map(resp => <option key={resp.name} value={resp.name}>{resp.name}</option>)}
                </select>
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.amountLabel} ({currentCurrency})</span>
                <input type="text" className="modal-edit-input input-ltr" value={selectedCustomer.amount} onChange={e => updateCustomerField(selectedCustomer.id, 'amount', e.target.value)} />
              </div>
              <div className="modal-item" style={{ gridColumn: '1 / -1' }}>
                <span className="modal-item-label">{t.noteLabel}</span>
                <input type="text" className="modal-edit-input" value={selectedCustomer.note || ''} onChange={e => updateCustomerField(selectedCustomer.id, 'note', e.target.value)} placeholder="أدخل ملاحظات العميل..." />
              </div>
            </div>

            <div className="timeline-box">
              <div className="timeline-title">📜 أرشيف التواصل وسجل الملاحظات السابقة</div>
              <div className="timeline-list">
                {selectedCustomer.timeline && selectedCustomer.timeline.length > 0 ? (
                  selectedCustomer.timeline.map((log) => (
                    <div key={log.id} className="timeline-item">
                      <div><strong>{log.action}:</strong> {log.note}</div>
                      <span style={{ fontSize: '10.5px', color: '#64748b', direction: 'ltr' }}>{log.date}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '10px' }}>لا توجد سجلات تواصل سابقة.</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" className="modal-edit-input" placeholder="أضف ملاحظة جديدة للأرشيف..." value={newTimelineNote} onChange={e => setNewTimelineNote(e.target.value)} />
                <button className="btn-main" style={{ padding: '8px 16px', whiteSpace: 'nowrap' }} onClick={() => addTimelineLogToCustomer(selectedCustomer.id)}>إضافة للأرشيف</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-wa" style={{ flex: 2 }} onClick={() => openWhatsAppDirect(selectedCustomer.phone, 'مرحباً بك', selectedCustomer.id)}>🟢 مراسلة عبر واتساب</button>
              <button className="btn-sm btn-danger" style={{ padding: '0 20px', fontSize: '13px', fontWeight: 800 }} onClick={() => deleteContact(selectedCustomer.id)}>🗑️ حذف</button>
              <button className="btn-main" style={{ flex: 1, background: '#f1f5f9', color: '#1e293b' }} onClick={() => setSelectedCustomer(null)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      <div className="wrapper">
        <div className="header-top">
          <Link href="/hub" style={{ color: '#4f46e5', fontWeight: 700, fontSize: '13px' }}>{t.back}</Link>

          <div className="license-section">
            <div className="license-box">
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>{t.subscriptionKey}</span>
              {isActivated ? (
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#10b981' }}>{t.activated}</span>
              ) : (
                <>
                  <input type="text" placeholder="مفتاح الترخيص..." value={licenseKeyInput} onChange={(e) => setLicenseKeyInput(e.target.value)} style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', outline: 'none', width: '130px' }} />
                  <button onClick={handleActivateLicense} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>{t.activateBtn}</button>
                </>
              )}
            </div>
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="upgrade-btn">{t.upgradePro}</a>
          </div>
        </div>

        <div className="header-brand">
          <div className="store-logo-badge">
            {storeLogo.startsWith('data:') || storeLogo.startsWith('http') || storeLogo.startsWith('/') ? (
              <img src={storeLogo} alt="Store Logo" />
            ) : (
              <span>{storeLogo}</span>
            )}
          </div>
          <h1 className="brand-title">CRM <span>{storeName}</span></h1>
          <p className="brand-desc">{t.desc}</p>
        </div>

        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>{t.tabDashboard}</button>
          <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>{t.tabAnalytics}</button>
          <button className={`tab-btn ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>{t.tabCrm}</button>
          <button className={`tab-btn ${activeTab === 'messaging' ? 'active' : ''}`} onClick={() => setActiveTab('messaging')}>{t.tabMessaging}</button>
          <button className={`tab-btn ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>{t.tabTags}</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>{t.filterByTime}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`chip-btn ${dateFilter === 'all' ? 'active' : ''}`} onClick={() => setDateFilter('all')}>{t.filterAllTime}</button>
            <button className={`chip-btn ${dateFilter === 'today' ? 'active' : ''}`} onClick={() => setDateFilter('today')}>{t.filterToday}</button>
            <button className={`chip-btn ${dateFilter === 'this_week' ? 'active' : ''}`} onClick={() => setDateFilter('this_week')}>{t.filterThisWeek}</button>
            <button className={`chip-btn ${dateFilter === 'this_month' ? 'active' : ''}`} onClick={() => setDateFilter('this_month')}>{t.filterThisMonth}</button>
          </div>
        </div>

        {/* 1. Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="section-title">{t.perfIndicators}</div>
            <div className="dashboard-grid">
              <div className="stat-card" style={{ borderBottom: '4px solid #4f46e5' }}>
                <div className="stat-title">{t.salesTitle}</div>
                <div className="stat-num">{totalValidSales.toLocaleString()} <span style={{fontSize:'14px'}}>{currentCurrency}</span></div>
              </div>
              <div className="stat-card" style={{ borderBottom: '4px solid #10b981' }}>
                <div className="stat-title">{t.totalCustomers}</div>
                <div className="stat-num">{timeFilteredContacts.length}</div>
              </div>
              {categories.map(cat => (
                <div key={cat.name} className="stat-card" style={{ borderBottom: `4px solid ${cat.color}` }}>
                  <div className="stat-title">{cat.name}</div>
                  <div className="stat-num">{timeFilteredContacts.filter(c => c.category === cat.name).length}</div>
                </div>
              ))}
            </div>

            <div className="section-title" style={{ marginTop: '30px' }}>{t.latestCustomers}</div>
            <div className="table-container">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>{t.nameLabel}</th>
                    <th>{t.orderNumLabel}</th>
                    <th>{t.categoryLabel}</th>
                    <th>{t.statusLabel}</th>
                    <th>{t.responseStateLabel}</th>
                    <th>آخر تواصل</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {timeFilteredContacts.slice(0, 5).map(c => {
                    const respConf = responseStateOptions.find(r => r.name === c.responseState);
                    return (
                      <tr key={c.id}>
                        <td><span style={{ fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>{c.name}</span></td>
                        <td style={{direction: 'ltr', textAlign: 'left'}}>{c.orderNumber}</td>
                        <td><span className="badge" style={{ background: categories.find(cat => cat.name === c.category)?.bg || '#eee', color: categories.find(cat => cat.name === c.category)?.color || '#000' }}>{c.category}</span></td>
                        <td><span className="badge" style={{ background: statusOptions.find(st => st.name === c.status)?.bg || '#eee', color: statusOptions.find(st => st.name === c.status)?.color || '#000' }}>{c.status || 'نشط'}</span></td>
                        <td><span className="badge" style={{ background: respConf?.bg || '#fef3c7', color: respConf?.color || '#d97706' }}>{c.responseState || 'بانتظار الرد'}</span></td>
                        <td style={{ color: '#4f46e5', fontSize: '11px', fontWeight: 700, direction: 'ltr', textAlign: 'left' }}>{c.lastContactDate || 'لم يتم'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬</button>
                            <button className="btn-sm btn-edit" onClick={() => updateLastContact(c.id)}>🕒</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {timeFilteredContacts.length === 0 && <tr><td colSpan={7} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>لا يوجد عملاء بالفترة المحددة.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 1.5 Advanced Analytics */}
        {activeTab === 'analytics' && (
          <div>
            <div className="section-title">{t.tabAnalytics}</div>
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              <div className="stat-card" style={{ textAlign: isRtl ? 'right' : 'left', padding: '25px' }}>
                <div className="stat-title" style={{ marginBottom: '10px' }}>{t.dealSuccessRate}</div>
                <div className="stat-num" style={{ color: '#10b981', textAlign: isRtl ? 'right' : 'left' }}>
                  {timeFilteredContacts.length > 0 ? ((timeFilteredContacts.filter(c => c.responseState === 'تم الاتفاق').length / timeFilteredContacts.length) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="stat-card" style={{ textAlign: isRtl ? 'right' : 'left', padding: '25px' }}>
                <div className="stat-title" style={{ marginBottom: '10px' }}>{t.pendingResponses}</div>
                <div className="stat-num" style={{ color: '#d97706', textAlign: isRtl ? 'right' : 'left' }}>
                  {timeFilteredContacts.filter(c => c.responseState === 'بانتظار الرد' || !c.responseState).length}
                </div>
              </div>
              <div className="stat-card" style={{ textAlign: isRtl ? 'right' : 'left', padding: '25px' }}>
                <div className="stat-title" style={{ marginBottom: '10px' }}>{t.avgCustomerValue}</div>
                <div className="stat-num" style={{ color: '#4f46e5', textAlign: isRtl ? 'right' : 'left' }}>
                  {timeFilteredContacts.length > 0 ? (totalValidSales / timeFilteredContacts.length).toFixed(0) : 0} <span style={{fontSize:'12px'}}>{currentCurrency}</span>
                </div>
              </div>
            </div>

            <div className="section-box" style={{ marginTop: '20px' }}>
              <div className="section-title">{t.categoryDistribution}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                {categories.map(cat => {
                  const count = timeFilteredContacts.filter(c => c.category === cat.name).length;
                  const pct = timeFilteredContacts.length > 0 ? (count / timeFilteredContacts.length) * 100 : 0;
                  return (
                    <div key={cat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, marginBottom: '5px' }}>
                        <span>{cat.name} ({count})</span>
                        <span dir="ltr">{pct.toFixed(1)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: '5px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. CRM */}
        {activeTab === 'crm' && (
          <div>
            <div className="section-box">
              <div className="section-title">{t.newCustomerTitle}</div>
              <form onSubmit={addContact}>
                <div className="form-grid" style={{ marginBottom: '20px' }}>
                  <div className="form-group"><label>{t.nameLabel}</label><input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} required /></div>
                  <div className="form-group"><label>{t.phoneLabel}</label><input type="text" className="form-control input-ltr" value={newPhone} onChange={e => setNewPhone(toEnglishDigits(e.target.value))} required placeholder="05xxxxxxxx" /></div>
                  <div className="form-group"><label>{t.orderNumLabel}</label><input type="text" className="form-control input-ltr" value={newOrderNumber} onChange={e => setNewOrderNumber(toEnglishDigits(e.target.value))} /></div>
                  <div className="form-group">
                    <label>{t.categoryLabel}</label>
                    <select className="form-control" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                      {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.statusLabel}</label>
                    <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                      {statusOptions.map(st => <option key={st.name} value={st.name}>{st.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.responseStateLabel}</label>
                    <select className="form-control" value={newResponseState} onChange={e => setNewResponseState(e.target.value)}>
                      {responseStateOptions.map(resp => <option key={resp.name} value={resp.name}>{resp.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>{t.amountLabel} ({currentCurrency})</label><input type="text" className="form-control input-ltr" value={newAmount} onChange={e => setNewAmount(toEnglishDigits(e.target.value))} placeholder="0" /></div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>{t.noteLabel}</label><input type="text" className="form-control" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="ملاحظة..." /></div>
                </div>
                <button type="submit" className="btn-main" style={{ width: 'auto' }}>{t.saveBtn}</button>
              </form>
            </div>

            <div className="section-box">
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div className="form-group" style={{ flex: 2, margin: 0, minWidth: '220px' }}>
                  <input type="text" className="form-control" placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button className="btn-sm btn-success" style={{ padding: '10px 18px', fontWeight: 800 }} onClick={() => fileInputRef.current?.click()}>{t.importBtn}</button>
                  <input type="file" ref={fileInputRef} onChange={importBackupJSON} accept=".csv" style={{ display: 'none' }} />
                  <button className="btn-sm btn-edit" style={{ padding: '10px 18px', fontWeight: 800 }} onClick={exportBackupJSON}>{t.exportBtn}</button>
                </div>
              </div>

              <div className="filter-chips">
                <button className={`chip-btn ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>جميع التصنيفات ({timeFilteredContacts.length})</button>
                {categories.map(cat => (
                  <button key={cat.name} className={`chip-btn ${filterCategory === cat.name ? 'active' : ''}`} onClick={() => setFilterCategory(cat.name)}>
                    {cat.name} ({timeFilteredContacts.filter(c => c.category === cat.name).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="table-container">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>{t.nameLabel}</th>
                    <th>{t.phoneLabel}</th>
                    <th>{t.orderNumLabel}</th>
                    <th>{t.categoryLabel}</th>
                    <th>{t.statusLabel}</th>
                    <th>{t.responseStateLabel}</th>
                    <th>{t.amountLabel}</th>
                    <th>{t.noteLabel}</th>
                    <th>آخر تواصل</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map(c => (
                    <tr key={c.id}>
                      <td><span style={{ fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>{c.name}</span></td>
                      <td><input type="text" className="cell-input input-ltr" value={c.phone} onChange={e => updateCustomerField(c.id, 'phone', e.target.value)} /></td>
                      <td><input type="text" className="cell-input input-ltr" value={c.orderNumber} onChange={e => updateCustomerField(c.id, 'orderNumber', e.target.value)} /></td>
                      <td>
                        <select className="cell-input" value={c.category} onChange={e => updateCustomerField(c.id, 'category', e.target.value)}>
                          {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <select className="cell-input" value={c.status || 'نشط'} onChange={e => updateCustomerField(c.id, 'status', e.target.value)}>
                          {statusOptions.map(st => <option key={st.name} value={st.name}>{st.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <select className="cell-input" value={c.responseState || 'بانتظار الرد'} onChange={e => updateCustomerField(c.id, 'responseState', e.target.value)}>
                          {responseStateOptions.map(resp => <option key={resp.name} value={resp.name}>{resp.name}</option>)}
                        </select>
                      </td>
                      <td><input type="text" className="cell-input input-ltr" value={c.amount} onChange={e => updateCustomerField(c.id, 'amount', e.target.value)} /></td>
                      <td><input type="text" className="cell-input" value={c.note || ''} onChange={e => updateCustomerField(c.id, 'note', e.target.value)} /></td>
                      <td style={{ direction: 'ltr', textAlign: 'left', color: '#4f46e5', fontSize: '10px' }}>{c.lastContactDate || 'لم يتم'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬</button>
                          <button className="btn-sm btn-edit" onClick={() => updateLastContact(c.id)}>🕒</button>
                          <button className="btn-sm btn-danger" onClick={() => deleteContact(c.id)}>حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredContacts.length === 0 && <tr><td colSpan={10} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>لا يوجد عملاء يطابقون بحثك.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Messaging Engine */}
        {activeTab === 'messaging' && (
          <div>
            <div className="radio-group">
              <button className={`radio-btn ${messagingMode === 'single' ? 'active' : ''}`} onClick={() => setMessagingMode('single')}>{t.singleMsgMode}</button>
              <button className={`radio-btn ${messagingMode === 'broadcast' ? 'active' : ''}`} onClick={() => setMessagingMode('broadcast')}>{t.broadcastMsgMode}</button>
            </div>

            <div className="section-box">
              {messagingMode === 'single' ? (
                <>
                  <div className="section-title">{t.targetCustomerData}</div>
                  <div className="form-grid">
                    <div className="form-group" ref={suggestionsRef}>
                      <label>{t.searchPlaceholder}</label>
                      <input type="text" className="form-control" placeholder={t.searchCrmPlaceholder} value={customerName} onChange={e => { setCustomerName(e.target.value); setShowSuggestions(true); }} />
                      {showSuggestions && matchingCustomers.length > 0 && (
                        <div className="suggestions-box">
                          {matchingCustomers.map(cust => (
                            <div key={cust.id} className="suggestion-item" onClick={() => { setCustomerName(cust.name); setCustomerPhone(cust.phone); setOrderNumber(cust.orderNumber); setShowSuggestions(false); }}>
                              <span>{cust.name}</span>
                              <span style={{ color: '#4f46e5', direction: 'ltr' }}>{cust.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-group"><label>{t.phoneLabel}</label><input type="text" className="form-control input-ltr" value={customerPhone} onChange={e => setCustomerPhone(toEnglishDigits(e.target.value))} /></div>
                    <div className="form-group"><label>{t.orderNumLabel}</label><input type="text" className="form-control input-ltr" value={orderNumber} onChange={e => setOrderNumber(toEnglishDigits(e.target.value))} /></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="section-title">1. استهداف شريحة من العملاء</div>
                  <div className="form-group" style={{ maxWidth: '400px' }}>
                    <label>اختر التصنيف المستهدف بالحملة:</label>
                    <select className="form-control" value={broadcastCat} onChange={e => { setBroadcastCat(e.target.value); setBroadcastIndex(0); }}>
                      {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name} ({contacts.filter(c => c.category === cat.name).length} عميل)</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="section-box">
              <div className="section-title">{t.selectTemplateTitle}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {templates.map(tpl => (
                  <div key={tpl.id} onClick={() => setActiveTemplateId(tpl.id)} style={{ padding: '12px 10px', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontWeight: 800, fontSize: '12px', color: activeTemplateId === tpl.id ? '#4f46e5' : '#64748b', background: activeTemplateId === tpl.id ? '#eef2ff' : '#fff' }}>
                    {tpl.title}
                  </div>
                ))}
              </div>
              <button className="btn-main" style={{ width: '100%' }} onClick={handleGenerateMessage}>{t.generateMsgBtn}</button>
              {generatedMsg && (
                <div style={{ background: '#fff', border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '16px', marginTop: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '15px', color: '#1e293b' }}>{generatedMsg}</div>
                  <button className="btn-wa" style={{ width: '100%' }} onClick={() => openWhatsAppDirect(customerPhone, generatedMsg)}>{t.sendWaBtn}</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Settings */}
        {activeTab === 'tags' && (
          <div>
            <div className="section-box" style={{ background: '#eef2ff', borderColor: '#c7d2fe' }}>
              <div className="section-title">{t.settingsIdentity}</div>
              <div className="form-grid" style={{ alignItems: 'flex-end' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.storeNameLabel}</label>
                  <input type="text" className="form-control" value={storeName} onChange={e => handleSaveStoreName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.storeLogoLabel}</label>
                  <button className="btn-main" style={{ width: '100%', background: '#fff', color: '#4f46e5', border: '1px solid #c7d2fe' }} onClick={() => storeLogoFileRef.current?.click()}>{t.storeLogoBtn}</button>
                  <input type="file" ref={storeLogoFileRef} onChange={handleLogoUpload} accept="image/*" style={{ display: 'none' }} />
                </div>
              </div>
            </div>

            <div className="section-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div className="section-title" style={{ color: '#166534' }}>{t.backupBox}</div>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button className="btn-main" style={{ background: '#10b981' }} onClick={exportBackupJSON}>{t.downloadBackup}</button>
                <button className="btn-main" style={{ background: '#fff', color: '#166534', border: '1px solid #bbf7d0' }} onClick={() => restoreFileRef.current?.click()}>{t.restoreBackup}</button>
                <input type="file" ref={restoreFileRef} onChange={importBackupJSON} accept=".json" style={{ display: 'none' }} />
              </div>
            </div>

            <div className="section-box">
              <div className="section-title">{t.generalSysSettings}</div>
              <div className="form-group" style={{ maxWidth: '400px', margin: 0 }}>
                <label>{t.defaultDiscountLabel}</label>
                <input type="text" className="form-control" value={defaultDiscountCode} onChange={e => saveDefaultDiscount(e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
