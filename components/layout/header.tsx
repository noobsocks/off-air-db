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
  if (pathname.startsWith("/access")) return "Login";
  return "Creator DB";
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
          <p className="header__description">
            OFF-AIR DB 대시보드 페이지입니다.
          </p>
        </div>

        <div className="header__actions">
          <span className={`role-badge role-badge--${role}`}>
            {getRoleLabel(role)}
          </span>

          {role === "viewer" ? (
            <Link href="/access" className="ghost-button">
              권한 인증
            </Link>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </header>
  );
}