
import type { Transaction } from '../data/mockData';

export const generateRecurringTransactions = (manualTransactions: Transaction[]): Transaction[] => {
  const fixedCostTemplates = manualTransactions.filter(t => t.isFixedCost);
  const generatedTransactions: Transaction[] = [];
  
  const viennaTimeZone = 'Europe/Vienna';
  const now = new Date();
  
  const todayViennaStr = now.toLocaleDateString('en-CA', { timeZone: viennaTimeZone });
  const today = new Date(`${todayViennaStr}T00:00:00.000Z`);
  
  const [currentViennaYear, currentViennaMonth] = todayViennaStr.split('-').map(Number);
  const currentViennaMonthIndex = currentViennaMonth - 1;

  for (let i = -12; i <= 24; i++) {
    const targetDate = new Date(Date.UTC(currentViennaYear, currentViennaMonthIndex + i, 1));
    const targetYear = targetDate.getUTCFullYear();
    const targetMonth = targetDate.getUTCMonth();

    fixedCostTemplates.forEach(fc => {
      if (fc.billingDay) {
        const templateStartDate = new Date(fc.date);
        const templateEndDate = fc.endDate ? new Date(fc.endDate) : null;
        const templateStartYear = templateStartDate.getUTCFullYear();
        const templateStartMonth = templateStartDate.getUTCMonth();

        const monthsDiff = (targetYear - templateStartYear) * 12 + (targetMonth - templateStartMonth);
        if (monthsDiff < 0) return;

        let shouldGenerate = false;
        const frequency = fc.frequency || 'monthly';
        switch (frequency) {
          case 'monthly': shouldGenerate = true; break;
          case 'bimonthly': shouldGenerate = monthsDiff % 2 === 0; break;
          case 'quarterly': shouldGenerate = monthsDiff % 3 === 0; break;
          case 'semi-annually': shouldGenerate = monthsDiff % 6 === 0; break;
          case 'annually': shouldGenerate = monthsDiff % 12 === 0; break;
          default: shouldGenerate = true;
        }

        if (shouldGenerate) {
          const daysInMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
          const day = Math.min(fc.billingDay, daysInMonth);
          const transactionFullDate = new Date(Date.UTC(targetYear, targetMonth, day));
          
          if (templateEndDate && transactionFullDate > templateEndDate) {
              return; 
          }

          generatedTransactions.push({
            ...fc,
            id: `fc-${fc.id}-${targetYear}-${targetMonth}`,
            date: transactionFullDate.toISOString().split('T')[0],
            category: 'Fixkosten',
            isFuture: transactionFullDate > today,
          });
        }
      }
    });
  }

  const allTransactions = [
    ...manualTransactions.filter(t => !t.isFixedCost),
    ...generatedTransactions
  ];

  const uniqueTransactions = Array.from(new Map(allTransactions.map(t => [t.id, t])).values());

  return uniqueTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
