import { useState, useEffect } from "react";

function Explanations() {
  const [explanationsData, setExplanationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExplanations() {
      try {
        const response = await fetch("http://127.0.0.1:8000/explanations");
        const data = await response.json();

        setExplanationsData(data.results || []);
        setLoading(false);

      } catch (error) {
        setError("Failed to fetch explanations");
        setLoading(false);
      }
    }

    fetchExplanations();
  }, []);

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="card">
        <h3>Generating AI Insights...</h3>
        <p style={{ color: "#94a3b8" }}>
          Analyzing anomalies using RAG pipeline
        </p>
      </div>
    );
  }

  /* ERROR STATE */
  if (error) {
    return (
      <div className="card">
        <h3 style={{ color: "#ef4444" }}>⚠ Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="card">

      {/* HEADER */}
      <div className="panel-header">
        <h2>AI Insights</h2>
        <span className="live-dot">● ANALYZED</span>
      </div>

      <p style={{ color: "#94a3b8" }}>
        AI-generated explanations for system anomalies using RAG pipeline
      </p>

      {/* INSIGHTS */}
      <div style={{ marginTop: 15 }}>
        {explanationsData.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>
            No insights available
          </p>
        ) : (
          explanationsData.map((item, index) => (
            <div
              key={index}
              className="alert"
              style={{
                marginBottom: 10
              }}
            >
              <h3 style={{ margin: "0 0 6px 0" }}>
                {item.service || "Unknown Service"}
              </h3>

              <p style={{ margin: 0, color: "#cbd5e1" }}>
                {item.explanation}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Explanations;