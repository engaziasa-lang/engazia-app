'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  phone: string;
  category: string;
  status: string;
  amount: number;
  note: string;
  date: string;
}

export default function WhatsAppProHub() {
  const [activeTab, setActiveTab] = useState<'generator' | 'crm' | 'broadcast' | 'templates' | 'links'>('generator');

  // مولد الرسائل والخصومات
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [templateType, setTemplateType] = useState('confirm');
  const [discountCode, setDiscountCode] = useState('ENGAZIA10');
  const [includeDiscount, setIncludeDiscount] = useState(false);
  const [extraInfo, setExtraInfo] = useState('');
  const [generatedMsg, setGeneratedMsg] = useState('');

  // إدارة CRM العملاء
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('عميل جديد');
  const [newStatus, setNewStatus] = useState('قيد المتابعة');
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newNote, setNewNote] = useState('');

  // الردود الجاهزة
  const [customTemplates, setCustomTemplates] = useState([
    { id: 1, title: 'تأكيد السداد والبدء بالتجهيز', text: 'أهلاً بك [الاسم]، تم تأكيد عملية السداد لطلبك رقم [الطلب] ونقوم الآن بتغليفه 📦' },
    { id: 2, title: 'عرض خصم استرجاع السلة', text: 'مرحباً [الاسم]، يسعدنا منحك خصماً خاصاً 10% عبر كود: [الكود] لإتمام طلبك المعلق.' }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');

  // صانع الروابط
  const [linkPhone, setLinkPhone] = useState('');
  const [linkText, setLinkText] = useState('');
  const [createdLink, setCreatedLink] = useState('');

  // الحملات الجماعية الذكية (Broadcast Queue)
  const [broadcastCat, setBroadcastCat] = useState('سلة متروكة');
  const [broadcastText, setBroadcastText] = useState('مرحباً بك، يسعدنا تقديم عرض خاص لك اليوم بمتجرنا.');
  const [broadcastIndex, setBroadcastIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('engazia_whatsapp_pro_crm');
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveContacts = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_whatsapp_pro_crm', JSON.stringify(updated));
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
      category: newCategory,
      status: newStatus,
      amount: Number(newAmount) || 0,
      note: newNote,
      date: new Date().toLocaleDateString('ar-SA')
    };
    saveContacts([newCust, ...contacts]);
    setNewName('');
    setNewPhone('');
    setNewAmount(0);
    setNewNote('');
    alert('تم حفظ العميل في النظام بنجاح!');
  };

  const deleteContact = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      saveContacts(contacts.filter(c => c.id !== id));
    }
  };

  const generateMessage = () => {
    let name = customerName || 'عالمنا الكريم';
    let order = orderNumber || '---';
    let msg = '';

    switch (templateType) {
      case 'confirm':
        msg = `مرحباً بك يا ${name} 👋\nتم تأكيد طلبك رقم (${order}) بنجاح، ونعمل حالياً على تجهيزه وشحنه لك. شكراً لثقتك بمتجرنا 💙`;
        break;
      case 'abandoned':
        msg = `أهلاً بك يا ${name} 😊\nلاحظنا عدم إتمام طلبك رقم (${order}). هل تواجه مشكلة في الدفع؟ نحن هنا لمساعدتك.`;
        break;
      case 'shipping':
        msg = `مرحباً ${name} 📦\nتم تسليم طلبك رقم (${order}) لشركة الشحن، وسيصلك قريباً عبر تفاصيل التتبع.`;
        break;
      case 'payment':
        msg = `مرحباً بك يا ${name} 💳\nلتسهيل إتمام طلبك، يسعدنا تزويدك برابط الدفع السريع: ${extraInfo || '[رابط الدفع]'}`;
        break;
      default:
        msg = `مرحباً ${name}، بخصوص طلبك رقم (${order}). ${extraInfo}`;
    }

    if (includeDiscount) {
      msg += `\n\n🎁 كود خصم خاص لك: *${discountCode}*`;
    }

    setGeneratedMsg(msg);
  };

  const openWhatsApp = (phone: string, text: string) => {
    const clean = formatPhone(phone);
    const url = clean ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const exportToCSV = () => {
    if (contacts.length === 0) return alert('لا توجد بيانات للتصدير.');
    const headers = "الاسم,الجوال,التصنيف,الحالة,إجمالي المشتريات (رس),الملاحظات,التاريخ\n";
    const rows = contacts.map(c => `"${c.name}","${c.phone}","${c.category}","${c.status}",${c.amount},"${c.note}","${c.date}"`).join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "engazia_crm_export.csv";
    link.click();
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesCat = filterCategory === 'all' || c.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const broadcastList = contacts.filter(c => c.category === broadcastCat);

  return (
    <div className="app-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .app-container { background: #f8fafc; color: #0f172a; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 25px 15px 50px; }
        .wrapper { max-width: 1000px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 25px; border: 1px solid #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .back-link { color: #4f46e5; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-block; margin-bottom: 15px; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .title { font-size: 22px; font-weight: 900; color: #0f172a; }
        .desc { color: #64748b; font-size: 13px; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
        .stat-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; text-align: center; }
        .stat-num { font-size: 18px; font-weight: 900; color: #4f46e5; }
        .stat-title { font-size: 11px; color: #64748b; font-weight: 700; }

        .nav-tabs { display: flex; gap: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; overflow-x: auto; }
        .tab-btn { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 12px; color: #475569; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #4f46e5; color: #fff; border-color: #4f46e5; box-shadow: 0 2px 6px rgba(79,70,229,0.2); }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .form-group { margin-bottom: 12px; }
        .form-group label { display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 5px; }
        .form-control { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none; font-family: 'Tajawal', sans-serif; background: #f8fafc; color: #0f172a; font-weight: 700; }
        .form-control:focus { border-color: #4f46e5; background: #fff; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }

        .templates-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 15px; }
        .template-btn { padding: 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer; text-align: center; }
        .template-btn.active { background: #e0e7ff; color: #4f46e5; border-color: #4f46e5; }

        .btn-main { background: #4f46e5; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; width: 100%; transition: background 0.2s; }
        .btn-main:hover { background: #4338ca; }

        .result-box { margin-top: 15px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 10px; }
        .result-content { background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 13px; line-height: 1.6; margin-bottom: 12px; }
        .action-row { display: flex; gap: 8px; }
        .btn-wa { background: #10b981; color: #fff; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 800; font-size: 13px; cursor: pointer; flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .btn-wa:hover { background: #059669; }

        .contacts-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        .contacts-table th, .contacts-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
        .contacts-table th { background: #f1f5f9; color: #334155; font-weight: 800; }
        .badge { padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 800; display: inline-block; }
        .badge-vip { background: #fef3c7; color: #d97706; }
        .badge-new { background: #dbeafe; color: #1d4ed8; }
        .badge-cart { background: #fee2e2; color: #dc2626; }
        .badge-done { background: #dcfce7; color: #15803d; }
        .btn-sm { padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; border: none; }
        .btn-danger { background: #fee2e2; color: #dc2626; }
        .btn-success { background: #dcfce7; color: #15803d; }

        .toolbar { display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap; justify-content: space-between; align-items: center; }
        .toolbar-group { display: flex; gap: 8px; flex: 1; }
        .toolbar input, .toolbar select { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; background: #fff; }

        @media(max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .templates-selector { grid-template-columns: 1fr 1fr; } .stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div className="wrapper">
        <Link href="/hub" className="back-link">← العودة للوحة الرئيسية</Link>
        
        <div className="header-flex">
          <div>
            <h2 className="title">🚀 منصة إنجازيا لعملاء واتساب (PRO MAX)</h2>
            <p className="desc">إدارة العملاء، أتمتة الحملات بطابور ذكي، ومولد الرسائل المتقدم.</p>
          </div>
        </div>

        {/* مؤشرات حية متقدمة */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">إجمالي العملاء</div>
            <div className="stat-num">{contacts.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">عملاء VIP</div>
            <div className="stat-num">{contacts.filter(c => c.category === 'عميل VIP').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">السلال المتروكة</div>
            <div className="stat-num">{contacts.filter(c => c.category === 'سلة متروكة').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">إجمالي المبيعات المسجلة</div>
            <div className="stat-num">{contacts.reduce((acc, c) => acc + c.amount, 0).toLocaleString()} ر.س</div>
          </div>
        </div>

        {/* شريط التنقل الاحترافي (المبسط) */}
        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}>⚡ مولد الرسائل والخصم</button>
          <button className={`tab-btn ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>👥 إدارة العملاء (CRM)</button>
          <button className={`tab-btn ${activeTab === 'broadcast' ? 'active' : ''}`} onClick={() => setActiveTab('broadcast')}>📢 الحملات الذكية</button>
          <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>📋 الردود الجاهزة</button>
          <button className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`} onClick={() => setActiveTab('links')}>🔗 صانع الروابط</button>
        </div>

        {/* 1. مولد الرسائل والخصومات */}
        {activeTab === 'generator' && (
          <div>
            <div className="form-group">
              <label>اختر قالب الحالة التسويقية:</label>
              <div className="templates-selector">
                <button className={`template-btn ${templateType === 'confirm' ? 'active' : ''}`} onClick={() => setTemplateType('confirm')}>✅ تأكيد الطلب</button>
                <button className={`template-btn ${templateType === 'abandoned' ? 'active' : ''}`} onClick={() => setTemplateType('abandoned')}>🛒 السلة المتروكة</button>
                <button className={`template-btn ${templateType === 'shipping' ? 'active' : ''}`} onClick={() => setTemplateType('shipping')}>📦 تتبع الشحنة</button>
                <button className={`template-btn ${templateType === 'payment' ? 'active' : ''}`} onClick={() => setTemplateType('payment')}>💳 رابط الدفع</button>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>اسم العميل</label>
                <input type="text" className="form-control" placeholder="مثال: سلطان" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>رقم جوال العميل</label>
                <input type="text" className="form-control" placeholder="0551234567" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label>رقم الطلب أو الفاتورة</label>
                <input type="text" className="form-control" placeholder="#5421" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} />
              </div>
              <div className="form-group">
                <label>رابط الدفع السريع (اختياري)</label>
                <input type="text" className="form-control" placeholder="https://..." value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="discCheck" checked={includeDiscount} onChange={e => setIncludeDiscount(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }} />
                <label htmlFor="discCheck" style={{ fontSize: '13px', fontWeight: '800', cursor: 'pointer', margin: 0 }}>إرفاق كود خصم تحفيزي مع الرسالة</label>
              </div>
              {includeDiscount && (
                <input type="text" className="form-control" style={{ width: '140px', padding: '6px' }} value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="كود الخصم" />
              )}
            </div>

            <button className="btn-main" onClick={generateMessage}>⚡ توليد وصياغة الرسالة الفورية</button>

            {generatedMsg && (
              <div className="result-box">
                <div className="result-content">{generatedMsg}</div>
                <div className="action-row">
                  <button className="btn-main" onClick={() => { navigator.clipboard.writeText(generatedMsg); alert('تم النسخ بنجاح!'); }}>📋 نسخ النص</button>
                  <button className="btn-wa" onClick={() => openWhatsApp(customerPhone, generatedMsg)}>🟢 مراسلة عبر واتساب</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. إدارة الـ CRM المتقدمة */}
        {activeTab === 'crm' && (
          <div>
            <form onSubmit={addContact} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '900', marginBottom: '10px' }}>➕ تسجيل عميل جديد وحجم المشتريات</h3>
              <div className="form-grid">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="اسم العميل" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="رقم الجوال (05xxxxxxx)" value={newPhone} onChange={e => setNewPhone(e.target.value)} required />
                </div>
                <div className="form-group">
                  <select className="form-control" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                    <option value="عميل جديد">عميل جديد</option>
                    <option value="عميل VIP">عميل VIP 🌟</option>
                    <option value="سلة متروكة">سلة متروكة 🛒</option>
                    <option value="تم التوصيل">تم التوصيل ✅</option>
                  </select>
                </div>
                <div className="form-group">
                  <input type="number" className="form-control" placeholder="إجمالي المشتريات (ر.س)" value={newAmount || ''} onChange={e => setNewAmount(Number(e.target.value))} />
                </div>
              </div>
              <button type="submit" className="btn-main" style={{ padding: '10px' }}>حفظ العميل في قاعدة البيانات</button>
            </form>

            <div className="toolbar">
              <div className="toolbar-group">
                <input type="text" placeholder="🔍 بحث بالاسم أو الجوال..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="all">كل التصنيفات</option>
                  <option value="عميل VIP">عميل VIP</option>
                  <option value="سلة متروكة">سلة متروكة</option>
                  <option value="عميل جديد">عميل جديد</option>
                </select>
              </div>
              <button className="btn-sm btn-success" style={{ padding: '8px 14px' }} onClick={exportToCSV}>📥 تصدير ملف إكسل CSV</button>
            </div>

            {filteredContacts.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '30px' }}>لا توجد بيانات عملاء مسجلة حالياً.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>الجوال</th>
                      <th>التصنيف</th>
                      <th>المشتريات</th>
                      <th>التاريخ</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: '800' }}>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>
                          <span className={`badge ${c.category === 'عميل VIP' ? 'badge-vip' : c.category === 'سلة متروكة' ? 'badge-cart' : 'badge-new'}`}>
                            {c.category}
                          </span>
                        </td>
                        <td style={{ fontWeight: '800', color: '#4f46e5' }}>{c.amount} ر.س</td>
                        <td style={{ color: '#64748b', fontSize: '11px' }}>{c.date}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="btn-sm btn-success" onClick={() => openWhatsApp(c.phone, `مرحباً ${c.name}، معك متجر إنجازيا.`)}>💬 مراسلة</button>
                            <button className="btn-sm btn-danger" onClick={() => deleteContact(c.id)}>حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. الحملات الذكية مع نظام الطابور (Queue) */}
        {activeTab === 'broadcast' && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '10px' }}>📢 الحملات التسويقية والطابور الذكي</h3>
            <div className="form-group">
              <label>اختر الشريحة المستهدفة:</label>
              <select className="form-control" value={broadcastCat} onChange={e => { setBroadcastCat(e.target.value); setBroadcastIndex(0); }}>
                <option value="سلة متروكة">🛒 السلال المتروكة ({contacts.filter(c => c.category === 'سلة متروكة').length})</option>
                <option value="عميل VIP">🌟 عملاء VIP ({contacts.filter(c => c.category === 'عميل VIP').length})</option>
                <option value="عميل جديد">👤 العملاء الجدد ({contacts.filter(c => c.category === 'عميل جديد').length})</option>
              </select>
            </div>
            <div className="form-group">
              <label>نص الرسالة الجماعية:</label>
              <textarea className="form-control" rows={3} value={broadcastText} onChange={e => setBroadcastText(e.target.value)}></textarea>
            </div>

            {broadcastList.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>لا توجد أرقام مسجلة ضمن هذه الشريحة.</p>
            ) : (
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: '800', marginBottom: '10px' }}>
                  العميل الحالي في الطابور: <span style={{ color: '#4f46e5' }}>{broadcastIndex + 1}</span> من {broadcastList.length}
                </p>
                <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px', fontWeight: '900', fontSize: '16px' }}>
                  {broadcastList[broadcastIndex]?.name} ({broadcastList[broadcastIndex]?.phone})
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button className="btn-wa" style={{ flex: 'none', padding: '12px 25px' }} onClick={() => {
                    const current = broadcastList[broadcastIndex];
                    openWhatsApp(current.phone, `مرحباً ${current.name}، ${broadcastText}`);
                  }}>🟢 إرسال للعميل الحالي</button>
                  <button className="btn-main" style={{ flex: 'none', width: 'auto', padding: '12px 25px' }} onClick={() => {
                    if (broadcastIndex < broadcastList.length - 1) setBroadcastIndex(broadcastIndex + 1);
                    else alert('لقد أتممت إرسال الحملة لكافة العملاء في هذه الشريحة!');
                  }}>التالي ⬅️</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. الردود الجاهزة المخصصة */}
        {activeTab === 'templates' && (
          <div>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '900', marginBottom: '10px' }}>➕ إضافة قالب رد سريع جديد</h3>
              <input type="text" className="form-control" placeholder="عنوان القالب (مثال: رد الاستفسار عن الشحن)" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ marginBottom: '8px' }} />
              <textarea className="form-control" rows={2} placeholder="نص الرد..." value={newText} onChange={e => setNewText(e.target.value)} style={{ marginBottom: '8px' }}></textarea>
              <button className="btn-main" onClick={() => {
                if (!newTitle || !newText) return alert('الرجاء إدخال العنوان والنص.');
                setCustomTemplates([...customTemplates, { id: Date.now(), title: newTitle, text: newText }]);
                setNewTitle('');
                setNewText('');
              }} style={{ padding: '8px' }}>حفظ القالب</button>
            </div>
            {customTemplates.map(t => (
              <div key={t.id} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong style={{ fontSize: '13px' }}>{t.title}</strong>
                  <button className="btn-sm btn-success" onClick={() => { navigator.clipboard.writeText(t.text); alert('تم النسخ!'); }}>📋 نسخ</button>
                </div>
                <p style={{ color: '#475569', fontSize: '12px' }}>{t.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* 5. صانع روابط واتساب */}
        {activeTab === 'links' && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '10px' }}>🔗 صانع روابط واتساب المباشرة (لبايو إكس / تيك توك)</h3>
            <div className="form-group">
              <label>رقم جوال المتجر:</label>
              <input type="text" className="form-control" placeholder="0551234567" value={linkPhone} onChange={e => setLinkPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>الرسالة التلقائية التي تظهر للعميل:</label>
              <textarea className="form-control" rows={2} placeholder="أهلاً، أود الاستفسار عن..." value={linkText} onChange={e => setLinkText(e.target.value)}></textarea>
            </div>
            <button className="btn-main" onClick={() => {
              const clean = formatPhone(linkPhone);
              setCreatedLink(`https://wa.me/${clean}?text=${encodeURIComponent(linkText)}`);
            }} style={{ padding: '10px' }}>توليد الرابط المباشر</button>
            {createdLink && (
              <div className="result-box">
                <input type="text" className="form-control" value={createdLink} readOnly style={{ marginBottom: '8px', background: '#fff' }} />
                <button className="btn-main" onClick={() => { navigator.clipboard.writeText(createdLink); alert('تم نسخ الرابط بنجاح!'); }} style={{ padding: '8px' }}>📋 نسخ الرابط النهائي</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
