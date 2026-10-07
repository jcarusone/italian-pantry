import { NextResponse } from "next/server";

import { getNeonAuth } from "@/lib/auth/neon";

/** Proxies auth requests to Neon Auth. Returns 404 when Neon Auth isn't configured. */
type Ctx = { params: Promise<{ path: string[] }> };

function handlers() {
  const neon = getNeonAuth();
  return neon ? neon.handler() : null;
}

const notConfigured = () => NextResponse.json({ error: "Neon Auth is not configured." }, { status: 404 });

export async function GET(request: Request, ctx: Ctx) {
  const h = handlers();
  return h ? h.GET(request, ctx) : notConfigured();
}

export async function POST(request: Request, ctx: Ctx) {
  const h = handlers();
  return h ? h.POST(request, ctx) : notConfigured();
}
