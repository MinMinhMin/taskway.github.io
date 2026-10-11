import json
import os
from uuid import uuid4

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["TASKWAY_API_KEY"],
    base_url=os.environ["TASKWAY_BASE_URL"],
)


def lookup_order(order_id):
    # Replace this local example with an authorized application function.
    return {"order_id": order_id, "status": "shipped"}


messages = [{"role": "user", "content": "Check the status of order A-123."}]
first = client.chat.completions.create(
    model="auto",
    messages=messages,
    tools=[{
        "type": "function",
        "function": {
            "name": "lookup_order",
            "description": "Look up an order by its identifier.",
            "parameters": {
                "type": "object",
                "properties": {"order_id": {"type": "string"}},
                "required": ["order_id"],
                "additionalProperties": False,
            },
        },
    }],
    tool_choice="auto",
    extra_headers={"Idempotency-Key": str(uuid4())},
)

assistant_message = first.choices[0].message
messages.append(assistant_message.model_dump(exclude_none=True))
for tool_call in assistant_message.tool_calls or []:
    arguments = json.loads(tool_call.function.arguments)
    result = lookup_order(**arguments)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result),
    })

if assistant_message.tool_calls:
    final = client.chat.completions.create(
        model="auto",
        messages=messages,
        extra_headers={"Idempotency-Key": str(uuid4())},
    )
    print(final.choices[0].message.content)
else:
    print(assistant_message.content)
