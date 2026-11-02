'use client'

import { useState, useEffect } from 'react';
import { getStockData } from './actions';

// قائمة شاملة لأكبر وأهم الأسهم الأمريكية في وول ستريت (تكنولوجيا، مالية، طاقة، استهلاك)
const US_MARKET_TICKERS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 
  'NVDA', 'META', 'NFLX', 'AMD', 'INTC', 
  'JPM', 'V', 'JNJ', 'WMT', 'PG', 
  'XOM', 'CVX', 'DIS', 'BAC', 'PYPL',
  'BA', 'IBM', 'CSCO', 'QCOM', 'ORCL'
];

export default function StockRadarPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUSStocks = async () => {
    setLoading(true);
    const results = [];
    
    for (const ticker of US_MARKET_TICKERS) {
      const result = await getStockData(ticker);
      if (result.success && result.data) {
        results.push(result.data);
      }
    }
    
    setStocks(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchUSStocks();
  }, []);

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-right font-sans text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2">رادار الأسهم الأمريكية (US Market) 🇺🇸</h1>
            <p className="text-sm text-gray-400">رصد وتحليل آلي لجميع أسهم وول ستريت الكبرى مع تقييم ذكي لتحديد فرص الدخول اللحظية.</p>
          </div>
          <button 
            onClick={fetchUSStocks}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm shadow-lg"
          >
            {loading ? 'جاري فحص السوق الأمريكي...' : 'تحديث السوق الأمريكي الآن 🔄'}
          </button>
        </div>

        {loading && stocks.length === 0 && (
          <div className="text-center py-20 text-blue-400 font-bold text-lg animate-pulse">
            جاري الاتصال ببيانات وول ستريت وتحليل الأسهم عبر عقل Gemini، يرجى الانتظار...
          </div>
        )}

        {/* شبكة عرض الأسهم الأمريكية والفرص أمام عينيك */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-extrabold text-gray-100">{stock.symbol}</h2>
                  <span className="bg-blue-950 text-blue-300 px-3 py-1 rounded-full text-sm font-bold border border-blue-800">${stock.price}</span>
                </div>
                
                <div className="space-y-2 text-xs text-gray-400 mb-4 border-b border-gray-700 pb-3">
                  <div className="flex justify-between">
                    <span>مكرر الربحية (PE):</span>
                    <span className="font-bold text-white">{stock.peRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مكرر النمو (PEG):</span>
                    <span className="font-bold text-white">{stock.pegRatio}</span>
                  </div>
                </div>

                {/* قسم فرصة الدخول وتقييم الذكاء الاصطناعي */}
                <div className="bg-gray-900/90 p-3.5 rounded-lg border border-blue-500/40">
                  <h3 className="text-xs font-bold text-blue-400 mb-1.5 flex items-center gap-1">
                    ✨ تقييم وفرصة الدخول:
                  </h3>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {stock.analysis}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
