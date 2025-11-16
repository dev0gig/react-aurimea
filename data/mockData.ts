import React from 'react';

export interface Card {
  id: number;
  title: string;
  number: string;
  holder: string;
  expiry: string;
  color: string;
}

export const cards: Card[] = [];

export interface Transaction {
    id: number | string;
    cardId: number;
    name: string;
    category: string;
    date: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    transferId?: number;
    isFixedCost?: boolean;
    billingDay?: number;
    frequency?: 'monthly' | 'bimonthly' | 'quarterly' | 'semi-annually' | 'annually';
    endDate?: string;
    isFuture?: boolean;
}

// FIX: Export FixedCost as a type alias for Transaction to resolve import errors.
export type FixedCost = Transaction;

type RawTransaction = Omit<Transaction, 'id' | 'type' | 'cardId' | 'transferId' | 'isFixedCost' | 'billingDay' | 'frequency'>;

const card1TransactionsData: RawTransaction[] = [];

const tradeRepublicTransactionsData: RawTransaction[] = [];

const card3TransactionsData: RawTransaction[] = [];

const revolutTransactionsData: RawTransaction[] = [];

const processTransactions = (): Transaction[] => {
  const card1Data = [...card1TransactionsData];
  const card2Data = [...tradeRepublicTransactionsData];
  const card3Data = [...card3TransactionsData];
  const card4Data = [...revolutTransactionsData];
  
  const transfers: Transaction[] = [];
  const processedIndicesCard1 = new Set<number>();
  const processedIndicesCard2 = new Set<number>();
  const processedIndicesCard3 = new Set<number>();
  const processedIndicesCard4 = new Set<number>();

  // Process transfers between Card 1 (Erste Bank) and Card 2 (Trade Republic)
  card1Data.forEach((t1, index1) => {
    if (t1.amount < 0 && t1.name.toLowerCase().includes('traderepublic')) {
      const potentialMatchIndex = card2Data.findIndex((t2, index2) => {
        if (processedIndicesCard2.has(index2)) return false;
        const date1 = new Date(t1.date);
        const date2 = new Date(t2.date);
        const dateDiff = Math.abs(date1.getTime() - date2.getTime());
        const daysDiff = dateDiff / (1000 * 3600 * 24);
        return (t2.amount > 0 && Math.abs(t1.amount) === t2.amount && daysDiff <= 3);
      });

      if (potentialMatchIndex > -1) {
        const t2 = card2Data[potentialMatchIndex];
        const transferId = Date.now() + index1;
        transfers.push(
          { id: `transfer-src-${transferId}`, cardId: 1, name: 'Übertrag an Trade Republic', category: 'Übertrag', date: t1.date, amount: t1.amount, type: 'transfer', transferId },
          { id: `transfer-dest-${transferId}`, cardId: 2, name: 'Übertrag von Erste Bank', category: 'Übertrag', date: t2.date, amount: t2.amount, type: 'transfer', transferId }
        );
        processedIndicesCard1.add(index1);
        processedIndicesCard2.add(potentialMatchIndex);
      }
    }
  });
  
  // Process transfers between Card 1 (Erste Bank) and Card 3 (Revolut Joint)
   card1Data.forEach((t1, index1) => {
    if (processedIndicesCard1.has(index1)) return;
    if (t1.amount < 0 && t1.name.toLowerCase().includes('revolut gemeinsames konto')) {
      const potentialMatchIndex = card3Data.findIndex((t3, index3) => {
        if (processedIndicesCard3.has(index3)) return false;
        const date1 = new Date(t1.date);
        const date3 = new Date(t3.date);
        const dateDiff = Math.abs(date1.getTime() - date3.getTime());
        const daysDiff = dateDiff / (1000 * 3600 * 24);
        return (t3.amount > 0 && Math.abs(t1.amount) === t3.amount && daysDiff <= 3);
      });

      if (potentialMatchIndex > -1) {
        const t3 = card3Data[potentialMatchIndex];
        const transferId = Date.now() + index1 + 10000;
        transfers.push(
          { id: `transfer-src-${transferId}`, cardId: 1, name: 'Übertrag an Revolut Joint', category: 'Übertrag', date: t1.date, amount: t1.amount, type: 'transfer', transferId },
          { id: `transfer-dest-${transferId}`, cardId: 3, name: 'Übertrag von Erste Bank', category: 'Übertrag', date: t3.date, amount: t3.amount, type: 'transfer', transferId }
        );
        processedIndicesCard1.add(index1);
        processedIndicesCard3.add(potentialMatchIndex);
      }
    }
  });

    // Process transfers between Card 1 (Erste Bank) and Card 4 (Mein Revolut)
    card1Data.forEach((t1, index1) => {
        if (processedIndicesCard1.has(index1)) return;
        // Heuristic: Check for a specific naming convention from Erste Bank for Revolut top-ups
        if (t1.amount < 0 && t1.name.toLowerCase().startsWith('revolut**')) {
            const potentialMatchIndex = card4Data.findIndex((t4, index4) => {
                if (processedIndicesCard4.has(index4)) return false;
                const date1 = new Date(t1.date);
                const date4 = new Date(t4.date);
                const dateDiff = Math.abs(date1.getTime() - date4.getTime());
                const daysDiff = dateDiff / (1000 * 3600 * 24);
                // Heuristic: Match a negative amount from bank with a positive "Einzahlung" on Revolut within a few days
                return (t4.amount > 0 && Math.abs(t1.amount) === t4.amount && t4.category === 'Einzahlung' && daysDiff <= 3);
            });

            if (potentialMatchIndex > -1) {
                const t4 = card4Data[potentialMatchIndex];
                const transferId = Date.now() + index1 + 20000; // Use a unique offset
                transfers.push(
                    { id: `transfer-src-${transferId}`, cardId: 1, name: 'Übertrag an Mein Revolut', category: 'Übertrag', date: t1.date, amount: t1.amount, type: 'transfer', transferId },
                    { id: `transfer-dest-${transferId}`, cardId: 4, name: 'Übertrag von Erste Bank', category: 'Übertrag', date: t4.date, amount: t4.amount, type: 'transfer', transferId }
                );
                processedIndicesCard1.add(index1);
                processedIndicesCard4.add(potentialMatchIndex);
            }
        }
    });

  const remainingCard1Data = card1Data.filter((_, index) => !processedIndicesCard1.has(index));
  const remainingCard2Data = card2Data.filter((_, index) => !processedIndicesCard2.has(index));
  const remainingCard3Data = card3Data.filter((_, index) => !processedIndicesCard3.has(index));
  const remainingCard4Data = card4Data.filter((_, index) => !processedIndicesCard4.has(index));

  const regularTransactionsCard1: Transaction[] = remainingCard1Data.map((t, index) => ({
    ...t, id: `c1-reg-${Date.now() + index}`, cardId: 1, type: t.amount > 0 ? 'income' : 'expense',
  }));
  const regularTransactionsCard2: Transaction[] = remainingCard2Data.map((t, index) => ({
    ...t, id: `c2-reg-${Date.now() + index}`, cardId: 2, type: t.amount > 0 ? 'income' : 'expense',
  }));
   const regularTransactionsCard3: Transaction[] = remainingCard3Data.map((t, index) => ({
    ...t, id: `c3-reg-${Date.now() + index}`, cardId: 3, type: t.amount > 0 ? 'income' : 'expense',
  }));
  const regularTransactionsCard4: Transaction[] = remainingCard4Data.map((t, index) => ({
    ...t, id: `c4-reg-${Date.now() + index}`, cardId: 4, type: t.amount > 0 ? 'income' : 'expense',
  }));


  return [...transfers, ...regularTransactionsCard1, ...regularTransactionsCard2, ...regularTransactionsCard3, ...regularTransactionsCard4];
};

export const transactions: Transaction[] = processTransactions();