"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/access/logout", {
      method: "POST",
    });

    router.push("/access");
    router.refresh();
  }

  return (
    <button type="button" className="ghost-button" onClick={handleLogout}>
      권한 해제
    </button>
  );
}