from fastapi import APIRouter
from backend.mcp_server.tools import *

router = APIRouter()


@router.get("/metrics")
def get_metrics():
    return get_metrics

@router.get("/logs")
def get_logs():
    return get_logs

@router.post("/restart")
def restart(service : str):
    return restart(service)


@router.post("/alert")
def get_alerts(message : str):
    return get_alerts(message)
