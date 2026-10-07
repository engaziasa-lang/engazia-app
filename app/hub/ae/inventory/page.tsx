'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SeasonItem {
  id: string;
  productName: string;
  seasonName: string;
  normalMonthlySales: number;
  growthRatePercent: number; 
  requiredStock: number;     
  createdAt?: string;
}

export default function SeasonalInventoryPlannerAE() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [productName, setProductName] = useState<string>('');
  const [seasonSelect, setSeasonSelect] = useState<string>('');
  const [customSeason, setCustomSeason] = useState<string>('');
  const [normalMonthlySales, setNormalMonthlySales] = useState<number | ''>('');
  const [growthRatePercent, setGrowthRatePercent] = useState<number | ''>(150);

  const [items, setItems] = useState<SeasonItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // قراءة اللغة من الصفحة الرئيسية
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    // ضبط الموسم الافتراضي بناءً على اللغة
    if (savedLang === 'en') {
      setSeasonSelect('Dubai Summer Surprises (DSS) 🛍️');
      setCustomSeason('Dubai Summer Surprises (DSS) 🛍️');
    } else {
      setSeasonSelect('مفاجآت صيف دبي (DSS) 🛍️');
      setCustomSeason('مفاجآت صيف دبي (DSS) 🛍️');
    }

    const saved = localStorage.getItem('seerk_ae_seasonal_inventory_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: SeasonItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ae_seasonal_inventory_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const sales = typeof normalMonthlySales === 'number' ? normalMonthlySales : 0;
  const growth = typeof growthRatePercent === 'number' ? growthRatePercent : 0;

  // الحساب
  const requiredStock = Math.round(sales + (sales * (growth / 100)));

  // قاموس الترجمة الفوري
  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مخطط المخزون للمواسم الإماراتية 📅',
      desc: 'توقع الكميات المطلوبة لمواسم الإمارات (مفاجآت صيف دبي، العيد، اليوم الوطني) لتجنب نفاد المخزون',
      editRecord: 'تعديل السجل',
      newRecord: 'تخطيط مخزون لموسم جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodName: 'اسم المنتج أو الفئة',
      prodNamePH: 'مثال: عبايات نسائية فاخرة',
      seasonLabel: 'اختر الموسم المستهدف',
      optDss: 'مفاجآت صيف دبي (DSS) 🛍️',
      optNatDay: 'اليوم الوطني الإماراتي 🇦🇪',
      optDsf: 'مهرجان دبي للتسوق (DSF) ⭐',
      optFriday: 'الجمعة البيضاء / السوداء 🏷️',
      optRamadan: 'موسم رمضان والعيد 🌙',
      optOther: '➕ موسم آخر (كتابة يدوية)',
      otherPH: 'اكتب اسم الموسم هنا...',
      salesLabel: 'مبيعات المنتج العادية (شهرياً)',
      salesPH: '100',
      growthLabel: 'نسبة نمو المبيعات بالموسم (%)',
      growthPH: '150',
      saveBtnNew: '+ حفظ الخطة في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      analysisTitle: 'توقع المخزون الموسمي الفوري',
      reqStock: 'الكمية المطلوبة لتغطية الموسم',
      reqStockSub: 'المخزون الكافي لتجنب نفاد البضاعة',
      normalRate: 'معدل المبيعات الشهري العادي',
      demandInc: 'نسبة الطلب المتوقعة في الموسم',
      unit: 'وحدة',
      unitMonth: 'وحدة/شهر',
      searchPH: '🔍 بحث بالمنتج أو الموسم...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد خطط مخزون موسمية مسجلة حالياً.',
        th1: '#',
        th2: 'المنتج والتاريخ',
        th3: 'الموسم المستهدف',
        th4: 'المبيعات العادية',
        th5: 'نسبة النمو',
        th6: 'الكمية المطلوبة للموسم',
        th7: 'الإجراءات',
        totalLabel: 'الإجمالي الكلي'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سجلات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المنتج، الموسم، ومعدل مبيعات صحيح.',
        updateSuccess: '✨ تم تحديث خطة المخزون بنجاح!',
        saveSuccess: '✅ تمت إضافة خطة المخزون للموسم بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد بيانات المخزون الموسمي بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'UAE Seasonal Inventory Planner 📅',
      desc: 'Forecast required stock for UAE seasons (DSS, Eid, National Day) to prevent stockouts',
      editRecord: 'Edit Record',
      newRecord: 'Plan New Season Inventory',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodName: 'Product or Category Name',
      prodNamePH: 'e.g. Luxury Women Abayas',
      seasonLabel: 'Select Target Season',
      optDss: 'Dubai Summer Surprises (DSS) 🛍️',
      optNatDay: 'UAE National Day 🇦🇪',
      optDsf: 'Dubai Shopping Festival (DSF) ⭐',
      optFriday: 'White / Black Friday 🏷️',
      optRamadan: 'Ramadan & Eid Season 🌙',
      optOther: '➕ Other Season (Manual Entry)',
      otherPH: 'Type season name here...',
      salesLabel: 'Normal Monthly Sales',
      salesPH: '100',
      growthLabel: 'Expected Seasonal Growth Rate (%)',
      growthPH: '150',
      saveBtnNew: '+ Save Plan to Log',
      saveBtnEdit: '💾 Save Changes',
      analysisTitle: 'Instant Seasonal Stock Forecast',
      reqStock: 'Required Quantity for the Season',
      reqStockSub: 'Sufficient stock to avoid selling out',
      normalRate: 'Normal Monthly Sales Rate',
      demandInc: 'Expected Demand Increase',
      unit: 'unit(s)',
      unitMonth: 'unit(s)/month',
      searchPH: '🔍 Search by product or season...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No seasonal inventory plans currently saved.',
        th1: '#',
        th2: 'Product & Date',
        th3: 'Target Season',
        th4: 'Normal Sales',
        th5: 'Growth Rate',
        th6: 'Required Quantity',
        th7: 'Actions',
        totalLabel: 'Grand Total'
      },
      alerts: {
        limit: '🔒 Sorry, you have reached the trial limit (3 records). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure product name, season, and valid monthly sales are filled.',
        updateSuccess: '✨ Inventory plan updated successfully!',
        saveSuccess: '✅ Seasonal inventory plan added successfully!',
        delConfirm: 'Are you sure you want to delete this record?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Seasonal inventory data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSeasonSelect(val);
    if (val !== 'موسم آخر (كتابة يدوية)' && val !== '➕ Other Season (Manual Entry)') {
      setCustomSeason(val);
    } else {
      setCustomSeason('');
    }
  };

  const handleClearForm = () => {
    setProductName('');
    if (lang === 'en') {
      setSeasonSelect('Dubai Summer Surprises (DSS) 🛍️');
      setCustomSeason('Dubai Summer Surprises (DSS) 🛍️');
    } else {
      setSeasonSelect('مفاجآت صيف دبي (DSS) 🛍️');
      setCustomSeason('مفاجآت صيف دبي (DSS) 🛍️');
    }
    setNormalMonthlySales('');
    setGrowthRatePercent(150);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalSeason = seasonSelect === 'موسم آخر (كتابة يدوية)' || seasonSelect === '➕ Other Season (Manual Entry)' ? customSeason : seasonSelect;
    if (!productName.trim() || !finalSeason.trim() || sales <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-AE' : 'en-AE';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        seasonName: finalSeason,
        normalMonthlySales: sales,
        growthRatePercent: growth,
        requiredStock,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: SeasonItem = {
        id: Date.now().toString(),
        productName,
        seasonName: finalSeason,
        normalMonthlySales: sales,
        growthRatePercent: growth,
        requiredStock,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: SeasonItem) =>
