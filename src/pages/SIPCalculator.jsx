import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

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
    const resultsRef = useRef(null);

    const handleCalculate = (e) => {
        e.preventDefault();
        if (!validateAll()) return;
        const res = calculateSIP(getNumericValue('monthlyInvestment'), getNumericValue('annualRate'), parseInt(inputs.years));
        setResults(res);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const lineChartData = results ? {
        labels: results.yearlyData.map(d => `Year ${d.year}`),
        datasets: [
            { label: 'Total Value', data: results.yearlyData.map(d => d.maturityValue), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 },
            { label: 'Invested Amount', data: results.yearlyData.map(d => d.investment), borderColor: '#3b82f6', backgroundColor: 'transparent', fill: false, tension: 0.4, borderDash: [5, 5] },
        ],
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
                description="Estimate the future value of your Systematic Investment Plan (SIP) in mutual funds in India. Secure and accurate SIP planning."
                canonical="/sip-calculator"
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>SIP Calculator</span></nav>
            <section className="calculator-hero">
                <h1>SIP Calculator</h1>
                <p className="hero-subtitle">Plan your future wealth by estimating returns on your systematic investments.</p>
            </section>

            <form className="calculator-form" onSubmit={handleCalculate} noValidate>
                <div className="form-grid">
                    <ValidatedInput name="monthlyInvestment" label="Monthly Investment" value={inputs.monthlyInvestment} onChange={handleChange} onBlur={handleBlur} error={errors.monthlyInvestment} touched={touched.monthlyInvestment} prefix={symbol} />
                    <ValidatedInput name="annualRate" label="Expected Return Rate (p.a)" value={inputs.annualRate} onChange={handleChange} onBlur={handleBlur} error={errors.annualRate} touched={touched.annualRate} suffix="%" />
                    <ValidatedInput name="years" label="Time Period (Years)" value={inputs.years} onChange={handleChange} onBlur={handleBlur} error={errors.years} touched={touched.years} suffix="yrs" />
                </div>
                <button type="submit" className="btn-calculate">Calculate Returns</button>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card"><div className="result-label">Total Invested</div><div className="result-value small">{formatCurrency(results.totalInvested)}</div></div>
                        <div className="result-card highlight"><div className="result-label">Total Value</div><div className="result-value">{formatCurrency(results.totalValue)}</div></div>
                        <div className="result-card"><div className="result-label">Est. Returns</div><div className="result-value small" style={{ color: '#10b981' }}>+{formatCurrency(results.estReturns)}</div></div>
                    </div>

                    <div className="chart-section">
                        <h3>Investment Growth</h3>
                        <div className="chart-container"><Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                    </div>

                    <div className="chart-section">
                        <h3>Breakdown</h3>
                        <div style={{ maxWidth: 300, margin: '0 auto' }}><Doughnut data={doughnutData} /></div>
                    </div>

                    <div className="actions-bar">
                        <ShareButton title="My SIP Projection" text={`Investing ${formatCurrency(results.totalInvested / parseInt(inputs.years) / 12)} monthly for ${inputs.years} years could grow to ${formatCurrency(results.totalValue)}!`} />
                    </div>

                    <div className="data-table-wrapper">
                        <h3>Year-by-Year Breakdown</h3>
                        <table className="data-table">
                            <thead>
                                <tr><th>Year</th><th>Invested</th><th>Returns</th><th>Total Value</th></tr>
                            </thead>
                            <tbody>
                                {results.yearlyData.map(d => (
                                    <tr key={d.year}>
                                        <td>Year {d.year}</td>
                                        <td>{formatCurrency(d.investment)}</td>
                                        <td>{formatCurrency(d.wealthGained)}</td>
                                        <td>{formatCurrency(d.maturityValue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/sip-calculator" />
        </div>
    );
}
