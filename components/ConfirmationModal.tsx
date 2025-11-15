
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-brand-surface-alt p-8 rounded-3xl w-full max-w-md shadow-2xl m-4" 
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-brand-text-secondary mb-8">{message}</p>
        <div className="flex items-center justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="text-brand-text-secondary hover:text-white px-6 py-2 rounded-full transition-colors"
          >
            Abbrechen
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
          >
            Löschen
          </button>
        </div>
      </div>
       <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default ConfirmationModal;
