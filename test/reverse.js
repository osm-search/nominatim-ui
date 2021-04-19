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
});
