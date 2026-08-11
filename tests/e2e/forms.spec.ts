import { expect, test } from "@playwright/test";

test("household crop form hides commercial land questions", async ({ page }) => {
  await page.goto("/crops");
  await expect(page.getByLabel("Land area")).toHaveCount(0);
  await expect(page.getByLabel("Slope or terrain")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Detect" })).toBeVisible();
  await page.getByRole("button", { name: /Commercial farm/ }).click();
  await expect(page.getByLabel("Land area")).toBeVisible();
  await expect(page.getByLabel("Slope or terrain")).toBeVisible();
});

test("soil form has elevation but no land area", async ({ page }) => {
  await page.goto("/soil");
  await expect(page.getByLabel("Elevation")).toBeVisible();
  await expect(page.getByLabel("Land area")).toHaveCount(0);
});

test("plant doctor offers camera and library separately", async ({ page }) => {
  await page.goto("/disease");
  await expect(page.getByRole("button", { name: "Take photo" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Choose photo" })).toBeVisible();
});
