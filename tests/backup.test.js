import { describe, expect, it } from "vitest";
import {
  createBackup,
  getBackupFilename,
  parseBackup,
  serializeBackup,
} from "../src/lib/backup";
import { getDemoPosts } from "../src/domain/posts";

describe("backup format", () => {
  const posts = getDemoPosts();

  it("serializes a portable versioned SignalDesk backup", () => {
    const raw = serializeBackup(posts, "2026-09-19T14:00:00.000Z");

    expect(JSON.parse(raw)).toEqual({
      app: "signaldesk",
      version: 1,
      exportedAt: "2026-09-19T14:00:00.000Z",
      posts,
    });
  });

  it("round-trips trusted application data", () => {
    expect(parseBackup(serializeBackup(posts))).toEqual(posts);
  });

  it("normalizes restored records at the import boundary", () => {
    const raw = JSON.stringify(
      createBackup([
        {
          ...posts[0],
          title: "  Restored title  ",
          tags: ["Product", "#product", "Recovery"],
        },
      ]),
    );

    expect(parseBackup(raw)[0]).toMatchObject({
      title: "Restored title",
      tags: ["product", "recovery"],
    });
  });

  it("rejects invalid JSON and foreign files", () => {
    expect(() => parseBackup("{broken")).toThrow("not valid JSON");
    expect(() =>
      parseBackup(JSON.stringify({ app: "other-app", version: 1, posts: [] })),
    ).toThrow("not created by SignalDesk");
  });

  it("rejects unsupported future versions", () => {
    expect(() =>
      parseBackup(JSON.stringify({ app: "signaldesk", version: 99, posts: [] })),
    ).toThrow("version is not supported");
  });

  it("rejects duplicate identifiers instead of creating unstable React keys", () => {
    const duplicate = { ...posts[0] };

    expect(() =>
      parseBackup(
        JSON.stringify({
          app: "signaldesk",
          version: 1,
          posts: [duplicate, duplicate],
        }),
      ),
    ).toThrow("duplicate signal identifiers");
  });

  it("creates deterministic date-based filenames", () => {
    expect(getBackupFilename(new Date("2026-09-19T23:59:59.000Z"))).toBe(
      "signaldesk-backup-2026-09-19.json",
    );
  });
});
