import React from 'react';
import { TEAM_MEMBERS } from '../data';

function HomePage({ onLogin, onSignup }) {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-logo">SlotShare</div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => scrollToSection('values')}>About</button>
          <button className="nav-link" onClick={() => scrollToSection('team')}>Team</button>
          <button className="nav-btn-ghost" onClick={onLogin}>Sign in</button>
          <button className="nav-btn" onClick={onSignup}>Get started ↗</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div style={{ padding: '40px 24px 0', display: 'flex', justifyContent: 'center' }}>
          <div className="hero-image-wrap">
            <div className="hero-image-overlay" />
            <div className="hero-text">
              <p className="hero-eyebrow">Cebu City · Parking Marketplace</p>
              <h1 className="hero-title">Find. Book. Park.</h1>
              <p className="hero-sub">SlotShare connects commuters with private parking spaces across Cebu's busiest districts.</p>
              <div className="hero-cta">
                <button className="btn-primary" onClick={onSignup}>Create account</button>
                <button className="btn-outline" onClick={onLogin}>Sign in</button>
              </div>
            </div>
            {/* decorative parking grid */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none', opacity: 0.15 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '2px', width: '100%', padding: '0 40px 0' }}>
                {Array.from({length: 24}).map((_,i) => (
                  <div key={i} style={{ height: '60px', background: 'white', borderRadius: '4px 4px 0 0' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div id="values" className="values">
        <h2 className="values-title">What is SlotShare</h2>
        <div className="values-grid" style={{ maxWidth: '1400px', width: '100%' }}>
          <div className="value-card">
            <svg className="value-icon" viewBox="0 0 42 42" fill="none"><path d="M21 0C32.598 0 42 9.402 42 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0zM20 2.025C9.971 2.545 2 10.842 2 21s7.971 18.454 18 18.974V2.025zM22 22v17.974C31.697 39.471 39.472 31.697 39.975 22H22zm0-2h17.975C39.472 10.303 31.697 2.528 22 2.025V20z" fill="currentColor"/></svg>
            <div>
              <div className="value-card-title">AirBnB Style</div>
              <div className="value-card-body">An AirBnB-style platform tailored for commuters — an alternative solution for limited parking spaces.</div>
            </div>
          </div>
          <div className="value-card">
            <svg className="value-icon" viewBox="0 0 42 42" fill="none"><path d="M21 0C32.598 0 42 9.402 42 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0zm0 2C10.507 2 2 10.507 2 21s8.507 19 19 19 19-8.507 19-19S31.493 2 21 2zm9 8v14.495h-2V15.414L13.707 29.707 12.293 28.293 26.586 14H15.505V12H30z" fill="currentColor"/></svg>
            <div>
              <div className="value-card-title">CCTO Compliance</div>
              <div className="value-card-body">Coordinated with CCTO to maintain parking rates and avoid disrupting established price structures.</div>
            </div>
          </div>
          <div className="value-card">
            <svg className="value-icon" viewBox="0 0 42 42" fill="none"><path d="M21 0C32.598 0 42 9.402 42 21s-9.402 21-21 21S0 32.598 0 21 9.402 0 21 0zm6.9 30.462c-2.165.348-4.488.538-6.9.538s-4.735-.19-6.9-.538c.395 1.579.884 3.016 1.448 4.269C17.148 38.288 19.153 40 21 40s3.852-1.712 5.452-5.269c.564-1.253 1.052-2.69 1.448-4.269z" fill="currentColor"/></svg>
            <div>
              <div className="value-card-title">Parking Space Renting</div>
              <div className="value-card-body">Private parking spaces rented to commuters easily with in-app booking and digital payment integration.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Founder story */}
      <div className="founder">
        <div className="founder-inner">
          <div className="founder-image">
            <div style={{ position: 'relative', zIndex: 1, padding: '40px', color: 'white' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', opacity: 0.6, marginBottom: '12px' }}>CIT-U · Cebu City</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.8px', lineHeight: 1.1 }}>A student-built<br/>marketplace for<br/>real-world impact</div>
            </div>
            {/* parking icon decoration */}
            <div style={{ position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', opacity: 0.2 }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
            </div>
          </div>
          <div className="founder-quote">
            <p className="founder-eyebrow">Founder's story</p>
            <h2 className="founder-heading">A CIT Project</h2>
            <div className="founder-text">
              <p>SlotShare is a parking marketplace platform developed by students from the Cebu Institute of Technology – University (CIT-U) as part of their academic project in systems analysis and design.</p>
              <p>The platform was conceptualized to address growing parking congestion in busy urban areas such as IT Park and Capitol Site in Cebu City, where BPO employees spend 30+ minutes daily searching for parking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div id="team" className="team">
        <div className="team-inner">
          <h2 className="team-title">Meet the team</h2>
          <div className="team-table">
            <div className="team-labels">
              <span>Name</span><span>Title</span><span style={{ textAlign: 'right' }}>Contact</span>
            </div>
            {TEAM_MEMBERS.map(m => (
              <div key={m.email} className="team-row">
                <span className="team-name">{m.name}</span>
                <span className="team-role">{m.title}</span>
                <a className="team-email" href={`mailto:${m.email}`}>{m.email}</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-banner">
        <h2 className="cta-title">Get Started Now!</h2>
        <p className="cta-sub">Join the parking revolution. List your space or find a spot in seconds.</p>
        <div className="cta-actions">
          <button className="btn-white" onClick={onSignup}>Create free account</button>
          <button className="btn-ghost-white" onClick={onLogin}>Sign in</button>
        </div>
      </div>

      <div className="footer">
        <div className="footer-inner">
          <div className="footer-brand">SlotShare</div>
          <div className="footer-copy">© 2026 CIT-U Systems Project. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;