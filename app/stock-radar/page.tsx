'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { getStockData, getLivePrices } from './actions';

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

const DEFAULT_SHARIA_STATUS: Record<string, 'halal' | 'mixed' | 'haram'> = {};
const initDefaultSharia = () => {
  const haramStocks = [
    'JPM', 'BAC', 'C', 'GS', 'MS', 'WFC', 'BK', 'USB', 'TFC', 'PNC', 'COF', 'DFS', 'SCHW', 
    'AXP', 'SYF', 'STT', 'NTRS', 'FITB', 'MTB', 'KEY', 'RF', 'CFG', 'HBAN', 'CMA', 'ZION', 
    'SBNY', 'SIVB', 'FRC', 'PBCT', 'SPGI', 'MCO', 'BRK-B', 'PGR', 'MET', 'AIG', 'TRV', 'ALL', 
    'AFL', 'HIG', 'CB', 'RE', 'AMP', 'AJG', 'AIZ', 'PRU', 'PFG', 'BRO', 'CINF', 'L', 'WRB',
    'PM', 'MO', 'STZ', 'TAP', 'BF-B', 'TSN', 'HRL', 'MGM', 'CZR', 'WYNN', 'LVS', 'PENN', 
    'DKNG', 'DIS', 'NFLX', 'PARA', 'FOXA', 'FOX', 'LYV', 'MAR', 'HLT', 'LMT', 'RTX', 'GD', 
    'NOC', 'HII', 'TXT', 'BA', 'TMUS', 'T', 'VZ', 'CHTR', 'CMCSA', 'LUMN', 'CCL', 'RCL', 
    'NCLH', 'AAL', 'DAL', 'UAL', 'LUV', 'ALK', 'F', 'GM'
  ];
  const mixedStocks = [
    'XOM', 'CVX', 'IBM', 'CSCO', 'CAT', 'GE', 'UPS', 'FDX', 'NKE', 'SBUX', 'MCD', 'HD', 'LOW', 'WMT', 'COST'
  ];

  ALL_MARKET_TICKERS.forEach(sym => {
    if (haramStocks.includes(sym)) DEFAULT_SHARIA_STATUS[sym] = 'haram';
    else if (mixedStocks.includes(sym)) DEFAULT_SHARIA_STATUS[sym] = 'mixed';
    else DEFAULT_SHARIA_STATUS[sym] = 'halal';
  });
};
initDefaultSharia();

type Position = { symbol: string; shares: number; avgPrice: number; purchaseDate: string };
type Portfolio = { id: string; name: string; cash: number; positions: Position[] };

export default function StockRadarPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHalalOnly, setShowHalalOnly] = useState(false);

  const [customShariaOverrides, setCustomShariaOverrides] = useState<Record<string, 'halal' | 'mixed' | 'haram'>>({});
  const [editingShariaSymbol, setEditingShariaSymbol] = useState<string | null>(null);

  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    { id: '1', name: 'محفظتي الأساسية', cash: 10000, positions: [] }
  ]);
  const [activePortfolioId, setActivePortfolioId] = useState<string>('1');
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  
  const [isNewPortfolioOpen, setIsNewPortfolioOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [newPortfolioCash, setNewPortfolioCash] = useState<any>('');

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<any>('');
  
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<any>('');

  const [tradeStock, setTradeStock] = useState<any>(null);
  const [tradeShares, setTradeShares] = useState<any>('');
  const BROKER_COMMISSION = 2;

  const currentIndexRef = useRef(0);
  const initialLoadDone = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // حفظ مرجع مباشر للأسهم الحالية لاستخدامه في دالة التحديث اللحظي بدون قطع الـ render
  const stocksRef = useRef(stocks);
  const BATCH_SIZE = 12;

  useEffect(() => {
    stocksRef.current = stocks;
  }, [stocks]);

  useEffect(() => {
    const savedFavs = localStorage.getItem('stockRadarFavorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    const savedPortfolios = localStorage.getItem('stockRadarPortfolios');
    if (savedPortfolios) setPortfolios(JSON.parse(savedPortfolios));
    const savedSharia = localStorage.getItem('stockRadarCustomSharia');
    if (savedSharia) setCustomShariaOverrides(JSON.parse(savedSharia));
  }, []);

  useEffect(() => {
    localStorage.setItem('stockRadarFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('stockRadarPortfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  useEffect(() => {
    localStorage.setItem('stockRadarCustomSharia', JSON.stringify(customShariaOverrides));
  }, [customShariaOverrides]);

  // --- التحديث اللحظي المباشر للأسعار ---
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentStocks = stocksRef.current;
      if (currentStocks.length === 0) return;
      
      const symbolsToUpdate = currentStocks.map(s => s.symbol);
      const res = await getLivePrices(symbolsToUpdate);
      
      if (res && res.success && res.data) {
        setStocks(prevStocks => prevStocks.map(stock => {
          const liveData = res.data[stock.symbol];
          if (liveData && liveData.price !== stock.price) {
            return {
              ...stock,
              price: liveData.price,
              priceSAR: liveData.priceSAR
            };
          }
          return stock;
        }));
      }
    }, 20000); // تحديث الأرقام كل 20 ثانية بشكل صامت خلف الكواليس
    
    return () => clearInterval(interval);
  }, []);

  const activePortfolio = portfolios.find(p => p.id === activePortfolioId) || portfolios[0];

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  };

  const handleToggleFavoritesView = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    setShowHalalOnly(false);
  };

  const handleToggleHalalView = () => {
    setShowHalalOnly(!showHalalOnly);
    setShowFavoritesOnly(false);
  };

  const getShariaStatus = (symbol: string) => {
    const status = customShariaOverrides[symbol] || DEFAULT_SHARIA_STATUS[symbol] || 'halal';
    if (status === 'haram') {
      return { label: 'غير متوافق 🔴', class: 'bg-red-950/40 text-red-400 border-red-800/50', desc: 'غير شرعي', type: 'haram' };
    } else if (status === 'mixed') {
      return { label: 'مختلط 🟡', class: 'bg-yellow-950/40 text-yellow-400 border-yellow-800/50', desc: 'يحتاج تطهير', type: 'mixed' };
    } else {
      return { label: 'متوافق (حلال) 🟢', class: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50', desc: 'متوافق شرعياً', type: 'halal' };
    }
  };

  const updateShariaStatus = (symbol: string, newStatus: 'halal' | 'mixed' | 'haram') => {
    setCustomShariaOverrides(prev => ({ ...prev, [symbol]: newStatus }));
    setEditingShariaSymbol(null);
  };

  const initializeStocks = async () => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    setIsLoading(true);

    const targetCount = BATCH_SIZE;
    currentIndexRef.current = targetCount;
    const batchToLoad = ALL_MARKET_TICKERS.slice(0, targetCount);

    try {
      const res = await getStockData(batchToLoad);
      if (res && res.success && res.data) {
        const fetchedStocks: any[] = Array.isArray(res.data) ? res.data : [res.data];
        setStocks(fetchedStocks);
      }
    } catch (error) {
      console.error("Error initializing stocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeStocks();
  }, []);

  const loadMoreStocks = async () => {
    if (isLoading || !hasMore || showFavoritesOnly || showHalalOnly) return;
    setIsLoading(true);

    const currentIdx = currentIndexRef.current;
    const nextBatch = ALL_MARKET_TICKERS.slice(currentIdx, currentIdx + BATCH_SIZE);
    
    if (nextBatch.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await getStockData(nextBatch);
      if (res && res.success && res.data) {
        const fetchedStocks: any[] = Array.isArray(res.data) ? res.data : [res.data];
        setStocks(prev => {
          const uniqueNew = fetchedStocks.filter((newStock: any) => newStock && newStock.symbol && !prev.some(s => s.symbol === newStock.symbol));
          return [...prev, ...uniqueNew];
        });
      }

      const newIndex = currentIdx + BATCH_SIZE;
      currentIndexRef.current = newIndex;
      if (newIndex >= ALL_MARKET_TICKERS.length) setHasMore(false);
    } catch (error) {
      console.error("Error loading more stocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    
    setIsSearching(true);
    try {
      const result = await getStockData(searchQuery);
      if (result && result.success && result.data) {
        const dataAny = result.data as any;
        const searchedStock = Array.isArray(dataAny) ? dataAny[0] : dataAny;
        if (searchedStock && searchedStock.symbol) {
           setStocks(prev => [searchedStock, ...prev.filter(s => s.symbol !== searchedStock.symbol)]);
           setSearchQuery('');
        }
      } else {
        alert("لم يتم العثور على السهم أو تأكد من الرمز.");
      }
    } catch (error) {
      alert("حدث خطأ أثناء البحث.");
    } finally {
      setIsSearching(false);
    }
  };

  const lastStockElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || showFavoritesOnly || showHalalOnly) return; 
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMoreStocks();
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, showFavoritesOnly, showHalalOnly]);

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) return alert("الرجاء إدخال اسم المحفظة.");
    const cashVal = Number(newPortfolioCash) || 0;
    const newPort: Portfolio = { id: Date.now().toString(), name: newPortfolioName.trim(), cash: cashVal, positions: [] };
    setPortfolios(prev => [...prev, newPort]);
    setActivePortfolioId(newPort.id);
    setIsNewPortfolioOpen(false);
    setNewPortfolioName('');
    setNewPortfolioCash('');
    alert(`✅ تم إنشاء محفظة "${newPort.name}" بنجاح!`);
  };

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return alert("الرجاء إدخال مبلغ صحيح للإيداع.");
    setPortfolios(prev => prev.map(p => p.id === activePortfolioId ? { ...p, cash: p.cash + amount } : p));
    setIsDepositOpen(false);
    setDepositAmount('');
    alert(`✅ تم إيداع ${amount}$ بنجاح!`);
  };

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) return alert("الرجاء إدخال مبلغ صحيح للسحب.");
    if (amount > activePortfolio.cash) return alert(`❌ رصيد الكاش المتاح (${activePortfolio.cash.toFixed(2)}$) لا يكفي.`);
    setPortfolios(prev => prev.map(p => p.id === activePortfolioId ? { ...p, cash: p.cash - amount } : p));
    setIsWithdrawOpen(false);
    setWithdrawAmount('');
    alert(`✅ تم سحب ${amount}$ بنجاح!`);
  };

  const handleExecuteTrade = (type: 'buy' | 'sell') => {
    const sharesNum = Number(tradeShares);
    if (!tradeStock || !sharesNum || sharesNum <= 0) return alert("الرجاء إدخال عدد أسهم صحيح.");
    
    const stockSymbol = tradeStock.symbol;
    const stockPrice = parseFloat(tradeStock.price);
    const totalSharesValue = stockPrice * sharesNum;

    if (type === 'buy') {
      const isAlreadyOwnedElsewhere = portfolios.some(p => p.id !== activePortfolioId && p.positions.some(pos => pos.symbol === stockSymbol));
      if (isAlreadyOwnedElsewhere) return alert(`❌ عذراً، السهم (${stockSymbol}) موجود مسبقاً في محفظة أخرى.`);

      const totalCost = totalSharesValue + BROKER_COMMISSION;
      if (activePortfolio.cash < totalCost) return alert(`❌ رصيدك غير كافٍ. تحتاج إلى ${totalCost.toFixed(2)}$ (شاملة العمولة 2$).`);
      
      const commissionPerShare = BROKER_COMMISSION / sharesNum;
      const effectivePricePerShare = stockPrice + commissionPerShare;
      const currentDate = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });

      setPortfolios(prev => prev.map(p => {
        if (p.id !== activePortfolioId) return p;
        const newPositions = [...p.positions];
        const existingPos = newPositions.find(pos => pos.symbol === stockSymbol);
        
        if (existingPos) {
          const prevTotalCost = existingPos.shares * existingPos.avgPrice;
          const currentTradeCost = sharesNum * effectivePricePerShare;
          existingPos.shares += sharesNum;
          existingPos.avgPrice = (prevTotalCost + currentTradeCost) / existingPos.shares;
        } else {
          newPositions.push({ symbol: stockSymbol, shares: sharesNum, avgPrice: effectivePricePerShare, purchaseDate: currentDate });
        }
        return { ...p, cash: p.cash - totalCost, positions: newPositions };
      }));
      alert(`✅ تم الشراء بنجاح في محفظة "${activePortfolio.name}"!`);
      
    } else if (type === 'sell') {
      const existingPos = activePortfolio.positions.find(pos => pos.symbol === stockSymbol);
      if (!existingPos || existingPos.shares < sharesNum) return alert("❌ لا تملك هذا العدد من السهم في هذه المحفظة للبيع.");

      const totalProceeds = totalSharesValue - BROKER_COMMISSION;
      
      setPortfolios(prev => prev.map(p => {
        if (p.id !== activePortfolioId) return p;
        let newPositions = p.positions.map(pos => {
          if (pos.symbol === stockSymbol) return { ...pos, shares: pos.shares - sharesNum };
          return pos;
        }).filter(pos => pos.shares > 0);
        return { ...p, cash: p.cash + totalProceeds, positions: newPositions };
      }));
      alert(`✅ تم البيع بنجاح وتمت إضافة ${totalProceeds.toFixed(2)}$ للكاش.`);
    }

    setTradeStock(null);
    setTradeShares('');
    setIsPortfolioOpen(false);
  };

  let totalStocksMarketValue = 0;
  let totalCostValue = 0;

  activePortfolio.positions.forEach(pos => {
    const liveStock = stocks.find(s => s.symbol === pos.symbol);
    const currentPrice = liveStock ? parseFloat(liveStock.price) : pos.avgPrice;
    totalStocksMarketValue += pos.shares * currentPrice;
    totalCostValue += pos.shares * pos.avgPrice;
  });

  const totalPortfolioValue = activePortfolio.cash + totalStocksMarketValue;
  const unrealizedPL = totalStocksMarketValue - totalCostValue;
  const unrealizedPLPercent = totalCostValue > 0 ? (unrealizedPL / totalCostValue) * 100 : 0;

  let displayedStocks = stocks;
  if (showFavoritesOnly) {
    displayedStocks = stocks.filter(s => favorites.includes(s.symbol));
  } else if (showHalalOnly) {
    displayedStocks = stocks.filter(s => getShariaStatus(s.symbol).type === 'halal');
  }

  return (
    <main className="p-4 md:p-8 bg-slate-950 min-h-screen text-right font-sans text-slate-200" dir="rtl">
      
      {/* نافذة تعديل التصنيف الشرعي */}
      {editingShariaSymbol && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[80] p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-xs w-full text-center">
            <h3 className="text-lg font-bold text-white mb-2">تعديل التصنيف الشرعي</h3>
            <p className="text-sm text-slate-400 mb-6">سهم: <span className="font-black text-blue-400">{editingShariaSymbol}</span></p>
            <div className="flex flex-col gap-3">
              <button onClick={() => updateShariaStatus(editingShariaSymbol, 'halal')} className="bg-emerald-900/40 hover:bg-emerald-600 text-emerald-400 hover:text-white py-2.5 rounded-lg border border-emerald-800/50 font-bold transition-colors">متوافق (حلال) 🟢</button>
              <button onClick={() => updateShariaStatus(editingShariaSymbol, 'mixed')} className="bg-yellow-900/40 hover:bg-yellow-600 text-yellow-400 hover:text-white py-2.5 rounded-lg border border-yellow-800/50 font-bold transition-colors">مختلط 🟡</button>
              <button onClick={() => updateShariaStatus(editingShariaSymbol, 'haram')} className="bg-red-900/40 hover:bg-red-600 text-red-400 hover:text-white py-2.5 rounded-lg border border-red-800/50 font-bold transition-colors">غير متوافق 🔴</button>
            </div>
            <button onClick={() => setEditingShariaSymbol(null)} className="mt-6 text-slate-500 hover:text-white text-sm font-bold">إلغاء</button>
          </div>
        </div>
      )}

      {/* نوافذ المحافظ */}
      {isPortfolioOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-yellow-500">💼 إدارة المحافظ والتداول</h2>
              <button onClick={() => setIsPortfolioOpen(false)} className="text-slate-500 hover:text-white text-2xl font-black">×</button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 font-bold ml-2">المحفظة النشطة:</span>
              {portfolios.map(p => (
                <button key={p.id} onClick={() => setActivePortfolioId(p.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${p.id === activePortfolioId ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{p.name}</button>
              ))}
              <button onClick={() => setIsNewPortfolioOpen(true)} className="bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-600/30 transition-colors mr-auto">+ محفظة جديدة</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 relative">
                <p className="text-sm text-slate-400 mb-1">الرصيد النقدي ({activePortfolio.name})</p>
                <p className="text-2xl font-black text-emerald-500">${activePortfolio.cash.toFixed(2)}</p>
                <div className="absolute top-4 left-4 flex gap-1">
                  <button onClick={() => setIsDepositOpen(true)} className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold border border-emerald-600/30">+ إيداع</button>
                  <button onClick={() => setIsWithdrawOpen(true)} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold border border-red-600/30">- سحب</button>
                </div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <p className="text-sm text-slate-400 mb-1">الأسهم المملوكة</p>
                <p className="text-2xl font-black text-blue-400">{activePortfolio.positions.length} شركات</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الشريط العلوي والشاشة الرئيسية */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-slate-800/80 pb-4 sticky top-0 bg-slate-950/95 backdrop-blur-md z-10 p-5 rounded-2xl shadow-xl">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
            <div className="flex items-center justify-between w-full xl:w-auto">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600/10 p-2.5 rounded-xl border border-blue-500/20 text-blue-400 text-2xl font-bold hidden sm:block">📈</div>
                <div>
                  <h1 className="text-xl md:text-3xl font-black text-blue-400 tracking-tight">شاشة السوق الشاملة</h1>
                  
                  {/* مؤشر التحديث المباشر للأسعار */}
                  <div className="flex items-center gap-2 mt-2 bg-emerald-950/40 border border-emerald-900/50 px-2 py-1 rounded-full w-max">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold tracking-wide">الأسعار تتحدث برمجياً (Live)</span>
                  </div>

                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden bg-slate-800 text-white p-2 rounded-lg border border-slate-700">
                {isMobileMenuOpen ? 'إخفاء الأزرار 🔺' : 'فلاتر وبحث 🔍'}
              </button>
            </div>
            
            <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} xl:flex flex-col sm:flex-row flex-wrap items-center justify-center xl:justify-end gap-3 w-full xl:w-auto mt-4 xl:mt-0 transition-all`}>
              <button onClick={() => setIsPortfolioOpen(true)} className="w-full sm:w-auto bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                <span>💼</span><span>{activePortfolio.name}</span>
                <span className="bg-emerald-950/50 px-2 py-0.5 rounded-lg text-xs text-emerald-300 border border-emerald-800/50">${activePortfolio.cash.toFixed(0)}</span>
              </button>
              <button onClick={handleToggleHalalView} className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${showHalalOnly ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-slate-900/80 text-slate-300 border-slate-700/50'}`}>
                <span>☪️</span><span>{showHalalOnly ? 'إلغاء الفلتر' : 'الأسهم الحلال فقط'}</span>
              </button>
              <button onClick={handleToggleFavoritesView} className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${showFavoritesOnly ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 'bg-slate-900/80 text-slate-300 border-slate-700/50'}`}>
                <span>⭐</span><span>{showFavoritesOnly ? 'إلغاء الفلتر' : 'أسهمي المفضلة'}</span>
              </button>
              <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toUpperCase())} placeholder="بحث..." className="bg-slate-900/80 border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 w-full sm:w-36 text-left uppercase text-white placeholder-slate-500" dir="ltr" />
                <button type="submit" disabled={isSearching || !searchQuery.trim()} className="bg-blue-600/90 hover:bg-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 text-white">{isSearching ? '...' : 'اصطياد'}</button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedStocks.map((stock, index) => {
            const isLast = index === displayedStocks.length - 1;
            const isFav = favorites.includes(stock.symbol);
            const ownerPortfolio = portfolios.find(p => p.positions.some(pos => pos.symbol === stock.symbol));
            const ownedInActive = ownerPortfolio?.id === activePortfolioId;
            const ownedPosition = activePortfolio.positions.find(pos => pos.symbol === stock.symbol);
            const sharia = getShariaStatus(stock.symbol);

            return (
              <div key={stock.symbol + index} ref={(!showFavoritesOnly && !showHalalOnly && isLast) ? lastStockElementRef : null} className={`bg-slate-900 p-5 rounded-2xl border ${isFav ? 'border-yellow-500/30' : 'border-slate-800'} flex flex-col justify-between hover:border-blue-500/40 transition-all h-full relative`}>
                <div className="absolute top-4 left-4 z-10 cursor-pointer hover:scale-105 transition-transform" onClick={() => setEditingShariaSymbol(stock.symbol)}>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${sharia.class}`} title="تعديل التصنيف الشرعي">
                    {sharia.label} ✏️
                  </span>
                </div>

                <div className="flex justify-between items-start mb-4 pt-1">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFavorite(stock.symbol)} className="text-2xl focus:outline-none transition-transform hover:scale-125 pb-1">
                      {isFav ? '⭐' : <span className="text-slate-600">☆</span>}
                    </button>
                    <div>
                      <h2 className="text-2xl font-black text-white">{stock.symbol}</h2>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">PE: {stock.peRatio}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-blue-950/20 px-3 py-1.5 rounded-lg border border-blue-900/30 min-w-[75px] mt-6 transition-all duration-500">
                    <span className="text-blue-400 text-lg font-bold leading-tight">${stock.price}</span>
                    <span className="text-slate-400 text-[10px] font-semibold mt-0.5">{stock.priceSAR} ر.س</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <button onClick={() => { setTradeStock(stock); setTradeShares(''); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-xl border border-slate-700">تداول ⚖️</button>
                  {ownedInActive && ownedPosition ? (
                    <button onClick={() => { setTradeStock(stock); setTradeShares(ownedPosition.shares.toString()); }} className="flex-1 bg-red-900/20 hover:bg-red-600 text-red-400 text-xs font-bold py-2 rounded-xl border border-red-800/40">بيع ({ownedPosition.shares})</button>
                  ) : ownerPortfolio ? (
                    <div className="flex-1 bg-yellow-950/30 border border-yellow-800/40 rounded-xl flex items-center justify-center text-[10px] font-bold text-yellow-500">مملوك في {ownerPortfolio.name}</div>
                  ) : (
                    <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-500">متاح للشراء</div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-slate-800/50 to-slate-900 p-3 rounded-xl mb-4 border border-slate-700/50 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-slate-400">السعر المحدد للدخول:</span>
                    <span className="text-sm font-black text-emerald-400">${stock.suggestedEntryPrice}</span>
                  </div>
                  <p className="text-xs font-bold mb-2 text-slate-200">{stock.entrySignal}</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-700/50 pt-2 mt-2">
                    <span className="text-blue-400 font-bold">💡 تحليل Gemini: </span>{stock.analysis}
                  </p>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-2.5 mb-3 shadow-inner">
                  <h3 className="text-[10px] font-bold text-slate-400 mb-2 px-1">سجل التداول (آخر 30 يوم):</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto pl-1 custom-scrollbar">
                    {stock.history30Days?.map((dayRecord: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] p-1.5 border-b border-slate-800/50 last:border-0">
                        <span className="text-slate-400">{dayRecord.day}</span>
                        <span className={`font-bold flex items-center gap-1 ${dayRecord.isPositive ? 'text-emerald-500' : 'text-red-400'}`}>
                          {dayRecord.status} ${dayRecord.amount} {dayRecord.isPositive ? '▲' : '▼'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-slate-300">صافي آخر 30 يوم:</span>
                    <div className={`flex flex-col items-end ${stock.isTotalPositive ? 'text-emerald-500' : 'text-red-400'}`}>
                      <span className="text-sm font-black flex items-center gap-1">
                        ${stock.total30Days} {stock.isTotalPositive ? 'ربح ▲' : 'خسارة ▼'}
                      </span>
                      <span className="text-[9px] font-bold opacity-80 mt-0.5 text-slate-400">
                        {stock.total30DaysSAR} ر.س
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-[10px] font-bold text-slate-500 mb-2 text-center">العائد التاريخي (النسبة، الأرباح/الخسائر، والسعر)</h3>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    {[
                      { label: 'شهر', data: stock.stats?.m1 },
                      { label: '3 أشهر', data: stock.stats?.m3 },
                      { label: '6 أشهر', data: stock.stats?.m6 },
                      { label: 'سنة', data: stock.stats?.y1 },
                      { label: '3 سنوات', data: stock.stats?.y3 },
                      { label: '5 سنوات', data: stock.stats?.y5 }
                    ].map((stat, i) => (
                      <div key={i} className="bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/80 flex flex-col justify-center items-center min-h-[75px]">
                        <span className="text-[9px] text-slate-400 font-semibold mb-0.5">{stat.label}</span>
                        <span className={`text-[11px] font-black ${stat.data?.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.data?.isPositive ? '+' : ''}{stat.data?.value}
                        </span>
                        <span className={`text-[9px] font-bold mt-0.5 ${stat.data?.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {stat.data?.isPositive ? 'ربح ' : 'خسارة '}${stat.data?.amount}
                        </span>
                        <span className="text-[8px] text-slate-400 mt-1 border-t border-slate-800 pt-0.5 w-full">
                          السعر: ${stat.data?.pastPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className="text-center py-10 text-blue-400 font-bold text-lg animate-pulse">
            جاري تحميل البيانات المباشرة...
          </div>
        )}
      </div>
    </main>
  );
}
