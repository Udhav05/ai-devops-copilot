import AnomalyCard from "./AnomalyCard";
import { useState, useEffect } from "react";

function Anomaly() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [anomalyData, setAnomalyData] = useState([]);

  useEffect(() => {
    async function fetchAnomaly() {
      try {
        const response = await fetch("http://127.0.0.1:8000/anomalies");
        const data = await response.json();

        setAnomalyData(data.results || []);
        setLoading(false);

      } catch (error) {
        setError("Failed to fetch anomalies");
        setLoading(false);
      }
    }

    fetchAnomaly();
  }, []);

  /* ADD FAKE ANOMALY (for demo / interview WOW) */
  function addAnomaly() {
    const newAnomaly = {
      service: "payment-service",
      anomaly_score: (Math.random() * 0.5 + 0.5).toFixed(2),
      reason: "Unusual spike in response latency",
      severity: "high"
    };

    setAnomalyData((prev) => [newAnomaly, ...prev]);
  }

  /* LOADING */
  if (loading) {
    return (
      <div className="card">
        <h3>Detecting anomalies...</h3>
        <p style={{ color: "#94a3b8" }}>
          Running ML inference on system logs
        </p>
      </div>
    );
  }

  /* ERROR */
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
        <h2>Anomaly Detection</h2>
        <span className="live-dot">● ML ACTIVE</span>
      </div>

      <p style={{ color: "#94a3b8" }}>
        AI-powered detection of system anomalies using log patterns
      </p>

      {/* ACTION BUTTON */}
      <button
        onClick={addAnomaly}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: "#ef4444",
          color: "white",
          fontWeight: 600
        }}
      >
        + Simulate Anomaly
      </button>

      {/* ANOMALY LIST */}
      <div style={{ marginTop: 15 }}>
        {anomalyData.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>
            No anomalies detected
          </p>
        ) : (
          anomalyData.map((anomaly, index) => (
            <AnomalyCard
              key={index}
              service={anomaly.service}
              message={anomaly.reason || anomaly.message}
              level={anomaly.severity || anomaly.level}
              response_time={anomaly.response_time}
              anomaly_score={anomaly.anomaly_score}
            />
          ))
        )}
      </div>

    </div>
  );
}

export default Anomaly;