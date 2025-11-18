import React, { useState, useEffect, useRef, useMemo } from 'react';
import AddCardModal from './AddCardModal';
import type { Card } from '../data/mockData';

interface MyCardsProps {
    cards: Card[];
    selectedCardId: number | null;
    onCardNavigate: (cardId: number) => void;
    onAddCard: (card: Omit<Card, 'id'>) => void;
    onEditCard: (cardId: number) => void;
}

const getTextColorForBg = (hexColor: string): string => {
    if (!hexColor.startsWith('#') || hexColor.length !== 7) return 'text-white';
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? 'text-black' : 'text-white';
};


const MyCards: React.FC<MyCardsProps> = ({ cards, selectedCardId, onCardNavigate, onAddCard, onEditCard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [cardTransforms, setCardTransforms] = useState<Record<number, string>>({});
  
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
  
  const visibleCards = includedCards.slice(-5);

  useEffect(() => {
    setCardTransforms(prevTransforms => {
      const newTransforms = { ...prevTransforms };
      let updated = false;
      visibleCards.forEach(card => {
        if (!newTransforms[card.id]) {
          const rotation = Math.floor(Math.random() * 16) - 8;
          const xOffset = Math.floor(Math.random() * 12) - 6;
          const yOffset = Math.floor(Math.random() * 12) - 6;
          newTransforms[card.id] = `rotate(${rotation}deg) translateX(${xOffset}px) translateY(${yOffset}px)`;
          updated = true;
        }
      });
      return updated ? newTransforms : prevTransforms;
    });
  }, [visibleCards.map(c => c.id).join(',')]); // Depend on card IDs to regenerate if cards change

  const handleAddCard = (newCardData: Omit<Card, 'id'>) => {
    onAddCard(newCardData);
    setIsModalOpen(false);
  };
  
  const renderCardFace = (card: Card, isFull: boolean) => {
    const textColorClass = getTextColorForBg(card.color);
    return (
        <div 
            className={`w-full h-full rounded-2xl p-4 flex flex-col justify-between ${textColorClass}`}
            style={{ backgroundColor: card.color }}
        >
        {isFull ? (
            <>
                <div className="flex justify-between items-start">
                   <span className="font-bold text-lg">{card.title}</span>
                   <span className="material-symbols-outlined" style={{fontSize: '32px'}}>contactless</span>
                </div>
                <div>
                  <p className="font-mono text-xl tracking-widest">{card.number.replace(/(\d{4})/g, '$1 ').trim()}</p>
                  <div className="flex justify-between text-sm mt-2">
                    <span>{card.holder}</span>
                    <span>{card.expiry}</span>
                  </div>
                </div>
            </>
         ) : (
            <div className="flex justify-between items-start">
                <span className="font-semibold">{card.title}</span>
                <span className="font-mono text-sm">**** {card.number.slice(-4)}</span>
            </div>
         )}
         </div>
    );
  };

  return (
    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-surface-alt">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Meine Karten <span className="text-sm text-brand-text-secondary">{cards.length}</span></h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
        >
          Hinzufügen <span className="material-symbols-outlined" style={{fontSize: '16px'}}>add</span>
        </button>
      </div>
      
      <div 
        className="relative flex items-center justify-center min-h-[180px] cursor-pointer group"
        onClick={() => setIsExpanded(true)}
      >
        {includedCards.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-4">
                <p className="text-brand-text-secondary">Keine Karten in der Gesamtbilanz. <br/>Klicken zum Hinzufügen.</p>
            </div>
        ) : (
            visibleCards.map((card, index) => {
                const isSelected = card.id === selectedCardId && (card.includeInTotals ?? true);
                
                let zIndex = index;
                if (isSelected) {
                    zIndex = 49;
                }
                const isTopCard = isSelected || (!selectedCardId && index === visibleCards.length - 1);
                
                return (
                  <div 
                    key={card.id}
                    className={`absolute top-1/2 left-1/2 w-11/12 max-w-[260px] aspect-[85.6/54] shadow-xl transition-all duration-300 group-hover:scale-105 ${isTopCard ? 'ring-2 ring-purple-400 ring-offset-4 ring-offset-brand-surface' : ''}`} 
                    style={{ 
                      zIndex: zIndex, 
                      transform: `translate(-50%, -50%) ${cardTransforms[card.id] || ''}`,
                    }}
                  >
                    {renderCardFace(card, isTopCard)}
                  </div>
                );
            })
        )}
      </div>

      {excludedCards.length > 0 && (
          <div className="mt-8 pt-4 border-t border-brand-surface-alt">
              <h4 className="text-sm font-semibold text-brand-text-secondary mb-3">Separate Konten</h4>
              <div className="space-y-2">
                  {excludedCards.map(card => (
                      <div 
                        key={card.id}
                        className="flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-brand-surface-alt cursor-pointer transition-colors"
                        onClick={() => onCardNavigate(card.id)}
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-5 rounded flex-shrink-0" style={{backgroundColor: card.color}}></div>
                              <div>
                                  <p className="font-medium">{card.title}</p>
                                  <p className="text-xs text-brand-text-secondary font-mono">**** {card.number.slice(-4)}</p>
                              </div>
                          </div>
                           <span className="material-symbols-outlined text-brand-text-secondary">chevron_right</span>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => {
            setIsExpanded(false);
            setActiveCardId(null);
          }}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-brand-surface-alt/80 rounded-3xl shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold text-white mb-4 px-2">In Gesamtbilanz enthalten</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {includedCards.map(card => {
                  const isActive = activeCardId === card.id;
                  return (
                    <div
                      key={card.id}
                      className="w-full aspect-[85.6/54] rounded-2xl shadow-xl transition-transform duration-300 hover:-translate-y-1 relative group/card cursor-pointer"
                      onClick={() => setActiveCardId(isActive ? null : card.id)}
                    >
                      {renderCardFace(card, true)}
                      <div 
                        className={`absolute inset-0 bg-black/50 rounded-2xl transition-opacity flex items-center justify-center gap-4 z-10 ${
                            isActive ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
                        }`}
                      >
                        <button 
                            onClick={(e) => { e.stopPropagation(); onCardNavigate(card.id); setIsExpanded(false); setActiveCardId(null); }} 
                            className="flex flex-col items-center text-white font-semibold text-xs"
                        >
                            <span className="material-symbols-outlined p-3 bg-white/20 rounded-full mb-1">query_stats</span>
                            Statistik
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEditCard(card.id); }} 
                            className="flex flex-col items-center text-white font-semibold text-xs"
                        >
                            <span className="material-symbols-outlined p-3 bg-white/20 rounded-full mb-1">edit</span>
                            Bearbeiten
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {excludedCards.length > 0 && (
                <>
                    <h4 className="text-lg font-semibold text-white mt-8 mb-4 px-2">Separate Konten</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {excludedCards.map(card => {
                          const isActive = activeCardId === card.id;
                          return (
                            <div
                              key={card.id}
                              className="w-full aspect-[85.6/54] rounded-2xl shadow-xl transition-transform duration-300 hover:-translate-y-1 relative group/card cursor-pointer"
                              onClick={() => setActiveCardId(isActive ? null : card.id)}
                            >
                              {renderCardFace(card, true)}
                              <div 
                                className={`absolute inset-0 bg-black/50 rounded-2xl transition-opacity flex items-center justify-center gap-4 z-10 ${
                                    isActive ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
                                }`}
                              >
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onCardNavigate(card.id); setIsExpanded(false); setActiveCardId(null); }} 
                                    className="flex flex-col items-center text-white font-semibold text-xs"
                                >
                                    <span className="material-symbols-outlined p-3 bg-white/20 rounded-full mb-1">query_stats</span>
                                    Statistik
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEditCard(card.id); }} 
                                    className="flex flex-col items-center text-white font-semibold text-xs"
                                >
                                    <span className="material-symbols-outlined p-3 bg-white/20 rounded-full mb-1">edit</span>
                                    Bearbeiten
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                </>
            )}
            
          </div>
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slide-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
          `}</style>
        </div>
      )}

      {isModalOpen && <AddCardModal onAddCard={handleAddCard} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default MyCards;