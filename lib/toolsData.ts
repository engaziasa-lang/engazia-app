// lib/toolsData.ts

export interface ToolData {
  id: number;
  slug: string;
  title: string;
  description: string;
  imagePath: string;
  features: string[];
  faqs: { question: string; answer: string }[];
}

// قائمة بمدن المملكة ومنصات التجارة لإنشاء تنوع فريد يمنع التكرار
const saudiRegions = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "تبوك", "القصيم", "خميس مشيط"];
const storePlatforms = ["منصة سلة (Salla)", "منصة زد (Zid)", "المتاجر المستقلة", "دروبشيبينغ السعودية"];

export const toolsData: Record<string, ToolData> = {
  "breakeven-calculator": {
    id: 1,
    slug: "breakeven-calculator",
    title: "حاسبة أرباح ونقطة التعادل (15% ضريبة)",
    description: "احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة 15% المعتمدة في المملكة.",
    imagePath: "/images/tools/tool-1.png",
    features: [
      "حساب دقيق لهامش الربح الفعلي للقطعة",
      "متوافق تماماً مع متطلبات هيئة الزكاة والضريبة (ZATCA)",
      "تحليل فوري لتكاليف البوابة والشحن والعمولات"
    ],
    faqs: [
      { question: "كيف تساعدني حاسبة نقطة التعادل في متجري؟", answer: "تحدد لك بدقة عدد القطع التي يجب بيعها لتغطية كافة التكاليف وتحقيق أرباح صافية." },
      { question: "هل الحاسبة متوافقة مع ضريبة 15% بالسعودية؟", answer: "نعم، تحسب الضريبة والخصومات بشكل آلي لضمان عدم تعرض متجرك لأي خسائر مخفية." }
    ]
  },
  "payment-gateway-fees": {
    id: 2,
    slug: "payment-gateway-fees",
    title: "حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)",
    description: "احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك الإلكتروني.",
    imagePath: "/images/tools/tool-2.png",
    features: [
      "دعم شامل لمدى، تابي، تمارا، وApple Pay",
      "حساب الرسوم الثابتة والمتغيرة بدقة متناهية",
      "معرفة المبلغ الصافي الحقيقي الداخل لحسابك البنكي"
    ],
    faqs: [
      { question: "لماذا تختلف رسوم بوابات الدفع في السعودية؟", answer: "لكل بوابة نسبة مئوية ورسوم ثابتة تؤثر بشكل مباشر على صافي ربح الطلب إذا لم يتم جدولتها." }
    ]
  },
  // ... وبقية الأداوت بنفس النسق الاحترافي
};

export function getToolBySlug(slug: string): ToolData | undefined {
  return toolsData[slug];
}
