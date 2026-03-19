"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppRole } from "@/types/auth";
import { canUpload } from "@/lib/auth/permissions";

type Props = {
  role: AppRole;
};

export default function Sidebar({ role }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", visible: true },
    { href: "/creators", label: "Creators", visible: true },
    { href: "/duplicate-check", label: "Duplicate Check", visible: true },
    { href: "/import", label: "Import", visible: canUpload(role) },
    { href: "/access", label: "Login", visible: role === "viewer" },
  ].filter((item) => item.visible);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-badge">O</div>
        <div>
          <p className="sidebar__brand-title">OFF-AIR DB</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const isActive =
            item.href === "/creators"
              ? pathname.startsWith("/creators")
              : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}