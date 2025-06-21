import { NextRequest } from "next/server";
import { elevenlabs } from "../../ai";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "node:fs";
import path from "node:path";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  // Sarah Explains
  const audio = await elevenlabs.textToSpeech.convert("Nhs7eitvQWFTQBsf0yiT", {
    text,
    modelId: "eleven_multilingual_v2",
  });

  const filename = uuidv4() + ".mp3";
  const filepath = path.join(process.cwd(), "/data/audio/", filename);
  fs.writeFileSync(
    filepath,
    Buffer.from(await new Response(audio).arrayBuffer())
  );

  return NextResponse.json({
    url: `/api/v1/audio/${filename}`,
  });
}
