import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function MetricsPanel() {
  const [metrics, setMetrics] = useState({});
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/metrics");

    socket.onopen = () => {
      console.log("Metrics websocket connected");
    };

    socket.onmessage = (event) => {
      const liveData = JSON.parse(event.data);

      setMetrics(liveData.metrics);
      setAlerts(liveData.alerts || []);

      setMetricsHistory((prev) =>
        [
          ...prev,
          {
            cpu: liveData.metrics.cpu_usage,
            memory: liveData.metrics.memory_usage,
            disk: liveData.metrics.disk_usage,
            time: new Date().toLocaleTimeString()
          }
        ].slice(-30)
      );

      setLoading(false);
      setError("");
    };

    socket.onerror = () => {
      setError("Failed to connect to metrics stream");
      setLoading(false);
    };

    socket.onclose = () => {
      console.log("Metrics websocket closed");
    };

    return () => socket.close();
  }, []);

  /* LOADING */
  if (loading) {
    return (
      <div className="card">
        <h3>Loading live metrics...</h3>
        <p style={{ color: "#94a3b8" }}>Connecting to observability stream...</p>
      </div>
    );
  }

  /* ERROR */
  if (error) {
    return (
      <div className="card">
        <h3 style={{ color: "#ef4444" }}>⚠ System Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="card">

      {/* HEADER */}
      <div className="panel-header">
        <h2>Live System Metrics</h2>
        <span className="live-dot">● LIVE</span>
      </div>

      <p style={{ color: "#94a3b8", marginTop: 5 }}>
        Real-time system performance monitoring
      </p>

      {/* ALERTS */}
      {alerts.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {alerts.map((alert, i) => (
            <div key={i} className="alert">
              🚨 {alert}
            </div>
          ))}
        </div>
      )}

      {/* METRICS CARDS */}
      <div className="metrics-grid" style={{ marginTop: 15 }}>
        <div className="metric-card">
          <p>CPU Usage</p>
          <h3>{metrics.cpu_usage ?? 0}%</h3>
        </div>

        <div className="metric-card">
          <p>Memory Usage</p>
          <h3>{metrics.memory_usage ?? 0}%</h3>
        </div>

        <div className="metric-card">
          <p>Disk Usage</p>
          <h3>{metrics.disk_usage ?? 0}%</h3>
        </div>
      </div>

      {/* CHART */}
      <div style={{ marginTop: 20 }}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={metricsHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0b1220",
                border: "1px solid #1f2937",
                color: "#fff"
              }}
            />
            <Line type="monotone" dataKey="cpu" stroke="#60a5fa" strokeWidth={2} />
            <Line type="monotone" dataKey="memory" stroke="#34d399" strokeWidth={2} />
            <Line type="monotone" dataKey="disk" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default MetricsPanel;