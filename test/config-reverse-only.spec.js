import { test, expect } from './shared.js';

test.describe('Reverse Only', () => {
  test.skip(() => !process.env.REVERSE_ONLY, 'Only runs in reverse-only mode');

  test.describe('Redirect default pages', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/search.html');
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should redirect to /reverse', async () => {
      const current_url = new URL(page.url());
      expect(current_url.pathname).toBe('/reverse.html');
    });

    test('no navigation link', async () => {
      await expect(
        page.locator('nav ul li a[href="search.html"]')
      ).toHaveCount(0);
    });
  });
});
