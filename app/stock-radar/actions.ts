'use server'

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // جلب البيانات مباشرة من رابط ياهو المالي العام (بدون حظر وبدون مكتبات معقدة)
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      return { success: false, error: "فشل الاتصال بسوق الأسهم" };
    }

    const json = await res.json();
    const meta = json.chart?.result?.[0]?.meta;

    if (!meta || !meta.regularMarketPrice) {
      return { success: false, error: "رمز السهم غير صحيح" };
    }

    const data = {
      symbol: meta.symbol || cleanTicker,
      price: meta.regularMarketPrice || 0,
      peRatio: meta.trailingPE ? Number(meta.trailingPE).toFixed(2) : 'N/A',
      pegRatio: meta.pegRatio ? Number(meta.pegRatio).toFixed(2) : 'N/A',
      revenueGrowth: 'متوفر',
    };

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return { success: false, error: "فشل في جلب البيانات" };
  }
}
