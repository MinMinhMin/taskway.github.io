import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.TASKWAY_API_KEY,
  baseURL: process.env.TASKWAY_BASE_URL,
});

const models = await client.models.list();
for (const model of models.data) {
  console.log(model.id);
}
