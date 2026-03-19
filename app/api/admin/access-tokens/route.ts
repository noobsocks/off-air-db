import { NextResponse } from "next/server";
import { canManageTokens } from "@/lib/auth/permissions";
import { getCurrentRole } from "@/lib/auth/session";
import { createAccessToken } from "@/lib/db/access-tokens";

export async function POST(request: Request) {
  const role = await getCurrentRole();

  if (!canManageTokens(role)) {
    return NextResponse.json(
      { ok: false, message: "권한이 없습니다." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const targetRole = body.role === "admin" ? "admin" : "editor";
    const label = typeof body.label === "string" ? body.label : "";

    const token = await createAccessToken({
      role: targetRole,
      label,
    });

    return NextResponse.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: "토큰 생성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}