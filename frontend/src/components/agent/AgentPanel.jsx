import { useState } from "react";

function AgentPanel() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const runAgent = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to run agent");
      }

      const data = await res.json();
      setResponse(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">

      {/* HEADER */}
      <div className="panel-header">
        <h2>AI DevOps Agent</h2>
        <span className="live-dot">● READY</span>
      </div>

      <p style={{ color: "#94a3b8" }}>
        Autonomous system that analyzes logs and triggers actions
      </p>

      {/* BUTTON */}
      <button
        onClick={runAgent}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: "#2563eb",
          color: "white",
          fontWeight: 600
        }}
      >
        {loading ? "Running Agent..." : "Run AI Agent"}
      </button>

      {/* ERROR */}
      {error && (
        <div style={{ marginTop: 10, color: "#ef4444" }}>
          ⚠ {error}
        </div>
      )}

      {/* RESPONSE */}
      {response && (
        <div style={{ marginTop: 15 }}>

          {/* ACTIONS */}
          <h3>Actions Taken</h3>
          {response.actions?.map((action, i) => (
            <div key={i} className="alert">
              ⚙ {action.tool}
            </div>
          ))}

          {/* RESULTS */}
          <h3 style={{ marginTop: 10 }}>Results</h3>
          {response.results?.map((result, i) => (
            <div key={i} className="alert">
              ✅ {JSON.stringify(result)}
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AgentPanel;