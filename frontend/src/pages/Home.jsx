import React from "react";
import { useNavigate, Link } from "react-router-dom";
import RevealSection from "../components/RevealSection.jsx";
import logo from "../assets/renalyze-logo.png";

function Home() {
  const navigate = useNavigate();

  const handleCheckCKD = () => {
    navigate("/predict");
  };

  const handleScrollToFeatures = () => {
    const el = document.getElementById("features-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      {/* FULLSCREEN HERO */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-text">
            {/* Logo + eyebrow */}
            <div className="hero-logo-mark">
              <img src={logo} alt="Renalyze AI logo" />
            </div>
            <p className="eyebrow">AI · HEALTHCARE · CKD SCREENING</p>

            <h1>Renalyze AI</h1>
            <h2>Smart Chronic Kidney Disease Detection System</h2>
            <p className="hero-subtitle">
              Early, AI-assisted screening for Chronic Kidney Disease using
              routine clinical and laboratory parameters. Clear enough for
              students, useful enough for clinicians.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary big" onClick={handleCheckCKD}>
                Check CKD Now
              </button>
              <Link to="/about" className="btn-outline big">
                Learn About CKD
              </Link>
            </div>

            <div className="hero-meta">
              <span>⚕️ AI-based medical support</span>
              <span>📊 Stage &amp; risk insight</span>
              <span>⏱️ Instant web prediction</span>
            </div>
          </div>

          <div className="hero-bottom-row">
            <div className="hero-highlight-card">
              <h3>Why Renalyze AI?</h3>
              <p>
                A focused assistant for CKD risk estimation – not a replacement
                for doctors, but a smart companion for them.
              </p>
              <ul>
                <li>✔ Trained CKD-specific ML model</li>
                <li>✔ Consistent, quick risk screening</li>
                <li>✔ Clean interface for busy clinics</li>
              </ul>
            </div>

            <div className="hero-stats">
              <div className="stat-pill">
                <span className="stat-label">Domain</span>
                <span className="stat-value">Kidney · CKD</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Interface</span>
                <span className="stat-value">Web App</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Goal</span>
                <span className="stat-value">Early Screening</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="scroll-indicator-btn"
          type="button"
          onClick={handleScrollToFeatures}
        >
          <span>Scroll to explore</span>
          <div className="scroll-dot" />
        </button>
      </section>

      {/* FEATURES – reveal on scroll + horizontal Stripe-style cards */}
      <RevealSection delay={0} className="features-wrapper" id="features-section">
        <div className="section-header">
          <h2>Key Features</h2>
          <p>
            Renalyze AI focuses on clarity, interpretability and ease of use so
            that healthcare professionals can quickly understand each result.
          </p>
        </div>

        <div className="features-scroll">
          <div className="features-row">
            <article className="feature-card feature-card-big">
              <span className="feature-icon">🧠</span>
              <h3>AI-Based Detection</h3>
              <p>
                A CKD-focused machine learning model looks at multiple
                parameters together instead of in isolation, giving a more
                informed risk estimate.
              </p>
            </article>

            <article className="feature-card feature-card-big">
              <span className="feature-icon">📊</span>
              <h3>Stage Estimation</h3>
              <p>
                The system can be extended to approximate CKD stages, helping
                clinicians judge how far the disease may have progressed.
              </p>
            </article>

            <article className="feature-card feature-card-big">
              <span className="feature-icon">🛡️</span>
              <h3>Risk Insights</h3>
              <p>
                Probability scores and Low / Medium / High labels support
                triaging – who needs closer follow-up and who is lower risk.
              </p>
            </article>

            <article className="feature-card feature-card-big">
              <span className="feature-icon">🎓</span>
              <h3>Education Friendly</h3>
              <p>
                Designed so students can clearly see which inputs go in and what
                kind of prediction comes out – perfect for viva and demos.
              </p>
            </article>
          </div>
        </div>
      </RevealSection>

      {/* BUILT FOR LEARNING / PRACTICE SECTION */}
      <RevealSection delay={150} className="split-section-wrapper">
        <div className="split-section">
          <div className="split-left">
            <h2>Built for learning and real-world practice</h2>
            <p>
              For someone exploring
              healthcare AI or a doctor experimenting with decision-support
              tools, Renalyze AI is designed to be approachable and transparent.
            </p>
           
          </div>
          <div className="split-right">
            <div className="mini-stat">
              <span className="stat-label">Mode</span>
              <span className="stat-value">Assistive</span>
            </div>
            <div className="mini-stat">
              <span className="stat-label">Prediction</span>
              <span className="stat-value">CKD + Stage</span>
            </div>
            <div className="mini-stat">
              <span className="stat-label">Platform</span>
              <span className="stat-value">Web &amp; Cloud</span>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* WHO IS RENALYZE AI FOR? */}
      <RevealSection delay={250} className="who-section-wrapper">
        <div className="section-header">
          <h2>Who is Renalyze AI for?</h2>
          <p>
            Renalyze AI is not meant to replace doctors. It supports the people
            who learn about, work with, or live with CKD.
          </p>
        </div>

        <div className="who-grid">
          <article className="who-card">
            <div className="who-icon">👨‍⚕️</div>
            <h3>Doctors &amp; Clinicians</h3>
            <p>
              Use as a quick screening assistant alongside lab reports and
              clinical judgement – especially in busy OPDs or camps.
            </p>
            <ul>
              <li>Quick CKD risk snapshot</li>
              <li>Supports, not replaces, decisions</li>
              <li>Great for patient education</li>
            </ul>
          </article>

          <article className="who-card">
            <div className="who-icon">🎓</div>
            <h3>Students &amp; Researchers</h3>
            <p>
              Understand how medical data flows into an AI model and how the
              predictions can be visualised and explained.
            </p>
            <ul>
              <li>Perfect for viva / projects</li>
              <li>Clear input → model → output flow</li>
              <li>Can be extended for experiments</li>
            </ul>
          </article>

          <article className="who-card">
            <div className="who-icon">🧑‍🦰</div>
            <h3>Patients &amp; Families</h3>
            <p>
              Gives a simple, friendly view of potential CKD risk using
              commonly available medical test values.
            </p>
            <ul>
              <li>Easy-to-read risk language</li>
              <li>Encourages early checkups</li>
              <li>Helps discuss with doctors</li>
            </ul>
          </article>
        </div>
      </RevealSection>

      {/* MEDICAL DISCLAIMER STRIP */}
      <section className="disclaimer-strip">
        <p>
          ⚠️ <strong>Disclaimer:</strong> Renalyze AI is an educational and
          decision-support tool. It does not provide a medical diagnosis and
          must not be used as a substitute for professional clinical judgement.
          Always consult a qualified doctor or nephrologist.
        </p>
      </section>
    </div>
  );
}

export default Home;
