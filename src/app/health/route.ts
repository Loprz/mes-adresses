import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "mes-adresses",
    uptimeSeconds: Math.floor(process.uptime()),
  });
}
