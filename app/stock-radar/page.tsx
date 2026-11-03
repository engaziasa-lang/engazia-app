'use client'

import { useState } from 'react';
import { getStockData } from './actions';

// قائمة استرشادية تظهر في القائمة المنسدلة عند الكتابة (يمكنك البحث عن أي سهم آخر أيضاً)
const POPULAR_US_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
  'JPM', 'BAC', 'V', 'MA', 'JNJ', 'UNH', 'XOM', 'CVX', 'WMT', 'PG', 'BA', 'DIS'
];

export default function StockRadarPage() {
  const [tickerInput, setTickerInput] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleHuntStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerInput.trim()) return;

    setLoading(true);
    setError('');

    const result = await getStockData(tickerInput);
    if (result.success && result.data) {
      // إضافة السهم الجديد إلى بداية القائمة (بدون تكرار)
      setStocks(prev => {
        const filtered = prev.filter(s => s.symbol !== result.data.symbol);
        return [result.data, ...filtered];
      });
      setTickerInput('');
    } else {
      setError(result.error || 'تأكد من صحة رمز السهم (مثال: AAPL)');
    }
    setLoading(false);
  };

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-right font-sans text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">رادار السوق الأمريكي الذكي 🇺🇸</h1>
          <p className="text-sm text-gray-400">ابحث عن أي سهم في وول ستريت واصطده ليتم تحليله فوراً وإضافته لرادارك.</p>
        </div>

        {/* شريط البحث مع القائمة المنسدلة */}
        <form onSubmit={handleHuntStock} className="mb-8 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                list="us-stocks"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                placeholder="أدخل رمز السهم (مثال: TSLA) أو اختر من القائمة..."
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
              <datalist id="us-stocks">
                {POPULAR_US_STOCKS.map(ticker => (
                  <option key={ticker} value={ticker} />
                ))}
              </datalist>
            </div>
            <button 
              type="submit"
              disabled={loading || !tickerInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 min-w-[150px]"
            >
              {loading ? 'جاري التحليل...' : 'اصطياد السهم 🎯'}
            </button>
          </div>
          {error && <p className="text-red-400 mt-3 text-sm font-bold">{error}</p>}
        </form>

        {/* شبكة الأسهم التي قمت باختيارها */}
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
          
          {stocks.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-gray-500">
              لم تقم بإضافة أي أسهم بعد. ابدأ باختيار أسهمك من الشريط بالأعلى!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
