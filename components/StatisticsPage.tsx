import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { Card, Transaction } from '../data/mockData';

interface StatisticsPageProps {
    cards: Card[];
    transactions: Transaction[];
    selectedCardId: number | null;
    setSelectedCardId: (id: number | null) => void;
}

const expenseColors: { [key: string]: string } = {
  'Lebensmittel': '#FF6384',
  'Einkaufen': '#FFCD56',
  'Gesundheit': '#4BC0C0',
  'Unterhaltung': '#36A2EB',
  'Transport': '#9966FF',
  'Investition': '#ec4899',
  'Sonstiges': '#FF9F40',
  'Fixkosten': '#8b5cf6',
  'Einkommen': '#A6F787',
  'Standard': '#8A8B9F',
};

const StatisticsPage: React.FC<StatisticsPageProps> = ({ cards, transactions, selectedCardId, setSelectedCardId }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };
  
    const isNextMonthFuture = () => {
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const today = new Date();
        return nextMonth.getFullYear() > today.getFullYear() || 
               (nextMonth.getFullYear() === today.getFullYear() && nextMonth.getMonth() > today.getMonth());
    }

    const cardStats = useMemo(() => {
        if (!selectedCardId) {
            return { totalIncome: 0, totalExpense: 0, expenseSplitData: [], totalExpenseForChart: 0, revenueFlowData: [] };
        }
        const filteredForCard = transactions.filter(t => t.cardId === selectedCardId);

        // --- Date setup ---
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const prevMonthDate = new Date(currentDate);
        prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
        const prevMonthYear = prevMonthDate.getFullYear();
        const prevMonth = prevMonthDate.getMonth();

        // --- Current & Previous Month Transactions ---
        const monthlyTransactions = filteredForCard.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === currentYear &&
                    transactionDate.getMonth() === currentMonth;
        });
         const prevMonthsTransactions = filteredForCard.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === prevMonthYear &&
                   transactionDate.getMonth() === prevMonth;
        });

        // --- Stat Calculations ---
        const totalIncome = prevMonthsTransactions.reduce((acc, t) => t.amount > 0 ? acc + t.amount : acc, 0);
        const totalExpense = monthlyTransactions.reduce((acc, t) => t.amount < 0 ? acc + Math.abs(t.amount) : acc, 0);
        
        const expenseByCategory = monthlyTransactions
            .filter(t => t.amount < 0)
            .reduce((acc: Record<string, number>, t) => {
                const category = t.category || 'Sonstiges';
                acc[category] = (acc[category] || 0) + Math.abs(t.amount);
                return acc;
            }, {} as Record<string, number>);

        const expenseSplitData = Object.entries(expenseByCategory).map(([name, value]) => ({
            name,
            value,
            color: expenseColors[name] || expenseColors.Standard
        }));

        // --- Revenue Flow Data (last 5 months) ---
        const monthBuckets = Array.from({ length: 5 }).map((_, i) => {
            const d = new Date(currentDate);
            d.setDate(1); // Avoid month skipping issues
            d.setMonth(d.getMonth() - i);
            return {
                name: d.toLocaleString('de-DE', { month: 'short' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                value: 0
            };
        }).reverse();

        filteredForCard.forEach(t => {
            if (t.amount > 0) {
                const date = new Date(t.date);
                const transactionYear = date.getFullYear();
                const transactionMonth = date.getMonth();
        
                const bucket = monthBuckets.find(m => m.year === transactionYear && m.month === transactionMonth);
                if (bucket) {
                    bucket.value += t.amount;
                }
            }
        });

        return {
            totalIncome,
            totalExpense,
            expenseSplitData,
            totalExpenseForChart: totalExpense,
            revenueFlowData: monthBuckets.map(({name, value}) => ({name, value}))
        };
    }, [selectedCardId, transactions, currentDate]);

    const selectedCard = cards.find(c => c.id === selectedCardId);
    
    const prevMonthDate = useMemo(() => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() - 1);
        return d;
    }, [currentDate]);

    return (
        <main className="mt-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Statistiken für {selectedCard?.title || '...'}</h1>
            
            <div className="bg-brand-surface p-6 rounded-3xl mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-semibold text-white">Karte auswählen</h2>
                    <div className="flex items-center gap-2 bg-brand-surface-alt p-1 rounded-full">
                        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-brand-surface transition-colors">
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>chevron_left</span>
                        </button>
                        <span className="text-sm font-semibold w-32 text-center">{currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={handleNextMonth} disabled={isNextMonthFuture()} className="p-1 rounded-full hover:bg-brand-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>chevron_right</span>
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-brand-surface-alt overflow-x-auto">
                    {cards.map(card => (
                        <button
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-colors duration-300 ${
                                selectedCardId === card.id
                                    ? 'bg-white text-black font-semibold'
                                    : 'bg-brand-surface-alt text-brand-text-secondary hover:text-white hover:bg-brand-surface-alt/70'
                            }`}
                        >
                            {card.title} - **** {card.number.slice(-4)}
                        </button>
                    ))}
                </div>
            </div>
            
            {selectedCardId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-brand-surface p-4 rounded-3xl">
                        <p className="text-brand-text-secondary text-sm">Einnahmen ({prevMonthDate.toLocaleString('de-DE', { month: 'long' })})</p>
                        <p className="text-2xl font-semibold mt-1 text-brand-accent-green">
                            +€{cardStats.totalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-brand-surface p-4 rounded-3xl">
                        <p className="text-brand-text-secondary text-sm">Ausgaben ({currentDate.toLocaleString('de-DE', { month: 'long' })})</p>
                        <p className="text-2xl font-semibold mt-1 text-brand-accent-red">
                            -€{cardStats.totalExpense.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="bg-brand-surface p-6 rounded-3xl">
                    <h3 className="text-lg font-semibold">Einnahmenentwicklung</h3>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cardStats.revenueFlowData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#25263B" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8A8B9F', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A8B9F', fontSize: 12 }} tickFormatter={(value) => `€${Math.round(value/100)/10}K`} />
                            <Tooltip contentStyle={{ background: '#25263B', border: 'none', borderRadius: '1rem', color: '#fff' }} formatter={(value: number) => `${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`} />
                            <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </div>

                    <div className="bg-brand-surface p-6 rounded-3xl">
                    <h3 className="text-lg font-semibold mb-4">Ausgabenverteilung</h3>
                    {cardStats.expenseSplitData.length > 0 ? (
                        <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-40 h-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={cardStats.expenseSplitData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={2} dataKey="value" stroke="none">
                                {cardStats.expenseSplitData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                </Pie>
                            </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-sm text-brand-text-secondary">Gesamt</span>
                            <span className="text-xl font-bold">€{cardStats.totalExpenseForChart.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm flex-1">
                            {cardStats.expenseSplitData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-brand-text-secondary">{item.name}</span>
                                </div>
                                <span className="font-semibold">{cardStats.totalExpenseForChart > 0 ? `${((item.value / cardStats.totalExpenseForChart) * 100).toFixed(0)}%` : '0%'}</span>
                            </div>
                            ))}
                        </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-brand-text-secondary min-h-[220px]">
                            Keine Ausgabendaten für diese Karte in diesem Monat.
                        </div>
                    )}
                    </div>
                </div>
            ) : (
                 <div className="text-center py-12 bg-brand-surface rounded-3xl">
                    <p className="text-brand-text-secondary">Bitte wählen Sie eine Karte aus, um die Statistiken anzuzeigen.</p>
                </div>
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                .recharts-wrapper { outline: none; }
            `}</style>
        </main>
    );
}

export default StatisticsPage;