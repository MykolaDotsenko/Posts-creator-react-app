import { PostCard } from "./PostCard";

export const PostList = ({
  posts,
  hasPosts,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTogglePinned,
  onResetFilters,
}) => {
  if (!hasPosts) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">✦</span>
        <h3>Your workspace is clear</h3>
        <p>Add the first useful signal with the composer. It stays on this device.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">⌕</span>
        <h3>No matching signals</h3>
        <p>Try another search or return to the full library.</p>
        <button className="button button-ghost" type="button" onClick={onResetFilters}>
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onTogglePinned={onTogglePinned}
        />
      ))}
    </div>
  );
};
