import { randomUUID } from "node:crypto";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});

const completion = await client.chat.completions.create(
  {
    model: "auto",
    messages: [{ role: "user", content: "Explain an AI gateway in one sentence." }],
  },
  { headers: { "Idempotency-Key": randomUUID() } },
);

console.log(completion.choices[0]?.message.content);
