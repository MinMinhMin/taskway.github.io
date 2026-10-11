import os
from uuid import uuid4

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["TASKWAY_API_KEY"],
    base_url=os.environ["TASKWAY_BASE_URL"],
)

result = client.embeddings.create(
    model="text-embedding-3-small",
    input=["AI gateway", "Model routing"],
    extra_headers={"Idempotency-Key": str(uuid4())},
)
vector = result.data[0].embedding
print(len(vector))
