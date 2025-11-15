import React, { useState, useEffect } from 'react';
import type { FixedCost, Card } from '../data/mockData';

interface EditFixedCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateFixedCost: (fixedCost: FixedCost) => void;
  fixedCost: FixedCost;
  cards: Card[];
}

const EditFixedCostModal: React.FC<EditFixedCostModalProps> = ({ isOpen, onClose, onUpdateFixedCost, fixedCost, cards }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingDay, setBillingDay] = useState('');
  const [cardId, setCardId] = useState<number | ''>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (fixedCost) {
      setName(fixedCost.name);
      setAmount(String(fixedCost.amount));
      setBillingDay(String(fixedCost.billingDay));
      setCardId(fixedCost.cardId);
    }
  }, [fixedCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    const parsedBillingDay = parseInt(billingDay, 10);

    if (!name || !parsedAmount || !parsedBillingDay || !cardId) {
      setError('Bitte füllen Sie alle Felder mit gültigen Werten aus.');
      return;
    }
    if (parsedBillingDay < 1 || parsedBillingDay > 31) {
      setError('Der Abrechnungstag muss zwischen 1 und 31 liegen.');
      return;
    }

    onUpdateFixedCost({
      ...fixedCost,
      name,
      amount: parsedAmount,
      billingDay: parsedBillingDay,
      cardId,
    });
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-brand-surface-alt p-8 rounded-3xl w-full max-w-md shadow-2xl m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">Fixkosten bearbeiten</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subNameEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Name der Fixkosten</label>
            <input
              type="text"
              id="subNameEdit"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="z.B., Netflix, Miete"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>
           <div>
            <label htmlFor="subAmountEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Monatlicher Betrag (€)</label>
            <input
              type="number"
              id="subAmountEdit"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="9.99"
              min="0.01"
              step="0.01"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>
           <div>
            <label htmlFor="subBillingDayEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Abrechnungstag im Monat</label>
            <input
              type="number"
              id="subBillingDayEdit"
              value={billingDay}
              onChange={e => setBillingDay(e.target.value)}
              placeholder="z.B., 15"
              min="1"
              max="31"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>
          <div>
            <label htmlFor="subCardEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Karte belasten</label>
            <select
                id="subCardEdit"
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
              Änderungen speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFixedCostModal;