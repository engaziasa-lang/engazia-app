'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface PolicyItem {
  id: string;
  storeName: string;
  policyType: string;
  supportEmail: string;
  supportPhone: string;
  returnDays: number;
  policyContent: string;
  createdAt?: string;
}

export default function PoliciesGeneratorAE() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [storeName, setStoreName] = useState<string>('');
  const [policySelect, setPolicySelect] = useState<string>('');
  const [customPolicyType, setCustomPolicyType] = useState<string>('');
  const [supportEmail, setSupportEmail] = useState<string>('');
  const [supportPhone, setSupportPhone] = useState<string>('');
  const [returnDays, setReturnDays] = useState<number | ''>(7);
  const [policyContent, setPolicyContent] = useState<string>('');

  const [items, setItems] = useState<PolicyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // قراءة اللغة
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    // ضبط القيم الافتراضية بناءً على اللغة
    if (savedLang === 'en') {
      setPolicySelect('Return & Exchange Policy 🔄');
      setCustomPolicyType('Return & Exchange Policy 🔄');
    } else {
      setPolicySelect('سياسة الاستبدال والاسترجاع 🔄');
      setCustomPolicyType('سياسة الاستبدال والاسترجاع 🔄');
    }

    const saved = localStorage.getItem('seerk_ae_policies_generator_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
    const defaultStore = localStorage.getItem('seerk_ae_store_name');
    if (defaultStore) setStoreName(defaultStore);
  }, []);

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مولد السياسات وقوانين حماية المستهلك ⚖️',
      desc: 'أنشئ صفحات الاستبدال والاسترجاع، سياسة الخصوصية، أو أي سياسة أخرى مخصصة لمتجرك الإماراتي',
      editRecord: 'تعديل السياسة',
      newRecord: 'توليد سياسة جديدة',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      storeNameLabel: 'اسم المتجر',
      storeNamePH: 'مثال: متجر سديم',
      policyTypeLabel: 'نوع السياسة المطلوبة',
      optReturn: 'سياسة الاستبدال والاسترجاع 🔄',
      optPrivacy: 'سياسة الخصوصية 🔒',
      optTerms: 'الشروط والأحكام 📜',
      optOther: '➕ سياسة أخرى (كتابة يدوية)',
      otherPH: 'اكتب مسمى السياسة هنا (مثال: سياسة الشحن)...',
      emailLabel: 'البريد الإلكتروني للدعم',
      emailPH: 'support@yourstore.ae',
      phoneLabel: 'رقم واتساب الدعم',
      phonePH: '9715XXXXXXXX',
      returnDaysLabel: 'مدة الاستبدال والاسترجاع (بالأيام)',
      saveBtnNew: '+ حفظ السياسة في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      previewTitle: 'معاينة نص السياسة',
      copyBtn: '📋 نسخ نص السياسة للحافظة',
      searchPH: '🔍 بحث باسم المتجر أو نوع السياسة...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد سياسات مسجلة حالياً.',
        th1: '#',
        th2: 'المتجر والتاريخ',
        th3: 'نوع السياسة',
        th4: 'البريد والهاتف',
        th5: 'الإجراءات',
        totalLabel: 'إجمالي السياسات المسجلة',
        policiesCount: 'سياسات',
        copy: '📋 نسخ'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سياسات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المتجر ومسمى السياسة والبريد الإلكتروني.',
        updateSuccess: '✨ تم تحديث السياسة بنجاح!',
        saveSuccess: '✅ تمت إضافة السياسة إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذه السياسة؟',
        copySuccess: '📋 تم نسخ نص السياسة بنجاح! يمكنك لصقه مباشرة في صفحة المتجر.',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد السياسات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Store Policies & Consumer Law Generator ⚖️',
      desc: 'Generate customized return policies, privacy policies, and terms for your UAE store',
      editRecord: 'Edit Policy',
      newRecord: 'Generate New Policy',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      storeNameLabel: 'Store Name',
      storeNamePH: 'e.g. Sadeem Store',
      policyTypeLabel: 'Policy Type',
      optReturn: 'Return & Exchange Policy 🔄',
      optPrivacy: 'Privacy Policy 🔒',
      optTerms: 'Terms & Conditions 📜',
      optOther: '➕ Other Policy (Manual Entry)',
      otherPH: 'Type policy name (e.g. Shipping Policy)...',
      emailLabel: 'Support Email',
      emailPH: 'support@yourstore.ae',
      phoneLabel: 'Support WhatsApp/Phone',
      phonePH: '9715XXXXXXXX',
      returnDaysLabel: 'Return & Exchange Period (Days)',
      saveBtnNew: '+ Save Policy to Log',
      saveBtnEdit: '💾 Save Changes',
      previewTitle: 'Policy Text Preview',
      copyBtn: '📋 Copy Policy Text',
      searchPH: '🔍 Search by store or policy type...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No policies currently saved.',
        th1: '#',
        th2: 'Store & Date',
        th3: 'Policy Type',
        th4: 'Email & Phone',
        th5: 'Actions',
        totalLabel: 'Total Saved Policies',
        policiesCount: 'policies',
        copy: '📋 Copy'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 policies). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure store name, policy name, and email are filled correctly.',
        updateSuccess: '✨ Policy updated successfully!',
        saveSuccess: '✅ Policy added to log successfully!',
        delConfirm: 'Are you sure you want to delete this policy?',
        copySuccess: '📋 Policy text copied! You can paste it directly into your store pages.',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Policies imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];
  const actualPolicyType = policySelect === text.optOther ? customPolicyType : policySelect;

  // توليد النص تلقائياً بناءً على اللغة المختارة
  useEffect(() => {
    const currentStore = storeName.trim() || (lang === 'ar' ? 'المتجر' : 'The Store');
    const currentEmail = supportEmail.trim() || 'support@yourstore.ae';
    const currentPhone = supportPhone.trim() || '9715XXXXXXXX';
    const days = returnDays || 7;

    const isReturn = policySelect.includes('استرجاع') || policySelect.includes('Return');
    const isPrivacy = policySelect.includes('خصوصية') || policySelect.includes('Privacy');
    const isTerms = policySelect.includes('شروط') || policySelect.includes('Terms');

    if (lang === 'ar') {
      if (isReturn) {
        setPolicyContent(
          `أهلاً بكم في ${currentStore}. حرصاً منا على خدمتكم بأفضل شكل، فإن سياسة الاستبدال والاسترجاع تخضع للشروط والضوابط التالية:\n\n` +
          `1. مدة الاستبدال والاسترجاع هي خلال (${days}) أيام من تاريخ استلام الطلب وفقاً لقوانين حماية المستهلك في الإمارات.\n` +
          `2. يجب أن يكون المنتج بحالته الأصلية، وفي غلافه الأصلي، ولم يتم فتحه أو استخدامُه، مع إرفاق فاتورة الشراء.\n` +
          `3. تتحمل تكاليف الشحن العكسي في حال كان الاسترجاع بسبب رغبة العميل، بينما يتحمل المتجر التكاليف في حال وجود عيب مصنعي أو خطأ في الطلب.\n` +
          `4. للاستفسار أو تقديم طلب استرجاع، يرجى التواصل معنا عبر البريد: ${currentEmail} أو الواتساب: ${currentPhone}.`
        );
      } else if (isPrivacy) {
        setPolicyContent(
          `في ${currentStore}، نلتزم بحماية خصوصية بياناتكم الشخصية. توضح هذه السياسة كيف نقوم بجمع واستخدام وحماية معلوماتكم:\n\n` +
          `1. البيانات التي نجمعها: الاسم، رقم الجوال، عنوان الشحن، البريد الإلكتروني لتنفيذ طلباتكم فقط.\n` +
          `2. حماية البيانات: نستخدم أحدث أساليب التشفير والأمان لضمان عدم تسريب أي معلومة.\n` +
          `3. لا نقوم نهائياً ببيع أو مشاركة بياناتك مع أي طرف ثالث لأغراض تسويقية.\n` +
          `4. لأي استفسار بخصوص الخصوصية، يرجى التواصل معنا على: ${currentEmail}.`
        );
      } else if (isTerms) {
        setPolicyContent(
          `الشروط والأحكام الخاصة بـ ${currentStore}:\n\n` +
          `1. استخدامك للمتجر يعني موافقتك التامة على كافة الشروط والسياسات المعلنة.\n` +
          `2. الأسعار معروضة بالدرهم الإماراتي (د.إ) شاملة ضريبة القيمة المضافة (5%).\n` +
          `3. يحق للمتجر إلغاء الطلب في حال نفاد الكمية أو عدم إتمام عملية الدفع خلال المدة المحددة، مع إرجاع المبلغ كاملاً للعميل.\n` +
          `4. للتواصل والدعم الفني: ${currentEmail} - هاتف: ${currentPhone}.`
        );
      } else {
        if (!editingId || !policyContent) {
          setPolicyContent(
            `نص ${customPolicyType || 'السياسة'} الخاص بـ ${currentStore}:\n\n` +
            `1. يلتزم المتجر بتقديم أفضل الخدمات وفقاً لهذه السياسة والقوانين المعمول بها في دولة الإمارات العربية المتحدة.\n` +
            `2. لأي استفسارات أو تفاصيل إضافية، يرجى التواصل معنا عبر البريد: ${currentEmail} أو عبر الواتساب: ${currentPhone}.`
          );
        }
      }
    } else {
      // English Policies
      if (isReturn) {
        setPolicyContent(
          `Welcome to ${currentStore}. To ensure the best service, our Return and Exchange Policy is subject to the following terms:\n\n` +
          `1. Returns and exchanges are accepted within (${days}) days of receiving the order, in accordance with UAE consumer protection laws.\n` +
          `2. The product must be in its original condition, unopened, unused, and in its original packaging with the purchase receipt.\n` +
          `3. The customer bears the reverse shipping costs if the return is a personal preference. The store covers costs for manufacturing defects or wrong items.\n` +
          `4. For inquiries or return requests, please contact us via Email: ${currentEmail} or WhatsApp: ${currentPhone}.`
        );
      } else if (isPrivacy) {
        setPolicyContent(
          `At ${currentStore}, we are committed to protecting your privacy. This policy explains how we collect, use, and protect your information:\n\n` +
          `1. Data collected: Name, phone number, shipping address, and email strictly to process your orders.\n` +
          `2. Data Protection: We use the latest encryption and security protocols to ensure no information is leaked.\n` +
          `3. We absolutely do not sell or share your personal data with any third party for marketing purposes.\n` +
          `4. For any privacy inquiries, please contact us at: ${currentEmail}.`
        );
      } else if (isTerms) {
        setPolicyContent(
          `Terms and Conditions for ${currentStore}:\n\n` +
          `1. Your use of this store constitutes your full agreement to all stated terms and policies.\n` +
          `2. Prices are displayed in UAE Dirhams (AED) and include Value Added Tax (5% VAT).\n` +
          `3. The store reserves the right to cancel an order in case of stock depletion or incomplete payment, with a full refund to the customer.\n` +
          `4. For technical support and contact: ${currentEmail} - Phone: ${currentPhone}.`
        );
      } else {
        if (!editingId || !policyContent) {
          setPolicyContent(
            `Text for ${customPolicyType || 'Policy'} of ${currentStore}:\n\n` +
            `1. The store is committed to providing the best services in accordance with this policy and the applicable laws in the United Arab Emirates.\n` +
            `2. For any inquiries or further details, please contact us via Email: ${currentEmail} or WhatsApp: ${currentPhone}.`
          );
        }
      }
    }
  }, [storeName, policySelect, customPolicyType, returnDays, supportEmail, supportPhone, lang, editingId, policyContent]);

  const saveToLocalStorage = (newItems: PolicyItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ae_policies_generator_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  const days = typeof returnDays === 'number' ? returnDays : 7;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPolicySelect(val);
    if (val !== text.optOther) {
      setCustomPolicyType(val);
    } else {
      setCustomPolicyType('');
    }
  };

  const handleClearForm = () => {
    setStoreName('');
    const defPolicy = lang === 'en' ? text.optReturn : text.optReturn;
    setPolicySelect(defPolicy);
    setCustomPolicyType(defPolicy);
    setSupportEmail('');
    setSupportPhone('');
    setReturnDays(7);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalPolicyName = policySelect === text.optOther ? customPolicyType : policySelect;
    if (!storeName.trim() || !finalPolicyName.trim() || !supportEmail.trim()) {
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
        storeName,
        policyType: finalPolicyName,
        supportEmail,
        supportPhone,
        returnDays: days,
        policyContent,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: PolicyItem = {
        id: Date.now().toString(),
        storeName,
        policyType: finalPolicyName,
        supportEmail,
        supportPhone,
        returnDays: days,
        policyContent,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: PolicyItem) => {
    setStoreName(item.storeName);
    
    const isReturn = item.policyType.includes('استرجاع') || item.policyType.includes('Return');
    const isPrivacy = item.policyType.includes('خصوصية') || item.policyType.includes('Privacy');
    const isTerms = item.policyType.includes('شروط') || item.policyType.includes('Terms');

    let matchedType = '';
    if (isReturn) matchedType = text.optReturn;
    else if (isPrivacy) matchedType = text.optPrivacy;
    else if (isTerms) matchedType = text.optTerms;
    else matchedType = text.optOther;

    setPolicySelect(matchedType);
    setCustomPolicyType(item.policyType);
    setSupportEmail(item.supportEmail);
    setSupportPhone(item.supportPhone);
    setReturnDays(item.returnDays);
    setPolicyContent(item.policyContent);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(policyContent);
    alert(text.alerts.copySuccess);
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert(text.alerts.noDataExp);
      return;
    }

    let tableHtml = `
      <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
            th { background-color: #f8fafc; font-weight: bold; color: #334155; }
            .tfoot-row td { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.storeNameLabel}</th>
                <th>Date / Time</th>
                <th>${text.policyTypeLabel}</th>
                <th>${text.emailLabel} & Phone</th>
                <th>Policy Content</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.storeName}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.policyType}</td>
          <td>${row.supportEmail} / ${row.supportPhone}</td>
          <td>${row.policyContent.replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">${text.table.totalLabel}</td>
                <td>${items.length} ${text.table.policiesCount}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "enjazya_ae_policies_generator.xls");
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
        } catch (err) {
          alert(text.alerts.importErr);
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.policyType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tool-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
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
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }
        
        .copy-btn { background: #0369a1; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #0284c7; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit;}
        .btn-wa { background: #dcfce7; color: #166534; }
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/ae" className="back-btn">
          {text.back}
        </Link>
      </div>

      <div className="grid-layout">
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span>{editingId ? text.editRecord : text.newRecord}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm}>
                {text.clear}
              </button>
            </div>
            {!isActivated && <span className="trial-badge">{text.trial}: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>{text.storeNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder={text.storeNamePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.policyTypeLabel}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={policySelect} onChange={handleSelectChange}>
                    <option value={text.optReturn}>{text.optReturn}</option>
                    <option value={text.optPrivacy}>{text.optPrivacy}</option>
                    <option value={text.optTerms}>{text.optTerms}</option>
                    <option value={text.optOther}>{text.optOther}</option>
                  </select>
                </div>

                {policySelect === text.optOther && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customPolicyType} 
                      onChange={(e) => setCustomPolicyType(e.target.value)} 
                      placeholder={text.otherPH} 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>{text.emailLabel}</label>
                <div className="input-wrapper">
                  <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder={text.emailPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.phoneLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} placeholder={text.phonePH} required />
                </div>
              </div>
            </div>

            {(policySelect === text.optReturn || policySelect.includes('استرجاع') || policySelect.includes('Return')) && (
              <div className="input-group">
                <label>{text.returnDaysLabel}</label>
                <div className="input-wrapper">
                  <input type="number" min="1" max="30" value={returnDays === '' ? '' : returnDays} onChange={(e) => setReturnDays(e.target.value === '' ? '' : Number(e.target.value))} placeholder="7" required />
                </div>
              </div>
            )}

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.previewTitle} ({actualPolicyType})</h2>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <div className="input-wrapper">
              <textarea 
                rows={10} 
                value={policyContent} 
                onChange={(e) => setPolicyContent(e.target.value)} 
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: '#f8fafc', color: '#0f172a', resize: 'vertical', lineHeight: '1.6', textAlign: lang === 'ar' ? 'right' : 'left', direction: lang === 'ar' ? 'rtl' : 'ltr' }}
              ></textarea>
            </div>
          </div>

          <button type="button" className="copy-btn" onClick={handleCopyText}>
            {text.copyBtn}
          </button>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder={text.searchPH} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.storeName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#047857' }}>{item.policyType}</span></td>
                    <td>
                      <div style={{ fontSize: '12.5px', color: '#334155' }}>{item.supportEmail}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{item.supportPhone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-wa" onClick={() => { navigator.clipboard.writeText(item.policyContent); alert(text.alerts.copySuccess); }} title={text.table.copy}>{text.table.copy}</button>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="✏️">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="❌">❌</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={4} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{items.length} {text.table.policiesCount}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
