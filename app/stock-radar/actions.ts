'use server'

import yahooFinance from 'yahoo-finance2';

export async function getStockData(ticker: string) {
  try {
    const cleanTicker = ticker.trim().toUpperCase();
    
    // استخدام البحث أولاً للتحقق من وجود السهم وجلب الرمز الصحيح
    const searchResult: any = await yahooFinance.search(cleanTicker);
    const symbol = searchResult.quotes?.[0]?.symbol || cleanTicker;

    // جلب بيانات السعر الأساسية
    const quote: any = await yahooFinance.quote(symbol);
    
    if (!quote || !quote.regularMarketPrice) {
      return { success: false, error: "رمز السهم غير صحيح" };
    }

    const data = {
      symbol: quote.symbol || symbol,
      price: quote.regularMarketPrice || 0,
      peRatio: quote.trailingPE ? Number(quote.trailingPE).toFixed(2) : 'N/A',
      pegRatio: quote.pegRatio ? Number(quote.pegRatio).toFixed(2) : 'N/A',
      revenueGrowth: quote.revenueGrowth ? (Number(quote.revenueGrowth) * 100).toFixed(2) + '%' : 'N/A',
    };

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return { success: false, error: "فشل في جلب البيانات" };
  }
}
