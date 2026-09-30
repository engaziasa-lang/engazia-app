'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  phone: string;
  category: string;
  note: string;
  date: string;
}

export default function WhatsAppUltimatePage() {
  const [activeTab, setActiveTab] = useState<'generator' | 'contacts' | 'broadcast' | 'templates' | 'linkmaker' | 'tips'>('generator');

  // مولد الرسائل
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [templateType, setTemplateType] = useState('confirm');
  const [extraInfo, setExtraInfo] = useState('');
  const [generatedMsg, setGeneratedMsg] = useState('');

  // قاعدة بيانات العملاء CRM
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('عميل جديد');
  const [newNote, setNewNote] = useState('');

  // الردود الجاهزة
  const [customTemplates, setCustomTemplates] = useState([
    { id: 1, title: 'تأكيد السداد والبدء بالتجهيز', text: 'أهلاً بك، تم تأكيد عملية السداد بنجاح ونقوم الآن بتغليف طلبك بعناية فائقة 📦' },
    { id: 2, title: 'اعتذار عن تأخير الشحنة', text: 'عذراً على أي تأخير بسيط، شحنتك الآن في الطريق إليك ونتابعها لحظة بلحظة 🚚' }
  ]);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateText, setNewTemplateText] = useState('');

  // صانع الروابط
  const [linkPhone, setLinkPhone] = useState('');
  const [linkText, setLinkText] = useState('');
  const [createdLink, setCreatedLink] = useState('');

  // الحملات الجماعية
  const [broadcastCat, setBroadcastCat] = useState('سلة متروكة');
  const [broadcastText, setBroadcastText] = useState('مرحباً بك، لاحظنا عدم إتمام طلبك الأخير في متجرنا. هل ترغب بمساعدتنا لك؟');

  useEffect(() => {
    const saved = localStorage.getItem('engazia_compact_crm');
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveContacts = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_compact_crm', JSON.stringify(updated));
  };

  const formatPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '966' + clean.substring(1);
    return clean;
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return alert('يرجى إدخال الاسم ورقم الجوال.');
    const newCust: Customer = {
      id: Date.now().toString(),
      name: newName,
      phone: formatPhone(newPhone),
      category: newCategory,
      note: newNote,
      date: new Date().toLocaleDateString('ar-SA')
    };
    saveContacts([newCust, ...contacts]);
    setNewName('');
    setNewPhone('');
    setNewNote('');
    alert('تم حفظ العميل وتنسيق رقمه بنجاح!');
  };

  const deleteContact = (id: string) => {
    if (confirm('هل أنت متأكد من الحذف؟')) {
      saveContacts(contacts.filter(c => c.id !== id));
    }
  };

  const generateMessage = () => {
    let name = customerName || 'عالمنا الكريم';
    let order = orderNumber || '---';
    let msg = '';

    switch (templateType) {
      case 'confirm':
        msg = `مرحباً بك يا ${name} 👋\nيسعدنا اختيارك لمتجرنا! تم تأكيد طلبك رقم (${order}) بنجاح، ونعمل حالياً على تجهيزه وشحنه لك بأسرع وقت. شكراً لثقتك 💙`;
        break;
      case 'abandoned':
        msg = `أهلاً بك يا ${name} 😊\nلاحظنا عدم إتمام طلبك رقم (${order}). هل تواجه مشكلة في إتمام الدفع؟ نحن هنا لخدمتك عبر متجرنا.`;
        break;
      case 'shipping':
        msg = `مرحباً ${name} 📦\nتم تسليم طلبك رقم (${order}) لشركة الشحن، وسيصلك قريباً عبر تفاصيل التتبع.`;
        break;
      case 'payment':
        msg = `مرحباً بك يا ${name} 💳\nلتسهيل إتمام طلبك رقم (${order})، يسعدنا تزويدك برابط الدفع السريع: ${extraInfo || '[رابط الدفع]'}`;
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
    if (contacts.length === 0) return alert('لا توجد بيانات لتصديرها.');
    const headers = "الاسم,الجوال,التصنيف,الملاحظات,التاريخ\n";
    const rows = contacts.map(c => `"${c.name}","${c.phone}","${c.category}","${c.note}","${c.date}"`).join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "engazia_customers.csv";
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

        /* مؤشرات مصغرة وأنيقة */
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; text-align: center; }
        .stat-num { font-size: 18px; font-weight: 900; color: #2563eb; }
        .stat-title { font-size: 11px; color: #64748b; font-weight: 700; }

        /* تبويبات مدمجة */
        .nav-tabs { display: flex; gap: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; overflow-x: auto; }
        .tab-btn { background: #f1f5f9; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 12px; color: #475569; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
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

        .contacts-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
        .contacts-table th, .contacts-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; }
        .contacts-table th { background: #f1f5f9; color: #334155; font-weight: 700; }
        .badge { padding: 3px 8px; border-radius: 15px; font-size: 10px; font-weight: 700; display: inline-block; }
        .badge-vip { background: #fef3c7; color: #d97706; }
        .badge-new { background: #dbeafe; color: #1d4ed8; }
        .badge-cart { background: #fee2e2; color: #dc2626; }
        .badge-done { background: #dcfce7; color: #15803d; }
        .btn-sm { padding: 5px 10px; border-radius: 5px; font-size: 11px; font-weight: 700; cursor: pointer; border: none; }
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
            <h2 className="title">🚀 منصة إنجازيا لعملاء واتساب (PRO MAX)</h2>
            <p className="desc">إدارة العملاء، أتمتة الرسائل، وتنسيق الأرقام بذكاء.</p>
          </div>
        </div>

        {/* مؤشرات حية مصغرة */}
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

        {/* التبويبات المدمجة */}
        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}>⚡ مولد الرسائل</button>
          <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>👥 إدارة الـ CRM</button>
          <button className={`tab-btn ${activeTab === 'broadcast' ? 'active' : ''}`} onClick={() => setActiveTab('broadcast')}>📢 الحملات</button>
          <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>📋 الردود الجاهزة</button>
          <button className={`tab-btn ${activeTab === 'linkmaker' ? 'active' : ''}`} onClick={() => setActiveTab('linkmaker')}>🔗 صانع الروابط</button>
          <button className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>💡 أسرار المبيعات</button>
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
              <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '10px' }}>➕ إضافة عميل جديد</h3>
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
                  <input type="text" className="form-control" placeholder="ملاحظات (اختياري)" value={newNote} onChange={e => setNewNote(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-main" style={{ padding: '8px' }}>حفظ العميل</button>
            </form>

            <div className="toolbar">
              <div className="toolbar-group">
                <input type="text" placeholder="🔍 بحث بالاسم أو الرقم..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="all">كل التصنيفات</option>
                  <option value="عميل VIP">عميل VIP</option>
                  <option value="سلة متروكة">سلة متروكة</option>
                  <option value="تم التوصيل">تم التوصيل</option>
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
                      <th>الملاحظات</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: '700' }}>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>
                          <span className={`badge ${c.category === 'عميل VIP' ? 'badge-vip' : c.category === 'سلة متروكة' ? 'badge-cart' : c.category === 'تم التوصيل' ? 'badge-done' : 'badge-new'}`}>
                            {c.category}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '12px' }}>{c.note || '---'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
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

        {/* 3. الحملات الجماعية */}
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

        {/* 4. الردود الجاهزة */}
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

        {/* 5. صانع الروابط */}
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

        {/* 6. أسرار المبيعات */}
        {activeTab === 'tips' && (
          <div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px' }}>
              <h4 style={{ color: '#2563eb', fontWeight: '800', fontSize: '13px', marginBottom: '4px' }}>قاعدة الـ 15 دقيقة للسلال المتروكة</h4>
              <p style={{ color: '#475569', fontSize: '12px' }}>مراسلة العميل خلال 15 دقيقة من ترك السلة ترفع نسبة إتمام الشراء بأكثر من 45%.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
