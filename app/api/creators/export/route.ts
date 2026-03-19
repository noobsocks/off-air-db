import { NextResponse } from "next/server";
import { getAllCreators } from "@/lib/db/creators";
import { canExport } from "@/lib/auth/permissions";
import { getCurrentRole } from "@/lib/auth/session";

function escapeCsv(value: string) {
  const safe = value.replace(/"/g, '""');
  return `"${safe}"`;
}

export async function GET() {
  const role = await getCurrentRole();

  if (!canExport(role)) {
    return NextResponse.json(
      { ok: false, message: "권한이 없습니다." },
      { status: 403 }
    );
  }

  const creators = await getAllCreators();

  const header = [
    "name",
    "youtube_url",
    "tiktok_url",
    "instagram_url",
    "xiaohongshu_url",
  ];

  const rows = creators.map((creator) => {
    const youtube = creator.accounts.find((a) => a.platform === "youtube")?.url ?? "";
    const tiktok = creator.accounts.find((a) => a.platform === "tiktok")?.url ?? "";
    const instagram = creator.accounts.find((a) => a.platform === "instagram")?.url ?? "";
    const xiaohongshu =
      creator.accounts.find((a) => a.platform === "xiaohongshu")?.url ?? "";

    return [
      escapeCsv(creator.name),
      escapeCsv(youtube),
      escapeCsv(tiktok),
      escapeCsv(instagram),
      escapeCsv(xiaohongshu),
    ].join(",");
  });

  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="creators-export.csv"',
    },
  });
}