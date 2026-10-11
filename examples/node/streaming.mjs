import { randomUUID } from "node:crypto";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});

const stream = await client.chat.completions.create(
  {
    model: "auto",
    messages: [{ role: "user", content: "Count from one to five." }],
    stream: true,
  },
  { headers: { "Idempotency-Key": randomUUID() } },
);
for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta.content;
  if (text) process.stdout.write(text);
}
