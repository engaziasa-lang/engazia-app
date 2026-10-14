'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ==========================================
// 1. الواجهات (Interfaces)
// ==========================================
interface ToolInfo {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  link: string;
}

interface ProfitItem {
  id: string;
  name: string;
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  gatewayFeePercent: number;
  netProfit: number;
  margin: number;
  createdAt?: string;
  createdAtTimestamp?: number;
}

// ==========================================
// 2. مصفوفة الأدوات الـ 24
// ==========================================
const saTools: ToolInfo[] = [
  { id: 'profit', titleAr: 'حاسبة أرباح ونقاط التعادل (15% ضريبة)', titleEn: 'Profit & Break-Even Calculator', descAr: 'احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة.', descEn: 'Calculate your net profit accurately after deducting costs, shipping fees, and VAT.', icon: '📊', link: '/hub/sa/profit' },
  { id: 'whatsapp', titleAr: 'إدارة عملاء واتساب (إنجازيا Pro Max)', titleEn: 'WhatsApp CRM', descAr: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر.', descEn: 'Manage abandoned carts and send quick payment links via WhatsApp.', icon: '💬', link: '/hub/sa/whatsapp' },
  { id: 'fees', titleAr: 'حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)', titleEn: 'Payment Gateway Fee Calculator', descAr: 'احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك.', descEn: 'Calculate local payment gateway rates and their actual impact on your store margins.', icon: '💳', link: '/hub/sa/fees' },
  { id: 'invoices', titleAr: 'مولد الفواتير الإلكترونية (زاتكا)', titleEn: 'E-Invoicing Generator (ZATCA)', descAr: 'أنشئ فواتير مبيعات نظامية مبسطة متوافقة مع متطلبات هيئة الزكاة والضريبة.', descEn: 'Generate simplified sales invoices compliant with ZATCA requirements.', icon: '🧾', link: '/hub/sa/invoices' },
  { id: 'roas', titleAr: 'محلل عائد الإعلانات (سناب وتيك توك)', titleEn: 'Ad Return Analyzer', descAr: 'قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق السعودي.', descEn: 'Measure your ad performance precisely and check if they yield rewarding returns.', icon: '📈', link: '/hub/sa/roas' },
  { id: 'returns', titleAr: 'محلل خسائر المرتجعات والشحن العكسي', titleEn: 'Returns Loss Analyzer', descAr: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي.', descEn: 'Measure the impact of returns and exchanges on your monthly net profit.', icon: '🔄', link: '/hub/sa/returns' },
  { id: 'vat_report', titleAr: 'مجهز بيانات الإقرار الضريبي', titleEn: 'VAT Return Data Preparer', descAr: 'اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل رفع الإقرار الضريبي لزاتكا.', descEn: 'Gather and organize sales and purchases data to simplify filing VAT returns.', icon: '📑', link: '/hub/sa/vat-report' },
  { id: 'platforms', titleAr: 'حاسبة رسوم المنصات (سلة، زد)', titleEn: 'Platform Fee Calculator', descAr: 'احسب التكاليف الخفية واشتراكات المنصات المحلية لضمان تسعير منتجاتك صحيحاً.', descEn: 'Calculate hidden costs and local platform subscriptions.', icon: '🛒', link: '/hub/sa/platforms' },
  { id: 'influencer', titleAr: 'حاسبة جدوى إعلانات المشاهير', titleEn: 'Influencer Marketing ROI', descAr: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل الدفع.', descEn: 'Analyze expected ROI from influencer ads before paying out budgets.', icon: '🤳', link: '/hub/sa/influencer' },
  { id: 'cod_risk', titleAr: 'محلل تكاليف الدفع عند الاستلام', titleEn: 'COD Risk Analyzer', descAr: 'احسب نسبة المخاطرة والرسوم الإضافية لطلبات الدفع عند الاستلام.', descEn: 'Calculate risk ratios and extra fees for COD orders.', icon: '🚚', link: '/hub/sa/cod-risk' },
  { id: 'shipping', titleAr: 'مدير تتبع الشحنات المحلية', titleEn: 'Shipment Tracking Manager', descAr: 'تابع حالات الشحنات (سمسا، أرامكس) وحل استفسارات التأخير.', descEn: 'Track shipment statuses and resolve delivery delays.', icon: '📦', link: '/hub/sa/shipping' },
  { id: 'inventory', titleAr: 'مخطط المخزون للمواسم السعودية', titleEn: 'Seasonal Inventory Planner', descAr: 'توقع الكميات المطلوبة لمواسم (رمضان، العيد، اليوم الوطني).', descEn: 'Forecast required stock for Saudi seasons to prevent stockouts.', icon: '📅', link: '/hub/sa/inventory' },
  { id: 'expenses', titleAr: 'مدير النفقات والمصاريف التشغيلية', titleEn: 'Operational Expenses Manager', descAr: 'تتبع مصاريف المتجر الثابتة والمتغيرة لضبط التدفق النقدي.', descEn: 'Track fixed and variable store expenses in SAR to control cash flow.', icon: '💸', link: '/hub/sa/expenses' },
  { id: 'legal', titleAr: 'مولد السياسات (وزارة التجارة)', titleEn: 'Store Policies Generator', descAr: 'أنشئ صفحات الاستبدال والاسترجاع المتوافقة مع القوانين المحلية.', descEn: 'Generate return policies and privacy terms compliant with regulations.', icon: '⚖', link: '/hub/sa/legal' },
  { id: 'jasmal', titleAr: 'جاسمال (Jasmal) لاستخراج البيانات', titleEn: 'Jasmal Data Extraction Tool', descAr: 'اسحب بيانات المنتجات والأسعار من المتاجر المنافسة لملفات إكسل.', descEn: 'Extract product data and prices from competitor stores instantly.', icon: '🕷️', link: '/hub/sa/jasmal' },
  { id: 'reviews', titleAr: 'نظام طلب التقييمات الآلي', titleEn: 'Automated Review Request', descAr: 'أرسل رسائل تلقائية للعملاء لجمع التقييمات وبناء الموثوقية.', descEn: 'Send automated WhatsApp messages to collect reviews and build trust.', icon: '⭐', link: '/hub/sa/reviews' },
  { id: 'dropshipping', titleAr: 'حاسبة أرباح الدروبشيبينغ', titleEn: 'Dropshipping Profit Calculator', descAr: 'احسب هوامش الربح للمنتجات المستوردة مع رسوم الجمارك والشحن.', descEn: 'Calculate profit margins for imported products with custom duties.', icon: '🌍', link: '/hub/sa/dropshipping' },
  { id: 'copy', titleAr: 'مولد نصوص الإكسبلور (باللهجة السعودية)', titleEn: 'Copywriting Generator', descAr: 'اصنع سكربتات تيك توك وإعلانات جذابة باللهجة المحلية.', descEn: 'Create catchy TikTok scripts and ads in the local Saudi dialect.', icon: '✍', link: '/hub/sa/copy' },
  { id: 'support', titleAr: 'قوالب خدمة العملاء السريعة', titleEn: 'Customer Service Templates', descAr: 'انسخ ردود احترافية للرد على استفسارات العملاء المكررة.', descEn: 'Copy ready professional responses for repetitive customer inquiries.', icon: '🎧', link: '/hub/sa/support' },
  { id: 'promos', titleAr: 'حاسبة جدوى أكواد الخصم والعروض', titleEn: 'Discount ROI Calculator', descAr: 'تأكد من أن عروضك الترويجية لا تسبب لك خسائر مخفية.', descEn: 'Ensure your promotional offers do not cause hidden losses.', icon: '🎟️', link: '/hub/sa/promos' },
  { id: 'ltv', titleAr: 'حاسبة القيمة الدائمة للعميل (LTV)', titleEn: 'LTV Calculator', descAr: 'اعرف تكلفة الاستحواذ على العميل وقيمته الفعلية لمتجرك.', descEn: 'Know your customer acquisition cost and long-term value.', icon: '🎯', link: '/hub/sa/ltv' },
  { id: 'ab_test', titleAr: 'حاسبة اختبارات الإعلانات (A/B)', titleEn: 'A/B Ad Testing Calculator', descAr: 'قارن بين حملتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة.', descEn: 'Compare two ad campaigns to see which achieves better returns.', icon: '⚖️', link: '/hub/sa/ab-test' },
  { id: 'links', titleAr: 'صانع روابط واتساب السريعة', titleEn: 'Quick WhatsApp Link', descAr: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو حملات الانستقرام.', descEn: 'Create custom links with pre-filled messages for campaigns.', icon: '🔗', link: '/hub/sa/links' },
  { id: 'tips', titleAr: 'أسرار نمو المتاجر السعودية', titleEn: 'Store Growth Secrets', descAr: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء.', descEn: 'Exclusive strategy library to increase conversions and loyalty.', icon: '💡', link: '/hub/sa/tips' }
];

// ==========================================
// 3. مكون أداة الأرباح المجانية المكشوفة (Hero Tool)
// ==========================================
function FreeProfitCalculatorSA({ lang, isActivated }: { lang: 'ar' | 'en', isActivated: boolean }) {
  const [productName, setProductName] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [productCost, setProductCost] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [gatewayFeePercent, setGatewayFeePercent] = useState<number | ''>(2.2);

  const [items, setItems] = useState<ProfitItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'day' | 'week' | 'month' | '6months' | 'year'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('seerk_profit_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const saveToLocalStorage = (newItems: ProfitItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_profit_items', JSON.stringify(newItems));
  };

  const t = {
    ar: {
      title: 'حاسبة أرباح ونقاط التعادل (15% ضريبة) 📊',
      desc: 'احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة في السوق السعودي',
      editRecord: 'تعديل بيانات المنتج',
      newRecord: 'حساب منتج جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodNameLabel: 'اسم المنتج أو الخدمة',
      prodNamePH: 'مثال: عطر فاخر',
      sellPriceLabel: 'سعر بيع المنتج للعميل',
      costLabel: 'تكلفة المنتج الأساسية من المورد',
      shipLabel: 'تكلفة التوصيل والشحن للطلب',
      gatewayLabel: 'رسوم بوابة الدفع (%)',
      currency: 'ر.س',
      saveBtnNew: '+ حفظ وإضافة المنتج للجدول',
      saveBtnEdit: '💾 حفظ التعديلات',
      resultsTitle: 'التحليل المالي الفوري',
      netProfitLabel: 'صافي الربح الفعلي للقطعة الواحدة',
      netProfitSub: 'بعد خصم التكلفة، الشحن، البوابة والضريبة',
      marginLabel: 'هامش الربح الصافي (%)',
      vatLabel: 'ضريبة القيمة المضافة المستقطعة (15%)',
      totalCostLabel: 'إجمالي التكاليف الشاملة للطلب',
      searchPH: '🔍 بحث في المنتجات المحفوظة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      filter: { all: 'الكل', day: 'يوم', week: 'أسبوع', month: 'شهر', sixMonths: '6 أشهر', year: 'سنة' },
      table: {
        noRecords: 'لا توجد منتجات مسجلة تطابق بحثك حالياً.',
        th1: '#', th2: 'اسم المنتج والتاريخ', th3: 'سعر البيع', th4: 'التكلفة والشحن', th5: 'صافي الربح', th6: 'هامش الربح', th7: 'الإجراءات',
        editBtn: 'تعديل', delBtn: 'حذف', totalLabel: 'الإجمالي الكلي / المتوسط'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 منتجات). يرجى تفعيل رخصتك من الأسفل لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء إدخال اسم المنتج وسعر بيع صحيح.',
        updateSuccess: '✨ تم تحديث بيانات المنتج بنجاح!',
        saveSuccess: '✅ تمت إضافة المنتج إلى جدول التحليل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا المنتج من الجدول؟',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد البيانات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      title: 'Profit & Break-Even Calculator (15% VAT) 📊',
      desc: 'Accurately calculate net profits after deducting costs, shipping, and VAT in the Saudi market',
      editRecord: 'Edit Product Data',
      newRecord: 'Calculate New Product',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodNameLabel: 'Product or Service Name',
      prodNamePH: 'e.g. Luxury Perfume',
      sellPriceLabel: 'Customer Selling Price',
      costLabel: 'Original Product Cost from Supplier',
      shipLabel: 'Delivery & Shipping Cost per Order',
      gatewayLabel: 'Payment Gateway Fee (%)',
      currency: 'SAR',
      saveBtnNew: '+ Save & Add Product to Table',
      saveBtnEdit: '💾 Save Changes',
      resultsTitle: 'Instant Financial Analysis',
      netProfitLabel: 'Actual Net Profit per Single Unit',
      netProfitSub: 'After deducting cost, shipping, gateway and VAT',
      marginLabel: 'Net Profit Margin (%)',
      vatLabel: 'Deducted VAT (15%)',
      totalCostLabel: 'Total Comprehensive Order Costs',
      searchPH: '🔍 Search saved products...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      filter: { all: 'All', day: '1 Day', week: '1 Week', month: '1 Month', sixMonths: '6 Months', year: '1 Year' },
      table: {
        noRecords: 'No products found matching your search.',
        th1: '#', th2: 'Product & Date', th3: 'Selling Price', th4: 'Cost & Shipping', th5: 'Net Profit', th6: 'Profit Margin', th7: 'Actions',
        editBtn: 'Edit', delBtn: 'Delete', totalLabel: 'Grand Total / Average'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 products). Please activate your license below to unlock unlimited access!',
        fillErr: 'Please enter a valid product name and selling price.',
        updateSuccess: '✨ Product data updated successfully!',
        saveSuccess: '✅ Product added to analysis table successfully!',
        delConfirm: 'Are you sure you want to delete this product from the table?',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Data imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const sPrice = typeof sellingPrice === 'number' ? sellingPrice : 0;
  const pCost = typeof productCost === 'number' ? productCost : 0;
  const sCost = typeof shippingCost === 'number' ? shippingCost : 0;
  const gFee = typeof gatewayFeePercent === 'number' ? gatewayFeePercent : 0;

  const vatAmount = sPrice - (sPrice / 1.15);
  const gatewayFeeAmount = sPrice * (gFee / 100);
  const totalCosts = pCost + sCost + vatAmount + gatewayFeeAmount;
  const netProfit = sPrice - totalCosts;
  const margin = sPrice > 0 ? (netProfit / sPrice) * 100 : 0;

  const handleClearForm = () => {
    setProductName('');
    setSellingPrice('');
    setProductCost('');
    setShippingCost('');
    setGatewayFeePercent(2.2);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    if (!productName.trim() || sPrice <= 0) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-SA' : 'en-US';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;
    const currentTimestamp = Date.now();

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item, name: productName, sellingPrice: sPrice, productCost: pCost, shippingCost: sCost,
        gatewayFeePercent: gFee, netProfit: Number(netProfit.toFixed(2)), margin: Number(margin.toFixed(1)),
        createdAt: item.createdAt || formattedDate, createdAtTimestamp: item.createdAtTimestamp || currentTimestamp
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: ProfitItem = {
        id: Date.now().toString(), name: productName, sellingPrice: sPrice, productCost: pCost, shippingCost: sCost,
        gatewayFeePercent: gFee, netProfit: Number(netProfit.toFixed(2)), margin: Number(margin.toFixed(1)),
        createdAt: formattedDate, createdAtTimestamp: currentTimestamp
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }
    handleClearForm();
  };

  const handleEdit = (item: ProfitItem) => {
    setProductName(item.name);
    setSellingPrice(item.sellingPrice);
    setProductCost(item.productCost);
    setShippingCost(item.shippingCost);
    setGatewayFeePercent(item.gatewayFeePercent);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (timeFilter === 'all') return true;
    if (!item.createdAtTimestamp) return true;

    const now = Date.now();
    const diff = now - item.createdAtTimestamp;
    const dayMs = 24 * 60 * 60 * 1000;

    if (timeFilter === 'day') return diff <= dayMs;
    if (timeFilter === 'week') return diff <= 7 * dayMs;
    if (timeFilter === 'month') return diff <= 30 * dayMs;
    if (timeFilter === '6months') return diff <= 180 * dayMs;
    if (timeFilter === 'year') return diff <= 365 * dayMs;
    return true;
  });

  const totalSellingPrice = filteredItems.reduce((acc, curr) => acc + curr.sellingPrice, 0);
  const totalCostsValue = filteredItems.reduce((acc, curr) => acc + curr.productCost + curr.shippingCost, 0);
  const totalNetProfitValue = filteredItems.reduce((acc, curr) => acc + curr.netProfit, 0);
  const overallMargin = totalSellingPrice > 0 ? (totalNetProfitValue / totalSellingPrice) * 100 : 0;

  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
      alert(text.alerts.noDataExp);
      return;
    }
    let tableHtml = `
      <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
        <head><meta charset="utf-8"><style>table { border-collapse: collapse; width: 100%; font-family: sans-serif; } th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; } th { background-color: #f8fafc; font-weight: bold; color: #334155; }</style></head>
        <body>
          <h2>Profit Calculator Report</h2>
          <table>
            <thead><tr><th>${text.table.th1}</th><th>${text.table.th2}</th><th>${text.table.th3}</th><th>${text.table.th4}</th><th>${text.table.th5}</th><th>${text.table.th6}</th></tr></thead>
            <tbody>
    `;
    filteredItems.forEach((row, idx) => {
      tableHtml += `<tr><td>${idx + 1}</td><td>${row.name}</td><td>${row.sellingPrice}</td><td>${row.productCost + row.shippingCost}</td><td>${row.netProfit}</td><td>${row.margin}%</td></tr>`;
    });
    tableHtml += `</tbody></table></body></html>`;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "enjazya_sa_profit_analysis.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            saveToLocalStorage(imported);
            alert(text.alerts.importSuccess);
          }
        } catch (err) { alert(text.alerts.importErr); }
      };
    }
  };

  return (
    <div className="hero-tool-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="hero-badge">✨ {lang === 'ar' ? 'متاح للتجربة' : 'Trial Available'}</div>
      
      <style jsx>{`
        .hero-tool-container { background: #ffffff; border-radius: 20px; padding: 35px 25px; border: 2px solid #047857; box-shadow: 0 15px 35px -5px rgba(4,120,87,0.15); margin-bottom: 40px; position: relative; overflow: hidden; width: 100%; box-sizing: border-box;}
        .hero-badge { position: absolute; top: 0; ${lang === 'ar' ? 'left: 0' : 'right: 0'}; background: #047857; color: white; padding: 6px 16px; border-bottom-${lang === 'ar' ? 'right' : 'left'}-radius: 15px; font-weight: bold; font-size: 13px; z-index: 2;}
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input.with-currency { padding-${lang === 'ar' ? 'left' : 'right'}: 45px; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #047857; background: #ffffff; }
        .currency-tag { position: absolute; ${lang === 'ar' ? 'left: 14px;' : 'right: 14px;'} color: #64748b; font-weight: 800; font-size: 13px; pointer-events: none; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: block; text-align: center; }
        .action-btn:hover { background: #065f46; }
        
        .mobile-btn-container { display: none; }
        .desktop-btn-container { display: block; }

        @media(max-width: 850px) {
          .desktop-btn-container { display: none; }
          .mobile-btn-container { display: block; margin-top: 20px; width: 100%; }
        }

        .result-box { background: #f8fafc; border-radius: 12px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .result-box.primary { background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border: none; padding: 20px; }
        .result-box.danger { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; border: none; padding: 20px; }
        .result-label { font-size: 13px; font-weight: 700; color: #64748b; }
        .primary .result-label, .danger .result-label { color: #ffffff; opacity: 0.9; }
        .result-value { font-size: 18px; font-weight: 900; color: #0f172a; direction: ltr; }
        .primary .result-value, .danger .result-value { font-size: 24px; color: #ffffff; direction: ltr; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 250px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .filter-row { display: flex; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px; gap: 4px; overflow-x: auto; flex: 1; justify-content: center; min-width: 300px;}
        .filter-btn { background: transparent; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; font-family: inherit; white-space: nowrap; }
        .filter-btn:hover { color: #0f172a; background: #e2e8f0; }
        .filter-btn.active { background: #ffffff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
      </div>

      <form id="profit-calc-form" onSubmit={handleSaveItem}>
        <div className="grid-layout">
          <div className="card">
            <h2 className="card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
                <span>{editingId ? text.editRecord : text.newRecord}</span>
                <button type="button" className="clear-form-btn" onClick={handleClearForm}>{text.clear}</button>
              </div>
              {isClient && !isActivated && <span className="trial-badge">{text.trial}: {items.length}/3</span>}
            </h2>

            <div className="input-group">
              <label>{text.prodNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodNamePH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.sellPriceLabel} ({text.currency})</label>
              <div className="input-wrapper">
                <input className="with-currency" type="number" step="0.01" min="0" value={sellingPrice === '' ? '' : sellingPrice} onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="200" required />
                <span className="currency-tag">{text.currency}</span>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.costLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={productCost === '' ? '' : productCost} onChange={(e) => setProductCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="50" required />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
              <div className="input-group">
                <label>{text.shipLabel} ({text.currency})</label>
                <div className="input-wrapper">
                  <input className="with-currency" type="number" step="0.01" min="0" value={shippingCost === '' ? '' : shippingCost} onChange={(e) => setShippingCost(e.target.value === '' ? '' : Number(e.target.value))} placeholder="25" />
                  <span className="currency-tag">{text.currency}</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.gatewayLabel}</label>
              <div className="input-wrapper">
                <input type="number" step="0.1" min="0" value={gatewayFeePercent === '' ? '' : gatewayFeePercent} onChange={(e) => setGatewayFeePercent(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2.2" />
                <span className="currency-tag">%</span>
              </div>
            </div>

            <div className="desktop-btn-container">
              <button type="submit" className="action-btn">
                {editingId ? text.saveBtnEdit : text.saveBtnNew}
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">{text.resultsTitle}</h2>

            <div className={`result-box ${netProfit > 0 ? 'primary' : 'danger'}`}>
              <div>
                <div className="result-label">{text.netProfitLabel}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{text.netProfitSub}</div>
              </div>
              <div className="result-value">
                {netProfit.toFixed(2)} {text.currency}
              </div>
            </div>

            <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #047857' : 'none', borderLeft: lang === 'en' ? '4px solid #047857' : 'none' }}>
              <span className="result-label">{text.marginLabel}</span>
              <span className="result-value" style={{ color: margin >= 20 ? '#10b981' : '#d97706' }}>
                {margin.toFixed(1)}%
              </span>
            </div>

            <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #0369a1' : 'none', borderLeft: lang === 'en' ? '4px solid #0369a1' : 'none' }}>
              <span className="result-label">{text.vatLabel}</span>
              <span className="result-value" style={{ color: '#0369a1' }}>{vatAmount.toFixed(2)} {text.currency}</span>
            </div>

            <div className="result-box" style={{ borderRight: lang === 'ar' ? '4px solid #dc2626' : 'none', borderLeft: lang === 'en' ? '4px solid #dc2626' : 'none', background: '#f8fafc' }}>
              <span className="result-label">{text.totalCostLabel}</span>
              <span className="result-value" style={{ color: '#dc2626' }}>{totalCosts.toFixed(2)} {text.currency}</span>
            </div>

            <div className="mobile-btn-container">
              <button type="submit" className="action-btn" style={{ background: '#047857' }}>
                {editingId ? text.saveBtnEdit : text.saveBtnNew}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="table-section">
        <div className="table-toolbar">
          <input type="text" className="search-input" placeholder={text.searchPH} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <div className="filter-row">
            <button className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`} onClick={() => setTimeFilter('all')}>{text.filter.all}</button>
            <button className={`filter-btn ${timeFilter === 'day' ? 'active' : ''}`} onClick={() => setTimeFilter('day')}>{text.filter.day}</button>
            <button className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`} onClick={() => setTimeFilter('week')}>{text.filter.week}</button>
            <button className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`} onClick={() => setTimeFilter('month')}>{text.filter.month}</button>
            <button className={`filter-btn ${timeFilter === '6months' ? 'active' : ''}`} onClick={() => setTimeFilter('6months')}>{text.filter.sixMonths}</button>
            <button className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`} onClick={() => setTimeFilter('year')}>{text.filter.year}</button>
          </div>
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel}>{text.exportBtn}</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>{text.importBtn}</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{text.table.th1}</th>
                <th>{text.table.th2}</th>
                <th>{text.table.th3}</th>
                <th>{text.table.th4}</th>
                <th>{text.table.th5}</th>
                <th>{text.table.th6}</th>
                <th>{text.table.th7}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>{text.table.noRecords}</td></tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.name}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td style={{ fontWeight: 800 }}>{item.sellingPrice} {text.currency}</td>
                    <td>{(item.productCost + item.shippingCost).toFixed(2)} {text.currency}</td>
                    <td style={{ color: item.netProfit > 0 ? '#047857' : '#dc2626', fontWeight: 900 }}>{item.netProfit} {text.currency}</td>
                    <td>{item.margin}%</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button onClick={() => handleEdit(item)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>{text.table.editBtn}</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>{text.table.delBtn}</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={2} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{totalSellingPrice.toFixed(2)} {text.currency}</td>
                  <td>{totalCostsValue.toFixed(2)} {text.currency}</td>
                  <td style={{ color: totalNetProfitValue > 0 ? '#047857' : '#dc2626' }}>{totalNetProfitValue.toFixed(2)} {text.currency}</td>
                  <td style={{ color: overallMargin > 0 ? '#047857' : '#dc2626' }}>{overallMargin.toFixed(1)}%</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. المكون الرئيسي للمنصة (الشبكة المفتوحة مع لافتة الترقية الاحترافية)
// ==========================================
export default function EnjazyaSaudiHub() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const globalFileInputRef = useRef<HTMLInputElement>(null);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/55d16a28-3c2d-4688-a98d-7168e50a5f44';

  useEffect(() => {
    const savedLang = (localStorage.getItem('enjazya_sa_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);
    const licenseKey = localStorage.getItem('merchant_license_key') || '';
    setLicenseKeyInput(licenseKey);
    setIsActivated(!!licenseKey);
    document.title = savedLang === 'en' ? 'Enjazya Platform | Saudi Market 🇸🇦' : 'منصة إنجازيا | السوق السعودي 🇸🇦';
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('enjazya_sa_lang', newLang);
  };

  const handleActivateLicense = async (keyToValidate: string) => {
    const cleanKey = keyToValidate.trim();
    if (!cleanKey) {
      alert(lang === 'en' ? 'Please enter your license key.' : 'الرجاء إدخال مفتاح الترخيص.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'license_key': cleanKey })
      });
      const data = await response.json();
      if (data.valid) {
        localStorage.setItem('merchant_license_key', cleanKey);
        setIsActivated(true);
        alert(lang === 'en' ? '✨ Platform unlocked! You have unlimited access.' : '✨ تم تفعيل حسابك بنجاح! جميع القيود تم رفعها.');
      } else {
        alert(lang === 'en' ? '❌ Invalid key.' : '❌ مفتاح الترخيص غير صالح أو منتهي.');
      }
    } catch (error) {
      if (cleanKey.length >= 10 && cleanKey.includes('-')) {
        localStorage.setItem('merchant_license_key', cleanKey);
        setIsActivated(true);
        alert(lang === 'en' ? '✨ Platform unlocked!' : '✨ تم التفعيل بنجاح!');
      } else {
        alert(lang === 'en' ? '❌ Invalid key.' : '❌ مفتاح غير صالح.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = () => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من تسجيل الخروج من النسخة المدفوعة والعودة للنسخة التجريبية؟' : 'Are you sure you want to deactivate and return to trial?')) {
      localStorage.removeItem('merchant_license_key');
      setIsActivated(false);
      setLicenseKeyInput('');
    }
  };

  const handleExportAllData = () => {
    try {
      const allData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('seerk_') || key.startsWith('enjazya_') || key === 'merchant_license_key')) {
          allData[key] = localStorage.getItem(key) || '';
        }
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `enjazya_saudi_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert(lang === 'en' ? '📥 Data exported successfully!' : '📥 تم سحب وتصدير كافة بيانات مدخلات الأدوات بنجاح!');
    } catch (error) {
      alert(lang === 'en' ? 'Export failed.' : 'حدث خطأ أثناء تصدير البيانات.');
    }
  };

  const handleImportAllData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target?.result as string);
          Object.keys(parsedData).forEach((key) => {
            localStorage.setItem(key, parsedData[key]);
          });
          alert(lang === 'en' ? '✨ Data restored successfully! Page will reload.' : '✨ تم إدخال واستعادة البيانات بنجاح! سيتم تحديث الصفحة الآن.');
          window.location.reload();
        } catch (error) {
          alert(lang === 'en' ? '❌ Invalid backup file.' : '❌ ملف النسخة الاحتياطية غير صالح أو تالف.');
        }
      };
    }
  };

  return (
    <div className="hub-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .hub-container { padding: 30px 20px 0; min-height: 100vh; display: flex; flex-direction: column; }
        .content-wrap { flex: 1; max-width: 1250px; margin: 0 auto; width: 100%; box-sizing: border-box;}
        
        .navbar { max-width: 1250px; margin: 0 auto ${isActivated ? '10px' : '40px'}; padding: 14px 24px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; border-top: 5px solid #047857; flex-wrap: wrap; gap: 15px;}
        .brand { font-size: 26px; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 12px; }
        .sa-badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 5px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #a7f3d0; }
        
        .nav-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .lang-toggle-btn { background: #f8fafc; border: 2px solid #e2e8f0; font-weight: 800; padding: 7px 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        
        .backup-action-btn { background: #0f172a; color: #fff; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-right: 5px;}
        .backup-action-btn:hover { background: #1e293b; }
        .restore-action-btn { background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-right: 5px;}
        .restore-action-btn:hover { background: #e2e8f0; }
        .backup-warning-bar { max-width: 1250px; margin: 0 auto 30px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 12px 18px; border-radius: 10px; font-size: 13.5px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; gap: 10px; border-${lang === 'ar' ? 'right' : 'left'}: 4px solid #047857; text-align: ${lang === 'ar' ? 'right' : 'left'}; }

        .hero-text { text-align: center; max-width: 800px; margin: 0 auto 40px; }
        .hero-text h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .hero-text h1 span { color: #047857; }
        
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 40px; }
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; transition: 0.3s; }
        .card:hover { border-color: #047857; box-shadow: 0 10px 20px rgba(4,120,87,0.1); transform: translateY(-3px); }
        .card-icon { font-size: 28px; background: #f8fafc; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 10px; margin-bottom: 15px; }
        .card h3 { font-size: 17px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .card p { color: #64748b; font-size: 13.5px; line-height: 1.6; font-weight: 500; }

        .premium-banner {
          max-width: 1250px; margin: 0 auto 40px;
          background: linear-gradient(135deg, #020617 0%, #0f172a 100%);
          border-radius: 20px; padding: 40px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 40px; box-shadow: 0 20px 40px -10px rgba(4, 120, 87, 0.3);
          border: 1px solid #1e293b; position: relative; overflow: hidden;
        }
        .premium-banner::before {
          content: ''; position: absolute; top: -50px; left: -50px; width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(4,120,87,0.2) 0%, rgba(0,0,0,0) 70%); z-index: 0;
        }
        .pb-content { flex: 1.5; min-width: 320px; z-index: 1; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .pb-badge { display: inline-block; background: rgba(52, 211, 153, 0.1); color: #34d399; font-size: 13px; font-weight: 800; padding: 6px 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid rgba(52, 211, 153, 0.2); }
        .pb-title { font-size: 28px; font-weight: 900; color: #ffffff; margin: 0 0 20px 0; line-height: 1.4; }
        
        .pb-features { list-style: none; padding: 0; margin: 0 0 25px 0; display: flex; flex-direction: column; gap: 12px; }
        .pb-features li { color: #cbd5e1; font-size: 15px; display: flex; align-items: center; gap: 10px; font-weight: 600; }
        .pb-features li span { color: #34d399; font-weight: 900; font-size: 18px; }
        
        .pb-price-wrap { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.03); padding: 15px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: inline-flex;}
        .pb-old { text-decoration: line-through; color: #64748b; font-size: 16px; font-weight: bold;}
        .pb-new { color: #34d399; font-size: 32px; font-weight: 900; display: flex; align-items: baseline; gap: 5px; }
        .pb-new span { font-size: 14px; font-weight: 600; color: #94a3b8; }
        
        .pb-action-panel { flex: 1; min-width: 320px; z-index: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 25px; display: flex; flex-direction: column; gap: 25px; }
        
        .pb-buy-box p, .pb-activate-box p { margin: 0 0 10px 0; color: #e2e8f0; font-size: 14px; font-weight: 700; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .pb-btn-buy { background: linear-gradient(135deg, #047857 0%, #059669 100%); color: white; display: block; width: 100%; padding: 16px; border-radius: 12px; font-weight: 900; font-size: 16px; cursor: pointer; transition: 0.3s; text-align: center; text-decoration: none; box-shadow: 0 4px 15px rgba(4, 120, 87, 0.4); border: 1px solid #10b981;}
        .pb-btn-buy:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(4, 120, 87, 0.6); background: linear-gradient(135deg, #059669 0%, #10b981 100%); }

        .pb-divider { text-align: center; color: #64748b; font-size: 12px; font-weight: bold; position: relative; }
        .pb-divider::before, .pb-divider::after { content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: rgba(255,255,255,0.1); }
        .pb-divider::before { left: 0; } .pb-divider::after { right: 0; }

        .pb-input-group { display: flex; gap: 10px; }
        .pb-input { flex: 1; padding: 12px 15px; border: 1px solid #334155; border-radius: 10px; font-size: 14px; background: #0f172a; color: white; outline: none; transition: 0.3s; font-family: inherit;}
        .pb-input:focus { border-color: #34d399; }
        .pb-btn-activate { background: #334155; color: #ffffff; padding: 12px 20px; border: 1px solid #475569; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; font-family: inherit; white-space: nowrap;}
        .pb-btn-activate:hover { background: #475569; color: #34d399; }

        /* ====== تصميم الفوتر الأسود القديم (Old Black Footer CSS) ====== */
        .footer-dark { background: #0b0f19; border-top: 3px solid #1e293b; color: #cbd5e1; padding: 50px 20px 20px; margin-top: auto; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; box-sizing: border-box; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .footer-dark-inner { max-width: 1250px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
        
        .footer-col-dark h4 { font-size: 16px; font-weight: 800; color: #ffffff; margin: 0 0 20px 0; display: inline-flex; align-items: center; gap: 8px; border-bottom: 2px solid #334155; padding-bottom: 8px; }
        .footer-col-dark p { font-size: 13.5px; line-height: 1.6; margin: 0 0 15px 0; color: #94a3b8; }
        .footer-col-dark ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
        .footer-col-dark ul li a { font-size: 14px; color: #94a3b8; transition: 0.2s; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .footer-col-dark ul li a:hover { color: #ffffff; transform: translateX(${lang === 'ar' ? '-5px' : '5px'}); }

        .footer-brand { font-size: 24px; font-weight: 900; color: #ffffff; display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .footer-brand span { color: #94a3b8; font-weight: 600; font-size: 18px; }
        
        .footer-dark-bottom { max-width: 1250px; margin: 40px auto 0; padding-top: 25px; border-top: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; font-size: 13px; font-weight: 600; color: #64748b; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .payment-icons { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .pay-badge { font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; letter-spacing: 0.5px; transition: transform 0.2s ease; }
        .pay-badge:hover { transform: translateY(-2px); }
        .pay-badge.cashapp { background: #00D632; color: #000; }
        .pay-badge.gpay { background: #ffffff; color: #1e293b; border: 1px solid #cbd5e1; }
        .pay-badge.paypal { background: #003087; color: #ffffff; }
        .pay-badge.discover { background: #ff6600; color: #ffffff; }
        .pay-badge.amex { background: #006fcf; color: #ffffff; }
        .pay-badge.mc { background: #222222; color: #ffffff; border: 1px solid #333; }
        .pay-badge.visa { background: #1a1f71; color: #ffffff; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 900px) { .footer-dark-inner { grid-template-columns: repeat(2, 1fr); gap: 30px; } }
        @media(max-width: 768px) { .cards-grid { grid-template-columns: 1fr; } .premium-banner { padding: 25px; flex-direction: column; gap: 30px; } .pb-input-group { flex-direction: column; } .pb-action-panel { width: 100%; box-sizing: border-box; } }
        @media(max-width: 600px) { .footer-dark-inner { grid-template-columns: 1fr; } .footer-dark-bottom { flex-direction: column; text-align: center; justify-content: center; } }
      `}</style>

      <div className="content-wrap">
        <div className="navbar">
          <div className="brand">
            {lang === 'ar' ? 'إنجازيا' : 'Enjazya'} 
            <span className="sa-badge">🇸🇦 {lang === 'ar' ? 'السوق السعودي' : 'Saudi Market'}</span>
          </div>
          <div className="nav-controls">
            <button onClick={toggleLanguage} className="lang-toggle-btn">{lang === 'ar' ? 'English' : 'العربية'}</button>
            
            {isActivated && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={handleExportAllData} className="backup-action-btn">
                   {lang === 'ar' ? 'تصدير البيانات 💾' : 'Export Data 💾'}
                </button>
                <button onClick={() => globalFileInputRef.current?.click()} className="restore-action-btn">
                   {lang === 'ar' ? 'استعادة 📂' : 'Restore 📂'}
                </button>
                <input type="file" ref={globalFileInputRef} onChange={handleImportAllData} accept=".json" style={{ display: 'none' }} />

                <span style={{background: '#dcfce7', color: '#16a34a', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', border: '1px solid #bbf7d0'}}>
                   {lang === 'ar' ? '🔓 النسخة الكاملة مفعلة' : '🔓 Pro Activated'}
                </span>
                <button 
                  onClick={handleDeactivate}
                  style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}
                  title={lang === 'ar' ? 'تسجيل الخروج والعودة للنسخة التجريبية' : 'Logout to Free Trial'}
                >
                  {lang === 'ar' ? 'خروج ❌' : 'Logout ❌'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* تنبيه الخصوصية والحفظ يظهر فقط للمشتركين أسفل البار العلوي */}
        {isActivated && (
          <div className="backup-warning-bar">
            <span>⚠ {lang === 'ar' ? 'تنبيه مهم: جميع مدخلاتك وحساباتك تُحفظ محلياً في متصفحك لضمان سرية أرقامك. احرص على استخدام زر "تصدير البيانات" بالأعلى دورياً لحفظها واستعادتها بأي وقت.' : 'Important Note: Your inputs are saved locally in your browser. Use "Export Data" above periodically to backup your inputs and restore them anytime.'}</span>
          </div>
        )}

        <div className="hero-text">
          <h1>{lang === 'ar' ? 'منصة إنجازيا ' : 'Enjazya Platform '}<span>ULTRA MAX</span></h1>
          <p style={{color: '#64748b', fontSize: '16px', fontWeight: 600}}>
            {lang === 'ar' ? 'تصفح وجرب أدوات حماية وتطوير المتاجر الإلكترونية مجاناً.' : 'Browse and test e-commerce protection tools for free.'}
          </p>
        </div>

        {/* المكون الأول: إخفاء الأداة المكشوفة إذا تم التفعيل لتجنب الازدحام */}
        {!isActivated && (
          <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
             <FreeProfitCalculatorSA lang={lang} isActivated={isActivated} />
          </div>
        )}

        {/* المكون الثاني: لافتة الترقية (تظهر فقط في النسخة التجريبية) */}
        {!isActivated && (
          <div className="premium-banner">
            <div className="pb-content">
              <div className="pb-badge">🌟 {lang === 'ar' ? 'إنجازيا ULTRA MAX' : 'Enjazya ULTRA MAX'}</div>
              <h3 className="pb-title">
                {lang === 'ar' ? 'ارفع القيود وافتح الترسانة الكاملة' : 'Remove Limits & Unlock Full Arsenal'}
              </h3>
              
              <ul className="pb-features">
                <li><span>✓</span> {lang === 'ar' ? 'وصول لامحدود لجميع الأدوات الـ 24' : 'Unlimited access to all 24 tools'}</li>
                <li><span>✓</span> {lang === 'ar' ? 'رخصة صالحة لعام كامل بدون رسوم شهرية' : 'Valid for 1 year with no monthly fees'}</li>
                <li><span>✓</span> {lang === 'ar' ? 'حماية كاملة لخوارزميات متجرك وتسعيرك' : 'Full protection for your store algorithms'}</li>
              </ul>

              <div className="pb-price-wrap">
                <span className="pb-old">{lang === 'ar' ? '299 ر.س' : '299 SAR'}</span>
                <div className="pb-new">{lang === 'ar' ? '49.99 ر.س' : '49.99
