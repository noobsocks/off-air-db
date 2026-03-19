import { NextResponse } from "next/server";
import { previewImportRows } from "@/lib/db/creators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    const previewRows = await previewImportRows(rows);

    return NextResponse.json({
      ok: true,
      rows: previewRows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        rows: [],
        message: "Import 미리보기 생성 중 서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}