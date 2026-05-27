import { motion } from "framer-motion";

import MetricsPanel from "../metrics/MetricsPanel";
import LogsPanel from "../logs/LogsPanel";
import AnomalyPanel from "../anomalies/AnomalyPanel";
import ExplanationsPanel from "../explanations/ExplanationsPanel";
import AgentPanel from "../agent/AgentPanel";

function Dashboard() {
  return (
    <motion.div
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      {/* HEADER */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="panel-header">
          <h2>AI DevOps Observability Dashboard</h2>
          <span className="live-dot">● LIVE SYSTEM</span>
        </div>

        <p style={{ color: "#94a3b8" }}>
          Full-screen real-time monitoring of metrics, logs, anomalies and AI automation
        </p>
      </div>

      {/* TOP GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          flex: 1
        }}
      >
        <div className="card" style={{ minHeight: "45vh" }}>
          <MetricsPanel />
        </div>

        <div className="card" style={{ minHeight: "45vh" }}>
          <LogsPanel />
        </div>
      </div>

      {/* SECOND GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
          flex: 1
        }}
      >
        <div className="card" style={{ minHeight: "45vh" }}>
          <AnomalyPanel />
        </div>

        <div className="card" style={{ minHeight: "45vh" }}>
          <ExplanationsPanel />
        </div>
      </div>

      {/* FULL WIDTH AGENT */}
      <div className="card" style={{ marginTop: "20px" }}>
        <AgentPanel />
      </div>

    </motion.div>
  );
}

export default Dashboard;