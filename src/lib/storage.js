import { getDemoPosts, normalizePost } from "../domain/posts";

const STORAGE_KEY = "signaldesk:posts";
const STORAGE_VERSION = 1;

export const loadPosts = () => {
  if (typeof window === "undefined") return getDemoPosts();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDemoPosts();

    const payload = JSON.parse(raw);
    const isVersionedPayload =
      payload?.version === STORAGE_VERSION && Array.isArray(payload.posts);
    const isLegacyArray = Array.isArray(payload);

    if (!isVersionedPayload && !isLegacyArray) return getDemoPosts();

    const candidates = isVersionedPayload ? payload.posts : payload;
    return candidates.map(normalizePost).filter(Boolean);
  } catch {
    return getDemoPosts();
  }
};

export const savePosts = (posts) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        posts,
      }),
    );
  } catch {
    // Storage can be unavailable in privacy modes or quota-constrained browsers.
    // The in-memory product remains fully usable for the current session.
  }
};
