'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // جلب بيانات 5 أيام سابقة لحساب أرباح وخسائر الأيام الماضية
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}?range=5d&interval=1d`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });

    if (!res.ok) return { success: false, error: "فشل الاتصال" };
    const json = await res.json();
    const result = json.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta || !meta.regularMarketPrice) return { success: false, error: "رمز غير صحيح" };

    const price = meta.regularMarketPrice;
    const peRatio = meta.trailingPE ? Number(meta.trailingPE).toFixed(2) : 'غير متوفر';
    const pegRatio = meta.pegRatio ? Number(meta.pegRatio).toFixed(2) : 'غير متوفر';

    // حساب تقويم الأرباح والخسائر للأيام الثلاثة الأخيرة
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];
    const history = [];

    if (closes.length >= 2) {
      for (let i = closes.length - 1; i > 0 && history.length < 3; i--) {
        const todayPrice = closes[i];
        const yesterdayPrice = closes[i - 1];
        if (!todayPrice || !yesterdayPrice) continue;
        
        const change = todayPrice - yesterdayPrice;
        const dateObj = new Date(timestamps[i] * 1000);
        const dayName = dateObj.toLocaleDateString('ar-SA', { weekday: 'long' });

        history.push({
          day: dayName,
          status: change >= 0 ? 'ربح' : 'خسر',
          amount: Math.abs(change).toFixed(2),
          isPositive: change >= 0
        });
      }
    }

    // تحليل سريع من الذكاء الاصطناعي
    let aiAnalysis = "سهم نشط ذو سيولة عالية.";
    try {
      if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const aiRes = await model.generateContent(`أعطني رأياً بسطر واحد بالعربي عن سهم ${cleanTicker} بسعر ${price}.`);
        aiAnalysis = aiRes.response.text();
      }
    } catch (e) {}

    return { 
      success: true, 
      data: { symbol: meta.symbol, price, peRatio, pegRatio, analysis: aiAnalysis, history } 
    };
  } catch (error) {
    return { success: false, error: "فشل الجلب" };
  }
}
