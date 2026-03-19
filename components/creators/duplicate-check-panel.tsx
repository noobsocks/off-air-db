"use client";

import { useState } from "react";
import Link from "next/link";
import type { Creator } from "@/types/creator";
import PlatformBadges from "./platform-badges";

type CheckResponse = {
  ok: boolean;
  duplicates: Creator[];
  message?: string;
};

export default function DuplicateCheckPanel() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/creators/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          urls: url ? [url] : [],
        }),
      });

      const data = (await response.json()) as CheckResponse;

      setResults(data.duplicates ?? []);
      setChecked(true);
    } catch (error) {
      console.error(error);
      setResults([]);
      setChecked(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="input-grid">
        <div className="field">
          <label htmlFor="duplicate-name" className="field__label">
            이름
          </label>
          <input
            id="duplicate-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="예: 짐승철"
            className="field__input"
          />
        </div>

        <div className="field">
          <label htmlFor="duplicate-url" className="field__label">
            플랫폼 URL
          </label>
          <input
            id="duplicate-url"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.instagram.com/..."
            className="field__input"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? "확인 중..." : "중복 확인"}
        </button>
      </div>

      {checked && (
        <>
          {results.length === 0 ? (
            <div className="status-box status-box--success">
              기존 리스트에서 일치하는 크리에이터를 찾지 못했습니다.
            </div>
          ) : (
            <div className="result-list">
              <div className="status-box status-box--warning">
                중복 가능성이 있는 크리에이터가 {results.length}명 있습니다.
              </div>

              {results.map((creator) => (
                <article key={creator.id} className="result-card">
                  <div className="result-card__top">
                    <div>
                      <h3 className="result-card__title">{creator.name}</h3>
                      <p className="result-card__meta">ID: {creator.id}</p>
                    </div>

                    <Link href={`/creators/${creator.id}`} className="text-link">
                      상세보기
                    </Link>
                  </div>

                  <PlatformBadges accounts={creator.accounts} />

                  <ul className="result-links">
                    {creator.accounts.map((account) => (
                      <li key={`${creator.id}-${account.platform}`}>
                        <a
                          href={account.url}
                          target="_blank"
                          rel="noreferrer"
                          className="result-links__item"
                        >
                          {account.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </form>
  );
}