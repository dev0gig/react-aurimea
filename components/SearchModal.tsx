
import React, { useState, useMemo } from 'react';
import type { Transaction, Card } from '../data/mockData';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
    cards: Card[];
    onNavigate: (transactionId: number | string, cardId: number) => void;
}

const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, transactions, cards, onNavigate }) => {
    const [query, setQuery] = useState('');

    const cardMap = useMemo(() => new Map(cards.map(c => [c.id, c])), [cards]);

    const filteredTransactions = useMemo(() => {
        if (!query.trim()) {
            return [];
        }
        const lowerCaseQuery = query.toLowerCase();
        return transactions.filter(t => 
            t.name.toLowerCase().includes(lowerCaseQuery) ||
            t.category.toLowerCase().includes(lowerCaseQuery) ||
            getFormattedDate(t.date).toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 20); // Limit results for performance
    }, [query, transactions]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center p-4 sm:p-6 lg:p-20 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-brand-surface w-full max-w-2xl h-full rounded-3xl shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-brand-surface-alt flex items-center gap-4">
                    <span className="material-symbols-outlined text-brand-text-secondary">search</span>
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Suche Transaktionen nach Name, Kategorie oder Datum..."
                        className="w-full bg-transparent focus:outline-none text-white text-lg"
                        autoFocus
                    />
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-surface-alt transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(t => {
                            const card = cardMap.get(t.cardId);
                            return (
                                <div 
                                    key={t.id}
                                    className="grid grid-cols-3 items-center p-3 rounded-xl hover:bg-brand-surface-alt transition-colors duration-200 cursor-pointer"
                                    onClick={() => onNavigate(t.id, t.cardId)}
                                >
                                    <div className="col-span-2">
                                        <div>
                                            <span className="font-medium">{t.name}</span>
                                            <p className="text-xs text-brand-text-secondary">{getFormattedDate(t.date)} &bull; {card?.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-right font-semibold">
                                        <span className={t.amount > 0 ? 'text-brand-accent-green' : 'text-brand-text'}>
                                          {t.amount < 0 ? `-€${Math.abs(t.amount).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `+€${t.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        query.trim() && (
                            <div className="text-center py-16 text-brand-text-secondary">
                                <p>Keine Ergebnisse für "{query}" gefunden</p>
                            </div>
                        )
                    )}
                     {!query.trim() && (
                            <div className="text-center py-16 text-brand-text-secondary">
                                <p>Beginnen Sie zu tippen, um Ihre Transaktionen zu durchsuchen.</p>
                            </div>
                        )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    )
};

export default SearchModal;
