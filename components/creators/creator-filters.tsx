type Props = {
  defaultQuery?: string;
  defaultPlatform?: string;
};

export default function CreatorFilters({
  defaultQuery = "",
  defaultPlatform = "all",
}: Props) {
  return (
    <form action="/creators" method="get" className="filters">
      <div className="filters__group">
        <label htmlFor="q" className="filters__label">
          이름 검색
        </label>
        <input
          id="q"
          name="q"
          type="text"
          defaultValue={defaultQuery}
          placeholder="크리에이터 이름 검색"
          className="filters__input"
        />
      </div>

      <div className="filters__group">
        <label htmlFor="platform" className="filters__label">
          플랫폼
        </label>
        <select
          id="platform"
          name="platform"
          defaultValue={defaultPlatform}
          className="filters__select"
        >
          <option value="all">전체</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="xiaohongshu">Xiaohongshu</option>
        </select>
      </div>

      <div className="filters__actions">
        <button type="submit" className="primary-button">
          찾기
        </button>
      </div>
    </form>
  );
}