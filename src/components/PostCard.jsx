const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const KIND_LABELS = {
  note: "Note",
  idea: "Idea",
  link: "Source",
};

export const PostCard = ({
  post,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePinned,
}) => (
  <article className={`post-card kind-${post.kind}`}>
    <div className="post-topline">
      <div className="post-meta">
        <span className="kind-badge">{KIND_LABELS[post.kind] ?? "Note"}</span>
        <time dateTime={post.updatedAt}>
          Updated {DATE_FORMATTER.format(new Date(post.updatedAt))}
        </time>
      </div>

      <div className="post-quick-actions">
        <button
          className={`icon-button ${post.pinned ? "is-active" : ""}`}
          type="button"
          aria-label={post.pinned ? `Unpin ${post.title}` : `Pin ${post.title}`}
          aria-pressed={post.pinned}
          title={post.pinned ? "Unpin" : "Pin"}
          onClick={() => onTogglePinned(post.id)}
        >
          <span aria-hidden="true">⌁</span>
        </button>
        <button
          className={`icon-button ${post.favorite ? "is-active" : ""}`}
          type="button"
          aria-label={
            post.favorite
              ? `Remove ${post.title} from favorites`
              : `Add ${post.title} to favorites`
          }
          aria-pressed={post.favorite}
          title={post.favorite ? "Remove from favorites" : "Favorite"}
          onClick={() => onToggleFavorite(post.id)}
        >
          <span aria-hidden="true">{post.favorite ? "★" : "☆"}</span>
        </button>
      </div>
    </div>

    <div className="post-content">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </div>

    {post.tags.length > 0 && (
      <ul className="tag-list" aria-label="Tags">
        {post.tags.map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
    )}

    <footer className="post-footer">
      <span className="post-state">{post.pinned ? "Pinned to the top" : "Ready when you need it"}</span>
      <div className="post-actions">
        <button className="text-button" type="button" onClick={() => onEdit(post.id)}>
          Edit
        </button>
        <button
          className="text-button text-button-danger"
          type="button"
          onClick={() => onDelete(post.id)}
        >
          Delete
        </button>
      </div>
    </footer>
  </article>
);
