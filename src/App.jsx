import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import SummaryStats from './components/SummaryStats';
import HabitTable from './components/HabitTable';
import FooterStats from './components/FooterStats';
import './App.css';

const initialHabits = [
  { id: 1, name: 'Stretch or do yoga', goal: 30, color: 'teal', checks: [1, 5, 8, 12, 15, 22] },
  { id: 2, name: 'Walk 10,000 steps', goal: 30, color: 'blue', checks: [1, 3, 4, 5, 6, 18] },
  { id: 3, name: 'Read a book chapter', goal: 30, color: 'purple', checks: [1, 2, 4, 6, 7, 10, 13, 16, 20, 21] },
  { id: 4, name: 'Declutter a space', goal: 30, color: 'orange', checks: [3, 8, 13, 23] },
  { id: 5, name: 'Floss', goal: 30, color: 'red', checks: [1, 2, 3, 4, 5, 7, 9, 11, 12, 14, 15, 16, 18, 22] },
  { id: 6, name: 'Play a guitar', goal: 30, color: 'green', checks: [2, 7, 8, 12, 16] },
  { id: 7, name: 'Call grandpa', goal: 30, color: 'blue', checks: [1, 4, 6, 8, 13, 22] },
  { id: 8, name: 'Volunteer', goal: 30, color: 'purple', checks: [8, 23] },
  { id: 9, name: 'Put $10 to savings', goal: 30, color: 'orange', checks: [3, 13, 16, 18] },
  { id: 10, name: '', goal: 30, color: 'teal', checks: [] },
];

function App() {
  const [habits, setHabits] = useState(initialHabits);

  // Calculate daily totals for each day (1-31)
  const dailyTotals = Array.from({ length: 31 }, (_, i) => {
    const dayNumber = i + 1;
    return habits.filter(h => h.checks.includes(dayNumber)).length;
  });

  // Calculate success rate: total checks / (total possible checks)
  const totalChecks = dailyTotals.reduce((sum, val) => sum + val, 0);
  const totalPossible = habits.length * dailyTotals.length;
  const successRate = totalPossible ? Math.round((totalChecks / totalPossible) * 100) : 0;


  return (
    <div className="dashboard-container">
      {/* Header removed as per request */}

      <main className="dashboard-content">
        <SummaryStats dailyTotals={dailyTotals} successRate={successRate} />
        <HabitTable habits={habits} setHabits={setHabits} />
        <FooterStats />
      </main>
    </div>
  );
}

export default App;
