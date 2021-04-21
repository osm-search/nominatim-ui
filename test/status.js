const assert = require('assert');

describe('Status Page', function () {
  let page;

  before(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/status.html');
  });

  after(async function () {
    await page.close();
  });

  it('should have software version', async function () {
    // waits for fetching status details
    await page.waitForFunction(
      'document.querySelector(".col-sm-12 dl dd:nth-child(4)").textContent !== "undefined"'
    );
    let status_name = await page.$$eval('.col-sm-12 dl dt', elements => elements[1].textContent);
    let version = await page.$$eval('.col-sm-12 dl dd', elements => elements[1].textContent);

    assert.deepStrictEqual(status_name, 'Software version');
    assert.ok(version !== 'undefined' && version.length > 1);
  });
});
