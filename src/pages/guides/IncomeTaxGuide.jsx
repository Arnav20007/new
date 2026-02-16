import { Link } from 'react-router-dom';
import SEOHead from '../../components/common/SEOHead';
import TryNextCalculator from '../../components/common/TryNextCalculator';

export default function IncomeTaxGuide() {
    return (
        <div className="calculator-page guide-page">
            <SEOHead
                title="How to Calculate Income Tax in India (FY 2024-25) | FinanceCalc"
                description="Complete guide on how to calculate income tax in India. Learn about tax slabs, deductions, New vs Old regime, and how to use our free tax calculator."
                canonical="/guides/how-to-calculate-income-tax-india"
            />
            <nav className="breadcrumbs">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/india-tax-calculator">Tax Tools</Link>
                <span>/</span>
                <span>How to Calculate Income Tax</span>
            </nav>

            <article className="seo-content guide-content">
                <h1>How to Calculate Income Tax in India: A Step-by-Step Guide</h1>
                <p className="guide-intro">Calculating your income tax can feel overwhelming, but once you understand the components, it's a straightforward process. This guide breaks down exactly how to calculate your tax for FY 2024-25 (AY 2025-26).</p>

                <section>
                    <h2>Step 1: Calculate Your Gross Total Income</h2>
                    <p>Start by summing up all your income sources during the financial year (April 1 to March 31):</p>
                    <ul>
                        <li><strong>Income from Salary:</strong> Basic salary, HRA, bonuses, and special allowances.</li>
                        <li><strong>Income from House Property:</strong> Rental income or interests on home loans.</li>
                        <li><strong>Capital Gains:</strong> Profits from selling stocks, mutual funds, or real estate.</li>
                        <li><strong>Business or Profession:</strong> Income for freelancers or business owners.</li>
                        <li><strong>Income from Other Sources:</strong> Interest from savings accounts and FDs.</li>
                    </ul>
                </section>

                <section>
                    <h2>Step 2: Choose Your Tax Regime</h2>
                    <p>India currently has two tax systems. Choosing the right one is crucial for tax saving:</p>
                    <ul>
                        <li><strong>New Tax Regime:</strong> Offers lower tax rates but removes most deductions like 80C, 80D, and HRA. For FY 2024-25, the standard deduction of ₹50,000 is available.</li>
                        <li><strong>Old Tax Regime:</strong> Offers higher tax rates but allows you to reduce taxable income using various deductions.</li>
                    </ul>
                    <p>Use our <Link to="/india-tax-calculator">India Tax Calculator</Link> to compare both regimes instantly.</p>
                </section>

                <section>
                    <h2>Step 3: Apply Deductions (Old Regime)</h2>
                    <p>If you choose the Old Regime, subtract your deductions from the Gross Income:</p>
                    <ul>
                        <li><strong>Section 80C:</strong> Up to ₹1.5 Lakh for investments in PF, PPF, ELSS, and LIC.</li>
                        <li><strong>Section 80D:</strong> Medical insurance premiums.</li>
                        <li><strong>Section 10(13A):</strong> House Rent Allowance (HRA) exemption.</li>
                    </ul>
                </section>

                <section>
                    <h2>Step 4: Calculate the Net Taxable Income</h2>
                    <p>The amount left after deductions is your Net Taxable Income. This is the figure used to determine your tax bracket.</p>
                </section>

                <section>
                    <h2>Step 5: Apply Tax Slabs & Add Cess</h2>
                    <p>Apply the relevant tax percentage to each part of your income as per the slabs. Finally, add a <strong>4% Health and Education Cess</strong> to the total tax amount calculated.</p>
                </section>

                <div className="guide-cta" style={{ background: 'var(--bg-glass)', padding: '2rem', borderRadius: 'var(--radius-lg)', marginTop: '2rem', border: '1px solid var(--border-primary)', textAlign: 'center' }}>
                    <h3>Want an Instant Calculation?</h3>
                    <p>Don't do the math manually. Our India Tax Calculator does it all for you in seconds.</p>
                    <Link to="/india-tax-calculator" className="btn-calculate" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}>Open India Tax Calculator</Link>
                </div>
            </article>

            <TryNextCalculator currentPath="/guides/how-to-calculate-income-tax-india" />
        </div>
    );
}
