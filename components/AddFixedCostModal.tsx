
import React, { useState } from 'react';
import type { FixedCost, Card } from '../data/mockData';

interface AddFixedCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFixedCost: (fixedCost: Omit<FixedCost, 'id'>) => void;
  cards: Card[];
}

const AddFixedCostModal: React.FC<AddFixedCostModalProps> = ({ isOpen, onClose, onAddFixedCost, cards }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingDay, setBillingDay] = useState('');
  const [cardId, setCardId] = useState<number | ''>(cards.length > 0 ? cards[0].id : '');
  const [error, setError] = useState('');

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
    const parsedBillingDay = parseInt(billingDay, 10);

    if (!name || !parsedAmount || !parsedBillingDay || !cardId) {
      setError('Bitte füllen Sie alle Felder mit gültigen Werten aus.');
      return;
    }
    if (parsedBillingDay < 1 || parsedBillingDay > 31) {
      setError('Der Abrechnungstag muss zwischen 1 und 31 liegen.');
      return;
    }

    onAddFixedCost({
      name,
      amount: parsedAmount,
      billingDay: parsedBillingDay,
      cardId,
    });
    // Reset form
    setName('');
    setAmount('');
    setBillingDay('');
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-brand-surface-alt p-8 rounded-3xl w-full max-w-md shadow-2xl m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">Neue Fixkosten hinzufügen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subName" className="block text-sm font-medium text-brand-text-secondary mb-1">Name der Fixkosten</label>
            <input
              type="text"
              id="subName"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="z.B., Netflix, Miete"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>
           <div>
            <label htmlFor="subAmount" className="block text-sm font-medium text-brand-text-secondary mb-1">Monatlicher Betrag (€)</label>
            <input
              type="text"
              inputMode="decimal"
              id="subAmount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="9,99"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>
           <div>
            <label htmlFor="subBillingDay" className="block text-sm font-medium text-brand-text-secondary mb-1">Abrechnungstag im Monat</label>
            <input
              type="number"
              id="subBillingDay"
              value={billingDay}
              onChange={e => setBillingDay(e.target.value)}
              placeholder="z.B., 15"
              min="1"
              max="31"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>
          <div>
            <label htmlFor="subCard" className="block text-sm font-medium text-brand-text-secondary mb-1">Karte belasten</label>
            <select
                id="subCard"
                value={cardId}
                onChange={e => setCardId(Number(e.target.value))}
                className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white appearance-none"
            >
                {cards.map(card => (
                    <option key={card.id} value={card.id}>
                        {card.title} - **** {card.number.slice(-4)}
                    </option>
                ))}
            </select>
          </div>
          
           {error && <p className="text-sm text-brand-accent-red">{error}</p>}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="text-brand-text-secondary hover:text-white px-4 py-2 rounded-full transition-colors">
              Abbrechen
            </button>
            <button type="submit" className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Fixkosten hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFixedCostModal;
