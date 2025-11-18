
import React, { useState, useMemo } from 'react';
import AddCardModal from './AddCardModal';
import type { Card } from '../data/mockData';

interface MyCardsProps {
    cards: Card[];
    selectedCardId: number | null;
    onCardNavigate: (cardId: number) => void;
    onSeparateAccountNavigate: (cardId: number) => void;
    onAddCard: (card: Omit<Card, 'id'>) => void;
    onEditCard: (cardId: number) => void;
}

const bankLogos: Record<string, string> = {
    'revolut': 'https://play-lh.googleusercontent.com/Zk8VcibrnwxdnlEydb5ytJOPGQuCVwceanusUprYjF06eLaPqO-pqYfkq7-LwMhMo7ZF=w240-h480-rw',
    'erste': 'https://play-lh.googleusercontent.com/iO3mw3CXFdTFhH_IMBirs-caiJO301aEeOXzPgr13J22W1U0z-PWr6GSnTgbZeu6vCA=w240-h480-rw',
    'sparkasse': 'https://play-lh.googleusercontent.com/iO3mw3CXFdTFhH_IMBirs-caiJO301aEeOXzPgr13J22W1U0z-PWr6GSnTgbZeu6vCA=w240-h480-rw',
    'n26': 'https://play-lh.googleusercontent.com/pCFXCIyrT0zxLral7LuFhBj6K2Bwl4Xj_zH_BXNKOJ7IJ2Gl8fE6cQ4IbQzX4uDSSw=w240-h480-rw',
    'trade republic': 'https://play-lh.googleusercontent.com/sOskC1JVa2AVPfW8BHASqJINNRxDv2v-Y62UMCEqXvJ-HQiy9_YG-ZROKUTPiXco8bs=w240-h480-rw',
    'oberbank': 'https://play-lh.googleusercontent.com/595ujNbwdaF0wP2Suw33C_AzU7J0IjNuAc7QUsSx58L0BIqYHsuchyB08rlQrDyRENRk=w240-h480-rw'
};

const getBankLogo = (title: string) => {
    const lowerTitle = title.toLowerCase();
    for (const [key, url] of Object.entries(bankLogos)) {
        if (lowerTitle.includes(key)) return url;
    }
    return null;
};

const MyCards: React.FC<MyCardsProps> = ({ cards, selectedCardId, onCardNavigate, onSeparateAccountNavigate, onAddCard, onEditCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { includedCards, excludedCards } = useMemo(() => {
    const included: Card[] = [];
    const excluded: Card[] = [];
    cards.forEach(card => {
      if (card.includeInTotals ?? true) {
        included.push(card);
      } else {
        excluded.push(card);
      }
    });
    return { includedCards: included, excludedCards: excluded };
  }, [cards]);
  
  const handleAddCard = (newCardData: Omit<Card, 'id'>) => {
    onAddCard(newCardData);
    setIsModalOpen(false);
  };

  const renderCardRow = (card: Card, isSeparate: boolean) => {
      const logoUrl = getBankLogo(card.title);
      const isSelected = selectedCardId === card.id;

      return (
          <div 
            key={card.id}
            className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group ${isSelected && !isSeparate ? 'bg-brand-surface-alt ring-1 ring-purple-500/50' : 'hover:bg-brand-surface-alt'}`}
          >
              <div 
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() => isSeparate ? onSeparateAccountNavigate(card.id) : onCardNavigate(card.id)}
              >
                  <div className="relative w-12 h-12 flex-shrink-0">
                      {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={card.title} 
                            className="w-full h-full object-cover rounded-xl bg-white shadow-sm"
                          />
                      ) : (
                          <div 
                            className="w-full h-full rounded-xl flex items-center justify-center shadow-sm text-white bg-gradient-to-br from-brand-surface-alt to-brand-bg border border-white/10"
                          >
                              <span className="material-symbols-outlined">account_balance</span>
                          </div>
                      )}
                  </div>
                  <div className="min-w-0">
                      <h4 className={`font-semibold truncate ${isSelected && !isSeparate ? 'text-white' : 'text-brand-text'}`}>{card.title}</h4>
                  </div>
              </div>

              <div className="flex items-center gap-1">
                 {!isSeparate && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onCardNavigate(card.id); }}
                        className="p-2 rounded-full hover:bg-brand-surface text-brand-text-secondary hover:text-brand-accent-green transition-colors"
                        title="Statistiken"
                    >
                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>query_stats</span>
                    </button>
                 )}
                  <button 
                      onClick={(e) => { e.stopPropagation(); onEditCard(card.id); }}
                      className="p-2 rounded-full hover:bg-brand-surface text-brand-text-secondary hover:text-white transition-colors"
                      title="Bearbeiten"
                  >
                      <span className="material-symbols-outlined" style={{fontSize: '20px'}}>edit</span>
                  </button>
              </div>
          </div>
      );
  };

  return (
    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Meine Konten <span className="text-sm text-brand-text-secondary">{cards.length}</span></h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
        >
          Hinzufügen <span className="material-symbols-outlined" style={{fontSize: '16px'}}>add</span>
        </button>
      </div>
      
      <div className="space-y-6">
        {includedCards.length > 0 ? (
            <div className="space-y-1">
                {includedCards.map(card => renderCardRow(card, false))}
            </div>
        ) : (
             <div className="text-center p-4 text-brand-text-secondary text-sm">
                Keine aktiven Konten.
            </div>
        )}

        {excludedCards.length > 0 && (
            <div>
                 <h4 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-3 mt-2 px-3">Separate Konten</h4>
                 <div className="space-y-1">
                    {excludedCards.map(card => renderCardRow(card, true))}
                 </div>
            </div>
        )}
      </div>

      {isModalOpen && <AddCardModal onAddCard={handleAddCard} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default MyCards;
