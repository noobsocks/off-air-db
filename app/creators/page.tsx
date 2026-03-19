import Link from "next/link";
import CreatorFilters from "@/components/creators/creator-filters";
import CreatorTable from "@/components/creators/creator-table";
import Pagination from "@/components/shared/pagination";
import { canExport, canUpload } from "@/lib/auth/permissions";
import { getCurrentRole } from "@/lib/auth/session";
import { getAllCreators } from "@/lib/db/creators";
import { normalizeText } from "@/lib/utils";

type Props = {
  searchParams: Promise<{
    q?: string;
    platform?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 50;

export default async function CreatorsPage({ searchParams }: Props) {
  const params = await searchParams;
  const creators = await getAllCreators();
  const role = await getCurrentRole();

  const query = params.q?.trim() ?? "";
  const platform = params.platform?.trim() ?? "all";
  const rawPage = Number(params.page ?? "1");
  const currentPage = Number.isNaN(rawPage) ? 1 : rawPage;
  const normalizedQuery = query ? normalizeText(query) : "";

  const filteredCreators = creators.filter((creator) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      creator.nameNormalized.includes(normalizedQuery);

    const matchesPlatform =
      platform === "all" ||
      creator.accounts.some((account) => account.platform === platform);

    return matchesQuery && matchesPlatform;
  });

  const totalCount = filteredCreators.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pagedCreators = filteredCreators.slice(startIndex, endIndex);

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header panel__header--row">
          <div>
            <h2 className="panel__title">크리에이터 리스트</h2>
            <p className="panel__description">
              등록된 크리에이터를 검색하고 플랫폼별로 필터링할 수 있습니다.
            </p>
          </div>

          <div className="form-actions">
            {canExport(role) && (
              <a href="/api/creators/export" className="secondary-button">
                CSV 추출
              </a>
            )}

            {canUpload(role) && (
              <Link href="/creators/new" className="primary-button">
                새 크리에이터 등록
              </Link>
            )}
          </div>
        </div>

        <div className="panel__body">
          <CreatorFilters defaultQuery={query} defaultPlatform={platform} />

          <div className="list-summary">
            총 <strong>{totalCount}</strong>명의 크리에이터
          </div>

          <CreatorTable creators={pagedCreators} />

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            basePath="/creators"
            query={{
              q: query,
              platform,
            }}
          />
        </div>
      </section>
    </div>
  );
}