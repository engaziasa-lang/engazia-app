'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  phone: string;
  category: string;
  note: string;
}

export default function WhatsAppProPage() {
  const [activeTab, setActiveTab] = useState<'generator' | 'contacts' | 'templates'>('generator');

  // حالات المولد السريع
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [templateType, setTemplateType] = useState('confirm');
  const [extraInfo, setExtraInfo] = useState('');
  const [generatedMsg, setGeneratedMsg] = useState('');

  // حالات قاعدة بيانات العملاء (تُحفظ في المتصفح تلقائياً)
  const [contacts, setContacts] = useState<Customer[]>([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('عميل جديد');
  const [newNote, setNewNote] = useState('');

  // قوالب الردود المخصصة
  const [customTemplates, setCustomTemplates] = useState([
    { id: 1, title: 'تأكيد السداد والبدء بالتجهيز', text: 'أهلاً بك، تم تأكيد عملية السداد بنجاح ونقوم الآن بتغليف طلبك بعناية فائقة 📦' },
    { id: 2, title: 'اعتذار عن تأخير الشحنة', text: 'عذراً على أي تأخير بسيط، شحنتك الآن في الطريق إليك ونتابعها لحظة بلحظة 🚚' }
  ]);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateText, setNewTemplateText] = useState('');

  useEffect(() => {
    const savedContacts = localStorage.getItem('engazia_whatsapp_contacts');
    if (savedContacts) {
      try { setContacts(JSON.parse(savedContacts)); } catch (e) {}
    }
  }, []);

  const saveContactsToStorage = (updated: Customer[]) => {
    setContacts(updated);
    localStorage.setItem('engazia_whatsapp_contacts', JSON.stringify(updated));
  };

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return alert('يرجى إدخال الاسم ورقم الجوال على الأقل.');
    const newCust: Customer = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone,
      category: newCategory,
      note: newNote
    };
    saveContactsToStorage([newCust, ...contacts]);
    setNewName('');
    setNewPhone('');
    setNewNote('');
    alert('تم حفظ العميل وتصنيفه بنجاح!');
  };

  const deleteContact = (id: string) => {
    const filtered = contacts.filter(c => c.id !== id);
    saveContactsToStorage(filtered);
  };

  const generateMessage = () => {
    let name = customerName || 'عالمنا الكريم';
    let order = orderNumber || '---';
    let msg = '';

    switch (templateType) {
      case 'confirm':
        msg = `مرحباً بك يا ${name} 👋\nيسعدنا جداً اختيارك لنا! تم تأكيد طلبك رقم (${order}) بنجاح، ونعمل حالياً على تجهيزه وشحنه لك بأسرع وقت. شكراً لثقتك بنا 💙`;
        break;
      case 'abandoned':
        msg = `أهلاً بك يا ${name} 😊\nلاحظنا أنك أتممت خطوة إضافية ولم تكمل طلبك رقم (${order}). هل تواجه أي مشكلة في إتمام الدفع؟ نحن هنا لمساعدتك عبر المتجر.`;
        break;
      case 'shipping':
        msg = `مرحباً ${name} 📦\nتم تسليم طلبك رقم (${order}) لشركة الشحن المختصة، وسيثري وصوله إليك خلال الأيام القادمة عبر تفاصيل التتبع المرسلة لبريدك.`;
        break;
      case 'payment':
        msg = `مرحباً بك يا ${name} 💳\nلتسهيل إتمام طلبك رقم (${order})، يسعدنا تزويدك برابط الدفع السريع المباشر: ${extraInfo || '[رابط الدفع]'}\nننتظر تأكيدك لنشرع بالتجهيز فوراً!`;
        break;
      default:
        msg = `مرحباً ${name}، بخصوص طلبك رقم (${order}). ${extraInfo}`;
    }
    setGeneratedMsg(msg);
  };

  const openWhatsApp = (phone: string, text: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '966' + cleanPhone.substring(1);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pro-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .pro-container { background: #f8fafc; color: #0f172a; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 60px; }
        .wrapper { max-width: 950px; margin: 0 auto; background: #fff; border-radius: 20px; padding: 30px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .back-link { color: #2563eb; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; margin-bottom: 15px; }
        .title { font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 5px; }
        .desc { color: #64748b; font-size: 14px; margin-bottom: 25px; }
        
        .nav-tabs { display: flex; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 25px; overflow-x: auto; }
        .tab-btn { background: #f1f5f9; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 14px; color: #475569; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: #2563eb; color: #fff; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        .form-group.full { grid-column: span 2; }
        .form-group label { display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px; }
        .form-control { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none; font-family: 'Tajawal', sans-serif; }
        .form-control:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

        .templates-selector { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px; }
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

        @media(max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .form-group.full { grid-column: span 1; } }
      `}</style>

      <div className="wrapper">
        <Link href="/hub" className="back-link">← العودة للوحة الرئيسية</Link>
        <h2 className="title">💬 منصة إنجازيا لعملاء واتساب والتصنيفات (PRO)</h2>
        <p className="desc">أدر عملاءك، أرقامهم، قوالب ردودك، وصنفهم باحترافية تامة للبيع المباشر.</p>

        {/* أزرار التنقل بين الأقسام */}
        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`} onClick={() => setActiveTab('generator')}>⚡ مولد الرسائل السريع</button>
          <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>👥 إدارة العملاء والأرقام ({contacts.length})</button>
          <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>📋 الردود الجاهزة المخصصة</button>
        </div>

        {/* القسم الأول: مولد الرسائل */}
        {activeTab === 'generator' && (
          <div>
            <div className="form-group">
              <label>اختر القالب التسويقي:</label>
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
                <input type="text" className="form-control" placeholder="مثال: ركان المطيري" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>رقم الجوال (لفتح الواتساب مباشرة)</label>
                <input type="text" className="form-control" placeholder="0551234567" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label>رقم الطلب</label>
                <input type="text" className="form-control" placeholder="#9920" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} />
              </div>
              <div className="form-group">
                <label>معلومات إضافية / روابط</label>
                <input type="text" className="form-control" placeholder="رابط الدفع السريع أو تفاصيل الشحن" value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
              </div>
            </div>

            <button className="btn-main" onClick={generateMessage}>توليد وصياغة الرسالة الاحترافية</button>

            {generatedMsg && (
              <div className="result-box">
                <div className="result-content">{generatedMsg}</div>
                <div className="action-row">
                  <button className="btn-main" onClick={() => { navigator.clipboard.writeText(generatedMsg); alert('تم النسخ!'); }}>📋 نسخ النص</button>
                  <button className="btn-wa" onClick={() => openWhatsApp(customerPhone, generatedMsg)}>🟢 إرسال عبر واتساب الآن</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* القسم الثاني: إدارة العملاء والأرقام والتصنيفات */}
        {activeTab === 'contacts' && (
          <div>
            <form onSubmit={addContact} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px' }}>➕ إضافة عميل جديد وتصنيفه</h3>
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
                  <label>ملاحظات</label>
                  <input type="text" className="form-control" placeholder="مثال: يفضل التواصل عصراً" value={newNote} onChange={e => setNewNote(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-main">حفظ العميل في قاعدة البيانات</button>
            </form>

            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '10px' }}>قائمة العملاء المحفوظين</h3>
            {contacts.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '30px' }}>لا توجد أرقام مسجلة حتى الآن. أضف عميلك الأول بالأعلى!</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>الجوال</th>
                      <th>التصنيف</th>
                      <th>ملاحظات</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: '700' }}>{c.name}</td>
                        <td>{c.phone}</td>
                        <td>
                          <span className={`badge ${c.category === 'عميل VIP' ? 'badge-vip' : c.category === 'سلة متروكة' ? 'badge-cart' : c.category === 'تم التوصيل' ? 'badge-done' : 'badge-new'}`}>
                            {c.category}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '13px' }}>{c.note || '---'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn-sm btn-success" onClick={() => openWhatsApp(c.phone, `مرحباً ${c.name}، يسعدنا تواصلك معنا عبر متجر إنجازيا.`)}>💬 مراسلة</button>
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

        {/* القسم الثالث: قوالب الردود المخصصة */}
        {activeTab === 'templates' && (
          <div>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px' }}>📝 إضافة قالب رد جديد</h3>
              <div className="form-group">
                <label>عنوان القالب</label>
                <input type="text" className="form-control" placeholder="مثال: رد على استفسار الشحن" value={newTemplateTitle} onChange={e => setNewTemplateTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label>نص الرسالة</label>
                <textarea className="form-control" rows={3} placeholder="اكتب نص الرد الجاهز هنا..." value={newTemplateText} onChange={e => setNewTemplateText(e.target.value)}></textarea>
              </div>
              <button className="btn-main" onClick={() => {
                if (!newTemplateTitle || !newTemplateText) return alert('يرجى تعبئة العنوان والنص.');
                setCustomTemplates([...customTemplates, { id: Date.now(), title: newTemplateTitle, text: newTemplateText }]);
                setNewTemplateTitle('');
                setNewTemplateText('');
                alert('تم إضافة القالب بنجاح!');
              }}>حفظ القالب الجديد</button>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px' }}>قوالب الردود المحفوظة</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {customTemplates.map(t => (
                <div key={t.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>{t.title}</h4>
                    <button className="btn-sm btn-success" onClick={() => { navigator.clipboard.writeText(t.text); alert('تم نسخ القالب!'); }}>📋 نسخ النص</button>
                  </div>
                  <p style={{ color: '#475569', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
