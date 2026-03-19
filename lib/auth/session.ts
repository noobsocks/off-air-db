import "server-only";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AppRole } from "@/types/auth";

export const SESSION_COOKIE_NAME = "creator_db_session";
const SESSION_DURATION_HOURS = 6;

type SessionRow = {
  role: AppRole;
  expires_at: string;
};

type AccessTokenRow = {
  id: string;
  role: AppRole;
  is_active: boolean;
  expires_at: string | null;
};

export async function getCurrentRole(): Promise<AppRole> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return "viewer";
  }

  const { data, error } = await supabaseAdmin
    .from("auth_sessions")
    .select("role, expires_at")
    .eq("session_token", sessionToken)
    .single();

  if (error || !data) {
    return "viewer";
  }

  const session = data as SessionRow;

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    return "viewer";
  }

  return session.role;
}

export async function verifyAccessCode(code: string) {
  const trimmed = code.trim();

  if (!/^\d{6}$/.test(trimmed)) {
    return {
      ok: false,
      message: "토큰은 6자리 숫자여야 합니다.",
    };
  }

  const { data, error } = await supabaseAdmin
    .from("access_tokens")
    .select("id, role, is_active, expires_at")
    .eq("code", trimmed)
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: "유효하지 않은 토큰입니다.",
    };
  }

  const token = data as AccessTokenRow;

  if (!token.is_active) {
    return {
      ok: false,
      message: "비활성화된 토큰입니다.",
    };
  }

  if (token.expires_at && new Date(token.expires_at).getTime() <= Date.now()) {
    return {
      ok: false,
      message: "만료된 토큰입니다.",
    };
  }

  return {
    ok: true,
    accessTokenId: token.id,
    role: token.role,
  };
}

export async function createRoleSession(accessTokenId: string, role: AppRole) {
  const sessionToken = `${randomUUID()}-${randomUUID()}`;
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabaseAdmin.from("auth_sessions").insert({
    session_token: sessionToken,
    role,
    access_token_id: accessTokenId,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    sessionToken,
    expiresAt,
    role,
  };
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return;
  }

  await supabaseAdmin
    .from("auth_sessions")
    .delete()
    .eq("session_token", sessionToken);
}