import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/about.html');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should contain Nominatim description', async () => {
    await page.locator('#about-help').waitFor();
    await expect(page.locator('#about-help')).toContainText(
      'Nominatim is a search engine'
    );
  });
});
