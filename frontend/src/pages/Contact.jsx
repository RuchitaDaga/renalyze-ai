import React from "react";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message. This is a demo UI – backend will be added later.");
  };

  return (
    <section className="page-shell contact-page">
      <div className="contact-header">
        <h1>Contact &amp; Feedback</h1>
        <p className="lead">
          Have suggestions, ideas or want to report an issue with Renalyze AI?
          Share your thoughts below – feedback helps improve both the project
          and the learning behind it.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-panel">
          <h2>Send a message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-row">
              <label>
                Full name
                <input type="text" placeholder="Your full name" required />
              </label>
              <label>
                Email
                <input type="email" placeholder="you@example.com" required />
              </label>
            </div>

            <label>
              Subject
              <input
                type="text"
                placeholder="Feedback, suggestion, bug report..."
                required
              />
            </label>

            <label>
              Message
              <textarea
                rows="4"
                placeholder="Describe your feedback, idea, or issue in detail..."
                required
              />
            </label>

            <label className="contact-select-label">
              How would you describe yourself?
              <select defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                <option>Doctor / clinician</option>
                <option>Medical / engineering student</option>
                <option>Patient / family member</option>
                <option>Researcher / data scientist</option>
                <option>Other</option>
              </select>
            </label>

            <button type="submit" className="btn-primary contact-submit">
              Submit feedback
            </button>
          </form>
        </div>

        <aside className="contact-side-panel">
          <h2>Before you write</h2>
          <p>
            Renalyze AI is an academic / learning project focused on CKD
            screening. It is not a certified medical device.
          </p>
          <ul>
            <li>Do not share any sensitive personal identifiers.</li>
            <li>
              For urgent health concerns, contact a hospital or nephrologist
              directly.
            </li>
            <li>
              Feature requests, UI ideas, model questions – all are welcome 😊
            </li>
          </ul>

          <div className="contact-meta">
            <p>
              <strong>Typical response:</strong> Within a few days (project /
              demo context).
            </p>
            <p className="contact-small">
              Messages from teachers or clinicians about using Renalyze AI in
              class, viva or demonstrations are especially appreciated.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Contact;
