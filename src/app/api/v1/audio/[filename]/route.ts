import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const filepath = path.join(process.cwd(), "/data/audio/", filename);

  const file = fs.readFileSync(filepath);

  return new Response(file);
}
