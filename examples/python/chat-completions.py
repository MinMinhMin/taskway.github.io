import os
from uuid import uuid4

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["TASKWAY_API_KEY"],
    base_url=os.environ["TASKWAY_BASE_URL"],
)

completion = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Summarize this paragraph."}],
    extra_headers={"Idempotency-Key": str(uuid4())},
)
print(completion.choices[0].message.content)
