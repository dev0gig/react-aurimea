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
import { 
  cards as initialCards, 
  Card, 
  transactions as initialTransactions, 
  Transaction,
  fixedCosts as initialFixedCosts,
  FixedCost
} from './data/mockData';

// Custom hook to manage state in localStorage
function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, state]);

  return [state, setState];
}


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Übersicht');
  const [cards, setCards] = useLocalStorageState<Card[]>('cards', initialCards);
  const [manualTransactions, setManualTransactions] = useLocalStorageState<Transaction[]>('manualTransactions', initialTransactions);
  const [fixedCosts, setFixedCosts] = useLocalStorageState<FixedCost[]>('fixedCosts', initialFixedCosts);
  
  const [selectedCardId, setSelectedCardId] = useState<number | null>(cards.length > 0 ? cards[0].id : null);
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


  const navItems = ['Übersicht', 'Transaktionen', 'Statistiken', 'Mein Wallet'];

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

  const handleAddCard = (newCardData: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...newCardData,
      id: Date.now(),
    };
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

  const handleUpdateCard = (updatedCard: Card) => {
    setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    setEditCardModalOpen(false);
  };

  const handleAddFixedCost = (newSubData: Omit<FixedCost, 'id'>) => {
    const newSub: FixedCost = {
      ...newSubData,
      id: Date.now(),
    };
    setFixedCosts(prevSubs => [...prevSubs, newSub]);
    setAddFixedCostModalOpen(false);
  };

  const handleOpenAddTransactionModal = (cardId: number | null) => {
    setCardIdForNewTransaction(cardId);
    setAddTransactionModalOpen(true);
  };

  const handleAddTransaction = (newTransactionData: {
    name: string;
    amount: number;
    date: string;
    category: string;
    cardId: number;
    type: 'income' | 'expense' | 'transfer';
    destinationCardId?: number;
  }) => {
    setManualTransactions(prev => {
      let newTransactions = [...prev];
      
      if (newTransactionData.type === 'transfer') {
        const { destinationCardId, amount, cardId, date, name } = newTransactionData;
        const sourceCard = cards.find(c => c.id === cardId);
        const destCard = cards.find(c => c.id === destinationCardId);

        if (!destinationCardId || !sourceCard || !destCard) return prev;

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
        newTransactions.push(sourceTransaction, destTransaction);
      } else {
        const finalAmount = newTransactionData.type === 'income' ? newTransactionData.amount : -newTransactionData.amount;
        const newTransaction: Transaction = {
          ...newTransactionData,
          id: Date.now(),
          amount: finalAmount,
        };
        newTransactions.push(newTransaction);
      }
      return newTransactions;
    });
    setAddTransactionModalOpen(false);
  }

  const handleOpenEditFixedCostModal = (subId: number) => {
    const sub = fixedCosts.find(s => s.id === subId);
    if (sub) {
      setFixedCostToEdit(sub);
      setEditFixedCostModalOpen(true);
    }
  };

  const handleUpdateFixedCost = (updatedSub: FixedCost) => {
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
  
 const handleUpdateTransaction = (updatePayload: {
    id: number | string;
    name: string;
    amount: number; // always positive from modal
    date: string;
    category: string;
    cardId: number;
    type: 'income' | 'expense' | 'transfer';
    destinationCardId?: number;
  }) => {
    setManualTransactions(prev => {
        let newTransactions = [...prev];
        const originalIndex = newTransactions.findIndex(t => t.id === updatePayload.id);
        if (originalIndex === -1) return prev;

        const originalTransaction = newTransactions[originalIndex];

        if (originalTransaction.type === 'transfer' && originalTransaction.transferId) {
            newTransactions = newTransactions.filter(t => t.transferId !== originalTransaction.transferId);
        } else {
            newTransactions = newTransactions.filter(t => t.id !== originalTransaction.id);
        }
        
        if (updatePayload.type === 'transfer') {
            const { destinationCardId, amount, cardId } = updatePayload;
            const sourceCard = cards.find(c => c.id === cardId);
            const destCard = cards.find(c => c.id === destinationCardId);

            if (!destinationCardId || !sourceCard || !destCard) return prev; 

            const transferId = Date.now();
            
            const sourceTransaction: Transaction = {
                id: originalTransaction.id,
                cardId: cardId,
                name: `Übertrag an ${destCard.title}`,
                category: 'Übertrag',
                date: updatePayload.date,
                amount: -amount,
                type: 'transfer',
                transferId: transferId,
            };

            const destTransaction: Transaction = {
                id: `transfer-${transferId}`,
                cardId: destinationCardId,
                name: `Übertrag von ${sourceCard.title}`,
                category: 'Übertrag',
                date: updatePayload.date,
                amount: amount,
                type: 'transfer',
                transferId: transferId,
            };
            newTransactions.push(sourceTransaction, destTransaction);

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
            newTransactions.push(updatedTransaction);
        }
        return newTransactions;
    });

    setEditTransactionModalOpen(false);
  };


  const handleDeleteRequest = (id: number | string, type: 'transaction' | 'fixedCost') => {
    setItemToDelete({ id, type });
    setConfirmationModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'fixedCost') {
      setFixedCosts(prev => prev.filter(s => s.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'transaction') {
      setManualTransactions(prev => {
        const transactionToDelete = prev.find(t => t.id === itemToDelete.id);
        if (!transactionToDelete) return prev;

        if (transactionToDelete.type === 'transfer' && transactionToDelete.transferId) {
            return prev.filter(t => t.transferId !== transactionToDelete.transferId);
        } else {
            return prev.filter(t => t.id !== itemToDelete.id);
        }
      });
    }
    
    setConfirmationModalOpen(false);
    setItemToDelete(null);
  };

  const handleExportData = () => {
    const dataToExport = {
      cards,
      manualTransactions,
      fixedCosts
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
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        const importedData = JSON.parse(text);

        // Basic validation
        if (Array.isArray(importedData.cards) && Array.isArray(importedData.manualTransactions) && Array.isArray(importedData.fixedCosts)) {
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
  
  const confirmDeleteAllData = () => {
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

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text font-sans p-4 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
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
    </div>
  );
};

export default App;