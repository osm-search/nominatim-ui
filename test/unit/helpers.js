import assert from 'assert';
import { formatLabel, wikipediaLink } from '../../src/lib/helpers.js';

describe('Helpers', function () {

  it('.formatLabel', function () {
    // not enough data
    assert.equal(formatLabel({}), '');

    // if label set, that becomes the label
    assert.equal(formatLabel({ label: 'A Label' }), 'A Label');

    // type, but nicely formatted
    assert.equal(formatLabel({ category: 'highway', type: 'bus_stop' }), 'Bus stop');

    // type=yes, so we use the category
    assert.equal(formatLabel({ category: 'building', type: 'yes' }), 'Building');
  });

  it('.wikipediaLink', function () {
    assert.equal(
      wikipediaLink({}),
      ''
    );

    assert.equal(
      wikipediaLink({ calculated_wikipedia: 'de:Brandenburg Gate' }),
      '<a href="https://de.wikipedia.org/wiki/Brandenburg Gate" target="_blank">de:Brandenburg Gate</a>'
    );

    // title includes HTML
    assert.equal(
      wikipediaLink({ calculated_wikipedia: 'en:Slug & Lattuce' }),
      '<a href="https://en.wikipedia.org/wiki/Slug &amp; Lattuce" target="_blank">en:Slug &amp; Lattuce</a>'
    );
  });
});
