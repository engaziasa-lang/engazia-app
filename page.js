import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'data', 'data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const problems = JSON.parse(jsonData);

  return problems.map((item) => ({
    slug: item.slug,
  }));
}

export default async function ProblemPage({ params }) {
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), 'data', 'data.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const problems = JSON.parse(jsonData);

  const data = problems.find((item) => item.slug === slug);

  if (!data) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'Tahoma, sans-serif' }}>
        <h2 style={{ color: '#1f2937' }}>عذراً، الصفحة غير موجودة</h2>
        <p style={{ color: '#6b7280' }}>تأكد من الرابط أو انتقل للرئيسية.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Tahoma, sans-serif', direction: 'rtl' }}>
      
      {/* شريط علوي احترافي */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e293b' }}>
          إنجازيا للحلول المالية <span style={{ color: '#2563eb', fontSize: '14px' }}>| Pro Max</span>
        </div>
        <a 
          href="https://chromewebstore.google.com/detail/dpocelchhijafgbmjgnfaafcmhmgbjej?utm_source=item-share-cb" 
          target="_blank"
          style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          حمل الإضافة مجاناً
        </a>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* شارة المنصة */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            منصة {data.platform} التجارة الإلكترونية
          </span>
        </div>

        {/* العنوان الرئيسي */}
        <h1 style={{ fontSize: '36px', color: '#0f172a', fontWeight: '800', lineHeight: '1.3', marginBottom: '20px' }}>
          حل مشكلة {data.problem} في متجر {data.platform}
        </h1>

        {/* وصف المشكلة وتأثيرها */}
        <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.7', marginBottom: '30px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {data.painPoint}
        </p>

        {/* قسم الحل الفوري */}
        <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '24px', borderRadius: '12px', marginBottom: '30px' }}>
          <h3 style={{ color: '#1e40af', fontSize: '18px', marginBottom: '10px', fontWeight: 'bold' }}>⚡ الحل الفوري من إنجازيا:</h3>
          <p style={{ fontSize: '16px', color: '#1e3a8a', lineHeight: '1.6' }}>{data.solution}</p>
        </div>

        {/* زر التحميل البارز */}
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <a 
            href="https://chromewebstore.google.com/detail/dpocelchhijafgbmjgnfaafcmhmgbjej?utm_source=item-share-cb" 
            target="_blank" 
            style={{ 
              display: 'inline-block', 
              backgroundColor: '#2563eb', 
              color: '#fff', 
              padding: '16px 36px', 
              borderRadius: '10px', 
              textDecoration: 'none', 
              fontSize: '18px', 
              fontWeight: 'bold',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              transition: 'background-color 0.2s'
            }}
          >
            🚀 حمل إضافة إنجازيا Pro Max مجاناً من متجر كروم
          </a>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '10px' }}>تثبيت سريع • آمن وموثوق • مصمم خصيصاً لتجار الخليج</p>
        </div>

        {/* قسم مميزات إضافية لزيادة الاحترافية */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '50px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#0f172a', marginBottom: '8px' }}>⏱️ توفير الوقت والجهد</h4>
            <p style={{ fontSize: '14px', color: '#64748b' }}>أتمتة كاملة للعمليات الروتينية لتركيز جهدك على نمو المبيعات.</p>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#0f172a', marginBottom: '8px' }}>🔒 حماية وأمان عالي</h4>
            <p style={{ fontSize: '14px', color: '#64748b' }}>بيانات متجرك وعملائك محفوظة بالكامل وفق أعلى معايير الأمان.</p>
          </div>
        </div>

      </main>

      {/* تذييل الصفحة */}
      <footer style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '14px', borderTop: '1px solid #e2e8f0', marginTop: '60px' }}>
        جميع الحقوق محفوظة © 2026 إنجازيا للحلول المالية
      </footer>

    </div>
  );
}