import React, { useState } from 'react';
import './HabitTable.css';

const daysInMonth = 31;
const startDayOfWeek = 6; // 0=Sun, 1=Mon, ..., 6=Sat (July 1st 2023 was Saturday)
const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = i + 1;
    const dayOfWeekIndex = (startDayOfWeek + i) % 7;
    const dayOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayOfWeekIndex];
    return { date, dayOfWeek };
});

const HabitTable = ({ habits, setHabits }) => {
    const [editingHabitId, setEditingHabitId] = useState(null);
    const [editingGoalId, setEditingGoalId] = useState(null);

    const updateHabitName = (id, newName) => {
        setHabits(habits.map(h => h.id === id ? { ...h, name: newName } : h));
    };

    const updateHabitGoal = (id, newGoal) => {
        const goalValue = parseInt(newGoal) || 30; // Default to 30 if invalid
        setHabits(habits.map(h => h.id === id ? { ...h, goal: goalValue } : h));
    };

    const toggleCheck = (habitId, day) => {
        setHabits(habits.map(h => {
            if (h.id === habitId) {
                const newChecks = h.checks.includes(day)
                    ? h.checks.filter(d => d !== day)
                    : [...h.checks, day];
                return { ...h, checks: newChecks };
            }
            return h;
        }));
    };

    const calculateProgress = (checks, goal) => {
        if (!goal) return 0;
        return Math.min(100, Math.round((checks.length / goal) * 100)); // Assuming goal is monthly target? Or maybe goal is frequency/week? 
        // Image shows percentages like 80%, 86%. 
        // "Stretch" goal 5, checks 6. 6/5 = 120%? But image says 80%.
        // Maybe goal is "days per week"? Or maybe total days?
        // Let's just use checks.length / 31 * 100 for now or checks.length / goal if goal is total count.
        // Actually, "Stretch" has 6 checks visible. Goal 5. Progress 80%. 
        // Wait, 4/5 = 80%. Maybe only 4 checks are valid? Or maybe the goal is something else.
        // Let's assume the percentage is just a visual mock for now or calculated simply.
        // Let's stick to checks.length / goal * 100 but capped?
        // Actually, let's just calculate based on checks count vs goal count if goal is total.
        // Let's just assume checks.length / goal * 100 for the visual bar.
    };

    // Calculate daily totals for the bottom histogram
    const dailyTotals = days.map(d => {
        return habits.filter(h => h.checks.includes(d.date)).length;
    });

    return (
        <div className="habit-table-container">
            <div className="habit-grid">
                {/* Header */}
                <div className="grid-header-cell habit-col">HABIT</div>
                <div className="grid-header-cell goal-col">GOAL</div>
                {days.map(d => (
                    <div key={d.date} className="grid-header-cell day-col">
                        <span className="day-num">{d.date}</span>
                        <span className="day-letter">{d.dayOfWeek}</span>
                    </div>
                ))}
                <div className="grid-header-cell progress-col">PROGRESS</div>

                {/* Rows */}
                {habits.map(habit => {
                    // Progress based on total days in month as requested (15 days = ~50%)
                    const rawProgress = Math.round((habit.checks.length / daysInMonth) * 100);
                    const progress = Math.min(100, rawProgress);
                    const isEditing = editingHabitId === habit.id;

                    return (
                        <React.Fragment key={habit.id}>
                            <div
                                className={`grid-cell habit-name ${isEditing ? 'editing' : ''}`}
                                onClick={() => !isEditing && setEditingHabitId(habit.id)}
                            >
                                {isEditing ? (
                                    <input
                                        className="habit-name-input"
                                        value={habit.name}
                                        autoFocus
                                        onChange={(e) => updateHabitName(habit.id, e.target.value)}
                                        onBlur={() => setEditingHabitId(null)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') setEditingHabitId(null);
                                        }}
                                    />
                                ) : (
                                    habit.name
                                )}
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
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') setEditingGoalId(null);
                                        }}
                                    />
                                ) : (
                                    habit.goal
                                )}
                            </div>
                            {days.map(d => {
                                const isChecked = habit.checks.includes(d.date);
                                return (
                                    <div
                                        key={d.date}
                                        className={`grid-cell day-check ${isChecked ? 'checked' : ''} ${habit.color}`}
                                        onClick={() => toggleCheck(habit.id, d.date)}
                                    >
                                        {isChecked && <div className="check-mark"></div>}
                                    </div>
                                );
                            })}
                            <div className="grid-cell progress-val">
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
                        </React.Fragment>
                    );
                })}

                {/* Footer Row (Histogram) */}
                <div className="grid-cell footer-desc-col">
                </div>
                <div className="grid-cell"></div> {/* Goal col empty */}
                {dailyTotals.map((total, i) => (
                    <div key={i} className="grid-cell day-total-col">
                        <div className="histogram-bar" style={{ height: `${total * 4}px` }}></div>
                        <span className="total-val">{total}</span>
                    </div>
                ))}
                <div className="grid-cell total-completed-col">
                    <div className="big-total">52/84</div>
                    <div className="completed-label">Completed</div>
                </div>
            </div>
        </div>
    );
};

export default HabitTable;
