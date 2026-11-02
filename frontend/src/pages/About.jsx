import React from "react";

function About() {
  return (
    <section className="page-shell generic-page">
      <h1>About Renalyze AI</h1>
      <p className="lead">
        Renalyze AI is an AI-powered web application designed to assist in the early
        detection and risk assessment of Chronic Kidney Disease (CKD).
      </p>

      <div className="page-shell generic-grid">
        <div className="info-card">
          <h2>What is CKD?</h2>
          <p>
            Chronic Kidney Disease is a long-term condition where the kidneys
            gradually lose their function. Early stages often have no symptoms,
            which makes timely screening very important.
          </p>
        </div>

        <div className="info-card">
          <h2>Why Renalyze AI?</h2>
          <p>
            Renalyze AI helps doctors, students and patients quickly analyze
            routine clinical parameters and estimate the likelihood of CKD using
            a trained machine learning model.
          </p>
        </div>

        <div className="info-card">
          <h2>Technologies Used</h2>
          <ul>
            <li>Python &amp; Machine Learning</li>
            <li>CatBoost Classifier</li>
            <li>React-based web interface</li>
            <li>Planned backend with FastAPI / Flask</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
