import { useEffect, useMemo, useRef, useState, useReducer } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import { AppHeader } from "./components/AppHeader";
import { Composer } from "./components/Composer";
import { FilterBar } from "./components/FilterBar";
import { PostList } from "./components/PostList";
import { StatsStrip } from "./components/StatsStrip";
import {
  createPost,
  getPostStats,
  getVisiblePosts,
  postsReducer,
} from "./domain/posts";
import { loadPosts, savePosts } from "./lib/storage";

export const App = () => {
  const [state, dispatch] = useReducer(postsReducer, undefined, () => ({
    posts: loadPosts(),
    lastDeleted: null,
  }));
  const [query, setQuery] = useState("");
  const [view, setView] = useState("all");
  const [sort, setSort] = useState("updated-desc");
  const [editingId, setEditingId] = useState(null);

  const composerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    savePosts(state.posts);
  }, [state.posts]);

  useEffect(() => {
    const handleShortcut = (event) => {
      const element = event.target;
      const isTyping =
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        element?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (event.key.toLowerCase() === "n" && !isTyping) {
        event.preventDefault();
        composerRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === searchInputRef.current) {
        setQuery("");
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const editingPost = useMemo(
    () => state.posts.find((post) => post.id === editingId) ?? null,
    [editingId, state.posts],
  );

  const visiblePosts = useMemo(
    () => getVisiblePosts(state.posts, { query, view, sort }),
    [query, sort, state.posts, view],
  );

  const stats = useMemo(() => getPostStats(state.posts), [state.posts]);

  const handleSave = (draft) => {
    const now = new Date().toISOString();

    if (editingPost) {
      dispatch({
        type: "post/updated",
        id: editingPost.id,
        changes: {
          ...draft,
          updatedAt: now,
        },
      });
      setEditingId(null);
      return;
    }

    dispatch({
      type: "post/created",
      post: createPost(draft, nanoid(), now),
    });
  };

  const handleDelete = (id) => {
    dispatch({ type: "post/deleted", id });
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleNewPost = () => {
    setEditingId(null);
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <AppHeader onNewPost={handleNewPost} />

      <main className="workspace">
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <p className="eyebrow">Local-first knowledge workspace</p>
            <h1 id="hero-title">
              Keep the useful things.
              <span> Lose the noise.</span>
            </h1>
            <p className="hero-copy">
              Capture ideas, research notes, and links in seconds. Search them later
              without an account, cloud sync, or another inbox to maintain.
            </p>
          </div>
          <div className="hero-shortcuts" aria-label="Keyboard shortcuts">
            <span><kbd>N</kbd> new post</span>
            <span><kbd>/</kbd> search</span>
          </div>
        </section>

        <StatsStrip stats={stats} />

        <div className="workspace-grid">
          <aside className="composer-column">
            <Composer
              ref={composerRef}
              editingPost={editingPost}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
            />
          </aside>

          <section className="feed-column" aria-labelledby="feed-title">
            <div className="feed-heading">
              <div>
                <p className="section-kicker">Your signal library</p>
                <h2 id="feed-title">Everything worth keeping</h2>
              </div>
              <span className="result-count" aria-live="polite">
                {visiblePosts.length} {visiblePosts.length === 1 ? "item" : "items"}
              </span>
            </div>

            <FilterBar
              query={query}
              view={view}
              sort={sort}
              stats={stats}
              searchInputRef={searchInputRef}
              onQueryChange={setQuery}
              onViewChange={setView}
              onSortChange={setSort}
            />

            <PostList
              posts={visiblePosts}
              hasPosts={state.posts.length > 0}
              onEdit={setEditingId}
              onDelete={handleDelete}
              onToggleFavorite={(id) => dispatch({ type: "post/favoriteToggled", id })}
              onTogglePinned={(id) => dispatch({ type: "post/pinnedToggled", id })}
              onResetFilters={() => {
                setQuery("");
                setView("all");
                setSort("updated-desc");
              }}
            />
          </section>
        </div>
      </main>

      {state.lastDeleted && (
        <div className="undo-toast" role="status">
          <span>“{state.lastDeleted.post.title}” removed</span>
          <button type="button" onClick={() => dispatch({ type: "post/restored" })}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
};
