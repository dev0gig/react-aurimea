
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatDay } from '../utils/dateUtils';
import type { Transaction } from '../data/mockData';

interface TransactionsPageProps {
    selectedCardId: number | null;
    setSelectedCardId: (id: number | null) => void;
    selectedTransactionId: number | string | null;
    setSelectedTransactionId: (id: number | string | null) => void;
    onAddTransactionClick: (cardId: number | null) => void;
    onEditTransaction: (id: number | string) => void;
    onDeleteTransaction: (id: number | string) => void;
}

const TransactionIcon: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    let iconName: string, iconColor: string, bgColor: string;
    if (transaction.type === 'transfer') {
        iconName = 'sync_alt'; iconColor = 'text-blue-400'; bgColor = 'bg-blue-500/10';
    } else if (transaction.amount > 0) {
        iconName = 'arrow_upward'; iconColor = 'text-brand-accent-green'; bgColor = 'bg-green-500/10';
    } else {
        iconName = 'arrow_downward'; iconColor = 'text-brand-accent-red'; bgColor = 'bg-red-500/10';
    }
    return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor}`}>
            <span className={`material-symbols-outlined ${iconColor}`} style={{ fontSize: '20px' }}>{iconName}</span>
        </div>
    );
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ 
    selectedCardId, setSelectedCardId, selectedTransactionId, setSelectedTransactionId, 
    onAddTransactionClick, onEditTransaction, onDeleteTransaction 
}) => {
    const { includedCards: cards, transactionsForIncludedCards: transactions } = useFinance();
    const transactionRefs = useRef<Map<number | string, HTMLDivElement | null>>(new Map());
    const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Automatically select the first card if none is selected
    useEffect(() => {
        if (!selectedCardId && cards.length > 0) {
            setSelectedCardId(cards[0].id);
        }
    }, [cards, selectedCardId, setSelectedCardId]);

    useEffect(() => {
        if (selectedTransactionId) {
            const element = transactionRefs.current.get(selectedTransactionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('bg-purple-500/20');
                const timer = setTimeout(() => {
                    element.classList.remove('bg-purple-500/20');
                    setSelectedTransactionId(null);
                }, 2500);
                return () => clearTimeout(timer);
            } else {
                setSelectedTransactionId(null);
            }
        }
    }, [selectedTransactionId, setSelectedTransactionId]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpenMenuId(null);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const availableYears = useMemo(() => {
        if (!selectedCardId) return [];
        const years = new Set(transactions.filter(t => t.cardId === selectedCardId).map(t => new Date(t.date).getUTCFullYear()));
        return Array.from(years).sort();
    }, [transactions, selectedCardId]);

    const filteredTransactions = useMemo(() => selectedCardId 
        ? transactions.filter(t => t.cardId === selectedCardId && new Date(t.date).getUTCFullYear() === selectedYear)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : [], [transactions, selectedCardId, selectedYear]);

    const monthlyGroupedTransactions = useMemo(() => {
        return filteredTransactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth()).padStart(2, '0')}`;
            if (!acc[monthKey]) acc[monthKey] = [];
            acc[monthKey].push(transaction);
            return acc;
        }, {} as Record<string, Transaction[]>);
    }, [filteredTransactions]);

    const sortedMonthKeys = useMemo(() => Object.keys(monthlyGroupedTransactions).sort().reverse(), [monthlyGroupedTransactions]);

    const formatMonthKey = (key: string) => {
        const [year, monthIndex] = key.split('-');
        return new Date(Date.UTC(parseInt(year), parseInt(monthIndex))).toLocaleString('de-DE', { month: 'long', year: 'numeric', timeZone: 'Europe/Vienna' });
    };

    if (!selectedCardId) {
         return (
            <main className="mt-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-6">Transaktionen</h1>
                <div className="text-center py-20 bg-brand-surface rounded-3xl border border-brand-surface-alt flex flex-col items-center">
                    <div className="bg-brand-surface-alt p-4 rounded-full mb-4">
                         <span className="material-symbols-outlined text-4xl text-brand-text-secondary">receipt_long</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Keine Konten vorhanden</h3>
                    <p className="text-brand-text-secondary max-w-xs">Fügen Sie zuerst ein Konto im Dashboard hinzu.</p>
                </div>
            </main>
         )
    }

    return (
        <main className="mt-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Transaktionen</h1>
            <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 className="text-lg font-semibold text-white">Konto & Jahr auswählen</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-brand-surface-alt p-1 rounded-full">
                            <button onClick={() => setSelectedYear(p => p - 1)} disabled={!availableYears.length || selectedYear <= Math.min(...availableYears)} className="p-1 rounded-full hover:bg-brand-surface transition-colors disabled:opacity-50"><span className="material-symbols-outlined" style={{fontSize: '20px'}}>chevron_left</span></button>
                            <span className="text-sm font-semibold w-20 text-center">{selectedYear}</span>
                            <button onClick={() => setSelectedYear(p => p + 1)} disabled={selectedYear >= new Date().getFullYear()} className="p-1 rounded-full hover:bg-brand-surface transition-colors disabled:opacity-50"><span className="material-symbols-outlined" style={{fontSize: '20px'}}>chevron_right</span></button>
                        </div>
                        <button onClick={() => onAddTransactionClick(selectedCardId)} disabled={!selectedCardId} className="flex items-center gap-1 bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors disabled:bg-gray-400"><span className="material-symbols-outlined" style={{fontSize: '16px'}}>add</span></button>
                    </div>
                </div>
                <div className="flex items-center gap-3 pb-6 border-b border-brand-surface-alt overflow-x-auto">
                    {cards.map(card => (
                        <button key={card.id} onClick={() => setSelectedCardId(card.id)} className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-colors duration-300 ${selectedCardId === card.id ? 'bg-white text-black font-semibold' : 'bg-brand-surface-alt text-brand-text-secondary hover:text-white'}`}>{card.title}</button>
                    ))}
                </div>

                <div className="mt-6 space-y-4">
                    {sortedMonthKeys.length > 0 ? sortedMonthKeys.map(monthKey => (
                        <div key={monthKey}>
                            <h3 className="text-sm font-semibold text-brand-text-secondary mb-3">{formatMonthKey(monthKey)}</h3>
                            <div className="hidden md:grid md:grid-cols-5 gap-4 items-center px-3 pb-2">
                                <h4 className="md:col-span-2 text-xs font-semibold text-brand-text-secondary uppercase">Name</h4>
                                <h4 className="text-xs font-semibold text-brand-text-secondary uppercase text-center">Datum</h4>
                                <h4 className="text-xs font-semibold text-brand-text-secondary uppercase">Kategorie</h4>
                                <h4 className="text-xs font-semibold text-brand-text-secondary uppercase text-right">Betrag</h4>
                            </div>
                            <div className="space-y-1">
                                {monthlyGroupedTransactions[monthKey].map(t => (
                                    <div key={t.id} ref={el => { if (el) transactionRefs.current.set(t.id, el); else transactionRefs.current.delete(t.id); }} className={`grid grid-cols-2 md:grid-cols-5 gap-4 items-center p-3 -m-3 rounded-xl hover:bg-brand-surface-alt transition-all duration-200 ${t.isFuture ? 'opacity-50' : ''}`}>
                                        <div className="md:col-span-2 flex items-center gap-3">
                                            <TransactionIcon transaction={t} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5"><p className="font-medium truncate" title={t.name}>{t.name}</p>{t.isFixedCost && <span className="material-symbols-outlined text-purple-400 flex-shrink-0" style={{ fontSize: '16px' }}>autorenew</span>}</div>
                                                <p className="text-xs text-brand-text-secondary md:hidden">{t.category} &bull; {formatDay(t.date)}</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:block text-sm text-brand-text-secondary text-center">{formatDay(t.date)}</div>
                                        <div className="hidden md:block text-sm text-brand-text-secondary truncate">{t.category}</div>
                                        <div className="col-start-2 md:col-start-auto relative flex items-center justify-end gap-2 text-right font-semibold">
                                            <span className={t.amount > 0 ? 'text-brand-accent-green' : 'text-brand-text'}>{t.amount < 0 ? `-€${Math.abs(t.amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })}` : `+€${t.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}</span>
                                             <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === t.id ? null : t.id); }} className="text-brand-text-secondary hover:text-white z-10 p-1 -m-1 rounded-full"><span className="material-symbols-outlined" style={{fontSize: '20px'}}>more_vert</span></button>
                                            {openMenuId === t.id && (
                                              <div ref={menuRef} className="absolute top-full right-0 mt-2 bg-brand-surface-alt rounded-lg shadow-lg py-1 w-32 z-20 animate-fade-in-sm">
                                                <button onClick={(e) => { e.stopPropagation(); onEditTransaction(t.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-white hover:bg-brand-surface flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span> Bearbeiten</button>
                                                <button onClick={(e) => { e.stopPropagation(); onDeleteTransaction(t.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-brand-surface flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span> Löschen</button>
                                              </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : <div className="text-center py-12"><p className="text-brand-text-secondary">Keine Transaktionen gefunden.</p></div>}
                </div>
            </div>
            <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in-sm { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-sm { animation: fade-in-sm 0.2s ease-out forwards; }`}</style>
        </main>
    );
}

export default TransactionsPage;
