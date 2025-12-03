import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css';

const HOURS = Array.from({ length: 8 }, (_, i) => 8 + i); // 8..15 (8 one-hour slots)

const formatDateKey = (d: Date) => d.toISOString().slice(0, 10);

const Calendar1: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // reservations keyed by YYYY-MM-DD -> array of reserved start hours (number)
    const [reservations, setReservations] = useState<Record<string, number[]>>({});
    const [message, setMessage] = useState<string>('');

    const handleDateChange: React.ComponentProps<typeof Calendar>['onChange'] = (value) => {
        if (!(value instanceof Date)) return;
        // ignore weekends (safety, Calendar also disables tiles)
        const day = value.getDay();
        if (day === 0 || day === 6) {
            return;
        }
        setSelectedDate(value);
        setMessage('');
    };

    const isSlotReserved = (dateKey: string, hour: number) => {
        return reservations[dateKey]?.includes(hour) ?? false;
    };

    const isSlotInPast = (date: Date, hour: number) => {
        const slotEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour + 1, 0, 0);
        return slotEnd <= new Date();
    };

    const reserveSlot = (hour: number) => {
        if (!selectedDate) return;
        const key = formatDateKey(selectedDate);
        if (isSlotReserved(key, hour)) {
            setMessage('This slot is already reserved.');
            return;
        }
        if (isSlotInPast(selectedDate, hour)) {
            setMessage('Cannot reserve a past slot.');
            return;
        }
        setReservations((prev) => {
            const next = { ...prev, [key]: [...(prev[key] ?? []), hour].sort((a, b) => a - b) };
            return next;
        });
        setMessage(`Reserved ${selectedDate.toLocaleDateString()} ${hour}:00 - ${hour + 1}:00`);
    };

    const handleNextPage = () => {
        console.log('Navigating to the next page...');
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                minDate={new Date()}
                tileDisabled={({ date }) => {
                    const day = date.getDay();
                    return day === 0 || day === 6; // Disable weekends
                }}
            />

            <div className="slots-container">
                <h3>Available 1-hour slots (Mon–Fri, 8:00–16:00)</h3>
                {!selectedDate && <p>Please select a date to see slots.</p>}
                {selectedDate && (
                    <>
                        <p>
                            Selected: {selectedDate.toLocaleDateString()} ({selectedDate.toLocaleString([], { weekday: 'long' })})
                        </p>
                        <div className="slots-grid">
                            {HOURS.map((hour) => {
                                const key = formatDateKey(selectedDate);
                                const reserved = isSlotReserved(key, hour);
                                const past = isSlotInPast(selectedDate, hour);
                                const disabled = reserved || past;
                                return (
                                    <button
                                        key={hour}
                                        onClick={() => reserveSlot(hour)}
                                        disabled={disabled}
                                        style={{
                                            margin: 4,
                                            padding: '8px 12px',
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            background: reserved ? '#d9534f' : '#5cb85c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 4,
                                            opacity: disabled ? 0.6 : 1,
                                        }}
                                        title={
                                            reserved
                                                ? 'Already reserved'
                                                : past
                                                ? 'Past slot'
                                                : `${hour}:00 - ${hour + 1}:00`
                                        }
                                    >
                                        {hour}:00 - {hour + 1}:00 {reserved ? ' (Booked)' : ''}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <footer style={{ marginTop: 16 }}>
                <button onClick={handleNextPage}>{message ? message : 'Make a Reservation'}</button>
            </footer>
        </div>
    );
};

export default Calendar1;

