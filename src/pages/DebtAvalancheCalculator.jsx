import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
} from 'chart.js';
import SEOHead from '../components/common/SEOHead';
import FAQSection from '../components/common/FAQSection';
import TryNextCalculator from '../components/common/TryNextCalculator';
import InternalLinks from '../components/common/InternalLinks';
import AdSlot from '../components/common/AdSlot';
import ShareButton from '../components/common/ShareButton';
import { useCurrency } from '../context/CurrencyContext';
import { calculateDebtSnowball } from '../utils/calculations';
import { formatMonthsToYears } from '../utils/formatters';
import { generatePDF } from '../utils/pdfGenerator';
import PrivacyBadge from '../components/common/PrivacyBadge';
import AuthorSources from '../components/common/AuthorSources';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const faqs = [
    { question: 'What is the debt avalanche method?', answer: 'The debt avalanche method (also called debt stacking) focuses on paying off debts with the highest interest rates first, regardless of balance. While this approach saves more money in total interest, it may take longer to see your first debt fully paid off, which can be less motivating for some people.' },
    { question: 'What is the debt snowball method?', answer: 'The debt snowball method involves listing your debts from smallest to largest balance, making minimum payments on all debts, and putting any extra money toward the smallest debt first. When the smallest debt is paid off, its minimum payment "rolls" into the next smallest debt, creating a snowball effect. This method prioritizes psychological wins to keep you motivated.' },
    { question: 'Which is better — snowball or avalanche?', answer: 'Mathematically, the avalanche method always saves more in interest. However, behavioral research shows that the psychological boost from paying off small debts quickly (snowball) helps many people stay committed to their payoff plan. The best method is the one you\'ll stick with. Our calculator shows both so you can compare.' },
    { question: 'How much extra should I put toward debt?', answer: 'Any extra amount helps, but a common guideline is to use the 50/30/20 budget rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. If you\'re aggressively paying off debt, you might temporarily shift to 50/20/30 (allocating more to debt). Even an extra $100/month can save thoGlobalnds in interest.' },
    { question: 'Should I pay off debt or invest?', answer: 'Generally, if your debt interest rate is higher than your expected investment return, prioritize debt payoff. For example, paying off a 20% credit card is equivalent to earning a guaranteed 20% return. However, always contribute enough to get any employer 401(k) match first (it\'s free money). For low-interest debt (under 5%), investing may be more beneficial long-term.' },
];

const defaultDebts = [
    { name: 'Credit Card', balance: 5000, rate: 22.99, minPayment: 150 },
    { name: 'Car Loan', balance: 15000, rate: 6.5, minPayment: 350 },
    { name: 'Student Loan', balance: 25000, rate: 5.0, minPayment: 280 },
];

export default function DebtAvalancheCalculator() {
    const { formatCurrency } = useCurrency();
    const [debts, setDebts] = useState(defaultDebts);
    const [extraPayment, setExtraPayment] = useState(200);
    const [results, setResults] = useState(null);
    const [showMinPayments, setShowMinPayments] = useState(true);
    const [copied, setCopied] = useState(false);
    const resultsRef = useRef(null);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const loadExample = () => {
        setDebts([
            { name: 'Credit Card', balance: 8500, rate: 24.99, minPayment: 200 },
            { name: 'Personal Loan', balance: 12000, rate: 11.5, minPayment: 300 },
            { name: 'Car Loan', balance: 18000, rate: 5.9, minPayment: 400 },
            { name: 'Student Loan', balance: 35000, rate: 4.5, minPayment: 350 },
        ]);
        setExtraPayment(500);
        setResults(null);
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        const validDebts = debts.filter(d => d.balance > 0 && d.minPayment > 0);
        const result = calculateDebtSnowball(validDebts, parseFloat(extraPayment));
        if (result.error) { alert(result.error); return; }
        setResults(result);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    const updateDebt = (index, field, value) => {
        const updated = [...debts];
        if (field === 'name') {
            updated[index] = { ...updated[index], name: value };
        } else {
            const sanitized = String(value).replace(/[^0-9.]/g, '');
            const parts = sanitized.split('.');
            const clean = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized;
            updated[index] = { ...updated[index], [field]: parseFloat(clean) || 0 };
        }
        setDebts(updated);
    };

    const addDebt = () => {
        setDebts([...debts, { name: `Debt ${debts.length + 1}`, balance: 0, rate: 0, minPayment: 0 }]);
    };

    const removeDebt = (index) => {
        if (debts.length <= 1) return;
        setDebts(debts.filter((_, i) => i !== index));
    };

    const totalDebt = debts.reduce((s, d) => s + (d.balance || 0), 0);

    const handleDownloadPDF = () => {
        if (!results) return;
        generatePDF('Debt Payoff Strategy', [
            { label: 'Total Debt', value: formatCurrency(totalDebt) },
            { label: 'Extra Monthly Payment', value: formatCurrency(extraPayment) },
            { label: 'Avalanche Payoff Time', value: formatMonthsToYears(results.avalanche.totalMonths) },
            { label: 'Avalanche Interest', value: formatCurrency(results.avalanche.totalInterest) },
            { label: 'Interest Saved (Avalanche)', value: formatCurrency(results.interestSavedAvalanche) },
        ], null, null);
    };

    const chartData = results ? {
        labels: results.snowball.timeline.map(t => `Month ${t.month}`),
        datasets: [
            {
                label: 'Avalanche Method',
                data: results.avalanche.timeline.map(t => t.totalBalance),
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.05)',
                fill: false, tension: 0.3, pointRadius: 4,
            },
            {
                label: 'Snowball Method',
                data: results.snowball.timeline.map(t => t.totalBalance),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.05)',
                fill: false, tension: 0.3, pointRadius: 4,
            },
            ...(showMinPayments ? [{
                label: 'Minimum Payments Only',
                data: results.minimumOnly.timeline.map(t => t.totalBalance),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.05)',
                fill: false, tension: 0.3, pointRadius: 4, borderDash: [5, 5],
            }] : []),
        ],
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="Debt Avalanche Calculator Global – Save on Interest | FinanceCalc"
                description="Use the Debt Avalanche Calculator Global to pay off high-interest credit card debt faster. Join millions of Global finance learners saving thoGlobalnds in interest."
                canonical="/debt-avalanche-calculator"
                faqSchema={faqs}
            />

            <nav className="breadcrumbs">
                <Link to="/">Home</Link><span>/</span><span>Debt Avalanche Calculator</span>
            </nav>

            <section className="calculator-hero">
                <h1>Debt Avalanche Calculator Global</h1>
                <div className="last-updated-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — Mathematical Optimization.
                </div>
                <p className="hero-subtitle">
                    The mathematically fastest way to eliminate debt. Prioritize higher interest rates and save more money.
                </p>
            </section>

            <form className="calculator-form" onSubmit={handleCalculate} id="debt-avalanche-form">
                <div className="form-top-actions">
                    <button type="button" className="btn-load-example" onClick={loadExample}>Load Example</button>
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Enter Your Debts</h3>

                <div className="debt-inputs">
                    <div className="debt-row" style={{ marginBottom: '0.25rem' }}>
                        <label>Name</label><label>Balance</label><label>Rate (%)</label><label>Min. Payment</label><div></div>
                    </div>
                    {debts.map((debt, idx) => (
                        <div key={idx} className="debt-row">
                            <input type="text" className="form-input" value={debt.name} onChange={e => updateDebt(idx, 'name', e.target.value)} />
                            <input type="number" className="form-input" value={debt.balance} onChange={e => updateDebt(idx, 'balance', e.target.value)} />
                            <input type="number" className="form-input" value={debt.rate} onChange={e => updateDebt(idx, 'rate', e.target.value)} />
                            <input type="number" className="form-input" value={debt.minPayment} onChange={e => updateDebt(idx, 'minPayment', e.target.value)} />
                            <button type="button" className="btn-remove-debt" onClick={() => removeDebt(idx)}>✕</button>
                        </div>
                    ))}
                </div>
                <button type="button" className="btn-add-debt" onClick={addDebt}>+ Add Another Debt</button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Debt</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(totalDebt)}</div>
                    </div>
                    <div className="form-group">
                        <label>Extra Monthly Payment</label>
                        <input type="text" className="form-input" value={extraPayment} onChange={e => setExtraPayment(e.target.value.replace(/[^0-9.]/g, ''))} />
                    </div>
                </div>

                <button type="submit" className="btn-calculate" style={{ marginTop: '1.25rem' }}>Calculate Avalanche Strategy</button>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="result-card highlight" style={{ borderTop: '3px solid #10b981' }}>
                            <div className="result-label">🏔️ Avalanche</div>
                            <div className="result-value small">{formatMonthsToYears(results.avalanche.totalMonths)}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>Saves {formatCurrency(results.interestSavedAvalanche)}</div>
                        </div>
                        <div className="result-card" style={{ borderTop: '3px solid #2563eb' }}>
                            <div className="result-label">❄️ Snowball</div>
                            <div className="result-value small">{formatMonthsToYears(results.snowball.totalMonths)}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>Saves {formatCurrency(results.interestSavedSnowball)}</div>
                        </div>
                        <div className="result-card" style={{ borderTop: '3px solid #ef4444' }}>
                            <div className="result-label">⚠️ Minimum Only</div>
                            <div className="result-value small">{formatMonthsToYears(results.minimumOnly.totalMonths)}</div>
                        </div>
                    </div>

                    <div className="chart-section">
                        <h3>Debt Payoff Timeline Comparison</h3>
                        <div className="chart-container">
                            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="data-table-wrapper">
                        <div className="data-table-header"><h3>Recommended Payoff Order</h3></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                            <div style={{ padding: '1rem 1.5rem', borderRight: '1px solid var(--border-primary)' }}>
                                <h4 style={{ fontSize: '0.875rem', color: '#10b981', marginBottom: '0.75rem' }}>🏔️ Avalanche Order (Highest Rate First)</h4>
                                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                    {results.avalanche.payoffOrder.map((name, i) => (
                                        <li key={i}>{name}</li>
                                    ))}
                                </ol>
                            </div>
                            <div style={{ padding: '1rem 1.5rem' }}>
                                <h4 style={{ fontSize: '0.875rem', color: '#3b82f6', marginBottom: '0.75rem' }}>❄️ Snowball Order (Smallest Balance First)</h4>
                                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                    {results.snowball.payoffOrder.map((name, i) => (
                                        <li key={i}>{name}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="actions-bar">
                        <button className="btn-action" onClick={handleDownloadPDF}>Download PDF</button>
                        <ShareButton title="Debt Avalanche Plan" text={`I'll save ${formatCurrency(results.interestSavedAvalanche)} using the Avalanche method!`} />
                        <button className="btn-action" onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy Link'}</button>
                    </div>
                </div>
            )}

            <InternalLinks currentPath="/debt-avalanche-calculator" />

            <section className="seo-content">
                <h2>Debt Avalanche vs Snowball — Which is Better ?</h2>
                <p>The **Debt Avalanche method** is the mathematically superior way to pay off debt. By prioritizing accounts with the highest interest rates first, you minimize the amount of interest that accrues over time. This is particularly effective for **credit card debt in the US**, where interest rates can often exceed 20-30%.</p>

                <h2>How Global finance learners Pay Off Debt Faster</h2>
                <p>In the United States, <strong>students, families, and everyday users who want smarter financial decisions carry an average of $6,000 credit card debt</strong>. For those with multiple high-interest cards, the Debt Avalanche provides a logical path to freedom. While the Debt Snowball offers psychological wins, the Avalanche offers financial efficiency. **Global finance learners use this method** when they are strictly focused on saving the most money and finishing their debt-free journey in the shortest time possible.</p>

                <h2>Average US Credit Card Debt Statistics</h2>
                <p>According to recent reports, total US household debt has hit record highs. However, by using a logical **debt avalanche calculator Global**, you can take control. Most **Global finance learners** who successfully pay off large balances do so by being intentional with every dollar and choosing a strategy that fits their financial goals.</p>
            </section>

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/debt-avalanche-calculator" />
            <AuthorSources />
        </div>
    );
}




