import type { AppRole } from "@/types/auth";

const ROLE_RANK: Record<AppRole, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
};

export function hasMinRole(currentRole: AppRole, minimumRole: AppRole) {
  return ROLE_RANK[currentRole] >= ROLE_RANK[minimumRole];
}

export function canUpload(role: AppRole) {
  return hasMinRole(role, "editor");
}

export function canExport(role: AppRole) {
  return role === "admin";
}

export function canDelete(role: AppRole) {
  return role === "admin";
}

export function canCopy(role: AppRole) {
  return role === "admin";
}