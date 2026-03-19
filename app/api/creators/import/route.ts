import { NextResponse } from "next/server";
import { importCreators } from "@/lib/db/creators";
import { getCurrentRole } from "@/lib/auth/session";
import { hasMinRole } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  const role = await getCurrentRole();

  if (!hasMinRole(role, "editor")) {
    return NextResponse.json(
      { ok: false, message: "권한이 없습니다." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    const result = await importCreators(rows);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: "Import 저장 중 서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}