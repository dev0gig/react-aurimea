
import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import TransactionsPage from './components/TransactionsPage';
import StatisticsPage from './components/StatisticsPage';
import SeparateAccountsPage from './components/SeparateAccountsPage';
import SearchModal from './components/SearchModal';
import AddTransactionModal from './components/AddTransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import ConfirmationModal from './components/ConfirmationModal';
import SettingsModal from './components/SettingsModal';
import EditCardModal from './components/EditCardModal';
import MobileNav from './components/MobileNav';
import type { Card, Transaction } from './data/mockData';

const MainContent: React.FC = () => {
  const { 
    cards, 
    transactions, 
    manualTransactions, 
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateCard,
    deleteCard,
    deleteAllData,
    importData
  } = useFinance();

  const [activeTab, setActiveTab] = useState('Übersicht');
  
  // Local UI State (Navigation & Modals)
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | string | null>(null);
  
  // Modal Visibility State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [isEditTransactionModalOpen, setEditTransactionModalOpen] = useState(false);
  const [isEditCardModalOpen, setEditCardModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isDeleteAllConfirmationOpen, setDeleteAllConfirmationOpen] = useState(false);
  const [isDeleteCardConfirmationOpen, setDeleteCardConfirmationOpen] = useState(false);
  
  // Modal Data State
  const [cardIdForNewTransaction, setCardIdForNewTransaction] = useState<number | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: number | string; type: 'transaction' | 'card' } | null>(null);

  const navItems = ['Übersicht', 'Transaktionen', 'Statistiken', 'Separate Konten'];

  // --- History Management & Back Button Logic ---
  useEffect(() => {
    // Set initial history state
    window.history.replaceState({ tab: 'Übersicht', modal: null }, '');

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        // 1. Handle Tab Change
        if (state.tab && state.tab !== activeTab) {
          setActiveTab(state.tab);
        }

        // 2. Handle Modal Closing
        // If the history state says "modal: null", ensure all modals are closed.
        if (!state.modal) {
            setIsSearchOpen(false);
            setSettingsModalOpen(false);
            setAddTransactionModalOpen(false);
            setEditTransactionModalOpen(false);
            setEditCardModalOpen(false);
            setConfirmationModalOpen(false);
            setDeleteAllConfirmationOpen(false);
            setDeleteCardConfirmationOpen(false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Run once on mount

  // Helper to push history state
  const updateHistory = (tab: string, modal: string | null) => {
      window.history.pushState({ tab, modal }, '');
  };

  // Wrapper to go back using browser history (closes modals)
  const goBack = () => {
      window.history.back();
  };

  const navigateToTab = (tab: string) => {
      setActiveTab(tab);
      updateHistory(tab, null);
  };

  // --- Swipe Navigation Logic ---
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // Don't swipe if a modal is open
    if (isSearchOpen || isSettingsModalOpen || isAddTransactionModalOpen || isEditTransactionModalOpen || isEditCardModalOpen || isConfirmationModalOpen) return;

    const currentIndex = navItems.indexOf(activeTab);
    
    if (isLeftSwipe) {
        if (currentIndex < navItems.length - 1) {
             navigateToTab(navItems[currentIndex + 1]);
        }
    }
    
    if (isRightSwipe) {
        if (currentIndex > 0) {
            navigateToTab(navItems[currentIndex - 1]);
        }
    }
  };

  // --- Navigation Handlers ---
  const handleTransactionNavigation = (transactionId: number | string, cardId: number) => {
    setSelectedCardId(cardId);
    setSelectedTransactionId(transactionId);
    setIsSearchOpen(false); // Force close visual state
    setActiveTab('Transaktionen');
    // We push a new history entry for the transaction view. 
    // Going "Back" will conceptually go back to the Search Modal if that was the previous state.
    updateHistory('Transaktionen', null);
  };

  const handleCardNavigation = (cardId: number) => {
    setSelectedCardId(cardId);
    navigateToTab('Statistiken');
  };

  // --- Action Handlers (updated with History) ---
  const openAddTransaction = (cardId: number | null) => {
    setCardIdForNewTransaction(cardId);
    setAddTransactionModalOpen(true);
    updateHistory(activeTab, 'addTransaction');
  };

  const openEditTransaction = (transId: number | string) => {
    let idToFind = transId;
    if (typeof transId === 'string' && transId.startsWith('fc-')) {
       idToFind = parseInt(transId.split('-')[1], 10);
    }
    const trans = manualTransactions.find(t => t.id === idToFind);
    if (trans) {
      setTransactionToEdit(trans);
      setEditTransactionModalOpen(true);
      updateHistory(activeTab, 'editTransaction');
    }
  };

  const openDeleteTransaction = (id: number | string) => {
    setItemToDelete({ id, type: 'transaction' });
    setConfirmationModalOpen(true);
    updateHistory(activeTab, 'confirmDelete');
  };

  const openEditCard = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setCardToEdit(card);
      setEditCardModalOpen(true);
      updateHistory(activeTab, 'editCard');
    }
  };

  const initiateDeleteCard = () => {
      if (cardToEdit) {
          // Special Case: Switching from one modal to another.
          // We replace the "Edit Card" modal in history with "Confirm Delete" or push on top.
          // Let's push on top to allow "Back" to go to Edit.
          setItemToDelete({ id: cardToEdit.id, type: 'card' });
          setEditCardModalOpen(false); 
          setDeleteCardConfirmationOpen(true);
          updateHistory(activeTab, 'confirmDeleteCard');
      }
  }

  const handleExportData = async () => {
    const dataToExport = { cards, manualTransactions };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurimea-backup-${new Date().toLocaleDateString('en-CA')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    goBack(); // Close settings
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        await importData(JSON.parse(text));
        alert('Daten erfolgreich importiert!');
        goBack(); // Close settings
      } catch (err) {
        alert('Fehler beim Importieren.');
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
     return (
        <div className="bg-brand-background min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
     );
  }

  return (
    <div 
        className="bg-brand-background text-brand-text font-sans min-h-screen pb-20 md:pb-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header 
            activeTab={activeTab} 
            setActiveTab={navigateToTab} 
            navItems={navItems} 
            onSearchClick={() => { setIsSearchOpen(true); updateHistory(activeTab, 'search'); }} 
            onSettingsClick={() => { setSettingsModalOpen(true); updateHistory(activeTab, 'settings'); }} 
        />
        
        {activeTab === 'Übersicht' && (
          <DashboardPage
            selectedCardId={selectedCardId}
            onCardNavigate={handleCardNavigation}
            onSeparateAccountNavigate={(id) => { setSelectedCardId(id); navigateToTab('Separate Konten'); }}
            onEditCard={openEditCard}
            onTransactionNavigate={handleTransactionNavigation}
            onAddTransactionClick={openAddTransaction}
            onEditTransaction={openEditTransaction}
            onDeleteTransaction={openDeleteTransaction}
            onFixedCostNavigate={(id) => {
                const t = manualTransactions.find(tr => tr.id === id);
                if(t) handleTransactionNavigation(t.id, t.cardId);
            }}
          />
        )}
        {activeTab === 'Transaktionen' && (
            <TransactionsPage
                selectedCardId={selectedCardId}
                setSelectedCardId={setSelectedCardId}
                selectedTransactionId={selectedTransactionId}
                setSelectedTransactionId={setSelectedTransactionId}
                onAddTransactionClick={openAddTransaction}
                onEditTransaction={openEditTransaction}
                onDeleteTransaction={openDeleteTransaction}
            />
        )}
        {activeTab === 'Statistiken' && (
            <StatisticsPage 
                selectedCardId={selectedCardId}
                setSelectedCardId={setSelectedCardId}
            />
        )}
        {activeTab === 'Separate Konten' && (
            <SeparateAccountsPage
                onAddTransactionClick={openAddTransaction}
                onEditTransaction={openEditTransaction}
                onDeleteTransaction={openDeleteTransaction}
                selectedCardId={selectedCardId}
                setSelectedCardId={setSelectedCardId}
            />
        )}
      </div>
      <MobileNav activeTab={activeTab} setActiveTab={navigateToTab} navItems={navItems} />
      
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={goBack}
        transactions={transactions}
        cards={cards}
        onNavigate={handleTransactionNavigation}
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={goBack}
        onExport={handleExportData}
        onImport={handleImportData}
        onDeleteAll={() => { goBack(); setDeleteAllConfirmationOpen(true); updateHistory(activeTab, 'deleteAllConfirm'); }}
      />
      <AddTransactionModal 
        isOpen={isAddTransactionModalOpen}
        onClose={goBack}
        onAddTransaction={(data) => { addTransaction(data); goBack(); }}
        cards={cards}
        preselectedCardId={cardIdForNewTransaction}
      />
      {transactionToEdit && (
        <EditTransactionModal 
            isOpen={isEditTransactionModalOpen}
            onClose={goBack}
            onUpdateTransaction={(data) => { updateTransaction(data); goBack(); }}
            transaction={transactionToEdit}
            cards={cards}
        />
      )}
      {cardToEdit && (
        <EditCardModal 
          isOpen={isEditCardModalOpen}
          onClose={goBack}
          onUpdateCard={(data) => { updateCard(data); goBack(); }}
          onDelete={initiateDeleteCard}
          card={cardToEdit}
        />
      )}
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onClose={goBack}
        onConfirm={() => { if(itemToDelete) deleteTransaction(itemToDelete.id); goBack(); }}
        title="Transaktion löschen"
        message="Sind Sie sicher, dass Sie diese Transaktion löschen möchten?"
      />
       <ConfirmationModal 
        isOpen={isDeleteCardConfirmationOpen}
        onClose={goBack}
        onConfirm={() => { if(itemToDelete && itemToDelete.type === 'card') deleteCard(Number(itemToDelete.id)); goBack(); if(selectedCardId === itemToDelete?.id) setSelectedCardId(null); }}
        title="Konto löschen?"
        message="Warnung: Wenn Sie dieses Konto löschen, werden ALLE zugehörigen Transaktionen und Abonnements ebenfalls unwiderruflich gelöscht."
        confirmText="Konto löschen"
      />
       <ConfirmationModal 
        isOpen={isDeleteAllConfirmationOpen}
        onClose={goBack}
        onConfirm={() => { deleteAllData(); goBack(); }}
        title="Alle Daten löschen?"
        message="Dies kann nicht rückgängig gemacht werden. Alle Konten und Transaktionen werden gelöscht."
        confirmText="Alles löschen"
      />
    </div>
  );
};

const App: React.FC = () => (
  <FinanceProvider>
    <MainContent />
  </FinanceProvider>
);

export default App;
