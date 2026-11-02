'use server'

import yahooFinance from 'yahoo-finance2';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // جلب البيانات الأساسية مباشرة باستخدام quote
    const quote: any = await yahooFinance.quote(cleanTicker);
    
    if (!quote || !quote.regularMarketPrice) {
      return { success: false, error: "رمز السهم غير صحيح" };
    }

    const data = {
      symbol: quote.symbol || cleanTicker,
      price: quote.regularMarketPrice || 0,
      peRatio: quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A',
      pegRatio: quote.pegRatio ? quote.pegRatio.toFixed(2) : 'N/A',
      revenueGrowth: quote.revenueGrowth ? (quote.revenueGrowth * 100).toFixed(2) + '%' : 'N/A',
    };

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return { success: false, error: "فشل في جلب البيانات" };
  }
}
