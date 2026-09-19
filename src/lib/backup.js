import { normalizePost } from "../domain/posts";

const BACKUP_APP = "signaldesk";
const BACKUP_VERSION = 1;
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const MAX_BACKUP_POSTS = 5_000;

const parseJson = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("This file is not valid JSON.");
  }
};

const normalizeBackupPosts = (candidates) => {
  if (!Array.isArray(candidates)) {
    throw new Error("This backup does not contain a signal library.");
  }

  if (candidates.length > MAX_BACKUP_POSTS) {
    throw new Error("This backup contains too many signals to restore safely.");
  }

  const normalized = candidates.map(normalizePost);

  if (normalized.some((post) => post === null)) {
    throw new Error("This backup contains one or more invalid signals.");
  }

  const ids = new Set();
  for (const post of normalized) {
    if (ids.has(post.id)) {
      throw new Error("This backup contains duplicate signal identifiers.");
    }
    ids.add(post.id);
  }

  return normalized;
};

export const createBackup = (posts, exportedAt = new Date().toISOString()) => ({
  app: BACKUP_APP,
  version: BACKUP_VERSION,
  exportedAt,
  posts,
});

export const serializeBackup = (posts, exportedAt) =>
  JSON.stringify(createBackup(posts, exportedAt), null, 2);

export const parseBackup = (raw) => {
  const backup = parseJson(raw);

  if (!backup || typeof backup !== "object" || Array.isArray(backup)) {
    throw new Error("This is not a SignalDesk backup.");
  }

  if (backup.app !== BACKUP_APP) {
    throw new Error("This backup was not created by SignalDesk.");
  }

  if (backup.version !== BACKUP_VERSION) {
    throw new Error("This SignalDesk backup version is not supported.");
  }

  return normalizeBackupPosts(backup.posts);
};

export const getBackupFilename = (date = new Date()) => {
  const day = date.toISOString().slice(0, 10);
  return `signaldesk-backup-${day}.json`;
};
