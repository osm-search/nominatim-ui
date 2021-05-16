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

  describe('With search - no place found', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/details.html');
      await page.type('input[type=edit]', 'n3');
      await page.click('button[type=submit]');
      await page.waitForSelector('#api-request');
    });


    it('should display error', async function () {
      let page_content = await page.$eval('body', el => el.textContent);

      assert.ok(page_content.includes('No place with that OSM ID found'));
    });

    after(async function () {
      await page.close();
    });
  });

  describe('With search - Eiffel Tower', function () {
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

    it('should have case-insenstive input and can navigate to other details', async function () {
      let input_field = await page.$('input[type=edit]');
      await input_field.click({ clickCount: 3 });
      await input_field.type('w375257537');
      await page.click('button[type=submit]');

      await page.waitForSelector('a[href="https://www.openstreetmap.org/way/375257537"]');
      assert.ok((await page.$eval('.container h1', el => el.textContent)).includes('Taj Mahal'));
    });
  });

  describe('Place without name, keywords, hierarchy', function () {
    // e.g. a numeric house number
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/details.html?osmtype=N&osmid=946563004&keywords=1&hierarchy=1');
      await page.waitForSelector('.container .row');
    });

    after(async function () {
      await page.close();
    });

    it('should display No Name, no keywords, no hierarchy', async function () {
      let page_content = await page.$eval('body', el => el.textContent);

      assert.ok(page_content.includes('Name No Name'));
      assert.ok(page_content.includes('Place has no keywords'));
      assert.ok(page_content.includes('Place is not parent of other places'));
    });
  });
});
