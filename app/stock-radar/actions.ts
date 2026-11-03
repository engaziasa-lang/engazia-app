'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // سحب بيانات 5 سنوات كاملة (لدينا بيانات كافية لحساب 3 سنوات و30 يوماً)
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
    const peRatio = meta.trailingPE ? Number(meta.trailingPE).toFixed(2) : 'غير متوفر';
    const pegRatio = meta.pegRatio ? Number(meta.pegRatio).toFixed(2) : 'غير متوفر';

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];
    
    // 1. حساب تقويم آخر 30 يوم عمل وإجمالي الأرباح/الخسائر
    const history30Days = [];
    let total30DaysChange = 0;

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

    // 2. حساب الإحصائيات التاريخية (نسبة مئوية للربح/الخسارة عبر السنين)
    // متوسط أيام التداول: 3 أشهر ≈ 63 يوم، 6 أشهر ≈ 126، سنة ≈ 252، سنتين ≈ 504، 3 سنوات ≈ 756
    const getHistoricalReturn = (daysAgo: number) => {
      if (closes.length > daysAgo) {
        const pastPrice = closes[closes.length - 1 - daysAgo];
        const currentPrice = closes[closes.length - 1];
        if (pastPrice && currentPrice) {
          const percentChange = ((currentPrice - pastPrice) / pastPrice) * 100;
          return { value: Math.abs(percentChange).toFixed(1) + '%', isPositive: percentChange >= 0 };
        }
      }
      return { value: '-', isPositive: true };
    };

    const stats = {
      m3: getHistoricalReturn(63),
      m6: getHistoricalReturn(126),
      y1: getHistoricalReturn(252),
      y2: getHistoricalReturn(504),
      y3: getHistoricalReturn(756),
    };

    // 3. تحليل الذكاء الاصطناعي
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
      data: { 
        symbol: meta.symbol, 
        price, 
        peRatio, 
        pegRatio, 
        analysis: aiAnalysis, 
        history30Days, 
        total30Days: Math.abs(total30DaysChange).toFixed(2),
        isTotalPositive: total30DaysChange >= 0,
        stats 
      } 
    };
  } catch (error) {
    return { success: false, error: "فشل الجلب" };
  }
}
