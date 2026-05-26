from fastapi import (
    FastAPI,
    HTTPException,
    WebSocket,
    WebSocketDisconnect
)

import asyncio
import json

# Services
from backend.services.log_service import (
    load_logs,
    get_logs_by_level
)

from backend.services.anomaly_service import (
    detect_anomalies
)

from backend.services.rag_service import (
    explain_anomalies
)

from backend.services.metrics_services import (
    get_metrics
)

from backend.services.alert_services import (
    check_alerts
)

# MCP + Agent
from backend.mcp_server.executor import (
    execute_actions
)

from backend.mcp_server.api import (
    router as mcp_router
)

from backend.llm_agent import (
    llm_decision
)

from fastapi.middleware.cors import (
    CORSMiddleware
)



app = FastAPI(

    title="AI DevOps Copilot",

    description=
    "AI-powered DevOps monitoring and automation system",

    version="1.0.0"

)



app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)



# MCP Routes
app.include_router(
    mcp_router,
    prefix="/mcp",
    tags=["MCP"]
)



# HEALTH CHECK

@app.get(
    "/health",
    tags=["Health"]
)
async def health():

    return {

        "status":
        "healthy",

        "service":
        "AI DevOps Copilot"

    }



# HOME

@app.get(
    "/",
    tags=["Home"]
)

async def home():

    return {

        "message":
        "AI DevOps Copilot is running 🚀"

    }



# LOG ROUTES

@app.get(
    "/logs",
    tags=["Logs"]
)

async def get_logs():

    try:

        logs = load_logs()

        return {

            "logs":
            logs

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )



@app.get(
    "/logs/level",
    tags=["Logs"]
)

async def logs_by_level(
    level: str
):

    try:

        logs = get_logs_by_level(
            level
        )

        return {

            "logs_level":
            logs

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )



# ANOMALY

@app.get(
    "/anomalies",
    tags=["ML"]
)

async def get_anomalies():

    try:

        logs = load_logs()

        results = detect_anomalies(
            logs
        )

        return {

            "results":
            results

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )



# RAG

@app.get(
    "/explanations",
    tags=["RAG"]
)

async def get_explanations():

    try:

        logs = load_logs()

        anomalies = detect_anomalies(
            logs
        )

        explained = explain_anomalies(
            anomalies
        )

        return {

            "results":
            explained

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )



# AGENT

@app.post(
    "/agent/run",
    tags=["AI Agent"]
)

async def run_agent():

    try:

        logs = load_logs()
       

        anomalies =detect_anomalies(
            logs
        )

        try:

            actions = llm_decision(
                anomalies
            )


            if not actions:

                actions = [

                    {

                        "tool":
                        "restart_service",

                        "args": {

                            "service_name":
                            "payment-service"

                        }

                    },

                    {

                        "tool":
                        "send_alert",

                        "args": {

                            "message":
                            "Database issue detected"

                        }

                    },

                    {

                        "tool":
                        "send_alert",

                        "args": {

                            "message":
                            "High latency detected"

                        }

                    }

                ]


        except Exception as llm_error:

            print(
                "LLM ERROR:",
                llm_error
            )

            actions = []


        results = execute_actions(
            actions
        )


        return {

            "actions":
            actions,

            "results":
            results

        }


    except Exception as e:

        print(
            "FINAL ERROR:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )



# LOGS WEBSOCKET

@app.websocket(
    "/ws/logs"
)

async def websocket_logs(
    websocket: WebSocket
):

    await websocket.accept()

    try:

        while True:

            logs = load_logs()

            await websocket.send_text(
                json.dumps(
                    logs
                )
            )

            await asyncio.sleep(
                5
            )


    except WebSocketDisconnect:

        print(
            "Logs websocket disconnected"
        )


    except Exception as e:

        print(
            "LOG WS ERROR:",
            e
        )



# METRICS REST

@app.get(
    "/metrics"
)

async def metrics():

    try:

        data = get_metrics()

        return data


    except Exception as e:

        print(
            "METRICS ERROR:",
            e
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )



# METRICS WEBSOCKET

@app.websocket(
    "/ws/metrics"
)

async def websocket_metrics(
    websocket: WebSocket
):

    await websocket.accept()

    try:

        while True:

            metrics = get_metrics()

            alerts = check_alerts(
                metrics
            )


            data = {

                "metrics":
                metrics,

                "alerts":
                alerts

            }


            await websocket.send_text(

                json.dumps(
                    data
                )

            )


            await asyncio.sleep(
                2
            )


    except WebSocketDisconnect:

        print(
            "Metrics websocket disconnected"
        )


    except Exception as e:

        print(
            "METRICS WS ERROR:",
            e
        )