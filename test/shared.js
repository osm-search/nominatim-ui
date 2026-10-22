import { test as base } from '@playwright/test';

const API_DELAY_MS = 1000;
let lastApiRequestTime = 0;

async function throttleApiRequests(page) {
  await page.route(/\/(search|reverse|lookup|details|status)\?/, async (route) => {
    const now = Date.now();
    const elapsed = now - lastApiRequestTime;
    if (elapsed < API_DELAY_MS) {
      await new Promise(r => setTimeout(r, API_DELAY_MS - elapsed));
    }
    lastApiRequestTime = Date.now();
    await route.continue();
  });
}

/**
 * Extended test fixture that throttles requests to the Nominatim API
 * to avoid rate limiting (HTTP 429).
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await throttleApiRequests(page);
    await use(page);
  },
  browser: async ({ browser }, use) => {
    const originalNewPage = browser.newPage.bind(browser);
    browser.newPage = async (options) => {
      const page = await originalNewPage(options);
      await throttleApiRequests(page);
      return page;
    };
    await use(browser);
  },
});

/**
 * Wait until the page shows the results of the API request whose URL
 * contains href_part. The 'API request' link in the header gets removed
 * when a new API request starts and only comes back once its response has
 * been displayed.
 */
export async function waitForApiRequestLink(page, href_part) {
  await page.locator(`#api-request a[href*="${href_part}"]`).first().waitFor();
}

export { expect } from '@playwright/test';
