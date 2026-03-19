import CreatorStats from "@/components/creators/creator-stats";
import { PLATFORM_LABELS } from "@/lib/constants";
import { getDashboardStats, getRecentCreators } from "@/lib/creators";
import { getAllCreators } from "@/lib/db/creators";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const creators = await getAllCreators();
  const stats = getDashboardStats(creators);
  const recentCreators = getRecentCreators(creators, 6);

  return (
    <div className="page-stack">
      <CreatorStats total={stats.total} platforms={stats.platforms} />

      <section className="panel">
        <div className="panel__header">
          <div>
            <h2 className="panel__title">최근 등록 크리에이터</h2>
            <p className="panel__description">
              가장 최근에 등록된 크리에이터 목록입니다.
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>보유 플랫폼</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {recentCreators.map((creator) => (
                <tr key={creator.id}>
                  <td className="data-table__name">{creator.name}</td>
                  <td>
                    <div className="badge-list">
                      {creator.accounts.map((account) => (
                        <span
                          key={`${creator.id}-${account.platform}`}
                          className="badge"
                        >
                          {PLATFORM_LABELS[account.platform]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{formatDate(creator.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}