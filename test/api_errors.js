const assert = require('assert');

describe('Nominatim API errors', function () {
  let page;

  describe('HTTP 503 - service unavailable', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/search.html?q=london&httpbin_status=503');
    });

    after(async function () {
      await page.close();
    });

    it('should display an error', async function () {
      await page.waitForSelector('#error');

      let message = await page.$eval('#error', el => el.textContent);
      assert.ok(message.includes('httpbin.org'));
      assert.ok(message.includes('Error fetching data from'));
    });
  });

  describe('HTTP 200 - JSON parsing fails', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/search.html?q=london&httpbin_status=200');
    });

    after(async function () {
      await page.close();
    });

    it('should display an error', async function () {
      await page.waitForSelector('#error');

      let message = await page.$eval('#error', el => el.textContent);
      assert.ok(message.includes('httpbin.org'));
      assert.ok(message.includes('Error parsing JSON data from'));
    });
  });
});
