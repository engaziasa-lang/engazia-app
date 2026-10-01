'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  phone: string;
  orderNumber: string;
  category: string;
  status: string;
  amount: string;
  note: string;
  date: string;
}

interface TagConfig {
  name: string;
  bg: string;
  color: string;
  isSale: boolean;
}

interface Template {
  id: number;
  title: string;
  text: string;
}

export default function EngaziaWhatsAppCRM() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'messaging' | 'tags'>('dashboard');

  // إعدادات هوية المتجر
  const [storeName, setStoreName] = useState('متجري الإلكتروني');
  const [storeLogo, setStoreLogo] = useState('🛍');

  // إدارة العملاء CRM
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // إضافة عميل جديد
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrderNumber, setNewOrderNumber] = useState('');
  const [newCategory, setNewCategory] = useState('عميل جديد');
  const [newStatus, setNewStatus] = useState('نشط'); // الحالة الافتراضية الجديدة
  const [newAmount, setNewAmount] = useState('');

  // قائمة الحالات المقترحة
  const statusOptions = ['نشط', 'مميز VIP', 'متوقف', 'محظور'];

  // الإعدادات العامة (كود الخصم الافتراضي)
  const [defaultDiscountCode, setDefaultDiscountCode] = useState('ENGAZIA10');

  // المراسلات (الدمج الذكي)
  const [messagingMode, setMessagingMode] = useState<'single' | 'broadcast'>('single');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [includeDiscount, setIncludeDiscount] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState('');
  
  // الطابور (Broadcast)
  const [broadcastCat, setBroadcastCat] = useState('سلة متروكة');
  const [broadcastIndex, setBroadcastIndex] = useState(0);

  // القوالب والردود
  const [activeTemplateId, setActiveTemplateId] = useState<number>(1);
  const [templates, setTemplates] = useState<Template[]>([
    { id: 1, title: '✅ تأكيد الطلب', text: 'مرحباً بك يا [الاسم] 👋\nتم تأكيد طلبك رقم ([الطلب]) بنجاح، ونعمل حالياً على تجهيزه وشحنه لك. شكراً لثقتك بمتجرنا 💙' },
    { id: 2, title: '🛒 سلة متروكة', text: 'أهلاً بك يا [الاسم] 😊\nلاحظنا عدم إتمام طلبك رقم ([الطلب]). هل تواجه مشكلة في الدفع؟ نحن هنا لمساعدتك.' },
    { id: 3, title: '📦 تتبع الشحنة', text: 'مرحباً [الاسم] 📦\nتم تسليم طلبك رقم ([الطلب]) لشركة الشحن، وسيصلك قريباً.' },
    { id: 4, title: '💳 رابط الدفع', text: 'مرحباً بك يا [الاسم] 💳\nلتسهيل إتمام طلبك، يسعدنا تزويدك برابط الدفع السريع: [إضافي]' }
  ]);
  const [newTplTitle, setNewTplTitle] = useState('');
  const [newTplText, setNewTplText] = useState('');

  // التصنيفات
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

  // إشعار Toast عصري
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // المراجع
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storeLogoFileRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Autocomplete
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const savedContacts = localStorage.getItem('engazia_whatsapp_pro_crm_v6');
    if (savedContacts) {
      try { setContacts(JSON.parse(savedContacts)); } catch (e) { console.error(e); }
    }
    
    const savedCats = localStorage.getItem('engazia_whatsapp_categories_v2');
    if (savedCats) {
      try { setCategories(JSON.parse(savedCats)); } catch (e) { console.error(e); }
    }

    const savedTpls = localStorage.getItem('engazia_templates_v2');
    if (savedTpls) {
      try { setTemplates(JSON.parse(savedTpls)); } catch (e) { console.error(e); }
    }

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

  const saveContacts = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_whatsapp_pro_crm_v6', JSON.stringify(updated));
  };

  const saveCategories = (updated: TagConfig[]) => {
    setCategories(updated);
    localStorage.setItem('engazia_whatsapp_categories_v2', JSON.stringify(updated));
  };

  const saveTemplates = (updated: Template[]) => {
    setTemplates(updated);
    localStorage.setItem('engazia_templates_v2', JSON.stringify(updated));
  };

  const saveDefaultDiscount = (code: string) => {
    setDefaultDiscountCode(code);
    localStorage.setItem('engazia_default_discount', code);
    showToast('تم تحديث كود الخصم الافتراضي بنجاح');
  };

  const handleSaveStoreName = (name: string) => {
    setStoreName(name);
    localStorage.setItem('engazia_store_name', name);
    showToast('✨ تم تحديث اسم المتجر بنجاح');
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
        showToast('🖼️ تم رفع شعار المتجر بنجاح!');
      }
    };
    reader.readAsDataURL(file);
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

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return showToast('⚠️ أدخل الاسم ورقم الجوال.');
    
    const now = new Date();
    const enDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newCust: Customer = {
      id: Date.now().toString(),
      name: newName,
      phone: toEnglishDigits(formatPhone(newPhone)),
      orderNumber: toEnglishDigits(newOrderNumber || '#---'),
      category: newCategory,
      status: newStatus,
      amount: toEnglishDigits(newAmount || '0'),
      note: '',
      date: enDate
    };
    saveContacts([newCust, ...contacts]);
    setNewName(''); setNewPhone(''); setNewOrderNumber(''); setNewAmount('');
    showToast('✨ تم إضافة العميل بنجاح!');
  };

  const updateCustomerField = (id: string, field: string, value: string) => {
    const cleanVal = (field === 'phone' || field === 'orderNumber' || field === 'amount') ? toEnglishDigits(value) : value;
    const updated = contacts.map(c => {
      if (c.id === id) {
        return { ...c, [field]: cleanVal };
      }
      return c;
    });
    saveContacts(updated);
  };

  const deleteContact = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      saveContacts(contacts.filter(c => c.id !== id));
      showToast('🗑️ تم حذف العميل');
    }
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return showToast('⚠️ أدخل اسم التصنيف.');
    if (categories.some(c => c.name === newCatName)) return showToast('⚠️ هذا التصنيف موجود مسبقاً.');
    const updated = [...categories, { name: newCatName, bg: newCatBg, color: newCatColor, isSale: newCatIsSale }];
    saveCategories(updated);
    setNewCatName('');
    setNewCatIsSale(true);
    showToast('🏷️ تم إضافة التصنيف بنجاح');
  };

  const deleteCategory = (catName: string) => {
    if (categories.length <= 1) return showToast('⚠️ يجب أن يبقى تصنيف واحد على الأقل.');
    if (window.confirm(`حذف التصنيف "${catName}"؟`)) {
      const updated = categories.filter(c => c.name !== catName);
      saveCategories(updated);
      showToast('🗑️ تم حذف التصنيف');
    }
  };

  const routeToMessaging = (c: Customer) => {
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

  const openWhatsApp = (phone: string, text: string) => {
    const clean = formatPhone(phone);
    const url = clean ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // تصدير إكسل من اليمين لليسار تماماً (RTL Sheet View)
  const exportToExcel = () => {
    if (contacts.length === 0) return showToast('⚠️ لا توجد بيانات للتصدير.');

    let htmlTable = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Tajawal', Tahoma, sans-serif; direction: rtl; }
          table { border-collapse: collapse; width: 100%; direction: rtl; }
          th { background-color: #4f46e5; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px; text-align: right; }
          td { border: 1px solid #cbd5e1; padding: 8px; text-align: right; mso-number-format:"\\@"; }
          .num-cell { text-align: left; direction: ltr; mso-number-format:"0"; }
        </style>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>العملاء</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                  <x:DoNotDisplayGridlines/>
                  <x:DisplayRightToLeft/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
      </head>
      <body>
        <table dir="rtl">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الجوال</th>
              <th>رقم الطلب</th>
              <th>التصنيف</th>
              <th>الحالة</th>
              <th>إجمالي المشتريات (رس)</th>
              <th>الملاحظات</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
    `;

    contacts.forEach(c => {
      htmlTable += `
        <tr>
          <td>${c.name}</td>
          <td class="num-cell">${c.phone}</td>
          <td class="num-cell">${c.orderNumber}</td>
          <td>${c.category}</td>
          <td>${c.status || 'نشط'}</td>
          <td class="num-cell">${c.amount}</td>
          <td>${c.note || ''}</td>
          <td class="num-cell">${c.date}</td>
        </tr>
      `;
    });

    htmlTable += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlTable], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `engazia_crm_${storeName.replace(/\s+/g, '_')}.xls`;
    link.click();
    showToast('📥 تم تصدير ملف إكسل من اليمين لليسار بنجاح تام');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const newImportedContacts: Customer[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
          if (row.length >= 2) {
            const cleanVal = (val: string) => val ? toEnglishDigits(val.replace(/^"|"$/g, '').trim()) : '';
            const name = cleanVal(row[0]);
            const phone = cleanVal(row[1]);
            const orderNumber = cleanVal(row[2]) || '#---';
            const category = cleanVal(row[3]) || 'عميل جديد';
            const status = cleanVal(row[4]) || 'نشط';
            const amount = cleanVal(row[5]) || '0';
            const note = cleanVal(row[6]) || '';
            
            const now = new Date();
            const defaultEnDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const date = cleanVal(row[7]) || defaultEnDate;

            if (name && phone) {
              newImportedContacts.push({
                id: Date.now().toString() + Math.random(),
                name,
                phone,
                orderNumber,
                category,
                status,
                amount,
                note,
                date
              });
            }
          }
        }

        if (newImportedContacts.length > 0) {
          saveContacts([...newImportedContacts, ...contacts]);
          showToast(`✨ تم استيراد ${newImportedContacts.length} عميل بنجاح!`);
        } else {
          showToast('⚠️ لم يتم العثور على بيانات صالحة للاستيراد.');
        }
      } catch (err) {
        showToast('❌ حدث خطأ أثناء قراءة ملف الـ CSV.');
      }
      e.target.value = '';
    };
    reader.readAsText(file, 'utf-8');
  };

  const saleCategoriesNames = categories.filter(cat => cat.isSale).map(cat => cat.name);
  const totalValidSales = contacts
    .filter(c => saleCategoriesNames.includes(c.category))
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  
  const filteredContacts = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm) || c.orderNumber.includes(searchTerm);
    const matchCat = filterCategory === 'all' || c.category === filterCategory;
    return matchSearch && matchCat;
  });

  const matchingCustomers = customerName.trim() === '' ? [] : contacts.filter(c => c.name.toLowerCase().includes(customerName.toLowerCase()));
  const broadcastList = contacts.filter(c => c.category === broadcastCat);

  return (
    <div className="app-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .app-container { background: #f1f5f9; color: #0f172a; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 15px; position: relative; }
        .wrapper { max-width: 1100px; margin: 0 auto; background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        
        .toast-banner { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #1e293b; color: #fff; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 800; z-index: 9999; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: fadeInOut 0.3s ease; }
        @keyframes fadeInOut { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }

        .header-brand { text-align: center; margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .store-logo-badge { width: 68px; height: 68px; border-radius: 18px; background: #eef2ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 900; box-shadow: 0 4px 15px rgba(79,70,229,0.15); border: 2px solid #c7d2fe; overflow: hidden; }
        .store-logo-badge img { width: 100%; height: 100%; object-fit: cover; }
        .brand-title { font-size: 28px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px; margin: 0; }
        .brand-title span { color: #4f46e5; }
        .brand-desc { color: #64748b; font-size: 14px; font-weight: 500; margin: 0; }

        .nav-tabs { display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; overflow-x: auto; justify-content: center; }
        .tab-btn { background: transparent; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 14px; color: #64748b; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
        .tab-btn:hover { background: #f8fafc; color: #334155; }
        .tab-btn.active { background: #4f46e5; color: #fff; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }

        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.02); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-num { font-size: 24px; font-weight: 900; color: #1e293b; margin-top: 8px; direction: ltr; unicode-bidi: embed; }
        .stat-title { font-size: 13px; color: #64748b; font-weight: 700; }

        .section-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: 900; color: #1e293b; margin-bottom: 5px; display: flex; align-items: center; gap: 8px; }
        .section-desc { font-size: 13px; color: #64748b; margin-bottom: 20px; font-weight: 500; }

        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .form-group { margin-bottom: 15px; position: relative; }
        .form-group label { display: block; font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 8px; }
        .form-control { width: 100%; padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; outline: none; font-family: 'Tajawal', sans-serif; background: #fff; color: #1e293b; font-weight: 700; transition: border-color 0.2s; box-sizing: border-box; }
        .form-control:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
        .input-ltr { direction: ltr; text-align: right; }

        .btn-main { background: #4f46e5; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-main:hover { background: #4338ca; transform: translateY(-1px); }
        .btn-wa { background: #10b981; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; flex: 1; display: inline-flex; justify-content: center; align-items: center; }
        .btn-wa:hover { background: #059669; }
        
        .btn-sm { padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; border: none; transition: 0.2s; }
        .btn-success { background: #dcfce7; color: #15803d; }
        .btn-success:hover { background: #bbf7d0; }
        .btn-edit { background: #e0e7ff; color: #4f46e5; }
        .btn-danger { background: #fee2e2; color: #dc2626; }

        .table-container { overflow-x: auto; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; }
        .contacts-table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: right; }
        .contacts-table th, .contacts-table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; }
        .contacts-table th { background: #f8fafc; color: #475569; font-weight: 800; white-space: nowrap; }
        .contacts-table tr:hover { background: #fcfcfc; }

        .suggestions-box { position: absolute; top: 100%; right: 0; left: 0; background: #fff; border: 1px solid #cbd5e1; border-radius: 10px; max-height: 180px; overflow-y: auto; z-index: 10; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-top: 5px; }
        .suggestion-item { padding: 10px 15px; font-size: 13px; font-weight: 700; cursor: pointer; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .suggestion-item:hover { background: #f8fafc; color: #4f46e5; }

        .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-align: center; min-width: 90px; }
        
        .radio-group { display: flex; gap: 10px; margin-bottom: 20px; background: #e2e8f0; padding: 4px; border-radius: 12px; width: fit-content; }
        .radio-btn { padding: 8px 20px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; color: #64748b; border: none; background: transparent; transition: 0.3s; }
        .radio-btn.active { background: #fff; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        .filter-chips { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 15px; flex-wrap: wrap; }
        .chip-btn { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 800; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; color: #475569; transition: all 0.2s; white-space: nowrap; }
        .chip-btn:hover { border-color: #4f46e5; color: #4f46e5; }
        .chip-btn.active { background: #4f46e5; color: #fff; border-color: #4f46e5; box-shadow: 0 2px 8px rgba(79,70,229,0.2); }

        /* إعدادات متقدمة */
        .settings-creation-box { display: flex; gap: 15px; align-items: flex-end; background: #fff; padding: 20px; border-radius: 12px; border: 2px dashed #cbd5e1; margin-bottom: 25px; flex-wrap: wrap; }
        .color-picker { padding: 2px; height: 44px; cursor: pointer; }
        .tags-list-container { display: flex; flex-direction: column; gap: 10px; }
        .tag-row { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 12px 20px; border-radius: 12px; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 15px; transition: 0.2s; }
        .tag-row:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .tag-input-clean { border: 1px solid transparent; background: transparent; font-weight: 800; font-size: 14px; max-width: 200px; padding: 8px 12px; border-radius: 8px; transition: 0.2s; }
        .tag-input-clean:hover { background: #f8fafc; border-color: #e2e8f0; }
        .tag-input-clean:focus { background: #fff; border-color: #4f46e5; outline: none; }
        .tag-controls { display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
        .color-group { display: flex; align-items: center; gap: 8px; }
        .color-label { font-size: 12px; color: #64748b; font-weight: 700; }
        .color-picker-sm { width: 34px; height: 34px; border-radius: 8px; cursor: pointer; border: 1px solid #e2e8f0; padding: 0; }
        
        .template-creation-box { background: #fff; padding: 20px; border-radius: 12px; border: 2px dashed #cbd5e1; margin-bottom: 25px; }
        .template-card-view { background: #fff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s, box-shadow 0.2s; }
        .template-card-view:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.04); border-color: #cbd5e1; }
        .template-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .template-title { font-weight: 900; color: #1e293b; font-size: 14px; }
        .template-body { font-size: 13px; color: #475569; white-space: pre-wrap; line-height: 1.7; }
        .btn-icon { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; border: none; display: flex; align-items: center; gap: 5px; }
      `}</style>

      {/* Toast Notification Banner */}
      {toastMessage && <div className="toast-banner">{toastMessage}</div>}

      <div className="wrapper">
        <Link href="/hub" className="back-link" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 700, fontSize: '13px', display: 'inline-block', marginBottom: '15px' }}>← العودة للوحة الرئيسية</Link>

        {/* ترويسة المتجر الديناميكية */}
        <div className="header-brand">
          <div className="store-logo-badge">
            {storeLogo.startsWith('data:') || storeLogo.startsWith('http') || storeLogo.startsWith('/') ? (
              <img src={storeLogo} alt="Store Logo" />
            ) : (
              <span>{storeLogo}</span>
            )}
          </div>
          <h1 className="brand-title">CRM <span>{storeName}</span></h1>
          <p className="brand-desc">النظام الأذكى لإدارة عملاء التجارة الإلكترونية وأتمتة المراسلات</p>
        </div>

        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 لوحة القيادة</button>
          <button className={`tab-btn ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>👥 إدارة العملاء</button>
          <button className={`tab-btn ${activeTab === 'messaging' ? 'active' : ''}`} onClick={() => setActiveTab('messaging')}>💬 المراسلات والحملات</button>
          <button className={`tab-btn ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>⚙️ الإعدادات</button>
        </div>

        {/* 1. Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="section-title">مؤشرات الأداء المباشرة</div>
            <div className="dashboard-grid">
              <div className="stat-card" style={{ borderBottom: '4px solid #4f46e5' }}>
                <div className="stat-title">إجمالي المبيعات الفعلية</div>
                <div className="stat-num">{totalValidSales.toLocaleString()} <span style={{fontSize:'14px'}}>ر.س</span></div>
              </div>
              <div className="stat-card" style={{ borderBottom: '4px solid #10b981' }}>
                <div className="stat-title">إجمالي العملاء</div>
                <div className="stat-num">{contacts.length}</div>
              </div>
              {categories.map(cat => (
                <div key={cat.name} className="stat-card" style={{ borderBottom: `4px solid ${cat.color}` }}>
                  <div className="stat-title">{cat.name}</div>
                  <div className="stat-num">{contacts.filter(c => c.category === cat.name).length}</div>
                </div>
              ))}
            </div>

            <div className="section-title">أحدث العملاء تسجيلاً</div>
            <div className="table-container">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>الطلب</th>
                    <th>التصنيف</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>إجراء سريع</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.slice(0, 5).map(c => (
                    <tr key={c.id}>
                      <td style={{fontWeight: 800}}>{c.name}</td>
                      <td style={{direction: 'ltr', textAlign: 'right'}}>{c.orderNumber}</td>
                      <td>
                        <span className="badge" style={{ background: categories.find(cat => cat.name === c.category)?.bg || '#eee', color: categories.find(cat => cat.name === c.category)?.color || '#000' }}>
                          {c.category}
                        </span>
                      </td>
                      <td><span style={{ fontWeight: 700, color: c.status === 'نشط' ? '#15803d' : '#64748b' }}>{c.status || 'نشط'}</span></td>
                      <td style={{ color: '#64748b', direction: 'ltr', textAlign: 'right' }}>{c.date}</td>
                      <td>
                        <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬 مراسلة</button>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && <tr><td colSpan={6} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>لا يوجد عملاء بعد. انتقل لإدارة العملاء لإضافتهم.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. CRM */}
        {activeTab === 'crm' && (
          <div>
            <div className="section-box">
              <div className="section-title">➕ تسجيل عميل جديد</div>
              <form onSubmit={addContact}>
                <div className="form-grid" style={{ marginBottom: '20px' }}>
                  <div className="form-group"><label>اسم العميل</label><input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} required /></div>
                  <div className="form-group"><label>رقم الجوال (05x)</label><input type="text" className="form-control input-ltr" value={newPhone} onChange={e => setNewPhone(toEnglishDigits(e.target.value))} required /></div>
                  <div className="form-group"><label>رقم الطلب (#)</label><input type="text" className="form-control input-ltr" value={newOrderNumber} onChange={e => setNewOrderNumber(toEnglishDigits(e.target.value))} /></div>
                  <div className="form-group">
                    <label>التصنيف</label>
                    <select className="form-control" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                      {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>حالة العميل</label>
                    <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                      {statusOptions.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>المشتريات (ر.س)</label><input type="text" className="form-control input-ltr" value={newAmount} onChange={e => setNewAmount(toEnglishDigits(e.target.value))} placeholder="0" /></div>
                </div>
                <button type="submit" className="btn-main" style={{ width: 'auto' }}>حفظ وإضافة العميل</button>
              </form>
            </div>

            <div className="section-box" style={{ padding: '20px 25px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
                
                {/* شريط البحث والفلاتر (يمين) */}
                <div style={{ display: 'flex', gap: '15px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 2, margin: 0, minWidth: '220px' }}>
                    <input type="text" className="form-control" placeholder="🔍 بحث بالاسم، الجوال، أو رقم الطلب..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                </div>

                {/* أزرار التصدير والاستيراد (يسار) */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button className="btn-sm btn-success" style={{ padding: '12px 20px', fontWeight: 800 }} onClick={() => fileInputRef.current?.click()}>📤 استيراد CSV</button>
                  <input type="file" ref={fileInputRef} onChange={handleImportCSV} accept=".csv" style={{ display: 'none' }} />
                  <button className="btn-sm btn-edit" style={{ padding: '12px 20px', fontWeight: 800 }} onClick={exportToExcel}>📥 تصدير Excel</button>
                </div>

              </div>

              {/* أزرار الفلترة السريعة (Quick Filter Chips) */}
              <div className="filter-chips">
                <button className={`chip-btn ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>جميع العملاء ({contacts.length})</button>
                {categories.map(cat => (
                  <button key={cat.name} className={`chip-btn ${filterCategory === cat.name ? 'active' : ''}`} onClick={() => setFilterCategory(cat.name)}>
                    {cat.name} ({contacts.filter(c => c.category === cat.name).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="table-container">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>الجوال</th>
                    <th>الطلب</th>
                    <th>التصنيف</th>
                    <th>الحالة</th>
                    <th>المشتريات</th>
                    <th>التاريخ</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map(c => (
                    <tr key={c.id}>
                      <td><input type="text" className="form-control" style={{ padding: '8px', fontSize: '12px', width: '120px' }} value={c.name} onChange={e => updateCustomerField(c.id, 'name', e.target.value)} /></td>
                      <td><input type="text" className="form-control input-ltr" style={{ padding: '8px', fontSize: '12px', width: '110px' }} value={c.phone} onChange={e => updateCustomerField(c.id, 'phone', e.target.value)} /></td>
                      <td><input type="text" className="form-control input-ltr" style={{ padding: '8px', fontSize: '12px', width: '80px', color: '#4f46e5' }} value={c.orderNumber} onChange={e => updateCustomerField(c.id, 'orderNumber', e.target.value)} /></td>
                      <td>
                        <select className="form-control" style={{ padding: '8px', fontSize: '12px' }} value={c.category} onChange={e => updateCustomerField(c.id, 'category', e.target.value)}>
                          {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <select className="form-control" style={{ padding: '8px', fontSize: '12px' }} value={c.status || 'نشط'} onChange={e => updateCustomerField(c.id, 'status', e.target.value)}>
                          {statusOptions.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                      </td>
                      <td><input type="text" className="form-control input-ltr" style={{ padding: '8px', fontSize: '12px', width: '80px' }} value={c.amount} onChange={e => updateCustomerField(c.id, 'amount', e.target.value)} /></td>
                      <td style={{ direction: 'ltr', textAlign: 'right', color: '#64748b', fontSize: '12px', fontWeight: 700 }}>{c.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬 مراسلة</button>
                          <button className="btn-sm btn-danger" onClick={() => deleteContact(c.id)}>حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredContacts.length === 0 && <tr><td colSpan={8} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>لا يوجد عملاء يطابقون بحثك.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Messaging Engine */}
        {activeTab === 'messaging' && (
          <div>
            <div className="radio-group">
              <button className={`radio-btn ${messagingMode === 'single' ? 'active' : ''}`} onClick={() => setMessagingMode('single')}>رسالة لعميل محدد</button>
              <button className={`radio-btn ${messagingMode === 'broadcast' ? 'active' : ''}`} onClick={() => setMessagingMode('broadcast')}>حملة جماعية (طابور)</button>
            </div>

            <div className="section-box">
              {messagingMode === 'single' ? (
                <>
                  <div className="section-title">1. بيانات العميل المستهدف</div>
                  <div className="form-grid">
                    <div className="form-group" ref={suggestionsRef}>
                      <label>ابحث عن عميل من الـ CRM</label>
                      <input type="text" className="form-control" placeholder="اكتب اسم العميل لجلبه تلقائياً..." value={customerName} onChange={e => { setCustomerName(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} />
                      {showSuggestions && matchingCustomers.length > 0 && (
                        <div className="suggestions-box">
                          {matchingCustomers.map(cust => (
                            <div key={cust.id} className="suggestion-item" onClick={() => { setCustomerName(cust.name); setCustomerPhone(cust.phone); setOrderNumber(cust.orderNumber); setShowSuggestions(false); }}>
                              <span>{cust.name} <small style={{color: '#94a3b8'}}>({cust.orderNumber})</small></span>
                              <span style={{ color: '#4f46e5', direction: 'ltr' }}>{cust.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-group"><label>رقم الجوال</label><input type="text" className="form-control input-ltr" value={customerPhone} onChange={e => setCustomerPhone(toEnglishDigits(e.target.value))} /></div>
                    <div className="form-group"><label>رقم الطلب</label><input type="text" className="form-control input-ltr" value={orderNumber} onChange={e => setOrderNumber(toEnglishDigits(e.target.value))} /></div>
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
              <div className="section-title">2. اختر أو صمم رسالتك</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {templates.map(tpl => (
                  <div key={tpl.id} onClick={() => setActiveTemplateId(tpl.id)} style={{ padding: '12px 10px', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', fontWeight: 800, fontSize: '12px', color: activeTemplateId === tpl.id ? '#4f46e5' : '#64748b', background: activeTemplateId === tpl.id ? '#eef2ff' : '#fff', borderColor: activeTemplateId === tpl.id ? '#4f46e5' : '#e2e8f0', transition: '0.2s' }}>
                    {tpl.title}
                  </div>
                ))}
              </div>
              
              <div className="form-grid" style={{ marginTop: '20px' }}>
                <div className="form-group">
                  <label>معلومة إضافية متغيرة (تستبدل كلمة [إضافي] في القوالب)</label>
                  <input type="text" className="form-control" placeholder="رابط الدفع، تفاصيل، الخ..." value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                    <input type="checkbox" checked={includeDiscount} onChange={e => setIncludeDiscount(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }}/>
                    إرفاق كود الخصم الافتراضي (*{defaultDiscountCode}*) بنهاية الرسالة
                  </label>
                </div>
              </div>
            </div>

            {messagingMode === 'single' ? (
              <>
                <button className="btn-main" style={{ width: '100%' }} onClick={handleGenerateMessage}>⚡ توليد ومعاينة الرسالة</button>
                {generatedMsg && (
                  <div style={{ background: '#fff', border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '16px', marginTop: '20px' }}>
                    <div className="section-title" style={{ fontSize: '13px', color: '#64748b' }}>شكل الرسالة النهائي:</div>
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '15px', color: '#1e293b', fontWeight: 500, border: '1px solid #e2e8f0' }}>{generatedMsg}</div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn-main" style={{ flex: 1, background: '#f1f5f9', color: '#1e293b' }} onClick={() => { navigator.clipboard.writeText(generatedMsg); showToast('📋 تم نسخ النص بنجاح!'); }}>📋 نسخ فقط</button>
                      <button className="btn-wa" style={{ flex: 2 }} onClick={() => openWhatsApp(customerPhone, generatedMsg)}>🟢 إرسال عبر واتساب</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '16px', marginTop: '20px' }}>
                {broadcastList.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#dc2626', fontWeight: 800 }}>لا يوجد عملاء في هذه الشريحة.</p>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '15px' }}>
                      العميل الحالي: <span style={{ color: '#4f46e5', direction: 'ltr', display: 'inline-block' }}>{broadcastIndex + 1}</span> من <span style={{ direction: 'ltr', display: 'inline-block' }}>{broadcastList.length}</span>
                    </p>
                    <div style={{ background: '#fff', padding: '15px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.7, marginBottom: '15px', color: '#1e293b', fontWeight: 500, border: '1px solid #e2e8f0' }}>
                      يتم إرسال رسالة لـ: <strong>{broadcastList[broadcastIndex]?.name}</strong> <br/>
                      جوال: <span dir="ltr">{broadcastList[broadcastIndex]?.phone}</span> | طلب: <span dir="ltr">{broadcastList[broadcastIndex]?.orderNumber}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button className="btn-wa" style={{ width: 'auto' }} onClick={() => {
                        const c = broadcastList[broadcastIndex];
                        setCustomerName(c.name); setOrderNumber(c.orderNumber); setCustomerPhone(c.phone);
                        const tpl = templates.find(t => t.id === activeTemplateId)?.text || '';
                        let msg = tpl.replace(/\[الاسم\]/g, c.name).replace(/\[الطلب\]/g, c.orderNumber).replace(/\[إضافي\]/g, extraInfo);
                        if(includeDiscount) msg += `\n\n🎁 كود خصم خاص لك: *${defaultDiscountCode}*`;
                        openWhatsApp(c.phone, msg);
                      }}>🟢 إرسال للعميل الحالي</button>
                      <button className="btn-main" style={{ width: 'auto', background: '#334155' }} onClick={() => {
                        if (broadcastIndex < broadcastList.length - 1) setBroadcastIndex(broadcastIndex + 1);
                        else showToast('⚠️ لقد وصلت لنهاية القائمة!');
                      }}>التالي ⬅</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. Settings */}
        {activeTab === 'tags' && (
          <div>
            {/* إعدادات هوية المتجر */}
            <div className="section-box" style={{ background: '#eef2ff', borderColor: '#c7d2fe' }}>
              <div className="section-title">🛍 إعدادات هوية المتجر</div>
              <p className="section-desc">خصص اسم متجرك وقم برفع شعار المتجر من جهاز الكمبيوتر ليظهر باحترافية في أعلى المنصة.</p>
              
              <div className="form-grid" style={{ alignItems: 'flex-end' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>اسم المتجر</label>
                  <input type="text" className="form-control" value={storeName} onChange={e => handleSaveStoreName(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>شعار المتجر (صورة من جهاز الكمبيوتر)</label>
                  <button className="btn-main" style={{ width: '100%', background: '#fff', color: '#4f46e5', border: '1px solid #c7d2fe' }} onClick={() => storeLogoFileRef.current?.click()}>
                    🖼️️ اختر صورة الشعار من جهازك
                  </button>
                  <input type="file" ref={storeLogoFileRef} onChange={handleLogoUpload} accept="image/*" style={{ display: 'none' }} />
                </div>
              </div>
            </div>

            <div className="section-box">
              <div className="section-title">⚡ إعدادات النظام العامة</div>
              <p className="section-desc">تحكم بكود الخصم الافتراضي الذي يتم إرفاقه تلقائياً مع الرسائل التسويقية.</p>
              
              <div className="form-group" style={{ maxWidth: '400px', margin: 0 }}>
                <label>كود الخصم الافتراضي</label>
                <input type="text" className="form-control" value={defaultDiscountCode} onChange={e => saveDefaultDiscount(e.target.value)} />
              </div>
            </div>

            <div className="section-box">
              <div className="section-title">📝 قوالب الرسائل الجاهزة</div>
              <p className="section-desc">أنشئ نصوصاً جاهزة لاستخدامها بنقرة واحدة في قسم المراسلات.</p>

              <div className="template-creation-box">
                <div className="form-group">
                  <label>عنوان القالب (للتنظيم)</label>
                  <input type="text" className="form-control" placeholder="مثال: رسالة ترحيبية..." value={newTplTitle} onChange={e => setNewTplTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>نص الرسالة (المتغيرات المدعومة: [الاسم]، [الطلب]، [إضافي])</label>
                  <textarea className="form-control" rows={3} placeholder="أهلاً بك يا [الاسم]..." value={newTplText} onChange={e => setNewTplText(e.target.value)}></textarea>
                </div>
                <button className="btn-main" style={{ width: '100%' }} onClick={() => {
                  if (!newTplTitle || !newTplText) return showToast("⚠️ الرجاء تعبئة العنوان والنص");
                  saveTemplates([...templates, { id: Date.now(), title: newTplTitle, text: newTplText }]);
                  setNewTplTitle(''); setNewTplText('');
                  showToast('💾 تم حفظ القالب بنجاح');
                }}>💾 حفظ القالب في النظام</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                {templates.map(t => (
                  <div key={t.id} className="template-card-view">
                    <div className="template-header">
                      <span className="template-title">{t.title}</span>
                      {t.id > 4 && <button className="btn-icon btn-danger" style={{ padding: '4px 8px' }} onClick={() => { saveTemplates(templates.filter(x => x.id !== t.id)); showToast('🗑️ تم حذف القالب'); }}>🗑️</button>}
                    </div>
                    <div className="template-body">{t.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-box">
              <div className="section-title">🏷️ تخصيص تصنيفات وحالات العملاء</div>
              <p className="section-desc">حدد التصنيفات التي ترغب بأن تُحسب مبيعاتها ضمن إجمالي لوحة القيادة.</p>
              
              <form onSubmit={addCategory} className="settings-creation-box">
                <div className="form-group" style={{ flex: 2, margin: 0, minWidth: '200px' }}>
                  <label>اسم التصنيف الجديد</label>
                  <input type="text" className="form-control" placeholder="مثال: قيد التجهيز..." value={newCatName} onChange={e => setNewCatName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0, minWidth: '100px' }}>
                  <label>الخلفية</label>
                  <input type="color" className="form-control color-picker" value={newCatBg} onChange={e => setNewCatBg(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0, minWidth: '100px' }}>
                  <label>النص</label>
                  <input type="color" className="form-control color-picker" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '130px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <input type="checkbox" checked={newCatIsSale} onChange={e => setNewCatIsSale(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }} />
                    يُحسب كمبيعات؟
                  </label>
                </div>
                <button type="submit" className="btn-main" style={{ height: '44px', padding: '0 25px', whiteSpace: 'nowrap' }}>➕ إضافة</button>
              </form>

              <div className="tags-list-container">
                {categories.map((cat, idx) => (
                  <div key={idx} className="tag-row">
                    <input 
                      type="text" 
                      className="tag-input-clean" 
                      value={cat.name} 
                      onChange={e => {
                          const updatedCats = [...categories];
                          updatedCats[idx].name = e.target.value;
                          saveCategories(updatedCats);
                      }} 
                    />
                    <div className="tag-controls">
                      <div className="color-group">
                        <span className="color-label">الخلفية:</span>
                        <input type="color" className="color-picker-sm" value={cat.bg} onChange={e => {
                            const updatedCats = [...categories];
                            updatedCats[idx].bg = e.target.value;
                            saveCategories(updatedCats);
                        }} />
                      </div>
                      <div className="color-group">
                        <span className="color-label">النص:</span>
                        <input type="color" className="color-picker-sm" value={cat.color} onChange={e => {
                            const updatedCats = [...categories];
                            updatedCats[idx].color = e.target.value;
                            saveCategories(updatedCats);
                        }} />
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
                        <input type="checkbox" checked={cat.isSale} onChange={e => {
                            const updatedCats = [...categories];
                            updatedCats[idx].isSale = e.target.checked;
                            saveCategories(updatedCats);
                        }} style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }} />
                        مبيعات
                      </label>
                      <span className="badge" style={{ backgroundColor: cat.bg, color: cat.color }}>معاينة الشارة</span>
                      <button className="btn-icon btn-danger" onClick={() => deleteCategory(cat.name)}>🗑️ حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
