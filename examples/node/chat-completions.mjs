import { randomUUID } from "node:crypto";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.TASKWAY_API_KEY,
  baseURL: process.env.TASKWAY_BASE_URL,
});

const completion = await client.chat.completions.create(
  {
    model: "auto",
    messages: [{ role: "user", content: "Summarize this paragraph." }],
  },
  { headers: { "Idempotency-Key": randomUUID() } },
);
console.log(completion.choices[0]?.message.content);
