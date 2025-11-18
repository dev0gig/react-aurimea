
import React from 'react';
import type { Transaction } from '../data/mockData';

interface TotalBalanceCardProps {
  transactions: Transaction[];
  currentDate: Date;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ transactions, currentDate }) => {
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const startOfCurrentMonth = currentDate;
  const startOfNextMonth = new Date(startOfCurrentMonth.getTime());
  startOfNextMonth.setUTCMonth(startOfNextMonth.getUTCMonth() + 1);

  const thisMonthRevenue = transactions.filter(t => {
    const transactionDate = new Date(t.date); // Already UTC midnight
    return t.amount > 0 && transactionDate >= startOfCurrentMonth && transactionDate < startOfNextMonth;
  }).reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-gradient-to-br from-green-300 to-yellow-200 p-6 rounded-3xl text-black h-full flex flex-col justify-between">
      <div>
        <p className="text-gray-700 font-medium">Gesamtguthaben</p>
        <h2 className="text-4xl font-bold my-2">€{totalBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        {thisMonthRevenue > 0 && (
            <p className="text-sm text-green-800 font-semibold">
                +€{thisMonthRevenue.toLocaleString('de-DE', { maximumFractionDigits: 0 })} Einnahmen diesen Monat
            </p>
        )}
      </div>
    </div>
  );
};

export default TotalBalanceCard;
