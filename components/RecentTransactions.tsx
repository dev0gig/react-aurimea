
import React, { useState, useEffect, useRef } from 'react';
import type { Transaction } from '../data/mockData';

const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const viennaDateFormatter = new Intl.DateTimeFormat('de-DE', {
        timeZone: 'Europe/Vienna',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    if (viennaDateFormatter.format(date) === viennaDateFormatter.format(today)) return 'Heute';
    if (viennaDateFormatter.format(date) === viennaDateFormatter.format(yesterday)) return 'Gestern';

    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', timeZone: 'Europe/Vienna' };
    return date.toLocaleDateString('de-DE', options);
};

const TransactionIcon: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    let iconName: string, iconColor: string, bgColor: string;

    if (transaction.type === 'transfer') {
        iconName = 'sync_alt';
        iconColor = 'text-blue-400';
        bgColor = 'bg-blue-500/10';
    } else if (transaction.amount > 0) {
        iconName = 'arrow_upward';
        iconColor = 'text-brand-accent-green';
        bgColor = 'bg-green-500/10';
    } else {
        iconName = 'arrow_downward';
        iconColor = 'text-brand-accent-red';
        bgColor = 'bg-red-500/10';
    }

    return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor}`}>
            <span className={`material-symbols-outlined ${iconColor}`} style={{ fontSize: '20px' }}>{iconName}</span>
        </div>
    );
}

interface RecentTransactionsProps {
    transactions: Transaction[];
    onTransactionNavigate: (transactionId: number | string, cardId: number) => void;
    onAddClick: () => void;
    onEditTransaction: (id: number | string) => void;
    onDeleteTransaction: (id: number | string) => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, onTransactionNavigate, onAddClick, onEditTransaction, onDeleteTransaction }) => {
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);


  return (
    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Letzte Transaktionen <span className="text-sm text-brand-text-secondary">{transactions.filter(t => !t.isFuture).length}</span></h3>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-1 bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
        >
          Neu <span className="material-symbols-outlined" style={{fontSize: '16px'}}>add</span>
        </button>
      </div>
      <div className="space-y-2">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((t) => (
            <div 
              key={t.id} 
              className={`grid grid-cols-3 md:grid-cols-4 items-center p-3 -m-3 rounded-xl hover:bg-brand-surface-alt transition-colors duration-200 cursor-pointer ${t.isFuture ? 'opacity-50' : ''}`}
              onClick={() => {
                if (!openMenuId) onTransactionNavigate(t.id, t.cardId)
              }}
            >
              <div className="col-span-2 md:col-span-2">
                <div className="flex items-center gap-3">
                    <TransactionIcon transaction={t} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="font-medium block truncate" title={t.name}>{t.name}</span>
                             {t.isFixedCost && (
                                <span
                                    className="material-symbols-outlined text-purple-400 flex-shrink-0"
                                    style={{ fontSize: '16px' }}
                                    title="Wiederkehrende Transaktion"
                                >
                                    autorenew
                                </span>
                             )}
                        </div>
                        <p className="text-xs text-brand-text-secondary">{t.category}</p>
                    </div>
                </div>
              </div>
              <span className="text-sm text-brand-text-secondary text-center hidden md:block">{getFormattedDate(t.date)}</span>
              <div className="relative flex items-center justify-end gap-2 text-right font-semibold">
                <span className={t.amount > 0 ? 'text-brand-accent-green' : 'text-brand-text'}>
                  {t.amount < 0 ? `-€${Math.abs(t.amount).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `+€${t.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === t.id ? null : t.id);
                  }}
                  className="text-brand-text-secondary hover:text-white z-10 p-1 -m-1 rounded-full"
                >
                  <span className="material-symbols-outlined" style={{fontSize: '20px'}}>more_vert</span>
                </button>
                {openMenuId === t.id && (
                  <div ref={menuRef} className="absolute top-full right-0 mt-2 bg-brand-surface-alt rounded-lg shadow-lg py-1 w-32 z-20 animate-fade-in-sm">
                    <button onClick={(e) => { e.stopPropagation(); onEditTransaction(t.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-white hover:bg-brand-surface flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span> Bearbeiten
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteTransaction(t.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-brand-surface flex items-center gap-2">
                       <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span> Löschen
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-brand-text-secondary">
            Keine letzten Transaktionen gefunden.
          </div>
        )}
      </div>
       <style>{`
            @keyframes fade-in-sm {
              from { opacity: 0; transform: translateY(-5px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-sm { animation: fade-in-sm 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default RecentTransactions;
