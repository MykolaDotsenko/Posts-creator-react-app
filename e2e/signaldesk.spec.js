import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
});

test("captures, finds, edits, and removes a signal with undo", async ({ page }) => {
  await page.getByLabel("Title").fill("Caching decisions");
  await page.getByLabel("Note").fill("Keep stale data visible while refresh retries in the background.");
  await page.getByLabel("Type").selectOption("idea");
  await page.getByLabel("Tags").fill("architecture, reliability");
  await page.getByRole("button", { name: "Add to SignalDesk" }).click();

  await page.getByPlaceholder("Search title, note, tag…").fill("reliability");
  const card = page.getByRole("article").filter({ hasText: "Caching decisions" });
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("Caching and stale-data decisions");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Caching and stale-data decisions")).toBeVisible();

  const updatedCard = page
    .getByRole("article")
    .filter({ hasText: "Caching and stale-data decisions" });
  await updatedCard.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText(/removed/)).toBeVisible();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText("Caching and stale-data decisions")).toBeVisible();
});

test("supports keyboard-first capture and search", async ({ page }) => {
  await page.keyboard.press("n");
  await expect(page.getByLabel("Title")).toBeFocused();

  await page.getByLabel("Title").press("Escape");
  await page.locator("body").click({ position: { x: 4, y: 4 } });
  await page.keyboard.press("/");
  await expect(page.getByPlaceholder("Search title, note, tag…")).toBeFocused();
});

test("has no obvious automated accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("does not overflow horizontally on the tested viewport", async ({ page }) => {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});
