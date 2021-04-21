const assert = require('assert');

describe('Browser behaviour', function () {

  it('should have a user-agent', async function () {
    let user_agent = await browser.userAgent();
    assert.strictEqual(user_agent,
      'Nominatim UI test suite Mozilla/5.0 Gecko/20100101 HeadlessChrome/90.0');
  });
});
