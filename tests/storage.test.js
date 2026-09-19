import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getDemoPosts } from "../src/domain/posts";
import { loadPosts, savePosts } from "../src/lib/storage";

const STORAGE_KEY = "signaldesk:posts";

describe("storage adapter", () => {
  let values;

  beforeEach(() => {
    values = new Map();
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem: (key) => values.get(key) ?? null,
          setItem: (key, value) => values.set(key, value),
        },
      },
    });
  });

  afterEach(() => {
    delete globalThis.window;
  });

  it("uses demo content only when no persisted library exists", () => {
    expect(loadPosts()).toEqual(getDemoPosts());
  });

  it("preserves a deliberately empty versioned library", () => {
    values.set(STORAGE_KEY, JSON.stringify({ version: 1, posts: [] }));

    expect(loadPosts()).toEqual([]);
  });

  it("falls back safely when persisted JSON is corrupted", () => {
    values.set(STORAGE_KEY, "{broken");

    expect(loadPosts()).toEqual(getDemoPosts());
  });

  it("normalizes legacy array payloads instead of discarding valid content", () => {
    values.set(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "legacy",
          title: " Legacy title ",
          body: " Legacy body ",
          tags: ["Research", "#research"],
        },
      ]),
    );

    expect(loadPosts()).toEqual([
      expect.objectContaining({
        id: "legacy",
        title: "Legacy title",
        body: "Legacy body",
        tags: ["research"],
        kind: "note",
      }),
    ]);
  });

  it("writes the current versioned payload", () => {
    const posts = getDemoPosts().slice(0, 1);

    expect(savePosts(posts)).toBe(true);

    expect(JSON.parse(values.get(STORAGE_KEY))).toEqual({
      version: 1,
      posts,
    });
  });

  it("reports a persistence failure without throwing", () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem: () => null,
          setItem: () => {
            throw new DOMException("Storage blocked", "SecurityError");
          },
        },
      },
    });

    expect(savePosts(getDemoPosts())).toBe(false);
  });
});
