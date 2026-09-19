import { expect, test } from "@playwright/test";

test("core capture and persistence flow works", async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  await expect(page.getByRole("heading", { name: "Keep the useful things. Lose the noise." })).toBeVisible();

  await page.getByLabel("Title", { exact: true }).fill("Cross-browser signal");
  await page.getByLabel("Note").fill("Created by the cross-browser smoke suite.");
  await page.getByRole("button", { name: "Add to SignalDesk" }).click();

  await expect(page.getByText("Cross-browser signal")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Cross-browser signal")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export backup" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^signaldesk-backup-\d{4}-\d{2}-\d{2}\.json$/);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});
