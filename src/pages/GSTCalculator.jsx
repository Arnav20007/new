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
import ShareButton from '../components/common/ShareButton';
import { useCurrency } from '../context/CurrencyContext';
import { calculateGST } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const faqs = [
    { question: 'What is GST?', answer: 'Goods and Services Tax (GST) is an indirect tax used in India on the supply of goods and services. It is a comprehensive, multi-stage, destination-based tax that has replaced many indirect taxes in India.' },
    { question: 'What are the current GST slabs in India?', answer: 'The primary GST slabs in India are 5%, 12%, 18%, and 28%. Some essential items are taxed at 0%, and gold is taxed at 3%.' },
    { question: 'What is the difference between GST inclusive and exclusive?', answer: 'GST Exclusive means the price of the product does not include the tax. GST Inclusive means the tax is already added to the final price.' },
    { question: 'What are CGST and SGST?', answer: 'For intra-state transactions, the GST is split into two parts: Central GST (CGST) which goes to the central government, and State GST (SGST) which goes to the state government. Both are usually equal (half of the total GST rate each).' },
    { question: 'How is GST calculated manually?', answer: 'To add GST: Total = Amount + (Amount * Rate / 100). To remove GST: Original = Total / (1 + Rate / 100).' },
];

const validationRules = {
    amount: { label: 'Amount', min: 1, max: 100000000, required: true },
    rate: { label: 'GST Rate', min: 0, max: 50, allowDecimal: true, required: true },
};

export default function GSTCalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const [inclusive, setInclusive] = useState(false);
    const { values: inputs, errors, touched, handleChange, handleBlur, validateAll, getNumericValue } = useValidatedInputs(
        { amount: '10000', rate: '18' },
        validationRules
    );
    const [results, setResults] = useState(null);
    const resultsRef = useRef(null);

    const handleCalculate = (e) => {
        e.preventDefault();
        if (!validateAll()) return;
        const res = calculateGST(getNumericValue('amount'), getNumericValue('rate'), inclusive);
        setResults(res);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const doughnutData = results ? {
        labels: ['Net Amount', 'Total GST'],
        datasets: [{
            data: [results.netAmount, results.gstAmount],
            backgroundColor: ['#3b82f6', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="GST Calculator Online — Calculate GST Inclusive & Exclusive | FinanceCalc"
                description="Free GST calculator for India. Easily calculate GST inclusive and exclusive amounts with CGST and SGST breakdown for 5%, 12%, 18% and 28% slabs."
                canonical="/gst-calculator"
                faqSchema={faqs}
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>GST Calculator</span></nav>
            <section className="calculator-hero">
                <h1>GST Calculator</h1>
                <p className="hero-subtitle">Quickly calculate Goods and Services Tax for your business or personal purchases.</p>
            </section>

            <form className="calculator-form" onSubmit={handleCalculate} noValidate>
                <div className="calculation-type-toggle" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', background: 'var(--bg-glass)', padding: '0.375rem', borderRadius: ' var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                    <button type="button"
                        className={`toggle-btn ${!inclusive ? 'active' : ''}`}
                        onClick={() => setInclusive(false)}
                        style={{ flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.2s', border: 'none', cursor: 'pointer', background: !inclusive ? 'var(--gradient-primary)' : 'transparent', color: !inclusive ? 'white' : 'var(--text-secondary)' }}
                    >
                        GST Exclusive (Add GST)
                    </button>
                    <button type="button"
                        className={`toggle-btn ${inclusive ? 'active' : ''}`}
                        onClick={() => setInclusive(true)}
                        style={{ flex: 1, padding: '0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.2s', border: 'none', cursor: 'pointer', background: inclusive ? 'var(--gradient-primary)' : 'transparent', color: inclusive ? 'white' : 'var(--text-secondary)' }}
                    >
                        GST Inclusive (Remove GST)
                    </button>
                </div>

                <div className="form-grid">
                    <ValidatedInput name="amount" label={inclusive ? "Total Amount (Incl. GST)" : "Net Amount (Excl. GST)"} value={inputs.amount} onChange={handleChange} onBlur={handleBlur} error={errors.amount} touched={touched.amount} prefix={symbol} />
                    <ValidatedInput name="rate" label="GST Rate (%)" value={inputs.rate} onChange={handleChange} onBlur={handleBlur} error={errors.rate} touched={touched.rate} suffix="%" />
                </div>

                <div className="gst-rate-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    {['5', '12', '18', '28'].map(r => (
                        <button key={r} type="button" onClick={() => handleChange({ target: { name: 'rate', value: r } })} style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border-primary)', background: inputs.rate === r ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)', color: inputs.rate === r ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500 }}>{r}% GST</button>
                    ))}
                </div>

                <button type="submit" className="btn-calculate" style={{ marginTop: '1.5rem' }}>Calculate GST</button>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card"><div className="result-label">Net Amount</div><div className="result-value small">{formatCurrency(results.netAmount)}</div></div>
                        <div className="result-card highlight"><div className="result-label">Total GST ({results.rate}%)</div><div className="result-value">{formatCurrency(results.gstAmount)}</div></div>
                        <div className="result-card"><div className="result-label">Total Amount</div><div className="result-value small" style={{ color: 'var(--accent-primary)' }}>{formatCurrency(results.totalAmount)}</div></div>
                    </div>

                    <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                        <div>
                            <h3>Price Breakdown</h3>
                            <div style={{ maxWidth: 280, margin: '0 auto' }}><Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} /></div>
                        </div>
                        <div className="data-table-wrapper">
                            <h3>GST Components</h3>
                            <table className="data-table">
                                <tbody>
                                    <tr><td>Net Amount</td><td>{formatCurrency(results.netAmount)}</td></tr>
                                    <tr><td>CGST ({(results.rate / 2).toFixed(1)}%)</td><td>{formatCurrency(results.cgst)}</td></tr>
                                    <tr><td>SGST ({(results.rate / 2).toFixed(1)}%)</td><td>{formatCurrency(results.sgst)}</td></tr>
                                    <tr style={{ fontWeight: 700, borderTop: '2px solid var(--border-primary)' }}><td>Total GST</td><td>{formatCurrency(results.gstAmount)}</td></tr>
                                    <tr style={{ background: 'rgba(59,130,246,0.05)', fontWeight: 800 }}><td>Total Invoice Value</td><td>{formatCurrency(results.totalAmount)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="actions-bar">
                        <ShareButton title="GST Calculation" text={`GST on ${formatCurrency(results.amount)} at ${results.rate}% is ${formatCurrency(results.gstAmount)}. Total: ${formatCurrency(results.totalAmount)}`} />
                    </div>
                </div>
            )}

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/gst-calculator" />
        </div>
    );
}
