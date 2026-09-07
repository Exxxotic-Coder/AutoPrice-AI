import { Link } from "react-router-dom";
import Gauge from "../components/Gauge.jsx";

const POPULAR_BRANDS = [
  "Acura", "Audi", "BMW", "Cadillac", "Chevrolet", "Dodge", "Ford",
  "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Lexus",
  "Mercedes-Benz", "Nissan", "Porsche", "Subaru", "Toyota", "Volkswagen", "Volvo",
];

const FAQS = [
  {
    q: "How does AutoPrice AI accurately predict vehicle market value?",
    a: "Our machine learning pipeline uses an XGBoost regression model trained on detailed automotive listings. It analyzes 13 distinct features — including engine displacement, horsepower, curb weight, highway MPG, and origin — to compute non-linear feature interactions for high precision valuation.",
  },
  {
    q: "What makes the predictions explainable rather than a black box?",
    a: "Every prediction is accompanied by SHAP (SHapley Additive exPlanations) values. We highlight the top positive and negative contributors — such as high horsepower increasing value or lower city MPG adjusting it — so you understand exactly why the price was estimated.",
  },
  {
    q: "Can I save predictions and export PDF valuation reports?",
    a: "Yes! When signed in, all your predictions are automatically saved to your private history. You can mark favorites, track historical valuation trends on your personal dashboard, and generate formatted PDF reports with a single click.",
  },
  {
    q: "Can I compare two different vehicles side-by-side?",
    a: "Yes, our Compare tool lets you enter specs for two different vehicles simultaneously. AutoPrice AI will calculate estimates for both, compare their gauges, and present side-by-side feature breakdowns.",
  },
];

export default function Home() {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div style={{ flex: "1 1 420px" }}>
          <div className="badge-pill" style={{ marginBottom: 16 }}>
            ⚡ Powered by XGBoost & Explainable AI
          </div>
          <h1 className="display" style={{ fontSize: "2.8rem", lineHeight: 1.15, margin: "0 0 20px" }}>
            Instant, AI-Powered Vehicle Valuation & Analysis
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "1.1rem", maxWidth: 500, lineHeight: 1.6, marginBottom: 28 }}>
            Stop guessing used car prices. Input mechanical specs and get an instant, machine-learning estimated market value backed by clear explanations.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/predict" className="btn btn-primary" style={{ padding: "13px 26px", fontSize: "1rem" }}>
              Predict a Price →
            </Link>
            <Link to="/compare" className="btn btn-secondary" style={{ padding: "13px 22px", fontSize: "1rem" }}>
              Compare Two Cars
            </Link>
          </div>
        </div>

        <div className="panel" style={{ padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flex: "0 0 auto", width: "100%", maxWidth: 380 }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase" }}>
            <span>Live Model Preview</span>
            <span style={{ color: "var(--success)" }}>● Online</span>
          </div>
          <Gauge value={34500} min={10000} max={90000} formattedValue="$34,500" label="Sample 2026 Valuation" />
          <div style={{ background: "var(--surface-2)", borderRadius: 8, padding: 12, width: "100%", fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>✦ High Horsepower (+280 HP)</span> boosted value by +$4,200 vs baseline.
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="stats-banner">
        <div className="stat-item">
          <div className="num">428+</div>
          <div className="lbl">Vehicle Dataset Samples</div>
        </div>
        <div className="stat-item">
          <div className="num">86.8%</div>
          <div className="lbl">Model R² Accuracy</div>
        </div>
        <div className="stat-item">
          <div className="num">&lt; $4.3k</div>
          <div className="lbl">Mean Absolute Error</div>
        </div>
        <div className="stat-item">
          <div className="num">Instant</div>
          <div className="lbl">SHAP Explanations</div>
        </div>
      </section>

      {/* 3-STEP PROCESS SECTION */}
      <section style={{ marginBottom: 70 }}>
        <p className="eyebrow" style={{ textAlign: "center", marginBottom: 8 }}>Simple 3-Step Process</p>
        <h2 className="display" style={{ fontSize: "2rem", textAlign: "center", marginBottom: 36 }}>
          How AutoPrice AI Works
        </h2>
        <div className="grid-3">
          <div className="step-card">
            <div className="step-num">1</div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: 8 }}>Enter Specs</h3>
            <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              Select the car's Make, Model, Origin, DriveTrain, Engine Size, Horsepower, Fuel Economy, and Dimensions.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">2</div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: 8 }}>XGBoost Analysis</h3>
            <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              Our trained machine learning model evaluates spec relationships in real-time to compute precise valuations.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">3</div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: 8 }}>Get Insights & PDFs</h3>
            <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              Review the visual gauge, read key price drivers, save predictions to your account, and download official PDF reports.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE SHOWCASE GRID */}
      <section style={{ marginBottom: 70 }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Built for Car Enthusiasts & Buyers</p>
        <h2 className="display" style={{ fontSize: "2rem", marginBottom: 28 }}>
          Everything you need to price with confidence
        </h2>
        <div className="grid-2">
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 10, color: "var(--accent)" }}>
              📊 Explainable AI Estimates
            </h3>
            <p style={{ color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
              Say goodbye to mystery numbers. AutoPrice AI breaks down the top factors driving any price up or down — from engine displacement to highway mileage efficiency.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 10, color: "var(--accent-2)" }}>
              ⚔️ Side-by-Side Comparisons
            </h3>
            <p style={{ color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
              Considering two different models? Put them head-to-head on our Compare page to see how specifications impact their estimated market valuations.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 10, color: "var(--success)" }}>
              📄 One-Click PDF Reports
            </h3>
            <p style={{ color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
              Generate structured, professional PDF summary reports for any prediction. Perfect for saving, printing, or sharing with buyers and sellers.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 10, color: "var(--accent)" }}>
              📈 Account History & Analytics
            </h3>
            <p style={{ color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
              Track past predictions over time on an interactive dashboard chart, bookmark your favorite cars, and monitor market brand distribution.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORTED BRANDS SHOWCASE */}
      <section style={{ marginBottom: 70 }}>
        <p className="eyebrow" style={{ textAlign: "center", marginBottom: 8 }}>Broad Coverage</p>
        <h2 className="display" style={{ fontSize: "2rem", textAlign: "center", marginBottom: 24 }}>
          Supported Makes & Manufacturers
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {POPULAR_BRANDS.map((b) => (
            <span key={b} className="brand-tag">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ marginBottom: 70 }}>
        <p className="eyebrow" style={{ textAlign: "center", marginBottom: 8 }}>Questions & Answers</p>
        <h2 className="display" style={{ fontSize: "2rem", textAlign: "center", marginBottom: 32 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="faq-item">
              <h3 style={{ fontSize: "1.05rem", marginBottom: 8, color: "var(--text)" }}>{q}</h3>
              <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <h2 className="display" style={{ fontSize: "2.2rem", marginBottom: 12 }}>
          Ready to estimate your car's value?
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto 28px" }}>
          Try our AI prediction tool now. It's fast, free, and powered by machine learning.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/predict" className="btn btn-primary" style={{ padding: "13px 28px", fontSize: "1rem" }}>
            Start Predicting Now
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: "13px 24px", fontSize: "1rem" }}>
            Create Free Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <span className="display" style={{ fontSize: "1.1rem" }}>
            AutoPrice <span style={{ color: "var(--accent)" }}>AI</span>
          </span>
          <span style={{ marginLeft: 12, fontSize: "0.82rem" }}>
            © {new Date().getFullYear()} AutoPrice AI. All rights reserved.
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: "0.85rem", color: "var(--text-dim)" }}>
          <span>FastAPI</span> • <span>XGBoost</span> • <span>Express</span> • <span>React</span> • <span>MongoDB</span>
        </div>
      </footer>
    </div>
  );
}
