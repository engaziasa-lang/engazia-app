'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // 1. جلب بيانات السهم من ياهو مباشرة
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

    // 2. تحليل السهم عبر Gemini
    let aiAnalysis = "تحليل الذكاء الاصطناعي غير متوفر مؤقتاً";
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `أنت محلل مالي محترف. السهم ${cleanTicker} وسعره الحالي $${price}. أعطني تقييماً مختصراً في سطرين باللغة العربية عن السهم هل هو فرصة استثمارية أم لا.`;
        
        const aiResult = await model.generateContent(prompt);
        const responseText = aiResult.response.text();
        if (responseText) {
          aiAnalysis = responseText;
        }
      }
    } catch (aiErr: any) {
      console.error("AI Error:", aiErr?.message || aiErr);
      aiAnalysis = "رأي المحلل الذكي متاح قريباً...";
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
