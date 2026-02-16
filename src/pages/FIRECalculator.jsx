import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
} from 'chart.js';
import SEOHead from '../components/common/SEOHead';
import FAQSection from '../components/common/FAQSection';
import TryNextCalculator from '../components/common/TryNextCalculator';
import ValidatedInput from '../components/common/ValidatedInput';
import PrivacyBadge from '../components/common/PrivacyBadge';
import ShareButton from '../components/common/ShareButton';
import { useCurrency } from '../context/CurrencyContext';
import { calculateFIRE } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const faqs = [
    { question: 'What is FIRE?', answer: 'FIRE stands for Financial Independence, Retire Early. It is a movement dedicated to a program of extreme savings and investment that allows proponents to retire far earlier than traditional budgets and retirement plans would permit.' },
    { question: 'What is my FIRE Number?', answer: 'Your FIRE Number is the total amount of invested assets you need to support your lifestyle without ever having to work again. A common rule of thumb is 25 to 33 times your annual expenses.' },
    { question: 'What is the Safe Withdrawal Rate (SWR)?', answer: 'The SWR is the percentage of your retirement corpus you can withdraw each year without running out of money. While 4% is common in the US, many experts recommend 3% for India due to higher inflation.' },
    { question: 'Do I need to stop working after reaching FIRE?', answer: 'No! FIRE is about having the *choice* to work. Many people who reach FIRE continue to work on passion projects, freelance, or start businesses because they no longer need the paycheck.' },
    { question: 'How does inflation affect FIRE?', answer: 'Inflation reduces the purchasing power of your money. Your FIRE plan must account for rising costs by ensuring your investments grow faster than inflation and your withdrawal rate remains sustainable.' },
];

const validationRules = {
    currentAge: { label: 'Current Age', min: 18, max: 80, required: true },
    targetAge: { label: 'Target Retirement Age', min: 30, max: 90, required: true },
    currentSavings: { label: 'Existing Corpus', min: 0, max: 1000000000, required: true },
    monthlyInvest: { label: 'Monthly Investment', min: 0, max: 1000000, required: true },
    monthlyExp: { label: 'Current Monthly Expenses', min: 5000, max: 1000000, required: true },
    returnPre: { label: 'Return (Pre-Retirement %)', min: 1, max: 30, allowDecimal: true, required: true },
    returnPost: { label: 'Return (Post-Retirement %)', min: 1, max: 30, allowDecimal: true, required: true },
    inflation: { label: 'Expected Inflation (%)', min: 1, max: 20, allowDecimal: true, required: true },
};

export default function FIRECalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, validateAll, getNumericValue } = useValidatedInputs(
        {
            currentAge: '28',
            targetAge: '45',
            currentSavings: '500000',
            monthlyInvest: '40000',
            monthlyExp: '50000',
            returnPre: '12',
            returnPost: '8',
            inflation: '6'
        },
        validationRules
    );
    const [results, setResults] = useState(null);
    const [insights, setInsights] = useState([]);
    const resultsRef = useRef(null);

    useEffect(() => {
        const cAge = parseInt(inputs.currentAge);
        const tAge = parseInt(inputs.targetAge);
        const savings = getNumericValue('currentSavings');
        const invest = getNumericValue('monthlyInvest');
        const exp = getNumericValue('monthlyExp');
        const rPre = getNumericValue('returnPre');
        const rPost = getNumericValue('returnPost');
        const inf = getNumericValue('inflation');

        if (tAge > cAge && exp > 0) {
            const res = calculateFIRE(cAge, tAge, savings, invest, exp, rPre, rPost, inf);
            setResults(res);

            // Generate Insights
            const insightsList = [];
            if (res.isSafe) {
                insightsList.push({
                    title: 'Financial Freedom Status',
                    text: `Your plan is sustainable! Your projected corpus of ${formatCurrency(res.fireNumber)} can support your inflation-adjusted lifestyle indefinitely at a 3% withdrawal rate.`,
                    icon: '🌟'
                });
            } else {
                insightsList.push({
                    title: 'Shortfall Detected',
                    text: `Your target corpus might not be enough. At age ${tAge}, you'll need ${formatCurrency(res.expenseAtRetirement)} monthly. To fix this, consider increasing your SIP by 15% or working 3 years longer.`,
                    icon: '📉'
                });
            }

            if (res.isBroke) {
                insightsList.push({
                    title: 'Corpus Depletion Warning',
                    text: `Careful! At your current withdrawal rate, your money might run out at age ${res.brokeAge}. Increasing your post-retirement return by just 1% could add 10+ years to your corpus legacy.`,
                    icon: '🛑'
                });
            } else {
                insightsList.push({
                    title: 'Generational Wealth',
                    text: `Great news! Your corpus continues to grow or remain stable even after retirement. You are on track to leave a significant financial legacy.`,
                    icon: '🏦'
                });
            }

            setInsights(insightsList);
        } else {
            setResults(null);
            setInsights([]);
        }
    }, [inputs, symbol]);

    const chartData = results ? {
        labels: results.timeline.map(d => `Age ${d.age}`),
        datasets: [
            {
                label: 'Corpus Value',
                data: results.timeline.map(d => d.corpus),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
            },
            {
                label: 'Monthly Expenses',
                data: results.timeline.map(d => d.expenses * 12), // Annualized for comparison scale
                borderColor: '#f43f5e',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0,
            }
        ]
    } : null;

    return (
        <div className="calculator-page fire-calculator">
            <SEOHead
                title="FIRE Calculator India – Retire Early Planner | FinanceCalc"
                description="Calculate your FIRE Number and retirement date. Advanced planner accounting for Indian inflation, multi-stage returns and life expectancy."
                canonical="/fire-calculator"
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>FIRE Calculator</span></nav>
            <section className="calculator-hero">
                <h1>FIRE Calculator</h1>
                <p className="hero-subtitle">Find your number for Financial Independence and Early Retirement.</p>
            </section>

            <form className="calculator-form" noValidate>
                <div className="form-grid">
                    <ValidatedInput name="currentAge" label="Current Age" value={inputs.currentAge} onChange={handleChange} onBlur={handleBlur} error={errors.currentAge} touched={touched.currentAge} />
                    <ValidatedInput name="targetAge" label="Target Retirement Age" value={inputs.targetAge} onChange={handleChange} onBlur={handleBlur} error={errors.targetAge} touched={touched.targetAge} />
                    <ValidatedInput name="currentSavings" label="Existing Savings" value={inputs.currentSavings} onChange={handleChange} onBlur={handleBlur} error={errors.currentSavings} touched={touched.currentSavings} prefix={symbol} />
                    <ValidatedInput name="monthlyInvest" label="Current Monthly SIP" value={inputs.monthlyInvest} onChange={handleChange} onBlur={handleBlur} error={errors.monthlyInvest} touched={touched.monthlyInvest} prefix={symbol} />
                    <ValidatedInput name="monthlyExp" label="Current Monthly Expenses" value={inputs.monthlyExp} onChange={handleChange} onBlur={handleBlur} error={errors.monthlyExp} touched={touched.monthlyExp} prefix={symbol} />
                    <ValidatedInput name="returnPre" label="Expected Return (Accumulation %)" value={inputs.returnPre} onChange={handleChange} onBlur={handleBlur} error={errors.returnPre} touched={touched.returnPre} suffix="%" />
                    <ValidatedInput name="returnPost" label="Expected Return (Retirement %)" value={inputs.returnPost} onChange={handleChange} onBlur={handleBlur} error={errors.returnPost} touched={touched.returnPost} suffix="%" />
                    <ValidatedInput name="inflation" label="Expected Inflation (%)" value={inputs.inflation} onChange={handleChange} onBlur={handleBlur} error={errors.inflation} touched={touched.inflation} suffix="%" />
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Simulating your financial future... results update instantly.
                </div>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card highlight">
                            <div className="result-label">FIRE Number (at age {inputs.targetAge})</div>
                            <div className="result-value">{formatCurrency(results.fireNumber)}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Expenses at Retirement</div>
                            <div className="result-value small">{formatCurrency(results.expenseAtRetirement)} /mo</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Status</div>
                            <div className="result-value small" style={{ color: results.isSafe ? '#10b981' : '#f59e0b' }}>
                                {results.isSafe ? 'Sustainable Plan' : 'Needs Adjustment'}
                            </div>
                        </div>
                    </div>

                    <div className="smart-insights" style={{ marginTop: '2.5rem' }}>
                        <h3 style={{ marginBottom: '1.25rem' }}>💡 FIRE Strategy Insights</h3>
                        <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                            {insights.map((insight, idx) => (
                                <div key={idx} className="insight-card" style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                                    <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {insight.icon} {insight.title}
                                    </h4>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{insight.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chart-section" style={{ marginTop: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                            <h3>Corpus Projection (Accumulation & Growth)</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Solid line = Corpus | Dashed = Annual Expenses</span>
                        </div>
                        <div className="chart-container" style={{ height: 400 }}>
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: { ticks: { callback: v => formatCurrency(v) } }
                                    },
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {results.isBroke && (
                        <div className="alert-banner" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)', color: '#f43f5e' }}>
                            <h4 style={{ marginBottom: '0.5rem' }}>⚠️ Critical Alert: Retirement Shortfall</h4>
                            <p style={{ fontSize: '0.9rem' }}>At your current saving and expense rates, your retirement fund will be fully exhausted by age <strong>{results.brokeAge}</strong>. Consider lowering your retirement lifestyle expectations or increasing your accumulation SIP.</p>
                        </div>
                    )}

                    <div className="actions-bar" style={{ marginTop: '3rem' }}>
                        <ShareButton title="My FIRE Plan" text={`I'm on track to reach Financial Independence at age ${inputs.targetAge} with a corpus of ${formatCurrency(results.fireNumber)}! Check your FIRE number on FinanceCalc.`} />
                    </div>

                    <div className="data-table-wrapper" style={{ marginTop: '3rem' }}>
                        <h3>Strategic Roadmap</h3>
                        <div className="data-table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr><th>Age</th><th>Projected Corpus</th><th>Monthly Expenses</th><th>Phase</th></tr>
                                </thead>
                                <tbody>
                                    {results.timeline.filter((_, i) => i % 2 === 0 || i === results.timeline.length - 1).map(d => (
                                        <tr key={d.age} style={{ opacity: d.phase === 'Retirement' ? 0.8 : 1 }}>
                                            <td> {d.age} yrs</td>
                                            <td style={{ fontWeight: 600 }}>{formatCurrency(d.corpus)}</td>
                                            <td style={{ color: d.phase === 'Retirement' ? '#f43f5e' : 'inherit' }}>{formatCurrency(d.expenses)}</td>
                                            <td>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.7rem',
                                                    background: d.phase === 'Accumulation' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                                    color: d.phase === 'Accumulation' ? '#10b981' : '#6366f1'
                                                }}>
                                                    {d.phase}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/fire-calculator" />
        </div>
    );
}
