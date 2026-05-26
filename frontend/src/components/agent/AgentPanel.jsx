import { useState } from "react";

function AgentPanel() {
  const [actions, setActions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAgent() {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/agent/run", {
        method: "POST",
      });

      const data = await response.json();

      console.log("AGENT DATA:", data);

      setActions(data.actions || []);
      setResults(data.results || []);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setError("Failed to fetch agent data");

      setLoading(false);
    }
  }

  if (loading) {
    return <h2>Running agent...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Agent Panel</h1>

      <button onClick={runAgent}>Run Agent</button>

      <h2>Actions</h2>

    

      {actions?.map((action, index) => (
        <div key={index}>
          <p>{action.tool}</p>

          <pre>{JSON.stringify(action.args, null, 2)}</pre>
        </div>
      ))}


      
      <h2>Results</h2>

      {results?.map((result, index) => (
        <div key={index}>
          <p>{JSON.stringify(result)}</p>
        </div>
      ))}
    </div>
  );
}

export default AgentPanel;
