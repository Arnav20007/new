import { Link } from 'react-router-dom';

const calculatorLinks = [
    { path: '/mortgage-calculator', label: 'Mortgage Calculator USA' },
    { path: '/401k-calculator', label: '401(k) Calculator' },
    { path: '/retirement-calculator', label: 'Retirement & Roth IRA' },
    { path: '/compound-interest-calculator', label: 'Compound Interest' },
    { path: '/loan-payoff-calculator', label: 'Loan Payoff' },
    { path: '/credit-card-payoff-calculator', label: 'Credit Card Payoff USA' },
    { path: '/sip-calculator', label: 'SIP Calculator' },
    { path: '/emi-calculator', label: 'EMI Calculator' },
];

/**
 * InternalLinks — Chip-style internal navigation for SEO link equity
 */
export default function InternalLinks({ currentPath }) {
    const links = calculatorLinks.filter(l => l.path !== currentPath);

    return (
        <div className="internal-links">
            <h3>Related Financial Calculators</h3>
            <div className="internal-links-grid">
                {links.map(link => (
                    <Link key={link.path} to={link.path} className="internal-link-chip">
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
