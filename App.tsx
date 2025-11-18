
import React, { useState } from 'react';
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
  
  // Modal Data State
  const [cardIdForNewTransaction, setCardIdForNewTransaction] = useState<number | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: number | string; type: 'transaction' } | null>(null);

  const navItems = ['Übersicht', 'Transaktionen', 'Statistiken', 'Separate Konten'];

  // Navigation Handlers
  const handleTransactionNavigation = (transactionId: number | string, cardId: number) => {
    setSelectedCardId(cardId);
    setSelectedTransactionId(transactionId);
    setActiveTab('Transaktionen');
    setIsSearchOpen(false);
  };

  const handleCardNavigation = (cardId: number) => {
    setSelectedCardId(cardId);
    setActiveTab('Statistiken');
  };

  // Action Handlers
  const openAddTransaction = (cardId: number | null) => {
    setCardIdForNewTransaction(cardId);
    setAddTransactionModalOpen(true);
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
    }
  };

  const openDeleteTransaction = (id: number | string) => {
    setItemToDelete({ id, type: 'transaction' });
    setConfirmationModalOpen(true);
  };

  const openEditCard = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setCardToEdit(card);
      setEditCardModalOpen(true);
    }
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
    setSettingsModalOpen(false);
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
        setSettingsModalOpen(false);
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
    <div className="bg-brand-background text-brand-text font-sans min-h-screen pb-20 md:pb-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} onSearchClick={() => setIsSearchOpen(true)} onSettingsClick={() => setSettingsModalOpen(true)} />
        
        {activeTab === 'Übersicht' && (
          <DashboardPage
            selectedCardId={selectedCardId}
            onCardNavigate={handleCardNavigation}
            onSeparateAccountNavigate={(id) => { setSelectedCardId(id); setActiveTab('Separate Konten'); }}
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
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} />
      
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        transactions={transactions}
        cards={cards}
        onNavigate={handleTransactionNavigation}
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onExport={handleExportData}
        onImport={handleImportData}
        onDeleteAll={() => { setSettingsModalOpen(false); setDeleteAllConfirmationOpen(true); }}
      />
      <AddTransactionModal 
        isOpen={isAddTransactionModalOpen}
        onClose={() => setAddTransactionModalOpen(false)}
        onAddTransaction={(data) => { addTransaction(data); setAddTransactionModalOpen(false); }}
        cards={cards}
        preselectedCardId={cardIdForNewTransaction}
      />
      {transactionToEdit && (
        <EditTransactionModal 
            isOpen={isEditTransactionModalOpen}
            onClose={() => setEditTransactionModalOpen(false)}
            onUpdateTransaction={(data) => { updateTransaction(data); setEditTransactionModalOpen(false); }}
            transaction={transactionToEdit}
            cards={cards}
        />
      )}
      {cardToEdit && (
        <EditCardModal 
          isOpen={isEditCardModalOpen}
          onClose={() => setEditCardModalOpen(false)}
          onUpdateCard={(data) => { updateCard(data); setEditCardModalOpen(false); }}
          card={cardToEdit}
        />
      )}
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={() => { if(itemToDelete) deleteTransaction(itemToDelete.id); setConfirmationModalOpen(false); }}
        title="Löschen bestätigen"
        message="Sind Sie sicher?"
      />
       <ConfirmationModal 
        isOpen={isDeleteAllConfirmationOpen}
        onClose={() => setDeleteAllConfirmationOpen(false)}
        onConfirm={() => { deleteAllData(); setDeleteAllConfirmationOpen(false); }}
        title="Alle Daten löschen?"
        message="Dies kann nicht rückgängig gemacht werden."
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
