'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // 1. جلب بيانات السهم من ياهو مباشرة (أساسي ومضمون)
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { success: false, error: "فشل الاتصال بالسوق" };
    }

    const json = await res.json();
    const meta = json.chart?.result?.[0]?.meta;

    if (!meta || !meta.regularMarketPrice) {
      return { success: false, error: "رمز السهم غير صحيح" };
    }

    const price = meta.regularMarketPrice;

    // 2. تحليل السهم عبر Gemini باستخدام النموذج الأحدث والأكثر استقراراً
    let aiAnalysis = "تحليل الذكاء الاصطناعي غير متوفر مؤقتاً";
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        // استخدام النموذج المتوافق مع مفاتيح Google AI Studio الحديثة
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `أنت محلل مالي محترف لأسواق الأسهم. السهم هو ${cleanTicker} وسعره الحالي هو $${price}. أعطني تقييماً مختصراً جداً في سطرين باللغة العربية: هل يعتبر السهم فرصة استثمارية أم مبالغ في تقييمه؟`;
        
        const aiResult = await model.generateContent(prompt);
        const responseText = aiResult.response.text();
        if (responseText) {
          aiAnalysis = responseText;
        }
      } else {
        aiAnalysis = "مفتاح الذكاء الاصطناعي غير معرف في السيرفر";
      }
    } catch (aiErr: any) {
      console.error("AI Detailed Error:", aiErr?.message || aiErr);
      aiAnalysis = `خطأ في الاتصال بالذكاء الاصطناعي: ${aiErr?.message || 'تحقق من المفتاح'}`;
    }

    const data = {
      symbol: meta.symbol || cleanTicker,
      price: price,
      peRatio: meta.trailingPE ? Number(meta.trailingPE).toFixed(2) : 'N/A',
      pegRatio: meta.pegRatio ? Number(meta.pegRatio).toFixed(2) : 'N/A',
      revenueGrowth: 'متوفر',
      analysis: aiAnalysis
    };

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return { success: false, error: "فشل في جلب البيانات" };
  }
}
