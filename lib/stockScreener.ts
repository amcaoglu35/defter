import { Company } from "./mockData";

export type ScreenerField =
  | "peRatio"
  | "pbRatio"
  | "dividendYield"
  | "marketCap"
  | "dailyChange"
  | "price"
  | "returnOnEquity"
  | "beta"
  | "sector"
  | "exchange"
  | "rsi";

export type ScreenerOperator = "LT" | "LTE" | "GT" | "GTE" | "EQ" | "IN";

export interface ScreenerCriterion {
  id?: string;
  field: ScreenerField;
  operator: ScreenerOperator;
  value: number | string | string[];
}

export interface ScreenerQuery {
  criteria: ScreenerCriterion[];
  sortBy?: "peRatio" | "pbRatio" | "dividendYield" | "marketCap" | "dailyChange" | "price" | "returnOnEquity";
  sortDir?: "asc" | "desc";
}

/**
 * Parses market cap string (e.g. "150 Mr ₺", "450 Mn $", "1.2 Milyar ₺") to numeric value in millions.
 */
export function parseMarketCapToNumeric(val?: string | number): number | null {
  if (typeof val === "number") return val;
  if (!val || typeof val !== "string") return null;

  const clean = val.replace(",", ".").toLowerCase();
  const numMatch = clean.match(/[\d.]+/);
  if (!numMatch) return null;

  const baseNum = parseFloat(numMatch[0]);
  if (isNaN(baseNum)) return null;

  if (clean.includes("mr") || clean.includes("milyar") || clean.includes("b")) {
    return baseNum * 1000; // in Millions
  }
  return baseNum; // already in millions or base
}

/**
 * Checks whether a single company matches a screener criterion.
 * Safely filters out records where target property is undefined/missing for numeric comparisons.
 */
export function evaluateCriterion(company: Company, criterion: ScreenerCriterion): boolean {
  const { field, operator, value } = criterion;

  if (field === "sector") {
    const compSector = (company.sector || "").toLowerCase().trim();
    if (operator === "EQ") {
      return compSector === String(value).toLowerCase().trim();
    }
    if (operator === "IN" && Array.isArray(value)) {
      return value.map((v) => String(v).toLowerCase().trim()).includes(compSector);
    }
    return true;
  }

  if (field === "exchange") {
    const compEx = (company.exchange || "").toLowerCase().trim();
    if (operator === "EQ") {
      return compEx === String(value).toLowerCase().trim();
    }
    return true;
  }

  // Numeric fields
  let compVal: number | null = null;
  if (field === "marketCap") {
    compVal = parseMarketCapToNumeric(company.marketCap);
  } else {
    const raw = company[field as keyof Company];
    if (typeof raw === "number" && !isNaN(raw)) {
      compVal = raw;
    }
  }

  // Zero-mock/Strict rule: If the company does not have this metric, exclude it from numeric comparisons
  if (compVal === null || compVal === undefined) {
    return false;
  }

  const targetNum = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(targetNum)) return false;

  switch (operator) {
    case "LT":
      return compVal < targetNum;
    case "LTE":
      return compVal <= targetNum;
    case "GT":
      return compVal > targetNum;
    case "GTE":
      return compVal >= targetNum;
    case "EQ":
      return Math.abs(compVal - targetNum) < 0.001;
    default:
      return true;
  }
}

/**
 * Pure deterministic screener function (zero AI overhead, runs in < 2ms on 500+ records).
 */
export function runScreener(companies: Company[], query: ScreenerQuery): Company[] {
  if (!companies || companies.length === 0) return [];
  if (!query.criteria || query.criteria.length === 0) return companies;

  // Filter with AND logic across all criteria
  const filtered = companies.filter((company) => {
    return query.criteria.every((crit) => evaluateCriterion(company, crit));
  });

  // Sort if requested
  if (query.sortBy) {
    const sortField = query.sortBy;
    const sortMultiplier = query.sortDir === "desc" ? -1 : 1;

    filtered.sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      if (sortField === "marketCap") {
        valA = parseMarketCapToNumeric(a.marketCap) ?? 0;
        valB = parseMarketCapToNumeric(b.marketCap) ?? 0;
      } else {
        valA = (a[sortField as keyof Company] as number) ?? 0;
        valB = (b[sortField as keyof Company] as number) ?? 0;
      }

      return (valA - valB) * sortMultiplier;
    });
  }

  return filtered;
}
