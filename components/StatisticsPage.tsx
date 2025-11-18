
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { getViennaFirstOfMonth } from '../utils/dateUtils';

interface StatisticsPageProps {
    selectedCardId: number | null;
    setSelectedCardId: (id: number | null) => void;
}

const expenseColors: { [key: string]: string } = {
  'Lebensmittel': '#FF6384', 'Einkaufen': '#FFCD56', 'Gesundheit': '#4BC0C0',
  'Unterhaltung': '#36A2EB', 'Transport': '#9966FF', 'Investition': '#ec4899',
  'Sonstiges': '#FF9F40', 'Fixkosten': '#8b5cf6', 'Einkommen': '#A6F787', 'Standard': '#8A8B9F',
};

// Helper Components to clean up the main file
const StatCard: React.FC<{ title: string; amount: number; type: 'balance' | 'income' | 'expense' }> = ({ title, amount, type }) => {
    const colorClass = type === 'income' ? 'text-brand-accent-green' : type === 'expense' ? 'text-brand-accent-red' : (amount >= 0 ? 'text-white' : 'text-brand-accent-red');
    const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';
    
    return (
        <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt flex flex-col justify-between">
            <p className="text-brand-text-secondary text-sm font-medium">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${colorClass}`}>
                {prefix}€{Math.abs(amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
};

const StatisticsPage: React.FC<StatisticsPageProps> = ({ selectedCardId, setSelectedCardId }) => {
    const { includedCards: cards, transactionsForIncludedCards: transactions } = useFinance();
    const [currentDate, setCurrentDate] = useState(getViennaFirstOfMonth());

    const handlePrevMonth = () => setCurrentDate(p => { const d = new Date(p); d.setUTCMonth(d.getUTCMonth() - 1); return d; });
    const handleNextMonth = () => setCurrentDate(p => { const d = new Date(p); d.setUTCMonth(d.getUTCMonth() + 1); return d; });
    
    const isNextMonthFuture = () => {
        const nextMonth = new Date(currentDate); nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        // Compare simply against year/month to avoid time issues
        const now = new Date();
        return nextMonth.getFullYear() > now.getFullYear() || (nextMonth.getFullYear() === now.getFullYear() && nextMonth.getMonth() > now.getMonth());
    }

    const cardStats = useMemo(() => {
        if (!selectedCardId) return null;
        
        const filtered = transactions.filter(t => !t.isFuture && t.cardId === selectedCardId);
        const cardBalance = filtered.reduce((acc, t) => acc + t.amount, 0);
        
        const monthly = filtered.filter(t => {
            const d = new Date(t.date);
            return d.getUTCFullYear() === currentDate.getUTCFullYear() && d.getUTCMonth() === currentDate.getUTCMonth();
        });

        const totalIncome = monthly.reduce((acc, t) => t.amount > 0 ? acc + t.amount : acc, 0);
        const totalExpense = monthly.reduce((acc, t) => t.amount < 0 ? acc + Math.abs(t.amount) : acc, 0);
        
        const expenseByCategory = monthly.filter(t => t.amount < 0).reduce((acc: Record<string, number>, t) => {
            const c = t.category || 'Sonstiges';
            acc[c] = (acc[c] || 0) + Math.abs(t.amount);
            return acc;
        }, {} as Record<string, number>);

        const expenseSplitData = Object.entries(expenseByCategory)
            .map(([name, value]) => ({ name, value, color: expenseColors[name] || expenseColors.Standard }))
            .sort((a, b) => b.value - a.value);

        const monthBuckets = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date(currentDate); d.setUTCMonth(d.getUTCMonth() - i);
            return { 
                name: d.toLocaleString('de-DE', { month: 'short', timeZone: 'Europe/Vienna' }), 
                year: d.getUTCFullYear(), 
                month: d.getUTCMonth(), 
                value: 0 
            };
        }).reverse();

        filtered.forEach(t => {
            if (t.amount > 0) {
                const d = new Date(t.date);
                const bucket = monthBuckets.find(m => m.year === d.getUTCFullYear() && m.month === d.getUTCMonth());
                if (bucket) bucket.value += t.amount;
            }
        });

        return { totalIncome, totalExpense, expenseSplitData, totalExpenseForChart: totalExpense, revenueFlowData: monthBuckets, cardBalance };
    }, [selectedCardId, transactions, currentDate]);

    const selectedCardTitle = cards.find(c => c.id === selectedCardId)?.title || 'Ausgewähltes Konto';
    const monthLabel = currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric', timeZone: 'Europe/Vienna' });

    return (
        <main className="mt-8 animate-fade-in pb-20">
            <h1 className="text-3xl font-bold text-white mb-6">Statistiken</h1>
            
            <div className="bg-brand-surface p-6 rounded-3xl mb-6 border border-brand-surface-alt">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-white">Konto auswählen</h2>
                    <div className="flex items-center gap-2 bg-brand-surface-alt p-1 rounded-full self-start sm:self-auto">
                        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-brand-surface transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                        <span className="text-sm font-semibold w-32 text-center text-brand-text">{monthLabel}</span>
                        <button onClick={handleNextMonth} disabled={isNextMonthFuture()} className="p-1 rounded-full hover:bg-brand-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {cards.map(card => (
                        <button 
                            key={card.id} 
                            onClick={() => setSelectedCardId(card.id)} 
                            className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-colors duration-300 border ${selectedCardId === card.id ? 'bg-white text-black border-white font-semibold' : 'bg-transparent border-brand-surface-alt text-brand-text-secondary hover:border-brand-text-secondary'}`}
                        >
                            {card.title}
                        </button>
                    ))}
                </div>
            </div>
            
            {selectedCardId && cardStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Key Metrics */}
                    <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                         <StatCard title="Aktueller Kontostand" amount={cardStats.cardBalance} type="balance" />
                         <StatCard title={`Einnahmen (${monthLabel})`} amount={cardStats.totalIncome} type="income" />
                         <StatCard title={`Ausgaben (${monthLabel})`} amount={cardStats.totalExpense} type="expense" />
                    </div>

                    {/* Charts */}
                    <div className="md:col-span-2 lg:col-span-2 bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt">
                        <h3 className="text-lg font-semibold mb-6">Einnahmenentwicklung (6 Monate)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cardStats.revenueFlowData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#25263B" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8A8B9F', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A8B9F', fontSize: 12 }} tickFormatter={(value) => `€${value/1000}k`} />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                                        contentStyle={{ background: '#25263B', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value: number) => `€${value.toLocaleString('de-DE')}`}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {cardStats.revenueFlowData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === cardStats.revenueFlowData.length - 1 ? '#8884d8' : '#3c3d5a'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="md:col-span-1 lg:col-span-1 bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Ausgabenverteilung</h3>
                        {cardStats.expenseSplitData.length > 0 ? (
                            <div className="flex flex-col items-center justify-center flex-grow gap-6">
                                <div className="w-48 h-48 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={cardStats.expenseSplitData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                                {cardStats.expenseSplitData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xs text-brand-text-secondary">Gesamt</span>
                                        <span className="text-xl font-bold">€{cardStats.totalExpenseForChart.toLocaleString('de-DE', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                </div>
                                <div className="w-full space-y-3 overflow-y-auto max-h-60 pr-2 custom-scrollbar">
                                    {cardStats.expenseSplitData.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-brand-text-secondary truncate max-w-[120px]">{item.name}</span>
                                            </div>
                                            <span className="font-medium">{((item.value / cardStats.totalExpenseForChart) * 100).toFixed(0)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center text-brand-text-secondary opacity-50">
                                <span className="material-symbols-outlined text-4xl mb-2">donut_small</span>
                                <span className="text-sm">Keine Ausgaben diesen Monat</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-brand-surface rounded-3xl border border-brand-surface-alt flex flex-col items-center">
                    <div className="bg-brand-surface-alt p-4 rounded-full mb-4">
                         <span className="material-symbols-outlined text-4xl text-brand-text-secondary">analytics</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Wählen Sie ein Konto aus</h3>
                    <p className="text-brand-text-secondary max-w-xs">Tippen Sie oben auf ein Konto, um detaillierte Statistiken und Analysen zu sehen.</p>
                </div>
            )}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #25263B; border-radius: 4px; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } 
                .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
            `}</style>
        </main>
    );
}

export default StatisticsPage;
