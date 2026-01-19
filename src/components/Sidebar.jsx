import React from 'react';
import { User, Calendar, LayoutDashboard } from 'lucide-react';
import './Sidebar.css';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Sidebar = ({ currentView, setCurrentView, currentMonth, setCurrentMonth }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <LayoutDashboard size={24} color="var(--accent-blue)" />
                    <span>HabitFlow</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section-title">Menu</div>

                <div
                    className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
                    onClick={() => setCurrentView('profile')}
                >
                    <User size={18} />
                    <span>Profile</span>
                </div>

                <div className="nav-section-title">Months</div>
                <div className="scrollable-months">
                    {months.map((m) => (
                        <div
                            key={m}
                            className={`nav-item ${currentView === 'dashboard' && currentMonth === m ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentView('dashboard');
                                setCurrentMonth(m);
                            }}
                        >
                            <Calendar size={16} />
                            <span>{m}</span>
                        </div>
                    ))}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
