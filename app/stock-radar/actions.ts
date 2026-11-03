'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}?range=5y&interval=1d`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store'
    });

    if (!res.ok) return { success: false, error: "فشل الاتصال" };
    const json = await res.json();
    const result = json.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta || !meta.regularMarketPrice) return { success: false, error: "رمز غير صحيح" };

    const price = meta.regularMarketPrice;
    const priceSAR = (price * 3.75).toFixed(2);
    
    const peRatio = meta.trailingPE ? Number(meta.trailingPE).toFixed(2) : 'غير متوفر';
    const pegRatio = meta.pegRatio ? Number(meta.pegRatio).toFixed(2) : 'غير متوفر';

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];
    
    const history30Days = [];
    let total30DaysChange = 0;
    
    const last30Closes = closes.slice(-30).filter((c: number | null) => c !== null);
    
    if (closes.length >= 2) {
      for (let i = closes.length - 1; i > 0 && history30Days.length < 30; i--) {
        const todayPrice = closes[i];
        const yesterdayPrice = closes[i - 1];
        if (todayPrice == null || yesterdayPrice == null) continue;
        
        const change = todayPrice - yesterdayPrice;
        total30DaysChange += change;
        
        const dateObj = new Date(timestamps[i] * 1000);
        const dayStr = dateObj.toLocaleDateString('ar-SA', { weekday: 'long', month: 'short', day: 'numeric' });

        history30Days.push({
          day: dayStr,
          status: change >= 0 ? 'ربح' : 'خسر',
          amount: Math.abs(change).toFixed(2),
          isPositive: change >= 0
        });
      }
    }

    const lowest30Days = Math.min(...last30Closes);
    const suggestedEntryPrice = (lowest30Days * 1.01).toFixed(2);
    
    const isGoodEntryNow = price <= (lowest30Days * 1.03); 
    const entrySignal = isGoodEntryNow ? "🟢 فرصة دخول ممتازة حالياً" : "🟡 يفضل انتظار تصحيح السعر";

    const getHistoricalReturn = (daysAgo: number) => {
      if (closes.length > daysAgo) {
        const pastPrice = closes[closes.length - 1 - daysAgo];
        const currentPrice = closes[closes.length - 1];
        if (pastPrice && currentPrice) {
          const changeAmount = currentPrice - pastPrice; 
          const percentChange = (changeAmount / pastPrice) * 100;
          return { 
            value: Math.abs(percentChange).toFixed(1) + '%', 
            amount: Math.abs(changeAmount).toFixed(2), 
            pastPrice: pastPrice.toFixed(2),
            isPositive: changeAmount >= 0 
          };
        }
      }
      return { value: '-', amount: '-', pastPrice: '-', isPositive: true };
    };

    const stats = {
      m3: getHistoricalReturn(63),
      m6: getHistoricalReturn(126),
      y1: getHistoricalReturn(252),
      y2: getHistoricalReturn(504),
      y3: getHistoricalReturn(756),
    };

    let aiAnalysis = "سهم نشط.";
    try {
      if (process.env.GEMINI_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const aiRes = await model.generateContent(`بناءً على سعر ${price} لسهم ${cleanTicker} وسعر الدعم ${suggestedEntryPrice}، أعطني تقييماً بسطر واحد بالعربي هل الدخول الآن مناسب؟`);
        aiAnalysis = aiRes.response.text();
      }
    } catch (e) {}

    // حساب صافي 30 يوم بالدولار والريال
    const total30DaysUSD = Math.abs(total30DaysChange);
    const total30DaysSAR = (total30DaysUSD * 3.75).toFixed(2);

    return { 
      success: true, 
      data: { 
        symbol: meta.symbol, 
        price, 
        priceSAR, 
        peRatio, 
        pegRatio, 
        analysis: aiAnalysis, 
        history30Days, 
        total30Days: total30DaysUSD.toFixed(2),
        total30DaysSAR, // تمرير الصافي بالريال
        isTotalPositive: total30DaysChange >= 0,
        stats,
        suggestedEntryPrice,
        entrySignal 
      } 
    };
  } catch (error) {
    return { success: false, error: "فشل الجلب" };
  }
}
