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
import { useCurrency } from '../context/CurrencyContext';
import { calculateCreditCardPayoff } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const faqs = [
    { question: 'Why is credit card debt so expensive?', answer: 'Credit cards have much higher interest rates (typically 15% to 35% APR) compared to other loans. Because interest is compounded daily or monthly, a small balance can grow very quickly if only minimum payments are made.' },
    { question: 'What is the "Minimum Payment Trap"?', answer: 'Minimum payments are designed to keep you in debt for as long as possible. They usually only cover the interest and a tiny fraction of the principal. If you only pay the minimum, it could take decades to pay off even a small balance.' },
    { question: 'Should I pay off my highest interest card first?', answer: 'Yes, this is known as the "Debt Avalanche" method. It saves you the most money in interest charges. However, some people prefer the "Snowball" method (smallest balance first) for the psychological win.' },
    { question: 'Can I negotiate my interest rate?', answer: 'Yes! If you have a good payment history, you can call your card issuer and ask for a lower APR. Even a 2-3% reduction can save you significant money over time.' },
    { question: 'What is a Balance Transfer?', answer: 'A balance transfer allows you to move debt from a high-interest card to a new card with a 0% introductory APR (usually for 12-18 months). This can be a great tool if used correctly to pay down the principal faster.' },
];

const validationRules = {
    balance: { label: 'Credit Card Balance', min: 100, max: 1000000, required: true },
    rate: { label: 'Annual Interest Rate (APR)', min: 1, max: 100, allowDecimal: true, required: true },
    monthlyPayment: { label: 'Monthly Payment', min: 10, max: 100000, required: true },
};

export default function CreditCardPayoffCalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, validateAll, getNumericValue } = useValidatedInputs(
        { balance: '5000', rate: '24', monthlyPayment: '250' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const resultsRef = useRef(null);

    const handleCalculate = (e) => {
        e.preventDefault();
        if (!validateAll()) return;
        const res = calculateCreditCardPayoff(getNumericValue('balance'), getNumericValue('rate'), getNumericValue('monthlyPayment'));
        setResults(res);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const lineChartData = results && !results.error ? {
        labels: results.schedule.filter((_, i) => i % 3 === 0 || i === results.schedule.length - 1).map(d => `Month ${d.month}`),
        datasets: [
            { label: 'Remaining Balance', data: results.schedule.filter((_, i) => i % 3 === 0 || i === results.schedule.length - 1).map(d => d.balance), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
        ],
    } : null;

    const doughnutData = results && !results.error ? {
        labels: ['Principal Balance', 'Total Interest'],
        datasets: [{
            data: [getNumericValue('balance'), results.totalInterest],
            backgroundColor: ['#3b82f6', '#ef4444'],
            borderWidth: 0,
        }]
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="Credit Card Payoff Calculator India | FinanceCalc"
                description="Plan your path to a zero balance and save on interest. Analyze your credit card debt payoff strategy with our accurate Indian finance tool."
                canonical="/credit-card-payoff-calculator"
                faqSchema={faqs}
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Credit Card Payoff Calculator</span></nav>
            <section className="calculator-hero">
                <h1>Credit Card Payoff Calculator</h1>
                <div className="last-updated-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Last updated: Feb 2026 — Escape the debt trap.
                </div>
                <p className="hero-subtitle">Escape the high-interest cycle and plan your path to becoming debt-free.</p>
            </section>

            <form className="calculator-form" onSubmit={handleCalculate} noValidate>
                <div className="form-grid">
                    <ValidatedInput name="balance" label="Current Balance" value={inputs.balance} onChange={handleChange} onBlur={handleBlur} error={errors.balance} touched={touched.balance} prefix={symbol} />
                    <ValidatedInput name="rate" label="Interest Rate (APR %)" value={inputs.rate} onChange={handleChange} onBlur={handleBlur} error={errors.rate} touched={touched.rate} suffix="%" />
                    <ValidatedInput name="monthlyPayment" label="Monthly Payment" value={inputs.monthlyPayment} onChange={handleChange} onBlur={handleBlur} error={errors.monthlyPayment} touched={touched.monthlyPayment} prefix={symbol} />
                </div>
                <button type="submit" className="btn-calculate">Analyze Payoff Strategy</button>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    {results.error ? (
                        <div className="error-box">{results.error}</div>
                    ) : (
                        <>
                            <div className="results-summary">
                                <div className="result-card highlight">
                                    <div className="result-label">Time to Pay Off</div>
                                    <div className="result-value">{results.totalMonths} <span style={{ fontSize: '1rem' }}>Months</span></div>
                                </div>
                                <div className="result-card">
                                    <div className="result-label">Total Interest Paid</div>
                                    <div className="result-value small" style={{ color: '#ef4444' }}>{formatCurrency(results.totalInterest)}</div>
                                </div>
                                <div className="result-card">
                                    <div className="result-label">Total Payback</div>
                                    <div className="result-value small">{formatCurrency(results.totalPayments)}</div>
                                </div>
                            </div>

                            <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                                <div>
                                    <h3>Payoff Progress</h3>
                                    <div className="chart-container"><Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                                </div>
                                <div>
                                    <h3>Interest vs Principal</h3>
                                    <Doughnut data={doughnutData} />
                                </div>
                            </div>

                            <div className="data-table-wrapper">
                                <h3>Monthly Payoff Schedule</h3>
                                <table className="data-table">
                                    <thead>
                                        <tr><th>Month</th><th>Payment</th><th>Interest</th><th>Principal</th><th>Balance</th></tr>
                                    </thead>
                                    <tbody>
                                        {results.schedule.slice(0, 12).map(d => (
                                            <tr key={d.month}>
                                                <td>Month {d.month}</td>
                                                <td>{formatCurrency(d.payment)}</td>
                                                <td>{formatCurrency(d.interest)}</td>
                                                <td>{formatCurrency(d.principal)}</td>
                                                <td>{formatCurrency(d.balance)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {results.schedule.length > 12 && <p className="table-note">+ {results.schedule.length - 12} more months until debt-free.</p>}
                            </div>
                        </>
                    )}
                </div>
            )}

            <section className="seo-content" id="seo">
                <div className="container">
                    <h2>Mastering Credit Card Debt: How to Pay it Off Fast</h2>
                    <p>Credit card debt is one of the most expensive forms of borrowing in India, with interest rates (APR) often ranging from **36% to 48% per annum**. Because credit card interest compounds monthly (and sometimes daily), even a small balance can balloon into an unmanageable sum if you only make minimum payments. Our Credit Card Payoff Calculator is designed to help you visualize your path to freedom.</p>

                    <h3>The Dangers of the "Minimum Payment Trap"</h3>
                    <p>Financial institutions calculate minimum payments to be as low as possible—usually just enough to cover the interest plus 1% of the principal. This ensures that you stay in debt for the longest possible time, maximizing the bank's profit. For instance, if you have a balance of ₹1,00,000 at 42% APR, making only minimum payments could take you **over 25 years** to pay off, and you'll end up paying many times the original amount in interest alone.</p>

                    <h3>Proven Strategies for Debt Reduction</h3>
                    <ul>
                        <li><strong>The Debt Avalanche:</strong> Focus all your extra cash on the card with the highest interest rate while paying minimums on the others. This is mathematically the fastest way to become debt-free.</li>
                        <li><strong>The Debt Snowball:</strong> Pay off the smallest balance first to get a psychological "win," then roll that payment into the next smallest. This keeps you motivated.</li>
                        <li><strong>Balance Transfer:</strong> If you have good credit, move your high-interest balance to a card with a 0% introductory APR for 12-18 months. Note that there is usually a 3-5% transfer fee.</li>
                        <li><strong>Personal Loan Consolidation:</strong> Take a personal loan at a lower rate (e.g., 12-15%) to pay off credit cards (36-42%). Success here requires you to **not charge anything new** on the cleared cards.</li>
                    </ul>

                    <h3>Impact on Credit Score (CIBIL)</h3>
                    <p>Your "Credit Utilization Ratio"—the amount of credit you use vs. your total limit—is a major factor in your CIBIL score. Keeping your utilization below **30%** is essential for a healthy score. As you use our calculator to pay down your balances, you'll see your utilization drop, which can significantly boost your eligibility for home or car loans in the future.</p>

                    <h3>Practical Tips for Success</h3>
                    <ol>
                        <li><strong>Stop Using the Cards:</strong> While paying off debt, switch to a debit card or cash to prevent adding "fuel to the fire."</li>
                        <li><strong>Automate Your Payments:</strong> Set up a fixed monthly transfer above the minimum to ensure consistent progress.</li>
                        <li><strong>Renegotiate Your Rate:</strong> Call your bank and ask for an interest rate reduction. They might agree if you've been a loyal customer with on-time payments.</li>
                    </ol>
                </div>
            </section>

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/credit-card-payoff-calculator" />
        </div>
    );
}
