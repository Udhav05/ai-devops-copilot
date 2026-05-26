def ai_decision(anomaly_logs):
    actions = []

    for log in anomaly_logs:
        if log["response_time"] > 1500:
            actions.append({
                "tool": "restart_service",
                "args": {"service_name": log["service"]}
            })

        elif log["level"] == "ERROR":
            actions.append({
                "tool":"send_alert",
                "message": {"message " : "error detected in service"}
            })

    return actions