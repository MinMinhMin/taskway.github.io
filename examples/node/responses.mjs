import { randomUUID } from "node:crypto";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});

const first = await client.responses.create(
  { model: "auto", input: "Explain an AI gateway in one sentence." },
  { headers: { "Idempotency-Key": randomUUID() } },
);
console.log(first.output_text);

const followUp = await client.responses.create(
  {
    model: "auto",
    previous_response_id: first.id,
    input: "Now give me a three-step example.",
  },
  { headers: { "Idempotency-Key": randomUUID() } },
);
console.log(followUp.output_text);
