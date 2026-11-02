import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const { prediction } = location.state || {};

  if (!prediction) {
    return (
      <section className="page-shell result-page">
        <div className="result-card" style={{ padding: "2.5rem 3rem" }}>
          <h1>Prediction Result</h1>
          <p>No prediction data found.</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/predict")}
          >
            Go to Predict CKD
          </button>
        </div>
      </section>
    );
  }

  /* ===============================
        BASIC MODEL OUTPUT
  =============================== */

  const risk = prediction?.risk || "Unknown";
  const probability = prediction?.probability ?? null;
  const topFeatures = prediction?.top_features || [];

  const progressionRisk =
    prediction?.progression_risk ?? null;

  const progressionLabel =
    prediction?.progression_label ||
    "Not available";

  /* ===============================
        RISK INTERPRETATION
  =============================== */

  const riskLabelMap = {
    No_Disease: "No CKD detected",
    Low_Risk: "Low CKD risk",
    Moderate_Risk: "Moderate CKD risk",
    High_Risk: "High CKD risk",
    Severe_Disease: "Advanced CKD",
  };

  const badgeColorMap = {
    No_Disease: "#22c55e",
    Low_Risk: "#22c55e",
    Moderate_Risk: "#eab308",
    High_Risk: "#f97316",
    Severe_Disease: "#ef4444",
    Unknown: "#64748b",
  };

  const statusText =
    riskLabelMap[risk] || "Risk not available";

  const badgeColor =
    badgeColorMap[risk] ||
    badgeColorMap.Unknown;

  const probPercent =
    probability != null
      ? probability * 100
      : null;

  const formattedProb =
    probPercent != null
      ? `${probPercent.toFixed(2)}%`
      : "—";

  const isNoDisease =
    risk === "No_Disease" ||
    risk === "Low_Risk";

  /* ===============================
        PROGRESSION COLORS
  =============================== */

  let progressionColor = "#64748b";

  if (progressionRisk != null) {
    if (progressionRisk < 0.3)
      progressionColor = "#22c55e";
    else if (progressionRisk < 0.7)
      progressionColor = "#eab308";
    else progressionColor = "#ef4444";
  }

  const progressionPercent =
    progressionRisk != null
      ? (progressionRisk * 100).toFixed(2)
      : "—";

  /* ===============================
        IMPACT HELPERS
  =============================== */

  const classifyImpact = (impact) => {
    if (impact > 0) return "Risk Increasing";
    if (impact < 0) return "Protective";
    return "Neutral";
  };

  const impactColor = (impact) => {
    if (impact > 0) return "#f97316";
    if (impact < 0) return "#22c55e";
    return "#94a3b8";
  };

  /* ===============================
        UI
  =============================== */

  return (
    <section className="page-shell result-page">
      <div
        className="result-card"
        style={{
          padding: "2.5rem 3rem",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        {/* ================= HEADER ================= */}

        <header style={{ marginBottom: "2rem" }}>
          <h1>🧠 CKD Clinical Assessment</h1>

          <h2>
            CKD Status:{" "}
            <span
              style={{
                color: isNoDisease
                  ? "#22c55e"
                  : "#ef4444",
                fontWeight: 700,
              }}
            >
              {statusText}
            </span>
          </h2>

          <p>
            Model Confidence:
            <strong> {formattedProb}</strong>
          </p>
        </header>

        {/* ================= PROGRESSION PANEL ================= */}

        <div
          style={{
            padding: "1.5rem",
            borderRadius: "1rem",
            marginBottom: "2rem",
            background:
              "linear-gradient(135deg,#0f172a,#1e293b)",
            border:
              "1px solid rgba(148,163,184,0.25)",
          }}
        >
          <h3>
            📈 Disease Progression Intelligence
          </h3>

          <p>
            Future Kidney Decline Risk:{" "}
            <strong
              style={{
                color: progressionColor,
              }}
            >
              {progressionLabel}
            </strong>
          </p>

          <div
            style={{
              height: "10px",
              background: "#020617",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressionPercent}%`,
                height: "100%",
                background: progressionColor,
                transition: "0.4s",
              }}
            />
          </div>

          <p style={{ marginTop: "6px" }}>
            Progression likelihood:
            {` ${progressionPercent}%`}
          </p>
        </div>

        {/* ================= EXPLAINABILITY ================= */}

        <div
          className="result-explainability"
          style={{
            padding: "1.75rem",
            borderRadius: "1rem",
            background:
              "rgba(15,23,42,0.9)",
            marginBottom: "2rem",
          }}
        >
          <h3>
            Top Contributing Parameters
          </h3>

          {topFeatures.map(
            (feat, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  padding: "10px",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div>
                  <strong>
                    {feat.name}
                  </strong>
                  <div>
                    Value:{" "}
                    {feat.value ??
                      "—"}
                  </div>
                </div>

                <div
                  style={{
                    color:
                      impactColor(
                        feat.impact
                      ),
                  }}
                >
                  {classifyImpact(
                    feat.impact
                  )}
                  <br />
                  Impact:
                  {` ${feat.impact.toFixed(
                    2
                  )}`}
                </div>
              </div>
            )
          )}
        </div>

        {/* ================= ACTIONS ================= */}

        <div
          style={{
            display: "flex",
            gap: "1rem",
          }}
        >
          <button
            className="btn-outline"
            onClick={() =>
              navigate("/predict")
            }
          >
            Check Another Patient
          </button>

          <button
            className="btn-primary"
            onClick={() =>
              navigate("/")
            }
          >
            Home
          </button>
        </div>
      </div>
    </section>
  );
}

export default Result;