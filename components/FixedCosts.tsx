import React, { useState, useEffect, useRef } from 'react';
import type { FixedCost } from '../data/mockData';

interface FixedCostsProps {
    fixedCosts: FixedCost[];
    onAddClick: () => void;
    onFixedCostNavigate: (fixedCostId: number) => void;
    onEditFixedCost: (id: number) => void;
    onDeleteFixedCost: (id: number) => void;
}

const FixedCosts: React.FC<FixedCostsProps> = ({ fixedCosts, onAddClick, onFixedCostNavigate, onEditFixedCost, onDeleteFixedCost }) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);
  
  return (
    <div className="bg-brand-surface p-6 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Fixkosten <span className="text-sm text-brand-text-secondary">{fixedCosts.length}</span></h3>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-1 bg-white text-black text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
        >
          Neu <span className="material-symbols-outlined" style={{fontSize: '16px'}}>add</span>
        </button>
      </div>
      
      <div className="space-y-2">
        {fixedCosts.map((fc) => (
          <div 
            key={fc.id} 
            className="flex items-center justify-between p-2 -m-2 rounded-xl hover:bg-brand-surface-alt transition-colors duration-200 cursor-pointer"
            onClick={() => onFixedCostNavigate(fc.id)}
          >
            <div className="flex items-center">
              <div>
                <p className="font-semibold">{fc.name}</p>
                <p className="text-xs text-brand-text-secondary">Nächste am {fc.billingDay}. des Monats</p>
              </div>
            </div>
            <div className="relative flex items-center gap-4">
                <span className="font-semibold">€{fc.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === fc.id ? null : fc.id);
                  }}
                  className="text-brand-text-secondary hover:text-white z-10 p-1 -m-1 rounded-full"
                >
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>more_vert</span>
                </button>
                 {openMenuId === fc.id && (
                  <div ref={menuRef} className="absolute top-full right-0 mt-2 bg-brand-surface-alt rounded-lg shadow-lg py-1 w-32 z-20 animate-fade-in-sm">
                    <button onClick={(e) => { e.stopPropagation(); onEditFixedCost(fc.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-white hover:bg-brand-surface flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span> Bearbeiten
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteFixedCost(fc.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-brand-surface flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span> Löschen
                    </button>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
        <style>{`
            @keyframes fade-in-sm {
              from { opacity: 0; transform: translateY(-5px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-sm { animation: fade-in-sm 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default FixedCosts;