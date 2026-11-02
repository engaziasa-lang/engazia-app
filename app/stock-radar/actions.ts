'use server'

import yahooFinance from 'yahoo-finance2';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // استخدام دالة search أو quote مباشرة مع معالجة البيانات بأمان
    const result: any = await yahooFinance.quote(cleanTicker);
    
    if (!result || !result.regularMarketPrice) {
      return { success: false, error: "رمز السهم غير صحيح" };
    }

    const data = {
      symbol: result.symbol || cleanTicker,
      price: result.regularMarketPrice || 0,
      peRatio: result.trailingPE ? Number(result.trailingPE).toFixed(2) : 'N/A',
      pegRatio: result.pegRatio ? Number(result.pegRatio).toFixed(2) : 'N/A',
      revenueGrowth: result.revenueGrowth ? (Number(result.revenueGrowth) * 100).toFixed(2) + '%' : 'N/A',
    };

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return { success: false, error: "فشل في جلب البيانات" };
  }
}
