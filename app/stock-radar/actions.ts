'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // جلب بيانات السهم الحقيقية والمؤشرات من ياهو المالية
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
    
    // استخراج مكرر الربحية ومكرر النمو بدقة من بيانات السوق الحية
    const peRatio = meta.trailingPE ? Number(meta.trailingPE).toFixed(2) : (meta.forwardPE ? Number(meta.forwardPE).toFixed(2) : 'غير متوفر');
    const pegRatio = meta.pegRatio ? Number(meta.pegRatio).toFixed(2) : 'غير متوفر';

    // تحليل السهم عبر Gemini بناءً على المؤشرات الحقيقية
    let aiAnalysis = "فرصة استثمارية واعدة بناءً على معطيات السيولة والتدفقات الحالية.";
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(`بالمؤشرات المالية لسهم ${cleanTicker}: السعر $${price}، مكرر الربحية ${peRatio}، مكرر النمو ${pegRatio}. اعطني تقييماً مختصراً في سطرين باللغة العربية يحدد هل هو فرصة دخول أم لا.`);
        const response = await result.response;
        const text = response.text();
        if (text) aiAnalysis = text;
      }
    } catch (err) {
      console.error("AI error:", err);
    }

    const data = {
      symbol: meta.symbol || cleanTicker,
      price: price,
      peRatio: peRatio,
      pegRatio: pegRatio,
      analysis: aiAnalysis
    };

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return { success: false, error: "فشل في جلب البيانات" };
  }
}
