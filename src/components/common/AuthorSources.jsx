import React from 'react';

/**
 * AuthorSources — Component to display Author info and Sources/References
 * Includes "Last Updated" automation.
 */
export default function AuthorSources() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <section className="author-sources-section" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-primary)' }}>
            <div className="author-card" style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Author: Arnav Singh</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    Arnav is a Computer Science Engineering student and the creator of FinanceCalc.
                    He builds privacy-first financial tools to help students and beginners understand money,
                    loans, and investments using simple, transparent calculations.
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Last updated: {lastUpdated}
                </div>
            </div>

            <div className="sources-section">
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Sources & References</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>
                    <li>• Reserve Bank of India (RBI) – Master Directions on Interest Rates.</li>
                    <li>• Income Tax Department, Government of India – Section 10(13A) and Section 80C.</li>
                    <li>• Securities and Exchange Board of India (SEBI) – Mutual Fund Performance Standards.</li>
                    <li>• Internal Revenue Service (IRS) – 401(k) and IRA Contribution Limits.</li>
                    <li>• U.S. Federal Reserve – Historical Consumer Price Index (CPI) Data.</li>
                </ul>
            </div>
        </section>
    );
}
