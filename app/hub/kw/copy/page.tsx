'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CopyItem {
  id: string;
  productName: string;
  contentType: string;
  problemSolved: string;
  offerText: string;
  generatedScript: string;
  createdAt?: string;
}

export default function ExploredCopywritingKW() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const [productName, setProductName] = useState<string>('');
  const [contentSelect, setContentSelect] = useState<string>('');
  const [customContentType, setCustomContentType] = useState<string>('');
  const [problemSolved, setProblemSolved] = useState<string>('');
  const [offerText, setOfferText] = useState<string>('');
  const [generatedScript, setGeneratedScript] = useState<string>('');

  const [items, setItems] = useState<CopyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key'));
    
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    if (savedLang === 'en') {
      setProductName('Enjazya Luxury Perfume');
      setContentSelect('TikTok Video Ad (Enthusiastic)');
      setCustomContentType('TikTok Video Ad (Enthusiastic)');
      setProblemSolved('Looking for a luxury perfume that lasts all day at a great price?');
      setOfferText('30% OFF + Free Shipping for the first 100 orders');
    } else {
      setProductName('عطر إنجازيا الفاخر');
      setContentSelect('إعلان فيديو تيك توك (حماسي)');
      setCustomContentType('إعلان فيديو تيك توك (حماسي)');
      setProblemSolved('تدور عطر كشخة يثبت معاك طول اليوم وبسعر زين؟');
      setOfferText('خصم 30% + توصيل مجاني لأول 100 طلب');
    }

    const saved = localStorage.getItem('seerk_kw_copywriting_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const actualContentType = (contentSelect === 'نوع آخر (كتابة يدوية)' || contentSelect === 'Other (Custom)') ? customContentType : contentSelect;

  useEffect(() => {
    const pName = productName.trim() || (lang === 'ar' ? 'المنتج' : 'Product');
    const prob = problemSolved.trim() || (lang === 'ar' ? 'تدور الأفضل دايماً؟' : 'Looking for the best?');
    const offer = offerText.trim() || (lang === 'ar' ? 'عروض لفترة محدودة' : 'Limited time offers');

    if (lang === 'ar') {
      if (contentSelect.includes('تيك توك')) {
        setGeneratedScript(
          `🎬 **[سكريبت إعلان تيك توك - باللهجة الكويتية]**\n\n` +
          `🎵 *(موسيقى حماسية وترند في الخلفية)*\n\n` +
          `🗣️ **المشهد الأول (الخطاف - أول 3 ثواني):**\n` +
          `"يا هلا بالزين، إذا كنت ${prob}.. اسمعني للآخر لأن هالفيديو راح يغير لك حسبتك!"\n\n` +
          `🗣️ **المشهد الثاني (المشكلة والحل):**\n` +
          `"وايد ندور على الكواليتي العالي بس ننصدم بالأسعار.. بس مع (${pName}) طاح الحطب! شغل عدل ومرتب ومصمم عشان يريحك."\n\n` +
          `🗣️ **المشهد الثالث (العرض والطلب من الإكسبلور):**\n` +
          `"ولعيون اللي يايين من الإكسبلور جبنا لكم خوش عرض: ${offer}!\n` +
          `الكمية ترا حيل محدودة، لحق اطلب قبل لا يطير المخزون، الرابط تحت بالفيديو أو بالبايو! 🚀"`
        );
      } else if (contentSelect.includes('سناب شات')) {
        setGeneratedScript(
          `👻 **[سكريبت سناب شات - تفاعلي وعفوي]**\n\n` +
          `🗣️ **سنابة 1 (جذب الانتباه):**\n` +
          `"مساكم الله بالخير يا أهل الكويت.. توني مستلم (${pName}) اللي قالب الدنيا! تدرون إن ${prob}"\n\n` +
          `🗣️ **سنابة 2 (استعراض المنتج):**\n` +
          `"شوفوا معاي الكواليتي والتفاصيل كيف ما شاء الله. شي كشخة وراقي من الآخر."\n\n` +
          `🗣️ **سنابة 3 (Call to Action):**\n` +
          `"وعشانكم غاليين علينا، وفرنا لكم هالعرض المو طبيعي: ${offer}.\n` +
          `ارفع الشاشة لفوق 👆 وطلبك يوصل لباب بيتك وين ما كنت بالكويت!"`
        );
      } else {
        setGeneratedScript(
          `📢 **[بوست إعلاني جذاب - تسويقي]**\n\n` +
          `🔥 يا هلا بكل متابع ومتابعـة!\n\n` +
          `إذا كنت ${prob}، مالك إلا (${pName}).\n\n` +
          `💎 **ليش تختارنا؟**\n` +
          `- كواليتي عالي يبيض الوجه.\n` +
          `- خدمة عملاء على مدار الساعة.\n` +
          `- ${offer}.\n\n` +
          `🛒 لا تطوفك الفرصة واطلب الحين من المتجر قبل ما تخلص الكمية!`
        );
      }
    } else {
      if (contentSelect.includes('TikTok') || contentSelect.includes('تيك توك')) {
        setGeneratedScript(
          `🎬 **[TikTok Ad Script - Engaging & Catchy (Kuwait Market)]**\n\n` +
          `🎵 *(Upbeat trending background music)*\n\n` +
          `🗣️ **Scene 1 (Hook - First 3 seconds):**\n` +
          `"Hey everyone! If you are ${prob}.. listen till the end because this will change everything for you!"\n\n` +
          `🗣️ **Scene 2 (Problem & Solution):**\n` +
          `"We always look for high quality but find crazy prices.. but with (${pName}), all worries are gone! It's premium, practical, and designed just for you."\n\n` +
          `🗣️ **Scene 3 (Offer & Call to Action):**\n` +
          `"And for those checking us out, here is a special treat: ${offer}!\n` +
          `Very limited quantity, order before stock runs out, link in bio! 🚀"`
        );
      } else if (contentSelect.includes('Snapchat') || contentSelect.includes('سناب')) {
        setGeneratedScript(
          `👻 **[Snapchat Script - Interactive & Casual (Kuwait Market)]**\n\n` +
          `🗣️ **Snap 1 (Attention Grabber):**\n` +
          `"Good evening guys! Today I received (${pName}) which everyone in Kuwait is crazy about! Did you know that ${prob}"\n\n` +
          `🗣️ **Snap 2 (Product Showcase):**\n` +
          `"Look at the quality and details. Truly top-notch and amazing."\n\n` +
          `🗣️ **Snap 3 (Call to Action):**\n` +
          `"Because you are special to us, we offer you: ${offer}.\n` +
          `Swipe up 👆 and get it delivered right to your doorstep anywhere in Kuwait!"`
        );
      } else {
        setGeneratedScript(
          `📢 **[Engaging Promotional Post (Kuwait Market)]**\n\n` +
          `🔥 Hello to all our followers!\n\n` +
          `If you are ${prob}, look no further than (${pName}).\n\n` +
          `💎 **Why choose us?**\n` +
          `- Premium top-tier quality.\n` +
          `- 24/7 customer support.\n` +
          `- ${offer}.\n\n` +
          `🛒 Don't miss out, order now via the store before stock runs out!`
        );
      }
    }
  }, [productName, contentSelect, customContentType, problemSolved, offerText, lang]);

  const saveToLocalStorage = (newItems: CopyItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_kw_copywriting_items', JSON.stringify(newItems));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setContentSelect(val);
    if (val !== 'نوع آخر (كتابة يدوية)' && val !== 'Other (Custom)') {
      setCustomContentType(val);
    } else {
      setCustomContentType('');
    }
  };

  const handleClearForm = () => {
    if (lang === 'ar') {
      setProductName('عطر إنجازيا الفاخر');
      setContentSelect('إعلان فيديو تيك توك (حماسي)');
      setCustomContentType('إعلان فيديو تيك توك (حماسي)');
      setProblemSolved('تدور عطر كشخة يثبت معاك طول اليوم وبسعر زين؟');
      setOfferText('خصم 30% + توصيل مجاني لأول 100 طلب');
    } else {
      setProductName('Enjazya Luxury Perfume');
      setContentSelect('TikTok Video Ad (Enthusiastic)');
      setCustomContentType('TikTok Video Ad (Enthusiastic)');
      setProblemSolved('Looking for a luxury perfume that lasts all day at a great price?');
      setOfferText('30% OFF + Free Shipping for the first 100 orders');
    }
    setEditingId(null);
  };

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مولد نصوص الإكسبلور باللهجة الكويتية ✍️',
      desc: 'اصنع سكريبتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة تفاعل العملاء ومعدل التحويل في الكويت',
      editRecord: 'تعديل السكريبت',
      newRecord: 'توليد سكريبت إعلاني جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodName: 'اسم المنتج',
      prodPH: 'مثال: عطر إنجازيا الفاخر',
      contentType: 'نوع المحتوى الإعلاني',
      optTikTok: 'إعلان فيديو تيك توك (حماسي) 🎬',
      optSnap: 'سكريبت سناب شات (تفاعلي) 👻',
      optPost: 'بوست إعلاني جذاب 📢',
      optCustom: '➕ نوع آخر (كتابة يدوية)',
      customPH: 'اكتب نوع المحتوى هنا...',
      problemLabel: 'المشكلة التي يحلها المنتج (اللهجة المحلية)',
      problemPH: 'تدور عطر كشخة يثبت معاك طول اليوم؟',
      offerLabel: 'العرض التسويقي الخاص بالمتجر',
      offerPH: 'خصم 30% + توصيل مجاني لأول 100 طلب',
      saveBtnNew: '+ حفظ السكريبت في السجل',
      saveBtnEdit: '💾 حفظ التعديلات',
      previewTitle: 'معاينة النص الإعلاني',
      copyBtn: '📋 نسخ السكريبت للحافظة',
      searchPH: '🔍 بحث باسم المنتج أو نوع المحتوى...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      table: {
        noRecords: 'لا توجد سكريبتات مسجلة حالياً.',
        th1: '#',
        th2: 'المنتج والتاريخ',
        th3: 'نوع المحتوى',
        th4: 'العرض التسويقي',
        th5: 'الإجراءات',
        copyAction: '📋 نسخ',
        totalLabel: 'إجمالي السكريبتات المسجلة',
        scriptUnit: 'سكريبت'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 سكريبتات). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErr: 'الرجاء التأكد من تعبئة اسم المنتج ونوع المحتوى.',
        updateSuccess: '✨ تم تحديث السكريبت بنجاح!',
        saveSuccess: '✅ تمت إضافة السكريبت إلى السجل بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذا السكريبت؟',
        copySuccess: '📋 تم نسخ السكريبت بنجاح! جاهز للاستخدام في إعلانك القادم.',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد السكريبتات بنجاح!',
        importErr: '❌ ملف غير صالح.'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Explore Copywriting Generator (Kuwaiti Dialect) ✍️',
      desc: 'Create catchy TikTok scripts and ads in the local dialect to boost customer engagement in Kuwait',
      editRecord: 'Edit Script',
      newRecord: 'Generate New Ad Script',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodName: 'Product Name',
      prodPH: 'e.g. Enjazya Luxury Perfume',
      contentType: 'Ad Content Type',
      optTikTok: 'TikTok Video Ad (Enthusiastic) 🎬',
      optSnap: 'Snapchat Script (Interactive) 👻',
      optPost: 'Engaging Ad Post 📢',
      optCustom: '➕ Other (Custom)',
      customPH: 'Type content type here...',
      problemLabel: 'Problem Solved by Product (Local Dialect)',
      problemPH: 'Looking for a luxury perfume that lasts all day?',
      offerLabel: 'Store Marketing Offer',
      offerPH: '30% OFF + Free Shipping for the first 100 orders',
      saveBtnNew: '+ Save Script to Log',
      saveBtnEdit: '💾 Save Changes',
      previewTitle: 'Ad Text Preview',
      copyBtn: '📋 Copy Script to Clipboard',
      searchPH: '🔍 Search by product name or content type...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      table: {
        noRecords: 'No scripts currently registered.',
        th1: '#',
        th2: 'Product & Date',
        th3: 'Content Type',
        th4: 'Marketing Offer',
        th5: 'Actions',
        copyAction: '📋 Copy',
        totalLabel: 'Total Registered Scripts',
        scriptUnit: 'script(s)'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 scripts). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure product name and content type are entered.',
        updateSuccess: '✨ Script updated successfully!',
        saveSuccess: '✅ Script added to log successfully!',
        delConfirm: 'Are you sure you want to delete this script?',
        copySuccess: '📋 Script copied successfully! Ready for your next ad.',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Scripts imported successfully!',
        importErr: '❌ Invalid file.'
      }
    }
  };

  const text = t[lang];

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalType = (contentSelect === 'نوع آخر (كتابة يدوية)' || contentSelect === 'Other (Custom)') ? customContentType : contentSelect;
    if (!productName.trim() || !finalType.trim()) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-KW' : 'en-KW';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        contentType: finalType,
        problemSolved,
        offerText,
        generatedScript,
        createdAt: item.createdAt || formattedDate
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: CopyItem = {
        id: Date.now().toString(),
        productName,
        contentType: finalType,
        problemSolved,
        offerText,
        generatedScript,
        createdAt: formattedDate
      };
      saveToLocalStorage([...items, newItem]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: CopyItem) => {
    setProductName(item.productName);
    const standardTypes = ['إعلان فيديو تيك توك (حماسي)', 'سكريبت سناب شات (تفاعلي)', 'بوست إعلاني جذاب', 'TikTok Video Ad (Enthusiastic)', 'Snapchat Script (Interactive)', 'Engaging Ad Post'];
    if (standardTypes.includes(item.contentType)) {
      setContentSelect(item.contentType);
      setCustomContentType(item.contentType);
    } else {
      setContentSelect(lang === 'ar' ? 'نوع آخر (كتابة يدوية)' : 'Other (Custom)');
      setCustomContentType(item.contentType);
    }
    setProblemSolved(item.problemSolved);
    setOfferText(item.offerText);
    setGeneratedScript(item.generatedScript);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
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
          </style>
        </head>
        <body>
          <h2>Copywriting Generator Report (KW)</h2>
          <table>
            <thead>
              <tr>
                <th>${text.table.th1}</th>
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>${text.table.th4}</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.productName}</td>
          <td>${row.contentType}</td>
          <td>${row.offerText}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "enjazya_kw_copywriting.xls");
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
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.contentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tool-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f1f5f9; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 10px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f8fafc; color: #0f172a; border-color: #0284c7; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; gap: 0; } }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        
        .action-btn { background: #0284c7; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #0369a1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }
        
        .copy-btn { background: #0f172a; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 10px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #1e293b; transform: translateY(-2px); }

        .table-section { background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: inherit; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; transition: all 0.2s; }
        .search-input:focus { border-color: #0284c7; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .t-btn:hover { background: #f1f5f9; color: #0284c7; border-color: #0284c7; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit; transition: all 0.2s; }
        .btn-wa { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
        .btn-wa:hover { background: #e0f2fe; }
        .btn-edit { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
        .btn-edit:hover { background: #e2e8f0; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-delete:hover { background: #fca5a5; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/kw" className="back-btn">
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
            {isClient && !isActivated && <span className="trial-badge">{text.trial}: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div className="form-row">
              <div className="input-group">
                <label>{text.prodName}</label>
                <div className="input-wrapper">
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodPH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.contentType}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={contentSelect} onChange={handleSelectChange}>
                    <option value={lang === 'ar' ? 'إعلان فيديو تيك توك (حماسي)' : 'TikTok Video Ad (Enthusiastic)'}>{text.optTikTok}</option>
                    <option value={lang === 'ar' ? 'سكريبت سناب شات (تفاعلي)' : 'Snapchat Script (Interactive)'}>{text.optSnap}</option>
                    <option value={lang === 'ar' ? 'بوست إعلاني جذاب' : 'Engaging Ad Post'}>{text.optPost}</option>
                    <option value={lang === 'ar' ? 'نوع آخر (كتابة يدوية)' : 'Other (Custom)'}>{text.optCustom}</option>
                  </select>
                </div>

                {(contentSelect === 'نوع آخر (كتابة يدوية)' || contentSelect === 'Other (Custom)') && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customContentType} 
                      onChange={(e) => setCustomContentType(e.target.value)} 
                      placeholder={text.customPH} 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>{text.problemLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={problemSolved} onChange={(e) => setProblemSolved(e.target.value)} placeholder={text.problemPH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.offerLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={offerText} onChange={(e) => setOfferText(e.target.value)} placeholder={text.offerPH} required />
              </div>
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.previewTitle} ({actualContentType})</h2>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <div className="input-wrapper">
              <textarea 
                rows={11} 
                value={generatedScript} 
                onChange={(e) => setGeneratedScript(e.target.value)} 
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', background: '#f8fafc', color: '#0f172a', resize: 'vertical', lineHeight: '1.6', textAlign: lang === 'ar' ? 'right' : 'left', transition: 'all 0.2s' }}
              ></textarea>
            </div>
          </div>

          <button type="button" className="copy-btn" onClick={() => handleCopyText(generatedScript)}>
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
                      <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.productName}</div>
                      {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                    </td>
                    <td><span style={{ fontWeight: 800, color: '#0284c7' }}>{item.contentType}</span></td>
                    <td><span style={{ fontWeight: 700, color: '#047857' }}>{item.offerText}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-wa" onClick={() => handleCopyText(item.generatedScript)} title="Copy">{text.table.copyAction}</button>
                        <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                        <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="Delete">❌</button>
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
                  <td>{items.length} {text.table.scriptUnit}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
