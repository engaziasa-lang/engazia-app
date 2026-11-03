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

type Position = { symbol: string; shares: number; avgPrice: number };
type Portfolio = { cash: number; positions: Position[] };

export default function StockRadarPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [portfolio, setPortfolio] = useState<Portfolio>({ cash: 0, positions: [] });
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<any>(''); // جعلناها فارغة للاستخدام المريح
  
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<any>(''); // جعلناها فارغة للاستخدام المريح

  const [tradeStock, setTradeStock] = useState<any>(null);
  const [tradeShares, setTradeShares] = useState<any>(''); // بدأت فارغة تماماً بدون صفر
  const BROKER_COMMISSION = 2;

  const currentIndexRef = useRef(0);
  const initialLoadDone = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);
  
  const BATCH_SIZE = 12;

  useEffect(() => {
    const savedFavs = localStorage.getItem('stockRadarFavorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedPortfolio = localStorage.getItem('stockRadarPortfolio');
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
  }, []);

  useEffect(() => {
    localStorage.setItem('stockRadarFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('stockRadarPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
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

  const initializeStocks = async () => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    setIsLoading(true);

    let targetCount = BATCH_SIZE;
    const savedIndex = localStorage.getItem('stockRadarCurrentIndex');
    
    if (savedIndex) {
      const parsed = parseInt(savedIndex, 10);
      if (!isNaN(parsed) && parsed > BATCH_SIZE) {
        targetCount = parsed;
      }
    }

    currentIndexRef.current = targetCount;
    const batchToLoad = ALL_MARKET_TICKERS.slice(0, targetCount);

    for (let i = 0; i < batchToLoad.length; i += BATCH_SIZE) {
      const chunk = batchToLoad.slice(i, i + BATCH_SIZE);
      const promises = chunk.map(ticker => getStockData(ticker));
      const chunkResults = await Promise.all(promises);
      const validResults = chunkResults.filter(r => r && r.success && r.data).map(r => r.data);
      
      setStocks(prev => {
        const uniqueNew = validResults.filter((newStock: any) => newStock && newStock.symbol && !prev.some(s => s.symbol === newStock.symbol));
        return [...prev, ...uniqueNew];
      });
    }

    if (targetCount >= ALL_MARKET_TICKERS.length) setHasMore(false);
    setIsLoading(false);
  };

  useEffect(() => {
    initializeStocks();
  }, []);

  const loadMoreStocks = async () => {
    if (isLoading || !hasMore || showFavoritesOnly) return;
    setIsLoading(true);

    const currentIdx = currentIndexRef.current;
    const nextBatch = ALL_MARKET_TICKERS.slice(currentIdx, currentIdx + BATCH_SIZE);
    
    if (nextBatch.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    const promises = nextBatch.map(ticker => getStockData(ticker));
    const chunkResults = await Promise.all(promises);
    const validResults = chunkResults.filter(r => r && r.success && r.data).map(r => r.data);

    setStocks(prev => {
      const uniqueNew = validResults.filter((newStock: any) => newStock && newStock.symbol && !prev.some(s => s.symbol === newStock.symbol));
      return [...prev, ...uniqueNew];
    });

    const newIndex = currentIdx + BATCH_SIZE;
    currentIndexRef.current = newIndex;
    
    localStorage.setItem('stockRadarCurrentIndex', newIndex.toString());
    
    if (newIndex >= ALL_MARKET_TICKERS.length) setHasMore(false);
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

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      alert("الرجاء إدخال مبلغ صحيح للإيداع.");
      return;
    }
    setPortfolio(prev => ({ ...prev, cash: prev.cash + amount }));
    setIsDepositOpen(false);
    setDepositAmount(''); 
    alert(`✅ تم إيداع ${amount}$ بنجاح في محفظتك!`);
  };

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      alert("الرجاء إدخال مبلغ صحيح للسحب.");
      return;
    }
    if (amount > portfolio.cash) {
      alert(`❌ رصيدك الحالي (${portfolio.cash.toFixed(2)}$) لا يكفي لإتمام عملية السحب.`);
      return;
    }
    setPortfolio(prev => ({ ...prev, cash: prev.cash - amount }));
    setIsWithdrawOpen(false);
    setWithdrawAmount(''); 
    alert(`✅ تم سحب ${amount}$ بنجاح من محفظتك!`);
  };

  const handleExecuteTrade = (type: 'buy' | 'sell') => {
    const sharesNum = Number(tradeShares);
    if (!tradeStock || !sharesNum || sharesNum <= 0) {
      alert("الرجاء إدخال عدد أسهم صحيح.");
      return;
    }
    
    const stockPrice = parseFloat(tradeStock.price);
    const totalSharesValue = stockPrice * sharesNum;

    if (type === 'buy') {
      const totalCost = totalSharesValue + BROKER_COMMISSION;
      if (portfolio.cash < totalCost) {
        alert(`❌ رصيدك الافتراضي غير كافٍ. تحتاج إلى ${totalCost.toFixed(2)}$ لإتمام الصفقة.`);
        return;
      }
      
      const effectivePricePerShare = stockPrice + (BROKER_COMMISSION / sharesNum);

      setPortfolio(prev => {
        const newPositions = [...prev.positions];
        const existingPos = newPositions.find(p => p.symbol === tradeStock.symbol);
        
        if (existingPos) {
          const previousTotalCost = existingPos.shares * existingPos.avgPrice;
          const currentTradeTotalCost = sharesNum * effectivePricePerShare;
          existingPos.shares += sharesNum;
          existingPos.avgPrice = (previousTotalCost + currentTradeTotalCost) / existingPos.shares;
        } else {
          newPositions.push({ symbol: tradeStock.symbol, shares: sharesNum, avgPrice: effectivePricePerShare });
        }
        return { cash: prev.cash - totalCost, positions: newPositions };
      });
      alert(`✅ تم الشراء بنجاح! تم توزيع العمولة (${BROKER_COMMISSION}$) على الأسهم وتحديث متوسط التكلفة.`);
      
    } else if (type === 'sell') {
      const existingPos = portfolio.positions.find(p => p.symbol === tradeStock.symbol);
      if (!existingPos || existingPos.shares < sharesNum) {
        alert("❌ لا تملك عدداً كافياً من هذا السهم للبيع.");
        return;
      }

      const totalProceeds = totalSharesValue - BROKER_COMMISSION;
      
      setPortfolio(prev => {
        let newPositions = prev.positions.map(p => {
          if (p.symbol === tradeStock.symbol) {
            return { ...p, shares: p.shares - sharesNum };
          }
          return p;
        }).filter(p => p.shares > 0);

        return { cash: prev.cash + totalProceeds, positions: newPositions };
      });
      alert(`✅ تم البيع بنجاح! تمت إضافة ${totalProceeds.toFixed(2)}$ لرصيدك بعد خصم العمولة الثابتة.`);
    }

    setTradeStock(null);
    setTradeShares('');
  };

  // --- حساب إجماليات المحفظة ---
  let totalStocksMarketValue = 0;
  let totalCostValue = 0;

  portfolio.positions.forEach(pos => {
    const liveStock = stocks.find(s => s.symbol === pos.symbol);
    const currentPrice = liveStock ? parseFloat(liveStock.price) : pos.avgPrice;
    totalStocksMarketValue += pos.shares * currentPrice;
    totalCostValue += pos.shares * pos.avgPrice;
  });

  const totalPortfolioValue = portfolio.cash + totalStocksMarketValue;
  const unrealizedPL = totalStocksMarketValue - totalCostValue;
  const unrealizedPLPercent = totalCostValue > 0 ? (unrealizedPL / totalCostValue) * 100 : 0;

  const displayedStocks = showFavoritesOnly 
    ? stocks.filter(s => favorites.includes(s.symbol))
    : stocks;

  return (
    <main className="p-4 md:p-8 bg-gray-950 min-h-screen text-right font-sans text-white" dir="rtl">
      
      {/* نافذة الإيداع */}
      {isDepositOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h2 className="text-xl font-bold text-green-500">إيداع أموال 💰</h2>
              <button onClick={() => setIsDepositOpen(false)} className="text-gray-500 hover:text-white text-2xl">×</button>
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">حدد المبلغ المراد إيداعه (بالدولار):</label>
              <input 
                type="number" 
                min="1"
                placeholder="أدخل المبلغ..."
                value={depositAmount} 
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 p-3 rounded-lg text-white font-bold text-lg focus:border-green-500 outline-none text-left"
                dir="ltr"
              />
            </div>
            <button onClick={handleDeposit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
              تأكيد الإيداع
            </button>
          </div>
        </div>
      )}

      {/* نافذة السحب */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h2 className="text-xl font-bold text-red-500">سحب أموال 💳</h2>
              <button onClick={() => setIsWithdrawOpen(false)} className="text-gray-500 hover:text-white text-2xl">×</button>
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">حدد المبلغ المراد سحبه (بالدولار):</label>
              <input 
                type="number" 
                min="1"
                max={portfolio.cash}
                placeholder="أدخل المبلغ..."
                value={withdrawAmount} 
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 p-3 rounded-lg text-white font-bold text-lg focus:border-red-500 outline-none text-left"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-2">الرصيد المتاح للسحب: <span className="text-green-500">${portfolio.cash.toFixed(2)}</span></p>
            </div>
            <button onClick={handleWithdraw} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
              تأكيد السحب
            </button>
          </div>
        </div>
      )}

      {/* نافذة التداول السريعة */}
      {tradeStock && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h2 className="text-xl font-bold">تداول السهم: {tradeStock.symbol}</h2>
              <button onClick={() => setTradeStock(null)} className="text-gray-500 hover:text-white text-2xl">×</button>
            </div>
            
            <div className="bg-blue-950/30 p-3 rounded-lg border border-blue-900/50 mb-4 text-center">
              <p className="text-sm text-gray-400">السعر الحالي</p>
              <p className="text-2xl font-black text-blue-400">${tradeStock.price}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">عدد الأسهم (كمية):</label>
              <input 
                type="number" 
                min="1"
                placeholder="أدخل عدد الأسهم..."
                value={tradeShares} 
                onChange={(e) => setTradeShares(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 p-3 rounded-lg text-white font-bold focus:border-blue-500 outline-none"
              />
            </div>

            <div className="text-xs text-gray-400 mb-6 bg-gray-950 p-3 rounded border border-gray-800 space-y-2">
              <div className="flex justify-between">
                <span>قيمة الأسهم:</span> 
                <span>${((Number(tradeShares) || 0) * parseFloat(tradeStock.price)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-yellow-500">
                <span>عمولة الوسيط (تُوزع على الأسهم):</span> 
                <span>${BROKER_COMMISSION.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-white border-t border-gray-800 pt-2 mt-2">
                <span>الإجمالي للشراء:</span> 
                <span>${(((Number(tradeShares) || 0) * parseFloat(tradeStock.price)) + BROKER_COMMISSION).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleExecuteTrade('buy')} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                شراء
              </button>
              <button onClick={() => handleExecuteTrade('sell')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
                بيع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* محفظة المتدرب */}
      {isPortfolioOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-yellow-500">💼 محفظة التدريب الافتراضية</h2>
              <button onClick={() => setIsPortfolioOpen(false)} className="text-gray-500 hover:text-white text-2xl font-black">×</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 relative">
                <p className="text-sm text-gray-400 mb-1">الرصيد النقدي (الكاش)</p>
                <p className="text-2xl font-black text-green-500">${portfolio.cash.toFixed(2)}</p>
                
                <div className="absolute top-4 left-4 flex gap-1">
                  <button onClick={() => setIsDepositOpen(true)} className="bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold border border-green-600/50 transition-colors">
                    + إيداع
                  </button>
                  <button onClick={() => setIsWithdrawOpen(true)} className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold border border-red-600/50 transition-colors">
                    - سحب
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                <p className="text-sm text-gray-400 mb-1">إجمالي الأسهم المملوكة</p>
                <p className="text-2xl font-black text-blue-400">{portfolio.positions.length} شركات</p>
              </div>
            </div>

            <h3 className="font-bold text-gray-300 mb-3">الأسهم في محفظتك:</h3>
            {portfolio.positions.length === 0 ? (
              <div className="text-center text-gray-500 py-8 bg-gray-950 rounded-lg border border-gray-800 flex flex-col items-center gap-3 mb-6">
                <span>المحفظة فارغة حالياً.</span>
                {portfolio.cash === 0 && (
                  <button onClick={() => setIsDepositOpen(true)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-bold">
                    أودع ميزانيتك الأولى للبدء
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {portfolio.positions.map((pos, idx) => {
                  const liveStock = stocks.find(s => s.symbol === pos.symbol);
                  const currentPrice = liveStock ? parseFloat(liveStock.price) : pos.avgPrice;
                  const marketVal = pos.shares * currentPrice;
                  const costVal = pos.shares * pos.avgPrice;
                  const profitLoss = marketVal - costVal;
                  const profitLossPct = costVal > 0 ? (profitLoss / costVal) * 100 : 0;
                  const isPos = profitLoss >= 0;

                  return (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-950 p-4 rounded-lg border border-gray-800 gap-2">
                      <div>
                        <h4 className="font-black text-lg text-white">{pos.symbol} <span className="text-xs font-normal text-gray-400">({pos.shares} سهم)</span></h4>
                        <p className="text-xs text-gray-400">متوسط التكلفة: ${pos.avgPrice.toFixed(2)} | الحالي: ${currentPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-left w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                        <p className="text-sm font-bold text-white">${marketVal.toFixed(2)}</p>
                        <p className={`text-xs font-black ${isPos ? 'text-green-500' : 'text-red-500'}`}>
                          {isPos ? '+' : ''}${profitLoss.toFixed(2)} ({isPos ? '+' : ''}{profitLossPct.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ملخص إجمالي المحفظة */}
            <div className="bg-gradient-to-r from-gray-950 to-blue-950/40 p-4 rounded-xl border border-blue-900/50 space-y-3">
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">ملخص المحفظة الإجمالي</h3>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">القيمة السوقية للأسهم:</span>
                <span className="font-bold text-white">${totalStocksMarketValue.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">الرصيد النقدي (الكاش):</span>
                <span className="font-bold text-white">${portfolio.cash.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-base border-t border-gray-800 pt-2">
                <span className="font-bold text-gray-300">إجمالي قيمة المحفظة:</span>
                <span className="font-black text-yellow-400 text-lg">${totalPortfolioValue.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-gray-800 pt-2">
                <span className="font-bold text-gray-300">الربح / الخسارة غير المحققة:</span>
                <span className={`font-black flex items-center gap-1 ${unrealizedPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {unrealizedPL >= 0 ? '+' : ''}${unrealizedPL.toFixed(2)} ({unrealizedPL >= 0 ? '+' : ''}{unrealizedPLPercent.toFixed(1)}%)
                  {unrealizedPL >= 0 ? ' ▲' : ' ▼'}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-gray-800 pb-6 sticky top-0 bg-gray-950/90 backdrop-blur z-10 p-4 rounded-xl shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right w-full lg:w-auto">
              <div>
                <h1 className="text-3xl font-bold text-blue-500 mb-2">شاشة السوق الشاملة 📈</h1>
                <p className="text-sm text-gray-400">تحليل لحظي وتاريخي مع محفظة تدريب متكاملة.</p>
              </div>
              <div className="text-sm font-bold bg-gray-900 px-4 py-2 rounded-lg text-blue-400 border border-gray-800 whitespace-nowrap">
                الأسهم المعروضة: {displayedStocks.length}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 items-center">
              <button
                onClick={() => setIsPortfolioOpen(true)}
                className="bg-green-600/20 text-green-500 border border-green-500/50 hover:bg-green-600/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                💼 محفظتي (${portfolio.cash.toFixed(0)})
              </button>

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
            const ownedPosition = portfolio.positions.find(p => p.symbol === stock.symbol);

            return (
              <div 
                key={stock.symbol + index} 
                ref={(!showFavoritesOnly && isLast) ? lastStockElementRef : null}
                className={`bg-gray-900 p-5 rounded-2xl border ${isFav ? 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-gray-800 shadow-xl'} flex flex-col justify-between hover:border-blue-500/50 transition-all h-full`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
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
                  
                  <div className="flex flex-col items-center justify-center bg-blue-950/50 px-3 py-1.5 rounded-lg border border-blue-900/50 min-w-[80px]">
                    <span className="text-blue-400 text-lg font-bold leading-tight">${stock.price}</span>
                    <span className="text-gray-400 text-[10px] font-semibold mt-0.5">{stock.priceSAR} ر.س</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => { setTradeStock(stock); setTradeShares(''); }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold py-2 rounded border border-gray-700 transition-colors"
                  >
                    تداول السهم ⚖️
                  </button>
                  {ownedPosition && (
                    <div className="flex-1 bg-green-900/30 border border-green-800/50 rounded flex items-center justify-center text-[10px] font-bold text-green-500">
                      تملك: {ownedPosition.shares} سهم
                    </div>
                  )}
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
                    
                    <div className={`flex flex-col items-end ${stock.isTotalPositive ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="text-sm font-black flex items-center gap-1">
                        ${stock.total30Days} {stock.isTotalPositive ? 'ربح ▲' : 'خسارة ▼'}
                      </span>
                      <span className="text-[9px] font-bold opacity-90 mt-0.5">
                        {stock.total30DaysSAR} ر.س
                      </span>
                    </div>

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
            جاري استرجاع الأسهم والتحليل المستمر...
          </div>
        )}
      </div>
    </main>
  );
}
