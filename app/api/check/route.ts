import { NextResponse } from "next/server";
import { findDuplicateCreators } from "@/lib/db/creators";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const duplicates = await findDuplicateCreators({
      name: body.name ?? "",
      urls: Array.isArray(body.urls) ? body.urls : [],
    });

    return NextResponse.json({
      ok: true,
      duplicates,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        duplicates: [],
        message: "중복 확인 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}