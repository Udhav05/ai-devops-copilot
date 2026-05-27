from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json

# Services
from backend.services.log_service import load_logs, get_logs_by_level
from backend.services.anomaly_service import detect_anomalies
from backend.services.rag_service import explain_anomalies
from backend.services.metrics_services import get_metrics
from backend.services.alert_services import check_alerts

# MCP + Agent
from backend.mcp_server.executor import execute_actions
from backend.mcp_server.api import router as mcp_router
from backend.llm_agent import llm_decision


app = FastAPI(
    title="AI DevOps Copilot",
    description="AI-powered DevOps monitoring and automation system",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# MCP routes
app.include_router(mcp_router, prefix="/mcp", tags=["MCP"])


# ---------------- HEALTH ----------------
@app.get("/health")
async def health():
    return {"status": "healthy", "service": "AI DevOps Copilot"}


# ---------------- HOME ----------------
@app.get("/")
async def home():
    return {"message": "AI DevOps Copilot is running 🚀"}


# ---------------- LOGS REST ----------------
@app.get("/logs")
async def get_logs():
    try:
        return {"logs": load_logs()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/logs/level")
async def logs_by_level(level: str):
    try:
        return {"logs_level": get_logs_by_level(level)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- ANOMALIES ----------------
@app.get("/anomalies")
async def get_anomalies():
    try:
        logs = load_logs()
        results = detect_anomalies(logs)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- EXPLANATIONS ----------------
@app.get("/explanations")
async def get_explanations():
    try:
        logs = load_logs()
        anomalies = detect_anomalies(logs)
        explained = explain_anomalies(anomalies)
        return {"results": explained}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- AGENT ----------------
@app.post("/agent/run")
async def run_agent():
    try:
        logs = load_logs()
        anomalies = detect_anomalies(logs)

        try:
            actions = llm_decision(anomalies)

            if not actions:
                actions = [
                    {"tool": "restart_service", "args": {"service_name": "payment-service"}},
                    {"tool": "send_alert", "args": {"message": "Database issue detected"}},
                    {"tool": "send_alert", "args": {"message": "High latency detected"}}
                ]

        except Exception as llm_error:
            print("LLM ERROR:", llm_error)
            actions = []

        results = execute_actions(actions)

        return {
            "actions": actions,
            "results": results
        }

    except Exception as e:
        print("FINAL ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- WEBSOCKET LOGS ----------------
@app.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            logs = load_logs()

            if logs:
                latest = logs[-1]
                await websocket.send_text(json.dumps({
                    "message": latest.get("message", "No message"),
                    "level": latest.get("level", "info")
                }))

            await asyncio.sleep(2)

    except WebSocketDisconnect:
        print("Logs websocket disconnected")


#  METRICS REST 
@app.get("/metrics")
async def metrics():
    try:
        return get_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- WEBSOCKET METRICS ----------------
@app.websocket("/ws/metrics")
async def websocket_metrics(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            metrics = get_metrics()
            alerts = check_alerts(metrics)

            await websocket.send_text(json.dumps({
                "metrics": metrics,
                "alerts": alerts
            }))

            await asyncio.sleep(2)

    except WebSocketDisconnect:
        print("Metrics websocket disconnected")