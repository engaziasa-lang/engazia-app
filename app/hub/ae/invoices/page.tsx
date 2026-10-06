'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface InvoiceProduct {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  storeName: string;
  vatNumber: string;
  products: InvoiceProduct[];
  totalAmount: number;
  vatAmount: number;
  createdAt?: string;
}

export default function FtaInvoiceGeneratorAE() {
  // البيانات الثابتة الافتراضية
  const [storeName, setStoreName] = useState<string>('متجر إنجازيا');
  const [vatNumber, setVatNumber] = useState<string>('100000000000003');
  
  // بيانات الفاتورة
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-001');
  const [customerName, setCustomerName] = useState<string>('');
  
  // نظام سلة المنتجات للفاتورة الحالية
  const [currentProducts, setCurrentProducts] = useState<InvoiceProduct[]>([]);
  const [prodName, setProdName] = useState<string>('');
  const [prodPrice, setProdPrice] = useState<number | ''>('');
  const [prodQty, setProdQty] = useState<number>(1);

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // استرجاع سجل الفواتير
    const savedItems = localStorage.getItem('seerk_ae_fta_invoices_items');
    if (savedItems) {
      try { setItems(JSON.parse(savedItems)); } catch (e) { }
    }

    // استرجاع بيانات المتجر المحفوظة لكي لا يضطر التاجر لإدخالها كل مرة
    const savedStoreName = localStorage.getItem('seerk_ae_store_name');
    const savedVatNumber = localStorage.getItem('seerk_ae_vat_number');
    if (savedStoreName) setStoreName(savedStoreName);
    if (savedVatNumber) setVatNumber(savedVatNumber);
  }, []);

  const saveToLocalStorage = (newItems: InvoiceItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_ae_fta_invoices_items', JSON.stringify(newItems));
  };

  const isActivated = typeof window !== 'undefined' && !!localStorage.getItem('merchant_license_key');

  // حساب الإجمالي والضريبة بناءً على المنتجات المضافة (الضريبة في الإمارات 5%)
  const amt = currentProducts.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const vatAmt = amt - (amt / 1.05);

  const nowDisplay = new Date();
  const timeOptionsDisplay: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const currentFormattedDate = `${nowDisplay.toLocaleDateString('ar-AE')} - ${nowDisplay.toLocaleTimeString('ar-AE', timeOptionsDisplay)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `المتجر: ${storeName} | الرقم الضريبي: ${vatNumber} \vert{} التاريخ: ${currentFormattedDate} | الإجمالي: ${amt} د.إ \vert{} الضريبة: ${vatAmt.toFixed(2)} د.إ`
  )}`;

  const handleAddProduct = () => {
    if (!prodName.trim() || typeof prodPrice !== 'number' || prodPrice <= 0 || prodQty <= 0) {
      alert('الرجاء إدخال اسم المنتج وسعره والكمية بشكل صحيح.');
      return;
    }
    const newProd: InvoiceProduct = {
      id: Date.now().toString(),
      name: prodName,
      price: prodPrice,
      qty: prodQty
    };
    setCurrentProducts([...currentProducts, newProd]);
    setProdName('');
    setProdPrice('');
    setProdQty(1);
  };

  const handleEditProduct = (prod: InvoiceProduct) => {
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdQty(prod.qty);
    setCurrentProducts(currentProducts.filter(p => p.id !== prod.id));
  };

  const handleRemoveProduct = (pid: string) => {
    setCurrentProducts(currentProducts.filter(p => p.id !== pid));
  };

  const handleClearForm = () => {
    // نترك storeName و vatNumber كما هي ولن نمسحها أبداً!
    setInvoiceNumber(`INV-2026-00${items.length + 2}`);
    setCustomerName('');
    setCurrentProducts([]);
    setProdName('');
    setProdPrice('');
    setProdQty(1);
    setEditingId(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActivated && items.length >= 3 && !editingId) {
      alert('🔒 عذراً، لقد استهلكت الحد التجريبي (3 فواتير). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!');
      return;
    }
    if (!invoiceNumber.trim() || !storeName.trim() || !vatNumber.trim()) {
      alert('الرجاء التأكد من تعبئة رقم الفاتورة وبيانات المتجر بشكل صحيح.');
      return;
    }
    if (currentProducts.length === 0) {
      alert('الرجاء إضافة منتج واحد على الأقل للفاتورة.');
      return;
    }

    // حفظ اسم المتجر والرقم الضريبي تلقائياً في المتصفح للاستخدام المستقبلي
    localStorage.setItem('seerk_ae_store_name', storeName);
    localStorage.setItem('seerk_ae_vat_number', vatNumber);

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('ar-AE')} - ${now.toLocaleTimeString('ar-AE', timeOptionsDisplay)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        invoiceNumber,
        customerName: customerName.trim() || 'عميل نقدي',
        storeName,
        vatNumber,
        products: currentProducts,
        totalAmount: amt,
        vatAmount: Number(vatAmt.toFixed(2)),
        createdAt: item.createdAt || formattedDate,
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert('✨ تم تحديث الفاتورة بنجاح!');
    } else {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        invoiceNumber,
        customerName: customerName.trim() || 'عميل نقدي',
        storeName,
        vatNumber,
        products: currentProducts,
        totalAmount: amt,
        vatAmount: Number(vatAmt.toFixed(2)),
        createdAt: formattedDate,
      };
      saveToLocalStorage([...items, newItem]);
      alert('✅ تمت إضافة الفاتورة إلى سجل النظام بنجاح!');
    }

    handleClearForm();
  };

  const handleEdit = (item: InvoiceItem) => {
    // عند التعديل، نجلب بيانات الفاتورة القديمة (حتى لو كانت لمتجر مختلف)
    setStoreName(item.storeName);
    setVatNumber(item.vatNumber);
    setInvoiceNumber(item.invoiceNumber);
    setCustomerName(item.customerName);
    
    if (item.products && item.products.length > 0) {
      setCurrentProducts(item.products);
    } else {
      setCurrentProducts([{ id: 'old1', name: (item as any).orderDescription || 'منتجات متنوعة', price: item.totalAmount, qty: 1 }]);
    }
    
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة من السجل؟')) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handlePrintInvoice = (item: InvoiceItem | null) => {
    let dataToPrint: InvoiceItem;
    if (item) {
       const printProducts = (item.products && item.products.length > 0) 
          ? item.products 
          : [{ id: 'old', name: (item as any).orderDescription || 'منتجات متنوعة', price: item.totalAmount, qty: 1 }];
          
       dataToPrint = { ...item, products: printProducts };
    } else {
       if (currentProducts.length === 0) {
         alert('لا توجد منتجات لطباعتها في المعاينة.'); return;
       }
       dataToPrint = {
        id: 'preview',
        storeName,
        vatNumber,
        invoiceNumber,
        customerName: customerName || 'عميل نقدي',
        products: currentProducts,
        totalAmount: amt,
        vatAmount: vatAmt,
        createdAt: currentFormattedDate
      };
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrPrintUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      `المتجر: ${dataToPrint.storeName} | الرقم الضريبي: ${dataToPrint.vatNumber} \vert{} التاريخ: ${dataToPrint.createdAt} | الإجمالي: ${dataToPrint.totalAmount} د.إ \vert{} الضريبة: ${dataToPrint.vatAmount.toFixed(2)} د.إ`
    )}`;

    let productsRows = '';
    dataToPrint.products.forEach((p, idx) => {
      productsRows += `
        <tr>
          <td>${idx + 1}</td>
          <td style="text-align: right;">${p.name}</td>
          <td>${p.qty}</td>
          <td>${p.price}</td>
          <td>${(p.price * p.qty).toFixed(2)}</td>
        </tr>
      `;
    });

    const html = `
      <html dir="rtl" lang="ar">
      <head>
        <title>فاتورة ضريبية مبسطة - ${dataToPrint.invoiceNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; text-align: center; color: #0f172a; background: #f1f5f9; }
          .invoice-box { max-width: 600px; margin: auto; padding: 40px; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .store-name { font-size: 28px; font-weight: 900; margin-bottom: 5px; color: #0f172a; }
          .vat-num { font-size: 14px; color: #64748b; margin-bottom: 30px; }
          .inv-title { font-weight: 900; margin-bottom: 20px; font-size: 18px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: right; margin-bottom: 30px; font-size: 14px; }
          .details-box { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .details-box strong { display: block; color: #64748b; font-size: 12px; margin-bottom: 5px; }
          
          .products-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          .products-table th { background: #f1f5f9; color: #334155; padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: center; }
          .products-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; }
          
          .totals-container { display: flex; justify-content: space-between; align-items: flex-end; }
          .qr-section img { border-radius: 8px; border: 1px solid #e2e8f0; padding: 5px; }
          
          .totals-calc { width: 60%; text-align: left; }
          .totals-row { display: flex; justify-content: space-between; padding: 10px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #e2e8f0; }
          .totals-row.grand { background: #047857; color: white; border-radius: 8px; font-size: 16px; margin-top: 10px; border: none; }
          
          @media print { body { background: #fff; padding: 0; } .invoice-box { box-shadow: none; border: none; max-width: 100%; } }
        </style>
      </head>
      <body onload="window.print();">
        <div class="invoice-box">
          <div class="store-name">${dataToPrint.storeName}</div>
          <div class="vat-num">الرقم الضريبي: ${dataToPrint.vatNumber}</div>
          <div class="inv-title">فاتورة ضريبية مبسطة - #${dataToPrint.invoiceNumber}</div>
          
          <div class="details-grid">
            <div class="details-box">
              <strong>تاريخ وإصدار الفاتورة</strong>
              ${dataToPrint.createdAt}
            </div>
            <div class="details-box">
              <strong>فاتورة إلى العميل</strong>
              ${dataToPrint.customerName}
            </div>
          </div>

          <table class="products-table">
            <thead>
              <tr>
                <th style="width: 5%;">#</th>
                <th style="text-align: right; width: 45%;">وصف المنتج / الخدمة</th>
                <th style="width: 15%;">الكمية</th>
                <th style="width: 15%;">سعر الوحدة</th>
                <th style="width: 20%;">المجموع</th>
              </tr>
            </thead>
            <tbody>
              ${productsRows}
            </tbody>
          </table>
          
          <div class="totals-container">
            <div class="qr-section">
              <img src="${qrPrintUrl}" width="120" height="120" />
            </div>
            <div class="totals-calc">
              <div class="totals-row">
                <span>الإجمالي (غير شامل الضريبة)</span>
                <span>${(dataToPrint.totalAmount - dataToPrint.vatAmount).toFixed(2)} د.إ</span>
              </div>
              <div class="totals-row">
                <span>ضريبة القيمة المضافة (5%)</span>
                <span>${dataToPrint.vatAmount.toFixed(2)} د.إ</span>
              </div>
              <div class="totals-row grand">
                <span>المبلغ الإجمالي الشامل</span>
                <span>${dataToPrint.totalAmount.toFixed(2)} د.إ</span>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; font-size: 13px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
            شكراً لتسوقكم معنا في ${dataToPrint.storeName}
          </div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const totalInvoicesAmount = items.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalVatValue = items.reduce((acc, curr) => acc + curr.vatAmount, 0);

    let tableHtml = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: center; }
            th { background-color: #f8fafc; font-weight: bold; color: #334155; }
            .tfoot-row td { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>م</th>
                <th>رقم الفاتورة</th>
                <th>التاريخ والوقت</th>
                <th>اسم العميل</th>
                <th>المنتجات المشتراة</th>
                <th>الإجمالي الشامل (د.إ)</th>
                <th>الضريبة المستقطعة (5%)</th>
              </tr>
            </thead>
            <tbody>
    `;

    items.forEach((row, idx) => {
      const prodsText = row.products 
        ? row.products.map(p => `${p.name} (عدد ${p.qty})`).join('، ')
        : (row as any).orderDescription || '';

      tableHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>${row.invoiceNumber}</td>
          <td>${row.createdAt || '-'}</td>
          <td>${row.customerName}</td>
          <td>${prodsText}</td>
          <td>${row.totalAmount}</td>
          <td>${row.vatAmount}</td>
        </tr>
      `;
    });

    tableHtml += `
            </tbody>
            <tfoot>
              <tr class="tfoot-row">
                <td colspan="5">الإجمالي الكلي</td>
                <td>${totalInvoicesAmount.toFixed(2)}</td>
                <td>${totalVatValue.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "seerk_ae_fta_invoices.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (Array.isArray(imported)) {
            saveToLocalStorage(imported);
            alert('✨ تم استيراد الفواتير بنجاح!');
          }
        } catch (err) {
          alert('❌ ملف غير صالح.');
        }
      };
    }
  };

  const filteredItems = items.filter(item => 
    item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalInvoicesAmount = filteredItems.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalVatValue = filteredItems.reduce((acc, curr) => acc + curr.vatAmount, 0);

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; width: 100%; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: 'Tajawal', sans-serif; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        
        .action-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #065f46; }

        .add-prod-box { background: #f1f5f9; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; margin-bottom: 20px; }
        .mini-btn { background: #0f172a; color: white; padding: 8px 15px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-family: 'Tajawal'; }
        
        .products-list { margin-top: 15px; }
        .prod-item { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 8px; font-size: 14px; font-weight: 600; flex-wrap: wrap; gap: 10px; }
        
        .remove-btn { color: #dc2626; cursor: pointer; font-weight: bold; background: #fee2e2; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .edit-prod-btn { color: #0369a1; cursor: pointer; font-weight: bold; background: #e0f2fe; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; }

        .invoice-preview { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; }
        .invoice-header-text { font-weight: 900; font-size: 18px; color: #0f172a; margin-bottom: 5px; }
        .invoice-sub { font-size: 13px; color: #64748b; margin-bottom: 15px; }
        .qr-box { margin: 15px auto; width: 130px; height: 130px; background: #fff; padding: 5px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; }
        .qr-box img { width: 120px; height: 120px; }
        
        .print-btn { background: #fef08a; color: #854d0e; border: 1px solid #fde047; padding: 10px; width: 100%; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; margin-top: 15px; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s;}
        .print-btn:hover { background: #fde047; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .search-input { padding: 8px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: 'Tajawal', sans-serif; font-size: 13px; outline: none; width: 100%; max-width: 300px; box-sizing: border-box; }
        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: 'Tajawal', sans-serif; display: flex; align-items: center; justify-content: center; }
        .t-btn:hover { background: #f1f5f9; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 850px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: 'Tajawal', sans-serif;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-print-tb { background: #fef08a; color: #854d0e; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مولد الفواتير الإلكترونية (نظام الكاشير المصغر) 🧾</h1>
          <p>أنشئ فواتير مبسطة برمز الاستجابة السريعة (QR Code) متوافقة مع متطلبات الهيئة الاتحادية للضرائب (FTA)</p>
        </div>
        <Link href="/hub/ae" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>{editingId ? 'تعديل الفاتورة' : 'إصدار فاتورة جديدة'}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm} title="مسح الحقول (مع الاحتفاظ ببيانات المتجر)">
                🧹 مسح الفاتورة
              </button>
            </div>
            {!isActivated && <span className="trial-badge">تجريبي: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            {/* بيانات المتجر الثابتة */}
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <div className="input-group">
                <label style={{ color: '#0f172a' }}>اسم المتجر</label>
                <div className="input-wrapper">
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ color: '#0f172a' }}>الرقم الضريبي (15 رقماً)</label>
                <div className="input-wrapper">
                  <input type="text" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>رقم الفاتورة</label>
              <div className="input-wrapper">
                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>اسم العميل</label>
              <div className="input-wrapper">
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="مثال: محمد القحطاني" />
              </div>
            </div>

            {/* نظام إضافة المنتجات (سلة الفاتورة) */}
            <div className="add-prod-box">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>سلة منتجات الفاتورة</label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <input type="text" value={prodName} onChange={(e)=>setProdName(e.target.value)} placeholder="اسم المنتج" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'Tajawal' }} />
                <input type="number" value={prodPrice} onChange={(e)=>setProdPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="السعر" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'Tajawal' }} />
                <input type="number" min="1" value={prodQty} onChange={(e)=>setProdQty(Number(e.target.value))} placeholder="الكمية" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'Tajawal' }} />
              </div>
              <button type="button" className="mini-btn" onClick={handleAddProduct} style={{ width: '100%' }}>➕ إضافة المنتج للفاتورة</button>

              {currentProducts.length > 0 && (
                <div className="products-list">
                  {currentProducts.map((p, i) => (
                    <div className="prod-item" key={p.id}>
                      <span>{i+1}. {p.name} (عدد: {p.qty})</span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ color: '#047857' }}>{p.price * p.qty} د.إ</span>
                        <button type="button" className="edit-prod-btn" onClick={() => handleEditProduct(p)}>تعديل</button>
                        <button type="button" className="remove-btn" onClick={() => handleRemoveProduct(p.id)}>حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="action-btn">
              {editingId ? '💾 تحديث وحفظ الفاتورة' : '+ حفظ وإصدار الفاتورة'}
            </button>
          </form>
        </div>

        {/* قسم المعاينة والطباعة */}
        <div className="card">
          <h2 className="card-title">معاينة الفاتورة والطباعة</h2>

          <div className="invoice-preview">
            <div className="invoice-header-text">{storeName}</div>
            <div className="invoice-sub">الرقم الضريبي: {vatNumber}</div>
            
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '10px 0', padding: '8px', background: '#fff', borderRadius: '6px' }}>
              فاتورة ضريبية مبسطة - #{invoiceNumber}
            </div>

            <div style={{ textAlign: 'right', fontSize: '13px', margin: '15px 0', lineHeight: '1.6' }}>
              <div><strong style={{ color: '#475569' }}>العميل:</strong> {customerName || 'عميل نقدي'}</div>
              <div><strong style={{ color: '#475569' }}>عدد الأصناف:</strong> {currentProducts.length} منتجات</div>
            </div>

            <div className="qr-box">
              <img src={qrCodeUrl} alt="FTA QR Code" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, padding: '8px 10px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
              <span>الضريبة (5%):</span>
              <span style={{ color: '#047857' }}>{vatAmt.toFixed(2)} د.إ</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 900, padding: '10px', background: '#047857', color: '#fff', borderRadius: '6px', marginTop: '8px' }}>
              <span>الإجمالي الشامل:</span>
              <span>{amt} د.إ</span>
            </div>
          </div>

          <button onClick={() => handlePrintInvoice(null)} className="print-btn" title="طباعة الفاتورة الحالية بجدول التفاصيل">
             🖨️ طباعة الفاتورة الحالية
          </button>
        </div>
      </div>

      {/* جدول إدارة الفواتير السفلي */}
      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="🔍 بحث برقم الفاتورة أو العميل..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel} title="تصدير بصيغة Excel لدعم اللغة العربية">📥 تصدير Excel</button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>📂 استيراد</button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الفاتورة والتاريخ</th>
                <th>العميل والأصناف</th>
                <th>الإجمالي الشامل</th>
                <th>الضريبة (5%)</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    لا توجد فواتير مسجلة في السجل حالياً.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const hasProducts = item.products && item.products.length > 0;
                  return (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 900, color: '#0f172a' }}>{item.invoiceNumber}</div>
                        {item.createdAt && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>🕒 {item.createdAt}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{item.customerName}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px' }}>
                           {hasProducts ? `${item.products.length} أصناف مسجلة` : (item as any).orderDescription}
                        </div>
                      </td>
                      <td style={{ fontWeight: 900 }}>{item.totalAmount} د.إ</td>
                      <td style={{ color: '#047857' }}>{item.vatAmount} د.إ</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-print-tb" onClick={() => handlePrintInvoice(item)} title="طباعة بجدول مفصل">🖨️ طباعة</button>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title="تعديل">✏️</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title="حذف">❌</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="tfoot-row">
                  <td colSpan={3} style={{ textAlign: 'center' }}>الإجمالي الكلي</td>
                  <td>{totalInvoicesAmount.toFixed(2)} د.إ</td>
                  <td style={{ color: '#047857' }}>{totalVatValue.toFixed(2)} د.إ</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
