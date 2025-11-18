
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as db from '../components/db';
import { cards as initialCards, Card, transactions as initialTransactions, Transaction } from '../data/mockData';
import { generateRecurringTransactions } from '../utils/financeUtils';

interface FinanceContextType {
  cards: Card[];
  transactions: Transaction[];
  manualTransactions: Transaction[];
  isLoading: boolean;
  includedCards: Card[];
  excludedCards: Card[];
  transactionsForIncludedCards: Transaction[];
  fixedCostsForDashboard: Transaction[];
  addCard: (card: Omit<Card, 'id'>) => Promise<void>;
  updateCard: (card: Card) => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  updateTransaction: (data: any) => Promise<void>;
  deleteTransaction: (id: number | string) => Promise<void>;
  deleteAllData: () => Promise<void>;
  importData: (data: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [manualTransactions, setManualTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      await db.initDB();
      const [dbCards, dbManualTransactions] = await Promise.all([
        db.getAll<Card>(db.STORES.cards),
        db.getAll<Transaction>(db.STORES.manualTransactions),
      ]);

      const processCards = (cardList: Card[]) => cardList.map(c => ({ ...c, includeInTotals: c.includeInTotals ?? true }));

      if (dbCards.length === 0 && dbManualTransactions.length === 0) {
        const processedCards = processCards(initialCards);
        await Promise.all([
          db.bulkAdd(db.STORES.cards, processedCards),
          db.bulkAdd(db.STORES.manualTransactions, initialTransactions),
        ]);
        setCards(processedCards);
        setManualTransactions(initialTransactions);
      } else {
        setCards(processCards(dbCards));
        setManualTransactions(dbManualTransactions);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const transactions = useMemo(() => generateRecurringTransactions(manualTransactions), [manualTransactions]);
  
  const includedCards = useMemo(() => cards.filter(c => c.includeInTotals ?? true), [cards]);
  const excludedCards = useMemo(() => cards.filter(c => !(c.includeInTotals ?? true)), [cards]);

  const transactionsForIncludedCards = useMemo(() => {
    const includedCardIds = new Set(includedCards.map(c => c.id));
    return transactions.filter(t => includedCardIds.has(t.cardId));
  }, [transactions, includedCards]);

  const fixedCostsForDashboard = useMemo(() => {
    const includedCardIds = new Set(includedCards.map(c => c.id));
    return manualTransactions.filter(t => t.isFixedCost && includedCardIds.has(t.cardId));
  }, [manualTransactions, includedCards]);

  // CRUD Operations
  const addCard = async (newCardData: Omit<Card, 'id'>) => {
    const newCard: Card = { ...newCardData, id: Date.now() };
    await db.add(db.STORES.cards, newCard);
    setCards(prev => [...prev, newCard]);
  };

  const updateCard = async (updatedCard: Card) => {
    await db.put(db.STORES.cards, updatedCard);
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const addTransaction = async (newTransactionData: any) => {
    let newTransactionsToAdd: Transaction[] = [];
    
    if (newTransactionData.type === 'transfer') {
        const { destinationCardId, amount, cardId, date, name, isFixedCost, billingDay, frequency } = newTransactionData;
        const sourceCard = cards.find(c => c.id === cardId);
        const destCard = cards.find(c => c.id === destinationCardId);
  
        if (!destinationCardId || !sourceCard || !destCard) return;
  
        const transferId = Date.now();
        const sourceTransaction: Transaction = {
            id: `transfer-source-${transferId}`,
            cardId: cardId,
            name: name || `Übertrag an ${destCard.title}`,
            category: isFixedCost ? 'Fixkosten' : 'Übertrag',
            date: date,
            amount: -amount,
            type: 'transfer',
            transferId: transferId,
            isFixedCost, billingDay, frequency,
        };
        const destTransaction: Transaction = {
            id: `transfer-dest-${transferId}`,
            cardId: destinationCardId,
            name: name || `Übertrag von ${sourceCard.title}`,
            category: isFixedCost ? 'Fixkosten' : 'Übertrag',
            date: date,
            amount: amount,
            type: 'transfer',
            transferId: transferId,
            isFixedCost, billingDay, frequency,
        };
        newTransactionsToAdd.push(sourceTransaction, destTransaction);
    } else {
        const finalAmount = newTransactionData.type === 'income' ? newTransactionData.amount : -newTransactionData.amount;
        const newTransaction: Transaction = {
          ...newTransactionData,
          id: Date.now(),
          amount: finalAmount,
        };
        newTransactionsToAdd.push(newTransaction);
    }
    
    for (const trans of newTransactionsToAdd) {
        await db.add(db.STORES.manualTransactions, trans);
    }
    setManualTransactions(prev => [...prev, ...newTransactionsToAdd]);
  };

  const updateTransaction = async (updatePayload: any) => {
    const originalTransaction = manualTransactions.find(t => t.id === updatePayload.id);
    if (!originalTransaction) return;

    // Robust Strategy: Delete old transaction(s) entirely and create new ones from scratch based on payload.
    // This handles type switching (Expense <-> Transfer) and amount changes cleanly without patching.
    
    // 1. Delete old transaction(s) from DB and State
    let currentTransactions = [...manualTransactions];
    const idsToDelete: (number | string)[] = [];

    if (originalTransaction.type === 'transfer' && originalTransaction.transferId) {
        const transferId = originalTransaction.transferId;
        const transactionsInTransfer = currentTransactions.filter(t => t.transferId === transferId);
        transactionsInTransfer.forEach(t => idsToDelete.push(t.id));
    } else {
        idsToDelete.push(originalTransaction.id);
    }

    for (const id of idsToDelete) {
        await db.deleteItem(db.STORES.manualTransactions, id);
    }
    currentTransactions = currentTransactions.filter(t => !idsToDelete.includes(t.id));

    // 2. Create new transaction(s) based on updatePayload
    let newTransactions: Transaction[] = [];

    if (updatePayload.type === 'transfer') {
        const { destinationCardId, amount, cardId, date, name, isFixedCost, billingDay, frequency } = updatePayload;
        const transferId = originalTransaction.transferId || Date.now(); // Keep existing transfer ID if possible or new
        const sourceCard = cards.find(c => c.id === cardId);
        const destCard = cards.find(c => c.id === destinationCardId);
        
        if (sourceCard && destCard && destinationCardId) {
            newTransactions.push({
                id: typeof originalTransaction.id === 'number' ? originalTransaction.id : Date.now(), // Try to preserve ID for the main edit
                cardId: cardId,
                name: name || `Übertrag an ${destCard.title}`,
                category: isFixedCost ? 'Fixkosten' : 'Übertrag',
                date: date,
                amount: -amount,
                type: 'transfer',
                transferId, isFixedCost, billingDay, frequency
            });
            // Determine ID for the partner transaction
            const partnerId = idsToDelete.find(id => id !== originalTransaction.id) || `transfer-dest-${transferId}`;
            newTransactions.push({
                id: partnerId,
                cardId: destinationCardId,
                name: name || `Übertrag von ${sourceCard.title}`,
                category: isFixedCost ? 'Fixkosten' : 'Übertrag',
                date: date,
                amount: amount,
                type: 'transfer',
                transferId, isFixedCost, billingDay, frequency
            });
        }
    } else {
        const finalAmount = updatePayload.type === 'income' ? updatePayload.amount : -updatePayload.amount;
        newTransactions.push({
            id: originalTransaction.id, // Preserve ID
            cardId: updatePayload.cardId,
            name: updatePayload.name,
            category: updatePayload.isFixedCost ? 'Fixkosten' : updatePayload.category,
            date: updatePayload.date,
            amount: finalAmount,
            type: updatePayload.type,
            isFixedCost: updatePayload.isFixedCost,
            billingDay: updatePayload.billingDay,
            frequency: updatePayload.frequency,
            transferId: undefined // Ensure transferId is cleared if switching from transfer
        });
    }

    // 3. Add new transactions to DB and State
    for(const t of newTransactions) {
        await db.add(db.STORES.manualTransactions, t);
    }
    
    setManualTransactions([...currentTransactions, ...newTransactions]);
  };

  const deleteTransaction = async (id: number | string) => {
      let idToDelete = id;
      if (typeof id === 'string' && id.startsWith('fc-')) {
          idToDelete = parseInt(id.split('-')[1], 10);
      }
      
      const transactionToDelete = manualTransactions.find(t => t.id === idToDelete);
      if (!transactionToDelete) return;

      if (transactionToDelete.type === 'transfer' && transactionToDelete.transferId) {
          const transferId = transactionToDelete.transferId;
          const all = manualTransactions.filter(t => t.transferId === transferId);
          for (const t of all) await db.deleteItem(db.STORES.manualTransactions, t.id);
          setManualTransactions(prev => prev.filter(t => t.transferId !== transferId));
      } else {
          await db.deleteItem(db.STORES.manualTransactions, idToDelete);
          setManualTransactions(prev => prev.filter(t => t.id !== idToDelete));
      }
  };

  const deleteAllData = async () => {
      await Promise.all([
        db.clearStore(db.STORES.cards),
        db.clearStore(db.STORES.manualTransactions),
      ]);
      setCards([]);
      setManualTransactions([]);
  };

  const importData = async (data: any) => {
      if (Array.isArray(data.cards) && Array.isArray(data.manualTransactions)) {
          await deleteAllData();
          await Promise.all([
            db.bulkAdd(db.STORES.cards, data.cards),
            db.bulkAdd(db.STORES.manualTransactions, data.manualTransactions),
          ]);
          setCards(data.cards.map((c: Card) => ({...c, includeInTotals: c.includeInTotals ?? true})));
          setManualTransactions(data.manualTransactions);
      }
  };

  return (
    <FinanceContext.Provider value={{
      cards,
      transactions,
      manualTransactions,
      isLoading,
      includedCards,
      excludedCards,
      transactionsForIncludedCards,
      fixedCostsForDashboard,
      addCard,
      updateCard,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      deleteAllData,
      importData,
      refreshData: loadData
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
