from sklearn.ensemble import IsolationForest

def extract_features(logs):
    features = []
    for log in logs:
        features.append([log["response_time"]])
    return features


def detect_anomalies(logs):
    features = extract_features(logs)

    model = IsolationForest(contamination=0.2)
    preds = model.fit_predict(features)

    results = []

    for log, pred in zip(logs, preds):
        log_copy = log.copy()
        log_copy["anomaly"] = True if pred == -1 else False
        results.append(log_copy)

    return results