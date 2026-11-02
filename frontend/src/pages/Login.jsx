import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setInfo("");
    setLoading(true);

    // 🔕 No real authentication – just a demo message
    setTimeout(() => {
      setInfo(
        "Authentication is disabled in this demo build. Login form is for UI only."
      );
      setLoading(false);

      // If you want user to go to predict anyway, uncomment:
      // navigate("/predict");
    }, 500);
  };

  return (
    <section className="page-shell auth-page">
      <div className="auth-card">
        <h1>Sign In</h1>
        <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
          Log in to access CKD prediction and patient explainability tools.
          (Demo mode: authentication is disabled.)
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && (
            <p
              style={{
                color: "#f97373",
                fontSize: "0.9rem",
                marginTop: "0.5rem",
              }}
            >
              {error}
            </p>
          )}

          {info && (
            <p
              style={{
                color: "#4ade80",
                fontSize: "0.9rem",
                marginTop: "0.5rem",
              }}
            >
              {info}
            </p>
          )}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
