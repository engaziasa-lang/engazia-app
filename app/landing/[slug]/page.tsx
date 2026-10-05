/* eslint-disable @next/next/no-img-element */
import { getToolBySlug, getRelatedTools } from '@/lib/toolsData';
import Link from 'next/link';

export default async function LandingPage({ params }: { params: any }) {
  // التوافق مع إصدارات Next.js الحديثة حيث params تعتبر Promise
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || 'breakeven-calculator';
  
  const tool = getToolBySlug(slug);
  const relatedTools = getRelatedTools(slug);

  return (
    <div style={{ width: '100%', backgroundColor: '#f8fafc', padding: '40px 16px', direction: 'rtl', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* قسم الهيدر */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '32px' }}>
          
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'right' }}>
            <span style={{ display: 'inline-block', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '12px', fontWeight: 'bold', padding: '6px 14px', borderRadius: '9999px', border: '1px solid #a7f3d0', width: 'fit-content' }}>
              {tool.badge}
            </span>
            
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', lineHeight: '1.4', margin: 0 }}>
              {tool.title}
            </h1>

            <p style={{ fontSize: '15px', fontWeight: '600', color: '#059669', margin: 0 }}>
              {tool.subtitle}
            </p>
            
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', margin: 0 }}>
              {tool.description}
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tool.features.map((feature, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', color: '#334155', fontSize: '14px', fontWeight: '500' }}>
                  <span style={{ width: '20px', height: '20px', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '12px', flexShrink: 0, fontSize: '12px', fontWeight: 'bold' }}>
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div style={{ paddingTop: '12px' }}>
              <a 
                href={tool.actionUrl} 
                style={{ display: 'inline-block', backgroundColor: '#059669', color: '#ffffff', fontWeight: 'bold', padding: '14px 28px', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)', textAlign: 'center' }}
              >
                تشغيل الأداة والبدء بالحساب فوراً ←
              </a>
            </div>
          </div>

          <div style={{ flex: '1 1 350px', backgroundColor: '#0f172a', borderRadius: '16px', padding: '12px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={tool.imagePath} 
              alt={tool.title} 
              style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>

        </div>

        {/* قسم محتوى السيو الشامل */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '36px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'right' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#047857', margin: 0 }}>
            {tool.articleTitle}
          </h2>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.9', margin: 0, textAlign: 'justify' }}>
            {tool.articleText1}
          </p>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.9', margin: 0, textAlign: 'justify' }}>
            {tool.articleText2}
          </p>
        </div>

        {/* قسم الأسئلة الشائعة */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textAlign: 'right' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>الأسئلة الشائعة حول هذه الأداة</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tool.faqs.map((faq, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 6px 0' }}>{faq.question}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* قسم الأدوات المشابهة */}
        {relatedTools.length > 0 && (
          <div style={{ backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0', textAlign: 'right' }}>استكشف المزيد من أدوات منصة إنجازيا</h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, textAlign: 'right' }}>منظومة متكاملة من الآلات الحاسبة وأدوات الأتمتة.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', paddingTop: '8px' }}>
              {relatedTools.map((rt, idx) => (
                <Link 
                  key={idx} 
                  href={`/landing/${rt.slug}`}
                  style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '16px', borderRadius: '12px', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#e2e8f0', lineHeight: '1.4', textAlign: 'right' }}>
                    {rt.title}
                  </span>
                  <span style={{ fontSize: '12px', color: '#34d399', marginTop: '16px', display: 'flex', alignItems: 'center' }}>
                    استخدم الأداة <span style={{ marginRight: '4px' }}>←</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
