const assert = require('assert');
const helpers = require('../../src/lib/helpers');

describe('Helpers', function () {

  it('.formatLabel', function () {
    // not enough data
    assert.equal(helpers.formatLabel({}), '');

    // if label set, that becomes the label
    assert.equal(helpers.formatLabel({ label: 'A Label' }), 'A Label');

    // type, but nicely formatted
    assert.equal(helpers.formatLabel({ category: 'highway', type: 'bus_stop' }), 'Bus stop');

    // type=yes, so we use the category
    assert.equal(helpers.formatLabel({ category: 'building', type: 'yes' }), 'Building');
  });

  it('.wikipediaLink', function () {
    assert.equal(
      helpers.wikipediaLink({}),
      ''
    );

    assert.equal(
      helpers.wikipediaLink({ calculated_wikipedia: 'de:Brandenburg Gate' }),
      '<a href="https://de.wikipedia.org/wiki/Brandenburg Gate" target="_blank">de:Brandenburg Gate</a>'
    );

    // title includes HTML
    assert.equal(
      helpers.wikipediaLink({ calculated_wikipedia: 'en:Slug & Lattuce' }),
      '<a href="https://en.wikipedia.org/wiki/Slug &amp; Lattuce" target="_blank">en:Slug &amp; Lattuce</a>'
    );
  });
});
