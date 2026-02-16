import { useState, useRef } from 'react';
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
    const resultsRef = useRef(null);

    const handleCalculate = (e) => {
        e.preventDefault();
        if (!validateAll()) return;
        const res = calculateEMI(getNumericValue('principal'), getNumericValue('rate'), parseInt(inputs.years));
        setResults(res);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

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
                title="EMI Calculator — Calculate Home, Personal & Car Loan EMI"
                description="Use our free EMI calculator to find your monthly loan payments, total interest, and complete repayment schedule."
                canonical="/emi-calculator"
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>EMI Calculator</span></nav>
            <section className="calculator-hero">
                <h1>EMI Calculator</h1>
                <p className="hero-subtitle">Instantly calculate your monthly loan repayments and total interest cost.</p>
            </section>

            <form className="calculator-form" onSubmit={handleCalculate} noValidate>
                <div className="form-grid">
                    <ValidatedInput name="principal" label="Loan Amount" value={inputs.principal} onChange={handleChange} onBlur={handleBlur} error={errors.principal} touched={touched.principal} prefix={symbol} />
                    <ValidatedInput name="rate" label="Interest Rate (%)" value={inputs.rate} onChange={handleChange} onBlur={handleBlur} error={errors.rate} touched={touched.rate} suffix="%" />
                    <ValidatedInput name="years" label="Tenure (Years)" value={inputs.years} onChange={handleChange} onBlur={handleBlur} error={errors.years} touched={touched.years} suffix="yrs" />
                </div>
                <button type="submit" className="btn-calculate">Calculate EMI</button>
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

                    <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <h3>Payment Breakdown</h3>
                            <Doughnut data={doughnutData} />
                        </div>
                        <div>
                            <h3>Amortization Structure</h3>
                            <div className="chart-container"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} /></div>
                        </div>
                    </div>

                    <div className="data-table-wrapper">
                        <h3>Annual Repayment Schedule</h3>
                        <table className="data-table">
                            <thead>
                                <tr><th>Year</th><th>Total Principal Paid</th><th>Total Interest Paid</th><th>Balance</th></tr>
                            </thead>
                            <tbody>
                                {results.schedule.map(d => (
                                    <tr key={d.year}>
                                        <td>Year {d.year}</td>
                                        <td>{formatCurrency(d.principalPaid)}</td>
                                        <td>{formatCurrency(d.interestPaid)}</td>
                                        <td>{formatCurrency(d.remainingBalance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/emi-calculator" />
        </div>
    );
}
