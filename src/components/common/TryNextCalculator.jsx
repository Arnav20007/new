import { Link } from 'react-router-dom';

const allCalculators = [
    { path: '/mortgage-calculator', name: 'Mortgage Calculator Global', desc: 'Calculate PITI payments and see your amortization schedule.' },
    { path: '/401k-calculator', name: '401(k) Calculator Global', desc: 'Optimize your retirement savings with employer matching.' },
    { path: '/retirement-calculator', name: 'Retirement & Roth IRA', desc: 'Plan your long-term wealth and safe withdrawal strategy.' },
    { path: '/compound-interest-calculator', name: 'Compound Interest', desc: 'See how regular investments grow over time.' },
    { path: '/credit-card-payoff-calculator', name: 'Credit Card Payoff', desc: 'Find the fastest way to become debt-free.' },
    { path: '/inflation-calculator', name: 'Inflation Calculator', desc: 'See how inflation impacts your future purchasing power.' },
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

