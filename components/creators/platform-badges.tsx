import { PLATFORM_LABELS } from "@/lib/constants";
import type { CreatorPlatformAccount } from "@/types/creator";

type Props = {
  accounts: CreatorPlatformAccount[];
};

export default function PlatformBadges({ accounts }: Props) {
  if (accounts.length === 0) {
    return <span className="text-muted">등록된 플랫폼 없음</span>;
  }

  return (
    <div className="badge-list">
      {accounts.map((account, index) => (
        <span
          key={`${account.platform}-${account.url}-${index}`}
          className="badge"
        >
          {PLATFORM_LABELS[account.platform]}
        </span>
      ))}
    </div>
  );
}