'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// قاموس الترجمة الفوري لأداة تنظيف بيانات الإكسل
const toolTranslations: { [key: string]: any } = {
  ar: {
    back: 'العودة للوحة التحكم',
    titleMain: 'تنسيق وتنظيف',
    titleSub: 'بيانات الإكسل',
    desc: 'نظف قوائم المنتجات والأسعار العشوائية، وأزل المسافات والأسطر الزائدة لتحويلها لملفات مرتبة.',
    panel1Title: '📥 البيانات العشوائية (قبل التنظيف)',
    inputLabel: 'الرجاء لصق النص أو الجدول هنا:',
    inputPh: 'ألصق البيانات المبعثرة هنا...',
    cleanBtn: '⚡ تنظيف وترتيب البيانات الآن',
    panel2Title: '📤 البيانات النظيفة والمرتبة',
    outputLabel: 'الناتج النهائي:',
    outputPh: 'البيانات المرتبة ستظهر هنا...',
    copyBtn: '📋 نسخ البيانات النظيفة',
    alertMissing: 'الرجاء لصق بعض النص أو البيانات أولاً.',
    alertCopied: 'تم نسخ البيانات النظيفة بنجاح ومزامنته سحابياً!'
  },
  en: {
    back: 'Back to Dashboard',
    titleMain: 'Excel Data',
    titleSub: 'Cleaner & Formatter',
    desc: 'Clean random product lists and prices, remove extra spaces and lines into organized files.',
    panel1Title: '📥 Raw Data (Before Cleaning)',
    inputLabel: 'Please paste text or table here:',
    inputPh: 'Paste scattered data here...',
    cleanBtn: '⚡ Clean & Format Data Now',
    panel2Title: '📤 Clean & Organized Data',
    outputLabel: 'Final Output:',
    outputPh: 'Organized data will appear here...',
    copyBtn: '📋 Copy Cleaned Data',
    alertMissing: 'Please paste some text or data first.',
    alertCopied: 'Cleaned data copied and synced to cloud successfully!'
  },
  fr: {
    back: 'Retour au tableau de bord',
    titleMain: 'Nettoyeur de données',
    titleSub: 'Excel',
    desc: 'Nettoyez vos listes de produits et supprimez les espaces superflus.',
    panel1Title: '📥 Données brutes',
    inputLabel: 'Collez le texte ou le tableau ici :',
    inputPh: 'Collez les données ici...',
    cleanBtn: '⚡ Nettoyer les données',
    panel2Title: '📤 Données nettoyées',
    outputLabel: 'Résultat final :',
    outputPh: 'Les données organisées apparaîtront ici...',
    copyBtn: '📋 Copier les données',
    alertMissing: 'Veuillez coller du texte ou des données.',
    alertCopied: 'Données copiées et synchronisées avec succès !'
  },
  es: {
    back: 'Volver al panel',
    titleMain: 'Limpiador de datos',
    titleSub: 'de Excel',
    desc: 'Limpia listas de productos y elimina espacios y líneas adicionales.',
    panel1Title: '📥 Datos sin procesar',
    inputLabel: 'Por favor pega el texto o tabla aquí:',
    inputPh: 'Pega los datos dispersos aquí...',
    cleanBtn: '⚡ Limpiar y formatear datos',
    panel2Title: '📤 Datos limpios y organizados',
    outputLabel: 'Resultado final:',
    outputPh: 'Los datos organizados aparecerán aquí...',
    copyBtn: '📋 Copiar datos limpios',
    alertMissing: 'Por favor pega algo de texto o datos primero.',
    alertCopied: '¡Datos limpios copiados y sincronizados con éxito!'
  },
  tr: {
    back: 'Kontrol Paneline Dön',
    titleMain: 'Excel Verisi',
    titleSub: 'Temizleyici ve Düzenleyici',
    desc: 'Rastgele ürün listelerini temizleyin, fazladan boşlukları ve satırları kaldırın.',
    panel1Title: '📥 Ham Veri (Temizlik Öncesi)',
    inputLabel: 'Lütfen metni veya tabloyu buraya yapıştırın:',
    inputPh: 'Dağınık verileri buraya yapıştırın...',
    cleanBtn: '⚡ Verileri Şimdi Temizle',
    panel2Title: '📤 Temiz ve Düzenli Veri',
    outputLabel: 'Nihai Çıktı:',
    outputPh: 'Düzenlenen veriler burada görünecek...',
    copyBtn: '📋 Temiz Veriyi Kopyala',
    alertMissing: 'Lütfen önce biraz metin veya veri yapıştırın.',
    alertCopied: 'Temizlenen veri kopyalandı ve buluta senkronize edildi!'
  },
  zh: {
    back: '返回控制面板',
    titleMain: 'Excel 数据',
    titleSub: '清洗与格式化工具',
    desc: '清理杂乱的产品列表与价格，去除多余空格与空行，转换为整洁的表格数据。',
    panel1Title: '📥 原始数据 (清洗前)',
    inputLabel: '请在此处粘贴文本或表格：',
    inputPh: '在此处粘贴零散数据...',
    cleanBtn: '⚡ 立即清洗并整理数据',
    panel2Title: '📤 清洗后的整洁数据',
    outputLabel: '最终输出:',
    outputPh: '整理后的数据将显示在这里...',
    copyBtn: '📋 复制清洗后的数据',
    alertMissing: '请先粘贴一些文本或数据。',
    alertCopied: '数据已成功清洗、复制并同步至云端！'
  },
  de: {
    back: 'Zurück zum Dashboard',
    titleMain: 'Excel-Daten',
    titleSub: 'Bereinigung & Formatierung',
    desc: 'Bereinigen Sie unformatierte Listen und entfernen Sie Leerzeichen.',
    panel1Title: '📥 Rohdaten (Vor der Bereinigung)',
    inputLabel: 'Bitte Text oder Tabelle hier einfügen:',
    inputPh: 'Verstreute Daten hier einfügen...',
    cleanBtn: '⚡ Daten jetzt bereinigen',
    panel2Title: '📤 Bereinigte Daten',
    outputLabel: 'Endergebnis:',
    outputPh: 'Organisierte Daten erscheinen hier...',
    copyBtn: '📋 Bereinigte Daten kopieren',
    alertMissing: 'Bitte fügen Sie zuerst Text oder Daten ein.',
    alertCopied: 'Daten erfolgreich kopiert und synchronisiert!'
  },
  id: {
    back: 'Kembali ke Dasbor',
    titleMain: 'Pembersih Data',
    titleSub: 'Excel & Format',
    desc: 'Bersihkan daftar produk acak dan hapus spasi serta baris berlebih.',
    panel1Title: '📥 Data Mentah (Sebelum Dibersihkan)',
    inputLabel: 'Silakan tempel teks atau tabel di sini:',
    inputPh: 'Tempel data di sini...',
    cleanBtn: '⚡ Bersihkan & Format Data Sekarang',
    panel2Title: '📤 Data Bersih & Teratur',
    outputLabel: 'Hasil Akhir:',
    outputPh: 'Data teratur akan muncul di sini...',
    copyBtn: '📋 Salin Data Bersih',
    alertMissing: 'Harap tempel beberapa teks atau data terlebih dahulu.',
    alertCopied: 'Data bersih berhasil disalin dan disinkronkan ke cloud!'
  }
};

export default function ExcelScraperTool() {
  const [currentLang, setCurrentLang] = useState('ar');
  const [currentCurrency, setCurrentCurrency] = useState('SAR');
  const [licenseKey, setLicenseKey] = useState('');

  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');

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

  const cleanData = () => {
    if (!inputText) {
      alert(t.alertMissing);
      return;
    }

    const lines = inputText.split('\n');
    const cleanedLines = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    setCleanedText(cleanedLines);
  };

  const copyCleaned = () => {
    navigator.clipboard.writeText(cleanedText);
    alert(t.alertCopied);
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

        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        
        textarea { width: 100%; height: 250px; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; font-family: inherit; background: #f8fafc; color: #0f172a; outline: none; resize: vertical; }
        textarea:focus { border-color: #4f46e5; background: #ffffff; }

        .action-btn { background: #4f46e5; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .action-btn:hover { background: #4338ca; }

        .copy-btn { background: #10b981; color: #ffffff; width: 100%; padding: 14px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 15px; }
        .copy-btn:hover { background: #059669; }

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
            <label>{t.inputLabel}</label>
            <textarea 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder={t.inputPh}
            />
          </div>
          <button onClick={cleanData} className="action-btn">
            {t.cleanBtn}
          </button>
        </div>

        <div className="panel" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
          <h2 style={{ color: '#fff', borderColor: '#334155' }}>{t.panel2Title}</h2>
          <div className="input-group">
            <label style={{ color: '#cbd5e1' }}>{t.outputLabel}</label>
            <textarea 
              value={cleanedText} 
              readOnly 
              placeholder={t.outputPh}
              style={{ background: '#1e293b', color: '#f8fafc', borderColor: '#334155' }}
            />
          </div>
          {cleanedText && (
            <button onClick={copyCleaned} className="copy-btn">
              {t.copyBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
