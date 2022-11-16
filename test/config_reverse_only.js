import assert from 'assert';

describe('Reverse Only', function () {
  let page;

  // eslint-disable-next-line mocha/no-setup-in-describe
  if (!process.env.REVERSE_ONLY) return;

  describe('Redirect default pages', function () {
    before(async function () {
      page = await browser.newPage();
      await page.goto('http://localhost:9999/search.html');
    });

    after(async function () {
      await page.close();
    });

    it('should redirect to /reverse', async function () {
      // await page.waitForSelector('footer');

      let current_url = new URL(await page.url());
      assert.deepStrictEqual(current_url.pathname, '/reverse.html');
    });

    it('no navigation link', async function () {
      let nav_item = await page.$('nav ul li a[href="search.html"]');
      assert.equal(nav_item, null);
    });
  });
});
