import { randomUUID } from "node:crypto";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.TASKWAY_API_KEY,
  baseURL: process.env.TASKWAY_BASE_URL,
});

const result = await client.embeddings.create(
  { model: "text-embedding-3-small", input: ["AI gateway", "Model routing"] },
  { headers: { "Idempotency-Key": randomUUID() } },
);
console.log(result.data[0].embedding.length);
