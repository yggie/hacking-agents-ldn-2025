import { LangflowClient } from "@datastax/langflow-client";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const langflowClient = new LangflowClient({
  baseUrl: process.env.LANGFLOW_BASE_URL || "",
});

export const langflow = langflowClient.flow(process.env.LANGFLOW_FLOW_ID || "");

export const langflowAnnotate = langflowClient.flow(
  process.env.LANGFLOW_FLOW_ID_ANNOTATION || ""
);

export const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});
