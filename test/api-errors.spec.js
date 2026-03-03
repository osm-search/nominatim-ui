import { test, expect } from '@playwright/test';

test.describe('Nominatim API errors', () => {

  test.describe('HTTP 503 - service unavailable', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/search.html?q=london&mock_api_error=fetch');
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should display an error', async () => {
      await page.locator('#error').waitFor();
      await expect(page.locator('#error')).toContainText(
        'Error fetching data from'
      );
    });
  });

  test.describe('HTTP 200 - JSON parsing fails', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/search.html?q=london&mock_api_error=parse');
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should display an error', async () => {
      await page.waitForFunction(
        () => document.querySelector('#error')
              ?.textContent.includes('Error parsing JSON data from'),
        { timeout: 10000 }
      );
    });
  });
});
