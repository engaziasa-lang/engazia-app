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
  const [activeTab, setActiveTab] = useState<'generator' | 'contacts' | 'templates' | 'linkmaker' | 'broadcast' | 'tips'>('generator');

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
    const saved = localStorage.getItem('engazia_enterprise_crm');
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveContacts = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_enterprise_crm', JSON.stringify(updated));
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return alert('يرجى إدخال الاسم ورقم الجوال.');
    const newCust: Customer = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone,
      category: newCategory,
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
        msg = `أهلاً بك يا ${name} 😊\nلاحظنا أنك أتممت خطوة إضافية ولم تكمل طلبك رقم (${order}). هل تواجه مشكلة في إتمام الدفع؟ نحن هنا لخدمتك.`;
        break;
      case 'shipping':
        msg = `مرحباً ${name} 📦\nتم تسليم طلبك رقم (${order}) لشركة الشحن، وسيصلك قريباً عبر تفاصيل التتبع المرسلة لبريدك.`;
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
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '966' + clean.substring(1);
    const url = clean ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // تصدير العملاء إلى ملف CSV
  const exportToCSV = () => {
    if (contacts.length === 0) return alert('لا توجد بيانات لتصديرها.');
    const headers = "الاسم,الجوال,التصنيف,الملاحظات,التاريخ\n";
    const rows = contacts.map(c => `"${c.name}","${c.phone}","${c.category}","${c.note}","${c.date}"`).join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "engazia_customers_backup.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        .app-container { background: #f8fafc; color: #0f172a; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 60px; }
        .wrapper { max-width: 1050px; margin: 0 auto; background: #fff; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .back-link { color: #2563eb; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; margin-bottom: 15px; }
        .title { font-size: 26px; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
        .desc { color: #64748b; font-size: 14px; margin-bottom: 25px; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; }
        .stat-num { font-size: 22px; font-weight: 900; color: #2563eb; margin-top: 5px; }
        .stat-title { font-size: 13px; color: #64748b; font-weight: 700; }

        .nav-tabs { display: flex; gap: 8px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 25px; overflow-x: auto; }
        .tab-btn { background: #f1f5f9; border: none; padding: 10px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; color: #475569; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #2563eb; color: #fff; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        .form-group.full { grid-column: span 2; }
        .form-group label { display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .form-control { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none; font-family: 'Tajawal', sans-serif; background: #fff; }
        .form-control:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

        .templates-selector { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px; }
        .template-btn { padding: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 700; font-size: 13px; color: #334155; cursor: pointer; text-align: center; }
        .template-btn.active { background: #eff6ff; color: #2563eb; border-color: #2563eb; }

        .btn-main { background: #2563eb; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; width: 100%; transition: background 0.2s; }
        .btn-main:hover { background: #1d4ed8; }

        .result-box { margin-top: 20px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 20px; border-radius: 12px; }
        .result-content { background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; margin-bottom: 15px; }
        .action-row { display: flex; gap: 10px; }
        .btn-wa { background: #16a34a; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; }

        .contacts-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
        .contacts-table th, .contacts-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; }
        .contacts-table th { background: #f1f5f9; color: #334155; font-weight: 700; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; display: inline-block; }
        .badge-vip { background: #fef3c7; color: #d97706; }
        .badge-new { background: #dbeafe; color: #1d4ed8; }
        .badge-cart { background: #fee2e2; color: #dc2626; }
        .badge-done { background: #dcfce7; color: #15803d; }
        .btn-sm { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; }
        .btn-danger { background: #fee2e2; color: #dc2626; }
        .btn-success { background: #dcfce7; color: #15803d; }

        .toolbar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; justify-content: space-between; align-items: center; }
        .toolbar-group { display: flex; gap: 10px; flex: 1; min-width: 280px; }
        .toolbar input, .toolbar select { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; }

        @media(max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .form-group.full { grid-column: span 1; } .toolbar { flex-direction: column; align-items: stretch; } }
      `}</style>

      <div className="wrapper">
        <Link href="/hub" className="back-link">← العودة للوحة الرئيسية</Link>
        <h2 className="title">🚀 منصة إنجازيا لعملاء واتساب والمبيعات (ULTRA PRO MAX)</h2>
        <p className="desc">النظام السحابي المتكامل الأول لإدارة العملاء، أتمتة رسائل المتاجر، وتوليد الحملات التسويقية.</p>

        {/* مؤشرات حية */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">إجمالي العملاء المحفوظين</div>
            <div className="stat-num">{contacts.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">عملاء VIP المميزون</div>
            <div className="stat-num">{contacts.filter(c => c.category === 'عميل VIP').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">السلال المتروكة للمتابعة</div>
            <div className="stat-num">{contacts.filter(c => c.category === 'سلة متروكة').length}</div>
          </div>
        </div>

        {/* التبويبات */}
        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}>⚡ مولد الرسائل</button>
          <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>👥 إدارة الـ CRM</button>
          <button className={`tab-btn ${activeTab === 'broadcast' ? 'active' : ''}`} onClick={() => setActiveTab('broadcast')}>📢 الحملات الجماعية</button>
          <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>📋 الردود الجاهزة</button>
          <button className={`tab-btn ${activeTab === 'linkmaker' ? 'active' : ''}`} onClick={() => setActiveTab('linkmaker')}>🔗 صانع الروابط</button>
          <button className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>💡 حيل زيادة المبيعات</button>
        </div>

        {/* 1. مولد الرسائل */}
        {activeTab === 'generator' && (
          <div>
            <div className="form-group">
              <label>اختر الحالة التسويقية:</label>
              <div className="templates-selector">
                <button className={`template-btn ${templateType === 'confirm' ? 'active' : ''}`} onClick={() => setTemplateType('confirm')}>✅ تأكيد الطلب</button>
                <button className={`template-btn ${templateType === 'abandoned' ? 'active' : ''}`} onClick={() => setTemplateType('abandoned')}>🛒 السلال المتروكة</button>
                <button className={`template-btn ${templateType === 'shipping' ? 'active' : ''}`} onClick={() => setTemplateType('shipping')}>📦 تتبع الشحنة</button>
                <button className={`template-btn ${templateType === 'payment' ? 'active' : ''}`} onClick={() => setTemplateType('payment')}>💳 رابط الدفع</button>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>اسم العميل</label>
                <input type="text" className="form-control" placeholder="مثال: سلطان العتيبي" value={customerName} onChange={e => setCustomerName(e.target.value)} />
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
                <label>معلومات إضافية / روابط الدفع</label>
                <input type="text" className="form-control" placeholder="رابط الدفع أو تفاصيل إضافية" value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
              </div>
            </div>

            <button className="btn-main" onClick={generateMessage}>توليد وصياغة الرسالة الفورية</button>

            {generatedMsg && (
              <div className="result-box">
                <div className="result-content">{generatedMsg}</div>
                <div className="action-row">
                  <button className="btn-main" onClick={() => { navigator.clipboard.writeText(generatedMsg); alert('تم نسخ النص!'); }}>📋 نسخ النص</button>
                  <button className="btn-wa" onClick={() => openWhatsApp(customerPhone, generatedMsg)}>🟢 مراسلة عبر واتساب فوراً</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. إدارة العملاء CRM مع التصدير */}
        {activeTab === 'contacts' && (
          <div>
            <form onSubmit={addContact} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '15px' }}>➕ تسجيل عميل جديد في قاعدة المتجر</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>اسم العميل</label>
                  <input type="text" className="form-control" placeholder="اسم العميل" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>رقم الجوال</label>
                  <input type="text" className="form-control" placeholder="05xxxxxxxx" value={newPhone} onChange={e => setNewPhone(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>تصنيف العميل</label>
                  <select className="form-control" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                    <option value="عميل جديد">عميل جديد</option>
                    <option value="عميل VIP">عميل VIP 🌟</option>
                    <option value="سلة متروكة">سلة متروكة 🛒</option>
                    <option value="تم التوصيل">تم التوصيل ✅</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ملاحظات المتجر</label>
                  <input type="text" className="form-control" placeholder="مثال: يفضل الشحن السريع" value={newNote} onChange={e => setNewNote(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-main">حفظ العميل</button>
            </form>

            <div className="toolbar">
              <div className="toolbar-group">
                <input type="text" placeholder="🔍 ابحث بالاسم أو الرقم..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="all">جميع التصنيفات</option>
                  <option value="عميل VIP">عميل VIP</option>
                  <option value="سلة متروكة">سلة متروكة</option>
                  <option value="تم التوصيل">تم التوصيل</option>
                  <option value="عميل جديد">عميل جديد</option>
                </select>
              </div>
              <button className="btn-sm btn-success" style={{ padding: '10px 16px', fontWeight: '700' }} onClick={exportToCSV}>📥 تصدير العملاء لملف Excel</button>
            </div>

            {filteredContacts.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '30px' }}>لا توجد بيانات مطابقة.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>الجوال</th>
                      <th>التصنيف</th>
                      <th>الملاحظات</th>
                      <th>التاريخ</th>
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
                        <td style={{ color: '#64748b', fontSize: '13px' }}>{c.note || '---'}</td>
                        <td style={{ fontSize: '12px', color: '#94a3b8' }}>{c.date}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
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

        {/* 3. الحملات الجماعية */}
        {activeTab === 'broadcast' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '10px' }}>📢 أداة استهداف الحملات الجماعية السريعة</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>اختر تصنيفاً من عملائك وراسلهم بنقرة واحدة لتحفيزهم على الشراء أو إتمام السلال المتروكة.</p>
            
            <div className="form-group">
              <label>اختر شريحة العملاء المستهدفة:</label>
              <select className="form-control" value={broadcastCat} onChange={e => setBroadcastCat(e.target.value)}>
                <option value="سلة متروكة">🛒 السلال المتروكة ({contacts.filter(c => c.category === 'سلة متروكة').length})</option>
                <option value="عميل VIP">🌟 عملاء VIP ({contacts.filter(c => c.category === 'عميل VIP').length})</option>
                <option value="عميل جديد">👤 عملاء جدد ({contacts.filter(c => c.category === 'عميل جديد').length})</option>
              </select>
            </div>

            <div className="form-group">
              <label>نص الحملة التسويقية الموحدة:</label>
              <textarea className="form-control" rows={4} value={broadcastText} onChange={e => setBroadcastText(e.target.value)}></textarea>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '15px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px' }}>العملاء في هذه الشريحة المتاحة للمراسلة:</h4>
              {contacts.filter(c => c.category === broadcastCat).length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px' }}>لا يوجد عملاء مسجلون تحت هذا التصنيف حالياً.</p>
              ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {contacts.filter(c => c.category === broadcastCat).map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div>
                        <strong style={{ fontSize: '14px' }}>{c.name}</strong>
                        <span style={{ color: '#64748b', fontSize: '13px', marginRight: '10px' }}>({c.phone})</span>
                      </div>
                      <button className="btn-sm btn-success" onClick={() => openWhatsApp(c.phone, `مرحباً ${c.name}، ${broadcastText}`)}>🟢 إرسال الحملة فوراً</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. الردود الجاهزة */}
        {activeTab === 'templates' && (
          <div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '15px' }}>➕ إضافة قالب رد مخصص</h3>
              <div className="form-group">
                <label>عنوان القالب</label>
                <input type="text" className="form-control" placeholder="مثال: خصم خاص 10%" value={newTemplateTitle} onChange={e => setNewTemplateTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label>نص الرسالة</label>
                <textarea className="form-control" rows={3} placeholder="اكتب نص الرد هنا..." value={newTemplateText} onChange={e => setNewTemplateText(e.target.value)}></textarea>
              </div>
              <button className="btn-main" onClick={() => {
                if (!newTemplateTitle || !newTemplateText) return alert('يرجى ملء الحقول.');
                setCustomTemplates([...customTemplates, { id: Date.now(), title: newTemplateTitle, text: newTemplateText }]);
                setNewTemplateTitle('');
                setNewTemplateText('');
                alert('تم الحفظ!');
              }}>حفظ القالب</button>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              {customTemplates.map(t => (
                <div key={t.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>{t.title}</h4>
                    <button className="btn-sm btn-success" onClick={() => { navigator.clipboard.writeText(t.text); alert('تم النسخ!'); }}>📋 نسخ</button>
                  </div>
                  <p style={{ color: '#475569', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. صانع الروابط */}
        {activeTab === 'linkmaker' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px' }}>🔗 صانع روابط التواصل المباشر</h3>
            <div className="form-group">
              <label>رقم جوال المتجر</label>
              <input type="text" className="form-control" placeholder="0551234567" value={linkPhone} onChange={e => setLinkPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>الرسالة التلقائية للعميل</label>
              <textarea className="form-control" rows={3} placeholder="أهلاً، أود الاستفسار عن منتجاتكم..." value={linkText} onChange={e => setLinkText(e.target.value)}></textarea>
            </div>
            <button className="btn-main" onClick={() => {
              let clean = linkPhone.replace(/\D/g, '');
              if (clean.startsWith('0')) clean = '966' + clean.substring(1);
              setCreatedLink(`https://wa.me/${clean}?text=${encodeURIComponent(linkText)}`);
            }}>إنشاء الرابط</button>

            {createdLink && (
              <div className="result-box">
                <input type="text" className="form-control" value={createdLink} readOnly style={{ marginBottom: '10px', background: '#fff' }} />
                <button className="btn-main" onClick={() => { navigator.clipboard.writeText(createdLink); alert('تم النسخ!'); }}>📋 نسخ الرابط المختصر</button>
              </div>
            )}
          </div>
        )}

        {/* 6. حيل زيادة المبيعات */}
        {activeTab === 'tips' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px' }}>💡 أسرار وحيل لزيادة مبيعات المتجر عبر واتساب</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <h4 style={{ color: '#2563eb', fontWeight: '800', marginBottom: '8px' }}>1. قاعدة الـ 15 دقيقة للسلال المتروكة</h4>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>عندما يترك العميل السلة، تواصل معه عبر واتساب خلال 15 دقيقة برسالة لطيفة تقدم فيها مساعدة أو شحناً مجانياً؛ هذا يرفع نسبة إتمام الشراء بأكثر من 45%!</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <h4 style={{ color: '#2563eb', fontWeight: '800', marginBottom: '8px' }}>2. تخصيص عملاء الـ VIP</h4>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>صنف العملاء الذين اشتروا أكثر من مرتين كـ (VIP) وارسض لهم عروضاً حصرية مبكرة؛ هؤلاء هم سر الاستدامة والربح السريع لمتجرك.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
