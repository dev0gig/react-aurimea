import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteAll: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onExport, onImport, onDeleteAll }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-brand-surface-alt p-8 rounded-3xl w-full max-w-lg shadow-2xl m-4 space-y-8" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Einstellungen</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-surface transition-colors -mr-2">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        <div className="space-y-6">
            {/* Export Section */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Datenexport</h3>
                <p className="text-sm text-brand-text-secondary mb-4">
                    Speichern Sie alle Ihre Karten, Transaktionen und Abonnements in einer JSON-Datei als Backup.
                </p>
                <button 
                    onClick={onExport}
                    className="bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>download</span>
                    Daten exportieren
                </button>
            </div>

            {/* Import Section */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Datenimport</h3>
                <p className="text-sm text-brand-text-secondary mb-4">
                    Stellen Sie Ihre Daten aus einer zuvor exportierten Backup-Datei wieder her. Achtung: Alle aktuellen Daten werden überschrieben.
                </p>
                <label className="bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer w-fit">
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>upload</span>
                    Daten importieren
                    <input type="file" accept=".json" className="hidden" onChange={onImport} />
                </label>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-red-500/30 pt-6">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Gefahrenzone</h3>
                 <p className="text-sm text-brand-text-secondary mb-4">
                    Diese Aktion löscht alle Ihre Daten unwiderruflich und setzt die App auf den Anfangszustand zurück.
                </p>
                <button 
                    onClick={onDeleteAll}
                    className="bg-red-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined" style={{fontSize: '20px'}}>delete_forever</span>
                    Alle Daten löschen
                </button>
            </div>
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

export default SettingsModal;
