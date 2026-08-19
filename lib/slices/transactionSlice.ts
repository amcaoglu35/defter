/**
 * Defter — Domain Slice: Transaction Ledger & Cost Accounting Integration
 */

import { TransactionRecord, calculatePortfolioCostBasis, CostBasisMethod, PortfolioCostBasisReport } from "../costBasis";

export type { TransactionRecord };

export function addTransactionRecord(
  transactions: TransactionRecord[],
  newTx: Omit<TransactionRecord, "id">
): TransactionRecord[] {
  const record: TransactionRecord = {
    ...newTx,
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
  return [record, ...transactions];
}

export function updateTransactionRecord(
  transactions: TransactionRecord[],
  id: string,
  updates: Partial<TransactionRecord>
): TransactionRecord[] {
  return transactions.map((t) => (t.id === id ? { ...t, ...updates } : t));
}

export function deleteTransactionRecord(
  transactions: TransactionRecord[],
  id: string
): TransactionRecord[] {
  return transactions.filter((t) => t.id !== id);
}

export function getPortfolioCostReport(
  transactions: TransactionRecord[],
  prices: Record<string, number> = {},
  method: CostBasisMethod = "FIFO"
): PortfolioCostBasisReport {
  return calculatePortfolioCostBasis(transactions, prices, method);
}
