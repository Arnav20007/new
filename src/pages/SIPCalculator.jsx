import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement,
    Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import SEOHead from '../components/common/SEOHead';
import FAQSection from '../components/common/FAQSection';
import TryNextCalculator from '../components/common/TryNextCalculator';
import ValidatedInput from '../components/common/ValidatedInput';
import PrivacyBadge from '../components/common/PrivacyBadge';
import ShareButton from '../components/common/ShareButton';
import { useCurrency } from '../context/CurrencyContext';
import { calculateSIP } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const faqs = [
    { question: 'What is a SIP?', answer: 'A Systematic Investment Plan (SIP) is a method of investing in mutual funds where an investor contributes a fixed amount of money at regular intervals (monthly, quarterly, etc.) rather than making a one-time lump sum investment.' },
    { question: 'What are the benefits of SIP?', answer: 'Key benefits include Rupee Cost Averaging, the Power of Compounding, financial discipline, and the convenience of starting with small amounts.' },
    { question: 'Is SIP better than a lump sum?', answer: 'SIPs are generally safer during market volatility as they average out the cost of purchase. Lump sum might perform better in a one-way bull market but involves higher timing risk.' },
    { question: 'How is SIP return calculated?', answer: 'Mutual fund returns are typically calculated using XIRR (Extended Internal Rate of Return) to account for multiple cash flows at different times.' },
    { question: 'Can I stop my SIP anytime?', answer: 'Yes, most SIPs are flexible. You can stop, pause, or increase the amount at any time without heavy penalties in most open-ended mutual funds.' },
];

const validationRules = {
    monthlyInvestment: { label: 'Monthly Investment', min: 100, max: 1000000, required: true },
    annualRate: { label: 'Expected Return Rate', min: 1, max: 50, allowDecimal: true, required: true },
    years: { label: 'Time Period', min: 1, max: 50, allowDecimal: false, required: true },
};

export default function SIPCalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, validateAll, getNumericValue } = useValidatedInputs(
        { monthlyInvestment: '5000', annualRate: '12', years: '10' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const [insights, setInsights] = useState([]);
    const resultsRef = useRef(null);

    // Instant Calculation Logic
    useEffect(() => {
        const principal = getNumericValue('monthlyInvestment');
        const rate = getNumericValue('annualRate');
        const time = parseInt(inputs.years);

        if (principal > 0 && rate > 0 && time > 0) {
            const res = calculateSIP(principal, rate, time);
            setResults(res);

            // Generate Smart Insights
            const higherAmount = principal * 1.2;
            const higherRes = calculateSIP(higherAmount, rate, time);
            const extraWealth = higherRes.totalValue - res.totalValue;

            const longerTime = time + 5;
            const longerRes = calculateSIP(principal, rate, longerTime);
            const timeWealth = longerRes.totalValue - res.totalValue;

            setInsights([
                {
                    type: 'amount',
                    title: 'The Power of 20%',
                    text: `If you increase your monthly investment to ${formatCurrency(higherAmount)}, your total wealth would grow to ${formatCurrency(higherRes.totalValue)} (an extra ${formatCurrency(extraWealth)})!`,
                    icon: '🚀'
                },
                {
                    type: 'time',
                    title: 'Stay 5 Years Longer',
                    text: `By extending your horizon to ${longerTime} years, you could accumulate ${formatCurrency(longerRes.totalValue)}. That's ${formatCurrency(timeWealth)} more than your current plan!`,
                    icon: '⏳'
                }
            ]);
        } else {
            setResults(null);
            setInsights([]);
        }
    }, [inputs, symbol]);

    const lineChartData = results ? {
        labels: results.yearlyData.map(d => `Year ${d.year}`),
        datasets: [
            {
                label: 'Total Value',
                data: results.yearlyData.map(d => d.maturityValue),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Invested Amount',
                data: results.yearlyData.map(d => d.investment),
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.4,
                borderDash: [5, 5]
            },
        ],
    } : null;

    const barChartData = results ? {
        labels: results.yearlyData.filter((_, i) => i % 2 === 0 || i === results.yearlyData.length - 1).map(d => `Year ${d.year}`),
        datasets: [
            {
                label: 'Investment',
                data: results.yearlyData.filter((_, i) => i % 2 === 0 || i === results.yearlyData.length - 1).map(d => d.investment),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 4,
            },
            {
                label: 'Wealth Gained',
                data: results.yearlyData.filter((_, i) => i % 2 === 0 || i === results.yearlyData.length - 1).map(d => d.wealthGained),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderRadius: 4,
            }
        ]
    } : null;

    const doughnutData = results ? {
        labels: ['Invested Amount', 'Est. Returns'],
        datasets: [{
            data: [results.totalInvested, results.estReturns],
            backgroundColor: ['#3b82f6', '#10b981'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="SIP Calculator India – Mutual Fund Growth | FinanceCalc"
                description="Estimate the future value of your Systematic Investment Plan (SIP) in mutual funds in India. Instant results, charts and smart wealth insights."
                canonical="/sip-calculator"
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>SIP Calculator</span></nav>
            <section className="calculator-hero">
                <h1>SIP Calculator</h1>
                <p className="hero-subtitle">Plan your future wealth with instant projections and smart investment insights.</p>
            </section>

            <form className="calculator-form" noValidate>
                <div className="form-grid">
                    <ValidatedInput name="monthlyInvestment" label="Monthly Investment" value={inputs.monthlyInvestment} onChange={handleChange} onBlur={handleBlur} error={errors.monthlyInvestment} touched={touched.monthlyInvestment} prefix={symbol} />
                    <ValidatedInput name="annualRate" label="Expected Return Rate (p.a)" value={inputs.annualRate} onChange={handleChange} onBlur={handleBlur} error={errors.annualRate} touched={touched.annualRate} suffix="%" />
                    <ValidatedInput name="years" label="Time Period (Years)" value={inputs.years} onChange={handleChange} onBlur={handleBlur} error={errors.years} touched={touched.years} suffix="yrs" />
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Live calculations — results update instantly as you type.
                </div>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card"><div className="result-label">Total Invested</div><div className="result-value small">{formatCurrency(results.totalInvested)}</div></div>
                        <div className="result-card highlight"><div className="result-label">Total Value</div><div className="result-value">{formatCurrency(results.totalValue)}</div></div>
                        <div className="result-card"><div className="result-label">Est. Returns</div><div className="result-value small" style={{ color: '#10b981' }}>+{formatCurrency(results.estReturns)}</div></div>
                    </div>

                    {insights.length > 0 && (
                        <div className="smart-insights">
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', color: 'var(--text-primary)' }}>💡 Smart Insights</h3>
                            <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                {insights.map((insight, idx) => (
                                    <div key={idx} className="insight-card" style={{ background: 'var(--bg-glass)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '3rem', opacity: 0.1 }}>{insight.icon}</div>
                                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>{insight.icon}</span> {insight.title}
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{insight.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="chart-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                            <h3>Investment Growth</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visualize your corpus over {inputs.years} years</span>
                        </div>
                        <div className="chart-container" style={{ height: 350 }}><Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: v => formatCurrency(v) } } } }} /></div>
                    </div>

                    <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <div>
                            <h3>Yearly Progression</h3>
                            <div className="chart-container" style={{ height: 300 }}><Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => formatCurrency(v) } } } }} /></div>
                        </div>
                        <div>
                            <h3>Breakdown</h3>
                            <div style={{ maxWidth: 280, margin: '0 auto' }}><Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} /></div>
                        </div>
                    </div>

                    <div className="actions-bar">
                        <ShareButton title="My SIP Projection" text={`Investing ${formatCurrency(getNumericValue('monthlyInvestment'))} monthly for ${inputs.years} years could grow to ${formatCurrency(results.totalValue)}!`} />
                    </div>

                    <div className="data-table-wrapper">
                        <h3>Detailed Schedule</h3>
                        <div className="data-table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr><th>Year</th><th>Total Investment</th><th>Interest Earned</th><th>Total Wealth</th></tr>
                                </thead>
                                <tbody>
                                    {results.yearlyData.map(d => (
                                        <tr key={d.year}>
                                            <td>Year {d.year}</td>
                                            <td>{formatCurrency(d.investment)}</td>
                                            <td style={{ color: '#10b981' }}>+{formatCurrency(d.wealthGained)}</td>
                                            <td style={{ fontWeight: 600 }}>{formatCurrency(d.maturityValue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/sip-calculator" />
        </div>
    );
}

