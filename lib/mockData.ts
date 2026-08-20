export interface CompanyMetric {
  label: string;
  value: string;
  peerAvg?: string;
}

export interface Company {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  exchange: "BIST" | "ABD" | "Avrupa" | "Emtia" | "Döviz";
  assetClass: "hisse" | "maden" | "fon" | "doviz";
  madenKategori?: "altin" | "gumus_platin" | "enerji_sanayi";
  indexTag?: "BIST 30" | "BIST 100" | "S&P 500" | "NASDAQ 100" | "Dow Jones" | "DAX 40" | "CAC 40" | "FTSE 100" | "AEX" | "SMI" | "Kıymetli Maden" | "Avrupa" | "TEFAS" | "ETF" | string;
  price: number;
  currency: string;
  dailyChange: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  marketCap?: string;
  beta?: number;
  recommendation: "AL" | "SAT" | "TUT" | "NÖTR";
  inWatchlist: boolean;
  metrics: CompanyMetric[];
  description?: string;

  // Fund / ETF Specific Optional Fields
  fundManager?: string;        // Yöneten kurum (örn. "İş Portföy", "Invesco", "Vanguard")
  fundType?: string;           // TEFAS için: "Hisse Senedi Fonu", "Borçlanma Araçları Fonu" vb. / ETF için: "Endeks Fonu", "Sektör Fonu" vb.
  expenseRatio?: number;       // Yıllık masraf/yönetim ücreti oranı (%)
  aum?: string;                // Fon büyüklüğü / yönetilen varlık (örn. "12.4 Milyar ₺" / "$450B")
  riskLevel?: number;          // TEFAS risk değeri (1-7 skala)
  oneYearReturn?: number;      // Son 1 yıllık getiri (%)
  threeYearReturn?: number;    // Son 3 yıllık getiri (%)
  topHoldings?: string[];      // Fonun en büyük 3-5 pozisyonu (örn. ["AAPL %8.2", "MSFT %7.1", ...])

  // Google / Yahoo Finance Live Metrics
  high52?: number;             // 52 Haftalık / 1 Yıllık En Yüksek Fiyat (ATH)
  low52?: number;              // 52 Haftalık / 1 Yıllık En Düşük Fiyat (ATL)
  dayHigh?: number;            // Günün En Yüksek Fiyatı
  dayLow?: number;             // Günün En Düşük Fiyatı
  openPrice?: number;          // Günün Açılış Fiyatı
  volume?: number;             // Günlük İşlem Hacmi (Lot/Adet)
  avgVolume?: number;          // 3 Aylık Ortalama Günlük Hacim
  volumeRatio?: number;        // Güncel Hacim / Ortalama Hacim (Hacim Patlaması Katı)
  athDiscountPct?: number;     // 52 Haftalık Zirveye Göre İskonto Oranı (%)
  eps?: number;                // Hisse Başına Kâr (HBK / EPS in TL/USD)
  sharesOutstanding?: string;  // Toplam Ödenmiş Sermaye / Dolaşımdaki Lot
  yearChangePct?: number;      // 52 Haftalık / 1 Yıllık Yüzde Değişim

  // Analyst Consensus & Price Targets
  targetMeanPrice?: number;         // Analist Ortalama 12 Aylık Hedef Fiyat (TL)
  targetHighPrice?: number;         // En Yüksek Hedef Fiyat
  targetLowPrice?: number;          // En Düşük Hedef Fiyat
  recommendationKey?: string;       // Konsensüs Kararı (buy, strong_buy, hold, sell)
  numberOfAnalystOpinions?: number; // Görüş Bildiren Analist Kurum Sayısı
  targetUpsidePct?: number;         // Hedef Fiyata Göre Potansiyel Getiri Oranı (%)

  // Corporate Calendar & Dividends
  nextEarningsDate?: string;        // Gelecek Bilanço Açıklanma Tarihi
  exDividendDate?: string;          // Temettü Hak Kullanım Tarihi
  dividendRate?: number;            // Yıllık Hisse Başı Temettü Tutarı (TL)
  priceHistory?: Array<{ date: string; close: number }>; // Tarihsel fiyat serisi

  // Financial Highlights (Income Statement & Balance Sheet)
  totalRevenue?: string;            // Yıllık Toplam Hasılat / Ciro (Mr ₺)
  netIncome?: string;               // Yıllık Net Kâr (Mr ₺)
  operatingMargin?: number;         // Faaliyet Kâr Marjı (%)
  returnOnEquity?: number;          // Özsermaye Kârlılığı / ROE (%)

  // Corporate Profile
  ceo?: string;                     // Genel Müdür / CEO Adı
  fullTimeEmployees?: number;       // Toplam Çalışan Sayısı
  website?: string;                 // Resmi Web Sitesi URL
  city?: string;                    // Genel Merkez Şehri
}

export interface BasketHolding {
  id?: string;
  companySymbol: string;
  weightPercent: number;
  targetWeightPercent?: number;
  quantity: number;
  avgCost: number;
  currentPrice: number;
}

export interface Basket {
  id: string;
  name: string;
  subtitle: string;
  riskLevel: "Düşük" | "Orta" | "Yüksek";
  riskColor: "low" | "mid" | "high";
  totalValue: number;
  totalCost: number;
  dailyChange: number;
  totalProfitPercent: number;
  description: string;
  aiNote?: string;
  holdings: BasketHolding[];
}

export interface DividendItem {
  id: string;
  companySymbol: string;
  companyName: string;
  paymentDate: string;
  netAmountPerShare: number;
  yieldPercent: number;
  status: "Yaklaşıyor" | "Ödendi" | "Açıklandı" | "Portföyünüzde";
  totalEstimatedPayout?: number;
  ownedLots?: number;
}

export interface IpoItem {
  id: string;
  code: string;
  name: string;
  sector: string;
  status: "active" | "upcoming" | "listed";
  dateRange: string;
  endDate?: string;
  priceRange: string;
  distributionType?: string;
  leadManager?: string;
  lotAmount?: string;
  fundSize?: string;
  ceilingStreak?: number;
}

export interface NotificationItem {
  id: string;
  type: "signal" | "dividend" | "ipo" | "ai" | "price";
  title: string;
  message: string;
  time: string;
  read: boolean;
  relatedCompanySymbol?: string;
  relatedBasketId?: string;
}

export interface AiHistoryItem {
  id: string;
  date: string;
  type: "Sepet Önerisi" | "Anomali Tespiti" | "Şirket Değerleme" | "Haber Duygu Analizi" | "Reçete" | "Sohbet Analizi" | "Otonom Tarama" | "Bilanço Notu" | "Tuzak Taraması";
  title: string;
  description: string;
  verdictTag: string;
  symbol?: string;
  verdict?: "AL" | "SAT" | "TUT" | "GÜÇLÜ AL" | "GÜÇLÜ SAT" | "NÖTR" | "DENGELİ" | "YÜKSEK RİSK" | "FIRSAT";
  verdictDate?: string;
  priceAtVerdict?: number;
  budgetAtCreation?: number;
  bist100AtVerdict?: number;
  alpha?: number;
  confidence?: string;
  priceAfterPeriod?: number;
  outcomeCheckedAt?: string;
  outcomeCorrect?: boolean | null;
  targetPeriodDays?: number;
  provider?: string;
  model?: string;
}

// Otonom AI Tarayıcı Analiz Kartı
export interface AutonomousScan {
  id: string;
  symbol: string;
  companyName: string;
  sector: string;
  scannedAt: string; // ISO string
  verdict: "AL" | "SAT" | "TUT" | "GÜÇLÜ AL" | "GÜÇLÜ SAT" | "NÖTR";
  valuationScore: number; // 0-100
  priceAtScan: number;
  currency: string;
  peRatio?: number;
  dividendYield?: number;
  confidence: string; // "%85"
  bullThesis: string; // 1 cümle
  bearThesis: string; // 1 cümle
  targetPrice?: number;
  priceNow?: number; // filled when checking outcome
  returnPct?: number; // filled after period
  outcomeCorrect?: boolean | null;
  outcomeCheckedAt?: string;
  targetPeriodDays: number;
  provider: string;
  model: string;
}

// Otonom AI Model Portföy (AI'ın kendi başına kurduğu deneysel sepet)
export interface AiModelBasket {
  id: string;
  theme: string; // "Günün Büyüme Sepeti", "Günün Değer Avcısı", "Günün Temettü Kalesi"
  createdAt: string; // ISO string
  horizon: number; // gün cinsinden 30/60/90
  allocation: Array<{
    symbol: string;
    name: string;
    weight: number;
    priceAtCreation: number;
    priceNow?: number;
    returnPct?: number;
  }>;
  totalReturnPct?: number; // hesaplanan ortalama ağırlıklı getiri
  benchmarkReturnPct?: number; // aynı dönemde BIST-100'ün getirisi
  alpha?: number; // totalReturnPct - benchmarkReturnPct
  outcomeCheckedAt?: string;
  status: "active" | "completed" | "partial";
  provider: string;
  model: string;
  summary: string; // AI'ın 1-2 cümlelik strateji özeti
}


// ---------------- INITIAL SEED DATA ----------------

export const MOCK_COMPANIES: Company[] = [
  {
    "id": "a1cap",
    "symbol": "A1CAP",
    "name": "A1 Capital Yatırım",
    "sector": "Aracı Kurum & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.02,
    "currency": "₺",
    "dailyChange": -1.84,
    "peRatio": 2.7,
    "pbRatio": 1.4,
    "dividendYield": 2.6,
    "marketCap": "5.41 Mr ₺",
    "beta": 1.01,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "A1 Capital Yatırım (A1CAP), Borsa İstanbul'da Aracı Kurum & Finans sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 18.99,
    "low52": 8.02,
    "dayHigh": 8.26,
    "dayLow": 8.02,
    "openPrice": 8.21,
    "volume": 5989020,
    "avgVolume": 13096641,
    "volumeRatio": 0.46,
    "athDiscountPct": 57.8
  },
  {
    "id": "acsel",
    "symbol": "ACSEL",
    "name": "Acıselsan Selüloz",
    "sector": "Kimya & Malzeme",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 122.6,
    "currency": "₺",
    "dailyChange": 0.99,
    "peRatio": 0,
    "pbRatio": 0.8,
    "dividendYield": 6,
    "marketCap": "1.31 Mr ₺",
    "beta": 0.75,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Acıselsan Selüloz (ACSEL), Borsa İstanbul'da Kimya & Malzeme sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 185,
    "low52": 94.05,
    "dayHigh": 126,
    "dayLow": 121.9,
    "openPrice": 121.9,
    "volume": 148009,
    "avgVolume": 415038,
    "volumeRatio": 0.36,
    "athDiscountPct": 33.7
  },
  {
    "id": "adel",
    "symbol": "ADEL",
    "name": "Adel Kalemcilik",
    "sector": "Kırtasiye & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 33.14,
    "currency": "₺",
    "dailyChange": -2.13,
    "peRatio": 12.7,
    "pbRatio": 4.6,
    "dividendYield": 5.3,
    "marketCap": "8.61 Mr ₺",
    "beta": 1.13,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Adel Kalemcilik (ADEL), Borsa İstanbul'da Kırtasiye & Tüketim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 61.15,
    "low52": 28.4,
    "dayHigh": 34.74,
    "dayLow": 32.8,
    "openPrice": 33.86,
    "volume": 5945619,
    "avgVolume": 3146868,
    "volumeRatio": 1.89,
    "athDiscountPct": 45.8
  },
  {
    "id": "adese",
    "symbol": "ADESE",
    "name": "Adese Gayrimenkul",
    "sector": "Gayrimenkul & Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 0.86,
    "currency": "₺",
    "dailyChange": -1.15,
    "peRatio": 2.4,
    "pbRatio": 4.2,
    "dividendYield": 5.4,
    "marketCap": "4.33 Mr ₺",
    "beta": 1.29,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Adese Gayrimenkul (ADESE), Borsa İstanbul'da Gayrimenkul & Perakende sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.59,
    "low52": 0.83,
    "dayHigh": 0.89,
    "dayLow": 0.86,
    "openPrice": 0.87,
    "volume": 88750137,
    "avgVolume": 142449297,
    "volumeRatio": 0.62,
    "athDiscountPct": 81.3
  },
  {
    "id": "aghol",
    "symbol": "AGHOL",
    "name": "Anadolu Grubu Holding",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 31.14,
    "currency": "₺",
    "dailyChange": -2.44,
    "peRatio": 17.2,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "75.84 Mr ₺",
    "beta": 0.78,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Anadolu Grubu Holding (AGHOL), Borsa İstanbul'da Holding & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 37.78,
    "low52": 23.9,
    "dayHigh": 32.9,
    "dayLow": 31.14,
    "openPrice": 32.32,
    "volume": 7584766,
    "avgVolume": 4443456,
    "volumeRatio": 1.71,
    "athDiscountPct": 17.6
  },
  {
    "id": "agesa",
    "symbol": "AGESA",
    "name": "Agesa Hayat ve Emeklilik",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 237.5,
    "currency": "₺",
    "dailyChange": 0.21,
    "peRatio": 6.2,
    "pbRatio": 4.1,
    "dividendYield": 5.3,
    "marketCap": "42.75 Mr ₺",
    "beta": 1.28,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Agesa Hayat ve Emeklilik (AGESA), Borsa İstanbul'da Sigorta & Emeklilik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 264,
    "low52": 152.9,
    "dayHigh": 240,
    "dayLow": 234.2,
    "openPrice": 237,
    "volume": 340897,
    "avgVolume": 212674,
    "volumeRatio": 1.6,
    "athDiscountPct": 10
  },
  {
    "id": "agrot",
    "symbol": "AGROT",
    "name": "Agrotech Yüksek Teknoloji",
    "sector": "Teknoloji & Tarım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.36,
    "currency": "₺",
    "dailyChange": 0.85,
    "peRatio": 7.7,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "5.66 Mr ₺",
    "beta": 0.96,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Agrotech Yüksek Teknoloji (AGROT), Borsa İstanbul'da Teknoloji & Tarım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.38,
    "low52": 2.28,
    "dayHigh": 2.38,
    "dayLow": 2.34,
    "openPrice": 2.35,
    "volume": 9167690,
    "avgVolume": 26269594,
    "volumeRatio": 0.35,
    "athDiscountPct": 46.1
  },
  {
    "id": "ahgaz",
    "symbol": "AHGAZ",
    "name": "Ahlatcı Doğal Gaz",
    "sector": "Enerji & Dağıtım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 33.86,
    "currency": "₺",
    "dailyChange": -0.12,
    "peRatio": 25.1,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "85.83 Mr ₺",
    "beta": 0.78,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Ahlatcı Doğal Gaz (AHGAZ), Borsa İstanbul'da Enerji & Dağıtım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 40.36,
    "low52": 20.86,
    "dayHigh": 34.64,
    "dayLow": 33.08,
    "openPrice": 34.48,
    "volume": 7288847,
    "avgVolume": 5154704,
    "volumeRatio": 1.41,
    "athDiscountPct": 16.1
  },
  {
    "id": "akbnk",
    "symbol": "AKBNK",
    "name": "Akbank T.A.Ş.",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 68.8,
    "currency": "₺",
    "dailyChange": -0.36,
    "peRatio": 5.4,
    "pbRatio": 4.7,
    "dividendYield": 5.9,
    "marketCap": "357.76 Mr ₺",
    "beta": 1.34,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Akbank T.A.Ş. (AKBNK), Borsa İstanbul'da Bankacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 93.5,
    "low52": 53.05,
    "dayHigh": 69.65,
    "dayLow": 68.55,
    "openPrice": 69,
    "volume": 128800446,
    "avgVolume": 143359161,
    "volumeRatio": 0.9,
    "athDiscountPct": 26.4
  },
  {
    "id": "akcns",
    "symbol": "AKCNS",
    "name": "Akçansa Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 241.7,
    "currency": "₺",
    "dailyChange": -1.59,
    "peRatio": 86.3,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "46.27 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Akçansa Çimento (AKCNS), Borsa İstanbul'da Çimento & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 253.75,
    "low52": 121.8,
    "dayHigh": 246.4,
    "dayLow": 241.1,
    "openPrice": 246.4,
    "volume": 273063,
    "avgVolume": 671959,
    "volumeRatio": 0.41,
    "athDiscountPct": 4.7
  },
  {
    "id": "akenr",
    "symbol": "AKENR",
    "name": "Akenerji Elektrik",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11.12,
    "currency": "₺",
    "dailyChange": 9.99,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "8.11 Mr ₺",
    "beta": 0.84,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Akenerji Elektrik (AKENR), Borsa İstanbul'da Enerji Üretim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 15.53,
    "low52": 9.11,
    "dayHigh": 11.12,
    "dayLow": 10.34,
    "openPrice": 10.35,
    "volume": 7780000,
    "avgVolume": 16959206,
    "volumeRatio": 0.46,
    "athDiscountPct": 28.4
  },
  {
    "id": "akfgy",
    "symbol": "AKFGY",
    "name": "Akfen GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.61,
    "currency": "₺",
    "dailyChange": -1.14,
    "peRatio": 5.8,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "10.18 Mr ₺",
    "beta": 0.85,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Akfen GYO (AKFGY), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.19,
    "low52": 2.4,
    "dayHigh": 2.66,
    "dayLow": 2.59,
    "openPrice": 2.64,
    "volume": 23005166,
    "avgVolume": 18031496,
    "volumeRatio": 1.28,
    "athDiscountPct": 18.2
  },
  {
    "id": "akfye",
    "symbol": "AKFYE",
    "name": "Akfen Yenilenebilir Enerji",
    "sector": "Yenilenebilir Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 23.06,
    "currency": "₺",
    "dailyChange": -1.62,
    "peRatio": 20.2,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "27.28 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Akfen Yenilenebilir Enerji (AKFYE), Borsa İstanbul'da Yenilenebilir Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 29.34,
    "low52": 16.23,
    "dayHigh": 24.1,
    "dayLow": 23.02,
    "openPrice": 23.46,
    "volume": 7110286,
    "avgVolume": 10436331,
    "volumeRatio": 0.68,
    "athDiscountPct": 21.4
  },
  {
    "id": "akgrt",
    "symbol": "AKGRT",
    "name": "Aksigorta",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.4,
    "currency": "₺",
    "dailyChange": 1.11,
    "peRatio": 4.5,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "10.32 Mr ₺",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Aksigorta (AKGRT), Borsa İstanbul'da Sigorta & Emeklilik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.71,
    "low52": 5.92,
    "dayHigh": 6.41,
    "dayLow": 6.32,
    "openPrice": 6.33,
    "volume": 6918081,
    "avgVolume": 9587482,
    "volumeRatio": 0.72,
    "athDiscountPct": 26.5
  },
  {
    "id": "akmgy",
    "symbol": "AKMGY",
    "name": "Akmerkez GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 275,
    "currency": "₺",
    "dailyChange": 6.49,
    "peRatio": 16.5,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "10.25 Mr ₺",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Akmerkez GYO (AKMGY), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 345,
    "low52": 188,
    "dayHigh": 275,
    "dayLow": 254,
    "openPrice": 257.75,
    "volume": 124871,
    "avgVolume": 43146,
    "volumeRatio": 2.89,
    "athDiscountPct": 20.3
  },
  {
    "id": "aksa",
    "symbol": "AKSA",
    "name": "Aksa Akrilik Kimya",
    "sector": "Kimya & Elyaf",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11.74,
    "currency": "₺",
    "dailyChange": -4.48,
    "peRatio": 10.5,
    "pbRatio": 1.6,
    "dividendYield": 6.3,
    "marketCap": "45.61 Mr ₺",
    "beta": 1.23,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Aksa Akrilik Kimya (AKSA), Borsa İstanbul'da Kimya & Elyaf sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 13.28,
    "low52": 9.26,
    "dayHigh": 12.09,
    "dayLow": 11.72,
    "openPrice": 12.07,
    "volume": 48267691,
    "avgVolume": 25512899,
    "volumeRatio": 1.89,
    "athDiscountPct": 11.6
  },
  {
    "id": "aksen",
    "symbol": "AKSEN",
    "name": "Aksa Enerji",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 86.25,
    "currency": "₺",
    "dailyChange": 2.92,
    "peRatio": 14.4,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "105.77 Mr ₺",
    "beta": 0.85,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Aksa Enerji (AKSEN), Borsa İstanbul'da Enerji Üretim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 117.5,
    "low52": 35.36,
    "dayHigh": 86.4,
    "dayLow": 82,
    "openPrice": 82.4,
    "volume": 11449860,
    "avgVolume": 9679817,
    "volumeRatio": 1.18,
    "athDiscountPct": 26.6
  },
  {
    "id": "aksue",
    "symbol": "AKSUE",
    "name": "Aksu Enerji",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 45.82,
    "currency": "₺",
    "dailyChange": -2.09,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "3.02 Mr ₺",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Aksu Enerji (AKSUE), Borsa İstanbul'da Enerji Üretim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 51.5,
    "low52": 14.88,
    "dayHigh": 46.84,
    "dayLow": 44.84,
    "openPrice": 46.74,
    "volume": 1782576,
    "avgVolume": 2426446,
    "volumeRatio": 0.73,
    "athDiscountPct": 11
  },
  {
    "id": "alark",
    "symbol": "ALARK",
    "name": "Alarko Holding",
    "sector": "Holding & Tarım / Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 103.4,
    "currency": "₺",
    "dailyChange": 0.88,
    "peRatio": 24.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "44.93 Mr ₺",
    "beta": 0.78,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Alarko Holding (ALARK), Borsa İstanbul'da Holding & Tarım / Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 117,
    "low52": 75.3,
    "dayHigh": 105,
    "dayLow": 102.4,
    "openPrice": 102.4,
    "volume": 2504748,
    "avgVolume": 4588250,
    "volumeRatio": 0.55,
    "athDiscountPct": 11.6
  },
  {
    "id": "albrk",
    "symbol": "ALBRK",
    "name": "Albaraka Türk Katılım",
    "sector": "Katılım Bankacılığı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.26,
    "currency": "₺",
    "dailyChange": 0.24,
    "peRatio": 2.2,
    "pbRatio": 1.2,
    "dividendYield": 6.4,
    "marketCap": "20.65 Mr ₺",
    "beta": 0.79,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Albaraka Türk Katılım (ALBRK), Borsa İstanbul'da Katılım Bankacılığı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 10.54,
    "low52": 7.42,
    "dayHigh": 8.33,
    "dayLow": 8.19,
    "openPrice": 8.25,
    "volume": 11594490,
    "avgVolume": 18232983,
    "volumeRatio": 0.64,
    "athDiscountPct": 21.6
  },
  {
    "id": "alcar",
    "symbol": "ALCAR",
    "name": "Alarko Carrier",
    "sector": "İklimlendirme & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 716,
    "currency": "₺",
    "dailyChange": 0.42,
    "peRatio": 17.7,
    "pbRatio": 4.3,
    "dividendYield": 5.5,
    "marketCap": "7.73 Mr ₺",
    "beta": 1.3,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Alarko Carrier (ALCAR), Borsa İstanbul'da İklimlendirme & Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 1064,
    "low52": 678,
    "dayHigh": 725.5,
    "dayLow": 710,
    "openPrice": 717,
    "volume": 38161,
    "avgVolume": 63134,
    "volumeRatio": 0.6,
    "athDiscountPct": 32.7
  },
  {
    "id": "alctl",
    "symbol": "ALCTL",
    "name": "Alcatel Lucent Teletaş",
    "sector": "Telekomünikasyon & Donanım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 127.3,
    "currency": "₺",
    "dailyChange": -7.42,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "4.93 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Alcatel Lucent Teletaş (ALCTL), Borsa İstanbul'da Telekomünikasyon & Donanım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 183,
    "low52": 102.4,
    "dayHigh": 138.7,
    "dayLow": 126.2,
    "openPrice": 137.5,
    "volume": 969515,
    "avgVolume": 541450,
    "volumeRatio": 1.79,
    "athDiscountPct": 30.4
  },
  {
    "id": "algyo",
    "symbol": "ALGYO",
    "name": "Alarko GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.67,
    "currency": "₺",
    "dailyChange": 7,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "7.44 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Alarko GYO (ALGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.35,
    "low52": 2.83,
    "dayHigh": 3.71,
    "dayLow": 3.45,
    "openPrice": 3.45,
    "volume": 67156075,
    "avgVolume": 72498922,
    "volumeRatio": 0.93,
    "athDiscountPct": 56
  },
  {
    "id": "alka",
    "symbol": "ALKA",
    "name": "Alkim Kağıt",
    "sector": "Kağıt & Ambalaj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.13,
    "currency": "₺",
    "dailyChange": -0.61,
    "peRatio": 15.7,
    "pbRatio": 0.9,
    "dividendYield": 5.6,
    "marketCap": "5.98 Mr ₺",
    "beta": 1.16,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Alkim Kağıt (ALKA), Borsa İstanbul'da Kağıt & Ambalaj sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 17.1,
    "low52": 7.52,
    "dayHigh": 8.29,
    "dayLow": 8.11,
    "openPrice": 8.17,
    "volume": 2970801,
    "avgVolume": 3384215,
    "volumeRatio": 0.88,
    "athDiscountPct": 52.5
  },
  {
    "id": "alkim",
    "symbol": "ALKIM",
    "name": "Alkim Kimya",
    "sector": "Kimya & Maden",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 15.71,
    "currency": "₺",
    "dailyChange": 2.28,
    "peRatio": 10.7,
    "pbRatio": 1.4,
    "dividendYield": 6.6,
    "marketCap": "4.71 Mr ₺",
    "beta": 0.81,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Alkim Kimya (ALKIM), Borsa İstanbul'da Kimya & Maden sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 25.34,
    "low52": 15.16,
    "dayHigh": 15.87,
    "dayLow": 15.36,
    "openPrice": 15.36,
    "volume": 1027131,
    "avgVolume": 2262304,
    "volumeRatio": 0.45,
    "athDiscountPct": 38
  },
  {
    "id": "almad",
    "symbol": "ALMAD",
    "name": "Altınyağ Madencilik",
    "sector": "Madencilik & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 366.81,
    "currency": "₺",
    "dailyChange": 4.1,
    "peRatio": 13.7,
    "pbRatio": 3.9,
    "dividendYield": 5.1,
    "marketCap": "356 Mr ₺",
    "beta": 1.26,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Altınyağ Madencilik (ALMAD), Borsa İstanbul'da Madencilik & Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.9",
        "peerAvg": "1.80"
      }
    ]
  },
  {
    "id": "altny",
    "symbol": "ALTNY",
    "name": "Altınay Savunma Teknolojileri",
    "sector": "Savunma & Robotik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 16.77,
    "currency": "₺",
    "dailyChange": -0.71,
    "peRatio": 559,
    "pbRatio": 4,
    "dividendYield": 1.7,
    "marketCap": "16.77 Mr ₺",
    "beta": 1.07,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Altınay Savunma Teknolojileri (ALTNY), Borsa İstanbul'da Savunma & Robotik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 20.96,
    "low52": 14.21,
    "dayHigh": 17.12,
    "dayLow": 16.63,
    "openPrice": 16.9,
    "volume": 12302672,
    "avgVolume": 22923226,
    "volumeRatio": 0.54,
    "athDiscountPct": 20
  },
  {
    "id": "alves",
    "symbol": "ALVES",
    "name": "Alves Kablo Sanayi",
    "sector": "Elektrik & Kablo",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.75,
    "currency": "₺",
    "dailyChange": -1.69,
    "peRatio": 29.2,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "2.80 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Alves Kablo Sanayi (ALVES), Borsa İstanbul'da Elektrik & Kablo sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.68,
    "low52": 1.7,
    "dayHigh": 1.81,
    "dayLow": 1.74,
    "openPrice": 1.79,
    "volume": 80189086,
    "avgVolume": 97794213,
    "volumeRatio": 0.82,
    "athDiscountPct": 62.6
  },
  {
    "id": "anele",
    "symbol": "ANELE",
    "name": "Anel Elektrik",
    "sector": "Elektrik & Mühendislik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 138.8,
    "currency": "₺",
    "dailyChange": 0.65,
    "peRatio": 19.7,
    "pbRatio": 4.5,
    "dividendYield": 5.7,
    "marketCap": "36.78 Mr ₺",
    "beta": 1.32,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Anel Elektrik (ANELE), Borsa İstanbul'da Elektrik & Mühendislik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 140.8,
    "low52": 13.32,
    "dayHigh": 139.5,
    "dayLow": 134,
    "openPrice": 137.9,
    "volume": 1771361,
    "avgVolume": 5116910,
    "volumeRatio": 0.35,
    "athDiscountPct": 1.4
  },
  {
    "id": "angen",
    "symbol": "ANGEN",
    "name": "Anatolia Tanı ve Biyoteknoloji",
    "sector": "Sağlık & Biyoteknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 9.1,
    "currency": "₺",
    "dailyChange": 0.11,
    "peRatio": 5.7,
    "pbRatio": 0.9,
    "dividendYield": 6.1,
    "marketCap": "2.00 Mr ₺",
    "beta": 0.76,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Anatolia Tanı ve Biyoteknoloji (ANGEN), Borsa İstanbul'da Sağlık & Biyoteknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 16,
    "low52": 8.94,
    "dayHigh": 9.22,
    "dayLow": 9.04,
    "openPrice": 9.1,
    "volume": 1629145,
    "avgVolume": 5801856,
    "volumeRatio": 0.28,
    "athDiscountPct": 43.1
  },
  {
    "id": "anhyt",
    "symbol": "ANHYT",
    "name": "Anadolu Hayat Emeklilik",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 107.2,
    "currency": "₺",
    "dailyChange": -1.74,
    "peRatio": 6.5,
    "pbRatio": 3.6,
    "dividendYield": 1.3,
    "marketCap": "46.10 Mr ₺",
    "beta": 1.03,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Anadolu Hayat Emeklilik (ANHYT), Borsa İstanbul'da Sigorta & Emeklilik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 125.7,
    "low52": 78.65,
    "dayHigh": 110,
    "dayLow": 106.3,
    "openPrice": 109.3,
    "volume": 1077262,
    "avgVolume": 1023919,
    "volumeRatio": 1.05,
    "athDiscountPct": 14.7
  },
  {
    "id": "ansgr",
    "symbol": "ANSGR",
    "name": "Anadolu Anonim Türk Sigorta",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 28.68,
    "currency": "₺",
    "dailyChange": -0.42,
    "peRatio": 3.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "57.36 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Anadolu Anonim Türk Sigorta (ANSGR), Borsa İstanbul'da Sigorta & Emeklilik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 31.52,
    "low52": 20.28,
    "dayHigh": 28.96,
    "dayLow": 28.46,
    "openPrice": 28.84,
    "volume": 4208922,
    "avgVolume": 4587424,
    "volumeRatio": 0.92,
    "athDiscountPct": 9
  },
  {
    "id": "arclk",
    "symbol": "ARCLK",
    "name": "Arçelik (Beko Europe)",
    "sector": "Dayanıklı Tüketim & Beyaz Eşya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 95.35,
    "currency": "₺",
    "dailyChange": 0.74,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "62.56 Mr ₺",
    "beta": 0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Arçelik (Beko Europe) (ARCLK), Borsa İstanbul'da Dayanıklı Tüketim & Beyaz Eşya sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 147.5,
    "low52": 94.45,
    "dayHigh": 95.35,
    "dayLow": 94.45,
    "openPrice": 94.5,
    "volume": 1125246,
    "avgVolume": 1686092,
    "volumeRatio": 0.67,
    "athDiscountPct": 35.4
  },
  {
    "id": "ardyz",
    "symbol": "ARDYZ",
    "name": "ARD Bilişim Teknolojileri",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 83.3,
    "currency": "₺",
    "dailyChange": 0.42,
    "peRatio": 45.8,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "25.87 Mr ₺",
    "beta": 1.09,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ARD Bilişim Teknolojileri (ARDYZ), Borsa İstanbul'da Savunma & Yüksek Teknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 85,
    "low52": 24.42,
    "dayHigh": 84.15,
    "dayLow": 80.9,
    "openPrice": 82,
    "volume": 3487091,
    "avgVolume": 4945382,
    "volumeRatio": 0.71,
    "athDiscountPct": 2
  },
  {
    "id": "arena",
    "symbol": "ARENA",
    "name": "Arena Bilgisayar",
    "sector": "Bilişim & Donanım Dağıtım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 21.24,
    "currency": "₺",
    "dailyChange": 2.71,
    "peRatio": 21.7,
    "pbRatio": 4.7,
    "dividendYield": 5.9,
    "marketCap": "2.12 Mr ₺",
    "beta": 1.34,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Arena Bilgisayar (ARENA), Borsa İstanbul'da Bilişim & Donanım Dağıtım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 45,
    "low52": 19.95,
    "dayHigh": 21.64,
    "dayLow": 20.6,
    "openPrice": 20.6,
    "volume": 1857526,
    "avgVolume": 2092065,
    "volumeRatio": 0.89,
    "athDiscountPct": 52.8
  },
  {
    "id": "arsan",
    "symbol": "ARSAN",
    "name": "Arsan Tekstil",
    "sector": "Tekstil & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.47,
    "currency": "₺",
    "dailyChange": 3.89,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "6.11 Mr ₺",
    "beta": 0.88,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Arsan Tekstil (ARSAN), Borsa İstanbul'da Tekstil & Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.96,
    "low52": 2.56,
    "dayHigh": 3.51,
    "dayLow": 3.35,
    "openPrice": 3.36,
    "volume": 14753427,
    "avgVolume": 19200001,
    "volumeRatio": 0.77,
    "athDiscountPct": 30
  },
  {
    "id": "artms",
    "symbol": "ARTMS",
    "name": "Artemis Halı",
    "sector": "Tekstil & Ev Eşyası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 36.86,
    "currency": "₺",
    "dailyChange": 1.49,
    "peRatio": 40.5,
    "pbRatio": 3.9,
    "dividendYield": 1.6,
    "marketCap": "2.58 Mr ₺",
    "beta": 1.06,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Artemis Halı (ARTMS), Borsa İstanbul'da Tekstil & Ev Eşyası sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 58,
    "low52": 32.8,
    "dayHigh": 37,
    "dayLow": 36.32,
    "openPrice": 36.58,
    "volume": 558856,
    "avgVolume": 2052603,
    "volumeRatio": 0.27,
    "athDiscountPct": 36.4
  },
  {
    "id": "arzum",
    "symbol": "ARZUM",
    "name": "Arzum Elektrikli Ev Aletleri",
    "sector": "Küçük Ev Aletleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.7,
    "currency": "₺",
    "dailyChange": 4.94,
    "peRatio": 7.7,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "1.02 Mr ₺",
    "beta": 1.14,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Arzum Elektrikli Ev Aletleri (ARZUM), Borsa İstanbul'da Küçük Ev Aletleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 5.55,
    "low52": 1.54,
    "dayHigh": 1.78,
    "dayLow": 1.61,
    "openPrice": 1.61,
    "volume": 55308529,
    "avgVolume": 19726781,
    "volumeRatio": 2.8,
    "athDiscountPct": 69.4
  },
  {
    "id": "asels",
    "symbol": "ASELS",
    "name": "Aselsan Elektronik Sanayi",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 387.5,
    "currency": "₺",
    "dailyChange": -2.08,
    "peRatio": 49.2,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "1767.00 Mr ₺",
    "beta": 0.91,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "Aselsan Elektronik Sanayi (ASELS), Borsa İstanbul'da Savunma & Yüksek Teknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 450,
    "low52": 167,
    "dayHigh": 407.5,
    "dayLow": 387.5,
    "openPrice": 398.25,
    "volume": 54376880,
    "avgVolume": 33936496,
    "volumeRatio": 1.6,
    "athDiscountPct": 13.9
  },
  {
    "id": "asgyo",
    "symbol": "ASGYO",
    "name": "Asce Gayrimenkul Yatırım",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11.07,
    "currency": "₺",
    "dailyChange": -0.54,
    "peRatio": 1.3,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "7.30 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Asce Gayrimenkul Yatırım (ASGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14.26,
    "low52": 10.35,
    "dayHigh": 11.18,
    "dayLow": 11.02,
    "openPrice": 11.14,
    "volume": 2568414,
    "avgVolume": 5085313,
    "volumeRatio": 0.51,
    "athDiscountPct": 22.4
  },
  {
    "id": "astor",
    "symbol": "ASTOR",
    "name": "Astor Enerji A.Ş.",
    "sector": "Elektromekanik & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 342.25,
    "currency": "₺",
    "dailyChange": -0.94,
    "peRatio": 41.1,
    "pbRatio": 4.1,
    "dividendYield": 1.8,
    "marketCap": "341.57 Mr ₺",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Astor Enerji A.Ş. (ASTOR), Borsa İstanbul'da Elektromekanik & Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 385.75,
    "low52": 88.2,
    "dayHigh": 348.75,
    "dayLow": 336.25,
    "openPrice": 346.75,
    "volume": 29176644,
    "avgVolume": 32784304,
    "volumeRatio": 0.89,
    "athDiscountPct": 11.3
  },
  {
    "id": "asuzu",
    "symbol": "ASUZU",
    "name": "Anadolu Isuzu Otomotiv",
    "sector": "Otomotiv & Ticari Araç",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 47.02,
    "currency": "₺",
    "dailyChange": 0.13,
    "peRatio": 16.7,
    "pbRatio": 1.6,
    "dividendYield": 3.3,
    "marketCap": "11.85 Mr ₺",
    "beta": 1.23,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Anadolu Isuzu Otomotiv (ASUZU), Borsa İstanbul'da Otomotiv & Ticari Araç sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 75.4,
    "low52": 46.9,
    "dayHigh": 47.36,
    "dayLow": 46.96,
    "openPrice": 46.96,
    "volume": 396143,
    "avgVolume": 540621,
    "volumeRatio": 0.73,
    "athDiscountPct": 37.6
  },
  {
    "id": "atakp",
    "symbol": "ATAKP",
    "name": "Atakey Patates Gıda",
    "sector": "Gıda & Tarım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 44.7,
    "currency": "₺",
    "dailyChange": -1.54,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "6.20 Mr ₺",
    "beta": 0.84,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Atakey Patates Gıda (ATAKP), Borsa İstanbul'da Gıda & Tarım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 64.8,
    "low52": 44.62,
    "dayHigh": 45.8,
    "dayLow": 44.7,
    "openPrice": 45.56,
    "volume": 319256,
    "avgVolume": 554089,
    "volumeRatio": 0.58,
    "athDiscountPct": 31
  },
  {
    "id": "atatp",
    "symbol": "ATATP",
    "name": "ATP Yazılım ve Teknoloji",
    "sector": "Yazılım & Fintek",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 283.75,
    "currency": "₺",
    "dailyChange": 7.58,
    "peRatio": 11.4,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "6.47 Mr ₺",
    "beta": 0.93,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "ATP Yazılım ve Teknoloji (ATATP), Borsa İstanbul'da Yazılım & Fintek sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 289.5,
    "low52": 107.2,
    "dayHigh": 289.5,
    "dayLow": 247.5,
    "openPrice": 262.75,
    "volume": 4199191,
    "avgVolume": 1806658,
    "volumeRatio": 2.32,
    "athDiscountPct": 2
  },
  {
    "id": "avpgy",
    "symbol": "AVPGY",
    "name": "Avrupakent GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 51.4,
    "currency": "₺",
    "dailyChange": 0.88,
    "peRatio": 20,
    "pbRatio": 3.9,
    "dividendYield": 1.6,
    "marketCap": "20.56 Mr ₺",
    "beta": 1.06,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Avrupakent GYO (AVPGY), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 69.9,
    "low52": 45.84,
    "dayHigh": 51.95,
    "dayLow": 50.45,
    "openPrice": 50.95,
    "volume": 637619,
    "avgVolume": 739611,
    "volumeRatio": 0.86,
    "athDiscountPct": 26.5
  },
  {
    "id": "ayces",
    "symbol": "AYCES",
    "name": "Altın Yunus Çeşme",
    "sector": "Turizm & Otelcilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 495,
    "currency": "₺",
    "dailyChange": 7.55,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "12.38 Mr ₺",
    "beta": 0.88,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Altın Yunus Çeşme (AYCES), Borsa İstanbul'da Turizm & Otelcilik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 1327,
    "low52": 392,
    "dayHigh": 503.5,
    "dayLow": 459.25,
    "openPrice": 461.75,
    "volume": 663301,
    "avgVolume": 221788,
    "volumeRatio": 2.99,
    "athDiscountPct": 62.7
  },
  {
    "id": "aydem",
    "symbol": "AYDEM",
    "name": "Aydem Yenilenebilir Enerji",
    "sector": "Yenilenebilir Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 25.2,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "17.77 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Aydem Yenilenebilir Enerji (AYDEM), Borsa İstanbul'da Yenilenebilir Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 33.2,
    "low52": 16.99,
    "dayHigh": 27,
    "dayLow": 24.88,
    "openPrice": 26.58,
    "volume": 14709660,
    "avgVolume": 2432511,
    "volumeRatio": 6.05,
    "athDiscountPct": 24.1
  },
  {
    "id": "ayen",
    "symbol": "AYEN",
    "name": "Ayen Enerji",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 33.42,
    "currency": "₺",
    "dailyChange": 0.72,
    "peRatio": 40.3,
    "pbRatio": 2.9,
    "dividendYield": 0.1,
    "marketCap": "9.27 Mr ₺",
    "beta": 0.76,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ayen Enerji (AYEN), Borsa İstanbul'da Enerji Üretim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 45.8,
    "low52": 24.1,
    "dayHigh": 33.8,
    "dayLow": 33.1,
    "openPrice": 33.8,
    "volume": 471322,
    "avgVolume": 2255840,
    "volumeRatio": 0.21,
    "athDiscountPct": 27
  },
  {
    "id": "aygaz",
    "symbol": "AYGAZ",
    "name": "Aygaz A.Ş.",
    "sector": "LPG & Dağıtım / Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 312,
    "currency": "₺",
    "dailyChange": 7.12,
    "peRatio": 13.3,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "68.58 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Aygaz A.Ş. (AYGAZ), Borsa İstanbul'da LPG & Dağıtım / Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 313.75,
    "low52": 153.1,
    "dayHigh": 313.75,
    "dayLow": 291.5,
    "openPrice": 292,
    "volume": 1951277,
    "avgVolume": 1022283,
    "volumeRatio": 1.91,
    "athDiscountPct": 0.6
  },
  {
    "id": "aztek",
    "symbol": "AZTEK",
    "name": "Aztek Teknoloji Ürünleri",
    "sector": "Tüketici Elektroniği",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 4.66,
    "currency": "₺",
    "dailyChange": -1.48,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "4.66 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Aztek Teknoloji Ürünleri (AZTEK), Borsa İstanbul'da Tüketici Elektroniği sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 6.54,
    "low52": 3.76,
    "dayHigh": 4.84,
    "dayLow": 4.64,
    "openPrice": 4.82,
    "volume": 7138295,
    "avgVolume": 14315194,
    "volumeRatio": 0.5,
    "athDiscountPct": 28.7
  },
  {
    "id": "bagfs",
    "symbol": "BAGFS",
    "name": "Bağfaş Bandırma Gübre",
    "sector": "Kimya & Gübre",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 24.84,
    "currency": "₺",
    "dailyChange": 3.5,
    "peRatio": 17.7,
    "pbRatio": 4.3,
    "dividendYield": 5.5,
    "marketCap": "3.35 Mr ₺",
    "beta": 1.3,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Bağfaş Bandırma Gübre (BAGFS), Borsa İstanbul'da Kimya & Gübre sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 41.78,
    "low52": 22.92,
    "dayHigh": 24.92,
    "dayLow": 23.88,
    "openPrice": 23.88,
    "volume": 1002459,
    "avgVolume": 1038483,
    "volumeRatio": 0.97,
    "athDiscountPct": 40.5
  },
  {
    "id": "bahkm",
    "symbol": "BAHKM",
    "name": "Bahadır Kimya",
    "sector": "Kimya & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 120.9,
    "currency": "₺",
    "dailyChange": 0.92,
    "peRatio": 17.7,
    "pbRatio": 4.3,
    "dividendYield": 5.5,
    "marketCap": "6.65 Mr ₺",
    "beta": 1.3,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Bahadır Kimya (BAHKM), Borsa İstanbul'da Kimya & Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 151.9,
    "low52": 46.74,
    "dayHigh": 121.5,
    "dayLow": 118.9,
    "openPrice": 120,
    "volume": 311798,
    "avgVolume": 520001,
    "volumeRatio": 0.6,
    "athDiscountPct": 20.4
  },
  {
    "id": "bakab",
    "symbol": "BAKAB",
    "name": "Bak Ambalaj Sanayi",
    "sector": "Ambalaj & Plastik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 45.34,
    "currency": "₺",
    "dailyChange": 0.44,
    "peRatio": 17.7,
    "pbRatio": 2.5,
    "dividendYield": 3.7,
    "marketCap": "3.26 Mr ₺",
    "beta": 1.12,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Bak Ambalaj Sanayi (BAKAB), Borsa İstanbul'da Ambalaj & Plastik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 59.25,
    "low52": 35.04,
    "dayHigh": 45.5,
    "dayLow": 44.5,
    "openPrice": 44.5,
    "volume": 118290,
    "avgVolume": 743541,
    "volumeRatio": 0.16,
    "athDiscountPct": 23.5
  },
  {
    "id": "banvt",
    "symbol": "BANVT",
    "name": "Banvit Bandırma Vitaminli Yem",
    "sector": "Gıda & Tavukçuluk",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 158.2,
    "currency": "₺",
    "dailyChange": -0.75,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "15.82 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Banvit Bandırma Vitaminli Yem (BANVT), Borsa İstanbul'da Gıda & Tavukçuluk sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 222.6,
    "low52": 144.6,
    "dayHigh": 159.9,
    "dayLow": 157.3,
    "openPrice": 159.4,
    "volume": 56705,
    "avgVolume": 342301,
    "volumeRatio": 0.17,
    "athDiscountPct": 28.9
  },
  {
    "id": "barma",
    "symbol": "BARMA",
    "name": "Barem Ambalaj",
    "sector": "Kağıt & Ambalaj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.72,
    "currency": "₺",
    "dailyChange": -9.99,
    "peRatio": 12.9,
    "pbRatio": 4.3,
    "dividendYield": 5.5,
    "marketCap": "2.81 Mr ₺",
    "beta": 1.3,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Barem Ambalaj (BARMA), Borsa İstanbul'da Kağıt & Ambalaj sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 82,
    "low52": 9.75,
    "dayHigh": 11.21,
    "dayLow": 10.72,
    "openPrice": 11.21,
    "volume": 5209223,
    "avgVolume": 3076345,
    "volumeRatio": 1.69,
    "athDiscountPct": 86.9
  },
  {
    "id": "basgz",
    "symbol": "BASGZ",
    "name": "Başkent Doğalgaz Dağıtım",
    "sector": "Enerji & Doğalgaz",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 42.96,
    "currency": "₺",
    "dailyChange": -0.19,
    "peRatio": 16,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "30.07 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Başkent Doğalgaz Dağıtım (BASGZ), Borsa İstanbul'da Enerji & Doğalgaz sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 53.75,
    "low52": 31.3,
    "dayHigh": 43.3,
    "dayLow": 42.96,
    "openPrice": 43.3,
    "volume": 157709,
    "avgVolume": 371859,
    "volumeRatio": 0.42,
    "athDiscountPct": 20.1
  },
  {
    "id": "bayrk",
    "symbol": "BAYRK",
    "name": "Bayrak Ebt Taban",
    "sector": "Ayakkabı & Malzeme",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 4.32,
    "currency": "₺",
    "dailyChange": 2.13,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "1.08 Mr ₺",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bayrak Ebt Taban (BAYRK), Borsa İstanbul'da Ayakkabı & Malzeme sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 9.33,
    "low52": 4.04,
    "dayHigh": 4.32,
    "dayLow": 4.23,
    "openPrice": 4.23,
    "volume": 5243235,
    "avgVolume": 14196961,
    "volumeRatio": 0.37,
    "athDiscountPct": 53.7
  },
  {
    "id": "begyo",
    "symbol": "BEGYO",
    "name": "Batı Ege GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.56,
    "currency": "₺",
    "dailyChange": 1.42,
    "peRatio": 18.7,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "2.90 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Batı Ege GYO (BEGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 13.23,
    "low52": 3.37,
    "dayHigh": 3.58,
    "dayLow": 3.51,
    "openPrice": 3.51,
    "volume": 3253959,
    "avgVolume": 5944309,
    "volumeRatio": 0.55,
    "athDiscountPct": 73.1
  },
  {
    "id": "bera",
    "symbol": "BERA",
    "name": "Bera Holding",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 13.48,
    "currency": "₺",
    "dailyChange": 1.58,
    "peRatio": 16.7,
    "pbRatio": 1,
    "dividendYield": 5.7,
    "marketCap": "9.21 Mr ₺",
    "beta": 1.17,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bera Holding (BERA), Borsa İstanbul'da Holding & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 23.1,
    "low52": 12.48,
    "dayHigh": 13.9,
    "dayLow": 13.17,
    "openPrice": 13.27,
    "volume": 12576611,
    "avgVolume": 10060727,
    "volumeRatio": 1.25,
    "athDiscountPct": 41.6
  },
  {
    "id": "beyaz",
    "symbol": "BEYAZ",
    "name": "Beyaz Filo Oto Kiralama",
    "sector": "Otomotiv & Filo Kiralama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 23.5,
    "currency": "₺",
    "dailyChange": -1.01,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "2.34 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Beyaz Filo Oto Kiralama (BEYAZ), Borsa İstanbul'da Otomotiv & Filo Kiralama sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 44,
    "low52": 23,
    "dayHigh": 24.1,
    "dayLow": 23.44,
    "openPrice": 24.1,
    "volume": 503912,
    "avgVolume": 906273,
    "volumeRatio": 0.56,
    "athDiscountPct": 46.6
  },
  {
    "id": "bfren",
    "symbol": "BFREN",
    "name": "Bosch Fren Sistemleri",
    "sector": "Otomotiv Yan Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 130.6,
    "currency": "₺",
    "dailyChange": -0.15,
    "peRatio": 108.8,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "16.00 Mr ₺",
    "beta": 0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bosch Fren Sistemleri (BFREN), Borsa İstanbul'da Otomotiv Yan Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 227.2,
    "low52": 122.2,
    "dayHigh": 132.7,
    "dayLow": 130.6,
    "openPrice": 131,
    "volume": 151667,
    "avgVolume": 253379,
    "volumeRatio": 0.6,
    "athDiscountPct": 42.5
  },
  {
    "id": "bieny",
    "symbol": "BIENY",
    "name": "Bien Yapı Ürünleri",
    "sector": "Seramik & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 20.8,
    "currency": "₺",
    "dailyChange": 1.17,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "7.51 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bien Yapı Ürünleri (BIENY), Borsa İstanbul'da Seramik & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 51.1,
    "low52": 19.62,
    "dayHigh": 21.1,
    "dayLow": 20.2,
    "openPrice": 20.56,
    "volume": 3427051,
    "avgVolume": 2760402,
    "volumeRatio": 1.24,
    "athDiscountPct": 59.3
  },
  {
    "id": "bigch",
    "symbol": "BIGCH",
    "name": "Big Chefs Gıda Restoran",
    "sector": "Restoran & Hizmet",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.14,
    "currency": "₺",
    "dailyChange": -1.13,
    "peRatio": 153.5,
    "pbRatio": 3.7,
    "dividendYield": 4.9,
    "marketCap": "3.28 Mr ₺",
    "beta": 1.24,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Big Chefs Gıda Restoran (BIGCH), Borsa İstanbul'da Restoran & Hizmet sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 15,
    "low52": 5.73,
    "dayHigh": 6.3,
    "dayLow": 6.12,
    "openPrice": 6.22,
    "volume": 3670725,
    "avgVolume": 9662147,
    "volumeRatio": 0.38,
    "athDiscountPct": 59.1
  },
  {
    "id": "bimas",
    "symbol": "BIMAS",
    "name": "BİM Birleşik Mağazalar",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 374.75,
    "currency": "₺",
    "dailyChange": -0.46,
    "peRatio": 20.8,
    "pbRatio": 1.2,
    "dividendYield": 6.4,
    "marketCap": "444.37 Mr ₺",
    "beta": 0.79,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "BİM Birleşik Mağazalar (BIMAS), Borsa İstanbul'da Perakende & Tüketim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 425,
    "low52": 241.63,
    "dayHigh": 378.5,
    "dayLow": 374.25,
    "openPrice": 377,
    "volume": 8746367,
    "avgVolume": 10291309,
    "volumeRatio": 0.85,
    "athDiscountPct": 11.8
  },
  {
    "id": "binho",
    "symbol": "BINHO",
    "name": "1000 Yatırımlar Holding (BinBin)",
    "sector": "Ulaşım & Mikromobilite",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.03,
    "currency": "₺",
    "dailyChange": 0.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "12.94 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "1000 Yatırımlar Holding (BinBin) (BINHO), Borsa İstanbul'da Ulaşım & Mikromobilite sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14.01,
    "low52": 7.98,
    "dayHigh": 10.33,
    "dayLow": 9.96,
    "openPrice": 10.02,
    "volume": 20281189,
    "avgVolume": 34222220,
    "volumeRatio": 0.59,
    "athDiscountPct": 28.4
  },
  {
    "id": "bioen",
    "symbol": "BIOEN",
    "name": "Biotrend Çevre ve Enerji",
    "sector": "Biyokütle & Yenilenebilir Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 17.45,
    "currency": "₺",
    "dailyChange": 0.58,
    "peRatio": 4.6,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "8.73 Mr ₺",
    "beta": 0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Biotrend Çevre ve Enerji (BIOEN), Borsa İstanbul'da Biyokütle & Yenilenebilir Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 27.96,
    "low52": 14.67,
    "dayHigh": 17.68,
    "dayLow": 17.03,
    "openPrice": 17.35,
    "volume": 4429086,
    "avgVolume": 10275431,
    "volumeRatio": 0.43,
    "athDiscountPct": 37.6
  },
  {
    "id": "bizim",
    "symbol": "BIZIM",
    "name": "Bizim Toptan Satış",
    "sector": "Toptan Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 24.24,
    "currency": "₺",
    "dailyChange": 1.59,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "1.95 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bizim Toptan Satış (BIZIM), Borsa İstanbul'da Toptan Perakende sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 36.7,
    "low52": 23.16,
    "dayHigh": 24.28,
    "dayLow": 23.88,
    "openPrice": 23.88,
    "volume": 128666,
    "avgVolume": 353248,
    "volumeRatio": 0.36,
    "athDiscountPct": 34
  },
  {
    "id": "bjkas",
    "symbol": "BJKAS",
    "name": "Beşiktaş Futbol Yatırımları",
    "sector": "Spor & Eğlence",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.84,
    "currency": "₺",
    "dailyChange": -9.8,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "8.03 Mr ₺",
    "beta": 0.78,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Beşiktaş Futbol Yatırımları (BJKAS), Borsa İstanbul'da Spor & Eğlence sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 2.42,
    "low52": 1.44,
    "dayHigh": 2.07,
    "dayLow": 1.84,
    "openPrice": 2.05,
    "volume": 341740936,
    "avgVolume": 110787833,
    "volumeRatio": 3.08,
    "athDiscountPct": 24
  },
  {
    "id": "blcyt",
    "symbol": "BLCYT",
    "name": "Bilici Yatırım Sanayi",
    "sector": "Tekstil & Tarım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 19.43,
    "currency": "₺",
    "dailyChange": 0.52,
    "peRatio": 18.5,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "1.94 Mr ₺",
    "beta": 0.97,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bilici Yatırım Sanayi (BLCYT), Borsa İstanbul'da Tekstil & Tarım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 61.9,
    "low52": 18.38,
    "dayHigh": 19.68,
    "dayLow": 19.31,
    "openPrice": 19.31,
    "volume": 728685,
    "avgVolume": 3745525,
    "volumeRatio": 0.19,
    "athDiscountPct": 68.6
  },
  {
    "id": "bntas",
    "symbol": "BNTAS",
    "name": "Bantaş Bandırma Ambalaj",
    "sector": "Metal Ambalaj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.28,
    "currency": "₺",
    "dailyChange": -2.18,
    "peRatio": 22.4,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "1.52 Mr ₺",
    "beta": 0.91,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bantaş Bandırma Ambalaj (BNTAS), Borsa İstanbul'da Metal Ambalaj sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 7.77,
    "low52": 5.88,
    "dayHigh": 6.47,
    "dayLow": 6.26,
    "openPrice": 6.42,
    "volume": 4533862,
    "avgVolume": 4588940,
    "volumeRatio": 0.99,
    "athDiscountPct": 19.2
  },
  {
    "id": "bobet",
    "symbol": "BOBET",
    "name": "Boğaziçi Beton Sanayi",
    "sector": "Hazır Beton & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 19.74,
    "currency": "₺",
    "dailyChange": -1.15,
    "peRatio": 8.7,
    "pbRatio": 1.2,
    "dividendYield": 6.4,
    "marketCap": "7.50 Mr ₺",
    "beta": 0.79,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Boğaziçi Beton Sanayi (BOBET), Borsa İstanbul'da Hazır Beton & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 25.52,
    "low52": 17.6,
    "dayHigh": 21.38,
    "dayLow": 19.02,
    "openPrice": 20,
    "volume": 15804701,
    "avgVolume": 4497985,
    "volumeRatio": 3.51,
    "athDiscountPct": 22.6
  },
  {
    "id": "borls",
    "symbol": "BORLS",
    "name": "Borlease Otomotiv",
    "sector": "Filo Kiralama & Mobilite",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 4.23,
    "currency": "₺",
    "dailyChange": -1.17,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "2.94 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Borlease Otomotiv (BORLS), Borsa İstanbul'da Filo Kiralama & Mobilite sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 33.16,
    "low52": 2.59,
    "dayHigh": 4.35,
    "dayLow": 4.17,
    "openPrice": 4.34,
    "volume": 14879029,
    "avgVolume": 27387589,
    "volumeRatio": 0.54,
    "athDiscountPct": 87.2
  },
  {
    "id": "bossa",
    "symbol": "BOSSA",
    "name": "Bossa Ticaret ve Sanayi",
    "sector": "Tekstil & Denim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 7.1,
    "currency": "₺",
    "dailyChange": 4.87,
    "peRatio": 32.3,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "8.97 Mr ₺",
    "beta": 0.91,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bossa Ticaret ve Sanayi (BOSSA), Borsa İstanbul'da Tekstil & Denim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.39,
    "low52": 5.9,
    "dayHigh": 7.16,
    "dayLow": 6.95,
    "openPrice": 7.03,
    "volume": 14002063,
    "avgVolume": 4294648,
    "volumeRatio": 3.26,
    "athDiscountPct": 15.4
  },
  {
    "id": "brisa",
    "symbol": "BRISA",
    "name": "Brisa Bridgestone Sabancı Lastik",
    "sector": "Otomotiv Yan Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 81.45,
    "currency": "₺",
    "dailyChange": 1.12,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "24.85 Mr ₺",
    "beta": 0.84,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Brisa Bridgestone Sabancı Lastik (BRISA), Borsa İstanbul'da Otomotiv Yan Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 104,
    "low52": 71.8,
    "dayHigh": 82.05,
    "dayLow": 78.4,
    "openPrice": 81.95,
    "volume": 438239,
    "avgVolume": 181026,
    "volumeRatio": 2.42,
    "athDiscountPct": 21.7
  },
  {
    "id": "brlsm",
    "symbol": "BRLSM",
    "name": "Birleşim Mühendislik",
    "sector": "Mühendislik & İklimlendirme",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 16.03,
    "currency": "₺",
    "dailyChange": 3.15,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "3.59 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Birleşim Mühendislik (BRLSM), Borsa İstanbul'da Mühendislik & İklimlendirme sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 25.48,
    "low52": 12.98,
    "dayHigh": 16.22,
    "dayLow": 15.54,
    "openPrice": 15.54,
    "volume": 4475885,
    "avgVolume": 11892884,
    "volumeRatio": 0.38,
    "athDiscountPct": 37.1
  },
  {
    "id": "brsan",
    "symbol": "BRSAN",
    "name": "Borusan Birleşik Boru",
    "sector": "Demir-Çelik & Boru",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 663,
    "currency": "₺",
    "dailyChange": 5.57,
    "peRatio": 38,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "93.99 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Borusan Birleşik Boru (BRSAN), Borsa İstanbul'da Demir-Çelik & Boru sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 789,
    "low52": 376.25,
    "dayHigh": 665,
    "dayLow": 633.5,
    "openPrice": 646,
    "volume": 5913350,
    "avgVolume": 2416080,
    "volumeRatio": 2.45,
    "athDiscountPct": 16
  },
  {
    "id": "bryat",
    "symbol": "BRYAT",
    "name": "Borusan Yatırım ve Pazarlama",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1711,
    "currency": "₺",
    "dailyChange": 0.06,
    "peRatio": 10.4,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "47.12 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Borusan Yatırım ve Pazarlama (BRYAT), Borsa İstanbul'da Holding & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3000,
    "low52": 1648,
    "dayHigh": 1759,
    "dayLow": 1711,
    "openPrice": 1728,
    "volume": 107856,
    "avgVolume": 64304,
    "volumeRatio": 1.68,
    "athDiscountPct": 43
  },
  {
    "id": "bsoke",
    "symbol": "BSOKE",
    "name": "Batısöke Söke Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 34.04,
    "currency": "₺",
    "dailyChange": -2.74,
    "peRatio": 16.7,
    "pbRatio": 2,
    "dividendYield": 7.2,
    "marketCap": "54.46 Mr ₺",
    "beta": 0.87,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Batısöke Söke Çimento (BSOKE), Borsa İstanbul'da Çimento & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 40,
    "low52": 13.77,
    "dayHigh": 35.5,
    "dayLow": 33.8,
    "openPrice": 35,
    "volume": 2554570,
    "avgVolume": 4053248,
    "volumeRatio": 0.63,
    "athDiscountPct": 14.9
  },
  {
    "id": "btcim",
    "symbol": "BTCIM",
    "name": "Batıçim Batı Anadolu Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 4.71,
    "currency": "₺",
    "dailyChange": 0.43,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "26.28 Mr ₺",
    "beta": 0.82,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Batıçim Batı Anadolu Çimento (BTCIM), Borsa İstanbul'da Çimento & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 7.09,
    "low52": 3.36,
    "dayHigh": 4.75,
    "dayLow": 4.65,
    "openPrice": 4.71,
    "volume": 105083797,
    "avgVolume": 71973656,
    "volumeRatio": 1.46,
    "athDiscountPct": 33.6
  },
  {
    "id": "bucim",
    "symbol": "BUCIM",
    "name": "Bursa Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.07,
    "currency": "₺",
    "dailyChange": 2.22,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "7.61 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bursa Çimento (BUCIM), Borsa İstanbul'da Çimento & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8,
    "low52": 4.91,
    "dayHigh": 5.08,
    "dayLow": 4.96,
    "openPrice": 4.96,
    "volume": 4434078,
    "avgVolume": 4656680,
    "volumeRatio": 0.95,
    "athDiscountPct": 36.6
  },
  {
    "id": "burce",
    "symbol": "BURCE",
    "name": "Burçelik Çelik Döküm",
    "sector": "Döküm & Makine",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 35.42,
    "currency": "₺",
    "dailyChange": 1.55,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "2.98 Mr ₺",
    "beta": 0.84,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Burçelik Çelik Döküm (BURCE), Borsa İstanbul'da Döküm & Makine sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 84.8,
    "low52": 15.88,
    "dayHigh": 35.74,
    "dayLow": 34.56,
    "openPrice": 34.96,
    "volume": 1781595,
    "avgVolume": 2732602,
    "volumeRatio": 0.65,
    "athDiscountPct": 58.2
  },
  {
    "id": "bvsan",
    "symbol": "BVSAN",
    "name": "Bülbüloğlu Vinç Sanayi",
    "sector": "Ağır Sanayi & Vinç",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 111.8,
    "currency": "₺",
    "dailyChange": 1.73,
    "peRatio": 4.7,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "4.20 Mr ₺",
    "beta": 0.93,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Bülbüloğlu Vinç Sanayi (BVSAN), Borsa İstanbul'da Ağır Sanayi & Vinç sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 165.5,
    "low52": 96.1,
    "dayHigh": 113.1,
    "dayLow": 109.5,
    "openPrice": 110.2,
    "volume": 630830,
    "avgVolume": 751961,
    "volumeRatio": 0.84,
    "athDiscountPct": 32.4
  },
  {
    "id": "bydnr",
    "symbol": "BYDNR",
    "name": "Baydöner Restoranları",
    "sector": "Restoran & Gıda",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 38.78,
    "currency": "₺",
    "dailyChange": 2.05,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "3.26 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Baydöner Restoranları (BYDNR), Borsa İstanbul'da Restoran & Gıda sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 46.88,
    "low52": 19.5,
    "dayHigh": 39,
    "dayLow": 38.02,
    "openPrice": 38.02,
    "volume": 654508,
    "avgVolume": 914330,
    "volumeRatio": 0.72,
    "athDiscountPct": 17.3
  },
  {
    "id": "cante",
    "symbol": "CANTE",
    "name": "Çan2 Termik A.Ş.",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.19,
    "currency": "₺",
    "dailyChange": 0.85,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "11.90 Mr ₺",
    "beta": 0.78,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Çan2 Termik A.Ş. (CANTE), Borsa İstanbul'da Enerji Üretim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 2.87,
    "low52": 1.17,
    "dayHigh": 1.2,
    "dayLow": 1.18,
    "openPrice": 1.18,
    "volume": 150676695,
    "avgVolume": 309401533,
    "volumeRatio": 0.49,
    "athDiscountPct": 58.5
  },
  {
    "id": "ccola",
    "symbol": "CCOLA",
    "name": "Coca-Cola İçecek A.Ş.",
    "sector": "Gıda & İçecek",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 82.2,
    "currency": "₺",
    "dailyChange": -3.24,
    "peRatio": 13,
    "pbRatio": 4.2,
    "dividendYield": 5.4,
    "marketCap": "230.00 Mr ₺",
    "beta": 1.29,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Coca-Cola İçecek A.Ş. (CCOLA), Borsa İstanbul'da Gıda & İçecek sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 93.5,
    "low52": 45.14,
    "dayHigh": 85.3,
    "dayLow": 82.1,
    "openPrice": 85.15,
    "volume": 5782395,
    "avgVolume": 6130203,
    "volumeRatio": 0.94,
    "athDiscountPct": 12.1
  },
  {
    "id": "celha",
    "symbol": "CELHA",
    "name": "Çelik Halat ve Tel",
    "sector": "Metal & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 24.66,
    "currency": "₺",
    "dailyChange": 4.94,
    "peRatio": 11.7,
    "pbRatio": 3.7,
    "dividendYield": 4.9,
    "marketCap": "9.51 Mr ₺",
    "beta": 1.24,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Çelik Halat ve Tel (CELHA), Borsa İstanbul'da Metal & Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 27.82,
    "low52": 8.32,
    "dayHigh": 25.58,
    "dayLow": 23.22,
    "openPrice": 23.26,
    "volume": 4926282,
    "avgVolume": 9229977,
    "volumeRatio": 0.53,
    "athDiscountPct": 11.4
  },
  {
    "id": "cemas",
    "symbol": "CEMAS",
    "name": "Çemaş Döküm Sanayi",
    "sector": "Döküm & Metal",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 4.08,
    "currency": "₺",
    "dailyChange": 0.25,
    "peRatio": 5.7,
    "pbRatio": 0.9,
    "dividendYield": 6.1,
    "marketCap": "3.23 Mr ₺",
    "beta": 0.76,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Çemaş Döküm Sanayi (CEMAS), Borsa İstanbul'da Döküm & Metal sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.44,
    "low52": 3.95,
    "dayHigh": 4.15,
    "dayLow": 4.08,
    "openPrice": 4.08,
    "volume": 7940643,
    "avgVolume": 18264726,
    "volumeRatio": 0.43,
    "athDiscountPct": 51.7
  },
  {
    "id": "cemts",
    "symbol": "CEMTS",
    "name": "Çemtaş Çelik Makina",
    "sector": "Vasıflı Çelik & Otomotiv",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.89,
    "currency": "₺",
    "dailyChange": 1.72,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "4.45 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Çemtaş Çelik Makina (CEMTS), Borsa İstanbul'da Vasıflı Çelik & Otomotiv sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 13.29,
    "low52": 8.51,
    "dayHigh": 8.92,
    "dayLow": 8.74,
    "openPrice": 8.74,
    "volume": 1043509,
    "avgVolume": 2280016,
    "volumeRatio": 0.46,
    "athDiscountPct": 33.1
  },
  {
    "id": "cimsa",
    "symbol": "CIMSA",
    "name": "Çimsa Çimento Sanayi",
    "sector": "Çimento & Yapı Malzemeleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 45.64,
    "currency": "₺",
    "dailyChange": 0.04,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "43.16 Mr ₺",
    "beta": 0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Çimsa Çimento Sanayi (CIMSA), Borsa İstanbul'da Çimento & Yapı Malzemeleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 60,
    "low52": 41.18,
    "dayHigh": 46.22,
    "dayLow": 45.14,
    "openPrice": 45.4,
    "volume": 8187953,
    "avgVolume": 6998857,
    "volumeRatio": 1.17,
    "athDiscountPct": 23.9
  },
  {
    "id": "clebi",
    "symbol": "CLEBI",
    "name": "Çelebi Hava Servisi",
    "sector": "Havacılık & Yer Hizmetleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1509,
    "currency": "₺",
    "dailyChange": 2.31,
    "peRatio": 11.1,
    "pbRatio": 3.9,
    "dividendYield": 5.1,
    "marketCap": "36.67 Mr ₺",
    "beta": 1.26,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Çelebi Hava Servisi (CLEBI), Borsa İstanbul'da Havacılık & Yer Hizmetleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 2247,
    "low52": 1429,
    "dayHigh": 1530,
    "dayLow": 1481,
    "openPrice": 1481,
    "volume": 37107,
    "avgVolume": 32337,
    "volumeRatio": 1.15,
    "athDiscountPct": 32.8
  },
  {
    "id": "conse",
    "symbol": "CONSE",
    "name": "Consus Enerji İşletmeciliği",
    "sector": "Biyokütle & Güneş Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.27,
    "currency": "₺",
    "dailyChange": 0.44,
    "peRatio": 32.4,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "1.75 Mr ₺",
    "beta": 0.91,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Consus Enerji İşletmeciliği (CONSE), Borsa İstanbul'da Biyokütle & Güneş Enerjisi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.95,
    "low52": 2.22,
    "dayHigh": 2.3,
    "dayLow": 2.27,
    "openPrice": 2.27,
    "volume": 3477504,
    "avgVolume": 9320783,
    "volumeRatio": 0.37,
    "athDiscountPct": 42.5
  },
  {
    "id": "crfsa",
    "symbol": "CRFSA",
    "name": "CarrefourSA Carrefour Sabancı",
    "sector": "Perakende Market",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 338.25,
    "currency": "₺",
    "dailyChange": 10,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "43.22 Mr ₺",
    "beta": 0.82,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "CarrefourSA Carrefour Sabancı (CRFSA), Borsa İstanbul'da Perakende Market sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 338.25,
    "low52": 77.2,
    "dayHigh": 338.25,
    "dayLow": 308.25,
    "openPrice": 338.25,
    "volume": 5296235,
    "avgVolume": 1123424,
    "volumeRatio": 4.71,
    "athDiscountPct": 0
  },
  {
    "id": "cusan",
    "symbol": "CUSAN",
    "name": "Çuhadaroğlu Metal Sanayi",
    "sector": "Alüminyum & Cephe Sistemleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 25.62,
    "currency": "₺",
    "dailyChange": -7.17,
    "peRatio": 4.7,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "1.83 Mr ₺",
    "beta": 0.93,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Çuhadaroğlu Metal Sanayi (CUSAN), Borsa İstanbul'da Alüminyum & Cephe Sistemleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 40.84,
    "low52": 20.4,
    "dayHigh": 27.48,
    "dayLow": 25.58,
    "openPrice": 27.34,
    "volume": 4406513,
    "avgVolume": 1886254,
    "volumeRatio": 2.34,
    "athDiscountPct": 37.3
  },
  {
    "id": "cvkmd",
    "symbol": "CVKMD",
    "name": "CVK Maden İşletmeleri",
    "sector": "Krom & Altın Madenciliği",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 16.79,
    "currency": "₺",
    "dailyChange": 5.6,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "56.61 Mr ₺",
    "beta": 0.88,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "CVK Maden İşletmeleri (CVKMD), Borsa İstanbul'da Krom & Altın Madenciliği sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 49.04,
    "low52": 12.75,
    "dayHigh": 16.89,
    "dayLow": 15.83,
    "openPrice": 15.89,
    "volume": 44693333,
    "avgVolume": 21928486,
    "volumeRatio": 2.04,
    "athDiscountPct": 65.8
  },
  {
    "id": "cwene",
    "symbol": "CWENE",
    "name": "CW Enerji Mühendislik",
    "sector": "Güneş Enerjisi (GES)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 37,
    "currency": "₺",
    "dailyChange": -2.63,
    "peRatio": 14.1,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "39.90 Mr ₺",
    "beta": 0.85,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "CW Enerji Mühendislik (CWENE), Borsa İstanbul'da Güneş Enerjisi (GES) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 48.3,
    "low52": 15.23,
    "dayHigh": 38.96,
    "dayLow": 36.82,
    "openPrice": 38,
    "volume": 174990818,
    "avgVolume": 62732494,
    "volumeRatio": 2.79,
    "athDiscountPct": 23.4
  },
  {
    "id": "dapgm",
    "symbol": "DAPGM",
    "name": "DAP Gayrimenkul Geliştirme",
    "sector": "Gayrimenkul & İnşaat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.63,
    "currency": "₺",
    "dailyChange": -0.23,
    "peRatio": 36,
    "pbRatio": 0.9,
    "dividendYield": 6.1,
    "marketCap": "22.87 Mr ₺",
    "beta": 0.76,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "DAP Gayrimenkul Geliştirme (DAPGM), Borsa İstanbul'da Gayrimenkul & İnşaat sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 19.75,
    "low52": 8.32,
    "dayHigh": 8.76,
    "dayLow": 8.6,
    "openPrice": 8.7,
    "volume": 49033648,
    "avgVolume": 148231836,
    "volumeRatio": 0.33,
    "athDiscountPct": 56.3
  },
  {
    "id": "dardl",
    "symbol": "DARDL",
    "name": "Dardanel Önentaş Gıda",
    "sector": "Gıda & Konserve Balık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.71,
    "currency": "₺",
    "dailyChange": 3.01,
    "peRatio": 21.7,
    "pbRatio": 4.7,
    "dividendYield": 5.9,
    "marketCap": "4.01 Mr ₺",
    "beta": 1.34,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Dardanel Önentaş Gıda (DARDL), Borsa İstanbul'da Gıda & Konserve Balık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.12,
    "low52": 1.63,
    "dayHigh": 1.74,
    "dayLow": 1.67,
    "openPrice": 1.67,
    "volume": 22871800,
    "avgVolume": 18986618,
    "volumeRatio": 1.2,
    "athDiscountPct": 45.2
  },
  {
    "id": "desa",
    "symbol": "DESA",
    "name": "Desa Deri Sanayi",
    "sector": "Deri & Moda Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.5,
    "currency": "₺",
    "dailyChange": 6.92,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6,
    "marketCap": "5.14 Mr ₺",
    "beta": 1.2,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Desa Deri Sanayi (DESA), Borsa İstanbul'da Deri & Moda Perakende sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 16.91,
    "low52": 9.05,
    "dayHigh": 10.8,
    "dayLow": 9.77,
    "openPrice": 9.82,
    "volume": 14776725,
    "avgVolume": 1956541,
    "volumeRatio": 7.55,
    "athDiscountPct": 37.9
  },
  {
    "id": "despc",
    "symbol": "DESPC",
    "name": "Despec Bilgisayar",
    "sector": "Bilişim Sarf Malzemeleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 39.72,
    "currency": "₺",
    "dailyChange": 0.4,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "913.6 M ₺",
    "beta": 0.82,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Despec Bilgisayar (DESPC), Borsa İstanbul'da Bilişim Sarf Malzemeleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 69,
    "low52": 36.98,
    "dayHigh": 40.2,
    "dayLow": 39.5,
    "openPrice": 39.72,
    "volume": 467301,
    "avgVolume": 1046890,
    "volumeRatio": 0.45,
    "athDiscountPct": 42.4
  },
  {
    "id": "deva",
    "symbol": "DEVA",
    "name": "Deva Holding",
    "sector": "İlaç & Sağlık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 72.55,
    "currency": "₺",
    "dailyChange": 0.48,
    "peRatio": 4.7,
    "pbRatio": 1.6,
    "dividendYield": 6.3,
    "marketCap": "14.51 Mr ₺",
    "beta": 1.23,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Deva Holding (DEVA), Borsa İstanbul'da İlaç & Sağlık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 81.75,
    "low52": 57.5,
    "dayHigh": 72.65,
    "dayLow": 70.85,
    "openPrice": 72.45,
    "volume": 354198,
    "avgVolume": 487627,
    "volumeRatio": 0.73,
    "athDiscountPct": 11.3
  },
  {
    "id": "dgate",
    "symbol": "DGATE",
    "name": "Datagate Bilgisayar",
    "sector": "Telekom Distribütörü",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 110.6,
    "currency": "₺",
    "dailyChange": -0.18,
    "peRatio": 47.5,
    "pbRatio": 4.5,
    "dividendYield": 5.7,
    "marketCap": "3.30 Mr ₺",
    "beta": 1.32,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Datagate Bilgisayar (DGATE), Borsa İstanbul'da Telekom Distribütörü sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 135.2,
    "low52": 58.3,
    "dayHigh": 111.7,
    "dayLow": 108.7,
    "openPrice": 110.8,
    "volume": 117911,
    "avgVolume": 503682,
    "volumeRatio": 0.23,
    "athDiscountPct": 18.2
  },
  {
    "id": "dggyo",
    "symbol": "DGGYO",
    "name": "Doğuş GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 36.44,
    "currency": "₺",
    "dailyChange": 9.96,
    "peRatio": 4.7,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "12.10 Mr ₺",
    "beta": 0.93,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Doğuş GYO (DGGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 49.3,
    "low52": 26.5,
    "dayHigh": 36.44,
    "dayLow": 32.5,
    "openPrice": 33.2,
    "volume": 356889,
    "avgVolume": 209271,
    "volumeRatio": 1.71,
    "athDiscountPct": 26.1
  },
  {
    "id": "dgnmo",
    "symbol": "DGNMO",
    "name": "Doğanlar Mobilya Grubu (Doğtaş)",
    "sector": "Mobilya & Ev Eşyası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.99,
    "currency": "₺",
    "dailyChange": 3.45,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "3.11 Mr ₺",
    "beta": 0.88,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Doğanlar Mobilya Grubu (Doğtaş) (DGNMO), Borsa İstanbul'da Mobilya & Ev Eşyası sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 10.68,
    "low52": 3.45,
    "dayHigh": 9,
    "dayLow": 8.45,
    "openPrice": 8.73,
    "volume": 7510184,
    "avgVolume": 5766178,
    "volumeRatio": 1.3,
    "athDiscountPct": 15.8
  },
  {
    "id": "doas",
    "symbol": "DOAS",
    "name": "Doğuş Otomotiv Servis",
    "sector": "Otomotiv & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 171.2,
    "currency": "₺",
    "dailyChange": -1.89,
    "peRatio": 12.7,
    "pbRatio": 2.3,
    "dividendYield": 7,
    "marketCap": "37.66 Mr ₺",
    "beta": 1.3,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Doğuş Otomotiv Servis (DOAS), Borsa İstanbul'da Otomotiv & İhracat sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 247,
    "low52": 166.4,
    "dayHigh": 175,
    "dayLow": 170.9,
    "openPrice": 174.5,
    "volume": 953632,
    "avgVolume": 1272854,
    "volumeRatio": 0.75,
    "athDiscountPct": 30.7
  },
  {
    "id": "doco",
    "symbol": "DOCO",
    "name": "DO & CO Aktiengesellschaft",
    "sector": "İkram Hizmetleri & Havacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11607.5,
    "currency": "₺",
    "dailyChange": 0.06,
    "peRatio": 21,
    "pbRatio": 2.1,
    "dividendYield": 6.8,
    "marketCap": "129.09 Mr ₺",
    "beta": 1.28,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "DO & CO Aktiengesellschaft (DOCO), Borsa İstanbul'da İkram Hizmetleri & Havacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 12410,
    "low52": 8245,
    "dayHigh": 11715,
    "dayLow": 11515,
    "openPrice": 11610,
    "volume": 6033,
    "avgVolume": 6925,
    "volumeRatio": 0.87,
    "athDiscountPct": 6.5
  },
  {
    "id": "dofer",
    "symbol": "DOFER",
    "name": "Dofer Yapı Malzemeleri",
    "sector": "Hasır Çelik & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 29.74,
    "currency": "₺",
    "dailyChange": -1.39,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "1.66 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Dofer Yapı Malzemeleri (DOFER), Borsa İstanbul'da Hasır Çelik & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 66.2,
    "low52": 26.86,
    "dayHigh": 30.4,
    "dayLow": 29.64,
    "openPrice": 30.16,
    "volume": 443522,
    "avgVolume": 833723,
    "volumeRatio": 0.53,
    "athDiscountPct": 55.1
  },
  {
    "id": "dohol",
    "symbol": "DOHOL",
    "name": "Doğan Şirketler Grubu Holding",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 20.86,
    "currency": "₺",
    "dailyChange": -1.23,
    "peRatio": 8.8,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "53.67 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Doğan Şirketler Grubu Holding (DOHOL), Borsa İstanbul'da Holding & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 25.24,
    "low52": 15.87,
    "dayHigh": 21.56,
    "dayLow": 20.82,
    "openPrice": 21.1,
    "volume": 12158752,
    "avgVolume": 10753400,
    "volumeRatio": 1.13,
    "athDiscountPct": 17.4
  },
  {
    "id": "dokta",
    "symbol": "DOKTA",
    "name": "Döktaş Dökümcülük",
    "sector": "Otomotiv Döküm Parçaları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 21.52,
    "currency": "₺",
    "dailyChange": 1.41,
    "peRatio": 15.7,
    "pbRatio": 1.9,
    "dividendYield": 7.1,
    "marketCap": "6.97 Mr ₺",
    "beta": 0.86,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Döktaş Dökümcülük (DOKTA), Borsa İstanbul'da Otomotiv Döküm Parçaları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 35.84,
    "low52": 20.1,
    "dayHigh": 22.38,
    "dayLow": 21.38,
    "openPrice": 21.4,
    "volume": 426208,
    "avgVolume": 613139,
    "volumeRatio": 0.7,
    "athDiscountPct": 40
  },
  {
    "id": "durdo",
    "symbol": "DURDO",
    "name": "Duran Doğan Basım ve Ambalaj",
    "sector": "Karton Ambalaj & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.15,
    "currency": "₺",
    "dailyChange": 1.78,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "2.58 Mr ₺",
    "beta": 0.97,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Duran Doğan Basım ve Ambalaj (DURDO), Borsa İstanbul'da Karton Ambalaj & İhracat sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 5.67,
    "low52": 3.29,
    "dayHigh": 5.16,
    "dayLow": 5.1,
    "openPrice": 5.1,
    "volume": 1411706,
    "avgVolume": 2939171,
    "volumeRatio": 0.48,
    "athDiscountPct": 9.2
  },
  {
    "id": "dyoby",
    "symbol": "DYOBY",
    "name": "Dyo Boya Fabrikaları",
    "sector": "Boya & Kimya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 13.5,
    "currency": "₺",
    "dailyChange": 4.57,
    "peRatio": 17.7,
    "pbRatio": 3.9,
    "dividendYield": 1.6,
    "marketCap": "4.05 Mr ₺",
    "beta": 1.06,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Dyo Boya Fabrikaları (DYOBY), Borsa İstanbul'da Boya & Kimya sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 22.8,
    "low52": 12.14,
    "dayHigh": 14.2,
    "dayLow": 13,
    "openPrice": 13.03,
    "volume": 16003171,
    "avgVolume": 3878575,
    "volumeRatio": 4.13,
    "athDiscountPct": 40.8
  },
  {
    "id": "ebebk",
    "symbol": "EBEBK",
    "name": "Ebebek Mağazacılık",
    "sector": "Bebek Perakendeciliği",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 78.2,
    "currency": "₺",
    "dailyChange": -1.76,
    "peRatio": 23.9,
    "pbRatio": 3.3,
    "dividendYield": 4.5,
    "marketCap": "12.51 Mr ₺",
    "beta": 1.2,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ebebek Mağazacılık (EBEBK), Borsa İstanbul'da Bebek Perakendeciliği sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 92.15,
    "low52": 49.98,
    "dayHigh": 79.85,
    "dayLow": 77,
    "openPrice": 79.6,
    "volume": 457342,
    "avgVolume": 555943,
    "volumeRatio": 0.82,
    "athDiscountPct": 15.1
  },
  {
    "id": "ecilc",
    "symbol": "ECILC",
    "name": "Eczacıbaşı İlaç",
    "sector": "Holding & Sağlık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 75,
    "currency": "₺",
    "dailyChange": -2.47,
    "peRatio": 14.7,
    "pbRatio": 4,
    "dividendYield": 5.2,
    "marketCap": "51.39 Mr ₺",
    "beta": 1.27,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Eczacıbaşı İlaç (ECILC), Borsa İstanbul'da Holding & Sağlık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 132.6,
    "low52": 53.45,
    "dayHigh": 78.25,
    "dayLow": 74.5,
    "openPrice": 76.7,
    "volume": 10295070,
    "avgVolume": 4047796,
    "volumeRatio": 2.54,
    "athDiscountPct": 43.4
  },
  {
    "id": "eczyt",
    "symbol": "ECZYT",
    "name": "Eczacıbaşı Yatırım Holding",
    "sector": "Yatırım & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 323,
    "currency": "₺",
    "dailyChange": -0.08,
    "peRatio": 7.7,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "33.92 Mr ₺",
    "beta": 1.14,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Eczacıbaşı Yatırım Holding (ECZYT), Borsa İstanbul'da Yatırım & Finans sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 426.75,
    "low52": 207.9,
    "dayHigh": 325.25,
    "dayLow": 320.75,
    "openPrice": 324.25,
    "volume": 224956,
    "avgVolume": 444198,
    "volumeRatio": 0.51,
    "athDiscountPct": 24.3
  },
  {
    "id": "edata",
    "symbol": "EDATA",
    "name": "E-Data Teknoloji",
    "sector": "Siber Güvenlik Dağıtıcısı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 19.53,
    "currency": "₺",
    "dailyChange": 1.24,
    "peRatio": 13.7,
    "pbRatio": 3.9,
    "dividendYield": 5.1,
    "marketCap": "7.85 Mr ₺",
    "beta": 1.26,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "E-Data Teknoloji (EDATA), Borsa İstanbul'da Siber Güvenlik Dağıtıcısı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 26.18,
    "low52": 4.6,
    "dayHigh": 21.2,
    "dayLow": 19.08,
    "openPrice": 19.33,
    "volume": 9658326,
    "avgVolume": 6156547,
    "volumeRatio": 1.57,
    "athDiscountPct": 25.4
  },
  {
    "id": "egeen",
    "symbol": "EGEEN",
    "name": "Ege Endüstri ve Ticaret",
    "sector": "Otomotiv Dingil & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5320,
    "currency": "₺",
    "dailyChange": 1.19,
    "peRatio": 29.1,
    "pbRatio": 4.4,
    "dividendYield": 5.6,
    "marketCap": "16.76 Mr ₺",
    "beta": 1.31,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ege Endüstri ve Ticaret (EGEEN), Borsa İstanbul'da Otomotiv Dingil & İhracat sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8877.5,
    "low52": 5160,
    "dayHigh": 5327.5,
    "dayLow": 5237.5,
    "openPrice": 5270,
    "volume": 9418,
    "avgVolume": 14364,
    "volumeRatio": 0.66,
    "athDiscountPct": 40.1
  },
  {
    "id": "eggub",
    "symbol": "EGGUB",
    "name": "Ege Gübre Sanayi",
    "sector": "Liman İşletmeciliği & Gübre",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 102.3,
    "currency": "₺",
    "dailyChange": 10,
    "peRatio": 14.3,
    "pbRatio": 1,
    "dividendYield": 6.2,
    "marketCap": "10.23 Mr ₺",
    "beta": 0.77,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Ege Gübre Sanayi (EGGUB), Borsa İstanbul'da Liman İşletmeciliği & Gübre sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 142.3,
    "low52": 81.7,
    "dayHigh": 102.3,
    "dayLow": 93,
    "openPrice": 93,
    "volume": 2057865,
    "avgVolume": 648507,
    "volumeRatio": 3.17,
    "athDiscountPct": 28.1
  },
  {
    "id": "egpro",
    "symbol": "EGPRO",
    "name": "Ege Profil Ticaret (Egepen)",
    "sector": "PVC Profil & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 35.4,
    "currency": "₺",
    "dailyChange": 0.45,
    "peRatio": 14.6,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "19.29 Mr ₺",
    "beta": 0.96,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Ege Profil Ticaret (Egepen) (EGPRO), Borsa İstanbul'da PVC Profil & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 47.5,
    "low52": 21.62,
    "dayHigh": 35.72,
    "dayLow": 35.38,
    "openPrice": 35.58,
    "volume": 459491,
    "avgVolume": 1627952,
    "volumeRatio": 0.28,
    "athDiscountPct": 25.5
  },
  {
    "id": "egser",
    "symbol": "EGSER",
    "name": "Ege Seramik Sanayi",
    "sector": "Seramik & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3,
    "currency": "₺",
    "dailyChange": 4.17,
    "peRatio": 18.7,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "2.16 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Ege Seramik Sanayi (EGSER), Borsa İstanbul'da Seramik & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.08,
    "low52": 2.67,
    "dayHigh": 3.04,
    "dayLow": 2.89,
    "openPrice": 2.92,
    "volume": 5425542,
    "avgVolume": 4739891,
    "volumeRatio": 1.14,
    "athDiscountPct": 26.5
  },
  {
    "id": "ekgyo",
    "symbol": "EKGYO",
    "name": "Emlak Konut GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 18.3,
    "currency": "₺",
    "dailyChange": -0.54,
    "peRatio": 228.8,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "67.00 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Emlak Konut GYO (EKGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 27.12,
    "low52": 17.47,
    "dayHigh": 18.57,
    "dayLow": 18.22,
    "openPrice": 18.37,
    "volume": 144760487,
    "avgVolume": 118609903,
    "volumeRatio": 1.22,
    "athDiscountPct": 32.5
  },
  {
    "id": "eksun",
    "symbol": "EKSUN",
    "name": "Eksun Gıda Tarım (Sinangil)",
    "sector": "Un & Gıda Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.06,
    "currency": "₺",
    "dailyChange": -0.49,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "3.64 Mr ₺",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Eksun Gıda Tarım (Sinangil) (EKSUN), Borsa İstanbul'da Un & Gıda Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.29,
    "low52": 4.88,
    "dayHigh": 6.16,
    "dayLow": 6.06,
    "openPrice": 6.11,
    "volume": 1896402,
    "avgVolume": 9312400,
    "volumeRatio": 0.2,
    "athDiscountPct": 26.9
  },
  {
    "id": "elite",
    "symbol": "ELITE",
    "name": "Elite Naturel Organik Gıda",
    "sector": "Organik Meyve Suyu İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 27.82,
    "currency": "₺",
    "dailyChange": 1.68,
    "peRatio": 20.5,
    "pbRatio": 1.9,
    "dividendYield": 7.1,
    "marketCap": "3.61 Mr ₺",
    "beta": 0.86,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Elite Naturel Organik Gıda (ELITE), Borsa İstanbul'da Organik Meyve Suyu İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 44.7,
    "low52": 27.02,
    "dayHigh": 28.14,
    "dayLow": 27.44,
    "openPrice": 27.7,
    "volume": 1152058,
    "avgVolume": 1798073,
    "volumeRatio": 0.64,
    "athDiscountPct": 37.8
  },
  {
    "id": "enery",
    "symbol": "ENERY",
    "name": "Enerya Enerji",
    "sector": "Doğalgaz Dağıtım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.99,
    "currency": "₺",
    "dailyChange": -0.22,
    "peRatio": 12.8,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "80.91 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Enerya Enerji (ENERY), Borsa İstanbul'da Doğalgaz Dağıtım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 11.93,
    "low52": 8.06,
    "dayHigh": 9.15,
    "dayLow": 8.71,
    "openPrice": 9.02,
    "volume": 49843875,
    "avgVolume": 58184120,
    "volumeRatio": 0.86,
    "athDiscountPct": 24.6
  },
  {
    "id": "enjsa",
    "symbol": "ENJSA",
    "name": "Enerjisa Enerji A.Ş.",
    "sector": "Enerji Dağıtım & Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 106.2,
    "currency": "₺",
    "dailyChange": -1.12,
    "peRatio": 20,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "125.43 Mr ₺",
    "beta": 0.84,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Enerjisa Enerji A.Ş. (ENJSA), Borsa İstanbul'da Enerji Dağıtım & Perakende sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 127.9,
    "low52": 67.4,
    "dayHigh": 109.3,
    "dayLow": 105.9,
    "openPrice": 107.4,
    "volume": 3582897,
    "avgVolume": 2735585,
    "volumeRatio": 1.31,
    "athDiscountPct": 17
  },
  {
    "id": "enkai",
    "symbol": "ENKAI",
    "name": "Enka İnşaat ve Sanayi",
    "sector": "İnşaat & Enerji / Gayrimenkul",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 87.65,
    "currency": "₺",
    "dailyChange": 2.1,
    "peRatio": 13.7,
    "pbRatio": 0.8,
    "dividendYield": 6,
    "marketCap": "513.87 Mr ₺",
    "beta": 0.75,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Enka İnşaat ve Sanayi (ENKAI), Borsa İstanbul'da İnşaat & Enerji / Gayrimenkul sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 114.3,
    "low52": 65.55,
    "dayHigh": 87.7,
    "dayLow": 85.85,
    "openPrice": 86.05,
    "volume": 14925184,
    "avgVolume": 11326112,
    "volumeRatio": 1.32,
    "athDiscountPct": 23.3
  },
  {
    "id": "erbos",
    "symbol": "ERBOS",
    "name": "Erbosan Erciyas Boru",
    "sector": "Çelik Boru & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 153.9,
    "currency": "₺",
    "dailyChange": 2.74,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "3.08 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Erbosan Erciyas Boru (ERBOS), Borsa İstanbul'da Çelik Boru & Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 226,
    "low52": 149.5,
    "dayHigh": 154.2,
    "dayLow": 149.9,
    "openPrice": 149.9,
    "volume": 90213,
    "avgVolume": 76780,
    "volumeRatio": 1.17,
    "athDiscountPct": 31.9
  },
  {
    "id": "eregl",
    "symbol": "EREGL",
    "name": "Ereğli Demir ve Çelik",
    "sector": "Temel Metal & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 37.38,
    "currency": "₺",
    "dailyChange": -2.25,
    "peRatio": 32.5,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "251.26 Mr ₺",
    "beta": 0.82,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "Ereğli Demir ve Çelik (EREGL), Borsa İstanbul'da Temel Metal & Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 45.1,
    "low52": 23.46,
    "dayHigh": 39.02,
    "dayLow": 37.18,
    "openPrice": 38.38,
    "volume": 187307320,
    "avgVolume": 141784764,
    "volumeRatio": 1.32,
    "athDiscountPct": 17.1
  },
  {
    "id": "escar",
    "symbol": "ESCAR",
    "name": "Escar Turizm Taşımacılık",
    "sector": "Filo Kiralama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 44.56,
    "currency": "₺",
    "dailyChange": 3.15,
    "peRatio": 10.7,
    "pbRatio": 1.4,
    "dividendYield": 6.6,
    "marketCap": "22.28 Mr ₺",
    "beta": 0.81,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Escar Turizm Taşımacılık (ESCAR), Borsa İstanbul'da Filo Kiralama sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 57,
    "low52": 18.46,
    "dayHigh": 45,
    "dayLow": 42.86,
    "openPrice": 43.28,
    "volume": 1948767,
    "avgVolume": 2720261,
    "volumeRatio": 0.72,
    "athDiscountPct": 21.8
  },
  {
    "id": "escom",
    "symbol": "ESCOM",
    "name": "Escort Teknoloji Yatırım",
    "sector": "Girişim Sermayesi & Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.01,
    "currency": "₺",
    "dailyChange": -1.31,
    "peRatio": 2.8,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "4.24 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Escort Teknoloji Yatırım (ESCOM), Borsa İstanbul'da Girişim Sermayesi & Teknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 6.93,
    "low52": 2.78,
    "dayHigh": 6.13,
    "dayLow": 5.94,
    "openPrice": 6.13,
    "volume": 28881666,
    "avgVolume": 41612668,
    "volumeRatio": 0.69,
    "athDiscountPct": 13.3
  },
  {
    "id": "eupwr",
    "symbol": "EUPWR",
    "name": "Europower Enerji ve Otomasyon",
    "sector": "Elektromekanik & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 97.2,
    "currency": "₺",
    "dailyChange": 5.71,
    "peRatio": 81,
    "pbRatio": 1.1,
    "dividendYield": 2.8,
    "marketCap": "64.15 Mr ₺",
    "beta": 1.18,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Europower Enerji ve Otomasyon (EUPWR), Borsa İstanbul'da Elektromekanik & Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 108.6,
    "low52": 25.5,
    "dayHigh": 97.4,
    "dayLow": 92.15,
    "openPrice": 92.15,
    "volume": 18289607,
    "avgVolume": 30643164,
    "volumeRatio": 0.6,
    "athDiscountPct": 10.5
  },
  {
    "id": "euren",
    "symbol": "EUREN",
    "name": "Europen Endüstri",
    "sector": "Cam & PVC Yapı Malzemeleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.89,
    "currency": "₺",
    "dailyChange": 2.91,
    "peRatio": 20.5,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8.17 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Europen Endüstri (EUREN), Borsa İstanbul'da Cam & PVC Yapı Malzemeleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 11.4,
    "low52": 3.75,
    "dayHigh": 3.91,
    "dayLow": 3.78,
    "openPrice": 3.78,
    "volume": 34697436,
    "avgVolume": 30375689,
    "volumeRatio": 1.14,
    "athDiscountPct": 65.9
  },
  {
    "id": "fade",
    "symbol": "FADE",
    "name": "Fade Gıda Yatırım",
    "sector": "Kurutulmuş Domates İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 15.55,
    "currency": "₺",
    "dailyChange": -0.83,
    "peRatio": 42,
    "pbRatio": 4,
    "dividendYield": 4.7,
    "marketCap": "1.30 Mr ₺",
    "beta": 1.07,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Fade Gıda Yatırım (FADE), Borsa İstanbul'da Kurutulmuş Domates İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 19.75,
    "low52": 12.83,
    "dayHigh": 15.97,
    "dayLow": 15.52,
    "openPrice": 15.74,
    "volume": 3787412,
    "avgVolume": 4814608,
    "volumeRatio": 0.79,
    "athDiscountPct": 21.3
  },
  {
    "id": "fener",
    "symbol": "FENER",
    "name": "Fenerbahçe Futbol A.Ş.",
    "sector": "Spor & Eğlence",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.12,
    "currency": "₺",
    "dailyChange": -1.89,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "19.50 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Fenerbahçe Futbol A.Ş. (FENER), Borsa İstanbul'da Spor & Eğlence sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14.04,
    "low52": 2.54,
    "dayHigh": 3.2,
    "dayLow": 3.11,
    "openPrice": 3.19,
    "volume": 80056653,
    "avgVolume": 174592382,
    "volumeRatio": 0.46,
    "athDiscountPct": 77.8
  },
  {
    "id": "fonet",
    "symbol": "FONET",
    "name": "Fonet Bilgi Teknolojileri",
    "sector": "Sağlık Bilişim Sistemleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.17,
    "currency": "₺",
    "dailyChange": 0.19,
    "peRatio": 25.9,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "4.84 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Fonet Bilgi Teknolojileri (FONET), Borsa İstanbul'da Sağlık Bilişim Sistemleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 6.39,
    "low52": 2.35,
    "dayHigh": 5.36,
    "dayLow": 5.14,
    "openPrice": 5.16,
    "volume": 20114696,
    "avgVolume": 32896121,
    "volumeRatio": 0.61,
    "athDiscountPct": 19.1
  },
  {
    "id": "formt",
    "symbol": "FORMT",
    "name": "Formet Metal ve Cam",
    "sector": "Dayanıklı Tüketim & Metal",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.68,
    "currency": "₺",
    "dailyChange": -1.18,
    "peRatio": 18.7,
    "pbRatio": 4,
    "dividendYield": 1.7,
    "marketCap": "1.92 Mr ₺",
    "beta": 1.07,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Formet Metal ve Cam (FORMT), Borsa İstanbul'da Dayanıklı Tüketim & Metal sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.61,
    "low52": 1.66,
    "dayHigh": 1.71,
    "dayLow": 1.67,
    "openPrice": 1.71,
    "volume": 28236413,
    "avgVolume": 29701686,
    "volumeRatio": 0.95,
    "athDiscountPct": 63.6
  },
  {
    "id": "forte",
    "symbol": "FORTE",
    "name": "Forte Bilgi İletişim",
    "sector": "Savunma Bilişimi & Sistem Entegratörü",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 136.5,
    "currency": "₺",
    "dailyChange": -0.66,
    "peRatio": 3.5,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9.15 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Forte Bilgi İletişim (FORTE), Borsa İstanbul'da Savunma Bilişimi & Sistem Entegratörü sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 146.1,
    "low52": 64.55,
    "dayHigh": 144,
    "dayLow": 132.2,
    "openPrice": 137.4,
    "volume": 3350026,
    "avgVolume": 1861317,
    "volumeRatio": 1.8,
    "athDiscountPct": 6.6
  },
  {
    "id": "frigo",
    "symbol": "FRIGO",
    "name": "Frigo Pak Gıda",
    "sector": "Dondurulmuş Gıda İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.34,
    "currency": "₺",
    "dailyChange": 2.63,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "1.99 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Frigo Pak Gıda (FRIGO), Borsa İstanbul'da Dondurulmuş Gıda İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.66,
    "low52": 1.32,
    "dayHigh": 2.35,
    "dayLow": 2.25,
    "openPrice": 2.29,
    "volume": 26414352,
    "avgVolume": 52972664,
    "volumeRatio": 0.5,
    "athDiscountPct": 36.1
  },
  {
    "id": "froto",
    "symbol": "FROTO",
    "name": "Ford Otomotiv Sanayi",
    "sector": "Otomotiv & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 79.1,
    "currency": "₺",
    "dailyChange": -0.75,
    "peRatio": 10.2,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "277.57 Mr ₺",
    "beta": 1.09,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Ford Otomotiv Sanayi (FROTO), Borsa İstanbul'da Otomotiv & İhracat sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 135.4,
    "low52": 75.05,
    "dayHigh": 80.7,
    "dayLow": 78.8,
    "openPrice": 79.95,
    "volume": 17683196,
    "avgVolume": 25436859,
    "volumeRatio": 0.7,
    "athDiscountPct": 41.6
  },
  {
    "id": "fzlgy",
    "symbol": "FZLGY",
    "name": "Fuzul Gayrimenkul Yatırım",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.56,
    "currency": "₺",
    "dailyChange": -0.28,
    "peRatio": 4.7,
    "pbRatio": 4.4,
    "dividendYield": 2.1,
    "marketCap": "13.20 Mr ₺",
    "beta": 1.11,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Fuzul Gayrimenkul Yatırım (FZLGY), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 20.2,
    "low52": 9.46,
    "dayHigh": 11.14,
    "dayLow": 10.34,
    "openPrice": 10.65,
    "volume": 36445069,
    "avgVolume": 28754481,
    "volumeRatio": 1.27,
    "athDiscountPct": 47.7
  },
  {
    "id": "garan",
    "symbol": "GARAN",
    "name": "Türkiye Garanti Bankası (BBVA)",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 131,
    "currency": "₺",
    "dailyChange": 1.08,
    "peRatio": 4.6,
    "pbRatio": 0.9,
    "dividendYield": 6.1,
    "marketCap": "550.20 Mr ₺",
    "beta": 0.76,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "Türkiye Garanti Bankası (BBVA) (GARAN), Borsa İstanbul'da Bankacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 169.7,
    "low52": 115.4,
    "dayHigh": 131.3,
    "dayLow": 129.2,
    "openPrice": 129.5,
    "volume": 34885000,
    "avgVolume": 31060183,
    "volumeRatio": 1.12,
    "athDiscountPct": 22.8
  },
  {
    "id": "garfa",
    "symbol": "GARFA",
    "name": "Garanti Faktoring",
    "sector": "Faktoring & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 26.4,
    "currency": "₺",
    "dailyChange": 1.3,
    "peRatio": 4,
    "pbRatio": 4.1,
    "dividendYield": 5.3,
    "marketCap": "10.49 Mr ₺",
    "beta": 1.28,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Garanti Faktoring (GARFA), Borsa İstanbul'da Faktoring & Finans sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 37.5,
    "low52": 23.72,
    "dayHigh": 26.7,
    "dayLow": 26.16,
    "openPrice": 26.16,
    "volume": 1385173,
    "avgVolume": 1467838,
    "volumeRatio": 0.94,
    "athDiscountPct": 29.6
  },
  {
    "id": "gedik",
    "symbol": "GEDIK",
    "name": "Gedik Yatırım Menkul",
    "sector": "Aracı Kurum & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.31,
    "currency": "₺",
    "dailyChange": -1.71,
    "peRatio": 8.4,
    "pbRatio": 4.4,
    "dividendYield": 5.6,
    "marketCap": "12.62 Mr ₺",
    "beta": 1.31,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Gedik Yatırım Menkul (GEDIK), Borsa İstanbul'da Aracı Kurum & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.54,
    "low52": 4.95,
    "dayHigh": 6.48,
    "dayLow": 6.3,
    "openPrice": 6.44,
    "volume": 7654133,
    "avgVolume": 26814256,
    "volumeRatio": 0.29,
    "athDiscountPct": 26.1
  },
  {
    "id": "genil",
    "symbol": "GENIL",
    "name": "Gen İlaç ve Sağlık Ürünleri",
    "sector": "İlaç & Biyoteknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.93,
    "currency": "₺",
    "dailyChange": 0.55,
    "peRatio": 47.5,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "49.08 Mr ₺",
    "beta": 0.82,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Gen İlaç ve Sağlık Ürünleri (GENIL), Borsa İstanbul'da İlaç & Biyoteknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14.93,
    "low52": 7.12,
    "dayHigh": 11.05,
    "dayLow": 10.54,
    "openPrice": 10.9,
    "volume": 53974787,
    "avgVolume": 48510603,
    "volumeRatio": 1.11,
    "athDiscountPct": 26.8
  },
  {
    "id": "gents",
    "symbol": "GENTS",
    "name": "Gentaş Dekoratif Yüzeyler",
    "sector": "Laminat & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.25,
    "currency": "₺",
    "dailyChange": -1.69,
    "peRatio": 7.3,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "3.94 Mr ₺",
    "beta": 1,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Gentaş Dekoratif Yüzeyler (GENTS), Borsa İstanbul'da Laminat & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 13.62,
    "low52": 5.12,
    "dayHigh": 5.42,
    "dayLow": 5.21,
    "openPrice": 5.42,
    "volume": 5427334,
    "avgVolume": 9151290,
    "volumeRatio": 0.59,
    "athDiscountPct": 61.5
  },
  {
    "id": "gerel",
    "symbol": "GEREL",
    "name": "Gersan Elektrik Ticaret",
    "sector": "Elektrik Malzemeleri & Şarj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 45.9,
    "currency": "₺",
    "dailyChange": 2.23,
    "peRatio": 32.8,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "17.10 Mr ₺",
    "beta": 0.82,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Gersan Elektrik Ticaret (GEREL), Borsa İstanbul'da Elektrik Malzemeleri & Şarj sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 47.24,
    "low52": 15.76,
    "dayHigh": 47,
    "dayLow": 44.88,
    "openPrice": 44.9,
    "volume": 8731556,
    "avgVolume": 10048116,
    "volumeRatio": 0.87,
    "athDiscountPct": 2.8
  },
  {
    "id": "gesan",
    "symbol": "GESAN",
    "name": "Girişim Elektrik Sanayi",
    "sector": "Elektromekanik & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 84.5,
    "currency": "₺",
    "dailyChange": 3.81,
    "peRatio": 36.4,
    "pbRatio": 1.4,
    "dividendYield": 6.6,
    "marketCap": "38.87 Mr ₺",
    "beta": 0.81,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Girişim Elektrik Sanayi (GESAN), Borsa İstanbul'da Elektromekanik & Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 93.7,
    "low52": 41.48,
    "dayHigh": 85.2,
    "dayLow": 81.55,
    "openPrice": 81.55,
    "volume": 8960312,
    "avgVolume": 16703567,
    "volumeRatio": 0.54,
    "athDiscountPct": 9.8
  },
  {
    "id": "gipta",
    "symbol": "GIPTA",
    "name": "Gıpta Ofis Kırtasiye",
    "sector": "Kırtasiye & Ambalaj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 80.9,
    "currency": "₺",
    "dailyChange": 5.06,
    "peRatio": 6.5,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "10.68 Mr ₺",
    "beta": 0.88,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Gıpta Ofis Kırtasiye (GIPTA), Borsa İstanbul'da Kırtasiye & Ambalaj sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 160.8,
    "low52": 50.8,
    "dayHigh": 82.75,
    "dayLow": 78.85,
    "openPrice": 79,
    "volume": 6332493,
    "avgVolume": 2616748,
    "volumeRatio": 2.42,
    "athDiscountPct": 49.7
  },
  {
    "id": "glcvy",
    "symbol": "GLCVY",
    "name": "Gelecek Varlık Yönetimi",
    "sector": "Varlık Yönetimi & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 49.42,
    "currency": "₺",
    "dailyChange": 0.16,
    "peRatio": 13.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "6.90 Mr ₺",
    "beta": 1.04,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Gelecek Varlık Yönetimi (GLCVY), Borsa İstanbul'da Varlık Yönetimi & Finans sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 84.5,
    "low52": 48.7,
    "dayHigh": 50.3,
    "dayLow": 49.26,
    "openPrice": 49.34,
    "volume": 706515,
    "avgVolume": 664597,
    "volumeRatio": 1.06,
    "athDiscountPct": 41.5
  },
  {
    "id": "glyho",
    "symbol": "GLYHO",
    "name": "Global Yatırım Holding",
    "sector": "Liman İşletmeciliği & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 17.13,
    "currency": "₺",
    "dailyChange": -1.32,
    "peRatio": 6,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "33.40 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Global Yatırım Holding (GLYHO), Borsa İstanbul'da Liman İşletmeciliği & Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 18.91,
    "low52": 8.11,
    "dayHigh": 17.39,
    "dayLow": 17.05,
    "openPrice": 17.35,
    "volume": 2665232,
    "avgVolume": 4658988,
    "volumeRatio": 0.57,
    "athDiscountPct": 9.4
  },
  {
    "id": "goknr",
    "symbol": "GOKNR",
    "name": "Göknur Gıda Maddeleri",
    "sector": "Meyve Suyu Konsantresi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 18.4,
    "currency": "₺",
    "dailyChange": -9.98,
    "peRatio": 15.9,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "6.44 Mr ₺",
    "beta": 1,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Göknur Gıda Maddeleri (GOKNR), Borsa İstanbul'da Meyve Suyu Konsantresi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 28.92,
    "low52": 18.4,
    "dayHigh": 18.4,
    "dayLow": 18.4,
    "openPrice": 18.4,
    "volume": 1436831,
    "avgVolume": 8232107,
    "volumeRatio": 0.17,
    "athDiscountPct": 36.4
  },
  {
    "id": "golts",
    "symbol": "GOLTS",
    "name": "Göltaş Göller Bölgesi Çimento",
    "sector": "Çimento & Hazır Beton",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 293.5,
    "currency": "₺",
    "dailyChange": 0.6,
    "peRatio": 451.5,
    "pbRatio": 4.1,
    "dividendYield": 1.8,
    "marketCap": "5.28 Mr ₺",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Göltaş Göller Bölgesi Çimento (GOLTS), Borsa İstanbul'da Çimento & Hazır Beton sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 405.75,
    "low52": 283.25,
    "dayHigh": 295,
    "dayLow": 292.5,
    "openPrice": 292.75,
    "volume": 44055,
    "avgVolume": 84589,
    "volumeRatio": 0.52,
    "athDiscountPct": 27.7
  },
  {
    "id": "goody",
    "symbol": "GOODY",
    "name": "Goodyear Lastikleri",
    "sector": "Otomotiv Lastik Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.02,
    "currency": "₺",
    "dailyChange": 9.82,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "4.59 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Goodyear Lastikleri (GOODY), Borsa İstanbul'da Otomotiv Lastik Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.22,
    "low52": 2.4,
    "dayHigh": 3.02,
    "dayLow": 2.66,
    "openPrice": 2.75,
    "volume": 158484146,
    "avgVolume": 35214289,
    "volumeRatio": 4.5,
    "athDiscountPct": 28.4
  },
  {
    "id": "gozde",
    "symbol": "GOZDE",
    "name": "Gözde Girişim Sermayesi",
    "sector": "Girişim Sermayesi & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 22.72,
    "currency": "₺",
    "dailyChange": -2.82,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "8.75 Mr ₺",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Gözde Girişim Sermayesi (GOZDE), Borsa İstanbul'da Girişim Sermayesi & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 28.72,
    "low52": 18.1,
    "dayHigh": 23.5,
    "dayLow": 22.6,
    "openPrice": 23.48,
    "volume": 2123769,
    "avgVolume": 2410426,
    "volumeRatio": 0.88,
    "athDiscountPct": 20.9
  },
  {
    "id": "gsdho",
    "symbol": "GSDHO",
    "name": "GSD Holding",
    "sector": "Denizcilik & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 4.8,
    "currency": "₺",
    "dailyChange": -0.41,
    "peRatio": 48,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "4.21 Mr ₺",
    "beta": 0.88,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "GSD Holding (GSDHO), Borsa İstanbul'da Denizcilik & Finans sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 6.92,
    "low52": 4,
    "dayHigh": 4.85,
    "dayLow": 4.78,
    "openPrice": 4.82,
    "volume": 5473395,
    "avgVolume": 30820847,
    "volumeRatio": 0.18,
    "athDiscountPct": 30.6
  },
  {
    "id": "gsray",
    "symbol": "GSRAY",
    "name": "Galatasaray Sportif Sınai",
    "sector": "Spor & Eğlence",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.02,
    "currency": "₺",
    "dailyChange": -0.97,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "13.77 Mr ₺",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Galatasaray Sportif Sınai (GSRAY), Borsa İstanbul'da Spor & Eğlence sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 1.75,
    "low52": 0.96,
    "dayHigh": 1.03,
    "dayLow": 1.01,
    "openPrice": 1.03,
    "volume": 81644915,
    "avgVolume": 179129860,
    "volumeRatio": 0.46,
    "athDiscountPct": 41.7
  },
  {
    "id": "gubrf",
    "symbol": "GUBRF",
    "name": "Gübre Fabrikaları T.A.Ş.",
    "sector": "Kimya & Tarım Gübresi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 419.25,
    "currency": "₺",
    "dailyChange": 0.18,
    "peRatio": 19.7,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "140.03 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Gübre Fabrikaları T.A.Ş. (GUBRF), Borsa İstanbul'da Kimya & Tarım Gübresi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 625.5,
    "low52": 254,
    "dayHigh": 422.25,
    "dayLow": 409.25,
    "openPrice": 412.5,
    "volume": 2910882,
    "avgVolume": 2583384,
    "volumeRatio": 1.13,
    "athDiscountPct": 33
  },
  {
    "id": "gwind",
    "symbol": "GWIND",
    "name": "Galata Wind Enerji",
    "sector": "Rüzgar & Güneş Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 22.94,
    "currency": "₺",
    "dailyChange": -0.17,
    "peRatio": 6,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "12.39 Mr ₺",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Galata Wind Enerji (GWIND), Borsa İstanbul'da Rüzgar & Güneş Enerjisi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 33.62,
    "low52": 21.64,
    "dayHigh": 23.12,
    "dayLow": 22.94,
    "openPrice": 22.98,
    "volume": 2676285,
    "avgVolume": 5282172,
    "volumeRatio": 0.51,
    "athDiscountPct": 31.8
  },
  {
    "id": "gznmi",
    "symbol": "GZNMI",
    "name": "Gezinomi Seyahat Turizm",
    "sector": "Turizm & Seyahat Acentesi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 57.3,
    "currency": "₺",
    "dailyChange": -1.97,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "3.72 Mr ₺",
    "beta": 1.04,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Gezinomi Seyahat Turizm (GZNMI), Borsa İstanbul'da Turizm & Seyahat Acentesi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 330.25,
    "low52": 41.56,
    "dayHigh": 60.1,
    "dayLow": 56.5,
    "openPrice": 58.1,
    "volume": 1674896,
    "avgVolume": 2290571,
    "volumeRatio": 0.73,
    "athDiscountPct": 82.6
  },
  {
    "id": "halkb",
    "symbol": "HALKB",
    "name": "Türkiye Halk Bankası",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 34.18,
    "currency": "₺",
    "dailyChange": -1.33,
    "peRatio": 7.6,
    "pbRatio": 4.2,
    "dividendYield": 5.4,
    "marketCap": "245.58 Mr ₺",
    "beta": 1.29,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Türkiye Halk Bankası (HALKB), Borsa İstanbul'da Bankacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 52.5,
    "low52": 23.38,
    "dayHigh": 34.9,
    "dayLow": 34.18,
    "openPrice": 34.46,
    "volume": 29455151,
    "avgVolume": 58288025,
    "volumeRatio": 0.51,
    "athDiscountPct": 34.9
  },
  {
    "id": "hatek",
    "symbol": "HATEK",
    "name": "Hateks Hatay Tekstil",
    "sector": "Havlu & Tekstil İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11.97,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "754.1 M ₺",
    "beta": 0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Hateks Hatay Tekstil (HATEK), Borsa İstanbul'da Havlu & Tekstil İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 25.2,
    "low52": 11.21,
    "dayHigh": 12.1,
    "dayLow": 11.78,
    "openPrice": 12,
    "volume": 1305828,
    "avgVolume": 3065972,
    "volumeRatio": 0.43,
    "athDiscountPct": 52.5
  },
  {
    "id": "hatsn",
    "symbol": "HATSN",
    "name": "Hatsan Gemi İnşaa",
    "sector": "Tersane & Gemi Onarımı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 50.55,
    "currency": "₺",
    "dailyChange": 0.6,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "11.20 Mr ₺",
    "beta": 0.97,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Hatsan Gemi İnşaa (HATSN), Borsa İstanbul'da Tersane & Gemi Onarımı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 67.7,
    "low52": 34.4,
    "dayHigh": 51.65,
    "dayLow": 49.72,
    "openPrice": 50.55,
    "volume": 3121960,
    "avgVolume": 5258413,
    "volumeRatio": 0.59,
    "athDiscountPct": 25.3
  },
  {
    "id": "hekts",
    "symbol": "HEKTS",
    "name": "Hektaş Ticaret T.A.Ş.",
    "sector": "Tarım İlaçları & Tohum",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 2.8,
    "currency": "₺",
    "dailyChange": -1.06,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "23.60 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Hektaş Ticaret T.A.Ş. (HEKTS), Borsa İstanbul'da Tarım İlaçları & Tohum sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 5.27,
    "low52": 2.76,
    "dayHigh": 2.85,
    "dayLow": 2.76,
    "openPrice": 2.83,
    "volume": 257493154,
    "avgVolume": 440066311,
    "volumeRatio": 0.59,
    "athDiscountPct": 46.9
  },
  {
    "id": "hktm",
    "symbol": "HKTM",
    "name": "Hidropar Hareket Kontrol",
    "sector": "Robotik & Otomasyon",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11.6,
    "currency": "₺",
    "dailyChange": 4.79,
    "peRatio": 6.7,
    "pbRatio": 3.6,
    "dividendYield": 0.8,
    "marketCap": "1.22 Mr ₺",
    "beta": 0.83,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Hidropar Hareket Kontrol (HKTM), Borsa İstanbul'da Robotik & Otomasyon sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 17.22,
    "low52": 10.25,
    "dayHigh": 11.88,
    "dayLow": 11.08,
    "openPrice": 11.08,
    "volume": 6821402,
    "avgVolume": 5826759,
    "volumeRatio": 1.17,
    "athDiscountPct": 32.6
  },
  {
    "id": "hlgyo",
    "symbol": "HLGYO",
    "name": "Halk GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 4.52,
    "currency": "₺",
    "dailyChange": -0.22,
    "peRatio": 1.4,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "26.50 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Halk GYO (HLGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 6.65,
    "low52": 3.36,
    "dayHigh": 4.58,
    "dayLow": 4.5,
    "openPrice": 4.54,
    "volume": 12074172,
    "avgVolume": 25423046,
    "volumeRatio": 0.47,
    "athDiscountPct": 32
  },
  {
    "id": "hrket",
    "symbol": "HRKET",
    "name": "Hareket Proje Taşımacılığı",
    "sector": "Ağır Yük Lojistiği & Vinç",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 99.7,
    "currency": "₺",
    "dailyChange": 8.08,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "11.49 Mr ₺",
    "beta": 0.97,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Hareket Proje Taşımacılığı (HRKET), Borsa İstanbul'da Ağır Yük Lojistiği & Vinç sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 142.9,
    "low52": 58.15,
    "dayHigh": 101.4,
    "dayLow": 90.85,
    "openPrice": 91.5,
    "volume": 8414723,
    "avgVolume": 3706030,
    "volumeRatio": 2.27,
    "athDiscountPct": 30.2
  },
  {
    "id": "httbt",
    "symbol": "HTTBT",
    "name": "Hitit Bilgisayar Hizmetleri",
    "sector": "Havacılık Yazılımları & SaaS",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 37.18,
    "currency": "₺",
    "dailyChange": -0.32,
    "peRatio": 27.5,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "11.15 Mr ₺",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Hitit Bilgisayar Hizmetleri (HTTBT), Borsa İstanbul'da Havacılık Yazılımları & SaaS sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 53.95,
    "low52": 35.26,
    "dayHigh": 38.48,
    "dayLow": 37.04,
    "openPrice": 37.3,
    "volume": 273317,
    "avgVolume": 567694,
    "volumeRatio": 0.48,
    "athDiscountPct": 31.1
  },
  {
    "id": "huner",
    "symbol": "HUNER",
    "name": "Hun Yenilenebilir Enerji",
    "sector": "Güneş & Biyokütle Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.75,
    "currency": "₺",
    "dailyChange": 3.59,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "3.75 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Hun Yenilenebilir Enerji (HUNER), Borsa İstanbul'da Güneş & Biyokütle Enerjisi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.26,
    "low52": 2.93,
    "dayHigh": 3.79,
    "dayLow": 3.6,
    "openPrice": 3.62,
    "volume": 40877656,
    "avgVolume": 45521835,
    "volumeRatio": 0.9,
    "athDiscountPct": 12
  },
  {
    "id": "hurgz",
    "symbol": "HURGZ",
    "name": "Hürriyet Gazetecilik",
    "sector": "Medya & Yayıncılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 7.68,
    "currency": "₺",
    "dailyChange": -1.29,
    "peRatio": 8.7,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "4.55 Mr ₺",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Hürriyet Gazetecilik (HURGZ), Borsa İstanbul'da Medya & Yayıncılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 9.98,
    "low52": 4.94,
    "dayHigh": 8.04,
    "dayLow": 7.63,
    "openPrice": 7.88,
    "volume": 8204941,
    "avgVolume": 8664667,
    "volumeRatio": 0.95,
    "athDiscountPct": 23
  },
  {
    "id": "icbct",
    "symbol": "ICBCT",
    "name": "ICBC Turkey Bank",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 21.82,
    "currency": "₺",
    "dailyChange": 1.49,
    "peRatio": 13.8,
    "pbRatio": 4.5,
    "dividendYield": 5.7,
    "marketCap": "18.77 Mr ₺",
    "beta": 1.32,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ICBC Turkey Bank (ICBCT), Borsa İstanbul'da Bankacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 28.08,
    "low52": 12.31,
    "dayHigh": 23.14,
    "dayLow": 21.76,
    "openPrice": 23,
    "volume": 5184884,
    "avgVolume": 4890186,
    "volumeRatio": 1.06,
    "athDiscountPct": 22.3
  },
  {
    "id": "ieyho",
    "symbol": "IEYHO",
    "name": "Işıklar Enerji ve Yapı Holding",
    "sector": "Holding & Çimento Torbası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 178.6,
    "currency": "₺",
    "dailyChange": -0.78,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "97.09 Mr ₺",
    "beta": 0.97,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Işıklar Enerji ve Yapı Holding (IEYHO), Borsa İstanbul'da Holding & Çimento Torbası sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 182,
    "low52": 12.6,
    "dayHigh": 182,
    "dayLow": 178.6,
    "openPrice": 180,
    "volume": 672863,
    "avgVolume": 7898467,
    "volumeRatio": 0.09,
    "athDiscountPct": 1.9
  },
  {
    "id": "ihaas",
    "symbol": "IHAAS",
    "name": "İhlas Haber Ajansı",
    "sector": "Medya & Ajans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 58,
    "currency": "₺",
    "dailyChange": -2.11,
    "peRatio": 20.7,
    "pbRatio": 4.6,
    "dividendYield": 5.8,
    "marketCap": "9.45 Mr ₺",
    "beta": 1.33,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "İhlas Haber Ajansı (IHAAS), Borsa İstanbul'da Medya & Ajans sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 106,
    "low52": 29.04,
    "dayHigh": 65,
    "dayLow": 56.7,
    "openPrice": 61.95,
    "volume": 2911762,
    "avgVolume": 2071570,
    "volumeRatio": 1.41,
    "athDiscountPct": 45.3
  },
  {
    "id": "iheva",
    "symbol": "IHEVA",
    "name": "İhlas Ev Aletleri",
    "sector": "Küçük Ev Aletleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.01,
    "currency": "₺",
    "dailyChange": -0.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "704.5 M ₺",
    "beta": 0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İhlas Ev Aletleri (IHEVA), Borsa İstanbul'da Küçük Ev Aletleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.33,
    "low52": 1.91,
    "dayHigh": 2.02,
    "dayLow": 1.98,
    "openPrice": 2.02,
    "volume": 1327489,
    "avgVolume": 1557055,
    "volumeRatio": 0.85,
    "athDiscountPct": 39.6
  },
  {
    "id": "ihlas",
    "symbol": "IHLAS",
    "name": "İhlas Holding",
    "sector": "Holding & Medya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.07,
    "currency": "₺",
    "dailyChange": -5.31,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "3.21 Mr ₺",
    "beta": 0.84,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İhlas Holding (IHLAS), Borsa İstanbul'da Holding & Medya sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.59,
    "low52": 1,
    "dayHigh": 1.15,
    "dayLow": 1.06,
    "openPrice": 1.14,
    "volume": 289216172,
    "avgVolume": 134951988,
    "volumeRatio": 2.14,
    "athDiscountPct": 76.7
  },
  {
    "id": "ihlgm",
    "symbol": "IHLGM",
    "name": "İhlas Gayrimenkul",
    "sector": "Gayrimenkul & İnşaat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.57,
    "currency": "₺",
    "dailyChange": -0.63,
    "peRatio": 3.3,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "1.57 Mr ₺",
    "beta": 0.84,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İhlas Gayrimenkul (IHLGM), Borsa İstanbul'da Gayrimenkul & İnşaat sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.58,
    "low52": 1.52,
    "dayHigh": 1.59,
    "dayLow": 1.55,
    "openPrice": 1.58,
    "volume": 20953491,
    "avgVolume": 26755308,
    "volumeRatio": 0.78,
    "athDiscountPct": 56.1
  },
  {
    "id": "imasm",
    "symbol": "IMASM",
    "name": "İmaş Makina Sanayi",
    "sector": "Değirmen Makineleri İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.53,
    "currency": "₺",
    "dailyChange": -0.39,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "2.34 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İmaş Makina Sanayi (IMASM), Borsa İstanbul'da Değirmen Makineleri İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 6.35,
    "low52": 2.34,
    "dayHigh": 2.79,
    "dayLow": 2.5,
    "openPrice": 2.5,
    "volume": 120218879,
    "avgVolume": 22448334,
    "volumeRatio": 5.36,
    "athDiscountPct": 60.2
  },
  {
    "id": "indes",
    "symbol": "INDES",
    "name": "İndeks Bilgisayar",
    "sector": "Bilişim Donanımı Distribütörü",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.4,
    "currency": "₺",
    "dailyChange": 0.1,
    "peRatio": 10.8,
    "pbRatio": 1.9,
    "dividendYield": 7.1,
    "marketCap": "7.80 Mr ₺",
    "beta": 0.86,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İndeks Bilgisayar (INDES), Borsa İstanbul'da Bilişim Donanımı Distribütörü sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 12.85,
    "low52": 6.96,
    "dayHigh": 10.5,
    "dayLow": 10.23,
    "openPrice": 10.38,
    "volume": 2393805,
    "avgVolume": 7099890,
    "volumeRatio": 0.34,
    "athDiscountPct": 19.1
  },
  {
    "id": "info",
    "symbol": "INFO",
    "name": "İnfo Yatırım Menkul Değerler",
    "sector": "Aracı Kurum & Portföy",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 7.01,
    "currency": "₺",
    "dailyChange": -4.23,
    "peRatio": 9.9,
    "pbRatio": 2.8,
    "dividendYield": 0,
    "marketCap": "6.73 Mr ₺",
    "beta": 0.75,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "İnfo Yatırım Menkul Değerler (INFO), Borsa İstanbul'da Aracı Kurum & Portföy sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.92,
    "low52": 3.01,
    "dayHigh": 7.46,
    "dayLow": 7,
    "openPrice": 7.46,
    "volume": 28406359,
    "avgVolume": 46012335,
    "volumeRatio": 0.62,
    "athDiscountPct": 21.4
  },
  {
    "id": "ingrm",
    "symbol": "INGRM",
    "name": "Ingram Bilişim",
    "sector": "Bulut & BT Distribütörü",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 396,
    "currency": "₺",
    "dailyChange": 0.32,
    "peRatio": 3300,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "9.50 Mr ₺",
    "beta": 0.96,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Ingram Bilişim (INGRM), Borsa İstanbul'da Bulut & BT Distribütörü sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 621,
    "low52": 354.75,
    "dayHigh": 405,
    "dayLow": 390.5,
    "openPrice": 400,
    "volume": 40894,
    "avgVolume": 66805,
    "volumeRatio": 0.61,
    "athDiscountPct": 36.2
  },
  {
    "id": "inves",
    "symbol": "INVES",
    "name": "Investco Holding",
    "sector": "Girişim Sermayesi & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 814,
    "currency": "₺",
    "dailyChange": 1.12,
    "peRatio": 43.5,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "152.63 Mr ₺",
    "beta": 1.04,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Investco Holding (INVES), Borsa İstanbul'da Girişim Sermayesi & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 822.5,
    "low52": 194.8,
    "dayHigh": 814.5,
    "dayLow": 805,
    "openPrice": 805,
    "volume": 39761,
    "avgVolume": 123706,
    "volumeRatio": 0.32,
    "athDiscountPct": 1
  },
  {
    "id": "ipeke",
    "symbol": "IPEKE",
    "name": "İpek Doğal Enerji",
    "sector": "Petrol & Madencilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 381.06,
    "currency": "₺",
    "dailyChange": -3.4,
    "peRatio": 10.7,
    "pbRatio": 1.4,
    "dividendYield": 6.6,
    "marketCap": "371 Mr ₺",
    "beta": 0.81,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İpek Doğal Enerji (IPEKE), Borsa İstanbul'da Petrol & Madencilik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.4",
        "peerAvg": "1.80"
      }
    ]
  },
  {
    "id": "isctr",
    "symbol": "ISCTR",
    "name": "Türkiye İş Bankası (C)",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 12.53,
    "currency": "₺",
    "dailyChange": 0.16,
    "peRatio": 4.1,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "313.25 Mr ₺",
    "beta": 1.04,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Türkiye İş Bankası (C) (ISCTR), Borsa İstanbul'da Bankacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 18.21,
    "low52": 11.11,
    "dayHigh": 12.61,
    "dayLow": 12.48,
    "openPrice": 12.52,
    "volume": 360930803,
    "avgVolume": 518748745,
    "volumeRatio": 0.7,
    "athDiscountPct": 31.2
  },
  {
    "id": "isdmr",
    "symbol": "ISDMR",
    "name": "İskenderun Demir ve Çelik",
    "sector": "Entegre Yassı & Uzun Çelik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 51.1,
    "currency": "₺",
    "dailyChange": 0.39,
    "peRatio": 19.4,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "148.19 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İskenderun Demir ve Çelik (ISDMR), Borsa İstanbul'da Entegre Yassı & Uzun Çelik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 67.95,
    "low52": 34.72,
    "dayHigh": 51.9,
    "dayLow": 50.5,
    "openPrice": 50.7,
    "volume": 1551264,
    "avgVolume": 2392037,
    "volumeRatio": 0.65,
    "athDiscountPct": 24.8
  },
  {
    "id": "isfin",
    "symbol": "ISFIN",
    "name": "İş Finansal Kiralama (Leasing)",
    "sector": "Leasing & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 20.68,
    "currency": "₺",
    "dailyChange": -0.1,
    "peRatio": 3.5,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "14.38 Mr ₺",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İş Finansal Kiralama (Leasing) (ISFIN), Borsa İstanbul'da Leasing & Finans sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 22.32,
    "low52": 15.84,
    "dayHigh": 21.18,
    "dayLow": 20.68,
    "openPrice": 20.74,
    "volume": 1978271,
    "avgVolume": 1869265,
    "volumeRatio": 1.06,
    "athDiscountPct": 7.3
  },
  {
    "id": "isgyo",
    "symbol": "ISGYO",
    "name": "İş GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 26.88,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 21.7,
    "pbRatio": 4.3,
    "dividendYield": 2,
    "marketCap": "25.77 Mr ₺",
    "beta": 1.1,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "İş GYO (ISGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 29.22,
    "low52": 17.81,
    "dayHigh": 27.86,
    "dayLow": 26.56,
    "openPrice": 27.5,
    "volume": 3454199,
    "avgVolume": 4577700,
    "volumeRatio": 0.75,
    "athDiscountPct": 8
  },
  {
    "id": "iskpl",
    "symbol": "ISKPL",
    "name": "Işık Plastik Sanayi",
    "sector": "Endüstriyel Plastik Levhalar",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.22,
    "currency": "₺",
    "dailyChange": 9.89,
    "peRatio": 24.5,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12.33 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Işık Plastik Sanayi (ISKPL), Borsa İstanbul'da Endüstriyel Plastik Levhalar sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 23.8,
    "low52": 5.49,
    "dayHigh": 8.22,
    "dayLow": 7.45,
    "openPrice": 7.71,
    "volume": 116121579,
    "avgVolume": 96037937,
    "volumeRatio": 1.21,
    "athDiscountPct": 65.5
  },
  {
    "id": "ismen",
    "symbol": "ISMEN",
    "name": "İş Yatırım Menkul Değerler",
    "sector": "Aracı Kurum & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 33.08,
    "currency": "₺",
    "dailyChange": -0.24,
    "peRatio": 7.3,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "49.62 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İş Yatırım Menkul Değerler (ISMEN), Borsa İstanbul'da Aracı Kurum & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 54,
    "low52": 32.8,
    "dayHigh": 33.42,
    "dayLow": 33,
    "openPrice": 33.24,
    "volume": 4762659,
    "avgVolume": 6723170,
    "volumeRatio": 0.71,
    "athDiscountPct": 38.7
  },
  {
    "id": "issen",
    "symbol": "ISSEN",
    "name": "İşbir Sentetik Dokuma",
    "sector": "Sentetik Ambalaj & Bigbag",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.94,
    "currency": "₺",
    "dailyChange": 0.14,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "2.95 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İşbir Sentetik Dokuma (ISSEN), Borsa İstanbul'da Sentetik Ambalaj & Bigbag sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 11.44,
    "low52": 6.7,
    "dayHigh": 7.02,
    "dayLow": 6.82,
    "openPrice": 6.98,
    "volume": 1051640,
    "avgVolume": 3034623,
    "volumeRatio": 0.35,
    "athDiscountPct": 39.3
  },
  {
    "id": "izmdc",
    "symbol": "IZMDC",
    "name": "İzmir Demir Çelik",
    "sector": "İnşaat Demiri & Kütük Çelik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 12.97,
    "currency": "₺",
    "dailyChange": -3.57,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "19.46 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "İzmir Demir Çelik (IZMDC), Borsa İstanbul'da İnşaat Demiri & Kütük Çelik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14.85,
    "low52": 5.83,
    "dayHigh": 13.92,
    "dayLow": 12.87,
    "openPrice": 13.4,
    "volume": 10014040,
    "avgVolume": 15028528,
    "volumeRatio": 0.67,
    "athDiscountPct": 12.7
  },
  {
    "id": "jants",
    "symbol": "JANTS",
    "name": "Jantsa Jant Sanayi",
    "sector": "Otomotiv & Ağır Vasıta Jantı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 14.73,
    "currency": "₺",
    "dailyChange": 0.89,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "10.31 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Jantsa Jant Sanayi (JANTS), Borsa İstanbul'da Otomotiv & Ağır Vasıta Jantı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 31,
    "low52": 14.42,
    "dayHigh": 15.5,
    "dayLow": 14.6,
    "openPrice": 14.61,
    "volume": 5106228,
    "avgVolume": 3574681,
    "volumeRatio": 1.43,
    "athDiscountPct": 52.5
  },
  {
    "id": "karel",
    "symbol": "KAREL",
    "name": "Karel Elektronik",
    "sector": "Haberleşme Santralleri & Savunma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.2,
    "currency": "₺",
    "dailyChange": 2,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "8.22 Mr ₺",
    "beta": 0.82,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Karel Elektronik (KAREL), Borsa İstanbul'da Haberleşme Santralleri & Savunma sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14,
    "low52": 8.06,
    "dayHigh": 10.21,
    "dayLow": 9.84,
    "openPrice": 9.9,
    "volume": 14546021,
    "avgVolume": 21299151,
    "volumeRatio": 0.68,
    "athDiscountPct": 27.1
  },
  {
    "id": "karsn",
    "symbol": "KARSN",
    "name": "Karsan Otomotiv",
    "sector": "Elektrikli Minibüs & Otobüs",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.13,
    "currency": "₺",
    "dailyChange": 1.3,
    "peRatio": 14.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "9.12 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Karsan Otomotiv (KARSN), Borsa İstanbul'da Elektrikli Minibüs & Otobüs sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 15.25,
    "low52": 9,
    "dayHigh": 10.3,
    "dayLow": 9.98,
    "openPrice": 10.12,
    "volume": 10386054,
    "avgVolume": 16706465,
    "volumeRatio": 0.62,
    "athDiscountPct": 33.6
  },
  {
    "id": "kartn",
    "symbol": "KARTN",
    "name": "Kartonsan Karton Sanayi",
    "sector": "Kuşeli Karton Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 184.5,
    "currency": "₺",
    "dailyChange": -2.43,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "13.84 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kartonsan Karton Sanayi (KARTN), Borsa İstanbul'da Kuşeli Karton Üretimi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 238.3,
    "low52": 61.65,
    "dayHigh": 191.6,
    "dayLow": 184.1,
    "openPrice": 189.1,
    "volume": 373486,
    "avgVolume": 1447657,
    "volumeRatio": 0.26,
    "athDiscountPct": 22.6
  },
  {
    "id": "kayse",
    "symbol": "KAYSE",
    "name": "Kayseri Şeker Fabrikası",
    "sector": "Şeker & Tarım Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.81,
    "currency": "₺",
    "dailyChange": 0.79,
    "peRatio": 7.7,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "11.43 Mr ₺",
    "beta": 0.96,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kayseri Şeker Fabrikası (KAYSE), Borsa İstanbul'da Şeker & Tarım Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 6.39,
    "low52": 3.71,
    "dayHigh": 3.83,
    "dayLow": 3.78,
    "openPrice": 3.8,
    "volume": 9034634,
    "avgVolume": 8879746,
    "volumeRatio": 1.02,
    "athDiscountPct": 40.4
  },
  {
    "id": "kboru",
    "symbol": "KBORU",
    "name": "Kuzey Boru A.Ş.",
    "sector": "Altyapı & Plastik Boru",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 23.2,
    "currency": "₺",
    "dailyChange": 9.95,
    "peRatio": 85.9,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "13.92 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kuzey Boru A.Ş. (KBORU), Borsa İstanbul'da Altyapı & Plastik Boru sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 28.24,
    "low52": 13.02,
    "dayHigh": 23.2,
    "dayLow": 20.82,
    "openPrice": 21.18,
    "volume": 7612147,
    "avgVolume": 7466357,
    "volumeRatio": 1.02,
    "athDiscountPct": 17.8
  },
  {
    "id": "kcaer",
    "symbol": "KCAER",
    "name": "Kocaer Çelik Sanayi",
    "sector": "Çelik Profil & Güneş Enerjisi Yapıları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 15.99,
    "currency": "₺",
    "dailyChange": 1.14,
    "peRatio": 133.3,
    "pbRatio": 4.6,
    "dividendYield": 5.8,
    "marketCap": "30.62 Mr ₺",
    "beta": 1.33,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kocaer Çelik Sanayi (KCAER), Borsa İstanbul'da Çelik Profil & Güneş Enerjisi Yapıları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 16.58,
    "low52": 9.99,
    "dayHigh": 16.3,
    "dayLow": 15.52,
    "openPrice": 15.86,
    "volume": 18414147,
    "avgVolume": 18245357,
    "volumeRatio": 1.01,
    "athDiscountPct": 3.6
  },
  {
    "id": "kchol",
    "symbol": "KCHOL",
    "name": "Koç Holding A.Ş.",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 207.2,
    "currency": "₺",
    "dailyChange": 2.37,
    "peRatio": 22.6,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "525.25 Mr ₺",
    "beta": 0.84,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "Koç Holding A.Ş. (KCHOL), Borsa İstanbul'da Holding & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 229.1,
    "low52": 146,
    "dayHigh": 207.2,
    "dayLow": 202.1,
    "openPrice": 202.5,
    "volume": 29864826,
    "avgVolume": 21736900,
    "volumeRatio": 1.37,
    "athDiscountPct": 9.6
  },
  {
    "id": "kfein",
    "symbol": "KFEIN",
    "name": "Kafein Yazılım Hizmetleri",
    "sector": "Büyük Veri & Telekom Yazılımları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.6,
    "currency": "₺",
    "dailyChange": 2.99,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "1.70 Mr ₺",
    "beta": 0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kafein Yazılım Hizmetleri (KFEIN), Borsa İstanbul'da Büyük Veri & Telekom Yazılımları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 12.54,
    "low52": 7.95,
    "dayHigh": 8.65,
    "dayLow": 8.38,
    "openPrice": 8.54,
    "volume": 4066510,
    "avgVolume": 10567454,
    "volumeRatio": 0.38,
    "athDiscountPct": 31.4
  },
  {
    "id": "kimmr",
    "symbol": "KIMMR",
    "name": "Erka Kimya (Kimteks)",
    "sector": "Poliüretan Sistem Evi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 13.82,
    "currency": "₺",
    "dailyChange": -0.29,
    "peRatio": 5.5,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "3.32 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Erka Kimya (Kimteks) (KIMMR), Borsa İstanbul'da Poliüretan Sistem Evi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 21.64,
    "low52": 11.85,
    "dayHigh": 13.96,
    "dayLow": 13.72,
    "openPrice": 13.85,
    "volume": 859498,
    "avgVolume": 1756272,
    "volumeRatio": 0.49,
    "athDiscountPct": 36.1
  },
  {
    "id": "klgyo",
    "symbol": "KLGYO",
    "name": "Kiler GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 4.44,
    "currency": "₺",
    "dailyChange": 2.78,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "6.19 Mr ₺",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kiler GYO (KLGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.3,
    "low52": 4.21,
    "dayHigh": 4.45,
    "dayLow": 4.32,
    "openPrice": 4.32,
    "volume": 7922360,
    "avgVolume": 10714245,
    "volumeRatio": 0.74,
    "athDiscountPct": 46.5
  },
  {
    "id": "klkim",
    "symbol": "KLKIM",
    "name": "Kalekim Kimyevi Maddeler",
    "sector": "Yapı Kimyasalları & Harçlar",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 26.24,
    "currency": "₺",
    "dailyChange": 1.94,
    "peRatio": 1312,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "12.07 Mr ₺",
    "beta": 0.91,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kalekim Kimyevi Maddeler (KLKIM), Borsa İstanbul'da Yapı Kimyasalları & Harçlar sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 44.2,
    "low52": 24.8,
    "dayHigh": 26.36,
    "dayLow": 25.7,
    "openPrice": 25.7,
    "volume": 1611143,
    "avgVolume": 1843529,
    "volumeRatio": 0.87,
    "athDiscountPct": 40.6
  },
  {
    "id": "klmsn",
    "symbol": "KLMSN",
    "name": "Klimasan Klima Sanayi",
    "sector": "Ticari Soğutucu & Dolaplar",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 29.28,
    "currency": "₺",
    "dailyChange": 2.45,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "2.32 Mr ₺",
    "beta": 1.04,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Klimasan Klima Sanayi (KLMSN), Borsa İstanbul'da Ticari Soğutucu & Dolaplar sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 55.25,
    "low52": 27.1,
    "dayHigh": 29.7,
    "dayLow": 28.6,
    "openPrice": 28.7,
    "volume": 972198,
    "avgVolume": 1132919,
    "volumeRatio": 0.86,
    "athDiscountPct": 47
  },
  {
    "id": "klrho",
    "symbol": "KLRHO",
    "name": "Kiler Holding",
    "sector": "Holding & Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 80.35,
    "currency": "₺",
    "dailyChange": 9.99,
    "peRatio": 95.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "130.57 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kiler Holding (KLRHO), Borsa İstanbul'da Holding & Perakende sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 689.5,
    "low52": 60.75,
    "dayHigh": 80.35,
    "dayLow": 73.05,
    "openPrice": 73.05,
    "volume": 4690767,
    "avgVolume": 4900731,
    "volumeRatio": 0.96,
    "athDiscountPct": 88.3
  },
  {
    "id": "klser",
    "symbol": "KLSER",
    "name": "Kaleseramik Çanakkale Kalebodur",
    "sector": "Seramik & Banyo Ürünleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 25.1,
    "currency": "₺",
    "dailyChange": 1.7,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "12.92 Mr ₺",
    "beta": 1,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kaleseramik Çanakkale Kalebodur (KLSER), Borsa İstanbul'da Seramik & Banyo Ürünleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 34.16,
    "low52": 24.12,
    "dayHigh": 25.82,
    "dayLow": 25.08,
    "openPrice": 25.08,
    "volume": 3632463,
    "avgVolume": 1694311,
    "volumeRatio": 2.14,
    "athDiscountPct": 26.5
  },
  {
    "id": "kmpur",
    "symbol": "KMPUR",
    "name": "Kimteks Poliüretan Sanayi",
    "sector": "Ayakkabı & Otomotiv Poliüretanı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 21.1,
    "currency": "₺",
    "dailyChange": -4.18,
    "peRatio": 124.1,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "10.26 Mr ₺",
    "beta": 1.14,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kimteks Poliüretan Sanayi (KMPUR), Borsa İstanbul'da Ayakkabı & Otomotiv Poliüretanı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 24.66,
    "low52": 12.8,
    "dayHigh": 22.18,
    "dayLow": 21,
    "openPrice": 22.18,
    "volume": 2211106,
    "avgVolume": 2859812,
    "volumeRatio": 0.77,
    "athDiscountPct": 14.4
  },
  {
    "id": "konka",
    "symbol": "KONKA",
    "name": "Konya Kağıt Sanayi",
    "sector": "Yazı Tabı Kağıtları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11.55,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 16.7,
    "pbRatio": 2,
    "dividendYield": 7.2,
    "marketCap": "4.50 Mr ₺",
    "beta": 0.87,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Konya Kağıt Sanayi (KONKA), Borsa İstanbul'da Yazı Tabı Kağıtları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 18.5,
    "low52": 11.21,
    "dayHigh": 11.95,
    "dayLow": 11.52,
    "openPrice": 11.82,
    "volume": 2402790,
    "avgVolume": 2900762,
    "volumeRatio": 0.83,
    "athDiscountPct": 37.6
  },
  {
    "id": "kontr",
    "symbol": "KONTR",
    "name": "Kontrolmatik Teknoloji Enerji",
    "sector": "Enerji & Depolama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 4.21,
    "currency": "₺",
    "dailyChange": 9.64,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "5.47 Mr ₺",
    "beta": 1.13,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kontrolmatik Teknoloji Enerji (KONTR), Borsa İstanbul'da Enerji & Depolama sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 39.9,
    "low52": 3.05,
    "dayHigh": 4.22,
    "dayLow": 3.97,
    "openPrice": 3.97,
    "volume": 4777402,
    "avgVolume": 51453406,
    "volumeRatio": 0.09,
    "athDiscountPct": 89.4
  },
  {
    "id": "konya",
    "symbol": "KONYA",
    "name": "Konya Çimento",
    "sector": "Çimento & Hazır Beton",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3717.5,
    "currency": "₺",
    "dailyChange": 0.61,
    "peRatio": 67.1,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "18.12 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Konya Çimento (KONYA), Borsa İstanbul'da Çimento & Hazır Beton sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 5720,
    "low52": 3595,
    "dayHigh": 3775,
    "dayLow": 3677.5,
    "openPrice": 3775,
    "volume": 9944,
    "avgVolume": 12326,
    "volumeRatio": 0.81,
    "athDiscountPct": 35
  },
  {
    "id": "kopol",
    "symbol": "KOPOL",
    "name": "Koza Polyester Sanayi",
    "sector": "Polyester İplik & Elyaf",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.69,
    "currency": "₺",
    "dailyChange": 0.53,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "7.38 Mr ₺",
    "beta": 1.04,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Koza Polyester Sanayi (KOPOL), Borsa İstanbul'da Polyester İplik & Elyaf sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.42,
    "low52": 5.03,
    "dayHigh": 5.96,
    "dayLow": 5.67,
    "openPrice": 5.68,
    "volume": 16226649,
    "avgVolume": 20718062,
    "volumeRatio": 0.78,
    "athDiscountPct": 32.4
  },
  {
    "id": "kords",
    "symbol": "KORDS",
    "name": "Kordsa Teknik Tekstil",
    "sector": "Lastik Kord Bezi & Kompozit",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 91.75,
    "currency": "₺",
    "dailyChange": 9.95,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "17.85 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kordsa Teknik Tekstil (KORDS), Borsa İstanbul'da Lastik Kord Bezi & Kompozit sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 94.55,
    "low52": 47.44,
    "dayHigh": 91.75,
    "dayLow": 86.25,
    "openPrice": 87.35,
    "volume": 5343707,
    "avgVolume": 2676425,
    "volumeRatio": 2,
    "athDiscountPct": 3
  },
  {
    "id": "koton",
    "symbol": "KOTON",
    "name": "Koton Mağazacılık",
    "sector": "Hazır Giyim Perakendesi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 12.46,
    "currency": "₺",
    "dailyChange": -1.81,
    "peRatio": 7.1,
    "pbRatio": 4.3,
    "dividendYield": 2,
    "marketCap": "10.34 Mr ₺",
    "beta": 1.1,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Koton Mağazacılık (KOTON), Borsa İstanbul'da Hazır Giyim Perakendesi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 21.14,
    "low52": 12.22,
    "dayHigh": 12.53,
    "dayLow": 12.38,
    "openPrice": 12.51,
    "volume": 3266685,
    "avgVolume": 5008904,
    "volumeRatio": 0.65,
    "athDiscountPct": 41.1
  },
  {
    "id": "kozaa",
    "symbol": "KOZAA",
    "name": "Koza Anadolu Metal Madencilik",
    "sector": "Maden & Holding",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 389.14,
    "currency": "₺",
    "dailyChange": -2.6,
    "peRatio": 18.7,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "379 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Koza Anadolu Metal Madencilik (KOZAA), Borsa İstanbul'da Maden & Holding sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ]
  },
  {
    "id": "kozal",
    "symbol": "KOZAL",
    "name": "Koza Altın İşletmeleri",
    "sector": "Madencilik & Altın",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 400.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "10 Mr ₺",
    "beta": 1,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "Koza Altın İşletmeleri (KOZAL), Borsa İstanbul'da Madencilik & Altın sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ]
  },
  {
    "id": "krdmd",
    "symbol": "KRDMD",
    "name": "Kardemir Karabük Demir Çelik (D)",
    "sector": "Temel Metal & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 41.48,
    "currency": "₺",
    "dailyChange": -0.67,
    "peRatio": 165.9,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "47.29 Mr ₺",
    "beta": 0.85,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kardemir Karabük Demir Çelik (D) (KRDMD), Borsa İstanbul'da Temel Metal & Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 47,
    "low52": 23.5,
    "dayHigh": 42.48,
    "dayLow": 40.94,
    "openPrice": 41.84,
    "volume": 48974877,
    "avgVolume": 57423963,
    "volumeRatio": 0.85,
    "athDiscountPct": 11.7
  },
  {
    "id": "kront",
    "symbol": "KRONT",
    "name": "Kron Telekomünikasyon",
    "sector": "Siber Güvenlik & PAM Yazılımları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 28.1,
    "currency": "₺",
    "dailyChange": 0.36,
    "peRatio": 37.5,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "4.81 Mr ₺",
    "beta": 1.13,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kron Telekomünikasyon (KRONT), Borsa İstanbul'da Siber Güvenlik & PAM Yazılımları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 28.46,
    "low52": 11.99,
    "dayHigh": 28.46,
    "dayLow": 27.2,
    "openPrice": 28,
    "volume": 1470924,
    "avgVolume": 2297383,
    "volumeRatio": 0.64,
    "athDiscountPct": 1.3
  },
  {
    "id": "krpls",
    "symbol": "KRPLS",
    "name": "Koroplast Temizlik Ambalaj",
    "sector": "Çöp Torbası & Mutfak Ambalajı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 9.68,
    "currency": "₺",
    "dailyChange": -2.42,
    "peRatio": 4.7,
    "pbRatio": 4.4,
    "dividendYield": 2.1,
    "marketCap": "1.69 Mr ₺",
    "beta": 1.11,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Koroplast Temizlik Ambalaj (KRPLS), Borsa İstanbul'da Çöp Torbası & Mutfak Ambalajı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 11.09,
    "low52": 7.2,
    "dayHigh": 10.21,
    "dayLow": 9.67,
    "openPrice": 9.92,
    "volume": 2450172,
    "avgVolume": 2761279,
    "volumeRatio": 0.89,
    "athDiscountPct": 12.7
  },
  {
    "id": "krvgd",
    "symbol": "KRVGD",
    "name": "Kervan Gıda (Bebeto)",
    "sector": "Yumuşak Şeker İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.4,
    "currency": "₺",
    "dailyChange": -1.23,
    "peRatio": 16,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "5.18 Mr ₺",
    "beta": 0.97,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kervan Gıda (Bebeto) (KRVGD), Borsa İstanbul'da Yumuşak Şeker İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.57,
    "low52": 2.2,
    "dayHigh": 2.45,
    "dayLow": 2.37,
    "openPrice": 2.43,
    "volume": 7540053,
    "avgVolume": 8592610,
    "volumeRatio": 0.88,
    "athDiscountPct": 32.8
  },
  {
    "id": "ktlev",
    "symbol": "KTLEV",
    "name": "Katılımevim Tasarruf Finansman",
    "sector": "Tasarruf Finansmanı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 55,
    "currency": "₺",
    "dailyChange": 5.16,
    "peRatio": 127.9,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "385.00 Mr ₺",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Katılımevim Tasarruf Finansman (KTLEV), Borsa İstanbul'da Tasarruf Finansmanı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 59.08,
    "low52": 2.29,
    "dayHigh": 55,
    "dayLow": 51.8,
    "openPrice": 52.5,
    "volume": 72852551,
    "avgVolume": 110801621,
    "volumeRatio": 0.66,
    "athDiscountPct": 6.9
  },
  {
    "id": "ktskr",
    "symbol": "KTSKR",
    "name": "Kütahya Şeker Fabrikası",
    "sector": "Şeker Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 86.1,
    "currency": "₺",
    "dailyChange": 2.56,
    "peRatio": 7.7,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "3.96 Mr ₺",
    "beta": 1.14,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kütahya Şeker Fabrikası (KTSKR), Borsa İstanbul'da Şeker Üretimi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 151,
    "low52": 62.2,
    "dayHigh": 86.4,
    "dayLow": 83.8,
    "openPrice": 85.2,
    "volume": 498315,
    "avgVolume": 1114287,
    "volumeRatio": 0.45,
    "athDiscountPct": 43
  },
  {
    "id": "kutpo",
    "symbol": "KUTPO",
    "name": "Kütahya Porselen Sanayi",
    "sector": "Porselen Ev & Sofra Eşyası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 83,
    "currency": "₺",
    "dailyChange": 1.72,
    "peRatio": 1383.3,
    "pbRatio": 1.1,
    "dividendYield": 2.8,
    "marketCap": "3.31 Mr ₺",
    "beta": 1.18,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kütahya Porselen Sanayi (KUTPO), Borsa İstanbul'da Porselen Ev & Sofra Eşyası sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 144.2,
    "low52": 79.15,
    "dayHigh": 83.35,
    "dayLow": 81.8,
    "openPrice": 82.2,
    "volume": 112474,
    "avgVolume": 179725,
    "volumeRatio": 0.63,
    "athDiscountPct": 42.4
  },
  {
    "id": "kzbgy",
    "symbol": "KZBGY",
    "name": "Kızılbük GYO",
    "sector": "Termal Turizm & Gayrimenkul",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.04,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 10.2,
    "pbRatio": 3.9,
    "dividendYield": 1.6,
    "marketCap": "8.16 Mr ₺",
    "beta": 1.06,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kızılbük GYO (KZBGY), Borsa İstanbul'da Termal Turizm & Gayrimenkul sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 5.19,
    "low52": 1.95,
    "dayHigh": 2.06,
    "dayLow": 2.03,
    "openPrice": 2.04,
    "volume": 28118658,
    "avgVolume": 53752154,
    "volumeRatio": 0.52,
    "athDiscountPct": 60.7
  },
  {
    "id": "kzgyo",
    "symbol": "KZGYO",
    "name": "Kuzugrup GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 19.75,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 12.7,
    "pbRatio": 1.2,
    "dividendYield": 2.9,
    "marketCap": "29 Mr ₺",
    "beta": 1.19,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kuzugrup GYO (KZGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 29.2,
    "low52": 19.13,
    "dayHigh": 19.98,
    "dayLow": 19.68,
    "openPrice": 19.8,
    "volume": 549743,
    "avgVolume": 1257429,
    "volumeRatio": 0.44,
    "athDiscountPct": 32.4
  },
  {
    "id": "lider",
    "symbol": "LIDER",
    "name": "Lider Filo Oto Kiralama",
    "sector": "Filo Kiralama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 44.26,
    "currency": "₺",
    "dailyChange": -8.1,
    "peRatio": 119.6,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "36.03 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Lider Filo Oto Kiralama (LIDER), Borsa İstanbul'da Filo Kiralama sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 154.1,
    "low52": 38.76,
    "dayHigh": 46.5,
    "dayLow": 43.9,
    "openPrice": 45.1,
    "volume": 27365078,
    "avgVolume": 6556316,
    "volumeRatio": 4.17,
    "athDiscountPct": 71.3
  },
  {
    "id": "lilak",
    "symbol": "LILAK",
    "name": "Lila Kağıt (Sofia & Maylo)",
    "sector": "Temizlik Kağıtları İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 29.12,
    "currency": "₺",
    "dailyChange": -2.02,
    "peRatio": 21.3,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "17.18 Mr ₺",
    "beta": 0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Lila Kağıt (Sofia & Maylo) (LILAK), Borsa İstanbul'da Temizlik Kağıtları İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 43.86,
    "low52": 24.66,
    "dayHigh": 29.98,
    "dayLow": 29,
    "openPrice": 29.72,
    "volume": 1991471,
    "avgVolume": 3234832,
    "volumeRatio": 0.62,
    "athDiscountPct": 33.6
  },
  {
    "id": "link",
    "symbol": "LINK",
    "name": "Link Bilgisayar Sistemleri",
    "sector": "Muhasebe & ERP Yazılımları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.94,
    "currency": "₺",
    "dailyChange": 3.66,
    "peRatio": 14.8,
    "pbRatio": 3,
    "dividendYield": 0.2,
    "marketCap": "5.30 Mr ₺",
    "beta": 0.77,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Link Bilgisayar Sistemleri (LINK), Borsa İstanbul'da Muhasebe & ERP Yazılımları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 18.76,
    "low52": 4.91,
    "dayHigh": 6.25,
    "dayLow": 5.72,
    "openPrice": 5.74,
    "volume": 46816417,
    "avgVolume": 39696656,
    "volumeRatio": 1.18,
    "athDiscountPct": 68.3
  },
  {
    "id": "lkmnh",
    "symbol": "LKMNH",
    "name": "Lokman Hekim Engürüsağ",
    "sector": "Özel Hastaneler & Sağlık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 13.66,
    "currency": "₺",
    "dailyChange": 0.59,
    "peRatio": 21,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "2.95 Mr ₺",
    "beta": 0.93,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Lokman Hekim Engürüsağ (LKMNH), Borsa İstanbul'da Özel Hastaneler & Sağlık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 21.8,
    "low52": 13.14,
    "dayHigh": 13.69,
    "dayLow": 13.48,
    "openPrice": 13.58,
    "volume": 1038285,
    "avgVolume": 1729254,
    "volumeRatio": 0.6,
    "athDiscountPct": 37.3
  },
  {
    "id": "lmkdc",
    "symbol": "LMKDC",
    "name": "Limak Doğu Anadolu Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 24.58,
    "currency": "₺",
    "dailyChange": -0.08,
    "peRatio": 8.3,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "12.69 Mr ₺",
    "beta": 0.78,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Limak Doğu Anadolu Çimento (LMKDC), Borsa İstanbul'da Çimento & Yapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 39.06,
    "low52": 22.06,
    "dayHigh": 24.72,
    "dayLow": 24.22,
    "openPrice": 24.64,
    "volume": 2785689,
    "avgVolume": 5732479,
    "volumeRatio": 0.49,
    "athDiscountPct": 37.1
  },
  {
    "id": "logo",
    "symbol": "LOGO",
    "name": "Logo Yazılım Sanayi",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 136.5,
    "currency": "₺",
    "dailyChange": 1.56,
    "peRatio": 18.9,
    "pbRatio": 3.3,
    "dividendYield": 0.5,
    "marketCap": "12.97 Mr ₺",
    "beta": 0.8,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Logo Yazılım Sanayi (LOGO), Borsa İstanbul'da Savunma & Yüksek Teknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 194.9,
    "low52": 129,
    "dayHigh": 136.6,
    "dayLow": 134.2,
    "openPrice": 134.5,
    "volume": 535713,
    "avgVolume": 726006,
    "volumeRatio": 0.74,
    "athDiscountPct": 30
  },
  {
    "id": "macko",
    "symbol": "MACKO",
    "name": "Mackolik İnternet Hizmetleri",
    "sector": "Dijital Spor Medyası & Reklam",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 33.82,
    "currency": "₺",
    "dailyChange": -2.93,
    "peRatio": 8.6,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "3.38 Mr ₺",
    "beta": 0.78,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Mackolik İnternet Hizmetleri (MACKO), Borsa İstanbul'da Dijital Spor Medyası & Reklam sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 48.1,
    "low52": 23.96,
    "dayHigh": 34.4,
    "dayLow": 32.16,
    "openPrice": 34.4,
    "volume": 1772884,
    "avgVolume": 890704,
    "volumeRatio": 1.99,
    "athDiscountPct": 29.7
  },
  {
    "id": "magen",
    "symbol": "MAGEN",
    "name": "Margün Enerji Üretim",
    "sector": "Güneş Enerjisi Santralleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 35.62,
    "currency": "₺",
    "dailyChange": 2.65,
    "peRatio": 4.7,
    "pbRatio": 0.8,
    "dividendYield": 6,
    "marketCap": "105.08 Mr ₺",
    "beta": 0.75,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Margün Enerji Üretim (MAGEN), Borsa İstanbul'da Güneş Enerjisi Santralleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 68.7,
    "low52": 18.62,
    "dayHigh": 36,
    "dayLow": 34.36,
    "openPrice": 34.5,
    "volume": 14963099,
    "avgVolume": 20028909,
    "volumeRatio": 0.75,
    "athDiscountPct": 48.2
  },
  {
    "id": "makim",
    "symbol": "MAKIM",
    "name": "Makim Makine Teknolojileri",
    "sector": "Hassas Döküm & Turnike",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 15.91,
    "currency": "₺",
    "dailyChange": 0.19,
    "peRatio": 1591,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "1.78 Mr ₺",
    "beta": 0.82,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Makim Makine Teknolojileri (MAKIM), Borsa İstanbul'da Hassas Döküm & Turnike sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 22.98,
    "low52": 14.22,
    "dayHigh": 16.1,
    "dayLow": 15.9,
    "openPrice": 15.9,
    "volume": 434846,
    "avgVolume": 4109853,
    "volumeRatio": 0.11,
    "athDiscountPct": 30.8
  },
  {
    "id": "maktk",
    "symbol": "MAKTK",
    "name": "Makina Takım Endüstrisi",
    "sector": "Kesici Takımlar & Matkap Uçları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 9.66,
    "currency": "₺",
    "dailyChange": 1.36,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "1.93 Mr ₺",
    "beta": 0.91,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Makina Takım Endüstrisi (MAKTK), Borsa İstanbul'da Kesici Takımlar & Matkap Uçları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 22.86,
    "low52": 9.27,
    "dayHigh": 9.81,
    "dayLow": 9.48,
    "openPrice": 9.48,
    "volume": 2569886,
    "avgVolume": 4159474,
    "volumeRatio": 0.62,
    "athDiscountPct": 57.7
  },
  {
    "id": "manas",
    "symbol": "MANAS",
    "name": "Manas Enerji Yönetimi",
    "sector": "Akıllı Sayaç Sistemleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 33.68,
    "currency": "₺",
    "dailyChange": 4.01,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "11.15 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Manas Enerji Yönetimi (MANAS), Borsa İstanbul'da Akıllı Sayaç Sistemleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 35.48,
    "low52": 6.31,
    "dayHigh": 34.08,
    "dayLow": 32.38,
    "openPrice": 32.38,
    "volume": 13328537,
    "avgVolume": 29374527,
    "volumeRatio": 0.45,
    "athDiscountPct": 5.1
  },
  {
    "id": "marbl",
    "symbol": "MARBL",
    "name": "Tureks Turunç Madencilik (Marble)",
    "sector": "Doğaltaş & Mermer İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 12.27,
    "currency": "₺",
    "dailyChange": 1.07,
    "peRatio": 10.7,
    "pbRatio": 1.4,
    "dividendYield": 6.6,
    "marketCap": "2.80 Mr ₺",
    "beta": 0.81,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Tureks Turunç Madencilik (Marble) (MARBL), Borsa İstanbul'da Doğaltaş & Mermer İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 18.41,
    "low52": 11.3,
    "dayHigh": 12.36,
    "dayLow": 12.13,
    "openPrice": 12.14,
    "volume": 1168236,
    "avgVolume": 2616194,
    "volumeRatio": 0.45,
    "athDiscountPct": 33.4
  },
  {
    "id": "mavi",
    "symbol": "MAVI",
    "name": "Mavi Giyim Sanayi",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 38.22,
    "currency": "₺",
    "dailyChange": -1.39,
    "peRatio": 16.3,
    "pbRatio": 2.9,
    "dividendYield": 0.1,
    "marketCap": "29.95 Mr ₺",
    "beta": 0.76,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Mavi Giyim Sanayi (MAVI), Borsa İstanbul'da Perakende & Tüketim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 50.75,
    "low52": 36.7,
    "dayHigh": 38.98,
    "dayLow": 38.22,
    "openPrice": 38.86,
    "volume": 4044975,
    "avgVolume": 4875023,
    "volumeRatio": 0.83,
    "athDiscountPct": 24.7
  },
  {
    "id": "medtr",
    "symbol": "MEDTR",
    "name": "Meditera Tıbbi Malzeme",
    "sector": "Tıbbi Cihaz & Solunum Setleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 25.12,
    "currency": "₺",
    "dailyChange": -0.08,
    "peRatio": 109.2,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "2.38 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Meditera Tıbbi Malzeme (MEDTR), Borsa İstanbul'da Tıbbi Cihaz & Solunum Setleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 34.48,
    "low52": 24.56,
    "dayHigh": 25.56,
    "dayLow": 25,
    "openPrice": 25,
    "volume": 325828,
    "avgVolume": 518327,
    "volumeRatio": 0.63,
    "athDiscountPct": 27.1
  },
  {
    "id": "mekag",
    "symbol": "MEKAG",
    "name": "Meka Beton Santralleri",
    "sector": "Beton Santralleri & Kırma Eleme",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.93,
    "currency": "₺",
    "dailyChange": -0.34,
    "peRatio": 19.7,
    "pbRatio": 4.5,
    "dividendYield": 5.7,
    "marketCap": "2.34 Mr ₺",
    "beta": 1.32,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Meka Beton Santralleri (MEKAG), Borsa İstanbul'da Beton Santralleri & Kırma Eleme sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 8.5,
    "low52": 2.83,
    "dayHigh": 2.99,
    "dayLow": 2.93,
    "openPrice": 2.94,
    "volume": 5498155,
    "avgVolume": 19930863,
    "volumeRatio": 0.28,
    "athDiscountPct": 65.5
  },
  {
    "id": "mgros",
    "symbol": "MGROS",
    "name": "Migros Ticaret A.Ş.",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 555,
    "currency": "₺",
    "dailyChange": 0.54,
    "peRatio": 13.7,
    "pbRatio": 4,
    "dividendYield": 1.7,
    "marketCap": "98.84 Mr ₺",
    "beta": 1.07,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Migros Ticaret A.Ş. (MGROS), Borsa İstanbul'da Perakende & Tüketim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 727,
    "low52": 415.5,
    "dayHigh": 563,
    "dayLow": 550,
    "openPrice": 557,
    "volume": 5441027,
    "avgVolume": 2425886,
    "volumeRatio": 2.24,
    "athDiscountPct": 23.7
  },
  {
    "id": "miatk",
    "symbol": "MIATK",
    "name": "Mia Teknoloji A.Ş.",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 32.94,
    "currency": "₺",
    "dailyChange": 5.37,
    "peRatio": 18.7,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "16.27 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Mia Teknoloji A.Ş. (MIATK), Borsa İstanbul'da Savunma & Yüksek Teknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 57.85,
    "low52": 29.22,
    "dayHigh": 33.3,
    "dayLow": 30.84,
    "openPrice": 31.2,
    "volume": 31645764,
    "avgVolume": 32952561,
    "volumeRatio": 0.96,
    "athDiscountPct": 43.1
  },
  {
    "id": "mogan",
    "symbol": "MOGAN",
    "name": "Mogan Enerji Yatırım",
    "sector": "Rüzgar & Jeotermal Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 19.96,
    "currency": "₺",
    "dailyChange": -0.1,
    "peRatio": 15.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "48.70 Mr ₺",
    "beta": 0.85,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Mogan Enerji Yatırım (MOGAN), Borsa İstanbul'da Rüzgar & Jeotermal Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 21.68,
    "low52": 8.01,
    "dayHigh": 20.92,
    "dayLow": 19.75,
    "openPrice": 20.2,
    "volume": 13627000,
    "avgVolume": 28315257,
    "volumeRatio": 0.48,
    "athDiscountPct": 7.9
  },
  {
    "id": "mpark",
    "symbol": "MPARK",
    "name": "MLP Sağlık (Medical Park)",
    "sector": "Sağlık & Hastane",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 438.25,
    "currency": "₺",
    "dailyChange": 1.92,
    "peRatio": 14.8,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "83.42 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "MLP Sağlık (Medical Park) (MPARK), Borsa İstanbul'da Sağlık & Hastane sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 514,
    "low52": 304,
    "dayHigh": 439.25,
    "dayLow": 424.75,
    "openPrice": 430,
    "volume": 993232,
    "avgVolume": 741437,
    "volumeRatio": 1.34,
    "athDiscountPct": 14.7
  },
  {
    "id": "mtrks",
    "symbol": "MTRKS",
    "name": "Matriks Bilgi Dağıtım Hizmetleri",
    "sector": "Finansal Veri Terminali & Fintek",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 32.5,
    "currency": "₺",
    "dailyChange": 0.43,
    "peRatio": 12.9,
    "pbRatio": 0.9,
    "dividendYield": 2.6,
    "marketCap": "3.18 Mr ₺",
    "beta": 1.16,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Matriks Bilgi Dağıtım Hizmetleri (MTRKS), Borsa İstanbul'da Finansal Veri Terminali & Fintek sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 33.3,
    "low52": 19.79,
    "dayHigh": 33.3,
    "dayLow": 31.12,
    "openPrice": 32.36,
    "volume": 1855754,
    "avgVolume": 1756065,
    "volumeRatio": 1.06,
    "athDiscountPct": 2.4
  },
  {
    "id": "naten",
    "symbol": "NATEN",
    "name": "Naturel Yenilenebilir Enerji",
    "sector": "Güneş Enerjisi Santralleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.62,
    "currency": "₺",
    "dailyChange": 2,
    "peRatio": 80.3,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "4.64 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Naturel Yenilenebilir Enerji (NATEN), Borsa İstanbul'da Güneş Enerjisi Santralleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 11.14,
    "low52": 5.29,
    "dayHigh": 5.75,
    "dayLow": 5.55,
    "openPrice": 5.57,
    "volume": 12814061,
    "avgVolume": 9233378,
    "volumeRatio": 1.39,
    "athDiscountPct": 49.6
  },
  {
    "id": "netas",
    "symbol": "NETAS",
    "name": "Netaş Telekomünikasyon",
    "sector": "Telekom Altyapısı & Bilişim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 62.1,
    "currency": "₺",
    "dailyChange": -1.82,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "4.03 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Netaş Telekomünikasyon (NETAS), Borsa İstanbul'da Telekom Altyapısı & Bilişim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 94.95,
    "low52": 52.45,
    "dayHigh": 63.45,
    "dayLow": 61.8,
    "openPrice": 62.65,
    "volume": 218976,
    "avgVolume": 656897,
    "volumeRatio": 0.33,
    "athDiscountPct": 34.6
  },
  {
    "id": "nthol",
    "symbol": "NTHOL",
    "name": "Net Holding",
    "sector": "Turizm & Otelcilik / Casino",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 46.28,
    "currency": "₺",
    "dailyChange": 1.8,
    "peRatio": 13.3,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "21.11 Mr ₺",
    "beta": 1.04,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Net Holding (NTHOL), Borsa İstanbul'da Turizm & Otelcilik / Casino sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 54.2,
    "low52": 35.12,
    "dayHigh": 46.56,
    "dayLow": 45.4,
    "openPrice": 45.84,
    "volume": 2417177,
    "avgVolume": 2544887,
    "volumeRatio": 0.95,
    "athDiscountPct": 14.6
  },
  {
    "id": "nuhcm",
    "symbol": "NUHCM",
    "name": "Nuh Çimento Sanayi",
    "sector": "Çimento & Klinker İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 218.1,
    "currency": "₺",
    "dailyChange": 0.46,
    "peRatio": 454.4,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "32.76 Mr ₺",
    "beta": 0.94,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Nuh Çimento Sanayi (NUHCM), Borsa İstanbul'da Çimento & Klinker İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 353,
    "low52": 210,
    "dayHigh": 218.9,
    "dayLow": 217,
    "openPrice": 217.2,
    "volume": 31129,
    "avgVolume": 63755,
    "volumeRatio": 0.49,
    "athDiscountPct": 38.2
  },
  {
    "id": "obase",
    "symbol": "OBASE",
    "name": "Obase Bilgisayar ve Danışmanlık",
    "sector": "Perakende Çözümleri & İş Zekası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 39.8,
    "currency": "₺",
    "dailyChange": 1.79,
    "peRatio": 248.8,
    "pbRatio": 1,
    "dividendYield": 6.2,
    "marketCap": "1.81 Mr ₺",
    "beta": 0.77,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Obase Bilgisayar ve Danışmanlık (OBASE), Borsa İstanbul'da Perakende Çözümleri & İş Zekası sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 52.6,
    "low52": 30.4,
    "dayHigh": 40.02,
    "dayLow": 38.7,
    "openPrice": 38.8,
    "volume": 240492,
    "avgVolume": 950425,
    "volumeRatio": 0.25,
    "athDiscountPct": 24.3
  },
  {
    "id": "odas",
    "symbol": "ODAS",
    "name": "Odaş Elektrik Üretim",
    "sector": "Enerji & Madencilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 7.49,
    "currency": "₺",
    "dailyChange": -0.13,
    "peRatio": 35.7,
    "pbRatio": 2.3,
    "dividendYield": 7,
    "marketCap": "10.49 Mr ₺",
    "beta": 1.3,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Odaş Elektrik Üretim (ODAS), Borsa İstanbul'da Enerji & Madencilik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 9.71,
    "low52": 4.97,
    "dayHigh": 7.62,
    "dayLow": 7.36,
    "openPrice": 7.5,
    "volume": 43275679,
    "avgVolume": 85545933,
    "volumeRatio": 0.51,
    "athDiscountPct": 22.9
  },
  {
    "id": "ofsym",
    "symbol": "OFSYM",
    "name": "Ofis Yem Gıda Sanayi",
    "sector": "Karma Yem Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 60.2,
    "currency": "₺",
    "dailyChange": -9.2,
    "peRatio": 32,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "8.80 Mr ₺",
    "beta": 1.13,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ofis Yem Gıda Sanayi (OFSYM), Borsa İstanbul'da Karma Yem Üretimi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 81.2,
    "low52": 49.64,
    "dayHigh": 67.2,
    "dayLow": 60.2,
    "openPrice": 66.25,
    "volume": 2425135,
    "avgVolume": 1906199,
    "volumeRatio": 1.27,
    "athDiscountPct": 25.9
  },
  {
    "id": "oncsm",
    "symbol": "ONCSM",
    "name": "Oncosem Onkolojik Sistemler",
    "sector": "Kanser İlaç Hazırlama Robotları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 242,
    "currency": "₺",
    "dailyChange": -0.12,
    "peRatio": 126.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "5.77 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Oncosem Onkolojik Sistemler (ONCSM), Borsa İstanbul'da Kanser İlaç Hazırlama Robotları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 389.75,
    "low52": 106.9,
    "dayHigh": 247.8,
    "dayLow": 240.2,
    "openPrice": 243,
    "volume": 211217,
    "avgVolume": 440859,
    "volumeRatio": 0.48,
    "athDiscountPct": 37.9
  },
  {
    "id": "orge",
    "symbol": "ORGE",
    "name": "Orge Enerji Elektrik Taahhüt",
    "sector": "Raylı Sistemler & Elektrik Taahhüt",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 110.7,
    "currency": "₺",
    "dailyChange": 9.93,
    "peRatio": 11.8,
    "pbRatio": 2.9,
    "dividendYield": 0.1,
    "marketCap": "8.77 Mr ₺",
    "beta": 0.76,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Orge Enerji Elektrik Taahhüt (ORGE), Borsa İstanbul'da Raylı Sistemler & Elektrik Taahhüt sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 134.1,
    "low52": 64.1,
    "dayHigh": 110.7,
    "dayLow": 106.8,
    "openPrice": 107.5,
    "volume": 1675447,
    "avgVolume": 1579074,
    "volumeRatio": 1.06,
    "athDiscountPct": 17.4
  },
  {
    "id": "osmen",
    "symbol": "OSMEN",
    "name": "Osmanlı Yatırım Menkul",
    "sector": "Aracı Kurum & Portföy",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 7.73,
    "currency": "₺",
    "dailyChange": -2.28,
    "peRatio": 14.9,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "3.10 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Osmanlı Yatırım Menkul (OSMEN), Borsa İstanbul'da Aracı Kurum & Portföy sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 10.99,
    "low52": 6.92,
    "dayHigh": 7.94,
    "dayLow": 7.64,
    "openPrice": 7.91,
    "volume": 2934326,
    "avgVolume": 5852672,
    "volumeRatio": 0.5,
    "athDiscountPct": 29.7
  },
  {
    "id": "otkar",
    "symbol": "OTKAR",
    "name": "Otokar Otomotiv ve Savunma",
    "sector": "Otomotiv & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 311.75,
    "currency": "₺",
    "dailyChange": -2.81,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "37.41 Mr ₺",
    "beta": 1,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Otokar Otomotiv ve Savunma (OTKAR), Borsa İstanbul'da Otomotiv & İhracat sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 581,
    "low52": 270,
    "dayHigh": 321.75,
    "dayLow": 311.75,
    "openPrice": 320,
    "volume": 477002,
    "avgVolume": 1009395,
    "volumeRatio": 0.47,
    "athDiscountPct": 46.3
  },
  {
    "id": "oyakc",
    "symbol": "OYAKC",
    "name": "Oyak Çimento Fabrikaları",
    "sector": "Çimento & Yapı Malzemeleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 21.82,
    "currency": "₺",
    "dailyChange": 1.39,
    "peRatio": 17.2,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "106.08 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Oyak Çimento Fabrikaları (OYAKC), Borsa İstanbul'da Çimento & Yapı Malzemeleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 28.56,
    "low52": 19.4,
    "dayHigh": 22,
    "dayLow": 21.36,
    "openPrice": 21.44,
    "volume": 20207646,
    "avgVolume": 18858036,
    "volumeRatio": 1.07,
    "athDiscountPct": 23.6
  },
  {
    "id": "ozkgy",
    "symbol": "OZKGY",
    "name": "Özak GYO",
    "sector": "Gayrimenkul & Turizm (Ela Excellence)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 12.71,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 12.7,
    "pbRatio": 1.2,
    "dividendYield": 2.9,
    "marketCap": "18.46 Mr ₺",
    "beta": 1.19,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Özak GYO (OZKGY), Borsa İstanbul'da Gayrimenkul & Turizm (Ela Excellence) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 16.48,
    "low52": 11.69,
    "dayHigh": 12.89,
    "dayLow": 12.67,
    "openPrice": 12.73,
    "volume": 3486203,
    "avgVolume": 3989778,
    "volumeRatio": 0.87,
    "athDiscountPct": 22.9
  },
  {
    "id": "papil",
    "symbol": "PAPIL",
    "name": "Papilon Savunma Güvenlik",
    "sector": "Biyometrik Parmak İzi & Balistik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 12.5,
    "currency": "₺",
    "dailyChange": 3.73,
    "peRatio": 1250,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "2.58 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Papilon Savunma Güvenlik (PAPIL), Borsa İstanbul'da Biyometrik Parmak İzi & Balistik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 21.48,
    "low52": 11.1,
    "dayHigh": 12.5,
    "dayLow": 11.96,
    "openPrice": 12.05,
    "volume": 5124878,
    "avgVolume": 10762172,
    "volumeRatio": 0.48,
    "athDiscountPct": 41.8
  },
  {
    "id": "parsn",
    "symbol": "PARSN",
    "name": "Parsan Makina Parçaları",
    "sector": "Ağır Dövme Çelik & Aks Parçaları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 70.95,
    "currency": "₺",
    "dailyChange": 0.21,
    "peRatio": 14.7,
    "pbRatio": 3.6,
    "dividendYield": 1.3,
    "marketCap": "6.16 Mr ₺",
    "beta": 1.03,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Parsan Makina Parçaları (PARSN), Borsa İstanbul'da Ağır Dövme Çelik & Aks Parçaları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 112.8,
    "low52": 68.7,
    "dayHigh": 72.85,
    "dayLow": 70.9,
    "openPrice": 70.9,
    "volume": 301315,
    "avgVolume": 584088,
    "volumeRatio": 0.52,
    "athDiscountPct": 37.1
  },
  {
    "id": "paseu",
    "symbol": "PASEU",
    "name": "Pasifik Eurasia Lojistik",
    "sector": "Demiryolu Taşımacılığı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 169,
    "currency": "₺",
    "dailyChange": 9.03,
    "peRatio": 111.2,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "113.57 Mr ₺",
    "beta": 0.97,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Pasifik Eurasia Lojistik (PASEU), Borsa İstanbul'da Demiryolu Taşımacılığı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 194.8,
    "low52": 84.15,
    "dayHigh": 169,
    "dayLow": 152.3,
    "openPrice": 154.9,
    "volume": 21054041,
    "avgVolume": 11757179,
    "volumeRatio": 1.79,
    "athDiscountPct": 13.2
  },
  {
    "id": "pcilt",
    "symbol": "PCILT",
    "name": "PC İletişim Medya",
    "sector": "Medya Planlama & Reklam",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 30.26,
    "currency": "₺",
    "dailyChange": 3.7,
    "peRatio": 7.6,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "3.58 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "PC İletişim Medya (PCILT), Borsa İstanbul'da Medya Planlama & Reklam sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 40.18,
    "low52": 18.59,
    "dayHigh": 30.62,
    "dayLow": 29.16,
    "openPrice": 29.16,
    "volume": 922454,
    "avgVolume": 2154446,
    "volumeRatio": 0.43,
    "athDiscountPct": 24.7
  },
  {
    "id": "pekgy",
    "symbol": "PEKGY",
    "name": "Peker GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 15.4,
    "currency": "₺",
    "dailyChange": 0.65,
    "peRatio": 32.1,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "77.00 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Peker GYO (PEKGY), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 19.94,
    "low52": 6.29,
    "dayHigh": 15.53,
    "dayLow": 15.25,
    "openPrice": 15.25,
    "volume": 90552504,
    "avgVolume": 160018995,
    "volumeRatio": 0.57,
    "athDiscountPct": 22.8
  },
  {
    "id": "penta",
    "symbol": "PENTA",
    "name": "Penta Teknoloji Ürünleri",
    "sector": "Bilişim Donanım Dağıtıcısı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 13.23,
    "currency": "₺",
    "dailyChange": -0.53,
    "peRatio": 55.1,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "5.21 Mr ₺",
    "beta": 0.91,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Penta Teknoloji Ürünleri (PENTA), Borsa İstanbul'da Bilişim Donanım Dağıtıcısı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 19.5,
    "low52": 12.49,
    "dayHigh": 13.47,
    "dayLow": 13.2,
    "openPrice": 13.44,
    "volume": 1472013,
    "avgVolume": 2349538,
    "volumeRatio": 0.63,
    "athDiscountPct": 32.2
  },
  {
    "id": "petkm",
    "symbol": "PETKM",
    "name": "Petkim Petrokimya Holding",
    "sector": "Kimya & Petrokimya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 19.16,
    "currency": "₺",
    "dailyChange": 1.86,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "48.56 Mr ₺",
    "beta": 1,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Petkim Petrokimya Holding (PETKM), Borsa İstanbul'da Kimya & Petrokimya sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 28.06,
    "low52": 16.12,
    "dayHigh": 19.4,
    "dayLow": 18.83,
    "openPrice": 18.83,
    "volume": 78306590,
    "avgVolume": 78788568,
    "volumeRatio": 0.99,
    "athDiscountPct": 31.7
  },
  {
    "id": "petun",
    "symbol": "PETUN",
    "name": "Pınar Et ve Un Sanayi",
    "sector": "Et & Şarküteri Ürünleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11.11,
    "currency": "₺",
    "dailyChange": 1.65,
    "peRatio": 16.1,
    "pbRatio": 4.4,
    "dividendYield": 2.1,
    "marketCap": "3.37 Mr ₺",
    "beta": 1.11,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Pınar Et ve Un Sanayi (PETUN), Borsa İstanbul'da Et & Şarküteri Ürünleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 15.99,
    "low52": 10.48,
    "dayHigh": 11.12,
    "dayLow": 10.9,
    "openPrice": 10.9,
    "volume": 1223601,
    "avgVolume": 1512197,
    "volumeRatio": 0.81,
    "athDiscountPct": 30.5
  },
  {
    "id": "pgsus",
    "symbol": "PGSUS",
    "name": "Pegasus Hava Taşımacılığı",
    "sector": "Havacılık & Ulaştırma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 151.7,
    "currency": "₺",
    "dailyChange": -0.33,
    "peRatio": 10.7,
    "pbRatio": 1,
    "dividendYield": 2.7,
    "marketCap": "75.85 Mr ₺",
    "beta": 1.17,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Pegasus Hava Taşımacılığı (PGSUS), Borsa İstanbul'da Havacılık & Ulaştırma sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 264.75,
    "low52": 148.4,
    "dayHigh": 153.3,
    "dayLow": 150.6,
    "openPrice": 152.2,
    "volume": 8074426,
    "avgVolume": 10980650,
    "volumeRatio": 0.74,
    "athDiscountPct": 42.7
  },
  {
    "id": "pnsut",
    "symbol": "PNSUT",
    "name": "Pınar Süt Mamülleri",
    "sector": "Süt & Mandıra Ürünleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.39,
    "currency": "₺",
    "dailyChange": 0.19,
    "peRatio": 18.7,
    "pbRatio": 1.8,
    "dividendYield": 3.5,
    "marketCap": "3.27 Mr ₺",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Pınar Süt Mamülleri (PNSUT), Borsa İstanbul'da Süt & Mandıra Ürünleri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 18.98,
    "low52": 9.99,
    "dayHigh": 10.45,
    "dayLow": 10.35,
    "openPrice": 10.37,
    "volume": 857857,
    "avgVolume": 2500307,
    "volumeRatio": 0.34,
    "athDiscountPct": 45.3
  },
  {
    "id": "polho",
    "symbol": "POLHO",
    "name": "Polisan Holding",
    "sector": "Kimya, Boya & Liman",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 22.32,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "16.93 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Polisan Holding (POLHO), Borsa İstanbul'da Kimya, Boya & Liman sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 25.3,
    "low52": 4.12,
    "dayHigh": 22.68,
    "dayLow": 22.24,
    "openPrice": 22.32,
    "volume": 2693769,
    "avgVolume": 3635092,
    "volumeRatio": 0.74,
    "athDiscountPct": 11.8
  },
  {
    "id": "poltk",
    "symbol": "POLTK",
    "name": "Politeknik Metal Sanayi",
    "sector": "Alüminyum Yüzey İşlem Kimyasalları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5005,
    "currency": "₺",
    "dailyChange": 5.09,
    "peRatio": 3336.7,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "18.77 Mr ₺",
    "beta": 1.09,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Politeknik Metal Sanayi (POLTK), Borsa İstanbul'da Alüminyum Yüzey İşlem Kimyasalları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 13252.5,
    "low52": 4182.5,
    "dayHigh": 5165,
    "dayLow": 4805,
    "openPrice": 4925,
    "volume": 27775,
    "avgVolume": 8512,
    "volumeRatio": 3.26,
    "athDiscountPct": 62.2
  },
  {
    "id": "prkab",
    "symbol": "PRKAB",
    "name": "Türk Prysmian Kablo",
    "sector": "Enerji & Telekom Kabloları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 33.24,
    "currency": "₺",
    "dailyChange": 0.12,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "7.17 Mr ₺",
    "beta": 0.83,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Türk Prysmian Kablo (PRKAB), Borsa İstanbul'da Enerji & Telekom Kabloları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 70.95,
    "low52": 29.94,
    "dayHigh": 33.96,
    "dayLow": 33.02,
    "openPrice": 33.2,
    "volume": 413473,
    "avgVolume": 1350759,
    "volumeRatio": 0.31,
    "athDiscountPct": 53.2
  },
  {
    "id": "prkme",
    "symbol": "PRKME",
    "name": "Park Elektrik Üretim Madencilik",
    "sector": "Madencilik & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 19.9,
    "currency": "₺",
    "dailyChange": 4.96,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "2.96 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Park Elektrik Üretim Madencilik (PRKME), Borsa İstanbul'da Madencilik & Enerji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 29.1,
    "low52": 15.9,
    "dayHigh": 20.22,
    "dayLow": 19,
    "openPrice": 19,
    "volume": 3875076,
    "avgVolume": 5108492,
    "volumeRatio": 0.76,
    "athDiscountPct": 31.6
  },
  {
    "id": "psgyo",
    "symbol": "PSGYO",
    "name": "Pasifik GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (Next Level)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.54,
    "currency": "₺",
    "dailyChange": -0.84,
    "peRatio": 12.6,
    "pbRatio": 1,
    "dividendYield": 2.7,
    "marketCap": "24.43 Mr ₺",
    "beta": 1.17,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Pasifik GYO (PSGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (Next Level) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.27,
    "low52": 2.02,
    "dayHigh": 3.64,
    "dayLow": 3.53,
    "openPrice": 3.59,
    "volume": 91892946,
    "avgVolume": 335981277,
    "volumeRatio": 0.27,
    "athDiscountPct": 17.1
  },
  {
    "id": "quagr",
    "symbol": "QUAGR",
    "name": "Qua Granite Hayal Yapı",
    "sector": "Granit & Seramik Kaplama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.18,
    "currency": "₺",
    "dailyChange": -1.85,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "8.40 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Qua Granite Hayal Yapı (QUAGR), Borsa İstanbul'da Granit & Seramik Kaplama sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 11.89,
    "low52": 2.42,
    "dayHigh": 3.29,
    "dayLow": 3.15,
    "openPrice": 3.25,
    "volume": 34715550,
    "avgVolume": 78051047,
    "volumeRatio": 0.44,
    "athDiscountPct": 73.3
  },
  {
    "id": "ralyh",
    "symbol": "RALYH",
    "name": "Ral Yatırım Holding",
    "sector": "İnşaat, Enerji & Eğitim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 267,
    "currency": "₺",
    "dailyChange": 6.8,
    "peRatio": 91.8,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "88.91 Mr ₺",
    "beta": 0.99,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Ral Yatırım Holding (RALYH), Borsa İstanbul'da İnşaat, Enerji & Eğitim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 401.75,
    "low52": 118.1,
    "dayHigh": 271.25,
    "dayLow": 248.2,
    "openPrice": 250.5,
    "volume": 2605568,
    "avgVolume": 3685433,
    "volumeRatio": 0.71,
    "athDiscountPct": 33.5
  },
  {
    "id": "raysg",
    "symbol": "RAYSG",
    "name": "Ray Sigorta",
    "sector": "Elementer Sigortacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 163,
    "currency": "₺",
    "dailyChange": 1.18,
    "peRatio": 7.4,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "26.58 Mr ₺",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ray Sigorta (RAYSG), Borsa İstanbul'da Elementer Sigortacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 297,
    "low52": 158.5,
    "dayHigh": 163.5,
    "dayLow": 161.4,
    "openPrice": 162,
    "volume": 77236,
    "avgVolume": 227854,
    "volumeRatio": 0.34,
    "athDiscountPct": 45.1
  },
  {
    "id": "reedr",
    "symbol": "REEDR",
    "name": "Reeder Teknoloji",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6,
    "currency": "₺",
    "dailyChange": 0.67,
    "peRatio": 14.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "5.70 Mr ₺",
    "beta": 0.85,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Reeder Teknoloji (REEDR), Borsa İstanbul'da Savunma & Yüksek Teknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 12.42,
    "low52": 5.69,
    "dayHigh": 6.18,
    "dayLow": 5.96,
    "openPrice": 5.96,
    "volume": 18950926,
    "avgVolume": 22875030,
    "volumeRatio": 0.83,
    "athDiscountPct": 51.7
  },
  {
    "id": "rnpol",
    "symbol": "RNPOL",
    "name": "Rainbow Polikarbonat",
    "sector": "Polikarbonat Levha Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.55,
    "currency": "₺",
    "dailyChange": 2,
    "peRatio": 21.7,
    "pbRatio": 4.3,
    "dividendYield": 2,
    "marketCap": "1.53 Mr ₺",
    "beta": 1.1,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Rainbow Polikarbonat (RNPOL), Borsa İstanbul'da Polikarbonat Levha Üretimi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.38,
    "low52": 1.75,
    "dayHigh": 2.56,
    "dayLow": 2.46,
    "openPrice": 2.5,
    "volume": 2765491,
    "avgVolume": 3672105,
    "volumeRatio": 0.75,
    "athDiscountPct": 24.6
  },
  {
    "id": "rysas",
    "symbol": "RYSAS",
    "name": "Reysaş Taşımacılık Lojistik",
    "sector": "Depoculuk & Lojistik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 23.88,
    "currency": "₺",
    "dailyChange": -2.93,
    "peRatio": 12.8,
    "pbRatio": 1,
    "dividendYield": 2.7,
    "marketCap": "47.76 Mr ₺",
    "beta": 1.17,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Reysaş Taşımacılık Lojistik (RYSAS), Borsa İstanbul'da Depoculuk & Lojistik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 28.34,
    "low52": 13.44,
    "dayHigh": 24.8,
    "dayLow": 23.64,
    "openPrice": 24.8,
    "volume": 2488528,
    "avgVolume": 11527699,
    "volumeRatio": 0.22,
    "athDiscountPct": 15.7
  },
  {
    "id": "safkr",
    "symbol": "SAFKR",
    "name": "Safkar Ege Soğutmacılık",
    "sector": "Mobil İklimlendirme & Soğutma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 20.5,
    "currency": "₺",
    "dailyChange": 1.99,
    "peRatio": 28.9,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "4.10 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Safkar Ege Soğutmacılık (SAFKR), Borsa İstanbul'da Mobil İklimlendirme & Soğutma sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 30.74,
    "low52": 18.16,
    "dayHigh": 20.5,
    "dayLow": 20.04,
    "openPrice": 20.1,
    "volume": 3042619,
    "avgVolume": 4578725,
    "volumeRatio": 0.66,
    "athDiscountPct": 33.3
  },
  {
    "id": "sahol",
    "symbol": "SAHOL",
    "name": "Hacı Ömer Sabancı Holding",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 89.4,
    "currency": "₺",
    "dailyChange": 0.68,
    "peRatio": 23.1,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "184.86 Mr ₺",
    "beta": 0.9,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Hacı Ömer Sabancı Holding (SAHOL), Borsa İstanbul'da Holding & Yatırım sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 115,
    "low52": 73.9,
    "dayHigh": 90.5,
    "dayLow": 88.6,
    "openPrice": 88.85,
    "volume": 51389456,
    "avgVolume": 33091494,
    "volumeRatio": 1.55,
    "athDiscountPct": 22.3
  },
  {
    "id": "sarky",
    "symbol": "SARKY",
    "name": "Sarkuysan Elektrolitik Bakır",
    "sector": "Bakır Tel & Boru İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 26.02,
    "currency": "₺",
    "dailyChange": 1.64,
    "peRatio": 74.3,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "26.02 Mr ₺",
    "beta": 1.09,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Sarkuysan Elektrolitik Bakır (SARKY), Borsa İstanbul'da Bakır Tel & Boru İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 51.6,
    "low52": 12,
    "dayHigh": 26.16,
    "dayLow": 25.36,
    "openPrice": 25.4,
    "volume": 3658741,
    "avgVolume": 8573600,
    "volumeRatio": 0.43,
    "athDiscountPct": 49.6
  },
  {
    "id": "sasa",
    "symbol": "SASA",
    "name": "SASA Polyester Sanayi",
    "sector": "Kimya & Petrokimya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 2.39,
    "currency": "₺",
    "dailyChange": -2.45,
    "peRatio": 12.7,
    "pbRatio": 2.4,
    "dividendYield": 7.1,
    "marketCap": "125.48 Mr ₺",
    "beta": 1.31,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "SASA Polyester Sanayi (SASA), Borsa İstanbul'da Kimya & Petrokimya sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 5.66,
    "low52": 2.13,
    "dayHigh": 2.48,
    "dayLow": 2.39,
    "openPrice": 2.46,
    "volume": 2317523250,
    "avgVolume": 212613804,
    "volumeRatio": 10.9,
    "athDiscountPct": 57.8
  },
  {
    "id": "sayas",
    "symbol": "SAYAS",
    "name": "Say Yenilenebilir Enerji",
    "sector": "Rüzgar Türbini İç Aksamları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 58.55,
    "currency": "₺",
    "dailyChange": 3.45,
    "peRatio": 24.9,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "4.52 Mr ₺",
    "beta": 1,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Say Yenilenebilir Enerji (SAYAS), Borsa İstanbul'da Rüzgar Türbini İç Aksamları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 71.5,
    "low52": 36.4,
    "dayHigh": 59.2,
    "dayLow": 56.05,
    "openPrice": 56.05,
    "volume": 2883320,
    "avgVolume": 2671148,
    "volumeRatio": 1.08,
    "athDiscountPct": 18.1
  },
  {
    "id": "sdttr",
    "symbol": "SDTTR",
    "name": "SDT Uzay ve Savunma",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 253.75,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 120.3,
    "pbRatio": 0.9,
    "dividendYield": 2.6,
    "marketCap": "14.72 Mr ₺",
    "beta": 1.16,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "SDT Uzay ve Savunma (SDTTR), Borsa İstanbul'da Savunma & Yüksek Teknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 300,
    "low52": 173.3,
    "dayHigh": 273,
    "dayLow": 250.25,
    "openPrice": 269.25,
    "volume": 1813295,
    "avgVolume": 1065257,
    "volumeRatio": 1.7,
    "athDiscountPct": 15.4
  },
  {
    "id": "selec",
    "symbol": "SELEC",
    "name": "Selçuk Ecza Deposu",
    "sector": "İlaç Dağıtım Depoculuğu",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 251,
    "currency": "₺",
    "dailyChange": 1.83,
    "peRatio": 134.9,
    "pbRatio": 1.2,
    "dividendYield": 6.4,
    "marketCap": "155.87 Mr ₺",
    "beta": 0.79,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Selçuk Ecza Deposu (SELEC), Borsa İstanbul'da İlaç Dağıtım Depoculuğu sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 278,
    "low52": 66.35,
    "dayHigh": 253.25,
    "dayLow": 244.5,
    "openPrice": 248,
    "volume": 2525349,
    "avgVolume": 4422120,
    "volumeRatio": 0.57,
    "athDiscountPct": 9.7
  },
  {
    "id": "silvr",
    "symbol": "SILVR",
    "name": "Silverline Endüstri",
    "sector": "Ankastre Mutfak Cihazları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.27,
    "currency": "₺",
    "dailyChange": 0.44,
    "peRatio": 8.7,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "794.5 M ₺",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Silverline Endüstri (SILVR), Borsa İstanbul'da Ankastre Mutfak Cihazları sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.59,
    "low52": 2.14,
    "dayHigh": 2.3,
    "dayLow": 2.22,
    "openPrice": 2.26,
    "volume": 1136554,
    "avgVolume": 2055878,
    "volumeRatio": 0.55,
    "athDiscountPct": 36.8
  },
  {
    "id": "sise",
    "symbol": "SISE",
    "name": "Türkiye Şişe ve Cam Fabrikaları",
    "sector": "Cam & Temel Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 41.4,
    "currency": "₺",
    "dailyChange": -0.58,
    "peRatio": 11,
    "pbRatio": 3.6,
    "dividendYield": 0.8,
    "marketCap": "123.89 Mr ₺",
    "beta": 0.83,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Türkiye Şişe ve Cam Fabrikaları (SISE), Borsa İstanbul'da Cam & Temel Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 54.1,
    "low52": 32.44,
    "dayHigh": 42.58,
    "dayLow": 41.32,
    "openPrice": 41.9,
    "volume": 56283196,
    "avgVolume": 48704796,
    "volumeRatio": 1.16,
    "athDiscountPct": 23.5
  },
  {
    "id": "skbnk",
    "symbol": "SKBNK",
    "name": "Şekerbank T.A.Ş.",
    "sector": "Bankacılık & Tarım Kredileri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.97,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 4.5,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "14.92 Mr ₺",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Şekerbank T.A.Ş. (SKBNK), Borsa İstanbul'da Bankacılık & Tarım Kredileri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 20,
    "low52": 5.81,
    "dayHigh": 6.05,
    "dayLow": 5.97,
    "openPrice": 6.02,
    "volume": 54531473,
    "avgVolume": 75470995,
    "volumeRatio": 0.72,
    "athDiscountPct": 70.2
  },
  {
    "id": "smrtg",
    "symbol": "SMRTG",
    "name": "Smart Güneş Enerjisi Teknolojileri",
    "sector": "Güneş Paneli & EPC",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.55,
    "currency": "₺",
    "dailyChange": 0.96,
    "peRatio": 1055,
    "pbRatio": 4.5,
    "dividendYield": 2.2,
    "marketCap": "19.18 Mr ₺",
    "beta": 1.12,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Smart Güneş Enerjisi Teknolojileri (SMRTG), Borsa İstanbul'da Güneş Paneli & EPC sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 13.33,
    "low52": 6.27,
    "dayHigh": 10.71,
    "dayLow": 10.36,
    "openPrice": 10.45,
    "volume": 17538337,
    "avgVolume": 43375467,
    "volumeRatio": 0.4,
    "athDiscountPct": 20.9
  },
  {
    "id": "sngyo",
    "symbol": "SNGYO",
    "name": "Sinpaş GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.24,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 14.7,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "12.95 Mr ₺",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Sinpaş GYO (SNGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 5.45,
    "low52": 3.05,
    "dayHigh": 3.29,
    "dayLow": 3.23,
    "openPrice": 3.24,
    "volume": 9347804,
    "avgVolume": 21746974,
    "volumeRatio": 0.43,
    "athDiscountPct": 40.6
  },
  {
    "id": "sokm",
    "symbol": "SOKM",
    "name": "Şok Marketler Ticaret",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 52.7,
    "currency": "₺",
    "dailyChange": -0.09,
    "peRatio": 12.7,
    "pbRatio": 4.2,
    "dividendYield": 1.4,
    "marketCap": "31.27 Mr ₺",
    "beta": 0.89,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Şok Marketler Ticaret (SOKM), Borsa İstanbul'da Perakende & Tüketim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 70.25,
    "low52": 34.36,
    "dayHigh": 53.8,
    "dayLow": 52.5,
    "openPrice": 53.15,
    "volume": 4291160,
    "avgVolume": 6341167,
    "volumeRatio": 0.68,
    "athDiscountPct": 25
  },
  {
    "id": "surgy",
    "symbol": "SURGY",
    "name": "Sur Tatil Evleri GYO",
    "sector": "Devremülk & Tatil Köyü GYO",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 39.92,
    "currency": "₺",
    "dailyChange": -0.6,
    "peRatio": 18.7,
    "pbRatio": 1.8,
    "dividendYield": 3.5,
    "marketCap": "6.69 Mr ₺",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Sur Tatil Evleri GYO (SURGY), Borsa İstanbul'da Devremülk & Tatil Köyü GYO sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 88.3,
    "low52": 38.54,
    "dayHigh": 40.5,
    "dayLow": 38.54,
    "openPrice": 39.5,
    "volume": 8516135,
    "avgVolume": 3223460,
    "volumeRatio": 2.64,
    "athDiscountPct": 54.8
  },
  {
    "id": "suwen",
    "symbol": "SUWEN",
    "name": "Suwen Tekstil Sanayi",
    "sector": "Kadın İç Giyim & Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.45,
    "currency": "₺",
    "dailyChange": -1.83,
    "peRatio": 10.7,
    "pbRatio": 1,
    "dividendYield": 2.7,
    "marketCap": "2.54 Mr ₺",
    "beta": 1.17,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Suwen Tekstil Sanayi (SUWEN), Borsa İstanbul'da Kadın İç Giyim & Perakende sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 12.54,
    "low52": 5.86,
    "dayHigh": 6.7,
    "dayLow": 6.45,
    "openPrice": 6.7,
    "volume": 1987253,
    "avgVolume": 4548336,
    "volumeRatio": 0.44,
    "athDiscountPct": 48.6
  },
  {
    "id": "tabgd",
    "symbol": "TABGD",
    "name": "TAB Gıda Sanayi (Burger King)",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 262,
    "currency": "₺",
    "dailyChange": 0.77,
    "peRatio": 27.9,
    "pbRatio": 4.2,
    "dividendYield": 5.4,
    "marketCap": "68.46 Mr ₺",
    "beta": 1.29,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "TAB Gıda Sanayi (Burger King) (TABGD), Borsa İstanbul'da Perakende & Tüketim sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 295,
    "low52": 201.9,
    "dayHigh": 264,
    "dayLow": 256,
    "openPrice": 260,
    "volume": 906068,
    "avgVolume": 1064106,
    "volumeRatio": 0.85,
    "athDiscountPct": 11.2
  },
  {
    "id": "tarkm",
    "symbol": "TARKM",
    "name": "Tarkim Bitki Koruma",
    "sector": "Tarım Kimyasalları & Zirai İlaç",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 446,
    "currency": "₺",
    "dailyChange": -0.45,
    "peRatio": 719.4,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "9.37 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Tarkim Bitki Koruma (TARKM), Borsa İstanbul'da Tarım Kimyasalları & Zirai İlaç sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 621.5,
    "low52": 322,
    "dayHigh": 455,
    "dayLow": 439.5,
    "openPrice": 449.25,
    "volume": 110340,
    "avgVolume": 185837,
    "volumeRatio": 0.59,
    "athDiscountPct": 28.2
  },
  {
    "id": "taten",
    "symbol": "TATEN",
    "name": "Tatl色がp Enerji",
    "sector": "Rüzgar & Hidroelektrik Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.56,
    "currency": "₺",
    "dailyChange": 0.23,
    "peRatio": 42.8,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "9.57 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Tatl色がp Enerji (TATEN), Borsa İstanbul'da Rüzgar & Hidroelektrik Enerjisi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 23.89,
    "low52": 8.16,
    "dayHigh": 8.8,
    "dayLow": 8.48,
    "openPrice": 8.54,
    "volume": 25898274,
    "avgVolume": 30422263,
    "volumeRatio": 0.85,
    "athDiscountPct": 64.2
  },
  {
    "id": "tatgd",
    "symbol": "TATGD",
    "name": "Tat Gıda Sanayi",
    "sector": "Salça, Konserve & Sos Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 18.6,
    "currency": "₺",
    "dailyChange": 3.51,
    "peRatio": 7.7,
    "pbRatio": 2,
    "dividendYield": 7.2,
    "marketCap": "4.55 Mr ₺",
    "beta": 0.87,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Tat Gıda Sanayi (TATGD), Borsa İstanbul'da Salça, Konserve & Sos Üretimi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 23.34,
    "low52": 11.65,
    "dayHigh": 18.93,
    "dayLow": 17.98,
    "openPrice": 17.98,
    "volume": 2954670,
    "avgVolume": 2916044,
    "volumeRatio": 1.01,
    "athDiscountPct": 20.3
  },
  {
    "id": "tavhl",
    "symbol": "TAVHL",
    "name": "TAV Havalimanları Holding",
    "sector": "Havacılık & Ulaştırma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 276,
    "currency": "₺",
    "dailyChange": -0.99,
    "peRatio": 16.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "100.27 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "TAV Havalimanları Holding (TAVHL), Borsa İstanbul'da Havacılık & Ulaştırma sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 369,
    "low52": 217.6,
    "dayHigh": 282.25,
    "dayLow": 276,
    "openPrice": 278.75,
    "volume": 2071500,
    "avgVolume": 3797506,
    "volumeRatio": 0.55,
    "athDiscountPct": 25.2
  },
  {
    "id": "tcell",
    "symbol": "TCELL",
    "name": "Turkcell İletişim Hizmetleri",
    "sector": "Telekomünikasyon & Dijital",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 104.1,
    "currency": "₺",
    "dailyChange": 0.97,
    "peRatio": 12.7,
    "pbRatio": 2,
    "dividendYield": 7.2,
    "marketCap": "226.57 Mr ₺",
    "beta": 0.87,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "Turkcell İletişim Hizmetleri (TCELL), Borsa İstanbul'da Telekomünikasyon & Dijital sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 129.6,
    "low52": 87.05,
    "dayHigh": 105.4,
    "dayLow": 103.2,
    "openPrice": 103.9,
    "volume": 35330035,
    "avgVolume": 24178776,
    "volumeRatio": 1.46,
    "athDiscountPct": 19.7
  },
  {
    "id": "tezol",
    "symbol": "TEZOL",
    "name": "Europap Tezol Kağıt",
    "sector": "Temizlik Kağıtları Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 9.86,
    "currency": "₺",
    "dailyChange": 0.61,
    "peRatio": 32.9,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "4.93 Mr ₺",
    "beta": 1.13,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Europap Tezol Kağıt (TEZOL), Borsa İstanbul'da Temizlik Kağıtları Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 20.26,
    "low52": 9.22,
    "dayHigh": 10.16,
    "dayLow": 9.79,
    "openPrice": 9.79,
    "volume": 5150953,
    "avgVolume": 6126622,
    "volumeRatio": 0.84,
    "athDiscountPct": 51.3
  },
  {
    "id": "thyao",
    "symbol": "THYAO",
    "name": "Türk Hava Yolları A.O.",
    "sector": "Havacılık & Ulaştırma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 305.25,
    "currency": "₺",
    "dailyChange": -0.89,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "418.89 Mr ₺",
    "beta": 1.04,
    "recommendation": "TUT",
    "inWatchlist": true,
    "description": "Türk Hava Yolları A.O. (THYAO), Borsa İstanbul'da Havacılık & Ulaştırma sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 355.5,
    "low52": 262.75,
    "dayHigh": 309.5,
    "dayLow": 305.25,
    "openPrice": 308.5,
    "volume": 33086500,
    "avgVolume": 48224926,
    "volumeRatio": 0.69,
    "athDiscountPct": 14.1
  },
  {
    "id": "tkfen",
    "symbol": "TKFEN",
    "name": "Tekfen Holding",
    "sector": "Taahhüt, Mühendislik & Gübre (Toros)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 236,
    "currency": "₺",
    "dailyChange": 2.16,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "87.08 Mr ₺",
    "beta": 0.91,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Tekfen Holding (TKFEN), Borsa İstanbul'da Taahhüt, Mühendislik & Gübre (Toros) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 245,
    "low52": 67,
    "dayHigh": 243.1,
    "dayLow": 228,
    "openPrice": 230.8,
    "volume": 12665577,
    "avgVolume": 6395714,
    "volumeRatio": 1.98,
    "athDiscountPct": 3.7
  },
  {
    "id": "tknsa",
    "symbol": "TKNSA",
    "name": "Teknosa İç ve Dış Ticaret",
    "sector": "Tüketici Elektroniği Perakendesi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 17.95,
    "currency": "₺",
    "dailyChange": 9.99,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "3.61 Mr ₺",
    "beta": 1,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Teknosa İç ve Dış Ticaret (TKNSA), Borsa İstanbul'da Tüketici Elektroniği Perakendesi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 29.76,
    "low52": 15.71,
    "dayHigh": 17.95,
    "dayLow": 16.21,
    "openPrice": 16.32,
    "volume": 8004722,
    "avgVolume": 2627711,
    "volumeRatio": 3.05,
    "athDiscountPct": 39.7
  },
  {
    "id": "tlman",
    "symbol": "TLMAN",
    "name": "Trabzon Liman İşletmeciliği",
    "sector": "Liman İşletmeciliği & Lojistik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 79.7,
    "currency": "₺",
    "dailyChange": -0.44,
    "peRatio": 29.6,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "1.67 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Trabzon Liman İşletmeciliği (TLMAN), Borsa İstanbul'da Liman İşletmeciliği & Lojistik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 119.3,
    "low52": 76.95,
    "dayHigh": 80.7,
    "dayLow": 79.65,
    "openPrice": 80.05,
    "volume": 109809,
    "avgVolume": 296057,
    "volumeRatio": 0.37,
    "athDiscountPct": 33.2
  },
  {
    "id": "tmsn",
    "symbol": "TMSN",
    "name": "Tümosan Motor ve Traktör",
    "sector": "Dizel Motor & Traktör İmalatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 77.55,
    "currency": "₺",
    "dailyChange": 0.52,
    "peRatio": 20.7,
    "pbRatio": 1,
    "dividendYield": 2.2,
    "marketCap": "8.92 Mr ₺",
    "beta": 0.97,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Tümosan Motor ve Traktör (TMSN), Borsa İstanbul'da Dizel Motor & Traktör İmalatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 136.8,
    "low52": 76.35,
    "dayHigh": 78,
    "dayLow": 77.2,
    "openPrice": 77.2,
    "volume": 348888,
    "avgVolume": 677541,
    "volumeRatio": 0.51,
    "athDiscountPct": 43.3
  },
  {
    "id": "tnztp",
    "symbol": "TNZTP",
    "name": "Tapdi Oksijen Özel Sağlık (Tınaztepe)",
    "sector": "Özel Hastaneler & Sağlık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 27.96,
    "currency": "₺",
    "dailyChange": -0.14,
    "peRatio": 16.4,
    "pbRatio": 2.4,
    "dividendYield": 4.1,
    "marketCap": "11.18 Mr ₺",
    "beta": 1.31,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Tapdi Oksijen Özel Sağlık (Tınaztepe) (TNZTP), Borsa İstanbul'da Özel Hastaneler & Sağlık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 33.32,
    "low52": 20.08,
    "dayHigh": 28.3,
    "dayLow": 27.34,
    "openPrice": 28,
    "volume": 5648677,
    "avgVolume": 2663773,
    "volumeRatio": 2.12,
    "athDiscountPct": 16.1
  },
  {
    "id": "toaso",
    "symbol": "TOASO",
    "name": "Tofaş Türk Otomobil Fabrikası",
    "sector": "Otomotiv & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 268.5,
    "currency": "₺",
    "dailyChange": -0.46,
    "peRatio": 10.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "134.25 Mr ₺",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Tofaş Türk Otomobil Fabrikası (TOASO), Borsa İstanbul'da Otomotiv & İhracat sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 358.25,
    "low52": 220.4,
    "dayHigh": 275,
    "dayLow": 265,
    "openPrice": 269.75,
    "volume": 3794204,
    "avgVolume": 3691062,
    "volumeRatio": 1.03,
    "athDiscountPct": 25.1
  },
  {
    "id": "trcas",
    "symbol": "TRCAS",
    "name": "Turcas Petrol",
    "sector": "Akaryakıt Dağıtım (Shell Ortaklığı)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 46.56,
    "currency": "₺",
    "dailyChange": 5.01,
    "peRatio": 8.4,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "11.51 Mr ₺",
    "beta": 0.96,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Turcas Petrol (TRCAS), Borsa İstanbul'da Akaryakıt Dağıtım (Shell Ortaklığı) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 55.95,
    "low52": 33.34,
    "dayHigh": 46.7,
    "dayLow": 44.34,
    "openPrice": 44.34,
    "volume": 1622716,
    "avgVolume": 870188,
    "volumeRatio": 1.86,
    "athDiscountPct": 16.8
  },
  {
    "id": "trgyo",
    "symbol": "TRGYO",
    "name": "Torunlar GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (Mall of Istanbul)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 93.45,
    "currency": "₺",
    "dailyChange": 1.58,
    "peRatio": 11.2,
    "pbRatio": 1.3,
    "dividendYield": 3,
    "marketCap": "93.45 Mr ₺",
    "beta": 1.2,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Torunlar GYO (TRGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (Mall of Istanbul) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 107.8,
    "low52": 67.9,
    "dayHigh": 94.15,
    "dayLow": 91.65,
    "openPrice": 92,
    "volume": 1742499,
    "avgVolume": 1659435,
    "volumeRatio": 1.05,
    "athDiscountPct": 13.3
  },
  {
    "id": "trilm",
    "symbol": "TRILM",
    "name": "Türk İlaç ve Serum Sanayi",
    "sector": "Aşı & Serum İmalatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 407.32,
    "currency": "₺",
    "dailyChange": -0.8,
    "peRatio": 18.7,
    "pbRatio": 4,
    "dividendYield": 1.7,
    "marketCap": "17 Mr ₺",
    "beta": 1.07,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Türk İlaç ve Serum Sanayi (TRILM), Borsa İstanbul'da Aşı & Serum İmalatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4",
        "peerAvg": "1.80"
      }
    ]
  },
  {
    "id": "tskb",
    "symbol": "TSKB",
    "name": "Türkiye Sınai Kalkınma Bankası",
    "sector": "Kalkınma & Yatırım Bankası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11,
    "currency": "₺",
    "dailyChange": 0.46,
    "peRatio": 2.9,
    "pbRatio": 3.6,
    "dividendYield": 0.8,
    "marketCap": "30.80 Mr ₺",
    "beta": 0.83,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Türkiye Sınai Kalkınma Bankası (TSKB), Borsa İstanbul'da Kalkınma & Yatırım Bankası sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14.73,
    "low52": 10.69,
    "dayHigh": 11.09,
    "dayLow": 10.95,
    "openPrice": 10.95,
    "volume": 9293323,
    "avgVolume": 20187909,
    "volumeRatio": 0.46,
    "athDiscountPct": 25.3
  },
  {
    "id": "ttkom",
    "symbol": "TTKOM",
    "name": "Türk Telekomünikasyon",
    "sector": "Telekomünikasyon & Altyapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 54.5,
    "currency": "₺",
    "dailyChange": -0.82,
    "peRatio": 7.2,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "190.75 Mr ₺",
    "beta": 1.14,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Türk Telekomünikasyon (TTKOM), Borsa İstanbul'da Telekomünikasyon & Altyapı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 75.65,
    "low52": 47.48,
    "dayHigh": 55.5,
    "dayLow": 54.3,
    "openPrice": 54.8,
    "volume": 36113082,
    "avgVolume": 36127449,
    "volumeRatio": 1,
    "athDiscountPct": 28
  },
  {
    "id": "ttrak",
    "symbol": "TTRAK",
    "name": "Türk Traktör ve Ziraat Makineleri",
    "sector": "Otomotiv & Traktör İmalatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 414,
    "currency": "₺",
    "dailyChange": 0.73,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "41.43 Mr ₺",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Türk Traktör ve Ziraat Makineleri (TTRAK), Borsa İstanbul'da Otomotiv & Traktör İmalatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 652,
    "low52": 398.75,
    "dayHigh": 415.75,
    "dayLow": 407,
    "openPrice": 411,
    "volume": 116875,
    "avgVolume": 145045,
    "volumeRatio": 0.81,
    "athDiscountPct": 36.5
  },
  {
    "id": "tuclk",
    "symbol": "TUCLK",
    "name": "Tuğçelik Alüminyum ve Metal",
    "sector": "Otomotiv Parçaları & Alüminyum",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 3.82,
    "currency": "₺",
    "dailyChange": 0.26,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "1.38 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Tuğçelik Alüminyum ve Metal (TUCLK), Borsa İstanbul'da Otomotiv Parçaları & Alüminyum sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 13.34,
    "low52": 3.67,
    "dayHigh": 3.87,
    "dayLow": 3.78,
    "openPrice": 3.87,
    "volume": 3132547,
    "avgVolume": 9523677,
    "volumeRatio": 0.33,
    "athDiscountPct": 71.4
  },
  {
    "id": "tukas",
    "symbol": "TUKAS",
    "name": "Tukaş Gıda Sanayi",
    "sector": "Salça & Konserve İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.98,
    "currency": "₺",
    "dailyChange": -0.5,
    "peRatio": 18,
    "pbRatio": 4,
    "dividendYield": 1.7,
    "marketCap": "8.91 Mr ₺",
    "beta": 1.07,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Tukaş Gıda Sanayi (TUKAS), Borsa İstanbul'da Salça & Konserve İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.3,
    "low52": 1.93,
    "dayHigh": 2.02,
    "dayLow": 1.97,
    "openPrice": 1.99,
    "volume": 54450192,
    "avgVolume": 80442139,
    "volumeRatio": 0.68,
    "athDiscountPct": 54
  },
  {
    "id": "tuprs",
    "symbol": "TUPRS",
    "name": "Tüpraş Türkiye Petrol Rafinerileri",
    "sector": "Enerji & Rafineri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 361.75,
    "currency": "₺",
    "dailyChange": 4.55,
    "peRatio": 10.3,
    "pbRatio": 2.2,
    "dividendYield": 3.9,
    "marketCap": "697.02 Mr ₺",
    "beta": 1.29,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Tüpraş Türkiye Petrol Rafinerileri (TUPRS), Borsa İstanbul'da Enerji & Rafineri sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 364.5,
    "low52": 159.4,
    "dayHigh": 364.5,
    "dayLow": 345.75,
    "openPrice": 350,
    "volume": 34621634,
    "avgVolume": 25506798,
    "volumeRatio": 1.36,
    "athDiscountPct": 0.8
  },
  {
    "id": "tursg",
    "symbol": "TURSG",
    "name": "Türkiye Sigorta A.Ş.",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 6.28,
    "currency": "₺",
    "dailyChange": 0.96,
    "peRatio": 5.9,
    "pbRatio": 1.3,
    "dividendYield": 3,
    "marketCap": "125.60 Mr ₺",
    "beta": 1.2,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Türkiye Sigorta A.Ş. (TURSG), Borsa İstanbul'da Sigorta & Emeklilik sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 7.5,
    "low52": 4.33,
    "dayHigh": 6.33,
    "dayLow": 6.22,
    "openPrice": 6.22,
    "volume": 41338689,
    "avgVolume": 77738465,
    "volumeRatio": 0.53,
    "athDiscountPct": 16.3
  },
  {
    "id": "ulker",
    "symbol": "ULKER",
    "name": "Ülker Bisküvi Sanayi",
    "sector": "Gıda & İçecek",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 90.7,
    "currency": "₺",
    "dailyChange": 3.07,
    "peRatio": 10.1,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "33.49 Mr ₺",
    "beta": 1.02,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Ülker Bisküvi Sanayi (ULKER), Borsa İstanbul'da Gıda & İçecek sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 141.7,
    "low52": 84.9,
    "dayHigh": 90.85,
    "dayLow": 87.95,
    "openPrice": 88.25,
    "volume": 7190090,
    "avgVolume": 5684042,
    "volumeRatio": 1.26,
    "athDiscountPct": 36
  },
  {
    "id": "uluun",
    "symbol": "ULUUN",
    "name": "Ulusoy Un Sanayi",
    "sector": "Un İhracatı & Hububat Ticareti",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 8.36,
    "currency": "₺",
    "dailyChange": 3.21,
    "peRatio": 104.5,
    "pbRatio": 1.7,
    "dividendYield": 3.4,
    "marketCap": "6.27 Mr ₺",
    "beta": 1.24,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ulusoy Un Sanayi (ULUUN), Borsa İstanbul'da Un İhracatı & Hububat Ticareti sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.7",
        "peerAvg": "1.80"
      }
    ],
    "high52": 10.79,
    "low52": 6.36,
    "dayHigh": 8.49,
    "dayLow": 8.09,
    "openPrice": 8.2,
    "volume": 9807189,
    "avgVolume": 10351162,
    "volumeRatio": 0.95,
    "athDiscountPct": 22.5
  },
  {
    "id": "unlu",
    "symbol": "UNLU",
    "name": "Ünlü Yatırım Holding",
    "sector": "Yatırım Bankacılığı & Portföy",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 11.01,
    "currency": "₺",
    "dailyChange": 1.47,
    "peRatio": 4.7,
    "pbRatio": 1.2,
    "dividendYield": 2.4,
    "marketCap": "1.93 Mr ₺",
    "beta": 0.99,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ünlü Yatırım Holding (UNLU), Borsa İstanbul'da Yatırım Bankacılığı & Portföy sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 19.34,
    "low52": 10.56,
    "dayHigh": 11.03,
    "dayLow": 10.88,
    "openPrice": 10.93,
    "volume": 470474,
    "avgVolume": 1796686,
    "volumeRatio": 0.26,
    "athDiscountPct": 43.1
  },
  {
    "id": "vakbn",
    "symbol": "VAKBN",
    "name": "Türkiye Vakıflar Bankası",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 30.76,
    "currency": "₺",
    "dailyChange": -0.9,
    "peRatio": 3.8,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "305.01 Mr ₺",
    "beta": 0.85,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Türkiye Vakıflar Bankası (VAKBN), Borsa İstanbul'da Bankacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 43.06,
    "low52": 21.38,
    "dayHigh": 31.36,
    "dayLow": 30.62,
    "openPrice": 30.98,
    "volume": 25951641,
    "avgVolume": 47854180,
    "volumeRatio": 0.54,
    "athDiscountPct": 28.6
  },
  {
    "id": "vakfn",
    "symbol": "VAKFN",
    "name": "Vakıf Finansal Kiralama",
    "sector": "Finansal Kiralama (Leasing)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.19,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 3.8,
    "pbRatio": 2.2,
    "dividendYield": 7.4,
    "marketCap": "7.14 Mr ₺",
    "beta": 0.89,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Vakıf Finansal Kiralama (VAKFN), Borsa İstanbul'da Finansal Kiralama (Leasing) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 2.12,
    "low52": 1.17,
    "dayHigh": 1.2,
    "dayLow": 1.17,
    "openPrice": 1.19,
    "volume": 37211268,
    "avgVolume": 63773890,
    "volumeRatio": 0.58,
    "athDiscountPct": 43.9
  },
  {
    "id": "vakko",
    "symbol": "VAKKO",
    "name": "Vakko Tekstil ve Hazır Giyim",
    "sector": "Lüks Moda Perakendesi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 68.95,
    "currency": "₺",
    "dailyChange": 0.66,
    "peRatio": 191.5,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "11.03 Mr ₺",
    "beta": 0.95,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Vakko Tekstil ve Hazır Giyim (VAKKO), Borsa İstanbul'da Lüks Moda Perakendesi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 101.9,
    "low52": 54.6,
    "dayHigh": 69.35,
    "dayLow": 68.5,
    "openPrice": 68.85,
    "volume": 66232,
    "avgVolume": 225899,
    "volumeRatio": 0.29,
    "athDiscountPct": 32.3
  },
  {
    "id": "vbtyz",
    "symbol": "VBTYZ",
    "name": "VBT Yazılım A.Ş.",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 31.46,
    "currency": "₺",
    "dailyChange": 1.35,
    "peRatio": 28.3,
    "pbRatio": 2.3,
    "dividendYield": 4,
    "marketCap": "3.68 Mr ₺",
    "beta": 1.3,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "VBT Yazılım A.Ş. (VBTYZ), Borsa İstanbul'da Savunma & Yüksek Teknoloji sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.3",
        "peerAvg": "1.80"
      }
    ],
    "high52": 35.46,
    "low52": 15.02,
    "dayHigh": 31.66,
    "dayLow": 30.9,
    "openPrice": 31.12,
    "volume": 1283331,
    "avgVolume": 3925052,
    "volumeRatio": 0.33,
    "athDiscountPct": 11.3
  },
  {
    "id": "vesbe",
    "symbol": "VESBE",
    "name": "Vestel Beyaz Eşya Sanayi",
    "sector": "Dayanıklı Tüketim & Beyaz Eşya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 5.58,
    "currency": "₺",
    "dailyChange": -0.71,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "8.93 Mr ₺",
    "beta": 0.88,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Vestel Beyaz Eşya Sanayi (VESBE), Borsa İstanbul'da Dayanıklı Tüketim & Beyaz Eşya sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14.5,
    "low52": 5.55,
    "dayHigh": 5.65,
    "dayLow": 5.58,
    "openPrice": 5.65,
    "volume": 4460260,
    "avgVolume": 10838261,
    "volumeRatio": 0.41,
    "athDiscountPct": 61.5
  },
  {
    "id": "vestl",
    "symbol": "VESTL",
    "name": "Vestel Elektronik Sanayi",
    "sector": "Dayanıklı Tüketim & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 22.24,
    "currency": "₺",
    "dailyChange": -1.85,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "7.46 Mr ₺",
    "beta": 1.13,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Vestel Elektronik Sanayi (VESTL), Borsa İstanbul'da Dayanıklı Tüketim & Sanayi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 46,
    "low52": 21.7,
    "dayHigh": 22.78,
    "dayLow": 22.24,
    "openPrice": 22.68,
    "volume": 3455385,
    "avgVolume": 7579063,
    "volumeRatio": 0.46,
    "athDiscountPct": 51.7
  },
  {
    "id": "vkgyo",
    "symbol": "VKGYO",
    "name": "Vakıf GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.95,
    "currency": "₺",
    "dailyChange": -0.51,
    "peRatio": 24.4,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "8.58 Mr ₺",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Vakıf GYO (VKGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 2.52,
    "low52": 1.73,
    "dayHigh": 1.97,
    "dayLow": 1.95,
    "openPrice": 1.96,
    "volume": 7704616,
    "avgVolume": 21831892,
    "volumeRatio": 0.35,
    "athDiscountPct": 22.6
  },
  {
    "id": "vrgyo",
    "symbol": "VRGYO",
    "name": "Vera Konsept GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 1.76,
    "currency": "₺",
    "dailyChange": 1.15,
    "peRatio": 15.7,
    "pbRatio": 1.5,
    "dividendYield": 3.2,
    "marketCap": "1.44 Mr ₺",
    "beta": 1.22,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Vera Konsept GYO (VRGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (GYO) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.5",
        "peerAvg": "1.80"
      }
    ],
    "high52": 3.81,
    "low52": 1.69,
    "dayHigh": 1.77,
    "dayLow": 1.74,
    "openPrice": 1.75,
    "volume": 6396875,
    "avgVolume": 18796507,
    "volumeRatio": 0.34,
    "athDiscountPct": 53.8
  },
  {
    "id": "yatas",
    "symbol": "YATAS",
    "name": "Yataş Yatak ve Yorgan",
    "sector": "Yatak & Ev Mobilyası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 35.02,
    "currency": "₺",
    "dailyChange": 3.67,
    "peRatio": 28.2,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "5.03 Mr ₺",
    "beta": 1.01,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Yataş Yatak ve Yorgan (YATAS), Borsa İstanbul'da Yatak & Ev Mobilyası sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 49,
    "low52": 30.48,
    "dayHigh": 35.02,
    "dayLow": 33.12,
    "openPrice": 33.64,
    "volume": 525231,
    "avgVolume": 1120733,
    "volumeRatio": 0.47,
    "athDiscountPct": 28.5
  },
  {
    "id": "yeotk",
    "symbol": "YEOTK",
    "name": "YEO Teknoloji Enerji",
    "sector": "Enerji Otomasyonu & EPC",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 41.64,
    "currency": "₺",
    "dailyChange": 8.16,
    "peRatio": 21.5,
    "pbRatio": 4.4,
    "dividendYield": 2.1,
    "marketCap": "34.56 Mr ₺",
    "beta": 1.11,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "YEO Teknoloji Enerji (YEOTK), Borsa İstanbul'da Enerji Otomasyonu & EPC sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "4.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.4",
        "peerAvg": "1.80"
      }
    ],
    "high52": 53.04,
    "low52": 13.82,
    "dayHigh": 41.94,
    "dayLow": 38.52,
    "openPrice": 38.6,
    "volume": 19823485,
    "avgVolume": 22835198,
    "volumeRatio": 0.87,
    "athDiscountPct": 21.5
  },
  {
    "id": "ykbnk",
    "symbol": "YKBNK",
    "name": "Yapı ve Kredi Bankası",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 35.42,
    "currency": "₺",
    "dailyChange": -0.34,
    "peRatio": 5.4,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "299.19 Mr ₺",
    "beta": 0.98,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Yapı ve Kredi Bankası (YKBNK), Borsa İstanbul'da Bankacılık sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "9.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 44.5,
    "low52": 27.14,
    "dayHigh": 35.82,
    "dayLow": 35.12,
    "openPrice": 35.46,
    "volume": 128193364,
    "avgVolume": 212187717,
    "volumeRatio": 0.6,
    "athDiscountPct": 20.4
  },
  {
    "id": "yunsa",
    "symbol": "YUNSA",
    "name": "Yünsa Yünlü Sanayi",
    "sector": "Yünlü Kumaş İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 9.13,
    "currency": "₺",
    "dailyChange": 0.88,
    "peRatio": 10.9,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "4.38 Mr ₺",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yünsa Yünlü Sanayi (YUNSA), Borsa İstanbul'da Yünlü Kumaş İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.8",
        "peerAvg": "1.80"
      }
    ],
    "high52": 11.2,
    "low52": 6.17,
    "dayHigh": 9.22,
    "dayLow": 9.01,
    "openPrice": 9.01,
    "volume": 3920608,
    "avgVolume": 5898928,
    "volumeRatio": 0.66,
    "athDiscountPct": 18.5
  },
  {
    "id": "yylgd",
    "symbol": "YYLGD",
    "name": "Yayla Agro Gıda",
    "sector": "Bakliyat & Hazır Yemek İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 10.26,
    "currency": "₺",
    "dailyChange": -0.19,
    "peRatio": 20.5,
    "pbRatio": 4.1,
    "dividendYield": 1.8,
    "marketCap": "11.15 Mr ₺",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yayla Agro Gıda (YYLGD), Borsa İstanbul'da Bakliyat & Hazır Yemek İhracatı sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.1",
        "peerAvg": "1.80"
      }
    ],
    "high52": 14.61,
    "low52": 9.35,
    "dayHigh": 10.39,
    "dayLow": 10.09,
    "openPrice": 10.3,
    "volume": 7325605,
    "avgVolume": 6193604,
    "volumeRatio": 1.18,
    "athDiscountPct": 29.8
  },
  {
    "id": "zedur",
    "symbol": "ZEDUR",
    "name": "Zedur Enerji Elektrik",
    "sector": "Güneş & Hidroelektrik Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 7.92,
    "currency": "₺",
    "dailyChange": 1.15,
    "peRatio": 18,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "1.38 Mr ₺",
    "beta": 1.09,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Zedur Enerji Elektrik (ZEDUR), Borsa İstanbul'da Güneş & Hidroelektrik Enerjisi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "1.80"
      }
    ],
    "high52": 11.95,
    "low52": 7.39,
    "dayHigh": 7.98,
    "dayLow": 7.82,
    "openPrice": 7.82,
    "volume": 1437062,
    "avgVolume": 3342818,
    "volumeRatio": 0.43,
    "athDiscountPct": 33.7
  },
  {
    "id": "zoren",
    "symbol": "ZOREN",
    "name": "Zorlu Enerji Elektrik Üretim",
    "sector": "Jeotermal & Rüzgar Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 2.28,
    "currency": "₺",
    "dailyChange": 0.44,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "11.40 Mr ₺",
    "beta": 1.13,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Zorlu Enerji Elektrik Üretim (ZOREN), Borsa İstanbul'da Jeotermal & Rüzgar Enerjisi sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.6",
        "peerAvg": "1.80"
      }
    ],
    "high52": 4.43,
    "low52": 2.24,
    "dayHigh": 2.31,
    "dayLow": 2.27,
    "openPrice": 2.27,
    "volume": 29293210,
    "avgVolume": 54154348,
    "volumeRatio": 0.54,
    "athDiscountPct": 48.5
  },
  {
    "id": "zrgyo",
    "symbol": "ZRGYO",
    "name": "Ziraat GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (İFM)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 19.53,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 16,
    "pbRatio": 1.9,
    "dividendYield": 3.6,
    "marketCap": "91.67 Mr ₺",
    "beta": 1.26,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ziraat GYO (ZRGYO), Borsa İstanbul'da Gayrimenkul Yatırım Ortaklığı (İFM) sektöründe işlem gören kayıtlı yatırım varlığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.7x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.9",
        "peerAvg": "1.80"
      }
    ],
    "high52": 25.86,
    "low52": 14.78,
    "dayHigh": 20.06,
    "dayLow": 19.53,
    "openPrice": 19.69,
    "volume": 703846,
    "avgVolume": 8920336,
    "volumeRatio": 0.08,
    "athDiscountPct": 24.5
  },
  {
    "id": "aapl",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "sector": "Tüketici Elektroniği & Yazılım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 305.93,
    "currency": "$",
    "dailyChange": 0.22,
    "peRatio": 35.1,
    "pbRatio": 48.5,
    "dividendYield": 0.44,
    "marketCap": "$4.46T",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "iPhone, Mac, iPad donanımları ve iOS ekosistemiyle dünyanın en değerli teknoloji ve tüketici elektroniği devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "33.2x",
        "peerAvg": "29.8x"
      },
      {
        "label": "PD/DD",
        "value": "48.5",
        "peerAvg": "18.2"
      }
    ],
    "high52": 344.57,
    "low52": 223.78,
    "dayHigh": 307.49,
    "dayLow": 304.3,
    "openPrice": 306.03,
    "volume": 26072932,
    "avgVolume": 56191185,
    "volumeRatio": 0.46,
    "athDiscountPct": 11.2
  },
  {
    "id": "msft",
    "symbol": "MSFT",
    "name": "Microsoft Corporation",
    "sector": "Bulut & Kurumsal Yazılım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 495.4,
    "currency": "$",
    "dailyChange": -0.3,
    "peRatio": 27.6,
    "pbRatio": 12.8,
    "dividendYield": 0.68,
    "marketCap": "$3.68T",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Azure bulut bilişim altyapısı, Office 365 üretkenlik yazılımları ve OpenAI ortaklığıyla yapay zeka lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "36.4x",
        "peerAvg": "31.2x"
      },
      {
        "label": "PD/DD",
        "value": "12.8",
        "peerAvg": "9.5"
      }
    ],
    "high52": 553.72,
    "low52": 349.2,
    "dayHigh": 500.01,
    "dayLow": 493.93,
    "openPrice": 496.36,
    "volume": 14356176,
    "avgVolume": 40399404,
    "volumeRatio": 0.36,
    "athDiscountPct": 10.5
  },
  {
    "id": "nvda",
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "sector": "Yarı İletken & Yapay Zeka",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 225.16,
    "currency": "$",
    "dailyChange": -0.06,
    "peRatio": 34.5,
    "pbRatio": 42.1,
    "dividendYield": 0.03,
    "marketCap": "$5.45T",
    "beta": 1.68,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Yapay zeka (LLM) eğitimi ve veri merkezi hızlandırma GPU donanımlarında küresel pazarın %85'ine hakim çip devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "48.6x",
        "peerAvg": "34.5x"
      },
      {
        "label": "PD/DD",
        "value": "42.1",
        "peerAvg": "14.2"
      }
    ],
    "high52": 236.54,
    "low52": 164.07,
    "dayHigh": 227.49,
    "dayLow": 224.5,
    "openPrice": 226.8,
    "volume": 75161211,
    "avgVolume": 145977437,
    "volumeRatio": 0.51,
    "athDiscountPct": 4.8
  },
  {
    "id": "googl",
    "symbol": "GOOGL",
    "name": "Alphabet Inc. (Google)",
    "sector": "İnternet & Yapay Zeka",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 345.9,
    "currency": "$",
    "dailyChange": -0.13,
    "peRatio": 17.4,
    "pbRatio": 6.8,
    "dividendYield": 0.43,
    "marketCap": "$4.23T",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Google Arama, YouTube, Google Cloud ve Gemini yapay zeka modelleriyle dijital reklam ve bulut bilişim devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "23.8x",
        "peerAvg": "26.4x"
      },
      {
        "label": "PD/DD",
        "value": "6.8",
        "peerAvg": "7.1"
      }
    ],
    "high52": 408.61,
    "low52": 196.6,
    "dayHigh": 350.45,
    "dayLow": 344.5,
    "openPrice": 346.54,
    "volume": 16891717,
    "avgVolume": 32893103,
    "volumeRatio": 0.51,
    "athDiscountPct": 15.3
  },
  {
    "id": "amzn",
    "symbol": "AMZN",
    "name": "Amazon.com Inc.",
    "sector": "E-Ticaret & AWS Bulut",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 262.65,
    "currency": "$",
    "dailyChange": -0.94,
    "peRatio": 21.1,
    "pbRatio": 8.4,
    "dividendYield": 0,
    "marketCap": "$2.83T",
    "beta": 1.18,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Küresel e-ticaret platformu, AWS bulut bilişim altyapısı ve Prime lojistik ekosisteminin mutlak lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "41.2x",
        "peerAvg": "35.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.4",
        "peerAvg": "6.2"
      }
    ],
    "high52": 287.2,
    "low52": 196,
    "dayHigh": 265.81,
    "dayLow": 262.42,
    "openPrice": 264.88,
    "volume": 25946149,
    "avgVolume": 50010495,
    "volumeRatio": 0.52,
    "athDiscountPct": 8.5
  },
  {
    "id": "meta",
    "symbol": "META",
    "name": "Meta Platforms Inc.",
    "sector": "Sosyal Medya & AI",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 589.85,
    "currency": "$",
    "dailyChange": -0.86,
    "peRatio": 22.2,
    "pbRatio": 8.6,
    "dividendYield": 0.34,
    "marketCap": "$1.50T",
    "beta": 1.22,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Instagram, WhatsApp, Facebook ve Llama açık kaynaklı yapay zeka modellerinin çatı teknoloji şirketi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "27.5x",
        "peerAvg": "28.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.6",
        "peerAvg": "7.5"
      }
    ],
    "high52": 790.8,
    "low52": 520.26,
    "dayHigh": 601.86,
    "dayLow": 589.29,
    "openPrice": 596.98,
    "volume": 8412405,
    "avgVolume": 18139983,
    "volumeRatio": 0.46,
    "athDiscountPct": 25.4
  },
  {
    "id": "tsla",
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "sector": "Elektrikli Araç & Enerji",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 342.27,
    "currency": "$",
    "dailyChange": 0.68,
    "peRatio": 311.2,
    "pbRatio": 11.2,
    "dividendYield": 0,
    "marketCap": "$1.35T",
    "beta": 2.15,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Elektrikli otomobil, otonom sürüş (FSD), Optimus insansı robot ve Megapack batarya depolama üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "72.4x",
        "peerAvg": "42.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.2",
        "peerAvg": "5.8"
      }
    ],
    "high52": 498.83,
    "low52": 297.38,
    "dayHigh": 351.26,
    "dayLow": 335.33,
    "openPrice": 342.33,
    "volume": 44776096,
    "avgVolume": 42903616,
    "volumeRatio": 1.04,
    "athDiscountPct": 31.4
  },
  {
    "id": "avgo",
    "symbol": "AVGO",
    "name": "Broadcom Inc.",
    "sector": "Yarı İletken & Kurumsal Yazılım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 392.99,
    "currency": "$",
    "dailyChange": -5.94,
    "peRatio": 65.4,
    "pbRatio": 11.4,
    "dividendYield": 1.25,
    "marketCap": "$1.87T",
    "beta": 1.28,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ağ donanımı, özel yapay zeka çipleri (ASIC) ve VMware kurumsal sanallaştırma yazılımları üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.2x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.4",
        "peerAvg": "8.5"
      }
    ],
    "high52": 495,
    "low52": 281.87,
    "dayHigh": 412.5,
    "dayLow": 388.5,
    "openPrice": 411.96,
    "volume": 29203339,
    "avgVolume": 25825480,
    "volumeRatio": 1.13,
    "athDiscountPct": 20.6
  },
  {
    "id": "orcl",
    "symbol": "ORCL",
    "name": "Oracle Corporation",
    "sector": "Veritabanı & Bulut Altyapısı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 150.52,
    "currency": "$",
    "dailyChange": -3.65,
    "peRatio": 25.8,
    "pbRatio": 18.4,
    "dividendYield": 0.92,
    "marketCap": "$433.57B",
    "beta": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kurumsal ilişkisel veritabanı (RDBMS), ERP yazılımları ve Oracle Cloud Infrastructure (OCI) sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32.5x",
        "peerAvg": "28.5x"
      },
      {
        "label": "PD/DD",
        "value": "18.4",
        "peerAvg": "9.2"
      }
    ],
    "high52": 345.72,
    "low52": 114.5,
    "dayHigh": 156.39,
    "dayLow": 148.8,
    "openPrice": 155.84,
    "volume": 21804981,
    "avgVolume": 32159029,
    "volumeRatio": 0.68,
    "athDiscountPct": 56.5
  },
  {
    "id": "crm",
    "symbol": "CRM",
    "name": "Salesforce Inc.",
    "sector": "Müşteri İlişkileri (CRM) & Bulut",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 196.21,
    "currency": "$",
    "dailyChange": -2.56,
    "peRatio": 22.7,
    "pbRatio": 4.8,
    "dividendYield": 0.54,
    "marketCap": "$160.70B",
    "beta": 1.12,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Bulut tabanlı müşteri ilişkileri yönetimi (CRM), Agentforce yapay zeka aracı ve Slack iş birliği platformu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "45.2x",
        "peerAvg": "36.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.8",
        "peerAvg": "6.0"
      }
    ],
    "high52": 269.11,
    "low52": 146.32,
    "dayHigh": 204.4,
    "dayLow": 195.32,
    "openPrice": 202.75,
    "volume": 8234819,
    "avgVolume": 14926519,
    "volumeRatio": 0.55,
    "athDiscountPct": 27.1
  },
  {
    "id": "adbe",
    "symbol": "ADBE",
    "name": "Adobe Inc.",
    "sector": "Yaratıcı Yazılım & Tasarım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 264.02,
    "currency": "$",
    "dailyChange": -2.39,
    "peRatio": 15.1,
    "pbRatio": 12.2,
    "dividendYield": 0,
    "marketCap": "$104.95B",
    "beta": 1.24,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Photoshop, Illustrator, Acrobat PDF ve Firefly üretken yapay zeka yaratıcı araçlarının küresel lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.4x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "12.2",
        "peerAvg": "8.4"
      }
    ],
    "high52": 370.86,
    "low52": 190.12,
    "dayHigh": 273.4,
    "dayLow": 261.67,
    "openPrice": 273.22,
    "volume": 2823087,
    "avgVolume": 6448917,
    "volumeRatio": 0.44,
    "athDiscountPct": 28.8
  },
  {
    "id": "nflx",
    "symbol": "NFLX",
    "name": "Netflix Inc.",
    "sector": "Yayıncılık & Dijital Medya",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 78.16,
    "currency": "$",
    "dailyChange": -0.1,
    "peRatio": 24.6,
    "pbRatio": 14.6,
    "dividendYield": 0,
    "marketCap": "$325.45B",
    "beta": 1.26,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Dünya çapında 280 milyondan fazla aboneye sahip lider video akış (streaming) platformu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "42.8x",
        "peerAvg": "30.5x"
      },
      {
        "label": "PD/DD",
        "value": "14.6",
        "peerAvg": "7.8"
      }
    ],
    "high52": 126.71,
    "low52": 65.08,
    "dayHigh": 78.73,
    "dayLow": 77.76,
    "openPrice": 78.48,
    "volume": 25783972,
    "avgVolume": 42892512,
    "volumeRatio": 0.6,
    "athDiscountPct": 38.3
  },
  {
    "id": "amd",
    "symbol": "AMD",
    "name": "Advanced Micro Devices",
    "sector": "Yarı İletken & Mikroişlemci",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 514.39,
    "currency": "$",
    "dailyChange": 6.5,
    "peRatio": 131.6,
    "pbRatio": 4.2,
    "dividendYield": 0,
    "marketCap": "$839.73B",
    "beta": 1.72,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ryzen masaüstü CPU, EPYC sunucu işlemcileri ve Instinct MI300 yapay zeka hızlandırıcı üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "84.5x",
        "peerAvg": "40.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "6.5"
      }
    ],
    "high52": 584.73,
    "low52": 149.22,
    "dayHigh": 514.67,
    "dayLow": 483.2,
    "openPrice": 487.6,
    "volume": 24928819,
    "avgVolume": 29914298,
    "volumeRatio": 0.83,
    "athDiscountPct": 12
  },
  {
    "id": "qcom",
    "symbol": "QCOM",
    "name": "Qualcomm Inc.",
    "sector": "Mobil Çip & Telekom Donanımı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 165.79,
    "currency": "$",
    "dailyChange": 0.61,
    "peRatio": 18.9,
    "pbRatio": 7.2,
    "dividendYield": 1.97,
    "marketCap": "$174.08B",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Snapdragon mobil işlemcileri, 5G modemleri ve ARM mimarili Snapdragon X Elite PC işlemcileri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.4x",
        "peerAvg": "26.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.2",
        "peerAvg": "8.0"
      }
    ],
    "high52": 259.92,
    "low52": 121.99,
    "dayHigh": 166.97,
    "dayLow": 163.18,
    "openPrice": 165.63,
    "volume": 5231534,
    "avgVolume": 17729567,
    "volumeRatio": 0.3,
    "athDiscountPct": 36.2
  },
  {
    "id": "intc",
    "symbol": "INTC",
    "name": "Intel Corporation",
    "sector": "Yarı İletken & Dökümhane",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 102.5,
    "currency": "$",
    "dailyChange": -1.97,
    "peRatio": 45,
    "pbRatio": 0.92,
    "dividendYield": 2.05,
    "marketCap": "$541.83B",
    "beta": 1.15,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "x86 PC ve veri merkezi işlemcileri üreticisi ve küresel Intel Foundry Services (IFS) dökümhane operasyonu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "45.0x",
        "peerAvg": "30.0x"
      },
      {
        "label": "PD/DD",
        "value": "0.92",
        "peerAvg": "3.5"
      }
    ],
    "high52": 142.35,
    "low52": 22.78,
    "dayHigh": 106.87,
    "dayLow": 102.05,
    "openPrice": 104.5,
    "volume": 94307788,
    "avgVolume": 122085245,
    "volumeRatio": 0.77,
    "athDiscountPct": 28
  },
  {
    "id": "pltr",
    "symbol": "PLTR",
    "name": "Palantir Technologies",
    "sector": "Büyük Veri & Savunma Yapay Zekası",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 174.04,
    "currency": "$",
    "dailyChange": -2.78,
    "peRatio": 148.8,
    "pbRatio": 22.5,
    "dividendYield": 0,
    "marketCap": "$418.23B",
    "beta": 2.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Gotham, Foundry ve AIP (Artificial Intelligence Platform) ile savunma ve kurumsal veri analitiği devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "98.0x",
        "peerAvg": "42.0x"
      },
      {
        "label": "PD/DD",
        "value": "22.5",
        "peerAvg": "11.0"
      }
    ],
    "high52": 207.52,
    "low52": 106.37,
    "dayHigh": 180.18,
    "dayLow": 173.8,
    "openPrice": 179.52,
    "volume": 23948735,
    "avgVolume": 43249708,
    "volumeRatio": 0.55,
    "athDiscountPct": 16.1
  },
  {
    "id": "uber",
    "symbol": "UBER",
    "name": "Uber Technologies Inc.",
    "sector": "Ulaşım Ağı & Teslimat",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 75.95,
    "currency": "$",
    "dailyChange": 0.09,
    "peRatio": 16.7,
    "pbRatio": 8.5,
    "dividendYield": 0,
    "marketCap": "$155.13B",
    "beta": 1.35,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Küresel araç çağırma (rideshare), Uber Eats yemek teslimatı ve Uber Freight lojistik platformu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "35.6x",
        "peerAvg": "28.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.5",
        "peerAvg": "5.5"
      }
    ],
    "high52": 101.99,
    "low52": 65.41,
    "dayHigh": 77.44,
    "dayLow": 75.37,
    "openPrice": 77.09,
    "volume": 10092036,
    "avgVolume": 20626477,
    "volumeRatio": 0.49,
    "athDiscountPct": 25.5
  },
  {
    "id": "abnb",
    "symbol": "ABNB",
    "name": "Airbnb Inc.",
    "sector": "Konaklama & Seyahat Platformu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 184.06,
    "currency": "$",
    "dailyChange": -0.58,
    "peRatio": 42,
    "pbRatio": 9.8,
    "dividendYield": 0,
    "marketCap": "$110.21B",
    "beta": 1.18,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kısa dönemli ev ve tatil konaklaması kiralama sektörünün küresel pazar yeri lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.2x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "9.8",
        "peerAvg": "6.2"
      }
    ],
    "high52": 187.12,
    "low52": 110.81,
    "dayHigh": 186.95,
    "dayLow": 183.66,
    "openPrice": 185,
    "volume": 3733937,
    "avgVolume": 4197130,
    "volumeRatio": 0.89,
    "athDiscountPct": 1.6
  },
  {
    "id": "now",
    "symbol": "NOW",
    "name": "ServiceNow Inc.",
    "sector": "Kurumsal İş Akışı Yazılımı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 124,
    "currency": "$",
    "dailyChange": -2.55,
    "peRatio": 77.5,
    "pbRatio": 18.5,
    "dividendYield": 0,
    "marketCap": "$128.20B",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kurumsal BT hizmet yönetimi (ITSM) ve yapay zeka destekli dijital iş akışı otomasyon platformu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "62.4x",
        "peerAvg": "38.0x"
      },
      {
        "label": "PD/DD",
        "value": "18.5",
        "peerAvg": "10.0"
      }
    ],
    "high52": 194.73,
    "low52": 81.24,
    "dayHigh": 128.65,
    "dayLow": 122.17,
    "openPrice": 127.7,
    "volume": 14566156,
    "avgVolume": 27073275,
    "volumeRatio": 0.54,
    "athDiscountPct": 36.3
  },
  {
    "id": "intu",
    "symbol": "INTU",
    "name": "Intuit Inc.",
    "sector": "Finansal Yazılım & Vergi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 345.66,
    "currency": "$",
    "dailyChange": -3.53,
    "peRatio": 21.1,
    "pbRatio": 9.6,
    "dividendYield": 0.65,
    "marketCap": "$94.55B",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "TurboTax, QuickBooks, Credit Karma ve Mailchimp yazılımlarıyla KOBİ ve bireysel finans yazılımları devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "58.2x",
        "peerAvg": "35.0x"
      },
      {
        "label": "PD/DD",
        "value": "9.6",
        "peerAvg": "7.0"
      }
    ],
    "high52": 721.54,
    "low52": 252.84,
    "dayHigh": 361.86,
    "dayLow": 344.95,
    "openPrice": 360,
    "volume": 3197379,
    "avgVolume": 5463495,
    "volumeRatio": 0.59,
    "athDiscountPct": 52.1
  },
  {
    "id": "panw",
    "symbol": "PANW",
    "name": "Palo Alto Networks",
    "sector": "Siber Güvenlik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 384.27,
    "currency": "$",
    "dailyChange": -2.96,
    "peRatio": 334.1,
    "pbRatio": 19.8,
    "dividendYield": 0,
    "marketCap": "$313.18B",
    "beta": 1.12,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yeni nesil güvenlik duvarı (NGFW), Prisma Cloud ve Cortex XDR platformlarıyla küresel siber güvenlik lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "46.5x",
        "peerAvg": "38.0x"
      },
      {
        "label": "PD/DD",
        "value": "19.8",
        "peerAvg": "12.0"
      }
    ],
    "high52": 398.88,
    "low52": 139.57,
    "dayHigh": 397.31,
    "dayLow": 380.85,
    "openPrice": 396.93,
    "volume": 4216192,
    "avgVolume": 7584096,
    "volumeRatio": 0.56,
    "athDiscountPct": 3.7
  },
  {
    "id": "crwd",
    "symbol": "CRWD",
    "name": "CrowdStrike Holdings",
    "sector": "Uç Nokta Siber Güvenlik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 216.95,
    "currency": "$",
    "dailyChange": -3.8,
    "peRatio": 78,
    "pbRatio": 28.5,
    "dividendYield": 0,
    "marketCap": "$220.91B",
    "beta": 1.38,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Falcon bulut tabanlı uç nokta koruma ve tehdit istihbaratı platformuyla kurumsal siber güvenlik sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "78.0x",
        "peerAvg": "42.0x"
      },
      {
        "label": "PD/DD",
        "value": "28.5",
        "peerAvg": "14.0"
      }
    ],
    "high52": 227.5,
    "low52": 85.68,
    "dayHigh": 227.5,
    "dayLow": 216.47,
    "openPrice": 226.62,
    "volume": 6688148,
    "avgVolume": 11229237,
    "volumeRatio": 0.6,
    "athDiscountPct": 4.6
  },
  {
    "id": "snow",
    "symbol": "SNOW",
    "name": "Snowflake Inc.",
    "sector": "Bulut Veri Ambarı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 328.92,
    "currency": "$",
    "dailyChange": -2.51,
    "peRatio": 52,
    "pbRatio": 8.9,
    "dividendYield": 0,
    "marketCap": "$114.00B",
    "beta": 1.45,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Çoklu bulut ortamında çalışan veri gölü, veri ambarı ve veri mühendisliği platformu sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "52.0x",
        "peerAvg": "36.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.9",
        "peerAvg": "6.5"
      }
    ],
    "high52": 341.95,
    "low52": 118.3,
    "dayHigh": 339.38,
    "dayLow": 326.33,
    "openPrice": 339,
    "volume": 2579589,
    "avgVolume": 7472835,
    "volumeRatio": 0.35,
    "athDiscountPct": 3.8
  },
  {
    "id": "amat",
    "symbol": "AMAT",
    "name": "Applied Materials",
    "sector": "Yarı İletken Ekipmanı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 507.18,
    "currency": "$",
    "dailyChange": -5.12,
    "peRatio": 43.7,
    "pbRatio": 8.4,
    "dividendYield": 0.81,
    "marketCap": "$402.68B",
    "beta": 1.55,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yarı iletken çip üretiminde kullanılan malzeme mühendisliği ve nanoteknoloji üretim ekipmanları lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22.8x",
        "peerAvg": "26.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.4",
        "peerAvg": "7.0"
      }
    ],
    "high52": 739.67,
    "low52": 154.47,
    "dayHigh": 523,
    "dayLow": 497.1,
    "openPrice": 498.44,
    "volume": 12513552,
    "avgVolume": 9588932,
    "volumeRatio": 1.3,
    "athDiscountPct": 31.4
  },
  {
    "id": "lrcx",
    "symbol": "LRCX",
    "name": "Lam Research Corporation",
    "sector": "Çip Aşındırma & İmalat",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 332.36,
    "currency": "$",
    "dailyChange": -1.38,
    "peRatio": 57.8,
    "pbRatio": 9.8,
    "dividendYield": 1.15,
    "marketCap": "$415.89B",
    "beta": 1.62,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "3D NAND ve DRAM bellek yongalarının üretiminde kullanılan kimyasal aşındırma ve biriktirme sistemleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.5x",
        "peerAvg": "26.0x"
      },
      {
        "label": "PD/DD",
        "value": "9.8",
        "peerAvg": "7.5"
      }
    ],
    "high52": 438.5,
    "low52": 94.11,
    "dayHigh": 342,
    "dayLow": 326.61,
    "openPrice": 331.53,
    "volume": 7260342,
    "avgVolume": 11642332,
    "volumeRatio": 0.62,
    "athDiscountPct": 24.2
  },
  {
    "id": "mu",
    "symbol": "MU",
    "name": "Micron Technology",
    "sector": "Bellek Çipleri (DRAM & NAND)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 971.66,
    "currency": "$",
    "dailyChange": 2.3,
    "peRatio": 22,
    "pbRatio": 2.4,
    "dividendYield": 0.42,
    "marketCap": "$1.10T",
    "beta": 1.48,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yapay zeka sunucuları için HBM3E yüksek bant genişlikli bellek ve tüketici SSD/DRAM üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.2x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "3.2"
      }
    ],
    "high52": 1255,
    "low52": 113.46,
    "dayHigh": 984,
    "dayLow": 956.2,
    "openPrice": 979.64,
    "volume": 27609119,
    "avgVolume": 50030500,
    "volumeRatio": 0.55,
    "athDiscountPct": 22.6
  },
  {
    "id": "jpm",
    "symbol": "JPM",
    "name": "JPMorgan Chase & Co.",
    "sector": "Yatırım Bankacılığı & Ticari Banka",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 362.84,
    "currency": "$",
    "dailyChange": -0.07,
    "peRatio": 15.6,
    "pbRatio": 1.85,
    "dividendYield": 2.05,
    "marketCap": "$964.50B",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "3.9 trilyon dolarlık varlık tabanıyla ABD'nin ve dünyanın en büyük ve en karlı finans/bankacılık kuruluşu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.4x",
        "peerAvg": "11.8x"
      },
      {
        "label": "PD/DD",
        "value": "1.85",
        "peerAvg": "1.25"
      }
    ],
    "high52": 366.5,
    "low52": 279.1,
    "dayHigh": 365.88,
    "dayLow": 361.45,
    "openPrice": 363,
    "volume": 5057019,
    "avgVolume": 8935016,
    "volumeRatio": 0.57,
    "athDiscountPct": 1
  },
  {
    "id": "bac",
    "symbol": "BAC",
    "name": "Bank of America Corp.",
    "sector": "Perakende & Ticari Bankacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 64.49,
    "currency": "$",
    "dailyChange": 0.62,
    "peRatio": 14.9,
    "pbRatio": 1.25,
    "dividendYield": 2.43,
    "marketCap": "$450.96B",
    "beta": 1.35,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Geniş şube ve mevduat tabanıyla ABD genelinde lider perakende bankacılık ve varlık yönetimi hizmetleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.8x",
        "peerAvg": "12.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.25",
        "peerAvg": "1.15"
      }
    ],
    "high52": 65.2,
    "low52": 46.12,
    "dayHigh": 64.55,
    "dayLow": 63.81,
    "openPrice": 64.04,
    "volume": 16994052,
    "avgVolume": 34872395,
    "volumeRatio": 0.49,
    "athDiscountPct": 1.1
  },
  {
    "id": "gs",
    "symbol": "GS",
    "name": "The Goldman Sachs Group",
    "sector": "Yatırım Bankacılığı & Menkul Değerler",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 1039.42,
    "currency": "$",
    "dailyChange": -0.31,
    "peRatio": 16.1,
    "pbRatio": 1.55,
    "dividendYield": 2.27,
    "marketCap": "$302.65B",
    "beta": 1.38,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Şirket birleşme-devralma (M&A) danışmanlığı, halka arz aracılığı ve küresel piyasa yapıcılığı devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.2x",
        "peerAvg": "13.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.55",
        "peerAvg": "1.30"
      }
    ],
    "high52": 1153.99,
    "low52": 705.55,
    "dayHigh": 1043.74,
    "dayLow": 1029.59,
    "openPrice": 1040.91,
    "volume": 1588474,
    "avgVolume": 2149343,
    "volumeRatio": 0.74,
    "athDiscountPct": 9.9
  },
  {
    "id": "ms",
    "symbol": "MS",
    "name": "Morgan Stanley",
    "sector": "Varlık Yönetimi & Yatırım Bankası",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 217.36,
    "currency": "$",
    "dailyChange": -0.47,
    "peRatio": 17.5,
    "pbRatio": 1.95,
    "dividendYield": 2.87,
    "marketCap": "$341.69B",
    "beta": 1.28,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "E*TRADE dijital yatırım platformu ve 6 trilyon dolarlık zengin müşteri servet yönetimi portföyü lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.5x",
        "peerAvg": "14.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.95",
        "peerAvg": "1.40"
      }
    ],
    "high52": 232.25,
    "low52": 141.03,
    "dayHigh": 218.72,
    "dayLow": 215.3,
    "openPrice": 217.79,
    "volume": 3405774,
    "avgVolume": 5850054,
    "volumeRatio": 0.58,
    "athDiscountPct": 6.4
  },
  {
    "id": "v",
    "symbol": "V",
    "name": "Visa Inc.",
    "sector": "Ödeme Teknolojileri & Kart Ağı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 364.15,
    "currency": "$",
    "dailyChange": -0.36,
    "peRatio": 31,
    "pbRatio": 14.5,
    "dividendYield": 0.72,
    "marketCap": "$679.89B",
    "beta": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "200'den fazla ülkede saniyede on binlerce dijital ödeme işlemini takas eden küresel elektronik para ağı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "29.8x",
        "peerAvg": "27.5x"
      },
      {
        "label": "PD/DD",
        "value": "14.5",
        "peerAvg": "10.2"
      }
    ],
    "high52": 373.97,
    "low52": 293.89,
    "dayHigh": 366.8,
    "dayLow": 362.77,
    "openPrice": 365.89,
    "volume": 3788841,
    "avgVolume": 8155846,
    "volumeRatio": 0.46,
    "athDiscountPct": 2.6
  },
  {
    "id": "ma",
    "symbol": "MA",
    "name": "Mastercard Incorporated",
    "sector": "Elektronik Ödeme Ağı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 569.29,
    "currency": "$",
    "dailyChange": 0.4,
    "peRatio": 31.3,
    "pbRatio": 52,
    "dividendYield": 0.53,
    "marketCap": "$498.70B",
    "beta": 1.02,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Küresel ödeme altyapısı, sınır ötesi para transferleri ve siber güvenlik kimlik doğrulama çözümleri devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "34.2x",
        "peerAvg": "28.0x"
      },
      {
        "label": "PD/DD",
        "value": "52.0",
        "peerAvg": "15.0"
      }
    ],
    "high52": 601.77,
    "low52": 464.52,
    "dayHigh": 570.65,
    "dayLow": 564.43,
    "openPrice": 567.95,
    "volume": 2473106,
    "avgVolume": 3534930,
    "volumeRatio": 0.7,
    "athDiscountPct": 5.4
  },
  {
    "id": "axp",
    "symbol": "AXP",
    "name": "American Express Company",
    "sector": "Ödeme Kartları & Finans",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 342.48,
    "currency": "$",
    "dailyChange": -0.34,
    "peRatio": 20.8,
    "pbRatio": 6.2,
    "dividendYield": 1.02,
    "marketCap": "$231.28B",
    "beta": 1.18,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Premium kredi kartı segmenti, kurumsal harcama çözümleri ve seyahat sadakat programları lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.5x",
        "peerAvg": "15.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.2",
        "peerAvg": "3.5"
      }
    ],
    "high52": 387.49,
    "low52": 290.97,
    "dayHigh": 345,
    "dayLow": 341.69,
    "openPrice": 345.99,
    "volume": 1516899,
    "avgVolume": 2990987,
    "volumeRatio": 0.51,
    "athDiscountPct": 11.6
  },
  {
    "id": "brkb",
    "symbol": "BRK.B",
    "name": "Berkshire Hathaway Inc.",
    "sector": "Çok Sektörlü Holding & Sigorta",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 468.2,
    "currency": "$",
    "dailyChange": 0.35,
    "peRatio": 22.4,
    "pbRatio": 1.62,
    "dividendYield": 0,
    "marketCap": "$1.02T",
    "beta": 0.88,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Warren Buffett liderliğinde GEICO sigorta, BNSF demiryolu ve devasa nakit/hisse senedi portföyü holdingi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22.4x",
        "peerAvg": "18.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.62",
        "peerAvg": "1.45"
      }
    ]
  },
  {
    "id": "blk",
    "symbol": "BLK",
    "name": "BlackRock Inc.",
    "sector": "Fon Yönetimi & iShares",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 1173.73,
    "currency": "$",
    "dailyChange": -0.77,
    "peRatio": 28.1,
    "pbRatio": 3.4,
    "dividendYield": 2.07,
    "marketCap": "$190.70B",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "11 trilyon doların üzerinde varlık yöneten dünyanın en büyük varlık yöneticisi ve iShares ETF kurucusu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.8x",
        "peerAvg": "18.5x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "2.8"
      }
    ],
    "high52": 1219.94,
    "low52": 917.39,
    "dayHigh": 1180,
    "dayLow": 1168.49,
    "openPrice": 1179,
    "volume": 331743,
    "avgVolume": 774056,
    "volumeRatio": 0.43,
    "athDiscountPct": 3.8
  },
  {
    "id": "c",
    "symbol": "C",
    "name": "Citigroup Inc.",
    "sector": "Küresel Bankacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 139.33,
    "currency": "$",
    "dailyChange": 0.43,
    "peRatio": 15,
    "pbRatio": 0.65,
    "dividendYield": 3.49,
    "marketCap": "$233.72B",
    "beta": 1.42,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "160'tan fazla ülkede kurumsal hazine yönetimi, uluslararası ticaret finansmanı ve perakende bankacılık.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.5x",
        "peerAvg": "12.0x"
      },
      {
        "label": "PD/DD",
        "value": "0.65",
        "peerAvg": "1.10"
      }
    ],
    "high52": 147.96,
    "low52": 90.68,
    "dayHigh": 140.27,
    "dayLow": 138.16,
    "openPrice": 138.16,
    "volume": 6824181,
    "avgVolume": 12039274,
    "volumeRatio": 0.57,
    "athDiscountPct": 5.8
  },
  {
    "id": "wfc",
    "symbol": "WFC",
    "name": "Wells Fargo & Company",
    "sector": "Ticari Bankacılık & Konut Kredisi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 88.82,
    "currency": "$",
    "dailyChange": 0.81,
    "peRatio": 12.9,
    "pbRatio": 1.35,
    "dividendYield": 2.4,
    "marketCap": "$268.59B",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ABD'de konut finansmanı (mortgage), küçük işletme kredileri ve bireysel bankacılık devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.2x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.35",
        "peerAvg": "1.15"
      }
    ],
    "high52": 97.76,
    "low52": 72.78,
    "dayHigh": 88.83,
    "dayLow": 87.76,
    "openPrice": 88.07,
    "volume": 8786772,
    "avgVolume": 15350348,
    "volumeRatio": 0.57,
    "athDiscountPct": 9.1
  },
  {
    "id": "pnc",
    "symbol": "PNC",
    "name": "PNC Financial Services",
    "sector": "Bölgesel & Kurumsal Bankacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 256.97,
    "currency": "$",
    "dailyChange": 0.69,
    "peRatio": 14.1,
    "pbRatio": 1.52,
    "dividendYield": 3.4,
    "marketCap": "$102.53B",
    "beta": 1.12,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ABD'nin önde gelen çeşitlendirilmiş finansal hizmetler ve ticari kredi sağlayan bankacılık grubu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.5x",
        "peerAvg": "12.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.52",
        "peerAvg": "1.20"
      }
    ],
    "high52": 258.13,
    "low52": 176.88,
    "dayHigh": 257.55,
    "dayLow": 254.92,
    "openPrice": 255,
    "volume": 599412,
    "avgVolume": 1976516,
    "volumeRatio": 0.3,
    "athDiscountPct": 0.4
  },
  {
    "id": "lly",
    "symbol": "LLY",
    "name": "Eli Lilly and Company",
    "sector": "Biyofarmasötik & Diyabet/Obezite",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 1180.16,
    "currency": "$",
    "dailyChange": -2.25,
    "peRatio": 39.7,
    "pbRatio": 42,
    "dividendYield": 0.59,
    "marketCap": "$1.05T",
    "beta": 0.75,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Mounjaro ve Zepbound (GLP-1) kilo verme ve diyabet ilaçlarıyla küresel ilaç pazarının en değerli devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "64.2x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "42.0",
        "peerAvg": "12.0"
      }
    ],
    "high52": 1249.45,
    "low52": 685.15,
    "dayHigh": 1199,
    "dayLow": 1171.2,
    "openPrice": 1194.01,
    "volume": 2115056,
    "avgVolume": 2991100,
    "volumeRatio": 0.71,
    "athDiscountPct": 5.5
  },
  {
    "id": "unh",
    "symbol": "UNH",
    "name": "UnitedHealth Group",
    "sector": "Sağlık Sigortası & Optum Hizmetleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 401.73,
    "currency": "$",
    "dailyChange": 0.67,
    "peRatio": 25.8,
    "pbRatio": 6.2,
    "dividendYield": 1.43,
    "marketCap": "$360.59B",
    "beta": 0.65,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ABD'nin en büyük özel sağlık sigortacısı ve Optum eczane/klinik analitik teknolojileri sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.5x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.2",
        "peerAvg": "4.5"
      }
    ],
    "high52": 461.62,
    "low52": 255.97,
    "dayHigh": 403.18,
    "dayLow": 396.56,
    "openPrice": 398,
    "volume": 3473868,
    "avgVolume": 5979285,
    "volumeRatio": 0.58,
    "athDiscountPct": 13
  },
  {
    "id": "jnj",
    "symbol": "JNJ",
    "name": "Johnson & Johnson",
    "sector": "İlaç & Tıbbi Cihaz",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 260.35,
    "currency": "$",
    "dailyChange": -0.66,
    "peRatio": 30.2,
    "pbRatio": 5.2,
    "dividendYield": 3.05,
    "marketCap": "$627.42B",
    "beta": 0.55,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Onkoloji, immünoloji yenilikçi tedavileri ve cerrahi robotik/ortopedik tıbbi cihaz sistemleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.8x",
        "peerAvg": "18.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.2",
        "peerAvg": "4.8"
      }
    ],
    "high52": 274.9,
    "low52": 173.33,
    "dayHigh": 261.71,
    "dayLow": 259.16,
    "openPrice": 260.65,
    "volume": 3928350,
    "avgVolume": 8089522,
    "volumeRatio": 0.49,
    "athDiscountPct": 5.3
  },
  {
    "id": "abbv",
    "symbol": "ABBV",
    "name": "AbbVie Inc.",
    "sector": "Biyoteknoloji & İmmünoloji",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 249.46,
    "currency": "$",
    "dailyChange": -0.54,
    "peRatio": 70.5,
    "pbRatio": 38,
    "dividendYield": 3.22,
    "marketCap": "$440.83B",
    "beta": 0.62,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Humira, Skyrizi, Rinvoq immünoloji ilaçları ve Allergan (Botox) medikal estetik ürünleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.5x",
        "peerAvg": "19.0x"
      },
      {
        "label": "PD/DD",
        "value": "38.0",
        "peerAvg": "8.5"
      }
    ],
    "high52": 267.47,
    "low52": 190.75,
    "dayHigh": 250.61,
    "dayLow": 247.68,
    "openPrice": 250.6,
    "volume": 3987418,
    "avgVolume": 6705840,
    "volumeRatio": 0.59,
    "athDiscountPct": 6.7
  },
  {
    "id": "mrk",
    "symbol": "MRK",
    "name": "Merck & Co. Inc.",
    "sector": "Onkoloji & Aşılar",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 135.84,
    "currency": "$",
    "dailyChange": 0.21,
    "peRatio": 108.7,
    "pbRatio": 6.8,
    "dividendYield": 2.7,
    "marketCap": "$335.14B",
    "beta": 0.42,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Keytruda blokbaser kanser immünoterapisi, Gardasil aşısı ve hayvan sağlığı ilaçları üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.2x",
        "peerAvg": "18.5x"
      },
      {
        "label": "PD/DD",
        "value": "6.8",
        "peerAvg": "5.2"
      }
    ],
    "high52": 135.97,
    "low52": 77.58,
    "dayHigh": 135.97,
    "dayLow": 133.4,
    "openPrice": 134.43,
    "volume": 4560728,
    "avgVolume": 10202301,
    "volumeRatio": 0.45,
    "athDiscountPct": 0.1
  },
  {
    "id": "pfe",
    "symbol": "PFE",
    "name": "Pfizer Inc.",
    "sector": "Biyofarmasötik & Aşı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 26.79,
    "currency": "$",
    "dailyChange": -0.04,
    "peRatio": 35.3,
    "pbRatio": 1.82,
    "dividendYield": 5.89,
    "marketCap": "$152.69B",
    "beta": 0.68,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Comirnaty mRNA aşıları, Seagen onkoloji portföyü ve kardiyovasküler tedavi ilaçları geliştiricisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.2x",
        "peerAvg": "16.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.82",
        "peerAvg": "3.2"
      }
    ],
    "high52": 28.75,
    "low52": 23.58,
    "dayHigh": 26.91,
    "dayLow": 26.42,
    "openPrice": 26.66,
    "volume": 18396262,
    "avgVolume": 42020269,
    "volumeRatio": 0.44,
    "athDiscountPct": 6.8
  },
  {
    "id": "tmo",
    "symbol": "TMO",
    "name": "Thermo Fisher Scientific",
    "sector": "Laboratuvar & Yaşam Bilimleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 588.29,
    "currency": "$",
    "dailyChange": -1.28,
    "peRatio": 31.6,
    "pbRatio": 4.5,
    "dividendYield": 0.28,
    "marketCap": "$217.52B",
    "beta": 0.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Genetik dizileme cihazları, analitik test reaktifleri ve klinik araştırma laboratuvar altyapısı sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32.4x",
        "peerAvg": "26.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.5",
        "peerAvg": "3.8"
      }
    ],
    "high52": 643.99,
    "low52": 435.27,
    "dayHigh": 594.74,
    "dayLow": 587.51,
    "openPrice": 592.11,
    "volume": 1057632,
    "avgVolume": 2247261,
    "volumeRatio": 0.47,
    "athDiscountPct": 8.6
  },
  {
    "id": "abt",
    "symbol": "ABT",
    "name": "Abbott Laboratories",
    "sector": "Tıbbi Cihaz & Tanı Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 111.25,
    "currency": "$",
    "dailyChange": -0.02,
    "peRatio": 36,
    "pbRatio": 4.8,
    "dividendYield": 1.88,
    "marketCap": "$193.78B",
    "beta": 0.72,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "FreeStyle Libre sürekli glikoz izleme sensörleri, kalp kapakçıkları ve pediatrik beslenme ürünleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26.5x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.8",
        "peerAvg": "4.2"
      }
    ],
    "high52": 137.49,
    "low52": 81.97,
    "dayHigh": 111.97,
    "dayLow": 110.79,
    "openPrice": 111.49,
    "volume": 5574732,
    "avgVolume": 12061582,
    "volumeRatio": 0.46,
    "athDiscountPct": 19.1
  },
  {
    "id": "dhr",
    "symbol": "DHR",
    "name": "Danaher Corporation",
    "sector": "Biyoteknoloji & Tanı Ekipmanları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 202.45,
    "currency": "$",
    "dailyChange": -0.71,
    "peRatio": 36.1,
    "pbRatio": 3.6,
    "dividendYield": 0.42,
    "marketCap": "$142.32B",
    "beta": 0.88,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Biyoproses filtreleme sistemleri, moleküler tanı aletleri ve yaşam bilimleri araştırma cihazları üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.0x",
        "peerAvg": "28.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.6",
        "peerAvg": "3.5"
      }
    ],
    "high52": 242.8,
    "low52": 160.93,
    "dayHigh": 203.95,
    "dayLow": 201.12,
    "openPrice": 203,
    "volume": 2244427,
    "avgVolume": 4926696,
    "volumeRatio": 0.46,
    "athDiscountPct": 16.6
  },
  {
    "id": "isrg",
    "symbol": "ISRG",
    "name": "Intuitive Surgical Inc.",
    "sector": "Robotik Cerrahi Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 394.51,
    "currency": "$",
    "dailyChange": -1.68,
    "peRatio": 45.2,
    "pbRatio": 11.2,
    "dividendYield": 0,
    "marketCap": "$141.34B",
    "beta": 1.35,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "da Vinci robotik minimal invaziv cerrahi sistemleri ve cerrahi sarf malzemeleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "78.5x",
        "peerAvg": "35.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.2",
        "peerAvg": "6.0"
      }
    ],
    "high52": 603.88,
    "low52": 328.57,
    "dayHigh": 402.46,
    "dayLow": 394.06,
    "openPrice": 401.02,
    "volume": 1977197,
    "avgVolume": 3115900,
    "volumeRatio": 0.63,
    "athDiscountPct": 34.7
  },
  {
    "id": "xom",
    "symbol": "XOM",
    "name": "Exxon Mobil Corporation",
    "sector": "Petrol & Doğalgaz Entegre",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 160.1,
    "currency": "$",
    "dailyChange": 0.94,
    "peRatio": 20.6,
    "pbRatio": 2.15,
    "dividendYield": 3.1,
    "marketCap": "$658.32B",
    "beta": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Arama-üretim, rafinaj, petrokimya ve karbon yakalama projeleriyle batı yarımkürenin en büyük petrol devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.8x",
        "peerAvg": "12.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.15",
        "peerAvg": "1.80"
      }
    ],
    "high52": 176.41,
    "low52": 105.67,
    "dayHigh": 161.25,
    "dayLow": 159.28,
    "openPrice": 159.71,
    "volume": 10205562,
    "avgVolume": 16106562,
    "volumeRatio": 0.63,
    "athDiscountPct": 9.2
  },
  {
    "id": "cvx",
    "symbol": "CVX",
    "name": "Chevron Corporation",
    "sector": "Petrol & Gaz Arama-Üretim",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 200,
    "currency": "$",
    "dailyChange": 1.16,
    "peRatio": 19.2,
    "pbRatio": 1.78,
    "dividendYield": 4.22,
    "marketCap": "$392.32B",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Permian Havzası kayaç petrolü sahaları ve küresel LNG sıvılaştırılmış doğalgaz projeleri operatörü.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.2x",
        "peerAvg": "12.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.78",
        "peerAvg": "1.65"
      }
    ],
    "high52": 214.71,
    "low52": 146.49,
    "dayHigh": 201.61,
    "dayLow": 198.35,
    "openPrice": 198.87,
    "volume": 7891576,
    "avgVolume": 8892603,
    "volumeRatio": 0.89,
    "athDiscountPct": 6.9
  },
  {
    "id": "cop",
    "symbol": "COP",
    "name": "ConocoPhillips",
    "sector": "Saf Petrol Arama & Üretim",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 126.78,
    "currency": "$",
    "dailyChange": 1.81,
    "peRatio": 16.8,
    "pbRatio": 2.45,
    "dividendYield": 2.78,
    "marketCap": "$152.31B",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Düşük maliyetli kayaç petrolü, derin deniz arama sahaları ve LNG ihracat terminalleri işleticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.8x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "2.45",
        "peerAvg": "1.90"
      }
    ],
    "high52": 135.87,
    "low52": 85.57,
    "dayHigh": 127.38,
    "dayLow": 125.37,
    "openPrice": 125.56,
    "volume": 5624281,
    "avgVolume": 7061785,
    "volumeRatio": 0.8,
    "athDiscountPct": 6.7
  },
  {
    "id": "slb",
    "symbol": "SLB",
    "name": "SLB (Schlumberger)",
    "sector": "Petrol Sahası Teknolojisi & Sondaj",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 53.77,
    "currency": "$",
    "dailyChange": 3.28,
    "peRatio": 26.2,
    "pbRatio": 2.8,
    "dividendYield": 2.49,
    "marketCap": "$79.80B",
    "beta": 1.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Petrol ve jeotermal kuyu sondajı, rezervuar karakterizasyonu ve dijital petrol sahası çözümleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.5x",
        "peerAvg": "14.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.80",
        "peerAvg": "2.50"
      }
    ],
    "high52": 58.82,
    "low52": 31.64,
    "dayHigh": 53.98,
    "dayLow": 52.2,
    "openPrice": 52.27,
    "volume": 7321533,
    "avgVolume": 14078737,
    "volumeRatio": 0.52,
    "athDiscountPct": 8.6
  },
  {
    "id": "nee",
    "symbol": "NEE",
    "name": "NextEra Energy Inc.",
    "sector": "Yenilenebilir Enerji & Elektrik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 86.19,
    "currency": "$",
    "dailyChange": 0.21,
    "peRatio": 19.4,
    "pbRatio": 3.4,
    "dividendYield": 2.5,
    "marketCap": "$179.76B",
    "beta": 0.55,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Florida Power & Light kamu hizmeti ve dünyanın en büyük rüzgar ve güneş enerjisi üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.5x",
        "peerAvg": "18.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "2.1"
      }
    ],
    "high52": 98.75,
    "low52": 69.24,
    "dayHigh": 86.53,
    "dayLow": 85.84,
    "openPrice": 86.02,
    "volume": 7236659,
    "avgVolume": 12147806,
    "volumeRatio": 0.6,
    "athDiscountPct": 12.7
  },
  {
    "id": "wmt",
    "symbol": "WMT",
    "name": "Walmart Inc.",
    "sector": "Büyük Perakende & Süpermarket",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 115.27,
    "currency": "$",
    "dailyChange": -0.39,
    "peRatio": 40.6,
    "pbRatio": 6.8,
    "dividendYield": 1.01,
    "marketCap": "$917.33B",
    "beta": 0.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "10.500'den fazla mağazası ve dev e-ticaret ağıyla dünyanın en yüksek ciroya sahip perakende devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32.5x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.8",
        "peerAvg": "4.5"
      }
    ],
    "high52": 135.16,
    "low52": 95.42,
    "dayHigh": 116.45,
    "dayLow": 114.64,
    "openPrice": 115.59,
    "volume": 14083566,
    "avgVolume": 23740632,
    "volumeRatio": 0.59,
    "athDiscountPct": 14.7
  },
  {
    "id": "cost",
    "symbol": "COST",
    "name": "Costco Wholesale Corp.",
    "sector": "Toptan Perakende & Üyelik Kulübü",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 961.1,
    "currency": "$",
    "dailyChange": -0.08,
    "peRatio": 48.3,
    "pbRatio": 16.2,
    "dividendYield": 0.51,
    "marketCap": "$426.23B",
    "beta": 0.78,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yüksek sadakatli üyelik modeliyle toptan gıda, tüketim malları ve benzin istasyonu ağı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "54.8x",
        "peerAvg": "28.0x"
      },
      {
        "label": "PD/DD",
        "value": "16.2",
        "peerAvg": "5.8"
      }
    ],
    "high52": 1096.5,
    "low52": 844.06,
    "dayHigh": 965.22,
    "dayLow": 957.75,
    "openPrice": 959.73,
    "volume": 1025194,
    "avgVolume": 2377646,
    "volumeRatio": 0.43,
    "athDiscountPct": 12.3
  },
  {
    "id": "pg",
    "symbol": "PG",
    "name": "The Procter & Gamble Co.",
    "sector": "Hızlı Tüketim & Kişisel Bakım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 144.55,
    "currency": "$",
    "dailyChange": 0.2,
    "peRatio": 21.8,
    "pbRatio": 8.5,
    "dividendYield": 2.33,
    "marketCap": "$336.60B",
    "beta": 0.42,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Pampers, Tide, Ariel, Gillette, Oral-B ve Head & Shoulders markalarıyla küresel tüketim devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "27.2x",
        "peerAvg": "22.5x"
      },
      {
        "label": "PD/DD",
        "value": "8.5",
        "peerAvg": "5.2"
      }
    ],
    "high52": 167.25,
    "low52": 137.62,
    "dayHigh": 144.91,
    "dayLow": 143.43,
    "openPrice": 144.32,
    "volume": 7248954,
    "avgVolume": 8849427,
    "volumeRatio": 0.82,
    "athDiscountPct": 13.6
  },
  {
    "id": "ko",
    "symbol": "KO",
    "name": "The Coca-Cola Company",
    "sector": "Alkolsüz İçecekler & Meşrubat",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 87.71,
    "currency": "$",
    "dailyChange": 0.33,
    "peRatio": 26.3,
    "pbRatio": 10.8,
    "dividendYield": 2.84,
    "marketCap": "$377.38B",
    "beta": 0.58,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Coca-Cola, Sprite, Fanta, Minute Maid ve Costa Coffee ile dünyanın 1 numaralı içecek şirketi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26.4x",
        "peerAvg": "23.0x"
      },
      {
        "label": "PD/DD",
        "value": "10.8",
        "peerAvg": "6.5"
      }
    ],
    "high52": 90.92,
    "low52": 65.35,
    "dayHigh": 87.97,
    "dayLow": 87.2,
    "openPrice": 87.3,
    "volume": 5877252,
    "avgVolume": 17733993,
    "volumeRatio": 0.33,
    "athDiscountPct": 3.5
  },
  {
    "id": "pep",
    "symbol": "PEP",
    "name": "PepsiCo Inc.",
    "sector": "Atıştırmalık & İçecek",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 140.79,
    "currency": "$",
    "dailyChange": 0.12,
    "peRatio": 18.5,
    "pbRatio": 11.4,
    "dividendYield": 3.1,
    "marketCap": "$192.32B",
    "beta": 0.55,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Lay's, Doritos, Cheetos atıştırmalıkları ve Pepsi, Gatorade, Tropicana içecek markaları portföyü.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.8x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.4",
        "peerAvg": "6.2"
      }
    ],
    "high52": 171.48,
    "low52": 133.73,
    "dayHigh": 141.27,
    "dayLow": 140.13,
    "openPrice": 140.62,
    "volume": 3856100,
    "avgVolume": 8768290,
    "volumeRatio": 0.44,
    "athDiscountPct": 17.9
  },
  {
    "id": "mcd",
    "symbol": "MCD",
    "name": "McDonald's Corporation",
    "sector": "Hızlı Servis Restoran Zinciri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 272.83,
    "currency": "$",
    "dailyChange": 0.21,
    "peRatio": 22.2,
    "pbRatio": -45,
    "dividendYield": 2.37,
    "marketCap": "$193.07B",
    "beta": 0.68,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "100'den fazla ülkede 40.000'den fazla franchise restoranıyla dünyanın en büyük fast-food zinciri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26.2x",
        "peerAvg": "24.5x"
      },
      {
        "label": "PD/DD",
        "value": "-",
        "peerAvg": "8.5"
      }
    ],
    "high52": 341.75,
    "low52": 260.96,
    "dayHigh": 275.34,
    "dayLow": 271.27,
    "openPrice": 272.33,
    "volume": 2731743,
    "avgVolume": 4590541,
    "volumeRatio": 0.6,
    "athDiscountPct": 20.2
  },
  {
    "id": "nke",
    "symbol": "NKE",
    "name": "NIKE Inc.",
    "sector": "Spor Ayakkabı & Giyim",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 40.73,
    "currency": "$",
    "dailyChange": -1.21,
    "peRatio": 19.4,
    "pbRatio": 8.9,
    "dividendYield": 1.8,
    "marketCap": "$60.42B",
    "beta": 1.12,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Nike, Jordan ve Converse markalarıyla spor ayakkabı, performans giyimi ve ekipman lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "23.4x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.9",
        "peerAvg": "6.2"
      }
    ],
    "high52": 80.17,
    "low52": 40,
    "dayHigh": 41.32,
    "dayLow": 40.71,
    "openPrice": 41.23,
    "volume": 19415796,
    "avgVolume": 23496911,
    "volumeRatio": 0.83,
    "athDiscountPct": 49.2
  },
  {
    "id": "sbux",
    "symbol": "SBUX",
    "name": "Starbucks Corporation",
    "sector": "Özel Kahve Zinciri & Perakende",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 107.69,
    "currency": "$",
    "dailyChange": -0.22,
    "peRatio": 62.2,
    "pbRatio": -12.5,
    "dividendYield": 2.48,
    "marketCap": "$122.77B",
    "beta": 0.98,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "38.000'den fazla mağazasıyla küresel özel kahve kavurucusu, perakendecisi ve lisansörü.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.5x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "-",
        "peerAvg": "7.8"
      }
    ],
    "high52": 110.51,
    "low52": 77.99,
    "dayHigh": 108.8,
    "dayLow": 107.47,
    "openPrice": 107.62,
    "volume": 3498952,
    "avgVolume": 7590561,
    "volumeRatio": 0.46,
    "athDiscountPct": 2.6
  },
  {
    "id": "hd",
    "symbol": "HD",
    "name": "The Home Depot Inc.",
    "sector": "Ev Geliştirme & Yapı Market",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 338.86,
    "currency": "$",
    "dailyChange": -0.83,
    "peRatio": 24,
    "pbRatio": 42,
    "dividendYield": 2.18,
    "marketCap": "$337.88B",
    "beta": 0.98,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yapı malzemeleri, ev yenileme aletleri ve profesyonel müteahhit tedarik mağazaları zinciri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "27.5x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "42.0",
        "peerAvg": "8.5"
      }
    ],
    "high52": 426.75,
    "low52": 289.1,
    "dayHigh": 340.77,
    "dayLow": 336.07,
    "openPrice": 340.81,
    "volume": 2378790,
    "avgVolume": 4575691,
    "volumeRatio": 0.52,
    "athDiscountPct": 20.6
  },
  {
    "id": "low",
    "symbol": "LOW",
    "name": "Lowe's Companies Inc.",
    "sector": "Yapı Malzemeleri Perakendesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 218.47,
    "currency": "$",
    "dailyChange": 0.11,
    "peRatio": 18.5,
    "pbRatio": -16,
    "dividendYield": 1.71,
    "marketCap": "$122.56B",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Konut bakım, onarım, tadilat ve bahçe düzenleme ürünleri süpermarket zinciri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22.8x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "-",
        "peerAvg": "7.0"
      }
    ],
    "high52": 293.06,
    "low52": 199.4,
    "dayHigh": 218.59,
    "dayLow": 215.84,
    "openPrice": 218.52,
    "volume": 1340378,
    "avgVolume": 3049722,
    "volumeRatio": 0.44,
    "athDiscountPct": 25.5
  },
  {
    "id": "tjx",
    "symbol": "TJX",
    "name": "The TJX Companies Inc.",
    "sector": "İndirimli Marka Giyim Perakendesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 152.11,
    "currency": "$",
    "dailyChange": -1.11,
    "peRatio": 29.6,
    "pbRatio": 18.2,
    "dividendYield": 1.27,
    "marketCap": "$168.04B",
    "beta": 0.92,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "T.J. Maxx, Marshalls ve HomeGoods markalarıyla indirimli lüks moda ve ev eşyası perakendecisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.4x",
        "peerAvg": "21.0x"
      },
      {
        "label": "PD/DD",
        "value": "18.2",
        "peerAvg": "6.5"
      }
    ],
    "high52": 170,
    "low52": 132.63,
    "dayHigh": 153.57,
    "dayLow": 151.71,
    "openPrice": 153.21,
    "volume": 3854435,
    "avgVolume": 5812893,
    "volumeRatio": 0.66,
    "athDiscountPct": 10.5
  },
  {
    "id": "cat",
    "symbol": "CAT",
    "name": "Caterpillar Inc.",
    "sector": "İş & Madencilik Makineleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 856.57,
    "currency": "$",
    "dailyChange": 0.23,
    "peRatio": 36.9,
    "pbRatio": 8.9,
    "dividendYield": 1.42,
    "marketCap": "$393.74B",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "İnşaat ve madencilik iş makineleri, dizel-doğalgaz motorları ve endüstriyel gaz türbinleri devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.5x",
        "peerAvg": "20.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.9",
        "peerAvg": "4.8"
      }
    ],
    "high52": 1073.46,
    "low52": 405.46,
    "dayHigh": 870.9,
    "dayLow": 850.01,
    "openPrice": 854,
    "volume": 1547014,
    "avgVolume": 3251138,
    "volumeRatio": 0.48,
    "athDiscountPct": 20.2
  },
  {
    "id": "ge",
    "symbol": "GE",
    "name": "GE Aerospace",
    "sector": "Havacılık Jet Motorları & Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 368.38,
    "currency": "$",
    "dailyChange": 2.15,
    "peRatio": 43.5,
    "pbRatio": 7.4,
    "dividendYield": 0.58,
    "marketCap": "$382.22B",
    "beta": 1.22,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ticari ve askeri uçaklar için CFM LEAP jet motorları ve aviyonik havacılık sistemleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.5x",
        "peerAvg": "28.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.4",
        "peerAvg": "5.2"
      }
    ],
    "high52": 388.84,
    "low52": 263.8,
    "dayHigh": 368.69,
    "dayLow": 361.51,
    "openPrice": 362.5,
    "volume": 2278867,
    "avgVolume": 4425685,
    "volumeRatio": 0.51,
    "athDiscountPct": 5.3
  },
  {
    "id": "ba",
    "symbol": "BA",
    "name": "The Boeing Company",
    "sector": "Ticari Uçak & Savunma Sanayi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 231.67,
    "currency": "$",
    "dailyChange": 0.58,
    "peRatio": 83.3,
    "pbRatio": -8.5,
    "dividendYield": 0,
    "marketCap": "$182.97B",
    "beta": 1.55,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Boeing 737 MAX, 787 Dreamliner ticari uçakları, AH-64 Apache ve uzay fırlatma sistemleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "-",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "-",
        "peerAvg": "4.5"
      }
    ],
    "high52": 254.35,
    "low52": 176.77,
    "dayHigh": 233.42,
    "dayLow": 229.88,
    "openPrice": 231.63,
    "volume": 2645113,
    "avgVolume": 5974550,
    "volumeRatio": 0.44,
    "athDiscountPct": 8.9
  },
  {
    "id": "rtx",
    "symbol": "RTX",
    "name": "RTX Corporation",
    "sector": "Havacılık & Savunma Teknolojileri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 222.97,
    "currency": "$",
    "dailyChange": 1.47,
    "peRatio": 39.2,
    "pbRatio": 2.6,
    "dividendYield": 2.02,
    "marketCap": "$300.51B",
    "beta": 0.78,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Pratt & Whitney uçak motorları, Collins Aerospace aviyonik ve Raytheon füze savunma sistemleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "35.2x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.6",
        "peerAvg": "3.2"
      }
    ],
    "high52": 226.88,
    "low52": 150.61,
    "dayHigh": 223.06,
    "dayLow": 219.97,
    "openPrice": 222,
    "volume": 2857706,
    "avgVolume": 5155635,
    "volumeRatio": 0.55,
    "athDiscountPct": 1.7
  },
  {
    "id": "lmt",
    "symbol": "LMT",
    "name": "Lockheed Martin Corp.",
    "sector": "Savunma Sanayi & Askeri Havacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 608.68,
    "currency": "$",
    "dailyChange": 1.78,
    "peRatio": 22.4,
    "pbRatio": 21,
    "dividendYield": 2.3,
    "marketCap": "$140.48B",
    "beta": 0.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "F-35 Lightning II hayalet savaş uçakları, HIMARS roket sistemleri ve Patriot füze teknolojisi üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "20.8x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "21.0",
        "peerAvg": "6.0"
      }
    ],
    "high52": 692,
    "low52": 437.25,
    "dayHigh": 609.24,
    "dayLow": 599.22,
    "openPrice": 603,
    "volume": 593573,
    "avgVolume": 1241438,
    "volumeRatio": 0.48,
    "athDiscountPct": 12
  },
  {
    "id": "hon",
    "symbol": "HON",
    "name": "Honeywell International",
    "sector": "Endüstriyel Otomasyon & Havacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 233.96,
    "currency": "$",
    "dailyChange": 0.29,
    "peRatio": 9,
    "pbRatio": 8.5,
    "dividendYield": 2.08,
    "marketCap": "$74.15B",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Bina otomasyon sistemleri, özel kimyasallar, havacılık donanımı ve kuantum bilişim girişimleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.5x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.5",
        "peerAvg": "5.0"
      }
    ],
    "high52": 260.28,
    "low52": 195.87,
    "dayHigh": 234.78,
    "dayLow": 232.39,
    "openPrice": 232.39,
    "volume": 1828813,
    "avgVolume": 4585492,
    "volumeRatio": 0.4,
    "athDiscountPct": 10.1
  },
  {
    "id": "unp",
    "symbol": "UNP",
    "name": "Union Pacific Corporation",
    "sector": "Demiryolu Taşımacılığı & Lojistik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 293.68,
    "currency": "$",
    "dailyChange": -1.38,
    "peRatio": 23.8,
    "pbRatio": 8.9,
    "dividendYield": 2.15,
    "marketCap": "$174.47B",
    "beta": 0.88,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ABD'nin batı eyaletlerini limanlara bağlayan 50.000 km'lik stratejik yük demiryolu ağı işletmecisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22.4x",
        "peerAvg": "20.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.9",
        "peerAvg": "5.2"
      }
    ],
    "high52": 315.99,
    "low52": 210.84,
    "dayHigh": 300.63,
    "dayLow": 293.16,
    "openPrice": 298.05,
    "volume": 1743140,
    "avgVolume": 2949869,
    "volumeRatio": 0.59,
    "athDiscountPct": 7.1
  },
  {
    "id": "ups",
    "symbol": "UPS",
    "name": "United Parcel Service",
    "sector": "Küresel Kargo & Tedarik Zinciri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 104.5,
    "currency": "$",
    "dailyChange": -0.99,
    "peRatio": 19.4,
    "pbRatio": 6.8,
    "dividendYield": 4.84,
    "marketCap": "$88.91B",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Dünya genelinde 220'den fazla ülkede paket teslimatı ve entegre tedarik zinciri yönetimi devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.5x",
        "peerAvg": "18.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.8",
        "peerAvg": "4.0"
      }
    ],
    "high52": 122.41,
    "low52": 82,
    "dayHigh": 105.9,
    "dayLow": 104.46,
    "openPrice": 105.64,
    "volume": 4216316,
    "avgVolume": 5337067,
    "volumeRatio": 0.79,
    "athDiscountPct": 14.6
  },
  {
    "id": "de",
    "symbol": "DE",
    "name": "Deere & Company",
    "sector": "Tarım & Ormancılık Makineleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 608.85,
    "currency": "$",
    "dailyChange": -0.58,
    "peRatio": 34.5,
    "pbRatio": 4.8,
    "dividendYield": 1.43,
    "marketCap": "$164.45B",
    "beta": 1.1,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "John Deere yeşil traktörleri, hassas tarım GPS otomasyonu ve inşaat ekipmanları küresel üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.8x",
        "peerAvg": "18.5x"
      },
      {
        "label": "PD/DD",
        "value": "4.8",
        "peerAvg": "3.8"
      }
    ],
    "high52": 674.19,
    "low52": 433,
    "dayHigh": 615.93,
    "dayLow": 607,
    "openPrice": 608.83,
    "volume": 539528,
    "avgVolume": 1273090,
    "volumeRatio": 0.42,
    "athDiscountPct": 9.7
  },
  {
    "id": "dis",
    "symbol": "DIS",
    "name": "The Walt Disney Company",
    "sector": "Medya & Eğlence Parkları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 106.85,
    "currency": "$",
    "dailyChange": 1.96,
    "peRatio": 22,
    "pbRatio": 1.75,
    "dividendYield": 0.93,
    "marketCap": "$184.50B",
    "beta": 1.38,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Disney+, Marvel, Star Wars, Pixar stüdyoları, tema parkları ve ESPN spor yayıncılık devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.5x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.75",
        "peerAvg": "2.40"
      }
    ],
    "high52": 119.78,
    "low52": 92.19,
    "dayHigh": 107.11,
    "dayLow": 104.91,
    "openPrice": 104.99,
    "volume": 8113296,
    "avgVolume": 10558924,
    "volumeRatio": 0.77,
    "athDiscountPct": 10.8
  },
  {
    "id": "cmcsa",
    "symbol": "CMCSA",
    "name": "Comcast Corporation",
    "sector": "Kablo, Genişbant & Universal Stüdyo",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 26.18,
    "currency": "$",
    "dailyChange": 0,
    "peRatio": 8.4,
    "pbRatio": 1.95,
    "dividendYield": 2.9,
    "marketCap": "$92.90B",
    "beta": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Xfinity yüksek hızlı internet, NBCUniversal medya kanalları ve Universal Studios tema parkları.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.2x",
        "peerAvg": "15.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.95",
        "peerAvg": "2.20"
      }
    ],
    "high52": 32.86,
    "low52": 21.28,
    "dayHigh": 26.49,
    "dayLow": 26.13,
    "openPrice": 26.37,
    "volume": 19192834,
    "avgVolume": 35042437,
    "volumeRatio": 0.55,
    "athDiscountPct": 20.3
  },
  {
    "id": "t",
    "symbol": "T",
    "name": "AT&T Inc.",
    "sector": "5G Mobil İletişim & Fiber Ağ",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 24.89,
    "currency": "$",
    "dailyChange": 1.26,
    "peRatio": 8.2,
    "pbRatio": 1.35,
    "dividendYield": 4.95,
    "marketCap": "$170.56B",
    "beta": 0.72,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ABD genelinde 5G kablosuz iletişim, gigabit fiber internet ve kurumsal veri bağlantı hizmetleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.8x",
        "peerAvg": "14.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.35",
        "peerAvg": "1.80"
      }
    ],
    "high52": 29.79,
    "low52": 19.89,
    "dayHigh": 24.97,
    "dayLow": 24.57,
    "openPrice": 24.65,
    "volume": 26029334,
    "avgVolume": 63867445,
    "volumeRatio": 0.41,
    "athDiscountPct": 16.4
  },
  {
    "id": "vz",
    "symbol": "VZ",
    "name": "Verizon Communications",
    "sector": "Kablosuz Telekomünikasyon",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 48.48,
    "currency": "$",
    "dailyChange": 0.54,
    "peRatio": 12.6,
    "pbRatio": 1.9,
    "dividendYield": 6.08,
    "marketCap": "$201.42B",
    "beta": 0.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ABD'nin en geniş kapsama alanına sahip kablosuz 5G operatörü ve fiber ağ altyapısı sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.4x",
        "peerAvg": "14.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.90",
        "peerAvg": "1.80"
      }
    ],
    "high52": 51.68,
    "low52": 38.39,
    "dayHigh": 48.6,
    "dayLow": 48.19,
    "openPrice": 48.46,
    "volume": 15049142,
    "avgVolume": 27559501,
    "volumeRatio": 0.55,
    "athDiscountPct": 6.2
  },
  {
    "id": "txn",
    "symbol": "TXN",
    "name": "Texas Instruments",
    "sector": "Analog Çipler",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 279.58,
    "currency": "$",
    "dailyChange": 2.25,
    "peRatio": 42.6,
    "pbRatio": 11.2,
    "dividendYield": 2.65,
    "marketCap": "$255.33B",
    "beta": 1.33,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Texas Instruments (TXN), ABD borsalarında Analog Çipler sektöründe işlem gören lider şirket. Endüstriyel ve otomotiv analog entegre devreleri ile gömülü işlemciler lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 334.03,
    "low52": 152.73,
    "dayHigh": 280.27,
    "dayLow": 272.51,
    "openPrice": 273.5,
    "volume": 4747660,
    "avgVolume": 8602133,
    "volumeRatio": 0.55,
    "athDiscountPct": 16.3
  },
  {
    "id": "klac",
    "symbol": "KLAC",
    "name": "KLA Corporation",
    "sector": "Yarı İletken Süreç Kontrolü",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 203.72,
    "currency": "$",
    "dailyChange": -2.7,
    "peRatio": 55.5,
    "pbRatio": 28.5,
    "dividendYield": 0.92,
    "marketCap": "$266.17B",
    "beta": 1.49,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "KLA Corporation (KLAC), ABD borsalarında Yarı İletken Süreç Kontrolü sektöründe işlem gören lider şirket. Nanometre seviyesinde silikon gofret kusur tespit ve metroloji sistemleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.4x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "28.5",
        "peerAvg": "5.50"
      }
    ],
    "high52": 307.37,
    "low52": 83.22,
    "dayHigh": 208.87,
    "dayLow": 200.86,
    "openPrice": 206.7,
    "volume": 7027440,
    "avgVolume": 12839261,
    "volumeRatio": 0.55,
    "athDiscountPct": 33.7
  },
  {
    "id": "cdns",
    "symbol": "CDNS",
    "name": "Cadence Design Systems",
    "sector": "Elektronik Tasarım Otomasyonu (EDA)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 324.82,
    "currency": "$",
    "dailyChange": 0.32,
    "peRatio": 64.6,
    "pbRatio": 18.2,
    "dividendYield": 0,
    "marketCap": "$89.59B",
    "beta": 1.46,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Cadence Design Systems (CDNS), ABD borsalarında Elektronik Tasarım Otomasyonu (EDA) sektöründe işlem gören lider şirket. Mikroçip tasarımı, simülasyonu ve özel ASIC geliştirme yazılımları lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "64x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "18.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 416.69,
    "low52": 262.75,
    "dayHigh": 326.87,
    "dayLow": 319.46,
    "openPrice": 324.9,
    "volume": 2482141,
    "avgVolume": 2405319,
    "volumeRatio": 1.03,
    "athDiscountPct": 22
  },
  {
    "id": "snps",
    "symbol": "SNPS",
    "name": "Synopsys Inc.",
    "sector": "Silikon Tasarım Yazılımı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 421.5,
    "currency": "$",
    "dailyChange": 2.37,
    "peRatio": 96.2,
    "pbRatio": 12.4,
    "dividendYield": 0,
    "marketCap": "$80.71B",
    "beta": 1.52,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Synopsys Inc. (SNPS), ABD borsalarında Silikon Tasarım Yazılımı sektöründe işlem gören lider şirket. Yarı iletken IP blokları, silikon tasarım otomasyonu ve yazılım güvenlik araçları.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "58.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "12.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 626.24,
    "low52": 366,
    "dayHigh": 423.95,
    "dayLow": 409.5,
    "openPrice": 414.11,
    "volume": 1100251,
    "avgVolume": 1987495,
    "volumeRatio": 0.55,
    "athDiscountPct": 32.7
  },
  {
    "id": "mrvl",
    "symbol": "MRVL",
    "name": "Marvell Technology",
    "sector": "Veri Merkezi Çipleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 222.02,
    "currency": "$",
    "dailyChange": -0.07,
    "peRatio": 76.3,
    "pbRatio": 4.8,
    "dividendYield": 0.27,
    "marketCap": "$199.27B",
    "beta": 1.46,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Marvell Technology (MRVL), ABD borsalarında Veri Merkezi Çipleri sektöründe işlem gören lider şirket. Yapay zeka veri merkezleri için optik ara bağlantı ve özel ASIC işlemcileri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "48x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 329.88,
    "low52": 61.44,
    "dayHigh": 223.52,
    "dayLow": 217.1,
    "openPrice": 221.4,
    "volume": 14344758,
    "avgVolume": 41081091,
    "volumeRatio": 0.35,
    "athDiscountPct": 32.7
  },
  {
    "id": "anet",
    "symbol": "ANET",
    "name": "Arista Networks",
    "sector": "Bulut Ağ Ekipmanları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 198.82,
    "currency": "$",
    "dailyChange": -2.36,
    "peRatio": 62.9,
    "pbRatio": 12.8,
    "dividendYield": 0,
    "marketCap": "$250.76B",
    "beta": 0.87,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Arista Networks (ANET), ABD borsalarında Bulut Ağ Ekipmanları sektöründe işlem gören lider şirket. Dev bulut veri merkezleri ve yapay zeka kümeleri için yüksek hızlı ağ anahtarları (switch).",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "44.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "12.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 214.89,
    "low52": 114.52,
    "dayHigh": 205.27,
    "dayLow": 198.25,
    "openPrice": 205.27,
    "volume": 4701838,
    "avgVolume": 8449041,
    "volumeRatio": 0.56,
    "athDiscountPct": 7.5
  },
  {
    "id": "mchp",
    "symbol": "MCHP",
    "name": "Microchip Technology",
    "sector": "Mikrodenetleyiciler",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 79.17,
    "currency": "$",
    "dailyChange": 1.91,
    "peRatio": 116.4,
    "pbRatio": 6.5,
    "dividendYield": 2.3,
    "marketCap": "$42.99B",
    "beta": 1.04,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Microchip Technology (MCHP), ABD borsalarında Mikrodenetleyiciler sektöründe işlem gören lider şirket. PIC mikrodenetleyicileri, karışık sinyal ve Flash-IP entegre devreleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.5",
        "peerAvg": "5.50"
      }
    ],
    "high52": 105.91,
    "low52": 48.52,
    "dayHigh": 79.34,
    "dayLow": 77.27,
    "openPrice": 77.7,
    "volume": 7756389,
    "avgVolume": 11741701,
    "volumeRatio": 0.66,
    "athDiscountPct": 25.2
  },
  {
    "id": "on",
    "symbol": "ON",
    "name": "ON Semiconductor",
    "sector": "Güç Yarı İletkenleri (SiC)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 82.66,
    "currency": "$",
    "dailyChange": 1.35,
    "peRatio": 54,
    "pbRatio": 3.8,
    "dividendYield": 0,
    "marketCap": "$32.18B",
    "beta": 1.18,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ON Semiconductor (ON), ABD borsalarında Güç Yarı İletkenleri (SiC) sektöründe işlem gören lider şirket. Elektrikli araç güç aktarma organları ve endüstriyel silisyum karbür (SiC) güç çipleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 134.92,
    "low52": 44.56,
    "dayHigh": 83.57,
    "dayLow": 81.5,
    "openPrice": 81.69,
    "volume": 4472154,
    "avgVolume": 11842258,
    "volumeRatio": 0.38,
    "athDiscountPct": 38.7
  },
  {
    "id": "adi",
    "symbol": "ADI",
    "name": "Analog Devices Inc.",
    "sector": "Sinyal İşleme Entegreleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 389.39,
    "currency": "$",
    "dailyChange": 2.16,
    "peRatio": 57.8,
    "pbRatio": 3.2,
    "dividendYield": 1.62,
    "marketCap": "$189.67B",
    "beta": 1.17,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Analog Devices Inc. (ADI), ABD borsalarında Sinyal İşleme Entegreleri sektöründe işlem gören lider şirket. Sensör arayüzleri, veri dönüştürücüler ve yüksek performanslı analog sinyal işleme.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "34x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 445.91,
    "low52": 223.47,
    "dayHigh": 389.45,
    "dayLow": 380.17,
    "openPrice": 381.94,
    "volume": 2106632,
    "avgVolume": 4748185,
    "volumeRatio": 0.44,
    "athDiscountPct": 12.7
  },
  {
    "id": "ftnt",
    "symbol": "FTNT",
    "name": "Fortinet Inc.",
    "sector": "Ağ Güvenliği & FortiGate",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 160.01,
    "currency": "$",
    "dailyChange": -3.28,
    "peRatio": 56.5,
    "pbRatio": 14.5,
    "dividendYield": 0,
    "marketCap": "$117.40B",
    "beta": 1.54,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Fortinet Inc. (FTNT), ABD borsalarında Ağ Güvenliği & FortiGate sektöründe işlem gören lider şirket. FortiGate donanımsal güvenlik duvarları ve SASE bulut güvenlik mimarisi çözümleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "42x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "14.5",
        "peerAvg": "5.50"
      }
    ],
    "high52": 172.09,
    "low52": 73.55,
    "dayHigh": 165.75,
    "dayLow": 159.1,
    "openPrice": 165.75,
    "volume": 2792696,
    "avgVolume": 5984172,
    "volumeRatio": 0.47,
    "athDiscountPct": 7
  },
  {
    "id": "wday",
    "symbol": "WDAY",
    "name": "Workday Inc.",
    "sector": "İnsan Kaynakları & Finans Bulutu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 198.68,
    "currency": "$",
    "dailyChange": -3.76,
    "peRatio": 61.7,
    "pbRatio": 9.2,
    "dividendYield": 0,
    "marketCap": "$49.07B",
    "beta": 1,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Workday Inc. (WDAY), ABD borsalarında İnsan Kaynakları & Finans Bulutu sektöründe işlem gören lider şirket. Büyük kurumsal şirketler için bulut tabanlı İK yönetimi ve finansal planlama yazılımı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "48.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "9.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 249.85,
    "low52": 110.36,
    "dayHigh": 208,
    "dayLow": 195.01,
    "openPrice": 207.83,
    "volume": 7830817,
    "avgVolume": 5303074,
    "volumeRatio": 1.48,
    "athDiscountPct": 20.5
  },
  {
    "id": "team",
    "symbol": "TEAM",
    "name": "Atlassian Corporation",
    "sector": "Yazılım Geliştirme Araçları (Jira)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 162.22,
    "currency": "$",
    "dailyChange": -2.27,
    "peRatio": 54,
    "pbRatio": 24,
    "dividendYield": 0,
    "marketCap": "$41.17B",
    "beta": 0.93,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Atlassian Corporation (TEAM), ABD borsalarında Yazılım Geliştirme Araçları (Jira) sektöründe işlem gören lider şirket. Jira, Confluence, Trello ve Bitbucket iş birliği ve yazılım yönetim araçları sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "54x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "24",
        "peerAvg": "5.50"
      }
    ],
    "high52": 184,
    "low52": 56.01,
    "dayHigh": 167.72,
    "dayLow": 161.84,
    "openPrice": 166.21,
    "volume": 4176796,
    "avgVolume": 5040341,
    "volumeRatio": 0.83,
    "athDiscountPct": 11.8
  },
  {
    "id": "ddog",
    "symbol": "DDOG",
    "name": "Datadog Inc.",
    "sector": "Bulut İzleme & Güvenlik Analitiği",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 255.46,
    "currency": "$",
    "dailyChange": 1.28,
    "peRatio": 500.9,
    "pbRatio": 14.2,
    "dividendYield": 0,
    "marketCap": "$91.73B",
    "beta": 0.92,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Datadog Inc. (DDOG), ABD borsalarında Bulut İzleme & Güvenlik Analitiği sektöründe işlem gören lider şirket. Bulut altyapısı, sunucusuz mimariler ve APM uygulama performans izleme platformu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "72x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "14.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 292.72,
    "low52": 98.01,
    "dayHigh": 257.96,
    "dayLow": 248.39,
    "openPrice": 252.62,
    "volume": 4366268,
    "avgVolume": 5317262,
    "volumeRatio": 0.82,
    "athDiscountPct": 12.7
  },
  {
    "id": "mdb",
    "symbol": "MDB",
    "name": "MongoDB Inc.",
    "sector": "Doküman Veritabanı Platformu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 460.33,
    "currency": "$",
    "dailyChange": -2.53,
    "peRatio": 85,
    "pbRatio": 18,
    "dividendYield": 0,
    "marketCap": "$37.03B",
    "beta": 1.26,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "MongoDB Inc. (MDB), ABD borsalarında Doküman Veritabanı Platformu sektöründe işlem gören lider şirket. Geliştiricilerin en çok tercih ettiği modern NoSQL doküman veritabanı ve Atlas bulut servisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "85x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "18",
        "peerAvg": "5.50"
      }
    ],
    "high52": 473.1,
    "low52": 206.92,
    "dayHigh": 473.1,
    "dayLow": 455.19,
    "openPrice": 470,
    "volume": 1575075,
    "avgVolume": 2004622,
    "volumeRatio": 0.79,
    "athDiscountPct": 2.7
  },
  {
    "id": "coin",
    "symbol": "COIN",
    "name": "Coinbase Global Inc.",
    "sector": "Kripto Varlık Borsası & Saklama",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 148.47,
    "currency": "$",
    "dailyChange": -3.53,
    "peRatio": 38,
    "pbRatio": 5.4,
    "dividendYield": 0,
    "marketCap": "$39.17B",
    "beta": 1.29,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Coinbase Global Inc. (COIN), ABD borsalarında Kripto Varlık Borsası & Saklama sektöründe işlem gören lider şirket. ABD'nin en büyük regüle kripto para borsası ve kurumsal spot Bitcoin/ETH saklayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 402.16,
    "low52": 139.11,
    "dayHigh": 152.58,
    "dayLow": 147.86,
    "openPrice": 151.4,
    "volume": 7098837,
    "avgVolume": 7990869,
    "volumeRatio": 0.89,
    "athDiscountPct": 63.1
  },
  {
    "id": "pypl",
    "symbol": "PYPL",
    "name": "PayPal Holdings Inc.",
    "sector": "Dijital Cüzdan & Ödeme",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 61.66,
    "currency": "$",
    "dailyChange": 1.77,
    "peRatio": 11.7,
    "pbRatio": 3.8,
    "dividendYield": 0,
    "marketCap": "$53.15B",
    "beta": 0.91,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "PayPal Holdings Inc. (PYPL), ABD borsalarında Dijital Cüzdan & Ödeme sektöründe işlem gören lider şirket. PayPal, Venmo ve Braintree dijital cüzdan ve e-ticaret ödeme altyapısı sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.2x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 79.22,
    "low52": 38.46,
    "dayHigh": 62.31,
    "dayLow": 59.34,
    "openPrice": 60.47,
    "volume": 15034865,
    "avgVolume": 16079446,
    "volumeRatio": 0.94,
    "athDiscountPct": 22.2
  },
  {
    "id": "bk",
    "symbol": "BK",
    "name": "The Bank of New York Mellon",
    "sector": "Saklama Bankacılığı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 74.5,
    "currency": "$",
    "dailyChange": -1.96,
    "peRatio": 15,
    "pbRatio": 1.55,
    "dividendYield": 2.52,
    "marketCap": "$56B",
    "beta": 1.53,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "The Bank of New York Mellon (BK), ABD borsalarında Saklama Bankacılığı sektöründe işlem gören lider şirket. 50 trilyon dolarlık küresel varlık saklama (custody) ve menkul kıymet takas devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.55",
        "peerAvg": "5.50"
      }
    ]
  },
  {
    "id": "spgi",
    "symbol": "SPGI",
    "name": "S&P Global Inc.",
    "sector": "Finansal Veri & Kredi Derecelendirme",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 418.8,
    "currency": "$",
    "dailyChange": -0.92,
    "peRatio": 25.5,
    "pbRatio": 5.2,
    "dividendYield": 0.72,
    "marketCap": "$123.46B",
    "beta": 0.96,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "S&P Global Inc. (SPGI), ABD borsalarında Finansal Veri & Kredi Derecelendirme sektöründe işlem gören lider şirket. S&P 500 endeks lisansörü, S&P Capital IQ veri platformu ve küresel kredi derecelendirme.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 529.42,
    "low52": 361.03,
    "dayHigh": 423.22,
    "dayLow": 414.22,
    "openPrice": 422.01,
    "volume": 1195111,
    "avgVolume": 2312550,
    "volumeRatio": 0.52,
    "athDiscountPct": 20.9
  },
  {
    "id": "mco",
    "symbol": "MCO",
    "name": "Moody's Corporation",
    "sector": "Kredi Notu & Risk Analitiği",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 484.96,
    "currency": "$",
    "dailyChange": -0.5,
    "peRatio": 30.8,
    "pbRatio": 24,
    "dividendYield": 0.7,
    "marketCap": "$83.99B",
    "beta": 1.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Moody's Corporation (MCO), ABD borsalarında Kredi Notu & Risk Analitiği sektöründe işlem gören lider şirket. Tahvil kredi derecelendirme (Moody's Investors Service) ve kurumsal risk modelleme.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "42x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "24",
        "peerAvg": "5.50"
      }
    ],
    "high52": 546.88,
    "low52": 402.28,
    "dayHigh": 487.71,
    "dayLow": 480.34,
    "openPrice": 487.11,
    "volume": 404821,
    "avgVolume": 961093,
    "volumeRatio": 0.42,
    "athDiscountPct": 11.3
  },
  {
    "id": "ice",
    "symbol": "ICE",
    "name": "Intercontinental Exchange",
    "sector": "Borsa İşleticisi (NYSE)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 154.73,
    "currency": "$",
    "dailyChange": -0.33,
    "peRatio": 21.8,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "$86.86B",
    "beta": 1.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Intercontinental Exchange (ICE), ABD borsalarında Borsa İşleticisi (NYSE) sektöründe işlem gören lider şirket. New York Menkul Kıymetler Borsası (NYSE) ve Brent petrol vadeli işlem piyasaları işletmecisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 181.72,
    "low52": 121.79,
    "dayHigh": 155.35,
    "dayLow": 153.26,
    "openPrice": 155.24,
    "volume": 1172083,
    "avgVolume": 4584400,
    "volumeRatio": 0.26,
    "athDiscountPct": 14.9
  },
  {
    "id": "cme",
    "symbol": "CME",
    "name": "CME Group Inc.",
    "sector": "Türev & Vadeli İşlemler Borsası",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 269.8,
    "currency": "$",
    "dailyChange": 0.97,
    "peRatio": 22.9,
    "pbRatio": 3,
    "dividendYield": 4.25,
    "marketCap": "$97.01B",
    "beta": 1.17,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "CME Group Inc. (CME), ABD borsalarında Türev & Vadeli İşlemler Borsası sektöründe işlem gören lider şirket. Chicago Ticaret Borsası; faiz, hisse, emtia ve döviz vadeli işlem kontratlarının merkezi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3",
        "peerAvg": "5.50"
      }
    ],
    "high52": 329.16,
    "low52": 218.31,
    "dayHigh": 271.09,
    "dayLow": 265.56,
    "openPrice": 266.88,
    "volume": 1716986,
    "avgVolume": 3271658,
    "volumeRatio": 0.52,
    "athDiscountPct": 18
  },
  {
    "id": "schw",
    "symbol": "SCHW",
    "name": "The Charles Schwab Corp.",
    "sector": "Yatırım Aracılığı & Varlık Yönetimi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 111.09,
    "currency": "$",
    "dailyChange": 1.23,
    "peRatio": 20.2,
    "pbRatio": 3.8,
    "dividendYield": 1.3,
    "marketCap": "$192.11B",
    "beta": 1.41,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "The Charles Schwab Corp. (SCHW), ABD borsalarında Yatırım Aracılığı & Varlık Yönetimi sektöründe işlem gören lider şirket. 9 trilyon dolarlık müşteri varlığıyla bireysel yatırım, borsa aracılığı ve bankacılık.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 111.18,
    "low52": 83.96,
    "dayHigh": 111.18,
    "dayLow": 109.19,
    "openPrice": 109.75,
    "volume": 4778385,
    "avgVolume": 10108414,
    "volumeRatio": 0.47,
    "athDiscountPct": 0.1
  },
  {
    "id": "cvs",
    "symbol": "CVS",
    "name": "CVS Health Corporation",
    "sector": "Eczane Perakendesi & Sağlık Sigortası",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 97.16,
    "currency": "$",
    "dailyChange": 2.28,
    "peRatio": 25.6,
    "pbRatio": 1.05,
    "dividendYield": 4.26,
    "marketCap": "$124.26B",
    "beta": 1.38,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "CVS Health Corporation (CVS), ABD borsalarında Eczane Perakendesi & Sağlık Sigortası sektöründe işlem gören lider şirket. 9.000'den fazla eczanesi, MinuteClinic sağlık merkezleri ve Aetna sağlık sigortası.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.05",
        "peerAvg": "5.50"
      }
    ],
    "high52": 110.68,
    "low52": 69.4,
    "dayHigh": 97.51,
    "dayLow": 94.41,
    "openPrice": 94.6,
    "volume": 9435378,
    "avgVolume": 8159427,
    "volumeRatio": 1.16,
    "athDiscountPct": 12.2
  },
  {
    "id": "ci",
    "symbol": "CI",
    "name": "The Cigna Group",
    "sector": "Küresel Sağlık Hizmetleri & Sigorta",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 282.56,
    "currency": "$",
    "dailyChange": 1.64,
    "peRatio": 11.7,
    "pbRatio": 2.1,
    "dividendYield": 1.68,
    "marketCap": "$74.66B",
    "beta": 1.49,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "The Cigna Group (CI), ABD borsalarında Küresel Sağlık Hizmetleri & Sigorta sektöründe işlem gören lider şirket. Evernorth eczane fayda yönetimi ve kurumsal sağlık sigortası çözümleri sağlayıcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "5.50"
      }
    ],
    "high52": 315.47,
    "low52": 239.51,
    "dayHigh": 283,
    "dayLow": 277.69,
    "openPrice": 278.54,
    "volume": 679118,
    "avgVolume": 1714077,
    "volumeRatio": 0.4,
    "athDiscountPct": 10.4
  },
  {
    "id": "elv",
    "symbol": "ELV",
    "name": "Elevance Health Inc.",
    "sector": "Sağlık Sigortası (Anthem)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 400.32,
    "currency": "$",
    "dailyChange": 0.53,
    "peRatio": 17.7,
    "pbRatio": 2.4,
    "dividendYield": 1.52,
    "marketCap": "$86.82B",
    "beta": 0.89,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Elevance Health Inc. (ELV), ABD borsalarında Sağlık Sigortası (Anthem) sektöründe işlem gören lider şirket. Anthem Blue Cross Blue Shield planlarıyla 47 milyon üyeye sağlık sigortası hizmeti.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.8x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 436.24,
    "low52": 274.84,
    "dayHigh": 402.3,
    "dayLow": 397.23,
    "openPrice": 398.39,
    "volume": 730744,
    "avgVolume": 1538043,
    "volumeRatio": 0.48,
    "athDiscountPct": 8.2
  },
  {
    "id": "bmy",
    "symbol": "BMY",
    "name": "Bristol-Myers Squibb",
    "sector": "Biyofarmasötik & İmmünoterapi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 63.83,
    "currency": "$",
    "dailyChange": -1.27,
    "peRatio": 14.1,
    "pbRatio": 4.2,
    "dividendYield": 4.44,
    "marketCap": "$130.39B",
    "beta": 1.5,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Bristol-Myers Squibb (BMY), ABD borsalarında Biyofarmasötik & İmmünoterapi sektöründe işlem gören lider şirket. Opdivo ve Eliquis kan sulandırıcı ile onkoloji ve kardiyoloji yenilikçi tedavileri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 68.1,
    "low52": 42.52,
    "dayHigh": 64.33,
    "dayLow": 63.35,
    "openPrice": 64.13,
    "volume": 7528229,
    "avgVolume": 12392709,
    "volumeRatio": 0.61,
    "athDiscountPct": 6.3
  },
  {
    "id": "amgn",
    "symbol": "AMGN",
    "name": "Amgen Inc.",
    "sector": "Biyoteknoloji Öncüsü",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 415.21,
    "currency": "$",
    "dailyChange": -0.63,
    "peRatio": 25.8,
    "pbRatio": 16.5,
    "dividendYield": 2.78,
    "marketCap": "$224.09B",
    "beta": 1.37,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Amgen Inc. (AMGN), ABD borsalarında Biyoteknoloji Öncüsü sektöründe işlem gören lider şirket. Biyolojik ilaçların öncüsü; Prolia kemik sağlığı, Enbrel ve Repatha kolesterol tedavileri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.2x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "16.5",
        "peerAvg": "5.50"
      }
    ],
    "high52": 421.79,
    "low52": 269.77,
    "dayHigh": 416.03,
    "dayLow": 410.5,
    "openPrice": 413.76,
    "volume": 1693246,
    "avgVolume": 2701456,
    "volumeRatio": 0.63,
    "athDiscountPct": 1.6
  },
  {
    "id": "gild",
    "symbol": "GILD",
    "name": "Gilead Sciences Inc.",
    "sector": "Viroloji & Onkoloji",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 138.36,
    "currency": "$",
    "dailyChange": 0.16,
    "peRatio": 16,
    "pbRatio": 4.8,
    "dividendYield": 3.48,
    "marketCap": "$171.56B",
    "beta": 1.46,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Gilead Sciences Inc. (GILD), ABD borsalarında Viroloji & Onkoloji sektöründe işlem gören lider şirket. HIV tedavileri (Biktarvy), Hepatit C ilaçları ve Yescarta CAR-T hücre terapileri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 157.29,
    "low52": 108.46,
    "dayHigh": 138.43,
    "dayLow": 135.91,
    "openPrice": 136.81,
    "volume": 3296047,
    "avgVolume": 7681866,
    "volumeRatio": 0.43,
    "athDiscountPct": 12
  },
  {
    "id": "vrtx",
    "symbol": "VRTX",
    "name": "Vertex Pharmaceuticals",
    "sector": "Kistik Fibrozis & Gen Tedavileri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 505.75,
    "currency": "$",
    "dailyChange": -2.07,
    "peRatio": 29.5,
    "pbRatio": 6.2,
    "dividendYield": 0,
    "marketCap": "$128.11B",
    "beta": 0.99,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Vertex Pharmaceuticals (VRTX), ABD borsalarında Kistik Fibrozis & Gen Tedavileri sektöründe işlem gören lider şirket. Kistik fibrozis hedefli tedaviler ve CRISPR tabanlı Casgevy orak hücre gen terapisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 546.17,
    "low52": 374.17,
    "dayHigh": 513.64,
    "dayLow": 502.29,
    "openPrice": 511.41,
    "volume": 1130475,
    "avgVolume": 1568306,
    "volumeRatio": 0.72,
    "athDiscountPct": 7.4
  },
  {
    "id": "regn",
    "symbol": "REGN",
    "name": "Regeneron Pharmaceuticals",
    "sector": "Antikor Teknolojileri & Göz Sağlığı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 803.48,
    "currency": "$",
    "dailyChange": -0.31,
    "peRatio": 19.9,
    "pbRatio": 3.8,
    "dividendYield": 0,
    "marketCap": "$82.72B",
    "beta": 1.53,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Regeneron Pharmaceuticals (REGN), ABD borsalarında Antikor Teknolojileri & Göz Sağlığı sektöründe işlem gören lider şirket. Dupixent egzama/astım antikoru ve Eylea göz hastalıkları tedavisi geliştiricisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 821.11,
    "low52": 541,
    "dayHigh": 806.53,
    "dayLow": 792.57,
    "openPrice": 802.35,
    "volume": 375823,
    "avgVolume": 1009122,
    "volumeRatio": 0.37,
    "athDiscountPct": 2.1
  },
  {
    "id": "syk",
    "symbol": "SYK",
    "name": "Stryker Corporation",
    "sector": "Ortopedi & Tıbbi Cihazlar",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 339.21,
    "currency": "$",
    "dailyChange": -0.55,
    "peRatio": 35.2,
    "pbRatio": 7.2,
    "dividendYield": 0.88,
    "marketCap": "$130.11B",
    "beta": 1.38,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Stryker Corporation (SYK), ABD borsalarında Ortopedi & Tıbbi Cihazlar sektöründe işlem gören lider şirket. Mako robotik eklem cerrahisi, implantlar, sedyeler ve acil tıp müdahale ekipmanları.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "34x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 396.86,
    "low52": 281,
    "dayHigh": 341.51,
    "dayLow": 335.12,
    "openPrice": 341.5,
    "volume": 2490070,
    "avgVolume": 2619035,
    "volumeRatio": 0.95,
    "athDiscountPct": 14.5
  },
  {
    "id": "mdt",
    "symbol": "MDT",
    "name": "Medtronic plc",
    "sector": "Kalp Pilleri & Tıbbi Teknolojiler",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 91.27,
    "currency": "$",
    "dailyChange": 0.76,
    "peRatio": 24.5,
    "pbRatio": 2.2,
    "dividendYield": 3.18,
    "marketCap": "$116.83B",
    "beta": 0.9,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Medtronic plc (MDT), ABD borsalarında Kalp Pilleri & Tıbbi Teknolojiler sektöründe işlem gören lider şirket. Kalp pilleri, insülin pompaları, omurga cerrahisi ve minimal invaziv cerrahi aletleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 106.33,
    "low52": 73.31,
    "dayHigh": 91.99,
    "dayLow": 90.44,
    "openPrice": 90.99,
    "volume": 7168954,
    "avgVolume": 9334145,
    "volumeRatio": 0.77,
    "athDiscountPct": 14.2
  },
  {
    "id": "bsx",
    "symbol": "BSX",
    "name": "Boston Scientific Corp.",
    "sector": "Girişimsel Kardiyoloji Cihazları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 51.83,
    "currency": "$",
    "dailyChange": 0.27,
    "peRatio": 21,
    "pbRatio": 5.8,
    "dividendYield": 0,
    "marketCap": "$75.11B",
    "beta": 1.27,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Boston Scientific Corp. (BSX), ABD borsalarında Girişimsel Kardiyoloji Cihazları sektöründe işlem gören lider şirket. WATCHMAN sol atriyal apendiks kapatma cihazı ve koroner stent sistemleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "42x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 109.5,
    "low52": 42.2,
    "dayHigh": 52.99,
    "dayLow": 51.7,
    "openPrice": 52.83,
    "volume": 16274230,
    "avgVolume": 20938479,
    "volumeRatio": 0.78,
    "athDiscountPct": 52.7
  },
  {
    "id": "bdx",
    "symbol": "BDX",
    "name": "Becton, Dickinson and Company",
    "sector": "Tıbbi Sarf & Enjeksiyon Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 183.4,
    "currency": "$",
    "dailyChange": 0.79,
    "peRatio": 31.7,
    "pbRatio": 2.6,
    "dividendYield": 1.6,
    "marketCap": "$49.96B",
    "beta": 1.55,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Becton, Dickinson and Company (BDX), ABD borsalarında Tıbbi Sarf & Enjeksiyon Sistemleri sektöründe işlem gören lider şirket. Şırıngalar, damar içi kateterler, tanı tüpleri ve diyabet bakım enjeksiyon sistemleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.6",
        "peerAvg": "5.50"
      }
    ],
    "high52": 187.35,
    "low52": 127.59,
    "dayHigh": 183.82,
    "dayLow": 181.26,
    "openPrice": 182.12,
    "volume": 712383,
    "avgVolume": 2358032,
    "volumeRatio": 0.3,
    "athDiscountPct": 2.1
  },
  {
    "id": "ew",
    "symbol": "EW",
    "name": "Edwards Lifesciences",
    "sector": "Yapay Kalp Kapakçıkları (TAVR)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 91.6,
    "currency": "$",
    "dailyChange": -1.04,
    "peRatio": 54.5,
    "pbRatio": 4.8,
    "dividendYield": 0,
    "marketCap": "$52.74B",
    "beta": 1.19,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Edwards Lifesciences (EW), ABD borsalarında Yapay Kalp Kapakçıkları (TAVR) sektöründe işlem gören lider şirket. Açık kalp ameliyatsız transkateter aort kapak replasmanı (TAVR) sistemleri lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 96.29,
    "low52": 72.3,
    "dayHigh": 92.9,
    "dayLow": 91.48,
    "openPrice": 92.92,
    "volume": 1950298,
    "avgVolume": 4865722,
    "volumeRatio": 0.4,
    "athDiscountPct": 4.9
  },
  {
    "id": "eog",
    "symbol": "EOG",
    "name": "EOG Resources Inc.",
    "sector": "Petrol & Doğalgaz Arama",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 142.61,
    "currency": "$",
    "dailyChange": 0.85,
    "peRatio": 11.1,
    "pbRatio": 2.4,
    "dividendYield": 2.76,
    "marketCap": "$75.96B",
    "beta": 0.92,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "EOG Resources Inc. (EOG), ABD borsalarında Petrol & Doğalgaz Arama sektöründe işlem gören lider şirket. ABD kayaç formasyonlarında yüksek verimli 'premium' petrol ve gaz kuyusu sondajcısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.2x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 151.87,
    "low52": 101.59,
    "dayHigh": 143.74,
    "dayLow": 141.31,
    "openPrice": 142.32,
    "volume": 1393462,
    "avgVolume": 3484248,
    "volumeRatio": 0.4,
    "athDiscountPct": 6.1
  },
  {
    "id": "oxy",
    "symbol": "OXY",
    "name": "Occidental Petroleum",
    "sector": "Kayaç Petrolü & Karbon Yakalama",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 58.36,
    "currency": "$",
    "dailyChange": 1.14,
    "peRatio": 17.2,
    "pbRatio": 1.85,
    "dividendYield": 1.61,
    "marketCap": "$58.34B",
    "beta": 1.42,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Occidental Petroleum (OXY), ABD borsalarında Kayaç Petrolü & Karbon Yakalama sektöründe işlem gören lider şirket. Permian Havzası üreticisi ve doğrudan hava karbon yakalama (DAC) projeleri öncüsü.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.85",
        "peerAvg": "5.50"
      }
    ],
    "high52": 67.45,
    "low52": 38.8,
    "dayHigh": 58.94,
    "dayLow": 57.83,
    "openPrice": 58.13,
    "volume": 5529179,
    "avgVolume": 9722982,
    "volumeRatio": 0.57,
    "athDiscountPct": 13.5
  },
  {
    "id": "mpc",
    "symbol": "MPC",
    "name": "Marathon Petroleum Corp.",
    "sector": "Petrol Rafinerisi & Akaryakıt Dağıtım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 355.42,
    "currency": "$",
    "dailyChange": -0.27,
    "peRatio": 12.3,
    "pbRatio": 2.8,
    "dividendYield": 1.96,
    "marketCap": "$103.76B",
    "beta": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Marathon Petroleum Corp. (MPC), ABD borsalarında Petrol Rafinerisi & Akaryakıt Dağıtım sektöründe işlem gören lider şirket. Günlük 3 milyon varil işleme kapasitesiyle ABD'nin en büyük bağımsız rafineri grubu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 360.1,
    "low52": 160.87,
    "dayHigh": 360.1,
    "dayLow": 352.48,
    "openPrice": 356.99,
    "volume": 2128215,
    "avgVolume": 2340454,
    "volumeRatio": 0.91,
    "athDiscountPct": 1.3
  },
  {
    "id": "vlo",
    "symbol": "VLO",
    "name": "Valero Energy Corporation",
    "sector": "Rafineri & Yenilenebilir Dizel",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 341.67,
    "currency": "$",
    "dailyChange": -0.36,
    "peRatio": 14.2,
    "pbRatio": 2.1,
    "dividendYield": 3.02,
    "marketCap": "$98.38B",
    "beta": 1.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Valero Energy Corporation (VLO), ABD borsalarında Rafineri & Yenilenebilir Dizel sektöründe işlem gören lider şirket. Düşük maliyetli kompleks petrol rafinerileri ve Diamond Green Diesel biyoyakıt tesisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "5.50"
      }
    ],
    "high52": 346.09,
    "low52": 135.02,
    "dayHigh": 346.09,
    "dayLow": 339.41,
    "openPrice": 342.92,
    "volume": 1614745,
    "avgVolume": 2981809,
    "volumeRatio": 0.54,
    "athDiscountPct": 1.3
  },
  {
    "id": "psx",
    "symbol": "PSX",
    "name": "Phillips 66",
    "sector": "Rafinaj & Orta Akım Boru Hatları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 233.61,
    "currency": "$",
    "dailyChange": 0.43,
    "peRatio": 13.3,
    "pbRatio": 1.9,
    "dividendYield": 3.33,
    "marketCap": "$93.22B",
    "beta": 1.16,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Phillips 66 (PSX), ABD borsalarında Rafinaj & Orta Akım Boru Hatları sektöründe işlem gören lider şirket. Petrol rafinajı, petrokimya (CPChem) ve akaryakıt lojistik boru hatları işleticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.2x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.9",
        "peerAvg": "5.50"
      }
    ],
    "high52": 236.14,
    "low52": 121.24,
    "dayHigh": 236.14,
    "dayLow": 229.42,
    "openPrice": 232.66,
    "volume": 1990857,
    "avgVolume": 2598341,
    "volumeRatio": 0.77,
    "athDiscountPct": 1.1
  },
  {
    "id": "kmi",
    "symbol": "KMI",
    "name": "Kinder Morgan Inc.",
    "sector": "Doğalgaz Boru Hatları Altyapısı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 32.82,
    "currency": "$",
    "dailyChange": 2.31,
    "peRatio": 21.2,
    "pbRatio": 1.8,
    "dividendYield": 4.65,
    "marketCap": "$73.02B",
    "beta": 1.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kinder Morgan Inc. (KMI), ABD borsalarında Doğalgaz Boru Hatları Altyapısı sektöründe işlem gören lider şirket. 130.000 km'lik boru hattıyla ABD doğalgaz tüketiminin %40'ını taşıyan altyapı devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 34.81,
    "low52": 25.6,
    "dayHigh": 32.84,
    "dayLow": 32.13,
    "openPrice": 32.23,
    "volume": 8624037,
    "avgVolume": 9912811,
    "volumeRatio": 0.87,
    "athDiscountPct": 5.7
  },
  {
    "id": "wmb",
    "symbol": "WMB",
    "name": "The Williams Companies",
    "sector": "Doğalgaz Taşıma & Transco",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 75.2,
    "currency": "$",
    "dailyChange": 2.96,
    "peRatio": 30,
    "pbRatio": 3.8,
    "dividendYield": 3.65,
    "marketCap": "$91.98B",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "The Williams Companies (WMB), ABD borsalarında Doğalgaz Taşıma & Transco sektöründe işlem gören lider şirket. Transco boru hattıyla Meksika Körfezi'nden New York'a doğalgaz taşıyan stratejik omurga.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 80.08,
    "low52": 55.82,
    "dayHigh": 75.24,
    "dayLow": 73.21,
    "openPrice": 73.43,
    "volume": 5292932,
    "avgVolume": 6937006,
    "volumeRatio": 0.76,
    "athDiscountPct": 6.1
  },
  {
    "id": "duk",
    "symbol": "DUK",
    "name": "Duke Energy Corporation",
    "sector": "Elektrik & Gaz Dağıtım Şebekesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 123.92,
    "currency": "$",
    "dailyChange": 0.42,
    "peRatio": 18.7,
    "pbRatio": 1.85,
    "dividendYield": 3.52,
    "marketCap": "$96.62B",
    "beta": 1.11,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Duke Energy Corporation (DUK), ABD borsalarında Elektrik & Gaz Dağıtım Şebekesi sektöründe işlem gören lider şirket. 8.4 milyon müşteriye elektrik ve doğalgaz dağıtan ABD kamu hizmetleri holdingi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.85",
        "peerAvg": "5.50"
      }
    ],
    "high52": 134.49,
    "low52": 113.9,
    "dayHigh": 124.43,
    "dayLow": 123.01,
    "openPrice": 123.18,
    "volume": 2903065,
    "avgVolume": 3964617,
    "volumeRatio": 0.73,
    "athDiscountPct": 7.9
  },
  {
    "id": "so",
    "symbol": "SO",
    "name": "The Southern Company",
    "sector": "Nükleer & Temiz Enerji Şebekesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 92.8,
    "currency": "$",
    "dailyChange": 0.01,
    "peRatio": 22.4,
    "pbRatio": 2.4,
    "dividendYield": 3.12,
    "marketCap": "$106.75B",
    "beta": 1.22,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "The Southern Company (SO), ABD borsalarında Nükleer & Temiz Enerji Şebekesi sektöründe işlem gören lider şirket. Vogtle 3 & 4 yeni nesil ticari nükleer santralleri ve elektrik dağıtım şebekeleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 100.84,
    "low52": 83.8,
    "dayHigh": 93.39,
    "dayLow": 92.54,
    "openPrice": 92.59,
    "volume": 4184500,
    "avgVolume": 5833893,
    "volumeRatio": 0.72,
    "athDiscountPct": 8
  },
  {
    "id": "aep",
    "symbol": "AEP",
    "name": "American Electric Power",
    "sector": "Elektrik İletim Hatları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 125.6,
    "currency": "$",
    "dailyChange": 0.18,
    "peRatio": 108.3,
    "pbRatio": 2.1,
    "dividendYield": 3.45,
    "marketCap": "$68.38B",
    "beta": 0.99,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "American Electric Power (AEP), ABD borsalarında Elektrik İletim Hatları sektöründe işlem gören lider şirket. 11 eyalette 64.000 km'lik yüksek voltaj elektrik iletim şebekesi işleticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.1",
        "peerAvg": "5.50"
      }
    ],
    "high52": 140.58,
    "low52": 105.7,
    "dayHigh": 126,
    "dayLow": 124.87,
    "openPrice": 124.91,
    "volume": 2086307,
    "avgVolume": 4824527,
    "volumeRatio": 0.43,
    "athDiscountPct": 10.7
  },
  {
    "id": "sre",
    "symbol": "SRE",
    "name": "Sempra Energy",
    "sector": "Enerji Altyapısı & LNG Terminalleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 86.41,
    "currency": "$",
    "dailyChange": -0.08,
    "peRatio": 25,
    "pbRatio": 1.9,
    "dividendYield": 2.8,
    "marketCap": "$56.50B",
    "beta": 1.46,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Sempra Energy (SRE), ABD borsalarında Enerji Altyapısı & LNG Terminalleri sektöründe işlem gören lider şirket. Güney Kaliforniya gaz şebekeleri ve Port Arthur sıvılaştırılmış gaz ihracat tesisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.9",
        "peerAvg": "5.50"
      }
    ],
    "high52": 101.04,
    "low52": 78.97,
    "dayHigh": 87.26,
    "dayLow": 86.24,
    "openPrice": 86.39,
    "volume": 2272864,
    "avgVolume": 3728458,
    "volumeRatio": 0.61,
    "athDiscountPct": 14.5
  },
  {
    "id": "tgt",
    "symbol": "TGT",
    "name": "Target Corporation",
    "sector": "Zincir Perakende Mağazaları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 154.48,
    "currency": "$",
    "dailyChange": -0.66,
    "peRatio": 20.4,
    "pbRatio": 5.2,
    "dividendYield": 2.91,
    "marketCap": "$70.16B",
    "beta": 0.94,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Target Corporation (TGT), ABD borsalarında Zincir Perakende Mağazaları sektöründe işlem gören lider şirket. 2.000'e yakın çok katlı mağazasıyla uygun fiyatlı tasarım giyim ve ev eşyası perakendesi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 156.47,
    "low52": 83.44,
    "dayHigh": 156.33,
    "dayLow": 154.27,
    "openPrice": 155.69,
    "volume": 2152727,
    "avgVolume": 4718796,
    "volumeRatio": 0.46,
    "athDiscountPct": 1.3
  },
  {
    "id": "mdlz",
    "symbol": "MDLZ",
    "name": "Mondelez International",
    "sector": "Bisküvi & Çikolata (Oreo & Milka)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 63.61,
    "currency": "$",
    "dailyChange": 0.13,
    "peRatio": 39,
    "pbRatio": 3.4,
    "dividendYield": 2.61,
    "marketCap": "$81.65B",
    "beta": 1.19,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Mondelez International (MDLZ), ABD borsalarında Bisküvi & Çikolata (Oreo & Milka) sektöründe işlem gören lider şirket. Oreo, Milka, Toblerone, Cadbury ve Philadelphia peynir markaları küresel üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 66.65,
    "low52": 51.2,
    "dayHigh": 63.77,
    "dayLow": 63.3,
    "openPrice": 63.4,
    "volume": 3858084,
    "avgVolume": 9022830,
    "volumeRatio": 0.43,
    "athDiscountPct": 4.6
  },
  {
    "id": "kmb",
    "symbol": "KMB",
    "name": "Kimberly-Clark Corporation",
    "sector": "Kağıt Hijyen Ürünleri (Huggies)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 110.39,
    "currency": "$",
    "dailyChange": -0.28,
    "peRatio": 21.8,
    "pbRatio": 38,
    "dividendYield": 3.44,
    "marketCap": "$36.64B",
    "beta": 1.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Kimberly-Clark Corporation (KMB), ABD borsalarında Kağıt Hijyen Ürünleri (Huggies) sektöründe işlem gören lider şirket. Huggies çocuk bezi, Kleenex mendilleri ve Kotex kadın bakım ürünleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "38",
        "peerAvg": "5.50"
      }
    ],
    "high52": 136.17,
    "low52": 92.42,
    "dayHigh": 111.19,
    "dayLow": 110.23,
    "openPrice": 110.89,
    "volume": 1695475,
    "avgVolume": 4284461,
    "volumeRatio": 0.4,
    "athDiscountPct": 18.9
  },
  {
    "id": "cl",
    "symbol": "CL",
    "name": "Colgate-Palmolive Company",
    "sector": "Ağız Bakımı & Ev Hijyeni",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 91.95,
    "currency": "$",
    "dailyChange": -1.05,
    "peRatio": 36.2,
    "pbRatio": 85,
    "dividendYield": 1.96,
    "marketCap": "$73.30B",
    "beta": 0.99,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Colgate-Palmolive Company (CL), ABD borsalarında Ağız Bakımı & Ev Hijyeni sektöründe işlem gören lider şirket. Colgate diş macunları, Palmolive sabunları ve Hill's Science Diet veteriner maması.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "85",
        "peerAvg": "5.50"
      }
    ],
    "high52": 99.33,
    "low52": 74.55,
    "dayHigh": 93.28,
    "dayLow": 91.73,
    "openPrice": 92.71,
    "volume": 2425821,
    "avgVolume": 4984946,
    "volumeRatio": 0.49,
    "athDiscountPct": 7.4
  },
  {
    "id": "mnst",
    "symbol": "MNST",
    "name": "Monster Beverage Corp.",
    "sector": "Enerji İçecekleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 46.82,
    "currency": "$",
    "dailyChange": 0.3,
    "peRatio": 43.4,
    "pbRatio": 6.8,
    "dividendYield": 0,
    "marketCap": "$91.72B",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Monster Beverage Corp. (MNST), ABD borsalarında Enerji İçecekleri sektöründe işlem gören lider şirket. Monster Energy, Reign ve Predator küresel enerji ve performans içecekleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 50.17,
    "low52": 30.48,
    "dayHigh": 46.94,
    "dayLow": 46.17,
    "openPrice": 46.48,
    "volume": 7928906,
    "avgVolume": 11451054,
    "volumeRatio": 0.69,
    "athDiscountPct": 6.7
  },
  {
    "id": "bkng",
    "symbol": "BKNG",
    "name": "Booking Holdings Inc.",
    "sector": "Çevrimiçi Seyahat & Otel Rezervasyonu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 212.06,
    "currency": "$",
    "dailyChange": -0.6,
    "peRatio": 23.5,
    "dividendYield": 0.78,
    "marketCap": "$164.32B",
    "beta": 0.97,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Booking Holdings Inc. (BKNG), ABD borsalarında Çevrimiçi Seyahat & Otel Rezervasyonu sektöründe işlem gören lider şirket. Booking.com, Priceline, Agoda, Kayak ve OpenTable seyahat rezervasyon platformları.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "29.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "-",
        "peerAvg": "5.50"
      }
    ],
    "high52": 231.8,
    "low52": 150.14,
    "dayHigh": 214.93,
    "dayLow": 211.72,
    "openPrice": 212.9,
    "volume": 4104817,
    "avgVolume": 7249890,
    "volumeRatio": 0.57,
    "athDiscountPct": 8.5
  },
  {
    "id": "mar",
    "symbol": "MAR",
    "name": "Marriott International",
    "sector": "Küresel Otel Zincirleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 356.72,
    "currency": "$",
    "dailyChange": 1.19,
    "peRatio": 36.9,
    "pbRatio": 165,
    "dividendYield": 0.92,
    "marketCap": "$93.02B",
    "beta": 1.53,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Marriott International (MAR), ABD borsalarında Küresel Otel Zincirleri sektöründe işlem gören lider şirket. Ritz-Carlton, St. Regis, Sheraton, W Hotels ve Marriott Bonvoy sadakat programı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "165",
        "peerAvg": "5.50"
      }
    ],
    "high52": 410.98,
    "low52": 256.76,
    "dayHigh": 358.1,
    "dayLow": 349.89,
    "openPrice": 350.72,
    "volume": 880487,
    "avgVolume": 1608330,
    "volumeRatio": 0.55,
    "athDiscountPct": 13.2
  },
  {
    "id": "hlt",
    "symbol": "HLT",
    "name": "Hilton Worldwide Holdings",
    "sector": "Konaklama & Otel Franchise",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 327.21,
    "currency": "$",
    "dailyChange": 1.99,
    "peRatio": 48,
    "dividendYield": 0.25,
    "marketCap": "$73.64B",
    "beta": 0.99,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Hilton Worldwide Holdings (HLT), ABD borsalarında Konaklama & Otel Franchise sektöründe işlem gören lider şirket. Waldorf Astoria, Conrad, Hilton Garden Inn ve Hampton markalı 7.500 otel işletmesi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "-",
        "peerAvg": "5.50"
      }
    ],
    "high52": 358,
    "low52": 253.54,
    "dayHigh": 328.66,
    "dayLow": 319.99,
    "openPrice": 321.84,
    "volume": 1487436,
    "avgVolume": 2090614,
    "volumeRatio": 0.71,
    "athDiscountPct": 8.6
  },
  {
    "id": "lvs",
    "symbol": "LVS",
    "name": "Las Vegas Sands Corp.",
    "sector": "Entegre Tatil Köyleri & Kumarhane",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 46.23,
    "currency": "$",
    "dailyChange": 1.01,
    "peRatio": 17.9,
    "pbRatio": 9.8,
    "dividendYield": 1.54,
    "marketCap": "$29.94B",
    "beta": 1.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Las Vegas Sands Corp. (LVS), ABD borsalarında Entegre Tatil Köyleri & Kumarhane sektöründe işlem gören lider şirket. Singapur Marina Bay Sands ve Makao lüks eğlence, fuar ve kongre otelleri kompleksi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "9.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 70.45,
    "low52": 44.21,
    "dayHigh": 46.48,
    "dayLow": 45.75,
    "openPrice": 45.89,
    "volume": 2168669,
    "avgVolume": 4735591,
    "volumeRatio": 0.46,
    "athDiscountPct": 34.4
  },
  {
    "id": "orly",
    "symbol": "ORLY",
    "name": "O'Reilly Automotive Inc.",
    "sector": "Oto Yedek Parça Perakendesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 91.05,
    "currency": "$",
    "dailyChange": -1.65,
    "peRatio": 28.9,
    "dividendYield": 0,
    "marketCap": "$73.66B",
    "beta": 1.28,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "O'Reilly Automotive Inc. (ORLY), ABD borsalarında Oto Yedek Parça Perakendesi sektöründe işlem gören lider şirket. Profesyonel oto tamircileri ve bireysel araç sahipleri için yedek parça mağaza zinciri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "-",
        "peerAvg": "5.50"
      }
    ],
    "high52": 108.72,
    "low52": 82.59,
    "dayHigh": 92.44,
    "dayLow": 90.85,
    "openPrice": 92.31,
    "volume": 3241766,
    "avgVolume": 7750290,
    "volumeRatio": 0.42,
    "athDiscountPct": 16.3
  },
  {
    "id": "azo",
    "symbol": "AZO",
    "name": "AutoZone Inc.",
    "sector": "Otomotiv Parçaları & Aksesuar",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 3025,
    "currency": "$",
    "dailyChange": -0.51,
    "peRatio": 20.8,
    "dividendYield": 0,
    "marketCap": "$49.38B",
    "beta": 1.35,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "AutoZone Inc. (AZO), ABD borsalarında Otomotiv Parçaları & Aksesuar sektöründe işlem gören lider şirket. 7.000'den fazla mağazasıyla otomotiv yedek parça, yağ ve akü perakende zinciri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "-",
        "peerAvg": "5.50"
      }
    ],
    "high52": 4388.11,
    "low52": 2902.2,
    "dayHigh": 3053.97,
    "dayLow": 3007.97,
    "openPrice": 3052.28,
    "volume": 212373,
    "avgVolume": 342025,
    "volumeRatio": 0.62,
    "athDiscountPct": 31.1
  },
  {
    "id": "rost",
    "symbol": "ROST",
    "name": "Ross Stores Inc.",
    "sector": "İndirimli Hazır Giyim",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 245.36,
    "currency": "$",
    "dailyChange": 0.16,
    "peRatio": 34.3,
    "pbRatio": 7.2,
    "dividendYield": 0.99,
    "marketCap": "$78.71B",
    "beta": 1.3,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ross Stores Inc. (ROST), ABD borsalarında İndirimli Hazır Giyim sektöründe işlem gören lider şirket. Ross Dress for Less markalı 2.100 mağazasıyla uygun fiyatlı giyim ve ayakkabı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "25x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 257,
    "low52": 143.39,
    "dayHigh": 247.05,
    "dayLow": 242.72,
    "openPrice": 243.21,
    "volume": 1933545,
    "avgVolume": 2975051,
    "volumeRatio": 0.65,
    "athDiscountPct": 4.5
  },
  {
    "id": "gww",
    "symbol": "GWW",
    "name": "W.W. Grainger Inc.",
    "sector": "Endüstriyel Malzeme Dağıtımı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 1322.64,
    "currency": "$",
    "dailyChange": 0.1,
    "peRatio": 33.7,
    "pbRatio": 12.8,
    "dividendYield": 0.79,
    "marketCap": "$62.45B",
    "beta": 1.03,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "W.W. Grainger Inc. (GWW), ABD borsalarında Endüstriyel Malzeme Dağıtımı sektöründe işlem gören lider şirket. Fabrika, tesis ve kamu binaları için MRO bakım-onarım malzemeleri dağıtım devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "12.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 1419.91,
    "low52": 906.52,
    "dayHigh": 1329.9,
    "dayLow": 1314.55,
    "openPrice": 1328.3,
    "volume": 135534,
    "avgVolume": 306730,
    "volumeRatio": 0.44,
    "athDiscountPct": 6.9
  },
  {
    "id": "fast",
    "symbol": "FAST",
    "name": "Fastenal Company",
    "sector": "Endüstriyel Bağlantı Elemanları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 51.02,
    "currency": "$",
    "dailyChange": -0.62,
    "peRatio": 43.6,
    "pbRatio": 11.5,
    "dividendYield": 1.95,
    "marketCap": "$58.55B",
    "beta": 1.47,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Fastenal Company (FAST), ABD borsalarında Endüstriyel Bağlantı Elemanları sektöründe işlem gören lider şirket. Cıvata, somun, vida ve fabrikalar içi otomatik akıllı malzeme otomatı tedarikçisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.5",
        "peerAvg": "5.50"
      }
    ],
    "high52": 52.92,
    "low52": 38.97,
    "dayHigh": 51.52,
    "dayLow": 50.7,
    "openPrice": 51.39,
    "volume": 4945271,
    "avgVolume": 7986017,
    "volumeRatio": 0.62,
    "athDiscountPct": 3.6
  },
  {
    "id": "ctas",
    "symbol": "CTAS",
    "name": "Cintas Corporation",
    "sector": "Kurumsal İş Kıyafetleri & Hijyen",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 199.52,
    "currency": "$",
    "dailyChange": -0.33,
    "peRatio": 40.6,
    "pbRatio": 18.5,
    "dividendYield": 0.75,
    "marketCap": "$79.84B",
    "beta": 1.53,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Cintas Corporation (CTAS), ABD borsalarında Kurumsal İş Kıyafetleri & Hijyen sektöründe işlem gören lider şirket. Kurumsal şirket üniformaları kiralama, ilk yardım kitleri ve yangın güvenliği hizmetleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "48x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "18.5",
        "peerAvg": "5.50"
      }
    ],
    "high52": 219.87,
    "low52": 161.16,
    "dayHigh": 201.02,
    "dayLow": 198.84,
    "openPrice": 200.49,
    "volume": 1239711,
    "avgVolume": 2290846,
    "volumeRatio": 0.54,
    "athDiscountPct": 9.3
  },
  {
    "id": "itw",
    "symbol": "ITW",
    "name": "Illinois Tool Works",
    "sector": "Özel Mühendislik Ekipmanları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 290.81,
    "currency": "$",
    "dailyChange": -0.06,
    "peRatio": 26.3,
    "pbRatio": 22,
    "dividendYield": 2.27,
    "marketCap": "$82.82B",
    "beta": 1,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Illinois Tool Works (ITW), ABD borsalarında Özel Mühendislik Ekipmanları sektöründe işlem gören lider şirket. Otomotiv polimer parçaları, test ekipmanları ve kaynak makineleri üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "22",
        "peerAvg": "5.50"
      }
    ],
    "high52": 303.16,
    "low52": 238.82,
    "dayHigh": 291.01,
    "dayLow": 288.19,
    "openPrice": 290.11,
    "volume": 572428,
    "avgVolume": 1430795,
    "volumeRatio": 0.4,
    "athDiscountPct": 4.1
  },
  {
    "id": "emr",
    "symbol": "EMR",
    "name": "Emerson Electric Co.",
    "sector": "Endüstriyel Süreç Otomasyonu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 163.17,
    "currency": "$",
    "dailyChange": -0.3,
    "peRatio": 35.7,
    "pbRatio": 3.4,
    "dividendYield": 1.78,
    "marketCap": "$91.39B",
    "beta": 1.11,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Emerson Electric Co. (EMR), ABD borsalarında Endüstriyel Süreç Otomasyonu sektöründe işlem gören lider şirket. Kimya, enerji ve ilaç tesisleri için vanalar, kontrolörler ve otomasyon yazılımları.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 166.35,
    "low52": 122.64,
    "dayHigh": 164.8,
    "dayLow": 162.3,
    "openPrice": 164.26,
    "volume": 1718402,
    "avgVolume": 2872196,
    "volumeRatio": 0.6,
    "athDiscountPct": 1.9
  },
  {
    "id": "etn",
    "symbol": "ETN",
    "name": "Eaton Corporation plc",
    "sector": "Akıllı Güç Yönetimi & Elektrik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 451.51,
    "currency": "$",
    "dailyChange": -0.4,
    "peRatio": 46.1,
    "pbRatio": 7.4,
    "dividendYield": 1.05,
    "marketCap": "$175.32B",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Eaton Corporation plc (ETN), ABD borsalarında Akıllı Güç Yönetimi & Elektrik sektöründe işlem gören lider şirket. Veri merkezleri için kesintisiz güç kaynakları (UPS), şalt panoları ve elektrik dağıtımı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 478,
    "low52": 311.92,
    "dayHigh": 456.67,
    "dayLow": 449.01,
    "openPrice": 453.76,
    "volume": 1396726,
    "avgVolume": 2413974,
    "volumeRatio": 0.58,
    "athDiscountPct": 5.5
  },
  {
    "id": "ph",
    "symbol": "PH",
    "name": "Parker-Hannifin Corp.",
    "sector": "Hareket & Kontrol Teknolojileri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 1055.85,
    "currency": "$",
    "dailyChange": -0.29,
    "peRatio": 37,
    "pbRatio": 7.8,
    "dividendYield": 1.01,
    "marketCap": "$133.13B",
    "beta": 1.5,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Parker-Hannifin Corp. (PH), ABD borsalarında Hareket & Kontrol Teknolojileri sektöründe işlem gören lider şirket. Hidrolik, pnömatik, sızdırmazlık ve sıvı transfer valfleri ve filtre sistemleri devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 1099.94,
    "low52": 715.37,
    "dayHigh": 1065,
    "dayLow": 1050.72,
    "openPrice": 1058.08,
    "volume": 210407,
    "avgVolume": 691656,
    "volumeRatio": 0.3,
    "athDiscountPct": 4
  },
  {
    "id": "tt",
    "symbol": "TT",
    "name": "Trane Technologies plc",
    "sector": "İklimlendirme (HVAC) & Soğutma",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 480.2,
    "currency": "$",
    "dailyChange": 0.53,
    "peRatio": 35.8,
    "pbRatio": 11.2,
    "dividendYield": 0.87,
    "marketCap": "$105.66B",
    "beta": 0.87,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Trane Technologies plc (TT), ABD borsalarında İklimlendirme (HVAC) & Soğutma sektöründe işlem gören lider şirket. Trane ve Thermo King markalarıyla ticari bina soğutma ve soğuk zincir taşımacılığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "34x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 505.87,
    "low52": 348.06,
    "dayHigh": 481.26,
    "dayLow": 474.86,
    "openPrice": 477.64,
    "volume": 327992,
    "avgVolume": 1314762,
    "volumeRatio": 0.25,
    "athDiscountPct": 5.1
  },
  {
    "id": "carr",
    "symbol": "CARR",
    "name": "Carrier Global Corp.",
    "sector": "Akıllı İklim & HVAC Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 62.78,
    "currency": "$",
    "dailyChange": -0.9,
    "peRatio": 44.8,
    "pbRatio": 7.8,
    "dividendYield": 0.97,
    "marketCap": "$52.14B",
    "beta": 1.47,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Carrier Global Corp. (CARR), ABD borsalarında Akıllı İklim & HVAC Sistemleri sektöründe işlem gören lider şirket. Isı pompaları, klima santralleri ve Viessmann yenilenebilir ısıtma sistemleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 76.76,
    "low52": 50.24,
    "dayHigh": 63.96,
    "dayLow": 62.61,
    "openPrice": 63.07,
    "volume": 3153663,
    "avgVolume": 6551219,
    "volumeRatio": 0.48,
    "athDiscountPct": 18.2
  },
  {
    "id": "fdx",
    "symbol": "FDX",
    "name": "FedEx Corporation",
    "sector": "Ekspres Kargo & Hava Taşımacılığı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 334.64,
    "currency": "$",
    "dailyChange": -1.39,
    "peRatio": 18,
    "pbRatio": 2.4,
    "dividendYield": 1.99,
    "marketCap": "$79.17B",
    "beta": 0.89,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "FedEx Corporation (FDX), ABD borsalarında Ekspres Kargo & Hava Taşımacılığı sektöründe işlem gören lider şirket. 650'den fazla kargo uçağıyla küresel ekspres hava ve kara kargo taşımacılığı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 345.37,
    "low52": 178.33,
    "dayHigh": 341.69,
    "dayLow": 333.49,
    "openPrice": 339.03,
    "volume": 1061543,
    "avgVolume": 1945309,
    "volumeRatio": 0.55,
    "athDiscountPct": 3.1
  },
  {
    "id": "csx",
    "symbol": "CSX",
    "name": "CSX Corporation",
    "sector": "Doğu Yakası Yük Demiryolu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 50.16,
    "currency": "$",
    "dailyChange": 0.04,
    "peRatio": 29.2,
    "pbRatio": 5.4,
    "dividendYield": 1.33,
    "marketCap": "$92.92B",
    "beta": 1.03,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "CSX Corporation (CSX), ABD borsalarında Doğu Yakası Yük Demiryolu sektöründe işlem gören lider şirket. ABD'nin doğu eyaletlerinde konteyner, kömür ve kimyasal madde demiryolu nakliyesi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.4",
        "peerAvg": "5.50"
      }
    ],
    "high52": 53.6,
    "low52": 31.8,
    "dayHigh": 50.77,
    "dayLow": 50.02,
    "openPrice": 50.05,
    "volume": 5355752,
    "avgVolume": 12610040,
    "volumeRatio": 0.42,
    "athDiscountPct": 6.4
  },
  {
    "id": "nsc",
    "symbol": "NSC",
    "name": "Norfolk Southern Corp.",
    "sector": "Demiryolu Taşımacılığı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 334.41,
    "currency": "$",
    "dailyChange": -1.02,
    "peRatio": 28.6,
    "pbRatio": 4.2,
    "dividendYield": 2.13,
    "marketCap": "$75.11B",
    "beta": 1.41,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Norfolk Southern Corp. (NSC), ABD borsalarında Demiryolu Taşımacılığı sektöründe işlem gören lider şirket. 35.000 km'lik demiryolu hattıyla doğu ve orta batı ABD sanayi merkezleri bağlantısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "5.50"
      }
    ],
    "high52": 358.6,
    "low52": 268.23,
    "dayHigh": 340.99,
    "dayLow": 334.41,
    "openPrice": 338.89,
    "volume": 602074,
    "avgVolume": 1183283,
    "volumeRatio": 0.51,
    "athDiscountPct": 6.7
  },
  {
    "id": "wm",
    "symbol": "WM",
    "name": "Waste Management Inc.",
    "sector": "Atık Yönetimi & Geri Dönüşüm",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 224.55,
    "currency": "$",
    "dailyChange": 0.15,
    "peRatio": 59.2,
    "pbRatio": 11.8,
    "dividendYield": 1.38,
    "marketCap": "$89.76B",
    "beta": 1.29,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Waste Management Inc. (WM), ABD borsalarında Atık Yönetimi & Geri Dönüşüm sektöründe işlem gören lider şirket. Katı atık toplama, modern depolama sahaları ve çöpten biyogaz üretim tesisleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 248.13,
    "low52": 194.11,
    "dayHigh": 225.93,
    "dayLow": 223.7,
    "openPrice": 225.31,
    "volume": 1247726,
    "avgVolume": 2142791,
    "volumeRatio": 0.58,
    "athDiscountPct": 9.5
  },
  {
    "id": "rsg",
    "symbol": "RSG",
    "name": "Republic Services Inc.",
    "sector": "Çevre Hizmetleri & Atık Bertarafı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 214.71,
    "currency": "$",
    "dailyChange": -0.24,
    "peRatio": 30.4,
    "pbRatio": 5.8,
    "dividendYield": 1.14,
    "marketCap": "$65.75B",
    "beta": 1.13,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Republic Services Inc. (RSG), ABD borsalarında Çevre Hizmetleri & Atık Bertarafı sektöründe işlem gören lider şirket. Belediye ve ticari atık toplama, geri dönüşüm ve temiz enerji üretim sahaları.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "33x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.8",
        "peerAvg": "5.50"
      }
    ],
    "high52": 238.62,
    "low52": 196.41,
    "dayHigh": 216.57,
    "dayLow": 214.58,
    "openPrice": 215.69,
    "volume": 692413,
    "avgVolume": 1567204,
    "volumeRatio": 0.44,
    "athDiscountPct": 10
  },
  {
    "id": "ecl",
    "symbol": "ECL",
    "name": "Ecolab Inc.",
    "sector": "Su Arıtma & Hijyen Teknolojileri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 276.11,
    "currency": "$",
    "dailyChange": -0.05,
    "peRatio": 37.1,
    "pbRatio": 8.5,
    "dividendYield": 0.9,
    "marketCap": "$77.40B",
    "beta": 1.41,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ecolab Inc. (ECL), ABD borsalarında Su Arıtma & Hijyen Teknolojileri sektöründe işlem gören lider şirket. Gıda işleme, hastane ve endüstriyel tesisler için su arıtma, hijyen ve dezenfeksiyon.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "42x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.5",
        "peerAvg": "5.50"
      }
    ],
    "high52": 309.27,
    "low52": 243.15,
    "dayHigh": 276.93,
    "dayLow": 274.39,
    "openPrice": 275.14,
    "volume": 757640,
    "avgVolume": 1527329,
    "volumeRatio": 0.5,
    "athDiscountPct": 10.7
  },
  {
    "id": "asml",
    "symbol": "ASML",
    "name": "ASML Holding NV",
    "sector": "Yarı İletken Litografi Sistemleri",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "AEX",
    "price": 1844.08,
    "currency": "€",
    "dailyChange": -0.21,
    "peRatio": 62.9,
    "pbRatio": 22.4,
    "dividendYield": 0.75,
    "marketCap": "€708.31B",
    "beta": 1.45,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "En gelişmiş 3nm/2nm mikroçipleri üretebilen dünyadaki tek Aşırı Ultraviyole (EUV) litografi devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "42.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "22.4",
        "peerAvg": "8.50"
      }
    ],
    "high52": 1999.96,
    "low52": 716.2,
    "dayHigh": 1853.32,
    "dayLow": 1820.41,
    "openPrice": 1835.04,
    "volume": 864471,
    "avgVolume": 1906858,
    "volumeRatio": 0.45,
    "athDiscountPct": 7.8
  },
  {
    "id": "ing",
    "symbol": "INGA",
    "name": "ING Groep N.V.",
    "sector": "Bankacılık & Dijital Finans",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "AEX",
    "price": 16.4,
    "currency": "€",
    "dailyChange": 0.45,
    "peRatio": 7.8,
    "pbRatio": 0.95,
    "dividendYield": 6.8,
    "marketCap": "58 Mr €",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Hollanda merkezli, Avrupa çapında 38 milyon müşteriye dijital bankacılık ve kurumsal kredi hizmeti.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.8x",
        "peerAvg": "8.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.95",
        "peerAvg": "0.90"
      }
    ]
  },
  {
    "id": "philips",
    "symbol": "PHIA",
    "name": "Koninklijke Philips NV",
    "sector": "Sağlık Teknolojileri & Görüntüleme",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "AEX",
    "price": 26.8,
    "currency": "€",
    "dailyChange": -0.3,
    "peRatio": 18.5,
    "pbRatio": 2.1,
    "dividendYield": 3.15,
    "marketCap": "25 Mr €",
    "beta": 1.05,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "MR, BT tanısal görüntüleme sistemleri, hasta başı monitörleri ve kişisel sağlık teknolojileri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.5x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.10",
        "peerAvg": "2.80"
      }
    ]
  },
  {
    "id": "heia",
    "symbol": "HEIA",
    "name": "Heineken N.V.",
    "sector": "İçecek & Bira Üretimi",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "AEX",
    "price": 78.5,
    "currency": "€",
    "dailyChange": 0.2,
    "peRatio": 17.2,
    "pbRatio": 2.45,
    "dividendYield": 2.25,
    "marketCap": "45 Mr €",
    "beta": 0.72,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Heineken, Amstel, Sol ve 300'den fazla bira markasıyla dünyanın 2. büyük bira üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.2x",
        "peerAvg": "19.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.45",
        "peerAvg": "3.10"
      }
    ]
  },
  {
    "id": "sap",
    "symbol": "SAP",
    "name": "SAP SE",
    "sector": "Kurumsal Bulut & ERP Yazılımları",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 207.97,
    "currency": "€",
    "dailyChange": -0.63,
    "peRatio": 27,
    "pbRatio": 5.4,
    "dividendYield": 1.05,
    "marketCap": "€240.04B",
    "beta": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Dünya genelinde 400.000'den fazla şirketin tedarik, finans ve İK operasyonlarını yöneten ERP devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.0x",
        "peerAvg": "30.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.4",
        "peerAvg": "4.80"
      }
    ],
    "high52": 281.37,
    "low52": 144.97,
    "dayHigh": 214.39,
    "dayLow": 207.58,
    "openPrice": 214.38,
    "volume": 2292938,
    "avgVolume": 3076941,
    "volumeRatio": 0.75,
    "athDiscountPct": 26.1
  },
  {
    "id": "sie",
    "symbol": "SIE",
    "name": "Siemens AG",
    "sector": "Endüstriyel Otomasyon & Dijital İkiz",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 184.5,
    "currency": "€",
    "dailyChange": 0.9,
    "peRatio": 16.5,
    "pbRatio": 2.8,
    "dividendYield": 2.65,
    "marketCap": "148 Mr €",
    "beta": 1.18,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Fabrika otomasyonu, demiryolu sinyalizasyon sistemleri (Mobility) ve akıllı bina altyapısı devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.5x",
        "peerAvg": "18.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.8",
        "peerAvg": "3.20"
      }
    ]
  },
  {
    "id": "alv",
    "symbol": "ALV",
    "name": "Allianz SE",
    "sector": "Sigortacılık & Varlık Yönetimi (PIMCO)",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 122.11,
    "currency": "€",
    "dailyChange": 0.58,
    "peRatio": 14.4,
    "pbRatio": 1.85,
    "dividendYield": 4.8,
    "marketCap": "€8.94B",
    "beta": 0.88,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Avrupa'nın en büyük sigorta grubu ve PIMCO/AllianzGI ile 2.3 trilyon avro yöneten finans devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.2x",
        "peerAvg": "10.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.85",
        "peerAvg": "1.40"
      }
    ],
    "high52": 132.17,
    "low52": 99.16,
    "dayHigh": 122.7,
    "dayLow": 121.28,
    "openPrice": 121.61,
    "volume": 362031,
    "avgVolume": 718003,
    "volumeRatio": 0.5,
    "athDiscountPct": 7.6
  },
  {
    "id": "basf",
    "symbol": "BAS",
    "name": "BASF SE",
    "sector": "Özel Kimyasallar & Malzeme Bilimi",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 45.8,
    "currency": "€",
    "dailyChange": 0.15,
    "peRatio": 13.5,
    "pbRatio": 1.1,
    "dividendYield": 7.42,
    "marketCap": "41 Mr €",
    "beta": 1.25,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Otomotiv, tarım ve tüketim sanayileri için kimyasal hammaddeler üreten dünyanın en büyük kimya devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "13.5x",
        "peerAvg": "14.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.10",
        "peerAvg": "1.60"
      }
    ]
  },
  {
    "id": "vow3",
    "symbol": "VOW3",
    "name": "Volkswagen AG",
    "sector": "Otomotiv & Ticari Araç",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 94.2,
    "currency": "€",
    "dailyChange": -0.65,
    "peRatio": 3.8,
    "pbRatio": 0.28,
    "dividendYield": 9.55,
    "marketCap": "48 Mr €",
    "beta": 1.35,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "VW, Audi, Porsche, Skoda, Seat ve Scania markalarıyla Avrupa'nın 1 numaralı otomotiv üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "3.8x",
        "peerAvg": "6.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.28",
        "peerAvg": "0.75"
      }
    ]
  },
  {
    "id": "mbg",
    "symbol": "MBG",
    "name": "Mercedes-Benz Group AG",
    "sector": "Lüks Otomobil & Van İmalatı",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 26.23,
    "currency": "€",
    "dailyChange": 0.11,
    "peRatio": 5.2,
    "pbRatio": 0.65,
    "dividendYield": 9.05,
    "marketCap": "58 Mr €",
    "beta": 1.28,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "S-Serisi, E-Serisi ve EQS lüks segment binek ve elektrikli otomobil üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.2x",
        "peerAvg": "6.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.65",
        "peerAvg": "0.80"
      }
    ],
    "high52": 26.23,
    "low52": 26.17,
    "dayHigh": 26.23,
    "dayLow": 26.17,
    "openPrice": 0,
    "volume": 41409,
    "avgVolume": 0,
    "athDiscountPct": 0
  },
  {
    "id": "bmw",
    "symbol": "BMW",
    "name": "Bayerische Motoren Werke (BMW)",
    "sector": "Premium Otomotiv & Motosiklet",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 74.8,
    "currency": "€",
    "dailyChange": 0.5,
    "peRatio": 5,
    "pbRatio": 0.52,
    "dividendYield": 8.02,
    "marketCap": "46 Mr €",
    "beta": 1.22,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "BMW, MINI ve Rolls-Royce markalarıyla premium binek araç ve motosiklet üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "5.0x",
        "peerAvg": "6.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.52",
        "peerAvg": "0.80"
      }
    ]
  },
  {
    "id": "dte",
    "symbol": "DTE",
    "name": "Deutsche Telekom AG",
    "sector": "Telekomünikasyon & T-Mobile",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 140.84,
    "currency": "€",
    "dailyChange": 0.94,
    "peRatio": 22.3,
    "pbRatio": 2.2,
    "dividendYield": 3.15,
    "marketCap": "€29.31B",
    "beta": 0.65,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "T-Mobile US çoğunluk hissesi ve Avrupa genelinde fiber ve 5G şebekelerinin lider telekom devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.8x",
        "peerAvg": "14.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.20",
        "peerAvg": "1.80"
      }
    ],
    "high52": 155.75,
    "low52": 126.23,
    "dayHigh": 141.21,
    "dayLow": 139.25,
    "openPrice": 139.34,
    "volume": 606309,
    "avgVolume": 1406967,
    "volumeRatio": 0.43,
    "athDiscountPct": 9.6
  },
  {
    "id": "bayn",
    "symbol": "BAYN",
    "name": "Bayer AG",
    "sector": "İlaç & Tarım Bilimleri (Monsanto)",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 26.5,
    "currency": "€",
    "dailyChange": -0.4,
    "peRatio": 8.5,
    "pbRatio": 0.75,
    "dividendYield": 0.42,
    "marketCap": "26 Mr €",
    "beta": 1.15,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Aspirin, Xarelto ilaçları ve tarım tohum/bitki koruma ürünleri (Crop Science) üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "8.5x",
        "peerAvg": "16.0x"
      },
      {
        "label": "PD/DD",
        "value": "0.75",
        "peerAvg": "2.40"
      }
    ]
  },
  {
    "id": "muv2",
    "symbol": "MUV2",
    "name": "Munich Re (Münchener Rück)",
    "sector": "Reasürans & Risk Transferi",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "DAX 40",
    "price": 495,
    "currency": "€",
    "dailyChange": 0.85,
    "peRatio": 12.8,
    "pbRatio": 2.1,
    "dividendYield": 3.25,
    "marketCap": "66 Mr €",
    "beta": 0.78,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Doğal afetler ve büyük endüstriyel riskler için dünyanın en büyük reasürans (sigortacının sigortası) şirketi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.8x",
        "peerAvg": "11.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.10",
        "peerAvg": "1.50"
      }
    ]
  },
  {
    "id": "mc",
    "symbol": "MC",
    "name": "LVMH Moët Hennessy Louis Vuitton",
    "sector": "Lüks Moda, Deri & Şampanya",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 68.41,
    "currency": "€",
    "dailyChange": -2.8,
    "peRatio": 23.8,
    "pbRatio": 4.8,
    "dividendYield": 2,
    "marketCap": "€5.07B",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Louis Vuitton, Dior, Moët & Chandon, Hennessy, Tiffany & Co. markalarıyla lüks tüketim imparatorluğu.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.5x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.80",
        "peerAvg": "5.50"
      }
    ],
    "high52": 78.22,
    "low52": 51.06,
    "dayHigh": 70.03,
    "dayLow": 67.9,
    "openPrice": 70.24,
    "volume": 526373,
    "avgVolume": 934296,
    "volumeRatio": 0.56,
    "athDiscountPct": 12.5
  },
  {
    "id": "or",
    "symbol": "OR",
    "name": "L'Oréal S.A.",
    "sector": "Kozmetik & Güzellik Ürünleri",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 33.36,
    "currency": "€",
    "dailyChange": 1.68,
    "peRatio": 24.9,
    "pbRatio": 6.2,
    "dividendYield": 1.78,
    "marketCap": "€6.25B",
    "beta": 0.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Lancôme, Yves Saint Laurent Beauté, Maybelline ve CeraVe ile dünyanın en büyük kozmetik şirketi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.20",
        "peerAvg": "5.00"
      }
    ],
    "high52": 48.06,
    "low52": 27.54,
    "dayHigh": 33.5,
    "dayLow": 32.89,
    "openPrice": 33.25,
    "volume": 713760,
    "avgVolume": 983527,
    "volumeRatio": 0.73,
    "athDiscountPct": 30.6
  },
  {
    "id": "tte",
    "symbol": "TTE",
    "name": "TotalEnergies SE",
    "sector": "Entegre Enerji, Petrol & LNG",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 61.2,
    "currency": "€",
    "dailyChange": 0.65,
    "peRatio": 7.8,
    "pbRatio": 1.15,
    "dividendYield": 5.25,
    "marketCap": "142 Mr €",
    "beta": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Küresel petrol/doğalgaz arama, LNG tedariki ve güneş/rüzgar yenilenebilir enerji üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.8x",
        "peerAvg": "8.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.15",
        "peerAvg": "1.40"
      }
    ]
  },
  {
    "id": "san",
    "symbol": "SAN",
    "name": "Sanofi S.A.",
    "sector": "İlaç & Aşılar",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 14.76,
    "currency": "€",
    "dailyChange": -0.14,
    "peRatio": 14.5,
    "pbRatio": 1.75,
    "dividendYield": 3.68,
    "marketCap": "€210.28B",
    "beta": 0.58,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Dupixent immünoloji antikoru, grip/çocukluk aşıları ve nadir hastalıklar tedavisi üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "14.2x",
        "peerAvg": "16.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.75",
        "peerAvg": "2.80"
      }
    ],
    "high52": 15,
    "low52": 9.31,
    "dayHigh": 14.92,
    "dayLow": 14.65,
    "openPrice": 14.84,
    "volume": 14991396,
    "avgVolume": 10158337,
    "volumeRatio": 1.48,
    "athDiscountPct": 1.6
  },
  {
    "id": "air",
    "symbol": "AIR",
    "name": "Airbus SE",
    "sector": "Ticari Havacılık & Savunma",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 145.25,
    "currency": "€",
    "dailyChange": 1.3,
    "peRatio": 29.8,
    "pbRatio": 6.5,
    "dividendYield": 1.95,
    "marketCap": "€5.85B",
    "beta": 1.35,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "A320neo, A350 yolcu uçakları, askeri nakliye uçakları ve helikopter üretiminde dünya lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28.0x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.50",
        "peerAvg": "4.50"
      }
    ],
    "high52": 154,
    "low52": 71.67,
    "dayHigh": 147.02,
    "dayLow": 143.99,
    "openPrice": 145.46,
    "volume": 196246,
    "avgVolume": 436167,
    "volumeRatio": 0.45,
    "athDiscountPct": 5.7
  },
  {
    "id": "rms",
    "symbol": "RMS",
    "name": "Hermès International",
    "sector": "Ultra-Lüks Deri & Moda (Birkin)",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 2120,
    "currency": "€",
    "dailyChange": 0.95,
    "peRatio": 48,
    "pbRatio": 14.5,
    "dividendYield": 0.72,
    "marketCap": "222 Mr €",
    "beta": 0.92,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "El yapımı ikonik Birkin & Kelly çantaları, ipek eşarplar ve ultra-lüks zanaatkarlık evi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "48.0x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "14.5",
        "peerAvg": "5.50"
      }
    ]
  },
  {
    "id": "su",
    "symbol": "SU",
    "name": "Schneider Electric SE",
    "sector": "Enerji Yönetimi & Otomasyon",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 65.82,
    "currency": "€",
    "dailyChange": 0.6,
    "peRatio": 12.3,
    "pbRatio": 4.8,
    "dividendYield": 1.48,
    "marketCap": "€76.99B",
    "beta": 1.12,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Veri merkezleri için akıllı şalt panoları, enerji verimliliği ve endüstriyel yazılım çözümleri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32.0x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.80",
        "peerAvg": "3.80"
      }
    ],
    "high52": 70.29,
    "low52": 37.77,
    "dayHigh": 66.84,
    "dayLow": 65.78,
    "openPrice": 65.98,
    "volume": 2916805,
    "avgVolume": 4620166,
    "volumeRatio": 0.63,
    "athDiscountPct": 6.4
  },
  {
    "id": "bnp",
    "symbol": "BNP",
    "name": "BNP Paribas S.A.",
    "sector": "Evrensel Bankacılık",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 68.4,
    "currency": "€",
    "dailyChange": 0.35,
    "peRatio": 7.2,
    "pbRatio": 0.68,
    "dividendYield": 6.75,
    "marketCap": "78 Mr €",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Avro Bölgesi'nin en büyük bilanço büyüklüğüne sahip lider kurumsal ve perakende bankası.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.2x",
        "peerAvg": "8.0x"
      },
      {
        "label": "PD/DD",
        "value": "0.68",
        "peerAvg": "0.85"
      }
    ]
  },
  {
    "id": "nesn",
    "symbol": "NESN",
    "name": "Nestlé S.A.",
    "sector": "Paketli Gıda, İçecek & Kahve",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "SMI",
    "price": 84.5,
    "currency": "CHF",
    "dailyChange": 0.15,
    "peRatio": 18.5,
    "pbRatio": 5.8,
    "dividendYield": 3.55,
    "marketCap": "220 Mr CHF",
    "beta": 0.48,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Nespresso, Nescafé, KitKat, Maggi ve Purina evcil hayvan mamalarıyla dünyanın en büyük gıda şirketi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.5x",
        "peerAvg": "20.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.80",
        "peerAvg": "4.20"
      }
    ]
  },
  {
    "id": "novn",
    "symbol": "NOVN",
    "name": "Novartis AG",
    "sector": "Yenilikçi İlaçlar & Gen Terapisi",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "SMI",
    "price": 98.2,
    "currency": "CHF",
    "dailyChange": 0.4,
    "peRatio": 15.2,
    "pbRatio": 4.2,
    "dividendYield": 3.45,
    "marketCap": "204 Mr CHF",
    "beta": 0.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Entresto kalp yetmezliği ilacı, Cosentyx ve Pluvicto radyoligand kanser tedavileri geliştiricisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "15.2x",
        "peerAvg": "17.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.20",
        "peerAvg": "3.50"
      }
    ]
  },
  {
    "id": "rog",
    "symbol": "ROG",
    "name": "Roche Holding AG",
    "sector": "Onkoloji İlaçları & In-Vitro Tanı",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "SMI",
    "price": 142.91,
    "currency": "CHF",
    "dailyChange": 3.78,
    "peRatio": 84.6,
    "pbRatio": 6.8,
    "dividendYield": 3.5,
    "marketCap": "€2.55B",
    "beta": 0.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Biyoteknoloji onkoloji ilaçları (Genentech) ve klinik laboratuvar tanı cihazlarında küresel lider.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.8x",
        "peerAvg": "17.5x"
      },
      {
        "label": "PD/DD",
        "value": "6.80",
        "peerAvg": "4.00"
      }
    ],
    "high52": 169,
    "low52": 72.49,
    "dayHigh": 143.72,
    "dayLow": 138.96,
    "openPrice": 140.6,
    "volume": 126536,
    "avgVolume": 292679,
    "volumeRatio": 0.43,
    "athDiscountPct": 15.4
  },
  {
    "id": "ubs",
    "symbol": "UBSG",
    "name": "UBS Group AG",
    "sector": "Küresel Servet Yönetimi & Yatırım Bankası",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "SMI",
    "price": 28.4,
    "currency": "CHF",
    "dailyChange": 0.85,
    "peRatio": 12.4,
    "pbRatio": 1.15,
    "dividendYield": 2.65,
    "marketCap": "92 Mr CHF",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Credit Suisse entegrasyonuyla 5.5 trilyon doların üzerinde varlık yöneten İsviçre'nin 1 numaralı finans devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.4x",
        "peerAvg": "11.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.15",
        "peerAvg": "1.10"
      }
    ]
  },
  {
    "id": "cfrc",
    "symbol": "CFR",
    "name": "Compagnie Financière Richemont",
    "sector": "Lüks Mücevher & Saatçilik (Cartier)",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "SMI",
    "price": 170.08,
    "currency": "CHF",
    "dailyChange": 0.88,
    "peRatio": 16.1,
    "pbRatio": 3.8,
    "dividendYield": 2.05,
    "marketCap": "€10.57B",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Cartier, Van Cleef & Arpels, IWC Schaffhausen ve Jaeger-LeCoultre lüks mücevher ve saat evi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22.0x",
        "peerAvg": "24.0x"
      },
      {
        "label": "PD/DD",
        "value": "3.80",
        "peerAvg": "4.50"
      }
    ],
    "high52": 170.35,
    "low52": 119,
    "dayHigh": 170.34,
    "dayLow": 166.83,
    "openPrice": 168.41,
    "volume": 374417,
    "avgVolume": 602775,
    "volumeRatio": 0.62,
    "athDiscountPct": 0.2
  },
  {
    "id": "shel",
    "symbol": "SHEL",
    "name": "Shell plc",
    "sector": "Küresel Petrol, Gaz & LNG Ticareti",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 90.47,
    "currency": "GBp",
    "dailyChange": 1.49,
    "peRatio": 10,
    "pbRatio": 1.25,
    "dividendYield": 3.95,
    "marketCap": "€249.80B",
    "beta": 0.92,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Küresel LNG ticaret pazarının en büyük oyuncusu, derin deniz petrol üretimi ve rafinaj devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "11.5x",
        "peerAvg": "10.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.25",
        "peerAvg": "1.30"
      }
    ],
    "high52": 94.9,
    "low52": 68.63,
    "dayHigh": 91.03,
    "dayLow": 89.55,
    "openPrice": 89.78,
    "volume": 4665680,
    "avgVolume": 6625329,
    "volumeRatio": 0.7,
    "athDiscountPct": 4.7
  },
  {
    "id": "azn",
    "symbol": "AZN",
    "name": "AstraZeneca plc",
    "sector": "Biyofarmasötik & Onkoloji İlaçları",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 156.45,
    "currency": "GBp",
    "dailyChange": -0.5,
    "peRatio": 23.4,
    "pbRatio": 4.8,
    "dividendYield": 2.1,
    "marketCap": "€242.64B",
    "beta": 0.62,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Tagrisso, Enhertu kanser tedavileri, kardiyovasküler ve solunum yolu yenilikçi ilaçları üreticisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "34.0x",
        "peerAvg": "20.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.80",
        "peerAvg": "3.80"
      }
    ],
    "high52": 212.71,
    "low52": 145.8,
    "dayHigh": 156.46,
    "dayLow": 154.54,
    "openPrice": 155.5,
    "volume": 3482397,
    "avgVolume": 2858348,
    "volumeRatio": 1.22,
    "athDiscountPct": 26.4
  },
  {
    "id": "hsba",
    "symbol": "HSBA",
    "name": "HSBC Holdings plc",
    "sector": "Uluslararası Ticaret Bankacılığı",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 685,
    "currency": "GBp",
    "dailyChange": 0.4,
    "peRatio": 7.2,
    "pbRatio": 0.85,
    "dividendYield": 7.15,
    "marketCap": "128 Mr £",
    "beta": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Asya-Pasifik ve Avrupa arasında ticaret finansmanı, servet yönetimi ve küresel kurumsal bankacılık devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.2x",
        "peerAvg": "7.8x"
      },
      {
        "label": "PD/DD",
        "value": "0.85",
        "peerAvg": "0.90"
      }
    ]
  },
  {
    "id": "ulvr",
    "symbol": "ULVR",
    "name": "Unilever PLC",
    "sector": "Hızlı Tüketim Malları & Gıda",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 4720,
    "currency": "GBp",
    "dailyChange": 0.25,
    "peRatio": 21,
    "pbRatio": 6.5,
    "dividendYield": 3.25,
    "marketCap": "118 Mr £",
    "beta": 0.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Dove, Rexona, Domestos, Knorr, Hellmann's ve Algida dondurma markalarıyla küresel tüketim devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.0x",
        "peerAvg": "21.5x"
      },
      {
        "label": "PD/DD",
        "value": "6.50",
        "peerAvg": "4.50"
      }
    ]
  },
  {
    "id": "bp",
    "symbol": "BP",
    "name": "BP p.l.c.",
    "sector": "Entegre Petrol & Gaz",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 42.53,
    "currency": "GBp",
    "dailyChange": 0.52,
    "peRatio": 20.3,
    "pbRatio": 1.1,
    "dividendYield": 5.6,
    "marketCap": "€109.53B",
    "beta": 1.05,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Arama-üretim, Castrol madeni yağları, rafinaj ve elektrikli araç şarj istasyonu (bp pulse) altyapısı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.8x",
        "peerAvg": "10.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.10",
        "peerAvg": "1.25"
      }
    ],
    "high52": 48.27,
    "low52": 32.72,
    "dayHigh": 42.77,
    "dayLow": 42.27,
    "openPrice": 42.52,
    "volume": 6335186,
    "avgVolume": 9017082,
    "volumeRatio": 0.7,
    "athDiscountPct": 11.9
  },
  {
    "id": "gsk",
    "symbol": "GSK",
    "name": "GSK plc (GlaxoSmithKline)",
    "sector": "Aşılar & Özel İlaçlar",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 49.52,
    "currency": "GBp",
    "dailyChange": -0.96,
    "peRatio": 15.6,
    "pbRatio": 4.2,
    "dividendYield": 3.9,
    "marketCap": "€99.18B",
    "beta": 0.58,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Shingrix zona aşısı, Arexvy RSV aşısı ve HIV enfeksiyon tedavileri alanında öncü biyofarma şirketi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.5x",
        "peerAvg": "15.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.20",
        "peerAvg": "3.20"
      }
    ],
    "high52": 61.7,
    "low52": 38.63,
    "dayHigh": 49.57,
    "dayLow": 48.86,
    "openPrice": 49.04,
    "volume": 3722628,
    "avgVolume": 3960291,
    "volumeRatio": 0.94,
    "athDiscountPct": 19.7
  },
  {
    "id": "rel",
    "symbol": "REL",
    "name": "RELX PLC",
    "sector": "Veri Analitiği & Hukuki/Bilimsel Yayıncılık",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 3620,
    "currency": "GBp",
    "dailyChange": 0.8,
    "peRatio": 32,
    "pbRatio": 16.5,
    "dividendYield": 1.7,
    "marketCap": "68 Mr £",
    "beta": 0.65,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ScienceDirect, LexisNexis ve risk analitiği karar araçlarıyla küresel bilgi ve analiz devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32.0x",
        "peerAvg": "26.0x"
      },
      {
        "label": "PD/DD",
        "value": "16.5",
        "peerAvg": "5.50"
      }
    ]
  },
  {
    "id": "rio",
    "symbol": "RIO",
    "name": "Rio Tinto plc",
    "sector": "Demir Cevheri & Madencilik",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 95.68,
    "currency": "GBp",
    "dailyChange": -0.43,
    "peRatio": 12.9,
    "pbRatio": 1.85,
    "dividendYield": 6.45,
    "marketCap": "€155.66B",
    "beta": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Avustralya Pilbara demir cevheri, alüminyum ve lityum madenciliğinde dünyanın önde gelen maden devi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.5x",
        "peerAvg": "11.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.85",
        "peerAvg": "1.90"
      }
    ],
    "high52": 112.58,
    "low52": 60.22,
    "dayHigh": 96.72,
    "dayLow": 95.39,
    "openPrice": 95.74,
    "volume": 2040621,
    "avgVolume": 2673996,
    "volumeRatio": 0.76,
    "athDiscountPct": 15
  },
  {
    "id": "novo",
    "symbol": "NOVO-B",
    "name": "Novo Nordisk A/S",
    "sector": "Diyabet & Obezite Tedavileri",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "OMXC 25",
    "price": 785,
    "currency": "DKK",
    "dailyChange": 1.1,
    "peRatio": 38.5,
    "pbRatio": 32,
    "dividendYield": 1.25,
    "marketCap": "3.48 Tr DKK",
    "beta": 0.65,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Ozempic ve Wegovy GLP-1 tedavileriyle Avrupa'nın piyasa değeri en yüksek ilaç şirketi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.5x",
        "peerAvg": "25.0x"
      },
      {
        "label": "PD/DD",
        "value": "32.0",
        "peerAvg": "6.50"
      }
    ]
  },
  {
    "id": "itx",
    "symbol": "ITX",
    "name": "Industria de Diseño Textil (Inditex)",
    "sector": "Hızlı Moda Perakendesi (Zara)",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "IBEX 35",
    "price": 52.4,
    "currency": "€",
    "dailyChange": 1.3,
    "peRatio": 26.5,
    "pbRatio": 8.2,
    "dividendYield": 2.95,
    "marketCap": "163 Mr €",
    "beta": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Zara, Massimo Dutti, Bershka, Pull&Bear ve Oysho markalarıyla dünyanın en büyük hazır giyim perakendecisi.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26.5x",
        "peerAvg": "22.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.20",
        "peerAvg": "4.50"
      }
    ]
  },
  {
    "id": "san_es",
    "symbol": "SAN.MC",
    "name": "Banco Santander S.A.",
    "sector": "Küresel Perakende Bankacılık",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "IBEX 35",
    "price": 12.9,
    "currency": "€",
    "dailyChange": 0.08,
    "peRatio": 14.7,
    "pbRatio": 0.68,
    "dividendYield": 4.25,
    "marketCap": "€183.75B",
    "beta": 1.28,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "İspanya, İngiltere, Brezilya ve Latin Amerika genelinde 165 milyon müşteriye bankacılık hizmeti.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "6.4x",
        "peerAvg": "7.5x"
      },
      {
        "label": "PD/DD",
        "value": "0.68",
        "peerAvg": "0.85"
      }
    ],
    "high52": 13.03,
    "low52": 12.38,
    "dayHigh": 12.94,
    "dayLow": 12.78,
    "openPrice": 12.91,
    "volume": 14141571,
    "avgVolume": 18577735,
    "volumeRatio": 0.76,
    "athDiscountPct": 1
  },
  {
    "id": "ferrari",
    "symbol": "RACE",
    "name": "Ferrari N.V.",
    "sector": "Lüks Süper Spor Otomobiller",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE MIB",
    "price": 414.85,
    "currency": "€",
    "dailyChange": 0.62,
    "peRatio": 38.8,
    "pbRatio": 24.5,
    "dividendYield": 0.58,
    "marketCap": "€72.92B",
    "beta": 0.92,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Maranello üretimi ikonik V8/V12 süper lüks spor arabalar ve Scuderia Ferrari Formula 1 yarış takımı.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "52.0x",
        "peerAvg": "15.0x"
      },
      {
        "label": "PD/DD",
        "value": "24.5",
        "peerAvg": "3.50"
      }
    ],
    "high52": 504.49,
    "low52": 312.51,
    "dayHigh": 417.74,
    "dayLow": 412.43,
    "openPrice": 416.31,
    "volume": 273341,
    "avgVolume": 575322,
    "volumeRatio": 0.48,
    "athDiscountPct": 17.8
  },
  {
    "id": "enel",
    "symbol": "ENEL",
    "name": "Enel S.p.A.",
    "sector": "Elektrik Dağıtımı & Yenilenebilir Enerji",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE MIB",
    "price": 7.15,
    "currency": "€",
    "dailyChange": 0.2,
    "peRatio": 10.8,
    "pbRatio": 1.45,
    "dividendYield": 6.25,
    "marketCap": "72 Mr €",
    "beta": 0.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "İtalya, İspanya ve Latin Amerika'da elektrik şebekesi ve Enel Green Power temiz enerji santralleri operatörü.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "10.8x",
        "peerAvg": "12.5x"
      },
      {
        "label": "PD/DD",
        "value": "1.45",
        "peerAvg": "1.80"
      }
    ]
  },
  {
    "id": "altin",
    "symbol": "ALTIN/GR",
    "name": "Gram Altın (Has 995)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 6830.55,
    "currency": "₺",
    "dailyChange": 0.38,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Enflasyon ve kur şoklarına karşı ana portföy kalkanı. Ons altın ve USD/TRY kuruna endeksli likit fiziki varlık.",
    "metrics": []
  },
  {
    "id": "ceyrek",
    "symbol": "CEYREK",
    "name": "Çeyrek Altın (Kulplu/Yeni)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 11167.95,
    "currency": "₺",
    "dailyChange": 0.38,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "1.75 gram ağırlığında 22 ayar geleneksel Türkiye altın tasarruf aracı.",
    "metrics": []
  },
  {
    "id": "yarimaltin",
    "symbol": "YARIM",
    "name": "Yarım Altın",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 10220,
    "currency": "₺",
    "dailyChange": 0.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "3.508 gram ağırlığında 22 ayar darphane basımı ziynet altını.",
    "metrics": []
  },
  {
    "id": "tamaltin",
    "symbol": "TAM",
    "name": "Tam Ziynet Altını",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 44671.81,
    "currency": "₺",
    "dailyChange": 0.38,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "7.016 gram ağırlığında 22 ayar tam altın ziynet kütüğü.",
    "metrics": []
  },
  {
    "id": "ataaltin",
    "symbol": "ATA",
    "name": "Cumhuriyet / Ata Altını",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 46106.23,
    "currency": "₺",
    "dailyChange": 0.38,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "7.216 gram ağırlığında 22 ayar darphane basımı cumhuriyet sikkesi.",
    "metrics": []
  },
  {
    "id": "bilezik22",
    "symbol": "BILEZIK22",
    "name": "22 Ayar Bilezik (Gram)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 2860,
    "currency": "₺",
    "dailyChange": 0.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "0.916 saflıkta fiziki takı ve yatırım amaçlı 22 ayar altın gram fiyatı.",
    "metrics": []
  },
  {
    "id": "ayar18",
    "symbol": "ALTIN_18",
    "name": "18 Ayar Altın (Gram)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 4437.3,
    "currency": "₺",
    "dailyChange": 0.38,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "0.750 saflıkta 18 ayar altın gram değeri.",
    "metrics": [],
    "high52": 5586.2,
    "low52": 3310.1,
    "dayHigh": 4454.6,
    "dayLow": 4365.5,
    "openPrice": 4408.2,
    "volume": 124670,
    "avgVolume": 3941,
    "volumeRatio": 31.63,
    "athDiscountPct": 20.6
  },
  {
    "id": "ayar14",
    "symbol": "ALTIN_14",
    "name": "14 Ayar Altın (Gram)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 4437.3,
    "currency": "₺",
    "dailyChange": 0.38,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "0.585 saflıkta 14 ayar altın gram değeri.",
    "metrics": [],
    "high52": 5586.2,
    "low52": 3310.1,
    "dayHigh": 4454.6,
    "dayLow": 4365.5,
    "openPrice": 4408.2,
    "volume": 124670,
    "avgVolume": 3941,
    "volumeRatio": 31.63,
    "athDiscountPct": 20.6
  },
  {
    "id": "gumus",
    "symbol": "GÜMÜŞ/GR",
    "name": "Gram Gümüş (999)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "gumus_platin",
    "indexTag": "Kıymetli Maden",
    "price": 100.22,
    "currency": "₺",
    "dailyChange": 0.18,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Güneş panelleri, elektrikli araçlar ve yapay zeka çip üretimindeki endüstriyel taleple desteklenen maden.",
    "metrics": []
  },
  {
    "id": "platin",
    "symbol": "PLATIN/GR",
    "name": "Gram Platin (999.5)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "gumus_platin",
    "indexTag": "Kıymetli Maden",
    "price": 1756.9,
    "currency": "₺",
    "dailyChange": 1.43,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yeşil hidrojen yakıt hücreleri ve otomotiv katalizörlerinde kritik öneme sahip nadir değerli metal.",
    "metrics": [],
    "high52": 2852.4,
    "low52": 1302.3,
    "dayHigh": 1765.4,
    "dayLow": 1703.8,
    "openPrice": 1722,
    "volume": 11905,
    "avgVolume": 148,
    "volumeRatio": 80.44,
    "athDiscountPct": 38.4
  },
  {
    "id": "paladyum",
    "symbol": "PALADYUM/GR",
    "name": "Gram Paladyum (999.5)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "gumus_platin",
    "indexTag": "Kıymetli Maden",
    "price": 1220,
    "currency": "₺",
    "dailyChange": 1.15,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Benzinli araç egzoz emisyon katalizörleri ve elektronik lehim alaşımlarında stratejik metal.",
    "metrics": []
  },
  {
    "id": "onsaltin",
    "symbol": "ONS_ALTIN",
    "name": "Ons Altın (USD)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "altin",
    "indexTag": "Kıymetli Maden",
    "price": 4437.3,
    "currency": "$",
    "dailyChange": 0.38,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "31.1035 gram 24 ayar saf altın küresel ons fiyatı.",
    "metrics": [],
    "high52": 5586.2,
    "low52": 3310.1,
    "dayHigh": 4454.6,
    "dayLow": 4365.5,
    "openPrice": 4408.2,
    "volume": 124670,
    "avgVolume": 3941,
    "volumeRatio": 31.63,
    "athDiscountPct": 20.6
  },
  {
    "id": "onsgumus",
    "symbol": "ONS_GUMUS",
    "name": "Ons Gümüş (USD)",
    "sector": "Kıymetli Madenler",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "gumus_platin",
    "indexTag": "Kıymetli Maden",
    "price": 31.85,
    "currency": "$",
    "dailyChange": 1.8,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Küresel fiziki ve vadeli gümüş ons fiyatı.",
    "metrics": []
  },
  {
    "id": "brent",
    "symbol": "BRENT",
    "name": "Brent Ham Petrol (Varil)",
    "sector": "Enerji Emtiaları",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "enerji_sanayi",
    "indexTag": "Kıymetli Maden",
    "price": 88.52,
    "currency": "$",
    "dailyChange": 1.67,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Küresel enerji piyasasının ana göstergesi olan Kuzey Denizi Brent petrol vadeli kontratı.",
    "metrics": [],
    "high52": 126.1,
    "low52": 58.72,
    "dayHigh": 88.79,
    "dayLow": 86.44,
    "openPrice": 86.88,
    "volume": 27826,
    "avgVolume": 38942,
    "volumeRatio": 0.71,
    "athDiscountPct": 29.8
  },
  {
    "id": "wtioil",
    "symbol": "WTI_OIL",
    "name": "WTI Ham Petrol (Teksas)",
    "sector": "Enerji Emtiaları",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "enerji_sanayi",
    "indexTag": "Kıymetli Maden",
    "price": 74.2,
    "currency": "$",
    "dailyChange": -0.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Kuzey Amerika gösterge hafif tatlı ham petrol varil fiyatı.",
    "metrics": []
  },
  {
    "id": "dogalgaz",
    "symbol": "DOGALGAZ",
    "name": "Doğalgaz (Henry Hub MMBtu)",
    "sector": "Enerji Emtiaları",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "enerji_sanayi",
    "indexTag": "Kıymetli Maden",
    "price": 2.85,
    "currency": "$",
    "dailyChange": 1.45,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "ABD Henry Hub vadeli doğal gaz kontratı.",
    "metrics": []
  },
  {
    "id": "bakir",
    "symbol": "BAKIR",
    "name": "Bakır Emtiası (Lb)",
    "sector": "Endüstriyel Metaller",
    "exchange": "Emtia",
    "assetClass": "maden",
    "madenKategori": "enerji_sanayi",
    "indexTag": "Kıymetli Maden",
    "price": 6.61,
    "currency": "$",
    "dailyChange": 0.08,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Elektrifikasyon, veri merkezleri ve elektrik şebekesi dönüşümünün 'Doktor Bakır' barometresi.",
    "metrics": [],
    "high52": 6.73,
    "low52": 4.41,
    "dayHigh": 6.62,
    "dayLow": 6.55,
    "openPrice": 6.59,
    "volume": 37260,
    "avgVolume": 1528,
    "volumeRatio": 24.38,
    "athDiscountPct": 1.7
  },
  {
    "id": "aft",
    "symbol": "AFT",
    "name": "Ak Portföy Yeni Teknolojiler Yabancı Hisse Fonu",
    "sector": "Yabancı Teknoloji Hisse",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 0.4485,
    "currency": "₺",
    "dailyChange": 1.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Ak Portföy",
    "fundType": "Yabancı Hisse Senedi Fonu",
    "expenseRatio": 2.9,
    "aum": "24.8 Milyar ₺",
    "riskLevel": 7,
    "oneYearReturn": 88.5,
    "threeYearReturn": 412,
    "topHoldings": [
      "NVDA %9.2",
      "MSFT %8.4",
      "AAPL %7.8",
      "AMZN %6.5",
      "GOOGL %6.1"
    ],
    "description": "Küresel yapay zeka, yarı iletken ve bulut teknolojisi devlerine TL bazında doğrudan yatırım imkanı sağlayan fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%88.5",
        "peerAvg": "%62.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.90",
        "peerAvg": "%3.10"
      }
    ]
  },
  {
    "id": "mac",
    "symbol": "MAC",
    "name": "Marmara Capital Portföy Hisse Senedi Fonu",
    "sector": "BIST Değer Hisse",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 182.4,
    "currency": "₺",
    "dailyChange": 0.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Marmara Capital",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.5,
    "aum": "8.4 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 74.2,
    "threeYearReturn": 520,
    "topHoldings": [
      "THYAO %8.5",
      "TUPRS %7.8",
      "FROTO %6.9",
      "BIMAS %6.2",
      "KCHOL %5.8"
    ],
    "description": "BIST'te temel analiz ve değer yatırımı disipliniyle yüksek getiri hedefleyen yoğun hisse senedi fonu.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%74.2",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.50",
        "peerAvg": "%2.80"
      }
    ]
  },
  {
    "id": "ti1",
    "symbol": "TI1",
    "name": "İş Portföy İhracatçı Şirketler Hisse Senedi Fonu",
    "sector": "Döviz Gelirli BIST Şirketleri",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 38.65,
    "currency": "₺",
    "dailyChange": 1.1,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "İş Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.65,
    "aum": "12.6 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 68.4,
    "threeYearReturn": 380,
    "topHoldings": [
      "FROTO %9.1",
      "SISE %8.2",
      "ARCLK %7.4",
      "TOASO %6.8",
      "VESTL %5.5"
    ],
    "description": "Gelirlerinin en az %50'sini yurtdışı ihracattan elde eden döviz dirençli BIST şirketlerine yatırım yapar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%68.4",
        "peerAvg": "%55.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.65",
        "peerAvg": "%2.90"
      }
    ]
  },
  {
    "id": "yay",
    "symbol": "YAY",
    "name": "Yapı Kredi Portföy Yabancı Teknoloji Sektörü Fonu",
    "sector": "Küresel İnovasyon & Donanım",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 24.8,
    "currency": "₺",
    "dailyChange": 1.7,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Yapı Kredi Portföy",
    "fundType": "Yabancı Hisse Senedi Fonu",
    "expenseRatio": 2.8,
    "aum": "16.2 Milyar ₺",
    "riskLevel": 7,
    "oneYearReturn": 82,
    "threeYearReturn": 395,
    "topHoldings": [
      "AAPL %8.8",
      "MSFT %8.1",
      "NVDA %7.9",
      "AVGO %6.4",
      "META %6.0"
    ],
    "description": "Yarı iletken, yazılım, yapay zeka ve dijital dönüşüm alanındaki dünya devlerine odaklanan yabancı fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%82.0",
        "peerAvg": "%62.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.80",
        "peerAvg": "%3.10"
      }
    ]
  },
  {
    "id": "iih",
    "symbol": "IIH",
    "name": "İstanbul Portföy Üçüncü Hisse Senedi Fonu",
    "sector": "Aktif Yönetimli BIST Hisse",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 145.2,
    "currency": "₺",
    "dailyChange": 1.35,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "İstanbul Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.7,
    "aum": "18.9 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 86.5,
    "threeYearReturn": 610,
    "topHoldings": [
      "THYAO %9.5",
      "PGSUS %8.2",
      "ASELS %7.5",
      "TUPRS %7.0",
      "SAHOL %6.4"
    ],
    "description": "Piyasa döngülerine göre dinamik hisse seçimi yapan Türkiye'nin en büyük aktif hisse senedi fonlarından biri.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%86.5",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.70",
        "peerAvg": "%2.85"
      }
    ]
  },
  {
    "id": "gmr",
    "symbol": "GMR",
    "name": "Inveo Portföy İkinci Hisse Senedi Fonu",
    "sector": "Büyüme Odaklı Hisse",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 42.1,
    "currency": "₺",
    "dailyChange": 1.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Inveo Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.75,
    "aum": "6.5 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 79.2,
    "threeYearReturn": 480,
    "topHoldings": [
      "MGROS %8.8",
      "LOGO %7.4",
      "KCHOL %7.1",
      "ISCTR %6.5",
      "TTKOM %5.9"
    ],
    "description": "Yüksek ciro ve kâr büyümesi yakalayan BIST sanayi ve teknoloji şirketlerine odaklanır.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%79.2",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.75",
        "peerAvg": "%2.90"
      }
    ]
  },
  {
    "id": "kzl",
    "symbol": "KZL",
    "name": "Kuveyt Türk Portföy Kıymetli Madenler Katılım Fonu",
    "sector": "Faizsiz Altın & Gümüş",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 18.9,
    "currency": "₺",
    "dailyChange": 0.55,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Kuveyt Türk Portföy",
    "fundType": "Kıymetli Madenler Katılım Fonu",
    "expenseRatio": 1.5,
    "aum": "14.1 Milyar ₺",
    "riskLevel": 5,
    "oneYearReturn": 64,
    "threeYearReturn": 285,
    "topHoldings": [
      "Fiziki Altın %75.0",
      "Fiziki Gümüş %20.0",
      "Kira Sertifikaları %5.0"
    ],
    "description": "Faizsiz katılım finans prensiplerine uygun olarak fiziki altın ve gümüş varlıklarına yatırım yapar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%64.0",
        "peerAvg": "%59.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%1.50",
        "peerAvg": "%1.80"
      }
    ]
  },
  {
    "id": "tcd",
    "symbol": "TCD",
    "name": "Tacirler Portföy Değişken Fon",
    "sector": "Taktiksel Varlık Dağılımı",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 88.6,
    "currency": "₺",
    "dailyChange": 0.8,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Tacirler Portföy",
    "fundType": "Değişken Fon",
    "expenseRatio": 2.85,
    "aum": "9.2 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 71.5,
    "threeYearReturn": 440,
    "topHoldings": [
      "BIST Hisse %65.0",
      "Özel Sektör Tahvili %20.0",
      "Vadeli İşlemler %15.0"
    ],
    "description": "Piyasa koşullarına göre hisse, borçlanma araçları ve türev ürünler arasında esnek geçiş yapan popüler fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%71.5",
        "peerAvg": "%54.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.85",
        "peerAvg": "%3.00"
      }
    ]
  },
  {
    "id": "bio",
    "symbol": "BIO",
    "name": "Ak Portföy Sağlık Sektörü Yabancı Hisse Fonu",
    "sector": "Küresel İlaç & Biyoteknoloji",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 12.45,
    "currency": "₺",
    "dailyChange": 0.65,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Ak Portföy",
    "fundType": "Yabancı Hisse Senedi Fonu",
    "expenseRatio": 2.8,
    "aum": "7.8 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 48.5,
    "threeYearReturn": 210,
    "topHoldings": [
      "LLY %9.5",
      "UNH %8.4",
      "JNJ %7.6",
      "ABBV %7.0",
      "MRK %6.8"
    ],
    "description": "Küresel obezite, onkoloji ve genetik tedavi geliştiren dev ilaç şirketlerine TL bazında yatırım sağlar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%48.5",
        "peerAvg": "%42.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.80",
        "peerAvg": "%3.00"
      }
    ]
  },
  {
    "id": "buy",
    "symbol": "BUY",
    "name": "QNB Finans Portföy Temiz Enerji Fonu",
    "sector": "Güneş, Rüzgar & Batarya",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 6.85,
    "currency": "₺",
    "dailyChange": 0.4,
    "recommendation": "TUT",
    "inWatchlist": false,
    "fundManager": "QNB Portföy",
    "fundType": "Tematik Yabancı Hisse Fonu",
    "expenseRatio": 2.9,
    "aum": "4.1 Milyar ₺",
    "riskLevel": 7,
    "oneYearReturn": 32,
    "threeYearReturn": 145,
    "topHoldings": [
      "NEE %8.2",
      "ENPH %7.5",
      "FSLR %7.1",
      "IBDRY %6.4",
      "ORSTED %5.8"
    ],
    "description": "Yenilenebilir enerji üretimi, rüzgar türbinleri ve akıllı şebeke teknolojileri şirketlerine yatırım yapar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%32.0",
        "peerAvg": "%30.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.90",
        "peerAvg": "%3.10"
      }
    ]
  },
  {
    "id": "ihk",
    "symbol": "IHK",
    "name": "İş Portföy İş'te Kadın Hisse Senedi Fonu",
    "sector": "ESG & Kadın İstihdamı",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 5.62,
    "currency": "₺",
    "dailyChange": 1.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "İş Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.4,
    "aum": "3.6 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 69.8,
    "threeYearReturn": 360,
    "topHoldings": [
      "KCHOL %9.0",
      "ARCLK %8.4",
      "AKBNK %7.8",
      "TUPRS %7.2",
      "MGROS %6.5"
    ],
    "description": "Yönetiminde ve istihdamında kadınlara öncelik veren kurumsal sürdürülebilir BIST şirketlerini seçer.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%69.8",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.40",
        "peerAvg": "%2.70"
      }
    ]
  },
  {
    "id": "tte_tefas",
    "symbol": "TTE",
    "name": "İş Portföy BIST Teknoloji Ağırlık Sınırlamalı Fon",
    "sector": "BIST Bilişim & Savunma",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 4.88,
    "currency": "₺",
    "dailyChange": 2.1,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "İş Portföy",
    "fundType": "Sektör Hisse Fonu",
    "expenseRatio": 2.5,
    "aum": "11.2 Milyar ₺",
    "riskLevel": 7,
    "oneYearReturn": 92.4,
    "threeYearReturn": 580,
    "topHoldings": [
      "ASELS %10.0",
      "LOGO %9.5",
      "MIATK %8.8",
      "REEDR %7.4",
      "KFEIN %6.2"
    ],
    "description": "Borsa İstanbul'da işlem gören yerli yazılım, telekom, savunma ve bilişim şirketlerine yatırım yapar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%92.4",
        "peerAvg": "%65.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.50",
        "peerAvg": "%2.75"
      }
    ]
  },
  {
    "id": "ipb",
    "symbol": "IPB",
    "name": "İstanbul Portföy Birinci Değişken Fon",
    "sector": "Hedge & Mutlak Getiri",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 8.92,
    "currency": "₺",
    "dailyChange": 0.65,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "İstanbul Portföy",
    "fundType": "Değişken Fon",
    "expenseRatio": 2.8,
    "aum": "14.5 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 76.5,
    "threeYearReturn": 490,
    "topHoldings": [
      "BIST Hisse %55.0",
      "Eurobond %25.0",
      "Ters Repo %20.0"
    ],
    "description": "Her piyasa koşulunda enflasyon üzeri reel mutlak getiri hedefleyen dinamik çoklu varlık fonu.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%76.5",
        "peerAvg": "%54.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.80",
        "peerAvg": "%3.00"
      }
    ]
  },
  {
    "id": "afo",
    "symbol": "AFO",
    "name": "Ak Portföy Eurobond (Borçlanma Araçları) Fonu",
    "sector": "Döviz Gelirli Eurobond",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 1.145,
    "currency": "₺",
    "dailyChange": 0.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Ak Portföy",
    "fundType": "Dış Borçlanma (Eurobond) Fonu",
    "expenseRatio": 1.85,
    "aum": "8.9 Milyar ₺",
    "riskLevel": 4,
    "oneYearReturn": 52,
    "threeYearReturn": 240,
    "topHoldings": [
      "TC Hazine Eurobond %65.0",
      "Banka Eurobondları %25.0",
      "Döviz Likit %10.0"
    ],
    "description": "Türkiye Cumhuriyeti Hazinesi ve özel sektör şirketlerinin ihraç ettiği ABD Doları cinsi Eurobond'lara yatırım yapar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%52.0",
        "peerAvg": "%48.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%1.85",
        "peerAvg": "%2.10"
      }
    ]
  },
  {
    "id": "gzh",
    "symbol": "GZH",
    "name": "Garanti Portföy Sürdürülebilirlik Hisse Fonu",
    "sector": "Yeşil Dönüşüm & ESG",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 0.124,
    "currency": "₺",
    "dailyChange": 0.9,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Garanti BBVA Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.45,
    "aum": "5.8 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 66.2,
    "threeYearReturn": 340,
    "topHoldings": [
      "KCHOL %9.2",
      "TUPRS %8.5",
      "EREGL %7.8",
      "SISE %7.0",
      "GARAN %6.8"
    ],
    "description": "BIST Sürdürülebilirlik Endeksi kriterlerini karşılayan çevreye duyarlı sanayi şirketlerine yatırım yapar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%66.2",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.45",
        "peerAvg": "%2.75"
      }
    ]
  },
  {
    "id": "zkp",
    "symbol": "ZKP",
    "name": "Ziraat Portföy Kısa Vadeli Borçlanma Fonu",
    "sector": "Düşük Risk & Likit Getiri",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 3.42,
    "currency": "₺",
    "dailyChange": 0.12,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Ziraat Portföy",
    "fundType": "Borçlanma Araçları Fonu",
    "expenseRatio": 0.95,
    "aum": "22.5 Milyar ₺",
    "riskLevel": 2,
    "oneYearReturn": 49.5,
    "threeYearReturn": 165,
    "topHoldings": [
      "Kısa Vadeli Devlet Tahvili %50.0",
      "Özel Sektör Bonosu %35.0",
      "Repo %15.0"
    ],
    "description": "Mevduat alternatifi, günlük değer kazanan ve dalgalanması asgari düzeyde olan güvenli likit fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%49.5",
        "peerAvg": "%47.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%0.95",
        "peerAvg": "%1.20"
      }
    ]
  },
  {
    "id": "tge",
    "symbol": "TGE",
    "name": "İş Portföy Emtia Yabancı BYF Fon Sepeti Fonu",
    "sector": "Petrol, Bakır & Tarım Emtiası",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 0.285,
    "currency": "₺",
    "dailyChange": 0.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "İş Portföy",
    "fundType": "Fon Sepeti Fonu",
    "expenseRatio": 2.75,
    "aum": "6.3 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 44,
    "threeYearReturn": 195,
    "topHoldings": [
      "Brent Petrol ETF %25.0",
      "Bakır & Endüstriyel Metal %25.0",
      "Tarım & Buğday ETF %20.0",
      "Altın/Gümüş %30.0"
    ],
    "description": "Küresel emtia piyasalarına (enerji, endüstriyel metal ve tarım) yatırım yaparak enflasyon kalkanı sunar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%44.0",
        "peerAvg": "%38.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.75",
        "peerAvg": "%3.00"
      }
    ]
  },
  {
    "id": "gld_tefas",
    "symbol": "KZG",
    "name": "Kuveyt Türk Portföy Altın Katılım Fonu",
    "sector": "Fiziki Altın",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 4.85,
    "currency": "₺",
    "dailyChange": 0.6,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Kuveyt Türk Portföy",
    "fundType": "Kıymetli Madenler Fonu",
    "expenseRatio": 1.2,
    "aum": "18.5 Milyar ₺",
    "riskLevel": 5,
    "oneYearReturn": 66.8,
    "threeYearReturn": 310,
    "topHoldings": [
      "Borsa İstanbul Kasası Fiziki Altın %95.0",
      "Kira Sertifikası %5.0"
    ],
    "description": "Varlıklarının asgari %80'ini Borsa İstanbul kasalarında saklanan fiziki altında değerlendiren fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%66.8",
        "peerAvg": "%61.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%1.20",
        "peerAvg": "%1.50"
      }
    ]
  },
  {
    "id": "idg",
    "symbol": "IDG",
    "name": "İş Portföy BIST 100 Dışı Şirketler Fonu",
    "sector": "Küçük & Orta Ölçekli BIST (Yan Tahtalar)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 7.45,
    "currency": "₺",
    "dailyChange": 1.9,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "İş Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.8,
    "aum": "4.8 Milyar ₺",
    "riskLevel": 7,
    "oneYearReturn": 95,
    "threeYearReturn": 680,
    "topHoldings": [
      "BIST 100 Dışı Büyüme Şirketleri %85.0",
      "Hisse Repo %15.0"
    ],
    "description": "BIST 100 endeksi dışındaki hızlı büyüyen yan sanayi, teknoloji ve ihracatçı KOBİ ölçekli şirketlere odaklanır.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%95.0",
        "peerAvg": "%65.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.80",
        "peerAvg": "%3.00"
      }
    ]
  },
  {
    "id": "yhk",
    "symbol": "YHK",
    "name": "Yapı Kredi Portföy Koç Holding İştirakleri Fonu",
    "sector": "Koç Topluluğu Şirketleri",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 3.18,
    "currency": "₺",
    "dailyChange": 1.15,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Yapı Kredi Portföy",
    "fundType": "Tematik Hisse Senedi Fonu",
    "expenseRatio": 2.5,
    "aum": "7.2 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 72,
    "threeYearReturn": 440,
    "topHoldings": [
      "TUPRS %18.0",
      "FROTO %17.0",
      "KCHOL %15.0",
      "YKBNK %14.0",
      "TOASO %12.0",
      "ARCLK %10.0"
    ],
    "description": "Koç Topluluğu bünyesindeki sanayi, enerji, otomotiv ve finans lokomotiflerine doğrudan yatırım yapar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%72.0",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.50",
        "peerAvg": "%2.75"
      }
    ]
  },
  {
    "id": "tkf",
    "symbol": "TKF",
    "name": "Tacirler Portföy Hisse Senedi Fonu",
    "sector": "Yoğun BIST Hisse",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 12.85,
    "currency": "₺",
    "dailyChange": 1.4,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Tacirler Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.9,
    "aum": "5.4 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 84,
    "threeYearReturn": 540,
    "topHoldings": [
      "KCHOL %9.2",
      "THYAO %8.8",
      "MGROS %7.5",
      "BIMAS %7.0",
      "ASELS %6.4"
    ],
    "description": "Yüksek alfa üretme hedefiyle derin temel analiz süzgecinden geçmiş seçkin BIST hisselerine yatırım yapar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%84.0",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.90",
        "peerAvg": "%3.00"
      }
    ]
  },
  {
    "id": "nnf",
    "symbol": "NNF",
    "name": "Hedef Portföy Birinci Hisse Senedi Fonu",
    "sector": "Aktif Hisse & Katalizörler",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 6.75,
    "currency": "₺",
    "dailyChange": 1.65,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Hedef Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.85,
    "aum": "8.1 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 88,
    "threeYearReturn": 590,
    "topHoldings": [
      "KARTN %8.5",
      "BRISA %7.8",
      "LOGO %7.2",
      "OTKAR %6.8",
      "TTRAK %6.4"
    ],
    "description": "Büyüme hikayesi ve kurumsal dönüşüm yaşayan orta-büyük ölçekli BIST hisselerinde fırsat arar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%88.0",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.85",
        "peerAvg": "%3.00"
      }
    ]
  },
  {
    "id": "gbe",
    "symbol": "GBE",
    "name": "Garanti Portföy Birinci Borçlanma Araçları Fonu",
    "sector": "Özel Sektör Tahvili & Bono",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 0.485,
    "currency": "₺",
    "dailyChange": 0.14,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Garanti BBVA Portföy",
    "fundType": "Borçlanma Araçları Fonu",
    "expenseRatio": 1.4,
    "aum": "11.8 Milyar ₺",
    "riskLevel": 3,
    "oneYearReturn": 53.2,
    "threeYearReturn": 190,
    "topHoldings": [
      "Özel Sektör Tahvilleri %60.0",
      "Devlet Tahvilleri %30.0",
      "Ters Repo %10.0"
    ],
    "description": "Yüksek kredi derecesine sahip Türk şirketlerinin borçlanma senetlerine yatırım yaparak düzenli getiri sağlar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%53.2",
        "peerAvg": "%50.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%1.40",
        "peerAvg": "%1.60"
      }
    ]
  },
  {
    "id": "st1",
    "symbol": "ST1",
    "name": "Strateji Portföy Birinci Hisse Senedi Fonu",
    "sector": "Değer & Temettü Hisseleri",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 15.4,
    "currency": "₺",
    "dailyChange": 1.1,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Strateji Portföy",
    "fundType": "Yerli Hisse Senedi Fonu",
    "expenseRatio": 2.7,
    "aum": "3.2 Milyar ₺",
    "riskLevel": 6,
    "oneYearReturn": 77,
    "threeYearReturn": 460,
    "topHoldings": [
      "FROTO %9.0",
      "TUPRS %8.4",
      "TOASO %7.5",
      "BIMAS %7.1",
      "PETKM %5.8"
    ],
    "description": "Yüksek serbest nakit akımı ve düzenli kâr payı dağıtan köklü sanayi kuruluşlarına odaklanır.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%77.0",
        "peerAvg": "%58.0"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%2.70",
        "peerAvg": "%2.85"
      }
    ]
  },
  {
    "id": "hvt",
    "symbol": "HVT",
    "name": "Halk Portföy Para Piyasası Fonu",
    "sector": "Günlük Likit & Gecelik Faiz",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "TEFAS",
    "price": 1.82,
    "currency": "₺",
    "dailyChange": 0.13,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Halk Portföy",
    "fundType": "Para Piyasası Fonu",
    "expenseRatio": 0.85,
    "aum": "34.5 Milyar ₺",
    "riskLevel": 1,
    "oneYearReturn": 51.2,
    "threeYearReturn": 150,
    "topHoldings": [
      "Gecelik Ters Repo %65.0",
      "Mevduat %25.0",
      "Kısa Vadeli Bono %10.0"
    ],
    "description": "Sıfır piyasa riskiyle günlük faiz getirisi sunan ve aynı gün 7/24 nakde çevrilebilen en büyük likit fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%51.2",
        "peerAvg": "%50.5"
      },
      {
        "label": "Yönetim Ücreti",
        "value": "%0.85",
        "peerAvg": "%1.00"
      }
    ]
  },
  {
    "id": "spy",
    "symbol": "SPY",
    "name": "SPDR S&P 500 ETF Trust",
    "sector": "ABD Geniş Piyasa (S&P 500)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 776.34,
    "currency": "$",
    "dailyChange": -0.2,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Geniş Piyasa Endeks Fonu",
    "expenseRatio": 0.09,
    "aum": "$580B",
    "riskLevel": 4,
    "oneYearReturn": 28.5,
    "threeYearReturn": 42,
    "topHoldings": [
      "AAPL %7.2",
      "MSFT %6.8",
      "NVDA %6.4",
      "AMZN %3.8",
      "META %2.6"
    ],
    "description": "Dünyanın ilk ve en likit borsa yatırım fonu. ABD ekonomisinin en büyük 500 şirketine tek işlemle yatırım sağlar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%28.5",
        "peerAvg": "%24.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 779.37,
    "low52": 629.28,
    "dayHigh": 778.8,
    "dayLow": 775.43,
    "openPrice": 778.54,
    "volume": 29940248,
    "avgVolume": 52009791,
    "volumeRatio": 0.58,
    "athDiscountPct": 0.4,
    "peRatio": 26.2
  },
  {
    "id": "voo",
    "symbol": "VOO",
    "name": "Vanguard S&P 500 ETF",
    "sector": "ABD S&P 500 Düşük Masraf",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 713.61,
    "currency": "$",
    "dailyChange": -0.19,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Vanguard Group",
    "fundType": "Endeks Fonu",
    "expenseRatio": 0.03,
    "aum": "$520B",
    "riskLevel": 4,
    "oneYearReturn": 28.6,
    "threeYearReturn": 42.2,
    "topHoldings": [
      "AAPL %7.2",
      "MSFT %6.8",
      "NVDA %6.4",
      "AMZN %3.8",
      "META %2.6"
    ],
    "description": "Yıllık %0.03 ultra düşük yönetim masrafıyla uzun vadeli bireysel emeklilik ve portföy birikimi için altın standart.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%28.6",
        "peerAvg": "%24.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.03",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 716.39,
    "low52": 578.46,
    "dayHigh": 715.89,
    "dayLow": 712.8,
    "openPrice": 715.63,
    "volume": 4148693,
    "avgVolume": 7927656,
    "volumeRatio": 0.52,
    "athDiscountPct": 0.4,
    "peRatio": 28
  },
  {
    "id": "qqq",
    "symbol": "QQQ",
    "name": "Invesco QQQ Trust (NASDAQ 100)",
    "sector": "Büyük Ölçekli Teknoloji & Büyüme",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 731.07,
    "currency": "$",
    "dailyChange": -0.14,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Invesco",
    "fundType": "Büyüme Endeks Fonu",
    "expenseRatio": 0.2,
    "aum": "$290B",
    "riskLevel": 5,
    "oneYearReturn": 34.2,
    "threeYearReturn": 52.5,
    "topHoldings": [
      "AAPL %8.9",
      "MSFT %8.4",
      "NVDA %7.8",
      "AMZN %5.2",
      "META %4.8"
    ],
    "description": "Finans dışı en büyük 100 NASDAQ şirketine odaklanarak inovasyon ve yapay zeka rallisini yakalar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%34.2",
        "peerAvg": "%26.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.20",
        "peerAvg": "%0.35"
      }
    ],
    "high52": 748.65,
    "low52": 555.6,
    "dayHigh": 734.39,
    "dayLow": 728.32,
    "openPrice": 733.26,
    "volume": 23485289,
    "avgVolume": 43214711,
    "volumeRatio": 0.54,
    "athDiscountPct": 2.3,
    "peRatio": 31.3
  },
  {
    "id": "vti",
    "symbol": "VTI",
    "name": "Vanguard Total Stock Market ETF",
    "sector": "Tüm ABD Hisse Senedi Piyasası",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 383.85,
    "currency": "$",
    "dailyChange": -0.12,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Vanguard Group",
    "fundType": "Tüm Piyasa Endeks Fonu",
    "expenseRatio": 0.03,
    "aum": "$420B",
    "riskLevel": 4,
    "oneYearReturn": 27.8,
    "threeYearReturn": 39.5,
    "topHoldings": [
      "Büyük Şirketler %72.0",
      "Orta Ölçek %18.0",
      "Küçük Ölçek (Small-Cap) %10.0"
    ],
    "description": "ABD'de halka açık 3.600'den fazla hissenin tamamını kapsayan nihai tek fonluk çeşitlendirme aracı.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%27.8",
        "peerAvg": "%24.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.03",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 385.12,
    "low52": 310.4,
    "dayHigh": 384.9,
    "dayLow": 383.33,
    "openPrice": 384.67,
    "volume": 2303520,
    "avgVolume": 3355732,
    "volumeRatio": 0.69,
    "athDiscountPct": 0.3,
    "peRatio": 27.3
  },
  {
    "id": "gld",
    "symbol": "GLD",
    "name": "SPDR Gold Shares",
    "sector": "Fiziki Külçe Altın",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 401.48,
    "currency": "$",
    "dailyChange": 0.63,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "World Gold Trust",
    "fundType": "Fiziki Emtia Fonu",
    "expenseRatio": 0.4,
    "aum": "$72B",
    "riskLevel": 4,
    "oneYearReturn": 36.5,
    "threeYearReturn": 54,
    "topHoldings": [
      "Londra Kasalarında 100% Fiziki Külçe Altın"
    ],
    "description": "Londra kasalarında güvenle saklanan fiziki külçe altın karşılığı işlem gören küresel altın çıpası.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%36.5",
        "peerAvg": "%30.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.40",
        "peerAvg": "%0.45"
      }
    ],
    "high52": 509.7,
    "low52": 305.19,
    "dayHigh": 403.32,
    "dayLow": 400.94,
    "openPrice": 402.18,
    "volume": 6162934,
    "avgVolume": 7502666,
    "volumeRatio": 0.82,
    "athDiscountPct": 21.2
  },
  {
    "id": "slv",
    "symbol": "SLV",
    "name": "iShares Silver Trust",
    "sector": "Fiziki Gümüş",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 58.48,
    "currency": "$",
    "dailyChange": 0.55,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "BlackRock iShares",
    "fundType": "Fiziki Emtia Fonu",
    "expenseRatio": 0.5,
    "aum": "$14B",
    "riskLevel": 6,
    "oneYearReturn": 42,
    "threeYearReturn": 48,
    "topHoldings": [
      "Londra Kasalarında 100% Fiziki Külçe Gümüş"
    ],
    "description": "Güneş paneli ve elektrikli araç sanayisinde artan gümüş talebini ve enflasyon korumasını yansıtır.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%42.0",
        "peerAvg": "%32.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.50",
        "peerAvg": "%0.55"
      }
    ],
    "high52": 109.83,
    "low52": 33.85,
    "dayHigh": 59.36,
    "dayLow": 58.42,
    "openPrice": 58.83,
    "volume": 10206386,
    "avgVolume": 18285290,
    "volumeRatio": 0.56,
    "athDiscountPct": 46.8
  },
  {
    "id": "smh",
    "symbol": "SMH",
    "name": "VanEck Semiconductor ETF",
    "sector": "Küresel Yarı İletken & Çip",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 587.82,
    "currency": "$",
    "dailyChange": -0.22,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "VanEck",
    "fundType": "Sektör Endeks Fonu",
    "expenseRatio": 0.35,
    "aum": "$24B",
    "riskLevel": 7,
    "oneYearReturn": 58.4,
    "threeYearReturn": 125,
    "topHoldings": [
      "NVDA %20.5",
      "TSM %12.8",
      "AVGO %8.4",
      "ASML %5.2",
      "QCOM %4.8"
    ],
    "description": "Yapay zeka devriminin yapı taşları olan küresel çip tasarımcıları ve dökümhanelerine odaklanır.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%58.4",
        "peerAvg": "%35.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.35",
        "peerAvg": "%0.45"
      }
    ],
    "high52": 671.83,
    "low52": 281.15,
    "dayHigh": 590.28,
    "dayLow": 581.87,
    "openPrice": 588,
    "volume": 5463900,
    "avgVolume": 11400329,
    "volumeRatio": 0.48,
    "athDiscountPct": 12.5,
    "peRatio": 41.7
  },
  {
    "id": "soxx",
    "symbol": "SOXX",
    "name": "iShares Semiconductor ETF",
    "sector": "Yarı İletken Sanayi",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 550.42,
    "currency": "$",
    "dailyChange": -0.06,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "BlackRock iShares",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.35,
    "aum": "$16B",
    "riskLevel": 7,
    "oneYearReturn": 52,
    "threeYearReturn": 110,
    "topHoldings": [
      "NVDA %9.5",
      "AVGO %8.8",
      "AMD %7.2",
      "QCOM %6.8",
      "TXN %6.2"
    ],
    "description": "ABD borsalarında kote 30 lider mikroçip ve yarı iletken ekipman şirketini eşit ağırlıklıya yakın modeller.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%52.0",
        "peerAvg": "%35.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.35",
        "peerAvg": "%0.45"
      }
    ],
    "high52": 655.95,
    "low52": 237.1,
    "dayHigh": 552.89,
    "dayLow": 542.93,
    "openPrice": 549.1,
    "volume": 4180692,
    "avgVolume": 10385641,
    "volumeRatio": 0.4,
    "athDiscountPct": 16.1,
    "peRatio": 44.2
  },
  {
    "id": "dia",
    "symbol": "DIA",
    "name": "SPDR Dow Jones Industrial Average ETF",
    "sector": "Köklü 30 Mavi Çipli Sanayi",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 536.8,
    "currency": "$",
    "dailyChange": -0.21,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Mavi Çip Endeks Fonu",
    "expenseRatio": 0.16,
    "aum": "$36B",
    "riskLevel": 4,
    "oneYearReturn": 22.4,
    "threeYearReturn": 32,
    "topHoldings": [
      "UNH %9.0",
      "GS %8.2",
      "MSFT %6.5",
      "HD %6.0",
      "CAT %5.8"
    ],
    "description": "Wall Street'in 130 yıllık köklü Dow Jones 30 sanayi ve finans lokomotifini izler.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%22.4",
        "peerAvg": "%20.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.16",
        "peerAvg": "%0.30"
      }
    ],
    "high52": 546.75,
    "low52": 445.88,
    "dayHigh": 538.28,
    "dayLow": 536.21,
    "openPrice": 537.4,
    "volume": 1984406,
    "avgVolume": 4513293,
    "volumeRatio": 0.44,
    "athDiscountPct": 1.8,
    "peRatio": 22.3
  },
  {
    "id": "schd",
    "symbol": "SCHD",
    "name": "Schwab U.S. Dividend Equity ETF",
    "sector": "Yüksek Temettü & Nakit Akışı",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 34.52,
    "currency": "$",
    "dailyChange": 0.26,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Charles Schwab",
    "fundType": "Temettü Büyümesi Fonu",
    "expenseRatio": 0.06,
    "aum": "$62B",
    "riskLevel": 3,
    "oneYearReturn": 18.5,
    "threeYearReturn": 28,
    "topHoldings": [
      "CSCO %4.2",
      "ABBV %4.1",
      "TXN %4.0",
      "HD %3.9",
      "AMGN %3.8"
    ],
    "description": "Son 10 yıldır aralıksız temettü artıran, yüksek kârlı ve borçsuz ABD şirketlerinin defansif sepeti.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%18.5",
        "peerAvg": "%16.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.06",
        "peerAvg": "%0.20"
      }
    ],
    "high52": 34.54,
    "low52": 26.32,
    "dayHigh": 34.54,
    "dayLow": 34.38,
    "openPrice": 34.47,
    "volume": 20548299,
    "avgVolume": 21466212,
    "volumeRatio": 0.96,
    "athDiscountPct": 0.1,
    "peRatio": 19.9
  },
  {
    "id": "vym",
    "symbol": "VYM",
    "name": "Vanguard High Dividend Yield ETF",
    "sector": "Yüksek Verimli Temettü",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 166.52,
    "currency": "$",
    "dailyChange": -0.31,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Vanguard Group",
    "fundType": "Temettü Gelir Fonu",
    "expenseRatio": 0.06,
    "aum": "$58B",
    "riskLevel": 3,
    "oneYearReturn": 19.2,
    "threeYearReturn": 29.5,
    "topHoldings": [
      "JPM %3.8",
      "AVGO %3.5",
      "XOM %3.2",
      "JNJ %2.9",
      "PG %2.8"
    ],
    "description": "Piyasa ortalamasının üzerinde nakit kâr payı dağıtan 450'den fazla ABD şirketini içerir.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%19.2",
        "peerAvg": "%16.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.06",
        "peerAvg": "%0.20"
      }
    ],
    "high52": 167.61,
    "low52": 136.71,
    "dayHigh": 166.98,
    "dayLow": 166.31,
    "openPrice": 166.9,
    "volume": 766632,
    "avgVolume": 1270325,
    "volumeRatio": 0.6,
    "athDiscountPct": 0.7,
    "peRatio": 22.6
  },
  {
    "id": "xlf",
    "symbol": "XLF",
    "name": "Financial Select Sector SPDR Fund",
    "sector": "Finans & Bankacılık",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 58.16,
    "currency": "$",
    "dailyChange": -0.17,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.09,
    "aum": "$42B",
    "riskLevel": 5,
    "oneYearReturn": 36.8,
    "threeYearReturn": 38,
    "topHoldings": [
      "BRK.B %13.5",
      "JPM %10.2",
      "V %7.8",
      "MA %6.5",
      "BAC %4.2"
    ],
    "description": "S&P 500 bünyesindeki tüm ticari/yatırım bankaları, sigortacılar ve ödeme sistemleri.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%36.8",
        "peerAvg": "%24.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 58.41,
    "low52": 47.67,
    "dayHigh": 58.29,
    "dayLow": 58.06,
    "openPrice": 58.22,
    "volume": 27289826,
    "avgVolume": 34303361,
    "volumeRatio": 0.8,
    "athDiscountPct": 0.4,
    "peRatio": 17
  },
  {
    "id": "xlk",
    "symbol": "XLK",
    "name": "Technology Select Sector SPDR Fund",
    "sector": "Bilgi Teknolojileri & Donanım",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 190.01,
    "currency": "$",
    "dailyChange": -0.4,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.09,
    "aum": "$72B",
    "riskLevel": 6,
    "oneYearReturn": 32.5,
    "threeYearReturn": 64,
    "topHoldings": [
      "AAPL %16.0",
      "NVDA %15.5",
      "MSFT %14.8",
      "AVGO %5.2",
      "CRM %3.1"
    ],
    "description": "ABD teknoloji sektörünün omurgasını oluşturan yazılım, yarı iletken ve bulut şirketleri.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%32.5",
        "peerAvg": "%26.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 198.73,
    "low52": 126.68,
    "dayHigh": 191.35,
    "dayLow": 189.25,
    "openPrice": 191.14,
    "volume": 3540750,
    "avgVolume": 11503180,
    "volumeRatio": 0.31,
    "athDiscountPct": 4.4,
    "peRatio": 36.5
  },
  {
    "id": "xle",
    "symbol": "XLE",
    "name": "Energy Select Sector SPDR Fund",
    "sector": "Geleneksel Petrol & Doğalgaz",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 61.91,
    "currency": "$",
    "dailyChange": 1.39,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.09,
    "aum": "$38B",
    "riskLevel": 6,
    "oneYearReturn": 12.8,
    "threeYearReturn": 48,
    "topHoldings": [
      "XOM %23.0",
      "CVX %16.0",
      "COP %8.5",
      "EOG %5.2",
      "SLB %4.8"
    ],
    "description": "Petrol fiyat artışlarına ve küresel jeopolitik gerilimlere karşı doğal portföy kalkanı.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%12.8",
        "peerAvg": "%15.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 63.46,
    "low52": 42.28,
    "dayHigh": 62.11,
    "dayLow": 61.25,
    "openPrice": 61.37,
    "volume": 22743933,
    "avgVolume": 33219712,
    "volumeRatio": 0.68,
    "athDiscountPct": 2.4,
    "peRatio": 20.9
  },
  {
    "id": "xlv",
    "symbol": "XLV",
    "name": "Health Care Select Sector SPDR Fund",
    "sector": "Sağlık & İlaç Sektörü",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 167.37,
    "currency": "$",
    "dailyChange": -0.6,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.09,
    "aum": "$41B",
    "riskLevel": 3,
    "oneYearReturn": 16.4,
    "threeYearReturn": 22,
    "topHoldings": [
      "LLY %12.5",
      "UNH %9.8",
      "JNJ %7.2",
      "ABBV %6.8",
      "MRK %5.5"
    ],
    "description": "Ekonomik durgunluklara (resesyon) karşı defansif nakit akışı sağlayan sağlık hizmetleri ve aşı üreticileri.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%16.4",
        "peerAvg": "%18.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 169.71,
    "low52": 133.73,
    "dayHigh": 167.76,
    "dayLow": 166.44,
    "openPrice": 167.66,
    "volume": 5004454,
    "avgVolume": 10352170,
    "volumeRatio": 0.48,
    "athDiscountPct": 1.4,
    "peRatio": 29.8
  },
  {
    "id": "xli",
    "symbol": "XLI",
    "name": "Industrial Select Sector SPDR Fund",
    "sector": "Sanayi & Savunma Donanımı",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 186.51,
    "currency": "$",
    "dailyChange": 0.39,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.09,
    "aum": "$21B",
    "riskLevel": 4,
    "oneYearReturn": 29.5,
    "threeYearReturn": 38,
    "topHoldings": [
      "GE %6.2",
      "CAT %5.5",
      "RTX %4.8",
      "UNP %4.5",
      "HON %4.2"
    ],
    "description": "Havacılık, savunma, demiryolu lojistiği ve ağır iş makineleri üreticilerini kapsar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%29.5",
        "peerAvg": "%22.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 188.19,
    "low52": 147.14,
    "dayHigh": 186.88,
    "dayLow": 185.6,
    "openPrice": 186.18,
    "volume": 3541573,
    "avgVolume": 7277503,
    "volumeRatio": 0.49,
    "athDiscountPct": 0.9,
    "peRatio": 30.9
  },
  {
    "id": "xlp",
    "symbol": "XLP",
    "name": "Consumer Staples Select Sector SPDR",
    "sector": "Defansif Temel Tüketim Malları",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 86.09,
    "currency": "$",
    "dailyChange": 0.1,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.09,
    "aum": "$18B",
    "riskLevel": 2,
    "oneYearReturn": 14.8,
    "threeYearReturn": 18.5,
    "topHoldings": [
      "PG %14.5",
      "COST %12.0",
      "WMT %10.5",
      "KO %9.2",
      "PEP %8.5"
    ],
    "description": "Süpermarketler, hijyen ve temel gıda üreticileriyle dalgalı piyasalarda sermayeyi koruyan defansif fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%14.8",
        "peerAvg": "%15.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 90.14,
    "low52": 75.16,
    "dayHigh": 86.3,
    "dayLow": 85.82,
    "openPrice": 86,
    "volume": 6926600,
    "avgVolume": 11577237,
    "volumeRatio": 0.6,
    "athDiscountPct": 4.5,
    "peRatio": 26.4
  },
  {
    "id": "xly",
    "symbol": "XLY",
    "name": "Consumer Discretionary Select Sector",
    "sector": "Tüketici Harcamaları & E-Ticaret",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 118.2,
    "currency": "$",
    "dailyChange": -0.21,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.09,
    "aum": "$22B",
    "riskLevel": 5,
    "oneYearReturn": 26.5,
    "threeYearReturn": 28,
    "topHoldings": [
      "AMZN %24.0",
      "TSLA %16.5",
      "HD %9.2",
      "MCD %4.8",
      "NKE %3.2"
    ],
    "description": "E-ticaret, elektrikli araçlar, restoran zincirleri ve lüks tüketim harcamalarını yansıtır.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%26.5",
        "peerAvg": "%22.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 125.01,
    "low52": 105.19,
    "dayHigh": 119.15,
    "dayLow": 118.09,
    "openPrice": 118.47,
    "volume": 3830157,
    "avgVolume": 7872759,
    "volumeRatio": 0.49,
    "athDiscountPct": 5.4,
    "peRatio": 26.9
  },
  {
    "id": "xlu",
    "symbol": "XLU",
    "name": "Utilities Select Sector SPDR Fund",
    "sector": "Elektrik, Gaz & Su Hizmetleri",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 44.31,
    "currency": "$",
    "dailyChange": 0.61,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "State Street Global Advisors",
    "fundType": "Sektör Fonu",
    "expenseRatio": 0.09,
    "aum": "$16B",
    "riskLevel": 3,
    "oneYearReturn": 24.5,
    "threeYearReturn": 16,
    "topHoldings": [
      "NEE %13.5",
      "SO %8.2",
      "DUK %7.8",
      "CEG %6.2",
      "SRE %4.8"
    ],
    "description": "Yapay zeka veri merkezlerinin artan elektrik talebinden faydalanan kamu enerji altyapısı fonu.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%24.5",
        "peerAvg": "%18.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.09",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 47.8,
    "low52": 41.15,
    "dayHigh": 44.41,
    "dayLow": 43.98,
    "openPrice": 44.01,
    "volume": 16994283,
    "avgVolume": 20267422,
    "volumeRatio": 0.84,
    "athDiscountPct": 7.3,
    "peRatio": 20.2
  },
  {
    "id": "vnq",
    "symbol": "VNQ",
    "name": "Vanguard Real Estate ETF",
    "sector": "Gayrimenkul Yatırım Ortaklıkları (GYO)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 98.83,
    "currency": "$",
    "dailyChange": 0.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Vanguard Group",
    "fundType": "GYO / Gayrimenkul Fonu",
    "expenseRatio": 0.13,
    "aum": "$34B",
    "riskLevel": 5,
    "oneYearReturn": 18.2,
    "threeYearReturn": 8.5,
    "topHoldings": [
      "PLD Lojistik Depolar %7.2",
      "AMT Telekom Kuleleri %6.8",
      "EQIX Veri Merkezleri %6.4",
      "SPG Alışveriş Merkezleri %4.1"
    ],
    "description": "Veri merkezleri, lojistik antrepolar ve ticari gayrimenkullerin kira gelirlerini temettü olarak dağıtır.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%18.2",
        "peerAvg": "%14.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.13",
        "peerAvg": "%0.30"
      }
    ],
    "high52": 101.8,
    "low52": 86.84,
    "dayHigh": 99.01,
    "dayLow": 98.43,
    "openPrice": 98.6,
    "volume": 2057100,
    "avgVolume": 3203635,
    "volumeRatio": 0.64,
    "athDiscountPct": 2.9,
    "peRatio": 31.4
  },
  {
    "id": "tlt",
    "symbol": "TLT",
    "name": "iShares 20+ Year Treasury Bond ETF",
    "sector": "ABD Uzun Vadeli Hazine Tahvilleri",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 82.04,
    "currency": "$",
    "dailyChange": -0.67,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "BlackRock iShares",
    "fundType": "Hazine Tahvil Fonu",
    "expenseRatio": 0.15,
    "aum": "$52B",
    "riskLevel": 4,
    "oneYearReturn": 8.5,
    "threeYearReturn": -15,
    "topHoldings": [
      "20+ Yıl Vadeli ABD Hazine Tahvilleri 100%"
    ],
    "description": "FED'in faiz indirim döngüsünde değer kazanan, dünyanın en likit güvenli liman tahvil fonu.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%8.5",
        "peerAvg": "%6.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.15",
        "peerAvg": "%0.20"
      }
    ],
    "high52": 92.19,
    "low52": 81.82,
    "dayHigh": 82.36,
    "dayLow": 81.82,
    "openPrice": 82.23,
    "volume": 30403155,
    "avgVolume": 27281880,
    "volumeRatio": 1.11,
    "athDiscountPct": 11
  },
  {
    "id": "agg",
    "symbol": "AGG",
    "name": "iShares Core U.S. Aggregate Bond ETF",
    "sector": "Tüm ABD Yatırım Düzeyi Tahvilleri",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 97.48,
    "currency": "$",
    "dailyChange": -0.21,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "BlackRock iShares",
    "fundType": "Geniş Tahvil Endeks Fonu",
    "expenseRatio": 0.03,
    "aum": "$115B",
    "riskLevel": 2,
    "oneYearReturn": 9.8,
    "threeYearReturn": 2.5,
    "topHoldings": [
      "Hazine Bonosu %45.0",
      "Mortgage Destekli Menkul %28.0",
      "Şirket Tahvili %27.0"
    ],
    "description": "Portföy riskini sıfırlamaya yakın düzeyde dengeleyen ABD'nin en büyük sabit getirili tahvil çıpası.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%9.8",
        "peerAvg": "%8.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.03",
        "peerAvg": "%0.15"
      }
    ],
    "high52": 101.46,
    "low52": 97.12,
    "dayHigh": 97.73,
    "dayLow": 97.41,
    "openPrice": 97.65,
    "volume": 5722155,
    "avgVolume": 8591564,
    "volumeRatio": 0.67,
    "athDiscountPct": 3.9,
    "peRatio": 124.3
  },
  {
    "id": "bnd",
    "symbol": "BND",
    "name": "Vanguard Total Bond Market ETF",
    "sector": "Düşük Masraflı Toplam Tahvil Piyasası",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 72.31,
    "currency": "$",
    "dailyChange": -0.23,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Vanguard Group",
    "fundType": "Sabit Getirili Menkul Fonu",
    "expenseRatio": 0.03,
    "aum": "$120B",
    "riskLevel": 2,
    "oneYearReturn": 9.9,
    "threeYearReturn": 2.8,
    "topHoldings": [
      "ABD Hazine Senetleri %48.0",
      "MBS Konut Tahvili %22.0",
      "Kurumsal Tahviller %30.0"
    ],
    "description": "Vanguard'ın klasik %60 hisse / %40 tahvil portföy stratejisinin vazgeçilmez temel bileşeni.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%9.9",
        "peerAvg": "%8.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.03",
        "peerAvg": "%0.15"
      }
    ],
    "high52": 75.23,
    "low52": 72.07,
    "dayHigh": 72.48,
    "dayLow": 72.27,
    "openPrice": 72.47,
    "volume": 6114824,
    "avgVolume": 8190161,
    "volumeRatio": 0.75,
    "athDiscountPct": 3.9
  },
  {
    "id": "vea",
    "symbol": "VEA",
    "name": "Vanguard FTSE Developed Markets ETF",
    "sector": "ABD Dışı Gelişmiş Ülke Hisseleri",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 73.58,
    "currency": "$",
    "dailyChange": 0.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Vanguard Group",
    "fundType": "Uluslararası Hisse Fonu",
    "expenseRatio": 0.06,
    "aum": "$140B",
    "riskLevel": 4,
    "oneYearReturn": 16.5,
    "threeYearReturn": 22,
    "topHoldings": [
      "Japonya %21.0",
      "Birleşik Krallık %13.0",
      "Fransa %9.5",
      "İsviçre %8.8",
      "Almanya %8.2"
    ],
    "description": "Avrupa, Japonya, Kanada ve Pasifik gelişmiş piyasalarındaki 4.000 şirkete tek fonda erişim sağlar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%16.5",
        "peerAvg": "%14.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.06",
        "peerAvg": "%0.25"
      }
    ],
    "high52": 73.89,
    "low52": 57.81,
    "dayHigh": 73.89,
    "dayLow": 73.45,
    "openPrice": 73.71,
    "volume": 5084488,
    "avgVolume": 11056154,
    "volumeRatio": 0.46,
    "athDiscountPct": 0.4,
    "peRatio": 19.4
  },
  {
    "id": "vwo",
    "symbol": "VWO",
    "name": "Vanguard FTSE Emerging Markets ETF",
    "sector": "Gelişmekte Olan Piyasalar",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 60.11,
    "currency": "$",
    "dailyChange": -0.38,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "Vanguard Group",
    "fundType": "Gelişen Ülkeler Fonu",
    "expenseRatio": 0.08,
    "aum": "$82B",
    "riskLevel": 6,
    "oneYearReturn": 19.8,
    "threeYearReturn": 12,
    "topHoldings": [
      "TSMC (Tayvan) %9.2",
      "Tencent %4.1",
      "Alibaba %2.5",
      "Reliance (Hindistan) %1.8"
    ],
    "description": "Çin, Hindistan, Tayvan, Brezilya ve Suudi Arabistan şirketlerine yatırım yaparak küresel büyümeyi yakalar.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%19.8",
        "peerAvg": "%15.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.08",
        "peerAvg": "%0.35"
      }
    ],
    "high52": 61.52,
    "low52": 51.01,
    "dayHigh": 60.28,
    "dayLow": 59.98,
    "openPrice": 60.14,
    "volume": 4121552,
    "avgVolume": 8318862,
    "volumeRatio": 0.5,
    "athDiscountPct": 2.3,
    "peRatio": 16.9
  },
  {
    "id": "efa",
    "symbol": "EFA",
    "name": "iShares MSCI EAFE ETF",
    "sector": "Avrupa, Avustralasya & Uzak Doğu",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 108.64,
    "currency": "$",
    "dailyChange": -0.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "BlackRock iShares",
    "fundType": "Uluslararası Endeks Fonu",
    "expenseRatio": 0.32,
    "aum": "$54B",
    "riskLevel": 4,
    "oneYearReturn": 15.8,
    "threeYearReturn": 20.5,
    "topHoldings": [
      "Novo Nordisk %2.8",
      "ASML %2.4",
      "Nestle %2.1",
      "AstraZeneca %1.8",
      "SAP %1.7"
    ],
    "description": "Kurumsal fonların uluslararası çeşitlendirmede en çok tercih ettiği gösterge MSCI EAFE fonu.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%15.8",
        "peerAvg": "%14.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.32",
        "peerAvg": "%0.35"
      }
    ],
    "high52": 108.89,
    "low52": 90.04,
    "dayHigh": 108.89,
    "dayLow": 108.46,
    "openPrice": 108.76,
    "volume": 5307965,
    "avgVolume": 12458874,
    "volumeRatio": 0.43,
    "athDiscountPct": 0.2,
    "peRatio": 19.1
  },
  {
    "id": "iwm",
    "symbol": "IWM",
    "name": "iShares Russell 2000 ETF",
    "sector": "ABD Küçük Ölçekli Şirketler (Small-Cap)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 305.09,
    "currency": "$",
    "dailyChange": 0.52,
    "recommendation": "AL",
    "inWatchlist": false,
    "fundManager": "BlackRock iShares",
    "fundType": "Küçük Şirketler Endeks Fonu",
    "expenseRatio": 0.19,
    "aum": "$72B",
    "riskLevel": 6,
    "oneYearReturn": 24.2,
    "threeYearReturn": 18,
    "topHoldings": [
      "Russell 2000 Endeksindeki 2.000 Amerikan Büyüme Şirketi"
    ],
    "description": "Faiz indirim dönemlerinde dev şirketlerden daha yüksek kâr patlaması yaşayan 2.000 ABD KOBİ şirketi.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%24.2",
        "peerAvg": "%18.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.19",
        "peerAvg": "%0.28"
      }
    ],
    "high52": 305.18,
    "low52": 223.69,
    "dayHigh": 305.18,
    "dayLow": 302.74,
    "openPrice": 303.28,
    "volume": 12842876,
    "avgVolume": 24488395,
    "volumeRatio": 0.52,
    "athDiscountPct": 0,
    "peRatio": 18.9
  },
  {
    "id": "arkk",
    "symbol": "ARKK",
    "name": "ARK Innovation ETF",
    "sector": "Yıkıcı İnovasyon & Genomik",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 81.1,
    "currency": "$",
    "dailyChange": -1.8,
    "recommendation": "TUT",
    "inWatchlist": false,
    "fundManager": "ARK Invest (Cathie Wood)",
    "fundType": "Aktif Tematik Büyüme Fonu",
    "expenseRatio": 0.75,
    "aum": "$6.5B",
    "riskLevel": 7,
    "oneYearReturn": 22,
    "threeYearReturn": -24,
    "topHoldings": [
      "TSLA %11.2",
      "ROKU %8.5",
      "COIN %7.9",
      "SQ %6.4",
      "PATH %5.2"
    ],
    "description": "Otonom araçlar, yapay zeka, DNA dizileme ve blokzincir gibi yıkıcı inovasyonlara yüksek riskli aktif yatırım.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%22.0",
        "peerAvg": "%26.0"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.75",
        "peerAvg": "%0.65"
      }
    ],
    "high52": 92.65,
    "low52": 62.95,
    "dayHigh": 82.62,
    "dayLow": 80.79,
    "openPrice": 82.62,
    "volume": 3996529,
    "avgVolume": 6255779,
    "volumeRatio": 0.64,
    "athDiscountPct": 12.5,
    "peRatio": 52.3
  },
  {
    "id": "sqqq",
    "symbol": "SQQQ",
    "name": "ProShares UltraPro Short QQQ (3x Ters)",
    "sector": "Kaldıraçlı Ters Teknoloji (Hedge)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 36.24,
    "currency": "$",
    "dailyChange": 0.55,
    "recommendation": "TUT",
    "inWatchlist": false,
    "fundManager": "ProShares",
    "fundType": "3x Kaldıraçlı Ters ETF (Yüksek Risk)",
    "expenseRatio": 0.95,
    "aum": "$4.2B",
    "riskLevel": 7,
    "oneYearReturn": -68,
    "threeYearReturn": -92,
    "topHoldings": [
      "NASDAQ 100 Swap ve Vadeli Kısa Pozisyon Sözleşmeleri (300%)"
    ],
    "description": "NASDAQ endeksindeki günlük düşüşlerden 3 kat getiri hedefleyen, yalnızca kısa vadeli koruma amaçlı yüksek riskli fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "-%68.0",
        "peerAvg": "—"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.95",
        "peerAvg": "%0.90"
      }
    ],
    "high52": 95,
    "low52": 35.74,
    "dayHigh": 36.64,
    "dayLow": 35.74,
    "openPrice": 35.91,
    "volume": 36229025,
    "avgVolume": 63828303,
    "volumeRatio": 0.57,
    "athDiscountPct": 61.9
  },
  {
    "id": "tqqq",
    "symbol": "TQQQ",
    "name": "ProShares UltraPro QQQ (3x Kaldıraçlı)",
    "sector": "Kaldıraçlı NASDAQ 100",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 76.79,
    "currency": "$",
    "dailyChange": -0.47,
    "recommendation": "TUT",
    "inWatchlist": false,
    "fundManager": "ProShares",
    "fundType": "3x Kaldıraçlı Boğa ETF (Yüksek Risk)",
    "expenseRatio": 0.88,
    "aum": "$22B",
    "riskLevel": 7,
    "oneYearReturn": 112,
    "threeYearReturn": 140,
    "topHoldings": [
      "NASDAQ 100 Swap ve Türev Uzun Pozisyonları (300%)"
    ],
    "description": "NASDAQ 100 endeksinin günlük yükseliş performansını 3 kat kaldıraçla çarparak yüksek getiri/risk sunan fon.",
    "metrics": [
      {
        "label": "1Y Getiri",
        "value": "%112.0",
        "peerAvg": "—"
      },
      {
        "label": "Gider Oranı",
        "value": "%0.88",
        "peerAvg": "%0.90"
      }
    ],
    "high52": 88.09,
    "low52": 37.32,
    "dayHigh": 77.85,
    "dayLow": 75.94,
    "openPrice": 77.56,
    "volume": 36068304,
    "avgVolume": 69215890,
    "volumeRatio": 0.52,
    "athDiscountPct": 12.8,
    "peRatio": 35
  },
  {
    "id": "usdtry",
    "symbol": "USD/TRY",
    "name": "Amerikan Doları",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 47.88,
    "currency": "₺",
    "dailyChange": 0.11,
    "recommendation": "TUT",
    "inWatchlist": true,
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "36.42",
        "peerAvg": "-"
      }
    ],
    "high52": 47.88,
    "low52": 40.84,
    "dayHigh": 47.88,
    "dayLow": 47.88,
    "openPrice": 47.88,
    "volume": 0,
    "avgVolume": 0,
    "athDiscountPct": 0
  },
  {
    "id": "eurtry",
    "symbol": "EUR/TRY",
    "name": "Euro",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 55.38,
    "currency": "₺",
    "dailyChange": 0.37,
    "recommendation": "TUT",
    "inWatchlist": true,
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "39.78",
        "peerAvg": "-"
      }
    ],
    "high52": 55.51,
    "low52": 47.51,
    "dayHigh": 55.51,
    "dayLow": 55.07,
    "openPrice": 55.13,
    "volume": 0,
    "avgVolume": 0,
    "athDiscountPct": 0.2
  },
  {
    "id": "gbptry",
    "symbol": "GBP/TRY",
    "name": "İngiliz Sterlini",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 64.8,
    "currency": "₺",
    "dailyChange": 0.46,
    "recommendation": "TUT",
    "inWatchlist": false,
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "47.05",
        "peerAvg": "-"
      }
    ],
    "high52": 64.98,
    "low52": 54.78,
    "dayHigh": 64.8,
    "dayLow": 64.8,
    "openPrice": 64.8,
    "volume": 0,
    "avgVolume": 0,
    "athDiscountPct": 0.3
  },
  {
    "id": "chftry",
    "symbol": "CHF/TRY",
    "name": "İsviçre Frangı",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 41.85,
    "currency": "₺",
    "dailyChange": 0.05,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Küresel güvenli liman para birimi.",
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "41.80",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "jpytry",
    "symbol": "JPY/TRY",
    "name": "Japon Yeni (100 JPY)",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 24.3,
    "currency": "₺",
    "dailyChange": -0.15,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Asya'nın ana rezerv para birimi (100 Yen karşılığı TL).",
    "metrics": [
      {
        "label": "Birim",
        "value": "100 JPY",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "cadtry",
    "symbol": "CAD/TRY",
    "name": "Kanada Doları",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 26.8,
    "currency": "₺",
    "dailyChange": 0.1,
    "recommendation": "TUT",
    "inWatchlist": false,
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "26.75",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "audtry",
    "symbol": "AUD/TRY",
    "name": "Avustralya Doları",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 24.1,
    "currency": "₺",
    "dailyChange": 0.12,
    "recommendation": "TUT",
    "inWatchlist": false,
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "24.05",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "sartry",
    "symbol": "SAR/TRY",
    "name": "Suudi Arabistan Riyali",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 9.72,
    "currency": "₺",
    "dailyChange": 0.08,
    "recommendation": "TUT",
    "inWatchlist": false,
    "metrics": [
      {
        "label": "Birim",
        "value": "1 SAR",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "aedtry",
    "symbol": "AED/TRY",
    "name": "BAE Dirhemi",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 9.92,
    "currency": "₺",
    "dailyChange": 0.08,
    "recommendation": "TUT",
    "inWatchlist": false,
    "metrics": [
      {
        "label": "Birim",
        "value": "1 AED",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "eurusd",
    "symbol": "EUR/USD",
    "name": "Euro / Dolar Çapraz Paritesi",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 1.16,
    "currency": "$",
    "dailyChange": 0.36,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Dünyanın en yüksek işlem hacimli majör döviz paritesi.",
    "metrics": [
      {
        "label": "200 Günlük Ort.",
        "value": "1.085",
        "peerAvg": "-"
      }
    ],
    "high52": 1.2,
    "low52": 1.13,
    "dayHigh": 1.16,
    "dayLow": 1.15,
    "openPrice": 1.15,
    "volume": 0,
    "avgVolume": 0,
    "athDiscountPct": 3.6
  },
  {
    "id": "gbpusd",
    "symbol": "GBP/USD",
    "name": "Sterlin / Dolar (Cable)",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 1.295,
    "currency": "$",
    "dailyChange": 0.08,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Küresel piyasaların öncü döviz paritelerinden.",
    "metrics": [
      {
        "label": "200 Günlük Ort.",
        "value": "1.282",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "usdjpy",
    "symbol": "USD/JPY",
    "name": "Dolar / Japon Yeni",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 150.2,
    "currency": "¥",
    "dailyChange": -0.22,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Asya seansı gösterge döviz paritesi.",
    "metrics": [
      {
        "label": "200 Günlük Ort.",
        "value": "152.4",
        "peerAvg": "-"
      }
    ]
  }
];

export const MOCK_BASKETS: Basket[] = [
  {
    id: "temettu-kalesi",
    name: "BIST Temettü Kalesi",
    subtitle: "Düzenli Nakit Akışı & Temettü Büyümesi",
    riskLevel: "Düşük",
    riskColor: "low",
    totalValue: 142500,
    totalCost: 118000,
    dailyChange: 1.45,
    totalProfitPercent: 20.8,
    description: "Türkiye'nin en istikrarlı, kârını hissedarlarıyla paylaşan sanayi ve ihracat lokomotiflerinden oluşan defansif nakit akışı sepeti.",
    aiNote: "Sepet F/K ortalaması 7.8x ile BIST 100 ortalamasının altında ve %5.6 ağırlıklı temettü verimi sunuyor. Enflasyona karşı yüksek koruma sağlar.",
    holdings: [
      { companySymbol: "FROTO", weightPercent: 35, quantity: 45, avgCost: 910.0, currentPrice: 1145.0 },
      { companySymbol: "TUPRS", weightPercent: 30, quantity: 250, avgCost: 145.0, currentPrice: 172.3 },
      { companySymbol: "KCHOL", weightPercent: 20, quantity: 130, avgCost: 185.0, currentPrice: 218.4 },
      { companySymbol: "BIMAS", weightPercent: 15, quantity: 40, avgCost: 480.0, currentPrice: 542.0 },
    ],
  },
  {
    id: "teknoloji-ihracat",
    name: "Teknoloji & Küresel İhracat",
    subtitle: "Döviz Gelirli Yüksek Büyüme",
    riskLevel: "Orta",
    riskColor: "mid",
    totalValue: 98400,
    totalCost: 79500,
    dailyChange: 2.15,
    totalProfitPercent: 23.8,
    description: "Gelirlerinin büyük kısmı döviz cinsi olan, savunma ve küresel yapay zeka dönüşümünden beslenen büyüme odaklı sepet.",
    aiNote: "THYAO ve ASELS tarafındaki rekor sipariş ve doluluk rakamları sepetin ivmesini koruyor.",
    holdings: [
      { companySymbol: "THYAO", weightPercent: 40, quantity: 120, avgCost: 240.0, currentPrice: 328.5 },
      { companySymbol: "ASELS", weightPercent: 35, quantity: 540, avgCost: 52.0, currentPrice: 64.2 },
      { companySymbol: "NVDA", weightPercent: 25, quantity: 5, avgCost: 115.0, currentPrice: 138.25 },
    ],
  },
  {
    id: "guvenli-liman",
    name: "Kıymetli Maden & Kur Kalkanı",
    subtitle: "Makro Dalgalanma & Enflasyon Koruması",
    riskLevel: "Düşük",
    riskColor: "low",
    totalValue: 78000,
    totalCost: 65000,
    dailyChange: 0.65,
    totalProfitPercent: 20.0,
    description: "Merkez bankalarının faiz indirim döngüleri ve jeopolitik risklere karşı sermayenin reel satın alma gücünü koruyan fiziki değerli metaller.",
    aiNote: "Faiz indirim ortamında portföyün negatif korelasyon çıpası olarak kusursuz çalışıyor.",
    holdings: [
      { companySymbol: "ALTIN/GR", weightPercent: 70, quantity: 18, avgCost: 2600.0, currentPrice: 3120.4 },
      { companySymbol: "GÜMÜŞ/GR", weightPercent: 30, quantity: 560, avgCost: 32.5, currentPrice: 38.9 },
    ],
  },
];

export const MOCK_DIVIDENDS: DividendItem[] = [
  {
    id: "div-1",
    companySymbol: "TUPRS",
    companyName: "Tüpraş",
    paymentDate: "2026-09-27",
    netAmountPerShare: 10.74,
    yieldPercent: 6.2,
    status: "Yaklaşıyor",
  },
  {
    id: "div-2",
    companySymbol: "FROTO",
    companyName: "Ford Otosan",
    paymentDate: "2026-11-22",
    netAmountPerShare: 29.5,
    yieldPercent: 2.6,
    status: "Açıklandı",
  },
  {
    id: "div-3",
    companySymbol: "KCHOL",
    companyName: "Koç Holding",
    paymentDate: "2026-04-18",
    netAmountPerShare: 7.22,
    yieldPercent: 3.3,
    status: "Ödendi",
  },
  {
    id: "div-4",
    companySymbol: "BIMAS",
    companyName: "BİM Mağazalar",
    paymentDate: "2026-12-15",
    netAmountPerShare: 4.0,
    yieldPercent: 0.75,
    status: "Açıklandı",
  },
];

export const MOCK_IPOS: IpoItem[] = [
  {
    id: "ipo-horoz",
    code: "HOROZ",
    name: "Horoz Lojistik Kargo Hizmetleri",
    sector: "Lojistik & Taşımacılık",
    status: "listed",
    dateRange: "29 - 31 Mayıs",
    priceRange: "55.00 ₺",
    distributionType: "Bireysele Eşit Dağıtım",
    leadManager: "QNB Finans Yatırım",
    lotAmount: "24.600.000 Lot",
    fundSize: "1.35 Mr ₺",
    ceilingStreak: 0,
  },
  {
    id: "ipo-yigit",
    code: "YIGIT",
    name: "Yiğit Akü Malzemeleri Sanayi",
    sector: "Akü & Enerji Depolama",
    status: "listed",
    dateRange: "05 - 07 Haziran",
    priceRange: "34.60 ₺",
    distributionType: "Bireysele Eşit Dağıtım",
    leadManager: "Halk Yatırım Menkul",
    lotAmount: "75.000.000 Lot",
    fundSize: "2.59 Mr ₺",
    ceilingStreak: 0,
  },
  {
    id: "ipo-ozatd",
    code: "OZATD",
    name: "Özata Denizcilik Tersanesi",
    sector: "Tersane & Gemi İnşa",
    status: "listed",
    dateRange: "27 - 29 Ağustos",
    priceRange: "105.00 ₺",
    distributionType: "Bireysele Eşit Dağıtım",
    leadManager: "Vakıf Yatırım Menkul",
    lotAmount: "13.350.000 Lot",
    fundSize: "1.40 Mr ₺",
    ceilingStreak: 0,
  },
  {
    id: "ipo-pasur",
    code: "PASUR",
    name: "Pasifik Donanım ve Yazılım Bilgi",
    sector: "Bilişim & Siber Güvenlik",
    status: "listed",
    dateRange: "06 - 07 Şubat",
    priceRange: "35.00 ₺",
    distributionType: "Tamamı Eşit Dağıtım",
    leadManager: "Halk Yatırım Menkul",
    lotAmount: "27.000.000 Lot",
    fundSize: "945 M ₺",
    ceilingStreak: 0,
  },
  {
    id: "ipo-kocmt",
    code: "KOCMT",
    name: "Koç Metalurji A.Ş.",
    sector: "Demir-Çelik & Metal",
    status: "listed",
    dateRange: "09 - 10 Mayıs 2026",
    priceRange: "20.50 ₺",
    distributionType: "Bireysele Eşit",
    leadManager: "A1 Capital Yatırım",
    lotAmount: "125.000.000 Lot",
    fundSize: "2.56 Mr ₺",
    ceilingStreak: 5,
  },
  {
    id: "ipo-lilak",
    code: "LILAK",
    name: "Lila Kağıt Sanayi (Sofia & Maylo)",
    sector: "Temizlik Kağıtları İhracatı",
    status: "listed",
    dateRange: "30 Nisan - 02 Mayıs 2026",
    priceRange: "37.39 ₺",
    distributionType: "Bireysele Eşit",
    leadManager: "Ak Yatırım & Yapı Kredi",
    lotAmount: "120.000.000 Lot",
    fundSize: "4.48 Mr ₺",
    ceilingStreak: 4,
  },
  {
    id: "ipo-koton",
    code: "KOTON",
    name: "Koton Mağazacılık Tekstil",
    sector: "Hazır Giyim Perakendesi",
    status: "listed",
    dateRange: "30 Nisan - 02 Mayıs 2026",
    priceRange: "30.50 ₺",
    distributionType: "Bireysele Eşit",
    leadManager: "İş Yatırım Menkul",
    lotAmount: "136.600.000 Lot",
    fundSize: "4.16 Mr ₺",
    ceilingStreak: 3,
  },
  {
    id: "ipo-rgyas",
    code: "RGYAS",
    name: "Rönesans Gayrimenkul Yatırım",
    sector: "Gayrimenkul Yatırım Ortaklığı (GYO)",
    status: "listed",
    dateRange: "17 - 19 Nisan 2026",
    priceRange: "135.00 ₺",
    distributionType: "Bireysele Eşit",
    leadManager: "Ak Yatırım & Deniz Yatırım",
    lotAmount: "33.357.450 Lot",
    fundSize: "4.50 Mr ₺",
    ceilingStreak: 6,
  },
  {
    id: "ipo-entra",
    code: "ENTRA",
    name: "IC Enterra Yenilenebilir Enerji",
    sector: "Yenilenebilir Enerji (HES & GES)",
    status: "listed",
    dateRange: "27 - 29 Mart 2026",
    priceRange: "10.00 ₺",
    distributionType: "Bireysele Eşit",
    leadManager: "Ak Yatırım & İş Yatırım",
    lotAmount: "369.565.717 Lot",
    fundSize: "3.69 Mr ₺",
    ceilingStreak: 8,
  },
  {
    id: "ipo-mogan",
    code: "MOGAN",
    name: "Mogan Enerji Yatırım Holding",
    sector: "Jeotermal & Rüzgar Enerjisi",
    status: "listed",
    dateRange: "28 Şubat - 01 Mart 2026",
    priceRange: "11.33 ₺",
    distributionType: "Bireysele Eşit",
    leadManager: "İş Yatırım & TSKB",
    lotAmount: "262.635.000 Lot",
    fundSize: "2.97 Mr ₺",
    ceilingStreak: 5,
  },
  {
    id: "ipo-alves",
    code: "ALVES",
    name: "Alves Kablo Sanayi",
    sector: "Elektrik & Kablo İmalatı",
    status: "listed",
    dateRange: "22 - 23 Şubat 2026",
    priceRange: "19.45 ₺",
    distributionType: "Tamamı Eşit Dağıtım",
    leadManager: "İnfo Yatırım Menkul",
    lotAmount: "40.000.000 Lot",
    fundSize: "778 M ₺",
    ceilingStreak: 11,
  },
  {
    id: "ipo-obams",
    code: "OBAMS",
    name: "Oba Makarnacılık Sanayi",
    sector: "Gıda & Makarna İhracatı",
    status: "listed",
    dateRange: "22 - 23 Şubat 2026",
    priceRange: "39.24 ₺",
    distributionType: "Bireysele Eşit",
    leadManager: "Türkiye Kalkınma & Ziraat",
    lotAmount: "96.336.345 Lot",
    fundSize: "3.78 Mr ₺",
    ceilingStreak: 7,
  },
  {
    id: "ipo-binho",
    code: "BINHO",
    name: "1000 Yatırımlar Holding (BinBin)",
    sector: "Ulaşım & Mikromobilite",
    status: "listed",
    dateRange: "14 - 15 Kasım 2025",
    priceRange: "125.00 ₺",
    distributionType: "Tamamı Eşit Dağıtım",
    leadManager: "A1 Capital Yatırım",
    lotAmount: "9.500.000 Lot",
    fundSize: "1.18 Mr ₺",
    ceilingStreak: 9,
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "signal",
    title: "Orakul Rebalance Uyarısı",
    message: "BIST Temettü Kalesi sepetinizde FROTO ağırlığı %35'e ulaştı. Kâr realizasyonu ve TUPRS takviyesi önerilir.",
    time: "10 dk önce",
    read: false,
    relatedBasketId: "temettu-kalesi",
  },
  {
    id: "notif-2",
    type: "ipo",
    title: "Halka Arz Talep Toplama Başladı",
    message: "Horoz Lojistik (HOROZ) için talep toplama penceresi açıldı. Tahmini 20-24 lot dağıtım bekleniyor.",
    time: "2 saat önce",
    read: false,
    relatedCompanySymbol: "HOROZ",
  },
  {
    id: "notif-3",
    type: "dividend",
    title: "Temettü Hak Kullanımı Yaklaşıyor",
    message: "Tüpraş (TUPRS) 27 Eylül tarihinde hisse başı net 10.74 ₺ nakit temettü dağıtacaktır.",
    time: "Dün",
    read: true,
    relatedCompanySymbol: "TUPRS",
  },
];

export const MOCK_AI_HISTORY: AiHistoryItem[] = [
  {
    id: "ai-1",
    date: "Bugün 14:30",
    type: "Sepet Önerisi",
    title: "Enflasyon & Kur Kalkanı Reçetesi",
    description: "Gram Altın (%45), Gümüş (%25), Koç Holding (%15), THYAO (%15) dağılımıyla yüksek getiri koruması sağlandı.",
    verdictTag: "GÜÇLÜ KORUMA",
    verdict: "DENGELİ",
    verdictDate: "2026-08-12",
    budgetAtCreation: 100000,
    outcomeCorrect: null,
    targetPeriodDays: 30,
  },
  {
    id: "ai-2",
    date: "10 Temmuz 2026",
    symbol: "THYAO",
    type: "Şirket Değerleme",
    title: "THYAO F/K Çarpan İskontosu Değerlemesi",
    description: "Sektör F/K ortalaması 7.2x iken THYAO 4.8x seviyesinde işlem görerek %33 iskontolu anomali tespit edildi.",
    verdictTag: "GÜÇLÜ AL",
    verdict: "GÜÇLÜ AL",
    verdictDate: "2026-07-10",
    priceAtVerdict: 285.5,
    priceAfterPeriod: 328.5,
    outcomeCheckedAt: "2026-08-10",
    outcomeCorrect: true,
    targetPeriodDays: 30,
  },
  {
    id: "ai-3",
    date: "02 Haziran 2026",
    symbol: "FROTO",
    type: "Şirket Değerleme",
    title: "Ford Otosan Bilanço & Temettü Teşhisi",
    description: "Craiova fabrikası ihracat gelirlerinin artışı ile serbest nakit akımının temettüyü karşılama oranı %130 olarak modellendi.",
    verdictTag: "AL",
    verdict: "AL",
    verdictDate: "2026-06-02",
    priceAtVerdict: 980.0,
    priceAfterPeriod: 1145.0,
    outcomeCheckedAt: "2026-07-02",
    outcomeCorrect: true,
    targetPeriodDays: 30,
  },
  {
    id: "ai-4",
    date: "15 Mayıs 2026",
    symbol: "EREGL",
    type: "Şirket Değerleme",
    title: "Ereğli Demir Çelik Küresel Marj Daralması",
    description: "Küresel çelik talebindeki yavaşlama ve yüksek hammadde maliyetleri nedeniyle kısa vadede baskı öngörüldü.",
    verdictTag: "TUT",
    verdict: "TUT",
    verdictDate: "2026-05-15",
    priceAtVerdict: 54.2,
    priceAfterPeriod: 52.8,
    outcomeCheckedAt: "2026-06-15",
    outcomeCorrect: true,
    targetPeriodDays: 30,
  },
];
