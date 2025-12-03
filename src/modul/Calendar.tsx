import React, { useMemo, useState, type JSX } from "react";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00"
];

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function addMonths(date: Date, months: number) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
}
function isSameDay(a?: Date | null, b?: Date | null) {
    if (!a || !b) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}
function isBeforeDay(a: Date, b: Date) {
    const ad = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const bd = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return ad.getTime() < bd.getTime();
}
function isWeekend(date: Date) {
    const d = date.getDay();
    return d === 5 || d === 6; // Saturday(5) or Sunday(6)
}

export default function Calendar(): JSX.Element {
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const [visibleMonth, setVisibleMonth] = useState<Date>(startOfMonth(today));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const weeks = useMemo(() => {
        // Build an array of weeks, each week is array of Date | null (null for padding)
        const start = startOfMonth(visibleMonth);
        const end = endOfMonth(visibleMonth);
        const startDay = start.getDay(); // 0..6
        const totalDays = end.getDate();

        const days: (Date | null)[] = [];

        // previous month's tail padding (null)
        for (let i = 0; i < startDay; i++) days.push(null);

        // days of month
        for (let d = 1; d <= totalDays; d++) {
            days.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), d));
        }

        // trailing padding to complete weeks to multiple of 7
        while (days.length % 7 !== 0) days.push(null);

        const weeksArr: (Date | null)[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeksArr.push(days.slice(i, i + 7));
        }
        return weeksArr;
    }, [visibleMonth]);

    function handlePrevMonth() {
        setVisibleMonth((m) => addMonths(m, -1));
    }
    function handleNextMonth() {
        setVisibleMonth((m) => addMonths(m, 1));
    }
    function handleSelectDate(date: Date) {
        // disallow selecting past dates (before today) or weekends
        if (isBeforeDay(date, today)) return;
        if (isWeekend(date)) return;
        setSelectedDate(date);
        setSelectedTime(null); // Reset time when date changes
    }
    function handleSelectTime(time: string) {
        setSelectedTime(time);
    }
    function handleProceed() {
        if (!selectedDate || !selectedTime) return;
        // Save chosen date and time
        const dateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':').map(Number);
        dateTime.setHours(hours, minutes, 0, 0);
        sessionStorage.setItem("appointmentDateTime", dateTime.toISOString());
        window.location.href = "/";
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div style={styles.headerRow}>
                    <button aria-label="Previous month" style={styles.iconButton} onClick={handlePrevMonth}>
                        ‹
                    </button>
                    <div style={styles.monthLabel}>
                        {visibleMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
                    </div>
                    <button aria-label="Next month" style={styles.iconButton} onClick={handleNextMonth}>
                        ›
                    </button>
                </div>
                <div style={styles.selectedLabel}>
                    {selectedDate
                        ? `Selected: ${selectedDate.toLocaleDateString()}${selectedTime ? ` at ${selectedTime}` : ''}`
                        : "Choose an appointment date and time (workdays only)"}
                </div>
            </header>

            <main style={styles.calendarContainer}>
                <div style={styles.grid}>
                    <div style={styles.weekHeader}>
                        {WEEK_DAYS.map((wd) => (
                            <div key={wd} style={styles.weekDay}>
                                {wd}
                            </div>
                        ))}
                    </div>

                    <div style={styles.weeks}>
                        {weeks.map((week, wi) => (
                            <div key={wi} style={styles.weekRow}>
                                {week.map((day, di) => {
                                    if (!day) {
                                        return <div key={di} style={styles.dayCellEmpty} />;
                                    }

                                    const past = isBeforeDay(day, today);
                                    const weekend = isWeekend(day);
                                    const disabled = past || weekend;
                                    const selected = isSameDay(day, selectedDate);
                                    const isToday = isSameDay(day, today);

                                    return (
                                        <button
                                            key={di}
                                            onClick={() => handleSelectDate(day)}
                                            disabled={disabled}
                                            aria-pressed={selected}
                                            title={weekend ? "Weekends are not available" : undefined}
                                            style={{
                                                ...styles.dayCell,
                                                ...(disabled ? styles.dayDisabled : {}),
                                                ...(selected ? styles.daySelected : {}),
                                                ...(isToday && !selected ? styles.dayToday : {}),
                                            }}
                                        >
                                            <div>{day.getDate()}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {selectedDate && (
                        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            {TIME_SLOTS.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleSelectTime(time)}
                                    style={{
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        background: selectedTime === time ? '#0ea5a4' : 'white',
                                        color: selectedTime === time ? 'white' : 'black',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer style={styles.footer}>
                <button
                    onClick={handleProceed}
                    disabled={!selectedDate || !selectedTime}
                    style={{
                        ...styles.proceedButton,
                        ...(!selectedDate || !selectedTime ? styles.proceedButtonDisabled : {}),
                    }}
                >
                    Continue
                </button>
            </footer>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    page: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        backgroundColor: "#f6f7fb",
        color: "#0f172a",
    },
    header: {
        padding: "18px",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
    },
    headerRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    iconButton: {
        border: "none",
        background: "transparent",
        fontSize: 24,
        cursor: "pointer",
        padding: "4px 8px",
    },
    monthLabel: {
        fontSize: 18,
        fontWeight: 600,
    },
    selectedLabel: {
        marginTop: 8,
        textAlign: "center",
        color: "#475569",
        fontSize: 13,
    },
    calendarContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    grid: {
        width: "100%",
        maxWidth: 720,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(2,6,23,0.08)",
        padding: 16,
    },
    weekHeader: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 6,
        marginBottom: 8,
    },
    weekDay: {
        textAlign: "center",
        color: "#94a3b8",
        fontSize: 12,
        fontWeight: 600,
    },
    weeks: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    weekRow: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 6,
    },
    dayCellEmpty: {
        height: 56,
        borderRadius: 8,
        background: "transparent",
    },
    dayCell: {
        height: 56,
        borderRadius: 8,
        border: "1px solid transparent",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        color: "#0f172a",
    },
    dayDisabled: {
        color: "#b6bcc8",
        cursor: "not-allowed",
        background: "transparent",
    },
    daySelected: {
        background: "#0ea5a4",
        color: "white",
        fontWeight: 700,
    },
    dayToday: {
        border: "1px dashed #0ea5a4",
    },
    footer: {
        padding: 16,
        borderTop: "1px solid rgba(15,23,42,0.06)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "white",
    },
    proceedButton: {
        minWidth: 160,
        padding: "10px 16px",
        fontSize: 15,
        fontWeight: 700,
        borderRadius: 10,
        border: "none",
        background: "#0ea5a4",
        color: "white",
        cursor: "pointer",
    },
    proceedButtonDisabled: {
        background: "#c7f3f1",
        color: "#7f9ca0",
        cursor: "not-allowed",
    },
};