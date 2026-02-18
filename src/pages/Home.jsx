import { Link } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import AdSlot from '../components/common/AdSlot';

const calculators = [
    {
        icon: '🏠', title: 'Mortgage Calculator with PMI',
        description: 'Calculate your monthly mortgage payments including taxes, insurance, and PMI. Complete amortization schedule.',
        path: '/mortgage-calculator',
        tags: ['Home Loan', 'Mortgage', 'USA'],
        image: '/images/calc-emi.svg',
    },
    {
        icon: '💰', title: '401(k) Calculator USA',
        description: 'Project your retirement savings with employer matching and see how your 401(k) grows over your career.',
        path: '/401k-calculator',
        tags: ['Retirement', '401k', 'Planning'],
        image: '/images/calc-retirement.svg',
    },
    {
        icon: '🎓', title: 'Student Loan Calculator USA',
        description: 'Plan your student loan repayment and see how much interest you can save with extra payments.',
        path: '/student-loan-calculator',
        tags: ['Loans', 'Education', 'USA'],
        image: '/images/calc-loan.svg',
    },
    {
        icon: '💳', title: 'Credit Card Payoff Calculator USA',
        description: 'Plan your path to zero balance and see how Americans pay off credit card debt faster with smart strategies.',
        path: '/credit-card-payoff-calculator',
        tags: ['Debt', 'Credit Card', 'USA'],
        image: '/images/calc-cc.svg',
    },
    {
        icon: '⚡', title: 'Debt Snowball Calculator USA',
        description: 'Compare snowball vs. avalanche payoff strategies and find the fastest path to becoming debt-free.',
        path: '/debt-snowball-calculator',
        tags: ['Debt Free', 'Snowball', 'USA'],
        image: '/images/calc-debt.svg',
    },
    {
        icon: '🏔️', title: 'Debt Avalanche Calculator USA',
        description: 'Prioritize high-interest balances and save thousands in interest with the mathematically fastest payoff method.',
        path: '/debt-avalanche-calculator',
        tags: ['Debt Free', 'Avalanche', 'USA'],
        image: '/images/calc-debt.svg',
    },
    {
        icon: '📖', title: 'Guide: Pay Off Debt Faster',
        description: 'A comprehensive guide for Americans on how to eliminate credit card debt using proven methods.',
        path: '/guides/how-to-pay-off-debt-faster-usa',
        tags: ['Guide', 'Debt', 'Americans'],
        image: '/images/calc-loan.svg',
    },
    {
        icon: '🔥', title: 'FIRE Calculator USA',
        description: 'Find your number for Financial Independence and Early Retirement in the USA.',
        path: '/fire-calculator',
        tags: ['Retirement', 'Trending', 'Independence'],
        image: '/images/calc-fire.svg',
    },
    {
        icon: '📈', title: 'Compound Interest Calculator USA',
        description: 'See how your investments grow over time with the magic of compound interest and regular contributions.',
        path: '/compound-interest-calculator',
        tags: ['Investing', 'Savings', 'USA'],
        image: '/images/calc-compound.svg',
    },
    {
        icon: '💹', title: 'Inflation Calculator USA',
        description: 'Understand how inflation erodes your purchasing power in the United States over time.',
        path: '/inflation-calculator',
        tags: ['Inflation', 'Purchasing Power', 'USA'],
        image: '/images/calc-inflation.svg',
    },
    {
        icon: '🏦', title: 'Loan Payoff Calculator',
        description: 'Get a complete amortization schedule and find the fastest way to pay off any loan.',
        path: '/loan-payoff-calculator',
        tags: ['Mortgage', 'Debt', 'Amortization'],
        image: '/images/calc-loan.svg',
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
        tags: ['Loan', 'EMI', 'Finance'],
        image: '/images/calc-emi.svg',
    },
    {
        icon: '🇮🇳', title: 'India Income Tax Calculator',
        description: 'Calculate your tax liability under the New Tax Regime for FY 2024-25.',
        path: '/india-tax-calculator',
        tags: ['Tax', 'Income Tax', 'India'],
        image: '/images/calc-tax.svg',
    },
];

export default function Home() {
    return (
        <div className="home-page">
            <SEOHead
                title="FinanceCalc – Professional Financial Calculators USA"
                description="Accurate retirement, mortgage, 401k & investment tools built for US users. 100% free, privacy-first, and mobile-friendly financial planning."
                canonical="/"
            />

            <section className="home-hero">
                <div className="hero-content">
                    <h1>FinanceCalc – Professional<br />Financial Calculators USA</h1>
                    <p>Accurate 401(k), Mortgage, and Retirement tools built for precision. Make smarter money decisions with advanced financial projections.</p>
                    <div className="trust-badges">
                        <div className="trust-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            US Focused
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
                    <h2>Advanced Financial Tools</h2>
                    <p>Plan your retirement, home purchase, and wealth growth with professional-grade analysis.</p>
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
                    <p>Accurate, privacy-first financial tools built for Americans.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <h3>US Financial Standards</h3>
                        <p>Our tools are updated with the latest US mortgage standards, 401(k) limits, and inflation data to ensure accuracy for US households.</p>
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
                <div className="container">
                    <h2>Professional Financial Planning for Americans</h2>
                    <p>FinanceCalc is dedicated to providing Americans with the most precise tools for wealth management, retirement planning, and debt optimization. In an era of rising costs and economic volatility, making decisions based on "gut feeling" is no longer enough. Our platform empowers <strong>US households</strong> with mathematical certainty, whether you're navigating your first mortgage or planning for early retirement.</p>

                    <h3>Why Accurate Financial Calculators Matter</h3>
                    <p>Even a 0.5% difference in mortgage rates or a minor misunderstanding of 401(k) compounding can result in a loss of thousands over a 20-year period. Our calculators are meticulously audited to reflect US financial standards. We don't just give you a number; we provide a complete roadmap with interactive charts, amortization schedules, and year-by-year wealth breakdowns.</p>

                    <h3>Comprehensive Coverage for Every Money Goal</h3>
                    <p>Whether you're looking for a <strong>Mortgage Calculator with PMI</strong> to see your true monthly cost, or a <strong>FIRE Calculator USA</strong> to plan an early exit from the corporate world, we have you covered. Our suite of tools includes industry-leading projections for:</p>
                    <ul>
                        <li><strong>Retirement Planning:</strong> 401(k), IRA, and FIRE goals.</li>
                        <li><strong>Debt Management:</strong> Debt Snowball vs Avalanche, Credit Card Payoff, and Student Loans.</li>
                        <li><strong>Home Ownership:</strong> Real-time mortgage breakdowns including taxes and insurance.</li>
                        <li><strong>Wealth Growth:</strong> Compound interest and inflation-adjusted projections.</li>
                    </ul>

                    <h3>Privacy-First & Completely Free</h3>
                    <p>Your financial data is sensitive. Unlike other platforms that harvest your data for marketing, <strong>FinanceCalc is 100% anonymous</strong>. All calculations happen directly in your browser. No data ever leaves your device, ensuring your financial secrets stay yours. We believe that professional-grade financial planning should be accessible to every American, free of charge. Higher transparency is what makes us the preferred choice for US financial tracking.</p>

                    <h3>Plan for Every Stage of American Life</h3>
                    <p>Whether you're just starting to invest, buying your first home, planning for retirement, or aggressively paying off debt, our calculators provide the detailed projections and insights you need to make informed decisions. Download your results as a PDF to share with your family, financial advisor, or keep for your records.</p>
                </div>
            </section>

        </div>
    );
}
