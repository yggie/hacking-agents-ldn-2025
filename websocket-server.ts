import Fastify from "fastify";
import fastifyWs from "@fastify/websocket";
import fastifyFormbody from "@fastify/formbody";
import twilio from "twilio";
import twilioWs from "./src/utils/twilio-ws.ts";

// import { flow } from "./langflow.js";
// import { tunnelUrl, port, langflowStreaming } from "./config.js";
// import { sendResponse, sendErrorAndEnd } from "./relay_responses.js";

const {
  twiml: { VoiceResponse },
} = twilio;

const fastify = Fastify({
  logger: true,
});
fastify.register(fastifyWs);
fastify.register(fastifyFormbody);

fastify.post("/voice", (_request, reply) => {
  const twiml = new VoiceResponse();
  const connect = twiml.connect();
  connect.conversationRelay({
    url: `wss://${process.env.WS_BASE_URL}/ws`,
    welcomeGreeting: "I am Busy , Why are u calling me?",
  });
  reply.type("text/xml").send(twiml.toString());
});

fastify.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (socket, request) => {
    socket.on("message", async (data: string) => {
      const message = JSON.parse(data);

      switch (message.type) {
        case "setup":
          fastify.log.info(`Conversation started: ${message.callSid}`);
          socket.callSid = message.callSid;
          break;
        case "prompt": {
          fastify.log.info(`Processing prompt: ${message.voicePrompt}`);

          const apiResp = await fetch("http://localhost:3000/api/v1/chat", {
            method: "POST",
            headers: {
              accept: "application/json",
            },
            body: JSON.stringify({
              messages: [{ role: "user", content: message.voicePrompt }],
            }),
          });

          const { text } = await apiResp.json();

          const audioResp = await fetch("http://localhost:3000/api/v1/speech", {
            method: "POST",
            body: JSON.stringify({ text }),
          });

          const { url } = await audioResp.json();

          socket.send(JSON.stringify(twilioWs.play(url)));
          break;
        }
        case "error":
          fastify.log.error(`ConversationRelay error: ${message.description}`);
          break;
        default:
          fastify.log.error("Unknown message type:", message);
      }
    });

    socket.on("close", async () => {
      fastify.log.info(`WebSocket connection closed: ${socket.callSid}`);
    });
  });
});

try {
  await fastify.listen({ port: Number(process.env.WS_PORT) });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
