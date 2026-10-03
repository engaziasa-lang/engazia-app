'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface TipItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  details: string;
  icon: string;
}

const saudiTips: TipItem[] = [
  {
    id: '1',
    category: 'التحويل والمبيعات',
    title: 'تفعيل خيارات الدفع المحلي الموثوقة (مدى وأبل باي)',
    summary: 'المستهلك السعودي يثق بشكل مطلق ببطاقات "مدى" و"Apple Pay". إبراز هذه الشعارات في صفحة الدفع يرفع معدل إتمام السلة بنسبة تتجاوز 40%.',
    details: 'تأكد من إظهار شعار مدى وأبل باي بشفافية في الهيدر وفي صفحة المنتج الأولى، حيث أن غيابها يولد شعوراً بعدم الأمان لدى المشتري ويؤدي لتركه السلة.',
    icon: '💳'
  },
  {
    id: '2',
    category: 'التقسيط والقدرة الشرائية',
    title: 'الدمج الذكي لخدمات الشراء الآن وادفع لاحقاً (تابي وتمارا)',
    summary: 'رفع قيمة السلة الشرائية المتوسطة (AOV) عن طريق توفير خيارات التقسيط بدون فوائد للمشتريات التي تتجاوز 200 ريال.',
    details: 'تشير الإحصائيات في السوق السعودي إلى أن المتاجر التي تدعم تابي وتمارا تشهد نمواً في حجم الطلبات بنسبة تصل إلى 35%، خصوصاً في قطاعات الأجهزة، العطور، والأزياء.',
    icon: '📈'
  },
  {
    id: '3',
    category: 'التسويق والإعلانات',
    title: 'حملات إكسبلور تيك توك وسناب شات باللهجة المحلية',
    summary: 'العميل السعودي يتفاعل بشكل أكبر مع المحتوى العفوي الحقيقي المصور بالهاتف المحمول مقارنة بالإعلانات الإنتاجية المعقدة.',
    details: 'استخدم أداة مولد النصوص لدينا لتوليد سكربتات تبدأ بـ "يا أهلنا في السعودية" أو "يا راعي المتجر"، واعتمد على صناع محتوى محليين لتعزيز مصداقية منتجك.',
    icon: '🎬'
  },
  {
    id: '4',
    category: 'الاحتفاظ بالعملاء',
    title: 'خدمة عملاء واتساب السريعة خلال 5 دقائق',
    summary: 'السرعة في الرد على استفسارات الواتساب هي الفيصل الحاسم بين إتمام الطلب أو ذهاب العميل للمنافس.',
    details: 'استخدم قوالب الردود السريعة، وجهز روابط الدفع المباشر عبر الواتساب للعملاء المترددين، فالتواصل البشري السريع يضاعف الولاء بنقاط قياسية.',
    icon: '💬'
  },
  {
    id: '5',
    category: 'اللوجستيات والشحن',
    title: 'تنويع خيارات الشحن وإضافة الاستلام من الخزائن (RedBox)',
    summary: 'منح العميل حرية اختيار طريقة التوصيل (المنزل أو خزائن الاستلام السريع) يقلل من نسب رفض الاستلام.',
    details: 'الكثير من العملاء يفضلون استلام شحناتهم بأنفسهم من خزائن ريدبوكس القريبة لتجنب انتظار مندوب التوصيل، مما يرفع نسبة رضا العملاء ويقلل تكاليف الشحن العكسي.',
    icon: '📦'
  },
  {
    id: '6',
    category: 'الالتزام والأنظمة',
    title: 'الشفافية الكاملة وعرض السعر الشامل للضريبة (15%)',
    summary: 'الالتزام بالقوانين الصادرة من وزارة التجارة وهيئة الزكاة والضريبة والجمارك (زاتكا) يحمي متجرك من الغرامات ويعزز السمعة.',
    details: 'تأكد دائماً من أن الأسعار الظاهرة للعميل في المتجر تشمل ضريبة القيمة المضافة، وإرفاق الفواتير الإلكترونية برمز الاستجابة السريعة (QR) تلقائياً مع كل طلب.',
    icon: '⚖️'
  }
];

export default function SaudiGrowthTipsSA() {
  const [selectedTip, setSelectedTip] = useState<TipItem>(saudiTips[0]);

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1100px; margin: 40px auto; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1.3fr; gap: 30px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .tips-list { display: flex; flexDirection: column; gap: 10px; }
        .tip-card-btn { padding: 14px; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 10px; cursor: pointer; text-align: start; transition: all 0.2s; display: flex; align-items: center; gap: 12px; font-family: 'Tajawal', sans-serif; }
        .tip-card-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .tip-card-btn.active { background: #ecfdf5; border-color: #047857; box-shadow: 0 2px 4px rgba(4,120,87,0.1); }
        
        .tip-icon { font-size: 24px; background: #fff; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid #e2e8f0; flex-shrink: 0; }
        
        .tip-content-box h2 { font-size: 20px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 15px; line-height: 1.4; }
        .tip-badge { background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 12px; display: inline-block; margin-bottom: 15px; }
        
        .tip-summary { font-size: 15px; font-weight: 700; color: #334155; line-height: 1.6; background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
        .tip-details { font-size: 14px; color: #475569; line-height: 1.8; font-weight: 500; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>أسرار نمو المتاجر السعودية 💡</h1>
          <p>مكتبة استراتيجيات حصرية لزيادة التحويل، تقليل المرتجعات، ورفع ولاء العملاء في السوق المحلي</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قائمة النصائح والاستراتيجيات */}
        <div className="card">
          <h2 className="card-title">مواضيع النمو (6 استراتيجيات)</h2>
          <div className="tips-list">
            {saudiTips.map((tip) => (
              <button 
                key={tip.id} 
                className={`tip-card-btn ${selectedTip.id === tip.id ? 'active' : ''}`}
                onClick={() => setSelectedTip(tip)}
              >
                <div className="tip-icon">{tip.icon}</div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#047857', marginBottom: '2px' }}>{tip.category}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', lineHeight: '1.3' }}>{tip.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* تفاصيل النصيحة المختار */}
        <div className="card">
          <span className="tip-badge">{selectedTip.category}</span>
          <div className="tip-content-box">
            <h2>{selectedTip.title}</h2>
            <div className="tip-summary">
              {selectedTip.summary}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>التفاصيل والتطبيق العملي:</div>
            <div className="tip-details">
              {selectedTip.details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
