"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  nextUrl?: string;
};

type VerifyResponse = {
  ok: boolean;
  role?: "editor" | "admin";
  message?: string;
};

export default function AccessForm({ nextUrl = "/dashboard" }: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/access/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = (await response.json()) as VerifyResponse;

      if (!response.ok || !data.ok) {
        setMessage(data.message ?? "권한 인증에 실패했습니다.");
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("권한 인증 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="input-grid input-grid--single">
        <div className="field">
          <label htmlFor="access-code" className="field__label">
            6자리 숫자를 입력해주세요.
          </label>
          <input
            id="access-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="예: 111111"
            className="field__input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? "인증 중..." : "권한 인증"}
        </button>

        <Link href="/dashboard" className="ghost-button">
          viewer로 계속
        </Link>
      </div>

      {message && <div className="status-box status-box--warning">{message}</div>}
    </form>
  );
}