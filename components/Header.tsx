
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
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePillPosition = () => {
      const activeIndex = navItems.indexOf(activeTab);
      const currentTab = tabsRef.current[activeIndex];
      const navContainer = navRef.current;

      if (currentTab && navContainer) {
        const navRect = navContainer.getBoundingClientRect();
        const tabRect = currentTab.getBoundingClientRect();

        setPillStyle({
          left: tabRect.left - navRect.left, // Relative position inside the container
          width: tabRect.width,
          opacity: 1
        });
      }
    };

    // Update initially and on resize
    updatePillPosition();
    
    // Use ResizeObserver for more robust size change detection
    const resizeObserver = new ResizeObserver(updatePillPosition);
    if (navRef.current) resizeObserver.observe(navRef.current);
    window.addEventListener('resize', updatePillPosition);

    return () => {
      window.removeEventListener('resize', updatePillPosition);
      resizeObserver.disconnect();
    };
  }, [activeTab, navItems]);

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4 md:gap-12">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl text-brand-accent-green">account_balance_wallet</span>
          <span className="text-xl font-bold block">AuriMea</span>
        </div>
        
        <nav 
          ref={navRef}
          className="relative hidden md:flex items-center bg-brand-surface rounded-full p-1 border border-brand-surface-alt"
        >
          {/* Animated Pill - Positioned absolutely behind text */}
          <div
            className="absolute top-1 bottom-1 bg-white rounded-full transition-all duration-300 ease-out shadow-sm z-0"
            style={{
              transform: `translateX(${pillStyle.left}px)`,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
            }}
          />

          {navItems.map((item, index) => (
            <button
              key={item}
              ref={(el) => { tabsRef.current[index] = el; }}
              onClick={() => setActiveTab(item)}
              className={`relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                activeTab === item
                  ? 'text-black'
                  : 'text-brand-text-secondary hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button onClick={onSearchClick} className="p-2 rounded-full hover:bg-brand-surface transition-colors text-brand-text-secondary hover:text-white">
          <span className="material-symbols-outlined" style={{fontSize: '24px'}}>search</span>
        </button>
         <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-brand-surface transition-colors text-brand-text-secondary hover:text-white">
          <span className="material-symbols-outlined" style={{fontSize: '24px'}}>settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
