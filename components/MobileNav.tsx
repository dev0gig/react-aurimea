import React from 'react';

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    navItems: string[];
}

const navIcons: { [key: string]: string } = {
    'Übersicht': 'dashboard',
    'Transaktionen': 'receipt_long',
    'Statistiken': 'bar_chart',
};

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, navItems }) => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-surface-alt border-t border-brand-surface shadow-lg z-40">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                            activeTab === item ? 'text-white' : 'text-brand-text-secondary hover:text-white'
                        }`}
                        aria-label={item}
                        aria-current={activeTab === item}
                    >
                        <span className="material-symbols-outlined mb-1">
                            {navIcons[item] || 'radio_button_unchecked'}
                        </span>
                        <span className="text-xs font-medium">{item}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default MobileNav;
