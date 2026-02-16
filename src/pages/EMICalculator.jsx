import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import SEOHead from '../components/common/SEOHead';
import FAQSection from '../components/common/FAQSection';
import TryNextCalculator from '../components/common/TryNextCalculator';
import ValidatedInput from '../components/common/ValidatedInput';
import PrivacyBadge from '../components/common/PrivacyBadge';
import { useCurrency } from '../context/CurrencyContext';
import { calculateEMI } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const faqs = [
    { question: 'What is an EMI?', answer: 'EMI stands for Equated Monthly Installment. It is a fixed amount of money that a borrower pays to a lender at a specific date each month until the loan is fully repaid.' },
    { question: 'How is EMI calculated?', answer: 'The formula is: [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is the number of monthly installments.' },
    { question: 'What factors affect my EMI?', answer: 'The three main factors are the Loan Amount, Interest Rate, and Loan Tenure. Increasing any of the first two increases your EMI, while increasing tenure decreases the monthly EMI but increases the total interest paid.' },
    { question: 'Can I lower my EMI?', answer: 'You can lower your EMI by making a larger down payment, choosing a longer tenure, or negotiating for a lower interest rate with the lender.' },
    { question: 'Does a longer tenure save money?', answer: 'No. While a longer tenure reduces your monthly burden (EMI), it significantly increases the total interest cost over the life of the loan.' },
];

const validationRules = {
    principal: { label: 'Loan Amount', min: 10000, max: 100000000, required: true },
    rate: { label: 'Interest Rate', min: 1, max: 100, allowDecimal: true, required: true },
    years: { label: 'Tenure (Years)', min: 1, max: 40, allowDecimal: false, required: true },
};

export default function EMICalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, validateAll, getNumericValue } = useValidatedInputs(
        { principal: '1000000', rate: '8.5', years: '20' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const [insights, setInsights] = useState([]);
    const resultsRef = useRef(null);

    // Instant Calculation Logic
    useEffect(() => {
        const principal = getNumericValue('principal');
        const rate = getNumericValue('rate');
        const time = parseInt(inputs.years);

        if (principal > 0 && rate > 0 && time > 0) {
            const res = calculateEMI(principal, rate, time);
            setResults(res);

            // Generate Insights
            const shorterTime = Math.max(1, time - 5);
            const shorterRes = calculateEMI(principal, rate, shorterTime);
            const interestSaved = res.totalInterest - shorterRes.totalInterest;

            const extraPayment = res.emi * 0.1; // 10% extra per month
            // This is complex for a simple insight, let's keep it simpler: 
            // "By reducing tenure by 5 years, you save totalInterest"

            setInsights([
                {
                    title: 'Interest Saving Hack',
                    text: `By reducing your tenure to ${shorterTime} years, you would save ${formatCurrency(interestSaved)} in total interest! Your monthly EMI would increase by ${formatCurrency(shorterRes.emi - res.emi)}.`,
                    icon: '💰'
                },
                {
                    title: 'The Interest Trap',
                    text: `Your total interest (${formatCurrency(res.totalInterest)}) is ${(res.totalInterest / principal * 100).toFixed(0)}% of your loan amount. Consider making small prepayments to reduce this significantly.`,
                    icon: '⚠️'
                }
            ]);
        } else {
            setResults(null);
            setInsights([]);
        }
    }, [inputs, symbol]);

    const doughnutData = results ? {
        labels: ['Principal Loan Amount', 'Total Interest'],
        datasets: [{
            data: [getNumericValue('principal'), results.totalInterest],
            backgroundColor: ['#3b82f6', '#ef4444'],
            borderWidth: 0,
        }]
    } : null;

    const barData = results ? {
        labels: results.schedule.map(d => `Year ${d.year}`),
        datasets: [
            { label: 'Principal Paid', data: results.schedule.map(d => d.principalPaid), backgroundColor: '#3b82f6' },
            { label: 'Interest Paid', data: results.schedule.map(d => d.interestPaid), backgroundColor: '#ef4444' },
        ]
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="EMI Calculator India – Loan Planner | FinanceCalc"
                description="Calculate Home, Car, or Personal Loan EMI instantly. Includes amortization schedule, interest breakdown and smart loan insights."
                canonical="/emi-calculator"
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>EMI Calculator</span></nav>
            <section className="calculator-hero">
                <h1>EMI Calculator</h1>
                <p className="hero-subtitle">Plan your loans with instant EMI projections and interest-saving strategies.</p>
            </section>

            <form className="calculator-form" noValidate>
                <div className="form-grid">
                    <ValidatedInput name="principal" label="Loan Amount" value={inputs.principal} onChange={handleChange} onBlur={handleBlur} error={errors.principal} touched={touched.principal} prefix={symbol} />
                    <ValidatedInput name="rate" label="Interest Rate (%)" value={inputs.rate} onChange={handleChange} onBlur={handleBlur} error={errors.rate} touched={touched.rate} suffix="%" />
                    <ValidatedInput name="years" label="Tenure (Years)" value={inputs.years} onChange={handleChange} onBlur={handleBlur} error={errors.years} touched={touched.years} suffix="yrs" />
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Results update instantly as you change inputs.
                </div>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card highlight">
                            <div className="result-label">Monthly EMI</div>
                            <div className="result-value">{formatCurrency(results.emi)}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Total Interest</div>
                            <div className="result-value small" style={{ color: '#ef4444' }}>{formatCurrency(results.totalInterest)}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Total Payment</div>
                            <div className="result-value small">{formatCurrency(results.totalPayment)}</div>
                        </div>
                    </div>

                    {insights.length > 0 && (
                        <div className="smart-insights" style={{ marginTop: '2.5rem' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>💡 Smart Advisor</h3>
                            <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                {insights.map((insight, idx) => (
                                    <div key={idx} className="insight-card" style={{ background: 'var(--bg-glass)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                                        <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {insight.icon} {insight.title}
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{insight.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                        <div>
                            <h3>Payment Breakdown</h3>
                            <div style={{ maxWidth: 280, margin: '0 auto' }}>
                                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                            </div>
                        </div>
                        <div>
                            <h3>Loan Progression</h3>
                            <div className="chart-container" style={{ height: 300 }}>
                                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => formatCurrency(v) } } } }} />
                            </div>
                        </div>
                    </div>

                    <div className="data-table-wrapper" style={{ marginTop: '3rem' }}>
                        <h3>Annual Amortization Schedule</h3>
                        <div className="data-table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr><th>Year</th><th>Principal Paid</th><th>Interest Paid</th><th>Remaining Balance</th></tr>
                                </thead>
                                <tbody>
                                    {results.schedule.map(d => (
                                        <tr key={d.year}>
                                            <td>Year {d.year}</td>
                                            <td>{formatCurrency(d.principalPaid)}</td>
                                            <td style={{ color: '#ef4444' }}>{formatCurrency(d.interestPaid)}</td>
                                            <td>{formatCurrency(d.remainingBalance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/emi-calculator" />
        </div>
    );
}

