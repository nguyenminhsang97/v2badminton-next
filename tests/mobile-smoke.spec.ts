import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/hoc-cau-long-cho-nguoi-moi/",
  "/lop-cau-long-binh-thanh/",
  "/lop-cau-long-thu-duc/",
];

test.describe("mobile route smoke", () => {
  for (const route of routes) {
    test(`${route} renders without mobile horizontal overflow`, async ({
      page,
    }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      expect(response?.status(), `${route} should not fail`).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
      await expect(page).toHaveTitle(/.+/);

      const overflow = await page.evaluate(() => {
        const scrollWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth,
        );

        return scrollWidth - window.innerWidth;
      });

      expect(overflow, `${route} should not scroll sideways`).toBeLessThanOrEqual(
        2,
      );
    });
  }
});
