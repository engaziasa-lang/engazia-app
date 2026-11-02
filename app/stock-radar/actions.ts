'use server'

import yahooFinance from 'yahoo-finance2';

// دالة لجلب البيانات المالية للسهم وتحليلها
export async function getStockData(ticker: string) {
  try {
    const quote = await yahooFinance.quote(ticker);
    const summaryDetail = await yahooFinance.quoteSummary(ticker, {
        modules: ['summaryDetail', 'financialData', 'defaultKeyStatistics']
    });

    const data = {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
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
