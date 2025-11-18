
import React, { useState, useEffect } from 'react';
import type { Card } from '../data/mockData';

interface EditCardModalProps {
  onUpdateCard: (card: Card) => void;
  onClose: () => void;
  isOpen: boolean;
  card: Card;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ onUpdateCard, onClose, isOpen, card }) => {
  const [title, setTitle] = useState('');
  const [includeInTotals, setIncludeInTotals] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setIncludeInTotals(card.includeInTotals ?? true);
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title) {
        setError('Bitte geben Sie einen Namen für das Konto an.');
        return;
    }

    onUpdateCard({ ...card, title, includeInTotals });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-brand-surface-alt p-8 rounded-3xl w-full max-w-md shadow-2xl m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-white">Konto bearbeiten</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardTitleEdit" className="block text-sm font-medium text-brand-text-secondary mb-1">Kontoname / Bankname</label>
            <input
              type="text"
              id="cardTitleEdit"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B., Sparkasse, N26"
              className="w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
              autoComplete="off"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">Optionen</label>
            <div className="flex items-center gap-3 bg-brand-surface p-3 rounded-lg">
                <input
                type="checkbox"
                id="includeInTotalsEdit"
                checked={includeInTotals}
                onChange={(e) => setIncludeInTotals(e.target.checked)}
                className="h-4 w-4 rounded bg-brand-surface-alt text-purple-500 focus:ring-purple-400 border-brand-text-secondary"
                />
                <label htmlFor="includeInTotalsEdit" className="text-sm text-brand-text-secondary cursor-pointer">
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
              Änderungen speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCardModal;
