
import React from 'react';
import type { Transaction } from '../data/mockData';

interface IncomeExpenseCardsProps {
  transactions: Transaction[];
  currentDate: Date;
}

const IncomeExpenseCards: React.FC<IncomeExpenseCardsProps> = ({ transactions, currentDate }) => {
    const thisMonthsTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getUTCFullYear() === currentDate.getUTCFullYear() &&
               transactionDate.getUTCMonth() === currentDate.getUTCMonth();
    });

  const monthlyIncome = thisMonthsTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = thisMonthsTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);

  const formattedIncome = monthlyIncome.toLocaleString('de-DE', { maximumFractionDigits: 0 });
  const formattedExpense = Math.abs(monthlyExpense).toLocaleString('de-DE', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="bg-brand-surface p-4 rounded-3xl flex-1 border border-brand-surface-alt">
        <p className="text-brand-text-secondary text-sm">Einnahmen</p>
        <p className="text-2xl font-semibold mt-1">+€{formattedIncome}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-brand-text-secondary">Einnahmen diesen Monat</p>
        </div>
      </div>
      <div className="bg-brand-surface p-4 rounded-3xl flex-1 border border-brand-surface-alt">
        <p className="text-brand-text-secondary text-sm">Ausgaben</p>
        <p className="text-2xl font-semibold mt-1">-€{formattedExpense}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-brand-text-secondary">Ausgaben diesen Monat</p>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseCards;
