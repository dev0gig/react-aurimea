
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { getViennaFirstOfMonth, formatDay } from '../utils/dateUtils';
import type { Transaction } from '../data/mockData';

interface SeparateAccountsPageProps {
    onAddTransactionClick: (cardId: number | null) => void;
    onEditTransaction: (id: number | string) => void;
    onDeleteTransaction: (id: number | string) => void;
    selectedCardId: number | null;
    setSelectedCardId: (id: number | null) => void;
}

const TransactionIcon: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    let iconName: string, iconColor: string, bgColor: string;
    if (transaction.type === 'transfer') { iconName = 'sync_alt'; iconColor = 'text-blue-400'; bgColor = 'bg-blue-500/10'; }
    else if (transaction.amount > 0) { iconName = 'arrow_upward'; iconColor = 'text-brand-accent-green'; bgColor = 'bg-green-500/10'; }
    else { iconName = 'arrow_downward'; iconColor = 'text-brand-accent-red'; bgColor = 'bg-red-500/10'; }
    return <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor}`}><span className={`material-symbols-outlined ${iconColor}`} style={{ fontSize: '20px' }}>{iconName}</span></div>;
}

const SeparateAccountsPage: React.FC<SeparateAccountsPageProps> = ({
    onAddTransactionClick, onEditTransaction, onDeleteTransaction, selectedCardId, setSelectedCardId
}) => {
    const { excludedCards: cards, transactions } = useFinance();
    const [currentDate, setCurrentDate] = useState(getViennaFirstOfMonth());
    const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cards.length > 0 && !cards.some(c => c.id === selectedCardId)) setSelectedCardId(cards[0].id);
        else if (cards.length === 0) setSelectedCardId(null);
    }, [cards, selectedCardId, setSelectedCardId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuId(null); };
        document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const handlePrevMonth = () => setCurrentDate(p => { const d = new Date(p); d.setUTCMonth(d.getUTCMonth() - 1); return d; });
    const handleNextMonth = () => setCurrentDate(p => { const d = new Date(p); d.setUTCMonth(d.getUTCMonth() + 1); return d; });
    const isNextMonthFuture = () => { const n = new Date(currentDate); n.setUTCMonth(n.getUTCMonth() + 1); return n > getViennaFirstOfMonth(); }

    const { cardStats, transactionsForMonth } = useMemo(() => {
        if (!selectedCardId) return { cardStats: { totalIncome: 0, totalExpense: 0, cardBalance: 0 }, transactionsForMonth: [] };

        const filtered = transactions.filter(t => !t.isFuture && t.cardId === selectedCardId);
        const cardBalance = filtered.reduce((acc, t) => acc + t.amount, 0);

        const monthly = transactions.filter(t => t.cardId === selectedCardId && new Date(t.date).getUTCFullYear() === currentDate.getUTCFullYear() && new Date(t.date).getUTCMonth() === currentDate.getUTCMonth())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const monthlyCalc = monthly.filter(t => !t.isFuture);

        const totalIncome = monthlyCalc.reduce((acc, t) => t.amount > 0 ? acc + t.amount : acc, 0);
        const totalExpense = monthlyCalc.reduce((acc, t) => t.amount < 0 ? acc + Math.abs(t.amount) : acc, 0);

        return { cardStats: { totalIncome, totalExpense, cardBalance }, transactionsForMonth: monthly };
    }, [selectedCardId, transactions, currentDate]);

    if (cards.length === 0) return <main className="mt-8 animate-fade-in"><h1 className="text-3xl font-bold text-white mb-6">Separate Konten</h1><div className="bg-brand-surface p-12 rounded-3xl border border-brand-surface-alt text-center"><span className="material-symbols-outlined text-5xl text-brand-text-secondary mb-4">credit_card_off</span><h2 className="text-xl font-semibold mb-2">Keine separaten Konten</h2><p className="text-brand-text-secondary max-w-md mx-auto">Konten, die Sie von der Gesamtbilanz ausschließen, werden hier angezeigt.</p></div></main>;

    return (
        <main className="mt-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Separate Konten</h1>

            <div className="bg-brand-surface p-6 rounded-3xl mb-6 border border-brand-surface-alt">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-semibold text-white">Konto auswählen</h2>
                    <div className="flex items-center gap-2 bg-brand-surface-alt p-1 rounded-full">
                        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-brand-surface transition-colors"><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span></button>
                        <span className="text-sm font-semibold w-32 text-center">{currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric', timeZone: 'Europe/Vienna' })}</span>
                        <button onClick={handleNextMonth} disabled={isNextMonthFuture()} className="p-1 rounded-full hover:bg-brand-surface transition-colors disabled:opacity-50"><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span></button>
                    </div>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-brand-surface-alt overflow-x-auto">
                    {cards.map(card => (
                        <button key={card.id} onClick={() => setSelectedCardId(card.id)} className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-colors duration-300 ${selectedCardId === card.id ? 'bg-white text-black font-semibold' : 'bg-brand-surface-alt text-brand-text-secondary hover:text-white'}`}>{card.title}</button>
                    ))}
                </div>
            </div>

            {selectedCardId && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt"><h3 className="text-lg font-semibold text-brand-text-secondary mb-2">Aktueller Kontostand</h3><p className={`text-4xl font-bold mt-2 ${cardStats.cardBalance >= 0 ? 'text-white' : 'text-brand-accent-red'}`}>€{cardStats.cardBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p></div>
                        <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt"><p className="text-lg font-semibold text-brand-text-secondary mb-2">Einnahmen</p><p className="text-4xl font-bold mt-2 text-brand-accent-green">+€{cardStats.totalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p></div>
                        <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt"><p className="text-lg font-semibold text-brand-text-secondary mb-2">Ausgaben</p><p className="text-4xl font-bold mt-2 text-brand-accent-red">-€{cardStats.totalExpense.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p></div>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Transaktionen</h3>
                            <button onClick={() => onAddTransactionClick(selectedCardId)} className="flex items-center gap-1 bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">Neu <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span></button>
                        </div>
                        <div className="space-y-1">
                            {transactionsForMonth.length > 0 ? transactionsForMonth.map(t => (
                                <div key={t.id} className={`grid grid-cols-2 md:grid-cols-4 gap-4 items-center p-3 -m-3 rounded-xl hover:bg-brand-surface-alt transition-all duration-200 ${t.isFuture ? 'opacity-50' : ''}`}>
                                    <div className="md:col-span-2 flex items-center gap-3"><TransactionIcon transaction={t} /><div className="flex-1 min-w-0"><p className="font-medium truncate" title={t.name}>{t.name}</p><p className="text-xs text-brand-text-secondary md:hidden">{t.category} &bull; {formatDay(t.date)}</p></div></div>
                                    <div className="hidden md:block text-sm text-brand-text-secondary truncate" title={t.category}>{t.category}</div>
                                    <div className="col-start-2 md:col-start-auto relative flex items-center justify-end gap-2 text-right font-semibold">
                                        <span className="hidden md:inline-block text-sm text-brand-text-secondary">{formatDay(t.date)}</span>
                                        <span className={t.amount > 0 ? 'text-brand-accent-green' : 'text-brand-text'}>{t.amount < 0 ? `-€${Math.abs(t.amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })}` : `+€${t.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}</span>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === t.id ? null : t.id); }} className="text-brand-text-secondary hover:text-white z-10 p-1 -m-1 rounded-full"><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span></button>
                                        {openMenuId === t.id && (<div ref={menuRef} className="absolute top-full right-0 mt-2 bg-brand-surface-alt rounded-lg shadow-lg py-1 w-32 z-20 animate-fade-in-sm"><button onClick={(e) => { e.stopPropagation(); onEditTransaction(t.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-white hover:bg-brand-surface flex items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span> Bearbeiten</button><button onClick={(e) => { e.stopPropagation(); onDeleteTransaction(t.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-brand-surface flex items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span> Löschen</button></div>)}
                                    </div>
                                </div>
                            )) : <div className="text-center py-8 text-brand-text-secondary">Keine Transaktionen gefunden.</div>}
                        </div>
                    </div>
                </div>
            )}
            <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in-sm { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-sm { animation: fade-in-sm 0.2s ease-out forwards; }`}</style>
        </main>
    );
};

export default SeparateAccountsPage;
