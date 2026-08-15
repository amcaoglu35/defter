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
}

export interface BasketHolding {
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
  status: "Yaklaşıyor" | "Ödendi" | "Açıklandı";
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
  type: "Sepet Önerisi" | "Anomali Tespiti" | "Şirket Değerleme" | "Haber Duygu Analizi" | "Reçete" | "Sohbet Analizi";
  title: string;
  description: string;
  verdictTag: string;
  symbol?: string;
  verdict?: "AL" | "SAT" | "TUT" | "GÜÇLÜ AL" | "GÜÇLÜ SAT" | "NÖTR" | "DENGELİ";
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
    "price": 341.56,
    "currency": "₺",
    "dailyChange": 1.6,
    "peRatio": 6.7,
    "pbRatio": 1.4,
    "dividendYield": 2.6,
    "marketCap": "331 Mr ₺",
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
    ]
  },
  {
    "id": "acsel",
    "symbol": "ACSEL",
    "name": "Acıselsan Selüloz",
    "sector": "Kimya & Malzeme",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 375,
    "currency": "₺",
    "dailyChange": -4,
    "peRatio": 4.7,
    "pbRatio": 0.8,
    "dividendYield": 6,
    "marketCap": "365 Mr ₺",
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
    ]
  },
  {
    "id": "adel",
    "symbol": "ADEL",
    "name": "Adel Kalemcilik",
    "sector": "Kırtasiye & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 293.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 4.6,
    "dividendYield": 5.3,
    "marketCap": "283 Mr ₺",
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
    ]
  },
  {
    "id": "adese",
    "symbol": "ADESE",
    "name": "Adese Gayrimenkul",
    "sector": "Gayrimenkul & Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 369.84,
    "currency": "₺",
    "dailyChange": 4.4,
    "peRatio": 16.7,
    "pbRatio": 4.2,
    "dividendYield": 5.4,
    "marketCap": "359 Mr ₺",
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
    ]
  },
  {
    "id": "aghol",
    "symbol": "AGHOL",
    "name": "Anadolu Grubu Holding",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 378.03,
    "currency": "₺",
    "dailyChange": -3.7,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "368 Mr ₺",
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
    ]
  },
  {
    "id": "agesa",
    "symbol": "AGESA",
    "name": "Agesa Hayat ve Emeklilik",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 368.83,
    "currency": "₺",
    "dailyChange": 4.3,
    "peRatio": 15.7,
    "pbRatio": 4.1,
    "dividendYield": 5.3,
    "marketCap": "358 Mr ₺",
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
    ]
  },
  {
    "id": "agrot",
    "symbol": "AGROT",
    "name": "Agrotech Yüksek Teknoloji",
    "sector": "Teknoloji & Tarım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 396.21,
    "currency": "₺",
    "dailyChange": -1.9,
    "peRatio": 7.7,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "6 Mr ₺",
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
    ]
  },
  {
    "id": "ahgaz",
    "symbol": "AHGAZ",
    "name": "Ahlatcı Doğal Gaz",
    "sector": "Enerji & Dağıtım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 378.03,
    "currency": "₺",
    "dailyChange": -3.7,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "368 Mr ₺",
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
    ]
  },
  {
    "id": "akbnk",
    "symbol": "AKBNK",
    "name": "Akbank T.A.Ş.",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 374.89,
    "currency": "₺",
    "dailyChange": 4.9,
    "peRatio": 21.7,
    "pbRatio": 4.7,
    "dividendYield": 5.9,
    "marketCap": "364 Mr ₺",
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
    ]
  },
  {
    "id": "akcns",
    "symbol": "AKCNS",
    "name": "Akçansa Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "akenr",
    "symbol": "AKENR",
    "name": "Akenerji Elektrik",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 384.09,
    "currency": "₺",
    "dailyChange": -3.1,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "374 Mr ₺",
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
    ]
  },
  {
    "id": "akfgy",
    "symbol": "AKFGY",
    "name": "Akfen GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 385.1,
    "currency": "₺",
    "dailyChange": -3,
    "peRatio": 14.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "375 Mr ₺",
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
    ]
  },
  {
    "id": "akfye",
    "symbol": "AKFYE",
    "name": "Akfen Yenilenebilir Enerji",
    "sector": "Yenilenebilir Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "akgrt",
    "symbol": "AKGRT",
    "name": "Aksigorta",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 392.17,
    "currency": "₺",
    "dailyChange": -2.3,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "382 Mr ₺",
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
    ]
  },
  {
    "id": "akmgy",
    "symbol": "AKMGY",
    "name": "Akmerkez GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 392.17,
    "currency": "₺",
    "dailyChange": -2.3,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "382 Mr ₺",
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
    ]
  },
  {
    "id": "aksa",
    "symbol": "AKSA",
    "name": "Aksa Akrilik Kimya",
    "sector": "Kimya & Elyaf",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 303.18,
    "currency": "₺",
    "dailyChange": -2.2,
    "peRatio": 4.7,
    "pbRatio": 1.6,
    "dividendYield": 6.3,
    "marketCap": "293 Mr ₺",
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
    ]
  },
  {
    "id": "aksen",
    "symbol": "AKSEN",
    "name": "Aksa Enerji",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 385.1,
    "currency": "₺",
    "dailyChange": -3,
    "peRatio": 14.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "375 Mr ₺",
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
    ]
  },
  {
    "id": "aksue",
    "symbol": "AKSUE",
    "name": "Aksu Enerji",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 392.17,
    "currency": "₺",
    "dailyChange": -2.3,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "382 Mr ₺",
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
    ]
  },
  {
    "id": "alark",
    "symbol": "ALARK",
    "name": "Alarko Holding",
    "sector": "Holding & Tarım / Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 378.03,
    "currency": "₺",
    "dailyChange": -3.7,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "368 Mr ₺",
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
    ]
  },
  {
    "id": "albrk",
    "symbol": "ALBRK",
    "name": "Albaraka Türk Katılım",
    "sector": "Katılım Bankacılığı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 379.04,
    "currency": "₺",
    "dailyChange": -3.6,
    "peRatio": 8.7,
    "pbRatio": 1.2,
    "dividendYield": 6.4,
    "marketCap": "369 Mr ₺",
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
    ]
  },
  {
    "id": "alcar",
    "symbol": "ALCAR",
    "name": "Alarko Carrier",
    "sector": "İklimlendirme & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 370.85,
    "currency": "₺",
    "dailyChange": 4.5,
    "peRatio": 17.7,
    "pbRatio": 4.3,
    "dividendYield": 5.5,
    "marketCap": "360 Mr ₺",
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
    ]
  },
  {
    "id": "alctl",
    "symbol": "ALCTL",
    "name": "Alcatel Lucent Teletaş",
    "sector": "Telekomünikasyon & Donanım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "algyo",
    "symbol": "ALGYO",
    "name": "Alarko GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "alka",
    "symbol": "ALKA",
    "name": "Alkim Kağıt",
    "sector": "Kağıt & Ambalaj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 296.11,
    "currency": "₺",
    "dailyChange": -2.9,
    "peRatio": 15.7,
    "pbRatio": 0.9,
    "dividendYield": 5.6,
    "marketCap": "286 Mr ₺",
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
    ]
  },
  {
    "id": "alkim",
    "symbol": "ALKIM",
    "name": "Alkim Kimya",
    "sector": "Kimya & Maden",
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
    ]
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
    ]
  },
  {
    "id": "alves",
    "symbol": "ALVES",
    "name": "Alves Kablo Sanayi",
    "sector": "Elektrik & Kablo",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "anele",
    "symbol": "ANELE",
    "name": "Anel Elektrik",
    "sector": "Elektrik & Mühendislik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 372.87,
    "currency": "₺",
    "dailyChange": 4.7,
    "peRatio": 19.7,
    "pbRatio": 4.5,
    "dividendYield": 5.7,
    "marketCap": "362 Mr ₺",
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
    ]
  },
  {
    "id": "angen",
    "symbol": "ANGEN",
    "name": "Anatolia Tanı ve Biyoteknoloji",
    "sector": "Sağlık & Biyoteknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 376.01,
    "currency": "₺",
    "dailyChange": -3.9,
    "peRatio": 5.7,
    "pbRatio": 0.9,
    "dividendYield": 6.1,
    "marketCap": "366 Mr ₺",
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
    ]
  },
  {
    "id": "anhyt",
    "symbol": "ANHYT",
    "name": "Anadolu Hayat Emeklilik",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 403.28,
    "currency": "₺",
    "dailyChange": -1.2,
    "peRatio": 14.7,
    "pbRatio": 3.6,
    "dividendYield": 1.3,
    "marketCap": "13 Mr ₺",
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
    ]
  },
  {
    "id": "ansgr",
    "symbol": "ANSGR",
    "name": "Anadolu Anonim Türk Sigorta",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "arclk",
    "symbol": "ARCLK",
    "name": "Arçelik (Beko Europe)",
    "sector": "Dayanıklı Tüketim & Beyaz Eşya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 380.05,
    "currency": "₺",
    "dailyChange": -3.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "370 Mr ₺",
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
    ]
  },
  {
    "id": "ardyz",
    "symbol": "ARDYZ",
    "name": "ARD Bilişim Teknolojileri",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 409.34,
    "currency": "₺",
    "dailyChange": -0.6,
    "peRatio": 20.7,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "19 Mr ₺",
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
    ]
  },
  {
    "id": "arena",
    "symbol": "ARENA",
    "name": "Arena Bilgisayar",
    "sector": "Bilişim & Donanım Dağıtım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 374.89,
    "currency": "₺",
    "dailyChange": 4.9,
    "peRatio": 21.7,
    "pbRatio": 4.7,
    "dividendYield": 5.9,
    "marketCap": "364 Mr ₺",
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
    ]
  },
  {
    "id": "arsan",
    "symbol": "ARSAN",
    "name": "Arsan Tekstil",
    "sector": "Tekstil & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 388.13,
    "currency": "₺",
    "dailyChange": -2.7,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "378 Mr ₺",
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
    ]
  },
  {
    "id": "artms",
    "symbol": "ARTMS",
    "name": "Artemis Halı",
    "sector": "Tekstil & Ev Eşyası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 406.31,
    "currency": "₺",
    "dailyChange": -0.9,
    "peRatio": 17.7,
    "pbRatio": 3.9,
    "dividendYield": 1.6,
    "marketCap": "16 Mr ₺",
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
    ]
  },
  {
    "id": "arzum",
    "symbol": "ARZUM",
    "name": "Arzum Elektrikli Ev Aletleri",
    "sector": "Küçük Ev Aletleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 414.39,
    "currency": "₺",
    "dailyChange": -0.1,
    "peRatio": 7.7,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "24 Mr ₺",
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
    ]
  },
  {
    "id": "asels",
    "symbol": "ASELS",
    "name": "Aselsan Elektronik Sanayi",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 391.16,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "381 Mr ₺",
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
    ]
  },
  {
    "id": "asgyo",
    "symbol": "ASGYO",
    "name": "Asce Gayrimenkul Yatırım",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "astor",
    "symbol": "ASTOR",
    "name": "Astor Enerji A.Ş.",
    "sector": "Elektromekanik & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 408.33,
    "currency": "₺",
    "dailyChange": -0.7,
    "peRatio": 19.7,
    "pbRatio": 4.1,
    "dividendYield": 1.8,
    "marketCap": "18 Mr ₺",
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
    ]
  },
  {
    "id": "asuzu",
    "symbol": "ASUZU",
    "name": "Anadolu Isuzu Otomotiv",
    "sector": "Otomotiv & Ticari Araç",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 423.48,
    "currency": "₺",
    "dailyChange": 0.8,
    "peRatio": 16.7,
    "pbRatio": 1.6,
    "dividendYield": 3.3,
    "marketCap": "33 Mr ₺",
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
    ]
  },
  {
    "id": "atakp",
    "symbol": "ATAKP",
    "name": "Atakey Patates Gıda",
    "sector": "Gıda & Tarım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 384.09,
    "currency": "₺",
    "dailyChange": -3.1,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "374 Mr ₺",
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
    ]
  },
  {
    "id": "atatp",
    "symbol": "ATATP",
    "name": "ATP Yazılım ve Teknoloji",
    "sector": "Yazılım & Fintek",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 393.18,
    "currency": "₺",
    "dailyChange": -2.2,
    "peRatio": 4.7,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "383 Mr ₺",
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
    ]
  },
  {
    "id": "avpgy",
    "symbol": "AVPGY",
    "name": "Avrupakent GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 406.31,
    "currency": "₺",
    "dailyChange": -0.9,
    "peRatio": 17.7,
    "pbRatio": 3.9,
    "dividendYield": 1.6,
    "marketCap": "16 Mr ₺",
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
    ]
  },
  {
    "id": "ayces",
    "symbol": "AYCES",
    "name": "Altın Yunus Çeşme",
    "sector": "Turizm & Otelcilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 388.13,
    "currency": "₺",
    "dailyChange": -2.7,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "378 Mr ₺",
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
    ]
  },
  {
    "id": "aydem",
    "symbol": "AYDEM",
    "name": "Aydem Yenilenebilir Enerji",
    "sector": "Yenilenebilir Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "ayen",
    "symbol": "AYEN",
    "name": "Ayen Enerji",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 316.31,
    "currency": "₺",
    "dailyChange": -0.9,
    "peRatio": 17.7,
    "pbRatio": 2.9,
    "dividendYield": 0.1,
    "marketCap": "306 Mr ₺",
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
    ]
  },
  {
    "id": "aygaz",
    "symbol": "AYGAZ",
    "name": "Aygaz A.Ş.",
    "sector": "LPG & Dağıtım / Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "aztek",
    "symbol": "AZTEK",
    "name": "Aztek Teknoloji Ürünleri",
    "sector": "Tüketici Elektroniği",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "bagfs",
    "symbol": "BAGFS",
    "name": "Bağfaş Bandırma Gübre",
    "sector": "Kimya & Gübre",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 370.85,
    "currency": "₺",
    "dailyChange": 4.5,
    "peRatio": 17.7,
    "pbRatio": 4.3,
    "dividendYield": 5.5,
    "marketCap": "360 Mr ₺",
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
    ]
  },
  {
    "id": "bahkm",
    "symbol": "BAHKM",
    "name": "Bahadır Kimya",
    "sector": "Kimya & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 370.85,
    "currency": "₺",
    "dailyChange": 4.5,
    "peRatio": 17.7,
    "pbRatio": 4.3,
    "dividendYield": 5.5,
    "marketCap": "360 Mr ₺",
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
    ]
  },
  {
    "id": "bakab",
    "symbol": "BAKAB",
    "name": "Bak Ambalaj Sanayi",
    "sector": "Ambalaj & Plastik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 352.67,
    "currency": "₺",
    "dailyChange": 2.7,
    "peRatio": 17.7,
    "pbRatio": 2.5,
    "dividendYield": 3.7,
    "marketCap": "342 Mr ₺",
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
    ]
  },
  {
    "id": "banvt",
    "symbol": "BANVT",
    "name": "Banvit Bandırma Vitaminli Yem",
    "sector": "Gıda & Tavukçuluk",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "barma",
    "symbol": "BARMA",
    "name": "Barem Ambalaj",
    "sector": "Kağıt & Ambalaj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 370.85,
    "currency": "₺",
    "dailyChange": 4.5,
    "peRatio": 17.7,
    "pbRatio": 4.3,
    "dividendYield": 5.5,
    "marketCap": "360 Mr ₺",
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
    ]
  },
  {
    "id": "basgz",
    "symbol": "BASGZ",
    "name": "Başkent Doğalgaz Dağıtım",
    "sector": "Enerji & Doğalgaz",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "bayrk",
    "symbol": "BAYRK",
    "name": "Bayrak Ebt Taban",
    "sector": "Ayakkabı & Malzeme",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 392.17,
    "currency": "₺",
    "dailyChange": -2.3,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "382 Mr ₺",
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
    ]
  },
  {
    "id": "begyo",
    "symbol": "BEGYO",
    "name": "Batı Ege GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
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
    ]
  },
  {
    "id": "bera",
    "symbol": "BERA",
    "name": "Bera Holding",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 297.12,
    "currency": "₺",
    "dailyChange": -2.8,
    "peRatio": 16.7,
    "pbRatio": 1,
    "dividendYield": 5.7,
    "marketCap": "287 Mr ₺",
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
    ]
  },
  {
    "id": "beyaz",
    "symbol": "BEYAZ",
    "name": "Beyaz Filo Oto Kiralama",
    "sector": "Otomotiv & Filo Kiralama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "bfren",
    "symbol": "BFREN",
    "name": "Bosch Fren Sistemleri",
    "sector": "Otomotiv Yan Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 380.05,
    "currency": "₺",
    "dailyChange": -3.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "370 Mr ₺",
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
    ]
  },
  {
    "id": "bieny",
    "symbol": "BIENY",
    "name": "Bien Yapı Ürünleri",
    "sector": "Seramik & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "bigch",
    "symbol": "BIGCH",
    "name": "Big Chefs Gıda Restoran",
    "sector": "Restoran & Hizmet",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 364.79,
    "currency": "₺",
    "dailyChange": 3.9,
    "peRatio": 11.7,
    "pbRatio": 3.7,
    "dividendYield": 4.9,
    "marketCap": "354 Mr ₺",
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
    ]
  },
  {
    "id": "bimas",
    "symbol": "BIMAS",
    "name": "BİM Birleşik Mağazalar",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 379.04,
    "currency": "₺",
    "dailyChange": -3.6,
    "peRatio": 8.7,
    "pbRatio": 1.2,
    "dividendYield": 6.4,
    "marketCap": "369 Mr ₺",
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
    ]
  },
  {
    "id": "binho",
    "symbol": "BINHO",
    "name": "1000 Yatırımlar Holding (BinBin)",
    "sector": "Ulaşım & Mikromobilite",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "bioen",
    "symbol": "BIOEN",
    "name": "Biotrend Çevre ve Enerji",
    "sector": "Biyokütle & Yenilenebilir Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 380.05,
    "currency": "₺",
    "dailyChange": -3.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "370 Mr ₺",
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
    ]
  },
  {
    "id": "bizim",
    "symbol": "BIZIM",
    "name": "Bizim Toptan Satış",
    "sector": "Toptan Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "bjkas",
    "symbol": "BJKAS",
    "name": "Beşiktaş Futbol Yatırımları",
    "sector": "Spor & Eğlence",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 378.03,
    "currency": "₺",
    "dailyChange": -3.7,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "368 Mr ₺",
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
    ]
  },
  {
    "id": "blcyt",
    "symbol": "BLCYT",
    "name": "Bilici Yatırım Sanayi",
    "sector": "Tekstil & Tarım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 397.22,
    "currency": "₺",
    "dailyChange": -1.8,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "7 Mr ₺",
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
    ]
  },
  {
    "id": "bntas",
    "symbol": "BNTAS",
    "name": "Bantaş Bandırma Ambalaj",
    "sector": "Metal Ambalaj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 391.16,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "381 Mr ₺",
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
    ]
  },
  {
    "id": "bobet",
    "symbol": "BOBET",
    "name": "Boğaziçi Beton Sanayi",
    "sector": "Hazır Beton & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 379.04,
    "currency": "₺",
    "dailyChange": -3.6,
    "peRatio": 8.7,
    "pbRatio": 1.2,
    "dividendYield": 6.4,
    "marketCap": "369 Mr ₺",
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
    ]
  },
  {
    "id": "borls",
    "symbol": "BORLS",
    "name": "Borlease Otomotiv",
    "sector": "Filo Kiralama & Mobilite",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "bossa",
    "symbol": "BOSSA",
    "name": "Bossa Ticaret ve Sanayi",
    "sector": "Tekstil & Denim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 391.16,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "381 Mr ₺",
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
    ]
  },
  {
    "id": "brisa",
    "symbol": "BRISA",
    "name": "Brisa Bridgestone Sabancı Lastik",
    "sector": "Otomotiv Yan Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 384.09,
    "currency": "₺",
    "dailyChange": -3.1,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "374 Mr ₺",
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
    ]
  },
  {
    "id": "brlsm",
    "symbol": "BRLSM",
    "name": "Birleşim Mühendislik",
    "sector": "Mühendislik & İklimlendirme",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "brsan",
    "symbol": "BRSAN",
    "name": "Borusan Birleşik Boru",
    "sector": "Demir-Çelik & Boru",
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
    ]
  },
  {
    "id": "bryat",
    "symbol": "BRYAT",
    "name": "Borusan Yatırım ve Pazarlama",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "bsoke",
    "symbol": "BSOKE",
    "name": "Batısöke Söke Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 387.12,
    "currency": "₺",
    "dailyChange": -2.8,
    "peRatio": 16.7,
    "pbRatio": 2,
    "dividendYield": 7.2,
    "marketCap": "377 Mr ₺",
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
    ]
  },
  {
    "id": "btcim",
    "symbol": "BTCIM",
    "name": "Batıçim Batı Anadolu Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 382.07,
    "currency": "₺",
    "dailyChange": -3.3,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "372 Mr ₺",
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
    ]
  },
  {
    "id": "bucim",
    "symbol": "BUCIM",
    "name": "Bursa Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "burce",
    "symbol": "BURCE",
    "name": "Burçelik Çelik Döküm",
    "sector": "Döküm & Makine",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 384.09,
    "currency": "₺",
    "dailyChange": -3.1,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "374 Mr ₺",
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
    ]
  },
  {
    "id": "bvsan",
    "symbol": "BVSAN",
    "name": "Bülbüloğlu Vinç Sanayi",
    "sector": "Ağır Sanayi & Vinç",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 393.18,
    "currency": "₺",
    "dailyChange": -2.2,
    "peRatio": 4.7,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "383 Mr ₺",
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
    ]
  },
  {
    "id": "bydnr",
    "symbol": "BYDNR",
    "name": "Baydöner Restoranları",
    "sector": "Restoran & Gıda",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "cante",
    "symbol": "CANTE",
    "name": "Çan2 Termik A.Ş.",
    "sector": "Enerji Üretim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 378.03,
    "currency": "₺",
    "dailyChange": -3.7,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "368 Mr ₺",
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
    ]
  },
  {
    "id": "ccola",
    "symbol": "CCOLA",
    "name": "Coca-Cola İçecek A.Ş.",
    "sector": "Gıda & İçecek",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 369.84,
    "currency": "₺",
    "dailyChange": 4.4,
    "peRatio": 16.7,
    "pbRatio": 4.2,
    "dividendYield": 5.4,
    "marketCap": "359 Mr ₺",
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
    ]
  },
  {
    "id": "celha",
    "symbol": "CELHA",
    "name": "Çelik Halat ve Tel",
    "sector": "Metal & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 364.79,
    "currency": "₺",
    "dailyChange": 3.9,
    "peRatio": 11.7,
    "pbRatio": 3.7,
    "dividendYield": 4.9,
    "marketCap": "354 Mr ₺",
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
    ]
  },
  {
    "id": "cemas",
    "symbol": "CEMAS",
    "name": "Çemaş Döküm Sanayi",
    "sector": "Döküm & Metal",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 376.01,
    "currency": "₺",
    "dailyChange": -3.9,
    "peRatio": 5.7,
    "pbRatio": 0.9,
    "dividendYield": 6.1,
    "marketCap": "366 Mr ₺",
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
    ]
  },
  {
    "id": "cemts",
    "symbol": "CEMTS",
    "name": "Çemtaş Çelik Makina",
    "sector": "Vasıflı Çelik & Otomotiv",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "cimsa",
    "symbol": "CIMSA",
    "name": "Çimsa Çimento Sanayi",
    "sector": "Çimento & Yapı Malzemeleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 380.05,
    "currency": "₺",
    "dailyChange": -3.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "370 Mr ₺",
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
    ]
  },
  {
    "id": "clebi",
    "symbol": "CLEBI",
    "name": "Çelebi Hava Servisi",
    "sector": "Havacılık & Yer Hizmetleri",
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
    ]
  },
  {
    "id": "conse",
    "symbol": "CONSE",
    "name": "Consus Enerji İşletmeciliği",
    "sector": "Biyokütle & Güneş Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 391.16,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "381 Mr ₺",
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
    ]
  },
  {
    "id": "crfsa",
    "symbol": "CRFSA",
    "name": "CarrefourSA Carrefour Sabancı",
    "sector": "Perakende Market",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 382.07,
    "currency": "₺",
    "dailyChange": -3.3,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "372 Mr ₺",
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
    ]
  },
  {
    "id": "cusan",
    "symbol": "CUSAN",
    "name": "Çuhadaroğlu Metal Sanayi",
    "sector": "Alüminyum & Cephe Sistemleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 393.18,
    "currency": "₺",
    "dailyChange": -2.2,
    "peRatio": 4.7,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "383 Mr ₺",
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
    ]
  },
  {
    "id": "cvkmd",
    "symbol": "CVKMD",
    "name": "CVK Maden İşletmeleri",
    "sector": "Krom & Altın Madenciliği",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 388.13,
    "currency": "₺",
    "dailyChange": -2.7,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "378 Mr ₺",
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
    ]
  },
  {
    "id": "cwene",
    "symbol": "CWENE",
    "name": "CW Enerji Mühendislik",
    "sector": "Güneş Enerjisi (GES)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 385.1,
    "currency": "₺",
    "dailyChange": -3,
    "peRatio": 14.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "375 Mr ₺",
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
    ]
  },
  {
    "id": "dapgm",
    "symbol": "DAPGM",
    "name": "DAP Gayrimenkul Geliştirme",
    "sector": "Gayrimenkul & İnşaat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 376.01,
    "currency": "₺",
    "dailyChange": -3.9,
    "peRatio": 5.7,
    "pbRatio": 0.9,
    "dividendYield": 6.1,
    "marketCap": "366 Mr ₺",
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
    ]
  },
  {
    "id": "dardl",
    "symbol": "DARDL",
    "name": "Dardanel Önentaş Gıda",
    "sector": "Gıda & Konserve Balık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 374.89,
    "currency": "₺",
    "dailyChange": 4.9,
    "peRatio": 21.7,
    "pbRatio": 4.7,
    "dividendYield": 5.9,
    "marketCap": "364 Mr ₺",
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
    ]
  },
  {
    "id": "desa",
    "symbol": "DESA",
    "name": "Desa Deri Sanayi",
    "sector": "Deri & Moda Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 300.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 1.3,
    "dividendYield": 6,
    "marketCap": "290 Mr ₺",
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
    ]
  },
  {
    "id": "despc",
    "symbol": "DESPC",
    "name": "Despec Bilgisayar",
    "sector": "Bilişim Sarf Malzemeleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 382.07,
    "currency": "₺",
    "dailyChange": -3.3,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "372 Mr ₺",
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
    ]
  },
  {
    "id": "deva",
    "symbol": "DEVA",
    "name": "Deva Holding",
    "sector": "İlaç & Sağlık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 303.18,
    "currency": "₺",
    "dailyChange": -2.2,
    "peRatio": 4.7,
    "pbRatio": 1.6,
    "dividendYield": 6.3,
    "marketCap": "293 Mr ₺",
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
    ]
  },
  {
    "id": "dgate",
    "symbol": "DGATE",
    "name": "Datagate Bilgisayar",
    "sector": "Telekom Distribütörü",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 372.87,
    "currency": "₺",
    "dailyChange": 4.7,
    "peRatio": 19.7,
    "pbRatio": 4.5,
    "dividendYield": 5.7,
    "marketCap": "362 Mr ₺",
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
    ]
  },
  {
    "id": "dggyo",
    "symbol": "DGGYO",
    "name": "Doğuş GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 393.18,
    "currency": "₺",
    "dailyChange": -2.2,
    "peRatio": 4.7,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "383 Mr ₺",
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
    ]
  },
  {
    "id": "dgnmo",
    "symbol": "DGNMO",
    "name": "Doğanlar Mobilya Grubu (Doğtaş)",
    "sector": "Mobilya & Ev Eşyası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 388.13,
    "currency": "₺",
    "dailyChange": -2.7,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "378 Mr ₺",
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
    ]
  },
  {
    "id": "doas",
    "symbol": "DOAS",
    "name": "Doğuş Otomotiv Servis",
    "sector": "Otomotiv & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 310.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 2.3,
    "dividendYield": 7,
    "marketCap": "300 Mr ₺",
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
    ]
  },
  {
    "id": "doco",
    "symbol": "DOCO",
    "name": "DO & CO Aktiengesellschaft",
    "sector": "İkram Hizmetleri & Havacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 308.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 2.1,
    "dividendYield": 6.8,
    "marketCap": "298 Mr ₺",
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
    ]
  },
  {
    "id": "dofer",
    "symbol": "DOFER",
    "name": "Dofer Yapı Malzemeleri",
    "sector": "Hasır Çelik & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "dohol",
    "symbol": "DOHOL",
    "name": "Doğan Şirketler Grubu Holding",
    "sector": "Holding & Yatırım",
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
    ]
  },
  {
    "id": "dokta",
    "symbol": "DOKTA",
    "name": "Döktaş Dökümcülük",
    "sector": "Otomotiv Döküm Parçaları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 386.11,
    "currency": "₺",
    "dailyChange": -2.9,
    "peRatio": 15.7,
    "pbRatio": 1.9,
    "dividendYield": 7.1,
    "marketCap": "376 Mr ₺",
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
    ]
  },
  {
    "id": "durdo",
    "symbol": "DURDO",
    "name": "Duran Doğan Basım ve Ambalaj",
    "sector": "Karton Ambalaj & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 397.22,
    "currency": "₺",
    "dailyChange": -1.8,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "7 Mr ₺",
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
    ]
  },
  {
    "id": "dyoby",
    "symbol": "DYOBY",
    "name": "Dyo Boya Fabrikaları",
    "sector": "Boya & Kimya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 406.31,
    "currency": "₺",
    "dailyChange": -0.9,
    "peRatio": 17.7,
    "pbRatio": 3.9,
    "dividendYield": 1.6,
    "marketCap": "16 Mr ₺",
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
    ]
  },
  {
    "id": "ebebk",
    "symbol": "EBEBK",
    "name": "Ebebek Mağazacılık",
    "sector": "Bebek Perakendeciliği",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 360.75,
    "currency": "₺",
    "dailyChange": 3.5,
    "peRatio": 7.7,
    "pbRatio": 3.3,
    "dividendYield": 4.5,
    "marketCap": "350 Mr ₺",
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
    ]
  },
  {
    "id": "ecilc",
    "symbol": "ECILC",
    "name": "Eczacıbaşı İlaç",
    "sector": "Holding & Sağlık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 367.82,
    "currency": "₺",
    "dailyChange": 4.2,
    "peRatio": 14.7,
    "pbRatio": 4,
    "dividendYield": 5.2,
    "marketCap": "357 Mr ₺",
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
    ]
  },
  {
    "id": "eczyt",
    "symbol": "ECZYT",
    "name": "Eczacıbaşı Yatırım Holding",
    "sector": "Yatırım & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 414.39,
    "currency": "₺",
    "dailyChange": -0.1,
    "peRatio": 7.7,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "24 Mr ₺",
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
    ]
  },
  {
    "id": "edata",
    "symbol": "EDATA",
    "name": "E-Data Teknoloji",
    "sector": "Siber Güvenlik Dağıtıcısı",
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
    ]
  },
  {
    "id": "egeen",
    "symbol": "EGEEN",
    "name": "Ege Endüstri ve Ticaret",
    "sector": "Otomotiv Dingil & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 371.86,
    "currency": "₺",
    "dailyChange": 4.6,
    "peRatio": 18.7,
    "pbRatio": 4.4,
    "dividendYield": 5.6,
    "marketCap": "361 Mr ₺",
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
    ]
  },
  {
    "id": "eggub",
    "symbol": "EGGUB",
    "name": "Ege Gübre Sanayi",
    "sector": "Liman İşletmeciliği & Gübre",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 377.02,
    "currency": "₺",
    "dailyChange": -3.8,
    "peRatio": 6.7,
    "pbRatio": 1,
    "dividendYield": 6.2,
    "marketCap": "367 Mr ₺",
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
    ]
  },
  {
    "id": "egpro",
    "symbol": "EGPRO",
    "name": "Ege Profil Ticaret (Egepen)",
    "sector": "PVC Profil & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 396.21,
    "currency": "₺",
    "dailyChange": -1.9,
    "peRatio": 7.7,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "6 Mr ₺",
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
    ]
  },
  {
    "id": "egser",
    "symbol": "EGSER",
    "name": "Ege Seramik Sanayi",
    "sector": "Seramik & Yapı",
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
    ]
  },
  {
    "id": "ekgyo",
    "symbol": "EKGYO",
    "name": "Emlak Konut GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "eksun",
    "symbol": "EKSUN",
    "name": "Eksun Gıda Tarım (Sinangil)",
    "sector": "Un & Gıda Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 405.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "15 Mr ₺",
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
    ]
  },
  {
    "id": "elite",
    "symbol": "ELITE",
    "name": "Elite Naturel Organik Gıda",
    "sector": "Organik Meyve Suyu İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 386.11,
    "currency": "₺",
    "dailyChange": -2.9,
    "peRatio": 15.7,
    "pbRatio": 1.9,
    "dividendYield": 7.1,
    "marketCap": "376 Mr ₺",
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
    ]
  },
  {
    "id": "enery",
    "symbol": "ENERY",
    "name": "Enerya Enerji",
    "sector": "Doğalgaz Dağıtım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "enjsa",
    "symbol": "ENJSA",
    "name": "Enerjisa Enerji A.Ş.",
    "sector": "Enerji Dağıtım & Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 384.09,
    "currency": "₺",
    "dailyChange": -3.1,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "374 Mr ₺",
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
    ]
  },
  {
    "id": "enkai",
    "symbol": "ENKAI",
    "name": "Enka İnşaat ve Sanayi",
    "sector": "İnşaat & Enerji / Gayrimenkul",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 375,
    "currency": "₺",
    "dailyChange": -4,
    "peRatio": 4.7,
    "pbRatio": 0.8,
    "dividendYield": 6,
    "marketCap": "365 Mr ₺",
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
    ]
  },
  {
    "id": "erbos",
    "symbol": "ERBOS",
    "name": "Erbosan Erciyas Boru",
    "sector": "Çelik Boru & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "eregl",
    "symbol": "EREGL",
    "name": "Ereğli Demir ve Çelik",
    "sector": "Temel Metal & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 382.07,
    "currency": "₺",
    "dailyChange": -3.3,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "372 Mr ₺",
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
    ]
  },
  {
    "id": "escar",
    "symbol": "ESCAR",
    "name": "Escar Turizm Taşımacılık",
    "sector": "Filo Kiralama",
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
    ]
  },
  {
    "id": "escom",
    "symbol": "ESCOM",
    "name": "Escort Teknoloji Yatırım",
    "sector": "Girişim Sermayesi & Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "eupwr",
    "symbol": "EUPWR",
    "name": "Europower Enerji ve Otomasyon",
    "sector": "Elektromekanik & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 418.43,
    "currency": "₺",
    "dailyChange": 0.3,
    "peRatio": 11.7,
    "pbRatio": 1.1,
    "dividendYield": 2.8,
    "marketCap": "28 Mr ₺",
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
    ]
  },
  {
    "id": "euren",
    "symbol": "EUREN",
    "name": "Europen Endüstri",
    "sector": "Cam & PVC Yapı Malzemeleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "fade",
    "symbol": "FADE",
    "name": "Fade Gıda Yatırım",
    "sector": "Kurutulmuş Domates İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 287.02,
    "currency": "₺",
    "dailyChange": -3.8,
    "peRatio": 6.7,
    "pbRatio": 4,
    "dividendYield": 4.7,
    "marketCap": "277 Mr ₺",
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
    ]
  },
  {
    "id": "fener",
    "symbol": "FENER",
    "name": "Fenerbahçe Futbol A.Ş.",
    "sector": "Spor & Eğlence",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "fonet",
    "symbol": "FONET",
    "name": "Fonet Bilgi Teknolojileri",
    "sector": "Sağlık Bilişim Sistemleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "formt",
    "symbol": "FORMT",
    "name": "Formet Metal ve Cam",
    "sector": "Dayanıklı Tüketim & Metal",
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
    ]
  },
  {
    "id": "forte",
    "symbol": "FORTE",
    "name": "Forte Bilgi İletişim",
    "sector": "Savunma Bilişimi & Sistem Entegratörü",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "frigo",
    "symbol": "FRIGO",
    "name": "Frigo Pak Gıda",
    "sector": "Dondurulmuş Gıda İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "froto",
    "symbol": "FROTO",
    "name": "Ford Otomotiv Sanayi",
    "sector": "Otomotiv & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 409.34,
    "currency": "₺",
    "dailyChange": -0.6,
    "peRatio": 20.7,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "19 Mr ₺",
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
    ]
  },
  {
    "id": "fzlgy",
    "symbol": "FZLGY",
    "name": "Fuzul Gayrimenkul Yatırım",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 411.36,
    "currency": "₺",
    "dailyChange": -0.4,
    "peRatio": 4.7,
    "pbRatio": 4.4,
    "dividendYield": 2.1,
    "marketCap": "21 Mr ₺",
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
    ]
  },
  {
    "id": "garan",
    "symbol": "GARAN",
    "name": "Türkiye Garanti Bankası (BBVA)",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 376.01,
    "currency": "₺",
    "dailyChange": -3.9,
    "peRatio": 5.7,
    "pbRatio": 0.9,
    "dividendYield": 6.1,
    "marketCap": "366 Mr ₺",
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
    ]
  },
  {
    "id": "garfa",
    "symbol": "GARFA",
    "name": "Garanti Faktoring",
    "sector": "Faktoring & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 368.83,
    "currency": "₺",
    "dailyChange": 4.3,
    "peRatio": 15.7,
    "pbRatio": 4.1,
    "dividendYield": 5.3,
    "marketCap": "358 Mr ₺",
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
    ]
  },
  {
    "id": "gedik",
    "symbol": "GEDIK",
    "name": "Gedik Yatırım Menkul",
    "sector": "Aracı Kurum & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 371.86,
    "currency": "₺",
    "dailyChange": 4.6,
    "peRatio": 18.7,
    "pbRatio": 4.4,
    "dividendYield": 5.6,
    "marketCap": "361 Mr ₺",
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
    ]
  },
  {
    "id": "genil",
    "symbol": "GENIL",
    "name": "Gen İlaç ve Sağlık Ürünleri",
    "sector": "İlaç & Biyoteknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 382.07,
    "currency": "₺",
    "dailyChange": -3.3,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "372 Mr ₺",
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
    ]
  },
  {
    "id": "gents",
    "symbol": "GENTS",
    "name": "Gentaş Dekoratif Yüzeyler",
    "sector": "Laminat & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 400.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "10 Mr ₺",
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
    ]
  },
  {
    "id": "gerel",
    "symbol": "GEREL",
    "name": "Gersan Elektrik Ticaret",
    "sector": "Elektrik Malzemeleri & Şarj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 382.07,
    "currency": "₺",
    "dailyChange": -3.3,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "372 Mr ₺",
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
    ]
  },
  {
    "id": "gesan",
    "symbol": "GESAN",
    "name": "Girişim Elektrik Sanayi",
    "sector": "Elektromekanik & Enerji",
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
    ]
  },
  {
    "id": "gipta",
    "symbol": "GIPTA",
    "name": "Gıpta Ofis Kırtasiye",
    "sector": "Kırtasiye & Ambalaj",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 388.13,
    "currency": "₺",
    "dailyChange": -2.7,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "378 Mr ₺",
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
    ]
  },
  {
    "id": "glcvy",
    "symbol": "GLCVY",
    "name": "Gelecek Varlık Yönetimi",
    "sector": "Varlık Yönetimi & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 404.29,
    "currency": "₺",
    "dailyChange": -1.1,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "14 Mr ₺",
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
    ]
  },
  {
    "id": "glyho",
    "symbol": "GLYHO",
    "name": "Global Yatırım Holding",
    "sector": "Liman İşletmeciliği & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "goknr",
    "symbol": "GOKNR",
    "name": "Göknur Gıda Maddeleri",
    "sector": "Meyve Suyu Konsantresi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 400.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "10 Mr ₺",
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
    ]
  },
  {
    "id": "golts",
    "symbol": "GOLTS",
    "name": "Göltaş Göller Bölgesi Çimento",
    "sector": "Çimento & Hazır Beton",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 408.33,
    "currency": "₺",
    "dailyChange": -0.7,
    "peRatio": 19.7,
    "pbRatio": 4.1,
    "dividendYield": 1.8,
    "marketCap": "18 Mr ₺",
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
    ]
  },
  {
    "id": "goody",
    "symbol": "GOODY",
    "name": "Goodyear Lastikleri",
    "sector": "Otomotiv Lastik Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "gozde",
    "symbol": "GOZDE",
    "name": "Gözde Girişim Sermayesi",
    "sector": "Girişim Sermayesi & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 392.17,
    "currency": "₺",
    "dailyChange": -2.3,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "382 Mr ₺",
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
    ]
  },
  {
    "id": "gsdho",
    "symbol": "GSDHO",
    "name": "GSD Holding",
    "sector": "Denizcilik & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 388.13,
    "currency": "₺",
    "dailyChange": -2.7,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "378 Mr ₺",
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
    ]
  },
  {
    "id": "gsray",
    "symbol": "GSRAY",
    "name": "Galatasaray Sportif Sınai",
    "sector": "Spor & Eğlence",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 405.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "15 Mr ₺",
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
    ]
  },
  {
    "id": "gubrf",
    "symbol": "GUBRF",
    "name": "Gübre Fabrikaları T.A.Ş.",
    "sector": "Kimya & Tarım Gübresi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
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
    ]
  },
  {
    "id": "gwind",
    "symbol": "GWIND",
    "name": "Galata Wind Enerji",
    "sector": "Rüzgar & Güneş Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 392.17,
    "currency": "₺",
    "dailyChange": -2.3,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "382 Mr ₺",
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
    ]
  },
  {
    "id": "gznmi",
    "symbol": "GZNMI",
    "name": "Gezinomi Seyahat Turizm",
    "sector": "Turizm & Seyahat Acentesi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 404.29,
    "currency": "₺",
    "dailyChange": -1.1,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "14 Mr ₺",
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
    ]
  },
  {
    "id": "halkb",
    "symbol": "HALKB",
    "name": "Türkiye Halk Bankası",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 369.84,
    "currency": "₺",
    "dailyChange": 4.4,
    "peRatio": 16.7,
    "pbRatio": 4.2,
    "dividendYield": 5.4,
    "marketCap": "359 Mr ₺",
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
    ]
  },
  {
    "id": "hatek",
    "symbol": "HATEK",
    "name": "Hateks Hatay Tekstil",
    "sector": "Havlu & Tekstil İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 380.05,
    "currency": "₺",
    "dailyChange": -3.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "370 Mr ₺",
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
    ]
  },
  {
    "id": "hatsn",
    "symbol": "HATSN",
    "name": "Hatsan Gemi İnşaa",
    "sector": "Tersane & Gemi Onarımı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 397.22,
    "currency": "₺",
    "dailyChange": -1.8,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "7 Mr ₺",
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
    ]
  },
  {
    "id": "hekts",
    "symbol": "HEKTS",
    "name": "Hektaş Ticaret T.A.Ş.",
    "sector": "Tarım İlaçları & Tohum",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "hktm",
    "symbol": "HKTM",
    "name": "Hidropar Hareket Kontrol",
    "sector": "Robotik & Otomasyon",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 323.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 3.6,
    "dividendYield": 0.8,
    "marketCap": "313 Mr ₺",
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
    ]
  },
  {
    "id": "hlgyo",
    "symbol": "HLGYO",
    "name": "Halk GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "hrket",
    "symbol": "HRKET",
    "name": "Hareket Proje Taşımacılığı",
    "sector": "Ağır Yük Lojistiği & Vinç",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 397.22,
    "currency": "₺",
    "dailyChange": -1.8,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "7 Mr ₺",
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
    ]
  },
  {
    "id": "httbt",
    "symbol": "HTTBT",
    "name": "Hitit Bilgisayar Hizmetleri",
    "sector": "Havacılık Yazılımları & SaaS",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 405.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "15 Mr ₺",
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
    ]
  },
  {
    "id": "huner",
    "symbol": "HUNER",
    "name": "Hun Yenilenebilir Enerji",
    "sector": "Güneş & Biyokütle Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "hurgz",
    "symbol": "HURGZ",
    "name": "Hürriyet Gazetecilik",
    "sector": "Medya & Yayıncılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 415.4,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 8.7,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "25 Mr ₺",
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
    ]
  },
  {
    "id": "icbct",
    "symbol": "ICBCT",
    "name": "ICBC Turkey Bank",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 372.87,
    "currency": "₺",
    "dailyChange": 4.7,
    "peRatio": 19.7,
    "pbRatio": 4.5,
    "dividendYield": 5.7,
    "marketCap": "362 Mr ₺",
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
    ]
  },
  {
    "id": "ieyho",
    "symbol": "IEYHO",
    "name": "Işıklar Enerji ve Yapı Holding",
    "sector": "Holding & Çimento Torbası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 397.22,
    "currency": "₺",
    "dailyChange": -1.8,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "7 Mr ₺",
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
    ]
  },
  {
    "id": "ihaas",
    "symbol": "IHAAS",
    "name": "İhlas Haber Ajansı",
    "sector": "Medya & Ajans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 373.88,
    "currency": "₺",
    "dailyChange": 4.8,
    "peRatio": 20.7,
    "pbRatio": 4.6,
    "dividendYield": 5.8,
    "marketCap": "363 Mr ₺",
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
    ]
  },
  {
    "id": "iheva",
    "symbol": "IHEVA",
    "name": "İhlas Ev Aletleri",
    "sector": "Küçük Ev Aletleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 380.05,
    "currency": "₺",
    "dailyChange": -3.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "370 Mr ₺",
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
    ]
  },
  {
    "id": "ihlas",
    "symbol": "IHLAS",
    "name": "İhlas Holding",
    "sector": "Holding & Medya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 384.09,
    "currency": "₺",
    "dailyChange": -3.1,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "374 Mr ₺",
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
    ]
  },
  {
    "id": "ihlgm",
    "symbol": "IHLGM",
    "name": "İhlas Gayrimenkul",
    "sector": "Gayrimenkul & İnşaat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 384.09,
    "currency": "₺",
    "dailyChange": -3.1,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "374 Mr ₺",
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
    ]
  },
  {
    "id": "imasm",
    "symbol": "IMASM",
    "name": "İmaş Makina Sanayi",
    "sector": "Değirmen Makineleri İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "indes",
    "symbol": "INDES",
    "name": "İndeks Bilgisayar",
    "sector": "Bilişim Donanımı Distribütörü",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 386.11,
    "currency": "₺",
    "dailyChange": -2.9,
    "peRatio": 15.7,
    "pbRatio": 1.9,
    "dividendYield": 7.1,
    "marketCap": "376 Mr ₺",
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
    ]
  },
  {
    "id": "info",
    "symbol": "INFO",
    "name": "İnfo Yatırım Menkul Değerler",
    "sector": "Aracı Kurum & Portföy",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 315.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 2.8,
    "dividendYield": 0,
    "marketCap": "305 Mr ₺",
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
    ]
  },
  {
    "id": "ingrm",
    "symbol": "INGRM",
    "name": "Ingram Bilişim",
    "sector": "Bulut & BT Distribütörü",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 396.21,
    "currency": "₺",
    "dailyChange": -1.9,
    "peRatio": 7.7,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "6 Mr ₺",
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
    ]
  },
  {
    "id": "inves",
    "symbol": "INVES",
    "name": "Investco Holding",
    "sector": "Girişim Sermayesi & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 404.29,
    "currency": "₺",
    "dailyChange": -1.1,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "14 Mr ₺",
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
    ]
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
    "price": 404.29,
    "currency": "₺",
    "dailyChange": -1.1,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "14 Mr ₺",
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
    ]
  },
  {
    "id": "isdmr",
    "symbol": "ISDMR",
    "name": "İskenderun Demir ve Çelik",
    "sector": "Entegre Yassı & Uzun Çelik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "isfin",
    "symbol": "ISFIN",
    "name": "İş Finansal Kiralama (Leasing)",
    "sector": "Leasing & Finans",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 392.17,
    "currency": "₺",
    "dailyChange": -2.3,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "382 Mr ₺",
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
    ]
  },
  {
    "id": "isgyo",
    "symbol": "ISGYO",
    "name": "İş GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 410.35,
    "currency": "₺",
    "dailyChange": -0.5,
    "peRatio": 21.7,
    "pbRatio": 4.3,
    "dividendYield": 2,
    "marketCap": "20 Mr ₺",
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
    ]
  },
  {
    "id": "iskpl",
    "symbol": "ISKPL",
    "name": "Işık Plastik Sanayi",
    "sector": "Endüstriyel Plastik Levhalar",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "ismen",
    "symbol": "ISMEN",
    "name": "İş Yatırım Menkul Değerler",
    "sector": "Aracı Kurum & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "issen",
    "symbol": "ISSEN",
    "name": "İşbir Sentetik Dokuma",
    "sector": "Sentetik Ambalaj & Bigbag",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "izmdc",
    "symbol": "IZMDC",
    "name": "İzmir Demir Çelik",
    "sector": "İnşaat Demiri & Kütük Çelik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "jants",
    "symbol": "JANTS",
    "name": "Jantsa Jant Sanayi",
    "sector": "Otomotiv & Ağır Vasıta Jantı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "karel",
    "symbol": "KAREL",
    "name": "Karel Elektronik",
    "sector": "Haberleşme Santralleri & Savunma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 382.07,
    "currency": "₺",
    "dailyChange": -3.3,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "372 Mr ₺",
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
    ]
  },
  {
    "id": "karsn",
    "symbol": "KARSN",
    "name": "Karsan Otomotiv",
    "sector": "Elektrikli Minibüs & Otobüs",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "kartn",
    "symbol": "KARTN",
    "name": "Kartonsan Karton Sanayi",
    "sector": "Kuşeli Karton Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "kayse",
    "symbol": "KAYSE",
    "name": "Kayseri Şeker Fabrikası",
    "sector": "Şeker & Tarım Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 396.21,
    "currency": "₺",
    "dailyChange": -1.9,
    "peRatio": 7.7,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "6 Mr ₺",
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
    ]
  },
  {
    "id": "kboru",
    "symbol": "KBORU",
    "name": "Kuzey Boru A.Ş.",
    "sector": "Altyapı & Plastik Boru",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "kcaer",
    "symbol": "KCAER",
    "name": "Kocaer Çelik Sanayi",
    "sector": "Çelik Profil & Güneş Enerjisi Yapıları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 373.88,
    "currency": "₺",
    "dailyChange": 4.8,
    "peRatio": 20.7,
    "pbRatio": 4.6,
    "dividendYield": 5.8,
    "marketCap": "363 Mr ₺",
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
    ]
  },
  {
    "id": "kchol",
    "symbol": "KCHOL",
    "name": "Koç Holding A.Ş.",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 384.09,
    "currency": "₺",
    "dailyChange": -3.1,
    "peRatio": 13.7,
    "pbRatio": 1.7,
    "dividendYield": 6.9,
    "marketCap": "374 Mr ₺",
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
    ]
  },
  {
    "id": "kfein",
    "symbol": "KFEIN",
    "name": "Kafein Yazılım Hizmetleri",
    "sector": "Büyük Veri & Telekom Yazılımları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 380.05,
    "currency": "₺",
    "dailyChange": -3.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "370 Mr ₺",
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
    ]
  },
  {
    "id": "kimmr",
    "symbol": "KIMMR",
    "name": "Erka Kimya (Kimteks)",
    "sector": "Poliüretan Sistem Evi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "klgyo",
    "symbol": "KLGYO",
    "name": "Kiler GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 405.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "15 Mr ₺",
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
    ]
  },
  {
    "id": "klkim",
    "symbol": "KLKIM",
    "name": "Kalekim Kimyevi Maddeler",
    "sector": "Yapı Kimyasalları & Harçlar",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 391.16,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "381 Mr ₺",
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
    ]
  },
  {
    "id": "klmsn",
    "symbol": "KLMSN",
    "name": "Klimasan Klima Sanayi",
    "sector": "Ticari Soğutucu & Dolaplar",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 404.29,
    "currency": "₺",
    "dailyChange": -1.1,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "14 Mr ₺",
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
    ]
  },
  {
    "id": "klrho",
    "symbol": "KLRHO",
    "name": "Kiler Holding",
    "sector": "Holding & Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "klser",
    "symbol": "KLSER",
    "name": "Kaleseramik Çanakkale Kalebodur",
    "sector": "Seramik & Banyo Ürünleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 400.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "10 Mr ₺",
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
    ]
  },
  {
    "id": "kmpur",
    "symbol": "KMPUR",
    "name": "Kimteks Poliüretan Sanayi",
    "sector": "Ayakkabı & Otomotiv Poliüretanı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 414.39,
    "currency": "₺",
    "dailyChange": -0.1,
    "peRatio": 7.7,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "24 Mr ₺",
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
    ]
  },
  {
    "id": "konka",
    "symbol": "KONKA",
    "name": "Konya Kağıt Sanayi",
    "sector": "Yazı Tabı Kağıtları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 387.12,
    "currency": "₺",
    "dailyChange": -2.8,
    "peRatio": 16.7,
    "pbRatio": 2,
    "dividendYield": 7.2,
    "marketCap": "377 Mr ₺",
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
    ]
  },
  {
    "id": "kontr",
    "symbol": "KONTR",
    "name": "Kontrolmatik Teknoloji Enerji",
    "sector": "Enerji & Depolama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 413.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "23 Mr ₺",
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
    ]
  },
  {
    "id": "konya",
    "symbol": "KONYA",
    "name": "Konya Çimento",
    "sector": "Çimento & Hazır Beton",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "kopol",
    "symbol": "KOPOL",
    "name": "Koza Polyester Sanayi",
    "sector": "Polyester İplik & Elyaf",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 404.29,
    "currency": "₺",
    "dailyChange": -1.1,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "14 Mr ₺",
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
    ]
  },
  {
    "id": "kords",
    "symbol": "KORDS",
    "name": "Kordsa Teknik Tekstil",
    "sector": "Lastik Kord Bezi & Kompozit",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "koton",
    "symbol": "KOTON",
    "name": "Koton Mağazacılık",
    "sector": "Hazır Giyim Perakendesi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 410.35,
    "currency": "₺",
    "dailyChange": -0.5,
    "peRatio": 21.7,
    "pbRatio": 4.3,
    "dividendYield": 2,
    "marketCap": "20 Mr ₺",
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
    ]
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
    "price": 385.1,
    "currency": "₺",
    "dailyChange": -3,
    "peRatio": 14.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "375 Mr ₺",
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
    ]
  },
  {
    "id": "kront",
    "symbol": "KRONT",
    "name": "Kron Telekomünikasyon",
    "sector": "Siber Güvenlik & PAM Yazılımları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 413.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "23 Mr ₺",
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
    ]
  },
  {
    "id": "krpls",
    "symbol": "KRPLS",
    "name": "Koroplast Temizlik Ambalaj",
    "sector": "Çöp Torbası & Mutfak Ambalajı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 411.36,
    "currency": "₺",
    "dailyChange": -0.4,
    "peRatio": 4.7,
    "pbRatio": 4.4,
    "dividendYield": 2.1,
    "marketCap": "21 Mr ₺",
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
    ]
  },
  {
    "id": "krvgd",
    "symbol": "KRVGD",
    "name": "Kervan Gıda (Bebeto)",
    "sector": "Yumuşak Şeker İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 397.22,
    "currency": "₺",
    "dailyChange": -1.8,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "7 Mr ₺",
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
    ]
  },
  {
    "id": "ktlev",
    "symbol": "KTLEV",
    "name": "Katılımevim Tasarruf Finansman",
    "sector": "Tasarruf Finansmanı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 405.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "15 Mr ₺",
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
    ]
  },
  {
    "id": "ktskr",
    "symbol": "KTSKR",
    "name": "Kütahya Şeker Fabrikası",
    "sector": "Şeker Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 414.39,
    "currency": "₺",
    "dailyChange": -0.1,
    "peRatio": 7.7,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "24 Mr ₺",
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
    ]
  },
  {
    "id": "kutpo",
    "symbol": "KUTPO",
    "name": "Kütahya Porselen Sanayi",
    "sector": "Porselen Ev & Sofra Eşyası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 418.43,
    "currency": "₺",
    "dailyChange": 0.3,
    "peRatio": 11.7,
    "pbRatio": 1.1,
    "dividendYield": 2.8,
    "marketCap": "28 Mr ₺",
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
    ]
  },
  {
    "id": "kzbgy",
    "symbol": "KZBGY",
    "name": "Kızılbük GYO",
    "sector": "Termal Turizm & Gayrimenkul",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 406.31,
    "currency": "₺",
    "dailyChange": -0.9,
    "peRatio": 17.7,
    "pbRatio": 3.9,
    "dividendYield": 1.6,
    "marketCap": "16 Mr ₺",
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
    ]
  },
  {
    "id": "kzgyo",
    "symbol": "KZGYO",
    "name": "Kuzugrup GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 419.44,
    "currency": "₺",
    "dailyChange": 0.4,
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
    ]
  },
  {
    "id": "lider",
    "symbol": "LIDER",
    "name": "Lider Filo Oto Kiralama",
    "sector": "Filo Kiralama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "lilak",
    "symbol": "LILAK",
    "name": "Lila Kağıt (Sofia & Maylo)",
    "sector": "Temizlik Kağıtları İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 380.05,
    "currency": "₺",
    "dailyChange": -3.5,
    "peRatio": 9.7,
    "pbRatio": 1.3,
    "dividendYield": 6.5,
    "marketCap": "370 Mr ₺",
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
    ]
  },
  {
    "id": "link",
    "symbol": "LINK",
    "name": "Link Bilgisayar Sistemleri",
    "sector": "Muhasebe & ERP Yazılımları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 317.32,
    "currency": "₺",
    "dailyChange": -0.8,
    "peRatio": 18.7,
    "pbRatio": 3,
    "dividendYield": 0.2,
    "marketCap": "307 Mr ₺",
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
    ]
  },
  {
    "id": "lkmnh",
    "symbol": "LKMNH",
    "name": "Lokman Hekim Engürüsağ",
    "sector": "Özel Hastaneler & Sağlık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 393.18,
    "currency": "₺",
    "dailyChange": -2.2,
    "peRatio": 4.7,
    "pbRatio": 2.6,
    "dividendYield": 0.3,
    "marketCap": "383 Mr ₺",
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
    ]
  },
  {
    "id": "lmkdc",
    "symbol": "LMKDC",
    "name": "Limak Doğu Anadolu Çimento",
    "sector": "Çimento & Yapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 378.03,
    "currency": "₺",
    "dailyChange": -3.7,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "368 Mr ₺",
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
    ]
  },
  {
    "id": "logo",
    "symbol": "LOGO",
    "name": "Logo Yazılım Sanayi",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 320.35,
    "currency": "₺",
    "dailyChange": -0.5,
    "peRatio": 21.7,
    "pbRatio": 3.3,
    "dividendYield": 0.5,
    "marketCap": "310 Mr ₺",
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
    ]
  },
  {
    "id": "macko",
    "symbol": "MACKO",
    "name": "Mackolik İnternet Hizmetleri",
    "sector": "Dijital Spor Medyası & Reklam",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 378.03,
    "currency": "₺",
    "dailyChange": -3.7,
    "peRatio": 7.7,
    "pbRatio": 1.1,
    "dividendYield": 6.3,
    "marketCap": "368 Mr ₺",
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
    ]
  },
  {
    "id": "magen",
    "symbol": "MAGEN",
    "name": "Margün Enerji Üretim",
    "sector": "Güneş Enerjisi Santralleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 375,
    "currency": "₺",
    "dailyChange": -4,
    "peRatio": 4.7,
    "pbRatio": 0.8,
    "dividendYield": 6,
    "marketCap": "365 Mr ₺",
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
    ]
  },
  {
    "id": "makim",
    "symbol": "MAKIM",
    "name": "Makim Makine Teknolojileri",
    "sector": "Hassas Döküm & Turnike",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 382.07,
    "currency": "₺",
    "dailyChange": -3.3,
    "peRatio": 11.7,
    "pbRatio": 1.5,
    "dividendYield": 6.7,
    "marketCap": "372 Mr ₺",
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
    ]
  },
  {
    "id": "maktk",
    "symbol": "MAKTK",
    "name": "Makina Takım Endüstrisi",
    "sector": "Kesici Takımlar & Matkap Uçları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 391.16,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "381 Mr ₺",
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
    ]
  },
  {
    "id": "manas",
    "symbol": "MANAS",
    "name": "Manas Enerji Yönetimi",
    "sector": "Akıllı Sayaç Sistemleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "marbl",
    "symbol": "MARBL",
    "name": "Tureks Turunç Madencilik (Marble)",
    "sector": "Doğaltaş & Mermer İhracatı",
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
    ]
  },
  {
    "id": "mavi",
    "symbol": "MAVI",
    "name": "Mavi Giyim Sanayi",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 316.31,
    "currency": "₺",
    "dailyChange": -0.9,
    "peRatio": 17.7,
    "pbRatio": 2.9,
    "dividendYield": 0.1,
    "marketCap": "306 Mr ₺",
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
    ]
  },
  {
    "id": "medtr",
    "symbol": "MEDTR",
    "name": "Meditera Tıbbi Malzeme",
    "sector": "Tıbbi Cihaz & Solunum Setleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "mekag",
    "symbol": "MEKAG",
    "name": "Meka Beton Santralleri",
    "sector": "Beton Santralleri & Kırma Eleme",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 372.87,
    "currency": "₺",
    "dailyChange": 4.7,
    "peRatio": 19.7,
    "pbRatio": 4.5,
    "dividendYield": 5.7,
    "marketCap": "362 Mr ₺",
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
    ]
  },
  {
    "id": "mgros",
    "symbol": "MGROS",
    "name": "Migros Ticaret A.Ş.",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 407.32,
    "currency": "₺",
    "dailyChange": -0.8,
    "peRatio": 18.7,
    "pbRatio": 4,
    "dividendYield": 1.7,
    "marketCap": "17 Mr ₺",
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
    ]
  },
  {
    "id": "miatk",
    "symbol": "MIATK",
    "name": "Mia Teknoloji A.Ş.",
    "sector": "Savunma & Yüksek Teknoloji",
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
    ]
  },
  {
    "id": "mogan",
    "symbol": "MOGAN",
    "name": "Mogan Enerji Yatırım",
    "sector": "Rüzgar & Jeotermal Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 385.1,
    "currency": "₺",
    "dailyChange": -3,
    "peRatio": 14.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "375 Mr ₺",
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
    ]
  },
  {
    "id": "mpark",
    "symbol": "MPARK",
    "name": "MLP Sağlık (Medical Park)",
    "sector": "Sağlık & Hastane",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "mtrks",
    "symbol": "MTRKS",
    "name": "Matriks Bilgi Dağıtım Hizmetleri",
    "sector": "Finansal Veri Terminali & Fintek",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 416.41,
    "currency": "₺",
    "dailyChange": 0.1,
    "peRatio": 9.7,
    "pbRatio": 0.9,
    "dividendYield": 2.6,
    "marketCap": "26 Mr ₺",
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
    ]
  },
  {
    "id": "naten",
    "symbol": "NATEN",
    "name": "Naturel Yenilenebilir Enerji",
    "sector": "Güneş Enerjisi Santralleri",
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
    ]
  },
  {
    "id": "netas",
    "symbol": "NETAS",
    "name": "Netaş Telekomünikasyon",
    "sector": "Telekom Altyapısı & Bilişim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "nthol",
    "symbol": "NTHOL",
    "name": "Net Holding",
    "sector": "Turizm & Otelcilik / Casino",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 404.29,
    "currency": "₺",
    "dailyChange": -1.1,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "14 Mr ₺",
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
    ]
  },
  {
    "id": "nuhcm",
    "symbol": "NUHCM",
    "name": "Nuh Çimento Sanayi",
    "sector": "Çimento & Klinker İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 394.19,
    "currency": "₺",
    "dailyChange": -2.1,
    "peRatio": 5.7,
    "pbRatio": 2.7,
    "dividendYield": 0.4,
    "marketCap": "384 Mr ₺",
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
    ]
  },
  {
    "id": "obase",
    "symbol": "OBASE",
    "name": "Obase Bilgisayar ve Danışmanlık",
    "sector": "Perakende Çözümleri & İş Zekası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 377.02,
    "currency": "₺",
    "dailyChange": -3.8,
    "peRatio": 6.7,
    "pbRatio": 1,
    "dividendYield": 6.2,
    "marketCap": "367 Mr ₺",
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
    ]
  },
  {
    "id": "odas",
    "symbol": "ODAS",
    "name": "Odaş Elektrik Üretim",
    "sector": "Enerji & Madencilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 310.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 2.3,
    "dividendYield": 7,
    "marketCap": "300 Mr ₺",
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
    ]
  },
  {
    "id": "ofsym",
    "symbol": "OFSYM",
    "name": "Ofis Yem Gıda Sanayi",
    "sector": "Karma Yem Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 413.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "23 Mr ₺",
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
    ]
  },
  {
    "id": "oncsm",
    "symbol": "ONCSM",
    "name": "Oncosem Onkolojik Sistemler",
    "sector": "Kanser İlaç Hazırlama Robotları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "orge",
    "symbol": "ORGE",
    "name": "Orge Enerji Elektrik Taahhüt",
    "sector": "Raylı Sistemler & Elektrik Taahhüt",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 316.31,
    "currency": "₺",
    "dailyChange": -0.9,
    "peRatio": 17.7,
    "pbRatio": 2.9,
    "dividendYield": 0.1,
    "marketCap": "306 Mr ₺",
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
    ]
  },
  {
    "id": "osmen",
    "symbol": "OSMEN",
    "name": "Osmanlı Yatırım Menkul",
    "sector": "Aracı Kurum & Portföy",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "otkar",
    "symbol": "OTKAR",
    "name": "Otokar Otomotiv ve Savunma",
    "sector": "Otomotiv & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 400.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "10 Mr ₺",
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
    ]
  },
  {
    "id": "oyakc",
    "symbol": "OYAKC",
    "name": "Oyak Çimento Fabrikaları",
    "sector": "Çimento & Yapı Malzemeleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "ozkgy",
    "symbol": "OZKGY",
    "name": "Özak GYO",
    "sector": "Gayrimenkul & Turizm (Ela Excellence)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 419.44,
    "currency": "₺",
    "dailyChange": 0.4,
    "peRatio": 12.7,
    "pbRatio": 1.2,
    "dividendYield": 2.9,
    "marketCap": "29 Mr ₺",
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
    ]
  },
  {
    "id": "papil",
    "symbol": "PAPIL",
    "name": "Papilon Savunma Güvenlik",
    "sector": "Biyometrik Parmak İzi & Balistik",
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
    ]
  },
  {
    "id": "parsn",
    "symbol": "PARSN",
    "name": "Parsan Makina Parçaları",
    "sector": "Ağır Dövme Çelik & Aks Parçaları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 403.28,
    "currency": "₺",
    "dailyChange": -1.2,
    "peRatio": 14.7,
    "pbRatio": 3.6,
    "dividendYield": 1.3,
    "marketCap": "13 Mr ₺",
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
    ]
  },
  {
    "id": "paseu",
    "symbol": "PASEU",
    "name": "Pasifik Eurasia Lojistik",
    "sector": "Demiryolu Taşımacılığı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 397.22,
    "currency": "₺",
    "dailyChange": -1.8,
    "peRatio": 8.7,
    "pbRatio": 3,
    "dividendYield": 0.7,
    "marketCap": "7 Mr ₺",
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
    ]
  },
  {
    "id": "pcilt",
    "symbol": "PCILT",
    "name": "PC İletişim Medya",
    "sector": "Medya Planlama & Reklam",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "pekgy",
    "symbol": "PEKGY",
    "name": "Peker GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "penta",
    "symbol": "PENTA",
    "name": "Penta Teknoloji Ürünleri",
    "sector": "Bilişim Donanım Dağıtıcısı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 391.16,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "381 Mr ₺",
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
    ]
  },
  {
    "id": "petkm",
    "symbol": "PETKM",
    "name": "Petkim Petrokimya Holding",
    "sector": "Kimya & Petrokimya",
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
    ]
  },
  {
    "id": "petun",
    "symbol": "PETUN",
    "name": "Pınar Et ve Un Sanayi",
    "sector": "Et & Şarküteri Ürünleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 411.36,
    "currency": "₺",
    "dailyChange": -0.4,
    "peRatio": 4.7,
    "pbRatio": 4.4,
    "dividendYield": 2.1,
    "marketCap": "21 Mr ₺",
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
    ]
  },
  {
    "id": "pgsus",
    "symbol": "PGSUS",
    "name": "Pegasus Hava Taşımacılığı",
    "sector": "Havacılık & Ulaştırma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 417.42,
    "currency": "₺",
    "dailyChange": 0.2,
    "peRatio": 10.7,
    "pbRatio": 1,
    "dividendYield": 2.7,
    "marketCap": "27 Mr ₺",
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
    ]
  },
  {
    "id": "pnsut",
    "symbol": "PNSUT",
    "name": "Pınar Süt Mamülleri",
    "sector": "Süt & Mandıra Ürünleri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 425.5,
    "currency": "₺",
    "dailyChange": 1,
    "peRatio": 18.7,
    "pbRatio": 1.8,
    "dividendYield": 3.5,
    "marketCap": "35 Mr ₺",
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
    ]
  },
  {
    "id": "polho",
    "symbol": "POLHO",
    "name": "Polisan Holding",
    "sector": "Kimya, Boya & Liman",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "poltk",
    "symbol": "POLTK",
    "name": "Politeknik Metal Sanayi",
    "sector": "Alüminyum Yüzey İşlem Kimyasalları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 409.34,
    "currency": "₺",
    "dailyChange": -0.6,
    "peRatio": 20.7,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "19 Mr ₺",
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
    ]
  },
  {
    "id": "prkab",
    "symbol": "PRKAB",
    "name": "Türk Prysmian Kablo",
    "sector": "Enerji & Telekom Kabloları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 383.08,
    "currency": "₺",
    "dailyChange": -3.2,
    "peRatio": 12.7,
    "pbRatio": 1.6,
    "dividendYield": 6.8,
    "marketCap": "373 Mr ₺",
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
    ]
  },
  {
    "id": "prkme",
    "symbol": "PRKME",
    "name": "Park Elektrik Üretim Madencilik",
    "sector": "Madencilik & Enerji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "psgyo",
    "symbol": "PSGYO",
    "name": "Pasifik GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (Next Level)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 417.42,
    "currency": "₺",
    "dailyChange": 0.2,
    "peRatio": 10.7,
    "pbRatio": 1,
    "dividendYield": 2.7,
    "marketCap": "27 Mr ₺",
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
    ]
  },
  {
    "id": "quagr",
    "symbol": "QUAGR",
    "name": "Qua Granite Hayal Yapı",
    "sector": "Granit & Seramik Kaplama",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "ralyh",
    "symbol": "RALYH",
    "name": "Ral Yatırım Holding",
    "sector": "İnşaat, Enerji & Eğitim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 399.24,
    "currency": "₺",
    "dailyChange": -1.6,
    "peRatio": 10.7,
    "pbRatio": 3.2,
    "dividendYield": 0.9,
    "marketCap": "9 Mr ₺",
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
    ]
  },
  {
    "id": "raysg",
    "symbol": "RAYSG",
    "name": "Ray Sigorta",
    "sector": "Elementer Sigortacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 405.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "15 Mr ₺",
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
    ]
  },
  {
    "id": "reedr",
    "symbol": "REEDR",
    "name": "Reeder Teknoloji",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 385.1,
    "currency": "₺",
    "dailyChange": -3,
    "peRatio": 14.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "375 Mr ₺",
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
    ]
  },
  {
    "id": "rnpol",
    "symbol": "RNPOL",
    "name": "Rainbow Polikarbonat",
    "sector": "Polikarbonat Levha Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 410.35,
    "currency": "₺",
    "dailyChange": -0.5,
    "peRatio": 21.7,
    "pbRatio": 4.3,
    "dividendYield": 2,
    "marketCap": "20 Mr ₺",
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
    ]
  },
  {
    "id": "rysas",
    "symbol": "RYSAS",
    "name": "Reysaş Taşımacılık Lojistik",
    "sector": "Depoculuk & Lojistik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 417.42,
    "currency": "₺",
    "dailyChange": 0.2,
    "peRatio": 10.7,
    "pbRatio": 1,
    "dividendYield": 2.7,
    "marketCap": "27 Mr ₺",
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
    ]
  },
  {
    "id": "safkr",
    "symbol": "SAFKR",
    "name": "Safkar Ege Soğutmacılık",
    "sector": "Mobil İklimlendirme & Soğutma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "sahol",
    "symbol": "SAHOL",
    "name": "Hacı Ömer Sabancı Holding",
    "sector": "Holding & Yatırım",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 390.15,
    "currency": "₺",
    "dailyChange": -2.5,
    "peRatio": 19.7,
    "pbRatio": 2.3,
    "dividendYield": 0,
    "marketCap": "380 Mr ₺",
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
    ]
  },
  {
    "id": "sarky",
    "symbol": "SARKY",
    "name": "Sarkuysan Elektrolitik Bakır",
    "sector": "Bakır Tel & Boru İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 409.34,
    "currency": "₺",
    "dailyChange": -0.6,
    "peRatio": 20.7,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "19 Mr ₺",
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
    ]
  },
  {
    "id": "sasa",
    "symbol": "SASA",
    "name": "SASA Polyester Sanayi",
    "sector": "Kimya & Petrokimya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 311.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 2.4,
    "dividendYield": 7.1,
    "marketCap": "301 Mr ₺",
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
    ]
  },
  {
    "id": "sayas",
    "symbol": "SAYAS",
    "name": "Say Yenilenebilir Enerji",
    "sector": "Rüzgar Türbini İç Aksamları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 400.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "10 Mr ₺",
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
    ]
  },
  {
    "id": "sdttr",
    "symbol": "SDTTR",
    "name": "SDT Uzay ve Savunma",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 416.41,
    "currency": "₺",
    "dailyChange": 0.1,
    "peRatio": 9.7,
    "pbRatio": 0.9,
    "dividendYield": 2.6,
    "marketCap": "26 Mr ₺",
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
    ]
  },
  {
    "id": "selec",
    "symbol": "SELEC",
    "name": "Selçuk Ecza Deposu",
    "sector": "İlaç Dağıtım Depoculuğu",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 379.04,
    "currency": "₺",
    "dailyChange": -3.6,
    "peRatio": 8.7,
    "pbRatio": 1.2,
    "dividendYield": 6.4,
    "marketCap": "369 Mr ₺",
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
    ]
  },
  {
    "id": "silvr",
    "symbol": "SILVR",
    "name": "Silverline Endüstri",
    "sector": "Ankastre Mutfak Cihazları",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 415.4,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 8.7,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "25 Mr ₺",
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
    ]
  },
  {
    "id": "sise",
    "symbol": "SISE",
    "name": "Türkiye Şişe ve Cam Fabrikaları",
    "sector": "Cam & Temel Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 323.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 3.6,
    "dividendYield": 0.8,
    "marketCap": "313 Mr ₺",
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
    ]
  },
  {
    "id": "skbnk",
    "symbol": "SKBNK",
    "name": "Şekerbank T.A.Ş.",
    "sector": "Bankacılık & Tarım Kredileri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 392.17,
    "currency": "₺",
    "dailyChange": -2.3,
    "peRatio": 21.7,
    "pbRatio": 2.5,
    "dividendYield": 0.2,
    "marketCap": "382 Mr ₺",
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
    ]
  },
  {
    "id": "smrtg",
    "symbol": "SMRTG",
    "name": "Smart Güneş Enerjisi Teknolojileri",
    "sector": "Güneş Paneli & EPC",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 412.37,
    "currency": "₺",
    "dailyChange": -0.3,
    "peRatio": 5.7,
    "pbRatio": 4.5,
    "dividendYield": 2.2,
    "marketCap": "22 Mr ₺",
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
    ]
  },
  {
    "id": "sngyo",
    "symbol": "SNGYO",
    "name": "Sinpaş GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 415.4,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 8.7,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "25 Mr ₺",
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
    ]
  },
  {
    "id": "sokm",
    "symbol": "SOKM",
    "name": "Şok Marketler Ticaret",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 329.44,
    "currency": "₺",
    "dailyChange": 0.4,
    "peRatio": 12.7,
    "pbRatio": 4.2,
    "dividendYield": 1.4,
    "marketCap": "319 Mr ₺",
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
    ]
  },
  {
    "id": "surgy",
    "symbol": "SURGY",
    "name": "Sur Tatil Evleri GYO",
    "sector": "Devremülk & Tatil Köyü GYO",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 425.5,
    "currency": "₺",
    "dailyChange": 1,
    "peRatio": 18.7,
    "pbRatio": 1.8,
    "dividendYield": 3.5,
    "marketCap": "35 Mr ₺",
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
    ]
  },
  {
    "id": "suwen",
    "symbol": "SUWEN",
    "name": "Suwen Tekstil Sanayi",
    "sector": "Kadın İç Giyim & Perakende",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 417.42,
    "currency": "₺",
    "dailyChange": 0.2,
    "peRatio": 10.7,
    "pbRatio": 1,
    "dividendYield": 2.7,
    "marketCap": "27 Mr ₺",
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
    ]
  },
  {
    "id": "tabgd",
    "symbol": "TABGD",
    "name": "TAB Gıda Sanayi (Burger King)",
    "sector": "Perakende & Tüketim",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 369.84,
    "currency": "₺",
    "dailyChange": 4.4,
    "peRatio": 16.7,
    "pbRatio": 4.2,
    "dividendYield": 5.4,
    "marketCap": "359 Mr ₺",
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
    ]
  },
  {
    "id": "tarkm",
    "symbol": "TARKM",
    "name": "Tarkim Bitki Koruma",
    "sector": "Tarım Kimyasalları & Zirai İlaç",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "taten",
    "symbol": "TATEN",
    "name": "Tatl色がp Enerji",
    "sector": "Rüzgar & Hidroelektrik Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "tatgd",
    "symbol": "TATGD",
    "name": "Tat Gıda Sanayi",
    "sector": "Salça, Konserve & Sos Üretimi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 387.12,
    "currency": "₺",
    "dailyChange": -2.8,
    "peRatio": 16.7,
    "pbRatio": 2,
    "dividendYield": 7.2,
    "marketCap": "377 Mr ₺",
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
    ]
  },
  {
    "id": "tavhl",
    "symbol": "TAVHL",
    "name": "TAV Havalimanları Holding",
    "sector": "Havacılık & Ulaştırma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "tcell",
    "symbol": "TCELL",
    "name": "Turkcell İletişim Hizmetleri",
    "sector": "Telekomünikasyon & Dijital",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 387.12,
    "currency": "₺",
    "dailyChange": -2.8,
    "peRatio": 16.7,
    "pbRatio": 2,
    "dividendYield": 7.2,
    "marketCap": "377 Mr ₺",
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
    ]
  },
  {
    "id": "tezol",
    "symbol": "TEZOL",
    "name": "Europap Tezol Kağıt",
    "sector": "Temizlik Kağıtları Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 413.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "23 Mr ₺",
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
    ]
  },
  {
    "id": "thyao",
    "symbol": "THYAO",
    "name": "Türk Hava Yolları A.O.",
    "sector": "Havacılık & Ulaştırma",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 404.29,
    "currency": "₺",
    "dailyChange": -1.1,
    "peRatio": 15.7,
    "pbRatio": 3.7,
    "dividendYield": 1.4,
    "marketCap": "14 Mr ₺",
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
    ]
  },
  {
    "id": "tkfen",
    "symbol": "TKFEN",
    "name": "Tekfen Holding",
    "sector": "Taahhüt, Mühendislik & Gübre (Toros)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 391.16,
    "currency": "₺",
    "dailyChange": -2.4,
    "peRatio": 20.7,
    "pbRatio": 2.4,
    "dividendYield": 0.1,
    "marketCap": "381 Mr ₺",
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
    ]
  },
  {
    "id": "tknsa",
    "symbol": "TKNSA",
    "name": "Teknosa İç ve Dış Ticaret",
    "sector": "Tüketici Elektroniği Perakendesi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 400.25,
    "currency": "₺",
    "dailyChange": -1.5,
    "peRatio": 11.7,
    "pbRatio": 3.3,
    "dividendYield": 1,
    "marketCap": "10 Mr ₺",
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
    ]
  },
  {
    "id": "tlman",
    "symbol": "TLMAN",
    "name": "Trabzon Liman İşletmeciliği",
    "sector": "Liman İşletmeciliği & Lojistik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "tmsn",
    "symbol": "TMSN",
    "name": "Tümosan Motor ve Traktör",
    "sector": "Dizel Motor & Traktör İmalatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 337.52,
    "currency": "₺",
    "dailyChange": 1.2,
    "peRatio": 20.7,
    "pbRatio": 1,
    "dividendYield": 2.2,
    "marketCap": "327 Mr ₺",
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
    ]
  },
  {
    "id": "tnztp",
    "symbol": "TNZTP",
    "name": "Tapdi Oksijen Özel Sağlık (Tınaztepe)",
    "sector": "Özel Hastaneler & Sağlık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 431.56,
    "currency": "₺",
    "dailyChange": 1.6,
    "peRatio": 6.7,
    "pbRatio": 2.4,
    "dividendYield": 4.1,
    "marketCap": "41 Mr ₺",
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
    ]
  },
  {
    "id": "toaso",
    "symbol": "TOASO",
    "name": "Tofaş Türk Otomobil Fabrikası",
    "sector": "Otomotiv & İhracat",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 405.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "15 Mr ₺",
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
    ]
  },
  {
    "id": "trcas",
    "symbol": "TRCAS",
    "name": "Turcas Petrol",
    "sector": "Akaryakıt Dağıtım (Shell Ortaklığı)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 396.21,
    "currency": "₺",
    "dailyChange": -1.9,
    "peRatio": 7.7,
    "pbRatio": 2.9,
    "dividendYield": 0.6,
    "marketCap": "6 Mr ₺",
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
    ]
  },
  {
    "id": "trgyo",
    "symbol": "TRGYO",
    "name": "Torunlar GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (Mall of Istanbul)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 420.45,
    "currency": "₺",
    "dailyChange": 0.5,
    "peRatio": 13.7,
    "pbRatio": 1.3,
    "dividendYield": 3,
    "marketCap": "30 Mr ₺",
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
    ]
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
    "price": 323.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 3.6,
    "dividendYield": 0.8,
    "marketCap": "313 Mr ₺",
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
    ]
  },
  {
    "id": "ttkom",
    "symbol": "TTKOM",
    "name": "Türk Telekomünikasyon",
    "sector": "Telekomünikasyon & Altyapı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 414.39,
    "currency": "₺",
    "dailyChange": -0.1,
    "peRatio": 7.7,
    "pbRatio": 4.7,
    "dividendYield": 2.4,
    "marketCap": "24 Mr ₺",
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
    ]
  },
  {
    "id": "ttrak",
    "symbol": "TTRAK",
    "name": "Türk Traktör ve Ziraat Makineleri",
    "sector": "Otomotiv & Traktör İmalatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 405.3,
    "currency": "₺",
    "dailyChange": -1,
    "peRatio": 16.7,
    "pbRatio": 3.8,
    "dividendYield": 1.5,
    "marketCap": "15 Mr ₺",
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
    ]
  },
  {
    "id": "tuclk",
    "symbol": "TUCLK",
    "name": "Tuğçelik Alüminyum ve Metal",
    "sector": "Otomotiv Parçaları & Alüminyum",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "tukas",
    "symbol": "TUKAS",
    "name": "Tukaş Gıda Sanayi",
    "sector": "Salça & Konserve İhracatı",
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
    ]
  },
  {
    "id": "tuprs",
    "symbol": "TUPRS",
    "name": "Tüpraş Türkiye Petrol Rafinerileri",
    "sector": "Enerji & Rafineri",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 429.54,
    "currency": "₺",
    "dailyChange": 1.4,
    "peRatio": 4.7,
    "pbRatio": 2.2,
    "dividendYield": 3.9,
    "marketCap": "39 Mr ₺",
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
    ]
  },
  {
    "id": "tursg",
    "symbol": "TURSG",
    "name": "Türkiye Sigorta A.Ş.",
    "sector": "Sigorta & Emeklilik",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 420.45,
    "currency": "₺",
    "dailyChange": 0.5,
    "peRatio": 13.7,
    "pbRatio": 1.3,
    "dividendYield": 3,
    "marketCap": "30 Mr ₺",
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
    ]
  },
  {
    "id": "ulker",
    "symbol": "ULKER",
    "name": "Ülker Bisküvi Sanayi",
    "sector": "Gıda & İçecek",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 402.27,
    "currency": "₺",
    "dailyChange": -1.3,
    "peRatio": 13.7,
    "pbRatio": 3.5,
    "dividendYield": 1.2,
    "marketCap": "12 Mr ₺",
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
    ]
  },
  {
    "id": "uluun",
    "symbol": "ULUUN",
    "name": "Ulusoy Un Sanayi",
    "sector": "Un İhracatı & Hububat Ticareti",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 424.49,
    "currency": "₺",
    "dailyChange": 0.9,
    "peRatio": 17.7,
    "pbRatio": 1.7,
    "dividendYield": 3.4,
    "marketCap": "34 Mr ₺",
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
    ]
  },
  {
    "id": "unlu",
    "symbol": "UNLU",
    "name": "Ünlü Yatırım Holding",
    "sector": "Yatırım Bankacılığı & Portföy",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 339.54,
    "currency": "₺",
    "dailyChange": 1.4,
    "peRatio": 4.7,
    "pbRatio": 1.2,
    "dividendYield": 2.4,
    "marketCap": "329 Mr ₺",
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
    ]
  },
  {
    "id": "vakbn",
    "symbol": "VAKBN",
    "name": "Türkiye Vakıflar Bankası",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 385.1,
    "currency": "₺",
    "dailyChange": -3,
    "peRatio": 14.7,
    "pbRatio": 1.8,
    "dividendYield": 7,
    "marketCap": "375 Mr ₺",
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
    ]
  },
  {
    "id": "vakfn",
    "symbol": "VAKFN",
    "name": "Vakıf Finansal Kiralama",
    "sector": "Finansal Kiralama (Leasing)",
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
    ]
  },
  {
    "id": "vakko",
    "symbol": "VAKKO",
    "name": "Vakko Tekstil ve Hazır Giyim",
    "sector": "Lüks Moda Perakendesi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 395.2,
    "currency": "₺",
    "dailyChange": -2,
    "peRatio": 6.7,
    "pbRatio": 2.8,
    "dividendYield": 0.5,
    "marketCap": "5 Mr ₺",
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
    ]
  },
  {
    "id": "vbtyz",
    "symbol": "VBTYZ",
    "name": "VBT Yazılım A.Ş.",
    "sector": "Savunma & Yüksek Teknoloji",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 430.55,
    "currency": "₺",
    "dailyChange": 1.5,
    "peRatio": 5.7,
    "pbRatio": 2.3,
    "dividendYield": 4,
    "marketCap": "40 Mr ₺",
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
    ]
  },
  {
    "id": "vesbe",
    "symbol": "VESBE",
    "name": "Vestel Beyaz Eşya Sanayi",
    "sector": "Dayanıklı Tüketim & Beyaz Eşya",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 388.13,
    "currency": "₺",
    "dailyChange": -2.7,
    "peRatio": 17.7,
    "pbRatio": 2.1,
    "dividendYield": 7.3,
    "marketCap": "378 Mr ₺",
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
    ]
  },
  {
    "id": "vestl",
    "symbol": "VESTL",
    "name": "Vestel Elektronik Sanayi",
    "sector": "Dayanıklı Tüketim & Sanayi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 413.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "23 Mr ₺",
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
    ]
  },
  {
    "id": "vkgyo",
    "symbol": "VKGYO",
    "name": "Vakıf GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 415.4,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 8.7,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "25 Mr ₺",
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
    ]
  },
  {
    "id": "vrgyo",
    "symbol": "VRGYO",
    "name": "Vera Konsept GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (GYO)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 422.47,
    "currency": "₺",
    "dailyChange": 0.7,
    "peRatio": 15.7,
    "pbRatio": 1.5,
    "dividendYield": 3.2,
    "marketCap": "32 Mr ₺",
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
    ]
  },
  {
    "id": "yatas",
    "symbol": "YATAS",
    "name": "Yataş Yatak ve Yorgan",
    "sector": "Yatak & Ev Mobilyası",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 401.26,
    "currency": "₺",
    "dailyChange": -1.4,
    "peRatio": 12.7,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "11 Mr ₺",
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
    ]
  },
  {
    "id": "yeotk",
    "symbol": "YEOTK",
    "name": "YEO Teknoloji Enerji",
    "sector": "Enerji Otomasyonu & EPC",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 411.36,
    "currency": "₺",
    "dailyChange": -0.4,
    "peRatio": 4.7,
    "pbRatio": 4.4,
    "dividendYield": 2.1,
    "marketCap": "21 Mr ₺",
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
    ]
  },
  {
    "id": "ykbnk",
    "symbol": "YKBNK",
    "name": "Yapı ve Kredi Bankası",
    "sector": "Bankacılık",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 30",
    "price": 398.23,
    "currency": "₺",
    "dailyChange": -1.7,
    "peRatio": 9.7,
    "pbRatio": 3.1,
    "dividendYield": 0.8,
    "marketCap": "8 Mr ₺",
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
    ]
  },
  {
    "id": "yunsa",
    "symbol": "YUNSA",
    "name": "Yünsa Yünlü Sanayi",
    "sector": "Yünlü Kumaş İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 415.4,
    "currency": "₺",
    "dailyChange": 0,
    "peRatio": 8.7,
    "pbRatio": 0.8,
    "dividendYield": 2.5,
    "marketCap": "25 Mr ₺",
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
    ]
  },
  {
    "id": "yylgd",
    "symbol": "YYLGD",
    "name": "Yayla Agro Gıda",
    "sector": "Bakliyat & Hazır Yemek İhracatı",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 408.33,
    "currency": "₺",
    "dailyChange": -0.7,
    "peRatio": 19.7,
    "pbRatio": 4.1,
    "dividendYield": 1.8,
    "marketCap": "18 Mr ₺",
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
    ]
  },
  {
    "id": "zedur",
    "symbol": "ZEDUR",
    "name": "Zedur Enerji Elektrik",
    "sector": "Güneş & Hidroelektrik Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 409.34,
    "currency": "₺",
    "dailyChange": -0.6,
    "peRatio": 20.7,
    "pbRatio": 4.2,
    "dividendYield": 1.9,
    "marketCap": "19 Mr ₺",
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
    ]
  },
  {
    "id": "zoren",
    "symbol": "ZOREN",
    "name": "Zorlu Enerji Elektrik Üretim",
    "sector": "Jeotermal & Rüzgar Enerjisi",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 413.38,
    "currency": "₺",
    "dailyChange": -0.2,
    "peRatio": 6.7,
    "pbRatio": 4.6,
    "dividendYield": 2.3,
    "marketCap": "23 Mr ₺",
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
    ]
  },
  {
    "id": "zrgyo",
    "symbol": "ZRGYO",
    "name": "Ziraat GYO",
    "sector": "Gayrimenkul Yatırım Ortaklığı (İFM)",
    "exchange": "BIST",
    "assetClass": "hisse",
    "indexTag": "BIST 100",
    "price": 426.51,
    "currency": "₺",
    "dailyChange": 1.1,
    "peRatio": 19.7,
    "pbRatio": 1.9,
    "dividendYield": 3.6,
    "marketCap": "36 Mr ₺",
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
    ]
  },
  {
    "id": "aapl",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "sector": "Tüketici Elektroniği & Yazılım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 232.4,
    "currency": "$",
    "dailyChange": 0.85,
    "peRatio": 33.2,
    "pbRatio": 48.5,
    "dividendYield": 0.44,
    "marketCap": "$3.52T",
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
    ]
  },
  {
    "id": "msft",
    "symbol": "MSFT",
    "name": "Microsoft Corporation",
    "sector": "Bulut & Kurumsal Yazılım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 448.6,
    "currency": "$",
    "dailyChange": 1.12,
    "peRatio": 36.4,
    "pbRatio": 12.8,
    "dividendYield": 0.68,
    "marketCap": "$3.33T",
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
    ]
  },
  {
    "id": "nvda",
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "sector": "Yarı İletken & Yapay Zeka",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 138.25,
    "currency": "$",
    "dailyChange": 2.85,
    "peRatio": 48.6,
    "pbRatio": 42.1,
    "dividendYield": 0.03,
    "marketCap": "$3.39T",
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
    ]
  },
  {
    "id": "googl",
    "symbol": "GOOGL",
    "name": "Alphabet Inc. (Google)",
    "sector": "İnternet & Yapay Zeka",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 184.2,
    "currency": "$",
    "dailyChange": -0.45,
    "peRatio": 23.8,
    "pbRatio": 6.8,
    "dividendYield": 0.43,
    "marketCap": "$2.28T",
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
    ]
  },
  {
    "id": "amzn",
    "symbol": "AMZN",
    "name": "Amazon.com Inc.",
    "sector": "E-Ticaret & AWS Bulut",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 198.5,
    "currency": "$",
    "dailyChange": 1.4,
    "peRatio": 41.2,
    "pbRatio": 8.4,
    "dividendYield": 0,
    "marketCap": "$2.06T",
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
    ]
  },
  {
    "id": "meta",
    "symbol": "META",
    "name": "Meta Platforms Inc.",
    "sector": "Sosyal Medya & AI",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 592.4,
    "currency": "$",
    "dailyChange": 2.1,
    "peRatio": 27.5,
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
    ]
  },
  {
    "id": "tsla",
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "sector": "Elektrikli Araç & Enerji",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 248.8,
    "currency": "$",
    "dailyChange": 3.45,
    "peRatio": 72.4,
    "pbRatio": 11.2,
    "dividendYield": 0,
    "marketCap": "$794B",
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
    ]
  },
  {
    "id": "avgo",
    "symbol": "AVGO",
    "name": "Broadcom Inc.",
    "sector": "Yarı İletken & Kurumsal Yazılım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 178.5,
    "currency": "$",
    "dailyChange": 1.75,
    "peRatio": 38.2,
    "pbRatio": 11.4,
    "dividendYield": 1.25,
    "marketCap": "$835B",
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
    ]
  },
  {
    "id": "orcl",
    "symbol": "ORCL",
    "name": "Oracle Corporation",
    "sector": "Veritabanı & Bulut Altyapısı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 174.2,
    "currency": "$",
    "dailyChange": 1.85,
    "peRatio": 32.5,
    "pbRatio": 18.4,
    "dividendYield": 0.92,
    "marketCap": "$480B",
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
    ]
  },
  {
    "id": "crm",
    "symbol": "CRM",
    "name": "Salesforce Inc.",
    "sector": "Müşteri İlişkileri (CRM) & Bulut",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 295.4,
    "currency": "$",
    "dailyChange": 0.65,
    "peRatio": 45.2,
    "pbRatio": 4.8,
    "dividendYield": 0.54,
    "marketCap": "$286B",
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
    ]
  },
  {
    "id": "adbe",
    "symbol": "ADBE",
    "name": "Adobe Inc.",
    "sector": "Yaratıcı Yazılım & Tasarım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 512.8,
    "currency": "$",
    "dailyChange": 0.35,
    "peRatio": 38.4,
    "pbRatio": 12.2,
    "dividendYield": 0,
    "marketCap": "$228B",
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
    ]
  },
  {
    "id": "nflx",
    "symbol": "NFLX",
    "name": "Netflix Inc.",
    "sector": "Yayıncılık & Dijital Medya",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 742.5,
    "currency": "$",
    "dailyChange": 1.55,
    "peRatio": 42.8,
    "pbRatio": 14.6,
    "dividendYield": 0,
    "marketCap": "$318B",
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
    ]
  },
  {
    "id": "amd",
    "symbol": "AMD",
    "name": "Advanced Micro Devices",
    "sector": "Yarı İletken & Mikroişlemci",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 154.2,
    "currency": "$",
    "dailyChange": 2.15,
    "peRatio": 84.5,
    "pbRatio": 4.2,
    "dividendYield": 0,
    "marketCap": "$250B",
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
    ]
  },
  {
    "id": "qcom",
    "symbol": "QCOM",
    "name": "Qualcomm Inc.",
    "sector": "Mobil Çip & Telekom Donanımı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 172.6,
    "currency": "$",
    "dailyChange": 0.95,
    "peRatio": 21.4,
    "pbRatio": 7.2,
    "dividendYield": 1.97,
    "marketCap": "$192B",
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
    ]
  },
  {
    "id": "intc",
    "symbol": "INTC",
    "name": "Intel Corporation",
    "sector": "Yarı İletken & Dökümhane",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 24.5,
    "currency": "$",
    "dailyChange": -1.2,
    "peRatio": 45,
    "pbRatio": 0.92,
    "dividendYield": 2.05,
    "marketCap": "$105B",
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
    ]
  },
  {
    "id": "pltr",
    "symbol": "PLTR",
    "name": "Palantir Technologies",
    "sector": "Büyük Veri & Savunma Yapay Zekası",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 43.8,
    "currency": "$",
    "dailyChange": 4.1,
    "peRatio": 98,
    "pbRatio": 22.5,
    "dividendYield": 0,
    "marketCap": "$98B",
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
    ]
  },
  {
    "id": "uber",
    "symbol": "UBER",
    "name": "Uber Technologies Inc.",
    "sector": "Ulaşım Ağı & Teslimat",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 78.4,
    "currency": "$",
    "dailyChange": 1.25,
    "peRatio": 35.6,
    "pbRatio": 8.5,
    "dividendYield": 0,
    "marketCap": "$164B",
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
    ]
  },
  {
    "id": "abnb",
    "symbol": "ABNB",
    "name": "Airbnb Inc.",
    "sector": "Konaklama & Seyahat Platformu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 134.5,
    "currency": "$",
    "dailyChange": 0.7,
    "peRatio": 18.2,
    "pbRatio": 9.8,
    "dividendYield": 0,
    "marketCap": "$85B",
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
    ]
  },
  {
    "id": "now",
    "symbol": "NOW",
    "name": "ServiceNow Inc.",
    "sector": "Kurumsal İş Akışı Yazılımı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 924,
    "currency": "$",
    "dailyChange": 1.3,
    "peRatio": 62.4,
    "pbRatio": 18.5,
    "dividendYield": 0,
    "marketCap": "$190B",
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
    ]
  },
  {
    "id": "intu",
    "symbol": "INTU",
    "name": "Intuit Inc.",
    "sector": "Finansal Yazılım & Vergi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 648.5,
    "currency": "$",
    "dailyChange": 0.45,
    "peRatio": 58.2,
    "pbRatio": 9.6,
    "dividendYield": 0.65,
    "marketCap": "$182B",
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
    ]
  },
  {
    "id": "panw",
    "symbol": "PANW",
    "name": "Palo Alto Networks",
    "sector": "Siber Güvenlik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 368.2,
    "currency": "$",
    "dailyChange": 1.8,
    "peRatio": 46.5,
    "pbRatio": 19.8,
    "dividendYield": 0,
    "marketCap": "$120B",
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
    ]
  },
  {
    "id": "crwd",
    "symbol": "CRWD",
    "name": "CrowdStrike Holdings",
    "sector": "Uç Nokta Siber Güvenlik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 312.4,
    "currency": "$",
    "dailyChange": 2.25,
    "peRatio": 78,
    "pbRatio": 28.5,
    "dividendYield": 0,
    "marketCap": "$76B",
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
    ]
  },
  {
    "id": "snow",
    "symbol": "SNOW",
    "name": "Snowflake Inc.",
    "sector": "Bulut Veri Ambarı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 128.5,
    "currency": "$",
    "dailyChange": 1.1,
    "peRatio": 52,
    "pbRatio": 8.9,
    "dividendYield": 0,
    "marketCap": "$43B",
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
    ]
  },
  {
    "id": "amat",
    "symbol": "AMAT",
    "name": "Applied Materials",
    "sector": "Yarı İletken Ekipmanı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 198.4,
    "currency": "$",
    "dailyChange": 1.65,
    "peRatio": 22.8,
    "pbRatio": 8.4,
    "dividendYield": 0.81,
    "marketCap": "$164B",
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
    ]
  },
  {
    "id": "lrcx",
    "symbol": "LRCX",
    "name": "Lam Research Corporation",
    "sector": "Çip Aşındırma & İmalat",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 78.6,
    "currency": "$",
    "dailyChange": 1.95,
    "peRatio": 24.5,
    "pbRatio": 9.8,
    "dividendYield": 1.15,
    "marketCap": "$102B",
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
    ]
  },
  {
    "id": "mu",
    "symbol": "MU",
    "name": "Micron Technology",
    "sector": "Bellek Çipleri (DRAM & NAND)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 108.5,
    "currency": "$",
    "dailyChange": 2.4,
    "peRatio": 18.2,
    "pbRatio": 2.4,
    "dividendYield": 0.42,
    "marketCap": "$120B",
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
    ]
  },
  {
    "id": "jpm",
    "symbol": "JPM",
    "name": "JPMorgan Chase & Co.",
    "sector": "Yatırım Bankacılığı & Ticari Banka",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 224.5,
    "currency": "$",
    "dailyChange": 0.65,
    "peRatio": 12.4,
    "pbRatio": 1.85,
    "dividendYield": 2.05,
    "marketCap": "$640B",
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
    ]
  },
  {
    "id": "bac",
    "symbol": "BAC",
    "name": "Bank of America Corp.",
    "sector": "Perakende & Ticari Bankacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 42.8,
    "currency": "$",
    "dailyChange": 0.4,
    "peRatio": 13.8,
    "pbRatio": 1.25,
    "dividendYield": 2.43,
    "marketCap": "$334B",
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
    ]
  },
  {
    "id": "gs",
    "symbol": "GS",
    "name": "The Goldman Sachs Group",
    "sector": "Yatırım Bankacılığı & Menkul Değerler",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 528,
    "currency": "$",
    "dailyChange": 1.15,
    "peRatio": 15.2,
    "pbRatio": 1.55,
    "dividendYield": 2.27,
    "marketCap": "$172B",
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
    ]
  },
  {
    "id": "ms",
    "symbol": "MS",
    "name": "Morgan Stanley",
    "sector": "Varlık Yönetimi & Yatırım Bankası",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 118.5,
    "currency": "$",
    "dailyChange": 0.85,
    "peRatio": 17.5,
    "pbRatio": 1.95,
    "dividendYield": 2.87,
    "marketCap": "$192B",
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
    ]
  },
  {
    "id": "v",
    "symbol": "V",
    "name": "Visa Inc.",
    "sector": "Ödeme Teknolojileri & Kart Ağı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 288.4,
    "currency": "$",
    "dailyChange": 0.75,
    "peRatio": 29.8,
    "pbRatio": 14.5,
    "dividendYield": 0.72,
    "marketCap": "$585B",
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
    ]
  },
  {
    "id": "ma",
    "symbol": "MA",
    "name": "Mastercard Incorporated",
    "sector": "Elektronik Ödeme Ağı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 498.2,
    "currency": "$",
    "dailyChange": 0.9,
    "peRatio": 34.2,
    "pbRatio": 52,
    "dividendYield": 0.53,
    "marketCap": "$462B",
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
    ]
  },
  {
    "id": "axp",
    "symbol": "AXP",
    "name": "American Express Company",
    "sector": "Ödeme Kartları & Finans",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 274.6,
    "currency": "$",
    "dailyChange": 1.05,
    "peRatio": 19.5,
    "pbRatio": 6.2,
    "dividendYield": 1.02,
    "marketCap": "$198B",
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
    ]
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
    "price": 985,
    "currency": "$",
    "dailyChange": 1.1,
    "peRatio": 24.8,
    "pbRatio": 3.4,
    "dividendYield": 2.07,
    "marketCap": "$148B",
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
    ]
  },
  {
    "id": "c",
    "symbol": "C",
    "name": "Citigroup Inc.",
    "sector": "Küresel Bankacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 64.2,
    "currency": "$",
    "dailyChange": 0.5,
    "peRatio": 16.5,
    "pbRatio": 0.65,
    "dividendYield": 3.49,
    "marketCap": "$122B",
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
    ]
  },
  {
    "id": "wfc",
    "symbol": "WFC",
    "name": "Wells Fargo & Company",
    "sector": "Ticari Bankacılık & Konut Kredisi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 66.8,
    "currency": "$",
    "dailyChange": 0.7,
    "peRatio": 13.2,
    "pbRatio": 1.35,
    "dividendYield": 2.4,
    "marketCap": "$232B",
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
    ]
  },
  {
    "id": "pnc",
    "symbol": "PNC",
    "name": "PNC Financial Services",
    "sector": "Bölgesel & Kurumsal Bankacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 188.4,
    "currency": "$",
    "dailyChange": 0.45,
    "peRatio": 14.5,
    "pbRatio": 1.52,
    "dividendYield": 3.4,
    "marketCap": "$75B",
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
    ]
  },
  {
    "id": "lly",
    "symbol": "LLY",
    "name": "Eli Lilly and Company",
    "sector": "Biyofarmasötik & Diyabet/Obezite",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 885,
    "currency": "$",
    "dailyChange": 1.45,
    "peRatio": 64.2,
    "pbRatio": 42,
    "dividendYield": 0.59,
    "marketCap": "$840B",
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
    ]
  },
  {
    "id": "unh",
    "symbol": "UNH",
    "name": "UnitedHealth Group",
    "sector": "Sağlık Sigortası & Optum Hizmetleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 588.4,
    "currency": "$",
    "dailyChange": 0.35,
    "peRatio": 28.5,
    "pbRatio": 6.2,
    "dividendYield": 1.43,
    "marketCap": "$542B",
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
    ]
  },
  {
    "id": "jnj",
    "symbol": "JNJ",
    "name": "Johnson & Johnson",
    "sector": "İlaç & Tıbbi Cihaz",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 162.8,
    "currency": "$",
    "dailyChange": 0.2,
    "peRatio": 16.8,
    "pbRatio": 5.2,
    "dividendYield": 3.05,
    "marketCap": "$392B",
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
    ]
  },
  {
    "id": "abbv",
    "symbol": "ABBV",
    "name": "AbbVie Inc.",
    "sector": "Biyoteknoloji & İmmünoloji",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 192.4,
    "currency": "$",
    "dailyChange": 0.6,
    "peRatio": 18.5,
    "pbRatio": 38,
    "dividendYield": 3.22,
    "marketCap": "$340B",
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
    ]
  },
  {
    "id": "mrk",
    "symbol": "MRK",
    "name": "Merck & Co. Inc.",
    "sector": "Onkoloji & Aşılar",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 114.2,
    "currency": "$",
    "dailyChange": -0.15,
    "peRatio": 17.2,
    "pbRatio": 6.8,
    "dividendYield": 2.7,
    "marketCap": "$290B",
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
    ]
  },
  {
    "id": "pfe",
    "symbol": "PFE",
    "name": "Pfizer Inc.",
    "sector": "Biyofarmasötik & Aşı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 28.5,
    "currency": "$",
    "dailyChange": 0.1,
    "peRatio": 14.2,
    "pbRatio": 1.82,
    "dividendYield": 5.89,
    "marketCap": "$162B",
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
    ]
  },
  {
    "id": "tmo",
    "symbol": "TMO",
    "name": "Thermo Fisher Scientific",
    "sector": "Laboratuvar & Yaşam Bilimleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 568,
    "currency": "$",
    "dailyChange": 0.85,
    "peRatio": 32.4,
    "pbRatio": 4.5,
    "dividendYield": 0.28,
    "marketCap": "$218B",
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
    ]
  },
  {
    "id": "abt",
    "symbol": "ABT",
    "name": "Abbott Laboratories",
    "sector": "Tıbbi Cihaz & Tanı Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 116.8,
    "currency": "$",
    "dailyChange": 0.4,
    "peRatio": 26.5,
    "pbRatio": 4.8,
    "dividendYield": 1.88,
    "marketCap": "$204B",
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
    ]
  },
  {
    "id": "dhr",
    "symbol": "DHR",
    "name": "Danaher Corporation",
    "sector": "Biyoteknoloji & Tanı Ekipmanları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 254,
    "currency": "$",
    "dailyChange": 0.6,
    "peRatio": 38,
    "pbRatio": 3.6,
    "dividendYield": 0.42,
    "marketCap": "$188B",
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
    ]
  },
  {
    "id": "isrg",
    "symbol": "ISRG",
    "name": "Intuitive Surgical Inc.",
    "sector": "Robotik Cerrahi Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 495,
    "currency": "$",
    "dailyChange": 1.8,
    "peRatio": 78.5,
    "pbRatio": 11.2,
    "dividendYield": 0,
    "marketCap": "$176B",
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
    ]
  },
  {
    "id": "xom",
    "symbol": "XOM",
    "name": "Exxon Mobil Corporation",
    "sector": "Petrol & Doğalgaz Entegre",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 122.4,
    "currency": "$",
    "dailyChange": 0.75,
    "peRatio": 14.8,
    "pbRatio": 2.15,
    "dividendYield": 3.1,
    "marketCap": "$540B",
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
    ]
  },
  {
    "id": "cvx",
    "symbol": "CVX",
    "name": "Chevron Corporation",
    "sector": "Petrol & Gaz Arama-Üretim",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 154.6,
    "currency": "$",
    "dailyChange": 0.5,
    "peRatio": 14.2,
    "pbRatio": 1.78,
    "dividendYield": 4.22,
    "marketCap": "$286B",
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
    ]
  },
  {
    "id": "cop",
    "symbol": "COP",
    "name": "ConocoPhillips",
    "sector": "Saf Petrol Arama & Üretim",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 112.5,
    "currency": "$",
    "dailyChange": 0.85,
    "peRatio": 12.8,
    "pbRatio": 2.45,
    "dividendYield": 2.78,
    "marketCap": "$132B",
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
    ]
  },
  {
    "id": "slb",
    "symbol": "SLB",
    "name": "SLB (Schlumberger)",
    "sector": "Petrol Sahası Teknolojisi & Sondaj",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 44.2,
    "currency": "$",
    "dailyChange": 1.1,
    "peRatio": 13.5,
    "pbRatio": 2.8,
    "dividendYield": 2.49,
    "marketCap": "$62B",
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
    ]
  },
  {
    "id": "nee",
    "symbol": "NEE",
    "name": "NextEra Energy Inc.",
    "sector": "Yenilenebilir Enerji & Elektrik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 82.5,
    "currency": "$",
    "dailyChange": -0.2,
    "peRatio": 24.5,
    "pbRatio": 3.4,
    "dividendYield": 2.5,
    "marketCap": "$170B",
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
    ]
  },
  {
    "id": "wmt",
    "symbol": "WMT",
    "name": "Walmart Inc.",
    "sector": "Büyük Perakende & Süpermarket",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 82.4,
    "currency": "$",
    "dailyChange": 0.45,
    "peRatio": 32.5,
    "pbRatio": 6.8,
    "dividendYield": 1.01,
    "marketCap": "$662B",
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
    ]
  },
  {
    "id": "cost",
    "symbol": "COST",
    "name": "Costco Wholesale Corp.",
    "sector": "Toptan Perakende & Üyelik Kulübü",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 914,
    "currency": "$",
    "dailyChange": 0.9,
    "peRatio": 54.8,
    "pbRatio": 16.2,
    "dividendYield": 0.51,
    "marketCap": "$405B",
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
    ]
  },
  {
    "id": "pg",
    "symbol": "PG",
    "name": "The Procter & Gamble Co.",
    "sector": "Hızlı Tüketim & Kişisel Bakım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 172.5,
    "currency": "$",
    "dailyChange": 0.15,
    "peRatio": 27.2,
    "pbRatio": 8.5,
    "dividendYield": 2.33,
    "marketCap": "$406B",
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
    ]
  },
  {
    "id": "ko",
    "symbol": "KO",
    "name": "The Coca-Cola Company",
    "sector": "Alkolsüz İçecekler & Meşrubat",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 68.2,
    "currency": "$",
    "dailyChange": 0.3,
    "peRatio": 26.4,
    "pbRatio": 10.8,
    "dividendYield": 2.84,
    "marketCap": "$294B",
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
    ]
  },
  {
    "id": "pep",
    "symbol": "PEP",
    "name": "PepsiCo Inc.",
    "sector": "Atıştırmalık & İçecek",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 174.5,
    "currency": "$",
    "dailyChange": 0.25,
    "peRatio": 24.8,
    "pbRatio": 11.4,
    "dividendYield": 3.1,
    "marketCap": "$240B",
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
    ]
  },
  {
    "id": "mcd",
    "symbol": "MCD",
    "name": "McDonald's Corporation",
    "sector": "Hızlı Servis Restoran Zinciri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 298.4,
    "currency": "$",
    "dailyChange": 0.6,
    "peRatio": 26.2,
    "pbRatio": -45,
    "dividendYield": 2.37,
    "marketCap": "$214B",
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
    ]
  },
  {
    "id": "nke",
    "symbol": "NKE",
    "name": "NIKE Inc.",
    "sector": "Spor Ayakkabı & Giyim",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 82.5,
    "currency": "$",
    "dailyChange": 1.15,
    "peRatio": 23.4,
    "pbRatio": 8.9,
    "dividendYield": 1.8,
    "marketCap": "$124B",
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
    ]
  },
  {
    "id": "sbux",
    "symbol": "SBUX",
    "name": "Starbucks Corporation",
    "sector": "Özel Kahve Zinciri & Perakende",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 98.4,
    "currency": "$",
    "dailyChange": 1.35,
    "peRatio": 28.5,
    "pbRatio": -12.5,
    "dividendYield": 2.48,
    "marketCap": "$112B",
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
    ]
  },
  {
    "id": "hd",
    "symbol": "HD",
    "name": "The Home Depot Inc.",
    "sector": "Ev Geliştirme & Yapı Market",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 412,
    "currency": "$",
    "dailyChange": 0.7,
    "peRatio": 27.5,
    "pbRatio": 42,
    "dividendYield": 2.18,
    "marketCap": "$408B",
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
    ]
  },
  {
    "id": "low",
    "symbol": "LOW",
    "name": "Lowe's Companies Inc.",
    "sector": "Yapı Malzemeleri Perakendesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 268.5,
    "currency": "$",
    "dailyChange": 0.55,
    "peRatio": 22.8,
    "pbRatio": -16,
    "dividendYield": 1.71,
    "marketCap": "$152B",
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
    ]
  },
  {
    "id": "tjx",
    "symbol": "TJX",
    "name": "The TJX Companies Inc.",
    "sector": "İndirimli Marka Giyim Perakendesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 118.4,
    "currency": "$",
    "dailyChange": 0.8,
    "peRatio": 28.4,
    "pbRatio": 18.2,
    "dividendYield": 1.27,
    "marketCap": "$134B",
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
    ]
  },
  {
    "id": "cat",
    "symbol": "CAT",
    "name": "Caterpillar Inc.",
    "sector": "İş & Madencilik Makineleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 398.5,
    "currency": "$",
    "dailyChange": 1.2,
    "peRatio": 18.5,
    "pbRatio": 8.9,
    "dividendYield": 1.42,
    "marketCap": "$192B",
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
    ]
  },
  {
    "id": "ge",
    "symbol": "GE",
    "name": "GE Aerospace",
    "sector": "Havacılık Jet Motorları & Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 192.8,
    "currency": "$",
    "dailyChange": 1.4,
    "peRatio": 38.5,
    "pbRatio": 7.4,
    "dividendYield": 0.58,
    "marketCap": "$208B",
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
    ]
  },
  {
    "id": "ba",
    "symbol": "BA",
    "name": "The Boeing Company",
    "sector": "Ticari Uçak & Savunma Sanayi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 158.4,
    "currency": "$",
    "dailyChange": 2.1,
    "peRatio": -32,
    "pbRatio": -8.5,
    "dividendYield": 0,
    "marketCap": "$98B",
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
    ]
  },
  {
    "id": "rtx",
    "symbol": "RTX",
    "name": "RTX Corporation",
    "sector": "Havacılık & Savunma Teknolojileri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 124.5,
    "currency": "$",
    "dailyChange": 0.75,
    "peRatio": 35.2,
    "pbRatio": 2.6,
    "dividendYield": 2.02,
    "marketCap": "$165B",
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
    ]
  },
  {
    "id": "lmt",
    "symbol": "LMT",
    "name": "Lockheed Martin Corp.",
    "sector": "Savunma Sanayi & Askeri Havacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 574,
    "currency": "$",
    "dailyChange": 0.9,
    "peRatio": 20.8,
    "pbRatio": 21,
    "dividendYield": 2.3,
    "marketCap": "$136B",
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
    ]
  },
  {
    "id": "hon",
    "symbol": "HON",
    "name": "Honeywell International",
    "sector": "Endüstriyel Otomasyon & Havacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 216.5,
    "currency": "$",
    "dailyChange": 0.35,
    "peRatio": 24.5,
    "pbRatio": 8.5,
    "dividendYield": 2.08,
    "marketCap": "$140B",
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
    ]
  },
  {
    "id": "unp",
    "symbol": "UNP",
    "name": "Union Pacific Corporation",
    "sector": "Demiryolu Taşımacılığı & Lojistik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 242,
    "currency": "$",
    "dailyChange": 0.45,
    "peRatio": 22.4,
    "pbRatio": 8.9,
    "dividendYield": 2.15,
    "marketCap": "$146B",
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
    ]
  },
  {
    "id": "ups",
    "symbol": "UPS",
    "name": "United Parcel Service",
    "sector": "Küresel Kargo & Tedarik Zinciri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 134.8,
    "currency": "$",
    "dailyChange": 0.6,
    "peRatio": 19.5,
    "pbRatio": 6.8,
    "dividendYield": 4.84,
    "marketCap": "$114B",
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
    ]
  },
  {
    "id": "de",
    "symbol": "DE",
    "name": "Deere & Company",
    "sector": "Tarım & Ormancılık Makineleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 412.5,
    "currency": "$",
    "dailyChange": 1.1,
    "peRatio": 16.8,
    "pbRatio": 4.8,
    "dividendYield": 1.43,
    "marketCap": "$114B",
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
    ]
  },
  {
    "id": "dis",
    "symbol": "DIS",
    "name": "The Walt Disney Company",
    "sector": "Medya & Eğlence Parkları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 96.5,
    "currency": "$",
    "dailyChange": 0.85,
    "peRatio": 21.5,
    "pbRatio": 1.75,
    "dividendYield": 0.93,
    "marketCap": "$175B",
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
    ]
  },
  {
    "id": "cmcsa",
    "symbol": "CMCSA",
    "name": "Comcast Corporation",
    "sector": "Kablo, Genişbant & Universal Stüdyo",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 42.8,
    "currency": "$",
    "dailyChange": 0.3,
    "peRatio": 11.2,
    "pbRatio": 1.95,
    "dividendYield": 2.9,
    "marketCap": "$165B",
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
    ]
  },
  {
    "id": "t",
    "symbol": "T",
    "name": "AT&T Inc.",
    "sector": "5G Mobil İletişim & Fiber Ağ",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 22.4,
    "currency": "$",
    "dailyChange": 0.45,
    "peRatio": 11.8,
    "pbRatio": 1.35,
    "dividendYield": 4.95,
    "marketCap": "$160B",
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
    ]
  },
  {
    "id": "vz",
    "symbol": "VZ",
    "name": "Verizon Communications",
    "sector": "Kablosuz Telekomünikasyon",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "Dow Jones",
    "price": 44.5,
    "currency": "$",
    "dailyChange": 0.2,
    "peRatio": 15.4,
    "pbRatio": 1.9,
    "dividendYield": 6.08,
    "marketCap": "$187B",
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
    ]
  },
  {
    "id": "txn",
    "symbol": "TXN",
    "name": "Texas Instruments",
    "sector": "Analog Çipler",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 205.4,
    "currency": "$",
    "dailyChange": -2.33,
    "peRatio": 32.5,
    "pbRatio": 11.2,
    "dividendYield": 2.65,
    "marketCap": "$186B",
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
    ]
  },
  {
    "id": "klac",
    "symbol": "KLAC",
    "name": "KLA Corporation",
    "sector": "Yarı İletken Süreç Kontrolü",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 742,
    "currency": "$",
    "dailyChange": 1.38,
    "peRatio": 28.4,
    "pbRatio": 28.5,
    "dividendYield": 0.92,
    "marketCap": "$99B",
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
    ]
  },
  {
    "id": "cdns",
    "symbol": "CDNS",
    "name": "Cadence Design Systems",
    "sector": "Elektronik Tasarım Otomasyonu (EDA)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 288.5,
    "currency": "$",
    "dailyChange": -1.26,
    "peRatio": 64,
    "pbRatio": 18.2,
    "dividendYield": 0,
    "marketCap": "$78B",
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
    ]
  },
  {
    "id": "snps",
    "symbol": "SNPS",
    "name": "Synopsys Inc.",
    "sector": "Silikon Tasarım Yazılımı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 524,
    "currency": "$",
    "dailyChange": 1.5,
    "peRatio": 58.5,
    "pbRatio": 12.4,
    "dividendYield": 0,
    "marketCap": "$80B",
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
    ]
  },
  {
    "id": "mrvl",
    "symbol": "MRVL",
    "name": "Marvell Technology",
    "sector": "Veri Merkezi Çipleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 88.5,
    "currency": "$",
    "dailyChange": 1.28,
    "peRatio": 48,
    "pbRatio": 4.8,
    "dividendYield": 0.27,
    "marketCap": "$76B",
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
    ]
  },
  {
    "id": "anet",
    "symbol": "ANET",
    "name": "Arista Networks",
    "sector": "Bulut Ağ Ekipmanları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 388,
    "currency": "$",
    "dailyChange": -2.5,
    "peRatio": 44.5,
    "pbRatio": 12.8,
    "dividendYield": 0,
    "marketCap": "$122B",
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
    ]
  },
  {
    "id": "mchp",
    "symbol": "MCHP",
    "name": "Microchip Technology",
    "sector": "Mikrodenetleyiciler",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 78.4,
    "currency": "$",
    "dailyChange": 0.35,
    "peRatio": 22,
    "pbRatio": 6.5,
    "dividendYield": 2.3,
    "marketCap": "$42B",
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
    ]
  },
  {
    "id": "on",
    "symbol": "ON",
    "name": "ON Semiconductor",
    "sector": "Güç Yarı İletkenleri (SiC)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 72.5,
    "currency": "$",
    "dailyChange": -0.6,
    "peRatio": 16.5,
    "pbRatio": 3.8,
    "dividendYield": 0,
    "marketCap": "$31B",
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
    ]
  },
  {
    "id": "adi",
    "symbol": "ADI",
    "name": "Analog Devices Inc.",
    "sector": "Sinyal İşleme Entegreleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 228,
    "currency": "$",
    "dailyChange": 2.43,
    "peRatio": 34,
    "pbRatio": 3.2,
    "dividendYield": 1.62,
    "marketCap": "$113B",
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
    ]
  },
  {
    "id": "ftnt",
    "symbol": "FTNT",
    "name": "Fortinet Inc.",
    "sector": "Ağ Güvenliği & FortiGate",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 82.4,
    "currency": "$",
    "dailyChange": 1.65,
    "peRatio": 42,
    "pbRatio": 14.5,
    "dividendYield": 0,
    "marketCap": "$63B",
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
    ]
  },
  {
    "id": "wday",
    "symbol": "WDAY",
    "name": "Workday Inc.",
    "sector": "İnsan Kaynakları & Finans Bulutu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 264,
    "currency": "$",
    "dailyChange": 0.27,
    "peRatio": 48.5,
    "pbRatio": 9.2,
    "dividendYield": 0,
    "marketCap": "$70B",
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
    ]
  },
  {
    "id": "team",
    "symbol": "TEAM",
    "name": "Atlassian Corporation",
    "sector": "Yazılım Geliştirme Araçları (Jira)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 212,
    "currency": "$",
    "dailyChange": -2.5,
    "peRatio": 54,
    "pbRatio": 24,
    "dividendYield": 0,
    "marketCap": "$55B",
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
    ]
  },
  {
    "id": "ddog",
    "symbol": "DDOG",
    "name": "Datadog Inc.",
    "sector": "Bulut İzleme & Güvenlik Analitiği",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 132,
    "currency": "$",
    "dailyChange": 0.13,
    "peRatio": 72,
    "pbRatio": 14.2,
    "dividendYield": 0,
    "marketCap": "$44B",
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
    ]
  },
  {
    "id": "mdb",
    "symbol": "MDB",
    "name": "MongoDB Inc.",
    "sector": "Doküman Veritabanı Platformu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 284,
    "currency": "$",
    "dailyChange": 2.38,
    "peRatio": 85,
    "pbRatio": 18,
    "dividendYield": 0,
    "marketCap": "$21B",
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
    ]
  },
  {
    "id": "coin",
    "symbol": "COIN",
    "name": "Coinbase Global Inc.",
    "sector": "Kripto Varlık Borsası & Saklama",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 218,
    "currency": "$",
    "dailyChange": -2.36,
    "peRatio": 38,
    "pbRatio": 5.4,
    "dividendYield": 0,
    "marketCap": "$54B",
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
    ]
  },
  {
    "id": "pypl",
    "symbol": "PYPL",
    "name": "PayPal Holdings Inc.",
    "sector": "Dijital Cüzdan & Ödeme",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 78.5,
    "currency": "$",
    "dailyChange": 0.1,
    "peRatio": 18.2,
    "pbRatio": 3.8,
    "dividendYield": 0,
    "marketCap": "$80B",
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
    ]
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
    "price": 512,
    "currency": "$",
    "dailyChange": 0.2,
    "peRatio": 38.5,
    "pbRatio": 5.2,
    "dividendYield": 0.72,
    "marketCap": "$158B",
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
    ]
  },
  {
    "id": "mco",
    "symbol": "MCO",
    "name": "Moody's Corporation",
    "sector": "Kredi Notu & Risk Analitiği",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 488,
    "currency": "$",
    "dailyChange": -2.17,
    "peRatio": 42,
    "pbRatio": 24,
    "dividendYield": 0.7,
    "marketCap": "$88B",
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
    ]
  },
  {
    "id": "ice",
    "symbol": "ICE",
    "name": "Intercontinental Exchange",
    "sector": "Borsa İşleticisi (NYSE)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 164,
    "currency": "$",
    "dailyChange": 1.49,
    "peRatio": 32,
    "pbRatio": 3.4,
    "dividendYield": 1.1,
    "marketCap": "$94B",
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
    ]
  },
  {
    "id": "cme",
    "symbol": "CME",
    "name": "CME Group Inc.",
    "sector": "Türev & Vadeli İşlemler Borsası",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 228,
    "currency": "$",
    "dailyChange": 2.43,
    "peRatio": 24.5,
    "pbRatio": 3,
    "dividendYield": 4.25,
    "marketCap": "$82B",
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
    ]
  },
  {
    "id": "schw",
    "symbol": "SCHW",
    "name": "The Charles Schwab Corp.",
    "sector": "Yatırım Aracılığı & Varlık Yönetimi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 76.5,
    "currency": "$",
    "dailyChange": 2.23,
    "peRatio": 26,
    "pbRatio": 3.8,
    "dividendYield": 1.3,
    "marketCap": "$138B",
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
    ]
  },
  {
    "id": "cvs",
    "symbol": "CVS",
    "name": "CVS Health Corporation",
    "sector": "Eczane Perakendesi & Sağlık Sigortası",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 62.4,
    "currency": "$",
    "dailyChange": -1.05,
    "peRatio": 11.5,
    "pbRatio": 1.05,
    "dividendYield": 4.26,
    "marketCap": "$78B",
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
    ]
  },
  {
    "id": "ci",
    "symbol": "CI",
    "name": "The Cigna Group",
    "sector": "Küresel Sağlık Hizmetleri & Sigorta",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 334,
    "currency": "$",
    "dailyChange": 2.09,
    "peRatio": 18,
    "pbRatio": 2.1,
    "dividendYield": 1.68,
    "marketCap": "$94B",
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
    ]
  },
  {
    "id": "elv",
    "symbol": "ELV",
    "name": "Elevance Health Inc.",
    "sector": "Sağlık Sigortası (Anthem)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 432,
    "currency": "$",
    "dailyChange": -2.5,
    "peRatio": 15.8,
    "pbRatio": 2.4,
    "dividendYield": 1.52,
    "marketCap": "$100B",
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
    ]
  },
  {
    "id": "bmy",
    "symbol": "BMY",
    "name": "Bristol-Myers Squibb",
    "sector": "Biyofarmasötik & İmmünoterapi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 54,
    "currency": "$",
    "dailyChange": -1.4,
    "peRatio": 14.5,
    "pbRatio": 4.2,
    "dividendYield": 4.44,
    "marketCap": "$110B",
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
    ]
  },
  {
    "id": "amgn",
    "symbol": "AMGN",
    "name": "Amgen Inc.",
    "sector": "Biyoteknoloji Öncüsü",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 324,
    "currency": "$",
    "dailyChange": -1.01,
    "peRatio": 18.2,
    "pbRatio": 16.5,
    "dividendYield": 2.78,
    "marketCap": "$174B",
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
    ]
  },
  {
    "id": "gild",
    "symbol": "GILD",
    "name": "Gilead Sciences Inc.",
    "sector": "Viroloji & Onkoloji",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 88.5,
    "currency": "$",
    "dailyChange": 1.28,
    "peRatio": 16,
    "pbRatio": 4.8,
    "dividendYield": 3.48,
    "marketCap": "$110B",
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
    ]
  },
  {
    "id": "vrtx",
    "symbol": "VRTX",
    "name": "Vertex Pharmaceuticals",
    "sector": "Kistik Fibrozis & Gen Tedavileri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 468,
    "currency": "$",
    "dailyChange": 0.24,
    "peRatio": 28.5,
    "pbRatio": 6.2,
    "dividendYield": 0,
    "marketCap": "$120B",
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
    ]
  },
  {
    "id": "regn",
    "symbol": "REGN",
    "name": "Regeneron Pharmaceuticals",
    "sector": "Antikor Teknolojileri & Göz Sağlığı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 984,
    "currency": "$",
    "dailyChange": -1.57,
    "peRatio": 24,
    "pbRatio": 3.8,
    "dividendYield": 0,
    "marketCap": "$106B",
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
    ]
  },
  {
    "id": "syk",
    "symbol": "SYK",
    "name": "Stryker Corporation",
    "sector": "Ortopedi & Tıbbi Cihazlar",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 364,
    "currency": "$",
    "dailyChange": -1.03,
    "peRatio": 34,
    "pbRatio": 7.2,
    "dividendYield": 0.88,
    "marketCap": "$138B",
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
    ]
  },
  {
    "id": "mdt",
    "symbol": "MDT",
    "name": "Medtronic plc",
    "sector": "Kalp Pilleri & Tıbbi Teknolojiler",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 88,
    "currency": "$",
    "dailyChange": 0.09,
    "peRatio": 22.5,
    "pbRatio": 2.2,
    "dividendYield": 3.18,
    "marketCap": "$113B",
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
    ]
  },
  {
    "id": "bsx",
    "symbol": "BSX",
    "name": "Boston Scientific Corp.",
    "sector": "Girişimsel Kardiyoloji Cihazları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 84.5,
    "currency": "$",
    "dailyChange": 0.79,
    "peRatio": 42,
    "pbRatio": 5.8,
    "dividendYield": 0,
    "marketCap": "$124B",
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
    ]
  },
  {
    "id": "bdx",
    "symbol": "BDX",
    "name": "Becton, Dickinson and Company",
    "sector": "Tıbbi Sarf & Enjeksiyon Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 238,
    "currency": "$",
    "dailyChange": -1.72,
    "peRatio": 28,
    "pbRatio": 2.6,
    "dividendYield": 1.6,
    "marketCap": "$68B",
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
    ]
  },
  {
    "id": "ew",
    "symbol": "EW",
    "name": "Edwards Lifesciences",
    "sector": "Yapay Kalp Kapakçıkları (TAVR)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 72,
    "currency": "$",
    "dailyChange": 0.63,
    "peRatio": 28.5,
    "pbRatio": 4.8,
    "dividendYield": 0,
    "marketCap": "$43B",
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
    ]
  },
  {
    "id": "eog",
    "symbol": "EOG",
    "name": "EOG Resources Inc.",
    "sector": "Petrol & Doğalgaz Arama",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 132,
    "currency": "$",
    "dailyChange": 0.13,
    "peRatio": 11.2,
    "pbRatio": 2.4,
    "dividendYield": 2.76,
    "marketCap": "$76B",
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
    ]
  },
  {
    "id": "oxy",
    "symbol": "OXY",
    "name": "Occidental Petroleum",
    "sector": "Kayaç Petrolü & Karbon Yakalama",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 54.5,
    "currency": "$",
    "dailyChange": -2.22,
    "peRatio": 15,
    "pbRatio": 1.85,
    "dividendYield": 1.61,
    "marketCap": "$50B",
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
    ]
  },
  {
    "id": "mpc",
    "symbol": "MPC",
    "name": "Marathon Petroleum Corp.",
    "sector": "Petrol Rafinerisi & Akaryakıt Dağıtım",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 168,
    "currency": "$",
    "dailyChange": -2.49,
    "peRatio": 10.5,
    "pbRatio": 2.8,
    "dividendYield": 1.96,
    "marketCap": "$58B",
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
    ]
  },
  {
    "id": "vlo",
    "symbol": "VLO",
    "name": "Valero Energy Corporation",
    "sector": "Rafineri & Yenilenebilir Dizel",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 142,
    "currency": "$",
    "dailyChange": -1.47,
    "peRatio": 11,
    "pbRatio": 2.1,
    "dividendYield": 3.02,
    "marketCap": "$45B",
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
    ]
  },
  {
    "id": "psx",
    "symbol": "PSX",
    "name": "Phillips 66",
    "sector": "Rafinaj & Orta Akım Boru Hatları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 138,
    "currency": "$",
    "dailyChange": -0.57,
    "peRatio": 13.2,
    "pbRatio": 1.9,
    "dividendYield": 3.33,
    "marketCap": "$58B",
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
    ]
  },
  {
    "id": "kmi",
    "symbol": "KMI",
    "name": "Kinder Morgan Inc.",
    "sector": "Doğalgaz Boru Hatları Altyapısı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 24.5,
    "currency": "$",
    "dailyChange": -1.48,
    "peRatio": 21,
    "pbRatio": 1.8,
    "dividendYield": 4.65,
    "marketCap": "$54B",
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
    ]
  },
  {
    "id": "wmb",
    "symbol": "WMB",
    "name": "The Williams Companies",
    "sector": "Doğalgaz Taşıma & Transco",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 52,
    "currency": "$",
    "dailyChange": 2.47,
    "peRatio": 22.5,
    "pbRatio": 3.8,
    "dividendYield": 3.65,
    "marketCap": "$63B",
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
    ]
  },
  {
    "id": "duk",
    "symbol": "DUK",
    "name": "Duke Energy Corporation",
    "sector": "Elektrik & Gaz Dağıtım Şebekesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 118,
    "currency": "$",
    "dailyChange": -2.45,
    "peRatio": 19.5,
    "pbRatio": 1.85,
    "dividendYield": 3.52,
    "marketCap": "$91B",
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
    ]
  },
  {
    "id": "so",
    "symbol": "SO",
    "name": "The Southern Company",
    "sector": "Nükleer & Temiz Enerji Şebekesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 92.4,
    "currency": "$",
    "dailyChange": -2.4,
    "peRatio": 22,
    "pbRatio": 2.4,
    "dividendYield": 3.12,
    "marketCap": "$101B",
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
    ]
  },
  {
    "id": "aep",
    "symbol": "AEP",
    "name": "American Electric Power",
    "sector": "Elektrik İletim Hatları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 102,
    "currency": "$",
    "dailyChange": 2.49,
    "peRatio": 18.5,
    "pbRatio": 2.1,
    "dividendYield": 3.45,
    "marketCap": "$54B",
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
    ]
  },
  {
    "id": "sre",
    "symbol": "SRE",
    "name": "Sempra Energy",
    "sector": "Enerji Altyapısı & LNG Terminalleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 88.5,
    "currency": "$",
    "dailyChange": 1.28,
    "peRatio": 18,
    "pbRatio": 1.9,
    "dividendYield": 2.8,
    "marketCap": "$56B",
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
    ]
  },
  {
    "id": "tgt",
    "symbol": "TGT",
    "name": "Target Corporation",
    "sector": "Zincir Perakende Mağazaları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 154,
    "currency": "$",
    "dailyChange": -0.15,
    "peRatio": 16.5,
    "pbRatio": 5.2,
    "dividendYield": 2.91,
    "marketCap": "$71B",
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
    ]
  },
  {
    "id": "mdlz",
    "symbol": "MDLZ",
    "name": "Mondelez International",
    "sector": "Bisküvi & Çikolata (Oreo & Milka)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 72,
    "currency": "$",
    "dailyChange": 0.63,
    "peRatio": 22,
    "pbRatio": 3.4,
    "dividendYield": 2.61,
    "marketCap": "$96B",
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
    ]
  },
  {
    "id": "kmb",
    "symbol": "KMB",
    "name": "Kimberly-Clark Corporation",
    "sector": "Kağıt Hijyen Ürünleri (Huggies)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 142,
    "currency": "$",
    "dailyChange": -1.47,
    "peRatio": 21,
    "pbRatio": 38,
    "dividendYield": 3.44,
    "marketCap": "$48B",
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
    ]
  },
  {
    "id": "cl",
    "symbol": "CL",
    "name": "Colgate-Palmolive Company",
    "sector": "Ağız Bakımı & Ev Hijyeni",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 102,
    "currency": "$",
    "dailyChange": 2.49,
    "peRatio": 28.5,
    "pbRatio": 85,
    "dividendYield": 1.96,
    "marketCap": "$83B",
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
    ]
  },
  {
    "id": "mnst",
    "symbol": "MNST",
    "name": "Monster Beverage Corp.",
    "sector": "Enerji İçecekleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 52,
    "currency": "$",
    "dailyChange": 2.47,
    "peRatio": 32,
    "pbRatio": 6.8,
    "dividendYield": 0,
    "marketCap": "$54B",
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
    ]
  },
  {
    "id": "bkng",
    "symbol": "BKNG",
    "name": "Booking Holdings Inc.",
    "sector": "Çevrimiçi Seyahat & Otel Rezervasyonu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 4480,
    "currency": "$",
    "dailyChange": 0.22,
    "peRatio": 29.5,
    "dividendYield": 0.78,
    "marketCap": "$152B",
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
    ]
  },
  {
    "id": "mar",
    "symbol": "MAR",
    "name": "Marriott International",
    "sector": "Küresel Otel Zincirleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 274,
    "currency": "$",
    "dailyChange": -1.57,
    "peRatio": 28,
    "pbRatio": 165,
    "dividendYield": 0.92,
    "marketCap": "$78B",
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
    ]
  },
  {
    "id": "hlt",
    "symbol": "HLT",
    "name": "Hilton Worldwide Holdings",
    "sector": "Konaklama & Otel Franchise",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 242,
    "currency": "$",
    "dailyChange": -0.24,
    "peRatio": 38.5,
    "dividendYield": 0.25,
    "marketCap": "$60B",
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
    ]
  },
  {
    "id": "lvs",
    "symbol": "LVS",
    "name": "Las Vegas Sands Corp.",
    "sector": "Entegre Tatil Köyleri & Kumarhane",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 52,
    "currency": "$",
    "dailyChange": 2.47,
    "peRatio": 22,
    "pbRatio": 9.8,
    "dividendYield": 1.54,
    "marketCap": "$38B",
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
    ]
  },
  {
    "id": "orly",
    "symbol": "ORLY",
    "name": "O'Reilly Automotive Inc.",
    "sector": "Oto Yedek Parça Perakendesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 1180,
    "currency": "$",
    "dailyChange": -2.36,
    "peRatio": 28,
    "dividendYield": 0,
    "marketCap": "$69B",
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
    ]
  },
  {
    "id": "azo",
    "symbol": "AZO",
    "name": "AutoZone Inc.",
    "sector": "Otomotiv Parçaları & Aksesuar",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 3120,
    "currency": "$",
    "dailyChange": -0.97,
    "peRatio": 21,
    "dividendYield": 0,
    "marketCap": "$53B",
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
    ]
  },
  {
    "id": "rost",
    "symbol": "ROST",
    "name": "Ross Stores Inc.",
    "sector": "İndirimli Hazır Giyim",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 148,
    "currency": "$",
    "dailyChange": -0.85,
    "peRatio": 25,
    "pbRatio": 7.2,
    "dividendYield": 0.99,
    "marketCap": "$49B",
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
    ]
  },
  {
    "id": "gww",
    "symbol": "GWW",
    "name": "W.W. Grainger Inc.",
    "sector": "Endüstriyel Malzeme Dağıtımı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 1040,
    "currency": "$",
    "dailyChange": -0.33,
    "peRatio": 26.5,
    "pbRatio": 12.8,
    "dividendYield": 0.79,
    "marketCap": "$51B",
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
    ]
  },
  {
    "id": "fast",
    "symbol": "FAST",
    "name": "Fastenal Company",
    "sector": "Endüstriyel Bağlantı Elemanları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 78,
    "currency": "$",
    "dailyChange": 1.28,
    "peRatio": 38,
    "pbRatio": 11.5,
    "dividendYield": 1.95,
    "marketCap": "$45B",
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
    ]
  },
  {
    "id": "ctas",
    "symbol": "CTAS",
    "name": "Cintas Corporation",
    "sector": "Kurumsal İş Kıyafetleri & Hijyen",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 208,
    "currency": "$",
    "dailyChange": 1.52,
    "peRatio": 48,
    "pbRatio": 18.5,
    "dividendYield": 0.75,
    "marketCap": "$84B",
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
    ]
  },
  {
    "id": "itw",
    "symbol": "ITW",
    "name": "Illinois Tool Works",
    "sector": "Özel Mühendislik Ekipmanları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 264,
    "currency": "$",
    "dailyChange": 0.27,
    "peRatio": 24.5,
    "pbRatio": 22,
    "dividendYield": 2.27,
    "marketCap": "$78B",
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
    ]
  },
  {
    "id": "emr",
    "symbol": "EMR",
    "name": "Emerson Electric Co.",
    "sector": "Endüstriyel Süreç Otomasyonu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 118,
    "currency": "$",
    "dailyChange": -2.45,
    "peRatio": 26,
    "pbRatio": 3.4,
    "dividendYield": 1.78,
    "marketCap": "$67B",
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
    ]
  },
  {
    "id": "etn",
    "symbol": "ETN",
    "name": "Eaton Corporation plc",
    "sector": "Akıllı Güç Yönetimi & Elektrik",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 358,
    "currency": "$",
    "dailyChange": -0.35,
    "peRatio": 38,
    "pbRatio": 7.4,
    "dividendYield": 1.05,
    "marketCap": "$142B",
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
    ]
  },
  {
    "id": "ph",
    "symbol": "PH",
    "name": "Parker-Hannifin Corp.",
    "sector": "Hareket & Kontrol Teknolojileri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 645,
    "currency": "$",
    "dailyChange": -2.07,
    "peRatio": 26,
    "pbRatio": 7.8,
    "dividendYield": 1.01,
    "marketCap": "$83B",
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
    ]
  },
  {
    "id": "tt",
    "symbol": "TT",
    "name": "Trane Technologies plc",
    "sector": "İklimlendirme (HVAC) & Soğutma",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 388,
    "currency": "$",
    "dailyChange": -2.5,
    "peRatio": 34,
    "pbRatio": 11.2,
    "dividendYield": 0.87,
    "marketCap": "$87B",
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
    ]
  },
  {
    "id": "carr",
    "symbol": "CARR",
    "name": "Carrier Global Corp.",
    "sector": "Akıllı İklim & HVAC Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 78,
    "currency": "$",
    "dailyChange": 1.28,
    "peRatio": 28,
    "pbRatio": 7.8,
    "dividendYield": 0.97,
    "marketCap": "$68B",
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
    ]
  },
  {
    "id": "fdx",
    "symbol": "FDX",
    "name": "FedEx Corporation",
    "sector": "Ekspres Kargo & Hava Taşımacılığı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 278,
    "currency": "$",
    "dailyChange": 2.5,
    "peRatio": 16.5,
    "pbRatio": 2.4,
    "dividendYield": 1.99,
    "marketCap": "$68B",
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
    ]
  },
  {
    "id": "csx",
    "symbol": "CSX",
    "name": "CSX Corporation",
    "sector": "Doğu Yakası Yük Demiryolu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 36,
    "currency": "$",
    "dailyChange": -2.48,
    "peRatio": 19,
    "pbRatio": 5.4,
    "dividendYield": 1.33,
    "marketCap": "$70B",
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
    ]
  },
  {
    "id": "nsc",
    "symbol": "NSC",
    "name": "Norfolk Southern Corp.",
    "sector": "Demiryolu Taşımacılığı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 254,
    "currency": "$",
    "dailyChange": 1.13,
    "peRatio": 22,
    "pbRatio": 4.2,
    "dividendYield": 2.13,
    "marketCap": "$57B",
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
    ]
  },
  {
    "id": "wm",
    "symbol": "WM",
    "name": "Waste Management Inc.",
    "sector": "Atık Yönetimi & Geri Dönüşüm",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 218,
    "currency": "$",
    "dailyChange": -2.36,
    "peRatio": 32.5,
    "pbRatio": 11.8,
    "dividendYield": 1.38,
    "marketCap": "$88B",
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
    ]
  },
  {
    "id": "rsg",
    "symbol": "RSG",
    "name": "Republic Services Inc.",
    "sector": "Çevre Hizmetleri & Atık Bertarafı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 204,
    "currency": "$",
    "dailyChange": 0.51,
    "peRatio": 33,
    "pbRatio": 5.8,
    "dividendYield": 1.14,
    "marketCap": "$64B",
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
    ]
  },
  {
    "id": "ecl",
    "symbol": "ECL",
    "name": "Ecolab Inc.",
    "sector": "Su Arıtma & Hijyen Teknolojileri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NYSE",
    "price": 254,
    "currency": "$",
    "dailyChange": 1.13,
    "peRatio": 42,
    "pbRatio": 8.5,
    "dividendYield": 0.9,
    "marketCap": "$72B",
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
    ]
  },
  {
    "id": "asml",
    "symbol": "ASML",
    "name": "ASML Holding NV",
    "sector": "Yarı İletken Litografi Sistemleri",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "AEX",
    "price": 845,
    "currency": "€",
    "dailyChange": 1.85,
    "peRatio": 42.5,
    "pbRatio": 22.4,
    "dividendYield": 0.75,
    "marketCap": "348 Mr €",
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
    ]
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
    "price": 218.4,
    "currency": "€",
    "dailyChange": 1.65,
    "peRatio": 38,
    "pbRatio": 5.4,
    "dividendYield": 1.05,
    "marketCap": "258 Mr €",
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
    ]
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
    "price": 292,
    "currency": "€",
    "dailyChange": 0.4,
    "peRatio": 11.2,
    "pbRatio": 1.85,
    "dividendYield": 4.8,
    "marketCap": "116 Mr €",
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
    ]
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
    "price": 58.4,
    "currency": "€",
    "dailyChange": 0.35,
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
    ]
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
    "price": 28.5,
    "currency": "€",
    "dailyChange": 0.7,
    "peRatio": 15.8,
    "pbRatio": 2.2,
    "dividendYield": 3.15,
    "marketCap": "142 Mr €",
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
    ]
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
    "price": 648,
    "currency": "€",
    "dailyChange": 1.25,
    "peRatio": 21.5,
    "pbRatio": 4.8,
    "dividendYield": 2,
    "marketCap": "324 Mr €",
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
    ]
  },
  {
    "id": "or",
    "symbol": "OR",
    "name": "L'Oréal S.A.",
    "sector": "Kozmetik & Güzellik Ürünleri",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 368,
    "currency": "€",
    "dailyChange": 0.4,
    "peRatio": 28.5,
    "pbRatio": 6.2,
    "dividendYield": 1.78,
    "marketCap": "196 Mr €",
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
    ]
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
    "price": 102.5,
    "currency": "€",
    "dailyChange": 0.1,
    "peRatio": 14.2,
    "pbRatio": 1.75,
    "dividendYield": 3.68,
    "marketCap": "128 Mr €",
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
    ]
  },
  {
    "id": "air",
    "symbol": "AIR",
    "name": "Airbus SE",
    "sector": "Ticari Havacılık & Savunma",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "CAC 40",
    "price": 142,
    "currency": "€",
    "dailyChange": 1.15,
    "peRatio": 28,
    "pbRatio": 6.5,
    "dividendYield": 1.95,
    "marketCap": "112 Mr €",
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
    ]
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
    "price": 242,
    "currency": "€",
    "dailyChange": 1.45,
    "peRatio": 32,
    "pbRatio": 4.8,
    "dividendYield": 1.48,
    "marketCap": "138 Mr €",
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
    ]
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
    "price": 274,
    "currency": "CHF",
    "dailyChange": 0.3,
    "peRatio": 16.8,
    "pbRatio": 6.8,
    "dividendYield": 3.5,
    "marketCap": "218 Mr CHF",
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
    ]
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
    "price": 138.5,
    "currency": "CHF",
    "dailyChange": 1.1,
    "peRatio": 22,
    "pbRatio": 3.8,
    "dividendYield": 2.05,
    "marketCap": "78 Mr CHF",
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
    ]
  },
  {
    "id": "shel",
    "symbol": "SHEL",
    "name": "Shell plc",
    "sector": "Küresel Petrol, Gaz & LNG Ticareti",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 2680,
    "currency": "GBp",
    "dailyChange": 0.55,
    "peRatio": 11.5,
    "pbRatio": 1.25,
    "dividendYield": 3.95,
    "marketCap": "172 Mr £",
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
    ]
  },
  {
    "id": "azn",
    "symbol": "AZN",
    "name": "AstraZeneca plc",
    "sector": "Biyofarmasötik & Onkoloji İlaçları",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 11850,
    "currency": "GBp",
    "dailyChange": 0.75,
    "peRatio": 34,
    "pbRatio": 4.8,
    "dividendYield": 2.1,
    "marketCap": "184 Mr £",
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
    ]
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
    "price": 412,
    "currency": "GBp",
    "dailyChange": 0.6,
    "peRatio": 10.8,
    "pbRatio": 1.1,
    "dividendYield": 5.6,
    "marketCap": "66 Mr £",
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
    ]
  },
  {
    "id": "gsk",
    "symbol": "GSK",
    "name": "GSK plc (GlaxoSmithKline)",
    "sector": "Aşılar & Özel İlaçlar",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE 100",
    "price": 1540,
    "currency": "GBp",
    "dailyChange": -0.2,
    "peRatio": 12.5,
    "pbRatio": 4.2,
    "dividendYield": 3.9,
    "marketCap": "63 Mr £",
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
    ]
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
    "price": 5040,
    "currency": "GBp",
    "dailyChange": 1.2,
    "peRatio": 10.5,
    "pbRatio": 1.85,
    "dividendYield": 6.45,
    "marketCap": "82 Mr £",
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
    ]
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
    "price": 4.55,
    "currency": "€",
    "dailyChange": 0.4,
    "peRatio": 6.4,
    "pbRatio": 0.68,
    "dividendYield": 4.25,
    "marketCap": "70 Mr €",
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
    ]
  },
  {
    "id": "ferrari",
    "symbol": "RACE",
    "name": "Ferrari N.V.",
    "sector": "Lüks Süper Spor Otomobiller",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "FTSE MIB",
    "price": 428,
    "currency": "€",
    "dailyChange": 0.9,
    "peRatio": 52,
    "pbRatio": 24.5,
    "dividendYield": 0.58,
    "marketCap": "77 Mr €",
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
    ]
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
    "price": 3120.4,
    "currency": "₺",
    "dailyChange": 0.45,
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
    "price": 5110,
    "currency": "₺",
    "dailyChange": 0.45,
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
    "price": 20440,
    "currency": "₺",
    "dailyChange": 0.45,
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
    "price": 21050,
    "currency": "₺",
    "dailyChange": 0.48,
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
    "price": 2340,
    "currency": "₺",
    "dailyChange": 0.45,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "0.750 saflıkta 18 ayar altın gram değeri.",
    "metrics": []
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
    "price": 1820,
    "currency": "₺",
    "dailyChange": 0.45,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "0.585 saflıkta 14 ayar altın gram değeri.",
    "metrics": []
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
    "price": 38.9,
    "currency": "₺",
    "dailyChange": 1.8,
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
    "price": 1145,
    "currency": "₺",
    "dailyChange": 0.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yeşil hidrojen yakıt hücreleri ve otomotiv katalizörlerinde kritik öneme sahip nadir değerli metal.",
    "metrics": []
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
    "price": 2658,
    "currency": "$",
    "dailyChange": 0.45,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "31.1035 gram 24 ayar saf altın küresel ons fiyatı.",
    "metrics": []
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
    "price": 78.4,
    "currency": "$",
    "dailyChange": -0.65,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Küresel enerji piyasasının ana göstergesi olan Kuzey Denizi Brent petrol vadeli kontratı.",
    "metrics": []
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
    "price": 4.38,
    "currency": "$",
    "dailyChange": 1.2,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Elektrifikasyon, veri merkezleri ve elektrik şebekesi dönüşümünün 'Doktor Bakır' barometresi.",
    "metrics": []
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
    "price": 585.4,
    "currency": "$",
    "dailyChange": 0.72,
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
    ]
  },
  {
    "id": "voo",
    "symbol": "VOO",
    "name": "Vanguard S&P 500 ETF",
    "sector": "ABD S&P 500 Düşük Masraf",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 536.8,
    "currency": "$",
    "dailyChange": 0.74,
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
    ]
  },
  {
    "id": "qqq",
    "symbol": "QQQ",
    "name": "Invesco QQQ Trust (NASDAQ 100)",
    "sector": "Büyük Ölçekli Teknoloji & Büyüme",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 494.2,
    "currency": "$",
    "dailyChange": 1.15,
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
    ]
  },
  {
    "id": "vti",
    "symbol": "VTI",
    "name": "Vanguard Total Stock Market ETF",
    "sector": "Tüm ABD Hisse Senedi Piyasası",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 285,
    "currency": "$",
    "dailyChange": 0.68,
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
    ]
  },
  {
    "id": "gld",
    "symbol": "GLD",
    "name": "SPDR Gold Shares",
    "sector": "Fiziki Külçe Altın",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 248.5,
    "currency": "$",
    "dailyChange": 0.45,
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
    ]
  },
  {
    "id": "slv",
    "symbol": "SLV",
    "name": "iShares Silver Trust",
    "sector": "Fiziki Gümüş",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 28.9,
    "currency": "$",
    "dailyChange": 0.85,
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
    ]
  },
  {
    "id": "smh",
    "symbol": "SMH",
    "name": "VanEck Semiconductor ETF",
    "sector": "Küresel Yarı İletken & Çip",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 248.6,
    "currency": "$",
    "dailyChange": 2.15,
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
    ]
  },
  {
    "id": "soxx",
    "symbol": "SOXX",
    "name": "iShares Semiconductor ETF",
    "sector": "Yarı İletken Sanayi",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 228.4,
    "currency": "$",
    "dailyChange": 1.95,
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
    ]
  },
  {
    "id": "dia",
    "symbol": "DIA",
    "name": "SPDR Dow Jones Industrial Average ETF",
    "sector": "Köklü 30 Mavi Çipli Sanayi",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 432.5,
    "currency": "$",
    "dailyChange": 0.45,
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
    ]
  },
  {
    "id": "schd",
    "symbol": "SCHD",
    "name": "Schwab U.S. Dividend Equity ETF",
    "sector": "Yüksek Temettü & Nakit Akışı",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 84.2,
    "currency": "$",
    "dailyChange": 0.35,
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
    ]
  },
  {
    "id": "vym",
    "symbol": "VYM",
    "name": "Vanguard High Dividend Yield ETF",
    "sector": "Yüksek Verimli Temettü",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 128.5,
    "currency": "$",
    "dailyChange": 0.4,
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
    ]
  },
  {
    "id": "xlf",
    "symbol": "XLF",
    "name": "Financial Select Sector SPDR Fund",
    "sector": "Finans & Bankacılık",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 48.2,
    "currency": "$",
    "dailyChange": 0.55,
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
    ]
  },
  {
    "id": "xlk",
    "symbol": "XLK",
    "name": "Technology Select Sector SPDR Fund",
    "sector": "Bilgi Teknolojileri & Donanım",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 234,
    "currency": "$",
    "dailyChange": 1.25,
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
    ]
  },
  {
    "id": "xle",
    "symbol": "XLE",
    "name": "Energy Select Sector SPDR Fund",
    "sector": "Geleneksel Petrol & Doğalgaz",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 92.4,
    "currency": "$",
    "dailyChange": 0.7,
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
    ]
  },
  {
    "id": "xlv",
    "symbol": "XLV",
    "name": "Health Care Select Sector SPDR Fund",
    "sector": "Sağlık & İlaç Sektörü",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 152,
    "currency": "$",
    "dailyChange": 0.25,
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
    ]
  },
  {
    "id": "xli",
    "symbol": "XLI",
    "name": "Industrial Select Sector SPDR Fund",
    "sector": "Sanayi & Savunma Donanımı",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 138.5,
    "currency": "$",
    "dailyChange": 0.8,
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
    ]
  },
  {
    "id": "xlp",
    "symbol": "XLP",
    "name": "Consumer Staples Select Sector SPDR",
    "sector": "Defansif Temel Tüketim Malları",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 82,
    "currency": "$",
    "dailyChange": 0.2,
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
    ]
  },
  {
    "id": "xly",
    "symbol": "XLY",
    "name": "Consumer Discretionary Select Sector",
    "sector": "Tüketici Harcamaları & E-Ticaret",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 198.5,
    "currency": "$",
    "dailyChange": 1.35,
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
    ]
  },
  {
    "id": "xlu",
    "symbol": "XLU",
    "name": "Utilities Select Sector SPDR Fund",
    "sector": "Elektrik, Gaz & Su Hizmetleri",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 81.4,
    "currency": "$",
    "dailyChange": -0.15,
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
    ]
  },
  {
    "id": "vnq",
    "symbol": "VNQ",
    "name": "Vanguard Real Estate ETF",
    "sector": "Gayrimenkul Yatırım Ortaklıkları (GYO)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 92.5,
    "currency": "$",
    "dailyChange": 0.4,
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
    ]
  },
  {
    "id": "tlt",
    "symbol": "TLT",
    "name": "iShares 20+ Year Treasury Bond ETF",
    "sector": "ABD Uzun Vadeli Hazine Tahvilleri",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 94.8,
    "currency": "$",
    "dailyChange": -0.3,
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
    ]
  },
  {
    "id": "agg",
    "symbol": "AGG",
    "name": "iShares Core U.S. Aggregate Bond ETF",
    "sector": "Tüm ABD Yatırım Düzeyi Tahvilleri",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 99.2,
    "currency": "$",
    "dailyChange": 0.05,
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
    ]
  },
  {
    "id": "bnd",
    "symbol": "BND",
    "name": "Vanguard Total Bond Market ETF",
    "sector": "Düşük Masraflı Toplam Tahvil Piyasası",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 73.4,
    "currency": "$",
    "dailyChange": 0.04,
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
    ]
  },
  {
    "id": "vea",
    "symbol": "VEA",
    "name": "Vanguard FTSE Developed Markets ETF",
    "sector": "ABD Dışı Gelişmiş Ülke Hisseleri",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 51.8,
    "currency": "$",
    "dailyChange": 0.45,
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
    ]
  },
  {
    "id": "vwo",
    "symbol": "VWO",
    "name": "Vanguard FTSE Emerging Markets ETF",
    "sector": "Gelişmekte Olan Piyasalar",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 44.5,
    "currency": "$",
    "dailyChange": 0.8,
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
    ]
  },
  {
    "id": "efa",
    "symbol": "EFA",
    "name": "iShares MSCI EAFE ETF",
    "sector": "Avrupa, Avustralasya & Uzak Doğu",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 81.2,
    "currency": "$",
    "dailyChange": 0.5,
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
    ]
  },
  {
    "id": "iwm",
    "symbol": "IWM",
    "name": "iShares Russell 2000 ETF",
    "sector": "ABD Küçük Ölçekli Şirketler (Small-Cap)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 224.5,
    "currency": "$",
    "dailyChange": 1.45,
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
    ]
  },
  {
    "id": "arkk",
    "symbol": "ARKK",
    "name": "ARK Innovation ETF",
    "sector": "Yıkıcı İnovasyon & Genomik",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 49.8,
    "currency": "$",
    "dailyChange": 3.1,
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
    ]
  },
  {
    "id": "sqqq",
    "symbol": "SQQQ",
    "name": "ProShares UltraPro Short QQQ (3x Ters)",
    "sector": "Kaldıraçlı Ters Teknoloji (Hedge)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 8.4,
    "currency": "$",
    "dailyChange": -3.45,
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
    ]
  },
  {
    "id": "tqqq",
    "symbol": "TQQQ",
    "name": "ProShares UltraPro QQQ (3x Kaldıraçlı)",
    "sector": "Kaldıraçlı NASDAQ 100",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "ETF",
    "price": 76.5,
    "currency": "$",
    "dailyChange": 3.45,
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
    ]
  },
  {
    "id": "usdtry",
    "symbol": "USD/TRY",
    "name": "Amerikan Doları",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 36.45,
    "currency": "₺",
    "dailyChange": 0.08,
    "recommendation": "TUT",
    "inWatchlist": true,
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "36.42",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "eurtry",
    "symbol": "EUR/TRY",
    "name": "Euro",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 39.8,
    "currency": "₺",
    "dailyChange": 0.12,
    "recommendation": "TUT",
    "inWatchlist": true,
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "39.78",
        "peerAvg": "-"
      }
    ]
  },
  {
    "id": "gbptry",
    "symbol": "GBP/TRY",
    "name": "İngiliz Sterlini",
    "sector": "Döviz Kurları",
    "exchange": "Döviz",
    "assetClass": "doviz",
    "price": 47.1,
    "currency": "₺",
    "dailyChange": 0.15,
    "recommendation": "TUT",
    "inWatchlist": false,
    "metrics": [
      {
        "label": "TCMB Gösterge",
        "value": "47.05",
        "peerAvg": "-"
      }
    ]
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
    "price": 1.092,
    "currency": "$",
    "dailyChange": 0.05,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "Dünyanın en yüksek işlem hacimli majör döviz paritesi.",
    "metrics": [
      {
        "label": "200 Günlük Ort.",
        "value": "1.085",
        "peerAvg": "-"
      }
    ]
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
    paymentDate: "27 Eylül 2026",
    netAmountPerShare: 10.74,
    yieldPercent: 6.2,
    status: "Yaklaşıyor",
  },
  {
    id: "div-2",
    companySymbol: "FROTO",
    companyName: "Ford Otosan",
    paymentDate: "22 Kasım 2026",
    netAmountPerShare: 29.5,
    yieldPercent: 2.6,
    status: "Açıklandı",
  },
  {
    id: "div-3",
    companySymbol: "KCHOL",
    companyName: "Koç Holding",
    paymentDate: "18 Nisan 2026",
    netAmountPerShare: 7.22,
    yieldPercent: 3.3,
    status: "Ödendi",
  },
  {
    id: "div-4",
    companySymbol: "BIMAS",
    companyName: "BİM Mağazalar",
    paymentDate: "15 Aralık 2026",
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
    status: "active",
    dateRange: "29 - 31 Mayıs 2026",
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
    status: "active",
    dateRange: "05 - 07 Haziran 2026",
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
    status: "upcoming",
    dateRange: "Tarih Bekleniyor",
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
    status: "upcoming",
    dateRange: "Tarih Bekleniyor",
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
    priceAtVerdict: 3120.4,
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
