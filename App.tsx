
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import TransactionsPage from './components/TransactionsPage';
import StatisticsPage from './components/StatisticsPage';
import SearchModal from './components/SearchModal';
import AddTransactionModal from './components/AddTransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import ConfirmationModal from './components/ConfirmationModal';
import SettingsModal from './components/SettingsModal';
import EditCardModal from './components/EditCardModal';
import MobileNav from './components/MobileNav';
import * as db from './components/db';
import { 
  cards as initialCards, 
  Card, 
  transactions as initialTransactions, 
  Transaction
} from './data/mockData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Übersicht');
  const [cards, setCards] = useState<Card[]>([]);
  const [manualTransactions, setManualTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | string | null>(null);
  
  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [cardIdForNewTransaction, setCardIdForNewTransaction] = useState<number | null>(null);
  const [isEditTransactionModalOpen, setEditTransactionModalOpen] = useState(false);
  const [isEditCardModalOpen, setEditCardModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isDeleteAllConfirmationOpen, setDeleteAllConfirmationOpen] = useState(false);
  
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: number | string; type: 'transaction' } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initDB();
        const [dbCards, dbManualTransactions] = await Promise.all([
          db.getAll<Card>(db.STORES.cards),
          db.getAll<Transaction>(db.STORES.manualTransactions),
        ]);

        if (dbCards.length === 0 && dbManualTransactions.length === 0) {
          // First time load, populate DB with mock data
          await Promise.all([
            db.bulkAdd(db.STORES.cards, initialCards),
            db.bulkAdd(db.STORES.manualTransactions, initialTransactions),
          ]);
          setCards(initialCards);
          setManualTransactions(initialTransactions);
          if (initialCards.length > 0) {
            setSelectedCardId(initialCards[0].id);
          }
        } else {
          setCards(dbCards);
          setManualTransactions(dbManualTransactions);
           if (dbCards.length > 0) {
            setSelectedCardId(dbCards[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load data from IndexedDB", error);
        // Fallback to initial data if DB fails
        setCards(initialCards);
        setManualTransactions(initialTransactions);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);


  const navItems = ['Übersicht', 'Transaktionen', 'Statistiken'];

  const combinedTransactions = useMemo(() => {
    const fixedCostTemplates = manualTransactions.filter(t => t.isFixedCost);
    const generatedTransactions: Transaction[] = [];
    
    const viennaTimeZone = 'Europe/Vienna';
    const now = new Date();
    
    const todayViennaStr = now.toLocaleDateString('en-CA', { timeZone: viennaTimeZone });
    const today = new Date(`${todayViennaStr}T00:00:00.000Z`);
    
    const [currentViennaYear, currentViennaMonth] = todayViennaStr.split('-').map(Number);
    const currentViennaMonthIndex = currentViennaMonth - 1; // JS month is 0-indexed

    for (let i = -12; i <= 24; i++) {
      const targetDate = new Date(Date.UTC(currentViennaYear, currentViennaMonthIndex + i, 1));
      const targetYear = targetDate.getUTCFullYear();
      const targetMonth = targetDate.getUTCMonth();

      fixedCostTemplates.forEach(fc => {
        if (fc.billingDay) {
          const templateStartDate = new Date(fc.date);
          const templateEndDate = fc.endDate ? new Date(fc.endDate) : null;
          const templateStartYear = templateStartDate.getUTCFullYear();
          const templateStartMonth = templateStartDate.getUTCMonth();

          const monthsDiff = (targetYear - templateStartYear) * 12 + (targetMonth - templateStartMonth);
          if (monthsDiff < 0) return;

          let shouldGenerate = false;
          const frequency = fc.frequency || 'monthly';
          switch (frequency) {
            case 'monthly': shouldGenerate = true; break;
            case 'bimonthly': shouldGenerate = monthsDiff % 2 === 0; break;
            case 'quarterly': shouldGenerate = monthsDiff % 3 === 0; break;
            case 'semi-annually': shouldGenerate = monthsDiff % 6 === 0; break;
            case 'annually': shouldGenerate = monthsDiff % 12 === 0; break;
            default: shouldGenerate = true;
          }

          if (shouldGenerate) {
            const daysInMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
            const day = Math.min(fc.billingDay, daysInMonth);
            const transactionFullDate = new Date(Date.UTC(targetYear, targetMonth, day));
            
            if (templateEndDate && transactionFullDate > templateEndDate) {
                return; 
            }

            generatedTransactions.push({
              ...fc,
              id: `fc-${fc.id}-${targetYear}-${targetMonth}`,
              date: transactionFullDate.toISOString().split('T')[0],
              category: 'Fixkosten',
              isFuture: transactionFullDate > today,
            });
          }
        }
      });
    }

    const allTransactions = [
      ...manualTransactions.filter(t => !t.isFixedCost),
      ...generatedTransactions
    ];

    const uniqueTransactions = Array.from(new Map(allTransactions.map(t => [t.id, t])).values());

    return uniqueTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [manualTransactions]);

  const handleAddCard = async (newCardData: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...newCardData,
      id: Date.now(),
    };
    await db.add(db.STORES.cards, newCard);
    setCards(prevCards => [...prevCards, newCard]);
    setSelectedCardId(newCard.id);
  };

  const handleOpenEditCardModal = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setCardToEdit(card);
      setEditCardModalOpen(true);
    }
  };

  const handleUpdateCard = async (updatedCard: Card) => {
    await db.put(db.STORES.cards, updatedCard);
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    setEditCardModalOpen(false);
  };

  const handleOpenAddTransactionModal = (cardId: number | null) => {
    setCardIdForNewTransaction(cardId);
    setAddTransactionModalOpen(true);
  };

  const handleAddTransaction = async (newTransactionData: {
    name: string;
    amount: number;
    date: string;
    category: string;
    cardId: number;
    type: 'income' | 'expense' | 'transfer';
    destinationCardId?: number;
    isFixedCost?: boolean;
    billingDay?: number;
    frequency?: 'monthly' | 'bimonthly' | 'quarterly' | 'semi-annually' | 'annually';
  }) => {
    setAddTransactionModalOpen(false);
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
          isFixedCost,
          billingDay,
          frequency,
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
          isFixedCost,
          billingDay,
          frequency,
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
  }
  
  const handleOpenEditTransactionModal = (transId: number | string) => {
    if (typeof transId === 'string' && transId.startsWith('fc-')) {
        const originalId = parseInt(transId.split('-')[1], 10);
        const originalTrans = manualTransactions.find(t => t.id === originalId);
        if (originalTrans) {
          setTransactionToEdit(originalTrans);
          setEditTransactionModalOpen(true);
        }
    } else {
        const trans = manualTransactions.find(t => t.id === transId);
        if (trans) {
            setTransactionToEdit(trans);
            setEditTransactionModalOpen(true);
        }
    }
  };
  
 const handleUpdateTransaction = async (updatePayload: {
    id: number | string;
    name: string;
    amount: number;
    date: string;
    category: string;
    cardId: number;
    type: 'income' | 'expense' | 'transfer';
    destinationCardId?: number;
    isFixedCost?: boolean;
    billingDay?: number;
    frequency?: 'monthly' | 'bimonthly' | 'quarterly' | 'semi-annually' | 'annually';
  }) => {
    setEditTransactionModalOpen(false);
    
    const originalTransaction = manualTransactions.find(t => t.id === updatePayload.id);
    if (!originalTransaction) return;

    const isAmountChanging = Math.abs(originalTransaction.amount) !== updatePayload.amount;

    if (originalTransaction.isFixedCost && isAmountChanging && originalTransaction.type === 'expense') {
        const todayViennaStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Vienna' });
        const today = new Date(`${todayViennaStr}T00:00:00.000Z`);
        let nextBillingDate: Date | null = null;
        const templateStartDate = new Date(originalTransaction.date);
        let checkDate = new Date(Date.UTC(templateStartDate.getUTCFullYear(), templateStartDate.getUTCMonth(), 1));

        for (let i = 0; i < 60; i++) { // Check up to 5 years
            const year = checkDate.getUTCFullYear();
            const month = checkDate.getUTCMonth();
            const templateStartYear = templateStartDate.getUTCFullYear();
            const templateStartMonth = templateStartDate.getUTCMonth();
            const monthsDiff = (year - templateStartYear) * 12 + (month - templateStartMonth);

            if (monthsDiff >= 0) {
                let shouldGenerate = false;
                const frequency = originalTransaction.frequency || 'monthly';
                switch (frequency) {
                    case 'monthly': shouldGenerate = true; break;
                    case 'bimonthly': shouldGenerate = monthsDiff % 2 === 0; break;
                    case 'quarterly': shouldGenerate = monthsDiff % 3 === 0; break;
                    case 'semi-annually': shouldGenerate = monthsDiff % 6 === 0; break;
                    case 'annually': shouldGenerate = monthsDiff % 12 === 0; break;
                }

                if (shouldGenerate) {
                    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
                    const day = Math.min(originalTransaction.billingDay!, daysInMonth);
                    const potentialBillingDate = new Date(Date.UTC(year, month, day));
                    if (potentialBillingDate > today) {
                        nextBillingDate = potentialBillingDate;
                        break;
                    }
                }
            }
            checkDate.setUTCMonth(checkDate.getUTCMonth() + 1);
        }

        if (nextBillingDate) {
            const endDate = new Date(nextBillingDate);
            endDate.setUTCDate(endDate.getUTCDate() - 1);

            const updatedOriginalTemplate: Transaction = {
                ...originalTransaction,
                endDate: endDate.toISOString().split('T')[0],
            };
            const newFutureTemplate: Transaction = {
                ...updatePayload,
                id: Date.now(),
                amount: -Math.abs(updatePayload.amount),
                date: nextBillingDate.toISOString().split('T')[0],
            };
            
            await db.put(db.STORES.manualTransactions, updatedOriginalTemplate);
            await db.add(db.STORES.manualTransactions, newFutureTemplate);
            
            setManualTransactions(prev => [
                ...prev.filter(t => t.id !== originalTransaction.id),
                updatedOriginalTemplate,
                newFutureTemplate
            ]);
            return;
        }
    }

    if (!originalTransaction.isFixedCost && updatePayload.isFixedCost) {
        const matchingTransactions = manualTransactions.filter(t => 
            t.name === updatePayload.name && 
            Math.abs(t.amount) === updatePayload.amount &&
            !t.isFixedCost
        );
        if (matchingTransactions.length > 0) {
            const earliestDate = matchingTransactions.reduce((earliest, current) => {
                return new Date(current.date) < new Date(earliest) ? current.date : earliest;
            }, matchingTransactions[0].date);
            const newFixedCostTemplate: Transaction = {
                id: Date.now(),
                cardId: updatePayload.cardId,
                name: updatePayload.name,
                category: 'Fixkosten',
                date: earliestDate,
                amount: -Math.abs(updatePayload.amount),
                type: 'expense',
                isFixedCost: true,
                billingDay: updatePayload.billingDay,
                frequency: updatePayload.frequency || 'monthly',
            };
            const idsToDelete = matchingTransactions.map(t => t.id);
            for (const id of idsToDelete) {
                await db.deleteItem(db.STORES.manualTransactions, id);
            }
            await db.add(db.STORES.manualTransactions, newFixedCostTemplate);
            setManualTransactions(prev => [
                ...prev.filter(t => !idsToDelete.includes(t.id)),
                newFixedCostTemplate
            ]);
        }
        return;
    }
    
    if (!originalTransaction.isFixedCost && updatePayload.isFixedCost) {
        const newFixedCostTemplate: Transaction = {
            id: Date.now(),
            cardId: updatePayload.cardId,
            name: updatePayload.name,
            category: 'Fixkosten',
            date: updatePayload.date,
            amount: -Math.abs(updatePayload.amount),
            type: 'expense',
            isFixedCost: true,
            billingDay: updatePayload.billingDay,
            frequency: updatePayload.frequency || 'monthly',
        };
        await db.add(db.STORES.manualTransactions, newFixedCostTemplate);
        setManualTransactions(prev => [...prev, newFixedCostTemplate]);
        return;
    }

    let updatedTransactionList = [...manualTransactions];

    if (originalTransaction.type === 'transfer' && originalTransaction.transferId) {
        const transferId = originalTransaction.transferId;
        const transactionsInTransfer = updatedTransactionList.filter(t => t.transferId === transferId);
        for(const t of transactionsInTransfer) {
            await db.deleteItem(db.STORES.manualTransactions, t.id);
        }
        updatedTransactionList = updatedTransactionList.filter(t => t.transferId !== transferId);
    } else {
        await db.deleteItem(db.STORES.manualTransactions, originalTransaction.id);
        updatedTransactionList = updatedTransactionList.filter(t => t.id !== originalTransaction.id);
    }

    let transactionsToAdd: Transaction[] = [];
    if (updatePayload.type === 'transfer') {
        const { destinationCardId, amount, cardId, date, name, isFixedCost, billingDay, frequency } = updatePayload;
        const sourceCard = cards.find(c => c.id === cardId);
        const destCard = cards.find(c => c.id === destinationCardId);

        if (!destinationCardId || !sourceCard || !destCard) return;

        const transferId = originalTransaction.transferId || Date.now();
        
        const sourceTransaction: Transaction = {
            id: originalTransaction.id,
            cardId: cardId,
            name: name || `Übertrag an ${destCard.title}`,
            category: isFixedCost ? 'Fixkosten' : 'Übertrag',
            date: date,
            amount: -amount,
            type: 'transfer',
            transferId: transferId,
            isFixedCost, billingDay, frequency
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
            isFixedCost, billingDay, frequency
        };
        transactionsToAdd.push(sourceTransaction, destTransaction);
    } else {
        const finalAmount = updatePayload.type === 'income' ? updatePayload.amount : -updatePayload.amount;
        const updatedTransaction: Transaction = {
            id: originalTransaction.id,
            cardId: updatePayload.cardId,
            name: updatePayload.name,
            category: updatePayload.isFixedCost ? 'Fixkosten' : updatePayload.category,
            date: updatePayload.date,
            amount: finalAmount,
            type: updatePayload.type,
            isFixedCost: updatePayload.isFixedCost,
            billingDay: updatePayload.billingDay,
            frequency: updatePayload.frequency,
        };
        transactionsToAdd.push(updatedTransaction);
    }

    for(const t of transactionsToAdd) {
        await db.add(db.STORES.manualTransactions, t);
    }
    
    setManualTransactions([...updatedTransactionList, ...transactionsToAdd]);
  };

  const handleDeleteRequest = (id: number | string) => {
    let idToDelete = id;
    if (typeof id === 'string' && id.startsWith('fc-')) {
        idToDelete = parseInt(id.split('-')[1], 10);
    }
    setItemToDelete({ id: idToDelete, type: 'transaction' });
    setConfirmationModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const transactionToDelete = manualTransactions.find(t => t.id === itemToDelete.id);
    if (transactionToDelete) {
        if (transactionToDelete.isFixedCost) {
            const pastOccurrencesToSave: Transaction[] = [];
            const templateStartDate = new Date(transactionToDelete.date);
            const todayViennaStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Vienna' });
            const today = new Date(`${todayViennaStr}T00:00:00.000Z`);
            
            let currentDate = new Date(templateStartDate.getFullYear(), templateStartDate.getMonth(), 1);
            
            while(currentDate <= today) {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                
                const templateStartMonth = templateStartDate.getMonth();
                const templateStartYear = templateStartDate.getFullYear();
                const monthsDiff = (year - templateStartYear) * 12 + (month - templateStartMonth);
                
                let shouldGenerate = false;
                if (monthsDiff >= 0) {
                    const frequency = transactionToDelete.frequency || 'monthly';
                    switch (frequency) {
                        case 'monthly': shouldGenerate = true; break;
                        case 'bimonthly': shouldGenerate = monthsDiff % 2 === 0; break;
                        case 'quarterly': shouldGenerate = monthsDiff % 3 === 0; break;
                        case 'semi-annually': shouldGenerate = monthsDiff % 6 === 0; break;
                        case 'annually': shouldGenerate = monthsDiff % 12 === 0; break;
                        default: shouldGenerate = true;
                    }
                }

                if (shouldGenerate) {
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const day = Math.min(transactionToDelete.billingDay!, daysInMonth);
                    const transactionFullDate = new Date(year, month, day);

                    if (transactionFullDate <= today) {
                        pastOccurrencesToSave.push({
                            ...transactionToDelete,
                            id: `hist-${transactionToDelete.id}-${year}-${month}`,
                            date: transactionFullDate.toISOString().split('T')[0],
                            isFixedCost: false,
                            billingDay: undefined,
                            frequency: undefined,
                        });
                    }
                }
                
                currentDate.setMonth(currentDate.getMonth() + 1);
            }

            if (pastOccurrencesToSave.length > 0) {
                await db.bulkAdd(db.STORES.manualTransactions, pastOccurrencesToSave);
            }
            
            await db.deleteItem(db.STORES.manualTransactions, transactionToDelete.id);

            setManualTransactions(prev => [
                ...prev.filter(t => t.id !== transactionToDelete.id),
                ...pastOccurrencesToSave
            ]);

        } else if (transactionToDelete.type === 'transfer' && transactionToDelete.transferId) {
            const transferId = transactionToDelete.transferId;
            const allTransactionsInTransfer = manualTransactions.filter(t => t.transferId === transferId);
            for (const t of allTransactionsInTransfer) {
                await db.deleteItem(db.STORES.manualTransactions, t.id);
            }
            setManualTransactions(prev => prev.filter(t => t.transferId !== transferId));
        } else {
            await db.deleteItem(db.STORES.manualTransactions, itemToDelete.id);
            setManualTransactions(prev => prev.filter(t => t.id !== itemToDelete.id));
        }
    }
    
    setConfirmationModalOpen(false);
    setItemToDelete(null);
  };

  const handleExportData = async () => {
    const dataToExport = {
      cards: await db.getAll<Card>(db.STORES.cards),
      manualTransactions: await db.getAll<Transaction>(db.STORES.manualTransactions),
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aurimea-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    setSettingsModalOpen(false);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        const importedData = JSON.parse(text);

        if (Array.isArray(importedData.cards) && Array.isArray(importedData.manualTransactions)) {
          await Promise.all([
            db.clearStore(db.STORES.cards),
            db.clearStore(db.STORES.manualTransactions),
          ]);

          await Promise.all([
            db.bulkAdd(db.STORES.cards, importedData.cards),
            db.bulkAdd(db.STORES.manualTransactions, importedData.manualTransactions),
          ]);
          
          setCards(importedData.cards);
          setManualTransactions(importedData.manualTransactions);

          alert('Daten erfolgreich importiert!');
          setSettingsModalOpen(false);
        } else {
          throw new Error("Invalid file structure.");
        }
      } catch (error) {
        console.error("Import failed:", error);
        alert('Fehler beim Importieren der Daten. Bitte stellen Sie sicher, dass es sich um eine gültige Backup-Datei handelt.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };
  
  const handleDeleteAllDataRequest = () => {
    setSettingsModalOpen(false);
    setDeleteAllConfirmationOpen(true);
  };
  
  const confirmDeleteAllData = async () => {
      await Promise.all([
        db.clearStore(db.STORES.cards),
        db.clearStore(db.STORES.manualTransactions),
      ]);
      setCards([]);
      setManualTransactions([]);
      setDeleteAllConfirmationOpen(false);
  };

  const handleCardNavigation = (cardId: number) => {
    setSelectedCardId(cardId);
    setActiveTab('Statistiken');
  };

  const handleTransactionNavigation = (transactionId: number | string, cardId: number) => {
    setSelectedCardId(cardId);
    setSelectedTransactionId(transactionId);
    setActiveTab('Transaktionen');
  };

  const handleFixedCostNavigation = (transactionId: number | string) => {
    const transaction = manualTransactions.find(t => t.id === transactionId);
    if(transaction) {
      handleTransactionNavigation(transaction.id, transaction.cardId);
    }
  };

  return (
    <div className="bg-brand-background text-brand-text font-sans min-h-screen pb-20 md:pb-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} onSearchClick={() => setIsSearchOpen(true)} onSettingsClick={() => setSettingsModalOpen(true)} />
        {isLoading ? (
            <div className="flex justify-center items-center h-[70vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        ) : (
          <>
            {activeTab === 'Übersicht' && (
              <DashboardPage
                cards={cards}
                selectedCardId={selectedCardId}
                onCardNavigate={handleCardNavigation}
                onAddCard={handleAddCard}
                onEditCard={handleOpenEditCardModal}
                transactions={combinedTransactions}
                manualTransactions={manualTransactions}
                onTransactionNavigate={handleTransactionNavigation}
                onAddTransactionClick={handleOpenAddTransactionModal}
                onEditTransaction={handleOpenEditTransactionModal}
                onDeleteTransaction={handleDeleteRequest}
                onFixedCostNavigate={handleFixedCostNavigation}
              />
            )}
            {activeTab === 'Transaktionen' && (
                <TransactionsPage
                    cards={cards}
                    transactions={combinedTransactions}
                    selectedCardId={selectedCardId}
                    setSelectedCardId={setSelectedCardId}
                    selectedTransactionId={selectedTransactionId}
                    setSelectedTransactionId={setSelectedTransactionId}
                    onAddTransactionClick={handleOpenAddTransactionModal}
                    onEditTransaction={handleOpenEditTransactionModal}
                    onDeleteTransaction={handleDeleteRequest}
                />
            )}
            {activeTab === 'Statistiken' && (
                <StatisticsPage 
                    cards={cards}
                    transactions={combinedTransactions}
                    selectedCardId={selectedCardId}
                    setSelectedCardId={setSelectedCardId}
                />
            )}
          </>
        )}

      </div>
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} />
      
      {/* Modals */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        transactions={combinedTransactions}
        cards={cards}
        onNavigate={handleTransactionNavigation}
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onExport={handleExportData}
        onImport={handleImportData}
        onDeleteAll={handleDeleteAllDataRequest}
      />
      <AddTransactionModal 
        isOpen={isAddTransactionModalOpen}
        onClose={() => setAddTransactionModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        cards={cards}
        preselectedCardId={cardIdForNewTransaction}
      />
      {transactionToEdit && (
        <EditTransactionModal 
            isOpen={isEditTransactionModalOpen}
            onClose={() => setEditTransactionModalOpen(false)}
            onUpdateTransaction={handleUpdateTransaction}
            transaction={transactionToEdit}
            cards={cards}
        />
      )}
      {cardToEdit && (
        <EditCardModal 
          isOpen={isEditCardModalOpen}
          onClose={() => setEditCardModalOpen(false)}
          onUpdateCard={handleUpdateCard}
          card={cardToEdit}
        />
      )}
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={confirmDelete}
        title="Löschen bestätigen"
        message="Sind Sie sicher, dass Sie dieses Element endgültig löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
      />
       <ConfirmationModal 
        isOpen={isDeleteAllConfirmationOpen}
        onClose={() => setDeleteAllConfirmationOpen(false)}
        onConfirm={confirmDeleteAllData}
        title="Alle Daten löschen?"
        message="Sind Sie absolut sicher? Alle Ihre Karten, Transaktionen und Einstellungen werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden."
        confirmText="Alles löschen"
      />
    </div>
  );
};

export default App;
