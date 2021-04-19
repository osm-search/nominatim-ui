const assert = require('assert');

describe('Search Page', function () {
  let page;

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
  });

  describe('Search for City of London', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/search.html');
      await page.type('input[name=q]', 'City of London');
      await page.click('button[type=submit]');
      await page.waitForSelector('#searchresults');
      // await page.screenshot({ path: "./screen.png", fullPage: true });
    });

    after(async function () {
      await page.close();
    });

    it('should have a HTML page title', async function () {
      assert.equal(await page.title(), 'Result for City of London | Nominatim Demo');
    });

    it('should display a map', async function () {
      await page.waitForSelector('#map');
      assert.equal((await page.$$('#map')).length, 1);
    });
  });
});
