"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Creator } from "@/types/creator";

type Props = {
  creator: Creator;
};

export default function CreatorAdminActions({ creator }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCopy() {
    const text = [
      `이름: ${creator.name}`,
      ...creator.accounts.map((account) => `${account.platform}: ${account.url}`),
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setMessage("크리에이터 정보를 복사했습니다.");
  }

  async function handleDelete() {
    const confirmed = window.confirm("이 크리에이터를 삭제하시겠습니까?");

    if (!confirmed) return;

    setIsDeleting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/creators/${creator.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMessage(data.message ?? "삭제에 실패했습니다.");
        return;
      }

      router.push("/creators");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="form-actions">
      <button type="button" className="secondary-button" onClick={handleCopy}>
        정보 복사
      </button>

      <button
        type="button"
        className="secondary-button"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "삭제 중..." : "삭제"}
      </button>

      {message && <div className="status-box status-box--warning">{message}</div>}
    </div>
  );
}