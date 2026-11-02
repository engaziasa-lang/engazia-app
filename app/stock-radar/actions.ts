'use server'

import yahooFinance from 'yahoo-finance2';

export async function getStockData(ticker: string) {
  try {
    // 1. جلب السعر والبيانات الأساسية أولاً (الأكثر ضماناً)
    const quote: any = await yahooFinance.quote(ticker);
    
    if (!quote || !quote.regularMarketPrice) {
      return { success: false, error: "رمز السهم غير صحيح" };
    }

    // 2. محاولة جلب التفاصيل المالية المتقدمة مع حماية الكود من التوقف لو فشلت
    let summaryDetail: any = {};
    try {
      summaryDetail = await yahooFinance.quoteSummary(ticker, {
          modules: ['summaryDetail', 'financialData', 'defaultKeyStatistics']
      });
    } catch (e) {
      console.log("Could not fetch extra summary modules, using defaults");
    }

    const data = {
      symbol: quote.symbol || ticker,
      price: quote.regularMarketPrice || 0,
      peRatio: summaryDetail.summaryDetail?.trailingPE?.toFixed(2) || 'N/A',
      pegRatio: summaryDetail.defaultKeyStatistics?.pegRatio?.toFixed(2) || 'N/A',
      revenueGrowth: summaryDetail.financialData?.revenueGrowth 
        ? (summaryDetail.financialData.revenueGrowth * 100).toFixed(2) + '%' 
        : 'N/A',
    };

    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return { success: false, error: "فشل الجلب" };
  }
}
