from dotenv import load_dotenv
import os
import json
import re
from openai import OpenAI

# Load .env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(env_path)

print("ENV PATH:", env_path)
print("API key loaded successfully")

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OPENAI_API_KEY not found in .env")

client = OpenAI(api_key=api_key)


def llm_decision(logs):
    prompt = f"""
You are an AI DevOps agent.

Analyze the logs and decide actions.

Available tools:
- restart_service(service_name)
- send_alert(message)

IMPORTANT:
- Return ONLY valid JSON
- No explanation
- No extra text

Example:
[
  {{
    "tool": "restart_service",
    "args": {{"service_name": "api"}}
  }}
]

Logs:
{logs}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        output = response.choices[0].message.content.strip()

        print("🔍 RAW LLM OUTPUT:")
        print(output)

        # Extract JSON safely
        json_text = re.search(r"\[.*\]", output, re.DOTALL)

        if json_text:
            return json.loads(json_text.group())
        else:
            print("❌ No JSON found in output")
            return []

    except Exception as e:
        print("❌ ERROR:", str(e))
        return []