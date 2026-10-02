'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة مولد الفواتير
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'مولد',
    titleSub: 'الفواتير وسندات القبض',
    desc: 'أنشئ فواتير مبيعات نظامية واحترافية وجهزها للطباعة أو الإرسال الفوري للعملاء.',
    printBtn: '🖨️ طباعة أو حفظ PDF',
    invoiceTitle: 'فاتورة مبيعات',
    invNumLabel: 'رقم الفاتورة:',
    dateLabel: 'التاريخ:',
    customerNameLabel: 'اسم العميل الكريم',
    customerNamePh: 'مثال: محمد عبد الله',
    customerPhoneLabel: 'رقم الجوال / التواصل',
    customerPhonePh: 'مثال: 0500000000',
    thDesc: 'وصف المنتج أو الخدمة',
    thQty: 'الكمية',
    thPrice: 'السعر',
    thTotal: 'الإجمالي',
    addRowBtn: '+ إضافة منتج آخر',
    subtotalLabel: 'المجموع الفرعي:',
    taxLabel: 'ضريبة القيمة المضافة (15%):',
    finalTotalLabel: 'الإجمالي النهائي:',
    storePh: 'اسم متجرك',
    taxIdLabel: 'الرقم الضريبي:'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Invoice',
    titleSub: '& Receipt Generator',
    desc: 'Create professional sales invoices and get them ready for print or instant dispatch.',
    printBtn: '🖨️ Print or Save PDF',
    invoiceTitle: 'Sales Invoice',
    invNumLabel: 'Invoice No:',
    dateLabel: 'Date:',
    customerNameLabel: 'Customer Name',
    customerNamePh: 'e.g., John Doe',
    customerPhoneLabel: 'Phone / Contact',
    customerPhonePh: 'e.g., +966500000000',
    thDesc: 'Product or Service Description',
    thQty: 'Quantity',
    thPrice: 'Price',
    thTotal: 'Total',
    addRowBtn: '+ Add Another Item',
    subtotalLabel: 'Subtotal:',
    taxLabel: 'VAT (15%):',
    finalTotalLabel: 'Final Total:',
    storePh: 'Your Store Name',
    taxIdLabel: 'Tax ID:'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Générateur',
    titleSub: 'de factures',
    desc: 'Créez des factures de vente professionnelles prêtes à être imprimées.',
    printBtn: '🖨️ Imprimer ou PDF',
    invoiceTitle: 'Facture de vente',
    invNumLabel: 'Facture N°:',
    dateLabel: 'Date:',
    customerNameLabel: 'Nom du client',
    customerNamePh: 'ex: Jean Dupont',
    customerPhoneLabel: 'Téléphone',
    customerPhonePh: 'ex: 0600000000',
    thDesc: 'Description',
    thQty: 'Qté',
    thPrice: 'Prix',
    thTotal: 'Total',
    addRowBtn: '+ Ajouter un article',
    subtotalLabel: 'Sous-total:',
    taxLabel: 'TVA (15%):',
    finalTotalLabel: 'Total final:',
    storePh: 'Nom de votre boutique',
    taxIdLabel: 'N° de TVA:'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Generador',
    titleSub: 'de Facturas',
    desc: 'Crea facturas de venta profesionales listas para imprimir o enviar.',
    printBtn: '🖨️ Imprimir o Guardar PDF',
    invoiceTitle: 'Factura de Venta',
    invNumLabel: 'Factura N°:',
    dateLabel: 'Fecha:',
    customerNameLabel: 'Nombre del cliente',
    customerNamePh: 'ej. Juan Pérez',
    customerPhoneLabel: 'Teléfono',
    customerPhonePh: 'ej. 0500000000',
    thDesc: 'Descripción del producto o servicio',
    thQty: 'Cant',
    thPrice: 'Precio',
    thTotal: 'Total',
    addRowBtn: '+ Agregar otro artículo',
    subtotalLabel: 'Subtotal:',
    taxLabel: 'IVA (15%):',
    finalTotalLabel: 'Total final:',
    storePh: 'Nombre de tu tienda',
    taxIdLabel: 'RFC / NIF:'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Fatura',
    titleSub: 've Makbuz Oluşturucu',
    desc: 'Profesyonel satış faturaları oluşturun ve yazdırmaya veya göndermeye hazırlayın.',
    printBtn: '🖨️ Yazdır veya PDF Kaydet',
    invoiceTitle: 'Satış Faturası',
    invNumLabel: 'Fatura No:',
    dateLabel: 'Tarih:',
    customerNameLabel: 'Müşteri Adı',
    customerNamePh: 'örn: Ahmet Yılmaz',
    customerPhoneLabel: 'Telefon / İletişim',
    customerPhonePh: 'örn: 0500000000',
    thDesc: 'Ürün veya Hizmet Açıklaması',
    thQty: 'Miktar',
    thPrice: 'Fiyat',
    thTotal: 'Toplam',
    addRowBtn: '+ Başka Ürün Ekle',
    subtotalLabel: 'Ara Toplam:',
    taxLabel: 'KDV (%15):',
    finalTotalLabel: 'Genel Toplam:',
    storePh: 'Mağaza Adınız',
    taxIdLabel: 'Vergi No:'
  },
  zh: {
    back: '返回控制面板',
    titleMain: '发票与收据',
    titleSub: '生成器',
    desc: '创建专业销售发票，准备好打印或立即发送给客户。',
    printBtn: '🖨️ 打印或保存PDF',
    invoiceTitle: '销售发票',
    invNumLabel: '发票号:',
    dateLabel: '日期:',
    customerNameLabel: '客户姓名',
    customerNamePh: '例如：张三',
    customerPhoneLabel: '手机号码 / 联系方式',
    customerPhonePh: '例如：13800000000',
    thDesc: '产品或服务描述',
    thQty: '数量',
    thPrice: '单价',
    thTotal: '小计',
    addRowBtn: '+ 添加其他产品',
    subtotalLabel: '小计:',
    taxLabel: '增值税 (15%):',
    finalTotalLabel: '最终总额:',
    storePh: '您的店铺名称',
    taxIdLabel: '税号:'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Rechnungs-',
    titleSub: 'und Beleg-Generator',
    desc: 'Erstellen Sie professionelle Verkaufsrechnungen zum Drucken oder Versenden.',
    printBtn: '🖨️ Drucken oder PDF speichern',
    invoiceTitle: 'Verkaufsrechnung',
    invNumLabel: 'Rechnungs-Nr.:',
    dateLabel: 'Datum:',
    customerNameLabel: 'Kundenname',
    customerNamePh: 'z.B. Max Mustermann',
    customerPhoneLabel: 'Telefon / Kontakt',
    customerPhonePh: 'z.B. 01700000000',
    thDesc: 'Produkt- oder Dienstleistungsbeschreibung',
    thQty: 'Menge',
    thPrice: 'Preis',
    thTotal: 'Gesamt',
    addRowBtn: '+ Weiteren Artikel hinzufügen',
    subtotalLabel: 'Zwischensumme:',
    taxLabel: 'MwSt. (15%):',
    finalTotalLabel: 'Gesamtsumme:',
    storePh: 'Ihr Shop-Name',
    taxIdLabel: 'Steuernummer:'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Pembuat Faktur',
    titleSub: '& Kwitansi',
    desc: 'Buat faktur penjualan profesional yang siap dicetak atau dikirim.',
    printBtn: '🖨️ Cetak atau Simpan PDF',
    invoiceTitle: 'Faktur Penjualan',
    invNumLabel: 'No. Faktur:',
    dateLabel: 'Tanggal:',
    customerNameLabel: 'Nama Pelanggan',
    customerNamePh: 'cth: Budi Santoso',
    customerPhoneLabel: 'Telepon / Kontak',
    customerPhonePh: 'cth: 08123456789',
    thDesc: 'Deskripsi Produk atau Layanan',
    thQty: 'Jumlah',
    thPrice: 'Harga',
    thTotal: 'Total',
    addRowBtn: '+ Tambah Item Lain',
    subtotalLabel: 'Subtotal:',
    taxLabel: 'PPN (15%):',
    finalTotalLabel: 'Total Akhir:',
    storePh: 'Nama Toko Anda',
    taxIdLabel: 'ID Pajak:'
  }
};

export default function InvoiceGenerator() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [storeName, setStoreName] = useState('متجرك الإلكتروني');
  const [storeId, setStoreId] = useState('300000000000003');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');

  const [items, setItems] = useState([
    { id: 1, name: 'منتج رقم 1', quantity: 1, price: 150 }
  ]);

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

  const addItem = () => {
    setItems([...items, { id: items.length + 1, name: '', quantity: 1, price: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.price)), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="tool-container" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
        @media print {
          body { background: #ffffff !important; }
          .no-print { display: none !important; }
          .print-area { border: none !important; box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 70px; }
        
        .header { max-width: 900px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }

        .action-btns { display: flex; gap: 10px; align-items: center; }
        .print-btn { background: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
        .print-btn:hover { background: #4338ca; }

        .tool-title { text-align: center; margin-bottom: 30px; }
        .tool-title h1 { font-size: 30px; font-weight: 900; color: #0f172a; margin-bottom: 8px; }
        .tool-title span { color: #4f46e5; }
        
        .invoice-card { background: #ffffff; border-radius: 16px; padding: 40px; max-width: 900px; margin: 0 auto; border: 1px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        
        .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 25px; margin-bottom: 30px; }
        .store-info input { font-size: 22px; font-weight: 900; color: #0f172a; border: none; border-bottom: 1px dashed transparent; outline: none; width: 100%; background: transparent; }
        .store-info input:focus { border-bottom-color: #4f46e5; }
        .store-info p { color: #64748b; font-size: 14px; margin-top: 5px; }
        
        .invoice-meta { text-align: left; }
        .invoice-meta h2 { font-size: 22px; font-weight: 900; color: #4f46e5; margin-bottom: 5px; }
        .invoice-meta input { font-size: 14px; font-weight: 700; color: #475569; border: 1px solid #e2e8f0; padding: 4px 8px; border-radius: 6px; width: 130px; }

        .client-section { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 30px; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-weight: 700; color: #0f172a; background: #ffffff; outline: none; }
        .form-group input:focus { border-color: #4f46e5; }

        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .items-table th { background: #f1f5f9; color: #334155; font-size: 14px; font-weight: 800; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; }
        .items-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .items-table input { width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; font-weight: 700; background: #fff; outline: none; }
        .items-table input:focus { border-color: #4f46e5; }
        
        .del-btn { background: #fee2e2; color: #dc2626; border: none; width: 35px; height: 35px; border-radius: 6px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .del-btn:hover { background: #fecaca; }

        .add-row-btn { background: #e0e7ff; color: #4f46e5; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: background 0.2s; margin-bottom: 30px; }
        .add-row-btn:hover { background: #c7d2fe; }

        .summary-box { display: flex; justify-content: flex-end; }
        .summary-table { width: 320px; background: #f8fafc; border-radius: 10px; padding: 15px; border: 1px solid #e2e8f0; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; font-weight: 700; color: #475569; }
        .summary-row.total { border-top: 2px solid #cbd5e1; padding-top: 10px; margin-top: 10px; font-size: 18px; font-weight: 900; color: #0f172a; }

        @media(max-width: 768px) { .client-section { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header no-print">
        <Link href="/hub" className="back-btn">
          <span>{isRtl ? '→' : '←'}</span> {t.back}
        </Link>
        <div className="action-btns">
          {licenseKey && (
            <span style={{ fontSize: '12px', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontWeight: 800 }}>
              🔒 PRO
            </span>
          )}
          <button onClick={handlePrint} className="print-btn">
            {t.printBtn}
          </button>
        </div>
      </div>

      <div className="tool-title no-print">
        <h1>{t.titleMain} <span>{t.titleSub}</span></h1>
        <p>{t.desc}</p>
      </div>

      <div className="invoice-card print-area">
        <div className="invoice-header">
          <div className="store-info" style={{ width: '50%' }}>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder={t.storePh} />
            <p>{t.taxIdLabel} <input type="text" value={storeId} onChange={(e) => setStoreId(e.target.value)} style={{ display: 'inline', width: '150px', border: 'none', background: 'transparent', fontWeight: 'bold' }} /></p>
          </div>
          <div className="invoice-meta">
            <h2>{t.invoiceTitle}</h2>
            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '3px' }}>{t.invNumLabel}</label>
              <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>
            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '3px' }}>{t.dateLabel}</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} style={{ width: '130px' }} />
            </div>
          </div>
        </div>

        <div className="client-section">
          <div className="form-group">
            <label>{t.customerNameLabel}</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={t.customerNamePh} />
          </div>
          <div className="form-group">
            <label>{t.customerPhoneLabel}</label>
            <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder={t.customerPhonePh} />
          </div>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>{t.thDesc}</th>
              <th style={{ width: '15%' }}>{t.thQty}</th>
              <th style={{ width: '20%' }}>{t.thPrice} ({currentCurrency})</th>
              <th style={{ width: '15%' }}>{t.thTotal}</th>
              <th style={{ width: '5%' }} className="no-print"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input type="text" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} placeholder="اسم المنتج" />
                </td>
                <td>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} />
                </td>
                <td>
                  <input type="number" min="0" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} />
                </td>
                <td style={{ fontWeight: '800', color: '#0f172a' }} dir="ltr">
                  {(Number(item.quantity) * Number(item.price)).toFixed(2)} {currentCurrency}
                </td>
                <td className="no-print">
                  {items.length > 1 && (
                    <button onClick={() => removeItem(index)} className="del-btn">✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem} className="add-row-btn no-print">{t.addRowBtn}</button>

        <div className="summary-box">
          <div className="summary-table">
            <div className="summary-row">
              <span>{t.subtotalLabel}</span>
              <span dir="ltr">{subtotal.toFixed(2)} {currentCurrency}</span>
            </div>
            <div className="summary-row">
              <span>{t.taxLabel}</span>
              <span dir="ltr">{tax.toFixed(2)} {currentCurrency}</span>
            </div>
            <div className="summary-row total">
              <span>{t.finalTotalLabel}</span>
              <span dir="ltr">{total.toFixed(2)} {currentCurrency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
