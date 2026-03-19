import type { ImportPreviewRow } from "@/types/import";

type Props = {
  rows: ImportPreviewRow[];
};

function getCounts(rows: ImportPreviewRow[]) {
  return {
    total: rows.length,
    newCount: rows.filter((row) => row.status === "new").length,
    duplicateCount: rows.filter((row) => row.status === "duplicate").length,
    errorCount: rows.filter((row) => row.status === "error").length,
  };
}

export default function ImportPreview({ rows }: Props) {
  const counts = getCounts(rows);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="import-stack">
      <div className="summary-grid">
        <article className="summary-card">
          <p className="summary-card__label">전체 행 수</p>
          <p className="summary-card__value">{counts.total}</p>
        </article>

        <article className="summary-card">
          <p className="summary-card__label">신규 가능</p>
          <p className="summary-card__value">{counts.newCount}</p>
        </article>

        <article className="summary-card">
          <p className="summary-card__label">중복 의심</p>
          <p className="summary-card__value">{counts.duplicateCount}</p>
        </article>

        <article className="summary-card">
          <p className="summary-card__label">오류</p>
          <p className="summary-card__value">{counts.errorCount}</p>
        </article>
      </div>

      <div className="preview-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>행</th>
              <th>이름</th>
              <th>YouTube</th>
              <th>TikTok</th>
              <th>Instagram</th>
              <th>Xiaohongshu</th>
              <th>상태</th>
              <th>사유</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.rowNumber}-${row.creatorName}`}>
                <td>{row.rowNumber}</td>
                <td className="data-table__name">{row.creatorName || "-"}</td>
                <td>{row.youtubeUrl || "-"}</td>
                <td>{row.tiktokUrl || "-"}</td>
                <td>{row.instagramUrl || "-"}</td>
                <td>{row.xiaohongshuUrl || "-"}</td>
                <td>
                  <span
                    className={`status-pill ${
                      row.status === "new"
                        ? "status-pill--new"
                        : row.status === "duplicate"
                        ? "status-pill--duplicate"
                        : "status-pill--error"
                    }`}
                  >
                    {row.status === "new"
                      ? "신규"
                      : row.status === "duplicate"
                      ? "중복"
                      : "오류"}
                  </span>
                </td>
                <td>
                  <div className="preview-reason">{row.reason}</div>

                  {row.duplicates.length > 0 && (
                    <div className="preview-duplicates">
                      {row.duplicates.map((creator) => (
                        <span key={creator.id} className="preview-duplicate-chip">
                          {creator.name}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}