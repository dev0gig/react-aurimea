import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../data/mockData';

const expenseColors: { [key: string]: string } = {
  'Lebensmittel': '#FF6384',
  'Einkaufen': '#FFCD56',
  'Gesundheit': '#4BC0C0',
  'Unterhaltung': '#36A2EB',
  'Transport': '#9966FF',
  'Investition': '#ec4899',
  'Sonstiges': '#FF9F40',
  'Standard': '#8A8B9F',
};

interface ExpenseSplitChartProps {
    transactions: Transaction[];
    currentDate: Date;
}

const ExpenseSplitChart: React.FC<ExpenseSplitChartProps> = ({ transactions, currentDate }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const monthlyExpenses = useMemo(() => {
    return transactions.filter(t => {
      if (t.amount >= 0) return false;
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentDate.getFullYear() &&
             transactionDate.getMonth() === currentDate.getMonth();
    });
  }, [transactions, currentDate]);
  
  const totalExpense = monthlyExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const expenseByCategory = monthlyExpenses.reduce((acc, t) => {
    const category = t.category || 'Sonstiges';
    acc[category] = (acc[category] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
    color: expenseColors[name] || expenseColors.Standard,
  }));
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onMouseLeave = () => {
    setActiveIndex(undefined);
  };
  
  if (data.length === 0) {
    return (
      <div className="bg-brand-surface p-6 rounded-3xl flex flex-col h-full border border-brand-surface-alt">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ausgabenverteilung</h3>
        </div>
        <div className="flex-grow flex items-center justify-center text-brand-text-secondary">
          Keine Ausgabendaten für diesen Monat.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface p-6 rounded-3xl h-full flex flex-col border border-brand-surface-alt">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Ausgabenverteilung</h3>
      </div>
      <div className="flex-grow flex items-center">
        <div className="w-full flex flex-col md:flex-row items-center gap-6">
          <div className="w-40 h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onMouseLeave}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      fillOpacity={activeIndex === undefined || activeIndex === index ? 1 : 0.3}
                      style={{ transition: 'fill-opacity 0.2s ease-in-out' }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm text-brand-text-secondary">Gesamt</span>
              <span className="text-xl font-bold">€{totalExpense.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div 
            className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm flex-1"
            onMouseLeave={onMouseLeave}
          >
            {data.map((item, index) => {
              const isDimmed = activeIndex !== undefined && activeIndex !== index;
              const isCurrent = activeIndex === index;

              return (
                <div 
                  key={item.name} 
                  className="flex items-center justify-between cursor-pointer"
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className={`transition-all duration-200 ${isDimmed ? 'opacity-50' : ''} ${isCurrent ? 'text-white' : 'text-brand-text-secondary'}`}>{item.name}</span>
                  </div>
                  {/* FIX: Explicitly cast item.value to a number to resolve TypeScript error. */}
                  <span className={`font-semibold transition-all duration-200 ${isDimmed ? 'opacity-50' : ''} ${isCurrent ? 'text-white' : 'text-brand-text'}`}>{totalExpense > 0 ? `${((Number(item.value) / totalExpense) * 100).toFixed(0)}%` : '0%'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSplitChart;