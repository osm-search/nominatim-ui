const assert = require('assert');

describe('Details Page', function () {
  let page;

  describe('No search', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/details.html');
    });

    after(async function () {
      await page.close();
    });

    it('should have a HTML page title', async function () {
      assert.equal(await page.title(), 'Nominatim Demo');
    });
  });

  describe('With search', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/details.html');
      await page.type('input[type=edit]', 'W5013364');
      await page.click('button[type=submit]');
      await page.waitForSelector('.container .row');
    });

    after(async function () {
      await page.close();
    });

    it('should have header title as Eiffel Tower', async function () {
      let page_header = await page.$eval('.container h1', el => el.textContent);

      assert.ok(page_header.includes('Eiffel Tower'));
    });

    it('should have link to https://www.openstreetmap.org/way/5013364', async function () {

      assert.strictEqual((await page.$$('a[href="https://www.openstreetmap.org/way/5013364"]')).length, 1);
    });

    it('should change page url and add new header on clicking display keywords', async function () {
      let current_url;
      let display_headers;
      let [display_keywords_btn] = await page.$x("//a[contains(text(), 'display keywords')]");

      await display_keywords_btn.click();
      await page.waitForNavigation();

      current_url = new URL(await page.url());
      assert.strictEqual(current_url.searchParams.get('keywords'), '1');

      await page.waitForSelector('h3');
      display_headers = await page.$$eval('h3', elements => elements.map(el => el.textContent));
      assert.deepStrictEqual(display_headers, ['Name Keywords', 'Address Keywords']);
    });

    it('should change page url on clicking display child places', async function () {
      let current_url;
      let [child_places_btn] = await page.$x("//a[contains(text(), 'display child places')]");

      await child_places_btn.click();
      await page.waitForNavigation();

      current_url = new URL(await page.url());
      assert.strictEqual(current_url.searchParams.get('hierarchy'), '1');
    });
  });
});
