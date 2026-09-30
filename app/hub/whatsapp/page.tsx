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
  const [activeTab, setActiveTab] = useState<'generator' | 'contacts' | 'templates' | 'linkmaker'>('generator');

  // حالات مولد الرسائل السريع
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [templateType, setTemplateType] = useState('confirm');
  const [extraInfo, setExtraInfo] = useState('');
  const [generatedMsg, setGeneratedMsg] = useState('');

  // حالات إدارة العملاء (CRM)
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('عميل جديد');
  const [newNote, setNewNote] = useState('');

  // قوالب الردود
  const [customTemplates, setCustomTemplates] = useState([
    { id: 1, title: 'تأكيد السداد والبدء بالتجهيز', text: 'أهلاً بك، تم تأكيد عملية السداد بنجاح ونقوم الآن بتغليف طلبك بعناية فائقة 📦' },
    { id: 2, title: 'اعتذار عن تأخير الشحنة', text: 'عذراً على أي تأخير بسيط، شحنتك الآن في الطريق إليك ونتابعها لحظة بلحظة 🚚' }
  ]);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateText, setNewTemplateText] = useState('');

  // منشئ روابط واتساب الذكية
  const [linkPhone, setLinkPhone] = useState('');
  const [linkText, setLinkText] = useState('');
  const [createdLink, setCreatedLink] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('engazia_ultimate_crm');
    if (saved) {
      try { setContacts(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveContacts = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_ultimate_crm', JSON.stringify(updated));
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
    alert('تم حفظ العميل بنجاح في قاعدة بيانات المتجر!');
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
        .wrapper { max-width: 1000px; margin: 0 auto; background: #fff; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .back-link { color: #2563eb; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; margin-bottom: 15px; }
        .title { font-size: 26px; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
        .desc { color: #64748b; font-size: 14px; margin-bottom: 25px; }

        .nav-tabs { display: flex; gap: 8px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 25px; overflow-x: auto; }
        .tab-btn { background: #f1f5f9; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 14px; color: #475569; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #2563eb; color: #fff; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
        .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; }
        .stat-num { font-size: 22px; font-weight: 900; color: #2563eb; margin-top: 5px; }
        .stat-title { font-size: 13px; color: #64748b; font-weight: 700; }

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

        .toolbar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .toolbar input, .toolbar select { flex: 1; min-width: 200px; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; }

        @media(max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .form-group.full { grid-column: span 1; } .toolbar { flex-direction: column; } }
      `}</style>

      <div className="wrapper">
        <Link href="/hub" className="back-link">← العودة للوحة الرئيسية</Link>
        <h2 className="title">🚀 نظام إنجازيا الشامل لإدارة واتساب والمبيعات (ULTRA PRO)</h2>
        <p className="desc">أداة العمل الأولى المدعومة بإدارة العملاء، الردود الذكية، وتوليد روابط التواصل المباشرة.</p>

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
          <button className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}>⚡ مولد الرسائل الذكي</button>
          <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>👥 إدارة العملاء والـ CRM</button>
          <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>📋 الردود الجاهزة المخصصة</button>
          <button className={`tab-btn ${activeTab === 'linkmaker' ? 'active' : ''}`} onClick={() => setActiveTab('linkmaker')}>🔗 صانع روابط واتساب</button>
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
                <input type="text" className="form-control" placeholder="مثال: ناصر القحطاني" value={customerName} onChange={e => setCustomerName(e.target.value)} />
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
                  <button className="btn-main" onClick={() => { navigator.clipboard.writeText(generatedMsg); alert('تم نسخ النص بنجاح!'); }}>📋 نسخ النص</button>
                  <button className="btn-wa" onClick={() => openWhatsApp(customerPhone, generatedMsg)}>🟢 مراسلة عبر واتساب فوراً</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. إدارة العملاء CRM */}
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
                  <input type="text" className="form-control" placeholder="مثال: طلب عطور فرنسية" value={newNote} onChange={e => setNewNote(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-main">حفظ العميل</button>
            </form>

            <div className="toolbar">
              <input type="text" placeholder="🔍 ابحث بالاسم أو رقم الجوال..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="all">جميع التصنيفات</option>
                <option value="عميل VIP">عميل VIP</option>
                <option value="سلة متروكة">سلة متروكة</option>
                <option value="تم التوصيل">تم التوصيل</option>
                <option value="عميل جديد">عميل جديد</option>
              </select>
            </div>

            {filteredContacts.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '30px' }}>لا توجد نتائج مطابقة للبحث أو القائمة فارغة.</p>
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
                            <button className="btn-sm btn-success" onClick={() => openWhatsApp(c.phone, `مرحباً ${c.name}، معك متجر إنجازيا بخصوص طلبك الأخير.`)}>💬 مراسلة</button>
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

        {/* 3. الردود المخصصة */}
        {activeTab === 'templates' && (
          <div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '15px' }}>➕ إضافة قالب رد مخصص جديد</h3>
              <div className="form-group">
                <label>عنوان القالب</label>
                <input type="text" className="form-control" placeholder="مثال: الرد على استفسار المقاسات" value={newTemplateTitle} onChange={e => setNewTemplateTitle(e.target.value)} />
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
                alert('تم حفظ القالب بنجاح!');
              }}>حفظ القالب</button>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              {customTemplates.map(t => (
                <div key={t.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>{t.title}</h4>
                    <button className="btn-sm btn-success" onClick={() => { navigator.clipboard.writeText(t.text); alert('تم نسخ القالب!'); }}>📋 نسخ</button>
                  </div>
                  <p style={{ color: '#475569', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. صانع روابط واتساب */}
        {activeTab === 'linkmaker' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px' }}>🔗 صانع روابط التواصل المباشر</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>أنشئ رابطاً مباشراً لواتساب مع رسالة جاهزة، وضعه في بايو تيك توك، تويتر، أو متجرك.</p>
            
            <div className="form-group">
              <label>رقم جوال المتجر (الاستقبال)</label>
              <input type="text" className="form-control" placeholder="0551234567" value={linkPhone} onChange={e => setLinkPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>الرسالة التلقائية التي ستظهر للعميل عند الضغط على الرابط</label>
              <textarea className="form-control" rows={3} placeholder="مثال: أهلاً متجر إنجازيا، أود الاستفسار عن منتج..." value={linkText} onChange={e => setLinkText(e.target.value)}></textarea>
            </div>
            
            <button className="btn-main" onClick={() => {
              let clean = linkPhone.replace(/\D/g, '');
              if (clean.startsWith('0')) clean = '966' + clean.substring(1);
              const generated = `https://wa.me/${clean}?text=${encodeURIComponent(linkText)}`;
              setCreatedLink(generated);
            }}>إنشاء الرابط المختصر</button>

            {createdLink && (
              <div className="result-box">
                <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>رابطك الجاهز للمشاركة:</p>
                <input type="text" className="form-control" value={createdLink} readOnly style={{ marginBottom: '10px', background: '#fff' }} />
                <button className="btn-main" onClick={() => { navigator.clipboard.writeText(createdLink); alert('تم نسخ الرابط!'); }}>📋 نسخ الرابط المختصر</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
