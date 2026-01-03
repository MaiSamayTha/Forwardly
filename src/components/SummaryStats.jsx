import React from 'react';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { Heart } from 'lucide-react';
import './SummaryStats.css';

const SummaryStats = ({ dailyTotals }) => {
    // Convert dailyTotals array to chart data format
    const data = dailyTotals.map(val => ({ val }));

    return (
        <div className="summary-stats">
            <div className="stats-left">
                <div className="stat-row">
                    <span className="label">Start Date:</span>
                    <span className="value">July 1, 2023</span>
                </div>
                <div className="stat-row">
                    <span className="label">End Date:</span>
                    <span className="value">July 31, 2023</span>
                </div>
                <div className="stat-row">
                    <span className="label">Total Days:</span>
                    <span className="value">31</span>
                </div>
            </div>

            <div className="stats-chart">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 10, bottom: 10, left: 10 }}>
                        <CartesianGrid vertical={true} horizontal={true} stroke="var(--border-color)" strokeOpacity={0.5} />
                        <Line
                            type="monotone"
                            dataKey="val"
                            stroke="var(--chart-line)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--bg-card)', strokeWidth: 2 }}
                            isAnimationActive={false}
                        >
                            <LabelList dataKey="val" position="top" offset={10} style={{ fill: 'var(--text-primary)', fontSize: '10px', fontWeight: 'bold' }} />
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
                {/* Manually placing labels for visual match if needed, or rely on tooltips */}
            </div>

            <div className="stats-right">
                <div className="success-label">SUCCESS RATE</div>
                <div className="success-percentage">84%</div>
                <div className="hearts">
                    <Heart fill="#000000" color="#000000" size={24} />
                    <Heart fill="#000000" color="#000000" size={24} />
                </div>
                <div className="good-job">GOOD JOB</div>
            </div>
        </div>
    );
};

export default SummaryStats;
