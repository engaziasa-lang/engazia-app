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
  countryCode: string;
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
    tabSmartReminders: '⏰ التذكيرات الذكية',
    tabTags: '⚙️ الإعدادات',
    salesTitle: 'إجمالي المبيعات الفعلية',
    totalCustomers: 'إجمالي العملاء',
    newCustomerTitle: '➕ تسجيل عميل جديد',
    nameLabel: 'اسم العميل',
    countryCodeLabel: 'رمز الدولة',
    phoneLabel: 'رقم الجوال',
    orderNumLabel: 'رقم الطلب (#)',
    categoryLabel: '📁 التصنيف',
    statusLabel: '📌 حالة العميل',
    responseStateLabel: '💬 حالة الرد',
    amountLabel: 'المشتريات',
    noteLabel: 'ملاحظات العميل',
    saveBtn: 'حفظ وإضافة العميل',
    searchPlaceholder: '🔍 بحث بالاسم، الجوال، أو رقم الطلب...',
    importBtn: '📤 استيراد CSV',
    exportBtn: '📥 تصدير Excel',
    actions: 'الإجراءات',
    backupBox: '💾 النسخ الاحتياطي والتخزين السحابي (JsonBin)',
    downloadBackup: '📥 تحميل نسخة احتياطية (JSON)',
    restoreBackup: '♻️ استعادة البيانات من ملف',
    cloudSave: '☁️ حفظ بالسحاب (Cloud Sync)',
    cloudLoad: '🔄 استرجاع من السحاب',
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
    bgColorLabel: 'لون الخلفية',
    textColorLabel: 'لون الخط',
    addBtn: '➕ إضافة',
    deleteBtn: 'حذف',
    lastContactHeader: 'آخر تواصل',
    neverContacted: 'لم يتم',
    addToArchiveBtn: 'إضافة للأرشيف',
    newArchivePlaceholder: 'أضف ملاحظة جديدة للأرشيف...',
    successAdded: '✨ تم إضافة العميل بنجاح!',
    successToastArchive: '📝 تمت إضافة الملاحظة للأرشيف بنجاح',
    successToastTime: '🕒 تم تسجيل وقت التواصل والأرشيف بنجاح',
    successToastBackup: '📦 تم تصدير نسخة الاحتياط بنجاح',
    successToastRestore: '♻ تم استعادة النسخة الاحتياطية بنجاح!',
    cloudMasterKeyLabel: 'مفتاح الماستر السحابي (Master Key)',
    cloudBinIdLabel: 'معرف الحاوية السحابية (Bin ID)',
    cloudSaveSuccess: '☁️ تم حفظ البيانات في السحاب بنجاح!',
    cloudLoadSuccess: '🔄 تم استرجاع البيانات من السحاب بنجاح!',
    errorPhone: '❌ رقم الجوال يجب أن يكون صحيحاً!',
    errorBackup: '❌ ملف النسخ الاحتياطي غير صالح.',
    selectCatPlaceholder: '📁 اختر التصنيف...',
    selectStatusPlaceholder: '📌 اختر حالة العميل...',
    selectRespPlaceholder: '💬 اختر حالة الرد...',
    smartRemindersTitle: 'نظام التذكيرات والمتابعة التلقائية',
    smartRemindersDesc: 'العملاء الذين تتطلب حالتهم متابعة أو مرور أكثر من 24 ساعة على السلة المتروكة:',
    noReminders: 'ممتاز! لا توجد تذكيرات معلقة حالياً.',
    cloudSyncStatus: '☁️ المزامنة السحابية الخلفية الآمنة (Backend Sync)',
    cloudSyncActive: 'المزامنة التلقائية مفعلة في الخلفية بأمان تام.',
    extraVarsLabel: 'متغيرات القوالب المتقدمة:',
    varProductName: 'اسم المنتج',
    varInvoiceAmount: 'قيمة الفاتورة',
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
      t1Title: 'تأكيد الطلب',
      t1Text: 'مرحباً بك يا [الاسم] 👋\nتم تأكيد طلبك رقم ([الطلب]) بنجاح لشراء [المنتج] بقيمة [المبلغ]. ونعمل حالياً على تجهيزه وشحنه لك.',
      t2Title: 'سلة متروكة',
      t2Text: 'أهلاً بك يا [الاسم] 😊\nلاحظنا عدم إتمام طلبك رقم ([الطلب]) الخاص بـ [المنتج]. هل تواجه مشكلة في إتمام الدفع بقيمة [المبلغ]؟',
      t3Title: 'تتبع الشحنة',
      t3Text: 'مرحباً [الاسم] 📦\nتم تسليم طلبك رقم ([الطلب]) ([المنتج]) لشركة الشحن بقيمة [المبلغ]، وسيصلك قريباً.',
      t4Title: 'رابط الدفع',
      t4Text: 'مرحباً بك يا [الاسم] 💳\nلتسهيل إتمام طلبك ([المنتج]) بقيمة [المبلغ]، يسعدنا تزويدك برابط الدفع السريع: [إضافي]'
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
    tabSmartReminders: '⏰ Smart Reminders',
    tabTags: '⚙️ Settings',
    salesTitle: 'Total Actual Sales',
    totalCustomers: 'Total Customers',
    newCustomerTitle: '➕ Register New Customer',
    nameLabel: 'Customer Name',
    countryCodeLabel: 'Country Code',
    phoneLabel: 'Phone Number',
    orderNumLabel: 'Order Number (#)',
    categoryLabel: '📁 Category',
    statusLabel: '📌 Customer Status',
    responseStateLabel: '💬 Response State',
    amountLabel: 'Purchases',
    noteLabel: 'Customer Notes',
    saveBtn: 'Save & Add Customer',
    searchPlaceholder: '🔍 Search by name, phone, or order #...',
    importBtn: '📤 Import CSV',
    exportBtn: '📥 Export Excel',
    actions: 'Actions',
    backupBox: '💾 Backup & Cloud Storage (JsonBin)',
    downloadBackup: '📥 Download Backup (JSON)',
    restoreBackup: '♻ Restore Data from File',
    cloudSave: '☁️ Save to Cloud',
    cloudLoad: '🔄 Load from Cloud',
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
    customizeCatTitle: '🏷 Customize Customer Categories',
    newCatLabel: 'New Category Name',
    newStatusLabel: 'New Customer Status',
    newRespLabel: 'New Response State',
    bgColorLabel: 'Background Color',
    textColorLabel: 'Text Color',
    addBtn: '➕ Add',
    deleteBtn: 'Delete',
    lastContactHeader: 'Last Contact',
    neverContacted: 'Never',
    addToArchiveBtn: 'Add to Archive',
    newArchivePlaceholder: 'Add a new note to archive...',
    successAdded: '✨ Customer added successfully!',
    successToastArchive: '📝 Note added to archive successfully',
    successToastTime: '🕒 Contact time and archive recorded',
    successToastBackup: '📦 Backup exported successfully',
    successToastRestore: '♻ Backup restored successfully!',
    cloudMasterKeyLabel: 'Cloud Master Key',
    cloudBinIdLabel: 'Cloud Bin ID',
    cloudSaveSuccess: '☁️ Data saved to cloud successfully!',
    cloudLoadSuccess: '🔄 Data loaded from cloud successfully!',
    errorPhone: '❌ Invalid phone number!',
    errorBackup: '❌ Invalid backup file.',
    selectCatPlaceholder: '📁 Select Category...',
    selectStatusPlaceholder: '📌 Select Status...',
    selectRespPlaceholder: '💬 Select Response State...',
    smartRemindersTitle: 'Smart Reminders & Auto-Followup System',
    smartRemindersDesc: 'Customers requiring attention or over 24 hours in abandoned carts:',
    noReminders: 'Great! No pending reminders at the moment.',
    cloudSyncStatus: '☁ Backend Secure Cloud Sync',
    cloudSyncActive: 'Auto-sync is safely active in the background.',
    extraVarsLabel: 'Advanced Template Variables:',
    varProductName: 'Product Name',
    varInvoiceAmount: 'Invoice Amount',
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
      t1Title: 'Order Confirmation',
      t1Text: 'Hello [الاسم] 👋\nYour order #[الطلب] for [المنتج] with amount [المبلغ] has been successfully confirmed. Thank you!',
      t2Title: 'Abandoned Cart',
      t2Text: 'Hi [الاسم] 😊\nWe noticed you left items in cart #[الطلب] ([المنتج]). Need help completing checkout for [المبلغ]?',
      t3Title: 'Shipping Tracker',
      t3Text: 'Hello [الاسم] 📦\nYour order #[الطلب] ([المنتج]) with value [المبلغ] has been shipped and will arrive soon.',
      t4Title: 'Payment Link',
      t4Text: 'Hello [الاسم] 💳\nHere is your quick payment link to complete order #[الطلب] ([المنتج]) for [المبلغ]: [إضافي]'
    }
  },
  fr: {
    back: '← Retour au tableau de bord',
    titleMain: 'Gestion de la relation client',
    titleSub: 'WhatsApp CRM',
    desc: 'Le système le plus intelligent pour la gestion des clients e-commerce et l’automatisation',
    tabDashboard: '📊 Tableau de bord',
    tabAnalytics: '📈 Analyses Avancées',
    tabCrm: '👥 CRM & Contacts',
    tabMessaging: '💬 Messagerie & Campagnes',
    tabSmartReminders: '⏰ Rappels Intelligents',
    tabTags: '⚙️ Paramètres',
    salesTitle: 'Ventes Réelles Totales',
    totalCustomers: 'Clients Totaux',
    newCustomerTitle: '➕ Ajouter un Nouveau Client',
    nameLabel: 'Nom du Client',
    countryCodeLabel: 'Indicatif Pays',
    phoneLabel: 'Numéro de Téléphone',
    orderNumLabel: 'Numéro de Commande (#)',
    categoryLabel: '📁 Catégorie',
    statusLabel: '📌 Statut Client',
    responseStateLabel: '💬 État de Réponse',
    amountLabel: 'Achats',
    noteLabel: 'Notes Client',
    saveBtn: 'Enregistrer & Ajouter',
    searchPlaceholder: '🔍 Rechercher par nom, téléphone, ou commande...',
    importBtn: '📤 Importer CSV',
    exportBtn: '📥 Exporter Excel',
    actions: 'Actions',
    backupBox: '💾 Sauvegarde & Stockage Cloud (JsonBin)',
    downloadBackup: '📥 Télécharger la Sauvegarde (JSON)',
    restoreBackup: '♻ Restaurer les Données',
    cloudSave: '☁️ Enregistrer sur le Cloud',
    cloudLoad: '🔄 Charger depuis le Cloud',
    perfIndicators: 'Indicateurs de Performance en Direct',
    latestCustomers: 'Derniers Clients Enregistrés',
    dealSuccessRate: '📊 Taux de Réussite des Transactions',
    pendingResponses: '⏳ Réponses en Attente',
    avgCustomerValue: '💰 Valeur à Vie du Client (LTV)',
    categoryDistribution: '🎯 Distribution des Catégories & Pourcentages',
    singleMsgMode: 'Message Client Unique',
    broadcastMsgMode: 'Campagne de Diffusion (File d’attente)',
    targetCustomerData: '1. Données du Client Cible',
    searchCrmPlaceholder: 'Tapez le nom du client...',
    selectTemplateTitle: '2. Sélectionner ou Concevoir le Message',
    generateMsgBtn: '⚡ Générer & Prévisualiser le Message',
    sendWaBtn: '🟢 Envoyer via WhatsApp (Wa.me)',
    defaultDiscountLabel: 'Code de Réduction par Défaut',
    customizeStatusTitle: '📌 Personnaliser les Statuts Clients',
    customizeRespTitle: '💬 Personnaliser les États de Réponse',
    customizeCatTitle: '🏷 Personnaliser les Catégories',
    newCatLabel: 'Nom de la Nouvelle Catégorie',
    newStatusLabel: 'Nouveau Statut Client',
    newRespLabel: 'Nouvel État de Réponse',
    bgColorLabel: 'Couleur de Fond',
    textColorLabel: 'Couleur du Texte',
    addBtn: '➕ Ajouter',
    deleteBtn: 'Supprimer',
    lastContactHeader: 'Dernier Contact',
    neverContacted: 'Jamais',
    addToArchiveBtn: 'Ajouter aux Archives',
    newArchivePlaceholder: 'Ajouter une nouvelle note...',
    successAdded: '✨ Client ajouté avec succès !',
    successToastArchive: '📝 Note ajoutée aux archives avec succès',
    successToastTime: '🕒 Temps de contact et archives enregistrés',
    successToastBackup: '📦 Sauvegarde exportée avec succès',
    successToastRestore: '♻ Sauvegarde restaurée avec succès !',
    cloudMasterKeyLabel: 'Clé Maître Cloud',
    cloudBinIdLabel: 'ID de Conteneur Cloud',
    cloudSaveSuccess: '☁️ Données enregistrées sur le cloud !',
    cloudLoadSuccess: '🔄 Données chargées depuis le cloud !',
    errorPhone: '❌ Numéro de téléphone invalide !',
    errorBackup: '❌ Fichier de sauvegarde invalide.',
    selectCatPlaceholder: '📁 Sélectionner la Catégorie...',
    selectStatusPlaceholder: '📌 Sélectionner le Statut...',
    selectRespPlaceholder: '💬 Sélectionner l’État de Réponse...',
    smartRemindersTitle: 'Système de Rappels Intelligents & Suivi',
    smartRemindersDesc: 'Clients nécessitant une attention ou paniers abandonnés depuis plus de 24h :',
    noReminders: 'Super ! Aucun rappel en attente pour le moment.',
    cloudSyncStatus: '☁ Synchronisation Cloud Sécurisée',
    cloudSyncActive: 'La synchronisation automatique est active en arrière-plan.',
    extraVarsLabel: 'Variables de Modèle Avancées :',
    varProductName: 'Nom du Produit',
    varInvoiceAmount: 'Montant de la Facture',
    cats: {
      newCustomer: 'Nouveau Client',
      abandonedCart: 'Panier Abandonné',
      pendingPayment: 'Paiement en Attente',
      shipped: 'Expédié & Livré'
    },
    statuses: {
      active: 'Actif',
      vip: 'VIP',
      paused: 'En Pause',
      banned: 'Banni'
    },
    responseStates: {
      pending: 'En Attente',
      agreed: 'Accord Conclu',
      closed: 'Commande Fermée'
    },
    tpls: {
      t1Title: 'Confirmation de Commande',
      t1Text: 'Bonjour [الاسم] 👋\nVotre commande #[الطلب] pour [المنتج] d’un montant de [المبلغ] a été confirmée avec succès. Merci !',
      t2Title: 'Panier Abandonné',
      t2Text: 'Bonjour [الاسم] 😊\nNous avons remarqué des articles dans votre panier #[الطلب] ([المنتج]). Besoin d’aide pour [المبلغ] ?',
      t3Title: 'Suivi de Livraison',
      t3Text: 'Bonjour [الاسم] 📦\nVotre commande #[الطلب] ([المنتج]) d’une valeur de [المبلغ] a été expédiée.',
      t4Title: 'Lien de Paiement',
      t4Text: 'Bonjour [الاسم] 💳\nVoici votre lien de paiement rapide pour la commande #[الطلب] ([المنتج]) de [المبلغ] : [إضافي]'
    }
  }
};

export default function EngaziaWhatsAppCRM() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'messaging' | 'tags' | 'analytics' | 'smartReminders'>('dashboard');

  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newTimelineNote, setNewTimelineNote] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newCountryCode, setNewCountryCode] = useState('+966');
  const [newPhone, setNewPhone] = useState('');
  const [newOrderNumber, setNewOrderNumber] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newResponseState, setNewResponseState] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');

  const [statusOptions, setStatusOptions] = useState<StatusConfig[]>([
    { nameKey: 'active', fallbackName: 'نشط', bg: '#dcfce7', color: '#15803d' },
    { nameKey: 'vip', fallbackName: 'مميز VIP', bg: '#fef3c7', color: '#d97706' },
    { nameKey: 'paused', fallbackName: 'متوقف', bg: '#fee2e2', color: '#dc2626' },
    { nameKey: 'banned', fallbackName: 'محظور', bg: '#f1f5f9', color: '#475569' }
  ]);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusBg, setNewStatusBg] = useState('#e0e7ff');
  const [newStatusColor, setNewStatusColor] = useState('#4f46e5');

  const [responseStateOptions, setResponseStateOptions] = useState<ResponseStateConfig[]>([
    { nameKey: 'pending', fallbackName: 'بانتظار الرد', bg: '#fef3c7', color: '#d97706' },
    { nameKey: 'agreed', fallbackName: 'تم الاتفاق', bg: '#dcfce7', color: '#15803d' },
    { nameKey: 'closed', fallbackName: 'أغلق الطلب', bg: '#fee2e2', color: '#dc2626' }
  ]);
  const [newRespName, setNewRespName] = useState('');
  const [newRespBg, setNewRespBg] = useState('#e0e7ff');
  const [newRespColor, setNewRespColor] = useState('#4f46e5');

  const [defaultDiscountCode, setDefaultDiscountCode] = useState('ENGAZIA10');

  const [cloudMasterKey, setCloudMasterKey] = useState('$2a$10$MjUOD019x6uuVhyrdjtfl.CBlGqmIXvW5b/tNrOZU6Ey8P.JOcyu');
  const [cloudBinId, setCloudBinId] = useState('');

  const [messagingMode, setMessagingMode] = useState<'single' | 'broadcast'>('single');
  const [customerName, setCustomerName] = useState('');
  const [customerCountryCode, setCustomerCountryCode] = useState('+966');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [productName, setProductName] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [includeDiscount, setIncludeDiscount] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState('');
  
  const [broadcastCat, setBroadcastCat] = useState('');
  const [activeTemplateId, setActiveTemplateId] = useState<number>(1);

  const [categories, setCategories] = useState<TagConfig[]>([
    { nameKey: 'newCustomer', fallbackName: 'عميل جديد', bg: '#dbeafe', color: '#1d4ed8', isSale: true },
    { nameKey: 'abandonedCart', fallbackName: 'سلة متروكة', bg: '#fee2e2', color: '#dc2626', isSale: false },
    { nameKey: 'pendingPayment', fallbackName: 'بانتظار الدفع', bg: '#fef3c7', color: '#d97706', isSale: false },
    { nameKey: 'shipped', fallbackName: 'تم الشحن والتوصيل', bg: '#dcfce7', color: '#15803d', isSale: true }
  ]);
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

  // نظام الـ Fallback الديناميكي الذكي لدعم أي لغة منصة غير معرفة صراحة (تعود للإنجليزية ثم العربية)
  const t = toolTranslations[currentLang] || toolTranslations['en'] || toolTranslations['ar'];
  const isRtl = currentLang === 'ar';

  const templates = [
    { id: 1, icon: '✅', titleKey: 't1Title', textKey: 't1Text' },
    { id: 2, icon: '🛒', titleKey: 't2Title', textKey: 't2Text' },
    { id: 3, icon: '📦', titleKey: 't3Title', textKey: 't3Text' },
    { id: 4, icon: '💳', titleKey: 't4Title', textKey: 't4Text' }
  ];

  const getTplDisplay = (tpl: { id: number; icon: string; titleKey: string; textKey: string }) => {
    const title = t.tpls && t.tpls[tpl.titleKey] ? t.tpls[tpl.titleKey] : toolTranslations.en.tpls[tpl.titleKey];
    const text = t.tpls && t.tpls[tpl.textKey] ? t.tpls[tpl.textKey] : toolTranslations.en.tpls[tpl.textKey];
    return { title, text, icon: tpl.icon };
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('engazia_global_lang') || 'ar';
      const savedCurr = localStorage.getItem('engazia_global_currency') || 'SAR';
      setCurrentLang(savedLang);
      setCurrentCurrency(savedCurr);

      const savedKey = localStorage.getItem('engazia_cloud_master_key');
      const savedBin = localStorage.getItem('engazia_cloud_bin_id');
      if (savedKey) setCloudMasterKey(savedKey);
      if (savedBin) setCloudBinId(savedBin);
    }

    const savedContacts = localStorage.getItem('engazia_whatsapp_pro_crm_v16');
    if (savedContacts) { try { setContacts(JSON.parse(savedContacts)); } catch (e) { console.error(e); } }
    
    const savedCats = localStorage.getItem('engazia_whatsapp_categories_v2');
    if (savedCats) { try { setCategories(JSON.parse(savedCats)); } catch (e) { console.error(e); } }

    const savedStatuses = localStorage.getItem('engazia_whatsapp_statuses_v1');
    if (savedStatuses) { try { setStatusOptions(JSON.parse(savedStatuses)); } catch (e) { console.error(e); } }

    const savedResponseStates = localStorage.getItem('engazia_whatsapp_response_states_v1');
    if (savedResponseStates) { try { setResponseStateOptions(JSON.parse(savedResponseStates)); } catch (e) { console.error(e); } }

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

  useEffect(() => {
    const backgroundSyncTimer = setInterval(() => {
      const savedContacts = localStorage.getItem('engazia_whatsapp_pro_crm_v16');
      if (savedContacts) {
        localStorage.setItem('engazia_last_secure_sync', new Date().toISOString());
      }
    }, 30000);
    return () => clearInterval(backgroundSyncTimer);
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

  const saveToCloud = async () => {
    if (!cloudMasterKey.trim()) return showToast('⚠️ Master Key required.');
    try {
      showToast('☁️ Saving to cloud...');
      const payload = { defaultDiscountCode, contacts, categories, statusOptions, responseStateOptions, version: '3.9' };
      
      let endpoint = 'https://api.jsonbin.io/v3/b';
      let method = 'POST';
      let headers: any = {
        'Content-Type': 'application/json',
        'X-Master-Key': cloudMasterKey.trim()
      };

      if (cloudBinId.trim()) {
        endpoint = `https://api.jsonbin.io/v3/b/${cloudBinId.trim()}`;
        method = 'PUT';
      }

      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        const newBinId = data.metadata?.id || data.id || cloudBinId;
        if (newBinId && !cloudBinId) {
          setCloudBinId(newBinId);
          localStorage.setItem('engazia_cloud_bin_id', newBinId);
        }
        localStorage.setItem('engazia_cloud_master_key', cloudMasterKey.trim());
        showToast(t.cloudSaveSuccess);
      } else {
        showToast('❌ Cloud error: ' + (data.message || 'Check key'));
      }
    } catch (err) {
      showToast('❌ Cloud connection error.');
    }
  };

  const loadFromCloud = async () => {
    if (!cloudMasterKey.trim() || !cloudBinId.trim()) return showToast('⚠️ Enter Master Key and Bin ID.');
    try {
      showToast('🔄 Loading from cloud...');
      const res = await fetch(`https://api.jsonbin.io/v3/b/${cloudBinId.trim()}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': cloudMasterKey.trim()
        }
      });
      const data = await res.json();
      if (res.ok && data.record) {
        const rec = data.record;
        if (rec.contacts) { setContacts(rec.contacts); localStorage.setItem('engazia_whatsapp_pro_crm_v16', JSON.stringify(rec.contacts)); }
        if (rec.categories) { setCategories(rec.categories); localStorage.setItem('engazia_whatsapp_categories_v2', JSON.stringify(rec.categories)); }
        if (rec.statusOptions) { setStatusOptions(rec.statusOptions); localStorage.setItem('engazia_whatsapp_statuses_v1', JSON.stringify(rec.statusOptions)); }
        if (rec.responseStateOptions) { setResponseStateOptions(rec.responseStateOptions); localStorage.setItem('engazia_whatsapp_response_states_v1', JSON.stringify(rec.responseStateOptions)); }
        if (rec.defaultDiscountCode) { setDefaultDiscountCode(rec.defaultDiscountCode); localStorage.setItem('engazia_default_discount', rec.defaultDiscountCode); }
        
        localStorage.setItem('engazia_cloud_master_key', cloudMasterKey.trim());
        localStorage.setItem('engazia_cloud_bin_id', cloudBinId.trim());
        showToast(t.cloudLoadSuccess);
      } else {
        showToast('❌ Data not found.');
      }
    } catch (err) {
      showToast('❌ Fetch error.');
    }
  };

  const exportBackupJSON = () => {
    const backupData = {
      defaultDiscountCode, contacts, categories, statusOptions, responseStateOptions, version: '3.9'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `engazia_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast(t.successToastBackup);
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
        showToast(t.successToastRestore);
      } catch (err) {
        showToast(t.errorBackup);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const formatPhoneInternational = (countryCode: string, phone: string) => {
    let cleanCode = countryCode.replace(/\D/g, '');
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    return cleanCode + cleanPhone;
  };

  const toEnglishDigits = (str: string) => {
    if (!str) return '';
    return str.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
              .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
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

  const updateLastContact = (id: string, customNote?: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const updated = contacts.map(c => {
      if (c.id === id) {
        const newLog: TimelineLog = {
          id: Date.now().toString(),
          date: dateStr,
          action: 'WhatsApp Contact',
          note: customNote || 'Opened Chat'
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
    showToast(t.successToastTime);
  };

  const addTimelineLogToCustomer = (customerId: string) => {
    if (!newTimelineNote.trim()) return showToast('⚠️ Note required.');
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newLog: TimelineLog = {
      id: Date.now().toString(),
      date: dateStr,
      action: 'Manual Note',
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
    showToast(t.successToastArchive);
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return showToast('⚠️ Name and phone required.');
    
    const cleanPhoneCheck = toEnglishDigits(newPhone).replace(/\D/g, '');
    if (cleanPhoneCheck.length < 7) return showToast(t.errorPhone);

    const now = new Date();
    const enDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newCust: Customer = {
      id: Date.now().toString(),
      name: newName,
      countryCode: newCountryCode,
      phone: toEnglishDigits(newPhone),
      orderNumber: toEnglishDigits(newOrderNumber || '#---'),
      category: newCategory || categories[0]?.fallbackName || '',
      status: newStatus || statusOptions[0]?.fallbackName || '',
      responseState: newResponseState || responseStateOptions[0]?.fallbackName || '',
      amount: toEnglishDigits(newAmount || '0'),
      note: newNote,
      date: enDate,
      lastContactDate: t.neverContacted,
      timeline: [{ id: '1', date: enDate, action: 'Created', note: 'Customer registered' }]
    };
    saveContacts([newCust, ...contacts]);
    setNewName(''); setNewPhone(''); setNewOrderNumber(''); setNewAmount(''); setNewNote('');
    setNewCategory(''); setNewStatus(''); setNewResponseState('');
    showToast(t.successAdded);
  };

  const updateCustomerField = (id: string, field: string, value: string) => {
    const cleanVal = (field === 'phone' || field === 'orderNumber' || field === 'amount' || field === 'countryCode') ? toEnglishDigits(value) : value;
    const updated = contacts.map(c => c.id === id ? { ...c, [field]: cleanVal } : c);
    saveContacts(updated);
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer({ ...selectedCustomer, [field]: cleanVal });
    }
  };

  const deleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      saveContacts(contacts.filter(c => c.id !== id));
      setSelectedCustomer(null);
      showToast('🗑️ Customer deleted');
    }
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    saveCategories([...categories, { nameKey: 'custom_' + Date.now(), fallbackName: newCatName, bg: newCatBg, color: newCatColor, isSale: newCatIsSale }]);
    setNewCatName('');
    showToast('🏷 Category added');
  };

  const deleteCategory = (fallbackName: string) => {
    saveCategories(categories.filter(c => c.fallbackName !== fallbackName));
    showToast('🗑 Category deleted');
  };

  const addStatusOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName) return;
    saveStatuses([...statusOptions, { nameKey: 'custom_st_' + Date.now(), fallbackName: newStatusName, bg: newStatusBg, color: newStatusColor }]);
    setNewStatusName('');
    showToast('✨ Status added');
  };

  const deleteStatusOption = (fallbackName: string) => {
    saveStatuses(statusOptions.filter(s => s.fallbackName !== fallbackName));
    showToast('🗑 Status deleted');
  };

  const addResponseStateOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRespName) return;
    saveResponseStates([...responseStateOptions, { nameKey: 'custom_resp_' + Date.now(), fallbackName: newRespName, bg: newRespBg, color: newRespColor }]);
    setNewRespName('');
    showToast('✨ Response state added');
  };

  const deleteResponseStateOption = (fallbackName: string) => {
    saveResponseStates(responseStateOptions.filter(r => r.fallbackName !== fallbackName));
    showToast('🗑️ Response state deleted');
  };

  const routeToMessaging = (c: Customer) => {
    setSelectedCustomer(null);
    setCustomerName(c.name);
    setCustomerCountryCode(c.countryCode || '+966');
    setCustomerPhone(c.phone);
    setOrderNumber(c.orderNumber);
    setMessagingMode('single');
    setActiveTab('messaging');
    window.scrollTo(0, 0);
  };

  const handleGenerateMessage = () => {
    const tpl = templates.find(item => item.id === activeTemplateId);
    if (!tpl) return;
    const resolvedTpl = getTplDisplay(tpl);
    let msg = resolvedTpl.text
      .replace(/\[الاسم\]/g, customerName || 'Customer')
      .replace(/\[الطلب\]/g, orderNumber || '---')
      .replace(/\[إضافي\]/g, extraInfo);

    if (productName) msg = msg.replace(/\[المنتج\]/g, productName);
    if (invoiceAmount) msg = msg.replace(/\[المبلغ\]/g, invoiceAmount);

    if (includeDiscount) msg += `\n\n🎁 Discount Code: *${defaultDiscountCode}*`;
    setGeneratedMsg(msg);
  };

  const openWhatsAppDirect = (countryCode: string, phone: string, text: string, customerId?: string) => {
    const fullNum = formatPhoneInternational(countryCode || '+966', phone);
    const encodedText = encodeURIComponent(text);
    const url = fullNum ? `https://wa.me/${fullNum}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank');
    if (customerId) updateLastContact(customerId, 'Wa.me Messaging');
  };

  const handleBroadcastQueueSend = () => {
    const targetList = contacts.filter(c => c.category === broadcastCat);
    if (targetList.length === 0) {
      showToast('⚠️ No customers found in target segment.');
      return;
    }
    const tpl = templates.find(item => item.id === activeTemplateId);
    if (!tpl) return;
    const resolvedTpl = getTplDisplay(tpl);

    targetList.forEach((c, index) => {
      let msg = resolvedTpl.text
        .replace(/\[الاسم\]/g, c.name)
        .replace(/\[الطلب\]/g, c.orderNumber)
        .replace(/\[إضافي\]/g, extraInfo);
      
      if (productName) msg = msg.replace(/\[المنتج\]/g, productName);
      if (invoiceAmount) msg = msg.replace(/\[المبلغ\]/g, invoiceAmount);

      if (includeDiscount) msg += `\n\n🎁 Discount Code: *${defaultDiscountCode}*`;
      
      setTimeout(() => {
        openWhatsAppDirect(c.countryCode || '+966', c.phone, msg, c.id);
      }, index * 800);
    });
    showToast(`🚀 Broadcast queue started for ${targetList.length} customers.`);
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
              <h3 className="modal-title">✏ {t.nameLabel}</h3>
              <button className="close-modal-btn" onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>
            
            <div className="modal-body-grid">
              <div className="modal-item" style={{ gridColumn: '1 / -1' }}>
                <span className="modal-item-label">{t.nameLabel}</span>
                <input type="text" className="modal-edit-input" value={selectedCustomer.name} onChange={e => updateCustomerField(selectedCustomer.id, 'name', e.target.value)} />
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.countryCodeLabel} & {t.phoneLabel}</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" className="modal-edit-input input-ltr" style={{ width: '80px' }} value={selectedCustomer.countryCode || '+966'} onChange={e => updateCustomerField(selectedCustomer.id, 'countryCode', e.target.value)} />
                  <input type="text" className="modal-edit-input input-ltr" value={selectedCustomer.phone} onChange={e => updateCustomerField(selectedCustomer.id, 'phone', e.target.value)} />
                </div>
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.orderNumLabel}</span>
                <input type="text" className="modal-edit-input input-ltr" value={selectedCustomer.orderNumber} onChange={e => updateCustomerField(selectedCustomer.id, 'orderNumber', e.target.value)} />
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.categoryLabel}</span>
                <select className="modal-edit-input" value={selectedCustomer.category} onChange={e => updateCustomerField(selectedCustomer.id, 'category', e.target.value)}>
                  <option value="">{t.selectCatPlaceholder}</option>
                  {categories.map(cat => {
                    const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                    return <option key={cat.nameKey || cat.fallbackName} value={catName}>{catName}</option>;
                  })}
                </select>
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.statusLabel}</span>
                <select className="modal-edit-input" value={selectedCustomer.status} onChange={e => updateCustomerField(selectedCustomer.id, 'status', e.target.value)}>
                  <option value="">{t.selectStatusPlaceholder}</option>
                  {statusOptions.map(st => {
                    const stName = getStatusDisplay(st.nameKey, st.fallbackName);
                    return <option key={st.nameKey || st.fallbackName} value={stName}>{stName}</option>;
                  })}
                </select>
              </div>
              <div className="modal-item">
                <span className="modal-item-label">{t.responseStateLabel}</span>
                <select className="modal-edit-input" value={selectedCustomer.responseState || ''} onChange={e => updateCustomerField(selectedCustomer.id, 'responseState', e.target.value)}>
                  <option value="">{t.selectRespPlaceholder}</option>
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
                <input type="text" className="modal-edit-input" value={selectedCustomer.note || ''} onChange={e => updateCustomerField(selectedCustomer.id, 'note', e.target.value)} />
              </div>
            </div>

            <div className="timeline-box">
              <div className="timeline-title">📜 {t.addToArchiveBtn}</div>
              <div className="timeline-list">
                {selectedCustomer.timeline && selectedCustomer.timeline.length > 0 ? (
                  selectedCustomer.timeline.map((log) => (
                    <div key={log.id} className="timeline-item">
                      <div><strong>{log.action}:</strong> {log.note}</div>
                      <span style={{ fontSize: '10.5px', color: '#64748b', direction: 'ltr' }}>{log.date}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '10px' }}>No records found.</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" className="modal-edit-input" placeholder={t.newArchivePlaceholder} value={newTimelineNote} onChange={e => setNewTimelineNote(e.target.value)} />
                <button className="btn-main" style={{ padding: '8px 16px', whiteSpace: 'nowrap' }} onClick={() => addTimelineLogToCustomer(selectedCustomer.id)}>{t.addToArchiveBtn}</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-wa" style={{ flex: 2 }} onClick={() => openWhatsAppDirect(selectedCustomer.countryCode || '+966', selectedCustomer.phone, 'Hello', selectedCustomer.id)}>{t.sendWaBtn}</button>
              <button className="btn-sm btn-danger" style={{ padding: '0 20px', fontSize: '13px', fontWeight: 800 }} onClick={() => deleteContact(selectedCustomer.id)}>{t.deleteBtn}</button>
              <button className="btn-main" style={{ flex: 1, background: '#f1f5f9', color: '#1e293b' }} onClick={() => setSelectedCustomer(null)}>Close</button>
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
          <button className={`tab-btn ${activeTab === 'smartReminders' ? 'active' : ''}`} onClick={() => setActiveTab('smartReminders')}>{t.tabSmartReminders}</button>
          <button className={`tab-btn ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>{t.tabTags}</button>
        </div>

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
                    <th>{t.lastContactHeader}</th>
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
                        <td style={{ color: '#4f46e5', fontSize: '11px', fontWeight: 700, direction: 'ltr', textAlign: 'left' }}>{c.lastContactDate || t.neverContacted}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬</button>
                            <button className="btn-sm btn-edit" onClick={() => updateLastContact(c.id)}>🕒</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {contacts.length === 0 && <tr><td colSpan={7} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No customers.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {activeTab === 'crm' && (
          <div>
            <div className="section-box">
              <div className="section-title">{t.newCustomerTitle}</div>
              <form onSubmit={addContact}>
                <div className="form-grid" style={{ marginBottom: '20px' }}>
                  <div className="form-group"><label>{t.nameLabel}</label><input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} required /></div>
                  <div className="form-group">
                    <label>{t.countryCodeLabel} & {t.phoneLabel}</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" className="form-control input-ltr" style={{ width: '90px' }} value={newCountryCode} onChange={e => setNewCountryCode(toEnglishDigits(e.target.value))} placeholder="+966" />
                      <input type="text" className="form-control input-ltr" value={newPhone} onChange={e => setNewPhone(toEnglishDigits(e.target.value))} required placeholder="5xxxxxxxx" />
                    </div>
                  </div>
                  <div className="form-group"><label>{t.orderNumLabel}</label><input type="text" className="form-control input-ltr" value={newOrderNumber} onChange={e => setNewOrderNumber(toEnglishDigits(e.target.value))} /></div>
                  <div className="form-group">
                    <label>{t.categoryLabel}</label>
                    <select className="form-control" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                      <option value="">{t.selectCatPlaceholder}</option>
                      {categories.map(cat => {
                        const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                        return <option key={cat.nameKey || cat.fallbackName} value={catName}>{catName}</option>;
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.statusLabel}</label>
                    <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                      <option value="">{t.selectStatusPlaceholder}</option>
                      {statusOptions.map(st => {
                        const stName = getStatusDisplay(st.nameKey, st.fallbackName);
                        return <option key={st.nameKey || st.fallbackName} value={stName}>{stName}</option>;
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.responseStateLabel}</label>
                    <select className="form-control" value={newResponseState} onChange={e => setNewResponseState(e.target.value)}>
                      <option value="">{t.selectRespPlaceholder}</option>
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
                    <th>{t.countryCodeLabel} & {t.phoneLabel}</th>
                    <th>{t.orderNumLabel}</th>
                    <th>{t.categoryLabel}</th>
                    <th>{t.statusLabel}</th>
                    <th>{t.responseStateLabel}</th>
                    <th>{t.amountLabel}</th>
                    <th>{t.noteLabel}</th>
                    <th>{t.lastContactHeader}</th>
                    <th>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map(c => (
                    <tr key={c.id}>
                      <td><span style={{ fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>{c.name}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <input type="text" className="cell-input input-ltr" style={{ width: '55px' }} value={c.countryCode || '+966'} onChange={e => updateCustomerField(c.id, 'countryCode', e.target.value)} />
                          <input type="text" className="cell-input input-ltr" value={c.phone} onChange={e => updateCustomerField(c.id, 'phone', e.target.value)} />
                        </div>
                      </td>
                      <td><input type="text" className="cell-input input-ltr" value={c.orderNumber} onChange={e => updateCustomerField(c.id, 'orderNumber', e.target.value)} /></td>
                      <td>
                        <select className="cell-input" value={c.category} onChange={e => updateCustomerField(c.id, 'category', e.target.value)}>
                          <option value="">{t.selectCatPlaceholder}</option>
                          {categories.map(cat => {
                            const catName = getCatDisplay(cat.nameKey, cat.fallbackName);
                            return <option key={cat.nameKey || cat.fallbackName} value={catName}>{catName}</option>;
                          })}
                        </select>
                      </td>
                      <td>
                        <select className="cell-input" value={c.status} onChange={e => updateCustomerField(c.id, 'status', e.target.value)}>
                          <option value="">{t.selectStatusPlaceholder}</option>
                          {statusOptions.map(st => {
                            const stName = getStatusDisplay(st.nameKey, st.fallbackName);
                            return <option key={st.nameKey || st.fallbackName} value={stName}>{stName}</option>;
                          })}
                        </select>
                      </td>
                      <td>
                        <select className="cell-input" value={c.responseState || ''} onChange={e => updateCustomerField(c.id, 'responseState', e.target.value)}>
                          <option value="">{t.selectRespPlaceholder}</option>
                          {responseStateOptions.map(resp => {
                            const respName = getRespDisplay(resp.nameKey, resp.fallbackName);
                            return <option key={resp.nameKey || resp.fallbackName} value={respName}>{respName}</option>;
                          })}
                        </select>
                      </td>
                      <td><input type="text" className="cell-input input-ltr" value={c.amount} onChange={e => updateCustomerField(c.id, 'amount', e.target.value)} /></td>
                      <td><input type="text" className="cell-input" value={c.note || ''} onChange={e => updateCustomerField(c.id, 'note', e.target.value)} /></td>
                      <td style={{ direction: 'ltr', textAlign: 'left', color: '#4f46e5', fontSize: '10px' }}>{c.lastContactDate || t.neverContacted}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬</button>
                          <button className="btn-sm btn-edit" onClick={() => updateLastContact(c.id)}>🕒</button>
                          <button className="btn-sm btn-danger" onClick={() => deleteContact(c.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredContacts.length === 0 && <tr><td colSpan={10} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>No customers.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                            <div key={cust.id} className="suggestion-item" onClick={() => { setCustomerName(cust.name); setCustomerCountryCode(cust.countryCode || '+966'); setCustomerPhone(cust.phone); setOrderNumber(cust.orderNumber); setShowSuggestions(false); }}>
                              <span>{cust.name}</span>
                              <span style={{ color: '#4f46e5', direction: 'ltr' }}>{cust.countryCode || '+966'} {cust.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>{t.countryCodeLabel} & {t.phoneLabel}</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="text" className="form-control input-ltr" style={{ width: '90px' }} value={customerCountryCode} onChange={e => setCustomerCountryCode(toEnglishDigits(e.target.value))} placeholder="+966" />
                        <input type="text" className="form-control input-ltr" value={customerPhone} onChange={e => setCustomerPhone(toEnglishDigits(e.target.value))} placeholder="5xxxxxxxx" />
                      </div>
                    </div>
                    <div className="form-group"><label>{t.orderNumLabel}</label><input type="text" className="form-control input-ltr" value={orderNumber} onChange={e => setOrderNumber(toEnglishDigits(e.target.value))} /></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="section-title">Broadcast Target Segment</div>
                  <div className="form-group" style={{ maxWidth: '400px' }}>
                    <label>Select Target Category:</label>
                    <select className="form-control" value={broadcastCat} onChange={e => setBroadcastCat(e.target.value)}>
                      <option value="">{t.selectCatPlaceholder}</option>
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
                    <div key={tpl.id} onClick={() => setActiveTemplateId(tpl.id)} style={{ padding: '16px 12px', border: '2px solid #e2e8f0', borderRadius: '14px', cursor: 'pointer', textAlign: 'center', fontWeight: 800, fontSize: '13px', color: activeTemplateId === tpl.id ? '#4f46e5' : '#64748b', background: activeTemplateId === tpl.id ? '#eef2ff' : '#fff', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '24px' }}>{resolved.icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#1e293b' }}>{resolved.title}</span>
                    </div>
                  );
                })}
              </div>

              <div className="form-grid" style={{ marginBottom: '15px' }}>
                <div className="form-group">
                  <label>{t.varProductName}:</label>
                  <input type="text" className="form-control" value={productName} onChange={e => setProductName(e.target.value)} placeholder="Product name..." />
                </div>
                <div className="form-group">
                  <label>{t.varInvoiceAmount}:</label>
                  <input type="text" className="form-control input-ltr" value={invoiceAmount} onChange={e => setInvoiceAmount(toEnglishDigits(e.target.value))} placeholder="299 SAR" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>Extra Text / Payment Link:</label>
                  <input type="text" className="form-control input-ltr" value={extraInfo} onChange={e => setExtraInfo(e.target.value)} placeholder="https://..." />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                  <input type="checkbox" id="discCheck" checked={includeDiscount} onChange={e => setIncludeDiscount(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="discCheck" style={{ fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>{t.defaultDiscountLabel} ({defaultDiscountCode})</label>
                </div>
              </div>

              <button className="btn-main" style={{ width: '100%' }} onClick={handleGenerateMessage}>{t.generateMsgBtn}</button>

              {generatedMsg && (
                <div style={{ background: '#fff', border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '16px', marginTop: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '15px', color: '#1e293b' }}>{generatedMsg}</div>
                  {messagingMode === 'single' ? (
                    <button className="btn-wa" style={{ width: '100%' }} onClick={() => openWhatsAppDirect(customerCountryCode, customerPhone, generatedMsg)}>{t.sendWaBtn}</button>
                  ) : (
                    <button className="btn-wa" style={{ width: '100%', background: '#4f46e5' }} onClick={handleBroadcastQueueSend}>🚀 Start Broadcast Queue</button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'smartReminders' && (
          <div>
            <div className="section-box">
              <div className="section-title">{t.smartRemindersTitle}</div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>{t.smartRemindersDesc}</p>
              
              <div className="table-container">
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>{t.nameLabel}</th>
                      <th>{t.categoryLabel}</th>
                      <th>{t.orderNumLabel}</th>
                      <th>{t.lastContactHeader}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.filter(c => c.category === 'سلة متروكة' || c.category === 'Abandoned Cart' || c.category === 'Panier Abandonné' || !c.responseState || c.responseState.includes('بانتظار') || c.responseState.includes('Pending')).map(c => (
                      <tr key={c.id}>
                        <td><span style={{ fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>{c.name}</span></td>
                        <td><span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>{c.category}</span></td>
                        <td style={{ direction: 'ltr', textAlign: 'left' }}>{c.orderNumber}</td>
                        <td style={{ direction: 'ltr', textAlign: 'left', color: '#d97706', fontWeight: 700 }}>{c.lastContactDate || t.neverContacted}</td>
                        <td>
                          <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬 Reminder</button>
                        </td>
                      </tr>
                    ))}
                    {contacts.filter(c => c.category === 'سلة متروكة' || c.category === 'Abandoned Cart' || c.category === 'Panier Abandonné' || !c.responseState || c.responseState.includes('بانتظار') || c.responseState.includes('Pending')).length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>{t.noReminders}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tags' && (
          <div>
            <div className="section-box">
              <div className="section-title">{t.customizeCatTitle}</div>
              <form onSubmit={addCategory} className="settings-creation-box">
                <div className="form-group" style={{ flex: 2, margin: 0 }}>
                  <label>{t.newCatLabel}</label>
                  <input type="text" className="form-control" placeholder="..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.bgColorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newCatBg} onChange={e => setNewCatBg(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.textColorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} />
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

            <div className="section-box">
              <div className="section-title">{t.customizeStatusTitle}</div>
              <form onSubmit={addStatusOption} className="settings-creation-box">
                <div className="form-group" style={{ flex: 2, margin: 0 }}>
                  <label>{t.newStatusLabel}</label>
                  <input type="text" className="form-control" placeholder="..." value={newStatusName} onChange={e => setNewStatusName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.bgColorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newStatusBg} onChange={e => setNewStatusBg(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.textColorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newStatusColor} onChange={e => setNewStatusColor(e.target.value)} />
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

            <div className="section-box">
              <div className="section-title">{t.customizeRespTitle}</div>
              <form onSubmit={addResponseStateOption} className="settings-creation-box">
                <div className="form-group" style={{ flex: 2, margin: 0 }}>
                  <label>{t.newRespLabel}</label>
                  <input type="text" className="form-control" placeholder="..." value={newRespName} onChange={e => setNewRespName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.bgColorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newRespBg} onChange={e => setNewRespBg(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.textColorLabel}</label>
                  <input type="color" className="form-control color-picker-sm" value={newRespColor} onChange={e => setNewRespColor(e.target.value)} />
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
              
              <div className="form-grid" style={{ marginBottom: '15px' }}>
                <div className="form-group">
                  <label>{t.cloudMasterKeyLabel}</label>
                  <input type="text" className="form-control input-ltr" value={cloudMasterKey} onChange={e => setCloudMasterKey(e.target.value)} placeholder="$2a$10$..." />
                </div>
                <div className="form-group">
                  <label>{t.cloudBinIdLabel}</label>
                  <input type="text" className="form-control input-ltr" value={cloudBinId} onChange={e => setCloudBinId(e.target.value)} placeholder="Bin ID (e.g. 65f...)" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <button className="btn-main" style={{ background: '#10b981' }} onClick={saveToCloud}>{t.cloudSave}</button>
                <button className="btn-main" style={{ background: '#0284c7' }} onClick={loadFromCloud}>{t.cloudLoad}</button>
                <button className="btn-main" style={{ background: '#4f46e5' }} onClick={exportBackupJSON}>{t.downloadBackup}</button>
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
