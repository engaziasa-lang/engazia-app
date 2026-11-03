'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { getStockData } from './actions';

const ALL_MARKET_TICKERS = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK-B', 'LLY', 'V', 
  'JPM', 'UNH', 'XOM', 'MA', 'JNJ', 'PG', 'HD', 'AVGO', 'CVX', 'MRK', 
  'KO', 'PEP', 'COST', 'ABBV', 'BAC', 'ADBE', 'MCD', 'CRM', 'CSCO', 'ACN', 
  'TMO', 'NFLX', 'ABT', 'LIN', 'ORCL', 'DHR', 'AMD', 'CMCSA', 'WFC', 'DIS', 
  'INTC', 'TXN', 'PFE', 'PM', 'COP', 'UNP', 'CAT', 'BA', 'HON', 'AMGN', 
  'IBM', 'GE', 'NOW', 'QCOM', 'SPGI', 'GS', 'INTU', 'RTX', 'ISRG', 'BKNG', 
  'SYK', 'MDLZ', 'TJX', 'BLK', 'C', 'GILD', 'LMT', 'AXP', 'ZTS', 'MDT', 
  'ADI', 'SBUX', 'CB', 'MMC', 'CI', 'MO', 'VRTX', 'BMY', 'DUK', 'SO', 
  'PLD', 'CVS', 'SLB', 'EOG', 'BDX', 'T', 'GPN', 'PGR', 'KLAC', 'PANW', 
  'SNPS', 'CDNS', 'WM', 'FCX', 'AON', 'ITW', 'APH', 'NKE', 'UBER', 'SQ', 
  'PYPL', 'SHOP', 'SNOW', 'PLTR', 'HOOD', 'COIN', 'ROKU', 'ZM', 'PINS', 'DOCU', 
  'DDOG', 'TEAM', 'MDB', 'CRWD', 'OKTA', 'ZS', 'NET', 'FSLY', 'TWLO', 'U', 
  'RBLX', 'DKNG', 'PTON', 'CHWY', 'ETSY', 'W', 'CVNA', 'LCID', 'RIVN', 'NIO', 
  'XPEV', 'LI', 'F', 'GM', 'STLA', 'TM', 'HMC', 'BABA', 'JD', 'PDD', 
  'BIDU', 'NTES', 'TCEHY', 'TSM', 'ASML', 'LRCX', 'AMAT', 'MU', 'NXPI', 'MRVL', 
  'MCHP', 'ON', 'MMM', 'ABMD', 'AAP', 'AES', 'AFL', 'A', 'APD', 'AKAM', 
  'ALK', 'ALB', 'ARE', 'ALGN', 'ALLE', 'LNT', 'ALL', 'AMCR', 'AEE', 'AAL', 
  'AEP', 'AIG', 'AMT', 'AWK', 'AMP', 'ABC', 'AME', 'ANSS', 'AOS', 'APA', 
  'APTV', 'ADM', 'ANET', 'AJG', 'AIZ', 'ATO', 'ADSK', 'ADP', 'AZO', 'AVB', 
  'AVY', 'BKR', 'BALL', 'BBWI', 'BAX', 'WRB', 'BBY', 'BIO', 'TECH', 'BIIB', 
  'BK', 'BWA', 'BXP', 'BSX', 'BR', 'BRO', 'BF-B', 'CHRW', 'CZR', 'CPT', 
  'CPB', 'COF', 'CAH', 'KMX', 'CCL', 'CARR', 'CTLT', 'CBOE', 'CBRE', 'CDW', 
  'CE', 'CNC', 'CNP', 'CDAY', 'CF', 'CRL', 'SCHW', 'CHTR', 'CMG', 'CHD', 
  'CINF', 'CTAS', 'CFG', 'CTXS', 'CLX', 'CME', 'CMS', 'CTSH', 'CL', 'CMA', 
  'CAG', 'ED', 'STZ', 'CEG', 'COO', 'CPRT', 'GLW', 'CTVA', 'CSGP', 'CTRA', 
  'CCI', 'CSX', 'CMI', 'DHI', 'DRI', 'DVA', 'DE', 'DAL', 'XRAY', 'DVN', 
  'DXCM', 'FANG', 'DLR', 'DFS', 'DISH', 'DG', 'DLTR', 'D', 'DPZ', 'DOV', 
  'DOW', 'DTE', 'DRE', 'DD', 'DXC', 'EMN', 'ETN', 'EBAY', 'ECL', 'EIX', 
  'EW', 'EA', 'EMR', 'ENPH', 'ETR', 'EPAM', 'EQT', 'EFX', 'EQIX', 'EQR', 
  'ESS', 'EL', 'RE', 'EVRG', 'ES', 'EXC', 'EXPE', 'EXPD', 'EXR', 'FFIV', 
  'FDS', 'FAST', 'FRT', 'FDX', 'FITB', 'FRC', 'FE', 'FIS', 'FISV', 'FLT', 
  'FMC', 'FTNT', 'FTV', 'FBHS', 'FOXA', 'FOX', 'BEN', 'GRMN', 'IT', 'GNRC', 
  'GD', 'GIS', 'GPC', 'GL', 'HAL', 'HIG', 'HAS', 'HCA', 'PEAK', 'HSIC', 
  'HSY', 'HES', 'HPE', 'HLT', 'HOLX', 'HRL', 'HST', 'HWM', 'HPQ', 'HUM', 
  'HBAN', 'HII', 'IEX', 'IDXX', 'INFO', 'ILMN', 'INCY', 'IR', 'ICE', 'IP', 
  'IPG', 'IFF', 'IVZ', 'IPGP', 'IQV', 'IRM', 'JBHT', 'JKHY', 'J', 'JCI', 
  'JNPR', 'K', 'KEY', 'KEYS', 'KMB', 'KIM', 'KMI', 'KHC', 'KR', 'LHX', 
  'LH', 'LW', 'LVS', 'LDOS', 'LEN', 'LYB', 'L', 'LOW', 'LUMN', 'LYV', 
  'MTB', 'MRO', 'MPC', 'MKTX', 'MAR', 'MLM', 'MAS', 'MTCH', 'MKC', 'MCK', 
  'MET', 'MTD', 'MGM', 'MAA', 'MRNA', 'MHK', 'TAP', 'MPWR', 'MNST', 'MCO', 
  'MS', 'MOS', 'MSI', 'MSCI', 'NDAQ', 'NTAP', 'NWL', 'NEM', 'NWSA', 'NWS', 
  'NEE', 'NLSN', 'NI', 'NDSN', 'NSC', 'NTRS', 'NOC', 'NLOK', 'NCLH', 'NRG', 
  'NUE', 'NVR', 'ORLY', 'ODFL', 'OMC', 'OKE', 'OGN', 'OTIS', 'PCAR', 'PKG', 
  'PARA', 'PH', 'PAYX', 'PAYC', 'PENN', 'PNR', 'PBCT', 'PKI', 'PRGO', 'PCG', 
  'PSX', 'PNW', 'PXD', 'PNC', 'POOL', 'PPG', 'PPL', 'PFG', 'PRU', 'PEG', 
  'PTC', 'PSA', 'PHM', 'PVH', 'QRVO', 'PWR', 'DGX', 'RL', 'RJF', 'O', 
  'REG', 'REGN', 'RF', 'RSG', 'RMD', 'RHI', 'ROK', 'ROL', 'ROP', 'ROST', 
  'RCL', 'SBAC', 'STX', 'SEE', 'SRE', 'SHW', 'SBNY', 'SPG', 'SWKS', 'SJM', 
  'SNA', 'SEDG', 'LUV', 'SWK', 'STT', 'STE', 'SIVB', 'SYF', 'SYY', 'TMUS', 
  'TROW', 'TTWO', 'TPR', 'TGT', 'TEL', 'TDY', 'TFX', 'TER', 'TXT', 'TSCO', 
  'TT', 'TDG', 'TRV', 'TRMB', 'TFC', 'TWTR', 'TYL', 'TSN', 'USB', 'UDR', 
  'ULTA', 'UAA', 'UA', 'UAL', 'UPS', 'URI', 'UHS', 'VLO', 'VTR', 'VRSN', 
  'VRSK', 'VZ', 'VFC', 'VIAC', 'VTRS', 'VNO', 'VMC', 'WAB', 'WBA', 'WAT', 
  'WEC', 'WELL', 'WST', 'WDC', 'WU', 'WRK', 'WY', 'WHR', 'WMB', 'WLTW', 
  'WYNN', 'XEL', 'XLNX', 'XYL', 'YUM', 'ZBRA', 'ZBH', 'ZION'
];

export default function StockRadarPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const BATCH_SIZE = 12;

  useEffect(() => {
    const savedFavs = localStorage.getItem('stockRadarFavorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stockRadarFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol) 
        : [...prev, symbol]
    );
  };

  const handleToggleFavoritesView = async () => {
    const willShowFavorites = !showFavoritesOnly;
    setShowFavoritesOnly(willShowFavorites);

    if (willShowFavorites) {
      const missingFavs = favorites.filter(fav => !stocks.some(s => s.symbol === fav));
      if (missingFavs.length > 0) {
        setIsLoading(true);
        const results: any[] = [];
        for (const ticker of missingFavs) {
          const result = await getStockData(ticker);
          if (result.success && result.data) results.push(result.data);
        }
        setStocks(prev => [...results, ...prev]);
        setIsLoading(false);
      }
    }
  };

  const loadMoreStocks = async () => {
    if (isLoading || !hasMore || showFavoritesOnly) return; 
    setIsLoading(true);
    const nextBatch = ALL_MARKET_TICKERS.slice(currentIndex, currentIndex + BATCH_SIZE);
    
    if (nextBatch.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    const results: any[] = [];
    for (const ticker of nextBatch) {
      if (!stocks.some(s => s.symbol === ticker)) {
        const result = await getStockData(ticker);
        if (result.success && result.data) results.push(result.data);
      }
    }

    setStocks(prev => [...prev, ...results]);
    setCurrentIndex(prev => prev + BATCH_SIZE);
    if (currentIndex + BATCH_SIZE >= ALL_MARKET_TICKERS.length) setHasMore(false);
    setIsLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    
    setIsSearching(true);
    const result = await getStockData(searchQuery);
    
    if (result.success && result.data) {
      setStocks(prev => [result.data, ...prev.filter(s => s.symbol !== result.data.symbol)]);
      setSearchQuery('');
    } else {
      alert("لم يتم العثور على السهم، تأكد من الرمز (مثال AAPL).");
    }
    setIsSearching(false);
  };

  const lastStockElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || showFavoritesOnly) return; 
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMoreStocks();
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, showFavoritesOnly]);

  useEffect(() => {
    if (stocks.length === 0) loadMoreStocks();
  }, []);

  const displayedStocks = showFavoritesOnly 
    ? stocks.filter(s => favorites.includes(s.symbol))
    : stocks;

  return (
    <main className="p-4 md:p-8 bg-gray-950 min-h-screen text-right font-sans text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8 border-b border-gray-800 pb-6 sticky top-0 bg-gray-950/90 backdrop-blur z-10 p-4 rounded-xl shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right w-full lg:w-auto">
              <div>
                <h1 className="text-3xl font-bold text-blue-500 mb-2">شاشة السوق الشاملة 📈</h1>
                <p className="text-sm text-gray-400">تحليل لحظي وتاريخي مع تحديد أفضل فرص الدخول.</p>
              </div>
              <div className="text-sm font-bold bg-gray-900 px-4 py-2 rounded-lg text-blue-400 border border-gray-800 whitespace-nowrap">
                الأسهم المعروضة: {displayedStocks.length}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 items-center">
              <button
                onClick={handleToggleFavoritesView}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center justify-center gap-2 w-full sm:w-auto ${
                  showFavoritesOnly 
                    ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/30' 
                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-yellow-500/50 hover:text-yellow-500'
                }`}
              >
                {showFavoritesOnly ? '⭐ عرض كل الأسهم' : '☆ أسهمي المفضلة'}
              </button>

              <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                  placeholder="ابحث عن رمز سهم..."
                  className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full sm:w-48 text-left uppercase"
                  dir="ltr"
                />
                <button 
                  type="submit" 
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 min-w-[80px]"
                >
                  {isSearching ? 'يبحث...' : 'اصطياد'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedStocks.map((stock, index) => {
            const isLast = index === displayedStocks.length - 1;
            const isFav = favorites.includes(stock.symbol);

            return (
              <div 
                key={stock.symbol + index} 
                ref={(!showFavoritesOnly && isLast) ? lastStockElementRef : null}
                className={`bg-gray-900 p-5 rounded-2xl border ${isFav ? 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-gray-800 shadow-xl'} flex flex-col justify-between hover:border-blue-500/50 transition-all h-full`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleFavorite(stock.symbol)}
                      className="text-2xl focus:outline-none transition-transform hover:scale-125 pb-1"
                      title="إضافة/إزالة من المفضلة"
                    >
                      {isFav ? '⭐' : <span className="text-gray-600">☆</span>}
                    </button>
                    <div>
                      <h2 className="text-2xl font-black text-white">{stock.symbol}</h2>
                      <p className="text-[10px] text-gray-500 mt-1">PE: {stock.peRatio} | PEG: {stock.pegRatio}</p>
                    </div>
                  </div>
                  <span className="bg-blue-950/50 text-blue-400 px-3 py-1.5 rounded-lg text-lg font-bold border border-blue-900/50">
                    ${stock.price}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-lg mb-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-gray-400">السعر المحدد للدخول:</span>
                    <span className="text-sm font-black text-green-400">${stock.suggestedEntryPrice}</span>
                  </div>
                  <p className="text-xs font-bold mb-2">{stock.entrySignal}</p>
                  <p className="text-[10px] text-gray-300 leading-relaxed border-t border-gray-700 pt-2 mt-2">
                    <span className="text-blue-400 font-bold">💡 تحليل Gemini: </span>{stock.analysis}
                  </p>
                </div>

                <div className="bg-gray-950/50 border border-gray-800 rounded-lg p-2 mb-3">
                  <h3 className="text-[10px] font-bold text-gray-400 mb-2 px-1">سجل التداول (آخر 30 يوم):</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto pl-1 custom-scrollbar">
                    {stock.history30Days?.map((dayRecord: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] p-1.5 border-b border-gray-800/50 last:border-0">
                        <span className="text-gray-400">{dayRecord.day}</span>
                        <span className={`font-bold flex items-center gap-1 ${dayRecord.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {dayRecord.status} ${dayRecord.amount} {dayRecord.isPositive ? '▲' : '▼'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-gray-300">صافي آخر 30 يوم:</span>
                    <span className={`text-sm font-black flex items-center gap-1 ${stock.isTotalPositive ? 'text-green-500' : 'text-red-500'}`}>
                      ${stock.total30Days} {stock.isTotalPositive ? 'ربح ▲' : 'خسارة ▼'}
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-[10px] font-bold text-gray-500 mb-2 text-center">العائد التاريخي للسهم</h3>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {[
                      { label: '3 أشهر', data: stock.stats?.m3 },
                      { label: '6 أشهر', data: stock.stats?.m6 },
                      { label: 'سنة', data: stock.stats?.y1 },
                      { label: 'سنتين', data: stock.stats?.y2 },
                      { label: '3 سنوات', data: stock.stats?.y3 }
                    ].map((stat, i) => (
                      <div key={i} className="bg-gray-950 p-1 rounded-md border border-gray-800 flex flex-col justify-center items-center min-h-[64px]">
                        <span className="text-[9px] text-gray-500 leading-tight mb-0.5">{stat.label}</span>
                        
                        <span className={`text-[10px] font-bold ${stat.data?.value === '-' ? 'text-gray-500' : (stat.data?.isPositive ? 'text-green-500' : 'text-red-500')}`}>
                          {stat.data?.value !== '-' ? (stat.data?.isPositive ? '+' : '-') : ''}{stat.data?.value}
                        </span>
                        
                        {stat.data?.value !== '-' && (
                          <div className="flex flex-col items-center mt-0.5">
                            <span className={`text-[8px] font-semibold opacity-90 ${stat.data?.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                              ${stat.data?.amount}
                            </span>
                            {/* تمت إضافة السعر القديم هنا بخط رمادي ناعم */}
                            <span className="text-[7px] text-gray-400 mt-0.5">
                              السعر: ${stat.data?.pastPrice}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showFavoritesOnly && displayedStocks.length === 0 && !isLoading && (
          <div className="text-center py-20 text-gray-500 font-bold text-lg">
            لا توجد أسهم في المفضلة حالياً. اضغط على أيقونة (☆) بجانب أي سهم لإضافته!
          </div>
        )}

        {isLoading && (
          <div className="text-center py-10 text-blue-400 font-bold text-lg animate-pulse">
            جاري جلب الأسهم والتحليل المستمر...
          </div>
        )}
      </div>
    </main>
  );
}
