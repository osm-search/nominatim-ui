import { test, expect } from './shared.js';

const reverse_only = !!process.env.REVERSE_ONLY;

test.describe('Details Page', () => {

  test.describe('No search', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/details.html');
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should have a HTML page title', async () => {
      expect(await page.title()).toBe('Nominatim Demo');
    });
  });

  test.describe('With search - no place found', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/details.html');
      await page.locator('input[type=edit]').fill('N6');
      await page.locator('button[type=submit]').click();
      await page.locator('#api-request').waitFor();
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should display error', async () => {
      await expect(page.locator('body')).toContainText(
        'No place with that OSM ID found'
      );
    });
  });

  test.describe('With search - Vaduz (Liechtenstein)', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/details.html');
      await page.locator('input[type=edit]').fill('R1155956');
      await page.locator('button[type=submit]').click();
      await page.locator('table#address').waitFor();
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should have header title', async () => {
      await expect(page.locator('.container h1')).toContainText('Vaduz');
    });

    test('should have OSM link', async () => {
      const url = 'https://www.openstreetmap.org/relation/1155956';
      await expect(page.locator(`a[href="${url}"]`)).toHaveCount(2);
    });

    // Reverse-only installation have no search index, therefore no keywords
    if (!reverse_only) {

      test('should have a link to postcode which includes country code',
        async () => {
          const url = 'search.html?postalcode=9490&country=li';
          await expect(page.locator(`a[href="${url}"]`)).toHaveCount(1);
        }
      );

      test('should change url and add new header on clicking display keywords',
        async () => {
          await page.locator('a', { hasText: 'display keywords' }).click();
          await page.waitForURL(/keywords=1/);

          const current_url = new URL(page.url());
          expect(current_url.searchParams.get('keywords')).toBe('1');

          await page.locator('h3').first().waitFor();
          const display_headers = await page.locator('h3').evaluateAll(
            elements => elements.map(el => el.textContent)
          );
          expect(display_headers).toEqual(
            ['Name Keywords', 'Address Keywords']
          );

          await expect(page.locator('body')).toContainText('vadouz');
        }
      );
    }

    test('should support case-insensitive search, can navigate to new page',
      async () => {
        await page.locator('input[type=edit]').fill('w375257537');
        await page.locator('button[type=submit]').click();

        await page.locator(
          'a[href="https://www.openstreetmap.org/way/375257537"]'
        ).first().waitFor();
        await expect(page.locator('.container h1')).toContainText('Taj Mahal');
      }
    );
  });

  test.describe(
    'With street search - a place that is parent of buildings',
    () => {
      let page;

      test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto(
          '/details.html?osmtype=W&osmid=32703083'
        );
        await page.locator('.container .row').first().waitFor();
      });

      test.afterAll(async () => {
        await page.close();
      });

      test('should change page url on clicking display child places',
        async () => {
          await expect(page.locator('body')).toContainText('Gafleistrasse');

          await page.locator(
            'a', { hasText: 'display child places' }
          ).click();
          await page.waitForURL(/hierarchy=1/);
          await page.locator('table#address').waitFor();

          const current_url = new URL(page.url());
          expect(current_url.searchParams.get('hierarchy')).toBe('1');

          await expect(page.locator('body')).toContainText('bus_stop');
        }
      );
    }
  );

  test.describe('Place without name, keywords, hierarchy', () => {
    let page;

    // e.g. a numeric house number
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(
        '/details.html?osmtype=N&osmid=946563004&keywords=1&hierarchy=1'
      );
      await page.locator('.container .row').first().waitFor();
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should display No Name, no keywords, no hierarchy', async () => {
      await expect(page.locator('body')).toContainText('NameNo Name');
      if (!process.env.REVERSE_ONLY) {
        await expect(page.locator('body')).toContainText(
          'Place has no keywords'
        );
      }
      await expect(page.locator('body')).toContainText(
        'Place is not parent of other places'
      );
    });
  });
});
