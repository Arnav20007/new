import React from 'react';
import SEOHead from '../components/common/SEOHead';
import { Link } from 'react-router-dom';

export default function Contact() {
    return (
        <div className="contact-page">
            <SEOHead
                title="Contact Us – FinanceCalc"
                description="Get in touch with FinanceCalc for inquiries, feedback, or support regarding our financial calculators."
                canonical="/contact"
            />

            <nav className="breadcrumbs">
                <Link to="/">Home</Link>
                <span>/</span>
                <span>Contact Us</span>
            </nav>

            <section className="contact-hero" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Contact Us</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Have questions or feedback? We'd love to hear from you.
                    Reach out to us via email or phone.
                </p>
            </section>

            <section className="contact-info" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div className="contact-card" style={{ background: 'var(--bg-glass)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-primary)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Email</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Send us an email anytime.</p>
                    <a href="mailto:mauryatulofficial@gmail.com" style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' }}>
                        mauryatulofficial@gmail.com
                    </a>
                </div>

                <div className="contact-card" style={{ background: 'var(--bg-glass)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-primary)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Phone</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Call us for urgent inquiries.</p>
                    <a href="tel:+917080091179" style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' }}>
                        +91 7080091179
                    </a>
                </div>
            </section>

            <section className="privacy-commitment" style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', marginBottom: '4rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Our Privacy Commitment</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    FinanceCalc is a privacy-first platform. We do not store your financial data or sell your contact information to third parties.
                    Any communication with us is kept strictly confidential.
                </p>
            </section>
        </div>
    );
}
