import { createReadStream } from "node:fs";
import { randomUUID } from "node:crypto";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.TASKWAY_API_KEY,
  baseURL: process.env.TASKWAY_BASE_URL,
});

const uploaded = await client.files.create({
  file: createReadStream("notes.pdf"),
  purpose: "user_data",
});

const completion = await client.chat.completions.create(
  {
    model: "auto",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Summarize this file." },
        { type: "file", file: { file_id: uploaded.id } },
      ],
    }],
  },
  { headers: { "Idempotency-Key": randomUUID() } },
);
console.log(completion.choices[0]?.message.content);
