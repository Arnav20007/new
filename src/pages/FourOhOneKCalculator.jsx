import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import SEOHead from '../components/common/SEOHead';
import FAQSection from '../components/common/FAQSection';
import TryNextCalculator from '../components/common/TryNextCalculator';
import ValidatedInput from '../components/common/ValidatedInput';
import PrivacyBadge from '../components/common/PrivacyBadge';
import { useCurrency } from '../context/CurrencyContext';
import { calculate401k } from '../utils/calculations';
import { useValidatedInputs } from '../utils/useValidatedInput';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const faqs = [
    { question: 'What is a 401(k)?', answer: 'A 401(k) is a retirement savings plan sponsored by an employer. It lets workers save and invest a piece of their paycheck before taxes are taken out. Taxes aren\'t paid until the money is withdrawn from the account.' },
    { question: 'What is an Employer Match?', answer: 'Many employers offer to match a portion of your 401(k) contributions. For example, they might match 50% of your contributions up to 6% of your salary. This is essentially free money and is one of the biggest benefits of a 401(k).' },
    { question: 'What is the 401(k) contribution limit for 2026?', answer: 'The IRS sets annual limits on how much you can contribute. For 2024, it was $23,000 (plus a $7,500 catch-up if over 50). These limits typically adjust for inflation each year.' },
    { question: 'When can I withdraw from my 401(k)?', answer: 'You can generally start making withdrawals without penalty after age 59½. Withdrawals before then are typically subject to income tax plus a 10% early withdrawal penalty.' },
    { question: 'Traditional vs. Roth 401(k)?', answer: 'A Traditional 401(k) is funded with pre-tax dollars (lower taxes now), while a Roth 401(k) is funded with after-tax dollars (tax-free withdrawals later). Most experts recommend Roth if you expect to be in a higher tax bracket in retirement.' },
];

const validationRules = {
    currentAge: { label: 'Current Age', min: 18, max: 75, allowDecimal: false, required: true },
    retirementAge: { label: 'Retirement Age', min: 50, max: 100, allowDecimal: false, required: true },
    annualSalary: { label: 'Annual Salary', min: 10000, max: 10000000, required: true },
    currentBalance: { label: 'Current 401(k) Balance', min: 0, max: 100000000, required: true },
    contributionPercent: { label: 'Your Contribution (%)', min: 0, max: 100, allowDecimal: true, required: true },
    employerMatch: { label: 'Employer Match (%)', min: 0, max: 200, allowDecimal: true, required: true },
    employerMatchLimit: { label: 'Match Limit (%)', min: 0, max: 100, allowDecimal: true, required: true },
    expectedReturn: { label: 'Expected Return', min: 0, max: 25, allowDecimal: true, required: true },
    salaryIncrease: { label: 'Salary Increase (%)', min: 0, max: 15, allowDecimal: true, required: true },
};

export default function FourOhOneKCalculator() {
    const { formatCurrency, symbol } = useCurrency();
    const { values: inputs, errors, touched, handleChange, handleBlur, getNumericValue } = useValidatedInputs(
        {
            currentAge: '30', retirementAge: '65',
            annualSalary: '75000', currentBalance: '25000',
            contributionPercent: '6', employerMatch: '50',
            employerMatchLimit: '6', expectedReturn: '7',
            salaryIncrease: '3'
        },
        validationRules
    );
    const [results, setResults] = useState(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        const res = calculate401k(
            parseInt(inputs.currentAge), parseInt(inputs.retirementAge),
            getNumericValue('currentBalance'), getNumericValue('annualSalary'),
            getNumericValue('contributionPercent'), getNumericValue('employerMatch'),
            getNumericValue('employerMatchLimit'), getNumericValue('expectedReturn'),
            getNumericValue('salaryIncrease')
        );
        if (!res.error) setResults(res);
        else setResults(null);
    }, [inputs, symbol]);

    const lineData = results ? {
        labels: results.projection.map(r => `Age ${r.age}`),
        datasets: [{
            label: '401(k) Balance',
            data: results.projection.map(r => r.balance),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
        }]
    } : null;

    const doughnutData = results ? {
        labels: ['Your Contributions', 'Employer Match', 'Investment Growth'],
        datasets: [{
            data: [results.totalEmployeeContributions, results.totalEmployerMatch, results.totalGrowth],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
            borderWidth: 0,
        }]
    } : null;

    return (
        <div className="calculator-page">
            <SEOHead
                title="401(k) Calculator USA – Retirement Savings Planner | FinanceCalc"
                description="Project your 401(k) balance at retirement with employer matching, salary increases, and investment growth. See how much your nest egg will be worth."
                canonical="/401k-calculator"
                faqSchema={faqs}
            />
            <nav className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>401(k) Calculator</span></nav>
            <section className="calculator-hero">
                <h1>401(k) Calculator USA</h1>
                <div className="last-updated-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Updated for 2026 Limits
                </div>
                <p className="hero-subtitle">Optimize your 401(k) strategy and see how employer matching accelerates your retirement wealth.</p>
            </section>

            <form className="calculator-form" noValidate>
                <div className="form-grid">
                    <ValidatedInput name="currentAge" label="Current Age" value={inputs.currentAge} onChange={handleChange} onBlur={handleBlur} error={errors.currentAge} touched={touched.currentAge} suffix="yrs" />
                    <ValidatedInput name="retirementAge" label="Retirement Age" value={inputs.retirementAge} onChange={handleChange} onBlur={handleBlur} error={errors.retirementAge} touched={touched.retirementAge} suffix="yrs" />
                    <ValidatedInput name="annualSalary" label="Annual Salary" value={inputs.annualSalary} onChange={handleChange} onBlur={handleBlur} error={errors.annualSalary} touched={touched.annualSalary} prefix={symbol} />
                    <ValidatedInput name="currentBalance" label="Current Balance" value={inputs.currentBalance} onChange={handleChange} onBlur={handleBlur} error={errors.currentBalance} touched={touched.currentBalance} prefix={symbol} />
                    <ValidatedInput name="contributionPercent" label="Your Contribution (%)" value={inputs.contributionPercent} onChange={handleChange} onBlur={handleBlur} error={errors.contributionPercent} touched={touched.contributionPercent} suffix="%" />
                    <ValidatedInput name="employerMatch" label="Employer Match (%)" value={inputs.employerMatch} onChange={handleChange} onBlur={handleBlur} error={errors.employerMatch} touched={touched.employerMatch} suffix="%" />
                    <ValidatedInput name="employerMatchLimit" label="Match Limit (of your contribution %)" value={inputs.employerMatchLimit} onChange={handleChange} onBlur={handleBlur} error={errors.employerMatchLimit} touched={touched.employerMatchLimit} suffix="%" />
                    <ValidatedInput name="expectedReturn" label="Expected Return (%)" value={inputs.expectedReturn} onChange={handleChange} onBlur={handleBlur} error={errors.expectedReturn} touched={touched.expectedReturn} suffix="%" />
                    <ValidatedInput name="salaryIncrease" label="Salary Increase (%)" value={inputs.salaryIncrease} onChange={handleChange} onBlur={handleBlur} error={errors.salaryIncrease} touched={touched.salaryIncrease} suffix="%" />
                </div>
                <PrivacyBadge />
            </form>

            {results && (
                <div className="results-section" ref={resultsRef}>
                    <div className="results-summary">
                        <div className="result-card highlight">
                            <div className="result-label">Projected 401(k) Balance</div>
                            <div className="result-value">{formatCurrency(results.finalBalance)}</div>
                        </div>
                        <div className="result-card success">
                            <div className="result-label">Employer Contributions</div>
                            <div className="result-value small" style={{ color: '#10b981' }}>{formatCurrency(results.totalEmployerMatch)}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Total Employee Contributions</div>
                            <div className="result-value small">{formatCurrency(results.totalEmployeeContributions)}</div>
                        </div>
                        <div className="result-card">
                            <div className="result-label">Investment Growth</div>
                            <div className="result-value small" style={{ color: '#f59e0b' }}>{formatCurrency(results.totalGrowth)}</div>
                        </div>
                    </div>

                    <div className="chart-section" style={{ marginTop: '3rem' }}>
                        <h3>Wealth Growth Projection</h3>
                        <div className="chart-container" style={{ height: 350 }}>
                            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatCurrency(v) } } } }} />
                        </div>
                    </div>

                    <div className="chart-section" style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <h3>Contribution vs. Growth Breakdown</h3>
                        <div style={{ maxWidth: 300, margin: '0 auto' }}>
                            <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>

                    <div className="data-table-wrapper" style={{ marginTop: '3rem' }}>
                        <h3>Yearly Projection Table</h3>
                        <div className="data-table-scroll">
                            <table className="data-table">
                                <thead>
                                    <tr><th>Age</th><th>Projected Balance</th><th>Total Contributions</th><th>Yearly Growth</th></tr>
                                </thead>
                                <tbody>
                                    {results.projection.map(r => (
                                        <tr key={r.age}>
                                            <td>{r.age}</td>
                                            <td><strong>{formatCurrency(r.balance)}</strong></td>
                                            <td>{formatCurrency(r.totalContributions)}</td>
                                            <td style={{ color: '#10b981' }}>+{formatCurrency(r.yearlyGrowth)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <section className="seo-content">
                <div className="container">
                    <h2>Maximinzing Your 401(k) for a Secure Retirement</h2>
                    <p>The 401(k) is the most popular retirement savings vehicle in the United States. It offers a powerful combination of tax advantages and employer contributions that can help you build significant wealth over your career. Our 401(k) calculator helps you visualize this growth and understand the impact of your contribution rate and employer match.</p>

                    <h3>The Power of the Employer Match</h3>
                    <p>Financial experts often call the employer match "the only free lunch in finance." If your employer offers a match, you should strive to contribute at least enough to receive the full match. For example, if your employer matches 50% of your contributions up to 6% of your salary, contributing 6% effectively gives you an immediate 50% return on your investment before market growth is even considered.</p>

                    <h3>Tax Advantages: Traditional vs. Roth</h3>
                    <p>Most 401(k) plans now offer two options:</p>
                    <ul>
                        <li><strong>Traditional 401(k):</strong> Contributions are made pre-tax, reducing your taxable income today. You pay taxes on the money when you withdraw it in retirement.</li>
                        <li><strong>Roth 401(k):</strong> Contributions are made after-tax, so there is no immediate tax break. However, the money grows tax-free, and your withdrawals in retirement are also tax-free.</li>
                    </ul>

                    <h3>Contribution Limits & Catch-up Contributions</h3>
                    <p>The IRS limits how much you can contribute to a 401(k) each year. As of 2024, the limit is $23,000 for individuals under age 50. If you are 50 or older, you can make an additional "catch-up" contribution of $7,500, bringing your total potential contribution to $30,500.</p>
                </div>
            </section>

            <FAQSection faqs={faqs} />
            <TryNextCalculator currentPath="/401k-calculator" />
        </div>
    );
}
