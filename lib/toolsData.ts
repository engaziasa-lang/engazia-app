// @ts-nocheck
/* eslint-disable */
import React from 'react';
import { getToolBySlug } from '@/lib/toolsData';

export default async function ProgrammaticLandingPage(props: any) {
  // التوافق التام والآمن مع Next.js (سواء كان params عبارة عن Promise أو Object)
  const params = await props.params;
  const slug = params?.slug || 'profit-salla-perfumes';
  
  // توليد المحتوى الضخم بناءً على الرابط
  const pageData = getToolBySlug(slug);

  return (
    <div style={{ width: '100%', backgroundColor: '#f8fafc', padding: '40px 16px', direction: 'rtl', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* قسم الهيدر الديناميكي المولد آلياً */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '32px' }}>
          
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'right' }}>
            <span style={{ display: 'inline-block', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '14px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '9999px', border: '1px solid #a7f3d0', width: 'fit-content' }}>
              {pageData.badge}
            </span>
            
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', lineHeight: '1.4', margin: 0 }}>
              {pageData.title}
            </h1>

            <p style={{ fontSize: '18px', fontWeight: '700', color: '#059669', margin: 0, lineHeight: '1.6' }}>
              {pageData.subtitle}
            </p>
            
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.8', margin: 0 }}>
              {pageData.description}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pageData.features?.map((feature: string, index: number) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', color: '#334155', fontSize: '15px', fontWeight: '600' }}>
                  <span style={{ width: '24px', height: '24px', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '12px', flexShrink: 0, fontSize: '14px', fontWeight: 'bold' }}>
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div style={{ paddingTop: '16px' }}>
              <a 
                href={pageData.actionUrl} 
                style={{ display: 'inline-block', backgroundColor: '#059669', color: '#ffffff', fontSize: '18px', fontWeight: 'bold', padding: '16px 36px', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 10px 20px -3px rgba(5, 150, 105, 0.4)', textAlign: 'center', transition: 'all 0.3s ease' }}
              >
                تفعيل الأداة لمتجرك الآن ←
              </a>
            </div>
          </div>
        </div>

        {/* قسم المحتوى الطويل جداً لأرشفة جوجل (SEO Content) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '48px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'right' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#047857', margin: 0, borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
            {pageData.articleTitle}
          </h2>
          <p style={{ fontSize: '17px', color: '#334155', lineHeight: '2.1', margin: 0, textAlign: 'justify' }}>
            {pageData.articleText1}
          </p>
          <p style={{ fontSize: '17px', color: '#334155', lineHeight: '2.1', margin: 0, textAlign: 'justify' }}>
            {pageData.articleText2}
          </p>
          
          {/* الفقرات الديناميكية الإضافية لرفع عدد الكلمات */}
          {pageData.sections?.map((sec: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                {sec.heading}
              </h3>
              <p style={{ fontSize: '17px', color: '#334155', lineHeight: '2.1', margin: 0, textAlign: 'justify' }}>
                {sec.text1}
              </p>
              <p style={{ fontSize: '17px', color: '#334155', lineHeight: '2.1', margin: 0, textAlign: 'justify' }}>
                {sec.text2}
              </p>
            </div>
          ))}
        </div>

        {/* قسم الأسئلة الشائعة (FAQ Schema) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '48px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textAlign: 'right' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f172a', marginBottom: '32px' }}>
            أسئلة شائعة تهم رواد الأعمال
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {pageData.faqs?.map((faq: any, idx: number) => (
              <div key={idx} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 12px 0' }}>{faq.question}</h3>
                <p style={{ fontSize: '16px', color: '#64748b', margin: 0, lineHeight: '1.9' }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
