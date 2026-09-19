import { describe, expect, it } from "vitest";
import {
  createPost,
  getPostStats,
  getVisiblePosts,
  normalizePost,
  postsReducer,
} from "../src/domain/posts";

const now = "2026-09-19T12:00:00.000Z";

const makePost = (overrides = {}) =>
  createPost(
    {
      title: "Useful signal",
      body: "Context worth finding again",
      kind: "note",
      tags: ["Product", "#Research", "product"],
      ...overrides,
    },
    overrides.id ?? "post-1",
    overrides.createdAt ?? now,
  );

describe("post domain", () => {
  it("normalizes content at the boundary", () => {
    const post = makePost();

    expect(post).toMatchObject({
      id: "post-1",
      title: "Useful signal",
      kind: "note",
      tags: ["product", "research"],
      favorite: false,
      pinned: false,
    });
  });

  it("rejects malformed posts instead of leaking invalid state", () => {
    expect(normalizePost({ id: "x", title: "", body: "body" })).toBeNull();
    expect(normalizePost(null)).toBeNull();
  });

  it("searches title, body, kind, and tags case-insensitively", () => {
    const posts = [
      makePost({ id: "one", title: "Architecture note", tags: ["backend"] }),
      makePost({ id: "two", title: "Design note", tags: ["Nordic"] }),
    ];

    expect(getVisiblePosts(posts, { query: "nordic" }).map((post) => post.id)).toEqual([
      "two",
    ]);
  });

  it("keeps pinned items ahead of the selected sort", () => {
    const olderPinned = {
      ...makePost({ id: "pinned", title: "Z item" }),
      pinned: true,
      updatedAt: "2026-09-01T12:00:00.000Z",
    };
    const newer = {
      ...makePost({ id: "newer", title: "A item" }),
      updatedAt: "2026-09-19T12:00:00.000Z",
    };

    expect(
      getVisiblePosts([newer, olderPinned], { sort: "title-asc" }).map((post) => post.id),
    ).toEqual(["pinned", "newer"]);
  });

  it("updates content without changing identity and re-normalizes tags", () => {
    const initialPost = makePost({ id: "stable-id" });
    const state = { posts: [initialPost], lastDeleted: null };

    const updated = postsReducer(state, {
      type: "post/updated",
      id: "stable-id",
      changes: {
        title: "  Updated title  ",
        tags: ["Architecture", "#architecture", "Reliability"],
        updatedAt: "2026-09-19T13:00:00.000Z",
      },
    });

    expect(updated.posts[0]).toMatchObject({
      id: "stable-id",
      title: "Updated title",
      tags: ["architecture", "reliability"],
      updatedAt: "2026-09-19T13:00:00.000Z",
    });
  });

  it("toggles pinned and favorite state independently", () => {
    const initial = { posts: [makePost()], lastDeleted: null };
    const pinned = postsReducer(initial, { type: "post/pinnedToggled", id: "post-1" });
    const favorite = postsReducer(pinned, { type: "post/favoriteToggled", id: "post-1" });

    expect(favorite.posts[0]).toMatchObject({
      pinned: true,
      favorite: true,
    });
  });

  it("restores a deleted item at its previous position", () => {
    const first = makePost({ id: "first" });
    const second = makePost({ id: "second" });
    const initial = { posts: [first, second], lastDeleted: null };

    const deleted = postsReducer(initial, { type: "post/deleted", id: "first" });
    const restored = postsReducer(deleted, { type: "post/restored" });

    expect(restored.posts.map((post) => post.id)).toEqual(["first", "second"]);
    expect(restored.lastDeleted).toBeNull();
  });

  it("derives overview metrics without duplicating state", () => {
    const posts = [
      { ...makePost({ id: "one", tags: ["a", "b"] }), pinned: true },
      { ...makePost({ id: "two", tags: ["b", "c"] }), favorite: true },
    ];

    expect(getPostStats(posts)).toEqual({
      total: 2,
      pinned: 1,
      favorites: 1,
      tags: 3,
    });
  });
});
