import { test, expect } from '@playwright/test';

const reverse_only = !!process.env.REVERSE_ONLY;

test.describe('Reverse Page', () => {

  test.describe('No search', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/reverse.html');
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should allow switching coordinates', async () => {
      expect(await page.locator('input[name=lat]').inputValue()).toBe('');
      expect(await page.locator('input[name=lon]').inputValue()).toBe('');

      await page.locator('#switch-coords').click();
      // no change
      expect(await page.locator('input[name=lat]').inputValue()).toBe('');
      expect(await page.locator('input[name=lon]').inputValue()).toBe('');

      await page.locator('input[name=lat]').fill('5');
      await page.locator('input[name=lon]').fill('10');
      await page.locator('#switch-coords').click();
      // switched
      expect(await page.locator('input[name=lat]').inputValue()).toBe('10');
      expect(await page.locator('input[name=lon]').inputValue()).toBe('5');
    });
  });

  test.describe('With search', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/reverse.html');
      await page.locator('input[name=lat]').fill('27.1750090510034');
      await page.locator('input[name=lon]').fill('78.04209025');
      await page.locator('button[type=submit]').click();
      await page.locator('#searchresults').waitFor();
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should return single result', async () => {
      const results_count = await page.locator(
        '#searchresults .result'
      ).count();
      expect(results_count).toBe(1);
    });

    test('should display a map', async () => {
      await page.locator('#map').waitFor();
      await expect(page.locator('#map')).toHaveCount(1);
    });

    test('should preserve advanced options when searching from a map click',
      async () => {
        // Set layer=address, submit form
        await page.locator('#searchAdvancedOptions summary').click();
        await page.locator('#option_layer').waitFor();
        await page.locator('#option_layer').evaluate(
          (input) => { input.value = ''; }
        );
        await page.locator('#option_layer').fill('address');
        await page.locator('button[type=submit]').click();
        await page.waitForFunction(() => {
          return new URLSearchParams(location.search).get('layer') === 'address';
        });

        const initialUrl = new URL(page.url());
        const initialLat = initialUrl.searchParams.get('lat');

        // Click on new position
        await page.locator('#map').click({ position: { x: 50, y: 50 } });

        // Wait until latitude in URL changed
        await page.waitForFunction(
          (previousLat) => {
            return new URL(window.location.href)
              .searchParams.get('lat') !== previousLat;
          },
          initialLat
        );

        // Confirm the layer=address is still in URL
        const refreshedUrl = new URL(page.url());
        expect(refreshedUrl.searchParams.get('layer')).toBe('address');
      }
    );

    test('should redirect to details page on clicking details button',
      async () => {
        await page.locator('#searchresults .result a').first().click();
        await page.locator('table#address').waitFor();

        const current_url = new URL(page.url());
        expect(current_url.pathname).toBe('/details.html');
      }
    );

    if (!reverse_only) {
      test('should clear results when switching to search page', async () => {
        await page.locator('nav .nav-link[href="search.html"]').click();

        const results_count = await page.locator(
          '#searchresults .result'
        ).count();
        expect(results_count).toBe(0);
      });
    }
  });
});
