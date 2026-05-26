import random
from backend.mcp_server.registry import register_tool

def get_logs():
    return {"logs" : "logs fetched successfully"}


def get_metrics():
    return {
        "cpu": random.randint(10, 20),
        "memory":  random.randint(20, 30)
    }


def restart_service(service_name : str):
    return {"status": f"{service_name} restart successfully"}

def send_alert(message : str):
    return {"alert": message}


register_tool("restart_service", restart_service)
register_tool("send_alert", send_alert)


