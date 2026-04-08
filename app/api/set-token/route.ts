import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true, message: "Token stored" });

  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  return response;
}
