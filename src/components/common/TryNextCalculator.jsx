import { Link } from 'react-router-dom';

const allCalculators = [
    { path: '/sip-calculator', name: 'SIP Calculator India', desc: 'Estimate future wealth from your mutual fund SIP.' },
    { path: '/emi-calculator', name: 'EMI Calculator India', desc: 'Calculate monthly payments for Home or Car loans.' },
    { path: '/india-tax-calculator', name: 'India Tax Calculator', desc: 'Compare New vs Old tax regimes for 2024-25.' },
    { path: '/hra-calculator', name: 'HRA Calculator India', desc: 'Calculate your house rent tax exemption.' },
    { path: '/fire-calculator', name: 'FIRE Calculator India', desc: 'Plan your early retirement and financial freedom.' },
    { path: '/gst-calculator', name: 'GST Calculator India', desc: 'Quickly calculate GST inclusive and exclusive prices.' },
];

/**
 * TryNextCalculator — Recommends other calculators
 */
export default function TryNextCalculator({ currentPath }) {
    const others = allCalculators.filter(c => c.path !== currentPath);

    return (
        <section className="try-next-section" aria-labelledby="try-next-heading">
            <h2 id="try-next-heading">Try Another Calculator</h2>
            <div className="try-next-grid">
                {others.map(calc => (
                    <Link key={calc.path} to={calc.path} className="try-next-card">
                        <h4>{calc.name}</h4>
                        <p>{calc.desc}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
