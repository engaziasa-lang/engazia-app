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
  amount: number;
  note: string;
  date: string;
}

interface TagConfig {
  name: string;
  bg: string;
  color: string;
}

interface Template {
  id: number;
  title: string;
  text: string;
}

export default function JasmalWhatsAppCRM() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'messaging' | 'tags'>('dashboard');

  // إدارة العملاء CRM
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // إضافة عميل جديد
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrderNumber, setNewOrderNumber] = useState('');
  const [newCategory, setNewCategory] = useState('عميل جديد');
  const [newAmount, setNewAmount] = useState<number | ''>('');

  // المراسلات (الدمج الذكي)
  const [messagingMode, setMessagingMode] = useState<'single' | 'broadcast'>('single');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [includeDiscount, setIncludeDiscount] = useState(false);
  const [discountCode, setDiscountCode] = useState('JASMAL10');
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
    { name: 'عميل جديد', bg: '#dbeafe', color: '#1d4ed8' },
    { name: 'سلة متروكة', bg: '#fee2e2', color: '#dc2626' },
    { name: 'بانتظار الدفع', bg: '#fef3c7', color: '#d97706' },
    { name: 'تم الشحن والتوصيل', bg: '#dcfce7', color: '#15803d' }
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBg, setNewCatBg] = useState('#e0e7ff');
  const [newCatColor, setNewCatColor] = useState('#4f46e5');

  // Autocomplete
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedContacts = localStorage.getItem('jasmal_crm_data');
    if (savedContacts) try { setContacts(JSON.parse(savedContacts)); } catch (e) {}
    
    const savedCats = localStorage.getItem('jasmal_tags_data');
    if (savedCats) try { setCategories(JSON.parse(savedCats)); } catch (e) {}

    const savedTpls = localStorage.getItem('jasmal_templates');
    if (savedTpls) try { setTemplates(JSON.parse(savedTpls)); } catch (e) {}

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
    localStorage.setItem('jasmal_crm_data', JSON.stringify(updated));
  };

  const saveCategories = (updated: TagConfig[]) => {
    setCategories(updated);
    localStorage.setItem('jasmal_tags_data', JSON.stringify(updated));
  };

  const saveTemplates = (updated: Template[]) => {
    setTemplates(updated);
    localStorage.setItem('jasmal_templates', JSON.stringify(updated));
  };

  const formatPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '966' + clean.substring(1);
    return clean;
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return alert('أدخل الاسم ورقم الجوال.');
    const newCust: Customer = {
      id: Date.now().toString(),
      name: newName,
      phone: formatPhone(newPhone),
      orderNumber: newOrderNumber || '#---',
      category: newCategory,
      status: 'نشط',
      amount: Number(newAmount) || 0,
      note: '',
      date: new Date().toLocaleDateString('ar-SA')
    };
    saveContacts([newCust, ...contacts]);
    setNewName(''); setNewPhone(''); setNewOrderNumber(''); setNewAmount('');
    alert('تم إضافة العميل بنجاح!');
  };

  const updateCustomerField = (id: string, field: keyof Customer, value: any) => {
    saveContacts(contacts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteContact = (id: string) => {
    if (confirm('تأكيد حذف العميل؟')) saveContacts(contacts.filter(c => c.id !== id));
  };

  // توجيه ذكي للمراسلة
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
      
    if (includeDiscount) msg += `\n\n🎁 كود خصم خاص لك: *${discountCode}*`;
    setGeneratedMsg(msg);
  };

  const openWhatsApp = (phone: string, text: string) => {
    const clean = formatPhone(phone);
    const url = clean ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const exportToCSV = () => {
    if (contacts.length === 0) return alert('لا توجد بيانات للتصدير.');
    const headers = "الاسم,الجوال,رقم الطلب,التصنيف,الحالة,إجمالي المشتريات (رس),الملاحظات,التاريخ\n";
    const rows = contacts.map(c => `"${c.name}","${c.phone}","${c.orderNumber}","${c.category}","${c.status}",${c.amount},"${c.note}","${c.date}"`).join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jasmal_crm_export.csv";
    link.click();
  };

  const totalValidSales = contacts.filter(c => c.category !== 'سلة متروكة' && c.category !== 'بانتظار الدفع').reduce((acc, c) => acc + c.amount, 0);
  const filteredContacts = contacts.filter(c => 
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm) || c.orderNumber.includes(searchTerm)) &&
    (filterCategory === 'all' || c.category === filterCategory)
  );
  const matchingCustomers = customerName.trim() === '' ? [] : contacts.filter(c => c.name.toLowerCase().includes(customerName.toLowerCase()));
  const broadcastList = contacts.filter(c => c.category === broadcastCat);

  return (
    <div className="app-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .app-container { background: #f1f5f9; color: #0f172a; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 15px; }
        .wrapper { max-width: 1100px; margin: 0 auto; background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; }
        
        .header-brand { text-align: center; margin-bottom: 30px; }
        .brand-title { font-size: 28px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px; margin-bottom: 5px; }
        .brand-title span { color: #4f46e5; }
        .brand-desc { color: #64748b; font-size: 14px; font-weight: 500; }

        .nav-tabs { display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; overflow-x: auto; justify-content: center; }
        .tab-btn { background: transparent; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 14px; color: #64748b; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
        .tab-btn:hover { background: #f8fafc; color: #334155; }
        .tab-btn.active { background: #4f46e5; color: #fff; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }

        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.02); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-num { font-size: 24px; font-weight: 900; color: #1e293b; margin-top: 8px; }
        .stat-title { font-size: 13px; color: #64748b; font-weight: 700; }

        .section-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: 900; color: #1e293b; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }

        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; }
        .form-group { margin-bottom: 15px; position: relative; }
        .form-group label { display: block; font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 6px; }
        .form-control { width: 100%; padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; outline: none; font-family: 'Tajawal', sans-serif; background: #fff; color: #1e293b; font-weight: 700; transition: border-color 0.2s; }
        .form-control:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }

        .btn-main { background: #4f46e5; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.2s; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
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

        .templates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 15px; }
        .template-card { padding: 12px 10px; border: 2px solid #e2e8f0; border-radius: 12px; cursor: pointer; text-align: center; font-weight: 800; font-size: 12px; color: #64748b; transition: 0.2s; background: #fff; }
        .template-card.active { border-color: #4f46e5; color: #4f46e5; background: #eef2ff; }

        .result-box { background: #fff; border: 2px dashed #cbd5e1; padding: 20px; border-radius: 16px; margin-top: 20px; }
        .msg-preview { background: #f8fafc; padding: 15px; border-radius: 10px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; margin-bottom: 15px; color: #1e293b; font-weight: 500; border: 1px solid #e2e8f0; }

        .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        
        .radio-group { display: flex; gap: 10px; margin-bottom: 20px; background: #e2e8f0; padding: 4px; border-radius: 12px; width: fit-content; }
        .radio-btn { padding: 8px 20px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; color: #64748b; border: none; background: transparent; transition: 0.3s; }
        .radio-btn.active { background: #fff; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
      `}</style>

      <div className="wrapper">
        <Link href="/hub" className="back-link" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 700, fontSize: '13px', display: 'inline-block', marginBottom: '15px' }}>← العودة للوحة الرئيسية</Link>

        <div className="header-brand">
          <h1 className="brand-title">منصة <span>Jasmal</span> CRM</h1>
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
              {categories.slice(0, 3).map(cat => (
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
                    <th>التاريخ</th>
                    <th>إجراء سريع</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.slice(0, 5).map(c => (
                    <tr key={c.id}>
                      <td style={{fontWeight: 800}}>{c.name}</td>
                      <td>{c.orderNumber}</td>
                      <td>
                        <span className="badge" style={{ background: categories.find(cat => cat.name === c.category)?.bg || '#eee', color: categories.find(cat => cat.name === c.category)?.color || '#000' }}>
                          {c.category}
                        </span>
                      </td>
                      <td style={{ color: '#64748b' }}>{c.date}</td>
                      <td>
                        <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬 مراسلة</button>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && <tr><td colSpan={5} style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>لا يوجد عملاء بعد. انتقل لإدارة العملاء لإضافتهم.</td></tr>}
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
                <div className="form-grid">
                  <div className="form-group"><label>اسم العميل</label><input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} required /></div>
                  <div className="form-group"><label>رقم الجوال (05x)</label><input type="text" className="form-control" value={newPhone} onChange={e => setNewPhone(e.target.value)} required /></div>
                  <div className="form-group"><label>رقم الطلب (#)</label><input type="text" className="form-control" value={newOrderNumber} onChange={e => setNewOrderNumber(e.target.value)} /></div>
                  <div className="form-group">
                    <label>التصنيف</label>
                    <select className="form-control" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                      {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>المشتريات (ر.س)</label><input type="number" className="form-control" value={newAmount} onChange={e => setNewAmount(Number(e.target.value))} /></div>
                </div>
                <button type="submit" className="btn-main" style={{ width: 'auto' }}>حفظ وإضافة العميل</button>
              </form>
            </div>

            <div className="section-box" style={{ padding: '15px 25px' }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}><input type="text" className="form-control" placeholder="🔍 بحث بالاسم، الجوال، أو رقم الطلب..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <select className="form-control" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="all">كل التصنيفات</option>
                    {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <button className="btn-sm btn-edit" style={{ padding: '12px 20px', fontWeight: 800 }} onClick={exportToCSV}>📥 تصدير CSV</button>
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
                    <th>المشتريات</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map(c => (
                    <tr key={c.id}>
                      <td><input type="text" className="form-control" style={{ padding: '6px', fontSize: '12px', width: '120px' }} value={c.name} onChange={e => updateCustomerField(c.id, 'name', e.target.value)} /></td>
                      <td><input type="text" className="form-control" style={{ padding: '6px', fontSize: '12px', width: '110px' }} value={c.phone} onChange={e => updateCustomerField(c.id, 'phone', e.target.value)} /></td>
                      <td><input type="text" className="form-control" style={{ padding: '6px', fontSize: '12px', width: '80px', color: '#4f46e5' }} value={c.orderNumber} onChange={e => updateCustomerField(c.id, 'orderNumber', e.target.value)} /></td>
                      <td>
                        <select className="form-control" style={{ padding: '6px', fontSize: '12px' }} value={c.category} onChange={e => updateCustomerField(c.id, 'category', e.target.value)}>
                          {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                        </select>
                      </td>
                      <td><input type="number" className="form-control" style={{ padding: '6px', fontSize: '12px', width: '80px' }} value={c.amount} onChange={e => updateCustomerField(c.id, 'amount', Number(e.target.value))} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="btn-sm btn-success" onClick={() => routeToMessaging(c)}>💬 مراسلة</button>
                          <button className="btn-sm btn-danger" onClick={() => deleteContact(c.id)}>حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Messaging Engine (Unified Single & Broadcast) */}
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
                              <span style={{ color: '#4f46e5' }}>{cust.phone}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="form-group"><label>رقم الجوال</label><input type="text" className="form-control" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
                    <div className="form-group"><label>رقم الطلب</label><input type="text" className="form-control" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} /></div>
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
              <div className="templates-grid">
                {templates.map(tpl => (
                  <div key={tpl.id} className={`template-card ${activeTemplateId === tpl.id ? 'active' : ''}`} onClick={() => setActiveTemplateId(tpl.id)}>
                    {tpl.title}
                  </div>
                ))}
              </div>
              
              <div className="form-grid" style={{ marginTop: '20px' }}>
                <div className="form-group">
                  <label>معلومة إضافية متغيرة (تستبدل كلمة [إضافي] في القوالب)</label>
                  <input type="text" className="form-control" placeholder="رابط الدفع، تفاصيل، الخ..." value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeDiscount} onChange={e => setIncludeDiscount(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}/>
                    إرفاق كود خصم تحفيزي بنهاية الرسالة
                  </label>
                  {includeDiscount && <input type="text" className="form-control" value={discountCode} onChange={e => setDiscountCode(e.target.value)} style={{ marginTop: '8px' }} />}
                </div>
              </div>
            </div>

            {messagingMode === 'single' ? (
              <>
                <button className="btn-main" onClick={handleGenerateMessage}>⚡ توليد ومعاينة الرسالة</button>
                {generatedMsg && (
                  <div className="result-box">
                    <div className="section-title" style={{ fontSize: '13px', color: '#64748b' }}>شكل الرسالة النهائي:</div>
                    <div className="msg-preview">{generatedMsg}</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn-main" style={{ flex: 1, background: '#f1f5f9', color: '#1e293b' }} onClick={() => { navigator.clipboard.writeText(generatedMsg); alert('تم النسخ!'); }}>📋 نسخ فقط</button>
                      <button className="btn-wa" style={{ flex: 2 }} onClick={() => openWhatsApp(customerPhone, generatedMsg)}>🟢 إرسال عبر واتساب</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="result-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                {broadcastList.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#dc2626', fontWeight: 800 }}>لا يوجد عملاء في هذه الشريحة.</p>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '15px' }}>
                      العميل الحالي: <span style={{ color: '#4f46e5' }}>{broadcastIndex + 1}</span> من {broadcastList.length}
                    </p>
                    <div className="msg-preview" style={{ background: '#fff' }}>
                      يتم إرسال رسالة لـ: <strong>{broadcastList[broadcastIndex]?.name}</strong> <br/>
                      جوال: <span dir="ltr">{broadcastList[broadcastIndex]?.phone}</span> | طلب: {broadcastList[broadcastIndex]?.orderNumber}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button className="btn-wa" onClick={() => {
                        const c = broadcastList[broadcastIndex];
                        setCustomerName(c.name); setOrderNumber(c.orderNumber); setCustomerPhone(c.phone);
                        const tpl = templates.find(t => t.id === activeTemplateId)?.text || '';
                        let msg = tpl.replace(/\[الاسم\]/g, c.name).replace(/\[الطلب\]/g, c.orderNumber).replace(/\[إضافي\]/g, extraInfo);
                        if(includeDiscount) msg += `\n\n🎁 كود خصم خاص لك: *${discountCode}*`;
                        openWhatsApp(c.phone, msg);
                      }}>🟢 إرسال للعميل الحالي</button>
                      <button className="btn-main" style={{ width: 'auto', background: '#334155' }} onClick={() => {
                        if (broadcastIndex < broadcastList.length - 1) setBroadcastIndex(broadcastIndex + 1);
                        else alert('انتهت القائمة!');
                      }}>التالي ⬅️</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. Settings (Tags & Templates) */}
        {activeTab === 'tags' && (
          <div>
            <div className="section-box">
              <div className="section-title">🏷️ تخصيص تصنيفات وحالات العملاء</div>
              <form onSubmit={addCategory} className="form-grid" style={{ marginBottom: '20px' }}>
                <div className="form-group"><label>اسم التصنيف الجديد</label><input type="text" className="form-control" value={newCatName} onChange={e => setNewCatName(e.target.value)} required /></div>
                <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}><label>الخلفية</label><input type="color" className="form-control" style={{ padding: '2px', height: '44px' }} value={newCatBg} onChange={e => setNewCatBg(e.target.value)} /></div>
                  <div style={{ flex: 1 }}><label>النص</label><input type="color" className="form-control" style={{ padding: '2px', height: '44px' }} value={newCatColor} onChange={e => setNewCatColor(e.target.value)} /></div>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button type="submit" className="btn-main">➕ إضافة التصنيف</button>
                </div>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categories.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
                    <input type="text" className="form-control" value={cat.name} onChange={e => {
                        const updatedCats = [...categories];
                        updatedCats[idx].name = e.target.value;
                        saveCategories(updatedCats);
                    }} style={{ width: '150px', padding: '8px' }} />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input type="color" value={cat.bg} onChange={e => {
                          const updatedCats = [...categories];
                          updatedCats[idx].bg = e.target.value;
                          saveCategories(updatedCats);
                      }} style={{ width: '35px', height: '35px', borderRadius: '8px', cursor: 'pointer', border: 'none' }} />
                      <input type="color" value={cat.color} onChange={e => {
                          const updatedCats = [...categories];
                          updatedCats[idx].color = e.target.value;
                          saveCategories(updatedCats);
                      }} style={{ width: '35px', height: '35px', borderRadius: '8px', cursor: 'pointer', border: 'none' }} />
                      <span className="badge" style={{ backgroundColor: cat.bg, color: cat.color }}>معاينة الشارة</span>
                      <button className="btn-sm btn-danger" onClick={() => deleteCategory(cat.name)}>حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-box">
              <div className="section-title">📝 قوالب الرسائل الجاهزة (تظهر في قسم المراسلات)</div>
              <div className="form-grid" style={{ marginBottom: '15px' }}>
                <div className="form-group"><label>عنوان القالب المستعار (للتنظيم)</label><input type="text" className="form-control" value={newTplTitle} onChange={e => setNewTplTitle(e.target.value)} /></div>
                <div className="form-group"><label>نص الرسالة (استخدم المتغيرات: [الاسم]، [الطلب]، [إضافي])</label><textarea className="form-control" rows={2} value={newTplText} onChange={e => setNewTplText(e.target.value)}></textarea></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button className="btn-main" onClick={() => {
                    if (!newTplTitle || !newTplText) return;
                    saveTemplates([...templates, { id: Date.now(), title: newTplTitle, text: newTplText }]);
                    setNewTplTitle(''); setNewTplText('');
                  }}>حفظ القالب</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                {templates.map(t => (
                  <div key={t.id} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '15px', borderRadius: '12px' }}>
                    <div style={{ fontWeight: '900', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      {t.title}
                      {t.id > 4 && <button className="btn-sm btn-danger" onClick={() => saveTemplates(templates.filter(x => x.id !== t.id))}>حذف</button>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'pre-wrap' }}>{t.text}</div>
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
