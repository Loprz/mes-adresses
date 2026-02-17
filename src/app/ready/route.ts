import { NextResponse } from "next/server";

export function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_BAL_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      {
        ok: false,
        service: "mes-adresses",
        checks: {
          nextPublicBalApiUrl: "missing",
        },
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    service: "mes-adresses",
    checks: {
      nextPublicBalApiUrl: "ok",
    },
  });
}
