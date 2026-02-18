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
import { calculateMortgage } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const faqs = [
    { question: 'What is a Mortgage?', answer: 'A mortgage is a loan used to purchase or maintain a home, land, or other types of real estate. The borrower agrees to pay the lender over time, typically in a series of regular payments that are divided into principal and interest.' },
    { question: 'How is a mortgage payment calculated?', answer: 'Your monthly mortgage payment is usually composed of Principal, Interest, Taxes, and Insurance (PITI). If your down payment is less than 20%, you may also have to pay Private Mortgage Insurance (PMI).' },
    { question: 'What is the 20% rule for down payments?', answer: 'While many loans allow for lower down payments, putting down 20% of the home price typically allows you to avoid paying Private Mortgage Insurance (PMI) and can secure better interest rates.' },
    { question: 'What are Property Taxes and Home Insurance?', answer: 'Property taxes are assessed by your local government to fund public services. Home insurance protects your property against damage. Both are often paid monthly as part of your mortgage payment through an escrow account.' },
    { question: 'What is PMI?', answer: 'Private Mortgage Insurance (PMI) is a type of insurance you might be required to pay for if you have a conventional loan and make a down payment of less than 20% of the home\'s purchase price.' },
];

const validationRules = {
    homePrice: { label: 'Home Price', min: 10000, max: 100000000, required: true },
    downPayment: { label: 'Down Payment', min: 0, max: 100000000, required: true },
    rate: { label: 'Interest Rate', min: 0.1, max: 30, allowDecimal: true, required: true },
    years: { label: 'Loan Term (Years)', min: 1, max: 40, allowDecimal: false, required: true },
    propertyTaxRate: { label: 'Property Tax Rate', min: 0, max: 10, allowDecimal: true, required: true },
    insurance: { label: 'Annual Insurance', min: 0, max: 100000, required: true },
};

export default function MortgageCalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, getNumericValue } = useValidatedInputs(
        { homePrice: '400000', downPayment: '80000', rate: '6.5', years: '30', propertyTaxRate: '1.2', insurance: '1200' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        const homePrice = getNumericValue('homePrice');
        const downPayment = getNumericValue('downPayment');
        const rate = getNumericValue('rate');
        const years = parseInt(inputs.years);
        const taxRate = getNumericValue('propertyTaxRate');
        const insurance = getNumericValue('insurance');

        if (homePrice > 0 && rate > 0 && years > 0) {
            const res = calculateMortgage(homePrice, downPayment, rate, years, taxRate, insurance, 0.5);
            setResults(res);
        } else {
            setResults(null);
        }
    }, [inputs, symbol]);

    const doughnutData = results ? {
        labels: ['P&I', 'Taxes', 'Insurance', 'PMI'],
        datasets: [{
            data: [results.monthlyPI, results.monthlyTax, results.monthlyInsurance, results.monthlyPMI].filter(v => v > 0),
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
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
                title="Mortgage Calculator USA – Monthly Payment & Amortization | FinanceCalc"
                description="Calculate your USA mortgage monthly payment including taxes, insurance, and PMI. Get a full amortization schedule and see how much you can afford."
                canonical="/mortgage-calculator"
                faqSchema={faqs}
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Mortgage Calculator USA</span></nav>
            <section className="calculator-hero">
                <h1>Mortgage Calculator USA</h1>
                <div className="last-updated-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Last updated: Feb 2026 — US Real Estate Standards.
                </div>
                <p className="hero-subtitle">Estimate your monthly mortgage payments with taxes, insurance, and interest breakdown.</p>
            </section>

            <form className="calculator-form" noValidate>
                <div className="form-grid">
                    <ValidatedInput name="homePrice" label="Home Price" value={inputs.homePrice} onChange={handleChange} onBlur={handleBlur} error={errors.homePrice} touched={touched.homePrice} prefix={symbol} />
                    <ValidatedInput name="downPayment" label="Down Payment" value={inputs.downPayment} onChange={handleChange} onBlur={handleBlur} error={errors.downPayment} touched={touched.downPayment} prefix={symbol} />
                    <ValidatedInput name="rate" label="Interest Rate (%)" value={inputs.rate} onChange={handleChange} onBlur={handleBlur} error={errors.rate} touched={touched.rate} suffix="%" />
                    <ValidatedInput name="years" label="Loan Term (Years)" value={inputs.years} onChange={handleChange} onBlur={handleBlur} error={errors.years} touched={touched.years} suffix="yrs" />
                    <ValidatedInput name="propertyTaxRate" label="Tax Rate (Annual %)" value={inputs.propertyTaxRate} onChange={handleChange} onBlur={handleBlur} error={errors.propertyTaxRate} touched={touched.propertyTaxRate} suffix="%" />
                    <ValidatedInput name="insurance" label="Home Insurance (Annual)" value={inputs.insurance} onChange={handleChange} onBlur={handleBlur} error={errors.insurance} touched={touched.insurance} prefix={symbol} />
                </div>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card highlight">
                            <div className="result-label">Total Monthly Payment</div>
                            <div className="result-value">{formatCurrency(results.totalMonthlyPayment)}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Principal & Interest</div>
                            <div className="result-value small">{formatCurrency(results.monthlyPI)}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Total Interest</div>
                            <div className="result-value small" style={{ color: '#ef4444' }}>{formatCurrency(results.totalInterest)}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Total Cost of Loan</div>
                            <div className="result-value small">{formatCurrency(results.totalCost)}</div>
                        </div>
                    </div>

                    <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                        <div>
                            <h3>Payment Breakdown (PITI)</h3>
                            <div style={{ maxWidth: 280, margin: '0 auto' }}>
                                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                            </div>
                            <div className="breakdown-list" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-primary)' }}>
                                    <span>Principal & Interest</span>
                                    <strong>{formatCurrency(results.monthlyPI)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-primary)' }}>
                                    <span>Property Taxes</span>
                                    <strong>{formatCurrency(results.monthlyTax)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-primary)' }}>
                                    <span>Home Insurance</span>
                                    <strong>{formatCurrency(results.monthlyInsurance)}</strong>
                                </div>
                                {results.monthlyPMI > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#f59e0b' }}>
                                        <span>PMI (Under 20% Down)</span>
                                        <strong>{formatCurrency(results.monthlyPMI)}</strong>
                                    </div>
                                )}
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

            <section className="seo-content" id="seo">
                <div className="container">
                    <h2>Understanding Your Mortgage Payment in the USA</h2>
                    <p>Buying a home is one of the most significant financial decisions you'll ever make. Understanding how your monthly payment is calculated is key to ensuring you can afford your home long-term. In the USA, a mortgage payment is typically more than just the repayment of the loan; it includes taxes and insurance as well.</p>

                    <h3>What makes up a Monthly Mortgage Payment? (PITI)</h3>
                    <p>PITI stands for Principal, Interest, Taxes, and Insurance. These are the four main components of a monthly mortgage payment:</p>
                    <ul>
                        <li><strong>Principal:</strong> The portion of the payment that goes toward paying down the actual balance of the loan.</li>
                        <li><strong>Interest:</strong> The cost of borrowing the money, paid to the lender.</li>
                        <li><strong>Taxes:</strong> Real estate or property taxes charged by your local government.</li>
                        <li><strong>Insurance:</strong> Homeowners insurance to protect the property, and potentially Private Mortgage Insurance (PMI) if your down payment was less than 20%.</li>
                    </ul>

                    <h3>The Importance of Down Payment</h3>
                    <p>Your down payment significantly impacts your monthly costs. A larger down payment reduces the loan amount (principal), which in turn reduces the interest paid over the life of the loan. Furthermore, if you put down 20% or more on a conventional loan, you avoid PMI, which can save you hundreds of dollars every month.</p>

                    <h3>Fixed-Rate vs. ARM</h3>
                    <p>The most common mortgage in the US is the <strong>30-year fixed-rate mortgage</strong>. This provides stability as your interest rate never changes. Alternatively, an Adjustable-Rate Mortgage (ARM) might offer a lower initial rate but can increase or decrease after a certain period, potentially making your payments unpredictable.</p>
                </div>
            </section>

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/mortgage-calculator" />
        </div>
    );
}
