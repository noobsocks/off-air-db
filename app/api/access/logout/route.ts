import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteCurrentSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  try {
    await deleteCurrentSession();

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "로그아웃 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}