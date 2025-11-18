
import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    navItems: string[];
    onSearchClick: () => void;
    onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, navItems, onSearchClick, onSettingsClick }) => {
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const updatePillPosition = () => {
      const activeIndex = navItems.indexOf(activeTab);
      const currentTab = tabsRef.current[activeIndex];

      if (currentTab) {
        setPillStyle({
          left: currentTab.offsetLeft,
          width: currentTab.clientWidth,
          opacity: 1
        });
      }
    };

    // Initial position update
    updatePillPosition();

    // Update on resize to keep correct position
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [activeTab, navItems]);

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          <span className="text-xl font-bold">AuriMea</span>
        </div>
        
        <nav className="relative hidden md:flex items-center bg-brand-surface rounded-full p-1 border border-brand-surface-alt">
          {/* Animated Pill */}
          <div
            className="absolute top-1 bottom-1 bg-white rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{
              left: pillStyle.left,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
            }}
          />

          {navItems.map((item, index) => (
            <button
              key={item}
              ref={(el) => { tabsRef.current[index] = el; }}
              onClick={() => setActiveTab(item)}
              className={`relative z-10 px-4 py-1.5 text-sm rounded-full transition-colors duration-300 ${
                activeTab === item
                  ? 'text-black font-semibold'
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
