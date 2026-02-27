import assert from 'assert';

const reverse_only = !!process.env.REVERSE_ONLY;

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
      await page.type('input[type=edit]', 'N6');
      await page.click('button[type=submit]');
      await page.waitForSelector('#api-request');
    });


    it('should display error', async function () {
      const page_content = await page.$eval('body', el => el.textContent);

      assert.ok(page_content.includes('No place with that OSM ID found'));
    });

    after(async function () {
      await page.close();
    });
  });

  describe('With search - Vaduz (Liechtenstein)', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/details.html');
      await page.type('input[type=edit]', 'R1155956');
      await page.click('button[type=submit]');
      await page.waitForSelector('table#address');
    });

    after(async function () {
      await page.close();
    });

    it('should have header title', async function () {
      const page_header = await page.$eval('.container h1', el => el.textContent);

      assert.ok(page_header.includes('Vaduz'));
    });

    it('should have OSM link', async function () {
      const url = 'https://www.openstreetmap.org/relation/1155956';

      assert.strictEqual((await page.$$eval(`a[href="${url}"]`, (links) => links.length)), 2);
    });

    // Reverse-only installation have no search index, therefore no keywords
    if (!reverse_only) {

      it('should have a link to postcode which includes country code', async function () {
        const url = 'search.html?postalcode=9490&country=li';

        assert.strictEqual((await page.$$eval(`a[href="${url}"]`, (links) => links.length)), 1);
      });

      it('should change url and add new header on clicking display keywords', async function () {
        const [display_keywords_btn] = await page.$$(
          "xpath/.//a[contains(text(), 'display keywords')]"
        );

        await display_keywords_btn.evaluate(node => node.click());
        await page.waitForNavigation();

        const current_url = new URL(await page.url());
        assert.strictEqual(current_url.searchParams.get('keywords'), '1');

        await page.waitForSelector('h3');
        const display_headers = await page.$$eval(
          'h3', elements => elements.map(el => el.textContent)
        );
        assert.deepStrictEqual(display_headers, ['Name Keywords', 'Address Keywords']);

        const page_content = await page.$eval('body', el => el.textContent);
        assert.ok(page_content.includes('vadouz')); // one of the name keywords
      });
    }


    it('should support case-insensitive search, can navigate to new page', async function () {
      const input_field = await page.$('input[type=edit]');
      await input_field.click({ clickCount: 3 });
      await input_field.type('w375257537');
      await page.click('button[type=submit]');

      await page.waitForSelector('a[href="https://www.openstreetmap.org/way/375257537"]');
      assert.ok((await page.$eval('.container h1', el => el.textContent)).includes('Taj Mahal'));
    });
  });

  describe('With street search - a place that is parent of buildings', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/details.html?osmtype=W&osmid=32703083');
      await page.waitForSelector('.container .row');
    });

    after(async function () {
      await page.close();
    });

    it('should change page url on clicking display child places', async function () {
      let page_content = await page.$eval('body', el => el.textContent);
      assert.ok(page_content.includes('Gafleistrasse'));

      const [child_places_btn] = await page.$$(
        "xpath/.//a[contains(text(), 'display child places')]"
      );

      await child_places_btn.evaluate(node => node.click());
      await page.waitForNavigation();
      await page.waitForSelector('table#address');

      const current_url = new URL(await page.url());
      assert.strictEqual(current_url.searchParams.get('hierarchy'), '1');

      page_content = await page.$eval('body', el => el.textContent);
      assert.ok(page_content.includes('bus_stop')); // parent of several bus stops
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
      const page_content = await page.$eval('body', el => el.textContent);

      assert.ok(page_content.includes('NameNo Name'));
      if (!process.env.REVERSE_ONLY) {
        assert.ok(page_content.includes('Place has no keywords'));
      }
      assert.ok(page_content.includes('Place is not parent of other places'));
    });
  });
});
