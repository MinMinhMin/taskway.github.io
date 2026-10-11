import os
from uuid import uuid4

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["TASKWAY_API_KEY"],
    base_url=os.environ["TASKWAY_BASE_URL"],
)

idempotency_key = str(uuid4())
completion = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Explain an AI gateway in one sentence."}],
    extra_headers={"Idempotency-Key": idempotency_key},
)

print(completion.choices[0].message.content)
