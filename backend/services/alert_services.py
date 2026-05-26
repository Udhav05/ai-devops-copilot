def check_alerts(metrics):
    alerts= []


    if metrics['cpu_usage'] > 80:
        alerts.append('cpu usage high')

    if metrics['memory_usage'] > 80:
        alerts.append('memory usage high')

    if metrics['disk_usage'] > 80:
        alerts.append('disk usage high')

    return alerts