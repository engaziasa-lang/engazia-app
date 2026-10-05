import { generateSeoPage } from '@/lib/seoEngine';
import Link from 'next/link';

// الطريقة الرسمية في Next.js 15 للتعامل مع الروابط الديناميكية كـ Promise
export default async function ProgrammaticLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // توليد المحتوى الضخم بناءً على الرابط
  const pageData = generateSeoPage(slug);

  return (
    <div style={{ width: '100%', backgroundColor: '#f8fafc', padding: '40px 16px', direction: 'rtl', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* قسم الهيدر الديناميكي */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '32px' }}>
          
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'right' }}>
            <span style={{ display: 'inline-block', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '13px', fontWeight: 'bold', padding: '6px 16px', borderRadius: '9999px', border: '1px solid #a7f3d0', width: 'fit-content' }}>
              {pageData.badge}
            </span>
            
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', lineHeight: '1.4', margin: 0 }}>
              {pageData.title}
            </h1>

            <p style={{ fontSize: '18px', fontWeight: '600', color: '#059669', margin: 0 }}>
              {pageData.subtitle}
            </p>
            
            <div style={{ paddingTop: '16px' }}>
              <a 
                href={pageData.actionUrl} 
                style={{ display: 'inline-block', backgroundColor: '#059669', color: '#ffffff', fontSize: '16px', fontWeight: 'bold', padding: '16px 32px', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)', textAlign: 'center' }}
              >
                تشغيل الأداة والبدء فوراً ←
              </a>
            </div>
          </div>
        </div>

        {/* قسم المحتوى الطويل للسيو المتولد آلياً */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'right' }}>
          <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '16px', marginBottom: '8px' }}>
             <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
               الدليل الشامل التفصيلي
             </h2>
          </div>
          
          {pageData.sections.map((sec, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#047857', margin: 0 }}>
                {sec.heading}
              </h3>
              <p style={{ fontSize: '16px', color: '#334155', lineHeight: '2', margin: 0, textAlign: 'justify' }}>
                {sec.text}
              </p>
            </div>
          ))}
        </div>

        {/* الأسئلة الشائعة الديناميكية */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textAlign: 'right' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px' }}>الأسئلة الشائعة حول الأداة</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pageData.faqs.map((faq, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>{faq.question}</h3>
                <p style={{ fontSize: '15px', color: '#475569', margin: 0, lineHeight: '1.8' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
