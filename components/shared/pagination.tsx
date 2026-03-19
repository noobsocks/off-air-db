import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
};

function createHref(
  basePath: string,
  page: number,
  query?: Record<string, string | undefined>
) {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value && value.trim().length > 0) {
        params.set(key, value);
      }
    });
  }

  params.set("page", String(page));

  return `${basePath}?${params.toString()}`;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  query,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <Link
        href={createHref(basePath, Math.max(1, currentPage - 1), query)}
        className={`pagination__button ${
          currentPage === 1 ? "pagination__button--disabled" : ""
        }`}
      >
        이전
      </Link>

      <div className="pagination__numbers">
        {pageNumbers.map((page) => (
          <Link
            key={page}
            href={createHref(basePath, page, query)}
            className={`pagination__number ${
              currentPage === page ? "pagination__number--active" : ""
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        href={createHref(basePath, Math.min(totalPages, currentPage + 1), query)}
        className={`pagination__button ${
          currentPage === totalPages ? "pagination__button--disabled" : ""
        }`}
      >
        다음
      </Link>
    </div>
  );
}