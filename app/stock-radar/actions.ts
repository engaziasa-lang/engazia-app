'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // 1. جلب بيانات السهم من ياهو
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

    // 2. تحليل السهم عبر عقل Gemini الذكي
    let aiAnalysis = "تحليل غير متوفر حالياً";
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `أنت محلل مالي محترف لأسواق الأسهم. السهم هو ${cleanTicker} وسعره الحالي هو $${price}. 
      أعطني تقييماً مختصراً جداً (في سطرين باللغة العربية) يتضمن: هل يعتبر السهم فرصة للاستثمار طويل الأجل أم مبالغ في تقييمه؟ كن دقيقاً ومباشراً.`;
      
      const aiResult = await model.generateContent(prompt);
      aiAnalysis = aiResult.response.text();
    } catch (aiErr) {
      console.error("AI Error:", aiErr);
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
