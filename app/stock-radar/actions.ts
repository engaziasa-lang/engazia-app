'use server'

import yahooFinance from 'yahoo-finance2';

export async function getStockData(ticker: string) {
  try {
    // أضفنا : any لتخطي تدقيق TypeScript
    const quote: any = await yahooFinance.quote(ticker);
    const summaryDetail: any = await yahooFinance.quoteSummary(ticker, {
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
