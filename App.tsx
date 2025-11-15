import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import TransactionsPage from './components/TransactionsPage';
import StatisticsPage from './components/StatisticsPage';
import SearchModal from './components/SearchModal';
import AddTransactionModal from './components/AddTransactionModal';
import AddFixedCostModal from './components/AddFixedCostModal';
import EditFixedCostModal from './components/EditFixedCostModal';
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
  Transaction,
  fixedCosts as initialFixedCosts,
  FixedCost
} from './data/mockData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Übersicht');
  const [cards, setCards] = useState<Card[]>([]);
  const [manualTransactions, setManualTransactions] = useState<Transaction[]>([]);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | string | null>(null);
  
  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isAddFixedCostModalOpen, setAddFixedCostModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [cardIdForNewTransaction, setCardIdForNewTransaction] = useState<number | null>(null);
  const [isEditFixedCostModalOpen, setEditFixedCostModalOpen] = useState(false);
  const [isEditTransactionModalOpen, setEditTransactionModalOpen] = useState(false);
  const [isEditCardModalOpen, setEditCardModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isDeleteAllConfirmationOpen, setDeleteAllConfirmationOpen] = useState(false);
  
  const [fixedCostToEdit, setFixedCostToEdit] = useState<FixedCost | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: number | string; type: 'transaction' | 'fixedCost' } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initDB();
        const [dbCards, dbManualTransactions, dbFixedCosts] = await Promise.all([
          db.getAll<Card>(db.STORES.cards),
          db.getAll<Transaction>(db.STORES.manualTransactions),
          db.getAll<FixedCost>(db.STORES.fixedCosts),
        ]);

        if (dbCards.length === 0 && dbManualTransactions.length === 0 && dbFixedCosts.length === 0) {
          // First time load, populate DB with mock data
          await Promise.all([
            db.bulkAdd(db.STORES.cards, initialCards),
            db.bulkAdd(db.STORES.manualTransactions, initialTransactions),
            db.bulkAdd(db.STORES.fixedCosts, initialFixedCosts),
          ]);
          setCards(initialCards);
          setManualTransactions(initialTransactions);
          setFixedCosts(initialFixedCosts);
          if (initialCards.length > 0) {
            setSelectedCardId(initialCards[0].id);
          }
        } else {
          setCards(dbCards);
          setManualTransactions(dbManualTransactions);
          setFixedCosts(dbFixedCosts);
           if (dbCards.length > 0) {
            setSelectedCardId(dbCards[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load data from IndexedDB", error);
        // Fallback to initial data if DB fails
        setCards(initialCards);
        setManualTransactions(initialTransactions);
        setFixedCosts(initialFixedCosts);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);


  const navItems = ['Übersicht', 'Transaktionen', 'Statistiken'];

  const combinedTransactions = useMemo(() => {
    const generatedTransactions: Transaction[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    fixedCosts.forEach(sub => {
      if (today.getDate() >= sub.billingDay) {
        const transactionDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(sub.billingDay).padStart(2, '0')}`;
        generatedTransactions.push({
          id: `sub-${sub.id}-${currentYear}-${currentMonth}`,
          cardId: sub.cardId,
          name: sub.name,
          category: 'Fixkosten',
          date: transactionDate,
          amount: -sub.amount,
          type: 'expense'
        });
      }
    });

    const all = [...manualTransactions, ...generatedTransactions];
    const unique = Array.from(new Map(all.map(t => [t.id, t])).values());
    return unique.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  }, [fixedCosts, manualTransactions]);

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

  const handleAddFixedCost = async (newSubData: Omit<FixedCost, 'id'>) => {
    const newSub: FixedCost = {
      ...newSubData,
      id: Date.now(),
    };
    await db.add(db.STORES.fixedCosts, newSub);
    setFixedCosts(prevSubs => [...prevSubs, newSub]);
    setAddFixedCostModalOpen(false);
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
  }) => {
    setAddTransactionModalOpen(false);
    let newTransactionsToAdd: Transaction[] = [];
    
    if (newTransactionData.type === 'transfer') {
      const { destinationCardId, amount, cardId, date, name } = newTransactionData;
      const sourceCard = cards.find(c => c.id === cardId);
      const destCard = cards.find(c => c.id === destinationCardId);

      if (!destinationCardId || !sourceCard || !destCard) return;

      const transferId = Date.now();
      const sourceTransaction: Transaction = {
          id: `transfer-source-${transferId}`,
          cardId: cardId,
          name: name || `Übertrag an ${destCard.title}`,
          category: 'Übertrag',
          date: date,
          amount: -amount,
          type: 'transfer',
          transferId: transferId,
      };
      const destTransaction: Transaction = {
          id: `transfer-dest-${transferId}`,
          cardId: destinationCardId,
          name: name || `Übertrag von ${sourceCard.title}`,
          category: 'Übertrag',
          date: date,
          amount: amount,
          type: 'transfer',
          transferId: transferId,
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

  const handleOpenEditFixedCostModal = (subId: number) => {
    const sub = fixedCosts.find(s => s.id === subId);
    if (sub) {
      setFixedCostToEdit(sub);
      setEditFixedCostModalOpen(true);
    }
  };

  const handleUpdateFixedCost = async (updatedSub: FixedCost) => {
    await db.put(db.STORES.fixedCosts, updatedSub);
    setFixedCosts(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
    setEditFixedCostModalOpen(false);
  };
  
  const handleOpenEditTransactionModal = (transId: number | string) => {
    const trans = manualTransactions.find(t => t.id === transId);
    if (trans) {
        setTransactionToEdit(trans);
        setEditTransactionModalOpen(true);
    }
  };
  
 const handleUpdateTransaction = async (updatePayload: {
    id: number | string;
    name: string;
    amount: number; // always positive from modal
    date: string;
    category: string;
    cardId: number;
    type: 'income' | 'expense' | 'transfer';
    destinationCardId?: number;
  }) => {
    setEditTransactionModalOpen(false);
    
    const originalTransaction = manualTransactions.find(t => t.id === updatePayload.id);
    if (!originalTransaction) return;

    let updatedTransactionList = [...manualTransactions];

    // 1. Remove old transactions from DB and create a temporary state
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

    // 2. Prepare new transactions to add
    let transactionsToAdd: Transaction[] = [];
    if (updatePayload.type === 'transfer') {
        const { destinationCardId, amount, cardId, date, name } = updatePayload;
        const sourceCard = cards.find(c => c.id === cardId);
        const destCard = cards.find(c => c.id === destinationCardId);

        if (!destinationCardId || !sourceCard || !destCard) return;

        const transferId = originalTransaction.transferId || Date.now();
        
        const sourceTransaction: Transaction = {
            id: originalTransaction.id,
            cardId: cardId,
            name: name || `Übertrag an ${destCard.title}`,
            category: 'Übertrag',
            date: date,
            amount: -amount,
            type: 'transfer',
            transferId: transferId,
        };
        const destTransaction: Transaction = {
            id: `transfer-dest-${transferId}`,
            cardId: destinationCardId,
            name: name || `Übertrag von ${sourceCard.title}`,
            category: 'Übertrag',
            date: date,
            amount: amount,
            type: 'transfer',
            transferId: transferId,
        };
        transactionsToAdd.push(sourceTransaction, destTransaction);
    } else {
        const finalAmount = updatePayload.type === 'income' ? updatePayload.amount : -updatePayload.amount;
        const updatedTransaction: Transaction = {
            id: originalTransaction.id,
            cardId: updatePayload.cardId,
            name: updatePayload.name,
            category: updatePayload.category,
            date: updatePayload.date,
            amount: finalAmount,
            type: updatePayload.type,
        };
        transactionsToAdd.push(updatedTransaction);
    }

    // 3. Add new transactions to DB
    for(const t of transactionsToAdd) {
        await db.add(db.STORES.manualTransactions, t);
    }
    
    // 4. Update state with the final list
    setManualTransactions([...updatedTransactionList, ...transactionsToAdd]);
  };

  const handleDeleteRequest = (id: number | string, type: 'transaction' | 'fixedCost') => {
    setItemToDelete({ id, type });
    setConfirmationModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'fixedCost') {
      await db.deleteItem(db.STORES.fixedCosts, itemToDelete.id);
      setFixedCosts(prev => prev.filter(s => s.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'transaction') {
      const transactionToDelete = manualTransactions.find(t => t.id === itemToDelete.id);
      if (transactionToDelete) {
          if (transactionToDelete.type === 'transfer' && transactionToDelete.transferId) {
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
    }
    
    setConfirmationModalOpen(false);
    setItemToDelete(null);
  };

  const handleExportData = async () => {
    const dataToExport = {
      cards: await db.getAll<Card>(db.STORES.cards),
      manualTransactions: await db.getAll<Transaction>(db.STORES.manualTransactions),
      fixedCosts: await db.getAll<FixedCost>(db.STORES.fixedCosts)
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

        if (Array.isArray(importedData.cards) && Array.isArray(importedData.manualTransactions) && Array.isArray(importedData.fixedCosts)) {
          await Promise.all([
            db.clearStore(db.STORES.cards),
            db.clearStore(db.STORES.manualTransactions),
            db.clearStore(db.STORES.fixedCosts)
          ]);

          await Promise.all([
            db.bulkAdd(db.STORES.cards, importedData.cards),
            db.bulkAdd(db.STORES.manualTransactions, importedData.manualTransactions),
            db.bulkAdd(db.STORES.fixedCosts, importedData.fixedCosts)
          ]);
          
          setCards(importedData.cards);
          setManualTransactions(importedData.manualTransactions);
          setFixedCosts(importedData.fixedCosts);

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
        db.clearStore(db.STORES.fixedCosts)
      ]);
      setCards([]);
      setManualTransactions([]);
      setFixedCosts([]);
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

  const handleFixedCostNavigation = (fixedCostId: number) => {
    const sub = fixedCosts.find(s => s.id === fixedCostId);
    if (!sub) return;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const transactionId = `sub-${sub.id}-${currentYear}-${currentMonth}`;
    
    const transactionExists = combinedTransactions.some(t => t.id === transactionId);
    if (transactionExists) {
      setSelectedCardId(sub.cardId);
      setSelectedTransactionId(transactionId);
      setActiveTab('Transaktionen');
    }
  };
  
  const handleSearchNavigation = (transactionId: number | string, cardId: number) => {
    setSelectedCardId(cardId);
    setSelectedTransactionId(transactionId);
    setActiveTab('Transaktionen');
    setIsSearchOpen(false);
  };
  
  const getConfirmationMessage = () => {
    if (!itemToDelete) return { title: '', message: '' };
    if (itemToDelete.type === 'fixedCost') {
      const sub = fixedCosts.find(s => s.id === itemToDelete.id);
      return {
        title: 'Fixkosten löschen',
        message: `Möchten Sie die Fixkosten "${sub?.name}" wirklich endgültig löschen?`
      };
    }
    const trans = manualTransactions.find(t => t.id === itemToDelete.id);
    const isTransfer = trans?.type === 'transfer';
    return {
      title: 'Transaktion löschen',
      message: `Möchten Sie die Transaktion "${trans?.name}" wirklich endgültig löschen? ${isTransfer ? 'Der zugehörige Übertrag wird ebenfalls gelöscht.' : ''}`
    };
  };

  if (isLoading) {
    return (
        <div className="bg-brand-bg min-h-screen text-brand-text font-sans p-4 lg:p-8 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
                <p className="text-xl text-brand-text-secondary">Daten werden geladen...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen text-brand-text font-sans p-4 lg:p-8 pb-20 md:pb-8">
      <div id="stars-container">
        <div id="stars1" className="stars"></div>
        <div id="stars2" className="stars"></div>
        <div id="stars3" className="stars"></div>
      </div>
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          navItems={navItems} 
          onSearchClick={() => setIsSearchOpen(true)}
          onSettingsClick={() => setSettingsModalOpen(true)}
        />
        {activeTab === 'Übersicht' && (
          <DashboardPage 
            cards={cards}
            selectedCardId={selectedCardId}
            onCardNavigate={handleCardNavigation}
            onAddCard={handleAddCard}
            onEditCard={handleOpenEditCardModal}
            transactions={combinedTransactions}
            onTransactionNavigate={handleTransactionNavigation}
            onAddTransactionClick={handleOpenAddTransactionModal}
            onEditTransaction={handleOpenEditTransactionModal}
            onDeleteTransaction={(id) => handleDeleteRequest(id, 'transaction')}
            fixedCosts={fixedCosts}
            onAddFixedCostClick={() => setAddFixedCostModalOpen(true)}
            onFixedCostNavigate={handleFixedCostNavigation}
            onEditFixedCost={handleOpenEditFixedCostModal}
            onDeleteFixedCost={(id) => handleDeleteRequest(id, 'fixedCost')}
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
            onDeleteTransaction={(id) => handleDeleteRequest(id, 'transaction')}
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
      </div>
       <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        transactions={combinedTransactions}
        cards={cards}
        onNavigate={handleSearchNavigation}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onExport={handleExportData}
        onImport={handleImportData}
        onDeleteAll={handleDeleteAllDataRequest}
      />
      <AddFixedCostModal
        isOpen={isAddFixedCostModalOpen}
        onClose={() => setAddFixedCostModalOpen(false)}
        onAddFixedCost={handleAddFixedCost}
        cards={cards}
      />
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setAddTransactionModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        cards={cards}
        preselectedCardId={cardIdForNewTransaction}
      />
       {fixedCostToEdit && (
        <EditFixedCostModal
          isOpen={isEditFixedCostModalOpen}
          onClose={() => setEditFixedCostModalOpen(false)}
          onUpdateFixedCost={handleUpdateFixedCost}
          fixedCost={fixedCostToEdit}
          cards={cards}
        />
      )}
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
        title={getConfirmationMessage().title}
        message={getConfirmationMessage().message}
      />
       <ConfirmationModal
        isOpen={isDeleteAllConfirmationOpen}
        onClose={() => setDeleteAllConfirmationOpen(false)}
        onConfirm={confirmDeleteAllData}
        title="Alle Daten löschen?"
        message="Möchten Sie wirklich alle Ihre Karten, Transaktionen und Fixkosten unwiderruflich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
      />
       <MobileNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navItems={navItems}
      />
    </div>
  );
};

export default App;