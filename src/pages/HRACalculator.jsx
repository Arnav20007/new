import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, Title
} from 'chart.js';
import SEOHead from '../components/common/SEOHead';
import FAQSection from '../components/common/FAQSection';
import TryNextCalculator from '../components/common/TryNextCalculator';
import ValidatedInput from '../components/common/ValidatedInput';
import PrivacyBadge from '../components/common/PrivacyBadge';
import ShareButton from '../components/common/ShareButton';
import { useCurrency } from '../context/CurrencyContext';
import { calculateHRA } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const faqs = [
    { question: 'What is HRA exemption?', answer: 'House Rent Allowance (HRA) is a portion of your salary provided by your employer for expenses related to rented accommodation. The Income Tax Act allows you to exempt a part of this from taxable income under Section 10(13A).' },
    { question: 'How is HRA exemption calculated?', answer: 'Exemption is the minimum of: 1) Actual HRA received, 2) 50% of salary (basic + DA) for metros or 40% for non-metros, 3) Actual rent paid minus 10% of salary.' },
    { question: 'Which cities are considered Metros for HRA?', answer: 'For tax purposes, only Delhi, Mumbai, Kolkata, and Chennai are considered Metro cities (50% rule). All other cities follow the 40% rule.' },
    { question: 'Can I claim HRA if I live in my own house?', answer: 'No, HRA exemption can only be claimed if you are actually paying rent for your accommodation.' },
    { question: 'Do I need rent receipts for HRA?', answer: 'Yes, employers usually require rent receipts to provide the exemption. If annual rent exceeds ₹1 lakh, you must also provide the PAN of your landlord.' },
];

const validationRules = {
    basicSalary: { label: 'Monthly Basic Salary', min: 0, max: 1000000, required: true },
    da: { label: 'Monthly DA', min: 0, max: 1000000, required: false },
    hraReceived: { label: 'Monthly HRA Received', min: 0, max: 1000000, required: true },
    rentPaid: { label: 'Monthly Rent Paid', min: 0, max: 1000000, required: true },
};

export default function HRACalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const [isMetro, setIsMetro] = useState(true);
    const { values: inputs, errors, touched, handleChange, handleBlur, validateAll, getNumericValue } = useValidatedInputs(
        { basicSalary: '50000', da: '0', hraReceived: '20000', rentPaid: '15000' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const resultsRef = useRef(null);

    // Instant Calculation Logic
    useEffect(() => {
        const salary = getNumericValue('basicSalary');
        const hra = getNumericValue('hraReceived');
        const rent = getNumericValue('rentPaid');
        const da = getNumericValue('da');

        if (salary > 0 && hra > 0 && rent > 0) {
            const res = calculateHRA(salary, da, hra, rent, isMetro);
            setResults(res);
        } else {
            setResults(null);
        }
    }, [inputs, isMetro, symbol]);

    const doughnutData = results ? {
        labels: ['Tax Exempt HRA', 'Taxable HRA'],
        datasets: [{
            data: [results.monthlyExempt, results.monthlyTaxable],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="HRA Calculator India – Rent Allowance Tax Exemption | FinanceCalc"
                description="Check your HRA tax exemption eligibility for FY 2024-25. Accurate HRA calculator for Metro and Non-Metro cities based on Indian Income Tax rules."
                canonical="/hra-calculator"
                faqSchema={faqs}
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>HRA Calculator</span></nav>
            <section className="calculator-hero">
                <h1>HRA Calculator</h1>
                <div className="last-updated-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Last updated: Feb 2026 — based on latest IT Rules India.
                </div>
                <p className="hero-subtitle">Calculate your tax-exempt House Rent Allowance (HRA) and maximize your tax savings.</p>
            </section>

            <form className="calculator-form" noValidate>
                <div className="calculation-type-toggle" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.375rem', borderRadius: ' var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                    <button type="button"
                        className={`toggle-btn ${isMetro ? 'active' : ''}`}
                        onClick={() => setIsMetro(true)}
                        style={{ flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.2s', border: 'none', cursor: 'pointer', background: isMetro ? 'var(--gradient-primary)' : 'transparent', color: isMetro ? 'white' : 'var(--text-secondary)' }}
                    >
                        Metro City (50%)
                    </button>
                    <button type="button"
                        className={`toggle-btn ${!isMetro ? 'active' : ''}`}
                        onClick={() => setIsMetro(false)}
                        style={{ flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.2s', border: 'none', cursor: 'pointer', background: !isMetro ? 'var(--gradient-primary)' : 'transparent', color: !isMetro ? 'white' : 'var(--text-secondary)' }}
                    >
                        Non-Metro City (40%)
                    </button>
                </div>

                <div className="form-grid">
                    <ValidatedInput name="basicSalary" label="Monthly Basic Salary" value={inputs.basicSalary} onChange={handleChange} onBlur={handleBlur} error={errors.basicSalary} touched={touched.basicSalary} prefix={symbol} />
                    <ValidatedInput name="da" label="Monthly DA (if any)" value={inputs.da} onChange={handleChange} onBlur={handleBlur} error={errors.da} touched={touched.da} prefix={symbol} />
                    <ValidatedInput name="hraReceived" label="Monthly HRA Received" value={inputs.hraReceived} onChange={handleChange} onBlur={handleBlur} error={errors.hraReceived} touched={touched.hraReceived} prefix={symbol} />
                    <ValidatedInput name="rentPaid" label="Monthly Rent Paid" value={inputs.rentPaid} onChange={handleChange} onBlur={handleBlur} error={errors.rentPaid} touched={touched.rentPaid} prefix={symbol} />
                </div>

                <div style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Calculation based on Rule 2A of IT Rules - results update instantly.
                </div>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card highlight"><div className="result-label">Annual Exempt HRA</div><div className="result-value">{formatCurrency(results.annualExempt)}</div></div>
                        <div className="result-card"><div className="result-label">Annual Taxable HRA</div><div className="result-value small" style={{ color: '#ef4444' }}>{formatCurrency(results.annualTaxable)}</div></div>
                        <div className="result-card"><div className="result-label">Monthly Exemption</div><div className="result-value small" style={{ color: '#10b981' }}>{formatCurrency(results.monthlyExempt)}</div></div>
                    </div>

                    <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <h3>HRA Breakdown</h3>
                            <div style={{ maxWidth: 280, margin: '0 auto' }}><Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} /></div>
                        </div>
                        <div className="data-table-wrapper">
                            <h3>Summary</h3>
                            <table className="data-table">
                                <tbody>
                                    <tr><td>Total HRA Received (Annual)</td><td style={{ textAlign: 'right' }}>{formatCurrency(results.hraReceivedAnnual)}</td></tr>
                                    <tr style={{ color: '#10b981', fontWeight: 600 }}><td>Exempt HRA (Annual)</td><td style={{ textAlign: 'right' }}>- {formatCurrency(results.annualExempt)}</td></tr>
                                    <tr style={{ borderTop: '2px solid var(--border-primary)', fontWeight: 800 }}><td>Taxable HRA (Annual)</td><td style={{ textAlign: 'right' }}>{formatCurrency(results.annualTaxable)}</td></tr>
                                </tbody>
                            </table>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>* Calculation based on Section 10(13A) of the Income Tax Act.</p>
                        </div>
                    </div>

                    <div className="actions-bar">
                        <ShareButton title="My HRA Exemption" text={`I'm saving ${formatCurrency(results.annualExempt)} on taxes through HRA! Check yours on FinanceCalc.`} />
                    </div>
                </div>
            )}

            <section className="seo-content" id="seo">
                <div className="container">
                    <h2>How HRA Tax Exemption is Calculated (Section 10(13A))</h2>
                    <p>House Rent Allowance (HRA) is one of the most effective tax-saving components for salaried individuals in India. Under **Section 10(13A)** of the Income Tax Act, you can claim an exemption on the rent you pay for your residential accommodation. This calculator simplifies the complex rules to give you the exact exempt and taxable portion of your HRA.</p>

                    <h3>The 3 Main Rules for HRA Exemption</h3>
                    <p>The Income Tax Department calculates HRA exemption based on the **minimum** of the following three amounts:</p>
                    <ul>
                        <li><strong>Actual HRA Received:</strong> The specific amount listed as HRA in your periodic salary slip.</li>
                        <li><strong>50% or 40% of Salary:</strong> Depending on your location. If you live in a Metro city (Delhi, Mumbai, Kolkata, Chennai), it's 50% of your salary (Basic + DA). For all other cities, it is 40%.</li>
                        <li><strong>Excess Rent Paid:</strong> The total rent paid by you minus 10% of your annual salary (Basic + DA).</li>
                    </ul>

                    <h3>Metro vs. Non-Metro: What counts?</h3>
                    <p>For tax purposes, the "Metro City" definition is very specific. Only the four major metropolitan areas—**New Delhi, Mumbai, Kolkata, and Chennai**—qualify for the 50% rule. Even if you live in high-growth cities like Bengaluru, Hyderabad, or Pune, you must follow the 40% rule for HRA calculation. Our calculator allows you to toggle this settings instantly.</p>

                    <h3>Documents Needed to Claim HRA</h3>
                    <p>While this calculator gives you the numbers, you will need the following to claim it legally with your employer or during ITR filing:</p>
                    <ul>
                        <li><strong>Rent Receipts:</strong> Signed receipts for each month or quarter.</li>
                        <li><strong>Rent Agreement:</strong> A valid legal contract between you and the landlord.</li>
                        <li><strong>Landlord's PAN:</strong> Mandatory if your annual rent exceeds ₹1,00,000.</li>
                        <li><strong>Payment Proof:</strong> Digital transaction history is preferred for high rent amounts.</li>
                    </ul>

                    <h3>Can I claim both HRA and Home Loan benefits?</h3>
                    <p>Yes, you can claim HRA exemption and Home Loan interest (Section 24) and principal (Section 80C) benefits simultaneously, provided you live in a rented house while owning a house in a different city or a house that is currently rented out. Tax planning in such cases requires careful documentation of your "ordinary place of residence."</p>
                </div>
            </section>

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/hra-calculator" />
        </div>
    );
}
