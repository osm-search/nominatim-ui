import assert from 'assert';

describe('Search Page', function () {
  let page;

  // eslint-disable-next-line mocha/no-setup-in-describe
  if (process.env.REVERSE_ONLY) return;

  describe('No search', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/search.html');
    });

    after(async function () {
      await page.close();
    });

    it('should have a HTML page title', async function () {
      assert.equal(await page.title(), 'Nominatim Demo');
    });

    it('should have a welcome message', async function () {
      let welcome_message = await page.$eval('#welcome h2', el => el.textContent);
      assert.deepStrictEqual(welcome_message, 'Welcome to Nominatim');
    });

    it('should have a last_updated_: ... ago data', async function () {
      await page.waitForSelector('abbr[id="data-date"]');

      let last_updated = await page.$eval('abbr[id="data-date"]', el => el.textContent);
      assert.ok(last_updated.includes('ago'));
    });

    it('should show map bounds buttons', async function () {
      await page.waitForSelector('#map');
      let show_map_pos_handle = await page.$('#show-map-position');
      let map_pos_handle = await page.$('#map-position');

      await show_map_pos_handle.click();
      assert.strictEqual(await map_pos_handle.evaluate(node => node.style.display), 'block');

      let map_pos_details = await page.$eval('#map-position-inner', el => el.textContent);
      map_pos_details = map_pos_details.split('  ');
      // [
      //   'map center: 20.00000,0.00000 view on osm.org',
      //   'map zoom: 2',
      //   'viewbox: -131.48438,69.16256,131.48438,-48.69096',
      //   'last click:',
      //   ' mouse position: 65.69612,103.71094'
      // ]
      let map_center_coords = map_pos_details[0]
        .split('map center: ')[1].split(' view')[0].split(',');
      let map_zoom = map_pos_details[1].split('map zoom: ')[1];
      let map_viewbox = map_pos_details[2].split('viewbox: ')[1].split(',');
      let last_click = map_pos_details[3].split('last click: ')[1];

      assert.deepStrictEqual(map_center_coords.length, 2);
      assert.ok(map_zoom);
      assert.deepStrictEqual(map_viewbox.length, 4);
      assert.deepStrictEqual(last_click, undefined);

      await page.click('#map-position-close a');
      assert.strictEqual(await map_pos_handle.evaluate(node => node.style.display), 'none');
    });
  });

  describe('Search for Paris', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/search.html');
      await page.type('input[name=q]', 'Paris');
      await page.click('button[type=submit]');
      await page.waitForSelector('#searchresults');
      // await page.screenshot({ path: "./screen.png", fullPage: true });
    });

    after(async function () {
      await page.close();
    });

    it('should have a HTML page title', async function () {
      assert.equal(await page.title(), 'Result for Paris | Nominatim Demo');
    });

    it('should have added search params', async function () {
      let current_url = new URL(await page.url());
      assert.strictEqual(current_url.searchParams.get('q'), 'Paris');
    });

    it('should have at least one result', async function () {
      let results_count = await page.$$eval('#searchresults .result', elements => elements.length);
      assert.ok(results_count > 1);
    });

    it('should have show more results button', async function () {
      let [search_more_btn] = await page.$$(
        "xpath/.//a[contains(text(), 'Search for more results')]"
      );
      assert.ok(search_more_btn);
    });

    it('should display the API request and debug URL', async function () {
      let link_titles = await page.$$eval('#api-request a', links => links.map(l => l.innerHTML));
      assert.deepEqual(link_titles, ['API request', 'debug output']);
    });

    it('should not have polygon params in API request and debug URL', async function () {
      let links_href = await page.$$eval('#api-request a', links => links.map(l => l.href));
      let api_request_url = new URL(links_href[0]);
      let debug_url = new URL(links_href[1]);

      assert.deepStrictEqual(api_request_url.searchParams.has('polygon_geojson'), false);
      assert.deepStrictEqual(debug_url.searchParams.has('polygon_geojson'), false);
    });

    it('should display a map', async function () {
      await page.waitForSelector('#map');
      assert.equal((await page.$$('#map')).length, 1);
    });

    it('should default to dedupe=1', async function () {
      const checkbox_checked = await page.$eval('#option_dedupe', el => el.checked);
      assert.equal(checkbox_checked, true);

      const links_href = await page.$$eval('#api-request a', links => links.map(l => l.href));
      let api_request_url = new URL(links_href[0]);
      let debug_url = new URL(links_href[1]);

      assert.deepStrictEqual(api_request_url.searchParams.has('dedupe'), false);
      assert.deepStrictEqual(debug_url.searchParams.has('dedupe'), false);
    });

    it('should have polygon and marker in map and minimap', async function () {
      assert.strictEqual((await page.$$('#map .leaflet-overlay-pane path')).length, 4);
    });

    it('should redirect to details page on clicking details button', async function () {
      let current_url;
      let page_header;
      let results = await page.$$('#searchresults .result a');

      await results[0].click();
      await page.waitForSelector('table#address');

      current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/details.html');

      await page.waitForSelector('.container h1');
      page_header = await page.$eval('.container h1', el => el.textContent);
      assert.ok(page_header.includes('Paris'));
    });
  });

  describe('Structured search for Paris', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/search.html');
      await page.click(".nav-link[href='#structured']");
      // await page.screenshot({ path: "./screen.png", fullPage: true });
      await page.type('input[name=city]', 'Paris');
      await page.type('input[name=country]', 'USA');
      await page.click('#structured button[type=submit]');
      await page.waitForSelector('#searchresults');
    });

    after(async function () {
      await page.close();
    });

    it('should have a HTML page title', async function () {
      assert.equal(await page.title(), 'Result for Paris, USA | Nominatim Demo');
    });

    it('should have added search params', async function () {
      let current_url = new URL(await page.url());
      assert.strictEqual(current_url.searchParams.get('q'), null);
      assert.strictEqual(current_url.searchParams.get('city'), 'Paris');
      assert.strictEqual(current_url.searchParams.get('country'), 'USA');
    });

    it('should have at least one result', async function () {
      let results_count = await page.$$eval('#searchresults .result', elements => elements.length);
      assert.ok(results_count > 1);
    });
  });

  describe('Search for OSM URL', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/search.html');
      await page.type('input[name=q]', 'https://www.openstreetmap.org/relation/3459013#map=11/41.2388/-8.3867');
      await page.click('button[type=submit]');
      await page.waitForSelector('table#address');
    });

    after(async function () {
      await page.close();
    });

    it('should redirect to detail page search', async function () {
      assert.equal(await page.title(), 'Details for R3459013 | Nominatim Demo');
      assert.ok((await page.$eval('.container h1', el => el.textContent)).includes('Porto'));
    });
  });
});
