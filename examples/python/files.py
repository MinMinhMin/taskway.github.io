import os
from uuid import uuid4

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["TASKWAY_API_KEY"],
    base_url=os.environ["TASKWAY_BASE_URL"],
)

with open("notes.pdf", "rb") as document:
    uploaded = client.files.create(file=document, purpose="user_data")

completion = client.chat.completions.create(
    model="auto",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Summarize this file."},
            {"type": "file", "file": {"file_id": uploaded.id}},
        ],
    }],
    extra_headers={"Idempotency-Key": str(uuid4())},
)
print(completion.choices[0].message.content)
