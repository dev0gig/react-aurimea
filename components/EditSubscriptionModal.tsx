
import React, { useState, useEffect } from 'react';
// FIX: The 'Subscription' type is not exported from mockData. Using 'FixedCost' and aliasing it as 'Subscription' to match the component's naming convention.
import type { FixedCost as Subscription, Card } from '../data/mockData';

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSubscription: (subscription: Subscription) => void;
  subscription: Subscription;
  cards: Card[];
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({ isOpen, onClose, onUpdateSubscription, subscription, cards }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingDay, setBillingDay] = useState('');
  const [cardId, setCardId] = useState<number | ''>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setName(subscription.name);
      setAmount(String(subscription.amount));
      setBillingDay(String(subscription.billingDay));
      setCardId(subscription.cardId);
    }
  }, [subscription]);

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

    onUpdateSubscription({
      ...subscription,
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
        <h2 className="text-2xl font-bold mb-6 text-white">Abonnement bearbeiten</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subNameEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Name des Abonnements</label>
            <input
              type="text"
              id="subNameEdit"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="z.B., Netflix, Spotify Premium"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
          </div>
           <div>
            <label htmlFor="subAmountEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Monatlicher Betrag (€)</label>
            <input
              type="text"
              inputMode="decimal"
              id="subAmountEdit"
              value={amount}
              onChange={handleAmountChange}
              placeholder="9,99"
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

export default EditSubscriptionModal;
