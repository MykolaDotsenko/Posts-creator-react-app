const STAT_ITEMS = [
  ["total", "Signals", "All captured items"],
  ["pinned", "Pinned", "High-attention items"],
  ["favorites", "Favorites", "Worth revisiting"],
  ["tags", "Topics", "Distinct tags"],
];

export const StatsStrip = ({ stats }) => (
  <section className="stats-strip" aria-label="Workspace overview">
    {STAT_ITEMS.map(([key, label, hint]) => (
      <div className="stat" key={key}>
        <strong>{stats[key]}</strong>
        <span>{label}</span>
        <small>{hint}</small>
      </div>
    ))}
  </section>
);
