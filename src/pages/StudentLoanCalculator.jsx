import { useState, useRef, useEffect } from 'react';
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
import AuthorSources from '../components/common/AuthorSources';
import { calculateLoanPayoff } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const faqs = [
    { question: 'How do student loan interest rates work?', answer: 'Most federal student loans have fixed interest rates, meaning the rate stays the same for the life of the loan. Private student loans can have fixed or variable rates.' },
    { question: 'What is the "Standard Repayment Plan"?', answer: 'The Standard Repayment Plan for federal student loans is a 10-year term where you pay a fixed amount each month until the loan is paid off.' },
    { question: 'What are Income-Driven Repayment (IDR) plans?', answer: 'IDR plans set your monthly student loan payment at an amount that is intended to be affordable based on your income and family size.' },
    { question: 'Can I pay off my student loans early?', answer: 'Yes! There are no prepayment penalties for federal or most private student loans. Any extra amount you pay goes toward the principal, reducing the total interest you\'ll pay.' },
    { question: 'What is Student Loan Forgiveness?', answer: 'Programs like Public Service Loan Forgiveness (PSLF) can forgive the remaining balance of your federal student loans after you\'ve made a certain number of qualifying payments while working for a qualifying employer.' },
];

const validationRules = {
    balance: { label: 'Loan Balance', min: 1000, max: 1000000, required: true },
    rate: { label: 'Interest Rate (APR)', min: 1, max: 20, allowDecimal: true, required: true },
    monthlyPayment: { label: 'Monthly Payment', min: 50, max: 50000, required: true },
};

export default function StudentLoanCalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, getNumericValue } = useValidatedInputs(
        { balance: '37000', rate: '5.5', monthlyPayment: '400' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        const res = calculateLoanPayoff(getNumericValue('balance'), getNumericValue('rate'), getNumericValue('monthlyPayment'));
        if (!res.error) setResults(res);
        else setResults(null);
    }, [inputs, symbol]);

    const lineChartData = results ? {
        labels: results.schedule.filter((_, i) => i % 6 === 0 || i === results.schedule.length - 1).map(d => `Mo ${d.month}`),
        datasets: [
            { label: 'Remaining Balance', data: results.schedule.filter((_, i) => i % 6 === 0 || i === results.schedule.length - 1).map(d => d.balance), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 },
        ],
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="Student Loan Calculator Global – Federal Loan Repayment | FinanceCalc"
                description="Calculate your student loan monthly payments and see how fast you can pay off your debt. Includes amortization schedule and interest saving tips for US students."
                canonical="/student-loan-calculator"
                faqSchema={faqs}
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Student Loan Calculator Global</span></nav>
            <section className="calculator-hero">
                <h1>Student Loan Calculator Global</h1>
                <div className="last-updated-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — Federal Loan Data.
                </div>
                <p className="hero-subtitle">Plan your path to debt-free life and see how extra payments accelerate your student loan payoff.</p>
            </section>

            <form className="calculator-form" noValidate>
                <div className="form-grid">
                    <ValidatedInput name="balance" label="Current Loan Balance" value={inputs.balance} onChange={handleChange} onBlur={handleBlur} error={errors.balance} touched={touched.balance} prefix={symbol} />
                    <ValidatedInput name="rate" label="Interest Rate (APR %)" value={inputs.rate} onChange={handleChange} onBlur={handleBlur} error={errors.rate} touched={touched.rate} suffix="%" />
                    <ValidatedInput name="monthlyPayment" label="Monthly Payment" value={inputs.monthlyPayment} onChange={handleChange} onBlur={handleBlur} error={errors.monthlyPayment} touched={touched.monthlyPayment} prefix={symbol} />
                </div>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card highlight">
                            <div className="result-label">Time to Pay Off</div>
                            <div className="result-value">{results.totalYears} <span style={{ fontSize: '1rem' }}>Years</span></div>
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

                    <div className="chart-section" style={{ marginTop: '3rem' }}>
                        <h3>Payoff Timeline</h3>
                        <div className="chart-container" style={{ height: 350 }}>
                            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatCurrency(v) } } } }} />
                        </div>
                    </div>
                </div>
            )}

            <section className="seo-content">
                <div className="container">
                    <h2>Everything You Need to Know About Student Loan Repayment</h2>
                    <p>Student loans are a significant part of the financial landscape for millions of Global finance learners. Managing them effectively requires a clear understanding of your interest rates, repayment terms, and the impact of extra payments.</p>

                    <h3>Federal vs. Private Student Loans</h3>
                    <p>Federal student loans are funded by the government and often come with more flexible repayment options and protections. Private loans are made by banks or credit unions and their terms are dictated by the lender.</p>

                    <h3>How Extra Payments Help</h3>
                    <p>Most student loans use a simple daily interest formula. This means that any amount you pay above your minimum monthly payment goes directly toward the principal balance. By reducing the principal, you reduce the amount of interest that accrues every day, significantly shortening your repayment period and saving you thoGlobalnds of dollars.</p>
                </div>
            </section>

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/student-loan-calculator" />
            <AuthorSources />
        </div>
    );
}



