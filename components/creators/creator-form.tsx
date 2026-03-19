"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Creator } from "@/types/creator";
import PlatformBadges from "./platform-badges";

type CheckResponse = {
  ok: boolean;
  duplicates: Creator[];
  message?: string;
};

type CreateResponse = {
  ok: boolean;
  id?: string;
  message: string;
  duplicates: Creator[];
};

export default function CreatorForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [xiaohongshuUrl, setXiaohongshuUrl] = useState("");

  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Creator[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const urls = useMemo(
    () => [youtubeUrl, tiktokUrl, instagramUrl, xiaohongshuUrl].filter(Boolean),
    [youtubeUrl, tiktokUrl, instagramUrl, xiaohongshuUrl]
  );

  async function handleDuplicateCheck() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/creators/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          urls,
        }),
      });

      const data = (await response.json()) as CheckResponse;

      setChecked(true);
      setResults(data.duplicates ?? []);

      if ((data.duplicates ?? []).length > 0) {
        setMessage(`중복 가능성이 있는 크리에이터가 ${data.duplicates.length}명 있습니다.`);
      } else {
        setMessage("중복으로 확인된 크리에이터가 없습니다.");
      }
    } catch (error) {
      console.error(error);
      setMessage("중복 확인 중 오류가 발생했습니다.");
      setChecked(true);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/creators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          youtubeUrl,
          tiktokUrl,
          instagramUrl,
          xiaohongshuUrl,
        }),
      });

      const data = (await response.json()) as CreateResponse;

      setChecked(true);
      setResults(data.duplicates ?? []);
      setMessage(data.message);

      if (data.ok && data.id) {
        router.push(`/creators/${data.id}`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setMessage("저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <section className="form-section">
        <div className="form-section__header">
          <h2 className="form-section__title">기본 정보</h2>
          <p className="form-section__description">
            크리에이터 이름과 플랫폼 링크를 입력하세요.
          </p>
        </div>

        <div className="input-grid input-grid--single">
          <div className="field">
            <label htmlFor="creator-name" className="field__label">
              크리에이터 이름 <span className="field__required">*</span>
            </label>
            <input
              id="creator-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="예: 짐승철"
              className="field__input"
            />
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section__header">
          <h2 className="form-section__title">플랫폼 링크</h2>
          <p className="form-section__description">
            보유 중인 플랫폼 URL만 입력하면 됩니다.
          </p>
        </div>

        <div className="input-grid">
          <div className="field">
            <label htmlFor="youtube-url" className="field__label">
              YouTube URL
            </label>
            <input
              id="youtube-url"
              type="text"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="https://www.youtube.com/@..."
              className="field__input"
            />
          </div>

          <div className="field">
            <label htmlFor="tiktok-url" className="field__label">
              TikTok URL
            </label>
            <input
              id="tiktok-url"
              type="text"
              value={tiktokUrl}
              onChange={(event) => setTiktokUrl(event.target.value)}
              placeholder="https://www.tiktok.com/@..."
              className="field__input"
            />
          </div>

          <div className="field">
            <label htmlFor="instagram-url" className="field__label">
              Instagram URL
            </label>
            <input
              id="instagram-url"
              type="text"
              value={instagramUrl}
              onChange={(event) => setInstagramUrl(event.target.value)}
              placeholder="https://www.instagram.com/..."
              className="field__input"
            />
          </div>

          <div className="field">
            <label htmlFor="xiaohongshu-url" className="field__label">
              Xiaohongshu URL
            </label>
            <input
              id="xiaohongshu-url"
              type="text"
              value={xiaohongshuUrl}
              onChange={(event) => setXiaohongshuUrl(event.target.value)}
              placeholder="https://www.xiaohongshu.com/..."
              className="field__input"
            />
          </div>
        </div>
      </section>

      <div className="form-actions">
        <button
          type="button"
          onClick={handleDuplicateCheck}
          className="secondary-button"
          disabled={isLoading}
        >
          {isLoading ? "확인 중..." : "중복 확인"}
        </button>

        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? "저장 중..." : "저장하기"}
        </button>

        <Link href="/creators" className="ghost-button">
          리스트로 돌아가기
        </Link>
      </div>

      {checked && results.length > 0 && (
        <section className="form-section">
          <div className="form-section__header">
            <h2 className="form-section__title">중복 검사 결과</h2>
            <p className="form-section__description">
              기존 데이터와 이름 또는 URL이 겹치는 항목입니다.
            </p>
          </div>

          <div className="result-list">
            {results.map((creator) => (
              <article key={creator.id} className="result-card">
                <div className="result-card__top">
                  <div>
                    <h3 className="result-card__title">{creator.name}</h3>
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
        </section>
      )}

      {message && (
        <div
          className={`status-box ${
            results.length > 0 ? "status-box--warning" : "status-box--success"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}