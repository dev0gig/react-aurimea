
import React from 'react';
import type { Transaction } from '../data/mockData';

interface TotalBalanceCardProps {
  transactions: Transaction[];
  currentDate: Date;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ transactions, currentDate }) => {
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const startOfThisMonth = currentDate;
  const startOfPrevMonth = new Date(startOfThisMonth.getTime());
  startOfPrevMonth.setUTCMonth(startOfPrevMonth.getUTCMonth() - 1);

  const prevMonthRevenue = transactions.filter(t => {
    const transactionDate = new Date(t.date); // Already UTC midnight
    return t.amount > 0 && transactionDate >= startOfPrevMonth && transactionDate < startOfThisMonth;
  }).reduce((sum, t) => sum + t.amount, 0);

  const prevMonth = new Date(currentDate);
  prevMonth.setUTCMonth(prevMonth.getUTCMonth() - 1);

  return (
    <div className="bg-gradient-to-br from-green-300 to-yellow-200 p-6 rounded-3xl text-black h-full flex flex-col justify-between">
      <div>
        <p className="text-gray-700 font-medium">Gesamtguthaben</p>
        <h2 className="text-4xl font-bold my-2">€{totalBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        {prevMonthRevenue > 0 && (
            <p className="text-sm text-green-800 font-semibold">
                +€{prevMonthRevenue.toLocaleString('de-DE', { maximumFractionDigits: 0 })} Einnahmen vom {prevMonth.toLocaleString('de-DE', { month: 'long', timeZone: 'UTC' })}
            </p>
        )}
      </div>
    </div>
  );
};

export default TotalBalanceCard;
