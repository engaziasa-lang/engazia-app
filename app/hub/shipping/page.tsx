'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة مدير الشحنات
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'مدير تتبع',
    titleSub: 'الشحنات والتوصيل',
    desc: 'تابع حالات شحنات عملائك وأرقام البوليصات لحل استفساراتهم اليومية بسرعة وسهولة.',
    panel1Title: '📦 تسجيل شحنة جديدة',
    customerLabel: 'اسم العميل',
    customerPh: 'مثال: خالد عبد العزيز',
    trackingLabel: 'رقم بوليصة الشحن',
    trackingPh: 'مثال: TRK-12345',
    companyLabel: 'شركة الشحن',
    statusLabel: 'حالة الشحنة',
    saveBtn: 'حفظ وإضافة للقائمة',
    panel2Title: '📋 قائمة الشحنات المسجلة',
    emptyList: 'لا توجد شحنات مسجلة حالياً.',
    policyLabel: 'البوليصة:',
    companyText: 'الشركة:',
    alertMissing: 'الرجاء إدخال اسم العميل ورقم البوليصة.',
    statusProcessing: 'قيد المعالجة والتجهيز',
    statusOut: 'خرجت للتوصيل مع مندوب التوصيل',
    statusDelivered: 'تم التوصيل بنجاح',
    statusDelayed: 'تأخرت / توقفت مؤقتاً'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Shipments & Delivery',
    titleSub: 'Tracking Manager',
    desc: 'Track your customer shipments and tracking numbers to resolve inquiries quickly.',
    panel1Title: '📦 Register New Shipment',
    customerLabel: 'Customer Name',
    customerPh: 'e.g., John Smith',
    trackingLabel: 'Tracking Number',
    trackingPh: 'e.g., TRK-12345',
    companyLabel: 'Shipping Company',
    statusLabel: 'Shipment Status',
    saveBtn: 'Save & Add to List',
    panel2Title: '📋 Registered Shipments List',
    emptyList: 'No shipments registered currently.',
    policyLabel: 'Tracking:',
    companyText: 'Company:',
    alertMissing: 'Please enter customer name and tracking number.',
    statusProcessing: 'Processing & Preparation',
    statusOut: 'Out for Delivery',
    statusDelivered: 'Delivered Successfully',
    statusDelayed: 'Delayed / On Hold'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Gestionnaire',
    titleSub: 'd’expéditions',
    desc: 'Suivez les expéditions de vos clients et les numéros de suivi.',
    panel1Title: '📦 Nouvelle expédition',
    customerLabel: 'Nom du client',
    customerPh: 'ex: Jean Dupont',
    trackingLabel: 'Numéro de suivi',
    trackingPh: 'ex: TRK-12345',
    companyLabel: 'Transporteur',
    statusLabel: 'Statut',
    saveBtn: 'Enregistrer et ajouter',
    panel2Title: '📋 Liste des expéditions',
    emptyList: 'Aucune expédition enregistrée.',
    policyLabel: 'Suivi :',
    companyText: 'Société :',
    alertMissing: 'Veuillez entrer le nom du client et le numéro de suivi.',
    statusProcessing: 'En cours de traitement',
    statusOut: 'En cours de livraison',
    statusDelivered: 'Livré avec succès',
    statusDelayed: 'Retardé / En attente'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Gestor de envíos',
    titleSub: 'y entregas',
    desc: 'Rastrea los envíos de tus clientes y números de seguimiento.',
    panel1Title: '📦 Registrar nuevo envío',
    customerLabel: 'Nombre del cliente',
    customerPh: 'ej. Juan Pérez',
    trackingLabel: 'Número de seguimiento',
    trackingPh: 'ej. TRK-12345',
    companyLabel: 'Empresa de envío',
    statusLabel: 'Estado del envío',
    saveBtn: 'Guardar y agregar',
    panel2Title: '📋 Lista de envíos registrados',
    emptyList: 'No hay envíos registrados actualmente.',
    policyLabel: 'Guía:',
    companyText: 'Empresa:',
    alertMissing: 'Por favor ingresa el nombre del cliente y el número de seguimiento.',
    statusProcessing: 'Procesando y preparando',
    statusOut: 'Salió para entrega',
    statusDelivered: 'Entregado con éxito',
    statusDelayed: 'Retrasado / En pausa'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Sevkiyat ve Teslimat',
    titleSub: 'Takip Yöneticisi',
    desc: 'Müşteri kargolarını ve takip numaralarını kolayca yönetin.',
    panel1Title: '📦 Yeni Sevkiyat Kaydı',
    customerLabel: 'Müşteri Adı',
    customerPh: 'örn: Ahmet Yılmaz',
    trackingLabel: 'Takip Numarası',
    trackingPh: 'örn: TRK-12345',
    companyLabel: 'Kargo Firması',
    statusLabel: 'Kargo Durumu',
    saveBtn: 'Kaydet ve Listeye Ekle',
    panel2Title: '📋 Kayıtlı Sevkiyatlar',
    emptyList: 'Şu anda kayıtlı sevkiyat yok.',
    policyLabel: 'Takip:',
    companyText: 'Firma:',
    alertMissing: 'Lütfen müşteri adını ve takip numarasını girin.',
    statusProcessing: 'İşleniyor ve Hazırlanıyor',
    statusOut: 'Dağıtıma Çıktı',
    statusDelivered: 'Başarıyla Teslim Edildi',
    statusDelayed: 'Gecikti / Beklemede'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '物流与派送',
    titleSub: '跟踪管理器',
    desc: '跟踪客户的货运状态和运单号，轻松高效处理日常咨询。',
    panel1Title: '📦 登记新货件',
    customerLabel: '客户姓名',
    customerPh: '例如：张三',
    trackingLabel: '运单追踪号',
    trackingPh: '例如：TRK-12345',
    companyLabel: '快递公司',
    statusLabel: '货件状态',
    saveBtn: '保存并添加至列表',
    panel2Title: '📋 已登记货件列表',
    emptyList: '当前暂无登记的货件。',
    policyLabel: '单号:',
    companyText: '公司:',
    alertMissing: '请输入客户姓名和运单号。',
    statusProcessing: '处理与备货中',
    statusOut: '派送员派送中',
    statusDelivered: '成功送达',
    statusDelayed: '延迟 / 暂停'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Versand- und',
    titleSub: 'Liefer-Manager',
    desc: 'Verfolgen Sie Kundensendungen und Sendungsnummern.',
    panel1Title: '📦 Neue Sendung erfassen',
    customerLabel: 'Kundenname',
    customerPh: 'z.B. Max Mustermann',
    trackingLabel: 'Sendungsnummer',
    trackingPh: 'z.B. TRK-12345',
    companyLabel: 'Versanddienstleister',
    statusLabel: 'Sendungsstatus',
    saveBtn: 'Speichern & hinzufügen',
    panel2Title: '📋 Liste der Sendungen',
    emptyList: 'Aktuell keine Sendungen vorhanden.',
    policyLabel: 'Nummer:',
    companyText: 'Firma:',
    alertMissing: 'Bitte Kundennamen und Sendungsnummer eingeben.',
    statusProcessing: 'In Bearbeitung',
    statusOut: 'In Zustellung',
    statusDelivered: 'Erfolgreich zugestellt',
    statusDelayed: 'Verzögert / Pausiert'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Manajer Pelacakan',
    titleSub: 'Pengiriman',
    desc: 'Lacak pengiriman pelanggan dan nomor resi dengan mudah.',
    panel1Title: '📦 Catat Pengiriman Baru',
    customerLabel: 'Nama Pelanggan',
    customerPh: 'cth: Budi Santoso',
    trackingLabel: 'Nomor Resi / Pelacakan',
    trackingPh: 'cth: TRK-12345',
    companyLabel: 'Perusahaan Logistik',
    statusLabel: 'Status Pengiriman',
    saveBtn: 'Simpan & Tambah',
    panel2Title: '📋 Daftar Pengiriman Tercatat',
    emptyList: 'Belum ada pengiriman tercatat.',
    policyLabel: 'Resi:',
    companyText: 'Perusahaan:',
    alertMissing: 'Harap masukkan nama pelanggan dan nomor resi.',
    statusProcessing: 'Sedang Diproses & Disiapkan',
    statusOut: 'Dibawa Kurir',
    statusDelivered: 'Berhasil Dikirim',
    statusDelayed: 'Terlambat / Ditahan'
  }
};

export default function ShippingManager() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [shipments, setShipments] = useState([
    { id: 1, customer: 'سارة خالد', trackingNo: 'TRK-98421', company: 'أرامكس', status: 'خرجت للتوصيل' },
    { id: 2, customer: 'فيصل العتيبي', trackingNo: 'TRK-33210', company: 'سمسا', status: 'تم التوصيل' },
  ]);

  const [customer, setCustomer] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [company, setCompany] = useState('أرامكس');
  const [status, setStatus] = useState('قيد المعالجة والتجهيز');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('engazia_global_lang') || 'ar';
      const savedCurr = localStorage.getItem('engazia_global_currency') || 'SAR';
      const savedKey = localStorage.getItem('merchant_license_key') || '';
      
      setCurrentLang(savedLang);
      setCurrentCurrency(savedCurr);
      setLicenseKey(savedKey);
    }
  }, []);

  const t = toolTranslations[currentLang] || toolTranslations.ar;
  const isRtl = currentLang === 'ar';

  const addShipment = () => {
    if (!customer || !trackingNo) {
      alert(t.alertMissing);
      return;
    }
    const newShipment = {
      id: Date.now(),
      customer,
      trackingNo,
      company,
      status
    };
    setShipments([newShipment, ...shipments]);
    setCustomer('');
    setTrackingNo('');
  };

  const removeShipment = (id: number) => {
    setShipments(shipments.filter(item => item.id !== id));
  };

  return (
    <div className="tool-container" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 70px; }
        
        .header { max-width: 1000px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 40px; }
        .tool-title h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 16px; }

        .main-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .input-wrapper input, .input-wrapper select { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus, .input-wrapper select:focus { border-color: #4f46e5; background: #ffffff; }

        .add-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; }
        .add-btn:hover { background: #4338ca; }

        .shipment-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .shipment-info h3 { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .shipment-info p { font-size: 13px; color: #64748b; font-weight: 600; }
        
        .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; background: #e0e7ff; color: #4f46e5; }
        
        .del-btn { background: #fee2e2; color: #dc2626; border: none; width: 30px; height: 30px; border-radius: 6px; cursor: pointer; font-weight: 900; }
        .del-btn:hover { background: #fecaca; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>{isRtl ? '→' : '←'}</span> {t.back}
        </Link>
        {licenseKey && (
          <span style={{ fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontWeight: 800 }}>
            🔒 PRO
          </span>
        )}
      </div>

      <div className="tool-title">
        <h1>{t.titleMain} <span>{t.titleSub}</span></h1>
        <p>{t.desc}</p>
      </div>

      <div className="main-grid">
        <div className="panel">
          <h2>{t.panel1Title}</h2>
          
          <div className="input-group">
            <label>{t.customerLabel}</label>
            <div className="input-wrapper">
              <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder={t.customerPh} />
            </div>
          </div>

          <div className="input-group">
            <label>{t.trackingLabel}</label>
            <div className="input-wrapper">
              <input type="text" value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder={t.trackingPh} />
            </div>
          </div>

          <div className="input-group">
            <label>{t.companyLabel}</label>
            <div className="input-wrapper">
              <select value={company} onChange={(e) => setCompany(e.target.value)}>
                <option value="أرامكس">أرامكس Aramex</option>
                <option value="سمسا">سمسا SMSA</option>
                <option value="ناجل">ناجل Naqel</option>
                <option value="SPL">البريد السعودي SPL</option>
                <option value="أخرى">شركة أخرى</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>{t.statusLabel}</label>
            <div className="input-wrapper">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value={t.statusProcessing}>{t.statusProcessing}</option>
                <option value={t.statusOut}>{t.statusOut}</option>
                <option value={t.statusDelivered}>{t.statusDelivered}</option>
                <option value={t.statusDelayed}>{t.statusDelayed}</option>
              </select>
            </div>
          </div>

          <button onClick={addShipment} className="add-btn">{t.saveBtn}</button>
        </div>

        <div className="panel">
          <h2>{t.panel2Title}</h2>
          
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {shipments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>{t.emptyList}</p>
            ) : (
              shipments.map(item => (
                <div key={item.id} className="shipment-card">
                  <div className="shipment-info">
                    <h3>{item.customer}</h3>
                    <p>{t.policyLabel} <strong>{item.trackingNo}</strong> | {t.companyText} {item.company}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="status-badge">{item.status}</span>
                    <button onClick={() => removeShipment(item.id)} className="del-btn">✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
