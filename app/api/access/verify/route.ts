import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createRoleSession,
  SESSION_COOKIE_NAME,
  verifyAccessCode,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code : "";

    const verified = await verifyAccessCode(code);

    if (!verified.ok) {
      return NextResponse.json(
        { ok: false, message: verified.message },
        { status: 400 }
      );
    }

    const session = await createRoleSession(
      verified.accessTokenId,
      verified.role
    );

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(session.expiresAt),
    });

    return NextResponse.json({
      ok: true,
      role: session.role,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "토큰 인증 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}