import { NextRequest } from "next/server";
import { langflowAnnotate } from "../../ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { text } = (await request.json()) as { text: string };

  const resp = await langflowAnnotate.run(text);

  return NextResponse.json({ text: resp.chatOutputText() || "" });
}
