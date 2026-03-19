type StatCard = {
  key: string;
  label: string;
  count: number;
};

type Props = {
  total: number;
  platforms: StatCard[];
};

export default function CreatorStats({ total, platforms }: Props) {
  return (
    <section className="stats-grid">
      <article className="stat-card stat-card--primary">
        <p className="stat-card__label">전체 크리에이터</p>
        <p className="stat-card__value">{total}</p>
      </article>

      {platforms.map((item) => (
        <article key={item.key} className="stat-card">
          <p className="stat-card__label">{item.label}</p>
          <p className="stat-card__value">{item.count}</p>
        </article>
      ))}
    </section>
  );
}