import { test, expect } from './shared.js';

test.describe('Browser behaviour', () => {

  test('should have a user-agent', async ({ page }) => {
    await page.goto('/search.html');
    const user_agent = await page.evaluate(() => navigator.userAgent);
    expect(user_agent).toBe(
      'Nominatim UI test suite Mozilla/5.0 Gecko/20100101 HeadlessChrome/90.0'
    );
  });
});
