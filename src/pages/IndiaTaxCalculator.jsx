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
import AuthorSources from '../components/common/AuthorSources';
import { useCurrency } from '../context/CurrencyContext';
import { calculateIndiaTax } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const faqs = [
    { question: 'What is the New Tax Regime?', answer: 'The New Tax Regime is a simplified tax structure with lower tax rates but fewer deductions. From FY 2023-24 (AY 2024-25) onwards, it is the default tax regime in India.' },
    { question: 'Is there a standard deduction in the New Regime?', answer: 'Yes, for FY 2024-25, a standard deduction of ₹75,000 is available for salaried employees and pensioners under the New Regime (increased from ₹50,000).' },
    { question: 'At what income is tax zero in India?', answer: 'Under the New Regime (FY 2024-25), there is no tax if your taxable income (after standard deduction) is up to ₹7,00,000 due to the rebate under Section 87A.' },
    { question: 'What are the New Tax Slabs for 2024-25?', answer: 'Slalbs are: 0-3L (Nil), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), and Above 15L (30%).' },
    { question: 'Can I switch between Old and New regimes?', answer: 'Salaried individuals can choose between the Old and New regimes every year at the time of filing their returns. Those with business income can only switch once in a lifetime.' },
];

const validationRules = {
    annualIncome: { label: 'Gross Annual Income', min: 100000, max: 100000000, required: true },
};

export default function IndiaTaxCalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, validateAll, getNumericValue } = useValidatedInputs(
        { annualIncome: '1200000' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const resultsRef = useRef(null);

    // Instant Calculation Logic
    useEffect(() => {
        const income = getNumericValue('annualIncome');
        if (income >= 100000) {
            const res = calculateIndiaTax(income);
            setResults(res);
        } else {
            setResults(null);
        }
    }, [inputs, symbol]);

    const doughnutData = results ? {
        labels: ['Take Home Salary', 'Total Tax (incl. Cess)'],
        datasets: [{
            data: [results.takeHome, results.totalTax],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0,
        }]
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="India Income Tax Calculator 2024-25 & 2025-26 | FinanceCalc"
                description="Calculate your tax liability under the New and Old Tax Regimes for FY 2024-25 (AY 2025-26) with our accurate India Tax Calculator."
                canonical="/india-tax-calculator"
                faqSchema={faqs}
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>India Tax Calculator</span></nav>
            <section className="calculator-hero">
                <h1>Income Tax Calculator (India)</h1>
                <div className="last-updated-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — based on latest Indian tax rules.
                </div>
                <p className="hero-subtitle">Calculate your tax liability under the New Tax Regime for FY 2024-25 (AY 2025-26).</p>
            </section>

            <form className="calculator-form" noValidate>
                <div className="form-grid">
                    <ValidatedInput name="annualIncome" label="Gross Annual Salary" value={inputs.annualIncome} onChange={handleChange} onBlur={handleBlur} error={errors.annualIncome} touched={touched.annualIncome} prefix="₹" className="full-width" />
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Tax computed instantly based on latest 2024-25 budget rules.
                </div>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card highlight">
                            <div className="result-label">Total Tax Payable</div>
                            <div className="result-value" style={{ color: results.totalTax > 0 ? '#ef4444' : '#10b981' }}>₹{results.totalTax.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Monthly Take-Home</div>
                            <div className="result-value small">₹{Math.round(results.takeHome / 12).toLocaleString('en-IN')}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Effective Tax Rate</div>
                            <div className="result-value small">{results.effectiveRate}%</div>
                        </div>
                    </div>

                    <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <h3>Salary vs Tax</h3>
                            <Doughnut data={doughnutData} />
                        </div>
                        <div className="data-table-wrapper">
                            <h3>Tax Breakdown</h3>
                            <table className="data-table">
                                <tbody>
                                    <tr><td>Gross Income</td><td>₹{getNumericValue('annualIncome').toLocaleString('en-IN')}</td></tr>
                                    <tr><td>Standard Deduction</td><td>- ₹75,000</td></tr>
                                    <tr><td>Taxable Income</td><td>₹{results.taxableIncome.toLocaleString('en-IN')}</td></tr>
                                    <tr style={{ fontWeight: 600 }}><td>Base Tax</td><td>₹{results.baseTax.toLocaleString('en-IN')}</td></tr>
                                    <tr><td>Health & Education Cess (4%)</td><td>₹{results.cess.toLocaleString('en-IN')}</td></tr>
                                    <tr style={{ background: 'rgba(16,185,129,0.05)', fontWeight: 700 }}><td>Annual Take Home</td><td>₹{results.takeHome.toLocaleString('en-IN')}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <section className="seo-content" id="seo">
                <div className="container">
                    <h2>How India Income Tax is Calculated (FY 2024-25)</h2>
                    <p>Under the new tax regime (declared as the default regime in Budget 2024), income tax calculation has been simplified with updated slabs and a higher standard deduction. Income up to ₹3 lakh is completely tax-free. For income between ₹3 lakh and ₹7 lakh, while tax is calculated at 5%, the <strong>Section 87A rebate</strong> ensures you pay zero tax if your total taxable income stays below the ₹7 lakh threshold (after deductions).</p>

                    <p>For salaried individuals, a <strong>Standard Deduction of ₹75,000</strong> is applicable for FY 2024-25 (AY 2025-26), which is deducted directly from your gross salary before applying the tax slabs. This calculator automatically applies this deduction to give you your net taxable income and final tax liability.</p>

                    <h3>Tax Slabs for FY 2024-25 (New Regime)</h3>
                    <ul>
                        <li><strong>Up to ₹3,00,000:</strong> Nil (No Tax)</li>
                        <li><strong>₹3,00,001 to ₹7,00,000:</strong> 5% (Rebate available up to ₹7L)</li>
                        <li><strong>₹7,00,001 to ₹10,00,000:</strong> 10%</li>
                        <li><strong>₹10,00,001 to ₹12,00,000:</strong> 15%</li>
                        <li><strong>₹12,00,001 to ₹15,00,000:</strong> 20%</li>
                        <li><strong>Above ₹15,00,000:</strong> 30%</li>
                    </ul>

                    <h3>Who should use this Income Tax Calculator?</h3>
                    <p>This tool is designed to provide instant clarity for a wide range of taxpayers in India:</p>
                    <ul>
                        <li><strong>Salaried Employees:</strong> Calculate your monthly take-home salary after tax and cess deductions.</li>
                        <li><strong>Freelancers & Professionals:</strong> Estimate your advance tax liability by projecting annual income.</li>
                        <li><strong>Business Owners:</strong> Understand the tax impact on your business drawings.</li>
                        <li><strong>Financial Planners:</strong> Plan investments by understanding the net post-tax income.</li>
                    </ul>

                    <h3>New vs Old Tax Regime: Which is better?</h3>
                    <p>While the New Tax Regime offers lower rates and higher thresholds, the Old Tax Regime allows you to claim deductions under Section 80C, 80D, and HRA. However, for most taxpayers with income up to ₹12 Lakhs who do not have massive investments, the <strong>New Tax Regime</strong> usually results in higher take-home pay due to the simplified structure.</p>
                </div>
            </section>

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/india-tax-calculator" />
            <AuthorSources />

        </div>
    );
}

