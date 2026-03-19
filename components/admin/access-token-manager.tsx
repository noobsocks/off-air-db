"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AccessTokenRecord } from "@/lib/db/access-tokens";

type Props = {
  tokens: AccessTokenRecord[];
};

type CreateTokenResponse = {
  ok: boolean;
  message?: string;
  token?: AccessTokenRecord;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AccessTokenManager({ tokens }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<"editor" | "admin">("editor");
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setCreatedCode("");

    try {
      const response = await fetch("/api/admin/access-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          label,
        }),
      });

      const data = (await response.json()) as CreateTokenResponse;

      if (!response.ok || !data.ok || !data.token) {
        setMessage(data.message ?? "토큰 생성에 실패했습니다.");
        return;
      }

      setCreatedCode(data.token.code);
      setMessage("토큰이 정상적으로 생성되었습니다.");
      setLabel("");
      setRole("editor");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("토큰 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="form-section">
        <div className="form-section__header">
          <h2 className="form-section__title">6자리 토큰 생성</h2>
          <p className="form-section__description">
            admin 또는 editor 권한용 토큰을 새로 발급할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="input-grid">
            <div className="field">
              <label htmlFor="token-role" className="field__label">
                권한
              </label>
              <select
                id="token-role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value === "admin" ? "admin" : "editor")
                }
                className="field__input"
              >
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="token-label" className="field__label">
                라벨
              </label>
              <input
                id="token-label"
                type="text"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="예: 마케팅팀 A / 대표님 / 외주용"
                className="field__input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? "생성 중..." : "토큰 생성"}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`status-box ${
              createdCode ? "status-box--success" : "status-box--warning"
            }`}
          >
            {message}
          </div>
        )}

        {createdCode && (
          <div className="token-created-box">
            <p className="token-created-box__label">생성된 6자리 토큰</p>
            <p className="token-created-box__code">{createdCode}</p>
          </div>
        )}
      </section>

      <section className="form-section">
        <div className="form-section__header">
          <h2 className="form-section__title">발급된 토큰 목록</h2>
          <p className="form-section__description">
            현재 등록된 editor/admin 토큰 목록입니다.
          </p>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>토큰값</th>
                <th>권한</th>
                <th>라벨</th>
                <th>상태</th>
                <th>생성일</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id}>
                  <td className="data-table__name">{token.code}</td>
                  <td>{token.role}</td>
                  <td>{token.label || "-"}</td>
                  <td>{token.isActive ? "활성" : "비활성"}</td>
                  <td>{formatDate(token.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}