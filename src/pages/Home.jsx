import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import AdSlot from '../components/common/AdSlot';

const calculators = [
    {
        icon: '📈', title: 'Compound Interest Calculator',
        description: 'See how your investments grow over time with the magic of compound interest and regular contributions.',
        path: '/compound-interest-calculator',
        tags: ['Investing', 'Savings', 'Growth'],
        image: '/images/calc-compound.svg',
    },
    {
        icon: '🏦', title: 'Loan Payoff Calculator',
        description: 'Get a complete amortization schedule and find the fastest way to pay off your mortgage or personal loan.',
        path: '/loan-payoff-calculator',
        tags: ['Mortgage', 'Debt', 'Amortization'],
        image: '/images/calc-loan.svg',
    },
    {
        icon: '🏖️', title: 'Retirement Calculator',
        description: 'Project your retirement nest egg and estimated monthly income based on your savings strategy.',
        path: '/retirement-calculator',
        tags: ['Retirement', '401K', 'Planning'],
        image: '/images/calc-retirement.svg',
    },
    {
        icon: '💹', title: 'Inflation Calculator',
        description: 'Understand how inflation erodes your purchasing power and plan for rising costs over the years.',
        path: '/inflation-calculator',
        tags: ['Inflation', 'Purchasing Power', 'CPI'],
        image: '/images/calc-inflation.svg',
    },
    {
        icon: '⚡', title: 'Debt Snowball Calculator',
        description: 'Compare snowball vs. avalanche payoff strategies and find the fastest path to becoming debt-free.',
        path: '/debt-snowball-calculator',
        tags: ['Debt Free', 'Snowball', 'Avalanche'],
        image: '/images/calc-debt.svg',
    },
    {
        icon: '📊', title: 'SIP Calculator',
        description: 'Estimate the future value of your Systematic Investment Plan (SIP) in mutual funds.',
        path: '/sip-calculator',
        tags: ['Mutual Funds', 'Investing', 'Wealth'],
        image: '/images/calc-sip.svg',
    },
    {
        icon: '🚗', title: 'EMI Calculator',
        description: 'Calculate your monthly loan payments for home, car, or personal loans.',
        path: '/emi-calculator',
        tags: ['Loan', 'EMI', 'Mortgage'],
        image: '/images/calc-emi.svg',
    },
    {
        icon: '🇮🇳', title: 'India Income Tax Calculator',
        description: 'Calculate your tax liability under the New Tax Regime for FY 2024-25.',
        path: '/india-tax-calculator',
        tags: ['Tax', 'Income Tax', 'India'],
        image: '/images/calc-tax.svg',
    },
    {
        icon: '💳', title: 'Credit Card Payoff Calculator',
        description: 'Plan your path to zero balance and see how much interest you can save.',
        path: '/credit-card-payoff-calculator',
        tags: ['Debt', 'Credit Card', 'Finance'],
        image: '/images/calc-cc.svg',
    },
    {
        icon: '💼', title: 'GST Calculator',
        description: 'Calculate GST inclusive and exclusive amounts for goods and services in India.',
        path: '/gst-calculator',
        tags: ['Business', 'Tax', 'GST'],
        image: '/images/calc-gst.svg',
    },
    {
        icon: '🔥', title: 'FIRE Calculator',
        description: 'Find your number for Financial Independence and Early Retirement in India.',
        path: '/fire-calculator',
        tags: ['Retirement', 'Trending', 'Independence'],
        image: '/images/calc-fire.svg',
    },
    {
        icon: '🏠', title: 'HRA Calculator',
        description: 'Calculate your House Rent Allowance tax exemption based on Indian income tax rules.',
        path: '/hra-calculator',
        tags: ['Tax', 'Salary', 'India'],
        image: '/images/calc-hra.svg',
    },
];

export default function Home() {
    return (
        <div className="home-page">
            <SEOHead
                title="FinanceCalc – Professional Financial Calculators for India"
                description="Accurate tax, SIP, EMI & retirement tools built for Indian users. 100% free, privacy-first, and mobile-friendly financial planning."
                canonical="/"
            />

            <section className="home-hero">
                <div className="hero-content">
                    <h1>FinanceCalc – Professional<br />Financial Calculators for India</h1>
                    <p>Accurate tax, SIP, EMI & retirement tools built for Indian users. Make smarter money decisions with precision projections.</p>
                    <div className="trust-badges">
                        <div className="trust-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            Built for India
                        </div>
                        <div className="trust-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            Privacy-First
                        </div>
                        <div className="trust-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            100% Free
                        </div>
                    </div>
                </div>
                <div className="hero-illustration">
                    <img src="/images/hero-illustration.svg" alt="Financial growth chart illustration" width="600" height="400" />
                </div>
            </section>

            <section className="calculators-section">
                <div className="section-header">
                    <h2>India-Specific Financial Tools</h2>
                    <p>Plan your investments and taxes with tools designed for Indian financial laws.</p>
                </div>
                <div className="calc-grid">
                    {calculators.map(calc => (
                        <Link to={calc.path} key={calc.path} className="calc-card" id={`card-${calc.path.slice(1)}`}>
                            <div className="calc-card-image">
                                <img src={calc.image} alt={calc.title} width="200" height="200" loading="lazy" />
                            </div>
                            <div className="calc-card-body">
                                <h3>{calc.title}</h3>
                                <p>{calc.description}</p>
                                <div className="calc-card-tags">
                                    {calc.tags.map(tag => (
                                        <span key={tag} className="calc-tag">{tag}</span>
                                    ))}
                                </div>
                                <span className="calc-card-link">
                                    Open Calculator
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose FinanceCalc?</h2>
                    <p>India's most trusted privacy-first financial toolset.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <h3>Built for Indian Tax Laws</h3>
                        <p>Our tools are updated with the latest FY 2024-25 and 2025-26 tax regimes, including section 80C, 80D, and HRA rules.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                        </div>
                        <h3>Interactive Projections</h3>
                        <p>Visualize your wealth growth with dynamic charts and year-by-year breakdowns that make complex data clear.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 1z" /></svg>
                        </div>
                        <h3>100% Free & Privacy-First</h3>
                        <p>No sign-ups, no hidden fees, and no data tracking. Your financial data stays on your device.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                        </div>
                        <h3>Mobile Friendly</h3>
                        <p>Calculated your EMI or SIP on the go. Our platform is optimized for a perfect experience on all mobile devices.</p>
                    </div>
                </div>
            </section>

            <section className="seo-content">
                <h2>Plan for Every Stage of Life</h2>
                <p>Whether you're just starting to invest, buying your first home, planning for retirement, or aggressively paying off debt, our calculators provide the detailed projections and insights you need to make informed decisions.</p>
                <h2>Accurate, Transparent Calculations</h2>
                <p>Every calculator shows its work with detailed breakdowns, year-by-year tables, and interactive charts. Download your results as a PDF to share with your spouse, financial advisor, or keep for your records.</p>
            </section>

        </div>
    );
}
