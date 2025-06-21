import { NextResponse } from "next/server";
import { langflow } from "../../ai";
import { NextRequest } from "next/server";
import type { UIMessage } from "@/app/page";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as { messages: UIMessage[] };

  const resp = await langflow.run(messages.at(-1)?.content || "");

  return NextResponse.json({ text: resp.chatOutputText() || "" });
}
