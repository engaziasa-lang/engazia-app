'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  phone: string;
  category: string;
  status: string;
  note: string;
  date: string;
}

export default function WhatsAppUltimatePage() {
  const [activeTab, setActiveTab] = useState<'generator' | 'contacts' | 'broadcast' | 'templates' | 'linkmaker' | 'promos' | 'tips'>('generator');

  // مولد الرسائل
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [templateType, setTemplateType] = useState('confirm');
  const [extraInfo, setExtraInfo] = useState('');
  const [generatedMsg, setGeneratedMsg] = useState('');

  // CRM العملاء
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('عميل جديد');
  const [newStatus, setNewStatus] = useState('قيد المتابعة');
  const [newNote, setNewNote] = useState('');

  // الردود الجاهزة
  const [customTemplates, setCustomTemplates] = useState([
    { id: 1, title: 'تأكيد السداد والبدء بالتجهيز', text: 'أهلاً بك [الاسم]، تم تأكيد عملية السداد لطلبك رقم [الطلب] ونقوم الآن بتغليفه 📦' },
    { id: 2, title: 'عرض خصم استرجاع السلة', text: 'مرحباً [الاسم]، يسعدنا منحك خصماً خاصاً 10% لإتمام طلبك المعلق عبر الرابط التالي: [الرابط]' }
  ]);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateText, setNewTemplateText] = useState('');

  // صانع الروابط
  const [linkPhone, setLinkPhone] = useState('');
  const [linkText, setLinkText] = useState('');
  const [createdLink, setCreatedLink] = useState('');

  // الحملات
  const [broadcastCat, setBroadcastCat] = useState('سلة متروكة');
  const [broadcastText, setBroadcastText] = useState('مرحباً بك، يسعدنا تقديم شحن مجاني لك اليوم لإتمام طلبك المعلق بمتجرنا.');

  // مولد أكواد الخصم
  const [promoName, setPromoName] = useState('سلطان');
  const [discountCode, setDiscountCode] = useState('ENGAZIA10');
  const [promoMsg, setPromoMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('engazia_ultramax_crm');
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveContacts = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_ultramax_crm', JSON.stringify(updated));
  };

  const formatPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '966' + clean.substring(1);
    return clean;
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return alert('أدخل الاسم والرقم.');
    const newCust: Customer = {
      id: Date.now().toString(),
      name: newName,
      phone: formatPhone(newPhone),
      category: newCategory,
      status: newStatus,
      note: newNote,
      date: new Date().toLocaleDateString('ar-SA')
    };
    saveContacts([newCust, ...contacts]);
    setNewName('');
    setNewPhone('');
    setNewNote('');
    alert('تم حفظ العميل بنجاح!');
  };

  const deleteContact = (id: string) => {
    if (confirm('حذف هذا العميل؟')) {
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
        msg = `مرحباً بك يا ${name} 💳\nلتسهيل إتمام طلبك رقم (${order})، يسعدنا تزويدك برابط الدفع: ${extraInfo || '[رابط الدفع]'}`;
        break;
      default:
        msg = `مرحباً ${name}، بخصوص طلبك رقم (${order}). ${extraInfo}`;
    }
    setGeneratedMsg(msg);
  };

  const openWhatsApp = (phone: string, text: string) => {
    const clean = formatPhone(phone);
    const url = clean ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const exportToCSV = () => {
    if (contacts.length === 0) return alert('لا توجد بيانات.');
    const headers = "الاسم,الجوال,التصنيف,الحالة,الملاحظات,التاريخ\n";
    const rows = contacts.map(c => `"${c.name}","${c.phone}","${c.category}","${c.status}","${c.note}","${c.date}"`).join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "engazia_crm_backup.csv";
    link.click();
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesCat = filterCategory === 'all' || c.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="app-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .app-container { background: #f8fafc; color: #0f172a; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px 15px 40px; }
        .wrapper { max-width: 950px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .back-link { color: #2563eb; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-block; margin-bottom: 12px; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
        .title { font-size: 22px; font-weight: 900; color: #0f172a; }
        .desc { color: #64748b; font-size: 13px; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; text-align: center; }
        .stat-num { font-size: 18px; font-weight: 900; color: #2563eb; }
        .stat-title { font-size: 11px; color: #64748b; font-weight: 700; }

        .nav-tabs { display: flex; gap: 5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; overflow-x: auto; }
        .tab-btn { background: #f1f5f9; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 12px; color: #475569; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #2563eb; color: #fff; box-shadow: 0 2px 6px rgba(37,99,235,0.2); }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .form-group { margin-bottom: 12px; }
        .form-group label { display: block; font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 5px; }
        .form-control { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none; font-family: 'Tajawal', sans-serif; background: #fff; }
        .form-control:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

        .templates-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 15px; }
        .template-btn { padding: 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer; text-align: center; }
        .template-btn.active { background: #eff6ff; color: #2563eb; border-color: #2563eb; }

        .btn-main { background: #2563eb; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; width: 100%; transition: background 0.2s; }
        .btn-main:hover { background: #1d4ed8; }

        .result-box { margin-top: 15px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 10px; }
        .result-content { background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 13px; line-height: 1.5; margin-bottom: 12px; }
        .action-row { display: flex; gap: 8px; }
        .btn-wa { background: #16a34a; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer; flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; }

        .contacts-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        .contacts-table th, .contacts-table td { padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; }
        .contacts-table th { background: #f1f5f9; color: #334155; font-weight: 700; }
        .badge { padding: 3px 6px; border-radius: 12px; font-size: 10px; font-weight: 700; display: inline-block; }
        .badge-vip { background: #fef3c7; color: #d97706; }
        .badge-new { background: #dbeafe; color: #1d4ed8; }
        .badge-cart { background: #fee2e2; color: #dc2626; }
        .badge-done { background: #dcfce7; color: #15803d; }
        .btn-sm { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; border: none; }
        .btn-danger { background: #fee2e2; color: #dc2626; }
        .btn-success { background: #dcfce7; color: #15803d; }

        .toolbar { display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap; justify-content: space-between; align-items: center; }
        .toolbar-group { display: flex; gap: 8px; flex: 1; }
        .toolbar input, .toolbar select { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; }

        @media(max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .templates-selector { grid-template-columns: 1fr 1fr; } .stats-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="wrapper">
        <Link href="/hub" className="back-link">← العودة للوحة الرئيسية</Link>
        
        <div className="header-flex">
          <div>
            <h2 className="title">🚀 منصة إنجازيا لعملاء واتساب (ULTRA PRO MAX 2.0)</h2>
            <p className="desc">إدارة العملاء المتقدمة، أكواد الخصم السريعة، وأتمتة المبيعات.</p>
          </div>
        </div>

        {/* مؤشرات حية */}
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
        </div>

        {/* التبويبات */}
        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}>⚡ مولد الرسائل</button>
          <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>👥 إدارة الـ CRM</button>
          <button className={`tab-btn ${activeTab === 'promos' ? 'active' : ''}`} onClick={() => setActiveTab('promos')}>🏷️ أكواد الخصم</button>
          <button className={`tab-btn ${activeTab === 'broadcast' ? 'active' : ''}`} onClick={() => setActiveTab('broadcast')}>📢 الحملات</button>
          <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>📋 الردود</button>
          <button className={`tab-btn ${activeTab === 'linkmaker' ? 'active' : ''}`} onClick={() => setActiveTab('linkmaker')}>🔗 الروابط</button>
          <button className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>💡 الأسرار</button>
        </div>

        {/* 1. مولد الرسائل */}
        {activeTab === 'generator' && (
          <div>
            <div className="form-group">
              <label>اختر الحالة التسويقية:</label>
              <div className="templates-selector">
                <button className={`template-btn ${templateType === 'confirm' ? 'active' : ''}`} onClick={() => setTemplateType('confirm')}>✅ تأكيد الطلب</button>
                <button className={`template-btn ${templateType === 'abandoned' ? 'active' : ''}`} onClick={() => setTemplateType('abandoned')}>🛒 السلال المتروكة</button>
                <button className={`template-btn ${templateType === 'shipping' ? 'active' : ''}`} onClick={() => setTemplateType('shipping')}>📦 الشحنة</button>
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
                <label>رابط الدفع السريع</label>
                <input type="text" className="form-control" placeholder="https://salla.sa/..." value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
              </div>
            </div>

            <button className="btn-main" onClick={generateMessage}>توليد وصياغة الرسالة الفورية</button>

            {generatedMsg && (
              <div className="result-box">
                <div className="result-content">{generatedMsg}</div>
                <div className="action-row">
                  <button className="btn-main" onClick={() => { navigator.clipboard.writeText(generatedMsg); alert('تم النسخ!'); }}>📋 نسخ</button>
                  <button className="btn-wa" onClick={() => openWhatsApp(customerPhone, generatedMsg)}>🟢 مراسلة فورية</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. إدارة العملاء CRM */}
        {activeTab === 'contacts' && (
          <div>
            <form onSubmit={addContact} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '10px' }}>➕ إضافة عميل جديد وحالته</h3>
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
                  <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                    <option value="قيد المتابعة">قيد المتابعة</option>
                    <option value="تم التواصل وإرسال العرض">تم التواصل وإرسال العرض</option>
                    <option value="تم إتمام الشراء بنجاح">تم إتمام الشراء 🎉</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-main" style={{ padding: '8px' }}>حفظ العميل في الـ CRM</button>
            </form>

            <div className="toolbar">
              <div className="toolbar-group">
                <input type="text" placeholder="🔍 بحث بالاسم أو الرقم..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="all">كل التصنيفات</option>
                  <option value="عميل VIP">عميل VIP</option>
                  <option value="سلة متروكة">سلة متروكة</option>
                </select>
              </div>
              <button className="btn-sm btn-success" style={{ padding: '8px 12px' }} onClick={exportToCSV}>📥 تصدير إكسل</button>
            </div>

            {filteredContacts.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>لا توجد بيانات مسجلة.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>الجوال</th>
                      <th>التصنيف</th>
                      <th>حالة المتابعة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: '700' }}>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>
                          <span className={`badge ${c.category === 'عميل VIP' ? 'badge-vip' : c.category === 'سلة متروكة' ? 'badge-cart' : 'badge-new'}`}>
                            {c.category}
                          </span>
                        </td>
                        <td style={{ color: '#475569', fontSize: '11px', fontWeight: '700' }}>{c.status}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="btn-sm btn-success" onClick={() => openWhatsApp(c.phone, `مرحباً ${c.name}، معك متجر إنجازيا بخصوص طلبك.`)}>💬 مراسلة</button>
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

        {/* 3. مولد أكواد الخصم */}
        {activeTab === 'promos' && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>🏷️ مولد رسائل أكواد الخصم السريعة</h3>
            <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '15px' }}>أنشئ رسالة مخصصة مع كود خصم فوري لإرسالها للعملاء المترددين.</p>
            <div className="form-group">
              <label>اسم العميل:</label>
              <input type="text" className="form-control" value={promoName} onChange={e => setPromoName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>كود الخصم:</label>
              <input type="text" className="form-control" value={discountCode} onChange={e => setDiscountCode(e.target.value)} />
            </div>
            <button className="btn-main" onClick={() => {
              setPromoMsg(`أهلاً بك يا ${promoName} 🌟\nيسعدنا منحك خصماً خاصاً بقيمة 10% عبر استخدام الكود الحصري التالي في متجرنا:\n🎟️ كود الخصم: *${discountCode}*\nنتطلع بخدمتك دائماً!`);
            }} style={{ padding: '8px' }}>توليد رسالة الخصم</button>

            {promoMsg && (
              <div className="result-box">
                <div className="result-content">{promoMsg}</div>
                <button className="btn-wa" onClick={() => openWhatsApp('', promoMsg)}>🟢 مشاركة عبر واتساب</button>
              </div>
            )}
          </div>
        )}

        {/* 4. الحملات الجماعية */}
        {activeTab === 'broadcast' && (
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>📢 الحملات التسويقية السريعة</h3>
            <div className="form-group">
              <label>الشريحة المستهدفة:</label>
              <select className="form-control" value={broadcastCat} onChange={e => setBroadcastCat(e.target.value)}>
                <option value="سلة متروكة">🛒 السلال المتروكة ({contacts.filter(c => c.category === 'سلة متروكة').length})</option>
                <option value="عميل VIP">🌟 عملاء VIP ({contacts.filter(c => c.category === 'عميل VIP').length})</option>
              </select>
            </div>
            <div className="form-group">
              <label>نص الحملة:</label>
              <textarea className="form-control" rows={3} value={broadcastText} onChange={e => setBroadcastText(e.target.value)}></textarea>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
              {contacts.filter(c => c.category === broadcastCat).length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '12px' }}>لا توجد أرقام في هذه الشريحة.</p>
              ) : (
                contacts.filter(c => c.category === broadcastCat).map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{c.name} ({c.phone})</span>
                    <button className="btn-sm btn-success" onClick={() => openWhatsApp(c.phone, `مرحباً ${c.name}، ${broadcastText}`)}>🟢 إرسال</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 5. الردود الجاهزة */}
        {activeTab === 'templates' && (
          <div>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #cbd5e1' }}>
              <input type="text" className="form-control" placeholder="عنوان القالب" value={newTemplateTitle} onChange={e => setNewTemplateTitle(e.target.value)} style={{ marginBottom: '8px' }} />
              <textarea className="form-control" rows={2} placeholder="نص الرد..." value={newTemplateText} onChange={e => setNewTemplateText(e.target.value)} style={{ marginBottom: '8px' }}></textarea>
              <button className="btn-main" onClick={() => {
                if (!newTemplateTitle || !newTemplateText) return alert('املأ الحقول.');
                setCustomTemplates([...customTemplates, { id: Date.now(), title: newTemplateTitle, text: newTemplateText }]);
                setNewTemplateTitle('');
                setNewTemplateText('');
              }} style={{ padding: '8px' }}>حفظ القالب</button>
            </div>
            {customTemplates.map(t => (
              <div key={t.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong>{t.title}</strong>
                  <button className="btn-sm btn-success" onClick={() => { navigator.clipboard.writeText(t.text); alert('تم النسخ!'); }}>📋 نسخ</button>
                </div>
                <p style={{ color: '#475569', fontSize: '13px' }}>{t.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* 6. صانع الروابط */}
        {activeTab === 'linkmaker' && (
          <div>
            <div className="form-group">
              <label>رقم جوال المتجر:</label>
              <input type="text" className="form-control" placeholder="0551234567" value={linkPhone} onChange={e => setLinkPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>رسالة العميل التلقائية:</label>
              <textarea className="form-control" rows={2} placeholder="أهلاً، أود الاستفسار..." value={linkText} onChange={e => setLinkText(e.target.value)}></textarea>
            </div>
            <button className="btn-main" onClick={() => {
              const clean = formatPhone(linkPhone);
              setCreatedLink(`https://wa.me/${clean}?text=${encodeURIComponent(linkText)}`);
            }} style={{ padding: '8px' }}>توليد الرابط</button>
            {createdLink && (
              <div className="result-box">
                <input type="text" className="form-control" value={createdLink} readOnly style={{ marginBottom: '8px', background: '#fff' }} />
                <button className="btn-main" onClick={() => { navigator.clipboard.writeText(createdLink); alert('تم النسخ!'); }} style={{ padding: '6px' }}>📋 نسخ الرابط</button>
              </div>
            )}
          </div>
        )}

        {/* 7. أسرار المبيعات */}
        {activeTab === 'tips' && (
          <div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px' }}>
              <h4 style={{ color: '#2563eb', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>استراتيجية متابعة السلال المتروكة</h4>
              <p style={{ color: '#475569', fontSize: '12px' }}>استخدام كود خصم فوري (مثل 10%) عبر واتساب يرفع نسبة تحويل العميل المتردد من 5% إلى أكثر من 35%.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
