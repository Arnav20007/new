import { useState, useRef } from 'react';
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
    const { formatCurrency } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, validateAll, getNumericValue } = useValidatedInputs(
        { annualIncome: '1200000' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const resultsRef = useRef(null);

    const handleCalculate = (e) => {
        e.preventDefault();
        if (!validateAll()) return;
        const res = calculateIndiaTax(getNumericValue('annualIncome'));
        setResults(res);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

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
                title="India Income Tax Calculator FY 2024-25 (AY 2025-26)"
                description="Free India Income Tax calculator for New Regime FY 2024-25. Calculate your tax liability, rebate, and take-home salary instantly."
                canonical="/india-tax-calculator"
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>India Tax Calculator</span></nav>
            <section className="calculator-hero">
                <h1>Income Tax Calculator (India)</h1>
                <p className="hero-subtitle">Calculate your tax liability under the New Tax Regime for FY 2024-25 (AY 2025-26).</p>
            </section>

            <form className="calculator-form" onSubmit={handleCalculate} noValidate>
                <div className="form-grid">
                    <ValidatedInput name="annualIncome" label="Gross Annual Salary" value={inputs.annualIncome} onChange={handleChange} onBlur={handleBlur} error={errors.annualIncome} touched={touched.annualIncome} prefix="₹" className="full-width" />
                </div>
                <button type="submit" className="btn-calculate">Calculate Tax</button>
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

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/india-tax-calculator" />
        </div>
    );
}
