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

    // Instant Calculation Logic
    useEffect(() => {
        const amount = getNumericValue('amount');
        const rate = getNumericValue('rate');

        if (amount > 0 && rate >= 0) {
            const res = calculateGST(amount, rate, inclusive);
            setResults(res);
        } else {
            setResults(null);
        }
    }, [inputs, inclusive, symbol]);

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
                title="GST Calculator India – Inclusive & Exclusive | FinanceCalc"
                description="Free GST calculator for India. Calculate GST inclusive and exclusive amounts with CGST and SGST breakdown for 5%, 12%, 18% and 28% slabs."
                canonical="/gst-calculator"
                faqSchema={faqs}
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>GST Calculator</span></nav>
            <section className="calculator-hero">
                <h1>GST Calculator</h1>
                <div className="last-updated-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Last updated: Feb 2026 — based on latest Indian GST rules.
                </div>
                <p className="hero-subtitle">Quickly calculate Goods and Services Tax for your business or personal purchases.</p>
            </section>

            <form className="calculator-form" noValidate>
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

                <div style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    GST breakdown updates instantly as you type.
                </div>
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

            <section className="seo-content" id="seo">
                <div className="container">
                    <h2>How GST is Calculated in India (2025-26)</h2>
                    <p>Goods and Services Tax (GST) is a destination-based tax that replaced multiple indirect taxes in India. Understanding how to calculate GST is crucial for business owners, accountants, and consumers alike. This GST calculator helps you find both <strong>GST Inclusive</strong> (finding the original price after tax) and <strong>GST Exclusive</strong> (adding tax to a base price) amounts instantly.</p>

                    <h3>The Formula for GST Calculation</h3>
                    <p>To calculate GST manually, you can use these simple mathematical formulas:</p>
                    <ul>
                        <li><strong>For GST Addition (Exclusive):</strong> GST Amount = (Original Cost * GST%) / 100. Total Price = Original Cost + GST Amount.</li>
                        <li><strong>For GST Removal (Inclusive):</strong> GST Amount = Total Price - [Total Price / (1 + (GST % / 100))]. Net Price = Total Price - GST Amount.</li>
                    </ul>

                    <h3>Understanding CGST, SGST, and IGST</h3>
                    <p>Depending on the location of the buyer and seller, GST is divided into different components:</p>
                    <ul>
                        <li><strong>CGST (Central GST):</strong> Collected by the Central Government on an intra-state sale (e.g., a transaction within Maharashtra).</li>
                        <li><strong>SGST (State GST):</strong> Collected by the State Government on an intra-state sale. For intra-state transactions, CGST and SGST are usually split 50-50 of the total GST rate.</li>
                        <li><strong>IGST (Integrated GST):</strong> Collected by the Central Government for inter-state transactions (e.g., a sale from Gujarat to Delhi).</li>
                    </ul>

                    <h3>Current GST Slabs in India</h3>
                    <p>The GST Council has categorized goods and services into four primary tax slabs:</p>
                    <ul>
                        <li><strong>5% Slab:</strong> Essential items like sugar, tea, coffee, and edible oil.</li>
                        <li><strong>12% Slab:</strong> Items like butter, ghee, almonds, and fruit juice.</li>
                        <li><strong>18% Slab:</strong> Most common goods and services, including hair oil, toothpaste, and electronics.</li>
                        <li><strong>28% Slab:</strong> Luxury and "sin" goods like cars, tobacco, and high-end motorcycles.</li>
                    </ul>

                    <h3>Who should use the GST Calculator?</h3>
                    <p>This tool is essential for anyone dealing with trade and commerce in India:</p>
                    <ul>
                        <li><strong>Retailers & Wholesalers:</strong> To quickly generate quotes and understand their tax liabilities.</li>
                        <li><strong>Purchasing Managers:</strong> To calculate the actual "input credit" they can claim on business purchases.</li>
                        <li><strong>Online Shoppers:</strong> To verify if the GST charged on their invoice matches the legal rates.</li>
                        <li><strong>CA & Accountants:</strong> For quick cross-verification of multi-stage tax calculations.</li>
                    </ul>
                </div>
            </section>

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/gst-calculator" />
        </div>
    );
}
