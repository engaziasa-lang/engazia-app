/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { generateSeoContent } from '@/lib/seoEngine';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProgrammaticSeoPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const pageData = generateSeoContent(slug);

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 16px', direction: 'rtl', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* الهيدر */}
        <header style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '6px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: 'bold' }}>
            {pageData.badge}
          </span>
          <h1 style={{ fontSize: '36px', color: '#0f172a', fontWeight: '900', marginTop: '20px', marginBottom: '16px', lineHeight: '1.4' }}>
            {pageData.title}
          </h1>
          <p style={{ fontSize: '18px', color: '#047857', fontWeight: '600', marginBottom: '32px' }}>
            {pageData.subtitle}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <a 
              href={pageData.actionUrl} 
              style={{ display: 'inline-block', backgroundColor: '#059669', color: '#fff', padding: '16px 32px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', fontSize: '18px', transition: 'background-color 0.3s', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}
            >
              تفعيل الأداة لمتجرك الآن ←
            </a>
            <a 
              href="https://engazia-app.vercel.app/hub/sa" 
              style={{ display: 'inline-block', backgroundColor: '#ffffff', color: '#0f172a', border: '2px solid #cbd5e1', padding: '15px 28px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', fontSize: '16px', transition: 'all 0.3s' }}
            >
              استكشف منصة إنجازيا واشترك الآن 💡
            </a>
          </div>
        </header>

        {/* --- قسم صورة الأداة --- */}
        <div style={{ width: '100%', textAlign: 'center', margin: '0 auto' }}>
          <img 
            src={pageData.imagePath} 
            alt={pageData.title} 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              maxHeight: '450px',
              borderRadius: '24px', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
              border: '1px solid #e2e8f0',
              objectFit: 'cover',
              display: 'block',
              margin: '0 auto'
            }} 
            loading="lazy" 
          />
        </div>

        {/* المقال التفصيلي (SEO Content) */}
        <article style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', color: '#334155', lineHeight: '2.2' }}>
          <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
            {pageData.article.h1}
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '32px', textAlign: 'justify' }}>{pageData.article.intro}</p>

          <h3 style={{ fontSize: '24px', color: '#047857', fontWeight: '700', marginBottom: '16px' }}>{pageData.article.h2_1}</h3>
          <p style={{ fontSize: '18px', marginBottom: '32px', textAlign: 'justify' }}>{pageData.article.p_1}</p>

          <h3 style={{ fontSize: '24px', color: '#047857', fontWeight: '700', marginBottom: '16px' }}>{pageData.article.h2_2}</h3>
          <p style={{ fontSize: '18px', marginBottom: '32px', textAlign: 'justify' }}>{pageData.article.p_2}</p>

          <h3 style={{ fontSize: '24px', color: '#047857', fontWeight: '700', marginBottom: '16px' }}>{pageData.article.h2_3}</h3>
          <p style={{ fontSize: '18px', marginBottom: '32px', textAlign: 'justify' }}>{pageData.article.p_3}</p>

          <h3 style={{ fontSize: '24px', color: '#047857', fontWeight: '700', marginBottom: '16px' }}>{pageData.article.h2_4}</h3>
          <p style={{ fontSize: '18px', marginBottom: '0', textAlign: 'justify' }}>{pageData.article.p_4}</p>
        </article>

        {/* الأسئلة الشائعة */}
        <section style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800', marginBottom: '32px' }}>الأسئلة الشائعة والاستشارات</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {pageData.faqs.map((faq, index) => (
              <div key={index} style={{ borderBottom: index !== pageData.faqs.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: index !== pageData.faqs.length - 1 ? '24px' : '0' }}>
                <h4 style={{ fontSize: '20px', color: '#1e293b', fontWeight: '700', margin: '0 0 12px 0' }}>{faq.q}</h4>
                <p style={{ fontSize: '18px', color: '#64748b', margin: '0', lineHeight: '1.9' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* شبكة الربط الداخلي المتغيرة لكل صفحة ديناميكياً */}
        <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'right' }}>
            أدوات وحلول سيو مخصصة للمتاجر السعودية
          </h3>
          <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '24px', textAlign: 'right' }}>
            استكشف المزيد من الحلول الرقمية والآلات الحاسبة المصممة لرفع كفاءة ومبيعات المتاجر الرقمية.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {pageData.relatedLinks.map((link, idx) => (
              <Link 
                key={idx} 
                href={link.href}
                style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '16px', borderRadius: '12px', textDecoration: 'none', color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}
              >
                <span>{link.title}</span>
                <span style={{ color: '#34d399', fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                  تصفح الصفحة ←
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
