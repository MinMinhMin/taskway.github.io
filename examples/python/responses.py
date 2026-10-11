import os
from uuid import uuid4

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AI_GATEWAY_API_KEY"],
    base_url=os.environ["AI_GATEWAY_BASE_URL"],
)

first = client.responses.create(
    model="auto",
    input="Explain an AI gateway in one sentence.",
    extra_headers={"Idempotency-Key": str(uuid4())},
)
print(first.output_text)

follow_up = client.responses.create(
    model="auto",
    previous_response_id=first.id,
    input="Now give me a three-step example.",
    extra_headers={"Idempotency-Key": str(uuid4())},
)
print(follow_up.output_text)
