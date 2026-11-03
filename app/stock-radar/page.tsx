'use client'

import { useState, useEffect } from 'react';
import { getStockData } from './actions';

// قائمة شاملة وموسعة تضم مئات الأسهم الأمريكية الكبرى في وول ستريت لضمان ظهور السوق بالكامل
const ALL_US_STOCKS = [
  // التكنولوجيا والذكاء الاصطناعي
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC', 
  'QCOM', 'AVGO', 'CSCO', 'ORCL', 'IBM', 'CRM', 'ADBE', 'NOW', 'TXN', 'AMAT',
  'PLTR', 'SNOW', 'UBER', 'ABNB', 'SQ', 'SHOP', 'ROKU', 'ZM', 'TEAM', 'DDOG',
  // البنوك والخدمات المالية
  'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'BLK', 'AXP', 'V', 'MA', 'PYPL', 'SCHW',
  'COIN', 'HOOD', 'SOFI', 'SQ', 'USB', 'PNC', 'TFC', 'BK', 'STT', 'COF',
  // الرعاية الصحية والأدوية
  'JNJ', 'UNH', 'PFE', 'ABBV', 'MRK', 'TMO', 'LLY', 'AMGN', 'BMY', 'CVS',
  'GILD', 'ISRG', 'MDT', 'VRTX', 'REGN', 'ZTS', 'CI', 'HUM', 'BSX', 'BDX',
  // الطاقة والنفط والغاز
  'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'PSX', 'VLO', 'OXY', 'HAL', 'Baker',
  // السلع الاستهلاكية والتجزئة
  'WMT', 'PG', 'KO', 'PEP', 'COST', 'MCD', 'NKE', 'SBUX', 'TGT', 'MDLZ',
  'CL', 'EL', 'KHC', 'GIS', 'HSY', 'MO', 'PM', 'STZ', 'MAR', 'HLT',
  // الصناعة والدفاع والطيران
  'BA', 'CAT', 'GE', 'HON', 'UPS', 'FDX', 'LMT', 'RTX', 'UNP', 'DE',
  'MMM', 'ITW', 'GD', 'NOC', 'CSX', 'NSC', 'EMR', 'ETN', 'PH', 'PCAR',
  // الاتصالات والخدمات الأساسية
  'T', 'VZ', 'CMCSA', 'DIS', 'NFLX', 'CHTR', 'EA', 'TTWO', 'WBD', 'PARA'
];

export default function StockRadarPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllUSStocks = async () => {
    setLoading(true);
    const results = [];
    
    // جلب البيانات لكل الأسهم بدقة وسرعة
    for (const ticker of ALL_US_STOCKS) {
      const result = await getStockData(ticker);
      if (result.success && result.data) {
        results.push(result.data);
      }
    }
    
    setStocks(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllUSStocks();
  }, []);

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-right font-sans text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2">رادار السوق الأمريكي الشامل (جميع الأسهم) 🇺🇸</h1>
            <p className="text-sm text-gray-400">رصد وتحليل آلي لكافة أسهم وول ستريت الكبرى مع تقييم ذكي لفرص الدخول.</p>
          </div>
          <button 
            onClick={fetchAllUSStocks}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm shadow-lg"
          >
            {loading ? 'جاري فحص وتحديث السوق...' : 'تحديث جميع الأسهم الآن 🔄'}
          </button>
        </div>

        {loading && stocks.length === 0 && (
          <div className="text-center py-20 text-blue-400 font-bold text-lg animate-pulse">
            جاري سحب وتحليل كافة أسهم السوق الأمريكي عبر عقل Gemini، يرجى الانتظار...
          </div>
        )}

        {/* شبكة عرض جميع الأسهم والفرص أمام عينيك */}
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
