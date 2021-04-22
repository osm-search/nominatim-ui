const assert = require('assert');

describe('Status Page', function () {
  let page;

  before(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/status.html', { waitUntil: 'networkidle0' });
  });

  after(async function () {
    await page.close();
  });

  it('should have software version', async function () {
    let status_details = await page.$eval('body',
      el => el.textContent.match(/Software version.*\d+\.\d+/));

    assert.ok(!status_details[0].includes('undefined'));
  });
});
