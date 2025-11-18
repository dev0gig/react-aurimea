
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

const StatisticsPage: React.FC<StatisticsPageProps> = ({ selectedCardId, setSelectedCardId }) => {
    const { includedCards: cards, transactionsForIncludedCards: transactions } = useFinance();
    const [currentDate, setCurrentDate] = useState(getViennaFirstOfMonth());

    const handlePrevMonth = () => setCurrentDate(p => { const d = new Date(p); d.setUTCMonth(d.getUTCMonth() - 1); return d; });
    const handleNextMonth = () => setCurrentDate(p => { const d = new Date(p); d.setUTCMonth(d.getUTCMonth() + 1); return d; });
    
    const isNextMonthFuture = () => {
        const nextMonth = new Date(currentDate); nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        return nextMonth > getViennaFirstOfMonth();
    }

    const cardStats = useMemo(() => {
        if (!selectedCardId) return { totalIncome: 0, totalExpense: 0, expenseSplitData: [], totalExpenseForChart: 0, revenueFlowData: [], cardBalance: 0 };
        
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
        }, {});

        const expenseSplitData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value, color: expenseColors[name] || expenseColors.Standard }));

        const monthBuckets = Array.from({ length: 5 }).map((_, i) => {
            const d = new Date(currentDate); d.setUTCMonth(d.getUTCMonth() - i);
            return { name: d.toLocaleString('de-DE', { month: 'short', timeZone: 'Europe/Vienna' }), year: d.getUTCFullYear(), month: d.getUTCMonth(), value: 0 };
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

    return (
        <main className="mt-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Statistiken für {cards.find(c => c.id === selectedCardId)?.title || '...'}</h1>
            
            <div className="bg-brand-surface p-6 rounded-3xl mb-6 border border-brand-surface-alt">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-semibold text-white">Konto auswählen</h2>
                    <div className="flex items-center gap-2 bg-brand-surface-alt p-1 rounded-full">
                        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-brand-surface transition-colors"><span className="material-symbols-outlined" style={{fontSize: '20px'}}>chevron_left</span></button>
                        <span className="text-sm font-semibold w-32 text-center">{currentDate.toLocaleString('de-DE', { month: 'long', year: 'numeric', timeZone: 'Europe/Vienna' })}</span>
                        <button onClick={handleNextMonth} disabled={isNextMonthFuture()} className="p-1 rounded-full hover:bg-brand-surface transition-colors disabled:opacity-50"><span className="material-symbols-outlined" style={{fontSize: '20px'}}>chevron_right</span></button>
                    </div>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-brand-surface-alt overflow-x-auto">
                    {cards.map(card => (
                        <button key={card.id} onClick={() => setSelectedCardId(card.id)} className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-colors duration-300 ${selectedCardId === card.id ? 'bg-white text-black font-semibold' : 'bg-brand-surface-alt text-brand-text-secondary hover:text-white'}`}>{card.title}</button>
                    ))}
                </div>
            </div>
            
            {selectedCardId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt">
                        <h3 className="text-lg font-semibold text-brand-text-secondary mb-2">Aktueller Kontostand</h3>
                        <p className={`text-4xl font-bold mt-2 ${cardStats.cardBalance >= 0 ? 'text-white' : 'text-brand-accent-red'}`}>€{cardStats.cardBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-brand-surface p-4 rounded-3xl border border-brand-surface-alt"><p className="text-brand-text-secondary text-sm">Einnahmen ({currentDate.toLocaleString('de-DE', { month: 'long', timeZone: 'Europe/Vienna' })})</p><p className="text-2xl font-semibold mt-1 text-brand-accent-green">+€{cardStats.totalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p></div>
                    <div className="bg-brand-surface p-4 rounded-3xl border border-brand-surface-alt"><p className="text-brand-text-secondary text-sm">Ausgaben ({currentDate.toLocaleString('de-DE', { month: 'long', timeZone: 'Europe/Vienna' })})</p><p className="text-2xl font-semibold mt-1 text-brand-accent-red">-€{cardStats.totalExpense.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p></div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt"><h3 className="text-lg font-semibold">Einnahmenentwicklung</h3><div className="h-64 mt-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={cardStats.revenueFlowData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#25263B" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8A8B9F', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A8B9F', fontSize: 12 }} tickFormatter={(value) => `€${Math.round(value/100)/10}K`} /><Tooltip contentStyle={{ background: '#25263B', border: 'none', borderRadius: '1rem', color: '#fff' }} /><Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt"><h3 className="text-lg font-semibold mb-4">Ausgabenverteilung</h3>{cardStats.expenseSplitData.length > 0 ? <div className="flex flex-col md:flex-row items-center gap-6"><div className="w-40 h-40 relative"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={cardStats.expenseSplitData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={2} dataKey="value" stroke="none">{cardStats.expenseSplitData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-sm text-brand-text-secondary">Gesamt</span><span className="text-xl font-bold">€{cardStats.totalExpenseForChart.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 0 })}</span></div></div><div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm flex-1">{cardStats.expenseSplitData.map((item) => <div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-brand-text-secondary">{item.name}</span></div><span className="font-semibold">{cardStats.totalExpenseForChart > 0 ? `${((item.value / cardStats.totalExpenseForChart) * 100).toFixed(0)}%` : '0%'}</span></div>)}</div></div> : <div className="h-full flex items-center justify-center text-brand-text-secondary min-h-[220px]">Keine Daten.</div>}</div>
                </div>
            ) : <div className="text-center py-12 bg-brand-surface rounded-3xl border border-brand-surface-alt"><p className="text-brand-text-secondary">Bitte wählen Sie ein Konto aus.</p></div>}
            <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; } .recharts-wrapper { outline: none; }`}</style>
        </main>
    );
}

export default StatisticsPage;
