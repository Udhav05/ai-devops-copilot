import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  FileText,
  Bot,
  Brain
} from "lucide-react";

import Header from "./components/layout/Header";
import Dashboard from "./components/dashboard/Dashboard";
import MetricsPanel from "./components/metrics/MetricsPanel";
import LogsPanel from "./components/logs/LogsPanel";
import AnomalyPanel from "./components/anomalies/AnomalyPanel";
import ExplanationsPanel from "./components/explanations/ExplanationsPanel";
import AgentPanel from "./components/agent/AgentPanel";

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "metrics":
        return <MetricsPanel />;
      case "logs":
        return <LogsPanel />;
      case "anomaly":
        return <AnomalyPanel />;
      case "explanations":
        return <ExplanationsPanel />;
      case "agent":
        return <AgentPanel />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { key: "metrics", label: "Metrics", icon: <Activity size={16} /> },
    { key: "logs", label: "Logs", icon: <FileText size={16} /> },
    { key: "anomaly", label: "Anomalies", icon: <AlertTriangle size={16} /> },
    { key: "explanations", label: "Insights", icon: <Brain size={16} /> },
    { key: "agent", label: "Agent", icon: <Bot size={16} /> }
  ];

  return (
    <div className="app-container">
      <Header />

      <div className="layout">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="logo">AI DevOps Copilot</div>

          {navItems.map((item) => (
            <button
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
              onClick={() => setActiveTab(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* MAIN */}
        <div className="main-content">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}

export default App;