import json

LOG_FILE = "data/logs.json"

def load_logs():
    with open(LOG_FILE, "r") as f:
        return json.load(f)
    
def get_logs_by_level(level : str):
    logs = load_logs()
    return [log for log in logs if log["level"] == level.upper()]