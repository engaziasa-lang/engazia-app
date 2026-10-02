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
  nameKey: string;
  fallbackName: string;
  bg: string;
  color: string;
  isSale: boolean;
}

interface StatusConfig {
  nameKey: string;
  fallbackName: string;
  bg: string;
  color: string;
}

interface ResponseStateConfig {
  nameKey: string;
  fallbackName: string;
  bg: string;
  color: string;
}

interface Template {
  id: number;
  titleKey: string;
  fallbackTitle: string;
  textKey: string;
  fallbackText: string;
}

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
    backupBox: '💾 النسخ الاحتياطي واستعادة البيانات',
    downloadBackup: '📥 تحميل نسخة احتياطية (JSON)',
    restoreBackup: '♻️ استعادة البيانات من ملف',
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
    sendWaBtn: '🟢 إرسال عبر واتساب (Wa.me)',
    defaultDiscountLabel: 'كود الخصم الافتراضي',
    customizeStatusTitle: '📌 تخصيص حالات العملاء',
    customizeRespTitle: '💬 تخصيص حالات الرد',
    customizeCatTitle: '🏷 تخصيص تصنيفات وحالات العملاء',
    newCatLabel: 'اسم التصنيف الجديد',
    newStatusLabel: 'اسم الحالة الجديدة',
    newRespLabel: 'اسم حالة الرد الجديدة',
    colorLabel: 'اللون',
    addBtn: '➕ إضافة',
    deleteBtn: 'حذف',
    cats: {
      newCustomer: 'عميل جديد',
      abandonedCart: 'سلة متروكة',
      pendingPayment: 'بانتظار الدفع',
      shipped: 'تم الشحن والتوصيل'
    },
    statuses: {
      active: 'نشط',
      vip: 'مميز VIP',
      paused: 'متوقف',
      banned: 'محظور'
    },
    responseStates: {
      pending: 'بانتظار الرد',
      agreed: 'تم الاتفاق',
      closed: 'أغلق الطلب'
    },
    tpls: {
      t1Title: '✅ تأكيد الطلب',
      t1Text: 'مرحباً بك يا [الاسم] 👋\nتم تأكيد طلبك رقم ([الطلب]) بنجاح، ونعمل حالياً على تجهيزه وشحنه لك. شكراً لثقتك بمتجرنا 💙',
      t2Title: '🛒 سلة متروكة',
      t2Text: 'أهلاً بك يا [الاسم] 😊\nلاحظنا عدم إتمام طلبك رقم ([الطلب]). هل تواجه مشكلة في الدفع؟ نحن هنا لمساعدتك.',
      t3Title: '📦 تتبع الشحنة',
      t3Text: 'مرحباً [الاسم] 📦\nتم تسليم طلبك رقم ([الطلب]) لشركة الشحن، وسيصلك قريباً.',
      t4Title: '💳 رابط الدفع',
      t4Text: 'مرحباً بك يا [الاسم] 💳\nلتسهيل إتمام طلبك، يسعدنا تزويدك برابط الدفع السريع: [إضافي]'
    }
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
    backupBox: '💾 Backup & Restore Data',
    downloadBackup: '📥 Download Backup (JSON)',
    restoreBackup: '♻️ Restore Data from File',
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
    sendWaBtn: '🟢 Send via WhatsApp (Wa.me)',
    defaultDiscountLabel: 'Default Discount Code',
    customizeStatusTitle: '📌 Customize Customer Statuses',
    customizeRespTitle: '💬 Customize Response States',
    customizeCatTitle: '🏷️ Customize Customer Categories',
    newCatLabel: 'New Category Name',
    newStatusLabel: 'New Customer Status',
    newRespLabel: 'New Response State',
    colorLabel: 'Color',
    addBtn: '➕ Add',
    deleteBtn: 'Delete',
    cats: {
      newCustomer: 'New Customer',
      abandonedCart: 'Abandoned Cart',
      pendingPayment: 'Pending Payment',
      shipped: 'Shipped & Delivered'
    },
    statuses: {
      active: 'Active',
      vip: 'VIP',
      paused: 'Paused',
      banned: 'Banned'
    },
    responseStates: {
      pending: 'Pending Response',
      agreed: 'Deal Agreed',
      closed: 'Order Closed'
    },
    tpls: {
      t1Title: '✅ Order Confirmation',
      t1Text: 'Hello [الاسم] 👋\nYour order #[الطلب] has been successfully confirmed and is being processed. Thank you!',
      t2Title: '🛒 Abandoned Cart',
      t2Text: 'Hi [الاسم] 😊\nWe noticed you left items in cart #[الطلب]. Need any help with checkout?',
      t3Title: '📦 Shipping Tracker',
      t3Text: 'Hello [الاسم] 📦\nYour order #[الطلب] has been shipped and will arrive soon.',
      t4Title: '💳 Payment Link',
      t4Text: 'Hello [الاسم] 💳\nHere is your quick payment link to complete order #[الطلب]: [إضافي]'
    }
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
    backupBox: '💾 Sauvegarde',
    downloadBackup: '📥 Télécharger la sauvegarde',
    restoreBackup: '♻️ Restaurer',
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
    sendWaBtn: '🟢 Envoyer via WhatsApp',
    defaultDiscountLabel: 'Code de réduction par défaut',
    customizeStatusTitle: '📌 Personnaliser les statuts',
    customizeRespTitle: '💬 Personnaliser les états de réponse',
    customizeCatTitle: '🏷️ Personnaliser les catégories',
    newCatLabel: 'Nom de la nouvelle catégorie',
    newStatusLabel: 'Nouveau statut client',
    newRespLabel: 'Nouvel état de réponse',
    colorLabel: 'Couleur',
    addBtn: '➕ Ajouter',
    deleteBtn: 'Supprimer',
    cats: {
      newCustomer: 'Nouveau client',
      abandonedCart: 'Panier abandonné',
      pendingPayment: 'Paiement en attente',
      shipped: 'Expédié & Livré'
    },
    statuses: {
      active: 'Actif',
      vip: 'VIP',
      paused: 'En pause',
      banned: 'Banni'
    },
    responseStates: {
      pending: 'En attente de réponse',
      agreed: 'Accord conclu',
      closed: 'Commande fermée'
    },
    tpls: {
      t1Title: '✅ Confirmation de commande',
      t1Text: 'Bonjour [الاسم] 👋\nVotre commande #[الطلب] a été confirmée avec succès.',
      t2Title: '🛒 Panier abandonné',
      t2Text: 'Bonjour [الاسم] 😊\nVous avez laissé des articles dans votre panier #[الطلب].',
      t3Title: '📦 Suivi d\'expédition',
      t3Text: 'Bonjour [الاسم] 📦\nVotre commande #[الطلب] a été expédiée.',
      t4Title: '💳 Lien de paiement',
      t4Text: 'Bonjour [الاسم] 💳\nVoici votre lien de paiement : [إضافي]'
    }
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
    backupBox: '💾 Copia de seguridad y restauración',
    downloadBackup: '📥 Descargar copia de seguridad',
    restoreBackup: '♻️ Restaurar datos',
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
    sendWaBtn: '🟢 Enviar por WhatsApp',
    defaultDiscountLabel: 'Código de descuento predeterminado',
    customizeStatusTitle: '📌 Personalizar estados',
    customizeRespTitle: '💬 Personalizar estados de respuesta',
    customizeCatTitle: '🏷 Personalizar categorías',
    newCatLabel: 'Nombre de nueva categoría',
    newStatusLabel: 'Nuevo estado de cliente',
    newRespLabel: 'Nuevo estado de respuesta',
    colorLabel: 'Color',
    addBtn: '➕ Añadir',
    deleteBtn: 'Eliminar',
    cats: {
      newCustomer: 'Nuevo cliente',
      abandonedCart: 'Carrito abandonado',
      pendingPayment: 'Pago pendiente',
      shipped: 'Enviado y entregado'
    },
    statuses: {
      active: 'Activo',
      vip: 'VIP',
      paused: 'Pausado',
      banned: 'Bloqueado'
    },
    responseStates: {
      pending: 'Esperando respuesta',
      agreed: 'Acuerdo cerrado',
      closed: 'Pedido cerrado'
    },
    tpls: {
      t1Title: '✅ Confirmación de pedido',
      t1Text: 'Hola [الاسم] 👋\nTu pedido #[الطلب] ha sido confirmado con éxito.',
      t2Title: '🛒 Carrito abandonado',
      t2Text: 'Hola [الاسم] 😊\nNotamos que dejaste artículos en tu carrito #[الطلب].',
      t3Title: '📦 Seguimiento de envío',
      t3Text: 'Hola [الاسم] 📦\nTu pedido #[الطلب] ha sido enviado.',
      t4Title: '💳 Enlace de pago',
      t4Text: 'Hola [الاسم] 💳\nAquí tienes tu enlace de pago: [إضافي]'
    }
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
    backupBox: '💾 Yedekleme ve Geri Yükleme',
    downloadBackup: '📥 Yedek İndir (JSON)',
    restoreBackup: '♻️️ Dosyadan Geri Yükle',
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
    sendWaBtn: '🟢 WhatsApp ile Gönder',
    defaultDiscountLabel: 'Varsayılan İndirim Kodu',
    customizeStatusTitle: '📌 Müşteri Durumlarını Özelleştir',
    customizeRespTitle: '💬 Yanıt Durumlarını Özelleştir',
    customizeCatTitle: '🏷 Müşteri Kategorilerini Özelleştir',
    newCatLabel: 'Yeni Kategori Adı',
    newStatusLabel: 'Yeni Müşteri Durumu',
    newRespLabel: 'Yeni Yanıt Durumu',
    colorLabel: 'Renk',
    addBtn: '➕ Ekle',
    deleteBtn: 'Sil',
    cats: {
      newCustomer: 'Yeni Müşteri',
      abandonedCart: 'Terk Edilmiş Sepet',
      pendingPayment: 'Ödeme Bekleniyor',
      shipped: 'Kargolandı ve Teslim Edildi'
    },
    statuses: {
      active: 'Aktif',
      vip: 'VIP',
      paused: 'Duraklatıldı',
      banned: 'Yasaklı'
    },
    responseStates: {
      pending: 'Yanıt Bekleniyor',
      agreed: 'Anlaşıldı',
      closed: 'Sipariş Kapatıldı'
    },
    tpls: {
      t1Title: '✅ Sipariş Onayı',
      t1Text: 'Merhaba [الاسم] 👋\n#[الطلب] numaralı siparişiniz başarıyla onaylandı.',
      t2Title: '🛒 Terk Edilmiş Sepet',
      t2Text: 'Merhaba [الاسم] 😊\n#[الطلب] sepetinizde ürün bıraktığınızı fark ettik.',
      t3Title: '📦 Kargo Takibi',
      t3Text: 'Merhaba [الاسم] 📦\n#[الطلب] numaralı siparişiniz kargoya verildi.',
      t4Title: '💳 Ödeme Bağlantısı',
      t4Text: 'Merhaba [الاسم] 💳\nÖdeme bağlantınız: [إضافي]'
    }
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
    backupBox: '💾 备份与恢复数据',
    downloadBackup: '📥 下载备份 (JSON)',
    restoreBackup: '♻️ 从文件恢复数据',
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
    sendWaBtn: '🟢 通过 WhatsApp 发送',
    defaultDiscountLabel: '默认优惠码',
    customizeStatusTitle: '📌 自定义客户状态',
    customizeRespTitle: '💬 自定义回复状态',
    customizeCatTitle: '🏷️ 自定义客户分类',
    newCatLabel: '新分类名称',
    newStatusLabel: '新客户状态',
    newRespLabel: '新回复状态',
    colorLabel: '颜色',
    addBtn: '➕ 添加',
    deleteBtn: '删除',
    cats: {
      newCustomer: '新客户',
      abandonedCart: '购物车未付款',
      pendingPayment: '等待付款',
      shipped: '已发货并送达'
    },
    statuses: {
      active: '活跃',
      vip: 'VIP客户',
      paused: '暂停',
      banned: '已拉黑'
    },
    responseStates: {
      pending: '等待回复',
      agreed: '达成一致',
      closed: '订单关闭'
    },
    tpls: {
      t1Title: '✅ 订单确认',
      t1Text: '您好 [الاسم] 👋\n您的订单 #[الطلب] 已成功确认。',
      t2Title: '🛒 购物车未付款',
      t2Text: '您好 [الاسم] 😊\n我们注意到您在购物车 #[الطلب] 留下了商品。',
      t3Title: '📦 物流追踪',
      t3Text: '您好 [الاسم] 📦\n您的订单 #[الطلب] 已发货。',
      t4Title: '💳 支付链接',
      t4Text: '您好 [الاسم] 💳\n这是您的快捷支付链接：[إضافي]'
    }
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
    backupBox: '💾 Backup & Wiederherstellung',
    downloadBackup: '📥 Backup herunterladen (JSON)',
    restoreBackup: '♻️ Daten wiederherstellen',
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
    sendWaBtn: '🟢 Über WhatsApp senden',
    defaultDiscountLabel: 'Standard-Gutscheincode',
    customizeStatusTitle: '📌 Status anpassen',
    customizeRespTitle: '💬 Antwortstatus anpassen',
    customizeCatTitle: '🏷️️ Kategorien anpassen',
    newCatLabel: 'Neuer Kategoriename',
    newStatusLabel: 'Neuer Kundenstatus',
    newRespLabel: 'Neuer Antwortstatus',
    colorLabel: 'Farbe',
    addBtn: '➕ Hinzufügen',
    deleteBtn: 'Löschen',
    cats: {
      newCustomer: 'Neukunde',
      abandonedCart: 'Abgebrochener Warenkorb',
      pendingPayment: 'Zahlung ausstehend',
      shipped: 'Versendet & Geliefert'
    },
    statuses: {
      active: 'Aktiv',
      vip: 'VIP',
      paused: 'Pausiert',
      banned: 'Gesperrt'
    },
    responseStates: {
      pending: 'Antwort ausstehend',
      agreed: 'Deal vereinbart',
      closed: 'Bestellung geschlossen'
    },
    tpls: {
      t1Title: '✅ Bestellbestätigung',
      t1Text: 'Hallo [الاسم] 👋\nIhre Bestellung #[الطلب] wurde erfolgreich bestätigt.',
      t2Title: '🛒 Abgebrochener Warenkorb',
      t2Text: 'Hallo [الاسم] 😊\nWir haben bemerkt, dass Sie Artikel in Ihrem Warenkorb #[الطلب] gelassen haben.',
      t3Title: '📦 Sendungsverfolgung',
      t3Text: 'Hallo [الاسم] 📦\nIhre Bestellung #[الطلب] wurde versendet.',
      t4Title: '💳 Zahlungslink',
      t4Text: 'Hallo [الاسم] 💳\nHier ist Ihr Zahlungslink: [إضافي]'
    }
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
    backupBox: 'Cadangkan & Pulihkan Data',
    downloadBackup: 'Unduh Cadangan (JSON)',
    restoreBackup: 'Pulihkan dari File',
    perfIndicators: 'Indikator Kinerja Langsung',
    latestCustomers: 'Pelanggan Terbaru',
    dealSuccessRate: 'Tingkat Keberhasilan Kesepakatan',
    pendingResponses: 'Respon Tertunda',
    avgCustomerValue: 'Nilai Pelanggan (LTV)',
    categoryDistribution: 'Distribusi Kategori',
    singleMsgMode: 'Pesan Pelanggan Tunggal',
    broadcastMsgMode: 'Kampagne Siaran',
    targetCustomerData: 'Data Pelanggan Target',
    searchCrmPlaceholder: 'Ketik nama pelanggan...',
    selectTemplateTitle: 'Pilih atau Rancang Pesan',
    generateMsgBtn: 'Buat & Pratinjau Pesan',
    sendWaBtn: 'Kirim via WhatsApp',
    defaultDiscountLabel: 'Kode Diskon Default',
    customizeStatusTitle: 'Sesuaikan Status',
    customizeRespTitle: 'Sesuaikan Status Respon',
    customizeCatTitle: 'Sesuaikan Kategori',
    newCatLabel: 'Nama Kategori Baru',
    newStatusLabel: 'Status Pelanggan Baru',
    newRespLabel: 'Status Respon Baru',
    colorLabel: 'Warna',
    addBtn: '➕ Tambah',
    deleteBtn: 'Hapus',
    cats: {
      newCustomer: 'Pelanggan Baru',
      abandonedCart: 'Keranjang Terbengkalai',
      pendingPayment: 'Menunggu Pembayaran',
      shipped: 'Dikirim & Diterima'
    },
    statuses: {
      active: 'Aktif',
      vip: 'VIP',
      paused: 'Ditunda',
      banned: 'Diblokir'
    },
    responseStates: {
      pending: 'Menunggu Respon',
      agreed: 'Sepakat',
      closed: 'Pesanan Ditutup'
    },
    tpls: {
      t1Title: '✅ Konfirmasi Pesanan',
      t1Text: 'Halo [الاسم] 👋\nPesanan Anda #[الطلب] telah berhasil dikonfirmasi.',
      t2Title: '🛒 Keranjang Terbengkalai',
      t2Text: 'Halo [الاسم] 😊\nKami melihat ada produk di keranjang #[الطلب] Anda.',
      t3Title: '📦 Pelacakan Pengiriman',
      t3Text: 'Halo [الاسم] 📦\nPesanan #[الطلب] Anda telah dikirim.',
      t4Title: '💳 Tautan Pembayaran',
      t4Text: 'Halo [الاسم] 💳\nBerikut tautan pembayaran Anda: [إضافي]'
    }
  }
};

export default function EngaziaWhatsAppCRM() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'messaging' | 'tags' | 'analytics'>('dashboard');

  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newTimelineNote, setNewTimelineNote] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrderNumber, setNewOrderNumber] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newResponseState, setNewResponseState] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');

  const [statusOptions, setStatusOptions] = useState<StatusConfig[]>([]);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusBg, setNewStatusBg] = useState('#e0e7ff');
  const [newStatusColor, setNewStatusColor] = useState('#4f46e5');

  const [responseStateOptions, setResponseStateOptions] = useState<ResponseStateConfig[]>([]);
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
  
  const [broadcastCat, setBroadcastCat] = useState('');

  const [activeTemplateId, setActiveTemplateId] = useState<number>(1);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [categories, setCategories] = useState<TagConfig[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBg, setNewCatBg] = useState('#e0e7ff');
  const [newCatColor, setNewCatColor] = useState('#4f46e5');
  const [newCatIsSale, setNewCatIsSale] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const restoreFileRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const t = toolTranslations[currentLang] || toolTranslations.ar;
  const isRtl = currentLang === 'ar';

  useEffect(() => {
    if (t && t.cats) {
      if (categories.length === 0) {
        setCategories([
          { nameKey: 'newCustomer', fallbackName: t.cats.newCustomer, bg: '#dbeafe', color: '#1d4ed8', isSale: true },
          { nameKey: 'abandonedCart', fallbackName: t.cats.abandonedCart, bg: '#fee2e2', color: '#dc2626', isSale: false },
          { nameKey: 'pendingPayment', fallbackName: t.cats.pendingPayment, bg: '#fef3c7', color: '#d97706', isSale: false },
          { nameKey: 'shipped', fallbackName: t.cats.shipped, bg: '#dcfce7', color: '#15803d', isSale: true }
        ]);
      }
      if (statusOptions.length === 0) {
        setStatusOptions([
          { nameKey: 'active', fallbackName: t.statuses.active, bg: '#dcfce7', color: '#15803d' },
          { nameKey: 'vip', fallbackName: t.statuses.vip, bg: '#fef3c7', color: '#d97706' },
          { nameKey: 'paused', fallbackName: t.statuses.paused, bg: '#fee2e2', color: '#dc2626' },
          { nameKey: 'banned', fallbackName: t.statuses.banned, bg: '#f1f5f9', color: '#475569' }
        ]);
      }
      if (responseStateOptions.length === 0) {
        setResponseStateOptions([
          { nameKey: 'pending', fallbackName: t.responseStates.pending, bg: '#fef3c7', color: '#d97706' },
          { nameKey: 'agreed', fallbackName: t.responseStates.agreed, bg: '#dcfce7', color: '#15803d' },
          { nameKey: 'closed', fallbackName: t.responseStates.closed, bg: '#fee2e2', color: '#dc2626' }
        ]);
      }
      if (templates.length === 0) {
        setTemplates([
          { id: 1, titleKey: 't1Title', fallbackTitle: t.tpls.t1Title, textKey: 't1Text', fallbackText: t.tpls.t1Text },
          { id: 2, titleKey: 't2Title', fallbackTitle: t.tpls.t2Title, textKey: 't2Text', fallbackText: t.tpls.t2Text },
          { id: 3, titleKey: 't3Title', fallbackTitle: t.tpls.t3Title, textKey: 't3Text', fallbackText: t.tpls.t3Text },
          { id: 4, titleKey: 't4Title', fallbackTitle: t.tpls.t4Title, textKey: 't4Text', fallbackText: t.tpls.t4Text }
        ]);
      }
    }
  }, [currentLang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('engazia_global_lang') || 'ar';
      const savedCurr = localStorage.getItem('engazia_global_currency') || 'SAR';
      setCurrentLang(savedLang);
      setCurrentCurrency(savedCurr);
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

    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveContacts = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_whatsapp_pro_crm_v16', JSON.stringify(updated));
  };

  const saveCategories = (updated: TagConfig[]) => {
    setCategories(updated);
    localStorage.setItem('engazia_whatsapp_categories_v2', JSON.stringify(updated));
  };

  const saveStatuses = (updated: StatusConfig[]) => {
    setStatusOptions(updated);
    localStorage.setItem('engazia_whatsapp_statuses_v1', JSON.stringify(updated));
  };

  const saveResponseStates = (updated: ResponseStateConfig[]) => {
    setResponseStateOptions(updated);
    localStorage.setItem('engazia_whatsapp_response_states_v1', JSON.stringify(updated));
  };

  const exportBackupJSON = () => {
    const backupData = {
      defaultDiscountCode, contacts, categories, statusOptions, responseStateOptions, templates, version: '2.7'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `engazia_backup_${new Date().toISOString().slice(0, 10)}.json`;
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
        if (data && data.contacts) { setContacts(data.contacts); localStorage.setItem('engazia_whatsapp_pro_crm_v16', JSON.stringify(data.contacts)); }
        if (data && data.categories) { setCategories(data.categories); localStorage.setItem('engazia_whatsapp_categories_v2', JSON.stringify(data.categories)); }
        if (data && data.statusOptions) { setStatusOptions(data.statusOptions); localStorage.setItem('engazia_whatsapp_statuses_v1', JSON.stringify(data.statusOptions)); }
        if (data && data.responseStateOptions) { setResponseStateOptions(data.responseStateOptions); localStorage.setItem('engazia_whatsapp_response_states_v1', JSON.stringify(data.responseStateOptions)); }
        if (data && data.templates) { setTemplates(data.templates); localStorage.setItem('engazia_templates_v2', JSON.stringify(data.templates)); }
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

  const getCatDisplay = (catNameKey: string, fallback: string) => {
    if (t.cats && t.cats[catNameKey]) return t.cats[catNameKey];
    return fallback;
  };

  const getStatusDisplay = (stKey: string, fallback: string) => {
    if (t.statuses && t.statuses[stKey]) return t.statuses[stKey];
    return fallback;
  };

  const getRespDisplay = (respKey: string, fallback: string) => {
    if (t.responseStates && t.responseStates[respKey]) return t.responseStates[respKey];
    return fallback;
  };

  const getTplDisplay = (tpl: Template) => {
    const title = (t.tpls && t.tpls[tpl.titleKey]) ? t.tpls[tpl.titleKey] : tpl.fallbackTitle;
    const text = (t.tpls && t.tpls[tpl.textKey]) ? t.tpls[tpl.textKey] : tpl.fallbackText;
    return { title, text };
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
      category: newCategory || categories[0]?.fallbackName || '',
      status: newStatus || statusOptions[0]?.fallbackName || '',
      responseState: newResponseState || responseStateOptions[0]?.fallbackName || '',
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
    saveCategories([...categories, { nameKey: 'custom_' + Date.now(), fallbackName: newCatName, bg: newCatBg, color: newCatColor, isSale: newCatIsSale }]);
    setNewCatName('');
    showToast('🏷 تم إضافة التصنيف بنجاح');
  };

  const deleteCategory = (fallbackName: string) => {
    saveCategories(categories.filter(c => c.fallbackName !== fallbackName));
    showToast('🗑 تم حذف التصنيف');
  };

  const addStatusOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName) return;
    saveStatuses([...statusOptions, { nameKey: 'custom_st_' + Date.now(), fallbackName: newStatusName, bg: newStatusBg, color: newStatusColor }]);
    setNewStatusName('');
    showToast('✨ تم إضافة الحالة بنجاح');
  };

  const deleteStatusOption = (fallbackName: string) => {
    saveStatuses(statusOptions.filter(s => s.fallbackName !== fallbackName));
    showToast('🗑️ تم حذف الحالة');
  };

  const addResponseStateOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRespName) return;
    saveResponseStates([...responseStateOptions, { nameKey: 'custom_resp_' + Date.now(), fallbackName: newRespName, bg: newRespBg, color: newRespColor }]);
    setNewRespName('');
    showToast('✨ تم إضافة حالة الرد بنجاح');
  };

  const deleteResponseStateOption = (fallbackName: string) => {
    saveResponseStates(responseStateOptions.filter(r => r.fallbackName !== fallbackName));
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
    const resolvedTpl = getTplDisplay(tpl);
    let msg = resolvedTpl.text
      .replace(/\[الاسم\]/g, customerName || 'Customer')
      .replace(/\[الطلب\]/g, orderNumber || '---')
      .replace(/\[إضافي\]/g, extraInfo);
    if (includeDiscount) msg += `\n\n🎁 Discount Code: *${defaultDiscountCode}*`;
    setGeneratedMsg(msg);
  };

  const openWhatsAppDirect = (phone: string, text: string, customerId?: string) => {
    const clean = formatPhone(phone);
    const encodedText = encodeURIComponent(text);
    const url = clean ? `https://wa.me/${clean}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank');
    if (customerId) updateLastContact(customerId, 'مراسلة عبر Wa.me');
  };

  const saleCategoriesNames = categories.filter(cat => cat.isSale).map(cat => getCatDisplay(cat.nameKey, cat.fallbackName));
  const totalValidSales = contacts
    .filter(c => saleCategoriesNames.includes(c.category))
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  
  const filteredContacts = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm) || c.orderNumber.includes(searchTerm);
    const matchCat = filterCategory === 'all' || c.category === filterCategory;
    return matchSearch && matchCat;
  });

  const matchingCustomers = customerName.trim() === '' ? [] : contacts.filter(c => c.name.toLowerCase().includes(customerName.toLowerCase()));

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
        .header-brand { text-align: center; margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
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
        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 800; text-align: center; }
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
        .color-picker-sm { width: 34px; height: 34px; border-radius: 8px; cursor: pointer; border: 1px solid #e2e8f0; padding: 0; }
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
                  {categories.map(cat => {
                    const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                    return <option key={cat.nameKey || cat.fallbackName} value={catName}>{catName}</option>;
                  })}
                </select>
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.statusLabel}</span>
                <select className="modal-edit-input" value={selectedCustomer.status} onChange={e => updateCustomerField(selectedCustomer.id, 'status', e.target.value)}>
                  {statusOptions.map(st => {
                    const stName = getStatusDisplay(st.nameKey, st.fallbackName);
                    return <option key={st.nameKey || st.fallbackName} value={stName}>{stName}</option>;
                  })}
                </select>
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.responseStateLabel}</span>
                <select className="modal-edit-input" value={selectedCustomer.responseState} onChange={e => updateCustomerField(selectedCustomer.id, 'responseState', e.target.value)}>
                  {responseStateOptions.map(resp => {
                    const respName = getRespDisplay(resp.nameKey, resp.fallbackName);
                    return <option key={resp.nameKey || resp.fallbackName} value={respName}>{respName}</option>;
                  })}
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
        </div>

        <div className="header-brand">
          <h1 className="brand-title">WhatsApp <span>CRM</span></h1>
          <p className="brand-desc">{t.desc}</p>
        </div>

        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>{t.tabDashboard}</button>
          <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>{t.tabAnalytics}</button>
          <button className={`tab-btn ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>{t.tabCrm}</button>
          <button className={`tab-btn ${activeTab === 'messaging' ? 'active' : ''}`} onClick={() => setActiveTab('messaging')}>{t.tabMessaging}</button>
          <button className={`tab-btn ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>{t.tabTags}</button>
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
                <div className="stat-num">{contacts.length}</div>
              </div>
              {categories.map(cat => {
                const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                return (
                  <div key={cat.nameKey || cat.fallbackName} className="stat-card" style={{ borderBottom: `4px solid ${cat.color}` }}>
                    <div className="stat-title">{catName}</div>
                    <div className="stat-num">{contacts.filter(c => c.category === catName).length}</div>
                  </div>
                );
              })}
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
                  {contacts.slice(0, 5).map(c => {
                    const matchedResp = responseStateOptions.find(r => getRespDisplay(r.nameKey, r.fallbackName) === c.responseState);
                    const matchedCat = categories.find(cat => getCatDisplay(cat.nameKey, cat.fallbackName) === c.category);
                    const matchedSt = statusOptions.find(st => getStatusDisplay(st.nameKey, st.fallbackName) === c.status);
                    return (
                      <tr key={c.id}>
                        <td><span style={{ fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>{c.name}</span></td>
                        <td style={{direction: 'ltr', textAlign: 'left'}}>{c.orderNumber}</td>
                        <td><span className="badge" style={{ background: matchedCat?.bg || '#eee', color: matchedCat?.color || '#000' }}>{c.category}</span></td>
                        <td><span className="badge" style={{ background: matchedSt?.bg || '#eee', color: matchedSt?.color || '#000' }}>{c.status}</span></td>
                        <td><span className="badge" style={{ background: matchedResp?.bg || '#fef3c7', color: matchedResp?.color || '#d97706' }}>{c.responseState}</span></td>
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
                  {contacts.length === 0 && <tr><td colSpan={7} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>لا يوجد عملاء مسجلين بعد.</td></tr>}
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
                  {contacts.length > 0 ? ((contacts.filter(c => c.responseState === getRespDisplay('agreed', 'تم الاتفاق')).length / contacts.length) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="stat-card" style={{ textAlign: isRtl ? 'right' : 'left', padding: '25px' }}>
                <div className="stat-title" style={{ marginBottom: '10px' }}>{t.pendingResponses}</div>
                <div className="stat-num" style={{ color: '#d97706', textAlign: isRtl ? 'right' : 'left' }}>
                  {contacts.filter(c => c.responseState === getRespDisplay('pending', 'بانتظار الرد') || !c.responseState).length}
                </div>
              </div>
              <div className="stat-card" style={{ textAlign: isRtl ? 'right' : 'left', padding: '25px' }}>
                <div className="stat-title" style={{ marginBottom: '10px' }}>{t.avgCustomerValue}</div>
                <div className="stat-num" style={{ color: '#4f46e5', textAlign: isRtl ? 'right' : 'left' }}>
                  {contacts.length > 0 ? (totalValidSales / contacts.length).toFixed(0) : 0} <span style={{fontSize:'12px'}}>{currentCurrency}</span>
                </div>
              </div>
            </div>

            <div className="section-box" style={{ marginTop: '20px' }}>
              <div className="section-title">{t.categoryDistribution}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                {categories.map(cat => {
                  const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                  const count = contacts.filter(c => c.category === catName).length;
                  const pct = contacts.length > 0 ? (count / contacts.length) * 100 : 0;
                  return (
                    <div key={cat.nameKey || cat.fallbackName}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, marginBottom: '5px' }}>
                        <span>{catName} ({count})</span>
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
                      {categories.map(cat => {
                        const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                        return <option key={cat.nameKey || cat.fallbackName} value={catName}>{catName}</option>;
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.statusLabel}</label>
                    <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                      {statusOptions.map(st => {
                        const stName = getStatusDisplay(st.nameKey, st.fallbackName);
                        return <option key={st.nameKey || st.fallbackName} value={stName}>{stName}</option>;
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.responseStateLabel}</label>
                    <select className="form-control" value={newResponseState} onChange={e => setNewResponseState(e.target.value)}>
                      {responseStateOptions.map(resp => {
                        const respName = getRespDisplay(resp.nameKey, resp.fallbackName);
                        return <option key={resp.nameKey || resp.fallbackName} value={respName}>{respName}</option>;
                      })}
                    </select>
                  </div>
                  <div className="form-group"><label>{t.amountLabel} ({currentCurrency})</label><input type="text" className="form-control input-ltr" value={newAmount} onChange={e => setNewAmount(toEnglishDigits(e.target.value))} placeholder="0" /></div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}><label>{t.noteLabel}</label><input type="text" className="form-control" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="..." /></div>
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
                <button className={`chip-btn ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>All ({contacts.length})</button>
                {categories.map(cat => {
                  const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                  return (
                    <button key={cat.nameKey || cat.fallbackName} className={`chip-btn ${filterCategory === catName ? 'active' : ''}`} onClick={() => setFilterCategory(catName)}>
                      {catName} ({contacts.filter(c => c.category === catName).length})
                    </button>
                  );
                })}
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
                          {categories.map(cat => {
                            const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                            return <option key={cat.nameKey || cat.fallbackName} value={catName}>{catName}</option>;
                          })}
                        </select>
                      </td>
                      <td>
                        <select className="cell-input" value={c.status} onChange={e => updateCustomerField(c.id, 'status', e.target.value)}>
                          {statusOptions.map(st => {
                            const stName = getStatusDisplay(st.nameKey, st.fallbackName);
                            return <option key={st.nameKey || st.fallbackName} value={stName}>{stName}</option>;
                          })}
                        </select>
                      </td>
                      <td>
                        <select className="cell-input" value={c.responseState} onChange={e => updateCustomerField(c.id, 'responseState', e.target.value)}>
                          {responseStateOptions.map(resp => {
                            const respName = getRespDisplay(resp.nameKey, resp.fallbackName);
                            return <option key={resp.nameKey || resp.fallbackName} value={respName}>{respName}</option>;
                          })}
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
                  <div className="section-title">1. Broadcast Target Segment</div>
                  <div className="form-group" style={{ maxWidth: '400px' }}>
                    <label>Select Target Category:</label>
                    <select className="form-control" value={broadcastCat} onChange={e => setBroadcastCat(e.target.value)}>
                      {categories.map(cat => {
                        const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                        return <option key={cat.nameKey || cat.fallbackName} value={catName}>{catName} ({contacts.filter(c => c.category === catName).length})</option>;
                      })}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="section-box">
              <div className="section-title">{t.selectTemplateTitle}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {templates.map(tpl => {
                  const resolved = getTplDisplay(tpl);
                  return (
                    <div key={tpl.id} onClick={() => setActiveTemplateId(tpl.id)} style={{ padding: '12px 10px', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontWeight: 800, fontSize: '12px', color: activeTemplateId === tpl.id ? '#4f46e5' : '#64748b', background: activeTemplateId === tpl.id ? '#eef2ff' : '#fff' }}>
                      {resolved.title}
                    </div>
                  );
                })}
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
            {/* تخصيص تصنيفات العملاء */}
            <div className="section-box">
              <div className="section-title">{t.customizeCatTitle}</div>
              <form onSubmit={addCategory} className="settings-creation-box">
                <div className="form-group" style={{ flex: 2, margin: 0 }}>
                  <label>{t.newCatLabel}</label>
                  <input type="text" className="form-control" placeholder="..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.colorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newCatBg} onChange={e => setNewCatBg(e.target.value)} />
                </div>
                <button type="submit" className="btn-main" style={{ padding: '12px 20px' }}>{t.addBtn}</button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categories.map(cat => {
                  const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                  return (
                    <div key={cat.nameKey || cat.fallbackName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span className="badge" style={{ background: cat.bg, color: cat.color }}>{catName}</span>
                      <button className="btn-sm btn-danger" onClick={() => deleteCategory(cat.fallbackName)}>{t.deleteBtn}</button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* تخصيص حالات العميل */}
            <div className="section-box">
              <div className="section-title">{t.customizeStatusTitle}</div>
              <form onSubmit={addStatusOption} className="settings-creation-box">
                <div className="form-group" style={{ flex: 2, margin: 0 }}>
                  <label>{t.newStatusLabel}</label>
                  <input type="text" className="form-control" placeholder="..." value={newStatusName} onChange={e => setNewStatusName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.colorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newStatusBg} onChange={e => setNewStatusBg(e.target.value)} />
                </div>
                <button type="submit" className="btn-main" style={{ padding: '12px 20px' }}>{t.addBtn}</button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {statusOptions.map(st => {
                  const stName = getStatusDisplay(st.nameKey, st.fallbackName);
                  return (
                    <div key={st.nameKey || st.fallbackName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span className="badge" style={{ background: st.bg, color: st.color }}>{stName}</span>
                      <button className="btn-sm btn-danger" onClick={() => deleteStatusOption(st.fallbackName)}>{t.deleteBtn}</button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* تخصيص حالات الرد */}
            <div className="section-box">
              <div className="section-title">{t.customizeRespTitle}</div>
              <form onSubmit={addResponseStateOption} className="settings-creation-box">
                <div className="form-group" style={{ flex: 2, margin: 0 }}>
                  <label>{t.newRespLabel}</label>
                  <input type="text" className="form-control" placeholder="..." value={newRespName} onChange={e => setNewRespName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.colorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newRespBg} onChange={e => setNewRespBg(e.target.value)} />
                </div>
                <button type="submit" className="btn-main" style={{ padding: '12px 20px' }}>{t.addBtn}</button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {responseStateOptions.map(resp => {
                  const respName = getRespDisplay(resp.nameKey, resp.fallbackName);
                  return (
                    <div key={resp.nameKey || resp.fallbackName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span className="badge" style={{ background: resp.bg, color: resp.color }}>{respName}</span>
                      <button className="btn-sm btn-danger" onClick={() => deleteResponseStateOption(resp.fallbackName)}>{t.deleteBtn}</button>
                    </div>
                  );
                })}
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
          </div>
        )}
      </div>
    </div>
  );
}
