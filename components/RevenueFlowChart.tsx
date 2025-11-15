
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Transaction } from '../data/mockData';

interface RevenueFlowChartProps {
    transactions: Transaction[];
    currentDate: Date;
}

const RevenueFlowChart: React.FC<RevenueFlowChartProps> = ({ transactions, currentDate }) => {
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

  transactions.forEach(t => {
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

  const data = monthBuckets.map(({name, value}) => ({name, value}));
    
  if (data.every(d => d.value === 0)) {
    return (
      <div className="bg-brand-surface p-6 rounded-3xl flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Einnahmenentwicklung</h3>
        </div>
        <div className="h-64 flex items-center justify-center text-brand-text-secondary">
          Keine Einnahmendaten für die letzten Monate verfügbar.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface p-6 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Einnahmenentwicklung</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#25263B" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8A8B9F', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A8B9F', fontSize: 12 }} tickFormatter={(value) => `€${value/1000}K`} />
            <Tooltip
                cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                contentStyle={{ 
                    background: '#25263B', 
                    border: 'none', 
                    borderRadius: '1rem',
                    color: '#fff'
                }}
                formatter={(value: number) => `${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#8884d8' : '#3c3d5a'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueFlowChart;