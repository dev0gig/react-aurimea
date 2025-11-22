
import React, { useState, useEffect } from 'react';
import type { Transaction, Card } from '../data/mockData';
import DatePicker from './DatePicker';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTransaction: (data: {
    id: number | string;
    name: string;
    amount: number;
    date: string;
    category: string;
    cardId: number;
    type: 'income' | 'expense' | 'transfer';
    destinationCardId?: number;
    isFixedCost?: boolean;
    billingDay?: number;
    frequency?: 'monthly' | 'bimonthly' | 'quarterly' | 'semi-annually' | 'annually';
  }) => void;
  transaction: Transaction;
  cards: Card[];
}

const expenseCategories = ['Einkaufen', 'Lebensmittel', 'Transport', 'Unterhaltung', 'Gesundheit', 'Investition', 'Sonstiges'];
const incomeCategories = ['Einkommen', 'Einzahlung', 'Sonstiges'];


const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ isOpen, onClose, onUpdateTransaction, transaction, cards }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [cardId, setCardId] = useState<number | ''>('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'transfer'>(transaction.type);
  const [destinationCardId, setDestinationCardId] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [isFixedCost, setIsFixedCost] = useState(false);
  const [billingDay, setBillingDay] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'bimonthly' | 'quarterly' | 'semi-annually' | 'annually'>('monthly');

  useEffect(() => {
    if (transaction) {
      setName(transaction.name);
      setAmount(String(Math.abs(transaction.amount)));
      setDate(transaction.date);
      setCategory(transaction.category);
      setCardId(transaction.cardId);
      setTransactionType(transaction.type);
      setDestinationCardId(''); // Reset on new transaction
      setIsFixedCost(!!transaction.isFixedCost);
      setBillingDay(transaction.billingDay ? String(transaction.billingDay) : '');
      setFrequency(transaction.frequency || 'monthly');
    }
  }, [transaction]);

  useEffect(() => {
    if (transactionType === 'income' && !incomeCategories.includes(category)) {
      setCategory(incomeCategories[0]);
    } else if (transactionType === 'expense' && !isFixedCost && !expenseCategories.includes(category)) {
      setCategory(expenseCategories[0]);
    }
  }, [transactionType, category, isFixedCost]);

  useEffect(() => {
    if (isFixedCost && date && !billingDay) {
      const day = new Date(date).getUTCDate();
      setBillingDay(String(day));
    }
  }, [isFixedCost, date, billingDay]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[\d.,]*$/.test(value)) {
      if ((value.match(/[,.]/g) || []).length <= 1) {
        setAmount(value);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount.replace(',', '.'));

    if (!name || !parsedAmount || !date || !cardId) {
      setError('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    if (transactionType === 'transfer') {
      if (!destinationCardId) {
        setError('Bitte wählen Sie ein Zielkonto für den Übertrag aus.');
        return;
      }
      if (destinationCardId === cardId) {
        setError('Quell- und Zielkonto dürfen nicht identisch sein.');
        return;
      }
    }

    let finalBillingDay: number | undefined = undefined;
    if (isFixedCost) {
      const parsedBillingDay = parseInt(billingDay, 10);
      if (!parsedBillingDay || parsedBillingDay < 1 || parsedBillingDay > 31) {
        setError('Bitte geben Sie einen gültigen Abrechnungstag (1-31) an.');
        return;
      }
      finalBillingDay = parsedBillingDay;
    }

    onUpdateTransaction({
      id: transaction.id,
      name,
      amount: parsedAmount,
      date,
      category: isFixedCost ? 'Fixkosten' : (transactionType === 'transfer' ? 'Übertrag' : category),
      cardId: Number(cardId),
      type: transactionType,
      destinationCardId: destinationCardId ? Number(destinationCardId) : undefined,
      isFixedCost,
      billingDay: finalBillingDay,
      frequency: isFixedCost ? frequency : undefined,
    });
  };

  if (!isOpen) {
    return null;
  }

  const categoryOptions = transactionType === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-brand-surface-alt p-8 rounded-3xl w-full max-w-md shadow-2xl m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">Transaktion bearbeiten</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">Transaktionstyp</label>
            <div className="flex gap-2 bg-brand-surface p-1 rounded-full">
              {(['Ausgabe', 'Einnahme', 'Übertrag'] as const).map(type => {
                const typeValue = type === 'Ausgabe' ? 'expense' : type === 'Einnahme' ? 'income' : 'transfer';
                return (
                  <button
                    type="button"
                    key={typeValue}
                    onClick={() => setTransactionType(typeValue)}
                    className={`flex-1 px-3 py-1.5 text-sm rounded-full transition-colors duration-300 ${transactionType === typeValue ? 'bg-white text-black font-semibold' : 'text-brand-text-secondary hover:text-white'
                      }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          {(transactionType === 'expense' || transactionType === 'transfer') && (
            <div className="flex items-center gap-3 py-2 -mt-2 mb-2">
              <input
                type="checkbox"
                id="isFixedCostEdit"
                checked={isFixedCost}
                onChange={e => setIsFixedCost(e.target.checked)}
                className="h-4 w-4 rounded bg-brand-surface text-purple-500 focus:ring-purple-400 border-brand-text-secondary"
              />
              <label htmlFor="isFixedCostEdit" className="text-sm font-medium text-brand-text-secondary cursor-pointer">
                Als wiederkehrende Fixkosten behandeln
              </label>
            </div>
          )}

          <div>
            <label htmlFor="transNameEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Name</label>
            <input
              type="text"
              id="transNameEdit"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={transactionType === 'transfer' ? 'Zweck des Übertrags' : 'z.B., Supermarkt'}
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>
          <div>
            <label htmlFor="transAmountEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Betrag (€)</label>
            <input
              type="text"
              inputMode="decimal"
              id="transAmountEdit"
              value={amount}
              onChange={handleAmountChange}
              placeholder="89,50"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>

          {transactionType === 'transfer' && (
            <div>
              <label htmlFor="transDestinationCardEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Übertrag an</label>
              <select
                id="transDestinationCardEdit"
                value={destinationCardId}
                onChange={e => setDestinationCardId(Number(e.target.value))}
                className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white appearance-none"
              >
                <option value="" disabled>Zielkonto auswählen...</option>
                {cards.filter(c => c.id !== cardId).map(card => (
                  <option key={card.id} value={card.id}>
                    {card.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isFixedCost ? (
            <div className="space-y-4 bg-brand-surface p-4 rounded-lg">
              <div>
                <label htmlFor="transBillingDayEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Abrechnungstag im Monat</label>
                <input
                  type="number"
                  id="transBillingDayEdit"
                  value={billingDay}
                  onChange={e => setBillingDay(e.target.value)}
                  placeholder="z.B., 15"
                  min="1"
                  max="31"
                  className="w-full bg-brand-surface-alt p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                />
              </div>
              <div>
                <label htmlFor="transFrequencyEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Wiederholung</label>
                <select
                  id="transFrequencyEdit"
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as any)}
                  className="w-full bg-brand-surface-alt p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white appearance-none"
                >
                  <option value="monthly">Jeden Monat</option>
                  <option value="bimonthly">Alle 2 Monate</option>
                  <option value="quarterly">Vierteljährlich</option>
                  <option value="semi-annually">Halbjährlich</option>
                  <option value="annually">Jährlich</option>
                </select>
              </div>
            </div>
          ) : (transactionType !== 'transfer' &&
            <div>
              <label htmlFor="transCategoryEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Kategorie</label>
              <select
                id="transCategoryEdit"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white appearance-none"
              >
                {categoryOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="transSourceCardEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">{transactionType === 'transfer' ? 'Übertrag von' : 'Konto'}</label>
            <select
              id="transSourceCardEdit"
              value={cardId}
              onChange={e => setCardId(Number(e.target.value))}
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white appearance-none"
            >
              {cards.map(card => (
                <option key={card.id} value={card.id}>
                  {card.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="transDateEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Datum</label>
            <DatePicker
              value={date}
              onChange={setDate}
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>

          {error && <p className="text-sm text-brand-accent-red">{error}</p>}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="text-brand-text-secondary hover:text-white px-4 py-2 rounded-full transition-colors">
              Abbrechen
            </button>
            <button type="submit" className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Änderungen speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
