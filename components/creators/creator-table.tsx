import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Creator } from "@/types/creator";
import PlatformLogoLinks from "./platform-logo-links";

type Props = {
  creators: Creator[];
};

export default function CreatorTable({ creators }: Props) {
  if (creators.length === 0) {
    return (
      <div className="empty-box">
        <p className="empty-box__title">등록된 크리에이터가 없습니다.</p>
        <p className="empty-box__description">
          검색 조건을 바꾸거나 새 크리에이터를 등록해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>플랫폼</th>
            <th>링크 수</th>
            <th>등록일</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {creators.map((creator) => (
            <tr key={creator.id}>
              <td className="data-table__name">{creator.name}</td>
              <td>
                <PlatformLogoLinks accounts={creator.accounts} />
              </td>
              <td>{creator.accounts.length}</td>
              <td>{formatDate(creator.createdAt)}</td>
              <td className="data-table__action">
                <Link href={`/creators/${creator.id}`} className="text-link">
                  상세보기
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}