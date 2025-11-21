import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-surface border-t border-brand-surface-alt py-4 mt-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-brand-text-secondary text-sm">
                <a
                    href="https://www.flaticon.com/free-icons/budget"
                    title="budget icons"
                    className="hover:text-brand-text transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Budget icons created by Freepik - Flaticon
                </a>
            </div>
        </footer>
    );
};

export default Footer;
