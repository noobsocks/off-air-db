"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppRole } from "@/types/auth";
import LogoutButton from "@/components/auth/logout-button";

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/creators/new")) return "New Creator";
  if (pathname.startsWith("/creators")) return "Creators";
  if (pathname.startsWith("/duplicate-check")) return "Duplicate Check";
  if (pathname.startsWith("/import")) return "Import";
  if (pathname.startsWith("/admin/access-tokens")) return "Token Manager";
  if (pathname.startsWith("/access")) return "로그인";
  return "OFF-AIR DB";
}

function getPageDescription(pathname: string) {
  if (pathname.startsWith("/dashboard")) {
    return "크리에이터 데이터 관리용 내부 어드민입니다. OFF-AIR DB 대시보드 페이지입니다.";
  }

  return "크리에이터 데이터 관리용 내부 어드민입니다.";
}

function getRoleLabel(role: AppRole) {
  if (role === "admin") return "ADMIN";
  if (role === "editor") return "EDITOR";
  return "VIEWER";
}

type Props = {
  role: AppRole;
};

export default function Header({ role }: Props) {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="header__inner">
        <div>
          <h1 className="header__title">{getPageTitle(pathname)}</h1>
          <p className="header__description">{getPageDescription(pathname)}</p>
        </div>

        <div className="header__actions">
          <span className={`role-badge role-badge--${role}`}>
            {getRoleLabel(role)}
          </span>

          {role === "viewer" ? (
            <Link href="/access" className="ghost-button">
              로그인
            </Link>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </header>
  );
}