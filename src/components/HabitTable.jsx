import React, { useState, useMemo } from 'react';
import { Trash2, Plus } from 'lucide-react';
import SummaryStats from './SummaryStats';
import './HabitTable.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const HabitTable = ({ habits, setHabits, addHabit, deleteHabit, currentMonth, currentYear }) => {
    const [editingHabitId, setEditingHabitId] = useState(null);
    const [editingGoalId, setEditingGoalId] = useState(null);

    // Calendar Logic
    const monthIndex = monthNames.indexOf(currentMonth);
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const startDayOfWeek = new Date(currentYear, monthIndex, 1).getDay(); // 0=Sun

    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => {
        const date = i + 1;
        // Adjust startDayOfWeek. JS getDay() 0=Sun. Our UI uses S,M,T...
        const dayOfWeekIndex = (startDayOfWeek + i) % 7;
        const dayOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayOfWeekIndex];

        // Create ISO string for matching: YYYY-MM-DD
        const monthStr = String(monthIndex + 1).padStart(2, '0');
        const dayStr = String(date).padStart(2, '0');
        const isoDate = `${currentYear}-${monthStr}-${dayStr}`;

        return { date, dayOfWeek, isoDate };
    }), [currentYear, monthIndex, daysInMonth, startDayOfWeek]);

    const updateHabitName = (id, newName) => {
        setHabits(habits.map(h => h.id === id ? { ...h, name: newName } : h));
    };

    const updateHabitGoal = (id, newGoal) => {
        const goalValue = parseInt(newGoal) || 30;
        setHabits(habits.map(h => h.id === id ? { ...h, goal: goalValue } : h));
    };

    const toggleCheck = (habitId, dayIso) => {
        // Validation: Cannot check future dates
        const today = new Date();
        const targetDate = new Date(dayIso);

        // Reset time parts for accurate date-only comparison
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0); // Treat target as midnight

        // User requirement: "no further" -> Block future dates.
        if (targetDate > today) {
            alert("You cannot mark habits for future dates!");
            return;
        }

        setHabits(habits.map(h => {
            if (h.id === habitId) {
                const newChecks = h.checks.includes(dayIso)
                    ? h.checks.filter(d => d !== dayIso)
                    : [...h.checks, dayIso];
                return { ...h, checks: newChecks };
            }
            return h;
        }));
    };

    // Calculate Stats for the CURRENT VIEW
    const dailyTotals = days.map(d => {
        return habits.filter(h => h.checks.includes(d.isoDate)).length;
    });

    const totalChecks = dailyTotals.reduce((a, b) => a + b, 0);
    // Assuming goal is "per month" -> daysInMonth. Or habit.goal (static 30)
    // Let's use habit.goal * habits.length if we want success against user goals.
    // Or simpler: Total Checks / (Habits * DaysInMonth)
    // The previous implementation used habits.length * dailyTotals.length (which is daysInMonth)
    const totalPossible = habits.length * daysInMonth;
    const successRate = totalPossible ? Math.round((totalChecks / totalPossible) * 100) : 0;


    return (
        <div className="habit-content-wrapper">
            {/* Stats Header */}
            <SummaryStats
                dailyTotals={dailyTotals}
                successRate={successRate}
                month={currentMonth}
            />

            <div className="habit-table-wrapper">
                {/* Left Panel: Habits, Goals, Days */}
                <div className="habit-main-panel">
                    <div className="habit-grid-main" style={{ gridTemplateColumns: `200px 60px repeat(${daysInMonth}, minmax(28px, 1fr))` }}>
                        {/* Header */}
                        <div className="grid-header-cell habit-col">HABIT</div>
                        <div className="grid-header-cell goal-col">GOAL</div>
                        {days.map(d => (
                            <div key={d.date} className="grid-header-cell day-col">
                                <span className="day-num">{d.date}</span>
                                <span className="day-letter">{d.dayOfWeek}</span>
                            </div>
                        ))}

                        {/* Rows */}
                        {habits.map(habit => {
                            const isEditing = editingHabitId === habit.id;
                            return (
                                <React.Fragment key={habit.id}>
                                    <div className={`grid-cell habit-name ${isEditing ? 'editing' : ''}`}>
                                        <div className="habit-name-content" onClick={() => !isEditing && setEditingHabitId(habit.id)}>
                                            {isEditing ? (
                                                <input
                                                    className="habit-name-input"
                                                    value={habit.name}
                                                    autoFocus
                                                    onChange={(e) => updateHabitName(habit.id, e.target.value)}
                                                    onBlur={() => setEditingHabitId(null)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingHabitId(null); }}
                                                />
                                            ) : (
                                                habit.name
                                            )}
                                        </div>
                                        <button className="delete-habit-btn" onClick={(e) => {
                                            e.stopPropagation();
                                            deleteHabit(habit.id);
                                        }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div
                                        className={`grid-cell goal-val ${editingGoalId === habit.id ? 'editing' : ''}`}
                                        onClick={() => !editingGoalId && setEditingGoalId(habit.id)}
                                    >
                                        {editingGoalId === habit.id ? (
                                            <input
                                                className="habit-name-input"
                                                type="number"
                                                value={habit.goal}
                                                autoFocus
                                                onChange={(e) => updateHabitGoal(habit.id, e.target.value)}
                                                onBlur={() => setEditingGoalId(null)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') setEditingGoalId(null); }}
                                            />
                                        ) : (
                                            habit.goal
                                        )}
                                    </div>
                                    {days.map(d => {
                                        const isChecked = habit.checks.includes(d.isoDate);
                                        return (
                                            <div
                                                key={d.isoDate}
                                                className={`grid-cell day-check ${isChecked ? 'checked' : ''} ${habit.color}`}
                                                onClick={() => toggleCheck(habit.id, d.isoDate)}
                                            >
                                                {isChecked && <div className="check-mark"></div>}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}

                        {/* Add Habit Row Spacers */}
                        <div className="grid-cell habit-name add-habit-row" onClick={addHabit} style={{ cursor: 'pointer', opacity: 0.7 }}>
                            <Plus size={16} style={{ marginRight: '8px' }} /> Add Habit
                        </div>
                        <div className="grid-cell"></div>
                        {days.map(d => <div key={`spacer-${d.date}`} className="grid-cell"></div>)}

                        {/* Footer Row (Histogram) */}
                        <div className="grid-cell footer-desc-col">
                            Daily completion trend for {currentMonth}
                        </div>
                        <div className="grid-cell"></div>
                        {dailyTotals.map((total, i) => (
                            <div key={i} className="grid-cell day-total-col">
                                <div className="histogram-bar" style={{ height: `${total * 3}px`, backgroundColor: total > 0 ? 'var(--text-secondary)' : 'transparent' }}></div>
                                <span className="total-val">{total}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Progress */}
                <div className="habit-progress-panel">
                    <div className="habit-grid-progress">
                        <div className="grid-header-cell progress-col">PROGRESS</div>

                        {habits.map(habit => {
                            // Filter checks for THIS month only for progress calculation
                            const currentMonthChecks = habit.checks.filter(c => c.startsWith(`${currentYear}-${String(monthIndex + 1).padStart(2, '0')}`));
                            const rawProgress = Math.round((currentMonthChecks.length / daysInMonth) * 100);
                            const progress = Math.min(100, rawProgress);
                            return (
                                <div key={habit.id} className="grid-cell progress-val">
                                    <>
                                        <span className="pct">{progress}%</span>
                                        <div className="progress-bar-bg">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${Math.min(100, progress)}%`, backgroundColor: `var(--accent-${habit.color})` }}
                                            ></div>
                                        </div>
                                    </>
                                </div>
                            );
                        })}

                        {/* Add Habit Spacer */}
                        <div className="grid-cell" style={{ height: '36px' }}></div>

                        {/* Footer Total */}
                        <div className="grid-cell total-completed-col">
                            <div className="big-total">{totalChecks}</div>
                            <div className="completed-label">Total Checks</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitTable;
