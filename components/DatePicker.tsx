import React, { useState, useEffect } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(() => {
        // Parse current date or use today
        const today = value ? new Date(value) : new Date();
        return new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }));
    });

    const [selectedDate, setSelectedDate] = useState(() => {
        return value ? new Date(value) : new Date();
    });

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            setSelectedDate(date);
            setCurrentDate(date);
        }
    }, [value]);

    // German day names starting with Monday
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const monthNames = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Find the first Monday of the calendar view
        const firstDayOfWeek = firstDay.getDay();
        // Convert Sunday (0) to 6, Monday (1) to 0, etc.
        const mondayIndex = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        const startDate = new Date(firstDay);
        startDate.setDate(firstDay.getDate() - mondayIndex);

        const days = [];
        const totalDays = 42; // 6 weeks view

        for (let i = 0; i < totalDays; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push(day);
        }

        return days;
    };

    const formatDateForInput = (date: Date) => {
        // Use Vienna timezone for consistent date formatting
        const viennaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }));
        return viennaDate.toISOString().split('T')[0];
    };

    const formatDisplayDate = (date: Date) => {
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'Europe/Vienna'
        });
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        onChange(formatDateForInput(date));
        setIsOpen(false);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        const viennaToday = new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }));
        return date.toDateString() === viennaToday.toDateString();
    };

    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={formatDisplayDate(selectedDate)}
                    onClick={() => setIsOpen(!isOpen)}
                    readOnly
                    className={`w-full bg-brand-surface p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 text-white cursor-pointer ${className || ''}`}
                    placeholder="TT.MM.JJJJ"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="material-symbols-outlined text-brand-text-secondary">calendar_today</span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-brand-surface-alt border border-brand-surface rounded-lg shadow-xl z-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-2 rounded-full hover:bg-brand-surface transition-colors"
                        >
                            <span className="material-symbols-outlined text-brand-text-secondary">chevron_left</span>
                        </button>

                        <h3 className="text-white font-semibold">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-2 rounded-full hover:bg-brand-surface transition-colors"
                        >
                            <span className="material-symbols-outlined text-brand-text-secondary">chevron_right</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-brand-text-secondary p-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentDate).map((date, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleDateClick(date)}
                                className={`
                  p-2 text-sm rounded-lg transition-colors duration-200
                  ${isSelected(date)
                                        ? 'bg-white text-black font-semibold'
                                        : isToday(date)
                                            ? 'bg-purple-500 text-white font-medium'
                                            : isCurrentMonth(date)
                                                ? 'text-white hover:bg-brand-surface'
                                                : 'text-brand-text-secondary hover:bg-brand-surface'
                                    }
                `}
                            >
                                {date.getDate()}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm text-brand-text-secondary hover:text-white transition-colors"
                        >
                            Schließen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;