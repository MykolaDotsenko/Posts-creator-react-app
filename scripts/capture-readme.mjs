import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";

const BASE_URL = "http://127.0.0.1:4173/Posts-creator-react-app/";
const OUTPUT_DIR = "docs/screenshots";

const waitForServer = async (url, attempts = 50) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not become ready at ${url}`);
};

await mkdir(OUTPUT_DIR, { recursive: true });

const preview = spawn(
  "npm",
  ["run", "preview", "--", "--host", "127.0.0.1"],
  { stdio: "inherit" },
);

try {
  await waitForServer(BASE_URL);

  const browser = await chromium.launch();

  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });

  await desktop.goto(BASE_URL, { waitUntil: "networkidle" });
  await desktop.screenshot({
    path: `${OUTPUT_DIR}/signaldesk-desktop.png`,
    fullPage: false,
  });

  await desktop.getByRole("button", { name: /^Favorites/ }).click();
  await desktop.locator(".feed-column").scrollIntoViewIfNeeded();
  await desktop.locator(".feed-column").screenshot({
    path: `${OUTPUT_DIR}/signaldesk-library.png`,
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  await mobile.goto(BASE_URL, { waitUntil: "networkidle" });
  await mobile.locator(".composer-card").scrollIntoViewIfNeeded();
  await mobile.screenshot({
    path: `${OUTPUT_DIR}/signaldesk-mobile.png`,
    fullPage: false,
  });

  await browser.close();
} finally {
  preview.kill("SIGTERM");
}
