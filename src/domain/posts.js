const VALID_KINDS = new Set(["note", "idea", "link"]);

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeTags = (tags) => {
  const source = Array.isArray(tags) ? tags : [];
  const seen = new Set();

  return source
    .map((tag) => cleanText(tag).replace(/^#/, "").toLowerCase())
    .filter(Boolean)
    .filter((tag) => {
      if (seen.has(tag)) return false;
      seen.add(tag);
      return true;
    })
    .slice(0, 6);
};

export const normalizePost = (candidate) => {
  if (!candidate || typeof candidate !== "object") return null;

  const title = cleanText(candidate.title);
  const body = cleanText(candidate.body);
  const id = cleanText(candidate.id);

  if (!id || !title || !body) return null;

  const createdAt = Number.isNaN(Date.parse(candidate.createdAt))
    ? new Date(0).toISOString()
    : candidate.createdAt;
  const updatedAt = Number.isNaN(Date.parse(candidate.updatedAt))
    ? createdAt
    : candidate.updatedAt;

  return {
    id,
    title: title.slice(0, 120),
    body: body.slice(0, 2000),
    kind: VALID_KINDS.has(candidate.kind) ? candidate.kind : "note",
    tags: normalizeTags(candidate.tags),
    favorite: Boolean(candidate.favorite),
    pinned: Boolean(candidate.pinned),
    createdAt,
    updatedAt,
  };
};

export const createPost = (draft, id, now = new Date().toISOString()) =>
  normalizePost({
    ...draft,
    id,
    favorite: false,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  });

const DEMO_POSTS = [
  {
    id: "demo-product",
    title: "Product decisions worth revisiting",
    body:
      "Keep short notes about decisions, useful links, and the context behind them. Future-you should understand why something mattered without reopening five tabs.",
    kind: "idea",
    tags: ["product", "decisions"],
    favorite: true,
    pinned: true,
    createdAt: "2026-09-18T08:30:00.000Z",
    updatedAt: "2026-09-18T08:30:00.000Z",
  },
  {
    id: "demo-research",
    title: "Research queue",
    body:
      "Capture useful sources when you find them, then tag them by topic. Search across titles, notes, and tags when the information becomes relevant.",
    kind: "link",
    tags: ["research", "reading"],
    favorite: false,
    pinned: false,
    createdAt: "2026-09-17T15:10:00.000Z",
    updatedAt: "2026-09-17T15:10:00.000Z",
  },
  {
    id: "demo-idea",
    title: "Small ideas compound",
    body:
      "A useful workspace should make capture cheaper than forgetting. Keep the interface quiet, the state local, and the retrieval path obvious.",
    kind: "note",
    tags: ["ideas", "workflow"],
    favorite: true,
    pinned: false,
    createdAt: "2026-09-16T10:45:00.000Z",
    updatedAt: "2026-09-16T10:45:00.000Z",
  },
];

export const getDemoPosts = () => DEMO_POSTS.map((post) => ({ ...post, tags: [...post.tags] }));

export const postsReducer = (state, action) => {
  switch (action.type) {
    case "post/created":
      return action.post
        ? { posts: [action.post, ...state.posts], lastDeleted: null }
        : state;

    case "post/updated":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.id
            ? normalizePost({ ...post, ...action.changes, id: post.id }) ?? post
            : post,
        ),
      };

    case "post/favoriteToggled":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.id ? { ...post, favorite: !post.favorite } : post,
        ),
      };

    case "post/pinnedToggled":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.id ? { ...post, pinned: !post.pinned } : post,
        ),
      };

    case "post/deleted": {
      const index = state.posts.findIndex((post) => post.id === action.id);
      if (index < 0) return state;

      return {
        posts: state.posts.filter((post) => post.id !== action.id),
        lastDeleted: { post: state.posts[index], index },
      };
    }

    case "post/restored": {
      if (!state.lastDeleted) return state;

      const posts = [...state.posts];
      const index = Math.min(state.lastDeleted.index, posts.length);
      posts.splice(index, 0, state.lastDeleted.post);
      return { posts, lastDeleted: null };
    }

    case "library/replaced":
      return Array.isArray(action.posts)
        ? { posts: action.posts, lastDeleted: null }
        : state;

    default:
      return state;
  }
};

const includesQuery = (post, query) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [post.title, post.body, post.kind, ...post.tags]
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
};

const sorters = {
  "updated-desc": (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
  "created-desc": (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  "title-asc": (a, b) => a.title.localeCompare(b.title),
};

export const getVisiblePosts = (posts, { query = "", view = "all", sort = "updated-desc" }) => {
  const filtered = posts.filter((post) => {
    if (!includesQuery(post, query)) return false;
    if (view === "pinned") return post.pinned;
    if (view === "favorites") return post.favorite;
    return true;
  });

  const sorter = sorters[sort] ?? sorters["updated-desc"];

  return [...filtered].sort((a, b) => {
    if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
    return sorter(a, b);
  });
};

export const getPostStats = (posts) => ({
  total: posts.length,
  pinned: posts.filter((post) => post.pinned).length,
  favorites: posts.filter((post) => post.favorite).length,
  tags: new Set(posts.flatMap((post) => post.tags)).size,
});
