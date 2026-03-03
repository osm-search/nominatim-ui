import { test, expect } from '@playwright/test';

test.describe('Status Page', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/status.html', { waitUntil: 'networkidle' });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should have software version', async () => {
    await page.waitForFunction(
      () => document.body.textContent.match(/Software version.*\d+\.\d+/),
      { timeout: 10000 }
    );

    const status_details = await page.evaluate(
      () => document.body.textContent.match(/Software version.*\d+\.\d+/)
    );

    expect(status_details[0]).not.toContain('undefined');
  });
});
