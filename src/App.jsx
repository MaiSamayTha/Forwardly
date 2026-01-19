import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import SummaryStats from './components/SummaryStats';
import HabitTable from './components/HabitTable';
import FooterStats from './components/FooterStats';
import './App.css';


// Helper to get today's date string ISO (YYYY-MM-DD)
const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate some sample data for the OTHER days in the current month for demo purposes
const generateSampleChecks = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const checks = [];
  // Add some random past dates
  for (let i = 1; i < today.getDate(); i++) {
    if (Math.random() > 0.5) {
      checks.push(`${year}-${month}-${String(i).padStart(2, '0')}`);
    }
  }
  return checks;
};

const initialHabits = [
  { id: 1, name: 'Stretch or do yoga', goal: 30, color: 'teal', checks: generateSampleChecks() },
  { id: 2, name: 'Walk 10,000 steps', goal: 30, color: 'blue', checks: generateSampleChecks() },
  { id: 3, name: 'Read a book chapter', goal: 30, color: 'purple', checks: generateSampleChecks() },
  { id: 4, name: 'Declutter a space', goal: 30, color: 'orange', checks: generateSampleChecks() },
  { id: 5, name: 'Floss', goal: 30, color: 'red', checks: generateSampleChecks() },
  { id: 6, name: 'Play a guitar', goal: 30, color: 'green', checks: generateSampleChecks() },
  { id: 7, name: 'Call grandpa', goal: 30, color: 'blue', checks: [] }, // Empty for demo
  { id: 8, name: 'Volunteer', goal: 30, color: 'purple', checks: [] },
  { id: 9, name: 'Put $10 to savings', goal: 30, color: 'orange', checks: generateSampleChecks() },
  { id: 10, name: '', goal: 30, color: 'teal', checks: [] },
];

import Sidebar from './components/Sidebar';

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits_v2'); // New key for new data structure
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [currentView, setCurrentView] = useState('dashboard');

  // Initialize to REAL current month
  const today = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [currentMonth, setCurrentMonth] = useState(monthNames[today.getMonth()]);
  const currentYear = today.getFullYear();

  React.useEffect(() => {
    localStorage.setItem('habits_v2', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    const newId = Math.max(...habits.map(h => h.id), 0) + 1;
    const newHabit = {
      id: newId,
      name: 'New Habit',
      goal: 30,
      color: ['teal', 'blue', 'purple', 'orange', 'red', 'green'][newId % 6],
      checks: []
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // Calculate daily totals for each day (1-31)
  // const dailyTotals = Array.from({ length: 31 }, (_, i) => {
  //   const dayNumber = i + 1;
  //   return habits.filter(h => h.checks.includes(dayNumber)).length;
  // });

  // Calculate success rate: total checks / (total possible checks)
  // const totalChecks = dailyTotals.reduce((sum, val) => sum + val, 0);
  // const totalPossible = habits.length * dailyTotals.length;
  // const successRate = totalPossible ? Math.round((totalChecks / totalPossible) * 100) : 0;


  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />

      <div className="dashboard-container">
        {currentView === 'dashboard' ? (
          <main className="dashboard-content">
            {/* We don't pass totals here anymore, logic moves inside or we calc below. 
                Let HabitTable handle display logic first. */}
            <HabitTable
              habits={habits}
              setHabits={setHabits}
              addHabit={addHabit}
              deleteHabit={deleteHabit}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
            <FooterStats />
          </main>
        ) : (
          <div className="profile-view" style={{ padding: '2rem', color: 'var(--text-primary)' }}>
            <h1>User Profile</h1>
            <p>Profile settings and details would go here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
