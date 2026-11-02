import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Predict() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    bp: "",
    sg: "",
    al: "",
    su: "",
    rbc: "normal",
    pc: "normal",
    pcc: "not present",
    ba: "not present",
    bgr: "",
    bu: "",
    sc: "",
    sodium: "",
    potassium: "",
    hemo: "",
    pcv: "",
    wc: "",
    rc: "",
    htn: "no",
    dm: "no",
    cad: "no",
    appet: "good",
    pe: "no",
    ane: "no",

    egfr: "",
    upr: "",
    urine_output: "",
    serum_albumin: "",
    cholesterol: "",
    pth: "",
    serum_calcium: "",
    serum_phosphate: "",

    family_history: "no",
    smoking: "no",
    bmi: "",
    physical_activity: "moderate",
    dm_duration: "",
    htn_duration: "",

    cystatin_c: "",
    microscopy: "normal",
    crp: "",
    il6: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // "" -> null, otherwise Number(...)
  const num = (v) => (v === "" ? null : Number(v));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      age: "",
      bp: "",
      sg: "",
      al: "",
      su: "",
      rbc: "normal",
      pc: "normal",
      pcc: "not present",
      ba: "not present",
      bgr: "",
      bu: "",
      sc: "",
      sodium: "",
      potassium: "",
      hemo: "",
      pcv: "",
      wc: "",
      rc: "",
      htn: "no",
      dm: "no",
      cad: "no",
      appet: "good",
      pe: "no",
      ane: "no",

      egfr: "",
      upr: "",
      urine_output: "",
      serum_albumin: "",
      cholesterol: "",
      pth: "",
      serum_calcium: "",
      serum_phosphate: "",

      family_history: "no",
      smoking: "no",
      bmi: "",
      physical_activity: "moderate",
      dm_duration: "",
      htn_duration: "",

      cystatin_c: "",
      microscopy: "normal",
      crp: "",
      il6: "",
    });
    setError(null);
  };

  const handlePredictClick = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        "Age of the patient": num(formData.age),
        "Blood pressure (mm/Hg)": num(formData.bp),
        "Specific gravity of urine": num(formData.sg),
        "Albumin in urine": num(formData.al),
        "Sugar in urine": num(formData.su),
        "Red blood cells in urine": formData.rbc,
        "Pus cells in urine": formData.pc,
        "Pus cell clumps in urine": formData.pcc,
        "Bacteria in urine": formData.ba,
        "Random blood glucose level (mg/dl)": num(formData.bgr),
        "Blood urea (mg/dl)": num(formData.bu),
        "Serum creatinine (mg/dl)": num(formData.sc),
        "Sodium level (mEq/L)": num(formData.sodium),
        "Potassium level (mEq/L)": num(formData.potassium),
        "Hemoglobin level (gms)": num(formData.hemo),
        "Packed cell volume (%)": num(formData.pcv),
        "White blood cell count (cells/cumm)": num(formData.wc),
        "Red blood cell count (millions/cumm)": num(formData.rc),
        "Hypertension (yes/no)": formData.htn,
        "Diabetes mellitus (yes/no)": formData.dm,
        "Coronary artery disease (yes/no)": formData.cad,
        "Appetite (good/poor)": formData.appet,
        "Pedal edema (yes/no)": formData.pe,
        "Anemia (yes/no)": formData.ane,

        "Estimated Glomerular Filtration Rate (eGFR)": num(formData.egfr),
        "Urine protein-to-creatinine ratio": num(formData.upr),
        "Urine output (ml/day)": num(formData.urine_output),
        "Serum albumin level": num(formData.serum_albumin),
        "Cholesterol level": num(formData.cholesterol),
        "Parathyroid hormone (PTH) level": num(formData.pth),
        "Serum calcium level": num(formData.serum_calcium),
        "Serum phosphate level": num(formData.serum_phosphate),

        "Family history of chronic kidney disease": formData.family_history,
        "Smoking status": formData.smoking,
        "Body Mass Index (BMI)": num(formData.bmi),
        "Physical activity level": formData.physical_activity,
        "Duration of diabetes mellitus (years)": num(formData.dm_duration),
        "Duration of hypertension (years)": num(formData.htn_duration),

        "Cystatin C level": num(formData.cystatin_c),
        "Urinary sediment microscopy results": formData.microscopy,
        "C-reactive protein (CRP) level": num(formData.crp),
        "Interleukin-6 (IL-6) level": num(formData.il6),
      };

      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 🔕 no Authorization header anymore
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      navigate("/result", {
        state: { formData, prediction: data },
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell predict-page">
      <h1>Full CKD Medical Prediction</h1>
      <p>Enter detailed clinical and laboratory information for CKD risk assessment.</p>

      <div className="form-grid">
        {/* 1. Core Kidney & Urine */}
        <div className="form-card">
          <h2>Core Kidney & Urine</h2>
          <label>
            Age (years)
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </label>
          <label>
            Blood Pressure (mm/Hg)
            <input
              type="number"
              name="bp"
              value={formData.bp}
              onChange={handleChange}
            />
          </label>
          <label>
            Specific Gravity of Urine
            <input
              type="number"
              step="0.001"
              name="sg"
              value={formData.sg}
              onChange={handleChange}
            />
          </label>
          <label>
            Albumin in Urine
            <input
              type="number"
              name="al"
              value={formData.al}
              onChange={handleChange}
            />
          </label>
          <label>
            Sugar in Urine
            <input
              type="number"
              name="su"
              value={formData.su}
              onChange={handleChange}
            />
          </label>
          <label>
            Red Blood Cells in Urine
            <select
              name="rbc"
              value={formData.rbc}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
            </select>
          </label>
          <label>
            Pus Cells in Urine
            <select
              name="pc"
              value={formData.pc}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
            </select>
          </label>
          <label>
            Pus Cell Clumps
            <select
              name="pcc"
              value={formData.pcc}
              onChange={handleChange}
            >
              <option value="not present">Not Present</option>
              <option value="present">Present</option>
            </select>
          </label>
          <label>
            Bacteria in Urine
            <select
              name="ba"
              value={formData.ba}
              onChange={handleChange}
            >
              <option value="not present">Not Present</option>
              <option value="present">Present</option>
            </select>
          </label>
        </div>

        {/* 2. Blood Chemistry */}
        <div className="form-card">
          <h2>Blood Chemistry</h2>
          <label>
            Random Blood Glucose (mg/dl)
            <input
              type="number"
              name="bgr"
              value={formData.bgr}
              onChange={handleChange}
            />
          </label>
          <label>
            Blood Urea (mg/dl)
            <input
              type="number"
              name="bu"
              value={formData.bu}
              onChange={handleChange}
            />
          </label>
          <label>
            Serum Creatinine (mg/dl)
            <input
              type="number"
              step="0.01"
              name="sc"
              value={formData.sc}
              onChange={handleChange}
            />
          </label>
          <label>
            Sodium (mEq/L)
            <input
              type="number"
              name="sodium"
              value={formData.sodium}
              onChange={handleChange}
            />
          </label>
          <label>
            Potassium (mEq/L)
            <input
              type="number"
              step="0.01"
              name="potassium"
              value={formData.potassium}
              onChange={handleChange}
            />
          </label>
          <label>
            Hemoglobin (g/dl)
            <input
              type="number"
              step="0.1"
              name="hemo"
              value={formData.hemo}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* 3. Blood Counts */}
        <div className="form-card">
          <h2>Blood Counts</h2>
          <label>
            Packed Cell Volume (%)
            <input
              type="number"
              name="pcv"
              value={formData.pcv}
              onChange={handleChange}
            />
          </label>
          <label>
            WBC Count (cells/cumm)
            <input
              type="number"
              name="wc"
              value={formData.wc}
              onChange={handleChange}
            />
          </label>
          <label>
            RBC Count (millions/cumm)
            <input
              type="number"
              step="0.1"
              name="rc"
              value={formData.rc}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* 4. Clinical History */}
        <div className="form-card">
          <h2>Clinical History</h2>
          <label>
            Hypertension
            <select
              name="htn"
              value={formData.htn}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Diabetes Mellitus
            <select
              name="dm"
              value={formData.dm}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Coronary Artery Disease
            <select
              name="cad"
              value={formData.cad}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Appetite
            <select
              name="appet"
              value={formData.appet}
              onChange={handleChange}
            >
              <option value="good">Good</option>
              <option value="poor">Poor</option>
            </select>
          </label>
          <label>
            Pedal Edema
            <select
              name="pe"
              value={formData.pe}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Anemia
            <select
              name="ane"
              value={formData.ane}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Family History of CKD
            <select
              name="family_history"
              value={formData.family_history}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Smoking Status
            <select
              name="smoking"
              value={formData.smoking}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Physical Activity Level
            <select
              name="physical_activity"
              value={formData.physical_activity}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        {/* 5. Advanced Renal Function */}
        <div className="form-card">
          <h2>Advanced Renal Function</h2>
          <label>
            eGFR (ml/min/1.73m²)
            <input
              type="number"
              name="egfr"
              value={formData.egfr}
              onChange={handleChange}
            />
          </label>
          <label>
            Urine Protein-to-Creatinine Ratio
            <input
              type="number"
              step="0.01"
              name="upr"
              value={formData.upr}
              onChange={handleChange}
            />
          </label>
          <label>
            Urine Output (ml/day)
            <input
              type="number"
              name="urine_output"
              value={formData.urine_output}
              onChange={handleChange}
            />
          </label>
          <label>
            Serum Albumin (g/dL)
            <input
              type="number"
              step="0.01"
              name="serum_albumin"
              value={formData.serum_albumin}
              onChange={handleChange}
            />
          </label>
          <label>
            Cholesterol (mg/dL)
            <input
              type="number"
              name="cholesterol"
              value={formData.cholesterol}
              onChange={handleChange}
            />
          </label>
          <label>
            PTH (pg/mL)
            <input
              type="number"
              name="pth"
              value={formData.pth}
              onChange={handleChange}
            />
          </label>
          <label>
            Serum Calcium (mg/dL)
            <input
              type="number"
              step="0.01"
              name="serum_calcium"
              value={formData.serum_calcium}
              onChange={handleChange}
            />
          </label>
          <label>
            Serum Phosphate (mg/dL)
            <input
              type="number"
              step="0.01"
              name="serum_phosphate"
              value={formData.serum_phosphate}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* 6. Durations & Biomarkers */}
        <div className="form-card">
          <h2>Durations & Biomarkers</h2>
          <label>
            Duration of Diabetes (years)
            <input
              type="number"
              name="dm_duration"
              value={formData.dm_duration}
              onChange={handleChange}
            />
          </label>
          <label>
            Duration of Hypertension (years)
            <input
              type="number"
              name="htn_duration"
              value={formData.htn_duration}
              onChange={handleChange}
            />
          </label>
          <label>
            BMI
            <input
              type="number"
              step="0.1"
              name="bmi"
              value={formData.bmi}
              onChange={handleChange}
            />
          </label>
          <label>
            Cystatin C
            <input
              type="number"
              step="0.01"
              name="cystatin_c"
              value={formData.cystatin_c}
              onChange={handleChange}
            />
          </label>
          <label>
            Urinary Sediment Microscopy
            <select
              name="microscopy"
              value={formData.microscopy}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
            </select>
          </label>
          <label>
            CRP
            <input
              type="number"
              step="0.01"
              name="crp"
              value={formData.crp}
              onChange={handleChange}
            />
          </label>
          <label>
            IL-6
            <input
              type="number"
              step="0.01"
              name="il6"
              value={formData.il6}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button
          className="btn-outline"
          onClick={handleReset}
          disabled={loading}
        >
          Reset Form
        </button>
        <button
          className="btn-primary"
          onClick={handlePredictClick}
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict CKD"}
        </button>
      </div>

      {error && (
        <p className="error-text" style={{ marginTop: "1rem", color: "#ff6b6b" }}>
          {error}
        </p>
      )}
    </section>
  );
}

export default Predict;
