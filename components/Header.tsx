import React from 'react';

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    navItems: string[];
    onSearchClick: () => void;
    onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, navItems, onSearchClick, onSettingsClick }) => {

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          <span className="text-xl font-bold">AuriMea</span>
        </div>
        <nav className="hidden md:flex items-center bg-brand-surface rounded-full p-1 border border-brand-surface-alt">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors duration-300 ${
                activeTab === item
                  ? 'bg-white text-black font-semibold'
                  : 'text-brand-text-secondary hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onSearchClick} className="p-2 rounded-full hover:bg-brand-surface transition-colors">
          <span className="material-symbols-outlined" style={{fontSize: '20px'}}>search</span>
        </button>
         <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-brand-surface transition-colors">
          <span className="material-symbols-outlined" style={{fontSize: '20px'}}>settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;