
import React, { useState } from 'react';
import type { Card } from '../data/mockData';

interface AddCardModalProps {
  onAddCard: (card: Omit<Card, 'id'>) => void;
  onClose: () => void;
}

const cardColors = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#22c55e', // Green
    '#f97316', // Orange
    '#38bdf8', // Light Blue
    '#8b5cf6', // Violet
    '#BDBDBD', // Silver
    '#14b8a6', // Turquoise
    '#FFFFFF', // White
];


const AddCardModal: React.FC<AddCardModalProps> = ({ onAddCard, onClose }) => {
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [color, setColor] = useState(cardColors[0]);
  const [includeInTotals, setIncludeInTotals] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !number || !holder || !expiry) {
        setError('Bitte füllen Sie alle Felder aus.');
        return;
    }
    if (number.replace(/\s/g, '').length !== 16) {
        setError('Die Kartennummer muss 16-stellig sein.');
        return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        setError('Das Ablaufdatum muss im Format MM/JJ sein.');
        return;
    }

    onAddCard({ title, number: number.replace(/\s/g, ''), holder, expiry, color, includeInTotals });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    if (formattedValue.length <= 19) {
        setNumber(formattedValue);
    }
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 2 && expiry.length <=2) {
          value = value.slice(0, 2) + '/' + value.slice(2, 4);
      } else if (value.length > 2) {
          value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length <= 5) {
        setExpiry(value);
      }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-brand-surface-alt p-8 rounded-3xl w-full max-w-md shadow-2xl m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">Neue Karte hinzufügen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardTitle" className="block text-sm font-medium text-brand-text-secondary mb-1">Kartentitel / Bankname</label>
            <input
              type="text"
              id="cardTitle"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B., Sparkasse, N26"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-brand-text-secondary mb-1">Kartennummer</label>
            <input
              type="text"
              id="cardNumber"
              value={number}
              onChange={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white font-mono"
              maxLength={19}
              autoComplete="cc-number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardHolder" className="block text-sm font-medium text-brand-text-secondary mb-1">Karteninhaber</label>
              <input
                type="text"
                id="cardHolder"
                value={holder}
                onChange={e => setHolder(e.target.value)}
                placeholder="Max Mustermann"
                className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                autoComplete="cc-name"
              />
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-brand-text-secondary mb-1">Gültig bis</label>
              <input
                type="text"
                id="expiryDate"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/JJ"
                className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white font-mono"
                maxLength={5}
                autoComplete="cc-exp"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">Kartenfarbe</label>
            <div className="flex items-center gap-3 flex-wrap">
                {cardColors.map(c => (
                    <button
                        type="button"
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-brand-surface-alt ring-white' : ''} ${c === '#FFFFFF' ? 'border border-gray-400' : ''}`}
                        style={{ backgroundColor: c }}
                        aria-label={`Farbe ${c} auswählen`}
                    />
                ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">Optionen</label>
            <div className="flex items-center gap-3 bg-brand-surface p-3 rounded-lg">
                <input
                type="checkbox"
                id="includeInTotalsAdd"
                checked={includeInTotals}
                onChange={(e) => setIncludeInTotals(e.target.checked)}
                className="h-4 w-4 rounded bg-brand-surface-alt text-purple-500 focus:ring-purple-400 border-brand-text-secondary"
                />
                <label htmlFor="includeInTotalsAdd" className="text-sm text-brand-text-secondary cursor-pointer">
                    In Gesamtguthaben & Statistiken einbeziehen
                </label>
            </div>
          </div>
           {error && <p className="text-sm text-brand-accent-red">{error}</p>}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="text-brand-text-secondary hover:text-white px-4 py-2 rounded-full transition-colors">
              Abbrechen
            </button>
            <button type="submit" className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Karte hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;