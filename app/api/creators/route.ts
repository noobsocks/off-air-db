import { NextResponse } from "next/server";
import { createCreator } from "@/lib/db/creators";
import { hasMinRole } from "@/lib/auth/permissions";
import {
  getCurrentAccessTokenCode,
  getCurrentRole,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  const role = await getCurrentRole();

  if (!hasMinRole(role, "editor")) {
    return NextResponse.json(
      { ok: false, message: "권한이 없습니다." },
      { status: 403 }
    );
  }

  const createdTokenCode = await getCurrentAccessTokenCode();

  try {
    const body = await request.json();

    const result = await createCreator({
      name: body.name ?? "",
      youtubeUrl: body.youtubeUrl ?? "",
      tiktokUrl: body.tiktokUrl ?? "",
      instagramUrl: body.instagramUrl ?? "",
      xiaohongshuUrl: body.xiaohongshuUrl ?? "",
      createdTokenCode: createdTokenCode ?? undefined,
    });

    return NextResponse.json(result, {
      status: result.ok ? 200 : 400,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: "서버 오류가 발생했습니다.",
        duplicates: [],
      },
      { status: 500 }
    );
  }
}