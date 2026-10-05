// lib/toolsData.ts

export interface ToolData {
  id: number;
  slug: string;
  title: string;
  description: string;
  imagePath: string;
  features: string[];
}

export const toolsData: Record<string, ToolData> = {
  "breakeven-calculator": {
    id: 1,
    slug: "breakeven-calculator",
    title: "حاسبة أرباح ونقطة التعادل (15% ضريبة)",
    description: "احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة.",
    imagePath: "/images/tools/tool-1.png",
    features: ["حساب دقيق لهامش الربح", "متوافق مع ضريبة القيمة المضافة 15%", "تحليل فوري للتكاليف والشحن"]
  },
  "payment-gateway-fees": {
    id: 2,
    slug: "payment-gateway-fees",
    title: "حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)",
    description: "احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك.",
    imagePath: "/images/tools/tool-2.png",
    features: ["دعم لجميع بوابات الدفع المحلية", "حساب الرسوم الثابتة والمتغيرة", "معرفة المبلغ الصافي الحقيقي"]
  },
  "zatca-invoice-generator": {
    id: 3,
    slug: "zatca-invoice-generator",
    title: "مولد الفواتير الإلكترونية (زاتكا)",
    description: "أنشئ فواتير مبيعات نظامية مبسطة (QR Code) متوافقة مع متطلبات هيئة الزكاة والضريبة.",
    imagePath: "/images/tools/tool-3.png",
    features: ["متوافق مع اشتراطات هيئة الزكاة والضريبة", "توليد رمز الاستجابة السريعة QR Code", "إصدار فواتير مبسطة"]
  },
  "ads-roi-analyzer": {
    id: 4,
    slug: "ads-roi-analyzer",
    title: "محلل عائد الإعلانات (سناب وتيك توك)",
    description: "قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق السعودي أم تستنزف ميزانيتك.",
    imagePath: "/images/tools/tool-4.png",
    features: ["قياس دقيق لعائد الإنفاق الإعلاني (ROAS)", "تتبع أداء حملات سناب شات وتيك توك", "تنبيهات فورية عند ضعف الأداء"]
  },
  "whatsapp-crm": {
    id: 5,
    slug: "whatsapp-crm",
    title: "إدارة عملاء واتساب (إنجازيا Pro Max)",
    description: "إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين.",
    imagePath: "/images/tools/tool-5.png",
    features: ["استرجاع السلال المتروكة عبر واتساب", "روابط دفع سريعة للعملاء", "تصنيف وتنظيم عملاء المتجر"]
  }
};

export function getToolBySlug(slug: string): ToolData {
  if (toolsData[slug]) {
    return toolsData[slug];
  }
  // إرجاع الأداة الأولى كقيمة افتراضية لمنع أي خطأ 404 أو توقف
  const firstKey = Object.keys(toolsData)[0];
  return {
    ...toolsData[firstKey],
    slug,
    title: `أداة مخصصة - ${slug}`
  };
}
