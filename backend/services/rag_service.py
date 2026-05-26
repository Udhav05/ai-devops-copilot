from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")


def log_to_text(log):
    return f"{log['service']} {log['level']} {log['message']} response time {log['response_time']}"


def generate_embeddings(logs):
    texts = [log_to_text(log) for log in logs]
    embeddings = model.encode(texts)
    return embeddings, texts


def create_vector_store(embeddings):
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings))
    return index


def retrieve_similar(log, index, texts, k=2):
    query = model.encode([log_to_text(log)])
    distances, indices = index.search(query, k)
    return [texts[i] for i in indices[0]]


def generate_explanation(log, similar_logs):
    context = "\n".join(similar_logs)

    return f"""
Anomaly detected:
{log_to_text(log)}

Similar past logs:
{context}

Possible reason:
High response time may indicate system overload or service delay.
"""


def explain_anomalies(logs):
    embeddings, texts = generate_embeddings(logs)
    index = create_vector_store(embeddings)

    results = []

    for log in logs:
        if log.get("anomaly"):
            similar = retrieve_similar(log, index, texts)
            explanation = generate_explanation(log, similar)

            log_copy = log.copy()
            log_copy["explanation"] = explanation
            results.append(log_copy)

    return results