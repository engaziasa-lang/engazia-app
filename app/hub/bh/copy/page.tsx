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
  timestamp?: number;
}

export default function ExploredCopywritingBH() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  
  const [productName, setProductName] = useState<string>('');
  const [contentSelect, setContentSelect] = useState<string>('');
  const [customContentType, setCustomContentType] = useState<string>('');
  const [problemSolved, setProblemSolved] = useState<string>('');
  const [offerText, setOfferText] = useState<string>('');
  const [generatedScript, setGeneratedScript] = useState<string>('');

  const [items, setItems] = useState<CopyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_bh'));

    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    if (savedLang === 'en') {
      setProductName('Luxury Enjazya Perfume');
      setContentSelect('TikTok Video Ad (Enthusiastic) 🎬');
      setCustomContentType('TikTok Video Ad (Enthusiastic) 🎬');
      setProblemSolved('Looking for a luxury perfume that lasts all day at a great price?');
      setOfferText('30% OFF + Free Shipping for the first 100 orders');
    } else {
      setProductName('عطر إنجازيا الفاخر');
      setContentSelect('إعلان فيديو تيك توك (حماسي) 🎬');
      setCustomContentType('إعلان فيديو تيك توك (حماسي) 🎬');
      setProblemSolved('تدور على عطر فخم يثبت معاك طول اليوم وبسعر مناسب؟');
      setOfferText('خصم 30% + توصيل مجاني لأول 100 طلب');
    }

    const saved = localStorage.getItem('seerk_bh_copywriting_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { }
    }
  }, []);

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مولد نصوص الإكسبلور باللهجة البحرينية ✍️',
      desc: 'اصنع سكريبتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة تفاعل العملاء ومعدل التحويل في البحرين',
      editTitle: 'تعديل السكريبت',
      newTitle: 'توليد سكريبت إعلاني جديد',
      clear: '🧹 مسح الحقول',
      trial: 'تجريبي',
      prodName: 'اسم المنتج',
      prodNamePH: 'مثال: عطر إنجازيا الفاخر',
      contentType: 'نوع المحتوى الإعلاني',
      typeTiktok: 'إعلان فيديو تيك توك (حماسي) 🎬',
      typeSnap: 'سكريبت سناب شات (تفاعلي) 👻',
      typePost: 'بوست إعلاني جذاب 📢',
      typeOther: '➕ نوع آخر (كتابة يدوية)',
      otherPH: 'اكتب نوع المحتوى هنا...',
      problem: 'المشكلة التي يحلها المنتج (باللهجة المحلية)',
      problemPH: 'تدور على عطر غاوي ويثبت معاك طول اليوم؟',
      offer: 'العرض التسويقي الخاص بالمتجر',
      offerPH: 'خصم 30% + توصيل مجاني لأول 100 طلب',
      saveBtnEdit: '💾 حفظ التعديلات',
      saveBtnNew: '+ حفظ السكريبت في السجل',
      previewTitle: 'معاينة النص الإعلاني',
      copyBtn: '📋 نسخ السكريبت للحافظة',
      searchPH: '🔍 بحث باسم المنتج أو نوع المحتوى...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      filters: {
        all: 'الكل',
        day: 'آخر يوم',
        week: 'آخر أسبوع',
        month: 'آخر شهر',
        sixMonths: 'آخر 6 أشهر',
        year: 'آخر سنة'
      },
      table: {
        noData: 'لا توجد سكريبتات مطابقة للبحث حالياً.',
        th1: '#',
        th2: 'المنتج والتاريخ',
        th3: 'نوع المحتوى',
        th4: 'العرض التسويقي',
        th5: 'الإجراءات',
        copy: '📋 نسخ',
        total: 'إجمالي السكريبتات المعروضة',
        scriptCount: 'سكريبت'
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
      title: 'Explore Copywriting Generator (BH) ✍️',
      desc: 'Create catchy TikTok scripts and ads to boost engagement and conversions in Bahrain',
      editTitle: 'Edit Script',
      newTitle: 'Generate New Ad Script',
      clear: '🧹 Clear Fields',
      trial: 'Trial',
      prodName: 'Product Name',
      prodNamePH: 'e.g. Luxury Enjazya Perfume',
      contentType: 'Ad Content Type',
      typeTiktok: 'TikTok Video Ad (Enthusiastic) 🎬',
      typeSnap: 'Snapchat Script (Interactive) 👻',
      typePost: 'Catchy Ad Post 📢',
      typeOther: '➕ Other (Manual Entry)',
      otherPH: 'Type content type here...',
      problem: 'Problem Solved by the Product',
      problemPH: 'Looking for a luxury perfume that lasts all day?',
      offer: 'Store Marketing Offer',
      offerPH: '30% OFF + Free shipping for first 100 orders',
      saveBtnEdit: '💾 Save Changes',
      saveBtnNew: '+ Save Script to Log',
      previewTitle: 'Ad Copy Preview',
      copyBtn: '📋 Copy Script to Clipboard',
      searchPH: '🔍 Search by product name or content type...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      filters: {
        all: 'All Time',
        day: 'Last Day',
        week: 'Last Week',
        month: 'Last Month',
        sixMonths: 'Last 6 Months',
        year: 'Last Year'
      },
      table: {
        noData: 'No scripts found matching your search.',
        th1: '#',
        th2: 'Product & Date',
        th3: 'Content Type',
        th4: 'Marketing Offer',
        th5: 'Actions',
        copy: '📋 Copy',
        total: 'Total Displayed Scripts',
        scriptCount: 'script(s)'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 scripts). Please upgrade to unlock unlimited access!',
        fillErr: 'Please ensure product name and content type are filled.',
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

  const actualContentType = contentSelect === 'نوع آخر (كتابة يدوية)' || contentSelect === '➕ Other (Manual Entry)' ? customContentType : contentSelect;

  useEffect(() => {
    const pName = productName.trim() || (lang === 'ar' ? 'المنتج' : 'the product');
    const prob = problemSolved.trim() || (lang === 'ar' ? 'تدور على الأفضل دايماً؟' : 'always looking for the best?');
    const offer = offerText.trim() || (lang === 'ar' ? 'عروض لفترة محدودة' : 'limited time offers');

    if (lang === 'ar') {
      if (contentSelect.includes('تيك توك')) {
        setGeneratedScript(
          `🎬 **[سكريبت إعلان تيك توك - باللهجة البحرينية]**\n\n` +
          `🎵 *(موسيقى حماسية وترند في الخلفية)*\n\n` +
          `🗣️ **المشهد الأول (الخطاف - أول 3 ثواني):**\n` +
          `"يا هلا والله! إذا ${prob}.. ركزوا معاي للآخر لان هالشي بيفك لكم واجد أزمات!"\n\n` +
          `🗣️ **المشهد الثاني (المشكلة والحل):**\n` +
          `"واجد ندور على الجودة والشي السنع بس نلقى الأسعار نار.. لكن مع (${pName}) طاح الهم! المنتج فخم، عملي، ومصمم خصيصاً عشان يريحكم."\n\n` +
          `🗣️ **المشهد الثالث (العرض والطلب من الإكسبلور):**\n` +
          `"واللي جايين من الإكسبلور لهم بشارة طيبة: ${offer}!\n` +
          `الكمية محدودة جداً، الحق اطلب قبل لا يخلص المخزون، الرابط تحت بالفيديو أو بالبايو! 🚀"`
        );
      } else if (contentSelect.includes('سناب شات')) {
        setGeneratedScript(
          `👻 **[سكريبت سناب شات - تفاعلي وعفوي]**\n\n` +
          `🗣️ **سنابة 1 (جذب الانتباه):**\n` +
          `"شخباركم يا أهل البحرين.. وصلني اليوم (${pName}) اللي مكسر الدنيا! تدرون إن ${prob}"\n\n` +
          `🗣️ **سنابة 2 (استعراض المنتج):**\n` +
          `"شوفوا معاي الجودة والتفاصيل كيف ما شاء الله. شي فاخر من الآخر ويهدي البال."\n\n` +
          `🗣 **سنابة 3 (Call to Action):**\n` +
          `"وعشانكم غالين علينا، وفرنا لكم: ${offer}.\n` +
          `ارفع الشاشة لفوق 👆 وطلبك يوصلك لين باب بيتك وين ما كنت في مملكة البحرين!"`
        );
      } else {
        setGeneratedScript(
          `📢 **[بوست إعلاني جذاب - تسويقي]**\n\n` +
          `🔥 يا هلا فيكم يا متابعيني الأعزاء!\n\n` +
          `إذا كنت ${prob}، مالك إلا (${pName}).\n\n` +
          `💎 **ليش تختارنا؟**\n` +
          `- جودة عالية تبيض الوجه.\n` +
          `- خدمة عملاء على مدار الساعة.\n` +
          `- ${offer}.\n\n` +
          `🛒 لا تفوت الفرصة وأطلب الحين عبر المتجر قبل نفاد الكمية!`
        );
      }
    } else {
      if (contentSelect.includes('TikTok') || contentSelect.includes('تيك توك')) {
        setGeneratedScript(
          `🎬 **[TikTok Ad Script - High Conversion]**\n\n` +
          `🎵 *(Trending upbeat music in background)*\n\n` +
          `🗣️ **Scene 1 (Hook - First 3 secs):**\n` +
          `"Hey everyone! If ${prob}.. pay close attention because this will change everything!"\n\n` +
          `🗣️ **Scene 2 (Problem & Solution):**\n` +
          `"We're always looking for high quality but prices can be insane.. but with (${pName}), the search is over! It's luxurious, practical, and designed exactly for what you need."\n\n` +
          `🗣️ **Scene 3 (Offer & CTA):**\n` +
          `"And for everyone coming from the FYP, great news: ${offer}!\n` +
          `Stock is super limited, grab yours before we sell out. Link below or in the bio! 🚀"`
        );
      } else if (contentSelect.includes('Snapchat') || contentSelect.includes('سناب شات')) {
        setGeneratedScript(
          `👻 **[Snapchat Script - Interactive & Casual]**\n\n` +
          `🗣️ **Snap 1 (Attention):**\n` +
          `"Good evening guys.. I just got (${pName}) and it's literally breaking the internet! You know how ${prob}?"\n\n` +
          `🗣️ **Snap 2 (Product Showcase):**\n` +
          `"Just look at this quality and the details. Pure luxury that gives you absolute peace of mind."\n\n` +
          `🗣 **Snap 3 (Call to Action):**\n` +
          `"And because you guys are special, we got you: ${offer}.\n` +
          `Swipe up 👆 and get it delivered straight to your door anywhere in Bahrain!"`
        );
      } else {
        setGeneratedScript(
          `📢 **[Catchy Marketing Post]**\n\n` +
          `🔥 Hello to all our amazing followers!\n\n` +
          `If you are ${prob}, look no further than (${pName}).\n\n` +
          `💎 **Why choose us?**\n` +
          `- Premium quality you can trust.\n` +
          `- 24/7 Customer support.\n` +
          `- ${offer}.\n\n` +
          `🛒 Don't miss out, order now from our store before stock runs out!`
        );
      }
    }
  }, [productName, contentSelect, customContentType, problemSolved, offerText, lang]);

  const saveToLocalStorage = (newItems: CopyItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_bh_copywriting_items', JSON.stringify(newItems));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setContentSelect(val);
    if (val !== 'نوع آخر (كتابة يدوية)' && val !== '➕ Other (Manual Entry)') {
      setCustomContentType(val);
    } else {
      setCustomContentType('');
    }
  };

  const handleClearForm = () => {
    if (lang === 'en') {
      setProductName('Luxury Enjazya Perfume');
      setContentSelect('TikTok Video Ad (Enthusiastic) 🎬');
      setCustomContentType('TikTok Video Ad (Enthusiastic) 🎬');
      setProblemSolved('Looking for a luxury perfume that lasts all day at a great price?');
      setOfferText('30% OFF + Free Shipping for the first 100 orders');
    } else {
      setProductName('عطر إنجازيا الفاخر');
      setContentSelect('إعلان فيديو تيك توك (حماسي) 🎬');
      setCustomContentType('إعلان فيديو تيك توك (حماسي) 🎬');
      setProblemSolved('تدور على عطر فخم يثبت معاك طول اليوم وبسعر مناسب؟');
      setOfferText('خصم 30% + توصيل مجاني لأول 100 طلب');
    }
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert(text.alerts.limit);
      return;
    }
    const finalType = contentSelect === 'نوع آخر (كتابة يدوية)' || contentSelect === '➕ Other (Manual Entry)' ? customContentType : contentSelect;
    if (!productName.trim() || !finalType.trim()) {
      alert(text.alerts.fillErr);
      return;
    }

    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const localeStr = lang === 'ar' ? 'ar-BH' : 'en-BH';
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptions)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        productName,
        contentType: finalType,
        problemSolved,
        offerText,
        generatedScript,
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
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
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]);
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: CopyItem) => {
    setProductName(item.productName);
    
    const isTiktok = item.contentType.includes('تيك توك') || item.contentType.includes('TikTok');
    const isSnap = item.contentType.includes('سناب شات') || item.contentType.includes('Snapchat');
    const isPost = item.contentType.includes('بوست') || item.contentType.includes('Post');
    
    let matchedSelect = '';
    if (isTiktok) matchedSelect = lang === 'ar' ? 'إعلان فيديو تيك توك (حماسي) 🎬' : 'TikTok Video Ad (Enthusiastic) 🎬';
    else if (isSnap) matchedSelect = lang === 'ar' ? 'سكريبت سناب شات (تفاعلي) 👻' : 'Snapchat Script (Interactive) 👻';
    else if (isPost) matchedSelect = lang === 'ar' ? 'بوست إعلاني جذاب 📢' : 'Catchy Ad Post 📢';
    else matchedSelect = lang === 'ar' ? 'نوع آخر (كتابة يدوية)' : '➕ Other (Manual Entry)';

    setContentSelect(matchedSelect);
    setCustomContentType(item.contentType);
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

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedScript);
    alert(text.alerts.copySuccess);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.contentType.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    
    if (dateFilter !== 'all') {
      const itemTime = item.timestamp || 0;
      const now = Date.now();
      const diff = now - itemTime;
      const dayMs = 24 * 60 * 60 * 1000;
      
      if (dateFilter === 'day') matchesDate = diff <= dayMs;
      else if (dateFilter === 'week') matchesDate = diff <= 7 * dayMs;
      else if (dateFilter === 'month') matchesDate = diff <= 30 * dayMs;
      else if (dateFilter === '6months') matchesDate = diff <= 180 * dayMs;
      else if (dateFilter === 'year') matchesDate = diff <= 365 * dayMs;
    }
    
    return matchesSearch && matchesDate;
  });

  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
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
                <th>${text.table.th2}</th>
                <th>${text.table.th3}</th>
                <th>Date / Time</th>
                <th>${text.table.th4}</th>
                <th>Script Text</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.productName}</td>
          <td>${row.contentType}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.offerText}</td>
          <td>${row.generatedScript.replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">${text.table.total}</td>
                <td>${filteredItems.length} ${text.table.scriptCount}</td>
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
    link.setAttribute("download", `enjazya_bh_copywriting_${dateFilter}.xls`);
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
            const newItems = imported.filter(imp => !items.find(i => i.id === imp.id));
            saveToLocalStorage([...newItems, ...items]);
            alert(text.alerts.importSuccess);
          }
        } catch (err) {
          alert(text.alerts.importErr);
        }
      };
    }
  };

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
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #CE1126; background: #ffffff; }
        
        .action-btn { background: #CE1126; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #A60E1E; }
        
        .copy-btn { background: #CE1126; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #A60E1E; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #CE1126; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #CE1126; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #CE1126; color: #CE1126; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 900px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit;}
        .btn-wa { background: #FFEBEE; color: #CE1126; border: 1px solid #F9C9CE; }
        .btn-wa:hover { background: #CE1126; color: #ffffff; }
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/bh" className="back-btn">
          {text.back}
        </Link>
      </div>

      <div className="grid-layout">
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span>{editingId ? text.editTitle : text.newTitle}</span>
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
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={text.prodNamePH} required />
                </div>
              </div>
              <div className="input-group">
                <label>{text.contentType}</label>
                <div className="input-wrapper" style={{ marginBottom: '8px' }}>
                  <select value={contentSelect} onChange={handleSelectChange}>
                    <option value={lang === 'ar' ? 'إعلان فيديو تيك توك (حماسي) 🎬' : 'TikTok Video Ad (Enthusiastic) 🎬'}>{text.typeTiktok}</option>
                    <option value={lang === 'ar' ? 'سكريبت سناب شات (تفاعلي) 👻' : 'Snapchat Script (Interactive) 👻'}>{text.typeSnap}</option>
                    <option value={lang === 'ar' ? 'بوست إعلاني جذاب 📢' : 'Catchy Ad Post 📢'}>{text.typePost}</option>
                    <option value={lang === 'ar' ? 'نوع آخر (كتابة يدوية)' : '➕ Other (Manual Entry)'}>{text.typeOther}</option>
                  </select>
                </div>

                {(contentSelect === 'نوع آخر (كتابة يدوية)' || contentSelect === '➕ Other (Manual Entry)') && (
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      value={customContentType} 
                      onChange={(e) => setCustomContentType(e.target.value)} 
                      placeholder={text.otherPH} 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
              <label>{text.problem}</label>
              <div className="input-wrapper">
                <input type="text" value={problemSolved} onChange={(e) => setProblemSolved(e.target.value)} placeholder={text.problemPH} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.offer}</label>
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

          <select 
            className="filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">{text.filters.all}</option>
            <option value="day">{text.filters.day}</option>
            <option value="week">{text.filters.week}</option>
            <option value="month">{text.filters.month}</option>
            <option value="sixMonths">{text.filters.sixMonths}</option>
            <option value="year">{text.filters.year}</option>
          </select>

          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel}>
              {lang === 'ar' ? 'تصدير 📥' : 'Export 📥'}
            </button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>
              {lang === 'ar' ? 'استيراد 📂' : 'Import 📂'}
            </button>
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
                    {text.table.noData}
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
                    <td><span style={{ fontWeight: 800, color: '#CE1126' }}>{item.contentType}</span></td>
                    <td><span style={{ fontWeight: 700, color: '#A60E1E' }}>{item.offerText}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button className="tb-action-btn btn-wa" onClick={() => { navigator.clipboard.writeText(item.generatedScript); alert(text.alerts.copySuccess); }} title={text.table.copy}>{text.table.copy}</button>
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
                  <td colSpan={4} style={{ textAlign: 'center' }}>{text.table.total}</td>
                  <td>{filteredItems.length} {text.table.scriptCount}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
