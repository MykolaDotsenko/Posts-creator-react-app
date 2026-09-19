const VIEWS = [
  ["all", "All"],
  ["pinned", "Pinned"],
  ["favorites", "Favorites"],
];

export const FilterBar = ({
  query,
  view,
  sort,
  stats,
  searchInputRef,
  onQueryChange,
  onViewChange,
  onSortChange,
}) => (
  <div className="filter-panel">
    <label className="search-field">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>
      <span className="sr-only">Search posts</span>
      <input
        ref={searchInputRef}
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search title, note, tag…"
        autoComplete="off"
      />
      <kbd>/</kbd>
    </label>

    <div className="filter-row">
      <div className="segmented" aria-label="Post view">
        {VIEWS.map(([value, label]) => {
          const count =
            value === "all" ? stats.total : value === "pinned" ? stats.pinned : stats.favorites;

          return (
            <button
              key={value}
              type="button"
              className={view === value ? "is-active" : ""}
              aria-pressed={view === value}
              onClick={() => onViewChange(value)}
            >
              {label}
              <span>{count}</span>
            </button>
          );
        })}
      </div>

      <label className="sort-field">
        <span className="sr-only">Sort posts</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
          <option value="updated-desc">Recently updated</option>
          <option value="created-desc">Newest created</option>
          <option value="title-asc">Title A–Z</option>
        </select>
      </label>
    </div>
  </div>
);
