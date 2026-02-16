import { Link } from 'react-router-dom';

const calculatorLinks = [
    { path: '/compound-interest-calculator', label: 'Compound Interest' },
    { path: '/loan-payoff-calculator', label: 'Loan Payoff' },
    { path: '/retirement-calculator', label: 'Retirement' },
    { path: '/sip-calculator', label: 'SIP Calculator India' },
    { path: '/emi-calculator', label: 'EMI Calculator India' },
    { path: '/india-tax-calculator', label: 'India Tax Calculator' },
    { path: '/gst-calculator', label: 'GST Calculator India' },
    { path: '/hra-calculator', label: 'HRA Calculator India' },
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
