This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack
- **Frontend**: React, Next.js
- **AI & Language Flow**: Langflow (with Mistral Small & Medium)
- **Text-to-Speech**: ElevenLabs
- **Voice Call**: Twilio
- **Websocket Server**: Fastify

## Getting Started

Run the development server:

```bash
pnpm run dev
```

Run the websocket server:

```bash
pnpm run ws:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Chat with our secretary using the input textbox

## Unfinished Works

Our goal was to leverage the latest v3 model of Elevenlabs to create a realistic
personality. Unfortunately, the model is not yet generally available via an API.
The workaround is to copy the text from the chat into the Elevenlabs playground
to experience the full results. To make the most of the new model, click the
special button to annotate the text with the v3 syntax.

## Inspiration

The project was inspired by previous works from:

- Daisy (by O2): https://www.youtube.com/watch?v=RV_SdCfZ-0s
- Jeannette Reyes: https://www.youtube.com/watch?v=6eR2rZBiIgI
