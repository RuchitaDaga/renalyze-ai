import React from "react";

function HowItWorks() {
  return (
    <section className="page-shell generic-page">
      <h1>How Renalyze AI Works</h1>
      <p className="lead">
        Renalyze AI follows a simple and transparent pipeline from patient data
        to AI-assisted CKD prediction.
      </p>

      <ol className="steps-list">
        <li>
          <h3>1. Data Entry</h3>
          <p>
            The user enters patient information such as age, blood pressure,
            blood glucose, lab values and clinical conditions on the prediction
            form.
          </p>
        </li>
        <li>
          <h3>2. Preprocessing</h3>
          <p>
            The backend cleans and transforms the input so that it matches the
            format used during model training.
          </p>
        </li>
        <li>
          <h3>3. AI Model Inference</h3>
          <p>
            A trained CatBoost model analyzes the processed data and estimates
            the presence and severity of CKD.
          </p>
        </li>
        <li>
          <h3>4. Risk &amp; Stage Estimation</h3>
          <p>
            The system produces a CKD status, approximate stage and a risk
            level based on the predicted probability.
          </p>
        </li>
        <li>
          <h3>5. Result Visualization</h3>
          <p>
            Results are shown in a clear card-style layout on the Result page
            along with basic advisory text.
          </p>
        </li>
      </ol>
    </section>
  );
}

export default HowItWorks;
