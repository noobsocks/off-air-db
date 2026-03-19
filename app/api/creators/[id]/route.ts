import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canDelete } from "@/lib/auth/permissions";
import { getCurrentRole } from "@/lib/auth/session";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, { params }: Props) {
  const role = await getCurrentRole();

  if (!canDelete(role)) {
    return NextResponse.json(
      { ok: false, message: "권한이 없습니다." },
      { status: 403 }
    );
  }

  const { id } = await params;

  const { error } = await supabaseAdmin.from("creators").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}