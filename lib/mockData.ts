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
  indexTag?: "BIST 30" | "BIST 100" | "S&P 500" | "NASDAQ 100" | "Kıymetli Maden" | "Avrupa" | string;
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
}

export interface BasketHolding {
  companySymbol: string;
  weightPercent: number;
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
  priceAfterPeriod?: number;
  outcomeCheckedAt?: string;
  outcomeCorrect?: boolean | null;
  targetPeriodDays?: number;
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
    "id": "nvda",
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "sector": "Yapay Zeka & Yarı İletken",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 138.25,
    "currency": "$",
    "dailyChange": 4.18,
    "peRatio": 48,
    "pbRatio": 28.5,
    "dividendYield": 0.03,
    "marketCap": "3.4 Trilyon $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "NVIDIA Corporation (NVDA), ABD borsalarında Yapay Zeka & Yarı İletken alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "48x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "28.5",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "aapl",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "sector": "Tüketici Teknolojisi & Ekosistem",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 232.4,
    "currency": "$",
    "dailyChange": 0.92,
    "peRatio": 33.1,
    "pbRatio": 48,
    "dividendYield": 0.45,
    "marketCap": "3.52 Trilyon $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Apple Inc. (AAPL), ABD borsalarında Tüketici Teknolojisi & Ekosistem alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "33.1x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "48",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "msft",
    "symbol": "MSFT",
    "name": "Microsoft Corporation",
    "sector": "Yazılım & Bulut (Azure / AI)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 448.5,
    "currency": "$",
    "dailyChange": 1.45,
    "peRatio": 36.2,
    "pbRatio": 12.8,
    "dividendYield": 0.72,
    "marketCap": "3.33 Trilyon $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Microsoft Corporation (MSFT), ABD borsalarında Yazılım & Bulut (Azure / AI) alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "36.2x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "12.8",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "googl",
    "symbol": "GOOGL",
    "name": "Alphabet Inc. (Google)",
    "sector": "Arama Motoru & Yapay Zeka (Gemini)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 182.4,
    "currency": "$",
    "dailyChange": 1.85,
    "peRatio": 24.5,
    "pbRatio": 6.8,
    "dividendYield": 0.42,
    "marketCap": "2.26 Trilyon $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Alphabet Inc. (Google) (GOOGL), ABD borsalarında Arama Motoru & Yapay Zeka (Gemini) alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.8",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "amzn",
    "symbol": "AMZN",
    "name": "Amazon.com Inc.",
    "sector": "E-Ticaret & Bulut (AWS)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 198.6,
    "currency": "$",
    "dailyChange": 2.1,
    "peRatio": 42,
    "pbRatio": 8.5,
    "dividendYield": 0,
    "marketCap": "2.08 Trilyon $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Amazon.com Inc. (AMZN), ABD borsalarında E-Ticaret & Bulut (AWS) alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "42x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.5",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "tsla",
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "sector": "Elektrikli Araç & Otonom Sürüş",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 218.4,
    "currency": "$",
    "dailyChange": 3.45,
    "peRatio": 62,
    "pbRatio": 11.2,
    "dividendYield": 0,
    "marketCap": "695 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Tesla Inc. (TSLA), ABD borsalarında Elektrikli Araç & Otonom Sürüş alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "62x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "meta",
    "symbol": "META",
    "name": "Meta Platforms (Facebook & Instagram)",
    "sector": "Sosyal Medya & Yapay Zeka (Llama)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 528,
    "currency": "$",
    "dailyChange": 2.65,
    "peRatio": 26.8,
    "pbRatio": 8.2,
    "dividendYield": 0.38,
    "marketCap": "1.34 Trilyon $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Meta Platforms (Facebook & Instagram) (META), ABD borsalarında Sosyal Medya & Yapay Zeka (Llama) alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "26.8x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "amd",
    "symbol": "AMD",
    "name": "Advanced Micro Devices",
    "sector": "Yarı İletken & AI Çipleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 156.4,
    "currency": "$",
    "dailyChange": 3.12,
    "peRatio": 44,
    "pbRatio": 4.2,
    "dividendYield": 0,
    "marketCap": "253 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Advanced Micro Devices (AMD), ABD borsalarında Yarı İletken & AI Çipleri alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "44x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "pltr",
    "symbol": "PLTR",
    "name": "Palantir Technologies",
    "sector": "Büyük Veri & Askeri Yapay Zeka",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 36.8,
    "currency": "$",
    "dailyChange": 5.12,
    "peRatio": 84,
    "pbRatio": 18.2,
    "dividendYield": 0,
    "marketCap": "82.4 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Palantir Technologies (PLTR), ABD borsalarında Büyük Veri & Askeri Yapay Zeka alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "84x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "18.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "coin",
    "symbol": "COIN",
    "name": "Coinbase Global",
    "sector": "Kripto Finans & Borsa",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 215,
    "currency": "$",
    "dailyChange": 4.8,
    "peRatio": 38,
    "pbRatio": 5.4,
    "dividendYield": 0,
    "marketCap": "52.8 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Coinbase Global (COIN), ABD borsalarında Kripto Finans & Borsa alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.4",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "nflx",
    "symbol": "NFLX",
    "name": "Netflix Inc.",
    "sector": "Dijital Yayıncılık & Eğlence",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 685,
    "currency": "$",
    "dailyChange": 1.85,
    "peRatio": 36.5,
    "pbRatio": 14.2,
    "dividendYield": 0,
    "marketCap": "294 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Netflix Inc. (NFLX), ABD borsalarında Dijital Yayıncılık & Eğlence alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "36.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "14.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "intc",
    "symbol": "INTC",
    "name": "Intel Corporation",
    "sector": "Yarı İletken Üretim & Çip",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 22.8,
    "currency": "$",
    "dailyChange": 1.15,
    "peRatio": 28,
    "pbRatio": 0.95,
    "dividendYield": 2.1,
    "marketCap": "98 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Intel Corporation (INTC), ABD borsalarında Yarı İletken Üretim & Çip alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "28x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "0.95",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "brkb",
    "symbol": "BRK-B",
    "name": "Berkshire Hathaway (Warren Buffett)",
    "sector": "Çok Sektörlü Holding & Sigorta",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 452,
    "currency": "$",
    "dailyChange": 0.45,
    "peRatio": 21.4,
    "pbRatio": 1.55,
    "dividendYield": 0,
    "marketCap": "980 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Berkshire Hathaway (Warren Buffett) (BRK-B), ABD borsalarında Çok Sektörlü Holding & Sigorta alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21.4x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.55",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "dis",
    "symbol": "DIS",
    "name": "The Walt Disney Company",
    "sector": "Medya, Eğlence & Tema Parkları",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 96.5,
    "currency": "$",
    "dailyChange": 0.85,
    "peRatio": 18.5,
    "pbRatio": 1.75,
    "dividendYield": 0.95,
    "marketCap": "176 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "The Walt Disney Company (DIS), ABD borsalarında Medya, Eğlence & Tema Parkları alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "18.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.75",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "v",
    "symbol": "V",
    "name": "Visa Inc.",
    "sector": "Dijital Ödeme Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 284,
    "currency": "$",
    "dailyChange": 0.65,
    "peRatio": 29.5,
    "pbRatio": 13.8,
    "dividendYield": 0.75,
    "marketCap": "580 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Visa Inc. (V), ABD borsalarında Dijital Ödeme Sistemleri alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "29.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "13.8",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "ma",
    "symbol": "MA",
    "name": "Mastercard Incorporated",
    "sector": "Dijital Ödeme Sistemleri",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 488,
    "currency": "$",
    "dailyChange": 0.72,
    "peRatio": 33,
    "pbRatio": 54,
    "dividendYield": 0.55,
    "marketCap": "454 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Mastercard Incorporated (MA), ABD borsalarında Dijital Ödeme Sistemleri alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "33x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "54",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "jpm",
    "symbol": "JPM",
    "name": "JPMorgan Chase & Co.",
    "sector": "Yatırım & Ticari Bankacılık",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 218,
    "currency": "$",
    "dailyChange": 1.15,
    "peRatio": 12.2,
    "pbRatio": 1.85,
    "dividendYield": 2.25,
    "marketCap": "625 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "JPMorgan Chase & Co. (JPM), ABD borsalarında Yatırım & Ticari Bankacılık alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "12.2x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.85",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "jnj",
    "symbol": "JNJ",
    "name": "Johnson & Johnson",
    "sector": "İlaç & Tıbbi Cihazlar",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 162,
    "currency": "$",
    "dailyChange": 0.25,
    "peRatio": 16.8,
    "pbRatio": 5.2,
    "dividendYield": 3.1,
    "marketCap": "390 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Johnson & Johnson (JNJ), ABD borsalarında İlaç & Tıbbi Cihazlar alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "16.8x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "wmt",
    "symbol": "WMT",
    "name": "Walmart Inc.",
    "sector": "Küresel Perakende Devi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 76.5,
    "currency": "$",
    "dailyChange": 0.85,
    "peRatio": 31,
    "pbRatio": 6.2,
    "dividendYield": 1.15,
    "marketCap": "615 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Walmart Inc. (WMT), ABD borsalarında Küresel Perakende Devi alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "31x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "cost",
    "symbol": "COST",
    "name": "Costco Wholesale Corporation",
    "sector": "Toptan Üyelikli Perakende",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 895,
    "currency": "$",
    "dailyChange": 1.25,
    "peRatio": 52,
    "pbRatio": 14.5,
    "dividendYield": 0.55,
    "marketCap": "397 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Costco Wholesale Corporation (COST), ABD borsalarında Toptan Üyelikli Perakende alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "52x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "14.5",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "crm",
    "symbol": "CRM",
    "name": "Salesforce Inc.",
    "sector": "Müşteri İlişkileri Yazılımı (CRM)",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 258,
    "currency": "$",
    "dailyChange": 1.45,
    "peRatio": 38,
    "pbRatio": 4.2,
    "dividendYield": 0.62,
    "marketCap": "250 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Salesforce Inc. (CRM), ABD borsalarında Müşteri İlişkileri Yazılımı (CRM) alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "4.2",
        "peerAvg": "10.0"
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
    "price": 142,
    "currency": "$",
    "dailyChange": 2.15,
    "peRatio": 34,
    "pbRatio": 28,
    "dividendYield": 1.12,
    "marketCap": "392 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Oracle Corporation (ORCL), ABD borsalarında Veritabanı & Bulut Altyapısı alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "34x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "28",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "adbe",
    "symbol": "ADBE",
    "name": "Adobe Inc.",
    "sector": "Yaratıcı Yazılım & Photoshop AI",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 524,
    "currency": "$",
    "dailyChange": 1.65,
    "peRatio": 39,
    "pbRatio": 14.2,
    "dividendYield": 0,
    "marketCap": "234 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Adobe Inc. (ADBE), ABD borsalarında Yaratıcı Yazılım & Photoshop AI alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "39x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "14.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "qcom",
    "symbol": "QCOM",
    "name": "Qualcomm Incorporated",
    "sector": "Mobil İşlemci (Snapdragon) & 5G",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 168,
    "currency": "$",
    "dailyChange": 1.95,
    "peRatio": 19.5,
    "pbRatio": 7.8,
    "dividendYield": 1.95,
    "marketCap": "188 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Qualcomm Incorporated (QCOM), ABD borsalarında Mobil İşlemci (Snapdragon) & 5G alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "19.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.8",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "avgo",
    "symbol": "AVGO",
    "name": "Broadcom Inc.",
    "sector": "Özel Yapay Zeka Hızlandırıcıları & Çip",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 164,
    "currency": "$",
    "dailyChange": 3.45,
    "peRatio": 42,
    "pbRatio": 11.5,
    "dividendYield": 1.35,
    "marketCap": "768 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Broadcom Inc. (AVGO), ABD borsalarında Özel Yapay Zeka Hızlandırıcıları & Çip alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "42x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "11.5",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "uber",
    "symbol": "UBER",
    "name": "Uber Technologies",
    "sector": "Araç Çağırma & Teslimat",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 74.5,
    "currency": "$",
    "dailyChange": 2.25,
    "peRatio": 32,
    "pbRatio": 7.5,
    "dividendYield": 0,
    "marketCap": "155 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Uber Technologies (UBER), ABD borsalarında Araç Çağırma & Teslimat alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "32x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.5",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "spot",
    "symbol": "SPOT",
    "name": "Spotify Technology",
    "sector": "Müzik & Podcast Yayını",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 345,
    "currency": "$",
    "dailyChange": 2.85,
    "peRatio": 54,
    "pbRatio": 18,
    "dividendYield": 0,
    "marketCap": "69 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Spotify Technology (SPOT), ABD borsalarında Müzik & Podcast Yayını alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "54x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "18",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "pypl",
    "symbol": "PYPL",
    "name": "PayPal Holdings",
    "sector": "Dijital Cüzdan & Fintek",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 71.5,
    "currency": "$",
    "dailyChange": 1.45,
    "peRatio": 17.5,
    "pbRatio": 2.4,
    "dividendYield": 0,
    "marketCap": "74 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "PayPal Holdings (PYPL), ABD borsalarında Dijital Cüzdan & Fintek alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "17.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "2.4",
        "peerAvg": "10.0"
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
    "indexTag": "NASDAQ 100",
    "price": 118,
    "currency": "$",
    "dailyChange": 3.85,
    "peRatio": 68,
    "pbRatio": 6.5,
    "dividendYield": 0,
    "marketCap": "39 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Snowflake Inc. (SNOW), ABD borsalarında Bulut Veri Ambarı alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "68x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.5",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "shop",
    "symbol": "SHOP",
    "name": "Shopify Inc.",
    "sector": "E-Ticaret Altyapı Platformu",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 78.5,
    "currency": "$",
    "dailyChange": 2.95,
    "peRatio": 74,
    "pbRatio": 8.8,
    "dividendYield": 0,
    "marketCap": "101 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Shopify Inc. (SHOP), ABD borsalarında E-Ticaret Altyapı Platformu alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "74x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.8",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "nke",
    "symbol": "NKE",
    "name": "NIKE Inc.",
    "sector": "Spor Giyim & Ayakkabı",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 82.5,
    "currency": "$",
    "dailyChange": 0.45,
    "peRatio": 24,
    "pbRatio": 8.5,
    "dividendYield": 1.85,
    "marketCap": "124 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "NIKE Inc. (NKE), ABD borsalarında Spor Giyim & Ayakkabı alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.5",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "ba",
    "symbol": "BA",
    "name": "The Boeing Company",
    "sector": "Ticari & Askeri Uçak Üretimi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 158,
    "currency": "$",
    "dailyChange": -1.25,
    "peRatio": 35,
    "pbRatio": 12,
    "dividendYield": 0,
    "marketCap": "98 Mr $",
    "beta": 1.25,
    "recommendation": "TUT",
    "inWatchlist": false,
    "description": "The Boeing Company (BA), ABD borsalarında Ticari & Askeri Uçak Üretimi alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "35x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "12",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "ibm",
    "symbol": "IBM",
    "name": "International Business Machines",
    "sector": "Kurumsal Bilişim & Hibrit Bulut",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "S&P 500",
    "price": 204,
    "currency": "$",
    "dailyChange": 1.15,
    "peRatio": 21,
    "pbRatio": 7.5,
    "dividendYield": 3.25,
    "marketCap": "188 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "International Business Machines (IBM), ABD borsalarında Kurumsal Bilişim & Hibrit Bulut alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "21x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "7.5",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "mstr",
    "symbol": "MSTR",
    "name": "MicroStrategy Incorporated",
    "sector": "Kurumsal Yazılım & Bitcoin Hazinesi",
    "exchange": "ABD",
    "assetClass": "hisse",
    "indexTag": "NASDAQ 100",
    "price": 145,
    "currency": "$",
    "dailyChange": 6.85,
    "peRatio": 45,
    "pbRatio": 8.2,
    "dividendYield": 0,
    "marketCap": "29 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "MicroStrategy Incorporated (MSTR), ABD borsalarında Kurumsal Yazılım & Bitcoin Hazinesi alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "45x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "8.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "asml",
    "symbol": "ASML",
    "name": "ASML Holding N.V.",
    "sector": "Yarı İletken Litografi Ekipmanı",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "Avrupa",
    "price": 785,
    "currency": "€",
    "dailyChange": 2.35,
    "peRatio": 38.5,
    "pbRatio": 18,
    "dividendYield": 0.95,
    "marketCap": "312 Mr €",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "ASML Holding N.V. (ASML), Avrupa borsalarında Yarı İletken Litografi Ekipmanı alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "38.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "18",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "sap",
    "symbol": "SAP",
    "name": "SAP SE",
    "sector": "Kurumsal Yazılım & Bulut",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "Avrupa",
    "price": 198,
    "currency": "€",
    "dailyChange": 1.45,
    "peRatio": 34,
    "pbRatio": 5.2,
    "dividendYield": 1.15,
    "marketCap": "235 Mr €",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "SAP SE (SAP), Avrupa borsalarında Kurumsal Yazılım & Bulut alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "34x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.2",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "lvmh",
    "symbol": "LVMH",
    "name": "LVMH Moët Hennessy Louis Vuitton",
    "sector": "Lüks Tüketim Malları",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "Avrupa",
    "price": 642,
    "currency": "€",
    "dailyChange": 0.85,
    "peRatio": 22.5,
    "pbRatio": 5.1,
    "dividendYield": 2.05,
    "marketCap": "322 Mr €",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "LVMH Moët Hennessy Louis Vuitton (LVMH), Avrupa borsalarında Lüks Tüketim Malları alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "22.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "5.1",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "novo",
    "symbol": "NOVO",
    "name": "Novo Nordisk (Ozempic & Wegovy)",
    "sector": "İlaç & Sağlık",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "Avrupa",
    "price": 118,
    "currency": "$",
    "dailyChange": 1.95,
    "peRatio": 36,
    "pbRatio": 24,
    "dividendYield": 1.2,
    "marketCap": "528 Mr $",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Novo Nordisk (Ozempic & Wegovy) (NOVO), Avrupa borsalarında İlaç & Sağlık alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "36x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "24",
        "peerAvg": "10.0"
      }
    ]
  },
  {
    "id": "tte",
    "symbol": "TTE",
    "name": "TotalEnergies SE",
    "sector": "Entegre Petrol & Gaz / Yeşil Enerji",
    "exchange": "Avrupa",
    "assetClass": "hisse",
    "indexTag": "Avrupa",
    "price": 62.5,
    "currency": "€",
    "dailyChange": 0.65,
    "peRatio": 7.8,
    "pbRatio": 1.15,
    "dividendYield": 5.1,
    "marketCap": "148 Mr €",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "TotalEnergies SE (TTE), Avrupa borsalarında Entegre Petrol & Gaz / Yeşil Enerji alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "7.8x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "1.15",
        "peerAvg": "10.0"
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
    "indexTag": "Avrupa",
    "price": 134,
    "currency": "€",
    "dailyChange": 1.15,
    "peRatio": 24.5,
    "pbRatio": 6.8,
    "dividendYield": 1.45,
    "marketCap": "106 Mr €",
    "beta": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Airbus SE (AIR), Avrupa borsalarında Ticari Havacılık & Savunma alanında işlem gören küresel teknoloji ve piyasa lideri.",
    "metrics": [
      {
        "label": "F/K Oranı",
        "value": "24.5x",
        "peerAvg": "32.0x"
      },
      {
        "label": "PD/DD",
        "value": "6.8",
        "peerAvg": "10.0"
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
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "BIST 100",
    "price": 0.482,
    "currency": "₺",
    "dailyChange": 1.95,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Apple, Microsoft, Nvidia, Google hisselerine TL bazında tek payla yatırım.",
    "metrics": []
  },
  {
    "id": "mac",
    "symbol": "MAC",
    "name": "Marmara Capital Portföy Hisse Senedi Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "BIST 100",
    "price": 1.842,
    "currency": "₺",
    "dailyChange": 1.45,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Değer yatırımı felsefesiyle BIST'in iskontolu şirketlerini toplayan aktif hisse fonu.",
    "metrics": []
  },
  {
    "id": "ti1",
    "symbol": "TI1",
    "name": "İş Portföy BIST 30 Endeksi Hisse Senedi Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "BIST 30",
    "price": 2.15,
    "currency": "₺",
    "dailyChange": 1.65,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "BIST 30 endeks ağırlıklarını birebir yansıtan düşük giderli endeks fonu.",
    "metrics": []
  },
  {
    "id": "yay",
    "symbol": "YAY",
    "name": "Yapı Kredi Portföy Yabancı Teknoloji Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "NASDAQ 100",
    "price": 1.34,
    "currency": "₺",
    "dailyChange": 1.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yarı iletken, yapay zeka ve siber güvenlik odaklı yabancı hisse senedi sepeti.",
    "metrics": []
  },
  {
    "id": "iih",
    "symbol": "IIH",
    "name": "İstanbul Portföy Üçüncü Hisse Senedi Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "BIST 100",
    "price": 0.92,
    "currency": "₺",
    "dailyChange": 1.95,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "BIST 100 dışı potansiyeli yüksek büyüme (Growth) şirketlerini toplayan aktif fon.",
    "metrics": []
  },
  {
    "id": "gmr",
    "symbol": "GMR",
    "name": "Inveo Portföy İkinci Hisse Senedi Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "BIST 100",
    "price": 2.45,
    "currency": "₺",
    "dailyChange": 1.75,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Döngüsel sektörlerde ve sanayi ihracat şirketlerinde aktif hisse fonu.",
    "metrics": []
  },
  {
    "id": "kzl",
    "symbol": "KZL",
    "name": "Kuveyt Türk Altın Katılım Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "Kıymetli Maden",
    "price": 0.084,
    "currency": "₺",
    "dailyChange": 0.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Faizsiz katılım esaslarına uygun fiziki altın katılım fonu.",
    "metrics": []
  },
  {
    "id": "tcd",
    "symbol": "TCD",
    "name": "Tacirler Portföy Değişken Fon",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "BIST 100",
    "price": 6.85,
    "currency": "₺",
    "dailyChange": 1.25,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Varlık dağılımını piyasa koşullarına göre aktif değiştiren çoklu varlık fonu.",
    "metrics": []
  },
  {
    "id": "bio",
    "symbol": "BIO",
    "name": "Ak Portföy Sağlık Sektörü Yabancı Hisse Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "S&P 500",
    "price": 0.385,
    "currency": "₺",
    "dailyChange": 0.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Küresel ilaç, biyoteknoloji ve medikal cihaz şirketleri fonu.",
    "metrics": []
  },
  {
    "id": "buy",
    "symbol": "BUY",
    "name": "Garanti Portföy Blockchain ve Fintek Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "NASDAQ 100",
    "price": 0.525,
    "currency": "₺",
    "dailyChange": 2.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Blokzincir, kripto madencilik ve dijital ödeme fintek hisseleri.",
    "metrics": []
  },
  {
    "id": "ihk",
    "symbol": "IHK",
    "name": "İş Portföy İş'te Kadın Hisse Senedi Fonu",
    "sector": "Yatırım Fonları (TEFAS)",
    "exchange": "BIST",
    "assetClass": "fon",
    "indexTag": "BIST 100",
    "price": 1.15,
    "currency": "₺",
    "dailyChange": 1.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yönetiminde kadın liderliği yüksek sürdürülebilir BIST şirketleri.",
    "metrics": []
  },
  {
    "id": "qqq",
    "symbol": "QQQ",
    "name": "Invesco QQQ Trust (NASDAQ 100 ETF)",
    "sector": "Borsa Yatırım Fonu (ETF)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "NASDAQ 100",
    "price": 492.5,
    "currency": "$",
    "dailyChange": 1.25,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "NASDAQ-100 endeksini birebir takip eden dünyanın en likit teknoloji ETF'i.",
    "metrics": []
  },
  {
    "id": "spy",
    "symbol": "SPY",
    "name": "SPDR S&P 500 ETF Trust",
    "sector": "Borsa Yatırım Fonu (ETF)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "S&P 500",
    "price": 564.8,
    "currency": "$",
    "dailyChange": 0.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ABD'nin en büyük 500 şirketine dengeli borsa yatırım fonu.",
    "metrics": []
  },
  {
    "id": "voo",
    "symbol": "VOO",
    "name": "Vanguard S&P 500 ETF",
    "sector": "Borsa Yatırım Fonu (ETF)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "S&P 500",
    "price": 518,
    "currency": "$",
    "dailyChange": 0.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "%0.03 ultra düşük gider oranlı Vanguard S&P 500 endeks fonu.",
    "metrics": []
  },
  {
    "id": "gld",
    "symbol": "GLD",
    "name": "SPDR Gold Shares (Fiziki Altın ETF)",
    "sector": "Borsa Yatırım Fonu (ETF)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "Kıymetli Maden",
    "price": 245.8,
    "currency": "$",
    "dailyChange": 0.42,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Londra kasalarında saklanan %100 fiziki külçe altın karşılığı küresel altın ETF'i.",
    "metrics": []
  },
  {
    "id": "slv",
    "symbol": "SLV",
    "name": "iShares Silver Trust (Fiziki Gümüş ETF)",
    "sector": "Borsa Yatırım Fonu (ETF)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "Kıymetli Maden",
    "price": 29.1,
    "currency": "$",
    "dailyChange": 1.85,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "BlackRock iShares fiziki gümüş saklama borsa yatırım fonu.",
    "metrics": []
  },
  {
    "id": "smh",
    "symbol": "SMH",
    "name": "VanEck Semiconductor ETF (Yarı İletken)",
    "sector": "Borsa Yatırım Fonu (ETF)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "NASDAQ 100",
    "price": 248,
    "currency": "$",
    "dailyChange": 2.85,
    "recommendation": "AL",
    "inWatchlist": true,
    "description": "Nvidia, TSMC, ASML, Broadcom ve AMD ağırlıklı mikroçip ETF'i.",
    "metrics": []
  },
  {
    "id": "arkk",
    "symbol": "ARKK",
    "name": "ARK Innovation ETF (Cathie Wood)",
    "sector": "Borsa Yatırım Fonu (ETF)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "NASDAQ 100",
    "price": 46.5,
    "currency": "$",
    "dailyChange": 3.45,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "Yıkıcı inovasyon, genomik ve yapay zeka odaklı aktif büyüme ETF'i.",
    "metrics": []
  },
  {
    "id": "dia",
    "symbol": "DIA",
    "name": "SPDR Dow Jones Industrial Average ETF",
    "sector": "Borsa Yatırım Fonu (ETF)",
    "exchange": "ABD",
    "assetClass": "fon",
    "indexTag": "S&P 500",
    "price": 412,
    "currency": "$",
    "dailyChange": 0.35,
    "recommendation": "AL",
    "inWatchlist": false,
    "description": "ABD'nin köklü 30 sanayi ve finans devini içeren Dow Jones endeksi ETF'i.",
    "metrics": []
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
