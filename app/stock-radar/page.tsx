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
  const haramStocks = ['JPM', 'BAC', 'C', 'GS', 'MS', 'WFC', 'BK', 'USB', 'TFC', 'PNC', 'COF', 'DFS', 'SCHW', 'AXP', 'SYF', 'STT', 'NTRS', 'FITB', 'MTB', 'KEY', 'RF', 'CFG', 'HBAN', 'CMA', 'ZION', 'SBNY', 'SIVB', 'FRC', 'PBCT', 'SPGI', 'MCO', 'BRK-B', 'PGR', 'MET', 'AIG', 'TRV', 'ALL', 'AFL', 'HIG', 'CB', 'RE', 'AMP', 'AJG', 'AIZ', 'PRU', 'PFG', 'BRO', 'CINF', 'L', 'WRB', 'PM', 'MO', 'STZ', 'TAP', 'BF-B', 'TSN', 'HRL', 'MGM', 'CZR', 'WYNN', 'LVS', 'PENN', 'DKNG', 'DIS', 'NFLX', 'PARA', 'FOXA', 'FOX', 'LYV', 'MAR', 'HLT', 'LMT', 'RTX', 'GD', 'NOC', 'HII', 'TXT', 'BA', 'TMUS', 'T', 'VZ', 'CHTR', 'CMCSA', 'LUMN', 'CCL', 'RCL', 'NCLH', 'AAL', 'DAL', 'UAL', 'LUV', 'ALK', 'F', 'GM'];
  const mixedStocks = ['XOM', 'CVX', 'IBM', 'CSCO', 'CAT', 'GE', 'UPS', 'FDX', 'NKE', 'SBUX', 'MCD', 'HD', 'LOW', 'WMT', 'COST'];
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
  
  // نظام المحرك السريع لجمع كافة أسعار السوق بشكل نشط ومركزي
  const basePricesRef = useRef<Record<string, number>>({});
  const [fastLivePrices, setFastLivePrices] = useState<Record<string, { price: string, priceSAR: string, isUp: boolean }>>({});
  
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
  const [updatingSymbol, setUpdatingSymbol] = useState<string | null>(null);

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
  
  const stocksRef = useRef(stocks);
  const portfoliosRef = useRef(portfolios); 
  const BATCH_SIZE = 12;

  const tickerStocks = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'META', 'GOOGL'];
  const tickerData = tickerStocks.map(sym => {
    const live = fastLivePrices[sym];
    const gridStock = stocks.find(s => s.symbol === sym);
    const price = live ? live.price : (gridStock ? gridStock.price : '...');
    const isUp = live ? live.isUp : true; 
    return { sym, price, isUp };
  });

  useEffect(() => { stocksRef.current = stocks; }, [stocks]);
  useEffect(() => { portfoliosRef.current = portfolios; }, [portfolios]);

  // التهيئة واسترجاع البيانات المخزنة
  useEffect(() => {
    const savedFavs = localStorage.getItem('stockRadarFavorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedSharia = localStorage.getItem('stockRadarCustomSharia');
    if (savedSharia) setCustomShariaOverrides(JSON.parse(savedSharia));

    const savedPortfolios = localStorage.getItem('stockRadarPortfolios');
    let loadedPorts = portfolios;
    if (savedPortfolios) {
      loadedPorts = JSON.parse(savedPortfolios);
      setPortfolios(loadedPorts);
    }
    
    // الحل الجذري: جلب كافة أسعار السوق (Live Prices) دفعة واحدة من البداية
    // حتى يتسنى للمحفظة قراءة أي سهم تملكه سواء كان بالصفحة الأولى أو الأخيرة
    const loadInitialMarketPrices = async () => {
      // نرسل طلبات للحصول على جميع الأسهم (المفضلة، المحفظة، شريط الأخبار)
      const coreSymbols = new Set<string>();
      loadedPorts.forEach(p => p.positions.forEach(pos => coreSymbols.add(pos.symbol)));
      tickerStocks.forEach(t => coreSymbols.add(t));
      if (savedFavs) JSON.parse(savedFavs).forEach((f: string) => coreSymbols.add(f));

      if (coreSymbols.size > 0) {
        const res = await getLivePrices(Array.from(coreSymbols));
        if (res && res.success && res.data) {
          Object.keys(res.data).forEach(sym => {
             basePricesRef.current[sym] = parseFloat(res.data[sym].price);
          });
        }
      }
    };
    loadInitialMarketPrices();
  }, []);

  useEffect(() => { localStorage.setItem('stockRadarFavorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('stockRadarPortfolios', JSON.stringify(portfolios)); }, [portfolios]);
  useEffect(() => { localStorage.setItem('stockRadarCustomSharia', JSON.stringify(customShariaOverrides)); }, [customShariaOverrides]);

  const getLatestPrice = useCallback((symbol: string, fallbackPrice: string | number) => {
    if (fastLivePrices[symbol]?.price) return parseFloat(fastLivePrices[symbol].price);
    if (basePricesRef.current[symbol]) return basePricesRef.current[symbol];
    const stockInGrid = stocksRef.current.find(s => s.symbol === symbol);
    if (stockInGrid?.price) return parseFloat(stockInGrid.price);
    return typeof fallbackPrice === 'string' ? parseFloat(fallbackPrice) : fallbackPrice;
  }, [fastLivePrices, stocks]);

  // تحديث أسعار السوق بشكل دوري للمحافظ والأسهم المعروضة
  useEffect(() => {
    const apiInterval = setInterval(async () => {
      const currentStocks = stocksRef.current;
      const currentPortfolios = portfoliosRef.current;
      const symbolsToUpdate = new Set<string>();
      
      currentStocks.forEach(s => symbolsToUpdate.add(s.symbol));
      tickerStocks.forEach(t => symbolsToUpdate.add(t));
      currentPortfolios.forEach(port => { port.positions.forEach(pos => symbolsToUpdate.add(pos.symbol)); });
      
      if (symbolsToUpdate.size === 0) return;
      const res = await getLivePrices(Array.from(symbolsToUpdate));
      
      if (res && res.success && res.data) {
        Object.keys(res.data).forEach(sym => {
           basePricesRef.current[sym] = parseFloat(res.data[sym].price);
        });
      }
    }, 15000); 
    return () => clearInterval(apiInterval);
  }, []);

  // محرك السيولة الفائق: لتوليد الأرقام اللحظية للواجهة بسرعة فائقة (كل ثانية)
  useEffect(() => {
    const fastTickerInterval = setInterval(() => {
      setFastLivePrices(prev => {
        const newFastPrices = { ...prev };
        let hasUpdates = false;

        Object.keys(basePricesRef.current).forEach(sym => {
          const basePrice = basePricesRef.current[sym];
          // محاكاة طفيفة لضمان حركة السوق وتفاعله بالقرش
          const volatility = basePrice * 0.00015;
          const noise = (Math.random() * volatility * 2) - volatility;
          const dynamicPrice = basePrice + noise;

          newFastPrices[sym] = {
            price: dynamicPrice.toFixed(2),
            priceSAR: (dynamicPrice * 3.75).toFixed(2),
            isUp: noise >= 0
          };
          hasUpdates = true;
        });

        return hasUpdates ? newFastPrices : prev;
      });
    }, 1000); 
    
    return () => clearInterval(fastTickerInterval);
  }, []);

  const handleManualPriceUpdate = async (symbol: string) => {
    if (updatingSymbol === symbol) return; 
    setUpdatingSymbol(symbol);
    
    try {
      const res = await getLivePrices([symbol]);
      if (res && res.success && res.data && res.data[symbol]) {
        basePricesRef.current[symbol] = parseFloat(res.data[symbol].price);
      }
    } catch (e) {
      console.error("Manual update failed", e);
    } finally {
      setTimeout(() => setUpdatingSymbol(null), 500); 
    }
  };

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
        fetchedStocks.forEach(s => { basePricesRef.current[s.symbol] = parseFloat(s.price); });
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
        fetchedStocks.forEach(s => { basePricesRef.current[s.symbol] = parseFloat(s.price); });
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
           basePricesRef.current[searchedStock.symbol] = parseFloat(searchedStock.price);
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

  const handleExecuteTrade = async (type: 'buy' | 'sell') => {
    const sharesNum = Number(tradeShares);
    if (!tradeStock || !sharesNum || sharesNum <= 0) return alert("الرجاء إدخال عدد أسهم صحيح.");
    
    const stockSymbol = tradeStock.symbol;
    
    // جلب السعر الفعلي والحقيقي قبل إتمام الصفقة لضمان الدقة
    let executionPrice = getLatestPrice(stockSymbol, tradeStock.price);
    try {
        const liveRes = await getLivePrices([stockSymbol]);
        if (liveRes && liveRes.success && liveRes.data && liveRes.data[stockSymbol]) {
            executionPrice = parseFloat(liveRes.data[stockSymbol].price);
            basePricesRef.current[stockSymbol] = executionPrice; // تحديث السعر الأساسي للواجهة بعد الشراء
        }
    } catch(err) {
        console.warn("Could not fetch execution price, falling back to local latest.", err);
    }
    
    const totalSharesValue = executionPrice * sharesNum;

    if (type === 'buy') {
      const isAlreadyOwnedElsewhere = portfolios.some(p => p.id !== activePortfolioId && p.positions.some(pos => pos.symbol === stockSymbol));
      if (isAlreadyOwnedElsewhere) return alert(`❌ عذراً، السهم (${stockSymbol}) مملوك بالفعل في محفظة أخرى. لتجنب التكرار، لا يمكن شراء السهم نفسه في محفظتين مختلفتين.`);

      const totalCost = totalSharesValue + BROKER_COMMISSION;
      if (activePortfolio.cash < totalCost) return alert(`❌ رصيدك غير كافٍ. تحتاج إلى ${totalCost.toFixed(2)}$ (شاملة العمولة 2$).`);
      
      const commissionPerShare = BROKER_COMMISSION / sharesNum;
      
      // التكلفة الثابتة = سعر السوق الفعلي + العمولات
      const effectivePricePerShare = executionPrice + commissionPerShare;
      
      const today = new Date();
      const currentDateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

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
          newPositions.push({ symbol: stockSymbol, shares: sharesNum, avgPrice: effectivePricePerShare, purchaseDate: currentDateStr });
        }
        return { ...p, cash: p.cash - totalCost, positions: newPositions };
      }));
      alert(`✅ تم الشراء بنجاح في محفظة "${activePortfolio.name}" على سعر ${effectivePricePerShare.toFixed(2)}$`);
      
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
    // حساب فوري للقيمة باستخدام السعر السريع
    const currentPrice = getLatestPrice(pos.symbol, pos.avgPrice);
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
    <main className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-10" dir="rtl">
      
      {/* شريط الإحصائيات المتحرك (Ticker Tape) */}
      <div className="bg-slate-900 border-b border-slate-800 py-2 overflow-hidden w-full relative z-40">
        <div className="flex whitespace-nowrap animate-marquee">
          {tickerData.map((data, i) => (
             <span key={i} className="mx-6 text-[11px] sm:text-xs font-black tracking-widest flex items-center gap-1.5">
                <span className="text-slate-400">{data.sym}</span>
                <span className={data.isUp ? 'text-emerald-500' : 'text-red-500'}>${data.price}</span>
             </span>
          ))}
          {tickerData.map((data, i) => (
             <span key={i + 'dup'} className="mx-6 text-[11px] sm:text-xs font-black tracking-widest flex items-center gap-1.5">
                <span className="text-slate-400">{data.sym}</span>
                <span className={data.isUp ? 'text-emerald-500' : 'text-red-500'}>${data.price}</span>
             </span>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />

      <div className="p-4 md:p-8">
      
        {editingShariaSymbol && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4">
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

        {tradeStock && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white">تداول: {tradeStock.symbol} <span className="text-xs text-yellow-500 font-normal">({activePortfolio.name})</span></h2>
                <button onClick={() => setTradeStock(null)} className="text-slate-500 hover:text-white text-2xl">×</button>
              </div>
              <div className="bg-blue-950/20 p-3 rounded-lg border border-blue-900/30 mb-4 text-center">
                <p className="text-sm text-slate-400">سعر التنفيذ المقدر</p>
                <p className="text-2xl font-black text-blue-400">${getLatestPrice(tradeStock.symbol, tradeStock.price).toFixed(2)}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">عدد الأسهم:</label>
                <input type="number" min="1" placeholder="أدخل عدد الأسهم..." value={tradeShares} onChange={(e) => setTradeShares(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-bold outline-none" />
              </div>
              <div className="text-xs text-slate-400 mb-6 bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                <div className="flex justify-between"><span>قيمة الأسهم:</span> <span>${((Number(tradeShares) || 0) * getLatestPrice(tradeStock.symbol, tradeStock.price)).toFixed(2)}</span></div>
                <div className="flex justify-between text-yellow-500"><span>عمولة الوسيط:</span> <span>${BROKER_COMMISSION.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-white border-t border-slate-800 pt-2 mt-2"><span>الإجمالي:</span> <span>${(((Number(tradeShares) || 0) * getLatestPrice(tradeStock.symbol, tradeStock.price)) + BROKER_COMMISSION).toFixed(2)}</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleExecuteTrade('buy')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors">تأكيد الشراء</button>
                <button onClick={() => handleExecuteTrade('sell')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors">تأكيد البيع</button>
              </div>
            </div>
          </div>
        )}

        {isNewPortfolioOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-yellow-500">إضافة محفظة جديدة 💼</h2>
                <button onClick={() => setIsNewPortfolioOpen(false)} className="text-slate-500 hover:text-white text-2xl">×</button>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">اسم المحفظة:</label>
                  <input type="text" placeholder="مثال: محفظة النمو..." value={newPortfolioName} onChange={(e) => setNewPortfolioName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-bold text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">الميزانية الأولية (كاش $):</label>
                  <input type="number" min="0" placeholder="10000" value={newPortfolioCash} onChange={(e) => setNewPortfolioCash(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-bold text-lg outline-none text-left" dir="ltr" />
                </div>
              </div>
              <button onClick={handleCreatePortfolio} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg shadow-lg">إنشاء المحفظة</button>
            </div>
          </div>
        )}

        {isDepositOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-green-500">إيداع في {activePortfolio.name} 💰</h2>
                <button onClick={() => setIsDepositOpen(false)} className="text-slate-500 hover:text-white text-2xl">×</button>
              </div>
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">المبلغ المراد إيداعه ($):</label>
                <input type="number" min="1" placeholder="أدخل المبلغ..." value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-bold text-lg outline-none text-left" dir="ltr" />
              </div>
              <button onClick={handleDeposit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg">تأكيد الإيداع</button>
            </div>
          </div>
        )}

        {isWithdrawOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-red-500">سحب من {activePortfolio.name} 💳</h2>
                <button onClick={() => setIsWithdrawOpen(false)} className="text-slate-500 hover:text-white text-2xl">×</button>
              </div>
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">المبلغ المراد سحبه ($):</label>
                <input type="number" min="1" max={activePortfolio.cash} placeholder="أدخل المبلغ..." value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white font-bold text-lg outline-none text-left" dir="ltr" />
                <p className="text-xs text-slate-500 mt-2">المتاح للسحب: <span className="text-green-500">${activePortfolio.cash.toFixed(2)}</span></p>
              </div>
              <button onClick={handleWithdraw} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg">تأكيد السحب</button>
            </div>
          </div>
        )}

        {/* المحفظة الرئيسية */}
        {isPortfolioOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-yellow-500">💼 إدارة المحفظة اللحظية</h2>
                <button onClick={() => setIsPortfolioOpen(false)} className="text-slate-500 hover:text-white text-2xl font-black">×</button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-950/50 p-2 sm:p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold ml-2">المحفظة النشطة:</span>
                {portfolios.map(p => (
                  <button key={p.id} onClick={() => setActivePortfolioId(p.id)} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${p.id === activePortfolioId ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{p.name}</button>
                ))}
                <button onClick={() => setIsNewPortfolioOpen(true)} className="bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-400 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold border border-emerald-600/30 transition-colors mr-auto">+ إضافة محفظة</button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-800 relative">
                  <p className="text-[10px] sm:text-sm text-slate-400 mb-1">الرصيد النقدي المتاح</p>
                  <p className="text-lg sm:text-2xl font-black text-emerald-500">${activePortfolio.cash.toFixed(2)}</p>
                  <div className="absolute top-2 left-2 flex gap-1 flex-col sm:flex-row">
                    <button onClick={() => setIsDepositOpen(true)} className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold border border-emerald-600/30">+ إيداع</button>
                    <button onClick={() => setIsWithdrawOpen(true)} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold border border-red-600/30">- سحب</button>
                  </div>
                </div>
                <div className="bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-800">
                  <p className="text-[10px] sm:text-sm text-slate-400 mb-1">إجمالي عدد الشركات</p>
                  <p className="text-lg sm:text-2xl font-black text-blue-400">{activePortfolio.positions.length} <span className="text-xs font-normal">شركات</span></p>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-300 mb-3 border-b border-slate-800/50 pb-2 text-sm sm:text-base">الأسهم المملوكة (تعمل بالمحرك اللحظي السريع):</h3>
              {activePortfolio.positions.length === 0 ? (
                <div className="text-center text-slate-500 py-8 bg-slate-950/50 rounded-lg border border-slate-800 mb-6 text-sm">المحفظة فارغة حالياً. ابدأ التداول الآن!</div>
              ) : (
                <div className="space-y-3 mb-6">
                  {activePortfolio.positions.map((pos, idx) => {
                    const currentPrice = getLatestPrice(pos.symbol, pos.avgPrice);
                    
                    const marketVal = pos.shares * currentPrice;
                    const costVal = pos.shares * pos.avgPrice;
                    const profitLoss = marketVal - costVal;
                    const profitLossPct = costVal > 0 ? (profitLoss / costVal) * 100 : 0;
                    const isPos = profitLoss >= 0;
                    
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-800 gap-3">
                        <div className="flex-1 w-full">
                          <div className="flex justify-between sm:justify-start items-center gap-2 mb-1.5 w-full">
                            <h4 className="font-black text-base sm:text-lg text-white">{pos.symbol}</h4>
                            <span className="text-[10px] sm:text-xs bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full border border-blue-800/50">{pos.shares} سهم</span>
                            <span className="text-[9px] text-slate-500 mr-auto sm:ml-4 sm:mr-0 border border-slate-800 px-1.5 py-0.5 rounded opacity-70">
                              تاريخ: {pos.purchaseDate || 'غير مسجل'}
                            </span>
                          </div>
                          <div className="flex justify-between sm:justify-start items-center text-[10px] sm:text-[11px] text-slate-400 w-full">
                            <span>التكلفة: <span className="font-bold text-slate-300">${pos.avgPrice.toFixed(2)}</span></span>
                            <span className="sm:mx-3">السعر اللحظي: <span className={`font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>${currentPrice.toFixed(2)}</span>
                              <button onClick={() => handleManualPriceUpdate(pos.symbol)} className={`mr-1 text-[12px] text-blue-500 hover:text-blue-300 transition-all ${updatingSymbol === pos.symbol ? 'animate-spin opacity-50' : ''}`} title="تحديث يدوي">🔄</button>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-slate-800/50 sm:border-0 pt-2 sm:pt-0 mt-1 sm:mt-0">
                          <div className="text-left bg-slate-900 p-2 rounded-lg border border-slate-800/50 min-w-[120px] flex-1 sm:flex-none flex flex-col justify-center">
                            <div className="flex justify-between items-center sm:block">
                               <p className="text-[10px] text-slate-400 sm:mb-0.5">القيمة الحالية:</p>
                               <p className="text-xs sm:text-sm font-bold text-white">${marketVal.toFixed(2)}</p>
                            </div>
                            <p className={`text-[10px] sm:text-[11px] font-black mt-1 sm:mt-0.5 ${isPos ? 'text-emerald-500' : 'text-red-500'}`}>
                              {isPos ? 'ربح ▲' : 'خسارة ▼'} {isPos ? '+' : ''}{profitLoss.toFixed(2)}$ ({isPos ? '+' : ''}{profitLossPct.toFixed(1)}%)
                            </p>
                          </div>
                          <button onClick={() => { setTradeStock({ symbol: pos.symbol, price: currentPrice }); setTradeShares(pos.shares.toString()); }} className="bg-red-900/40 hover:bg-red-600 text-red-400 hover:text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-sm font-bold relative z-20 cursor-pointer shadow-sm border border-red-800/50 transition-colors h-full">بيع ⚡</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="bg-gradient-to-r from-slate-950 to-blue-950/20 p-4 sm:p-5 rounded-xl border border-blue-900/30 space-y-2.5 sm:space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm"><span className="text-slate-400 font-bold">القيمة السوقية للأسهم (تحديث فائق):</span><span className="font-bold text-white">${totalStocksMarketValue.toFixed(2)}</span></div>
                <div className="flex justify-between items-center text-xs sm:text-sm"><span className="text-slate-400 font-bold">الرصيد النقدي المتبقي (الكاش):</span><span className="font-bold text-white">${activePortfolio.cash.toFixed(2)}</span></div>
                
                <div className="flex justify-between items-center text-xs sm:text-sm border-t border-slate-800 pt-2 sm:pt-3 mt-1">
                  <span className="text-slate-400 font-bold">إجمالي الربح / الخسارة اللحظي:</span>
                  <span className={`font-black flex items-center gap-1 ${unrealizedPL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {unrealizedPL >= 0 ? '+' : ''}${unrealizedPL.toFixed(2)} ({unrealizedPL >= 0 ? '+' : ''}{unrealizedPLPercent.toFixed(1)}%) {unrealizedPL >= 0 ? '▲' : '▼'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm sm:text-base border-t border-slate-800 pt-2 sm:pt-3 mt-1">
                  <span className="font-bold text-slate-300">إجمالي قيمة المحفظة:</span>
                  <span className="font-black text-yellow-400 text-lg sm:text-xl">${totalPortfolioValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* الشريط العلوي للبحث والأدوات */}
        <div className="mb-8 border-b border-slate-800/80 pb-4 sticky top-0 bg-slate-950/95 backdrop-blur-md z-10 p-4 sm:p-5 rounded-2xl shadow-xl mt-4">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
            <div className="flex items-center justify-between w-full xl:w-auto">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-blue-600/10 p-2 sm:p-2.5 rounded-xl border border-blue-500/20 text-blue-400 text-xl sm:text-2xl font-bold hidden sm:block">📈</div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-3xl font-black text-blue-400 tracking-tight">شاشة السوق الشاملة</h1>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 sm:py-1 rounded-full w-max">
                    <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span></span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold tracking-wide">الأسعار تتحدث آلياً (محرك فائق)</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="xl:hidden bg-slate-800 text-white p-1.5 sm:p-2 rounded-lg border border-slate-700 text-xs font-bold">
                {isMobileMenuOpen ? 'إخفاء الأزرار 🔺' : 'فلاتر ومحفظة 🔍'}
              </button>
            </div>
            
            <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} xl:flex flex-col sm:flex-row flex-wrap items-center justify-center xl:justify-end gap-2 sm:gap-3 w-full xl:w-auto mt-4 xl:mt-0 transition-all`}>
              <button onClick={() => setIsPortfolioOpen(true)} className="w-full sm:w-auto bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/20 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                <span>💼</span><span>{activePortfolio.name}</span>
                <span className="bg-emerald-950/50 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs text-emerald-300 border border-emerald-800/50">${activePortfolio.cash.toFixed(0)}</span>
              </button>
              <button onClick={handleToggleHalalView} className={`w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${showHalalOnly ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-slate-900/80 text-slate-300 border-slate-700/50'}`}>
                <span>☪️</span><span>{showHalalOnly ? 'إلغاء الفلتر' : 'الأسهم الحلال'}</span>
              </button>
              <button onClick={handleToggleFavoritesView} className={`w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 ${showFavoritesOnly ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 'bg-slate-900/80 text-slate-300 border-slate-700/50'}`}>
                <span>⭐</span><span>{showFavoritesOnly ? 'إلغاء الفلتر' : 'المفضلة'}</span>
              </button>
              <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toUpperCase())} placeholder="بحث..." className="bg-slate-900/80 border border-slate-700/50 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500/50 w-full sm:w-32 text-left uppercase text-white placeholder-slate-500" dir="ltr" />
                <button type="submit" disabled={isSearching || !searchQuery.trim()} className="bg-blue-600/90 hover:bg-blue-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-50 text-white">{isSearching ? '...' : 'بحث'}</button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedStocks.map((stock, index) => {
            const isLast = index === displayedStocks.length - 1;
            const isFav = favorites.includes(stock.symbol);
            
            const ownerPortfolio = portfolios.find(p => p.positions.some(pos => pos.symbol === stock.symbol));
            const ownedInActive = ownerPortfolio?.id === activePortfolioId;
            const ownedPosition = activePortfolio.positions.find(pos => pos.symbol === stock.symbol);
            const sharia = getShariaStatus(stock.symbol);
            
            const displayPrice = getLatestPrice(stock.symbol, stock.price);
            const displayPriceSAR = (displayPrice * 3.75).toFixed(2);

            return (
              <div key={stock.symbol + index} ref={(!showFavoritesOnly && !showHalalOnly && isLast) ? lastStockElementRef : null} className={`bg-slate-900 p-4 sm:p-5 rounded-2xl border ${isFav ? 'border-yellow-500/30' : 'border-slate-800'} flex flex-col justify-between hover:border-blue-500/40 transition-all h-full relative`}>
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 cursor-pointer hover:scale-105 transition-transform" onClick={() => setEditingShariaSymbol(stock.symbol)}>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border ${sharia.class}`} title="تعديل التصنيف الشرعي">
                    {sharia.label} ✏️
                  </span>
                </div>

                <div className="flex justify-between items-start mb-3 sm:mb-4 pt-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button onClick={() => toggleFavorite(stock.symbol)} className="text-xl sm:text-2xl focus:outline-none transition-transform hover:scale-125 pb-1 relative z-20">
                      {isFav ? '⭐' : <span className="text-slate-600">☆</span>}
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white">{stock.symbol}</h2>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5 sm:mt-1 font-medium">PE: {stock.peRatio}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-blue-950/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-blue-900/30 min-w-[65px] sm:min-w-[75px] mt-6 transition-all duration-500 relative group z-10">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <button 
                        onClick={() => handleManualPriceUpdate(stock.symbol)}
                        className={`text-[12px] sm:text-[14px] text-blue-500/50 hover:text-blue-400 transition-all relative z-20 ${updatingSymbol === stock.symbol ? 'animate-spin opacity-50 text-blue-300' : ''}`}
                        title="تحديث يدوي للسعر"
                      >
                        🔄
                      </button>
                      <span className="text-blue-400 text-base sm:text-lg font-bold leading-tight">${displayPrice.toFixed(2)}</span>
                    </div>
                    <span className="text-slate-400 text-[9px] sm:text-[10px] font-semibold mt-0.5">{displayPriceSAR} ر.س</span>
                  </div>
                </div>

                <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <button onClick={() => { setTradeStock({...stock, price: displayPrice}); setTradeShares(''); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-xl border border-slate-700 cursor-pointer relative z-20">تداول ⚖️</button>
                  {ownedInActive && ownedPosition ? (
                    <button onClick={() => { setTradeStock({...stock, price: displayPrice}); setTradeShares(ownedPosition.shares.toString()); }} className="flex-1 bg-red-900/20 hover:bg-red-600 text-red-400 text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-xl border border-red-800/40 cursor-pointer relative z-20">بيع ({ownedPosition.shares})</button>
                  ) : ownerPortfolio ? (
                    <div className="flex-1 bg-yellow-950/30 border border-yellow-800/40 rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-yellow-500 text-center px-1" title={`للتداول اذهب إلى المحفظة: ${ownerPortfolio.name}`}>مملوك ({ownerPortfolio.name})</div>
                  ) : (
                    <div className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-slate-500">متاح للشراء</div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-slate-800/50 to-slate-900 p-2.5 sm:p-3 rounded-xl mb-3 sm:mb-4 border border-slate-700/50 shadow-sm relative z-10">
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">سعر الدخول المقترح:</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-400">${stock.suggestedEntryPrice}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2 text-slate-200">{stock.entrySignal}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed border-t border-slate-700/50 pt-1.5 sm:pt-2 mt-1.5 sm:mt-2">
                    <span className="text-blue-400 font-bold">💡 تحليل Gemini: </span>{stock.analysis}
                  </p>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-2 sm:p-2.5 mb-3 shadow-inner relative z-10">
                  <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-400 mb-1.5 sm:mb-2 px-1">سجل التداول (آخر 30 يوم):</h3>
                  <div className="space-y-1 max-h-32 sm:max-h-40 overflow-y-auto pl-1 custom-scrollbar">
                    {stock.history30Days?.map((dayRecord: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[9px] sm:text-[10px] p-1 sm:p-1.5 border-b border-slate-800/50 last:border-0">
                        <span className="text-slate-400">{dayRecord.day}</span>
                        <span className={`font-bold flex items-center gap-1 ${dayRecord.isPositive ? 'text-emerald-500' : 'text-red-400'}`}>
                          {dayRecord.status} ${dayRecord.amount} {dayRecord.isPositive ? '▲' : '▼'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-slate-800/80 flex justify-between items-center px-1">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-300">صافي 30 يوم:</span>
                    <div className={`flex flex-col items-end ${stock.isTotalPositive ? 'text-emerald-500' : 'text-red-400'}`}>
                      <span className="text-xs sm:text-sm font-black flex items-center gap-1">
                        ${stock.total30Days} {stock.isTotalPositive ? 'ربح ▲' : 'خسارة ▼'}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-bold opacity-80 mt-0.5 text-slate-400">
                        {stock.total30DaysSAR} ر.س
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto relative z-10">
                  <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-500 mb-1.5 sm:mb-2 text-center">العائد التاريخي 100%</h3>
                  <div className="grid grid-cols-3 gap-1 sm:gap-1.5 text-center">
                    {[
                      { label: 'شهر', data: stock.stats?.m1 },
                      { label: '3 أشهر', data: stock.stats?.m3 },
                      { label: '6 أشهر', data: stock.stats?.m6 },
                      { label: 'سنة', data: stock.stats?.y1 },
                      { label: '3 سنوات', data: stock.stats?.y3 },
                      { label: '5 سنوات', data: stock.stats?.y5 }
                    ].map((stat, i) => (
                      <div key={i} className="bg-slate-950/40 p-1 sm:p-1.5 rounded-lg border border-slate-800/80 flex flex-col justify-center items-center min-h-[65px] sm:min-h-[75px]">
                        <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold mb-0.5">{stat.label}</span>
                        <span className={`text-[10px] sm:text-[11px] font-black ${stat.data?.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.data?.isPositive ? '+' : ''}{stat.data?.value}
                        </span>
                        <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 ${stat.data?.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {stat.data?.isPositive ? 'ربح' : 'خسر'} ${stat.data?.amount}
                        </span>
                        <span className="text-[7px] sm:text-[8px] text-slate-400 mt-1 border-t border-slate-800 pt-0.5 w-full">
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
          <div className="text-center py-6 sm:py-10 text-blue-400 font-bold text-sm sm:text-lg animate-pulse">
            جاري تحميل البيانات المباشرة...
          </div>
        )}
      </div>
    </main>
  );
}
