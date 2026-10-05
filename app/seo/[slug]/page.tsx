/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { generateSeoContent } from '@/lib/seoEngine';

// الطريقة الرسمية في Next.js 15 لضمان نجاح البناء (Promise params)
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProgrammaticSeoPage({ params }: PageProps) {
  // 1. انتظار الـ Promise بأمان
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // 2. توليد محتوى الصفحة الضخم
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
          <a 
            href={pageData.actionUrl} 
            style={{ display: 'inline-block', backgroundColor: '#059669', color: '#fff', padding: '16px 32px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', fontSize: '18px', transition: 'background-color 0.3s' }}
          >
            تفعيل الأداة لمتجرك الآن ←
          </a>
        </header>

        {/* المقال التفصيلي (SEO Content) */}
        <article style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', color: '#334155', lineHeight: '2.2' }}>
          <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
            {pageData.article.h1}
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '32px' }}>{pageData.article.intro}</p>

          <h3 style={{ fontSize: '24px', color: '#047857', fontWeight: '700', marginBottom: '16px' }}>{pageData.article.h2_1}</h3>
          <p style={{ fontSize: '18px', marginBottom: '32px' }}>{pageData.article.p_1}</p>

          <h3 style={{ fontSize: '24px', color: '#047857', fontWeight: '700', marginBottom: '16px' }}>{pageData.article.h2_2}</h3>
          <p style={{ fontSize: '18px', marginBottom: '32px' }}>{pageData.article.p_2}</p>

          <h3 style={{ fontSize: '24px', color: '#047857', fontWeight: '700', marginBottom: '16px' }}>{pageData.article.h2_3}</h3>
          <p style={{ fontSize: '18px', marginBottom: '0' }}>{pageData.article.p_3}</p>
        </article>

        {/* الأسئلة الشائعة */}
        <section style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800', marginBottom: '32px' }}>الأسئلة الشائعة</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {pageData.faqs.map((faq, index) => (
              <div key={index} style={{ borderBottom: index !== pageData.faqs.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: index !== pageData.faqs.length - 1 ? '24px' : '0' }}>
                <h4 style={{ fontSize: '20px', color: '#1e293b', fontWeight: '700', margin: '0 0 12px 0' }}>{faq.q}</h4>
                <p style={{ fontSize: '18px', color: '#475569', margin: '0', lineHeight: '1.8' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
