import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=AGON")).toBeVisible();
});

test("dashboard loads with all sections", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator("text=DAY")).toBeVisible();
  await expect(page.locator("text=PHASE TIMELINE")).toBeVisible();
});

test("navigation sidebar has all links", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator("text=War Room")).toBeVisible();
  await expect(page.locator("text=Daily Contract")).toBeVisible();
  await expect(page.locator("text=Habits")).toBeVisible();
  await expect(page.locator("text=Forge")).toBeVisible();
});

test("habits page loads", async ({ page }) => {
  await page.goto("/dashboard/habits");
  await expect(page.locator("text=YOUR DISCIPLINES")).toBeVisible();
});

test("forge page loads", async ({ page }) => {
  await page.goto("/dashboard/forge");
  await expect(page.locator("text=THE FORGE")).toBeVisible();
});

test("onboarding page loads", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page.locator("text=AGON")).toBeVisible();
});
