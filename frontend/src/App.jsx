import Header from "./components/layout/Header";
import Anomaly from "./components/anomalies/AnomalyPanel";
import LogPanel from "./components/logs/LogsPanel";
import Explanations from "./components/explanations/ExplanationsPanel";
import AgentPanel from "./components/agent/AgentPanel";
import MetricsPanel from "./components/metrics/MetricsPanel";

function App() {
  return (
    <div>
      <Header />
      <LogPanel />
      <Anomaly />
      <Explanations />
      <AgentPanel />
      <MetricsPanel />
    </div>
  )
}

export default App;