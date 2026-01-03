import React from 'react';
import { Facebook, Twitter, Pin } from 'lucide-react'; // Pin is Pinterest-ish
import './FooterStats.css';

const DonutChart = ({ pct, color, label, sublabel }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="donut-container">
            <div className="donut-chart">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke="var(--bg-card-lighter)"
                        strokeWidth="10"
                    />
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="donut-text" style={{ color: color }}>
                    {pct}%
                </div>
            </div>
            <div className="donut-labels">
                <div className="donut-label-main">{label}</div>
                <div className="donut-label-sub">{sublabel}</div>
            </div>
        </div>
    );
};

const FooterStats = () => {
    return (
        <div className="footer-stats">
            <div className="footer-bottom">
                <div className="footer-title">MONTHLY HABIT TRACKER</div>
            </div>
        </div>
    );
};

export default FooterStats;
