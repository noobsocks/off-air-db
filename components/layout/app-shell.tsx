import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { getCurrentRole } from "@/lib/auth/session";

type Props = {
  children: ReactNode;
};

export default async function AppShell({ children }: Props) {
  const role = await getCurrentRole();

  return (
    <div className="app-shell">
      <Sidebar role={role} />
      <div className="app-shell__content">
        <Header role={role} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}