const assert = require('assert');

describe('About Page', function () {
  let page;

  before(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/about.html');
  });

  after(async function () {
    await page.close();
  });

  it('should contain Nominatim description', async function () {
    await page.waitForSelector('#about-help');
    let description = await page.$eval('#about-help', el => el.textContent);

    assert.ok(description.includes('Nominatim is a search engine'));
  });
});
