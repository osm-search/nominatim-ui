import { test, expect } from './shared.js';

test.describe('Search Page', () => {
  test.skip(() => !!process.env.REVERSE_ONLY, 'Skipped in reverse-only mode');

  test.describe('No search', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/search.html');
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should have a HTML page title', async () => {
      expect(await page.title()).toBe('Nominatim Demo');
    });

    test('should have a welcome message', async () => {
      await expect(page.locator('#welcome h2')).toHaveText(
        'Welcome to Nominatim'
      );
    });

    test('should have a last_updated_: ... ago data', async () => {
      await page.waitForFunction(
        () => {
          const el = document.querySelector('abbr[id="data-date"]');
          return el && el.textContent.includes('ago');
        },
        { timeout: 10000 }
      );
    });

    test('should show map bounds buttons', async () => {
      await page.locator('#map').waitFor();
      await expect(page.locator('#map-position-inner')).toHaveCount(0);

      await page.locator('#show-map-position').click();

      let map_pos_details = await page.locator(
        '#map-position-inner'
      ).textContent();
      map_pos_details = map_pos_details.split('  ');

      const map_center_coords = map_pos_details[0]
        .split('map center: ')[1].split(' view')[0].split(',');
      const map_zoom = map_pos_details[1].split('map zoom: ')[1];
      const map_viewbox = map_pos_details[2]
        .split('viewbox: ')[1].split(',');
      const last_click = map_pos_details[3].split('last click: ')[1];

      expect(map_center_coords.length).toBe(2);
      expect(map_zoom).toBeTruthy();
      expect(map_viewbox.length).toBe(4);
      expect(last_click).toBe('-');

      await page.locator('#map-position-close a').click();
      await expect(page.locator('#map-position-inner')).toHaveCount(0);
      await expect(page.locator('#show-map-position')).toBeVisible();
    });
  });

  test.describe('Search for Paris', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/search.html');
      await page.locator('input[name=q]').fill('Paris');
      await page.locator('button[type=submit]').first().click();
      await page.locator('#searchresults').waitFor();
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should have a HTML page title', async () => {
      expect(await page.title()).toBe('Result for Paris | Nominatim Demo');
    });

    test('should have added search params', async () => {
      const current_url = new URL(page.url());
      expect(current_url.searchParams.get('q')).toBe('Paris');
    });

    test('should have at least one result', async () => {
      const results_count = await page.locator(
        '#searchresults .result'
      ).count();
      expect(results_count).toBeGreaterThan(1);
    });

    test('should have show more results button', async () => {
      await expect(
        page.locator('a', { hasText: 'Search for more results' })
      ).toBeVisible();
    });

    test('should display the API request and debug URL', async () => {
      const link_titles = await page.locator(
        '#api-request a'
      ).evaluateAll(links => links.map(l => l.innerHTML));
      expect(link_titles).toEqual(['API request', 'debug output']);
    });

    test('should not have polygon params in API request and debug URL',
      async () => {
        const links_href = await page.locator(
          '#api-request a'
        ).evaluateAll(links => links.map(l => l.href));
        const api_request_url = new URL(links_href[0]);
        const debug_url = new URL(links_href[1]);

        expect(api_request_url.searchParams.has('polygon_geojson')).toBe(
          false
        );
        expect(debug_url.searchParams.has('polygon_geojson')).toBe(false);
      }
    );

    test('should display a map', async () => {
      await expect(page.locator('#map')).toHaveCount(1);
    });

    test('should default to dedupe=1', async () => {
      expect(
        await page.locator('#option_dedupe').isChecked()
      ).toBe(true);

      const links_href = await page.locator(
        '#api-request a'
      ).evaluateAll(links => links.map(l => l.href));
      const api_request_url = new URL(links_href[0]);
      const debug_url = new URL(links_href[1]);

      expect(api_request_url.searchParams.has('dedupe')).toBe(false);
      expect(debug_url.searchParams.has('dedupe')).toBe(false);
    });

    test('should have polygon and marker in map and minimap', async () => {
      await expect(
        page.locator('#map .leaflet-overlay-pane path')
      ).toHaveCount(4);
    });

    test('should redirect to details page on clicking details button',
      async () => {
        await page.locator('#searchresults .result a').first().click();
        await page.locator('table#address').waitFor();

        const current_url = new URL(page.url());
        expect(current_url.pathname).toBe('/details.html');

        await expect(page.locator('.container h1')).toContainText('Paris');
      }
    );
  });

  test.describe('Structured search for Paris', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/search.html');
      await page.locator(".nav-link[href='#structured']").click();
      await page.locator('input[name=city]').fill('Paris');
      await page.locator('input[name=country]').fill('USA');
      await page.locator('#structured button[type=submit]').click();
      await page.locator('#searchresults').waitFor();
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should have a HTML page title', async () => {
      expect(await page.title()).toBe(
        'Result for Paris, USA | Nominatim Demo'
      );
    });

    test('should have added search params', async () => {
      const current_url = new URL(page.url());
      expect(current_url.searchParams.get('q')).toBeNull();
      expect(current_url.searchParams.get('city')).toBe('Paris');
      expect(current_url.searchParams.get('country')).toBe('USA');
    });

    test('should have at least one result', async () => {
      const results_count = await page.locator(
        '#searchresults .result'
      ).count();
      expect(results_count).toBeGreaterThan(1);
    });
  });

  test.describe('Search for OSM URL', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('/search.html');
      await page.locator('input[name=q]').fill(
        'https://www.openstreetmap.org/relation/3459013#map=11/41.2388/-8.3867'
      );
      await page.locator('button[type=submit]').first().click();
      await page.locator('table#address').waitFor();
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('should redirect to detail page search', async () => {
      expect(await page.title()).toBe(
        'Details for R3459013 | Nominatim Demo'
      );
      await expect(page.locator('.container h1')).toContainText('Porto');
    });
  });
});
