import os
from uuid import uuid4

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AI_GATEWAY_API_KEY"],
    base_url=os.environ["AI_GATEWAY_BASE_URL"],
)

stream = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Count from one to five."}],
    stream=True,
    extra_headers={"Idempotency-Key": str(uuid4())},
)
for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
