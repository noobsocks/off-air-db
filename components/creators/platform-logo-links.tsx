import type { CreatorPlatformAccount, Platform } from "@/types/creator";

type Props = {
  accounts: CreatorPlatformAccount[];
};

function PlatformIcon({ platform }: { platform: Platform }) {
  switch (platform) {
    case "youtube":
      return (
        <svg viewBox="0 0 32 32" className="platform-logo-svg" aria-hidden="true">
          <rect x="2" y="6" width="28" height="20" rx="6" fill="#FF0000" />
          <path d="M14 12.5L21 16L14 19.5V12.5Z" fill="white" />
        </svg>
      );

    case "tiktok":
      return (
        <svg viewBox="0 0 32 32" className="platform-logo-svg" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="8" fill="#111111" />
          <path
            d="M18 8C18.8 10 20.2 11.4 22 12V14.8C20.6 14.6 19.3 14 18 13.1V19.2C18 22.3 15.6 24.5 12.7 24.5C9.7 24.5 7.5 22.2 7.5 19.4C7.5 16.5 9.8 14.2 12.8 14.2C13.3 14.2 13.8 14.3 14.2 14.4V17.4C13.8 17.2 13.4 17.1 12.9 17.1C11.5 17.1 10.4 18.1 10.4 19.4C10.4 20.7 11.4 21.7 12.8 21.7C14.2 21.7 15.1 20.6 15.1 19.2V8H18Z"
            fill="white"
          />
        </svg>
      );

    case "instagram":
      return (
        <svg viewBox="0 0 32 32" className="platform-logo-svg" aria-hidden="true">
          <defs>
            <linearGradient id="ig-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F58529" />
              <stop offset="45%" stopColor="#DD2A7B" />
              <stop offset="100%" stopColor="#8134AF" />
            </linearGradient>
          </defs>
          <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#ig-gradient)" />
          <rect x="9" y="9" width="14" height="14" rx="4" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="16" cy="16" r="3.5" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="22.5" cy="9.5" r="1.5" fill="white" />
        </svg>
      );

    case "xiaohongshu":
      return (
        <svg viewBox="0 0 32 32" className="platform-logo-svg" aria-hidden="true">
          <rect x="2" y="6" width="28" height="20" rx="6" fill="#FF2442" />
          <text
            x="16"
            y="19"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="white"
          >
            RED
          </text>
        </svg>
      );

    default:
      return null;
  }
}

export default function PlatformLogoLinks({ accounts }: Props) {
  if (accounts.length === 0) {
    return <span className="text-muted">등록된 플랫폼 없음</span>;
  }

  return (
    <div className="platform-logo-list">
      {accounts.map((account, index) => (
        <a
          key={`${account.platform}-${account.url}-${index}`}
          href={account.url}
          target="_blank"
          rel="noreferrer"
          className="platform-logo-link"
          title={account.platform}
          aria-label={`${account.platform} 링크 이동`}
        >
          <PlatformIcon platform={account.platform} />
        </a>
      ))}
    </div>
  );
}