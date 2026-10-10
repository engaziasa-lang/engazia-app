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
  timestamp?: number; // تمت الإضافة للفرز الزمني
}

export default function InvoiceGeneratorQA() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // البيانات الثابتة الافتراضية
  const [storeName, setStoreName] = useState<string>('');
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
  const [dateFilter, setDateFilter] = useState<string>('all'); // الفرز الزمني
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [isActivated, setIsActivated] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    setIsActivated(!!localStorage.getItem('merchant_license_key_qa'));

    // قراءة اللغة من الصفحة الرئيسية
    const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
    if (savedLang) {
      setLang(savedLang);
    }
    
    // استرجاع سجل الفواتير
    const savedItems = localStorage.getItem('seerk_qa_invoices_items');
    if (savedItems) {
      try { setItems(JSON.parse(savedItems)); } catch (e) { }
    }

    // استرجاع بيانات المتجر
    const savedStoreName = localStorage.getItem('seerk_qa_store_name');
    const savedVatNumber = localStorage.getItem('seerk_qa_vat_number');
    if (savedStoreName) {
      setStoreName(savedStoreName);
    } else {
      setStoreName(savedLang === 'en' ? 'Enjazya Store' : 'متجر إنجازيا');
    }
    if (savedVatNumber) setVatNumber(savedVatNumber);
  }, []);

  const saveToLocalStorage = (newItems: InvoiceItem[]) => {
    setItems(newItems);
    localStorage.setItem('seerk_qa_invoices_items', JSON.stringify(newItems));
  };

  const amt = currentProducts.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const vatAmt = 0; // تم تصفير الضريبة لأن قطر لا تطبق 5% VAT للمتاجر حالياً

  const nowDisplay = new Date();
  const timeOptionsDisplay: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const localeStr = lang === 'ar' ? 'ar-QA' : 'en-QA';
  const currentFormattedDate = `${nowDisplay.toLocaleDateString(localeStr)} - ${nowDisplay.toLocaleTimeString(localeStr, timeOptionsDisplay)}`;

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'مولد الفواتير الإلكترونية (نظام الكاشير المصغر) 🧾',
      desc: 'أنشئ فواتير مبسطة برمز الاستجابة السريعة (QR Code) متوافقة مع متطلبات الهيئة العامة للضرائب (GTA) في قطر',
      editRecord: 'تعديل الفاتورة',
      newRecord: 'إصدار فاتورة جديدة',
      clear: '🧹 مسح الفاتورة',
      trial: 'تجريبي',
      storeNameLabel: 'اسم المتجر',
      vatNumLabel: 'الرقم الضريبي / السجل التجاري',
      invNumLabel: 'رقم الفاتورة',
      custNameLabel: 'اسم العميل',
      custNamePH: 'مثال: محمد المطيري',
      cashCust: 'عميل نقدي',
      cartTitle: 'سلة منتجات الفاتورة',
      prodNamePH: 'اسم المنتج',
      pricePH: 'السعر',
      qtyPH: 'الكمية',
      addProdBtn: '➕ إضافة المنتج للفاتورة',
      qtyLabel: 'عدد:',
      editBtn: 'تعديل',
      delBtn: 'حذف',
      saveBtnNew: '+ حفظ وإصدار الفاتورة',
      saveBtnEdit: '💾 تحديث وحفظ الفاتورة',
      previewTitle: 'معاينة الفاتورة والطباعة',
      invSimple: 'فاتورة مبيعات مبسطة',
      clientLabel: 'العميل:',
      itemsCountLabel: 'عدد الأصناف:',
      itemsWord: 'منتجات',
      vatLabel: 'الضريبة (0%):',
      grandTotal: 'الإجمالي الشامل:',
      printBtn: '🖨️ طباعة الفاتورة الحالية',
      currency: 'ر.ق',
      searchPH: '🔍 بحث برقم الفاتورة أو العميل...',
      exportBtn: '📥 تصدير Excel',
      importBtn: '📂 استيراد',
      qrStore: 'المتجر',
      qrVat: 'الرقم الضريبي',
      qrDate: 'التاريخ',
      qrTotal: 'الإجمالي',
      qrVatAmt: 'الضريبة',
      miscProducts: 'منتجات متنوعة',
      filters: {
        all: 'الكل',
        day: 'آخر يوم',
        week: 'آخر أسبوع',
        month: 'آخر شهر',
        sixMonths: 'آخر 6 أشهر',
        year: 'آخر سنة'
      },
      table: {
        noRecords: 'لا توجد فواتير مطابقة لبحثك في السجل.',
        th1: '#',
        th2: 'الفاتورة والتاريخ',
        th3: 'العميل والأصناف',
        th4: 'الإجمالي الشامل',
        th5: 'الضريبة (0%)',
        th6: 'الإجراءات',
        print: '🖨️ طباعة',
        itemsReg: 'أصناف مسجلة',
        totalLabel: 'الإجمالي الكلي للفواتير المحددة'
      },
      alerts: {
        limit: '🔒 عذراً، لقد استهلكت الحد التجريبي (3 فواتير). يرجى ترقية حسابك لفتح السعة الكاملة بلا حدود!',
        fillErrStore: 'الرجاء التأكد من تعبئة رقم الفاتورة وبيانات المتجر بشكل صحيح.',
        fillErrProd: 'الرجاء إضافة منتج واحد على الأقل للفاتورة.',
        fillErrItem: 'الرجاء إدخال اسم المنتج وسعره والكمية بشكل صحيح.',
        updateSuccess: '✨ تم تحديث الفاتورة بنجاح!',
        saveSuccess: '✅ تمت إضافة الفاتورة إلى سجل النظام بنجاح!',
        delConfirm: 'هل أنت متأكد من حذف هذه الفاتورة من السجل؟',
        noDataPrint: 'لا توجد منتجات لطباعتها في المعاينة.',
        noDataExp: 'لا توجد بيانات لتصديرها.',
        importSuccess: '✨ تم استيراد الفواتير بنجاح!',
        importErr: '❌ ملف غير صالح.'
      },
      print: {
        title: 'فاتورة مبيعات مبسطة',
        vatLabel: 'الرقم الضريبي:',
        dateLabel: 'تاريخ وإصدار الفاتورة',
        billTo: 'فاتورة إلى العميل',
        th1: '#',
        th2: 'وصف المنتج / الخدمة',
        th3: 'الكمية',
        th4: 'سعر الوحدة',
        th5: 'المجموع',
        subTotal: 'الإجمالي (غير شامل الضريبة)',
        vatAmount: 'الضريبة (0%)',
        grandTotal: 'المبلغ الإجمالي الشامل',
        thanks: 'شكراً لتسوقكم معنا في'
      }
    },
    en: {
      back: '→ Back to Hub',
      title: 'Electronic Invoicing Generator (Mini POS) 🧾',
      desc: 'Create simplified tax invoices with QR Code compliant with Qatar GTA requirements',
      editRecord: 'Edit Invoice',
      newRecord: 'Issue New Invoice',
      clear: '🧹 Clear Invoice',
      trial: 'Trial',
      storeNameLabel: 'Store Name',
      vatNumLabel: 'VAT / CR Number',
      invNumLabel: 'Invoice Number',
      custNameLabel: 'Customer Name',
      custNamePH: 'e.g. John Doe',
      cashCust: 'Cash Customer',
      cartTitle: 'Invoice Products Cart',
      prodNamePH: 'Product Name',
      pricePH: 'Price',
      qtyPH: 'Qty',
      addProdBtn: '➕ Add Product to Invoice',
      qtyLabel: 'Qty:',
      editBtn: 'Edit',
      delBtn: 'Delete',
      saveBtnNew: '+ Save & Issue Invoice',
      saveBtnEdit: '💾 Update & Save Invoice',
      previewTitle: 'Invoice Preview & Print',
      invSimple: 'Simplified Sales Invoice',
      clientLabel: 'Customer:',
      itemsCountLabel: 'Total Items:',
      itemsWord: 'items',
      vatLabel: 'Tax (0%):',
      grandTotal: 'Grand Total:',
      printBtn: '🖨️ Print Current Invoice',
      currency: 'QAR',
      searchPH: '🔍 Search by invoice number or customer...',
      exportBtn: '📥 Export Excel',
      importBtn: '📂 Import',
      qrStore: 'Store',
      qrVat: 'VAT No',
      qrDate: 'Date',
      qrTotal: 'Total',
      qrVatAmt: 'Tax',
      miscProducts: 'Various Products',
      filters: {
        all: 'All Time',
        day: 'Last Day',
        week: 'Last Week',
        month: 'Last Month',
        sixMonths: 'Last 6 Months',
        year: 'Last Year'
      },
      table: {
        noRecords: 'No invoices currently found matching your search.',
        th1: '#',
        th2: 'Invoice & Date',
        th3: 'Customer & Items',
        th4: 'Grand Total',
        th5: 'Tax (0%)',
        th6: 'Actions',
        print: '🖨️ Print',
        itemsReg: 'registered items',
        totalLabel: 'Grand Total'
      },
      alerts: {
        limit: '🔒 Sorry, you reached the trial limit (3 invoices). Please upgrade to unlock unlimited access!',
        fillErrStore: 'Please ensure invoice number and store details are filled correctly.',
        fillErrProd: 'Please add at least one product to the invoice.',
        fillErrItem: 'Please enter valid product name, price, and quantity.',
        updateSuccess: '✨ Invoice updated successfully!',
        saveSuccess: '✅ Invoice added to the system log successfully!',
        delConfirm: 'Are you sure you want to delete this invoice from the log?',
        noDataPrint: 'No products to print in the preview.',
        noDataExp: 'No data to export.',
        importSuccess: '✨ Invoices imported successfully!',
        importErr: '❌ Invalid file.'
      },
      print: {
        title: 'Simplified Sales Invoice',
        vatLabel: 'VAT Number:',
        dateLabel: 'Invoice Date & Issue',
        billTo: 'Bill To Customer',
        th1: '#',
        th2: 'Product / Service Description',
        th3: 'Qty',
        th4: 'Unit Price',
        th5: 'Total',
        subTotal: 'Subtotal',
        vatAmount: 'Tax (0%)',
        grandTotal: 'Grand Total Amount',
        thanks: 'Thank you for shopping with us at'
      }
    }
  };

  const text = t[lang];

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `${text.qrStore}:${storeName} | ${text.qrVat}:${vatNumber} | ${text.qrDate}:${currentFormattedDate} | ${text.qrTotal}:${amt} ${text.currency} \vert{}${text.qrVatAmt}: ${vatAmt.toFixed(2)}${text.currency}`
  )}`;

  const handleAddProduct = () => {
    if (!prodName.trim() || typeof prodPrice !== 'number' || prodPrice <= 0 || prodQty <= 0) {
      alert(text.alerts.fillErrItem);
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
      alert(text.alerts.limit);
      return;
    }
    if (!invoiceNumber.trim() || !storeName.trim() || !vatNumber.trim()) {
      alert(text.alerts.fillErrStore);
      return;
    }
    if (currentProducts.length === 0) {
      alert(text.alerts.fillErrProd);
      return;
    }

    localStorage.setItem('seerk_qa_store_name', storeName);
    localStorage.setItem('seerk_qa_vat_number', vatNumber);

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString(localeStr)} - ${now.toLocaleTimeString(localeStr, timeOptionsDisplay)}`;

    if (editingId) {
      const updated = items.map(item => item.id === editingId ? {
        ...item,
        invoiceNumber,
        customerName: customerName.trim() || text.cashCust,
        storeName,
        vatNumber,
        products: currentProducts,
        totalAmount: amt,
        vatAmount: Number(vatAmt.toFixed(2)),
        createdAt: item.createdAt || formattedDate,
        timestamp: item.timestamp || now.getTime()
      } : item);
      saveToLocalStorage(updated);
      setEditingId(null);
      alert(text.alerts.updateSuccess);
    } else {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        invoiceNumber,
        customerName: customerName.trim() || text.cashCust,
        storeName,
        vatNumber,
        products: currentProducts,
        totalAmount: amt,
        vatAmount: Number(vatAmt.toFixed(2)),
        createdAt: formattedDate,
        timestamp: now.getTime()
      };
      saveToLocalStorage([newItem, ...items]); // حفظ الجديد للأعلى
      alert(text.alerts.saveSuccess);
    }

    handleClearForm();
  };

  const handleEdit = (item: InvoiceItem) => {
    setStoreName(item.storeName);
    setVatNumber(item.vatNumber);
    setInvoiceNumber(item.invoiceNumber);
    setCustomerName(item.customerName);
    
    if (item.products && item.products.length > 0) {
      setCurrentProducts(item.products);
    } else {
      setCurrentProducts([{ id: 'old1', name: (item as any).orderDescription || text.miscProducts, price: item.totalAmount, qty: 1 }]);
    }
    
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm(text.alerts.delConfirm)) {
      const filtered = items.filter(i => i.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handlePrintInvoice = (item: InvoiceItem | null) => {
    let dataToPrint: InvoiceItem;
    if (item) {
       const printProducts = (item.products && item.products.length > 0) 
          ? item.products 
          : [{ id: 'old', name: (item as any).orderDescription || text.miscProducts, price: item.totalAmount, qty: 1 }];
          
       dataToPrint = { ...item, products: printProducts };
    } else {
       if (currentProducts.length === 0) {
         alert(text.alerts.noDataPrint); return;
       }
       dataToPrint = {
        id: 'preview',
        storeName,
        vatNumber,
        invoiceNumber,
        customerName: customerName || text.cashCust,
        products: currentProducts,
        totalAmount: amt,
        vatAmount: vatAmt,
        createdAt: currentFormattedDate
      };
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrPrintUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      `${text.qrStore}:${dataToPrint.storeName} | ${text.qrVat}:${dataToPrint.vatNumber} | ${text.qrDate}:${dataToPrint.createdAt} | ${text.qrTotal}:${dataToPrint.totalAmount} ${text.currency} \vert{}${text.qrVatAmt}: ${dataToPrint.vatAmount.toFixed(2)}${text.currency}`
    )}`;

    let productsRows = '';
    dataToPrint.products.forEach((p, idx) => {
      productsRows += `
        <tr>
          <td>${idx + 1}</td>
          <td style="text-align: ${lang === 'ar' ? 'right' : 'left'};">${p.name}</td>
          <td>${p.qty}</td>
          <td>${p.price}</td>
          <td>${(p.price * p.qty).toFixed(2)}</td>
        </tr>
      `;
    });

    const html = `
      <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
      <head>
        <title>${text.print.title} - ${dataToPrint.invoiceNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; text-align: center; color: #0f172a; background: #f1f5f9; }
          .invoice-box { max-width: 600px; margin: auto; padding: 40px; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .store-name { font-size: 28px; font-weight: 900; margin-bottom: 5px; color: #0f172a; }
          .vat-num { font-size: 14px; color: #64748b; margin-bottom: 30px; }
          .inv-title { font-weight: 900; margin-bottom: 20px; font-size: 18px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: ${lang === 'ar' ? 'right' : 'left'}; margin-bottom: 30px; font-size: 14px; }
          .details-box { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .details-box strong { display: block; color: #64748b; font-size: 12px; margin-bottom: 5px; }
          
          .products-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          .products-table th { background: #f1f5f9; color: #334155; padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: center; }
          .products-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; }
          
          .totals-container { display: flex; justify-content: space-between; align-items: flex-end; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
          .qr-section img { border-radius: 8px; border: 1px solid #e2e8f0; padding: 5px; }
          
          .totals-calc { width: 60%; text-align: ${lang === 'ar' ? 'left' : 'right'}; }
          .totals-row { display: flex; justify-content: space-between; padding: 10px; font-size: 14px; font-weight: bold; border-bottom: 1px solid #e2e8f0; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
          /* استخدام اللون العنابي القطري هنا */
          .totals-row.grand { background: #8A1538; color: white; border-radius: 8px; font-size: 16px; margin-top: 10px; border: none; }
          
          @media print { body { background: #fff; padding: 0; } .invoice-box { box-shadow: none; border: none; max-width: 100%; } }
        </style>
      </head>
      <body onload="window.print();">
        <div class="invoice-box">
          <div class="store-name">${dataToPrint.storeName}</div>
          <div class="vat-num">${text.print.vatLabel} ${dataToPrint.vatNumber}</div>
          <div class="inv-title">${text.print.title} - #${dataToPrint.invoiceNumber}</div>
          
          <div class="details-grid">
            <div class="details-box">
              <strong>${text.print.dateLabel}</strong>
              ${dataToPrint.createdAt}
            </div>
            <div class="details-box">
              <strong>${text.print.billTo}</strong>
              ${dataToPrint.customerName}
            </div>
          </div>

          <table class="products-table">
            <thead>
              <tr>
                <th style="width: 5%;">${text.print.th1}</th>
                <th style="text-align: ${lang === 'ar' ? 'right' : 'left'}; width: 45%;">${text.print.th2}</th>
                <th style="width: 15%;">${text.print.th3}</th>
                <th style="width: 15%;">${text.print.th4}</th>
                <th style="width: 20%;">${text.print.th5}</th>
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
                <span>${text.print.subTotal}</span>
                <span>${(dataToPrint.totalAmount - dataToPrint.vatAmount).toFixed(2)} ${text.currency}</span>
              </div>
              <div class="totals-row">
                <span>${text.print.vatAmount}</span>
                <span>${dataToPrint.vatAmount.toFixed(2)} ${text.currency}</span>
              </div>
              <div class="totals-row grand">
                <span>${text.print.grandTotal}</span>
                <span>${dataToPrint.totalAmount.toFixed(2)} ${text.currency}</span>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; font-size: 13px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
            ${text.print.thanks} ${dataToPrint.storeName}
          </div>
        </div>
      </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // فلترة النتائج بناءً على البحث والفرز الزمني
  const filteredItems = items.filter(item => {
    const matchesSearch = item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    
    if (dateFilter !== 'all') {
      const itemTime = item.timestamp || 0;
      const now = Date.now();
      const diff = now - itemTime;
      const dayMs = 24 * 60 * 60 * 1000;
      
      if (dateFilter === 'day') matchesDate = diff <= dayMs;
      else if (dateFilter === 'week') matchesDate = diff <= 7 * dayMs;
      else if (dateFilter === 'month') matchesDate = diff <= 30 * dayMs;
      else if (dateFilter === '6months') matchesDate = diff <= 180 * dayMs;
      else if (dateFilter === 'year') matchesDate = diff <= 365 * dayMs;
    }
    
    return matchesSearch && matchesDate;
  });

  const totalInvoicesAmount = filteredItems.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalVatValue = filteredItems.reduce((acc, curr) => acc + curr.vatAmount, 0);

  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
      alert(text.alerts.noDataExp);
      return;
    }

    let tableHtml = `
      <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}" lang="${lang}">
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
                <th>${text.table.th1}</th>
                <th>Invoice Number</th>
                <th>Date / Time</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Grand Total (${text.currency})</th>
                <th>Tax 0% (${text.currency})</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredItems.forEach((row, idx) => {
      const prodsText = row.products 
        ? row.products.map(p => `${p.name} (${text.print.th3} ${p.qty})`).join('، ')
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
                <td colspan="5">${text.table.totalLabel}</td>
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
    link.setAttribute("download", `enjazya_qa_invoices_${dateFilter}.xls`);
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
            const newItems = imported.filter(imp => !items.find(i => i.id === imp.id));
            saveToLocalStorage([...newItems, ...items]);
            alert(text.alerts.importSuccess);
          }
        } catch (err) {
          alert(text.alerts.importErr);
        }
      };
    }
  };

  return (
    <div className="tool-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { max-width: 1100px; margin: 20px auto; padding: 20px; }
        @media(max-width: 768px) { .tool-container { padding: 10px; margin: 10px auto; } }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        @media(max-width: 850px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .clear-form-btn { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; gap: 5px; }
        .clear-form-btn:hover { background: #fecaca; }

        .input-group { margin-bottom: 15px; width: 100%; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: inherit; outline: none; background: #f8fafc; color: #0f172a; font-weight: 600; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .input-wrapper input:focus { border-color: #8A1538; background: #ffffff; }
        
        .action-btn { background: #8A1538; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: inherit; margin-top: 10px; box-sizing: border-box; }
        .action-btn:hover { background: #6A102B; }

        .add-prod-box { background: #f1f5f9; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; margin-bottom: 20px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .mini-btn { background: #0f172a; color: white; padding: 8px 15px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-family: inherit; }
        
        .products-list { margin-top: 15px; }
        .prod-item { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 8px; font-size: 14px; font-weight: 600; flex-wrap: wrap; gap: 10px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .remove-btn { color: #dc2626; cursor: pointer; font-weight: bold; background: #fee2e2; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .edit-prod-btn { color: #0369a1; cursor: pointer; font-weight: bold; background: #e0f2fe; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; }

        .invoice-preview { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; }
        .invoice-header-text { font-weight: 900; font-size: 18px; color: #0f172a; margin-bottom: 5px; }
        .invoice-sub { font-size: 13px; color: #64748b; margin-bottom: 15px; }
        .qr-box { margin: 15px auto; width: 130px; height: 130px; background: #fff; padding: 5px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; }
        .qr-box img { width: 120px; height: 120px; }
        
        .print-btn { background: #FAF0F2; color: #8A1538; border: 1px solid #EBB8C6; padding: 10px; width: 100%; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer; margin-top: 15px; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s;}
        .print-btn:hover { background: #8A1538; color: #ffffff; }

        .table-section { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        
        .search-input { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; flex-grow: 1; max-width: 350px; box-sizing: border-box; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .search-input:focus { border-color: #8A1538; }
        
        .filter-select { padding: 9px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 13px; outline: none; background: #fff; color: #334155; cursor: pointer; min-width: 130px; }
        .filter-select:focus { border-color: #8A1538; }

        .table-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        .t-btn { padding: 9px 14px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .t-btn:hover { background: #f1f5f9; border-color: #8A1538; color: #8A1538; }

        .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; min-width: 850px; }
        .data-table th { background: #f8fafc; padding: 12px; text-align: ${lang === 'ar' ? 'right' : 'left'}; border-bottom: 2px solid #cbd5e1; font-weight: 800; color: #334155; white-space: nowrap; }
        .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-weight: 600; vertical-align: middle; }
        .data-table tfoot td { background: #f1f5f9; font-weight: 900; color: #0f172a; border-top: 2px solid #cbd5e1; }
        
        .trial-badge { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; }
        
        .tb-action-btn { border: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit;}
        .btn-edit { background: #e0f2fe; color: #0369a1; }
        .btn-delete { background: #fee2e2; color: #991b1b; }
        .btn-print-tb { background: #FAF0F2; color: #8A1538; border: 1px solid #EBB8C6; }
        .btn-print-tb:hover { background: #8A1538; color: #fff; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>{text.title}</h1>
          <p>{text.desc}</p>
        </div>
        <Link href="/hub/qa" className="back-btn">
          {text.back}
        </Link>
      </div>

      <div className="grid-layout">
        <div className="card">
          <h2 className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span>{editingId ? text.editRecord : text.newRecord}</span>
              <button type="button" className="clear-form-btn" onClick={handleClearForm}>
                {text.clear}
              </button>
            </div>
            {isClient && !isActivated && <span className="trial-badge">{text.trial}: {items.length}/3</span>}
          </h2>

          <form onSubmit={handleSaveItem}>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <div className="input-group">
                <label style={{ color: '#0f172a' }}>{text.storeNameLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ color: '#0f172a' }}>{text.vatNumLabel}</label>
                <div className="input-wrapper">
                  <input type="text" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>{text.invNumLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>{text.custNameLabel}</label>
              <div className="input-wrapper">
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={text.custNamePH} />
              </div>
            </div>

            <div className="add-prod-box">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>{text.cartTitle}</label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '10px', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                <input type="text" value={prodName} onChange={(e)=>setProdName(e.target.value)} placeholder={text.prodNamePH} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', textAlign: lang === 'ar' ? 'right' : 'left' }} />
                <input type="number" value={prodPrice} onChange={(e)=>setProdPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder={text.pricePH} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', textAlign: lang === 'ar' ? 'right' : 'left' }} />
                <input type="number" min="1" value={prodQty} onChange={(e)=>setProdQty(Number(e.target.value))} placeholder={text.qtyPH} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', textAlign: lang === 'ar' ? 'right' : 'left' }} />
              </div>
              <button type="button" className="mini-btn" onClick={handleAddProduct} style={{ width: '100%' }}>{text.addProdBtn}</button>

              {currentProducts.length > 0 && (
                <div className="products-list">
                  {currentProducts.map((p, i) => (
                    <div className="prod-item" key={p.id}>
                      <span>{i+1}. {p.name} ({text.qtyLabel} {p.qty})</span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ color: '#047857' }}>{p.price * p.qty} {text.currency}</span>
                        <button type="button" className="edit-prod-btn" onClick={() => handleEditProduct(p)}>{text.editBtn}</button>
                        <button type="button" className="remove-btn" onClick={() => handleRemoveProduct(p.id)}>{text.delBtn}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="action-btn">
              {editingId ? text.saveBtnEdit : text.saveBtnNew}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-title">{text.previewTitle}</h2>

          <div className="invoice-preview">
            <div className="invoice-header-text">{storeName}</div>
            <div className="invoice-sub">{text.print.vatLabel} {vatNumber}</div>
            
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '10px 0', padding: '8px', background: '#fff', borderRadius: '6px' }}>
              {text.invSimple} - #{invoiceNumber}
            </div>

            <div style={{ textAlign: lang === 'ar' ? 'right' : 'left', fontSize: '13px', margin: '15px 0', lineHeight: '1.6' }}>
              <div><strong style={{ color: '#475569' }}>{text.clientLabel}</strong> {customerName || text.cashCust}</div>
              <div><strong style={{ color: '#475569' }}>{text.itemsCountLabel}</strong> {currentProducts.length} {text.itemsWord}</div>
            </div>

            <div className="qr-box">
              <img src={qrCodeUrl} alt="GTA QR Code" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, padding: '8px 10px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '10px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span>{text.vatLabel}</span>
              <span style={{ color: '#047857' }}>{vatAmt.toFixed(2)} {text.currency}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 900, padding: '10px', background: '#8A1538', color: '#fff', borderRadius: '6px', marginTop: '8px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
              <span>{text.grandTotal}</span>
              <span>{amt} {text.currency}</span>
            </div>
          </div>

          <button onClick={() => handlePrintInvoice(null)} className="print-btn">
             {text.printBtn}
          </button>
        </div>
      </div>

      <div className="table-section">
        <div className="table-toolbar">
          <input 
            type="text" 
            className="search-input" 
            placeholder={text.searchPH} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select 
            className="filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">{text.filters.all}</option>
            <option value="day">{text.filters.day}</option>
            <option value="week">{text.filters.week}</option>
            <option value="month">{text.filters.month}</option>
            <option value="6months">{text.filters.sixMonths}</option>
            <option value="year">{text.filters.year}</option>
          </select>

          <div className="table-btns">
            <button className="t-btn" onClick={handleExportExcel}>
              {lang === 'ar' ? 'تصدير 📥' : 'Export 📥'}
            </button>
            <button className="t-btn" onClick={() => fileInputRef.current?.click()}>
              {lang === 'ar' ? 'استيراد 📂' : 'Import 📂'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{text.table.th1}</th>
                <th>{text.table.th2}</th>
                <th>{text.table.th3}</th>
                <th>{text.table.th4}</th>
                <th>{text.table.th5}</th>
                <th>{text.table.th6}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                    {text.table.noRecords}
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
                           {hasProducts ? `${item.products.length} ${text.table.itemsReg}` : (item as any).orderDescription}
                        </div>
                      </td>
                      <td style={{ fontWeight: 900 }}>{item.totalAmount} {text.currency}</td>
                      <td style={{ color: '#047857' }}>{item.vatAmount} {text.currency}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="tb-action-btn btn-print-tb" onClick={() => handlePrintInvoice(item)} title={text.table.print}>{text.table.print}</button>
                          <button className="tb-action-btn btn-edit" onClick={() => handleEdit(item)} title={text.editBtn}>✏️</button>
                          <button className="tb-action-btn btn-delete" onClick={() => handleDelete(item.id)} title={text.delBtn}>❌</button>
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
                  <td colSpan={3} style={{ textAlign: 'center' }}>{text.table.totalLabel}</td>
                  <td>{totalInvoicesAmount.toFixed(2)} {text.currency}</td>
                  <td style={{ color: '#047857' }}>{totalVatValue.toFixed(2)} {text.currency}</td>
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
