import { NextResponse } from "next/server";

/** Informa que o processo da aplicação está atendendo requisições. */
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
