import os

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AI_GATEWAY_API_KEY"],
    base_url=os.environ["AI_GATEWAY_BASE_URL"],
)

for model in client.models.list().data:
    print(model.id)
