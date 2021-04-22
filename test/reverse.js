const assert = require('assert');

describe('Reverse Page', function () {
  let page;

  describe('No search', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/reverse.html');
    });

    after(async function () {
      await page.close();
    });

    it('should allow switching coordinates', async function () {
      let lat_handle = await page.$('input[name=lat]');
      let lon_handle = await page.$('input[name=lon]');

      assert.equal(await lat_handle.evaluate(node => node.value), '');
      assert.equal(await lon_handle.evaluate(node => node.value), '');

      await page.click('#switch-coords');
      // no change
      assert.equal(await lat_handle.evaluate(node => node.value), '');
      assert.equal(await lon_handle.evaluate(node => node.value), '');

      await page.type('input[name=lat]', '5');
      await page.type('input[name=lon]', '10');
      await page.click('#switch-coords');
      // switched
      assert.equal(await lat_handle.evaluate(node => node.value), 10);
      assert.equal(await lon_handle.evaluate(node => node.value), 5);
    });
  });

  describe('With search', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/reverse.html');
      await page.type('input[name=lat]', '27.1750090510034');
      await page.type('input[name=lon]', '78.04209025');
      await page.click('button[type=submit]');
      await page.waitForSelector('#searchresults');
    });

    after(async function () {
      await page.close();
    });

    it('should return single result', async function () {
      let results_count = await page.$$eval('#searchresults .result', elements => elements.length);

      assert.deepStrictEqual(results_count, 1);
    });

    it('should display a map', async function () {
      await page.waitForSelector('#map');
      assert.equal((await page.$$('#map')).length, 1);
    });

    it('should redirect to details page on clicking details button', async function () {
      let current_url;
      let results = await page.$$('#searchresults .result a');

      await results[0].click();
      await page.waitForNavigation();

      current_url = new URL(await page.url());

      assert.deepStrictEqual(current_url.pathname, '/details.html');
    });
  });
});
