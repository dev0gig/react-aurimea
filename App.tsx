
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
  const navItems = ['Übersicht', 'Transaktionen', 'Statistiken', 'Separate Konten'];
  
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

  // --- History Management & Back Button Logic ---
  useEffect(() => {
    // Initial state logic: replace current state to have a baseline
    if (!window.history.state) {
        window.history.replaceState({ tab: 'Übersicht', modal: null }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      
      // Close all modals first (default safe state)
      setIsSearchOpen(false);
      setSettingsModalOpen(false);
      setAddTransactionModalOpen(false);
      setEditTransactionModalOpen(false);
      setEditCardModalOpen(false);
      setConfirmationModalOpen(false);
      setDeleteAllConfirmationOpen(false);
      setDeleteCardConfirmationOpen(false);

      if (state) {
        // 1. Sync Tab State
        if (state.tab && navItems.includes(state.tab)) {
          setActiveTab(state.tab);
        }

        // 2. Sync Modal State
        const modalName = state.modal;
        if (modalName === 'search') setIsSearchOpen(true);
        if (modalName === 'settings') setSettingsModalOpen(true);
        if (modalName === 'addTransaction') setAddTransactionModalOpen(true);
        if (modalName === 'editTransaction') setEditTransactionModalOpen(true);
        if (modalName === 'editCard') setEditCardModalOpen(true);
        if (modalName === 'confirmDelete') setConfirmationModalOpen(true);
        if (modalName === 'deleteAllConfirm') setDeleteAllConfirmationOpen(true);
        if (modalName === 'confirmDeleteCard') setDeleteCardConfirmationOpen(true);
      } else {
          // Fallback to overview if state is lost
          setActiveTab('Übersicht');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); 

  // Helper: Push new state
  const pushHistoryState = (tab: string, modal: string | null) => {
      window.history.pushState({ tab, modal }, '');
  };

  // Helper: Go back (triggers popstate)
  const goBack = () => {
      window.history.back();
  };

  const navigateToTab = (tab: string) => {
      if (tab === activeTab) return;
      setActiveTab(tab);
      pushHistoryState(tab, null);
      window.scrollTo(0, 0);
  };

  // --- Swipe Navigation Logic ---
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const xDiff = touchStart.x - touchEnd.x;
    const yDiff = touchStart.y - touchEnd.y;
    
    // Horizontal swipe detection: X distance > min AND X distance > Y distance (to ignore scrolling)
    if (Math.abs(xDiff) < minSwipeDistance || Math.abs(yDiff) >= Math.abs(xDiff)) return;

    const isLeftSwipe = xDiff > 0;
    const isRightSwipe = xDiff < 0;
    
    // Prevent swipe if modals are open
    const isAnyModalOpen = isSearchOpen || isSettingsModalOpen || isAddTransactionModalOpen || 
                           isEditTransactionModalOpen || isEditCardModalOpen || isConfirmationModalOpen ||
                           isDeleteAllConfirmationOpen || isDeleteCardConfirmationOpen;
                           
    if (isAnyModalOpen) return;

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
    
    if (isSearchOpen) {
        // Special handling for search: If we navigate from search, we are effectively "closing" search
        // and moving to a tab. To keep history clean, we might want to replace the search state 
        // or just push a new state. Pushing is safer for "Back".
    }
    setIsSearchOpen(false); 
    
    setActiveTab('Transaktionen');
    pushHistoryState('Transaktionen', null);
  };

  const handleCardNavigation = (cardId: number) => {
    setSelectedCardId(cardId);
    navigateToTab('Statistiken');
  };

  // --- Action Handlers ---
  const openAddTransaction = (cardId: number | null) => {
    setCardIdForNewTransaction(cardId);
    setAddTransactionModalOpen(true);
    pushHistoryState(activeTab, 'addTransaction');
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
      pushHistoryState(activeTab, 'editTransaction');
    }
  };

  const openDeleteTransaction = (id: number | string) => {
    setItemToDelete({ id, type: 'transaction' });
    setConfirmationModalOpen(true);
    pushHistoryState(activeTab, 'confirmDelete');
  };

  const openEditCard = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setCardToEdit(card);
      setEditCardModalOpen(true);
      pushHistoryState(activeTab, 'editCard');
    }
  };

  const initiateDeleteCard = () => {
      if (cardToEdit) {
          setItemToDelete({ id: cardToEdit.id, type: 'card' });
          // Swap modals in history by replacing state
          setEditCardModalOpen(false); 
          setDeleteCardConfirmationOpen(true);
          window.history.replaceState({ tab: activeTab, modal: 'confirmDeleteCard' }, '');
      }
  }
  
  const openSearch = () => {
      setIsSearchOpen(true);
      pushHistoryState(activeTab, 'search');
  };

  const openSettings = () => {
      setSettingsModalOpen(true);
      pushHistoryState(activeTab, 'settings');
  };

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
    goBack();
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
        goBack();
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
        style={{ touchAction: 'pan-y' }} // Critical: Allows vertical scroll but lets JS handle horizontal swipes
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header 
            activeTab={activeTab} 
            setActiveTab={navigateToTab} 
            navItems={navItems} 
            onSearchClick={openSearch} 
            onSettingsClick={openSettings} 
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
        onDeleteAll={() => { 
            setSettingsModalOpen(false);
            setDeleteAllConfirmationOpen(true);
            window.history.replaceState({ tab: activeTab, modal: 'deleteAllConfirm' }, '');
        }}
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
