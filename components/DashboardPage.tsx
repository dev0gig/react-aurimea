
import React, { useState, useMemo } from 'react';
import TotalBalanceCard from './TotalBalanceCard';
import IncomeExpenseCards from './IncomeExpenseCards';
import RevenueFlowChart from './RevenueFlowChart';
import ExpenseSplitChart from './ExpenseSplitChart';
import RecentTransactions from './RecentTransactions';
import MyCards from './MyCards';
import FixedCosts from './FixedCosts';
import type { Card, Transaction } from '../data/mockData';

interface DashboardPageProps {
    cards: Card[];
    selectedCardId: number | null;
    onCardNavigate: (cardId: number) => void;
    onAddCard: (card: Omit<Card, 'id'>) => void;
    onEditCard: (cardId: number) => void;
    transactions: Transaction[];
    manualTransactions: Transaction[];
    onTransactionNavigate: (transactionId: number | string, cardId: number) => void;
    onAddTransactionClick: (cardId: number | null) => void;
    onEditTransaction: (id: number | string) => void;
    onDeleteTransaction: (id: number | string) => void;
    onFixedCostNavigate: (transactionId: number | string) => void;
}

const getViennaFirstOfMonth = () => {
    const now = new Date();
    const viennaDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Vienna' });
    const [year, month] = viennaDateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, 1));
};

const DashboardPage: React.FC<DashboardPageProps> = ({ 
    cards, selectedCardId, onCardNavigate, onAddCard, onEditCard,
    transactions, manualTransactions, onTransactionNavigate, onAddTransactionClick, onEditTransaction, onDeleteTransaction, 
    onFixedCostNavigate
}) => {
    const [currentDate, setCurrentDate] = useState(getViennaFirstOfMonth());

    const transactionsForCalculations = useMemo(() => transactions.filter(t => !t.isFuture), [transactions]);

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getTime());
            newDate.setUTCMonth(newDate.getUTCMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getTime());
            newDate.setUTCMonth(newDate.getUTCMonth() + 1);
            return newDate;
        });
    };
  
    const isNextMonthFuture = () => {
        const nextMonth = new Date(currentDate.getTime());
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        
        const now = new Date();
        const viennaDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Vienna' });
        const [year, month] = viennaDateStr.split('-').map(Number);
        const startOfCurrentViennaMonth = new Date(Date.UTC(year, month - 1, 1));

        return nextMonth > startOfCurrentViennaMonth;
    }
    
    const fixedCostTemplates = manualTransactions.filter(t => t.isFixedCost);

    return (
        <main className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white">Mein Dashboard</h1>
                <div className="flex items-center gap-2 bg-brand-surface p-1 rounded-full">
                    <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-brand-surface-alt transition-colors">
                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>chevron_left</span>
                    </button>
                    <span className="text-sm font-semibold w-32 text-center">{currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric', timeZone: 'Europe/Vienna' })}</span>
                    <button onClick={handleNextMonth} disabled={isNextMonthFuture()} className="p-1 rounded-full hover:bg-brand-surface-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>chevron_right</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <TotalBalanceCard transactions={transactionsForCalculations} currentDate={currentDate} />
                </div>
                <div className="md:col-span-1">
                    <IncomeExpenseCards transactions={transactionsForCalculations} currentDate={currentDate} />
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueFlowChart transactions={transactionsForCalculations} currentDate={currentDate} />
                <ExpenseSplitChart transactions={transactionsForCalculations} currentDate={currentDate} />
                </div>
                <RecentTransactions 
                    transactions={transactions} 
                    onTransactionNavigate={onTransactionNavigate}
                    onAddClick={() => onAddTransactionClick(null)}
                    onEditTransaction={onEditTransaction}
                    onDeleteTransaction={onDeleteTransaction}
                />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
                <MyCards 
                    cards={cards}
                    selectedCardId={selectedCardId}
                    onCardNavigate={onCardNavigate}
                    onAddCard={onAddCard}
                    onEditCard={onEditCard}
                />
                <FixedCosts 
                    fixedCosts={fixedCostTemplates} 
                    onFixedCostNavigate={onFixedCostNavigate}
                    onEditFixedCost={onEditTransaction}
                    onDeleteFixedCost={onDeleteTransaction}
                />
            </div>
            </div>
        </main>
    );
}

export default DashboardPage;
