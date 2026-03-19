import "server-only";

import { randomInt } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AppRole } from "@/types/auth";

export type AccessTokenRecord = {
  id: string;
  code: string;
  role: AppRole;
  label: string | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
};

type DbAccessTokenRow = {
  id: string;
  code: string;
  role: AppRole;
  label: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
};

function mapAccessToken(row: DbAccessTokenRow): AccessTokenRecord {
  return {
    id: row.id,
    code: row.code,
    role: row.role,
    label: row.label,
    isActive: row.is_active,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

function generateSixDigitCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function getAccessTokens() {
  const { data, error } = await supabaseAdmin
    .from("access_tokens")
    .select("id, code, role, label, is_active, expires_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapAccessToken(row as DbAccessTokenRow));
}

export async function createAccessToken(input: {
  role: "editor" | "admin";
  label?: string;
}) {
  const label = input.label?.trim() || null;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = generateSixDigitCode();

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("access_tokens")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (existingError) {
      throw new Error(existingError.message);
    }

    if (existing) {
      continue;
    }

    const { data, error } = await supabaseAdmin
      .from("access_tokens")
      .insert({
        code,
        role: input.role,
        label,
        is_active: true,
      })
      .select("id, code, role, label, is_active, expires_at, created_at")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "토큰 생성에 실패했습니다.");
    }

    return mapAccessToken(data as DbAccessTokenRow);
  }

  throw new Error("사용 가능한 6자리 토큰 생성에 실패했습니다.");
}