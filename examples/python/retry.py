import os
from uuid import uuid4

from openai import APITimeoutError, OpenAI

client = OpenAI(
    api_key=os.environ["AI_GATEWAY_API_KEY"],
    base_url=os.environ["AI_GATEWAY_BASE_URL"],
)

# Keep this value outside the retry attempt so both sends have the same key.
idempotency_key = str(uuid4())
for attempt in range(2):
    try:
        completion = client.chat.completions.create(
            model="auto",
            messages=[{"role": "user", "content": "Summarize this paragraph."}],
            extra_headers={"Idempotency-Key": idempotency_key},
        )
        print(completion.choices[0].message.content)
        break
    except APITimeoutError:
        if attempt == 1:
            raise
